const Redis  = require('ioredis');
const logger = require('../utils/logger');

let client;

async function connectRedis() {
  try {
    client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 200, 2000),
      lazyConnect: true,
    });
    client.on('connect', () => logger.info('Redis connected'));
    client.on('error',  (e) => logger.error('Redis error: ' + e.message));
    await client.ping();
    logger.info('Redis ready');
  } catch(e) {
    logger.error('Redis failed to connect: ' + e.message);
    client = null;
  }
}

function getRedis() {
  if (!client) throw new Error('Redis not initialised');
  return client;
}

module.exports = { connectRedis, getRedis };
