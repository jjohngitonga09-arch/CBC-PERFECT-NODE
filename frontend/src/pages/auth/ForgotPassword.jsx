import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
 const [email, setEmail] = useState("");
 const [loading, setLoading] = useState(false);
 const [sent, setSent] = useState(false);
 const [error, setError] = useState("");
 const navigate = useNavigate();

 const handleSend = async (e) => {
 e.preventDefault();
 setError(""); setLoading(true);
 try {
 await axios.post("/api/auth/forgot-password", { email });
 setSent(true);
 } catch (err) {
 setError(err.response?.data?.error || "Could not send reset email");
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
 .btn{width:100%;padding:13px;border-radius:12px;background:#6366f1;color:#fff;font-weight:800;font-size:1rem;border:none;cursor:pointer;transition:.2s;font-family:inherit;margin-top:8px}
 .btn:hover{background:#4f46e5}
 .btn:disabled{opacity:.6;cursor:not-allowed}
 @keyframes spin{to{transform:rotate(360deg)}}
 .spin{animation:spin .7s linear infinite;display:inline-block}
 `}</style>

 <div className="card">
 {!sent ? (<>
 <div style={{textAlign:"center",marginBottom:24}}>
 <div style={{fontSize:"2.5rem",marginBottom:8}}></div>
 <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"#1e293b",marginBottom:4}}>Forgot Password?</h2>
 <p style={{color:"#64748b",fontSize:".85rem"}}>Enter your email and we'll send you a reset code.</p>
 </div>

 {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}> {error}</div>}

 <form onSubmit={handleSend}>
 <div style={{marginBottom:16}}>
 <label style={{fontWeight:600,fontSize:".8rem",color:"#374151",marginBottom:5,display:"block"}}>Email Address</label>
 <input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
 </div>
 <button className="btn" type="submit" disabled={loading}>
 {loading ? <span className="spin"></span> : " Send Reset Code"}
 </button>
 </form>

 <div style={{textAlign:"center",marginTop:12}}>
 <a href="/login" style={{color:"#6366f1",fontSize:".82rem",fontWeight:600}}> Back to Login</a>
 </div>
 </>) : (
 <div style={{textAlign:"center",padding:"20px 0"}}>
 <div style={{fontSize:"3rem",marginBottom:12}}></div>
 <h2 style={{fontWeight:800,color:"#1e293b",marginBottom:8}}>Check Your Email</h2>
 <p style={{color:"#64748b",fontSize:".9rem",lineHeight:1.6,marginBottom:24}}>
 We sent a 6-digit code to <strong>{email}</strong>.<br/>Enter it on the next page to reset your password.
 </p>
 <button className="btn" onClick={()=>navigate("/verify-otp", {state:{email}})}>
 Enter Code 
 </button>
 </div>
 )}
 </div>
 </div>
 );
}