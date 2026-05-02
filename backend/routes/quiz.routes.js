const express  = require('express')
const router   = express.Router()
const mongoose = require('mongoose')

/* ─── Schemas (inline so no extra files needed) ─── */

const attemptSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  storyId:    { type: String, required:true },
  storyTitle: String,
  genre:      String,
  score:      Number,
  total:      Number,
  stars:      Number,
  answers:    [Number],
  createdAt:  { type: Date, default: Date.now },
})
const StoryAttempt = mongoose.models.StoryAttempt || mongoose.model('StoryAttempt', attemptSchema)

const badgeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  badgeId:   String,
  label:     String,
  icon:      String,
  awardedAt: { type: Date, default: Date.now },
})
const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema)

const STORY_BADGES = [
  { id:'story_starter',  label:'Story Starter',  icon:'book',  desc:'Complete your first story quiz',  req:1,  type:'count' },
  { id:'bookworm',       label:'Bookworm',        icon:'bug',   desc:'Complete 5 story quizzes',         req:5,  type:'count' },
  { id:'story_master',   label:'Story Master',    icon:'trophy',desc:'Complete 10 story quizzes',        req:10, type:'count' },
  { id:'perfect_reader', label:'Perfect Reader',  icon:'star',  desc:'Score 5/5 on any story quiz',     req:5,  type:'perfect' },
]

/* ─── POST /quiz/story-attempt ─── */
router.post('/story-attempt', async (req, res) => {
  try {
    const { studentId, storyId, storyTitle, genre, score, total, stars, answers } = req.body
    if (!studentId || !storyId) return res.status(400).json({ error: 'studentId and storyId required' })

    // Save attempt
    const attempt = await StoryAttempt.create({ studentId, storyId, storyTitle, genre, score, total, stars, answers })

    // Count total attempts for this student
    const attemptCount = await StoryAttempt.countDocuments({ studentId })

    // Check badge eligibility
    const existingBadges = await Badge.find({ studentId }).select('badgeId')
    const existingIds    = existingBadges.map(b => b.badgeId)
    const newBadges      = []

    for (const b of STORY_BADGES) {
      if (existingIds.includes(b.id)) continue
      if (b.type === 'count'   && attemptCount >= b.req) newBadges.push(b)
      if (b.type === 'perfect' && score >= b.req)        newBadges.push(b)
    }

    if (newBadges.length > 0) {
      await Badge.insertMany(newBadges.map(b => ({ studentId, badgeId:b.id, label:b.label, icon:b.icon })))
    }

    // Update leaderboard / progress — try to find a Progress or User model
    try {
      const User = mongoose.model('User')
      await User.findByIdAndUpdate(studentId, {
        $inc: { totalStars: stars, storyQuizCount: 1 }
      })
    } catch (_) { /* User model may not have these fields — safe to skip */ }

    return res.json({
      attempt,
      badges:      newBadges,
      totalStars:  stars,
      attemptCount,
    })
  } catch (err) {
    console.error('story-attempt error:', err)
    return res.status(500).json({ error: err.message })
  }
})

/* ─── GET /quiz/story-attempts/:studentId ─── */
router.get('/story-attempts/:studentId', async (req, res) => {
  try {
    const attempts = await StoryAttempt.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 })
      .limit(50)
    const totalStars = attempts.reduce((s, a) => s + (a.stars || 0), 0)
    res.json({ attempts, totalStars, count: attempts.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ─── GET /quiz/badges/:studentId ─── */
router.get('/badges/:studentId', async (req, res) => {
  try {
    const badges = await Badge.find({ studentId: req.params.studentId }).sort({ awardedAt:-1 })
    res.json({ badges })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router