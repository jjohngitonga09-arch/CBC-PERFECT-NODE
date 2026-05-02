/**
 * fix_messages.js
 * Run: node "C:\Users\pc\Downloads\eduapp\fix_messages.js"
 *
 * After running:
 *   cd "C:\Users\pc\Downloads\eduapp\backend" && npm install multer
 *   Restart both servers
 *
 * Writes / rewrites:
 *   backend/src/websocket/socket.js            + notifyUser
 *   backend/src/routes/admin.js                fix _io bug
 *   backend/src/controllers/messagesController.js  full rebuild
 *   backend/src/routes/messages.js             full rebuild
 *   frontend/src/pages/shared/Messages.jsx     WhatsApp-like shared component
 *   frontend/src/pages/teacher/Messages.jsx    re-export shared
 *   frontend/src/pages/parent/Messages.jsx     re-export shared
 */

const fs   = require('fs');
const path = require('path');

const BACK  = 'C:\\Users\\pc\\Downloads\\eduapp\\backend\\src';
const FRONT = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src';
const ROOT  = 'C:\\Users\\pc\\Downloads\\eduapp';

function w(base, rel, txt) {
  const p = path.join(base, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, txt, 'utf8');
  console.log('✅  wrote:', rel);
}

// Ensure uploads directory exists
fs.mkdirSync(path.join(ROOT, 'backend', 'uploads', 'messages'), { recursive: true });
console.log('✅  created backend/uploads/messages/');

/* ═══════════════════════════════════════════════════════
   1. socket.js — add notifyUser
═══════════════════════════════════════════════════════ */
w(BACK, 'websocket/socket.js', `const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const onlineUsers = new Map(); // userId -> { socketId, role }
let _io = null;

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });
  _io = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorised'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    const { id: userId, role } = socket.user;
    onlineUsers.set(userId, { socketId: socket.id, role });
    logger.info(\`Socket connected: \${userId} (\${role})\`);
    io.emit('presence:update', { userId, online: true });

    socket.on('message:send', (data) => {
      const t = onlineUsers.get(data.receiverId);
      if (t) io.to(t.socketId).emit('message:new', { ...data, senderId: userId, ts: new Date() });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('presence:update', { userId, online: false });
      logger.info(\`Socket disconnected: \${userId}\`);
    });
  });

  return io;
}

function kickUser(userId, reason = 'account_locked') {
  const entry = onlineUsers.get(userId);
  if (entry && _io) _io.to(entry.socketId).emit('force:logout', { reason });
}

function kickRole(role, reason = 'dashboard_locked') {
  if (!_io) return;
  for (const [, entry] of onlineUsers.entries()) {
    if (entry.role === role) _io.to(entry.socketId).emit('force:logout', { reason });
  }
}

function notifyRole(role, event, payload = {}) {
  if (!_io) return;
  for (const [, entry] of onlineUsers.entries()) {
    if (entry.role === role) _io.to(entry.socketId).emit(event, payload);
  }
}

function notifyUser(userId, event, payload = {}) {
  if (!_io) return;
  const entry = onlineUsers.get(userId);
  if (entry) _io.to(entry.socketId).emit(event, payload);
}

function getIo()          { return _io; }
function getOnlineCount() { return onlineUsers.size; }

module.exports = { initSocket, kickUser, kickRole, notifyRole, notifyUser, getIo, getOnlineCount };
`);

/* ═══════════════════════════════════════════════════════
   2. admin.js — fix _io bug in roles/:role/lock
═══════════════════════════════════════════════════════ */
w(BACK, 'routes/admin.js', `const express = require('express');
const router  = express.Router();
const { query } = require('../config/db');
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { kickUser, kickRole, notifyRole, getOnlineCount } = require('../websocket/socket');

query('ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ').catch(() => {});

const auth  = [authenticate, authorizeRoles('admin')];
const logIt = (action, adminId) =>
  query("INSERT INTO system_logs(type,action,user_id) VALUES('admin',$1,$2)", [action, adminId]).catch(() => {});

router.get('/users', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,status,suspended_until,created_at FROM users WHERE status!='bin' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/online', ...auth, (req, res) => {
  res.json({ count: getOnlineCount() });
});

router.put('/users/:id/lock', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='locked' WHERE id=$1", [id]);
    kickUser(id, 'account_locked');
    await logIt(\`Locked user \${id}\`, req.user?.id);
    res.json({ message: 'Locked' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/unlock', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active' WHERE id=$1", [id]);
    await logIt(\`Unlocked user \${id}\`, req.user?.id);
    res.json({ message: 'Unlocked' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/suspend', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    const days = Number(req.body.days) || 1;
    const until = new Date(Date.now() + days * 86400000);
    await query("UPDATE users SET status='suspended', suspended_until=$1 WHERE id=$2", [until, id]);
    kickUser(id, 'account_suspended');
    await logIt(\`Suspended user \${id} for \${days}d\`, req.user?.id);
    res.json({ message: \`Suspended for \${days} days\`, until });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/unsuspend', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='active', suspended_until=NULL WHERE id=$1", [id]);
    await logIt(\`Unsuspended user \${id}\`, req.user?.id);
    res.json({ message: 'Unsuspended' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/bin', ...auth, async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE users SET status='bin' WHERE id=$1", [id]);
    kickUser(id, 'account_deleted');
    await logIt(\`Moved user \${id} to bin\`, req.user?.id);
    res.json({ message: 'Moved to bin' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/bin', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,role,created_at FROM users WHERE status='bin' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/bin/:id/restore', ...auth, async (req, res) => {
  try {
    await query("UPDATE users SET status='active' WHERE id=$1 AND status='bin'", [req.params.id]);
    await logIt(\`Restored user \${req.params.id} from bin\`, req.user?.id);
    res.json({ message: 'Restored' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/bin/:id', ...auth, async (req, res) => {
  try {
    await query("DELETE FROM users WHERE id=$1 AND status='bin'", [req.params.id]);
    await logIt(\`Permanently deleted user \${req.params.id}\`, req.user?.id);
    res.json({ message: 'Permanently deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ROLE DASHBOARD LOCK — fixed: no _io reference */
router.put('/roles/:role/lock', ...auth, async (req, res) => {
  try {
    const { role } = req.params;
    const exempt = req.body.exempt || [];
    await query(
      "INSERT INTO system_settings(key,value) VALUES($1,'true') ON CONFLICT(key) DO UPDATE SET value='true'",
      [\`dashboard_locked_\${role}\`]
    );
    await query(
      "INSERT INTO system_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2",
      [\`dashboard_lock_exempt_\${role}\`, JSON.stringify(exempt)]
    );
    notifyRole(role, 'force:logout', { reason: 'dashboard_locked' });
    await logIt(\`Locked \${role} dashboard\`, req.user?.id);
    res.json({ message: \`\${role} dashboard locked\` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/roles/:role/unlock', ...auth, async (req, res) => {
  try {
    const { role } = req.params;
    await query(
      "INSERT INTO system_settings(key,value) VALUES($1,'false') ON CONFLICT(key) DO UPDATE SET value='false'",
      [\`dashboard_locked_\${role}\`]
    );
    notifyRole(role, 'dashboard:unlocked', {});
    await logIt(\`Unlocked \${role} dashboard\`, req.user?.id);
    res.json({ message: \`\${role} dashboard unlocked\` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/settings', ...auth, async (req, res) => {
  try {
    const { rows } = await query('SELECT key,value FROM system_settings');
    const out = {};
    for (const r of rows) {
      if (r.value === 'true') out[r.key] = true;
      else if (r.value === 'false') out[r.key] = false;
      else if (!isNaN(r.value) && r.value !== '') out[r.key] = Number(r.value);
      else { try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; } }
    }
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/settings', ...auth, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        "INSERT INTO system_settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2",
        [key, typeof value === 'object' ? JSON.stringify(value) : String(value)]
      );
    }
    res.json({ message: 'Settings saved.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
`);

/* ═══════════════════════════════════════════════════════
   3. messagesController.js — full rebuild
═══════════════════════════════════════════════════════ */
w(BACK, 'controllers/messagesController.js', `const { v4: uuid } = require('uuid');
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
    const { rows } = await query(\`
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
    \`, [me]);
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
    const { rows } = await query(\`
      SELECT m.*,
        s.name AS sender_name, s.avatar_url AS sender_avatar, s.role AS sender_role
      FROM messages m
      JOIN users s ON s.id = m.sender_id
      WHERE (m.sender_id=$1 AND m.receiver_id=$2)
         OR (m.sender_id=$2 AND m.receiver_id=$1)
      ORDER BY m.created_at ASC
      LIMIT 200
    \`, [me, other]);
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
    const { rows } = await query(\`
      INSERT INTO messages(id, sender_id, receiver_id, content, type)
      VALUES($1,$2,$3,$4,$5) RETURNING *
    \`, [id, senderId, receiverId, content, type || 'text']);

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
    const { rows } = await query(\`
      INSERT INTO messages(id, sender_id, receiver_id, content, type)
      VALUES($1,$2,$3,$4,$5) RETURNING *
    \`, [id, senderId, receiverId, fileUrl, type]);

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
`);

/* ═══════════════════════════════════════════════════════
   4. routes/messages.js — full rebuild with multer
═══════════════════════════════════════════════════════ */
w(BACK, 'routes/messages.js', `const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const { v4: uuid } = require('uuid');
const { authenticate } = require('../middleware/authenticate');
const C = require('../controllers/messagesController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/messages'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuid() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const ok = /image|video|gif/.test(file.mimetype);
    cb(ok ? null : new Error('Only images, GIFs, and videos allowed'), ok);
  }
});

// Order matters — specific routes before :param routes
router.get('/conversations',          authenticate, C.getConversations);
router.get('/users',                  authenticate, C.getUsers);
router.get('/thread/:otherId',        authenticate, C.getThread);
router.post('/',                      authenticate, C.sendMessage);
router.post('/upload', authenticate, upload.single('file'), C.uploadFile);
router.patch('/:id/read',             authenticate, C.markRead);
router.get('/:userId',                authenticate, C.getMessages); // legacy

module.exports = router;
`);

/* ═══════════════════════════════════════════════════════
   5. pages/shared/Messages.jsx — WhatsApp-like shared component
═══════════════════════════════════════════════════════ */
w(FRONT, 'pages/shared/Messages.jsx', `import { useEffect, useState, useRef } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import { getSocket } from '../../services/socketService'
import toast from 'react-hot-toast'

const EMOJIS = [
  '😀','😂','🤣','😍','🥰','😎','🤔','😅','😭','😱',
  '🎉','👍','👎','❤️','🔥','✨','🙏','👏','🤝','💪',
  '🌟','😊','😢','😡','😴','🤯','🥳','😏','🤗','😬',
  '🫡','😶','🙄','😐','🤐','🥴','🤑','😮','🤩','😤',
  '😦','😨','😥','🤥','🫣','🤫','🤭','🤠','🥸','🤡',
  '👋','🤙','✌️','🤞','🫶','🙌','🤲','🫂','💅','🏆',
  '🎯','🎮','🎵','🍕','🍔','☕','🌹','🌈','🌙','⭐',
  '🌊','🦋','🐱','🐶','💻','📱','🎁','💌','💔','⚡',
]

const API_BASE = (typeof import !== 'undefined' && import.meta?.env?.VITE_API_URL) || 'http://localhost:5000'

function fileUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return API_BASE + url
}

function MiniAvatar({ name, size = 36 }) {
  const COLS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444']
  const col  = COLS[(name?.charCodeAt(0) || 0) % COLS.length]
  const init = (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: col, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 800, color: '#fff', userSelect: 'none',
    }}>{init}</div>
  )
}

function fmtTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function fmtFull(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Messages() {
  const { userId } = useAuthStore()
  const [convos, setConvos]       = useState([])
  const [users,  setUsers]        = useState([])
  const [active, setActive]       = useState(null)   // { id, name, role, ... }
  const [msgs,   setMsgs]         = useState([])
  const [text,   setText]         = useState('')
  const [showEmoji,   setShowEmoji]   = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [search,      setSearch]      = useState('')
  const [uSearch,     setUSearch]     = useState('')
  const [loading,     setLoading]     = useState(true)
  const [sending,     setSending]     = useState(false)
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 700)
  const [mView,       setMView]       = useState('sidebar')

  const endRef      = useRef(null)
  const fileRef     = useRef(null)
  const inputRef    = useRef(null)

  /* ── loaders ── */
  async function loadConvos() {
    try { const r = await api.get('/messages/conversations'); setConvos(r.data) } catch {}
  }
  async function loadThread(otherId) {
    try { const r = await api.get('/messages/thread/' + otherId); setMsgs(r.data) } catch {}
  }
  async function loadUsers() {
    try { const r = await api.get('/messages/users'); setUsers(r.data) } catch {}
  }

  useEffect(() => {
    Promise.all([loadConvos(), loadUsers()]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── socket ── */
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = (msg) => {
      loadConvos()
      if (active && (msg.sender_id === active.id || msg.receiver_id === active.id)) {
        setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg])
      }
    }
    socket.on('message:new', handler)
    return () => socket.off('message:new', handler)
  }, [active])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  /* ── actions ── */
  async function openChat(user) {
    setActive(user)
    setShowNewChat(false)
    if (isMobile) setMView('chat')
    setMsgs([])
    await loadThread(user.id)
    setConvos(prev => prev.map(c => c.id === user.id ? { ...c, unread_count: 0 } : c))
  }

  async function sendText() {
    if (!text.trim() || !active || sending) return
    const content = text.trim()
    setText('')
    setSending(true)
    try {
      const r = await api.post('/messages', { receiverId: active.id, content, type: 'text' })
      setMsgs(prev => [...prev, r.data])
      loadConvos()
    } catch { toast.error('Failed to send') }
    finally { setSending(false) }
  }

  async function sendFile(file) {
    if (!active) return
    if (file.size > 50 * 1024 * 1024) { toast.error('File must be under 50 MB'); return }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('receiverId', active.id)
    try {
      const r = await api.post('/messages/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsgs(prev => [...prev, r.data])
      loadConvos()
      toast.success('File sent!')
    } catch { toast.error('Upload failed') }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText() }
  }

  const filteredConvos = convos.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  )
  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(uSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(uSearch.toLowerCase())
  )

  /* ── styles ── */
  const SIDE_W = 300
  const containerH = 'calc(100vh - 100px)'

  const sidebarEl = (
    <div style={{
      width: isMobile ? '100%' : SIDE_W,
      minWidth: isMobile ? 'unset' : SIDE_W,
      height: containerH,
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface)',
      borderRight: isMobile ? 'none' : '1px solid var(--border)',
      borderRadius: isMobile ? 'var(--radius)' : 'var(--radius) 0 0 var(--radius)',
      overflow: 'hidden',
    }}>
      {/* Sidebar header */}
      <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>💬 Messages</span>
          <button onClick={() => { setShowNewChat(s => !s); setUSearch('') }} style={{
            background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8,
            padding: '5px 12px', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer',
          }}>+ New</button>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search conversations…"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: 10, padding: '8px 12px', color: 'var(--text)',
            fontSize: '.82rem', outline: 'none',
          }}
        />
      </div>

      {/* New chat user picker */}
      {showNewChat && (
        <div style={{ borderBottom: '1px solid var(--border)', flexShrink: 0, maxHeight: 200, overflowY: 'auto' }}>
          <input
            value={uSearch} onChange={e => setUSearch(e.target.value)}
            placeholder="Find user…"
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 14px',
              background: 'var(--bg)', border: 'none', borderBottom: '1px solid var(--border)',
              color: 'var(--text)', fontSize: '.82rem', outline: 'none',
            }}
          />
          {filteredUsers.map(u => (
            <div key={u.id} onClick={() => openChat(u)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <MiniAvatar name={u.name} size={32} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '.82rem', color: 'var(--text)' }}>{u.name}</p>
                <p style={{ margin: 0, fontSize: '.7rem', color: 'var(--sub)', textTransform: 'capitalize' }}>{u.role}</p>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p style={{ padding: '10px 14px', color: 'var(--sub)', fontSize: '.8rem', margin: 0 }}>No users found</p>
          )}
        </div>
      )}

      {/* Conversations list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && <p style={{ padding: 16, color: 'var(--sub)', fontSize: '.82rem' }}>Loading…</p>}
        {!loading && filteredConvos.length === 0 && (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>💬</p>
            <p style={{ color: 'var(--sub)', fontSize: '.82rem', margin: 0 }}>No conversations yet. Start one!</p>
          </div>
        )}
        {filteredConvos.map(c => {
          const isActive = active?.id === c.id
          const unread = c.unread_count || 0
          const preview = c.last_type === 'image' ? '📷 Photo'
            : c.last_type === 'video' ? '🎥 Video'
            : c.last_type === 'gif' ? '🎞 GIF'
            : c.last_message || ''
          return (
            <div key={c.id} onClick={() => openChat(c)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer',
              background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'background .15s',
            }}>
              <MiniAvatar name={c.name} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: unread > 0 ? 700 : 500, fontSize: '.88rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: '.68rem', color: 'var(--sub)', flexShrink: 0, marginLeft: 4 }}>
                    {fmtTime(c.last_at)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  <span style={{
                    fontSize: '.75rem', color: unread > 0 ? 'var(--text)' : 'var(--sub)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                    fontWeight: unread > 0 ? 600 : 400,
                  }}>
                    {preview}
                  </span>
                  {unread > 0 && (
                    <span style={{
                      background: '#ef4444', color: '#fff', borderRadius: '50%',
                      width: 18, height: 18, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '.65rem', fontWeight: 800,
                      flexShrink: 0, marginLeft: 6,
                    }}>{unread > 9 ? '9+' : unread}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const chatEl = (
    <div style={{
      flex: 1, height: containerH, display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
      borderRadius: isMobile ? 'var(--radius)' : '0 var(--radius) var(--radius) 0',
      overflow: 'hidden',
    }}>
      {!active ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span style={{ fontSize: '3rem' }}>💬</span>
          <p style={{ color: 'var(--sub)', fontWeight: 600, fontSize: '.9rem', margin: 0 }}>Select a conversation to start chatting</p>
        </div>
      ) : (
        <>
          {/* Chat header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0,
          }}>
            {isMobile && (
              <button onClick={() => setMView('sidebar')} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)',
                fontSize: '1.1rem', padding: '4px 8px 4px 0', fontWeight: 700,
              }}>←</button>
            )}
            <MiniAvatar name={active.name} size={40} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>{active.name}</p>
              <p style={{ margin: 0, fontSize: '.72rem', color: 'var(--sub)', textTransform: 'capitalize' }}>{active.role}</p>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {msgs.length === 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--sub)', fontSize: '.82rem' }}>No messages yet. Say hello! 👋</p>
              </div>
            )}
            {msgs.map((m, i) => {
              const mine = m.sender_id === userId
              const prevSame = i > 0 && msgs[i-1].sender_id === m.sender_id
              return (
                <div key={m.id || i} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: mine ? 'flex-end' : 'flex-start',
                  marginTop: prevSame ? 2 : 10,
                }}>
                  {!mine && !prevSame && (
                    <span style={{ fontSize: '.68rem', color: 'var(--sub)', marginBottom: 3, marginLeft: 4 }}>
                      {m.sender_name || 'Unknown'}
                    </span>
                  )}
                  <div style={{
                    maxWidth: '72%', padding: m.type === 'text' ? '8px 12px' : '4px',
                    borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: mine ? 'var(--accent)' : 'var(--surface)',
                    color: mine ? '#fff' : 'var(--text)',
                    boxShadow: 'var(--shadow)',
                    fontSize: '.88rem', lineHeight: 1.45,
                    border: mine ? 'none' : '1px solid var(--border)',
                    wordBreak: 'break-word',
                  }}>
                    {m.type === 'text' && <span>{m.content}</span>}
                    {(m.type === 'image' || m.type === 'gif') && (
                      <img src={fileUrl(m.content)} alt="media"
                        style={{ maxWidth: 240, maxHeight: 240, borderRadius: 12, display: 'block', cursor: 'pointer' }}
                        onClick={() => window.open(fileUrl(m.content), '_blank')}
                      />
                    )}
                    {m.type === 'video' && (
                      <video controls style={{ maxWidth: 280, borderRadius: 12, display: 'block' }}>
                        <source src={fileUrl(m.content)} />
                      </video>
                    )}
                    {m.type === 'file' && (
                      <a href={fileUrl(m.content)} target="_blank" rel="noreferrer"
                        style={{ color: mine ? '#fff' : 'var(--accent)', fontWeight: 600, fontSize: '.82rem' }}>
                        📎 Download file
                      </a>
                    )}
                  </div>
                  <span style={{ fontSize: '.62rem', color: 'var(--sub)', marginTop: 2, marginLeft: 4, marginRight: 4 }}>
                    {fmtFull(m.created_at)}
                  </span>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>

          {/* Emoji picker */}
          {showEmoji && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 4, padding: 10,
              background: 'var(--surface)', borderTop: '1px solid var(--border)',
              maxHeight: 160, overflowY: 'auto', flexShrink: 0,
            }}>
              {EMOJIS.map((em, i) => (
                <button key={i} onClick={() => { setText(t => t + em); inputRef.current?.focus() }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem',
                  padding: '3px 4px', borderRadius: 6, lineHeight: 1,
                  transition: 'background .1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >{em}</button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 8, padding: '10px 12px',
            borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0,
          }}>
            {/* Emoji toggle */}
            <button onClick={() => setShowEmoji(s => !s)} style={{
              background: showEmoji ? 'rgba(99,102,241,0.15)' : 'none',
              border: 'none', cursor: 'pointer', fontSize: '1.3rem', padding: '6px',
              borderRadius: 8, lineHeight: 1, flexShrink: 0,
            }}>😊</button>

            {/* File attach */}
            <button onClick={() => fileRef.current?.click()} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
              padding: '6px', borderRadius: 8, lineHeight: 1, flexShrink: 0,
            }}>📎</button>
            <input
              ref={fileRef} type="file" style={{ display: 'none' }}
              accept="image/*,image/gif,video/*"
              onChange={e => { if (e.target.files[0]) sendFile(e.target.files[0]); e.target.value = '' }}
            />

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type a message…"
              rows={1}
              style={{
                flex: 1, resize: 'none', background: 'var(--bg)',
                border: '1.5px solid var(--border)', borderRadius: 12,
                padding: '9px 12px', color: 'var(--text)', fontSize: '.88rem',
                outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
                maxHeight: 100, overflowY: 'auto',
              }}
            />

            {/* Send */}
            <button onClick={sendText} disabled={!text.trim() || sending} style={{
              background: text.trim() ? 'var(--accent)' : 'var(--border)',
              color: text.trim() ? '#fff' : 'var(--sub)',
              border: 'none', borderRadius: '50%', width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: text.trim() ? 'pointer' : 'default', flexShrink: 0,
              fontSize: '1rem', transition: 'background .2s',
            }}>➤</button>
          </div>
        </>
      )}
    </div>
  )

  /* ── layout ── */
  if (isMobile) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        {mView === 'sidebar' ? sidebarEl : chatEl}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', borderRadius: 'var(--radius)', overflow: 'hidden',
      boxShadow: 'var(--shadow)', border: '1px solid var(--border)',
    }}>
      {sidebarEl}
      {chatEl}
    </div>
  )
}
`);

/* ═══════════════════════════════════════════════════════
   6. teacher/Messages.jsx — re-export shared
═══════════════════════════════════════════════════════ */
w(FRONT, 'pages/teacher/Messages.jsx', `export { default } from '../shared/Messages'
`);

/* ═══════════════════════════════════════════════════════
   7. parent/Messages.jsx — re-export shared
═══════════════════════════════════════════════════════ */
w(FRONT, 'pages/parent/Messages.jsx', `export { default } from '../shared/Messages'
`);

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  All files written!

Now run this in the BACKEND folder:
  cd "C:\\Users\\pc\\Downloads\\eduapp\\backend"
  npm install multer

Then restart both servers. Done!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);