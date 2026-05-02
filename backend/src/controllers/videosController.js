const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

exports.createVideo = async (req, res, next) => {
  try {
    const { title, url, thumbnailUrl, subject, grade, assignedTo } = req.body;
    const id = uuid();
    await query(
      `INSERT INTO videos(id,title,url,thumbnail_url,subject,grade,teacher_id,assigned_to)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, title, url, thumbnailUrl, subject, grade, req.user.id, JSON.stringify(assignedTo || [])]
    );
    res.status(201).json({ id });
  } catch (e) { next(e); }
};

exports.listVideos = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM videos WHERE grade=$1 ORDER BY created_at DESC',
      [req.params.grade]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getVideo = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM videos WHERE id=$1', [req.params.id]);
    if (!rows.length) return next(new AppError('Video not found', 404));
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    await query('DELETE FROM videos WHERE id=$1', [req.params.id]);
    res.json({ message: 'Video deleted.' });
  } catch (e) { next(e); }
};
