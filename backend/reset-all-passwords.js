require('dotenv').config({ path: __dirname + '/.env' });
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const PASSWORD = 'Test123';

  // 1. Hash with 10 rounds (case-sensitive — capital T, capital 1, 2, 3 preserved exactly)
  const hash = await bcrypt.hash(PASSWORD, 10);

  // 2. Verify before touching anything
  const valid = await bcrypt.compare(PASSWORD, hash);
  if (!valid) {
    console.error('HASH VERIFY FAILED — ABORTING. Nothing was changed.');
    process.exit(1);
  }
  console.log('Hash verified OK');
  console.log('New hash:', hash);
  console.log('');

  // 3. Show all users before reset
  const before = await pool.query('SELECT id, name, phone, role, password_hash FROM users ORDER BY role, name');
  console.log('======= USERS BEFORE RESET =======');
  before.rows.forEach(u => {
    console.log('Role:', u.role, '| Name:', u.name, '| Phone:', u.phone);
    console.log('Old hash:', u.password_hash);
    console.log('');
  });

  // 4. Update all — no parameterized $ to avoid PowerShell issues
  const sql = "UPDATE users SET password_hash = '" + hash + "' RETURNING id, name, role";
  const upd = await pool.query(sql);

  console.log('======= RESET RESULTS =======');
  upd.rows.forEach(u => {
    console.log('RESET OK:', u.role.padEnd(10), '|', u.name, '| id:', u.id);
  });

  // 5. Verify each account can now log in with Test123
  console.log('');
  console.log('======= VERIFY EACH ACCOUNT =======');
  const after = await pool.query('SELECT id, name, role, password_hash FROM users ORDER BY role, name');
  for (const u of after.rows) {
    const ok = await bcrypt.compare(PASSWORD, u.password_hash);
    console.log(ok ? 'PASS' : 'FAIL', '|', u.role.padEnd(10), '|', u.name);
  }

  console.log('');
  console.log('Done. ' + upd.rows.length + ' accounts reset to Test123');
  console.log('Password is case-sensitive: capital T, lowercase est, capital 1-2-3');
  await pool.end();
}

run().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
