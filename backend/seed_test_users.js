const { query } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function main() {
  const hash = await bcrypt.hash('Test1234', 10);

  const students = [
    { name:'Alice Kamau',   username:'alice_g3', grade:'Grade 3' },
    { name:'Brian Otieno',  username:'brian_g4', grade:'Grade 4' },
    { name:'Clara Wanjiku', username:'clara_g5', grade:'Grade 5' },
    { name:'David Mwangi',  username:'david_g6', grade:'Grade 6' },
    { name:'Eva Achieng',   username:'eva_g1',   grade:'Grade 1' },
    { name:'Felix Kiprop',  username:'felix_g2', grade:'Grade 2' },
  ];

  const parents = [
    { name:'Parent Alice',  username:'parent_alice',  national_id:'NAT001' },
    { name:'Parent Brian',  username:'parent_brian',  national_id:'NAT002' },
    { name:'Parent Clara',  username:'parent_clara',  national_id:'NAT003' },
  ];

  console.log('\n=== CREATING STUDENTS ===');
  const studentIds = {};
  for (const s of students) {
    // Delete if exists first
    await query(`DELETE FROM users WHERE username=$1`, [s.username]);
    const { rows } = await query(
      `INSERT INTO users(name, username, role, grade, password_hash, status)
       VALUES($1,$2,'student',$3,$4,'active') RETURNING id`,
      [s.name, s.username, s.grade, hash]
    );
    studentIds[s.username] = rows[0].id;
    console.log(`✓ Student: ${s.username} | ${s.grade} | id: ${rows[0].id}`);
  }

  console.log('\n=== CREATING PARENTS ===');
  const parentIds = {};
  for (const p of parents) {
    await query(`DELETE FROM users WHERE username=$1`, [p.username]);
    const { rows } = await query(
      `INSERT INTO users(name, username, role, national_id, password_hash, status)
       VALUES($1,$2,'guardian',$3,$4,'active') RETURNING id`,
      [p.name, p.username, p.national_id, hash]
    );
    parentIds[p.username] = rows[0].id;
    console.log(`✓ Parent: ${p.username} | national_id: ${p.national_id} | id: ${rows[0].id}`);
  }

  console.log('\n=== LINKING PARENTS TO STUDENTS ===');
  const links = [
    { student:'alice_g3', parent:'parent_alice' },
    { student:'brian_g4', parent:'parent_brian' },
    { student:'clara_g5', parent:'parent_clara' },
  ];
  for (const l of links) {
    await query(
      `UPDATE users SET linked_parent_id=$1 WHERE id=$2`,
      [parentIds[l.parent], studentIds[l.student]]
    );
    console.log(`✓ ${l.student} linked to ${l.parent}`);
  }

  console.log('\n=== FINAL CHECK ===');
  const { rows } = await query(`
    SELECT s.username as student, s.grade, p.username as parent
    FROM users s
    LEFT JOIN users p ON p.id = s.linked_parent_id
    WHERE s.role='student' AND s.username LIKE '%_g%'
    ORDER BY s.grade
  `);
  console.table(rows);

  console.log('\n=== LOGIN CREDENTIALS (all use password: Test1234) ===');
  console.log('STUDENTS:');
  students.forEach(s => console.log(`  ${s.username.padEnd(15)} | ${s.grade}`));
  console.log('PARENTS:');
  parents.forEach(p => console.log(`  ${p.username.padEnd(15)} | national_id: ${p.national_id}`));

  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
