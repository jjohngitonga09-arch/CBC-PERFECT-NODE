const express  = require('express')
const router   = express.Router()
const { query } = require('../src/config/db')
const { authenticate }   = require('../src/middleware/authenticate')
const { authorizeRoles } = require('../src/middleware/authorizeRoles')
const { Parser } = require('json2csv')

const auth  = [authenticate, authorizeRoles('admin')]
const logIt = (action, adminId) =>
  query("INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)", [action, adminId]).catch(() => {})

// -- GET /admin/pending-users --------------------------------------------------
router.get('/pending-users', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,created_at FROM users WHERE status='pending' ORDER BY created_at DESC"
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- POST /admin/users/:id/approve ---------------------------------------------
router.post('/users/:id/approve', ...auth, async (req, res) => {
  try {
    const { rows } = await query("UPDATE users SET status='active' WHERE id=$1 RETURNING *", [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    await logIt(`Approved user ${req.params.id}`, req.user?.id)
    res.json({ success: true, user: rows[0] })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- POST /admin/users/:id/reject ----------------------------------------------
router.post('/users/:id/reject', ...auth, async (req, res) => {
  try {
    const { rows } = await query("UPDATE users SET status='rejected' WHERE id=$1 RETURNING id", [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    await logIt(`Rejected user ${req.params.id}`, req.user?.id)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /dashboard/admin/revenue-trend?days=7|30&from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/dashboard/admin/revenue-trend', ...auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7
    const from = req.query.from ? req.query.from : new Date(Date.now() - days * 86_400_000).toISOString()
    const to   = req.query.to   ? req.query.to   : new Date().toISOString()
    const { rows } = await query(
      `SELECT DATE(created_at) AS date, SUM(amount) AS total, COUNT(id) AS count
       FROM payments
       WHERE status='completed' AND created_at BETWEEN $1 AND $2
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`,
      [from, to]
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /admin/alerts ---------------------------------------------------------
router.get('/alerts', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM system_logs
       WHERE action IN ('failed_login','account_locked','suspicious_activity','login_blocked')
       ORDER BY created_at DESC LIMIT 20`
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /dashboard/admin/user-growth?days=30&from=YYYY-MM-DD&to=YYYY-MM-DD ---
router.get('/dashboard/admin/user-growth', ...auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30
    const from = req.query.from ? req.query.from : new Date(Date.now() - days * 86_400_000).toISOString()
    const to   = req.query.to   ? req.query.to   : new Date().toISOString()
    const { rows } = await query(
      `SELECT DATE(created_at) AS date, COUNT(id) AS count
       FROM users
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`,
      [from, to]
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /dashboard/admin/subscription-health ----------------------------------
router.get('/dashboard/admin/subscription-health', ...auth, async (req, res) => {
  try {
    const now       = new Date().toISOString()
    const weekEnd   = new Date(Date.now() + 7  * 86_400_000).toISOString()
    const monthEnd  = new Date(Date.now() + 30 * 86_400_000).toISOString()
    const thirtyAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()

    const [w, m, a, t, r, e] = await Promise.all([
      query("SELECT COUNT(*) FROM subscriptions WHERE status='active' AND end_date BETWEEN $1 AND $2", [now, weekEnd]),
      query("SELECT COUNT(*) FROM subscriptions WHERE status='active' AND end_date BETWEEN $1 AND $2", [now, monthEnd]),
      query("SELECT COUNT(*) FROM subscriptions WHERE status='active'"),
      query("SELECT COUNT(*) FROM subscriptions"),
      query("SELECT COUNT(*) FROM subscriptions WHERE status='active' AND updated_at >= $1 AND created_at < $1", [thirtyAgo]),
      query("SELECT COUNT(*) FROM subscriptions WHERE status='expired' AND end_date BETWEEN $1 AND $2", [thirtyAgo, now]),
    ])

    const renewed = Number(r.rows[0].count)
    const expired = Number(e.rows[0].count)
    const renewalRate = expired > 0 ? Math.round((renewed / expired) * 100) : 100

    res.json({
      expiringThisWeek:  Number(w.rows[0].count),
      expiringThisMonth: Number(m.rows[0].count),
      active:            Number(a.rows[0].count),
      total:             Number(t.rows[0].count),
      renewalRate,
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /dashboard/admin/role-breakdown ---------------------------------------
router.get('/dashboard/admin/role-breakdown', ...auth, async (req, res) => {
  try {
    const { rows } = await query("SELECT role, COUNT(id) AS count FROM users GROUP BY role")
    const result = {}
    rows.forEach(r => { result[r.role] = Number(r.count) })
    res.json(result)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /admin/search?q=<term> ------------------------------------------------
router.get('/search', ...auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim()
    if (q.length < 2) return res.json([])
    const { rows } = await query(
      `SELECT id,name,email,phone,role,status FROM users
       WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 LIMIT 10`,
      [`%${q}%`]
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /admin/export/users → CSV --------------------------------------------
router.get('/export/users', ...auth, async (req, res) => {
  try {
    const { rows } = await query("SELECT id,name,email,phone,role,status,created_at FROM users")
    const parser = new Parser({ fields: ['id','name','email','phone','role','status','created_at'] })
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"')
    res.send(parser.parse(rows))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// -- GET /admin/export/payments → CSV -----------------------------------------
router.get('/export/payments', ...auth, async (req, res) => {
  try {
    const { rows } = await query("SELECT id,user_id,amount,status,method,reference,created_at FROM payments")
    const fields = ['id','user_id','amount','status','method','reference','created_at']
    const parser = new Parser({ fields })
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="payments.csv"')
    res.send(parser.parse(rows))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router