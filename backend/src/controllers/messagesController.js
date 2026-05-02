const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const { notifyUser } = require('../websocket/socket');

// Ensure file_url column exists
query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_url TEXT').catch(() => {});

async function emitToReceiver(receiverId, message) {
  try { notifyUser(receiverId, 'message:new', message); } catch (e) {}
}

/* GET /messages/conversations — list all chats for me, sorted by most recent */
exports.getConversations = async (req, res, next) => {
  try {
    const me = req.user.id;
    const { rows } = await query(`
      WITH partners AS (
        SELECT
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_id,
          MAX(created_at) AS last_at
        FROM messages
        WHERE (sender_id = $1 OR receiver_id = $1) AND receiver_id IS NOT NULL
        GROUP BY other_id
      )
      SELECT
        u.id, u.name, u.role, u.avatar_url,
        p.last_at,
        (SELECT content FROM messages
           WHERE (sender_id=$1 AND receiver_id=u.id) OR (sender_id=u.id AND receiver_id=$1)
           ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT type FROM messages
           WHERE (sender_id=$1 AND receiver_id=u.id) OR (sender_id=u.id AND receiver_id=$1)
           ORDER BY created_at DESC LIMIT 1) AS last_type,
        (SELECT COUNT(*) FROM messages
           WHERE sender_id=u.id AND receiver_id=$1 AND read=false)::int AS unread_count
      FROM partners p
      JOIN users u ON u.id = p.other_id
      ORDER BY p.last_at DESC
    `, [me]);
    res.json(rows);
  } catch (e) { next(e); }
};

/* GET /messages/users — all active users (to start new conversation) */
exports.getUsers = async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id,name,role,avatar_url FROM users WHERE id!=$1 AND status='active' ORDER BY name",
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

/* GET /messages/thread/:otherId — messages between me and another user */
exports.getThread = async (req, res, next) => {
  try {
    const me = req.user.id;
    const other = req.params.otherId;
    // Mark their messages to me as read
    await query(
      'UPDATE messages SET read=true WHERE sender_id=$1 AND receiver_id=$2 AND read=false',
      [other, me]
    );
    const { rows } = await query(`
      SELECT m.*,
        s.name AS sender_name, s.avatar_url AS sender_avatar, s.role AS sender_role
      FROM messages m
      JOIN users s ON s.id = m.sender_id
      WHERE (m.sender_id=$1 AND m.receiver_id=$2)
         OR (m.sender_id=$2 AND m.receiver_id=$1)
      ORDER BY m.created_at ASC
      LIMIT 200
    `, [me, other]);
    res.json(rows);
  } catch (e) { next(e); }
};

/* POST /messages — send text message */
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, type } = req.body;
    const senderId = req.user.id;
    if (!receiverId || !content) return res.status(400).json({ error: 'receiverId and content required' });

    const id = uuid();
    const { rows } = await query(`
      INSERT INTO messages(id, sender_id, receiver_id, content, type)
      VALUES($1,$2,$3,$4,$5) RETURNING *
    `, [id, senderId, receiverId, content, type || 'text']);

    const { rows: sr } = await query('SELECT id,name,avatar_url,role FROM users WHERE id=$1', [senderId]);
    const msg = { ...rows[0], sender_name: sr[0]?.name, sender_avatar: sr[0]?.avatar_url, sender_role: sr[0]?.role };

    await emitToReceiver(receiverId, msg);
    res.status(201).json(msg);
  } catch (e) { next(e); }
};

/* POST /messages/upload — send file/image/gif/video (multer) */
exports.uploadFile = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!receiverId) return res.status(400).json({ error: 'receiverId required' });

    const fileUrl = '/uploads/messages/' + req.file.filename;
    const mime = req.file.mimetype || '';
    let type = 'file';
    if (mime.startsWith('image/gif')) type = 'gif';
    else if (mime.startsWith('image/'))  type = 'image';
    else if (mime.startsWith('video/'))  type = 'video';

    const id = uuid();
    const { rows } = await query(`
      INSERT INTO messages(id, sender_id, receiver_id, content, type)
      VALUES($1,$2,$3,$4,$5) RETURNING *
    `, [id, senderId, receiverId, fileUrl, type]);

    const { rows: sr } = await query('SELECT id,name,avatar_url,role FROM users WHERE id=$1', [senderId]);
    const msg = { ...rows[0], sender_name: sr[0]?.name, sender_avatar: sr[0]?.avatar_url, sender_role: sr[0]?.role };

    await emitToReceiver(receiverId, msg);
    res.status(201).json(msg);
  } catch (e) { next(e); }
};

/* PATCH /messages/:id/read */
exports.markRead = async (req, res, next) => {
  try {
    await query('UPDATE messages SET read=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'Marked read.' });
  } catch (e) { next(e); }
};

/* Legacy — keep old route working */
exports.getMessages = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM messages WHERE sender_id=$1 OR receiver_id=$1 ORDER BY created_at DESC LIMIT 100',
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};
