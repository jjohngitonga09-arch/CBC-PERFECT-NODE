const { query } = require('./src/config/db');
query("SELECT failed_login_attempts, status, username, phone FROM users WHERE phone='0795007570'")
  .then(r => { console.log(JSON.stringify(r.rows[0], null, 2)); process.exit(0) })
  .catch(e => { console.error(e.message); process.exit(1) })
