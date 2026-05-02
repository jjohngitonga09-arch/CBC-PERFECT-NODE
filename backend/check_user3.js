require("dotenv").config();
const { query } = require("./src/config/db");
async function run() {
  const { rows: cols } = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position");
  console.log("Columns:", cols.map(c => c.column_name).join(", "));
  const { rows } = await query("SELECT * FROM users WHERE name ILIKE 'Student' LIMIT 1");
  console.log("Student:", rows[0]);
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
