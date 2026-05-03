import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const eyeOpen = (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const eyeClosed = (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);
const strengthColors = ["#ef4444","#f59e0b","#22c55e"];
const strengthLabels = ["Weak","Moderate","Strong"];
const getStrength = (pw) => { let s=0; if(pw.length>=6)s++; if(pw.length>=10)s++; if(/[A-Z]/.test(pw)&&/[0-9]/.test(pw))s++; return s; };

function maskContact(contact, type) {
 if (type === "email") {
  const parts = contact.split("@");
  if (parts.length < 2) return contact;
  return parts[0][0] + "***@" + parts[1];
 }
 return contact.slice(0,3) + "***" + contact.slice(-2);
}

function fmt(s) { return Math.floor(s/60) + ":" + String(s%60).padStart(2,"0"); }

export default function ForgotPassword() {
 const [step, setStep] = useState(1);
 const [contactType, setContactType] = useState("email");
 const [contact, setContact] = useState("");
 const [userId, setUserId] = useState("");
 const [otp, setOtp] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showNew, setShowNew] = useState(false);
 const [showConfirm, setShowConfirm] = useState(false);
 const [strength, setStrength] = useState(0);
 const [countdown, setCountdown] = useState(0);
 const [resendCooldown, setResendCooldown] = useState(0);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const navigate = useNavigate();

 const startTimer = (secs, setter) => {
  setter(secs);
  const iv = setInterval(() => setter(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
 };

 const handleSend = async (e) => {
  e.preventDefault();
  setError(""); setLoading(true);
  try {
   const payload = contactType === "email" ? { email: contact } : { phone: contact };
   const { data } = await axios.post("/api/auth/forgot-password", payload);
   setUserId(data.userId || "");
   setStep(2);
   startTimer(600, setCountdown);
   startTimer(30, setResendCooldown);
  } catch (err) {
   setError(err.response?.data?.error || "Could not send reset code. Please try again.");
  } finally { setLoading(false); }
 };

 const handleVerify = async () => {
  if (otp.length !== 6) { setError("Please enter the full 6-digit code"); return; }
  setError(""); setLoading(true);
  try {
   await axios.post("/api/auth/verify-otp", { userId, otp });
   setStep(3);
  } catch (err) {
   setError(err.response?.data?.error || "Incorrect code. Please try again.");
  } finally { setLoading(false); }
 };

 const handleReset = async () => {
  if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
  if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
  setError(""); setLoading(true);
  try {
   await axios.post("/api/auth/reset-password", { userId, otp, newPassword });
   setStep(4);
  } catch (err) {
   setError(err.response?.data?.error || "Could not reset password. Please try again.");
  } finally { setLoading(false); }
 };

 const handleResend = async () => {
  if (resendCooldown > 0) return;
  setError(""); setLoading(true);
  try {
   const payload = contactType === "email" ? { email: contact } : { phone: contact };
   const { data } = await axios.post("/api/auth/forgot-password", payload);
   setUserId(data.userId || "");
   startTimer(600, setCountdown);
   startTimer(30, setResendCooldown);
  } catch (err) {
   setError(err.response?.data?.error || "Could not resend code.");
  } finally { setLoading(false); }
 };

 const eyeBtnStyle = { position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)",
  background:"none", border:"none", cursor:"pointer", color:"#9ca3af", display:"flex", alignItems:"center", padding:"4px" };

 return (
  <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1b5e20,#2d6a4f,#1a237e)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'DM Sans',sans-serif" }}>
   <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box}
    .card{background:rgba(255,255,255,0.97);border-radius:24px;padding:36px 32px;width:100%;max-width:420px;box-shadow:0 24px 64px rgba(0,0,0,0.3)}
    .inp{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:.9rem;font-family:inherit;outline:none;transition:.2s}
    .inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
    .btn{width:100%;padding:13px;border-radius:12px;background:#6366f1;color:#fff;font-weight:800;font-size:1rem;border:none;cursor:pointer;transition:.2s;font-family:inherit;margin-top:8px}
    .btn:hover:not(:disabled){background:#4f46e5}
    .btn:disabled{opacity:.6;cursor:not-allowed}
    .tab{flex:1;padding:9px;border-radius:8px;font-weight:600;font-size:.85rem;cursor:pointer;border:1.5px solid #e2e8f0;background:#f8fafc;color:#64748b;font-family:inherit;transition:.2s}
    .tab-active{background:#ede9fe;border-color:#6366f1;color:#6366f1}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spin{animation:spin .7s linear infinite;display:inline-block}
   `}</style>

   <div className="card">

    {/* Step 1: Enter contact */}
    {step === 1 && (<>
     <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{fontSize:"2.5rem",marginBottom:8}}>&#x1F512;</div>
      <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"var(--surface)",marginBottom:4}}>Forgot Password?</h2>
      <p style={{color:"#64748b",fontSize:".85rem"}}>Choose how you want to receive your reset code.</p>
     </div>

     <div style={{display:"flex",gap:8,marginBottom:20}}>
      <button className={`tab${contactType==="email"?" tab-active":""}`} onClick={()=>{setContactType("email");setContact("");}}>
       &#x2709; Email
      </button>
      <button className={`tab${contactType==="phone"?" tab-active":""}`} onClick={()=>{setContactType("phone");setContact("");}}>
       &#x1F4F1; Phone
      </button>
     </div>

     {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}>{error}</div>}

     <form onSubmit={handleSend}>
      <div style={{marginBottom:16}}>
       <label style={{fontWeight:600,fontSize:".8rem",color:"#374151",marginBottom:5,display:"block"}}>
        {contactType === "email" ? "Email Address" : "Phone Number"}
       </label>
       <input className="inp" type={contactType==="email"?"email":"tel"}
        placeholder={contactType==="email"?"your@email.com":"07XXXXXXXX"}
        value={contact} onChange={e=>setContact(e.target.value)} required />
      </div>
      <button className="btn" type="submit" disabled={loading}>
       {loading ? <span className="spin">&#9696;</span> : "&#x1F4E8; Send Reset Code"}
      </button>
     </form>

     <div style={{textAlign:"center",marginTop:12}}>
      <a href="/login" style={{color:"#6366f1",fontSize:".82rem",fontWeight:600}}>&#8592; Back to Login</a>
     </div>
    </>)}

    {/* Step 2: Enter OTP */}
    {step === 2 && (<>
     <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:"2.5rem",marginBottom:8}}>&#x1F4EC;</div>
      <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"var(--surface)",marginBottom:4}}>Enter Reset Code</h2>
      <p style={{color:"#64748b",fontSize:".85rem"}}>
       Code sent to <strong>{maskContact(contact, contactType)}</strong>
      </p>
     </div>

     {countdown > 0 && (
      <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"8px 12px",marginBottom:16,textAlign:"center",fontSize:".82rem",color:"#166534"}}>
       &#x23F1; Code expires in <strong>{fmt(countdown)}</strong>
      </div>
     )}

     {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}>{error}</div>}

     <div style={{marginBottom:20}}>
      <label style={{fontWeight:600,fontSize:".8rem",color:"#374151",marginBottom:8,display:"block",textAlign:"center"}}>6-Digit Code</label>
      <input className="inp" type="text" inputMode="numeric" maxLength={6}
       value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
       placeholder="000000"
       style={{textAlign:"center",fontSize:"1.8rem",letterSpacing:"12px",fontWeight:800,padding:"12px"}} />
     </div>

     <button className="btn" onClick={handleVerify} disabled={loading || otp.length < 6}>
      {loading ? <span className="spin">&#9696;</span> : "Verify Code &#x2192;"}
     </button>

     <div style={{textAlign:"center",marginTop:14,fontSize:".82rem",color:"#64748b"}}>
      Didn&apos;t receive it?{" "}
      <button onClick={handleResend} disabled={resendCooldown>0}
       style={{background:"none",border:"none",color:resendCooldown>0?"#9ca3af":"#6366f1",fontWeight:600,cursor:resendCooldown>0?"not-allowed":"pointer",fontFamily:"inherit",fontSize:".82rem"}}>
       {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
      </button>
     </div>
     <div style={{textAlign:"center",marginTop:6}}>
      <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:"#6366f1",fontSize:".82rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
       &#8592; Change {contactType}
      </button>
     </div>
    </>)}

    {/* Step 3: New password */}
    {step === 3 && (<>
     <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:"2.5rem",marginBottom:8}}>&#x1F511;</div>
      <h2 style={{fontWeight:800,fontSize:"1.3rem",color:"var(--surface)",marginBottom:4}}>Set New Password</h2>
      <p style={{color:"#64748b",fontSize:".85rem"}}>Choose a strong password for your account.</p>
     </div>

     {error && <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:".82rem",color:"#dc2626",marginBottom:16}}>{error}</div>}

     <div style={{marginBottom:10}}>
      <label style={{fontWeight:600,fontSize:".8rem",color:"#374151",marginBottom:5,display:"block"}}>New Password *</label>
      <div style={{position:"relative"}}>
       <input className="inp" type={showNew?"text":"password"} value={newPassword}
        onChange={e=>{setNewPassword(e.target.value);setStrength(getStrength(e.target.value));}}
        placeholder="Min 6 characters" required style={{paddingRight:"44px"}} />
       <button type="button" onClick={()=>setShowNew(v=>!v)} style={eyeBtnStyle}>
        {showNew?eyeClosed:eyeOpen}
       </button>
      </div>
      {newPassword && (
       <div style={{marginTop:5}}>
        <div style={{display:"flex",gap:3,height:3,marginBottom:3}}>
         {[0,1,2].map(i=><div key={i} style={{flex:1,borderRadius:4,background:i<strength?strengthColors[strength-1]:"#e2e8f0",transition:"background .3s"}}/>)}
        </div>
        <span style={{fontSize:".72rem",fontWeight:600,color:strengthColors[strength-1]||"#9ca3af"}}>{strengthLabels[strength-1]||""}</span>
       </div>
      )}
     </div>

     {newPassword && (
      <div style={{marginBottom:10,background:"#f8fafc",borderRadius:8,padding:"9px 12px"}}>
       {[
        ["At least 6 characters", newPassword.length >= 6],
        ["At least one uppercase letter", /[A-Z]/.test(newPassword)],
        ["At least one number", /[0-9]/.test(newPassword)],
       ].map(([label,met])=>(
        <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:".77rem",color:met?"#16a34a":"#9ca3af",marginBottom:2}}>
         {met?"✓":"○"} {label}
        </div>
       ))}
      </div>
     )}

     <div style={{marginBottom:20}}>
      <label style={{fontWeight:600,fontSize:".8rem",color:"#374151",marginBottom:5,display:"block"}}>Confirm New Password *</label>
      <div style={{position:"relative"}}>
       <input className="inp" type={showConfirm?"text":"password"} value={confirmPassword}
        onChange={e=>setConfirmPassword(e.target.value)}
        placeholder="Repeat your new password" required style={{paddingRight:"44px"}} />
       <button type="button" onClick={()=>setShowConfirm(v=>!v)} style={eyeBtnStyle}>
        {showConfirm?eyeClosed:eyeOpen}
       </button>
      </div>
      {confirmPassword && (
       <div style={{fontSize:".78rem",marginTop:4,color:newPassword===confirmPassword?"#16a34a":"#dc2626"}}>
        {newPassword===confirmPassword?"✓ Passwords match":"✗ Passwords do not match"}
       </div>
      )}
     </div>

     <button className="btn" onClick={handleReset}
      disabled={loading||newPassword!==confirmPassword||newPassword.length<6}>
      {loading ? <span className="spin">&#9696;</span> : "&#x1F512; Reset Password"}
     </button>
    </>)}

    {/* Step 4: Success */}
    {step === 4 && (
     <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:"3rem",marginBottom:12}}>&#x2705;</div>
      <h2 style={{fontWeight:800,color:"var(--surface)",marginBottom:8}}>Password Reset!</h2>
      <p style={{color:"#64748b",fontSize:".9rem",lineHeight:1.6,marginBottom:24}}>
       Your password has been successfully reset.<br/>You can now log in with your new password.
      </p>
      <button className="btn" onClick={()=>navigate("/login")}>
       Go to Login &#x2192;
      </button>
     </div>
    )}

   </div>
  </div>
 );
}
