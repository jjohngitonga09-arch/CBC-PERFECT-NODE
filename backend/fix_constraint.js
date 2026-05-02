const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  const c = await pool.connect();
  try {
    await c.query('ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check');
    const sql = "ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check CHECK (status IN ('pending','active','locked','expired','cancelled'))";
    await c.query(sql);
    console.log('[OK] constraint fixed');
  } catch(e) { console.log('[ERR]', e.message); }
  c.release();
  process.exit(0);
})();
