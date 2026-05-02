require('dotenv').config();
const bcrypt = require('bcrypt');
const { query } = require('./src/config/db');

async function run() {
  const identifier = process.argv[2];
  const newPassword = process.argv[3];

  // No args — just list locked users
  if (!identifier) {
    const { rows } = await query(
      "SELECT name, email, phone, role, status FROM users WHERE status IN ('locked','suspended','banned') ORDER BY name"
    );
    if (!rows.length) {
      console.log('No locked users found.');
    } else {
      console.log('Locked users:');
      rows.forEach(u => console.log(`  - ${u.name} | ${u.email || u.phone} | ${u.role} | ${u.status}`));
    }
    process.exit(0);
  }

  // Find user
  const { rows } = await query(
    "SELECT id, name, email, phone, role, status, failed_login_attempts FROM users WHERE email=$1 OR phone=$1 OR name ILIKE $1 LIMIT 1",
    [identifier]
  );

  if (!rows.length) {
    console.log('No user found matching: ' + identifier);
    process.exit(1);
  }

  const user = rows[0];
  console.log('Found: ' + user.name + ' | ' + (user.email || user.phone) + ' | ' + user.role + ' | ' + user.status);

  const updates = newPassword
    ? await bcrypt.hash(newPassword, 12).then(hash =>
        query("UPDATE users SET status='active', failed_login_attempts=0, password_hash=$1 WHERE id=$2", [hash, user.id])
      )
    : await query("UPDATE users SET status='active', failed_login_attempts=0 WHERE id=$1", [user.id]);

  console.log('Unlocked: ' + user.name + (newPassword ? ' | New password: ' + newPassword : ''));
  process.exit(0);
}

run().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
