require('dotenv').config();
const {Pool}=require('pg');
const p=new Pool({connectionString:process.env.DATABASE_URL});
async function run(){
  const q1=await p.query(\$sql1\);
  const q2=await p.query(\$sql2\);
  const q3=await p.query(\$sql3\);
  console.log('===COLUMNS===');
  console.log(JSON.stringify(q1.rows,null,2));
  console.log('===INDEXES===');
  console.log(JSON.stringify(q2.rows,null,2));
  console.log('===CONSTRAINTS===');
  console.log(JSON.stringify(q3.rows,null,2));
  await p.end();
}
run().catch(e=>{console.error(e.message);process.exit(1)});
