require('dotenv').config();
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function connectDB() {
  const client = await pool.connect();
  const { rows } = await client.query('SELECT version()');
  logger.info(`PostgreSQL connected: ${rows[0].version.split(' ').slice(0,2).join(' ')}`);
  client.release();
}

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  logger.debug(`query [${Date.now() - start}ms]: ${text.substring(0, 80)}`);
  return res;
}

module.exports = { pool, connectDB, query };

