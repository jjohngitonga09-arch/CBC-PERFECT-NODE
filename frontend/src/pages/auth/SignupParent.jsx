import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupParent() {
 const navigate = useNavigate();
 const [form, setForm] = useState({ full_name:"", national_id:"", username:"", email:"", password:"", phone:"" });
 const [showPw, setShowPw] = useState(false);
 const [strength, setStrength] = useState(0);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [otpSent, setOtpSent] = useState(false);
 const [userId, setUserId] = useState(""); // capture from register response
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
 setError(""); setLoading(true);
 try {
 // FIX 1: role must be "guardian" not "parent"
 const { data } = await axios.post("/api/auth/register", {
 ...form,
 name: form.full_name,
 role: "guardian"
 });
 // FIX 2: save userId returned by backend
 setUserId(data.userId);
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
 // FIX 3: send userId + otp (not email)
 await axios.post("/api/auth/verify-otp", { userId, otp });
 navigate("/login");
 } catch (err) {
 setOtpError(err.response?.data?.error || "Incorrect code. Try again.");
 } finally { setLoading(false); }
 };

 const inp = { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, color:"#fff", padding:"11px 14px", fontSize:".92rem", outline:"none", fontFamily:"'DM Sans',sans-serif" };
 const lbl = { color:"rgba(255,255,255,0.6)", fontSize:".82rem", fontWeight:500, marginBottom:4, display:"block" };
 const strengthColors = ["#ef4444","#f59e0b","#22c55e"];
 const strengthLabels = ["Weak ","Moderate ","Strong "];

 return (
 <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"url('/book.png') center/cover no-repeat fixed", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
 <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap'); *{box-sizing:border-box} body::before{content:'';position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:0} input::placeholder{color:rgba(255,255,255,0.25)} input:focus{border-color:#52b788!important;box-shadow:0 0 0 3px rgba(82,183,136,0.2)!important}`}</style>

 <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:460, padding:"1rem" }}>
 <div style={{ background:"rgba(255,255,255,0.07)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:20, padding:"2rem 1.75rem", boxShadow:"0 25px 60px rgba(0,0,0,0.4)" }}>

 <h2 style={{ color:"#fff", fontSize:"1.4rem", fontWeight:700, margin:"0 0 4px" }}> Parent Registration</h2>
 <p style={{ color:"rgba(255,255,255,0.4)", fontSize:".83rem", marginBottom:"1.5rem" }}>Create your CBC parent account</p>

 <div style={{ background:"rgba(82,183,136,0.1)", border:"1px solid rgba(82,183,136,0.25)", borderRadius:10, padding:"10px 14px", color:"rgba(255,255,255,0.7)", fontSize:".8rem", marginBottom:16 }}>
 <strong>Linking tip:</strong> Your <strong>National ID</strong> is used by your child during student registration to link their account to yours.
 </div>

 {error && <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.35)", borderRadius:8, padding:"9px 12px", fontSize:".78rem", color:"#fca5a5", marginBottom:12 }}> {error}</div>}

 <form onSubmit={handleSubmit}>
 {[
 { label:"Full Name *", name:"full_name", type:"text", placeholder:"Your full name", required:true },
 { label:"National ID *", name:"national_id", type:"text", placeholder:"e.g. 12345678", required:true, hint:"Your child uses this ID to link to your account" },
 { label:"Username *", name:"username", type:"text", placeholder:"Choose a username", required:true },
 { label:"Email (optional)", name:"email", type:"email", placeholder:"your@email.com" },
 { label:"Phone (for SMS notifications)", name:"phone", type:"text", placeholder:"07XXXXXXXX" },
 ].map(f => (
 <div key={f.name} style={{ marginBottom:14 }}>
 <label style={lbl}>{f.label}</label>
 <input type={f.type} value={form[f.name]} required={f.required} placeholder={f.placeholder}
 onChange={e => setForm({...form, [f.name]: e.target.value})} style={inp} />
 {f.hint && <div style={{ color:"rgba(255,255,255,0.3)", fontSize:".75rem", marginTop:3 }}>{f.hint}</div>}
 </div>
 ))}

 <div style={{ marginBottom:20 }}>
 <label style={lbl}>Password *</label>
 <div style={{ position:"relative" }}>
 <input type={showPw?"text":"password"} value={form.password} required
 onChange={e => { setForm({...form, password:e.target.value}); checkStrength(e.target.value); }}
 placeholder="Min 6 characters" style={{...inp, paddingRight:40}} />
 <button type="button" onClick={() => setShowPw(!showPw)}
           style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
           background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",
           display:"flex",alignItems:"center",padding:"4px"}}>
           {showPw ? (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>)}
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

 <button type="submit" disabled={loading} style={{ width:"100%", padding:"12px", border:"none", borderRadius:10, background:"linear-gradient(135deg,#2d6a4f,#52b788)", color:"#fff", fontWeight:600, fontSize:".95rem", cursor:"pointer", marginBottom:14 }}>
 {loading ? "Sending code..." : "Create Parent Account"}
 </button>
 </form>

 <div style={{ textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:".8rem" }}>
 Already have an account? <span onClick={() => navigate("/login")} style={{ color:"rgba(255,255,255,0.55)", cursor:"pointer" }}>Sign in</span>
 &nbsp;&nbsp;
 <span onClick={() => navigate("/signup/teacher")} style={{ color:"rgba(255,255,255,0.55)", cursor:"pointer" }}>Teacher signup</span>
 </div>
 </div>
 </div>

 {/* OTP OVERLAY */}
 {otpSent && (
 <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
 <div style={{ background:"#1a2e1a", border:"1px solid #52b788", borderRadius:16, padding:32, maxWidth:380, width:"90%", textAlign:"center" }}>
 <div style={{ fontSize:36, marginBottom:8 }}></div>
 <h3 style={{ color:"#52b788", margin:"0 0 6px" }}>Verify Your Email</h3>
 <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, margin:"0 0 6px" }}>A 6-digit code was sent to</p>
 <p style={{ color:"#fff", fontWeight:600, marginBottom:20 }}>{form.email || "your phone"}</p>
 <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" maxLength={6}
 style={{ width:"100%", textAlign:"center", fontSize:"2.2rem", letterSpacing:10, padding:14, borderRadius:10, border:"2px solid #52b788", background:"rgba(255,255,255,0.08)", color:"#fff", marginBottom:6, boxSizing:"border-box" }} />
 {countdown > 0 && <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:"0 0 12px" }}>Expires in {Math.floor(countdown/60)}:{String(countdown%60).padStart(2,"0")}</p>}
 {otpError && <div style={{ color:"#f87171", fontSize:13, marginBottom:12 }}>{otpError}</div>}
 <button onClick={verifyOtp} disabled={loading} style={{ width:"100%", padding:13, background:"#52b788", color:"#fff", border:"none", borderRadius:10, fontSize:"1rem", fontWeight:600, cursor:"pointer", marginBottom:10 }}>
 {loading ? "Verifying..." : "Verify & Create Account"}
 </button>
 <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:14 }}>Your account links to your child via your National ID.</p>
 </div>
 </div>
 )}
 </div>
 );
}
