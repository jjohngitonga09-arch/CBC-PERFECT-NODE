import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GRADES = ["PP1","PP2","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"];

export default function Signup() {
 const [role, setRole] = useState("student");
 const [step, setStep] = useState(1);
 const [userId, setUserId] = useState(null);
 const [otp, setOtp] = useState(["","","","","",""]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [form, setForm] = useState({ name:"", username:"", email:"", phone:"", password:"", grade:"", national_id:"", tsc_number:"" });
 const navigate = useNavigate();

 const f = (k,v) => setForm(p => ({...p,[k]:v}));

 const handleRegister = async (e) => {
 e.preventDefault();
 setError(""); setLoading(true);
 try {
 const res = await axios.post("/api/auth/register", { ...form, role });
 if (res.data.requiresOtp) {
 setUserId(res.data.userId);
 setStep(2);
 } else {
 setStep(3);
 }
 } catch (err) {
 setError(err.response?.data?.error || "Registration failed");
 } finally { setLoading(false); }
 };

 const handleOtp = async () => {
 const code = otp.join("");
 if (code.length < 6) return setError("Enter the 6-digit code");
 setError(""); setLoading(true);
 try {
 await axios.post("/api/auth/verify-otp", { userId, otp: code });
 setStep(3);
 } catch (err) {
 setError(err.response?.data?.error || "Invalid OTP");
 } finally { setLoading(false); }
 };

 const handleOtpInput = (val, idx) => {
 if (!/^\d*$/.test(val)) return;
 const next = [...otp]; next[idx] = val.slice(-1);
 setOtp(next);
 if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
 };

 const resendOtp = async () => {
 try {
 await axios.post("/api/auth/resend-otp", { userId });
 setError(""); alert("New code sent to your email!");
 } catch {}
 };

 return (
 <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1b5e20,#2d6a4f,#1a237e)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'DM Sans',sans-serif" }}>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 *{box-sizing:border-box}
 .card{background:rgba(255,255,255,0.97);border-radius:24px;padding:36px 32px;width:100%;max-width:520px;box-shadow:0 24px 64px rgba(0,0,0,0.3)}
 .inp{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:.9rem;font-family:inherit;outline:none;transition:.2s}
 .inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
 .lbl{font-weight:600;font-size:.8rem;color:#374151;margin-bottom:5px;display:block}
 .role-btn{flex:1;padding:10px;border-radius:10px;font-weight:700;font-size:.82rem;cursor:pointer;transition:.2s;font-family:inherit;border:2px solid transparent}
 .role-btn:hover{transform:translateY(-1px)}
 .btn-primary{width:100%;padding:13px;border-radius:12px;background:#6366f1;color:#fff;font-weight:800;font-size:1rem;border:none;cursor:pointer;transition:.2s;font-family:inherit;margin-top:4px}
 .btn-primary:hover{background:#4f46e5;transform:translateY(-1px)}
 .btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}
 .otp-box{width:48px;height:56px;border:2px solid #e2e8f0;border-radius:10px;font-size:1.4rem;font-weight:800;text-align:center;outline:none;font-family:inherit;transition:.2s}
 .otp-box:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
 @keyframes spin{to{transform:rotate(360deg)}}
 .spin{animation:spin .7s linear infinite;display:inline-block}
 `}</style>

 <div className="card">

 {/* Step 1 Registration form */}
 {step === 1 && (<>
 <div style={{textAlign:"center",marginBottom:24}}>
 <div style={{fontSize:"2rem",marginBottom:8}}></div>
 <h2 style={{fontWeight:800,fontSize:"1.4rem",color:"#1e293b",marginBottom:4}}>Create Your Account</h2>
 <p style={{color:"#64748b",fontSize:".85rem"}}>Register to join the CBC Learning Platform</p>
 </div>

 {/* Role selector */}
 <div style={{display:"flex",gap:8,marginBottom:20}}>
 {[["student"," Student","rgba(25,135,84,.1)","#16a34a"],["teacher"," Teacher","rgba(59,130,246,.1)","#2563eb"],["parent"," Parent","rgba(245,158,11,.1)","#d97706"]].map(([r,label,bg,color])=>(
 <button key={r} className="role-btn" onClick={()=>setRole(r)} style={{ background:role===r?bg:"#f8fafc", border:`2px solid ${role===r?color:"#e2e8f0"}`, color:role===r?color:"#64748b" }}>
 {label}
 </button>
 ))}
 </div>

 {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}> {error}</div>}

 <form onSubmit={handleRegister}>

 {/* Row 1: Full Name + Username ALL roles */}
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
 <div><label className="lbl">Full Name *</label><input className="inp" value={form.name} onChange={e=>f("name",e.target.value)} placeholder="e.g. John Kamau" required /></div>
 <div><label className="lbl">Username *</label><input className="inp" value={form.username} onChange={e=>f("username",e.target.value)} placeholder="Choose a username" required /></div>
 </div>

 {/* Row 2: Email + Phone Teacher and Parent only */}
 {role !== "student" && (
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
 <div>
 <label className="lbl">Email {role==="teacher" ? "*" : "(optional)"}</label>
 <input className="inp" type="email" value={form.email} onChange={e=>f("email",e.target.value)} placeholder="your@email.com" required={role==="teacher"} />
 </div>
 <div>
 <label className="lbl">Phone</label>
 <input className="inp" type="tel" value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="07XX XXX XXX" />
 </div>
 </div>
 )}

 {/* Row 3: Password + role-specific field */}
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
 <div><label className="lbl">Password *</label><input className="inp" type="password" value={form.password} onChange={e=>f("password",e.target.value)} placeholder="Min 6 characters" required minLength={6} /></div>

 {/* Student: Grade */}
 {role==="student" && (
 <div><label className="lbl">Grade *</label>
 <select className="inp" value={form.grade} onChange={e=>f("grade",e.target.value)} required>
 <option value="">Select grade...</option>
 {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
 </select>
 </div>
 )}

 {/* Teacher: TSC Number */}
 {role==="teacher" && (
 <div><label className="lbl">TSC Number</label>
 <input className="inp" value={form.tsc_number} onChange={e=>f("tsc_number",e.target.value)} placeholder="Teachers Service Commission No." />
 </div>
 )}

 {/* Parent: National ID */}
 {role==="parent" && (
 <div><label className="lbl">National ID *</label>
 <input className="inp" value={form.national_id} onChange={e=>f("national_id",e.target.value)} placeholder="e.g. 12345678" required />
 <div style={{fontSize:".72rem",color:"#64748b",marginTop:3}}>Your child uses this to link to your account</div>
 </div>
 )}
 </div>

 {/* Info note */}
 <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",fontSize:".8rem",color:"#92400e",marginBottom:16}}>
 <strong>Note:</strong> After registering, your account will be <strong>pending admin approval</strong> before you can log in.
 {form.email && role !== "student" && " You will receive an OTP to verify your email first."}
 </div>

 <button className="btn-primary" type="submit" disabled={loading}>
 {loading ? <span className="spin"></span> : " Create Account"}
 </button>
 </form>

 <div style={{textAlign:"center",marginTop:16,fontSize:".82rem",color:"#64748b"}}>
 Already have an account? <a href="/login" style={{color:"#6366f1",fontWeight:600}}>Sign in here</a>
 </div>
 </>)}

 {/* Step 2 OTP verification */}
 {step === 2 && (<>
 <div style={{textAlign:"center",marginBottom:24}}>
 <div style={{fontSize:"2.5rem",marginBottom:8}}></div>
 <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"#1e293b",marginBottom:4}}>Check Your Email</h2>
 <p style={{color:"#64748b",fontSize:".85rem"}}>We sent a 6-digit code to <strong>{form.email}</strong></p>
 </div>

 {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}> {error}</div>}

 <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
 {otp.map((v,i) => (
 <input key={i} id={`otp-${i}`} className="otp-box" type="text" inputMode="numeric" maxLength={1} value={v}
 onChange={e => handleOtpInput(e.target.value, i)}
 onKeyDown={e => { if (e.key==="Backspace" && !v && i>0) document.getElementById(`otp-${i-1}`)?.focus(); }}
 />
 ))}
 </div>

 <button className="btn-primary" onClick={handleOtp} disabled={loading || otp.join("").length < 6}>
 {loading ? <span className="spin"></span> : " Verify Email"}
 </button>

 <div style={{textAlign:"center",marginTop:16,fontSize:".82rem",color:"#64748b"}}>
 Didn't receive it? <button onClick={resendOtp} style={{background:"none",border:"none",color:"#6366f1",fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:".82rem"}}>Resend code</button>
 </div>
 </>)}

 {/* Step 3 Pending approval */}
 {step === 3 && (<>
 <div style={{textAlign:"center",padding:"20px 0"}}>
 <div style={{fontSize:"3rem",marginBottom:16}}></div>
 <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"#1e293b",marginBottom:8}}>Account Pending Approval</h2>
 <p style={{color:"#64748b",fontSize:".9rem",lineHeight:1.6,marginBottom:24}}>
 Your account has been created and is now <strong>waiting for admin approval</strong>.<br/>
 You cannot log in until an admin approves your account.
 </p>
 <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"16px",marginBottom:16,fontSize:".85rem",color:"#92400e",textAlign:"left"}}>
 <strong>What happens next?</strong><br/>
 1. Admin reviews your registration<br/>
 2. You get notified when approved<br/>
 3. Then you can log in normally
 </div>
 {form.email && (
 <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:12,padding:"12px 16px",marginBottom:24,fontSize:".85rem",color:"#166534"}}>
 We will notify you at <strong>{form.email}</strong> when approved.
 </div>
 )}
 <button className="btn-primary" onClick={() => navigate("/login")} style={{maxWidth:200,margin:"0 auto"}}>
 Go to Login
 </button>
 </div>
 </>)}
 </div>
 </div>
 );
}
