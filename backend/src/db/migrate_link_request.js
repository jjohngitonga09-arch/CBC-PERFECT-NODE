require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_linked_parent_id UUID`);
    await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'`);
    await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_taken BOOLEAN DEFAULT false`);
    console.log('Migration OK');
  } catch(e){ console.error(e.message); }
  finally { client.release(); await pool.end(); }
})();
