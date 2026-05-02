const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

exports.createSubmission = async (req, res, next) => {
  try {
    const { assignmentId, answerText, mediaUrl } = req.body;
    const studentId = req.user.id;
    const id = uuid();
    await query(
      `INSERT INTO submissions(id,assignment_id,student_id,answer_text,media_url,status)
       VALUES($1,$2,$3,$4,$5,'submitted')`,
      [id, assignmentId, studentId, answerText, mediaUrl || null]
    );
    res.status(201).json({ id });
  } catch (e) { next(e); }
};

exports.getByAssignment = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM submissions WHERE assignment_id=$1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.addFeedback = async (req, res, next) => {
  try {
    const { stars, feedback } = req.body;
    if (stars < 1 || stars > 5) return next(new AppError('stars must be 1–5', 400));
    await query(
      `UPDATE submissions SET stars=$1, feedback=$2, status='graded' WHERE id=$3`,
      [stars, feedback, req.params.id]
    );
    res.json({ message: 'Feedback saved.' });
  } catch (e) { next(e); }
};
