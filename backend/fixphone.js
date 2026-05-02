const { query } = require('./src/config/db');
query("UPDATE users SET phone='+254795007570' WHERE phone='0795007570' RETURNING phone")
  .then(r => { console.log('Fixed:', r.rows[0]); process.exit(0) })
  .catch(e => { console.error(e.message); process.exit(1) })
