const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { query } = require('../config/db');
const C = require('../controllers/quizzesController');

// Frontend calls /quizzes?studentId=xxx — return cards as quizzes
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, title, subject, grade,
              jsonb_array_length(check_items::jsonb) as question_count,
              difficulty
       FROM cards
       ORDER BY created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// Grade+subject lookup
router.get('/:grade/:subject', authenticate, C.listQuizzes);
router.post('/:id/submit',     authenticate, authorizeRoles('student'), C.submitQuiz);

module.exports = router;
