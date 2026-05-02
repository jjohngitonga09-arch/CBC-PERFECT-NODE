import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const card = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px", marginBottom: "8px" };
const SC = {
 pending: { bg: "rgba(245,158,11,.12)", fg: "#f59e0b" },
 confirmed: { bg: "rgba(52,211,153,.12)", fg: "#34d399" },
 rejected: { bg: "rgba(239,68,68,.12)", fg: "#f87171" },
};

export default function AdminPayments() {
 const [payments, setPayments] = useState([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState("all");

 async function load() {
 setLoading(true);
 try {
 const r = await api.get("/subscriptions/messages");
 setPayments(Array.isArray(r.data) ? r.data : []);
 } catch { toast.error("Failed to load payments"); }
 finally { setLoading(false); }
 }

 useEffect(() => { load(); }, []);

 async function act(id, action) {
 try {
 await api.patch(`/subscriptions/messages/${id}/${action}`);
 toast.success(action === "confirm" ? "Payment confirmed!" : "Payment rejected");
 load();
 } catch { toast.error("Action failed"); }
 }

 if (loading) return <Spinner />;

 const filtered = filter === "all" ? payments : payments.filter(p => p.status === filter);
 const totalConfirmed = payments.filter(p => p.status === "confirmed").reduce((s, p) => s + Number(p.amount || 0), 0);

 return (
 <div>
 <div style={{ marginBottom: "24px" }}>
 <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Payments</h1>
 <p style={{ fontSize: ".875rem", color: "var(--sub)", margin: 0 }}>
 {payments.length} total {payments.filter(p => p.status === "pending").length} pending KES {totalConfirmed.toLocaleString()} confirmed
 </p>
 </div>

 {/* Summary cards */}
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "10px", marginBottom: "20px" }}>
 {[
 ["All", payments.length, "#6366f1"],
 ["Pending", payments.filter(p=>p.status==="pending").length, "#f59e0b"],
 ["Confirmed", payments.filter(p=>p.status==="confirmed").length, "#34d399"],
 ["Rejected", payments.filter(p=>p.status==="rejected").length, "#f87171"],
 ].map(([label, val, color]) => (
 <div key={label} onClick={() => setFilter(label.toLowerCase() === "all" ? "all" : label.toLowerCase())}
 style={{ background: "var(--surface)", border: `1px solid ${filter === label.toLowerCase() || (filter==="all"&&label==="All") ? color : "var(--border)"}`, borderRadius: "12px", padding: "14px", textAlign: "center", cursor: "pointer" }}>
 <p style={{ color, fontSize: "1.5rem", fontWeight: 800, margin: "0 0 3px" }}>{val}</p>
 <p style={{ color: "var(--sub)", fontSize: ".75rem", margin: 0 }}>{label}</p>
 </div>
 ))}
 </div>

 {filtered.length === 0 ? (
 <div style={{ ...card, textAlign: "center", padding: "40px" }}>
 <p style={{ color: "var(--sub)" }}>No payments found.</p>
 </div>
 ) : (
 filtered.map(p => {
 const sc = SC[p.status] || SC.pending;
 return (
 <div key={p.id} style={card}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
 <div style={{ flex: 1 }}>
 <p style={{ fontWeight: 700, color: "var(--text)", margin: "0 0 3px" }}>{p.user_name || "Unknown"}</p>
 <p style={{ color: "var(--sub)", fontSize: ".8rem", margin: "0 0 2px" }}>
 {p.plan_name} KES {Number(p.amount || 0).toLocaleString()} {p.phone}
 </p>
 {p.mpesa_ref && <p style={{ color: "var(--sub)", fontSize: ".72rem", margin: "2px 0 0" }}>Ref: {p.mpesa_ref}</p>}
 {p.message && <p style={{ color: "#9ca3af", fontSize: ".78rem", margin: "4px 0 0", fontStyle: "italic" }}>"{p.message}"</p>}
 <p style={{ color: "#4b5563", fontSize: ".7rem", margin: "4px 0 0" }}>{new Date(p.created_at).toLocaleString()}</p>
 </div>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
 <span style={{ fontSize: ".72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: sc.bg, color: sc.fg, textTransform: "capitalize" }}>
 {p.status}
 </span>
 {p.status === "pending" && (
 <div style={{ display: "flex", gap: "6px" }}>
 <button onClick={() => act(p.id, "confirm")} style={{ background: "rgba(52,211,153,.15)", border: "1px solid rgba(52,211,153,.3)", color: "#34d399", borderRadius: "8px", padding: "5px 12px", cursor: "pointer", fontWeight: 600, fontSize: ".78rem" }}>Confirm</button>
 <button onClick={() => act(p.id, "reject")} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#f87171", borderRadius: "8px", padding: "5px 12px", cursor: "pointer", fontWeight: 600, fontSize: ".78rem" }}>Reject</button>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 })
 )}
 </div>
 );
}
