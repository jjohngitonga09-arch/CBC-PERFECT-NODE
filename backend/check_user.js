require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  const name = process.argv[2] || 'Student';
  const { rows } = await query(
    `SELECT u.name, u.locked, u.failed_attempts, s.status, s.expiry_date
     FROM users u
     LEFT JOIN subscriptions s ON s.user_id = u.id
     WHERE u.name ILIKE $1 LIMIT 1`,
    [name]
  );
  if (!rows.length) { console.log('No user found: ' + name); process.exit(1); }
  const r = rows[0];
  console.log('Name:           ' + r.name);
  console.log('Locked:         ' + r.locked);
  console.log('Failed attempts:' + r.failed_attempts);
  console.log('Sub status:     ' + r.status);
  console.log('Expiry:         ' + r.expiry_date);
  process.exit(0);
}

run().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
