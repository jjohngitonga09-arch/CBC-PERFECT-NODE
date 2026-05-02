require('dotenv').config({ path: './backend/.env' });
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const LOGIN    = 'student_username_or_email';  // <-- change this
const PASSWORD = 'NewPass123';                  // <-- change this

async function run() {
  const hash = await bcrypt.hash(PASSWORD, 12);
  const r = await pool.query(
    `UPDATE users
     SET password_hash = $1,
         failed_login_attempts = 0,
         status = CASE WHEN status = 'locked' THEN 'active' ELSE status END
     WHERE (username = $2 OR email = $2) AND status != 'deleted'
     RETURNING id, name, username, email, role, status`,
    [hash, LOGIN]
  );
  if (!r.rows.length) console.log('ERROR: user not found —', LOGIN);
  else console.log('SUCCESS:', JSON.stringify(r.rows[0], null, 2));
  await pool.end();
}
run().catch(e => { console.error('FAILED:', e.message); process.exit(1); });