require('dotenv').config({ path: './.env' });
const bcrypt = require('bcrypt');
const { query } = require('./src/config/db');

async function run() {
  // Change these as needed
  const identifier = process.argv[2]; // email, phone or name
  const newPassword = process.argv[3] || 'School123';

  if (!identifier) {
    console.log('Usage: node unlock_student.js <email|phone|name> [newPassword]');
    console.log('Example: node unlock_student.js john@example.com School123');
    process.exit(1);
  }

  // Find the user
  const { rows } = await query(
    `SELECT id, name, email, phone, role, status, failed_login_attempts
     FROM users
     WHERE email=$1 OR phone=$1 OR name ILIKE $1
     LIMIT 1`,
    [identifier]
  );

  if (!rows.length) {
    console.log(`✗ No user found matching: ${identifier}`);
    process.exit(1);
  }

  const user = rows[0];
  console.log(`Found: ${user.name} (${user.email || user.phone}) | role: ${user.role} | status: ${user.status} | failed attempts: ${user.failed_login_attempts}`);

  // Hash new password
  const hash = await bcrypt.hash(newPassword, 12);

  // Unlock + reset password + clear attempts
  await query(
    `UPDATE users
     SET status='active',
         failed_login_attempts=0,
         password_hash=$1
     WHERE id=$2`,
    [hash, user.id]
  );

  console.log(`✓ Unlocked and password reset to: ${newPassword}`);
  console.log(`  User can now log in with their email/phone and the new password.`);
  process.exit(0);
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
