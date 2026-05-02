import os, sys

BASE = os.path.expanduser(r'~\Downloads\eduapp')
BACK = os.path.join(BASE, 'backend', 'src')
FRONT = os.path.join(BASE, 'frontend', 'src', 'pages', 'auth')
os.makedirs(FRONT, exist_ok=True)

# ─────────────────────────────────────────────────────────────
# 1. BACKEND — migrate.js  (adds username + phone columns)
# ─────────────────────────────────────────────────────────────
migrate = r"""require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Core users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY,
        name          TEXT NOT NULL,
        email         TEXT UNIQUE,
        phone         TEXT UNIQUE,
        username      TEXT UNIQUE,
        password_hash TEXT NOT NULL,
        role          TEXT NOT NULL DEFAULT 'student',
        status        TEXT NOT NULL DEFAULT 'active',
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Unlock requests table (for students / users without email)
    await client.query(`
      CREATE TABLE IF NOT EXISTS unlock_requests (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT NOT NULL,
        phone       TEXT,
        reason      TEXT,
        role        TEXT,
        status      TEXT DEFAULT 'pending',
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key   TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    await client.query('COMMIT');
    console.log('Migration complete.');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(e => { console.error(e); process.exit(1); });
"""

# ─────────────────────────────────────────────────────────────
# 2. BACKEND — routes/auth.js
# ─────────────────────────────────────────────────────────────
auth_route = r"""require('dotenv').config();
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const router   = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123456789';

// ── helpers ──────────────────────────────────────────────────
function makeToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, role, password, email, phone, username } = req.body;

    if (!name || !password || !role)
      return res.status(400).json({ error: 'Name, role and password are required.' });

    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    // For non-students, at least one identifier required
    if (role !== 'student' && !email && !phone && !username)
      return res.status(400).json({ error: 'Please provide an email, phone number, or username.' });

    // Duplicate checks
    if (email) {
      const ex = await query('SELECT id FROM users WHERE email=$1', [email]);
      if (ex.rows.length) return res.status(409).json({ error: 'Email already registered.' });
    }
    if (phone) {
      const ex = await query('SELECT id FROM users WHERE phone=$1', [phone]);
      if (ex.rows.length) return res.status(409).json({ error: 'Phone number already registered.' });
    }
    if (username) {
      const ex = await query('SELECT id FROM users WHERE username=$1', [username.toLowerCase()]);
      if (ex.rows.length) return res.status(409).json({ error: 'Username already taken.' });
    }
    // Students: check by name
    if (role === 'student') {
      const ex = await query('SELECT id FROM users WHERE name ILIKE $1 AND role=$2', [name, 'student']);
      if (ex.rows.length) return res.status(409).json({ error: 'A student with this name already exists.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const id   = uuid();
    const status = 'active';

    await query(
      `INSERT INTO users(id,name,email,phone,username,password_hash,role,status)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, name, email||null, phone||null, username ? username.toLowerCase() : null, hash, role, status]
    );

    const user = { id, name, role };
    res.status(201).json({ token: makeToken(user), user });
  } catch (e) {
    console.error('register error', e);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ error: 'Identifier and password are required.' });

    // Try email, phone, username, then name (student)
    const { rows } = await query(
      `SELECT * FROM users
       WHERE email    = $1
          OR phone    = $1
          OR username = LOWER($1)
          OR (role='student' AND name ILIKE $1)
       LIMIT 1`,
      [identifier]
    );

    if (!rows.length)
      return res.status(401).json({ error: 'Account not found. Check your credentials.' });

    const user = rows[0];

    if (user.status === 'suspended')
      return res.status(403).json({ error: 'Your account has been suspended. Contact admin.' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ error: 'Incorrect password.' });

    const token = makeToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email }
    });
  } catch (e) {
    console.error('login error', e);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// ── POST /api/auth/admin-unlock-request ──────────────────────
router.post('/admin-unlock-request', async (req, res) => {
  try {
    const { name, phone, reason, role } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });

    await query(
      `INSERT INTO unlock_requests(name,phone,reason,role) VALUES($1,$2,$3,$4)`,
      [name, phone||null, reason||null, role||null]
    );
    res.json({ message: 'Request submitted. An admin will review it shortly.' });
  } catch (e) {
    console.error('unlock request error', e);
    res.status(500).json({ error: 'Could not submit request.' });
  }
});

// ── GET /api/auth/unlock-requests (admin only) ────────────────
router.get('/unlock-requests', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM unlock_requests ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Could not fetch requests.' });
  }
});

// ── POST /api/auth/unlock-approve ────────────────────────────
router.post('/unlock-approve', async (req, res) => {
  try {
    const { requestId, name, role, tempPassword } = req.body;
    const hash = await bcrypt.hash(tempPassword || 'EduApp@1234', 12);
    const id   = uuid();
    await query(
      `INSERT INTO users(id,name,password_hash,role,status) VALUES($1,$2,$3,$4,'active')
       ON CONFLICT DO NOTHING`,
      [id, name, hash, role || 'student']
    );
    await query(
      `UPDATE unlock_requests SET status='approved' WHERE id=$1`,
      [requestId]
    );
    res.json({ message: 'Account created and request approved.' });
  } catch (e) {
    res.status(500).json({ error: 'Approval failed.' });
  }
});

module.exports = router;
"""

# ─────────────────────────────────────────────────────────────
# 3. FRONTEND — Login.jsx
# ─────────────────────────────────────────────────────────────
login_jsx = r"""import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore(s => s.setAuth);
  const [id, setId]         = useState("");
  const [pw, setPw]         = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("remember_id");
    if (saved) { setId(saved); setRemember(true); }
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { identifier: id, password: pw });
      if (remember) localStorage.setItem("remember_id", id);
      else          localStorage.removeItem("remember_id");
      if (data.token) {
        // try setAuth, fallback to direct store
        try { setAuth(data.token, data.user); } catch { }
        useAuthStore.setState({ token: data.token, user: data.user });
      }
      const dash = { admin:"/admin", teacher:"/teacher", parent:"/parent", student:"/student" };
      navigate(dash[data.user?.role] || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="lr-root">
      {/* Left panel */}
      <div className="lr-left">
        <div className="lr-brand">
          <span className="lr-logo">🎓</span>
          <span className="lr-name">EduApp</span>
        </div>
        <div className="lr-hero">
          <h1>Learn.<br/>Grow.<br/>Succeed.</h1>
          <p>A smart platform for students, teachers and parents all in one place.</p>
        </div>
        <div className="lr-roles">
          <span className="role-pill student">📚 Student</span>
          <span className="role-pill teacher">🏫 Teacher</span>
          <span className="role-pill parent">👨‍👩‍👧 Parent</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="lr-right">
        <div className="lr-form-wrap">
          <h2 className="lr-title">Welcome back</h2>
          <p className="lr-sub">Sign in to your account</p>

          {error && <div className="lr-alert">{error}</div>}

          <form onSubmit={submit} className="lr-form">
            {/* Identifier */}
            <div className="lr-field">
              <label>Email / Phone / Username / Full name</label>
              <div className="lr-iw">
                <span className="lr-ii">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </span>
                <input
                  type="text" placeholder="Enter your identifier" value={id}
                  onChange={e => setId(e.target.value)} required autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="lr-field">
              <label>Password</label>
              <div className="lr-iw">
                <span className="lr-ii">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  type={showPw ? "text" : "password"} placeholder="Your password" value={pw}
                  onChange={e => setPw(e.target.value)} required
                />
                <button type="button" className="lr-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw
                    ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="lr-row">
              <label className="lr-check">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
                <span className="lr-box"/>
                Remember me
              </label>
              <Link to="/forgot-password" className="lr-forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="lr-btn" disabled={loading}>
              {loading ? <span className="spin"/> : "Sign in"}
            </button>

            <p className="lr-signup">Don&apos;t have an account? <Link to="/signup">Create account</Link></p>

            <div className="lr-divider"><span>Sign in as</span></div>
            <div className="lr-role-btns">
              <button type="button" className="role-btn" onClick={() => navigate("/signup?role=student")}>📚 Student</button>
              <button type="button" className="role-btn" onClick={() => navigate("/signup?role=teacher")}>🏫 Teacher</button>
              <button type="button" className="role-btn" onClick={() => navigate("/signup?role=parent")}>👨‍👩‍👧 Parent</button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .lr-root{min-height:100vh;display:flex;font-family:'Segoe UI',system-ui,sans-serif;background:#0a0f1e}
        /* Left */
        .lr-left{width:42%;background:linear-gradient(145deg,#2d1b69,#1e3a8a,#0f172a);padding:48px 44px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
        .lr-left::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,rgba(99,102,241,.3),transparent 60%)}
        .lr-brand{display:flex;align-items:center;gap:10px;position:relative}
        .lr-logo{font-size:1.8rem}
        .lr-name{font-size:1.4rem;font-weight:800;color:#fff}
        .lr-hero{position:relative}
        .lr-hero h1{font-size:3.2rem;font-weight:900;color:#fff;line-height:1.1;letter-spacing:-1px}
        .lr-hero p{color:rgba(255,255,255,.65);margin-top:16px;font-size:.95rem;line-height:1.6;max-width:280px}
        .lr-roles{display:flex;flex-wrap:wrap;gap:8px;position:relative}
        .role-pill{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(8px);color:#e0e7ff;padding:8px 14px;border-radius:999px;font-size:.8rem;font-weight:600}
        /* Right */
        .lr-right{flex:1;display:flex;align-items:center;justify-content:center;background:#0d1117;padding:32px 24px}
        .lr-form-wrap{width:min(420px,100%)}
        .lr-title{font-size:2rem;font-weight:800;color:#f9fafb}
        .lr-sub{color:#6b7280;margin-top:4px;margin-bottom:24px;font-size:.95rem}
        .lr-alert{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);color:#fca5a5;padding:11px 14px;border-radius:10px;font-size:.875rem;margin-bottom:16px}
        .lr-form{display:flex;flex-direction:column;gap:18px}
        .lr-field{display:flex;flex-direction:column;gap:6px}
        .lr-field label{font-size:.75rem;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px}
        .lr-iw{position:relative}
        .lr-ii{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#6b7280;pointer-events:none;display:flex;align-items:center}
        .lr-iw input{width:100%;background:#161b27;border:1.5px solid #1f2937;border-radius:10px;padding:12px 44px 12px 40px;color:#f9fafb;font-size:.95rem;outline:none;transition:border-color .2s,box-shadow .2s}
        .lr-iw input::placeholder{color:#374151}
        .lr-iw input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
        .lr-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#6b7280;display:flex;align-items:center;padding:4px;transition:color .2s;border-radius:6px}
        .lr-eye:hover{color:#a5b4fc}
        .lr-row{display:flex;align-items:center;justify-content:space-between}
        .lr-check{display:flex;align-items:center;gap:8px;cursor:pointer;color:#9ca3af;font-size:.875rem;user-select:none}
        .lr-check input{display:none}
        .lr-box{width:18px;height:18px;border:2px solid #374151;border-radius:5px;background:#1f2937;display:inline-flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
        .lr-check input:checked~.lr-box{background:#6366f1;border-color:#6366f1}
        .lr-check input:checked~.lr-box::after{content:'✓';color:#fff;font-size:.65rem;font-weight:800}
        .lr-forgot{color:#818cf8;font-size:.875rem;font-weight:600;text-decoration:none}
        .lr-forgot:hover{text-decoration:underline}
        .lr-btn{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border:none;border-radius:10px;padding:14px;font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .2s,transform .1s;box-shadow:0 4px 24px rgba(99,102,241,.4)}
        .lr-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
        .lr-btn:disabled{opacity:.5;cursor:not-allowed}
        .lr-signup{text-align:center;color:#6b7280;font-size:.875rem}
        .lr-signup a{color:#818cf8;font-weight:600;text-decoration:none}
        .lr-signup a:hover{text-decoration:underline}
        .lr-divider{display:flex;align-items:center;gap:12px;color:#374151;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
        .lr-divider::before,.lr-divider::after{content:'';flex:1;height:1px;background:#1f2937}
        .lr-divider span{color:#4b5563}
        .lr-role-btns{display:flex;gap:8px;justify-content:center}
        .role-btn{background:#1f2937;border:1.5px solid #374151;color:#9ca3af;border-radius:999px;padding:8px 16px;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s}
        .role-btn:hover{border-color:#6366f1;color:#a5b4fc;background:rgba(99,102,241,.08)}
        .spin{width:20px;height:20px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:720px){.lr-left{display:none}.lr-right{padding:24px 16px}}
      `}</style>
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────
# 4. FRONTEND — Signup.jsx (role-specific, clickable)
# ─────────────────────────────────────────────────────────────
signup_jsx = r"""import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../services/api";

const ROLES = [
  { value:"student",  label:"Student",  icon:"📚", desc:"I want to learn",        color:"#6366f1" },
  { value:"teacher",  label:"Teacher",  icon:"🏫", desc:"I want to teach",        color:"#0ea5e9" },
  { value:"parent",   label:"Parent",   icon:"👨‍👩‍👧", desc:"I monitor my child",    color:"#10b981" },
];

const ID_TYPES = [
  { value:"email",    label:"Email",    icon:"📧", placeholder:"you@example.com" },
  { value:"phone",    label:"Phone",    icon:"📱", placeholder:"+254 700 000 000" },
  { value:"username", label:"Username", icon:"@",  placeholder:"johndoe123" },
];

function Eye({ show, toggle }) {
  return (
    <button type="button" className="eye-btn" onClick={toggle}>
      {show
        ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
        : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      }
    </button>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep]     = useState(1);
  const [role, setRole]     = useState(params.get("role") || "");
  const [idType, setIdType] = useState("email");
  const [form, setForm]     = useState({ name:"", idValue:"", password:"", confirm:"" });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { if (params.get("role")) setStep(2); }, []);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const strength = pw => {
    if (!pw) return null;
    if (pw.length >= 12 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label:"Strong", cls:"strong", pct:"100%" };
    if (pw.length >= 8) return { label:"Medium", cls:"medium", pct:"60%" };
    return { label:"Weak", cls:"weak", pct:"30%" };
  };
  const str = strength(form.password);

  const goStep2 = () => {
    if (!role) { setError("Please select a role."); return; }
    setError(""); setStep(2);
  };

  const submit = async e => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const body = { name: form.name, role, password: form.password };
      if (role !== "student") body[idType] = form.idValue;
      await api.post("/api/auth/register", body);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="su-root">
      <div className="su-bg"><div className="b1"/><div className="b2"/><div className="b3"/><div className="g"/></div>

      <div className="su-card">
        <div className="su-top">
          <span className="su-logo">🎓</span>
          <h2 className="su-title">Create your account</h2>
          <p className="su-sub">Join EduApp — it&apos;s free</p>
        </div>

        {/* Step bar */}
        <div className="step-bar">
          {["Choose role","Your details"].map((s,i)=>(
            <div key={s} className={`step-item ${step===i+1?"active":""} ${step>i+1?"done":""}`}>
              <div className="sdot">{step>i+1?"✓":i+1}</div>
              <span>{s}</span>
              {i===0&&<div className="scon"/>}
            </div>
          ))}
        </div>

        {error   && <div className="alert err">{error}</div>}
        {success && <div className="alert ok">{success}</div>}

        {/* ── STEP 1: Role ── */}
        {step === 1 && (
          <div className="role-section">
            <p className="role-prompt">Who are you signing up as?</p>
            <div className="role-grid">
              {ROLES.map(r => (
                <button key={r.value} type="button"
                  className={`role-card ${role===r.value?"selected":""}`}
                  style={{ "--rc":r.color }}
                  onClick={() => { setRole(r.value); setError(""); }}
                >
                  <span className="rc-icon">{r.icon}</span>
                  <div className="rc-text">
                    <span className="rc-label">{r.label}</span>
                    <span className="rc-desc">{r.desc}</span>
                  </div>
                  <div className={`rc-radio ${role===r.value?"on":""}`}>
                    {role===r.value && <div className="rc-dot"/>}
                  </div>
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={goStep2} disabled={!role}>Continue →</button>
            <p className="hint-link">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        )}

        {/* ── STEP 2: Details ── */}
        {step === 2 && (
          <form onSubmit={submit} className="su-form">
            {/* Role chip */}
            <div className="role-chip">
              <span>{ROLES.find(r=>r.value===role)?.icon} {ROLES.find(r=>r.value===role)?.label}</span>
              <button type="button" className="chip-change" onClick={()=>{setStep(1);setError("");}}>Change</button>
            </div>

            {/* Full name */}
            <div className="field">
              <label>Full name</label>
              <div className="iw">
                <span className="ii">👤</span>
                <input name="name" type="text" placeholder="Jane Doe" value={form.name} onChange={change} required autoFocus/>
              </div>
            </div>

            {/* Identifier — only for non-students */}
            {role !== "student" && (
              <div className="field">
                <label>Sign in with</label>
                <div className="id-tabs">
                  {ID_TYPES.map(t=>(
                    <button key={t.value} type="button"
                      className={`id-tab ${idType===t.value?"active":""}`}
                      onClick={()=>{ setIdType(t.value); setForm(f=>({...f,idValue:""})); }}
                    >
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
                <div className="iw" style={{marginTop:"8px"}}>
                  <span className="ii">{ID_TYPES.find(t=>t.value===idType)?.icon}</span>
                  <input
                    name="idValue"
                    type={idType==="email"?"email":idType==="phone"?"tel":"text"}
                    placeholder={ID_TYPES.find(t=>t.value===idType)?.placeholder}
                    value={form.idValue}
                    onChange={change}
                    required
                  />
                </div>
              </div>
            )}

            {/* Student note */}
            {role === "student" && (
              <div className="student-note">
                <span>ℹ️</span>
                <p>Students log in using their <strong>full name</strong> and password. No email needed.</p>
              </div>
            )}

            {/* Password */}
            <div className="field">
              <label>Password</label>
              <div className="iw">
                <span className="ii">🔒</span>
                <input name="password" type={showPw?"text":"password"} placeholder="Min. 8 characters"
                  value={form.password} onChange={change} required/>
                <Eye show={showPw} toggle={()=>setShowPw(v=>!v)}/>
              </div>
              {str && (
                <div className="str-row">
                  <div className="str-track"><div className={`str-fill ${str.cls}`} style={{width:str.pct}}/></div>
                  <span className={`str-lbl ${str.cls}`}>{str.label}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="field">
              <label>Confirm password</label>
              <div className="iw">
                <span className="ii">🛡️</span>
                <input name="confirm" type={showCf?"text":"password"} placeholder="Repeat password"
                  value={form.confirm} onChange={change} required/>
                <Eye show={showCf} toggle={()=>setShowCf(v=>!v)}/>
              </div>
              {form.confirm && (
                <span className={`match ${form.confirm===form.password?"ok":"no"}`}>
                  {form.confirm===form.password?"✓ Passwords match":"✗ Does not match"}
                </span>
              )}
            </div>

            <div className="btn-row">
              <button type="button" className="btn-back" onClick={()=>{setStep(1);setError("");}}>← Back</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading?<span className="spin"/>:"Create account"}
              </button>
            </div>
            <p className="hint-link">Already have an account? <Link to="/login">Sign in</Link></p>
          </form>
        )}
      </div>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .su-root{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',system-ui,sans-serif;background:#0a0f1e;padding:24px 16px;position:relative;overflow:hidden}
        .su-bg{position:fixed;inset:0;z-index:0}
        .b1,.b2,.b3{position:absolute;border-radius:50%;filter:blur(80px);opacity:.28;animation:drift 13s ease-in-out infinite alternate}
        .b1{width:500px;height:500px;background:#4f46e5;top:-120px;left:-80px}
        .b2{width:350px;height:350px;background:#7c3aed;bottom:-80px;right:-60px;animation-delay:-5s}
        .b3{width:260px;height:260px;background:#0ea5e9;top:55%;left:58%;animation-delay:-9s}
        .g{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:40px 40px}
        @keyframes drift{from{transform:translate(0,0)}to{transform:translate(22px,16px) scale(1.07)}}
        .su-card{position:relative;z-index:1;width:min(500px,100%);background:#111827;border-radius:24px;padding:44px 40px;box-shadow:0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.07);display:flex;flex-direction:column;gap:20px}
        .su-top{text-align:center}.su-logo{font-size:2.5rem}
        .su-title{font-size:1.6rem;font-weight:800;color:#f9fafb;margin-top:8px}
        .su-sub{color:#6b7280;font-size:.9rem;margin-top:4px}
        .step-bar{display:flex;align-items:center;justify-content:center;gap:0}
        .step-item{display:flex;align-items:center;gap:7px;font-size:.8rem;font-weight:600;color:#4b5563}
        .step-item.active{color:#818cf8}.step-item.done{color:#34d399}
        .sdot{width:26px;height:26px;border-radius:50%;background:#1f2937;border:2px solid #374151;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;transition:all .3s;flex-shrink:0}
        .step-item.active .sdot{background:#4f46e5;border-color:#6366f1;color:#fff}
        .step-item.done .sdot{background:#059669;border-color:#34d399;color:#fff}
        .scon{width:36px;height:2px;background:#1f2937;margin:0 8px}
        .alert{padding:10px 14px;border-radius:10px;font-size:.875rem}
        .err{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);color:#fca5a5}
        .ok{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);color:#86efac}
        /* Role section */
        .role-section{display:flex;flex-direction:column;gap:14px}
        .role-prompt{color:#9ca3af;font-size:.9rem;text-align:center}
        .role-grid{display:flex;flex-direction:column;gap:10px}
        .role-card{background:#1f2937;border:2px solid #374151;border-radius:14px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;text-align:left;width:100%}
        .role-card:hover{border-color:var(--rc,#6366f1);background:rgba(99,102,241,.06);transform:translateY(-1px)}
        .role-card.selected{border-color:var(--rc,#6366f1);background:rgba(99,102,241,.08)}
        .rc-icon{font-size:2rem;flex-shrink:0}
        .rc-text{flex:1;display:flex;flex-direction:column;gap:3px}
        .rc-label{font-size:1rem;font-weight:700;color:#f9fafb}
        .rc-desc{font-size:.8rem;color:#6b7280}
        .rc-radio{width:20px;height:20px;border-radius:50%;border:2px solid #374151;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s}
        .role-card.selected .rc-radio{border-color:var(--rc,#6366f1);background:rgba(99,102,241,.15)}
        .rc-dot{width:10px;height:10px;border-radius:50%;background:var(--rc,#6366f1)}
        /* Form */
        .su-form{display:flex;flex-direction:column;gap:16px}
        .role-chip{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);color:#a5b4fc;padding:8px 14px;border-radius:10px;font-size:.85rem;font-weight:600;display:flex;align-items:center;justify-content:space-between}
        .chip-change{background:none;border:none;color:#818cf8;font-size:.8rem;cursor:pointer;text-decoration:underline}
        .field{display:flex;flex-direction:column;gap:6px}
        .field label{font-size:.75rem;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px}
        .iw{position:relative}
        .ii{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#6b7280;font-size:.9rem;pointer-events:none;display:flex;align-items:center}
        .iw input{width:100%;background:#1f2937;border:1.5px solid #374151;border-radius:10px;padding:12px 44px 12px 40px;color:#f9fafb;font-size:.95rem;outline:none;transition:border-color .2s,box-shadow .2s}
        .iw input::placeholder{color:#4b5563}
        .iw input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
        .eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#6b7280;display:flex;align-items:center;padding:4px;border-radius:6px;transition:color .2s}
        .eye-btn:hover{color:#a5b4fc}
        /* ID type tabs */
        .id-tabs{display:flex;gap:8px}
        .id-tab{flex:1;background:#1f2937;border:1.5px solid #374151;color:#6b7280;border-radius:10px;padding:9px 6px;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:5px}
        .id-tab:hover{border-color:#6366f1;color:#a5b4fc}
        .id-tab.active{background:rgba(99,102,241,.12);border-color:#6366f1;color:#a5b4fc}
        /* Student note */
        .student-note{background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.2);border-radius:10px;padding:12px;display:flex;gap:8px;align-items:flex-start}
        .student-note span{font-size:1rem;flex-shrink:0}
        .student-note p{color:#7dd3fc;font-size:.85rem;line-height:1.5}
        .student-note strong{color:#bae6fd}
        /* Strength */
        .str-row{display:flex;align-items:center;gap:8px;margin-top:4px}
        .str-track{flex:1;height:4px;background:#1f2937;border-radius:2px;overflow:hidden}
        .str-fill{height:100%;border-radius:2px;transition:width .4s}
        .str-fill.weak{background:#ef4444}.str-fill.medium{background:#f59e0b}.str-fill.strong{background:#22c55e}
        .str-lbl{font-size:.75rem;font-weight:600}
        .str-lbl.weak{color:#ef4444}.str-lbl.medium{color:#f59e0b}.str-lbl.strong{color:#22c55e}
        .match{font-size:.78rem;margin-top:4px}.match.ok{color:#34d399}.match.no{color:#f87171}
        /* Buttons */
        .btn-primary{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border:none;border-radius:10px;padding:13px;font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .2s,transform .1s;box-shadow:0 4px 20px rgba(99,102,241,.35);flex:1}
        .btn-primary:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.45;cursor:not-allowed}
        .btn-back{background:#1f2937;border:1.5px solid #374151;color:#9ca3af;border-radius:10px;padding:13px 16px;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;flex-shrink:0}
        .btn-back:hover{border-color:#6366f1;color:#a5b4fc}
        .btn-row{display:flex;gap:10px}
        .hint-link{text-align:center;color:#6b7280;font-size:.875rem}
        .hint-link a{color:#818cf8;font-weight:600;text-decoration:none}
        .hint-link a:hover{text-decoration:underline}
        .spin{width:20px;height:20px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:500px){.su-card{padding:28px 18px}}
      `}</style>
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────
# 5. Write all files
# ─────────────────────────────────────────────────────────────
files = {
    os.path.join(BACK, 'db', 'migrate.js'):     migrate,
    os.path.join(BACK, 'routes', 'auth.js'):    auth_route,
    os.path.join(FRONT, 'Login.jsx'):           login_jsx,
    os.path.join(FRONT, 'Signup.jsx'):          signup_jsx,
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  wrote  {path}")

# Also ensure the backend registers the auth router in app.js
app_js_path = os.path.join(BACK, 'app.js')
if os.path.exists(app_js_path):
    with open(app_js_path, 'r', encoding='utf-8') as f:
        app_content = f.read()
    if "routes/auth" not in app_content and "authRouter" not in app_content:
        # Inject auth routes before module.exports
        injection = "\nconst authRouter = require('./routes/auth');\napp.use('/api/auth', authRouter);\n"
        app_content = app_content.replace("module.exports", injection + "\nmodule.exports")
        with open(app_js_path, 'w', encoding='utf-8') as f:
            f.write(app_content)
        print(f"  patched app.js to register /api/auth routes")
    else:
        print(f"  app.js already has auth routes")
else:
    print(f"  WARNING: {app_js_path} not found — manually add auth router")

print()
print("All done! Now run in backend terminal:")
print("  node src/db/migrate.js")
print("  npm run dev")
print()
print("Then restart frontend:")
print("  npm run dev")
