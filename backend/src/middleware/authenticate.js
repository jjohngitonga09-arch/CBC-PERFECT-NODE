const jwt      = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { query } = require('../config/db');

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return next(new AppError('Missing token', 401));

  try {
    const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);

    // Live DB check — enforces lock/suspend/bin/terminated on every request
    const { rows } = await query(
      'SELECT status, suspended_until FROM users WHERE id=$1',
      [payload.id]
    );
    const user = rows[0];

    // User not in DB at all = permanently deleted
    if (!user)
      return next(new AppError('ACCOUNT_TERMINATED', 403));

    if (user.status === 'locked')
      return next(new AppError('Account is locked', 403));

    if (user.status === 'bin')
      return next(new AppError('Account not found', 401));

    if (user.status === 'terminated')
      return next(new AppError('ACCOUNT_TERMINATED', 403));

    if (user.status === 'suspended') {
      const stillSuspended = user.suspended_until && new Date(user.suspended_until) > new Date();
      if (stillSuspended)
        return next(new AppError(`Account suspended until ${user.suspended_until}`, 403));
      // Suspension expired — auto-lift it
      await query(
        "UPDATE users SET status='active', suspended_until=NULL WHERE id=$1",
        [payload.id]
      );
    }

    req.user = payload; // { id, role, linkedStudentIds }
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
      return next(new AppError('Invalid or expired token', 401));
    next(err);
  }
}

module.exports = { authenticate };
