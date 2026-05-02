import os, re

BASE = os.path.join(os.path.expanduser('~'), 'Downloads', 'eduapp')

def write(rel, content):
    path = os.path.join(BASE, rel.replace('/', os.sep))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  wrote  {rel}')

def try_patch(rel, anchor, insertion):
    path = os.path.join(BASE, rel.replace('/', os.sep))
    if not os.path.exists(path):
        print(f'  skip   {rel} (not found)')
        return
    txt = open(path, encoding='utf-8').read()
    if insertion.strip() in txt:
        print(f'  skip   {rel} (already has route)')
        return
    if anchor not in txt:
        print(f'  skip   {rel} (anchor not found)')
        return
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt.replace(anchor, anchor + '\n' + insertion, 1))
    print(f'  patched {rel}')

# ─── BACKEND: dashboardController.js ──────────────────────────────────────────
write('backend/src/controllers/dashboardController.js', """const { query }    = require('../config/db');
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
    const data = await cached(`kpi:teacher:${teacherId}`, 180, async () => {
      const [assigned, pending, stars] = await Promise.all([
        query(
          `SELECT COUNT(DISTINCT u) n
           FROM assignments a, jsonb_array_elements_text(a.assigned_to) u
           WHERE a.teacher_id=$1`,
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
      ]);
      return {
        studentsAssigned: +assigned.rows[0].n,
        pendingSubmissions: +pending.rows[0].n,
        avgStars: +stars.rows[0].avg || 0,
      };
    });
    res.json(data);
  } catch (e) { next(e); }
};

// FIX: replaced $1=ANY(assigned_to) with EXISTS+jsonb_array_elements_text
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
""")

# ─── BACKEND: assignmentsController.js ────────────────────────────────────────
write('backend/src/controllers/assignmentsController.js', """const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

exports.createAssignment = async (req, res, next) => {
  try {
    const { cardIds, title, instructions, assignedTo, dueDate } = req.body;
    const id = uuid();
    await query(
      `INSERT INTO assignments(id,teacher_id,card_ids,title,instructions,assigned_to,due_date)
       VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [id, req.user.id, JSON.stringify(cardIds), title, instructions,
       JSON.stringify(assignedTo), dueDate]
    );
    res.status(201).json({ id });
  } catch (e) { next(e); }
};

// FIX: replaced $1=ANY(assigned_to::jsonb) with EXISTS+jsonb_array_elements_text
exports.getStudentAssignments = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*, s.status as submission_status, s.stars
       FROM assignments a
       LEFT JOIN submissions s ON s.assignment_id=a.id AND s.student_id=$1
       WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(a.assigned_to) v WHERE v=$1)
       ORDER BY due_date ASC`,
      [req.params.studentId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getTeacherAssignments = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*,
         (SELECT COUNT(*) FROM jsonb_array_elements_text(a.assigned_to)) assigned_count,
         (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id=a.id) submission_count
       FROM assignments a
       WHERE a.teacher_id=$1
       ORDER BY created_at DESC`,
      [req.params.teacherId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getTeacherSubmissions = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT s.*, a.title as assignment_title, u.name as student_name
       FROM submissions s
       JOIN assignments a ON a.id=s.assignment_id
       LEFT JOIN users u ON u.id=s.student_id
       WHERE a.teacher_id=$1
       ORDER BY s.created_at DESC`,
      [req.params.teacherId]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getAssignment = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM assignments WHERE id=$1', [req.params.id]);
    if (!rows.length) return next(new AppError('Assignment not found', 404));
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const { title, instructions, dueDate } = req.body;
    await query(
      'UPDATE assignments SET title=$1, instructions=$2, due_date=$3 WHERE id=$4',
      [title, instructions, dueDate, req.params.id]
    );
    res.json({ message: 'Updated.' });
  } catch (e) { next(e); }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    await query('DELETE FROM assignments WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted.' });
  } catch (e) { next(e); }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { stars } = req.body;
    await query(
      `UPDATE submissions SET stars=$1, status='graded', updated_at=NOW() WHERE id=$2`,
      [stars, req.params.id]
    );
    res.json({ message: 'Graded.' });
  } catch (e) { next(e); }
};
""")

# ─── Patch routes/assignments.js to register new endpoints ────────────────────
for routes_rel in [
    'backend/src/routes/assignments.js',
    'backend/src/routes/assignment.js',
]:
    try_patch(
        routes_rel,
        "const { getStudentAssignments",
        "const { getTeacherAssignments, getTeacherSubmissions, gradeSubmission,"
    )
    try_patch(
        routes_rel,
        "router.get('/student/:studentId'",
        "router.get('/teacher/:teacherId', auth, getTeacherAssignments);\n"
        "router.get('/teacher/:teacherId/submissions', auth, getTeacherSubmissions);\n"
        "router.patch('/submissions/:id/grade', auth, gradeSubmission);"
    )

# ─── FRONTEND PAGES ────────────────────────────────────────────────────────────

# student/Progress.jsx
write('frontend/src/pages/student/Progress.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import StatRow from '../../components/dashboard/StatRow'
import Spinner from '../../components/common/Spinner'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function StudentProgress() {
  const userId = useAuthStore(s => s.userId)
  const [kpis, setKpis] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get(`/dashboard/student/kpis/${userId}`),
      api.get(`/assignments/student/${userId}`),
    ]).then(([k, a]) => {
      if (k.status === 'fulfilled') setKpis(k.value.data)
      if (a.status === 'fulfilled') setAssignments(a.value.data)
    }).finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Spinner />

  const total = kpis?.totalAssignments ?? assignments.length
  const done  = kpis?.submittedAssignments ?? assignments.filter(a => a.submission_status === 'graded' || a.submission_status === 'submitted').length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  const statusStyle = s => s === 'graded'
    ? {bg:'rgba(16,185,129,0.15)',fg:'#34d399'}
    : s === 'submitted'
    ? {bg:'rgba(245,158,11,0.15)',fg:'#fbbf24'}
    : {bg:'rgba(99,102,241,0.15)',fg:'#a5b4fc'}

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>My Progress</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>Your learning journey at a glance</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:'12px',marginBottom:'24px'}}>
        {[
          {label:'Completion', value:`${pct}%`,                      icon:'🏆', color:'#6366f1'},
          {label:'Day Streak', value:kpis?.dailyStreak??0,            icon:'🔥', color:'#f97316'},
          {label:'Stars',      value:kpis?.starsEarned??0,            icon:'⭐', color:'#f59e0b'},
          {label:'Videos (7d)',value:kpis?.videosWatched7d??0,        icon:'🎬', color:'#0ea5e9'},
        ].map(s => (
          <div key={s.label} style={{...card,textAlign:'center'}}>
            <p style={{fontSize:'2rem',margin:'0 0 8px'}}>{s.icon}</p>
            <p style={{fontSize:'1.35rem',fontWeight:800,color:s.color,margin:'0 0 4px'}}>{s.value}</p>
            <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{...card,marginBottom:'20px'}}>
        <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 16px'}}>Overview</p>
        <StatRow label={`Assignments — ${done} of ${total} done`} value={pct}                              max={100} color="#6366f1" />
        <StatRow label="Stars earned"                              value={Math.min(kpis?.starsEarned??0,100)} max={100} color="#f59e0b" />
        <StatRow label="Streak (days)"                             value={Math.min(kpis?.dailyStreak??0,30)}  max={30}  color="#f97316" />
      </div>

      <div style={card}>
        <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 14px'}}>Assignments ({assignments.length})</p>
        {assignments.length === 0 && <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>No assignments yet.</p>}
        {assignments.map((a, i) => {
          const sc = statusStyle(a.submission_status)
          return (
            <div key={a.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:i<assignments.length-1?'1px solid #1f2937':'none',gap:'12px'}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:600,color:'#f9fafb',margin:'0 0 3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</p>
                <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : '—'}</p>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                {a.stars != null && <span style={{color:'#f59e0b',fontSize:'.875rem'}}>{'⭐'.repeat(+a.stars||0)}</span>}
                <span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',background:sc.bg,color:sc.fg,textTransform:'capitalize'}}>
                  {a.submission_status || 'assigned'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
""")

# student/Badges.jsx
write('frontend/src/pages/student/Badges.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const DEFS = [
  {id:'first_submit', icon:'🎯', label:'First Submit',    desc:'Submitted first assignment', req:k=>+k.submittedAssignments>=1},
  {id:'streak_7',     icon:'🔥', label:'7-Day Streak',    desc:'7 days in a row',            req:k=>+k.dailyStreak>=7},
  {id:'streak_14',    icon:'💪', label:'Dedicated',       desc:'14-day streak',              req:k=>+k.dailyStreak>=14},
  {id:'star_10',      icon:'⭐', label:'Rising Star',     desc:'Earned 10 stars',            req:k=>+k.starsEarned>=10},
  {id:'star_50',      icon:'🌟', label:'Star Collector',  desc:'Earned 50 stars',            req:k=>+k.starsEarned>=50},
  {id:'star_100',     icon:'💫', label:'Legend',          desc:'Earned 100 stars',           req:k=>+k.starsEarned>=100},
  {id:'video_5',      icon:'🎬', label:'Video Fan',       desc:'Watched 5 videos this week', req:k=>+k.videosWatched7d>=5},
  {id:'all_done',     icon:'🏆', label:'Overachiever',    desc:'All assignments submitted',  req:k=>+k.totalAssignments>0&&+k.submittedAssignments>=+k.totalAssignments},
]

export default function StudentBadges() {
  const userId = useAuthStore(s => s.userId)
  const [kpis, setKpis] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/dashboard/student/kpis/${userId}`)
      .then(r => setKpis(r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Spinner />

  const count = DEFS.filter(b => b.req(kpis)).length

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Badges</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{count} of {DEFS.length} earned</p>
      </div>

      <div style={{background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
          <span style={{fontSize:'.875rem',fontWeight:600,color:'#f9fafb'}}>Collection Progress</span>
          <span style={{fontSize:'.875rem',color:'#6366f1',fontWeight:700}}>{count}/{DEFS.length}</span>
        </div>
        <div style={{height:'8px',background:'#1f2937',borderRadius:'99px',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(count/DEFS.length)*100}%`,background:'linear-gradient(90deg,#6366f1,#818cf8)',borderRadius:'99px',transition:'width 0.6s'}} />
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'12px'}}>
        {DEFS.map(b => {
          const has = b.req(kpis)
          return (
            <div key={b.id} style={{background:has?'rgba(99,102,241,0.08)':'#161b27',border:`1px solid ${has?'rgba(99,102,241,0.3)':'#1f2937'}`,borderRadius:'16px',padding:'20px 16px',textAlign:'center',opacity:has?1:0.4,transition:'opacity 0.2s'}}>
              <p style={{fontSize:'2.5rem',margin:'0 0 10px',filter:has?'none':'grayscale(1)'}}>{b.icon}</p>
              <p style={{fontSize:'.875rem',fontWeight:700,color:has?'#a5b4fc':'#6b7280',margin:'0 0 4px'}}>{b.label}</p>
              <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>{b.desc}</p>
              {has && <p style={{fontSize:'.7rem',color:'#6366f1',fontWeight:700,margin:'8px 0 0',textTransform:'uppercase',letterSpacing:'.5px'}}>✓ Earned</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
""")

# student/Quizzes.jsx
write('frontend/src/pages/student/Quizzes.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function StudentQuizzes() {
  const userId = useAuthStore(s => s.userId)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/quizzes?studentId=${userId}`)
      .then(r => setQuizzes(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Quizzes</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{quizzes.length} available</p>
      </div>

      {quizzes.length === 0 ? (
        <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
          <p style={{fontSize:'3rem',margin:'0 0 12px'}}>📝</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>No quizzes yet</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>Your teacher will assign quizzes here.</p>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'12px'}}>
          {quizzes.map(q => (
            <div key={q.id} style={card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                <span style={{fontSize:'1.8rem'}}>{q.icon || '📝'}</span>
                {q.score != null && (
                  <span style={{fontSize:'.75rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',background:'rgba(16,185,129,0.15)',color:'#34d399'}}>{q.score}%</span>
                )}
              </div>
              <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 4px'}}>{q.title}</p>
              <p style={{fontSize:'.8rem',color:'#6b7280',margin:'0 0 14px'}}>{q.question_count || '?'} questions · {q.subject || 'General'}</p>
              <button style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',border:'none',borderRadius:'10px',padding:'9px',fontWeight:700,fontSize:'.875rem',cursor:'pointer'}}>
                {q.attempts > 0 ? 'Retry Quiz' : 'Start Quiz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
""")

# teacher/Assignments.jsx
write('frontend/src/pages/teacher/Assignments.jsx', """import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function TeacherAssignments() {
  const userId = useAuthStore(s => s.userId)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/assignments/teacher/${userId}`)
      .then(r => setAssignments(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  async function del(id) {
    if (!confirm('Delete this assignment?')) return
    try {
      await api.delete(`/assignments/${id}`)
      setAssignments(p => p.filter(a => a.id !== id))
      toast.success('Deleted.')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return <Spinner />

  const statusStyle = s => s === 'graded' ? {bg:'rgba(16,185,129,0.15)',fg:'#34d399'} : {bg:'rgba(99,102,241,0.15)',fg:'#a5b4fc'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',gap:'12px',flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Assignments</h1>
          <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{assignments.length} total</p>
        </div>
        <Link to="/teacher/create-card" style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',padding:'10px 18px',borderRadius:'12px',textDecoration:'none',fontSize:'.875rem',fontWeight:700}}>
          + New Assignment
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
          <p style={{fontSize:'3rem',margin:'0 0 12px'}}>📚</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 8px'}}>No assignments yet</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:'0 0 20px'}}>Create your first assignment to get started.</p>
          <Link to="/teacher/create-card" style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',padding:'10px 20px',borderRadius:'12px',textDecoration:'none',fontWeight:700,fontSize:'.875rem'}}>
            Create Assignment
          </Link>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {assignments.map(a => {
            const sc = statusStyle(a.status)
            return (
              <div key={a.id} style={{...card,display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap',padding:'14px 18px'}}>
                <div style={{flex:1,minWidth:'150px'}}>
                  <p style={{fontWeight:600,color:'#f9fafb',margin:'0 0 3px'}}>{a.title}</p>
                  <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>
                    {a.assigned_count || 0} student{a.assigned_count !== 1 ? 's' : ''} · {a.submission_count || 0} submissions · Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}>
                  <span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',background:sc.bg,color:sc.fg,textTransform:'capitalize'}}>
                    {a.status || 'active'}
                  </span>
                  <button onClick={() => del(a.id)}
                    style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171',borderRadius:'8px',padding:'5px 10px',fontSize:'.75rem',fontWeight:600,cursor:'pointer'}}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
""")

# teacher/ClassProgress.jsx
write('frontend/src/pages/teacher/ClassProgress.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import StatRow from '../../components/dashboard/StatRow'
import KpiCard from '../../components/dashboard/KpiCard'
import Spinner from '../../components/common/Spinner'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function ClassProgress() {
  const userId = useAuthStore(s => s.userId)
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/dashboard/teacher/kpis/${userId}`)
      .then(r => setKpis(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Spinner />

  const reviewed = (kpis?.studentsAssigned ?? 0) - (kpis?.pendingSubmissions ?? 0)
  const pctReviewed = kpis?.studentsAssigned > 0 ? Math.round((reviewed / kpis.studentsAssigned) * 100) : 0
  const avgStarsPct = Math.round(((kpis?.avgStars ?? 0) / 5) * 100)

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Class Progress</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>How your students are doing</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:'12px',marginBottom:'24px'}}>
        <KpiCard icon="👥" label="Students"    value={kpis?.studentsAssigned ?? 0}          color="brand" />
        <KpiCard icon="📋" label="Pending"     value={kpis?.pendingSubmissions ?? 0}        color="yellow" />
        <KpiCard icon="⭐" label="Avg Stars"   value={kpis?.avgStars?.toFixed(1) ?? '—'}   color="green" />
        <KpiCard icon="✅" label="Reviewed"    value={`${pctReviewed}%`}                    color="purple" />
      </div>

      <div style={{...card,marginBottom:'16px'}}>
        <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 16px'}}>Submission Progress</p>
        <StatRow label="Submissions reviewed" value={pctReviewed} max={100} color="#10b981" />
        <StatRow label="Average star rating"  value={avgStarsPct} max={100} color="#6366f1" />
      </div>

      {(kpis?.pendingSubmissions ?? 0) > 0 && (
        <div style={{...card,background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.2)',marginBottom:'16px'}}>
          <p style={{fontWeight:700,color:'#fbbf24',margin:'0 0 6px'}}>⏳ {kpis.pendingSubmissions} submission{kpis.pendingSubmissions !== 1 ? 's' : ''} awaiting review</p>
          <p style={{fontSize:'.875rem',color:'#9ca3af',margin:0}}>Go to Submissions to grade them.</p>
        </div>
      )}

      {kpis?.studentsAssigned === 0 && (
        <div style={{...card,textAlign:'center',padding:'40px 20px'}}>
          <p style={{fontSize:'2.5rem',margin:'0 0 10px'}}>👥</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>No students yet</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>Assign work to students to track progress here.</p>
        </div>
      )}
    </div>
  )
}
""")

# teacher/Submissions.jsx
write('frontend/src/pages/teacher/Submissions.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

function StarPicker({ onGrade }) {
  return (
    <div style={{display:'flex',gap:'4px'}}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onGrade(n)}
          style={{background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)',color:'#fbbf24',borderRadius:'8px',padding:'5px 8px',cursor:'pointer',fontWeight:700,fontSize:'.8rem'}}>
          {n}★
        </button>
      ))}
    </div>
  )
}

export default function TeacherSubmissions() {
  const userId = useAuthStore(s => s.userId)
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState({})

  useEffect(() => {
    api.get(`/assignments/teacher/${userId}/submissions`)
      .then(r => setSubs(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  async function grade(subId, stars) {
    try {
      await api.patch(`/submissions/${subId}`, { stars, status: 'graded' })
      setSubs(p => p.map(s => s.id === subId ? {...s, stars, status:'graded'} : s))
      setGrading(p => ({...p, [subId]: false}))
      toast.success('Graded ✓')
    } catch { toast.error('Failed to save grade') }
  }

  if (loading) return <Spinner />

  const pending = subs.filter(s => s.status !== 'graded')
  const graded  = subs.filter(s => s.status === 'graded')

  const SubCard = ({ s }) => (
    <div style={{...card,padding:'14px 18px',marginBottom:'8px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:'140px'}}>
          <p style={{fontWeight:600,color:'#f9fafb',margin:'0 0 3px'}}>{s.assignment_title || 'Assignment'}</p>
          <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>
            {s.student_name || s.student_id?.slice(0,10)} · {new Date(s.created_at||s.submitted_at||Date.now()).toLocaleDateString()}
          </p>
        </div>
        {s.status === 'graded' ? (
          <span style={{color:'#f59e0b',fontWeight:700,flexShrink:0}}>{'⭐'.repeat(+s.stars||0)}</span>
        ) : grading[s.id] ? (
          <StarPicker onGrade={n => grade(s.id, n)} />
        ) : (
          <button onClick={() => setGrading(p => ({...p, [s.id]: true}))}
            style={{background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',color:'#a5b4fc',borderRadius:'8px',padding:'5px 12px',cursor:'pointer',fontWeight:600,fontSize:'.78rem',flexShrink:0}}>
            Grade
          </button>
        )}
      </div>
      {s.answer && (
        <p style={{fontSize:'.8rem',color:'#9ca3af',margin:'10px 0 0',background:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'10px',lineHeight:1.5}}>
          {s.answer}
        </p>
      )}
    </div>
  )

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Submissions</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{pending.length} pending · {graded.length} graded</p>
      </div>

      {subs.length === 0 ? (
        <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
          <p style={{fontSize:'3rem',margin:'0 0 12px'}}>✅</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>No submissions yet</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>Student submissions will appear here once they submit work.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div style={{marginBottom:'20px'}}>
              <p style={{fontWeight:700,color:'#fbbf24',margin:'0 0 10px',fontSize:'.95rem'}}>⏳ Pending ({pending.length})</p>
              {pending.map(s => <SubCard key={s.id} s={s} />)}
            </div>
          )}
          {graded.length > 0 && (
            <div>
              <p style={{fontWeight:700,color:'#34d399',margin:'0 0 10px',fontSize:'.95rem'}}>✅ Graded ({graded.length})</p>
              {graded.map(s => <SubCard key={s.id} s={s} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
""")

# teacher/Messages.jsx
MESSAGES_JSX = """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function ROLE_Messages() {
  const userId = useAuthStore(s => s.userId)
  const [messages, setMessages] = useState([])
  const [compose, setCompose] = useState(false)
  const [to, setTo] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/messages/${userId}`)
      .then(r => setMessages(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  async function send() {
    if (!body.trim()) return
    setSending(true)
    try {
      await api.post('/messages', { receiverId: to, content: body })
      setBody(''); setTo(''); setCompose(false)
      toast.success('Message sent!')
    } catch { toast.error('Failed to send') } finally { setSending(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',gap:'12px'}}>
        <div>
          <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Messages</h1>
          <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{messages.filter(m=>!m.read).length} unread</p>
        </div>
        <button onClick={() => setCompose(c => !c)}
          style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',border:'none',borderRadius:'12px',padding:'10px 18px',fontWeight:700,fontSize:'.875rem',cursor:'pointer'}}>
          + Compose
        </button>
      </div>

      {compose && (
        <div style={{...card,marginBottom:'16px',border:'1px solid rgba(99,102,241,0.3)'}}>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 12px'}}>New Message</p>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipient user ID…"
            style={{width:'100%',background:'#111827',border:'1px solid #1f2937',borderRadius:'8px',padding:'10px 12px',color:'#f9fafb',fontSize:'.875rem',outline:'none',marginBottom:'8px',boxSizing:'border-box'}} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write a message…" rows={3}
            style={{width:'100%',background:'#111827',border:'1px solid #1f2937',borderRadius:'8px',padding:'10px 12px',color:'#f9fafb',fontSize:'.875rem',outline:'none',resize:'vertical',boxSizing:'border-box',marginBottom:'8px'}} />
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={send} disabled={sending}
              style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 20px',fontWeight:700,fontSize:'.875rem',cursor:'pointer',opacity:sending?0.6:1}}>
              {sending ? 'Sending…' : 'Send'}
            </button>
            <button onClick={() => setCompose(false)}
              style={{background:'transparent',color:'#6b7280',border:'1px solid #374151',borderRadius:'8px',padding:'8px 14px',fontWeight:600,fontSize:'.875rem',cursor:'pointer'}}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
          <p style={{fontSize:'3rem',margin:'0 0 12px'}}>💬</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>No messages yet</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>Your conversations will appear here.</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {messages.map((m, i) => (
            <div key={m.id || i} style={{...card,padding:'14px 18px',display:'flex',gap:'14px',alignItems:'flex-start',opacity:m.read?0.65:1,borderColor:m.read?'#1f2937':'rgba(99,102,241,0.2)'}}>
              <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.875rem',flexShrink:0}}>
                {((m.sender_name||m.sender_id||'?')[0]||'?').toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:'8px',marginBottom:'3px'}}>
                  <p style={{fontWeight:600,color:m.read?'#9ca3af':'#f9fafb',margin:0}}>{m.sender_name||m.sender_id?.slice(0,12)||'Unknown'}</p>
                  <p style={{fontSize:'.72rem',color:'#6b7280',margin:0,flexShrink:0}}>{new Date(m.created_at||m.timestamp||Date.now()).toLocaleDateString()}</p>
                </div>
                <p style={{fontSize:'.875rem',color:'#9ca3af',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.content}</p>
              </div>
              {!m.read && <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#6366f1',flexShrink:0,marginTop:'6px'}} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"""

write('frontend/src/pages/teacher/Messages.jsx',
      MESSAGES_JSX.replace('ROLE_Messages', 'TeacherMessages'))
write('frontend/src/pages/parent/Messages.jsx',
      MESSAGES_JSX.replace('ROLE_Messages', 'ParentMessages'))

# parent/Progress.jsx
write('frontend/src/pages/parent/Progress.jsx', """import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import KpiCard from '../../components/dashboard/KpiCard'
import StatRow from '../../components/dashboard/StatRow'
import Spinner from '../../components/common/Spinner'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function ParentProgress() {
  const { studentId: paramId } = useParams()
  const userId = useAuthStore(s => s.userId)
  const linkedStudentIds = useAuthStore(s => s.linkedStudentIds)
  const target = paramId || linkedStudentIds?.[0] || userId

  const [kpis, setKpis] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get(`/dashboard/parent/kpis/${target}`),
      api.get(`/assignments/student/${target}`),
    ]).then(([k, a]) => {
      if (k.status === 'fulfilled') setKpis(k.value.data)
      if (a.status === 'fulfilled') setAssignments(a.value.data)
    }).finally(() => setLoading(false))
  }, [target])

  if (loading) return <Spinner />

  const total = kpis?.totalAssignments ?? 0
  const done  = kpis?.completedAssignments ?? 0

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Child Progress</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>Learning report for your child</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:'12px',marginBottom:'24px'}}>
        <KpiCard icon="📈" label="Completion"   value={`${kpis?.childProgress ?? 0}%`}    color="brand" />
        <KpiCard icon="🔥" label="Streak"       value={`${kpis?.learningStreak ?? 0}d`}   color="yellow" />
        <KpiCard icon="📚" label="Assignments"  value={`${done}/${total}`}                 color="green" />
        <KpiCard icon="💬" label="Unread Msgs"  value={kpis?.unreadMessages ?? 0}          color="purple" />
      </div>

      <div style={{...card,marginBottom:'20px'}}>
        <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 16px'}}>Progress Overview</p>
        <StatRow label={`Assignments — ${done} of ${total} done`} value={kpis?.childProgress ?? 0}         max={100} color="#6366f1" />
        <StatRow label="Learning streak"                           value={Math.min(kpis?.learningStreak??0,30)} max={30}  color="#f97316" />
      </div>

      {assignments.length > 0 && (
        <div style={card}>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 14px'}}>Recent Assignments</p>
          {assignments.slice(0, 10).map((a, i) => (
            <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:i<Math.min(assignments.length,10)-1?'1px solid #1f2937':'none',gap:'12px'}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:'.875rem',fontWeight:600,color:'#f9fafb',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</p>
                <p style={{fontSize:'.72rem',color:'#6b7280',margin:0}}>Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : '—'}</p>
              </div>
              <span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',flexShrink:0,textTransform:'capitalize',
                background:a.submission_status==='graded'?'rgba(16,185,129,0.15)':a.submission_status==='submitted'?'rgba(245,158,11,0.15)':'rgba(99,102,241,0.15)',
                color:a.submission_status==='graded'?'#34d399':a.submission_status==='submitted'?'#fbbf24':'#a5b4fc'}}>
                {a.submission_status || 'assigned'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
""")

# parent/Notifications.jsx
write('frontend/src/pages/parent/Notifications.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}
const ICON = { assignment:'📚', grade:'⭐', message:'💬', subscription:'💳', system:'🔔' }

export default function ParentNotifications() {
  const userId = useAuthStore(s => s.userId)
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/notifications/${userId}`)
      .then(r => setNotifs(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}`, { read: true })
      setNotifs(p => p.map(n => n.id === id ? {...n, read: true} : n))
    } catch {}
  }

  if (loading) return <Spinner />

  const unread = notifs.filter(n => !n.read).length

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Notifications</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
      </div>

      {notifs.length === 0 ? (
        <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
          <p style={{fontSize:'3rem',margin:'0 0 12px'}}>🔔</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>No notifications</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {notifs.map((n, i) => (
            <div key={n.id || i} onClick={() => !n.read && markRead(n.id)}
              style={{...card,padding:'14px 18px',display:'flex',gap:'14px',alignItems:'flex-start',
                opacity:n.read?0.6:1,cursor:n.read?'default':'pointer',
                borderColor:n.read?'#1f2937':'rgba(99,102,241,0.25)'}}>
              <span style={{fontSize:'1.5rem',flexShrink:0}}>{ICON[n.type] || '🔔'}</span>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:600,color:n.read?'#9ca3af':'#f9fafb',margin:'0 0 4px'}}>{n.title || n.type || 'Notification'}</p>
                <p style={{fontSize:'.875rem',color:'#6b7280',margin:'0 0 4px'}}>{n.message || n.content}</p>
                <p style={{fontSize:'.72rem',color:'#4b5563',margin:0}}>{new Date(n.created_at || n.timestamp || Date.now()).toLocaleString()}</p>
              </div>
              {!n.read && <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#6366f1',flexShrink:0,marginTop:'6px'}} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
""")

# parent/Subscription.jsx
write('frontend/src/pages/parent/Subscription.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const PLANS = [
  { id:'basic',    name:'Basic',    price:'KES 500/mo',   features:['1 student','Core assignments','Video access'] },
  { id:'standard', name:'Standard', price:'KES 1,000/mo', features:['Up to 3 students','All features','Priority support'] },
  { id:'premium',  name:'Premium',  price:'KES 2,000/mo', features:['Unlimited students','All features','Dedicated tutor'] },
]

export default function ParentSubscription() {
  const userId = useAuthStore(s => s.userId)
  const linkedStudentIds = useAuthStore(s => s.linkedStudentIds)
  const target = linkedStudentIds?.[0] || userId

  const [sub, setSub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    Promise.allSettled([
      api.get(`/subscriptions/user/${userId}`),
      api.get(`/dashboard/parent/kpis/${target}`),
    ]).then(([s, k]) => {
      if (s.status === 'fulfilled') setSub(s.value.data)
      else if (k.status === 'fulfilled') setSub(k.value.data?.subscriptionStatus)
    }).finally(() => setLoading(false))
  }, [userId, target])

  async function subscribe(planId) {
    setUpgrading(true)
    try {
      await api.post('/subscriptions', { planId, userId })
      const r = await api.get(`/subscriptions/user/${userId}`)
      setSub(r.data)
      toast.success('Subscription updated!')
    } catch { toast.error('Failed — please try again') } finally { setUpgrading(false) }
  }

  if (loading) return <Spinner />

  const isActive = sub?.status === 'active'

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Subscription</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>Manage your plan</p>
      </div>

      <div style={{background:isActive?'rgba(16,185,129,0.08)':'rgba(245,158,11,0.08)',border:`1px solid ${isActive?'rgba(16,185,129,0.25)':'rgba(245,158,11,0.25)'}`,borderRadius:'16px',padding:'20px',marginBottom:'24px',display:'flex',alignItems:'center',gap:'14px'}}>
        <span style={{fontSize:'2rem'}}>{isActive ? '✅' : '⚠️'}</span>
        <div>
          <p style={{fontWeight:700,color:isActive?'#34d399':'#fbbf24',margin:'0 0 3px'}}>
            {isActive ? `Active — ${sub.plan_id || 'Standard'} plan` : 'No active subscription'}
          </p>
          <p style={{fontSize:'.85rem',color:'#9ca3af',margin:0}}>
            {isActive && sub.expiry_date ? `Renews ${new Date(sub.expiry_date).toLocaleDateString()}` : 'Choose a plan below to unlock all content.'}
          </p>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px'}}>
        {PLANS.map(p => {
          const isCurrent = sub?.plan_id === p.id && isActive
          return (
            <div key={p.id} style={{background:isCurrent?'rgba(99,102,241,0.06)':'#161b27',border:`1px solid ${isCurrent?'rgba(99,102,241,0.4)':'#1f2937'}`,borderRadius:'16px',padding:'20px',display:'flex',flexDirection:'column'}}>
              <div style={{marginBottom:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px'}}>
                  <p style={{fontWeight:800,fontSize:'1.1rem',color:'#f9fafb',margin:0}}>{p.name}</p>
                  {isCurrent && <span style={{fontSize:'.7rem',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:'rgba(99,102,241,0.2)',color:'#a5b4fc'}}>Current</span>}
                </div>
                <p style={{fontWeight:700,color:'#6366f1',margin:0,fontSize:'1rem'}}>{p.price}</p>
              </div>
              <ul style={{listStyle:'none',padding:0,margin:'0 0 20px',flex:1}}>
                {p.features.map(f => (
                  <li key={f} style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'6px',fontSize:'.85rem',color:'#9ca3af'}}>
                    <span style={{color:'#34d399',fontWeight:700,flexShrink:0}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => !isCurrent && subscribe(p.id)} disabled={isCurrent || upgrading}
                style={{width:'100%',background:isCurrent?'rgba(99,102,241,0.2)':'linear-gradient(135deg,#6366f1,#4f46e5)',color:isCurrent?'#a5b4fc':'#fff',border:'none',borderRadius:'10px',padding:'10px',fontWeight:700,fontSize:'.875rem',cursor:isCurrent||upgrading?'default':'pointer',opacity:upgrading?0.6:1}}>
                {isCurrent ? 'Current Plan' : upgrading ? 'Updating…' : 'Choose Plan'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
""")

# admin/Settings.jsx
write('frontend/src/pages/admin/Settings.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

const DEFAULTS = {
  allow_registration: true,
  require_approval: true,
  maintenance_mode: false,
  max_login_attempts: 5,
  session_timeout_hours: 24,
  enable_notifications: true,
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid #1f2937',gap:'16px'}}>
      <div>
        <p style={{fontWeight:600,color:'#f9fafb',margin:'0 0 3px',fontSize:'.875rem'}}>{label}</p>
        {desc && <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>{desc}</p>}
      </div>
      <div onClick={() => onChange(!value)}
        style={{width:'44px',height:'24px',borderRadius:'12px',background:value?'#6366f1':'#374151',cursor:'pointer',flexShrink:0,position:'relative',transition:'background 0.2s'}}>
        <div style={{width:'18px',height:'18px',borderRadius:'50%',background:'#fff',position:'absolute',top:'3px',left:value?'23px':'3px',transition:'left 0.2s'}} />
      </div>
    </div>
  )
}

function NumInput({ label, desc, value, min, max, onChange }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid #1f2937',gap:'16px'}}>
      <div>
        <p style={{fontWeight:600,color:'#f9fafb',margin:'0 0 3px',fontSize:'.875rem'}}>{label}</p>
        {desc && <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>{desc}</p>}
      </div>
      <input type="number" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)}
        style={{width:'72px',background:'#111827',border:'1px solid #374151',borderRadius:'8px',padding:'6px 10px',color:'#f9fafb',fontSize:'.875rem',outline:'none',textAlign:'center'}} />
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/admin/settings')
      .then(r => setSettings({...DEFAULTS, ...r.data}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      await api.put('/admin/settings', settings)
      toast.success('Settings saved!')
    } catch { toast.error('Failed to save settings') } finally { setSaving(false) }
  }

  const set = (k, v) => setSettings(p => ({...p, [k]: v}))

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',gap:'12px',flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Settings</h1>
          <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>System configuration</p>
        </div>
        <button onClick={save} disabled={saving}
          style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',border:'none',borderRadius:'12px',padding:'10px 20px',fontWeight:700,fontSize:'.875rem',cursor:'pointer',opacity:saving?0.6:1}}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div style={{...card,marginBottom:'16px'}}>
        <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 2px'}}>Access & Registration</p>
        <Toggle label="Allow Registration"      desc="New users can sign up"          value={settings.allow_registration}    onChange={v=>set('allow_registration',v)} />
        <Toggle label="Require Admin Approval"  desc="New accounts need approval"     value={settings.require_approval}      onChange={v=>set('require_approval',v)} />
        <Toggle label="Maintenance Mode"        desc="Block all non-admin access"     value={settings.maintenance_mode}      onChange={v=>set('maintenance_mode',v)} />
        <NumInput label="Max Login Attempts"    desc="Before account lockout"         value={settings.max_login_attempts}    min={1} max={20} onChange={v=>set('max_login_attempts',v)} />
        <div style={{padding:'14px 0',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'16px'}}>
          <div>
            <p style={{fontWeight:600,color:'#f9fafb',margin:'0 0 3px',fontSize:'.875rem'}}>Session Timeout (hours)</p>
            <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>Auto-logout after inactivity</p>
          </div>
          <input type="number" min={1} max={168} value={settings.session_timeout_hours}
            onChange={e=>set('session_timeout_hours',+e.target.value)}
            style={{width:'72px',background:'#111827',border:'1px solid #374151',borderRadius:'8px',padding:'6px 10px',color:'#f9fafb',fontSize:'.875rem',outline:'none',textAlign:'center'}} />
        </div>
      </div>

      <div style={card}>
        <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 2px'}}>Notifications</p>
        <Toggle label="Enable Notifications" desc="Send system notifications to users" value={settings.enable_notifications} onChange={v=>set('enable_notifications',v)} />
      </div>
    </div>
  )
}
""")

# admin/Subscriptions.jsx
write('frontend/src/pages/admin/Subscriptions.jsx', """import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/subscriptions')
      .then(r => setSubs(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const statusColor = s =>
    s === 'active'  ? {bg:'rgba(16,185,129,0.15)',fg:'#34d399'} :
    s === 'expired' ? {bg:'rgba(239,68,68,0.15)', fg:'#f87171'} :
                      {bg:'rgba(245,158,11,0.15)',fg:'#fbbf24'}

  const filtered = subs.filter(s =>
    !search ||
    s.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    s.plan_id?.toLowerCase().includes(search.toLowerCase()) ||
    s.status?.toLowerCase().includes(search.toLowerCase())
  )

  const active  = subs.filter(s => s.status === 'active').length
  const revenue = subs.filter(s => s.status === 'active').reduce((t, s) => t + (+s.amount || 0), 0)

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Subscriptions</h1>
        <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{subs.length} total · {active} active · KES {revenue.toLocaleString()} MRR</p>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, plan or status…"
        style={{width:'100%',background:'#1a2234',border:'1.5px solid #1f2937',borderRadius:'10px',padding:'11px 16px',color:'#f9fafb',fontSize:'.9rem',outline:'none',marginBottom:'16px',boxSizing:'border-box'}} />

      {filtered.length === 0 ? (
        <div style={{background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'56px 20px',textAlign:'center'}}>
          <p style={{fontSize:'3rem',margin:'0 0 12px'}}>💳</p>
          <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>{search ? 'No results' : 'No subscriptions yet'}</p>
          <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>{search ? 'Try a different search.' : 'Subscriptions appear here when users subscribe.'}</p>
        </div>
      ) : (
        <div style={{background:'#111827',border:'1px solid #1f2937',borderRadius:'16px',overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.82rem'}}>
              <thead>
                <tr style={{borderBottom:'1px solid #1f2937'}}>
                  {['User','Plan','Status','Amount','Expires','Last Payment'].map(h => (
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'#6b7280',fontWeight:600,fontSize:'.75rem',textTransform:'uppercase',letterSpacing:'.4px',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const sc = statusColor(s.status)
                  return (
                    <tr key={s.id || i} style={{borderBottom:'1px solid #1f2937',transition:'background 0.1s'}}
                      onMouseEnter={e => e.currentTarget.style.background='#161b27'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'11px 16px',color:'#9ca3af',fontFamily:'monospace'}}>{s.user_id?.slice(0,10)||'—'}…</td>
                      <td style={{padding:'11px 16px',color:'#f9fafb',fontWeight:600,textTransform:'capitalize'}}>{s.plan_id||'—'}</td>
                      <td style={{padding:'11px 16px'}}><span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 8px',borderRadius:'20px',background:sc.bg,color:sc.fg}}>{s.status}</span></td>
                      <td style={{padding:'11px 16px',color:'#9ca3af'}}>KES {s.amount ? Number(s.amount).toLocaleString() : '—'}</td>
                      <td style={{padding:'11px 16px',color:'#6b7280',whiteSpace:'nowrap'}}>{s.expiry_date ? new Date(s.expiry_date).toLocaleDateString() : '—'}</td>
                      <td style={{padding:'11px 16px',color:'#6b7280',whiteSpace:'nowrap'}}>{s.last_payment_date ? new Date(s.last_payment_date).toLocaleDateString() : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
""")

print()
print('====================================================')
print('ALL FIXES APPLIED')
print()
print('Backend SQL fixes:')
print('  dashboardController.js  - unnest(jsonb) -> jsonb_array_elements_text()')
print('  assignmentsController.js - ANY(jsonb) -> EXISTS subquery')
print('  Added: getTeacherAssignments, getTeacherSubmissions, gradeSubmission')
print()
print('Frontend pages built:')
print('  student: Progress, Badges, Quizzes')
print('  teacher: Assignments, ClassProgress, Submissions, Messages')
print('  parent:  Progress, Messages, Notifications, Subscription')
print('  admin:   Settings, Subscriptions')
print()
print('IMPORTANT: If routes were not auto-patched, manually add to')
print('your assignments routes file:')
print("  router.get('/teacher/:teacherId', auth, getTeacherAssignments)")
print("  router.get('/teacher/:teacherId/submissions', auth, getTeacherSubmissions)")
print("  router.patch('/submissions/:id', auth, gradeSubmission)")
print()
print('Restart: backend (rs) then frontend (npm run dev)')
print('====================================================')