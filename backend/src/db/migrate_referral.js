const pool = require("../config/db");

async function migrate() {
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS referred_by VARCHAR(100) DEFAULT NULL;
  `);
  console.log("Done - referred_by column added to users");
  process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
