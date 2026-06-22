const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { query } = require('../config/db');
const C = require('../controllers/quizzesController');

// Frontend calls /quizzes?studentId=xxx — return cards as quizzes
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { grade } = req.query;
    let sql = 'SELECT id,title,subject,grade,jsonb_array_length(check_items::jsonb) as question_count,difficulty FROM cards';
    const params = [];
    if (grade) { params.push(grade); sql += ' WHERE grade = $1'; }
    sql += ' ORDER BY created_at DESC LIMIT 50';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});

// Grade+subject lookup
router.get('/:grade/:subject', authenticate, C.listQuizzes);
router.post('/:id/submit',     authenticate, authorizeRoles('student'), C.submitQuiz);

module.exports = router;
