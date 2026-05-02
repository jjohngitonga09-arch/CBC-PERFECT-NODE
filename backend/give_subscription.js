require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  const identifier = process.argv[2];

  if (!identifier) {
    console.log('Usage: node give_subscription.js <email|phone|name>');
    process.exit(1);
  }

  const { rows } = await query(
    "SELECT id, name, email, role FROM users WHERE email=$1 OR phone=$1 OR name ILIKE $1 LIMIT 1",
    [identifier]
  );

  if (!rows.length) {
    console.log('No user found matching: ' + identifier);
    process.exit(1);
  }

  const user = rows[0];
  console.log('Found: ' + user.name + ' | ' + (user.email || '') + ' | ' + user.role);

  await query(
    `INSERT INTO subscriptions (user_id, plan, status, amount, last_payment_date, expiry_date)
     VALUES ($1, 'basic', 'active', 0, NOW(), NOW() + INTERVAL '1 year')
     ON CONFLICT (user_id)
     DO UPDATE SET status='active', expiry_date=NOW() + INTERVAL '1 year', last_payment_date=NOW()`,
    [user.id]
  );

  console.log('✓ Active subscription granted to ' + user.name + ' (1 year, free)');
  process.exit(0);
}

run().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
