require('dotenv').config();
const { query } = require('./src/config/db');

async function check() {
  const { rows } = await query("SELECT id, name, email, role, status FROM users WHERE email='admin@eduapp.ke'");
  console.log(rows.length ? rows[0] : 'NOT FOUND');
  process.exit(0);
}
check();
