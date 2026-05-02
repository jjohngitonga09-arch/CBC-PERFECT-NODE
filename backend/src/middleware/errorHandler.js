const logger = require('../utils/logger');

// Map known Postgres constraint names to clean user-facing messages
const PG_CONSTRAINT_MESSAGES = {
  users_status_check:    'Account setup issue. Please contact support.',
  users_email_key:       'This email is already registered.',
  users_username_key:    'This username is already taken.',
  users_phone_key:       'This phone number is already registered.',
  users_national_id_key: 'This National ID is already registered.',
};

// Map Postgres error codes to clean messages
const PG_CODE_MESSAGES = {
  '23505': 'This record already exists.',       // unique_violation
  '23503': 'Related record not found.',          // foreign_key_violation
  '23514': 'Invalid value provided.',            // check_violation
  '22001': 'Input value is too long.',           // string_data_right_truncation
  '42703': 'Database field error. Contact support.', // undefined_column
};

function sanitizeDbError(err) {
  // Postgres errors have a .code property
  if (err.code) {
    // Check constraint  try to map by constraint name first
    if (err.code === '23514' && err.constraint) {
      return PG_CONSTRAINT_MESSAGES[err.constraint] || 'Invalid value. Please check your input.';
    }
    // Unique violation  try constraint name first
    if (err.code === '23505' && err.constraint) {
      return PG_CONSTRAINT_MESSAGES[err.constraint] || 'This record already exists.';
    }
    return PG_CODE_MESSAGES[err.code] || 'Database error. Please try again.';
  }
  return null;
}

function errorHandler(err, req, res, next) {
  // Always log full error server-side
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    message: err.message,
    code: err.code,
    constraint: err.constraint,
    stack: err.stack?.split('\n')[1]?.trim(),
  });

  // Try logger if available
  try { if (!err.isOperational) logger.error('Unhandled error', err); } catch (_) {}

  // Determine status code
  const status = err.statusCode || err.status || 500;

  // Determine clean message
  let message;
  if (err.isOperational) {
    // AppError  safe to show
    message = err.message;
  } else {
    // Try to map DB errors to clean messages
    message = sanitizeDbError(err) || 'Something went wrong. Please try again.';
  }

  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
