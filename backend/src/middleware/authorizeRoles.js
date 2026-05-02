const AppError = require('../utils/AppError');

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return next(new AppError('Forbidden: insufficient role', 403));
    next();
  };
}

module.exports = { authorizeRoles };
