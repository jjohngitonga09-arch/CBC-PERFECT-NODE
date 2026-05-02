
require("dotenv").config();
const { Pool } = require("pg");
const p = new Pool({ connectionString: process.env.DATABASE_URL });
const sqls = [
  "CREATE TABLE IF NOT EXISTS video_views (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), video_id UUID REFERENCES videos(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id) ON DELETE CASCADE, last_watched TIMESTAMPTZ DEFAULT now(), UNIQUE(video_id, user_id))",
  "CREATE INDEX IF NOT EXISTS idx_video_views_video ON video_views(video_id)",
  "CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)",
  "CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)",
  "CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id)",
  "CREATE INDEX IF NOT EXISTS idx_videos_grade ON videos(grade, subject)",
  "CREATE INDEX IF NOT EXISTS idx_users_class ON users(class_id)"
];
async function run() {
  for (const s of sqls) {
    await p.query(s);
    console.log("OK:", s.slice(0, 70));
  }
  await p.end();
  console.log("Migration 4 complete!");
}
run().catch(e => { console.error(e.message); p.end(); });
