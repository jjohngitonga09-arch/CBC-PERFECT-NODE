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

/* â”€â”€ LOCK â”€â”€ */
router.put('/admin/lock/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='locked' WHERE id=$1", [id]);
    kickUser(id, 'account_locked');
    await query(
      "INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)",
      [`Locked user ${id}`, req.user?.id || req.user?.userId]
    ).catch(()=>{});
    res.json({ message: 'User locked' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* â”€â”€ UNLOCK â”€â”€ */
router.put('/admin/unlock/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active', failed_login_attempts=0 WHERE id=$1", [id]);
    await query(
      "INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)",
      [`Unlocked user ${id}`, req.user?.id || req.user?.userId]
    ).catch(()=>{});
    res.json({ message: 'User unlocked' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// Account status check - works even when locked (no authenticate middleware)
const jwt = require('jsonwebtoken');
const { query: dbQuery } = require('../config/db');
router.get('/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ status: 'unknown' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await dbQuery('SELECT status FROM users WHERE id=$1', [decoded.id]);
    res.json({ status: rows[0]?.status || 'unknown' });
  } catch {
    res.json({ status: 'unknown' });
  }
});

router.post('/logout', requireAuth, ctrl.logout);

module.exports = router;

