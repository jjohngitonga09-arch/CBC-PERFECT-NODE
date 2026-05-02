import os, re

BASE  = os.path.expanduser(r'~\Downloads\eduapp')
BACK  = os.path.join(BASE, 'backend', 'src')
FRONT = os.path.join(BASE, 'frontend', 'src', 'pages', 'auth')
os.makedirs(FRONT, exist_ok=True)

# Fix app.js
app_path = os.path.join(BACK, 'app.js')
if os.path.exists(app_path):
    src = open(app_path, encoding='utf-8').read()
    src = re.sub(r".*authRouter.*\n", "", src)
    src = re.sub(r".*routes/auth.*\n", "", src)
    src = re.sub(r".*app\.use\(['\"]\/api\/auth['\"].*\n", "", src)
    src = re.sub(r".*app\.use\(['\"]\/auth['\"].*\n", "", src)
    inject = "\nconst _authRouter = require('./routes/auth');\napp.use('/api/auth', _authRouter);\n"
    if 'module.exports' in src:
        src = src.replace('module.exports', inject + '\nmodule.exports')
    else:
        src += inject
    open(app_path, 'w', encoding='utf-8').write(src)
    print("  fixed  app.js")
else:
    print("  WARNING: app.js not found at", app_path)

# Write auth.js
auth_js = """require('dotenv').config();
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const router  = express.Router();
const SECRET  = process.env.JWT_SECRET || 'supersecretkey123456789';

function makeToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, role, password, email, phone, username } = req.body;
    if (!name || !password || !role)
      return res.status(400).json({ error: 'Name, role and password are required.' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (role !== 'student' && !email && !phone && !username)
      return res.status(400).json({ error: 'Provide an email, phone, or username.' });
    if (email) {
      const ex = await query('SELECT id FROM users WHERE email=$1', [email]);
      if (ex.rows.length) return res.status(409).json({ error: 'Email already registered.' });
    }
    if (phone) {
      const ex = await query('SELECT id FROM users WHERE phone=$1', [phone]);
      if (ex.rows.length) return res.status(409).json({ error: 'Phone already registered.' });
    }
    if (username) {
      const ex = await query('SELECT id FROM users WHERE username=LOWER($1)', [username]);
      if (ex.rows.length) return res.status(409).json({ error: 'Username already taken.' });
    }
    const hash = await bcrypt.hash(password, 12);
    const id   = uuid();
    await query(
      `INSERT INTO users(id,name,email,phone,username,password_hash,role,status) VALUES($1,$2,$3,$4,$5,$6,$7,'active')`,
      [id, name, email||null, phone||null, username ? username.toLowerCase() : null, hash, role]
    );
    res.status(201).json({ token: makeToken({ id, name, role }), user: { id, name, role } });
  } catch (e) {
    console.error('register:', e.message);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const id = req.body.identifier || req.body.email || '';
    const pw = req.body.password || '';
    if (!id || !pw)
      return res.status(400).json({ error: 'Please enter your identifier and password.' });
    const { rows } = await query(
      `SELECT * FROM users WHERE email=$1 OR phone=$1 OR username=LOWER($1) OR (role='student' AND name ILIKE $1) LIMIT 1`,
      [id]
    );
    if (!rows.length) return res.status(401).json({ error: 'Account not found.' });
    const user = rows[0];
    if (user.status === 'suspended')
      return res.status(403).json({ error: 'Account suspended. Contact admin.' });
    const ok = await bcrypt.compare(pw, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Incorrect password.' });
    res.json({ token: makeToken(user), user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (e) {
    console.error('login:', e.message);
    res.status(500).json({ error: 'Login failed.' });
  }
});

router.post('/admin-unlock-request', async (req, res) => {
  try {
    const { name, phone, reason, role } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });
    await query(`INSERT INTO unlock_requests(name,phone,reason,role) VALUES($1,$2,$3,$4)`, [name, phone||null, reason||null, role||'student']);
    res.json({ message: 'Request submitted.' });
  } catch (e) { res.json({ message: 'Request received.' }); }
});

router.get('/unlock-requests', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM unlock_requests ORDER BY created_at DESC`);
    res.json(rows);
  } catch (e) { res.json([]); }
});

router.post('/unlock-approve', async (req, res) => {
  try {
    const { requestId, name, role, tempPassword } = req.body;
    const hash = await bcrypt.hash(tempPassword || 'EduApp@1234', 12);
    await query(`INSERT INTO users(id,name,password_hash,role,status) VALUES($1,$2,$3,$4,'active') ON CONFLICT DO NOTHING`, [uuid(), name, hash, role||'student']);
    await query(`UPDATE unlock_requests SET status='approved' WHERE id=$1`, [requestId]);
    res.json({ message: 'Approved.' });
  } catch (e) { res.status(500).json({ error: 'Approval failed.' }); }
});

module.exports = router;
"""

os.makedirs(os.path.join(BACK, 'routes'), exist_ok=True)
open(os.path.join(BACK, 'routes', 'auth.js'), 'w', encoding='utf-8').write(auth_js)
print("  wrote  auth.js")

# Write Login.jsx
login_jsx = """import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%}
.root{min-height:100vh;display:flex;font-family:'Segoe UI',system-ui,sans-serif;background:#0d1117}
.panel-left{display:none;width:44%;position:relative;overflow:hidden;background:linear-gradient(145deg,#1e1b4b,#1e3a8a 60%,#0f172a)}
.pl-inner{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:48px 44px}
.brand{display:flex;align-items:center;gap:10px}
.brand-icon{font-size:1.9rem}
.brand-name{font-size:1.4rem;font-weight:800;color:#fff}
.hero h1{font-size:3rem;font-weight:900;color:#fff;line-height:1.08;letter-spacing:-1px}
.hero p{color:rgba(255,255,255,.62);margin-top:16px;font-size:.95rem;line-height:1.65;max-width:290px}
.pills{display:flex;flex-wrap:wrap;gap:8px}
.pills span{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);color:#e0e7ff;padding:8px 14px;border-radius:999px;font-size:.8rem;font-weight:600}
.pl-blob1,.pl-blob2{position:absolute;border-radius:50%;filter:blur(80px);opacity:.35}
.pl-blob1{width:400px;height:400px;background:#4f46e5;top:-80px;left:-80px}
.pl-blob2{width:300px;height:300px;background:#0ea5e9;bottom:-60px;right:-60px}
.panel-right{flex:1;display:flex;align-items:center;justify-content:center;padding:32px 20px;overflow-y:auto}
.form-box{width:100%;max-width:420px}
.mob-brand{display:flex;align-items:center;gap:8px;font-size:1.3rem;font-weight:800;color:#f9fafb;margin-bottom:28px}
.mob-brand span:first-child{font-size:1.6rem}
h2.pg-title{font-size:1.9rem;font-weight:800;color:#f9fafb}
.sub{color:#6b7280;margin-top:4px;margin-bottom:24px;font-size:.95rem}
.alert{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);color:#fca5a5;padding:12px 14px;border-radius:10px;font-size:.875rem;margin-bottom:16px}
.field{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
.field label{font-size:.75rem;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px}
.inp-wrap{position:relative}
.inp-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#6b7280;pointer-events:none}
.inp-wrap input{width:100%;background:#161b27;border:1.5px solid #1f2937;border-radius:11px;padding:13px 46px 13px 40px;color:#f9fafb;font-size:1rem;outline:none;transition:border-color .2s,box-shadow .2s}
.inp-wrap input::placeholder{color:#374151}
.inp-wrap input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
.eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#6b7280;display:flex;align-items:center;padding:4px;border-radius:6px;transition:color .2s}
.eye:hover{color:#a5b4fc}
.row-mid{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.check-label{display:flex;align-items:center;gap:8px;cursor:pointer;color:#9ca3af;font-size:.875rem;user-select:none}
.check-label input{display:none}
.cb{width:18px;height:18px;border:2px solid #374151;border-radius:5px;background:#1f2937;display:inline-flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.check-label input:checked ~ .cb{background:#6366f1;border-color:#6366f1}
.forgot{color:#818cf8;font-size:.875rem;font-weight:600;text-decoration:none}
.forgot:hover{text-decoration:underline}
.btn-sign{width:100%;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border:none;border-radius:11px;padding:14px;font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(99,102,241,.4);transition:opacity .2s,transform .1s;margin-bottom:16px}
.btn-sign:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
.btn-sign:disabled{opacity:.5;cursor:not-allowed}
.create{text-align:center;color:#6b7280;font-size:.9rem;margin-bottom:20px}
.create a{color:#818cf8;font-weight:600;text-decoration:none}
.create a:hover{text-decoration:underline}
.divider{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:#1f2937}
.divider span{color:#4b5563;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.role-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.role-btn{background:#1a2234;border:1.5px solid #1f2937;color:#9ca3af;border-radius:999px;padding:9px 16px;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s}
.role-btn:hover{border-color:#6366f1;color:#a5b4fc;background:rgba(99,102,241,.08)}
.spin{width:20px;height:20px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
@media(min-width:700px){.panel-left{display:flex;flex-direction:column}.mob-brand{display:none}h2.pg-title{font-size:2.1rem}}
@media(min-width:1024px){.hero h1{font-size:3.4rem}.panel-right{padding:48px 56px}}
`;

export default function Login() {
  const navigate = useNavigate();
  const [id, setId]     = useState("");
  const [pw, setPw]     = useState("");
  const [show, setShow] = useState(false);
  const [rem,  setRem]  = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");

  useEffect(() => {
    const s = localStorage.getItem("rid");
    if (s) { setId(s); setRem(true); }
  }, []);

  const submit = async e => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const { data } = await api.post("/api/auth/login", { identifier: id, password: pw });
      rem ? localStorage.setItem("rid", id) : localStorage.removeItem("rid");
      try { useAuthStore.getState().setAuth(data.token, data.user); } catch(_) {}
      useAuthStore.setState({ token: data.token, user: data.user });
      const map = { admin:"/admin", teacher:"/teacher", parent:"/parent", student:"/student" };
      navigate(map[data.user?.role] || "/dashboard");
    } catch (e) {
      setErr(e.response?.data?.error || "Invalid credentials. Please try again.");
    } finally { setBusy(false); }
  };

  const EyeOpen = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );
  const EyeClosed = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  );

  return (
    <div className="root">
      <style>{CSS}</style>
      <div className="panel-left">
        <div className="pl-inner">
          <div className="brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-name">EduApp</span>
          </div>
          <div className="hero">
            <h1>Learn.<br/>Grow.<br/>Succeed.</h1>
            <p>A smart platform for students, teachers and parents all in one place.</p>
          </div>
          <div className="pills">
            <span>📚 Student</span><span>🏫 Teacher</span><span>👨‍👩‍👧 Parent</span>
          </div>
        </div>
        <div className="pl-blob1"/><div className="pl-blob2"/>
      </div>
      <div className="panel-right">
        <div className="form-box">
          <div className="mob-brand"><span>🎓</span><span>EduApp</span></div>
          <h2 className="pg-title">Welcome back</h2>
          <p className="sub">Sign in to your account</p>
          {err && <div className="alert">{err}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Email / Phone / Username / Full name</label>
              <div className="inp-wrap">
                <svg className="inp-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <input type="text" placeholder="Enter your identifier" value={id} onChange={e=>setId(e.target.value)} required autoFocus/>
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="inp-wrap">
                <svg className="inp-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input type={show?"text":"password"} placeholder="Your password" value={pw} onChange={e=>setPw(e.target.value)} required/>
                <button type="button" className="eye" onClick={()=>setShow(v=>!v)}>
                  {show ? <EyeOpen/> : <EyeClosed/>}
                </button>
              </div>
            </div>
            <div className="row-mid">
              <label className="check-label">
                <input type="checkbox" checked={rem} onChange={e=>setRem(e.target.checked)}/>
                <span className="cb"/>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot">Forgot password?</Link>
            </div>
            <button type="submit" className="btn-sign" disabled={busy}>
              {busy ? <span className="spin"/> : "Sign in"}
            </button>
            <p className="create">Don&apos;t have an account? <Link to="/signup">Create account</Link></p>
            <div className="divider"><span>Sign in as</span></div>
            <div className="role-row">
              <button type="button" className="role-btn" onClick={()=>navigate("/signup?role=student")}>📚 Student</button>
              <button type="button" className="role-btn" onClick={()=>navigate("/signup?role=teacher")}>🏫 Teacher</button>
              <button type="button" className="role-btn" onClick={()=>navigate("/signup?role=parent")}>👨‍👩‍👧 Parent</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
"""

open(os.path.join(FRONT, 'Login.jsx'), 'w', encoding='utf-8').write(login_jsx)
print("  wrote  Login.jsx")

# Write Signup.jsx
signup_jsx = """import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const ROLES = [
  { v:"student", label:"Student", icon:"📚", desc:"I want to learn",     color:"#6366f1" },
  { v:"teacher", label:"Teacher", icon:"🏫", desc:"I want to teach",     color:"#0ea5e9" },
  { v:"parent",  label:"Parent",  icon:"👨‍👩‍👧", desc:"I monitor my child", color:"#10b981" },
];
const ID_TYPES = [
  { v:"email",    label:"Email",    ph:"you@example.com",  icon:"📧" },
  { v:"phone",    label:"Phone",    ph:"+254 700 000 000", icon:"📱" },
  { v:"username", label:"Username", ph:"johndoe123",       icon:"@"  },
];

function EyeBtn({ show, toggle }) {
  return (
    <button type="button" onClick={toggle}
      style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",
        background:"none",border:"none",cursor:"pointer",color:"#6b7280",
        display:"flex",alignItems:"center",padding:"4px"}}>
      {show
        ? <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
        : <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      }
    </button>
  );
}

const inp = {width:"100%",background:"#1f2937",border:"1.5px solid #374151",borderRadius:"10px",
  padding:"12px 46px 12px 40px",color:"#f9fafb",fontSize:"1rem",outline:"none"};
const lbl = {fontSize:".75rem",fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".5px"};
const fld = {display:"flex",flexDirection:"column",gap:"6px"};

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initRole = params.get("role") || "";
  const [step,   setStep]   = useState(initRole ? 2 : 1);
  const [role,   setRole]   = useState(initRole);
  const [idType, setIdType] = useState("email");
  const [name,   setName]   = useState("");
  const [idVal,  setIdVal]  = useState("");
  const [pw,     setPw]     = useState("");
  const [cf,     setCf]     = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [busy,   setBusy]   = useState(false);
  const [err,    setErr]    = useState("");
  const [done,   setDone]   = useState("");

  const roleObj = ROLES.find(r => r.v === role);
  const pwStr = p => {
    if (!p) return null;
    if (p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return {l:"Strong",c:"#22c55e",w:"100%"};
    if (p.length >= 8) return {l:"Medium",c:"#f59e0b",w:"60%"};
    return {l:"Weak",c:"#ef4444",w:"28%"};
  };
  const str = pwStr(pw);

  const goNext = () => {
    if (!role) { setErr("Please select a role."); return; }
    setErr(""); setStep(2);
  };

  const submit = async e => {
    e.preventDefault(); setErr("");
    if (pw !== cf)     { setErr("Passwords do not match."); return; }
    if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
    setBusy(true);
    try {
      const body = { name, role, password: pw };
      if (role !== "student") body[idType] = idVal;
      await api.post("/api/auth/register", body);
      setDone("Account created! Taking you to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (e) {
      setErr(e.response?.data?.error || "Registration failed.");
    } finally { setBusy(false); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#0a0f1e",padding:"20px 16px",
      position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",width:"500px",height:"500px",borderRadius:"50%",
        background:"#4f46e5",top:"-120px",left:"-80px",filter:"blur(90px)",opacity:.27,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:"350px",height:"350px",borderRadius:"50%",
        background:"#7c3aed",bottom:"-80px",right:"-60px",filter:"blur(80px)",opacity:.27,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:"500px",
        background:"#111827",borderRadius:"24px",padding:"40px 32px",
        boxShadow:"0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.07)",
        display:"flex",flexDirection:"column",gap:"18px"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"2.4rem"}}>🎓</div>
          <h2 style={{fontSize:"1.55rem",fontWeight:800,color:"#f9fafb",margin:"8px 0 0"}}>Create your account</h2>
          <p style={{color:"#6b7280",fontSize:".9rem",marginTop:"4px"}}>Join EduApp — it&apos;s free</p>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          {["Choose role","Your details"].map((s,i) => {
            const done2=step>i+1, active=step===i+1;
            return (
              <div key={s} style={{display:"flex",alignItems:"center",gap:"7px",fontSize:".8rem",
                fontWeight:600,color:done2?"#34d399":active?"#818cf8":"#4b5563"}}>
                <div style={{width:"26px",height:"26px",borderRadius:"50%",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:700,
                  background:done2?"#059669":active?"#4f46e5":"#1f2937",
                  border:`2px solid ${done2?"#34d399":active?"#6366f1":"#374151"}`,
                  color:done2||active?"#fff":"inherit"}}>
                  {done2?"✓":i+1}
                </div>
                <span>{s}</span>
                {i===0 && <div style={{width:"36px",height:"2px",background:"#1f2937",margin:"0 8px"}}/>}
              </div>
            );
          })}
        </div>
        {err  && <div style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.3)",color:"#fca5a5",padding:"10px 14px",borderRadius:"10px",fontSize:".875rem"}}>{err}</div>}
        {done && <div style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",color:"#86efac",padding:"10px 14px",borderRadius:"10px",fontSize:".875rem"}}>{done}</div>}
        {step===1 && (
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <p style={{color:"#9ca3af",fontSize:".9rem",textAlign:"center"}}>Who are you signing up as?</p>
            {ROLES.map(r => (
              <button key={r.v} type="button" onClick={()=>{setRole(r.v);setErr("");}}
                style={{background:role===r.v?"rgba(99,102,241,.1)":"#1f2937",
                  border:`2px solid ${role===r.v?r.color:"#374151"}`,
                  borderRadius:"14px",padding:"16px 18px",display:"flex",alignItems:"center",
                  gap:"14px",cursor:"pointer",textAlign:"left",width:"100%"}}>
                <span style={{fontSize:"2rem"}}>{r.icon}</span>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:"2px"}}>
                  <span style={{fontSize:"1rem",fontWeight:700,color:"#f9fafb"}}>{r.label}</span>
                  <span style={{fontSize:".8rem",color:"#6b7280"}}>{r.desc}</span>
                </div>
                <div style={{width:"20px",height:"20px",borderRadius:"50%",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  border:`2px solid ${role===r.v?r.color:"#374151"}`,
                  background:role===r.v?"rgba(99,102,241,.15)":"transparent"}}>
                  {role===r.v && <div style={{width:"10px",height:"10px",borderRadius:"50%",background:r.color}}/>}
                </div>
              </button>
            ))}
            <button type="button" onClick={goNext} disabled={!role}
              style={{background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",border:"none",
                borderRadius:"10px",padding:"13px",fontSize:"1rem",fontWeight:700,
                cursor:role?"pointer":"not-allowed",opacity:role?1:.45,
                boxShadow:"0 4px 20px rgba(99,102,241,.35)"}}>
              Continue →
            </button>
            <p style={{textAlign:"center",color:"#6b7280",fontSize:".875rem"}}>
              Already have an account? <Link to="/login" style={{color:"#818cf8",fontWeight:600}}>Sign in</Link>
            </p>
          </div>
        )}
        {step===2 && (
          <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.25)",
              color:"#a5b4fc",padding:"8px 14px",borderRadius:"10px",fontSize:".85rem",
              fontWeight:600,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>{roleObj?.icon} {roleObj?.label}</span>
              <button type="button" onClick={()=>{setStep(1);setErr("");}}
                style={{background:"none",border:"none",color:"#818cf8",fontSize:".8rem",cursor:"pointer",textDecoration:"underline"}}>
                Change
              </button>
            </div>
            <div style={fld}>
              <label style={lbl}>Full name</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"1rem",color:"#6b7280",pointerEvents:"none"}}>👤</span>
                <input style={inp} type="text" placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} required autoFocus/>
              </div>
            </div>
            {role!=="student" && (
              <div style={fld}>
                <label style={lbl}>Sign in with</label>
                <div style={{display:"flex",gap:"8px"}}>
                  {ID_TYPES.map(t=>(
                    <button key={t.v} type="button" onClick={()=>{setIdType(t.v);setIdVal("");}}
                      style={{flex:1,background:idType===t.v?"rgba(99,102,241,.12)":"#1f2937",
                        border:`1.5px solid ${idType===t.v?"#6366f1":"#374151"}`,
                        color:idType===t.v?"#a5b4fc":"#6b7280",borderRadius:"10px",
                        padding:"9px 4px",fontSize:".82rem",fontWeight:600,cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                <div style={{position:"relative",marginTop:"4px"}}>
                  <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"1rem",color:"#6b7280",pointerEvents:"none"}}>
                    {ID_TYPES.find(t=>t.v===idType)?.icon}
                  </span>
                  <input style={inp} type={idType==="email"?"email":idType==="phone"?"tel":"text"}
                    placeholder={ID_TYPES.find(t=>t.v===idType)?.ph}
                    value={idVal} onChange={e=>setIdVal(e.target.value)} required/>
                </div>
              </div>
            )}
            {role==="student" && (
              <div style={{background:"rgba(14,165,233,.07)",border:"1px solid rgba(14,165,233,.2)",borderRadius:"10px",padding:"12px",display:"flex",gap:"8px"}}>
                <span>ℹ️</span>
                <p style={{color:"#7dd3fc",fontSize:".85rem",lineHeight:1.5,margin:0}}>
                  Students log in with their <strong style={{color:"#bae6fd"}}>full name</strong> + password. No email needed.
                </p>
              </div>
            )}
            <div style={fld}>
              <label style={lbl}>Password</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"1rem",color:"#6b7280",pointerEvents:"none"}}>🔒</span>
                <input style={inp} type={showPw?"text":"password"} placeholder="Min. 8 characters" value={pw} onChange={e=>setPw(e.target.value)} required/>
                <EyeBtn show={showPw} toggle={()=>setShowPw(v=>!v)}/>
              </div>
              {str && (
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"4px"}}>
                  <div style={{flex:1,height:"4px",background:"#1f2937",borderRadius:"2px",overflow:"hidden"}}>
                    <div style={{height:"100%",background:str.c,width:str.w,borderRadius:"2px",transition:"width .4s"}}/>
                  </div>
                  <span style={{fontSize:".75rem",fontWeight:600,color:str.c}}>{str.l}</span>
                </div>
              )}
            </div>
            <div style={fld}>
              <label style={lbl}>Confirm password</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"1rem",color:"#6b7280",pointerEvents:"none"}}>🛡️</span>
                <input style={inp} type={showCf?"text":"password"} placeholder="Repeat password" value={cf} onChange={e=>setCf(e.target.value)} required/>
                <EyeBtn show={showCf} toggle={()=>setShowCf(v=>!v)}/>
              </div>
              {cf && <span style={{fontSize:".78rem",color:cf===pw?"#34d399":"#f87171",marginTop:"2px"}}>{cf===pw?"✓ Passwords match":"✗ Does not match"}</span>}
            </div>
            <div style={{display:"flex",gap:"10px",marginTop:"4px"}}>
              <button type="button" onClick={()=>{setStep(1);setErr("");}}
                style={{background:"#1f2937",border:"1.5px solid #374151",color:"#9ca3af",
                  borderRadius:"10px",padding:"13px 16px",fontSize:".95rem",fontWeight:600,cursor:"pointer",flexShrink:0}}>← Back</button>
              <button type="submit" disabled={busy}
                style={{flex:1,background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",
                  border:"none",borderRadius:"10px",padding:"13px",fontSize:"1rem",fontWeight:700,
                  cursor:busy?"not-allowed":"pointer",opacity:busy?.5:1,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 4px 20px rgba(99,102,241,.35)"}}>
                {busy
                  ? <span style={{width:"20px",height:"20px",border:"2px solid rgba(255,255,255,.3)",
                      borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",
                      animation:"spin .7s linear infinite"}}/>
                  : "Create account"}
              </button>
            </div>
            <p style={{textAlign:"center",color:"#6b7280",fontSize:".875rem"}}>
              Already have an account? <Link to="/login" style={{color:"#818cf8",fontWeight:600}}>Sign in</Link>
            </p>
          </form>
        )}
      </div>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}
"""

open(os.path.join(FRONT, 'Signup.jsx'), 'w', encoding='utf-8').write(signup_jsx)
print("  wrote  Signup.jsx")

print()
print("All done!")
print("  Backend:  npm run dev")
print("  Frontend: hot-reloads automatically")
