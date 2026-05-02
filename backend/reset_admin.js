const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

bcrypt.hash('Admin1234', 10).then(hash => {
  pool.query('UPDATE users SET password_hash=$1 WHERE email=$2', [hash, 'admin@eduapp.ke'])
    .then(r => {
      if (r.rowCount === 0) console.log('No user found with that email!');
      else console.log('✅ Password reset! Login with: admin@eduapp.ke / Admin1234');
      pool.end();
    })
    .catch(e => { console.error(e.message); pool.end(); });
});
