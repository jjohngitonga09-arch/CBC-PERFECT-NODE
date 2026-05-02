const express = require('express');
const router  = express.Router();
const { query } = require('../config/db');
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { kickUser, kickRole, notifyRole, getOnlineCount } = require('../websocket/socket');

query('ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ').catch(() => {});

const auth  = [authenticate, authorizeRoles('admin')];
const logIt = (action, adminId) =>
  query("INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)", [action, adminId]).catch(() => {});

router.get('/users', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,status,suspended_until,created_at FROM users WHERE status!='bin' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/online', ...auth, (req, res) => {
  res.json({ count: getOnlineCount() });
});

router.put('/users/:id/lock', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='locked' WHERE id=$1", [id]);
    kickUser(id, 'account_locked');
    await logIt(`Locked user ${id}`, req.user?.id);
    res.json({ message: 'Locked' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/unlock', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active', failed_login_attempts=0 WHERE id=$1", [id]);
    await logIt(`Unlocked user ${id}`, req.user?.id);
    res.json({ message: 'Unlocked' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/suspend', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    const days = Number(req.body.days) || 1;
    const until = new Date(Date.now() + days * 86400000);
    await query("UPDATE users SET status='suspended', suspended_until=$1 WHERE id=$2", [until, id]);
    kickUser(id, 'account_suspended');
    await logIt(`Suspended user ${id} for ${days}d`, req.user?.id);
    res.json({ message: `Suspended for ${days} days`, until });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/unsuspend', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active', suspended_until=NULL WHERE id=$1", [id]);
    await logIt(`Unsuspended user ${id}`, req.user?.id);
    res.json({ message: 'Unsuspended' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/bin', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='bin' WHERE id=$1", [id]);
    kickUser(id, 'account_deleted');
    await logIt(`Moved user ${id} to bin`, req.user?.id);
    res.json({ message: 'Moved to bin' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/bin', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,role,created_at FROM users WHERE status='bin' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/bin/:id/restore', ...auth, async (req, res) => {
  try {
    await query("UPDATE users SET status='active' WHERE id=$1 AND status='bin'", [req.params.id]);
    await logIt(`Restored user ${req.params.id} from bin`, req.user?.id);
    res.json({ message: 'Restored' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/bin/:id', ...auth, async (req, res) => {
  try {
    await query("DELETE FROM users WHERE id=$1 AND status='bin'", [req.params.id]);
    await logIt(`Permanently deleted user ${req.params.id}`, req.user?.id);
    res.json({ message: 'Permanently deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ROLE DASHBOARD LOCK */
router.put('/roles/:role/lock', ...auth, async (req, res) => {
  try {
    const { role } = req.params;
    const exempt = req.body.exempt || [];
    await query(
      "INSERT INTO system_settings(key,value) VALUES($1,'true') ON CONFLICT(key) DO UPDATE SET value='true'",
      [`dashboard_locked_${role}`]
    );
    await query(
      "INSERT INTO system_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2",
      [`dashboard_lock_exempt_${role}`, JSON.stringify(exempt)]
    );
    // Lock all individual users of this role
    await query(
      "UPDATE users SET status='locked' WHERE role=$1 AND status='active'",
      [role]
    );
    notifyRole(role, 'force:logout', { reason: 'dashboard_locked' });
    await logIt(`Locked ${role} dashboard`, req.user?.id);
    res.json({ message: `${role} dashboard locked` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/roles/:role/unlock', ...auth, async (req, res) => {
  try {
    const { role } = req.params;
    await query(
      "INSERT INTO system_settings(key,value) VALUES($1,'false') ON CONFLICT(key) DO UPDATE SET value='false'",
      [`dashboard_locked_${role}`]
    );
    // Unlock all individually locked users of this role
    await query(
      "UPDATE users SET status='active' WHERE role=$1 AND status='locked'",
      [role]
    );
    notifyRole(role, 'dashboard:unlocked', {});
    await logIt(`Unlocked ${role} dashboard`, req.user?.id);
    res.json({ message: `${role} dashboard unlocked` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/settings', ...auth, async (req, res) => {
  try {
    const { rows } = await query('SELECT key,value FROM system_settings');
    const out = {};
    for (const r of rows) {
      if (r.value === 'true') out[r.key] = true;
      else if (r.value === 'false') out[r.key] = false;
      else if (!isNaN(r.value) && r.value !== '') out[r.key] = Number(r.value);
      else { try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; } }
    }
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/settings', ...auth, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        "INSERT INTO system_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2",
        [key, typeof value === 'object' ? JSON.stringify(value) : String(value)]
      );
    }
    res.json({ message: 'Settings saved.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


router.get('/alerts', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT action, COUNT(*) AS count, MAX(timestamp) AS last_seen
         FROM system_logs
        WHERE action IN ('failed_login','account_locked','suspicious_activity','login_blocked')
          AND COALESCE(timestamp, created_at) > NOW() - INTERVAL '24 hours'
        GROUP BY action
        ORDER BY count DESC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
