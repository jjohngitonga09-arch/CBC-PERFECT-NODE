const { query } = require('./src/config/db');
query("SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position")
  .then(r => { console.log(r.rows.map(x=>x.column_name).join(', ')); process.exit(0) })
  .catch(e => { console.error(e.message); process.exit(1) })
