require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    const cmds = [
      // Notifications table
      `CREATE TABLE IF NOT EXISTS notifications (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL,
        title      TEXT,
        message    TEXT,
        type       TEXT DEFAULT 'system',
        read       BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      // Add plan_id to subscriptions if missing
      `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id TEXT DEFAULT 'standard'`,
      // Add amount column if missing
      `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2) DEFAULT 0`,
      // Add last_payment_date if missing
      `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ`,
      // Add expiry_date if missing
      `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ`,
      // Unique constraint on subscriptions user_id
      `DO $$ BEGIN
         ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_unique UNIQUE(user_id);
       EXCEPTION WHEN duplicate_table THEN NULL;
       END $$`,
      // Telemetry table
      `CREATE TABLE IF NOT EXISTS telemetry (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        card_id    UUID,
        user_id    UUID,
        event_type TEXT,
        event_data JSONB DEFAULT '{}',
        timestamp  TIMESTAMPTZ DEFAULT NOW()
      )`,
      // Logs table
      `CREATE TABLE IF NOT EXISTS logs (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type      TEXT,
        user_id   UUID,
        action    TEXT,
        meta      JSONB DEFAULT '{}',
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )`,
      // Messages read column
      `ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false`,
      // Messages type column
      `ALTER TABLE messages ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text'`,
    ];

    for (const cmd of cmds) {
      try {
        await client.query(cmd);
        console.log('OK:', cmd.slice(0, 70).replace(/\n/g, ' ').trim());
      } catch(e) {
        console.log('SKIP (already exists):', e.message.slice(0, 60));
      }
    }

    console.log('\nMigration 2 complete!');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(e => { console.error(e); process.exit(1); });
