const { Pool } = require('pg')
require('dotenv').config()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const cmds = [
  `CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, price NUMERIC(10,2) NOT NULL,
    period TEXT DEFAULT 'month', color TEXT DEFAULT '#6366f1',
    features JSONB DEFAULT '[]', sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true, updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS payment_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT, user_role TEXT, plan_id TEXT, plan_name TEXT,
    amount NUMERIC(10,2), phone TEXT, mpesa_ref TEXT, message TEXT,
    status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id   TEXT`,
  `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_name TEXT`,
  `ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ`,
  `INSERT INTO subscription_plans(id,name,price,period,color,features,sort_order) VALUES
   ('basic','Basic',399,'month','#06b6d4','[{"text":"1 student account","included":true},{"text":"Core assignments","included":true},{"text":"Video access","included":true},{"text":"Priority support","included":false},{"text":"Dedicated tutor","included":false}]',1),
   ('standard','Standard',699,'month','#f59e0b','[{"text":"Up to 3 student accounts","included":true},{"text":"Core assignments","included":true},{"text":"Video access","included":true},{"text":"Priority support","included":true},{"text":"Dedicated tutor","included":false}]',2),
   ('premium','Premium',999,'month','#8b5cf6','[{"text":"Unlimited student accounts","included":true},{"text":"Core assignments","included":true},{"text":"Video access","included":true},{"text":"Priority support","included":true},{"text":"Dedicated tutor","included":true}]',3)
   ON CONFLICT(id) DO NOTHING`
]
;(async()=>{
  const c=await pool.connect()
  for(const cmd of cmds){
    try{await c.query(cmd);console.log('OK:',cmd.slice(0,55).replace(/\n/g,' '))}
    catch(e){console.log('SKIP:',e.message.slice(0,55))}
  }
  c.release();console.log('\nMigration 7 complete!');process.exit(0)
})()
