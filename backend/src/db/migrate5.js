const { query } = require('../config/db');
async function migrate5() {
  await query(`CREATE TABLE IF NOT EXISTS studytime_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    grade VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    visited_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, grade, subject, topic)
  )`);
  await query(`CREATE TABLE IF NOT EXISTS studytime_favourites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    grade VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, grade, subject, topic)
  )`);
  await query(`CREATE TABLE IF NOT EXISTS studytime_quiz_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    grade VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    taken_at TIMESTAMP DEFAULT NOW()
  )`);
  console.log('[migrate5] studytime tables created');
}
migrate5().catch(console.error).finally(() => process.exit());
