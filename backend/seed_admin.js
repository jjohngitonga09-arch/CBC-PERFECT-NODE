require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { query } = require('./src/config/db');

async function seed() {
  const hash = await bcrypt.hash('Admin@1234', 12);
  const id   = uuid();
  await query(`
    INSERT INTO users (id, name, email, password_hash, role, status)
    VALUES ($1, $2, $3, $4, 'admin', 'active')
    ON CONFLICT (email) DO UPDATE SET password_hash = $4, status = 'active'
  `, [id, 'Admin', 'admin@eduapp.ke', hash]);
  console.log('Admin seeded! Email: admin@eduapp.ke  Password: Admin@1234');
  process.exit(0);
}

seed().catch(e => { console.error(e.message); process.exit(1); });
