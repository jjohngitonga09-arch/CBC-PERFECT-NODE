import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const card = { background: "#161b27", border: "1px solid #1f2937", borderRadius: "16px", padding: "24px" };

export default function LinkParent() {
 const [linked, setLinked] = useState(null);
 const [loading, setLoading] = useState(true);
 const [natId, setNatId] = useState("");
 const [saving, setSaving] = useState(false);

 useEffect(() => {
 api.get("/parent-student/my-parent")
 .then(r => setLinked(r.data))
 .catch(() => {})
 .finally(() => setLoading(false));
 }, []);

 async function link() {
 if (!natId.trim()) return toast.error("Enter the parent ID number");
 setSaving(true);
 try {
 const r = await api.post("/parent-student/link", { parent_national_id: natId.trim() });
 setLinked(r.data.parent);
 setNatId("");
 toast.success("Parent linked successfully!");
 } catch (err) {
 toast.error(err.response?.data?.error || "Failed to link");
 } finally { setSaving(false); }
 }

 async function unlink() {
 if (!window.confirm("Unlink your parent?")) return;
 try {
 await api.delete("/parent-student/link");
 setLinked(null);
 toast.success("Parent unlinked.");
 } catch { toast.error("Failed to unlink"); }
 }

 if (loading) return null;

 return (
 <div style={card}>
 <h2 style={{ color: "#f9fafb", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 6px" }}>
 Link My Parent
 </h2>
 <p style={{ color: "#6b7280", fontSize: ".85rem", margin: "0 0 20px" }}>
 Enter your parent or guardian ID number to connect your dashboards.
 They will be able to see your progress and pay for your subscription.
 </p>
 {linked ? (
 <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
 <div>
 <p style={{ color: "#34d399", fontWeight: 700, margin: "0 0 3px" }}>Linked to {linked.name}</p>
 {linked.email && <p style={{ color: "#6b7280", fontSize: ".8rem", margin: 0 }}>{linked.email}</p>}
 {linked.phone && <p style={{ color: "#6b7280", fontSize: ".8rem", margin: 0 }}>{linked.phone}</p>}
 </div>
 <button onClick={unlink} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontWeight: 600, fontSize: ".8rem" }}>
 Unlink
 </button>
 </div>
 ) : (
 <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
 <input
 value={natId}
 onChange={e => setNatId(e.target.value)}
 onKeyDown={e => e.key === "Enter" && link()}
 placeholder="Parent ID number"
 style={{ flex: 1, minWidth: "200px", background: "#0f1421", border: "1px solid #1f2937", color: "#f9fafb", borderRadius: "10px", padding: "10px 14px", fontSize: ".875rem", outline: "none" }}
 />
 <button onClick={link} disabled={saving}
 style={{ background: saving ? "#1f2937" : "linear-gradient(135deg,#6366f1,#4f46e5)", color: saving ? "#6b7280" : "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: 700, fontSize: ".875rem", cursor: saving ? "default" : "pointer" }}>
 {saving ? "Linking..." : "Link Parent"}
 </button>
 </div>
 )}
 </div>
 );
}
