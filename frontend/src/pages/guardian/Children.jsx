import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

const card = { background: "#161b27", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px" };

export default function GuardianChildren() {
 const [children, setChildren] = useState([]);
 const [selected, setSelected] = useState(null);
 const [kpis, setKpis] = useState(null);
 const [loading, setLoading] = useState(true);
 const [loadingKpis, setLoadingKpis] = useState(false);

 useEffect(() => {
 api.get("/parent-student/my-children")
 .then(r => setChildren(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false));
 }, []);

 async function viewChild(child) {
 setSelected(child);
 setKpis(null);
 setLoadingKpis(true);
 try {
 const r = await api.get(`/parent-student/child-kpis/${child.id}`);
 setKpis(r.data);
 } catch {}
 finally { setLoadingKpis(false); }
 }

 if (loading) return <Spinner />;

 return (
 <div>
 <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 4px" }}>My Children</h1>
 <p style={{ color: "#6b7280", fontSize: ".875rem", margin: "0 0 24px" }}>
 {children.length} linked student{children.length !== 1 ? "s" : ""}
 </p>

 {children.length === 0 ? (
 <div style={{ ...card, textAlign: "center", padding: "48px 20px" }}>
 <p style={{ fontSize: "2.5rem", margin: "0 0 10px" }}>????????</p>
 <p style={{ color: "#f9fafb", fontWeight: 700, margin: "0 0 6px" }}>No children linked yet</p>
 <p style={{ color: "#6b7280", fontSize: ".85rem" }}>
 Ask your child to go to Settings and enter your ID number under Link My Parent.
 </p>
 </div>
 ) : (
 <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
 {children.map(c => (
 <div key={c.id} onClick={() => viewChild(c)}
 style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "14px 18px", cursor: "pointer", border: selected?.id === c.id ? "1px solid #6366f1" : "1px solid #1f2937" }}>
 <div>
 <p style={{ fontWeight: 700, color: "#f9fafb", margin: "0 0 3px" }}>{c.name}</p>
 <p style={{ fontSize: ".75rem", color: "#6b7280", margin: 0 }}>Grade {c.grade} {c.status}</p>
 </div>
 <span style={{ fontSize: ".78rem", color: "#6366f1", fontWeight: 700 }}>View Progress ?</span>
 </div>
 ))}
 </div>
 )}

 {selected && (
 <div style={card}>
 <h2 style={{ color: "#f9fafb", fontWeight: 700, fontSize: "1rem", margin: "0 0 16px" }}>
 {selected.name}s Progress
 </h2>
 {loadingKpis ? <Spinner /> : kpis ? (
 <>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "20px" }}>
 {[
 ["Pending", kpis.pending, "#f59e0b"],
 ["Submitted", kpis.submitted, "#34d399"],
 ["Avg Stars", kpis.avg_stars > 0 ? `${kpis.avg_stars} star` : "-","#a5b4fc"],
 ].map(([label, val, color]) => (
 <div key={label} style={{ background: "#0f1421", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
 <p style={{ color, fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px" }}>{val}</p>
 <p style={{ color: "#6b7280", fontSize: ".75rem", margin: 0 }}>{label}</p>
 </div>
 ))}
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
 {kpis.assignments.map(a => (
 <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f1421", borderRadius: "10px", padding: "10px 14px", flexWrap: "wrap", gap: "8px" }}>
 <div>
 <p style={{ color: "#f9fafb", fontWeight: 600, margin: "0 0 2px", fontSize: ".875rem" }}>{a.title}</p>
 {a.due_date && <p style={{ color: "#6b7280", fontSize: ".72rem", margin: 0 }}>Due {new Date(a.due_date).toLocaleDateString()}</p>}
 </div>
 <span style={{ fontSize: ".75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: a.submitted ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.12)", color: a.submitted ? "#34d399" : "#fbbf24" }}>
 {a.submitted ? (a.stars ? `${a.stars} star` : "Submitted") : "Pending"}
 </span>
 </div>
 ))}
 </div>
 </>
 ) : <p style={{ color: "#6b7280" }}>Failed to load.</p>}
 </div>
 )}
 </div>
 );
}
