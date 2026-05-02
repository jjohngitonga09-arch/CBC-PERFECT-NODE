const bcrypt = require('bcrypt');
const { query } = require('./src/config/db');
async function run() {
  // Reset failed attempts
  await query("UPDATE users SET failed_login_attempts=0 WHERE phone='+254795007570'")
  // Re-hash password to be sure
  const hash = await bcrypt.hash('Test1234!', 12)
  await query("UPDATE users SET password_hash=$1 WHERE phone='+254795007570'", [hash])
  const { rows } = await query("SELECT id,name,phone,status,failed_login_attempts FROM users WHERE phone='+254795007570'")
  console.log('User:', JSON.stringify(rows[0], null, 2))
  process.exit(0)
}
run().catch(e => { console.error(e.message); process.exit(1) })
