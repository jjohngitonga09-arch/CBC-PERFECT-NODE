require("dotenv").config();
const { Pool } = require("pg");
const p = new Pool({ connectionString: process.env.DATABASE_URL });

const sqls = [
  "CREATE TABLE IF NOT EXISTS classes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, grade TEXT, teacher_id UUID REFERENCES users(id), subject TEXT, created_at TIMESTAMPTZ DEFAULT now())",
  "CREATE TABLE IF NOT EXISTS password_reset_tokens (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, token TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, used BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now())",
  "CREATE TABLE IF NOT EXISTS quiz_attempts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_id UUID REFERENCES users(id), card_id UUID REFERENCES cards(id), score INTEGER, answers JSONB DEFAULT '[]', completed_at TIMESTAMPTZ DEFAULT now())",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS otp TEXT",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires TIMESTAMPTZ",
  "ALTER TABLE assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'",
  "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ",
  "ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_url TEXT"
];

async function run() {
  for (const s of sqls) {
    await p.query(s);
    console.log("OK:", s.slice(0, 60));
  }
  await p.end();
  console.log("Migration 3 complete!");
}
run().catch(e => { console.error(e.message); p.end(); });