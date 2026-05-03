import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function Login() {
 const navigate = useNavigate();
 const setAuth = useAuthStore(s => s.setAuth);
 const [identifier, setIdentifier] = useState("");
 const [password, setPassword] = useState("");
 const [show, setShow] = useState(false);
 const [remember, setRemember] = useState(false);
 const [busy, setBusy] = useState(false);
 const [err, setErr] = useState({ msg: "", type: "error" });
 const [capsLock, setCapsLock] = useState(false);
 const [shake, setShake] = useState(false);
 const [lastLogin, setLastLogin] = useState("");
 const passwordRef = useRef(null);

 useEffect(() => {
  const s = localStorage.getItem("edu_rid");
  if (s) { setIdentifier(s); setRemember(true); }
  const ll = localStorage.getItem("edu_last_login");
  if (ll) setLastLogin(ll);
 }, []);

 const triggerShake = () => {
  setShake(true);
  setTimeout(() => setShake(false), 600);
 };

 async function submit(e) {
  e.preventDefault();
  setErr({ msg: "", type: "error" });
  setBusy(true);
  try {
   const { data } = await api.post("/auth/login", { identifier, password });
   remember ? localStorage.setItem("edu_rid", identifier) : localStorage.removeItem("edu_rid");
   const now = new Date();
   const formatted = "Today at " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
   localStorage.setItem("edu_last_login", formatted);
   setAuth({ token: data.token, role: data.user.role, userId: data.user.id, grade: data.user.grade || null, linkedStudentIds: data.linkedStudentIds || [] });
   useAuthStore.getState().setUser(data.user);
   const map = { admin: "/admin/home", teacher: "/teacher/home", guardian: "/parent/home", parent: "/parent/home", student: "/student/home" };
   navigate(map[data.user.role] || "/admin/home", { replace: true });
  } catch (e) {
   triggerShake();
   const msg = e.response?.data?.error || "Invalid credentials";
   const status = e.response?.status;
   const lower = msg.toLowerCase();
   if (status === 403 && lower.includes("locked")) {
    setErr({ type: "locked", msg: "Your account has been locked after too many failed attempts. Contact your school admin to unlock it." });
   } else if (status === 403 && lower.includes("pending")) {
    setErr({ type: "warning", msg: "Your account is pending admin approval. You will be notified once approved." });
   } else if (status === 403 && lower.includes("verify")) {
    setErr({ type: "warning", msg: "Please verify your email before logging in." });
   } else if (status === 403 && lower.includes("suspended")) {
    setErr({ type: "locked", msg: "Your account has been suspended. Contact your school admin." });
   } else if (lower.includes("attempt")) {
    const match = msg.match(/(\d+)\/(\d+)/);
    const left = match ? Number(match[2]) - Number(match[1]) : null;
    setErr({ type: "warning", msg: left !== null ? `Wrong password - ${left} attempt${left === 1 ? "" : "s"} remaining before your account is locked.` : msg });
   } else {
    setErr({ type: "error", msg });
   }
  } finally { setBusy(false); }
 }

 const errStyles = {
  locked: { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.35)", color: "#fca5a5", label: "[LOCKED]" },
  warning: { bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.35)", color: "#fcd34d", label: "[WARNING]" },
  error: { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.3)", color: "#fca5a5", label: "" },
 };
 const es = errStyles[err.type] || errStyles.error;

 const inp = { width: "100%", background: "var(--surface)", border: "1.5px solid var(--border)",
  borderRadius: "10px", padding: "13px 16px", color: "var(--text)", fontSize: "1rem",
  outline: "none", boxSizing: "border-box" };

 return (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
   background: "var(--bg)", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "20px" }}>
   <style>{`
    @keyframes shake {
     0%,100%{transform:translateX(0)}
     15%{transform:translateX(-8px)}
     30%{transform:translateX(8px)}
     45%{transform:translateX(-6px)}
     60%{transform:translateX(6px)}
     75%{transform:translateX(-4px)}
     90%{transform:translateX(4px)}
    }
    .shake { animation: shake 0.6s ease; }
   `}</style>

   <div className={shake ? "shake" : ""} style={{ width: "100%", maxWidth: "420px", background: "var(--surface)", borderRadius: "16px",
    padding: "clamp(20px, 5vw, 40px) clamp(16px, 5vw, 32px)", boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>

    <div style={{ textAlign: "center", marginBottom: "32px" }}>
     <div style={{ fontSize: "2.5rem" }}>&#x1F4DA;</div>
     <h1 style={{ color: "var(--text)", fontSize: "1.8rem", fontWeight: 800, margin: "8px 0 4px" }}>Welcome back</h1>
     <p style={{ color: "var(--sub)", fontSize: ".9rem" }}>Sign in to EduApp</p>
    </div>

    {lastLogin && (
     <div style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)",
      borderRadius: "8px", padding: "8px 12px", marginBottom: "16px",
      fontSize: ".8rem", color: "#818cf8", display: "flex", alignItems: "center", gap: "6px" }}>
      &#x1F550; Last sign-in: {lastLogin}
     </div>
    )}

    {err.msg && (
     <div style={{ background: es.bg, border: `1px solid ${es.border}`, color: es.color,
      padding: "12px 14px", borderRadius: "10px", fontSize: ".875rem", marginBottom: "16px", lineHeight: 1.5 }}>
      {es.label && <span style={{ fontWeight: 700 }}>{es.label} </span>}
      {err.msg}
      {err.type === "locked" && (
       <div style={{ marginTop: "8px" }}>
        <Link to="/forgot-password" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none", fontSize: ".82rem" }}>
         Reset password &rarr;
        </Link>
       </div>
      )}
     </div>
    )}

    <form onSubmit={submit}>
     <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", color: "var(--sub)", fontSize: ".75rem", fontWeight: 600,
       textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "7px" }}>
       Email / Phone / Username
      </label>
      <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
       placeholder="student@school.com" required autoFocus style={inp}
       onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); passwordRef.current?.focus(); } }} />
     </div>

     <div style={{ marginBottom: capsLock ? "8px" : "20px", position: "relative" }}>
      <label style={{ display: "block", color: "var(--sub)", fontSize: ".75rem", fontWeight: 600,
       textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "7px" }}>Password</label>
      <input ref={passwordRef} type={show ? "text" : "password"} value={password}
       onChange={e => setPassword(e.target.value)} placeholder="" required
       style={{ ...inp, paddingRight: "44px" }}
       onKeyUp={e => setCapsLock(e.getModifierState("CapsLock"))}
       onFocus={e => setCapsLock(e.getModifierState("CapsLock"))} />
      <button type="button" onClick={() => setShow(v => !v)}
       style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer", color: "var(--sub)", display: "flex", alignItems: "center", padding: "4px" }}>
       {show
        ? (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>)
        : (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>)}
      </button>
     </div>

     {capsLock && (
      <div style={{ background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.3)",
       borderRadius: "8px", padding: "7px 12px", marginBottom: "16px",
       fontSize: ".8rem", color: "#fcd34d", display: "flex", alignItems: "center", gap: "6px" }}>
       &#x21EA; Caps Lock is ON &mdash; your password may be incorrect
      </div>
     )}

     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--sub)", fontSize: ".875rem" }}>
       <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
        style={{ width: "16px", height: "16px", accentColor: "#6366f1" }} />
       Remember me
      </label>
      <Link to="/forgot-password" style={{ color: "#818cf8", fontSize: ".875rem", fontWeight: 600, textDecoration: "none" }}>
       Forgot password?
      </Link>
     </div>

     <button type="submit" disabled={busy}
      style={{ width: "100%", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff",
       border: "none", borderRadius: "10px", padding: "14px", fontSize: "1rem", fontWeight: 700,
       cursor: busy ? "not-allowed" : "pointer", opacity: busy ? .6 : 1, marginBottom: "16px",
       boxShadow: "0 4px 20px rgba(99,102,241,.4)" }}>
      {busy ? "Signing in..." : "Sign in"}
     </button>

     <p style={{ textAlign: "center", color: "var(--sub)", fontSize: ".9rem" }}>
      Don&apos;t have an account?{" "}
      <Link to="/signup" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Create account</Link>
     </p>
    </form>
   </div>
  </div>
 );
}
