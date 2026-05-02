const { getRedis } = require('../config/redis');
const logger = require('../utils/logger');

const OTP_TTL = parseInt(process.env.OTP_TTL || '300', 10);

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createOtp(identifier) {
  const code = genCode();
  const redis = getRedis();
  await redis.set(`otp:${identifier}`, code, 'EX', OTP_TTL);
  logger.info(`OTP created for ${identifier} (TTL ${OTP_TTL}s)`);
  return code;
}

async function verifyOtp(identifier, code) {
  const redis = getRedis();
  const stored = await redis.get(`otp:${identifier}`);
  if (!stored || stored !== code) return false;
  await redis.del(`otp:${identifier}`);
  return true;
}

module.exports = { createOtp, verifyOtp };
