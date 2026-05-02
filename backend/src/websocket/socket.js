const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const onlineUsers = new Map();
let _io = null;

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });
  _io = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    logger.info(`Socket auth attempt - token present: ${!!token}`);
    if (!token) return next(new Error('Unauthorised'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch(e) { 
      logger.info(`Socket auth failed: ${e.message}`);
      next(new Error('Invalid token')); 
    }
  });

  io.on('connection', (socket) => {
    const { id: userId, role } = socket.user;
    onlineUsers.set(userId, { socketId: socket.id, role });
    logger.info(`Socket connected: ${userId} (${role}) - total online: ${onlineUsers.size}`);
    io.emit('presence:update', { userId, online: true });

    socket.on('message:send', (data) => {
      const t = onlineUsers.get(data.receiverId);
      if (t) io.to(t.socketId).emit('message:new', { ...data, senderId: userId, ts: new Date() });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('presence:update', { userId, online: false });
      logger.info(`Socket disconnected: ${userId} - total online: ${onlineUsers.size}`);
    });
  });

  return io;
}

function kickUser(userId, reason = 'account_locked') {
  const entry = onlineUsers.get(userId);
  logger.info(`kickUser: ${userId}, found: ${!!entry}, reason: ${reason}`);
  if (entry && _io) _io.to(entry.socketId).emit('force:logout', { reason });
}

function kickRole(role, reason = 'dashboard_locked') {
  if (!_io) return;
  let count = 0;
  for (const [, entry] of onlineUsers.entries()) {
    if (entry.role === role) { _io.to(entry.socketId).emit('force:logout', { reason }); count++; }
  }
  logger.info(`kickRole: ${role}, kicked: ${count} users`);
}

function notifyRole(role, event, payload = {}) {
  if (!_io) return;
  let count = 0;
  for (const [uid, entry] of onlineUsers.entries()) {
    if (entry.role === role) { _io.to(entry.socketId).emit(event, payload); count++; }
  }
  logger.info(`notifyRole: ${role}, event: ${event}, notified: ${count} users, onlineUsers: ${onlineUsers.size}`);
}

function notifyUser(userId, event, payload = {}) {
  if (!_io) return;
  const entry = onlineUsers.get(userId);
  if (entry) _io.to(entry.socketId).emit(event, payload);
}

function getIo()          { return _io; }
function getOnlineCount() { return onlineUsers.size; }

module.exports = { initSocket, kickUser, kickRole, notifyRole, notifyUser, getIo, getOnlineCount };
