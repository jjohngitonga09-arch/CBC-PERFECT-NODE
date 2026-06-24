const pool = require('../db/pool');
pool.query(`
  CREATE TABLE IF NOT EXISTS video_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES video_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS idx_video_comments_video_id ON video_comments(video_id);
`).then(() => { console.log('video_comments table ready'); process.exit(0); })
  .catch(e => { console.error(e.message); process.exit(1); });
