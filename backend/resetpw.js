const bcrypt = require('bcrypt');
const { query } = require('./src/config/db');
bcrypt.hash('Test1234!', 10).then(hash => {
  return query("UPDATE users SET password_hash=$1 WHERE phone='0795007570' RETURNING id,name,phone", [hash])
}).then(r => { console.log('Reset OK:', r.rows[0]); process.exit(0) })
  .catch(e => { console.error(e.message); process.exit(1) })
