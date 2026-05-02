const { query }    = require('../config/db');
const { getRedis } = require('../config/redis');
const { getOnlineCount } = require('../websocket/socket');

async function cached(key, ttl, fn) {
  const redis = getRedis();
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  const data = await fn();
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
  return data;
}

exports.adminKpis = async (req, res, next) => {
  try {
    const data = await cached('kpi:admin', 120, async () => {
      const [users, revenue, subs, failedLogins] = await Promise.all([
        query('SELECT status, COUNT(*) n FROM users GROUP BY status'),
        query(`SELECT COALESCE(SUM(amount),0) total, COUNT(*) count FROM subscriptions WHERE last_payment_date > NOW()-INTERVAL'30 days'`),
        query(`SELECT COUNT(*) n FROM subscriptions WHERE status='active'`),
        query(`SELECT COUNT(*) n FROM logs WHERE action='failed_login' AND timestamp > NOW()-INTERVAL'24 hours'`),
      ]);
      const userMap = Object.fromEntries(users.rows.map(r => [r.status, +r.n]));
      return {
        totalUsers: { ...userMap, total: users.rows.reduce((s, r) => s + +r.n, 0) },
        revenue: { total: +revenue.rows[0].total, count: +revenue.rows[0].count },
        activeSubscriptions: +subs.rows[0].n,
        onlineUsers: getOnlineCount(),
        failedLogins24h: +failedLogins.rows[0].n,
      };
    });
    res.json(data);
  } catch (e) { next(e); }
};

// FIX: replaced unnest(jsonb) with jsonb_array_elements_text()
exports.teacherKpis = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    // Always bust cache so stale zeros don't persist
    const redis = getRedis();
    await redis.del(`kpi:teacher:${teacherId}`).catch(()=>{});
    const data = await cached(`kpi:teacher:${teacherId}`, 60, async () => {
      const [assigned, pending, stars, activity] = await Promise.all([
        // Count students who have submissions to this teacher's assignments
        // OR are in assigned_to arrays  handles both empty and populated arrays
        query(
          `SELECT COUNT(DISTINCT s.student_id) n
            FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
            WHERE a.teacher_id = $1`,
          [teacherId]
        ),
        query(
          `SELECT COUNT(*) n FROM submissions s
            JOIN assignments a ON a.id=s.assignment_id
            WHERE a.teacher_id=$1 AND s.status='submitted'`,
          [teacherId]
        ),
        query(
          `SELECT ROUND(AVG(stars)::numeric,2) avg FROM submissions s
            JOIN assignments a ON a.id=s.assignment_id
            WHERE a.teacher_id=$1 AND stars IS NOT NULL`,
          [teacherId]
        ),
        query(
          `SELECT s.student_id, MAX(s.submitted_at) as timestamp, 'submission' as action
            FROM submissions s
            JOIN assignments a ON a.id=s.assignment_id
            WHERE a.teacher_id=$1
            GROUP BY s.student_id
            ORDER BY MAX(s.submitted_at) DESC LIMIT 5`,
          [teacherId]
        ),
      ]);
      // Also count students explicitly in assigned_to arrays
      const { rows: explicit } = await query(
        `SELECT COUNT(DISTINCT u) n
          FROM assignments a, jsonb_array_elements_text(a.assigned_to) u
          WHERE a.teacher_id=$1 AND jsonb_array_length(a.assigned_to)>0`,
        [teacherId]
      );
      const fromSubmissions = +assigned.rows[0].n;
      const fromArrays = +explicit.rows[0].n;
      return {
        studentsAssigned: Math.max(fromSubmissions, fromArrays),
        pendingSubmissions: +pending.rows[0].n,
        avgStars: +stars.rows[0].avg || 0,
        recentActivity: activity.rows,
      };
    });
    res.json(data);
  } catch (e) { next(e); }
};

exports.studentKpis = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const data = await cached(`kpi:student:${studentId}`, 60, async () => {
      const [streak, stars, next_, videos, totalA, doneA] = await Promise.all([
        query(
          `SELECT COUNT(DISTINCT DATE(timestamp)) n FROM logs
           WHERE user_id=$1 AND action='card_view' AND timestamp > NOW()-INTERVAL'30 days'`,
          [studentId]
        ),
        query(`SELECT COALESCE(SUM(stars),0) total FROM submissions WHERE student_id=$1`, [studentId]),
        query(
          `SELECT due_date, title FROM assignments
           WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(assigned_to) v WHERE v=$1)
             AND due_date > NOW()
           ORDER BY due_date LIMIT 1`,
          [studentId]
        ),
        query(
          `SELECT COUNT(*) n FROM telemetry
           WHERE user_id=$1 AND event_type='card_view' AND timestamp > NOW()-INTERVAL'7 days'`,
          [studentId]
        ),
        query(
          `SELECT COUNT(*) n FROM assignments
           WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(assigned_to) v WHERE v=$1)`,
          [studentId]
        ),
        query(`SELECT COUNT(*) n FROM submissions WHERE student_id=$1`, [studentId]),
      ]);
      return {
        dailyStreak: +streak.rows[0].n,
        starsEarned: +stars.rows[0].total,
        nextAssignmentDue: next_.rows[0]?.due_date || null,
        nextAssignmentTitle: next_.rows[0]?.title || null,
        videosWatched7d: +videos.rows[0].n,
        totalAssignments: +totalA.rows[0].n,
        submittedAssignments: +doneA.rows[0].n,
      };
    });
    res.json(data);
  } catch (e) { next(e); }
};

// FIX: replaced $1=ANY(a.assigned_to) with EXISTS+jsonb_array_elements_text
exports.parentKpis = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const data = await cached(`kpi:parent:${studentId}`, 120, async () => {
      const [progress, unread, sub, streak] = await Promise.all([
        query(
          `SELECT COUNT(*) total,
                  SUM(CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END) done
           FROM assignments a
           LEFT JOIN submissions s ON s.assignment_id=a.id AND s.student_id=$1
           WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(a.assigned_to) v WHERE v=$1)`,
          [studentId]
        ),
        query(`SELECT COUNT(*) n FROM messages WHERE receiver_id=$1 AND read=false`, [studentId]),
        query(
          `SELECT status, expiry_date FROM subscriptions
           WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1`,
          [studentId]
        ),
        query(
          `SELECT COUNT(DISTINCT DATE(timestamp)) n FROM logs
           WHERE user_id=$1 AND action='card_view' AND timestamp > NOW()-INTERVAL'30 days'`,
          [studentId]
        ),
      ]);
      const p = progress.rows[0];
      return {
        childProgress: +p.total > 0 ? Math.round((+p.done / +p.total) * 100) : 0,
        totalAssignments: +p.total,
        completedAssignments: +p.done,
        unreadMessages: +unread.rows[0].n,
        subscriptionStatus: sub.rows[0] || null,
        learningStreak: +streak.rows[0].n,
      };
    });
    res.json(data);
  } catch (e) { next(e); }
};


// ── Revenue trend (last N days, one row per day) ────────────────────────────
exports.adminRevenueTrend = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 90);
    const { rows } = await query(
      `SELECT DATE(last_payment_date) AS date,
              COALESCE(SUM(amount),0)  AS total,
              COUNT(*)                 AS count
         FROM subscriptions
        WHERE last_payment_date > NOW() - INTERVAL '1 day' * $1
        GROUP BY DATE(last_payment_date)
        ORDER BY date ASC`,
      [days]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

// ── User growth (registrations per day) ────────────────────────────────────
exports.adminUserGrowth = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90);
    const { rows } = await query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS total
         FROM users
        WHERE created_at > NOW() - INTERVAL '1 day' * $1
        GROUP BY DATE(created_at)
        ORDER BY date ASC`,
      [days]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

// ── Subscription health breakdown ───────────────────────────────────────────
exports.adminSubscriptionHealth = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT status, COUNT(*) AS count
         FROM subscriptions
        GROUP BY status`
    );
    res.json(rows);
  } catch (e) { next(e); }
};

// ── Role breakdown ──────────────────────────────────────────────────────────
exports.adminRoleBreakdown = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT role, COUNT(*) AS count
         FROM users
        GROUP BY role`
    );
    res.json(rows);
  } catch (e) { next(e); }
};
