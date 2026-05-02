require('dotenv').config();
const { query } = require('./src/config/db');

async function migrate() {
  const cmds = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'",
    `CREATE TABLE IF NOT EXISTS unlock_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200),
      phone VARCHAR(20),
      reason TEXT,
      role VARCHAR(20) DEFAULT 'student',
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )`,
  ];

  for (const cmd of cmds) {
    try {
      await query(cmd);
      console.log('OK:', cmd.slice(0, 60));
    } catch (e) {
      console.error('ERR:', e.message);
    }
  }

  console.log('\nDone! All columns added.');
  process.exit(0);
}

migrate();
