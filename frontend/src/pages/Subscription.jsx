import { useState, useEffect, useRef } from "react";
import axios from "axios";

const PARENT_PLANS = {
 starter: { monthly: 150, yearly: 1500, label: "Starter", icon: "", kids: "1 child", features: ["1 child","Full CBC curriculum","Quiz & flashcards","Progress tracking"] },
 basic: { monthly: 250, yearly: 2500, label: "Basic", icon: "", kids: "2 children", features: ["Up to 2 children","Full CBC curriculum","Chat with teacher","Homework tracking"] },
 premium: { monthly: 350, yearly: 3500, label: "Premium", icon: "", kids: "3+ children", features: ["3+ children","Full CBC curriculum","Priority support","Detailed reports"] },
};
const SCHOOL_PLANS = {
 starter: { monthly: 500, yearly: 5000, label: "Starter", icon: "", features: ["Up to 100 students","All teachers included","Admin dashboard","Progress reports"] },
 basic: { monthly: 700, yearly: 7000, label: "Basic", icon: "", features: ["Up to 300 students","All teachers included","Analytics dashboard","Priority support"] },
 premium: { monthly: 800, yearly: 8000, label: "Premium", icon: "", features: ["500+ students","Custom branding","Bulk SMS reports","Dedicated support"] },
};

export default function Subscription() {
 const [tab, setTab] = useState("parent");
 const [billing, setBilling] = useState("monthly");
 const [selParent, setSelParent] = useState("basic");
 const [selSchool, setSelSchool] = useState("basic");
 const [phone, setPhone] = useState("");
 const [loading, setLoading] = useState(false);
 const [modal, setModal] = useState(null); // null | {state, msg}
 const [progress, setProgress] = useState(0);
 const [showManual, setShowManual] = useState(false);
 const [manualRef, setManualRef] = useState("");
 const pollRef = useRef(null);

 useEffect(() => () => clearInterval(pollRef.current), []);

 const plans = tab === "parent" ? PARENT_PLANS : SCHOOL_PLANS;
 const sel = tab === "parent" ? selParent : selSchool;
 const setSel = tab === "parent" ? setSelParent : setSelSchool;
 const amount = plans[sel][billing];
 const user = JSON.parse(localStorage.getItem("user") || "{}");

 const submitPay = async () => {
 if (!phone) return alert("Enter your M-Pesa phone number");
 setLoading(true);
 setModal({ state: "pending", msg: phone });
 setProgress(10);
 try {
 const normalized = phone.startsWith("0") ? "254" + phone.slice(1) : phone;
 const res = await axios.post("/api/mpesa/pay", {
 phone: normalized, amount, plan: sel, userId: user.id
 }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

 if (res.data.CheckoutRequestID) {
 startPolling(res.data.CheckoutRequestID);
 } else {
 setModal({ state: "error", msg: res.data.message || "Could not send prompt" });
 }
 } catch (err) {
 setModal({ state: "error", msg: err.response?.data?.error || "Network error. Try manual payment below." });
 } finally {
 setLoading(false);
 }
 };

 const startPolling = (cid) => {
 let attempts = 0;
 pollRef.current = setInterval(async () => {
 attempts++;
 setProgress(Math.min(10 + attempts / 24 * 85, 95));
 try {
 const r = await axios.get(`/api/mpesa/status/${cid}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
 if (r.data.ResultCode === "0") {
 clearInterval(pollRef.current);
 setProgress(100);
 setModal({ state: "success", msg: "Payment confirmed! Your account is now active. " });
 setTimeout(() => window.location.href = "/", 3000);
 } else if (r.data.ResultCode && r.data.ResultCode !== "1032") {
 clearInterval(pollRef.current);
 setModal({ state: "error", msg: r.data.ResultDesc || "Payment failed." });
 }
 } catch {}
 if (attempts >= 24) {
 clearInterval(pollRef.current);
 setModal({ state: "timeout", msg: "Payment timed out. If you paid, use the manual reference form below." });
 }
 }, 5000);
 };

 const closeModal = () => { setModal(null); clearInterval(pollRef.current); setProgress(0); };

 return (
 <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#f8fafc", minHeight: "100vh", paddingBottom: 80 }}>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 *{box-sizing:border-box}
 :root{--ind:#4f46e5;--ind-dk:#3730a3;--grn:#16a34a;--amb:#d97706}
 .plan-card{border:2px solid #e2e8f0;border-radius:18px;padding:28px 20px 24px;cursor:pointer;background:#fff;transition:.22s;position:relative;text-align:center}
 .plan-card:hover{border-color:var(--ind);box-shadow:0 6px 24px rgba(79,70,229,.13);transform:translateY(-2px)}
 .plan-card.sel{border-color:var(--ind);background:#eef2ff;box-shadow:0 6px 24px rgba(79,70,229,.15)}
 .plan-card.pop::before{content:' Most Popular';position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--ind);color:#fff;font-size:.68rem;font-weight:800;padding:4px 14px;border-radius:50px;white-space:nowrap}
 .sw{position:relative;display:inline-block;width:52px;height:28px}
 .sw input{opacity:0;width:0;height:0}
 .sw-slider{position:absolute;inset:0;background:#cbd5e1;border-radius:50px;transition:.3s;cursor:pointer}
 .sw-slider::before{content:'';position:absolute;width:22px;height:22px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.3s}
 input:checked+.sw-slider{background:var(--ind)}
 input:checked+.sw-slider::before{transform:translateX(24px)}
 .btn-pay{width:100%;padding:14px;border-radius:12px;background:var(--ind);color:#fff;font-weight:800;font-size:1rem;border:none;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'DM Sans',sans-serif}
 .btn-pay:hover{background:var(--ind-dk);transform:translateY(-1px)}
 .btn-pay:disabled{opacity:.6;cursor:not-allowed;transform:none}
 .field-input{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:.9rem;font-family:inherit;outline:none;transition:.2s}
 .field-input:focus{border-color:var(--ind);box-shadow:0 0 0 3px rgba(79,70,229,.1)}
 .type-tab{display:flex;align-items:center;gap:8px;padding:10px 24px;border-radius:50px;font-weight:700;font-size:.9rem;border:2px solid #e2e8f0;background:#fff;color:#64748b;cursor:pointer;transition:.2s;font-family:'DM Sans',sans-serif}
 .type-tab.active{border-color:var(--ind);background:var(--ind);color:#fff}
 @keyframes spin{to{transform:rotate(360deg)}}
 .spin{animation:spin .7s linear infinite;display:inline-block}
 `}</style>

 {/* Hero */}
 <div style={{ textAlign: "center", padding: "48px 16px 32px" }}>
 <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--surface)", letterSpacing: "-.03em", marginBottom: 8 }}>
 Unlock <span style={{ color: "var(--ind)" }}>CBC Learning</span> 
 </h1>
 <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
 Full curriculum access, progress tracking, and teacher communication all in one place.
 </p>
 </div>

 <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px" }}>

 {/* Type tabs */}
 <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
 <button className={`type-tab${tab==="parent"?" active":""}`} onClick={() => setTab("parent")}> Parent / Family</button>
 <button className={`type-tab${tab==="school"?" active":""}`} onClick={() => setTab("school")}> School</button>
 </div>

 {/* Billing toggle */}
 <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 32 }}>
 <span style={{ fontWeight: 600, fontSize: ".9rem", color: billing==="monthly" ? "#4f46e5" : "#94a3b8" }}>Monthly</span>
 <label className="sw">
 <input type="checkbox" checked={billing==="yearly"} onChange={e => setBilling(e.target.checked ? "yearly" : "monthly")} />
 <span className="sw-slider"></span>
 </label>
 <span style={{ fontWeight: 600, fontSize: ".9rem", color: billing==="yearly" ? "#4f46e5" : "#94a3b8" }}>
 Yearly <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: ".7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>Save 17%</span>
 </span>
 </div>

 {/* Plan cards */}
 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
 {Object.entries(plans).map(([key, plan]) => (
 <div key={key} className={`plan-card${sel===key?" sel":""}${key==="basic"?" pop":""}`} onClick={() => setSel(key)}>
 <div style={{ fontSize: "2rem", marginBottom: 10 }}>{plan.icon}</div>
 <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--surface)", marginBottom: 4 }}>{plan.label}</div>
 {billing === "yearly" && <div style={{ fontSize: ".8rem", color: "#94a3b8", textDecoration: "line-through" }}>KES {(plan.monthly * 12).toLocaleString()}/yr</div>}
 <div style={{ fontSize: "2rem", fontWeight: 800, color: "#4f46e5", lineHeight: 1, marginBottom: 4 }}>
 KES {plan[billing].toLocaleString()}<small style={{ fontSize: ".8rem", fontWeight: 500, color: "#64748b" }}>/{billing==="yearly"?"yr":"mo"}</small>
 </div>
 <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", textAlign: "left", display: "flex", flexDirection: "column", gap: 6 }}>
 {plan.features.map(f => (
 <li key={f} style={{ fontSize: ".82rem", color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
 <span style={{ color: "#16a34a", fontWeight: 800 }}></span>{f}
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>

 {/* Payment form */}
 <div style={{ background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #e2e8f0", maxWidth: 500, margin: "0 auto", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
 <h3 style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 20, color: "var(--surface)" }}> Pay via M-Pesa</h3>
 <div style={{ marginBottom: 16 }}>
 <label style={{ fontWeight: 600, fontSize: ".82rem", color: "#374151", marginBottom: 6, display: "block" }}>M-Pesa Phone Number</label>
 <input className="field-input" type="tel" placeholder="0712 345 678" value={phone} onChange={e => setPhone(e.target.value)} />
 </div>
 <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".88rem" }}>
 <span>Selected: <strong style={{ color: "#4f46e5" }}>{plans[sel].label}</strong></span>
 <span>Amount: <strong style={{ color: "#4f46e5" }}>KES {amount.toLocaleString()}/{billing==="yearly"?"yr":"mo"}</strong></span>
 </div>
 <button className="btn-pay" onClick={submitPay} disabled={loading}>
 {loading ? <span className="spin"></span> : " Send M-Pesa Prompt"}
 </button>
 <p style={{ fontSize: ".78rem", color: "#94a3b8", textAlign: "center", marginTop: 10 }}> Secure M-Pesa STK push. Enter your PIN on your phone.</p>
 </div>

 {/* Manual payment */}
 <div style={{ maxWidth: 500, margin: "24px auto 0", borderTop: "1px solid #e2e8f0", paddingTop: 24 }}>
 <button onClick={() => setShowManual(!showManual)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#64748b", fontSize: ".85rem", fontWeight: 600, background: "none", border: "none", fontFamily: "inherit" }}>
 Paid via bank transfer or cash? Enter reference here
 </button>
 {showManual && (
 <div style={{ marginTop: 16 }}>
 <p style={{ fontSize: ".82rem", color: "#64748b", marginBottom: 12 }}>Enter your M-Pesa transaction code. Admin will verify and activate your account.</p>
 <input className="field-input" style={{ marginBottom: 12 }} type="text" placeholder="e.g. QHX4J2K8LP" value={manualRef} onChange={e => setManualRef(e.target.value)} />
 <button onClick={async () => {
 if (!manualRef) return;
 await axios.post("/api/subscriptions/manual", { reference: manualRef, plan: sel, amount, phone }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
 alert("Submitted! Admin will verify within 24 hours.");
 setManualRef(""); setShowManual(false);
 }} style={{ width: "100%", padding: 12, borderRadius: 10, background: "#fff", color: "#4f46e5", fontWeight: 700, fontSize: ".9rem", border: "2px solid #4f46e5", cursor: "pointer", fontFamily: "inherit" }}>
 Submit for Manual Verification
 </button>
 </div>
 )}
 </div>
 </div>

 {/* Payment modal */}
 {modal && (
 <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
 <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
 <div style={{ fontSize: "3rem", marginBottom: 12 }}>
 {modal.state==="pending"?"":modal.state==="success"?"":modal.state==="timeout"?"":""}
 </div>
 <div style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>
 {modal.state==="pending"?"Check Your Phone":modal.state==="success"?"Payment Successful!":modal.state==="timeout"?"Payment Timed Out":"Payment Failed"}
 </div>
 <div style={{ color: "#64748b", fontSize: ".9rem", lineHeight: 1.5, marginBottom: 20 }}>
 {modal.state==="pending" ? <>M-Pesa prompt sent to <strong>{modal.msg}</strong>.<br/>Enter your PIN to complete payment.</> : modal.msg}
 </div>
 {modal.state === "pending" && (
 <div style={{ height: 6, background: "#e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
 <div style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#4f46e5,#818cf8)", width: `${progress}%`, transition: "width .6s ease" }} />
 </div>
 )}
 <button onClick={closeModal} style={{ padding: "10px 28px", borderRadius: 10, background: "#4f46e5", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: ".9rem" }}>
 {modal.state==="success"?"Continue":"Close"}
 </button>
 </div>
 </div>
 )}
 </div>
 );
}