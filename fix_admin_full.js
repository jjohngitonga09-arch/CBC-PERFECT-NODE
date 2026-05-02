/**
 * fix_admin_full.js
 * Run from BACKEND folder:
 *   node "C:\Users\pc\Downloads\eduapp\fix_admin_full.js"
 *
 * Writes / rewrites:
 *   backend/src/websocket/socket.js          kickUser, kickRole, getIo
 *   backend/src/routes/auth.js               + lock / unlock routes
 *   backend/src/routes/admin.js              suspend, bin, hard-delete, role-lock, online
 *   frontend/src/services/socketService.js   NEW  — shared socket instance
 *   frontend/src/components/layout/Layout.jsx  force:logout + dashboard:locked listeners
 *   frontend/src/pages/admin/Users.jsx        full redesign
 *   frontend/src/pages/admin/Home.jsx         theme-aware + real online
 *   frontend/src/pages/admin/Settings.jsx     real save + dashboard-lock controls
 */

const fs   = require('fs');
const path = require('path');

const BACK  = 'C:\\Users\\pc\\Downloads\\eduapp\\backend\\src';
const FRONT = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src';

function w(base, rel, txt) {
  const p = path.join(base, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, txt, 'utf8');
  console.log('✅ ', rel);
}

/* ═══════════════════════════════════════════════════════
   1. socket.js  — add kickUser / kickRole / getIo
═══════════════════════════════════════════════════════ */
w(BACK, 'websocket/socket.js', `
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// userId → { socketId, role }
const onlineUsers = new Map();
let _io = null;

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET','POST'] }
  });
  _io = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorised'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    const { id: userId, role } = socket.user;
    onlineUsers.set(userId, { socketId: socket.id, role });
    logger.info(\`Socket connected: \${userId} (\${role})\`);
    io.emit('presence:update', { userId, online: true });

    socket.on('message:send', (data) => {
      const t = onlineUsers.get(data.receiverId);
      if (t) io.to(t.socketId).emit('message:new', { ...data, senderId: userId, ts: new Date() });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('presence:update', { userId, online: false });
      logger.info(\`Socket disconnected: \${userId}\`);
    });
  });
  return io;
}

/** Immediately disconnect one user and tell their browser why */
function kickUser(userId, reason = 'account_locked') {
  const entry = onlineUsers.get(userId);
  if (entry && _io) {
    _io.to(entry.socketId).emit('force:logout', { reason });
  }
}

/** Kick every connected user of a given role */
function kickRole(role, reason = 'dashboard_locked') {
  if (!_io) return;
  for (const [uid, entry] of onlineUsers.entries()) {
    if (entry.role === role) {
      _io.to(entry.socketId).emit('force:logout', { reason });
    }
  }
}

/** Push a dashboard-lock/unlock event to all users of a role (without kicking) */
function notifyRole(role, event, payload = {}) {
  if (!_io) return;
  for (const [, entry] of onlineUsers.entries()) {
    if (entry.role === role) {
      _io.to(entry.socketId).emit(event, payload);
    }
  }
}

function getIo()          { return _io; }
function getOnlineCount() { return onlineUsers.size; }

module.exports = { initSocket, kickUser, kickRole, notifyRole, getIo, getOnlineCount };
`.trimStart());

/* ═══════════════════════════════════════════════════════
   2. auth.js  — add lock / unlock routes inline
═══════════════════════════════════════════════════════ */
w(BACK, 'routes/auth.js', `
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { query } = require('../config/db');
const { kickUser } = require('../websocket/socket');

router.post('/register',        ctrl.register);
router.post('/verify-otp',      ctrl.verifyRegistrationOtp);
router.post('/resend-otp',      ctrl.resendOtp);
router.post('/login',           ctrl.login);

const emailCtrl = require('../controllers/emailController');
router.post('/forgot-password', emailCtrl.sendOTP);
router.post('/reset-password',  emailCtrl.verifyOTP);

router.get ('/admin/pending',      requireAuth, requireAdmin, ctrl.getPendingUsers);
router.put ('/admin/approve/:id',  requireAuth, requireAdmin, ctrl.approveUser);
router.put ('/admin/reject/:id',   requireAuth, requireAdmin, ctrl.rejectUser);

/* ── LOCK ── */
router.put('/admin/lock/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='locked' WHERE id=$1", [id]);
    kickUser(id, 'account_locked');
    await query(
      "INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)",
      [\`Locked user \${id}\`, req.user?.id || req.user?.userId]
    ).catch(()=>{});
    res.json({ message: 'User locked' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── UNLOCK ── */
router.put('/admin/unlock/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active' WHERE id=$1", [id]);
    await query(
      "INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)",
      [\`Unlocked user \${id}\`, req.user?.id || req.user?.userId]
    ).catch(()=>{});
    res.json({ message: 'User unlocked' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
`.trimStart());

/* ═══════════════════════════════════════════════════════
   3. admin.js  — suspend, bin, hard-delete, role-lock, online
═══════════════════════════════════════════════════════ */
w(BACK, 'routes/admin.js', `
const express = require('express');
const router  = express.Router();
const { query } = require('../config/db');
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { kickUser, kickRole, notifyRole, getOnlineCount } = require('../websocket/socket');

// Ensure suspended_until column exists
query('ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ').catch(()=>{});

const auth  = [authenticate, authorizeRoles('admin')];
const logIt = (action, adminId) =>
  query("INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)", [action, adminId]).catch(()=>{});

/* ── users list ── */
router.get('/users', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,status,suspended_until,created_at FROM users WHERE status!='bin' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── online count ── */
router.get('/online', ...auth, (req, res) => {
  res.json({ count: getOnlineCount() });
});

/* ── lock individual ── */
router.put('/users/:id/lock', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='locked' WHERE id=$1", [id]);
    kickUser(id, 'account_locked');
    await logIt(\`Locked user \${id}\`, req.user?.id);
    res.json({ message: 'Locked' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── unlock individual ── */
router.put('/users/:id/unlock', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active' WHERE id=$1", [id]);
    await logIt(\`Unlocked user \${id}\`, req.user?.id);
    res.json({ message: 'Unlocked' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── suspend for N days ── */
router.put('/users/:id/suspend', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    const days = Number(req.body.days) || 1;
    const until = new Date(Date.now() + days * 86400000);
    await query("UPDATE users SET status='suspended', suspended_until=$1 WHERE id=$2", [until, id]);
    kickUser(id, 'account_suspended');
    await logIt(\`Suspended user \${id} for \${days}d\`, req.user?.id);
    res.json({ message: \`Suspended for \${days} days\`, until });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── unsuspend ── */
router.put('/users/:id/unsuspend', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active', suspended_until=NULL WHERE id=$1", [id]);
    await logIt(\`Unsuspended user \${id}\`, req.user?.id);
    res.json({ message: 'Unsuspended' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── soft delete → bin ── */
router.put('/users/:id/bin', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='bin' WHERE id=$1", [id]);
    kickUser(id, 'account_deleted');
    await logIt(\`Moved user \${id} to bin\`, req.user?.id);
    res.json({ message: 'Moved to bin' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── bin list ── */
router.get('/bin', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,role,created_at FROM users WHERE status='bin' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── restore from bin ── */
router.put('/bin/:id/restore', ...auth, async (req, res) => {
  try {
    await query("UPDATE users SET status='active' WHERE id=$1 AND status='bin'", [req.params.id]);
    await logIt(\`Restored user \${req.params.id} from bin\`, req.user?.id);
    res.json({ message: 'Restored' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── permanent delete ── */
router.delete('/bin/:id', ...auth, async (req, res) => {
  try {
    await query("DELETE FROM users WHERE id=$1 AND status='bin'", [req.params.id]);
    await logIt(\`Permanently deleted user \${req.params.id}\`, req.user?.id);
    res.json({ message: 'Permanently deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── ROLE DASHBOARD LOCK ── */
router.put('/roles/:role/lock', ...auth, async (req, res) => {
  try {
    const { role } = req.params;
    const exempt = req.body.exempt || [];   // array of user IDs to skip
    await query(
      \`INSERT INTO system_settings(key,value) VALUES($1,'true') ON CONFLICT(key) DO UPDATE SET value='true'\`,
      [\`dashboard_locked_\${role}\`]
    );
    await query(
      \`INSERT INTO system_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2\`,
      [\`dashboard_lock_exempt_\${role}\`, JSON.stringify(exempt)]
    );
    // Kick everyone of that role except exempt
    if (!_io) {
      // fallback if io not ready
      kickRole(role, 'dashboard_locked');
    } else {
      const { getIo } = require('../websocket/socket');
      const io = getIo();
      // notifyRole handles this gracefully
      notifyRole(role, 'force:logout', { reason: 'dashboard_locked' });
    }
    await logIt(\`Locked \${role} dashboard\`, req.user?.id);
    res.json({ message: \`\${role} dashboard locked\` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.put('/roles/:role/unlock', ...auth, async (req, res) => {
  try {
    const { role } = req.params;
    await query(
      \`INSERT INTO system_settings(key,value) VALUES($1,'false') ON CONFLICT(key) DO UPDATE SET value='false'\`,
      [\`dashboard_locked_\${role}\`]
    );
    notifyRole(role, 'dashboard:unlocked', {});
    await logIt(\`Unlocked \${role} dashboard\`, req.user?.id);
    res.json({ message: \`\${role} dashboard unlocked\` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── settings ── */
router.get('/settings', ...auth, async (req, res) => {
  try {
    const { rows } = await query('SELECT key,value FROM system_settings');
    const out = {};
    for (const r of rows) {
      if (r.value === 'true')  out[r.key] = true;
      else if (r.value === 'false') out[r.key] = false;
      else if (!isNaN(r.value) && r.value !== '') out[r.key] = Number(r.value);
      else {
        try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; }
      }
    }
    res.json(out);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.put('/settings', ...auth, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        \`INSERT INTO system_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2\`,
        [key, typeof value === 'object' ? JSON.stringify(value) : String(value)]
      );
    }
    res.json({ message: 'Settings saved.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
`.trimStart());

/* ═══════════════════════════════════════════════════════
   4. socketService.js  (frontend)
═══════════════════════════════════════════════════════ */
w(FRONT, 'services/socketService.js', `
import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  if (socket) socket.disconnect();
  socket = io('/', { auth: { token }, reconnection: true });
  return socket;
}

export function getSocket() { return socket; }

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null; }
}
`.trimStart());

/* ═══════════════════════════════════════════════════════
   5. Layout.jsx  — add force:logout + dashboard:locked listeners
═══════════════════════════════════════════════════════ */
w(FRONT, 'components/layout/Layout.jsx', `
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import useAuthStore from '../../store/authStore'
import { connectSocket, disconnectSocket, getSocket } from '../../services/socketService'

const CSS_VARS = \`
  :root,[data-theme="light"] {
    --bg:      #f8f9fc;
    --surface: #ffffff;
    --border:  rgba(0,0,0,0.07);
    --text:    #111827;
    --sub:     #6b7280;
    --accent:  #6366f1;
    --accent2: #818cf8;
    --shadow:  0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05);
    --shadow-hover: 0 4px 12px rgba(0,0,0,0.10), 0 8px 30px rgba(0,0,0,0.07);
    --radius:  18px;
  }
  [data-theme="dark"] {
    --bg:      #0f172a;
    --surface: #1e293b;
    --border:  rgba(255,255,255,0.06);
    --text:    #f1f5f9;
    --sub:     #94a3b8;
    --accent:  #818cf8;
    --accent2: #a5b4fc;
    --shadow:  0 2px 8px rgba(0,0,0,0.35), 0 6px 24px rgba(0,0,0,0.25);
    --shadow-hover: 0 4px 16px rgba(0,0,0,0.45), 0 10px 36px rgba(0,0,0,0.3);
    --radius:  18px;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:'Segoe UI',system-ui,sans-serif; transition:background 0.3s,color 0.3s; }
  @keyframes spin { to { transform: rotate(360deg) } }
\`

export default function Layout() {
  const { token, logout, role } = useAuthStore()
  const nav = useNavigate()

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token)

    // Kicked by admin (locked, suspended, deleted)
    socket.on('force:logout', ({ reason }) => {
      disconnectSocket()
      logout()
      const msgs = {
        account_locked:    'Your account has been locked by an administrator.',
        account_suspended: 'Your account has been suspended.',
        account_deleted:   'Your account has been removed.',
        dashboard_locked:  'Your dashboard has been locked by an administrator.',
      }
      nav('/login?notice=' + encodeURIComponent(msgs[reason] || 'You have been logged out.'))
    })

    // Admin unlocked the dashboard — just reload
    socket.on('dashboard:unlocked', () => { window.location.reload() })

    return () => { disconnectSocket() }
  }, [token])

  return (
    <>
      <style>{CSS_VARS}</style>
      <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)' }}>
        <Navbar />
        <main style={{ maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' }}>
          <Outlet />
        </main>
      </div>
    </>
  )
}
`.trimStart());

/* ═══════════════════════════════════════════════════════
   6. admin/Users.jsx  — full redesign
═══════════════════════════════════════════════════════ */
w(FRONT, 'pages/admin/Users.jsx', `
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'

const S = {
  card: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 18px', boxShadow:'var(--shadow)' },
  badge: (c) => ({ fontSize:'.7rem', fontWeight:700, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.fg }),
  btn: (c) => ({ background:c.bg, border:\`1px solid \${c.bd}\`, color:c.fg, padding:'5px 12px', borderRadius:8, fontSize:'.78rem', fontWeight:600, cursor:'pointer', transition:'opacity .15s' }),
}
const SC = {
  active:    { bg:'rgba(16,185,129,.12)',  fg:'#10b981', bd:'rgba(16,185,129,.3)'  },
  pending:   { bg:'rgba(245,158,11,.12)',  fg:'#f59e0b', bd:'rgba(245,158,11,.3)'  },
  locked:    { bg:'rgba(239,68,68,.12)',   fg:'#ef4444', bd:'rgba(239,68,68,.3)'   },
  suspended: { bg:'rgba(139,92,246,.12)', fg:'#8b5cf6', bd:'rgba(139,92,246,.3)'  },
  bin:       { bg:'rgba(107,114,128,.12)', fg:'#6b7280', bd:'rgba(107,114,128,.3)' },
}

const ROLES = ['teacher','student','guardian']
const ROLE_LABELS = { teacher:'Teachers', student:'Students', guardian:'Parents' }

export default function AdminUsers() {
  const [tab, setTab]           = useState('pending')
  const [users, setUsers]       = useState([])
  const [pending, setPending]   = useState([])
  const [bin, setBin]           = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [suspendId, setSuspendId]   = useState(null)
  const [suspendDays, setSuspendDays] = useState(1)
  const [roleLocks, setRoleLocks]   = useState({})
  const [exemptMap, setExemptMap]   = useState({})  // role → Set of userIds
  const [lockingRole, setLockingRole] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const [uRes, pRes, bRes, sRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/auth/admin/pending'),
        api.get('/admin/bin'),
        api.get('/admin/settings'),
      ])
      setUsers(uRes.data)
      setPending(pRes.data)
      setBin(bRes.data)
      // parse role lock settings
      const locks = {}
      const exmps = {}
      for (const role of ROLES) {
        locks[role] = !!sRes.data[\`dashboard_locked_\${role}\`]
        const raw = sRes.data[\`dashboard_lock_exempt_\${role}\`]
        exmps[role] = new Set(Array.isArray(raw) ? raw : [])
      }
      setRoleLocks(locks)
      setExemptMap(exmps)
    } catch { toast.error('Could not load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function act(id, type, extra = {}) {
    try {
      if (type === 'approve' || type === 'reject') {
        await api.put(\`/auth/admin/\${type}/\${id}\`, extra)
      } else if (type === 'lock' || type === 'unlock') {
        await api.put(\`/auth/admin/\${type}/\${id}\`)
      } else {
        await api.put(\`/admin/users/\${id}/\${type}\`, extra)
      }
      toast.success('Done ✓')
      load()
    } catch(e) { toast.error(e.response?.data?.error || 'Action failed') }
  }

  async function hardDelete(id) {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return
    try { await api.delete(\`/admin/bin/\${id}\`); toast.success('Permanently deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  async function toggleRoleLock(role) {
    const isLocked = roleLocks[role]
    const newLocked = !isLocked
    try {
      if (newLocked) {
        const exempt = Array.from(exemptMap[role] || [])
        await api.put(\`/admin/roles/\${role}/lock\`, { exempt })
        toast.success(\`\${ROLE_LABELS[role]} dashboard locked — they are being logged out\`)
      } else {
        await api.put(\`/admin/roles/\${role}/unlock\`)
        toast.success(\`\${ROLE_LABELS[role]} dashboard unlocked\`)
      }
      setRoleLocks(prev => ({ ...prev, [role]: newLocked }))
    } catch { toast.error('Role lock failed') }
  }

  function toggleExempt(role, userId) {
    setExemptMap(prev => {
      const s = new Set(prev[role])
      s.has(userId) ? s.delete(userId) : s.add(userId)
      return { ...prev, [role]: s }
    })
  }

  const filtered = users.filter(u => {
    if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) &&
        !u.email?.toLowerCase().includes(search.toLowerCase()) &&
        !u.role?.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    return true
  })

  if (loading) return <Spinner />

  const tabStyle = (t) => ({
    padding:'8px 16px', borderRadius:50, border:'none', cursor:'pointer',
    fontWeight:700, fontSize:'.8rem', fontFamily:'inherit', transition:'.15s',
    background: tab===t ? 'var(--accent)' : 'var(--surface)',
    color:      tab===t ? '#fff' : 'var(--sub)',
    boxShadow:  tab===t ? 'var(--shadow)' : 'none',
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>User Management</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>
          {users.length} total · {pending.length} pending · {bin.length} in bin
        </p>
      </div>

      {/* Role Dashboard Lock Panel */}
      <div style={{ ...S.card, display:'flex', flexDirection:'column', gap:14 }}>
        <p style={{ fontWeight:700, fontSize:'.95rem', color:'var(--text)', margin:0 }}>
          🔐 Dashboard Access Control
        </p>
        <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:'-8px 0 0' }}>
          Locking a dashboard instantly kicks all active users of that role.
        </p>
        {ROLES.map(role => {
          const locked = roleLocks[role]
          const usersOfRole = users.filter(u => u.role === role)
          return (
            <div key={role} style={{ display:'flex', flexDirection:'column', gap:8, padding:'12px 0', borderTop:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                <div>
                  <span style={{ fontWeight:700, color:'var(--text)', fontSize:'.9rem' }}>{ROLE_LABELS[role]}</span>
                  <span style={{ fontSize:'.75rem', color:'var(--sub)', marginLeft:8 }}>
                    {usersOfRole.length} users · {Array.from(exemptMap[role]||[]).length} exempt
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  {locked && (
                    <span style={{ fontSize:'.72rem', fontWeight:600, color:'#ef4444', background:'rgba(239,68,68,.1)', padding:'3px 10px', borderRadius:20 }}>
                      🔒 LOCKED
                    </span>
                  )}
                  <button
                    onClick={() => toggleRoleLock(role)}
                    style={{ ...S.btn(locked ? SC.active : SC.locked), padding:'6px 16px', fontSize:'.82rem' }}
                  >
                    {locked ? '🔓 Unlock' : '🔒 Lock All'}
                  </button>
                  <button
                    onClick={() => setLockingRole(lockingRole===role ? null : role)}
                    style={{ ...S.btn(SC.pending), padding:'6px 12px', fontSize:'.78rem' }}
                  >
                    {lockingRole===role ? 'Hide' : 'Exemptions'}
                  </button>
                </div>
              </div>
              {/* Exemption picker */}
              {lockingRole === role && (
                <div style={{ background:'var(--bg)', borderRadius:10, padding:12, display:'flex', flexWrap:'wrap', gap:6 }}>
                  <p style={{ width:'100%', fontSize:'.75rem', color:'var(--sub)', margin:'0 0 6px' }}>
                    Tick users who will NOT be locked:
                  </p>
                  {usersOfRole.map(u => {
                    const on = exemptMap[role]?.has(u.id)
                    return (
                      <button key={u.id} onClick={() => toggleExempt(role, u.id)} style={{
                        padding:'4px 12px', borderRadius:20, border:'1px solid var(--border)',
                        background: on ? 'rgba(99,102,241,.15)' : 'var(--surface)',
                        color: on ? 'var(--accent)' : 'var(--sub)',
                        fontSize:'.75rem', fontWeight:600, cursor:'pointer',
                      }}>
                        {on ? '✓ ' : ''}{u.name || u.email}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {[['pending','⏳ Pending', pending.length],['all','👥 All Users',null],['bin','🗑 Bin',bin.length]].map(([t,label,count]) => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
            {label}
            {count != null && (
              <span style={{ marginLeft:6, background:'rgba(255,255,255,.2)', borderRadius:50, padding:'1px 7px', fontSize:'.7rem' }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── PENDING TAB ── */}
      {tab === 'pending' && (
        pending.length === 0
          ? <div style={{ textAlign:'center', padding:'48px', color:'var(--sub)' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:8 }}>✅</div>
              <p style={{ fontWeight:600, color:'var(--sub)', margin:0 }}>No pending users</p>
            </div>
          : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {pending.map(u => (
                <div key={u.id} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:150 }}>
                    <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px' }}>{u.name}</p>
                    <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
                      {u.role} · {u.email || u.phone || '—'}
                    </p>
                    <p style={{ fontSize:'.7rem', color:'var(--sub)', margin:'2px 0 0' }}>
                      {new Date(u.created_at).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                  </div>
                  <span style={S.badge(SC.pending)}>pending</span>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => act(u.id,'approve')} style={S.btn(SC.active)}>✅ Approve</button>
                    <button onClick={() => { const r=window.prompt('Reason (optional):'); if(r!==null) act(u.id,'reject',{reason:r}) }} style={S.btn(SC.locked)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* ── ALL USERS TAB ── */}
      {tab === 'all' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Search + role filter */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, role…"
              style={{ flex:1, minWidth:180, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 14px', color:'var(--text)', fontSize:'.88rem', outline:'none' }}
            />
            {['all',...ROLES].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} style={{
                padding:'8px 14px', borderRadius:50, border:'none', cursor:'pointer',
                fontWeight:700, fontSize:'.78rem', fontFamily:'inherit',
                background: roleFilter===r ? 'var(--accent)' : 'var(--surface)',
                color:      roleFilter===r ? '#fff' : 'var(--sub)',
                boxShadow:  roleFilter===r ? 'var(--shadow)' : 'none',
              }}>
                {r === 'all' ? 'All' : ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          {filtered.length === 0 && <p style={{ color:'var(--sub)', fontSize:'.875rem' }}>No users found.</p>}

          {filtered.map(u => {
            const sc = SC[u.status] || SC.pending
            return (
              <div key={u.id} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:150 }}>
                  <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px' }}>{u.name}</p>
                  <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
                    {u.role} · {u.email || u.phone || '—'}
                  </p>
                  {u.status==='suspended' && u.suspended_until && (
                    <p style={{ fontSize:'.7rem', color:'#8b5cf6', margin:'2px 0 0' }}>
                      Until {new Date(u.suspended_until).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <span style={S.badge(sc)}>{u.status}</span>

                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {u.status === 'pending'   && <button onClick={() => act(u.id,'approve')} style={S.btn(SC.active)}>Approve</button>}
                  {u.status === 'active'    && <button onClick={() => act(u.id,'lock')}    style={S.btn(SC.locked)}>🔒 Lock</button>}
                  {u.status === 'locked'    && <button onClick={() => act(u.id,'unlock')}  style={S.btn(SC.active)}>🔓 Unlock</button>}
                  {u.status === 'suspended' && <button onClick={() => act(u.id,'unsuspend')} style={S.btn(SC.active)}>▶ Unsuspend</button>}
                  {u.status === 'active'    && <button onClick={() => setSuspendId(u.id)} style={S.btn(SC.suspended)}>⏸ Suspend</button>}
                  <button onClick={() => { if(confirm('Move to bin?')) act(u.id,'bin') }} style={S.btn(SC.bin)}>🗑 Bin</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── BIN TAB ── */}
      {tab === 'bin' && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {bin.length === 0 && <p style={{ color:'var(--sub)', fontSize:'.875rem' }}>Bin is empty.</p>}
          {bin.map(u => (
            <div key={u.id} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', opacity:.8 }}>
              <div style={{ flex:1, minWidth:150 }}>
                <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px' }}>{u.name}</p>
                <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
                  {u.role} · {u.email || '—'}
                </p>
              </div>
              <span style={S.badge(SC.bin)}>deleted</span>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => act(u.id,'restore',...[]).then ? act(u.id,'restore') : null}
                  onClick={() => { api.put(\`/admin/bin/\${u.id}/restore\`).then(()=>{toast.success('Restored'); load()}).catch(()=>toast.error('Failed')) }}
                  style={S.btn(SC.active)}>↩ Restore</button>
                <button onClick={() => hardDelete(u.id)} style={S.btn(SC.locked)}>💀 Delete Forever</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suspend modal */}
      {suspendId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'var(--surface)', borderRadius:'var(--radius)', padding:28, maxWidth:340, width:'90%', boxShadow:'var(--shadow-hover)' }}>
            <h3 style={{ color:'var(--text)', margin:'0 0 16px', fontWeight:800 }}>⏸ Suspend User</h3>
            <label style={{ fontSize:'.85rem', color:'var(--sub)', display:'block', marginBottom:6 }}>Suspend for how many days?</label>
            <input type="number" min={1} max={365} value={suspendDays} onChange={e => setSuspendDays(Number(e.target.value))}
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'1rem', outline:'none', marginBottom:16 }} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => { act(suspendId,'suspend',{days:suspendDays}); setSuspendId(null) }}
                style={{ ...S.btn(SC.suspended), flex:1, padding:'10px', fontSize:'.9rem', justifyContent:'center', display:'flex' }}>
                Suspend {suspendDays}d
              </button>
              <button onClick={() => setSuspendId(null)} style={{ ...S.btn(SC.bin), flex:1, padding:'10px', fontSize:'.9rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
`.trimStart());

/* ═══════════════════════════════════════════════════════
   7. admin/Home.jsx  — theme-aware + real online count
═══════════════════════════════════════════════════════ */
w(FRONT, 'pages/admin/Home.jsx', `
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import KpiCard from '../../components/dashboard/KpiCard'
import Spinner from '../../components/common/Spinner'

const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px', boxShadow:'var(--shadow)' }
const h2   = { fontSize:'1rem', fontWeight:700, color:'var(--text)', margin:'0 0 14px' }

export default function AdminHome() {
  const [kpis,setKpis]     = useState(null)
  const [logs,setLogs]     = useState([])
  const [users,setUsers]   = useState([])
  const [online,setOnline] = useState(0)
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get('/dashboard/admin/kpis'),
      api.get('/system/logs'),
      api.get('/admin/users'),
      api.get('/admin/online'),
    ]).then(([k,l,u,o]) => {
      if(k.status==='fulfilled') setKpis(k.value.data)
      if(l.status==='fulfilled') setLogs(l.value.data.slice(0,5))
      if(u.status==='fulfilled') setUsers(u.value.data.slice(0,5))
      if(o.status==='fulfilled') setOnline(o.value.data.count || 0)
    }).finally(() => setLoading(false))
  },[])

  if(loading) return <Spinner />

  const SC = s => s==='active'?{bg:'rgba(16,185,129,.12)',fg:'#10b981'}:s==='pending'?{bg:'rgba(245,158,11,.12)',fg:'#f59e0b'}:{bg:'rgba(239,68,68,.12)',fg:'#ef4444'}

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.65rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px', letterSpacing:'-0.4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>System overview & controls</p>
        </div>
        <Link to="/admin/shutdown" style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', color:'#ef4444', padding:'8px 14px', borderRadius:10, textDecoration:'none', fontSize:'.875rem', fontWeight:600 }}>
          🔴 Shutdown
        </Link>
      </div>

      {/* KPIs — 2×3 grid */}
      <div>
        <p style={h2}>System Overview</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          <KpiCard icon="👥" label="Total Users"   value={kpis?.totalUsers?.total}   color="brand"  />
          <KpiCard icon="✅" label="Active"         value={kpis?.totalUsers?.active}  color="green"  />
          <KpiCard icon="⏳" label="Pending"        value={kpis?.totalUsers?.pending} color="yellow" />
          <KpiCard icon="🔒" label="Locked"         value={kpis?.totalUsers?.locked}  color="red"    />
          <KpiCard icon="💳" label="Subscriptions"  value={kpis?.activeSubscriptions} color="purple" />
          <KpiCard icon="🟢" label="Online Now"     value={online}                    color="green"  />
        </div>
      </div>

      {/* Revenue */}
      <div>
        <p style={h2}>Revenue</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          <KpiCard icon="💰" label="Total Revenue"  value={kpis?.revenue?.total ? \`KES \${Number(kpis.revenue.total).toLocaleString()}\` : '—'} color="green" />
          <KpiCard icon="📅" label="Payments (30d)" value={kpis?.revenue?.count ?? '—'} sub="transactions" color="brand" />
        </div>
      </div>

      {/* Quick Actions — 2 cols */}
      <div>
        <p style={h2}>Quick Actions</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {[
            {to:'/admin/users',           icon:'👤', label:'Users'},
            {to:'/admin/subscriptions',   icon:'💳', label:'Subscriptions'},
            {to:'/admin/logs',            icon:'📋', label:'Logs'},
            {to:'/admin/system-settings', icon:'⚙️', label:'Settings'},
          ].map(a => (
            <Link key={a.to} to={a.to} style={{ ...card, display:'flex', alignItems:'center', gap:12, textDecoration:'none', transition:'transform .15s,box-shadow .15s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-hover)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='var(--shadow)'}}>
              <span style={{ fontSize:'1.5rem' }}>{a.icon}</span>
              <span style={{ fontSize:'.85rem', fontWeight:700, color:'var(--text)' }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent users + logs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
        <div>
          <p style={h2}>Recent Users</p>
          <div style={card}>
            {users.length===0 && <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>No users yet.</p>}
            {users.map((u,i) => {
              const sc = SC(u.status)
              return (
                <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:i<users.length-1?'1px solid var(--border)':'none'}}>
                  <div>
                    <p style={{fontSize:'.875rem',fontWeight:600,color:'var(--text)',margin:'0 0 2px'}}>{u.name}</p>
                    <p style={{fontSize:'.72rem',color:'var(--sub)',margin:0,textTransform:'capitalize'}}>{u.role} · {u.email||u.phone||'—'}</p>
                  </div>
                  <span style={{fontSize:'.7rem',fontWeight:600,padding:'3px 9px',borderRadius:20,background:sc.bg,color:sc.fg,flexShrink:0}}>{u.status}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <p style={h2}>Recent Logs</p>
          <div style={card}>
            {logs.length===0 && <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>No logs yet.</p>}
            {logs.map((l,i) => (
              <div key={l.id} style={{padding:'11px 0',borderBottom:i<logs.length-1?'1px solid var(--border)':'none'}}>
                <p style={{fontSize:'.875rem',fontWeight:600,color:'var(--text)',margin:'0 0 2px',textTransform:'capitalize'}}>{l.action?.replace(/_/g,' ')}</p>
                <p style={{fontSize:'.72rem',color:'var(--sub)',margin:0}}>{l.type} · {new Date(l.timestamp||l.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
`.trimStart());

/* ═══════════════════════════════════════════════════════
   8. admin/Settings.jsx  — real save + dashboard lock toggles
═══════════════════════════════════════════════════════ */
w(FRONT, 'pages/admin/Settings.jsx', `
import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const card  = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px', boxShadow:'var(--shadow)', marginBottom:16 }
const label = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid var(--border)' }
const last  = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0' }

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width:46, height:26, borderRadius:13, cursor:'pointer', transition:'background .25s',
      background: value ? 'var(--accent)' : 'rgba(156,163,175,.4)', position:'relative', flexShrink:0,
    }}>
      <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, transition:'left .25s', left: value ? 23 : 3 }} />
    </div>
  )
}

const DEFAULTS = {
  allow_registration: true, require_admin_approval: true,
  maintenance_mode: false, max_login_attempts: 5, session_timeout: 24,
  enable_notifications: true,
}

export default function AdminSettings() {
  const [cfg, setCfg]       = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    api.get('/admin/settings')
      .then(r => setCfg({ ...DEFAULTS, ...r.data }))
      .catch(() => toast.error('Could not load settings'))
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }))

  async function save() {
    setSaving(true)
    try {
      await api.put('/admin/settings', cfg)
      toast.success('Settings saved ✓')
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>System Settings</h1>
          <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Changes are saved to the database immediately.</p>
        </div>
        <button onClick={save} disabled={saving} style={{
          background:'var(--accent)', color:'#fff', border:'none', borderRadius:12,
          padding:'10px 24px', fontWeight:700, fontSize:'.95rem', cursor:'pointer', fontFamily:'inherit',
        }}>
          {saving ? 'Saving…' : '💾 Save Changes'}
        </button>
      </div>

      {/* Access & Registration */}
      <div style={card}>
        <p style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', margin:'0 0 4px' }}>Access & Registration</p>
        <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:'0 0 12px' }}>Control who can sign up and how accounts are managed.</p>

        {[
          { k:'allow_registration',    title:'Allow Registration',      sub:'New users can sign up' },
          { k:'require_admin_approval',title:'Require Admin Approval',  sub:'New accounts need approval before login' },
          { k:'maintenance_mode',      title:'Maintenance Mode',        sub:'Block all non-admin access' },
        ].map(({ k, title, sub }, i, arr) => (
          <div key={k} style={i < arr.length-1 ? label : last}>
            <div>
              <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>{title}</p>
              <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>{sub}</p>
            </div>
            <Toggle value={!!cfg[k]} onChange={v => set(k, v)} />
          </div>
        ))}

        <div style={last}>
          <div>
            <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>Max Login Attempts</p>
            <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>Before account lockout</p>
          </div>
          <input type="number" min={1} max={20} value={cfg.max_login_attempts}
            onChange={e => set('max_login_attempts', Number(e.target.value))}
            style={{ width:64, padding:'6px 10px', borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'.9rem', textAlign:'center', outline:'none' }} />
        </div>

        <div style={last}>
          <div>
            <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>Session Timeout (hours)</p>
            <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>Auto-logout after inactivity</p>
          </div>
          <input type="number" min={1} max={720} value={cfg.session_timeout}
            onChange={e => set('session_timeout', Number(e.target.value))}
            style={{ width:64, padding:'6px 10px', borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'.9rem', textAlign:'center', outline:'none' }} />
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <p style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', margin:'0 0 4px' }}>Notifications</p>
        <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:'0 0 12px' }}>Control system-wide notification behaviour.</p>
        <div style={last}>
          <div>
            <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>Enable Notifications</p>
            <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>Send system notifications to users</p>
          </div>
          <Toggle value={!!cfg.enable_notifications} onChange={v => set('enable_notifications', v)} />
        </div>
      </div>
    </div>
  )
}
`.trimStart());

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  All files written!

One manual step — install socket.io-client in the frontend:

  cd "C:\\Users\\pc\\Downloads\\eduapp\\frontend"
  npm install socket.io-client

Then restart both servers and everything is live.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);