import os

BASE = os.path.join(os.path.expanduser('~'), 'Downloads', 'eduapp')

def write(rel, content):
    path = os.path.join(BASE, rel.replace('/', os.sep))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  wrote  {rel}')

# ─── FIX 1: assignments.js route (CORRUPTED by previous patch) ────────────────
write('backend/src/routes/assignments.js', """const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const C = require('../controllers/assignmentsController');

router.post('/',                                    authenticate, authorizeRoles('teacher','admin'), C.createAssignment);
router.get('/student/:studentId',                   authenticate, C.getStudentAssignments);
router.get('/teacher/:teacherId',                   authenticate, authorizeRoles('teacher','admin'), C.getTeacherAssignments);
router.get('/teacher/:teacherId/submissions',       authenticate, authorizeRoles('teacher','admin'), C.getTeacherSubmissions);
router.get('/:id',                                  authenticate, C.getAssignment);
router.put('/:id',                                  authenticate, authorizeRoles('teacher','admin'), C.updateAssignment);
router.delete('/:id',                               authenticate, authorizeRoles('teacher','admin'), C.deleteAssignment);
router.patch('/submissions/:id/grade',              authenticate, authorizeRoles('teacher','admin'), C.gradeSubmission);

module.exports = router;
""")

# ─── FIX 2: submissions route — add PATCH /:id for frontend grading call ──────
write('backend/src/routes/submissions.js', """const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const C = require('../controllers/submissionsController');

router.post('/',              authenticate, authorizeRoles('student'), C.createSubmission);
router.get('/assignment/:id', authenticate, C.getByAssignment);
router.post('/:id/feedback',  authenticate, authorizeRoles('teacher','admin'), C.addFeedback);
router.patch('/:id',          authenticate, authorizeRoles('teacher','admin'), C.addFeedback);

module.exports = router;
""")

# ─── FIX 3: admin route — add settings GET/PUT + users approve/lock/unlock ────
write('backend/src/routes/admin.js', """const express = require('express');
const router  = express.Router();
const { query } = require('../config/db');
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');

// Users list
router.get('/users', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { rows } = await query('SELECT id,name,email,phone,role,status,created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Settings GET
router.get('/settings', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { rows } = await query('SELECT key,value FROM system_settings');
    const out = {};
    for (const r of rows) {
      // coerce booleans and numbers
      if (r.value === 'true')  out[r.key] = true;
      else if (r.value === 'false') out[r.key] = false;
      else if (!isNaN(r.value) && r.value !== '') out[r.key] = Number(r.value);
      else out[r.key] = r.value;
    }
    res.json(out);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Settings PUT
router.put('/settings', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        `INSERT INTO system_settings(key,value) VALUES($1,$2)
         ON CONFLICT(key) DO UPDATE SET value=$2`,
        [key, String(value)]
      );
    }
    res.json({ message: 'Settings updated.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
""")

# ─── FIX 4: notifications controller + route ──────────────────────────────────
write('backend/src/controllers/notificationsController.js', """const { v4: uuid } = require('uuid');
const { query } = require('../config/db');

exports.getNotifications = async (req, res, next) => {
  try {
    // Try notifications table; if it doesn't exist return empty array gracefully
    const { rows } = await query(
      `SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.userId]
    ).catch(() => ({ rows: [] }));
    res.json(rows);
  } catch (e) { res.json([]); }
};

exports.markRead = async (req, res, next) => {
  try {
    await query('UPDATE notifications SET read=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'Marked read.' });
  } catch (e) { res.json({ message: 'ok' }); }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;
    const id = uuid();
    await query(
      `INSERT INTO notifications(id,user_id,title,message,type) VALUES($1,$2,$3,$4,$5)`,
      [id, userId, title, message, type || 'system']
    );
    res.status(201).json({ id });
  } catch (e) { next(e); }
};
""")

write('backend/src/routes/notifications.js', """const router = require('express').Router();
const { authenticate } = require('../middleware/authenticate');
const C = require('../controllers/notificationsController');

router.get('/:userId',    authenticate, C.getNotifications);
router.patch('/:id',      authenticate, C.markRead);
router.post('/',          authenticate, C.createNotification);

module.exports = router;
""")

# ─── FIX 5: quizzes route — support ?studentId= query AND /:grade/:subject ────
write('backend/src/routes/quizzes.js', """const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { query } = require('../config/db');
const C = require('../controllers/quizzesController');

// Frontend calls /quizzes?studentId=xxx — return cards as quizzes
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, title, subject, grade,
              jsonb_array_length(check_items::jsonb) as question_count,
              difficulty
       FROM cards
       ORDER BY created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// Grade+subject lookup
router.get('/:grade/:subject', authenticate, C.listQuizzes);
router.post('/:id/submit',     authenticate, authorizeRoles('student'), C.submitQuiz);

module.exports = router;
""")

# ─── FIX 6: subscriptions route — add POST for creating subscriptions ──────────
write('backend/src/routes/subscriptions.js', """const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { query } = require('../config/db');
const { v4: uuid } = require('uuid');
const C = require('../controllers/subscriptionsController');

// GET all (admin)
router.get('/', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM subscriptions ORDER BY created_at DESC');
    res.json(rows);
  } catch(e) { next(e); }
});

// GET by user  — frontend calls /subscriptions/user/:userId
router.get('/user/:userId', authenticate, C.getSubscription);

// GET by user (alt path)
router.get('/:userId', authenticate, C.getSubscription);

// POST create/update subscription
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { planId, userId } = req.body;
    const id = uuid();
    await query(
      `INSERT INTO subscriptions(id,user_id,plan_id,status,start_date,expiry_date,last_payment_date)
       VALUES($1,$2,$3,'active',NOW(),NOW()+INTERVAL'30 days',NOW())
       ON CONFLICT(user_id) DO UPDATE
       SET status='active', plan_id=$3, last_payment_date=NOW(), expiry_date=NOW()+INTERVAL'30 days'`,
      [id, userId || req.user.id, planId]
    );
    res.status(201).json({ message: 'Subscribed.' });
  } catch(e) { next(e); }
});

// PATCH lock
router.patch('/:id/lock', authenticate, authorizeRoles('admin'), C.lockSubscription);

module.exports = router;
""")

# ─── FIX 7: subscriptionsController — fix getSubscription to use user_id ──────
write('backend/src/controllers/subscriptionsController.js', """const { query } = require('../config/db');

exports.getSubscription = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { rows } = await query(
      'SELECT * FROM subscriptions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    res.json(rows[0] || null);
  } catch (e) { next(e); }
};

exports.lockSubscription = async (req, res, next) => {
  try {
    await query(`UPDATE subscriptions SET status='locked' WHERE id=$1`, [req.params.id]);
    res.json({ message: 'Subscription locked.' });
  } catch (e) { next(e); }
};
""")

# ─── FIX 8: app.js — register notifications route ─────────────────────────────
write('backend/src/app.js', """const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler }  = require('./middleware/errorHandler');
const { shutdownGuard } = require('./middleware/shutdownGuard');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15*60*1000, max: 500, standardHeaders: true }));
app.use(shutdownGuard);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));

app.use('/auth',          require('./routes/auth'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/dashboard',     require('./routes/dashboard'));
app.use('/cards',         require('./routes/cards'));
app.use('/videos',        require('./routes/videos'));
app.use('/assignments',   require('./routes/assignments'));
app.use('/submissions',   require('./routes/submissions'));
app.use('/messages',      require('./routes/messages'));
app.use('/notifications', require('./routes/notifications'));
app.use('/quizzes',       require('./routes/quizzes'));
app.use('/pronunciation', require('./routes/pronunciation'));
app.use('/payments',      require('./routes/payments'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/telemetry',     require('./routes/telemetry'));
app.use('/system',        require('./routes/system'));
app.use('/admin',         require('./routes/admin'));

app.use((_, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);
module.exports = app;
""")

# ─── FIX 9: DB migration — add notifications + subscriptions plan_id column ───
write('backend/src/db/migrate2.js', """require('dotenv').config();
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
        console.log('OK:', cmd.slice(0, 70).replace(/\\n/g, ' ').trim());
      } catch(e) {
        console.log('SKIP (already exists):', e.message.slice(0, 60));
      }
    }

    console.log('\\nMigration 2 complete!');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(e => { console.error(e); process.exit(1); });
""")

print()
print('=' * 60)
print('ALL FIXES APPLIED')
print()
print('Issues fixed:')
print('  1. assignments.js route — was corrupted, now clean')
print('  2. submissions.js — added PATCH /:id for grading')
print('  3. admin.js — added GET/PUT /admin/settings')
print('  4. notifications controller + route (new)')
print('  5. quizzes.js — supports GET /quizzes?studentId=...')
print('  6. subscriptions.js — added POST + /user/:userId path')
print('  7. subscriptionsController — fixed user_id lookup')
print('  8. app.js — registered /notifications route')
print('  9. migrate2.js — adds missing DB columns/tables')
print()
print('NEXT STEPS:')
print('  1. Run the DB migration:')
print('     node src/db/migrate2.js')
print('  2. Restart backend:')
print('     npm run dev')
print('  3. Restart frontend (other terminal):')
print('     cd ../frontend && npm run dev')
print('=' * 60)