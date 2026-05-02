-- EduApp initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id     TEXT UNIQUE,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE,
  phone           TEXT UNIQUE,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('student','guardian','teacher','admin')),
  grade           TEXT,
  class_id        UUID,
  guardian_ids    UUID[] DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','locked')),
  language_pref   TEXT DEFAULT 'en',
  last_online     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade           TEXT NOT NULL,
  subject         TEXT NOT NULL,
  skill_id        TEXT,
  title           TEXT NOT NULL,
  objective       TEXT NOT NULL,
  model_text      TEXT NOT NULL,
  practice_spec   TEXT NOT NULL,
  check_items     JSONB NOT NULL DEFAULT '[]',
  variant_urls    JSONB NOT NULL DEFAULT '{}',
  difficulty      INT DEFAULT 1,
  tags            JSONB DEFAULT '[]',
  locale          TEXT DEFAULT 'en',
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  url             TEXT NOT NULL,
  thumbnail_url   TEXT,
  subject         TEXT,
  grade           TEXT,
  teacher_id      UUID REFERENCES users(id),
  assigned_to     JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id      UUID REFERENCES users(id),
  card_ids        JSONB DEFAULT '[]',
  title           TEXT NOT NULL,
  instructions    TEXT,
  assigned_to     JSONB DEFAULT '[]',
  due_date        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   UUID REFERENCES assignments(id),
  student_id      UUID REFERENCES users(id),
  answer_text     TEXT,
  media_url       TEXT,
  status          TEXT DEFAULT 'submitted' CHECK (status IN ('submitted','graded')),
  stars           INT CHECK (stars BETWEEN 1 AND 5),
  feedback        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id       UUID REFERENCES users(id),
  receiver_id     UUID REFERENCES users(id),
  class_id        UUID,
  content         TEXT NOT NULL,
  type            TEXT DEFAULT 'text',
  read            BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID UNIQUE REFERENCES users(id),
  plan                TEXT,
  start_date          TIMESTAMPTZ,
  expiry_date         TIMESTAMPTZ,
  last_payment_date   TIMESTAMPTZ,
  amount              NUMERIC(10,2),
  status              TEXT DEFAULT 'active' CHECK (status IN ('active','expired','locked')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT,
  user_id     UUID,
  action      TEXT,
  meta        JSONB DEFAULT '{}',
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     UUID REFERENCES cards(id),
  user_id     UUID REFERENCES users(id),
  event_type  TEXT NOT NULL,
  event_data  JSONB DEFAULT '{}',
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status     ON users(status);
CREATE INDEX IF NOT EXISTS idx_cards_grade_subj ON cards(grade, subject);
CREATE INDEX IF NOT EXISTS idx_telemetry_user   ON telemetry(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_ts     ON logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_sid  ON submissions(student_id);
