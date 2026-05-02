const { query } = require('./src/config/db');
async function run() {
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`);
  console.log('avatar_url column added');
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
