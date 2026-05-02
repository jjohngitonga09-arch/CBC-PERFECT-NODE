const bcrypt = require('bcrypt');
const { query } = require('./src/config/db');
query("SELECT password_hash FROM users WHERE phone='0795007570'")
  .then(async r => {
    const hash = r.rows[0].password_hash;
    console.log('Hash:', hash);
    const match = await bcrypt.compare('Test1234!', hash);
    console.log('Password matches:', match);
    process.exit(0)
  })
  .catch(e => { console.error(e.message); process.exit(1) })
