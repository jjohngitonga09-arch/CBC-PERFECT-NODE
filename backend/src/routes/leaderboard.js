const express = require('express')
const router  = express.Router()
const { query } = require('../config/db')
const { authenticate } = require('../middleware/authenticate')

/* ensure leaderboard table */
query(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    student_id    TEXT PRIMARY KEY,
    total_stars   INT DEFAULT 0,
    story_count   INT DEFAULT 0,
    total_correct INT DEFAULT 0,
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(console.error)

/* ── GET /leaderboard
   Returns top 50 students only — no parents, teachers, admins.
   Parent-linked accounts: only the student row appears (parent_id excluded by role filter).
── */
router.get('/', async (req, res) => {
  try {
    const { grade } = req.query
    const params = grade ? [grade] : []
    const gradeClause = grade ? 'AND u.grade = $1' : ''
    const { rows } = await query(
      `SELECT l.student_id, u.name, u.avatar_url, l.total_stars, l.story_count,
              l.total_correct, l.updated_at,
              RANK() OVER (ORDER BY l.total_stars DESC, l.total_correct DESC) AS rank
       FROM leaderboard l
       JOIN users u ON u.id::TEXT = l.student_id
       WHERE u.role = 'student' AND u.status != 'banned' ${gradeClause}
       ORDER BY l.total_stars DESC, l.total_correct DESC LIMIT 50`,
      params
    )
    res.json({ leaderboard: rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ── GET /leaderboard/me/:studentId  — rank of a specific student ── */
router.get('/me/:studentId', async (req, res) => {
  try {
    const { grade } = req.query
    const gradeClause = grade ? 'AND u.grade = $2' : ''
    const params = grade ? [req.params.studentId, grade] : [req.params.studentId]
    const { rows } = await query(
      `SELECT rank, total_stars, story_count, total_correct FROM (
         SELECT l.student_id, l.total_stars, l.story_count, l.total_correct,
                RANK() OVER (ORDER BY l.total_stars DESC, l.total_correct DESC) AS rank
         FROM leaderboard l
         JOIN users u ON u.id::TEXT = l.student_id
         WHERE u.role = 'student' ${gradeClause}
       ) ranked WHERE student_id = $1`,
      params
    )
    res.json(rows[0] || { rank: null, total_stars: 0, story_count: 0, total_correct: 0 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router