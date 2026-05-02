const express = require('express')
const router  = express.Router()
const { query } = require('../config/db')

/* ── ensure tables exist once ── */
async function ensureTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS story_attempts (
      id          SERIAL PRIMARY KEY,
      student_id  TEXT NOT NULL,
      story_id    TEXT NOT NULL,
      story_title TEXT,
      genre       TEXT,
      score       INT  DEFAULT 0,
      total       INT  DEFAULT 5,
      stars       INT  DEFAULT 0,
      answers     TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )`)
  await query(`
    CREATE TABLE IF NOT EXISTS story_badges (
      id         SERIAL PRIMARY KEY,
      student_id TEXT NOT NULL,
      badge_id   TEXT NOT NULL,
      label      TEXT,
      icon       TEXT,
      awarded_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(student_id, badge_id)
    )`)
}
ensureTables().catch(console.error)

/* ── badge definitions ── */
const BADGES = [
  /* story count milestones */
  { id:'story_starter',   label:'Story Starter',   icon:'📖', req:1,  type:'story_count'   },
  { id:'bookworm',        label:'Bookworm',         icon:'🐛', req:5,  type:'story_count'   },
  { id:'story_master',    label:'Story Master',     icon:'🏆', req:10, type:'story_count'   },
  /* perfect scores */
  { id:'perfect_reader',  label:'Perfect Reader',   icon:'⭐', req:1,  type:'perfect_story' },
  /* total stars */
  { id:'star_collector',  label:'Star Collector',   icon:'🌟', req:10, type:'total_stars'   },
  { id:'star_champion',   label:'Star Champion',    icon:'💫', req:30, type:'total_stars'   },
  /* correct answers across ALL quizzes */
  { id:'answer_ace',      label:'Answer Ace',       icon:'🎯', req:25, type:'total_correct' },
  { id:'quiz_legend',     label:'Quiz Legend',      icon:'🦁', req:100,type:'total_correct' },
]

/* ── POST /quiz/story-attempt ── */
router.post('/story-attempt', async (req, res) => {
  try {
    let { studentId, storyId, storyTitle, genre, score, total, stars, answers } = req.body
    if (!studentId || !storyId) return res.status(400).json({ error: 'studentId and storyId required' })

    // Resolve parent-linked accounts: always use the student's own id
    // If the caller is a guardian, look up their linked child
    const { rows: roleRows } = await query(
      `SELECT role FROM users WHERE id=$1`, [studentId]
    )
    if (roleRows.length && roleRows[0].role === 'guardian') {
      const { rows: childRows } = await query(
        `SELECT student_id FROM parent_students WHERE parent_id=$1 LIMIT 1`, [studentId]
      )
      if (childRows.length) studentId = childRows[0].student_id
    }

    // Only students may record attempts
    const { rows: check } = await query(
      `SELECT role FROM users WHERE id=$1`, [studentId]
    )
    if (check.length && check[0].role !== 'student') {
      return res.status(403).json({ error: 'Only students can record quiz attempts' })
    }

    // Save attempt
    await query(
      `INSERT INTO story_attempts (student_id,story_id,story_title,genre,score,total,stars,answers)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [studentId, storyId, storyTitle||'', genre||'general',
       score||0, total||5, stars||0, JSON.stringify(answers||[])]
    )

    // ── Aggregate stats for badge checking ──
    const { rows: storyStats } = await query(`
      SELECT
        COUNT(*)                                    AS story_count,
        COALESCE(SUM(stars),0)                      AS total_story_stars,
        COUNT(*) FILTER (WHERE score=total AND total>0) AS perfect_count
      FROM story_attempts WHERE student_id=$1`, [studentId])

    // Total correct answers across ALL quiz types
    const { rows: quizStats } = await query(`
      SELECT COALESCE(SUM(correct),0) AS total_correct
      FROM quiz_submissions WHERE student_id=$1`, [studentId]
    ).catch(() => ({ rows: [{ total_correct: 0 }] }))

    const storyCount   = parseInt(storyStats[0].story_count)
    const totalStars   = parseInt(storyStats[0].total_story_stars)
    const perfectCount = parseInt(storyStats[0].perfect_count)
    const totalCorrect = parseInt(quizStats[0]?.total_correct || 0) + (score||0)

    // ── Award new badges ──
    const { rows: existingRows } = await query(
      `SELECT badge_id FROM story_badges WHERE student_id=$1`, [studentId]
    )
    const existingIds = existingRows.map(r => r.badge_id)
    const newBadges   = []

    for (const b of BADGES) {
      if (existingIds.includes(b.id)) continue
      let earned = false
      if (b.type === 'story_count'   && storyCount   >= b.req) earned = true
      if (b.type === 'perfect_story' && perfectCount >= b.req) earned = true
      if (b.type === 'total_stars'   && totalStars   >= b.req) earned = true
      if (b.type === 'total_correct' && totalCorrect >= b.req) earned = true
      if (earned) newBadges.push(b)
    }

    for (const b of newBadges) {
      await query(
        `INSERT INTO story_badges (student_id,badge_id,label,icon)
         VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [studentId, b.id, b.label, b.icon]
      )
    }

    // ── Update leaderboard row ──
    await query(`
      INSERT INTO leaderboard (student_id, total_stars, story_count, total_correct, updated_at)
      VALUES ($1,$2,$3,$4,NOW())
      ON CONFLICT (student_id) DO UPDATE SET
        total_stars   = leaderboard.total_stars   + $2,
        story_count   = leaderboard.story_count   + 1,
        total_correct = leaderboard.total_correct + $4,
        updated_at    = NOW()`,
      [studentId, stars||0, 1, score||0]
    ).catch(() => {}) // table created by leaderboard route on first load

    return res.json({
      success: true,
      badges:  newBadges,
      attemptCount: storyCount,
      totalStars,
    })
  } catch (err) {
    console.error('story-attempt error:', err)
    return res.status(500).json({ error: err.message })
  }
})

/* ── GET /quiz/story-attempts/:studentId ── */
router.get('/story-attempts/:studentId', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM story_attempts WHERE student_id=$1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.studentId]
    )
    const totalStars = rows.reduce((s,a) => s+(a.stars||0), 0)
    res.json({ attempts: rows, totalStars, count: rows.length })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* ── GET /quiz/badges/:studentId ── */
router.get('/badges/:studentId', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM story_badges WHERE student_id=$1 ORDER BY awarded_at DESC`,
      [req.params.studentId]
    )
    res.json({ badges: rows })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router