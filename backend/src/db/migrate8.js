const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const cmds = [
  `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS grade      TEXT`,
  `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS subject    TEXT`,
  `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS objective  TEXT`,
  `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS file_url   TEXT`,
  `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS file_name  TEXT`,
  `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS tags       JSONB DEFAULT '[]'`,
];
(async () => {
  const c = await pool.connect();
  for (const cmd of cmds) {
    try { await c.query(cmd); console.log('OK:', cmd.slice(0,60)); }
    catch(e) { console.log('SKIP:', e.message.slice(0,60)); }
  }
  c.release();
  console.log('\nMigration 8 complete!');
  process.exit(0);
})();
