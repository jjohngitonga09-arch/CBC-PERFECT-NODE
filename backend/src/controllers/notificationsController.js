const { v4: uuid } = require('uuid');
const { query } = require('../config/db');

exports.getNotifications = async (req, res, next) => {
  try {
    // Try notifications table; if it doesn't exist return empty array gracefully
    const { rows } = await query(
      `SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.userId]
    ).catch(() => ({ rows: [] }));
    res.json(rows);
  } catch (e) { res.json([]); }
};

exports.markRead = async (req, res, next) => {
  try {
    await query('UPDATE notifications SET read=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'Marked read.' });
  } catch (e) { res.json({ message: 'ok' }); }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;
    const id = uuid();
    await query(
      `INSERT INTO notifications(id,user_id,title,message,type) VALUES($1,$2,$3,$4,$5)`,
      [id, userId, title, message, type || 'system']
    );
    res.status(201).json({ id });
  } catch (e) { next(e); }
};
