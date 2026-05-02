const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const users = [
      { name: 'Admin',   email: 'admin@school.com',   password: 'admin1234',   role: 'admin',    phone: null,         national_id: null },
      { name: 'Student', email: 'student@school.com', password: 'student123',  role: 'student',  phone: '0795007570', national_id: null },
      { name: 'Parent',  email: 'parent@school.com',  password: 'parent123',   role: 'guardian', phone: '0114507174', national_id: '40824367' },
      { name: 'Teacher', email: 'teacher@school.com', password: 'teacher123',  role: 'teacher',  phone: '0110911910', national_id: '456733' },
    ];
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        'INSERT INTO users (name, email, phone, password_hash, role, national_id, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [u.name, u.email, u.phone, hash, u.role, u.national_id, 'active']
      );
      console.log('Created:', u.email);
    }
    pool.end();
  } catch(e) {
    console.error(e.message);
    pool.end();
  }
})();