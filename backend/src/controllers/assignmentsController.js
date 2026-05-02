const { v4: uuid } = require('uuid');
const { query }    = require('../config/db');
const AppError     = require('../utils/AppError');

exports.createAssignment = async (req, res, next) => {
  try {
    const {
      title, instructions, objective,
      grade, subject, tags, due_date,
    } = req.body;

    // assigned_to: comes as JSON string (FormData) or array (JSON body)
    let assignedTo = req.body.assigned_to || req.body.assignedTo || '[]';
    if (typeof assignedTo === 'string') {
      try { assignedTo = JSON.parse(assignedTo); } catch { assignedTo = []; }
    }
    if (!Array.isArray(assignedTo)) assignedTo = [];

    // file (if uploaded via multer)
    const file_url  = req.file ? `/uploads/${req.file.filename}` : null;
    const file_name = req.file ? req.file.originalname : null;

    const id = uuid();
    await query(
      `INSERT INTO assignments
         (id, teacher_id, title, instructions, objective,
          grade, subject, tags, assigned_to, due_date, file_url, file_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        id,
        req.user.id,
        title,
        instructions || null,
        objective    || null,
        grade        || null,
        subject      || null,
        JSON.stringify(tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t=>t.trim()).filter(Boolean)) : []),
        JSON.stringify(assignedTo),
        due_date     || null,
        file_url,
        file_name,
      ]
    );

    // Return the full row so the frontend list updates immediately
    const { rows } = await query('SELECT * FROM assignments WHERE id=$1', [id]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
};

// Returns assignments for a student:
// - assignments where assigned_to contains their id, OR
// - assignments where assigned_to is empty [] (sent to all students)
exports.getStudentAssignments = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*, s.status as submission_status, s.stars, s.feedback,
              CASE WHEN s.id IS NOT NULL THEN true ELSE false END as submitted
       FROM assignments a
       LEFT JOIN submissions s
         ON s.assignment_id = a.id AND s.student_id = $1::uuid
       WHERE
         jsonb_array_length(a.assigned_to) = 0
         OR EXISTS (
           SELECT 1 FROM jsonb_array_elements_text(a.assigned_to) v
           WHERE v = $1::text
         )
       ORDER BY due_date ASC NULLS LAST`,
      [req.params.studentId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getTeacherAssignments = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*,
         jsonb_array_length(COALESCE(a.assigned_to,'[]'::jsonb)) as assigned_count,
         (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submission_count
       FROM assignments a
       WHERE a.teacher_id = $1
       ORDER BY created_at DESC`,
      [req.params.teacherId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getTeacherSubmissions = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT s.*, a.title as assignment_title, u.name as student_name
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       LEFT JOIN users u   ON u.id = s.student_id
       WHERE a.teacher_id = $1
       ORDER BY s.created_at DESC`,
      [req.params.teacherId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getAssignment = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM assignments WHERE id=$1', [req.params.id]);
    if (!rows.length) return next(new AppError('Assignment not found', 404));
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const { title, instructions, dueDate, due_date } = req.body;
    await query(
      'UPDATE assignments SET title=$1, instructions=$2, due_date=$3 WHERE id=$4',
      [title, instructions, dueDate || due_date, req.params.id]
    );
    res.json({ message: 'Updated.' });
  } catch (e) { next(e); }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    await query('DELETE FROM assignments WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted.' });
  } catch (e) { next(e); }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { stars, feedback } = req.body;
    await query(
      `UPDATE submissions SET stars=$1, feedback=$2, status='graded', updated_at=NOW() WHERE id=$3`,
      [stars, feedback || null, req.params.id]
    );
    res.json({ message: 'Graded.' });
  } catch (e) { next(e); }
};
