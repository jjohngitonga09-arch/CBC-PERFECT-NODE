import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupTeacher() {
 const navigate = useNavigate();
 const [form, setForm] = useState({ full_name:"", username:"", email:"", password:"", tsc_number:"", school_name:"", phone:"" });
 const [showPw, setShowPw] = useState(false);
 const [strength, setStrength] = useState(0);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [otpSent, setOtpSent] = useState(false);
 const [userId, setUserId] = useState(""); // FIX: capture from register response
 const [otp, setOtp] = useState("");
 const [otpError, setOtpError] = useState("");
 const [countdown, setCountdown] = useState(0);

 const checkStrength = (pw) => {
 let s = 0;
 if (pw.length >= 6) s++;
 if (pw.length >= 10) s++;
 if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
 setStrength(s);
 };

 const startCountdown = (secs) => {
 setCountdown(secs);
 const iv = setInterval(() => {
 setCountdown(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; });
 }, 1000);
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!form.email) { setError("Email is required for teacher registration."); return; }
 setError(""); setLoading(true);
 try {
 const { data } = await axios.post("/api/auth/register", { ...form, name: form.full_name, role: "teacher" });
 setUserId(data.userId); // FIX: save userId
 setOtpSent(true);
 startCountdown(600);
 } catch (err) {
 setError(err.response?.data?.error || "Registration failed. Please try again.");
 } finally { setLoading(false); }
 };

 const verifyOtp = async () => {
 if (otp.length !== 6) { setOtpError("Enter the 6-digit code."); return; }
 setOtpError(""); setLoading(true);
 try {
 await axios.post("/api/auth/verify-otp", { userId, otp }); // FIX: send userId not email
 navigate("/login?msg=registered");
 } catch (err) {
 setOtpError(err.response?.data?.error || "Incorrect code. Try again.");
 } finally { setLoading(false); }
 };

 const inp = { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, color:"#fff", padding:"11px 14px", fontSize:".92rem", outline:"none", fontFamily:"'DM Sans',sans-serif", marginBottom:0 };
 const lbl = { color:"rgba(255,255,255,0.6)", fontSize:".82rem", fontWeight:500, marginBottom:4, display:"block" };
 const strengthColors = ["#ef4444","#f59e0b","#22c55e"];
 const strengthLabels = ["Weak ","Moderate ","Strong "];

 return (
 <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"url('/book.png') center/cover no-repeat fixed", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
 <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap'); *{box-sizing:border-box} body::before{content:'';position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:0} input::placeholder{color:rgba(255,255,255,0.25)} input:focus{border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,0.2)!important}`}</style>

 <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:460, padding:"1rem" }}>
 <div style={{ background:"rgba(255,255,255,0.07)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:20, padding:"2rem 1.75rem", boxShadow:"0 25px 60px rgba(0,0,0,0.4)" }}>

 <h2 style={{ color:"#fff", fontSize:"1.4rem", fontWeight:700, margin:"0 0 4px" }}> Teacher Registration</h2>
 <p style={{ color:"rgba(255,255,255,0.4)", fontSize:".83rem", marginBottom:"1.5rem" }}>Create your CBC teacher account</p>

 {error && <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.35)", borderRadius:8, padding:"9px 12px", fontSize:".78rem", color:"#fca5a5", marginBottom:12 }}> {error}</div>}

 <form onSubmit={handleSubmit}>
 {[
 { label:"Full Name *", name:"full_name", type:"text", placeholder:"Your full name", required:true },
 { label:"Username *", name:"username", type:"text", placeholder:"Choose a username", required:true },
 { label:"Email *", name:"email", type:"email", placeholder:"your@email.com", required:true },
 { label:"TSC Number (optional)", name:"tsc_number", type:"text", placeholder:"Teachers Service Commission No." },
 { label:"School Name (optional)", name:"school_name", type:"text", placeholder:"Your school name" },
 { label:"Phone (optional)", name:"phone", type:"text", placeholder:"07XXXXXXXX" },
 ].map(f => (
 <div key={f.name} style={{ marginBottom:14 }}>
 <label style={lbl}>{f.label}</label>
 <input type={f.type} name={f.name} placeholder={f.placeholder} required={f.required}
 value={form[f.name]} onChange={e => setForm({...form, [f.name]: e.target.value})} style={inp} />
 </div>
 ))}

 <div style={{ marginBottom:20 }}>
 <label style={lbl}>Password *</label>
 <div style={{ position:"relative" }}>
 <input type={showPw?"text":"password"} value={form.password} required
 onChange={e => { setForm({...form, password:e.target.value}); checkStrength(e.target.value); }}
 placeholder="Min 6 characters" style={{...inp, paddingRight:40}} />
 <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer" }}>
 {showPw ? "" : ""}
 </button>
 </div>
 {form.password && (
 <div style={{ marginTop:6 }}>
 <div style={{ display:"flex", gap:4, height:4, marginBottom:4 }}>
 {[0,1,2].map(i => <div key={i} style={{ flex:1, borderRadius:4, background: i < strength ? strengthColors[strength-1] : "rgba(255,255,255,0.1)", transition:"background .3s" }} />)}
 </div>
 <span style={{ fontSize:".72rem", fontWeight:600, color: strengthColors[strength-1] || "#6b7280" }}>{strengthLabels[strength-1] || ""}</span>
 </div>
 )}
 </div>

 <button type="submit" disabled={loading} style={{ width:"100%", padding:"12px", border:"none", borderRadius:10, background:"linear-gradient(135deg,#1d4ed8,#3b82f6)", color:"#fff", fontWeight:600, fontSize:".95rem", cursor:"pointer", marginBottom:14 }}>
 {loading ? "Sending code..." : "Create Teacher Account"}
 </button>
 </form>

 <div style={{ textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:".8rem" }}>
 Already have an account? <span onClick={() => navigate("/login")} style={{ color:"rgba(255,255,255,0.55)", cursor:"pointer" }}>Sign in</span>
 &nbsp;&nbsp;
 <span onClick={() => navigate("/signup/parent")} style={{ color:"rgba(255,255,255,0.55)", cursor:"pointer" }}>Parent signup</span>
 </div>
 </div>
 </div>

 {/* OTP OVERLAY */}
 {otpSent && (
 <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
 <div style={{ background:"#1e3a5f", border:"1px solid #3b82f6", borderRadius:16, padding:32, maxWidth:380, width:"90%", textAlign:"center" }}>
 <div style={{ fontSize:36, marginBottom:8 }}></div>
 <h3 style={{ color:"#93c5fd", margin:"0 0 6px" }}>Verify Your Email</h3>
 <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, margin:"0 0 6px" }}>A 6-digit code was sent to</p>
 <p style={{ color:"#fff", fontWeight:600, marginBottom:20 }}>{form.email}</p>
 <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" maxLength={6}
 style={{ width:"100%", textAlign:"center", fontSize:"2.2rem", letterSpacing:10, padding:14, borderRadius:10, border:"2px solid #3b82f6", background:"rgba(255,255,255,0.08)", color:"#fff", marginBottom:6, boxSizing:"border-box" }} />
 {countdown > 0 && <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:"0 0 12px" }}>Expires in {Math.floor(countdown/60)}:{String(countdown%60).padStart(2,"0")}</p>}
 {otpError && <div style={{ color:"#f87171", fontSize:13, marginBottom:12 }}>{otpError}</div>}
 <button onClick={verifyOtp} disabled={loading} style={{ width:"100%", padding:13, background:"#3b82f6", color:"#fff", border:"none", borderRadius:10, fontSize:"1rem", fontWeight:600, cursor:"pointer", marginBottom:10 }}>
 {loading ? "Verifying..." : "Verify & Create Account"}
 </button>
 <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:14 }}>Your account will be pending admin approval after verification.</p>
 </div>
 </div>
 )}
 </div>
 );
}
