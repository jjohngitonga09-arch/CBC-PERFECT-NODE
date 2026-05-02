const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const cmds = [
  // Store the national_id the parent used to register (already in users.national_id)
  // Add a column on students to store their linked parent's id
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS linked_parent_id UUID REFERENCES users(id)`,
  // Index for fast lookup
  `CREATE INDEX IF NOT EXISTS idx_users_linked_parent ON users(linked_parent_id)`,
];
(async () => {
  const c = await pool.connect();
  for (const cmd of cmds) {
    try { await c.query(cmd); console.log('OK:', cmd.slice(0,70)); }
    catch(e) { console.log('SKIP:', e.message.slice(0,70)); }
  }
  c.release();
  console.log('\nMigration 9 complete!');
  process.exit(0);
})();
