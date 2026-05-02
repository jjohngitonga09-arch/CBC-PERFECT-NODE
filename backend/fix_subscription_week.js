require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  const name = process.argv[2] || 'Student';
  await query(
    `UPDATE subscriptions SET expiry_date = NOW() + INTERVAL '7 days', last_payment_date = NOW()
     WHERE user_id = (SELECT id FROM users WHERE name ILIKE $1 LIMIT 1)`,
    [name]
  );
  console.log(`✓ Subscription for "${name}" set to 1 week from now`);
  process.exit(0);
}

run().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
