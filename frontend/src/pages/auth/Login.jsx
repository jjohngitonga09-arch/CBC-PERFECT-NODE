import { useState, useEffect } from "react";
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

 useEffect(() => {
 const s = localStorage.getItem("edu_rid");
 if (s) { setIdentifier(s); setRemember(true); }
 }, []);

 async function submit(e) {
 e.preventDefault();
 setErr({ msg: "", type: "error" });
 setBusy(true);
 try {
 const { data } = await api.post("/auth/login", { identifier, password });
 remember ? localStorage.setItem("edu_rid", identifier) : localStorage.removeItem("edu_rid");
 setAuth({ token: data.token, role: data.user.role, userId: data.user.id, grade: data.user.grade || null, linkedStudentIds: data.linkedStudentIds || [] });
 useAuthStore.getState().setUser(data.user);
 const map = { admin: "/admin/home", teacher: "/teacher/home", guardian: "/parent/home", parent: "/parent/home", student: "/student/home" };
 navigate(map[data.user.role] || "/admin/home", { replace: true });
 } catch (e) {
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

 const inp = { width: "100%", background: "#1a2234", border: "1.5px solid #1f2937",
 borderRadius: "10px", padding: "13px 16px", color: "#f9fafb", fontSize: "1rem",
 outline: "none", boxSizing: "border-box" };

 return (
 <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
 background: "#0d1117", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "20px" }}>
 <div style={{ width: "100%", maxWidth: "420px", background: "#161b27", borderRadius: "16px",
 padding: "40px 32px", boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>

 <div style={{ textAlign: "center", marginBottom: "32px" }}>
 <div style={{ fontSize: "2.5rem" }}>&#x1F4DA;</div>
 <h1 style={{ color: "#f9fafb", fontSize: "1.8rem", fontWeight: 800, margin: "8px 0 4px" }}>Welcome back</h1>
 <p style={{ color: "#6b7280", fontSize: ".9rem" }}>Sign in to EduApp</p>
 </div>

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
 <label style={{ display: "block", color: "#9ca3af", fontSize: ".75rem", fontWeight: 600,
 textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "7px" }}>
 Email / Phone / Username
 </label>
 <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
 placeholder="student@school.com" required autoFocus style={inp} />
 </div>

 <div style={{ marginBottom: "20px", position: "relative" }}>
 <label style={{ display: "block", color: "#9ca3af", fontSize: ".75rem", fontWeight: 600,
 textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "7px" }}>Password</label>
 <input type={show ? "text" : "password"} value={password}
 onChange={e => setPassword(e.target.value)} placeholder="" required
 style={{ ...inp, paddingRight: "44px" }} />
 <button type="button" onClick={() => setShow(v => !v)}
 style={{ position: "absolute", right: "12px", bottom: "13px", background: "none",
 border: "none", cursor: "pointer", color: "#6b7280", fontSize: "1.1rem" }}>
 {show ? "Hide" : "Show"}
 </button>
 </div>

 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
 <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#9ca3af", fontSize: ".875rem" }}>
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

 <p style={{ textAlign: "center", color: "#6b7280", fontSize: ".9rem" }}>
 Don&apos;t have an account?{" "}
 <Link to="/signup" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Create account</Link>
 </p>
 </form>
 </div>
 </div>
 );
}