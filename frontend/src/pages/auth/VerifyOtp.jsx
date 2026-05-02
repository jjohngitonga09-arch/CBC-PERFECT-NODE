import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
 const [otp, setOtp] = useState(["","","","","",""]);
 const [newPassword, setNewPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [done, setDone] = useState(false);
 const navigate = useNavigate();
 const location = useLocation();
 const email = location.state?.email || "";

 const handleOtpInput = (val, idx) => {
 if (!/^\d*$/.test(val)) return;
 const next = [...otp]; next[idx] = val.slice(-1);
 setOtp(next);
 if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
 };

 const handleSubmit = async () => {
 if (otp.join("").length < 6) return setError("Enter the 6-digit code");
 if (!newPassword || newPassword.length < 6) return setError("Password must be at least 6 characters");
 setError(""); setLoading(true);
 try {
 await axios.post("/api/auth/reset-password", { email, otp: otp.join(""), newPassword });
 setDone(true);
 } catch (err) {
 setError(err.response?.data?.error || "Invalid or expired OTP");
 } finally { setLoading(false); }
 };

 return (
 <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1b5e20,#2d6a4f,#1a237e)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'DM Sans',sans-serif" }}>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 *{box-sizing:border-box}
 .card{background:rgba(255,255,255,0.97);border-radius:24px;padding:36px 32px;width:100%;max-width:420px;box-shadow:0 24px 64px rgba(0,0,0,0.3)}
 .inp{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:.9rem;font-family:inherit;outline:none;transition:.2s}
 .inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
 .otp-box{width:48px;height:56px;border:2px solid #e2e8f0;border-radius:10px;font-size:1.4rem;font-weight:800;text-align:center;outline:none;font-family:inherit;transition:.2s}
 .otp-box:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
 .btn{width:100%;padding:13px;border-radius:12px;background:#6366f1;color:#fff;font-weight:800;font-size:1rem;border:none;cursor:pointer;transition:.2s;font-family:inherit;margin-top:8px}
 .btn:hover{background:#4f46e5}
 .btn:disabled{opacity:.6;cursor:not-allowed}
 @keyframes spin{to{transform:rotate(360deg)}}
 .spin{animation:spin .7s linear infinite;display:inline-block}
 `}</style>

 <div className="card">
 {!done ? (<>
 <div style={{textAlign:"center",marginBottom:24}}>
 <div style={{fontSize:"2.5rem",marginBottom:8}}></div>
 <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"#1e293b",marginBottom:4}}>Reset Password</h2>
 <p style={{color:"#64748b",fontSize:".85rem"}}>Enter the code sent to <strong>{email}</strong> and your new password.</p>
 </div>

 {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}> {error}</div>}

 <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
 {otp.map((v,i)=>(
 <input key={i} id={`otp-${i}`} className="otp-box" type="text" inputMode="numeric" maxLength={1} value={v}
 onChange={e=>handleOtpInput(e.target.value,i)}
 onKeyDown={e=>{if(e.key==="Backspace"&&!v&&i>0)document.getElementById(`otp-${i-1}`)?.focus()}}
 />
 ))}
 </div>

 <div style={{marginBottom:16}}>
 <label style={{fontWeight:600,fontSize:".8rem",color:"#374151",marginBottom:5,display:"block"}}>New Password</label>
 <input className="inp" type="password" placeholder="Min 6 characters" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={6} />
 </div>

 <button className="btn" onClick={handleSubmit} disabled={loading}>
 {loading ? <span className="spin"></span> : " Reset Password"}
 </button>

 <div style={{textAlign:"center",marginTop:12}}>
 <a href="/login" style={{color:"#6366f1",fontSize:".82rem",fontWeight:600}}> Back to Login</a>
 </div>
 </>) : (
 <div style={{textAlign:"center",padding:"20px 0"}}>
 <div style={{fontSize:"3rem",marginBottom:12}}></div>
 <h2 style={{fontWeight:800,color:"#1e293b",marginBottom:8}}>Password Reset!</h2>
 <p style={{color:"#64748b",fontSize:".9rem",marginBottom:20}}>Your password has been updated successfully.</p>
 <button className="btn" onClick={()=>navigate("/login")}>Go to Login</button>
 </div>
 )}
 </div>
 </div>
 );
}