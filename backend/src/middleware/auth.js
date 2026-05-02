const { isTokenBlacklisted } = require("./tokenBlacklist");
const jwt        = require('jsonwebtoken');
const { query }  = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(header.split(' ')[1], JWT_SECRET);

    // Live DB check — enforces lock/suspend/bin on every request
    const { rows } = await query(
      'SELECT status FROM users WHERE id=$1',
      [payload.id]
    );
    const user = rows[0];

    if (!user || user.status === 'bin')
      return res.status(401).json({ error: 'User not found' });

    if (user.status === 'locked')
      return res.status(403).json({ error: 'Account is locked' });

    if (user.status === 'suspended')
      return res.status(403).json({ error: 'Account is suspended' });

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });
  next();
};
