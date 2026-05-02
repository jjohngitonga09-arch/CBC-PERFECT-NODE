const { query } = require('./src/config/db');
query("SELECT id, name, username, phone, role FROM users WHERE role='student' LIMIT 3")
  .then(r => { console.log(JSON.stringify(r.rows, null, 2)); process.exit(0) })
  .catch(e => { console.error(e.message); process.exit(1) })
