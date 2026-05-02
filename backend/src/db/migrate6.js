
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const cmds = [
  `ALTER TABLE logs ADD COLUMN IF NOT EXISTS ip        TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0`,
  `ALTER TABLE logs ADD COLUMN IF NOT EXISTS role      TEXT`,
  `ALTER TABLE logs ADD COLUMN IF NOT EXISTS user_name TEXT`,
  `ALTER TABLE logs ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0`,
  `CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action)`,
  `CREATE INDEX IF NOT EXISTS idx_logs_ts     ON logs(timestamp DESC)`,
];

(async () => {
  const client = await pool.connect();
  for (const cmd of cmds) {
    try { await client.query(cmd); console.log('OK:', cmd.slice(0,60)); }
    catch(e) { console.log('SKIP:', e.message.slice(0,60)); }
  }
  client.release();
  console.log('\nMigration 6 complete!');
  process.exit(0);
})();
