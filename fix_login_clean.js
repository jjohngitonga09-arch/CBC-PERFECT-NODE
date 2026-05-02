const fs = require('fs');
const file = "C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\pages\\Login.jsx";

const content = `import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [mode, setMode] = useState("username");
  const [form, setForm] = useState({ username: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const navigate = useNavigate();
  const { setAuth, setUser } = useAuthStore();

  useEffect(() => {
    const ll = localStorage.getItem("cbc_last_login");
    if (ll) {
      const d = new Date(parseInt(ll));
      const diff = Math.round((Date.now() - d) / 36e5);
      const time = d.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
      setLastLogin(diff < 24 ? "Today at " + time : d.toLocaleDateString("en-KE", { day: "numeric", month: "short" }) + " at " + time);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        password: form.password,
        ...(mode === "username" ? { username: form.username } : { phone: "+254" + form.phone }),
      };
      const res = await axios.post("/api/auth/login", payload);
      localStorage.setItem("cbc_last_login", Date.now());
      const { token, user } = res.data;
      const role = user?.role;
      setAuth({ token, role, userId: user.id, linkedStudentIds: user.linkedStudentIds || [] });
      setUser(user);
      if (role === "admin") navigate("/admin/home");
      else if (role === "teacher") navigate("/teacher/home");
      else if (role === "parent") navigate("/parent/home");
      else navigate("/student/home");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "url('/book.png') center/cover no-repeat fixed", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body::before{content:'';position:fixed;inset:0;background:rgba(0,0,0,0.62);z-index:0}
        .trust-ribbon{position:fixed;top:0;left:0;width:100%;z-index:2;text-align:center;padding:6px 12px;background:rgba(27,94,32,0.55);border-bottom:1px solid rgba(82,183,136,0.3);font-size:.72rem;color:rgba(255,255,255,0.7);letter-spacing:.03em;display:flex;align-items:center;justify-content:center;gap:10px;backdrop-filter:blur(8px)}
        .trust-dot{width:6px;height:6px;background:#52b788;border-radius:50%;display:inline-block;animation:blink 2s ease-in-out infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .page-wrap{position:relative;z-index:1;width:100%;max-width:1000px;padding:1rem;display:flex;gap:1.75rem;align-items:stretch;margin-top:36px}
        .left-panel{flex:1;display:flex;flex-direction:column;justify-content:center;padding:2rem 1.75rem;background:rgba(255,255,255,0.06);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.12);border-radius:24px;min-width:0}
        .right-panel{width:390px;flex-shrink:0;background:rgba(255,255,255,0.07);backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:2rem 1.85rem;box-shadow:0 28px 64px rgba(0,0,0,0.45);display:flex;flex-direction:column}
        .form-input{width:100%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);border-radius:8px;color:#fff;padding:.8rem 2.6rem .8rem 2.4rem;font-size:.92rem;font-family:'DM Sans',sans-serif;transition:all .2s;min-height:48px;outline:none}
        .form-input:focus{background:rgba(255,255,255,0.12);border-color:#52b788;box-shadow:0 0 0 3px rgba(82,183,136,0.2)}
        .form-input::placeholder{color:rgba(255,255,255,0.22)}
        .mode-tab{flex:1;padding:8px 6px;border:none;border-radius:6px;background:transparent;color:rgba(255,255,255,0.45);font-size:.78rem;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;min-height:40px}
        .mode-tab.active{background:rgba(82,183,136,0.2);color:#74c69d;border:1px solid rgba(82,183,136,0.3)}
        .btn-signin{width:100%;padding:.9rem;border:none;border-radius:8px;background:linear-gradient(135deg,#2d6a4f,#52b788);color:#fff;font-weight:600;font-size:.95rem;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;min-height:52px;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-signin:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(82,183,136,0.5)}
        .btn-signin:disabled{opacity:.7;cursor:not-allowed;transform:none}
        .feature-list{list-style:none;margin-bottom:1.75rem}
        .feature-list li{display:flex;align-items:center;gap:.75rem;padding:.55rem 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.75);font-size:.88rem}
        .feature-list li:last-child{border-bottom:none}
        .stat-box{flex:1;background:rgba(82,183,136,0.1);border:1px solid rgba(82,183,136,0.2);border-radius:12px;padding:.75rem;text-align:center}
        .btn-role{padding:.65rem .3rem;border-radius:8px;font-size:.75rem;font-weight:500;text-align:center;text-decoration:none;transition:all .2s;display:flex;align-items:center;justify-content:center;min-height:46px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .btn-role:hover{transform:translateY(-1px);filter:brightness(1.18)}
        @media(max-width:720px){.page-wrap{flex-direction:column;max-width:440px;padding:.75rem}.right-panel{width:100%}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
      \`}</style>

      {/* Trust Ribbon */}
      <div className="trust-ribbon">
        <span><span className="trust-dot"></span> Secure Connection (HTTPS/TLS 1.3)</span>
        <span>&middot;</span>
        <span>🇰🇪 Kenya Ministry of Education Aligned</span>
        <span>&middot;</span>
        <span>🔒 256-bit Encrypted</span>
      </div>

      <div className="page-wrap">
        {/* LEFT PANEL */}
        <aside className="left-panel">
          <div style={{ width:58, height:58, background:"linear-gradient(135deg,#2d6a4f,#52b788)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.65rem", marginBottom:"1rem", boxShadow:"0 6px 24px rgba(82,183,136,0.4)" }}>📚</div>
          <div style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontSize:"1.85rem", fontWeight:700, lineHeight:1.1 }}>CBC Platform</div>
          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:".84rem", marginBottom:".5rem" }}>Kenya Competency-Based Curriculum</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.12)", border:"1px solid rgba(82,183,136,0.3)", borderRadius:20, padding:"4px 12px", fontSize:".71rem", color:"#74c69d", marginBottom:"1.6rem" }}>
            🏛️ Aligned with KICD CBC Framework
          </div>
          <ul className="feature-list">
            {[["📚","PP1 - Grade 9","Full curriculum coverage"],["🧠","Smart Quizzes","Adaptive learning assessments"],["🃏","Flashcards","Quick revision on the go"],["📈","Progress Tracking","Real-time CBC level monitoring"],["🏆","Certificates","Achievement recognition"],["📶","Works Offline","Learn anywhere, anytime"]].map(([icon,title,sub])=>(
              <li key={title}><span style={{fontSize:"1.05rem"}}>{icon}</span><div><strong style={{color:"#fff"}}>{title}</strong><br/><span style={{fontSize:".76rem",color:"rgba(255,255,255,0.4)"}}>{sub}</span></div></li>
            ))}
          </ul>
          <div style={{ display:"flex", gap:".85rem", marginTop:"auto" }}>
            {[["9","Grade Levels"],["500+","Quizzes"],["100%","CBC Aligned"]].map(([n,l])=>(
              <div className="stat-box" key={l}><div style={{color:"#74c69d",fontSize:"1.3rem",fontWeight:700}}>{n}</div><div style={{color:"rgba(255,255,255,0.25)",fontSize:".68rem"}}>{l}</div></div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <section className="right-panel">
          <div style={{ color:"#fff", fontSize:"1.35rem", fontWeight:600, marginBottom:".2rem" }}>Welcome back 👋</div>
          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:".82rem", marginBottom:"1.25rem" }}>Sign in to continue your learning journey</div>

          {lastLogin && (
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(82,183,136,0.1)", borderLeft:"2px solid #52b788", borderRadius:"0 8px 8px 0", padding:"7px 10px", fontSize:".75rem", color:"#74c69d", marginBottom:"1rem" }}>
              🕐 Last sign-in: {lastLogin}
            </div>
          )}

          {error && (
            <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.35)", borderRadius:8, padding:"9px 12px", fontSize:".78rem", color:"#fca5a5", marginBottom:".9rem", display:"flex", gap:7 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Mode tabs */}
          <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:8, padding:3, gap:3, marginBottom:"1.1rem" }}>
            <button className={"mode-tab" + (mode==="username" ? " active" : "")} onClick={() => setMode("username")}>👤 Username</button>
            <button className={"mode-tab" + (mode==="phone" ? " active" : "")} onClick={() => setMode("phone")}>📱 Phone</button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "username" ? (
              <div style={{ marginBottom:".9rem" }}>
                <label style={{ color:"rgba(255,255,255,0.65)", fontSize:".8rem", fontWeight:500, marginBottom:".3rem", display:"block" }}>Username</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:".9rem", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}>👤</span>
                  <input className="form-input" type="text" placeholder="Enter your username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} autoComplete="username" />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom:".9rem" }}>
                <label style={{ color:"rgba(255,255,255,0.65)", fontSize:".8rem", fontWeight:500, marginBottom:".3rem", display:"block" }}>Phone number</label>
                <div style={{ display:"flex", gap:6 }}>
                  <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", borderRadius:8, color:"#74c69d", fontSize:".85rem", fontWeight:600, padding:"0 12px", minHeight:48, display:"flex", alignItems:"center", whiteSpace:"nowrap" }}>🇰🇪 +254</div>
                  <input className="form-input" style={{ paddingLeft:".9rem" }} type="tel" placeholder="7XX XXX XXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/\\D/g,"").slice(0,9)})} inputMode="numeric" />
                </div>
              </div>
            )}

            <div style={{ marginBottom:"1.1rem" }}>
              <label style={{ color:"rgba(255,255,255,0.65)", fontSize:".8rem", fontWeight:500, marginBottom:".3rem", display:"block" }}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:".9rem", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}>🔒</span>
                <input className="form-input" type={showPw ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:".9rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(255,255,255,0.35)", cursor:"pointer", fontSize:"1rem" }}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.1rem" }}>
              <label style={{ color:"rgba(255,255,255,0.55)", fontSize:".82rem", display:"flex", alignItems:"center", gap:".45rem", cursor:"pointer" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor:"#52b788" }} />
                Remember me
              </label>
              <a href="/forgot-password" style={{ color:"#74c69d", fontSize:".78rem", textDecoration:"none" }}>Forgot password?</a>
            </div>

            <button className="btn-signin" type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Sign In →"}
            </button>
          </form>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap", marginTop:"1.1rem", paddingTop:".9rem", borderTop:"1px solid rgba(255,255,255,0.08)", fontSize:".68rem", color:"rgba(255,255,255,0.28)" }}>
            <span>🔒 TLS 1.3</span><span>🛡️ CSRF Protected</span><span>⛔ 5-attempt lockout</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:".75rem", margin:"1.1rem 0" }}>
            <hr style={{ flex:1, borderColor:"rgba(255,255,255,0.12)" }} />
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:".72rem", whiteSpace:"nowrap" }}>New here? Register as</span>
            <hr style={{ flex:1, borderColor:"rgba(255,255,255,0.12)" }} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".5rem" }}>
            <button className="btn-role" onClick={() => navigate("/signup")} style={{ background:"rgba(25,135,84,.18)", border:"1px solid rgba(25,135,84,.35)", color:"#6ee7b7" }}>📚 Student</button>
            <button className="btn-role" onClick={() => navigate("/signup/teacher")} style={{ background:"rgba(59,130,246,.18)", border:"1px solid rgba(59,130,246,.35)", color:"#93c5fd" }}>🎓 Teacher</button>
            <button className="btn-role" onClick={() => navigate("/signup/parent")} style={{ background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.3)", color:"#fde68a" }}>👨‍👩‍👧 Parent</button>
          </div>
        </section>
      </div>

      <footer style={{ position:"relative", zIndex:1, textAlign:"center", marginTop:"1.1rem", color:"rgba(255,255,255,0.22)", fontSize:".7rem", paddingBottom:"1rem" }}>
        &copy; 2026 CBC Platform &middot; 🇰🇪 Kenya &middot;
        <a href="/terms" style={{ color:"rgba(255,255,255,0.35)", margin:"0 .35rem" }}>Terms</a> &middot;
        <a href="/privacy" style={{ color:"rgba(255,255,255,0.35)", margin:"0 .35rem" }}>Privacy</a>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync(file, content, 'utf8');
console.log('Login.jsx rewritten successfully!');