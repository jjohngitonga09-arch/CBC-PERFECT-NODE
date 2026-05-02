const { v4: uuid } = require('uuid');
const { query } = require('../config/db');

exports.listQuizzes = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM cards WHERE grade=$1 AND subject=$2 ORDER BY difficulty ASC`,
      [req.params.grade, req.params.subject]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeSpent } = req.body;
    // answers: [{itemId, selected}]
    const { rows } = await query('SELECT check_items FROM cards WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Quiz not found' });

    const items = typeof rows[0].check_items === 'string'
      ? JSON.parse(rows[0].check_items) : rows[0].check_items;

    let correct = 0;
    items.forEach((item, i) => {
      if (answers[i]?.selected === item.answer) correct++;
    });
    const score = Math.round((correct / items.length) * 100);
    const passed = score >= 80;

    res.json({ score, correct, total: items.length, passed });
  } catch (e) { next(e); }
};
