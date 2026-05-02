import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

const card = { background: "#161b27", border: "1px solid #1f2937", borderRadius: "14px", padding: "16px 18px", marginBottom: "8px" };
const STATUS = {
 pending: { bg: "rgba(245,158,11,.12)", fg: "#f59e0b" },
 confirmed: { bg: "rgba(52,211,153,.12)", fg: "#34d399" },
 rejected: { bg: "rgba(239,68,68,.12)", fg: "#f87171" },
};

export default function PaymentHistory() {
 const [payments, setPayments] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 api.get("/subscriptions/messages/mine")
 .then(r => setPayments(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false));
 }, []);

 if (loading) return <Spinner />;

 const total = payments.filter(p => p.status === "confirmed").reduce((s, p) => s + Number(p.amount || 0), 0);

 return (
 <div>
 <div style={{ marginBottom: "24px" }}>
 <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 4px" }}>Payment History</h1>
 <p style={{ fontSize: ".875rem", color: "#6b7280", margin: 0 }}>{payments.length} payments KES {total.toLocaleString()} confirmed</p>
 </div>

 {payments.length === 0 ? (
 <div style={{ ...card, textAlign: "center", padding: "48px 20px" }}>
 <p style={{ fontSize: "2.5rem", margin: "0 0 10px" }}></p>
 <p style={{ color: "#f9fafb", fontWeight: 700, margin: "0 0 6px" }}>No payments yet</p>
 <p style={{ color: "#6b7280", fontSize: ".85rem" }}>Your M-Pesa payment history will appear here.</p>
 </div>
 ) : (
 payments.map(p => {
 const sc = STATUS[p.status] || STATUS.pending;
 return (
 <div key={p.id} style={card}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
 <div style={{ flex: 1 }}>
 <p style={{ fontWeight: 700, color: "#f9fafb", margin: "0 0 3px" }}>{p.plan_name || p.plan_id} Plan</p>
 <p style={{ color: "#6b7280", fontSize: ".8rem", margin: "0 0 3px" }}>
 KES {Number(p.amount || 0).toLocaleString()} {new Date(p.created_at).toLocaleDateString()}
 </p>
 {p.mpesa_ref && <p style={{ color: "#4b5563", fontSize: ".72rem", margin: 0 }}>Ref: {p.mpesa_ref}</p>}
 {p.message && <p style={{ color: "#9ca3af", fontSize: ".78rem", margin: "4px 0 0", fontStyle: "italic" }}>"{p.message}"</p>}
 </div>
 <span style={{ fontSize: ".72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: sc.bg, color: sc.fg, textTransform: "capitalize", flexShrink: 0 }}>
 {p.status}
 </span>
 </div>
 </div>
 );
 })
 )}
 </div>
 );
}
