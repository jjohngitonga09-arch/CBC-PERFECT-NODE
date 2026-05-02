require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { Pool } = require('pg');

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@eduapp.ke';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const hash = await bcrypt.hash(adminPass, 12);

  await pool.query(
    `INSERT INTO users(id,name,email,password_hash,role,status)
     VALUES($1,'System Admin',$2,$3,'admin','active')
     ON CONFLICT(email) DO NOTHING`,
    [uuid(), adminEmail, hash]
  );

  await pool.query(
    `INSERT INTO system_settings(key,value) VALUES('maintenance_mode','false')
     ON CONFLICT(key) DO NOTHING`
  );

  console.log('Seed complete. Admin:', adminEmail);
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
