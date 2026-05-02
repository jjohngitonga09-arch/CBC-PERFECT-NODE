
const tokenBlacklist = new Set(); // In production use Redis

function blacklistToken(token) {
  tokenBlacklist.add(token);
  // Auto-clean after 7 days (JWT expiry)
  setTimeout(() => tokenBlacklist.delete(token), 7 * 24 * 60 * 60 * 1000);
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

module.exports = { blacklistToken, isTokenBlacklisted };
