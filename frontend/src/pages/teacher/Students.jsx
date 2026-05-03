import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

const card = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px 18px", marginBottom: "8px" };
const SC = {
 active: { bg: "rgba(52,211,153,.12)", fg: "#34d399" },
 pending: { bg: "rgba(245,158,11,.12)", fg: "#f59e0b" },
 locked: { bg: "rgba(239,68,68,.12)", fg: "#f87171" },
};

export default function TeacherStudents() {
 const [students, setStudents] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");

 useEffect(() => {
 api.get("/users?role=student")
 .then(r => setStudents(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false));
 }, []);

 if (loading) return <Spinner />;

 const filtered = students.filter(s =>
 !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
 );

 const active = students.filter(s => s.status === "active").length;
 const online = students.filter(s => s.last_online && (Date.now() - new Date(s.last_online)) < 5 * 60 * 1000).length;

 return (
 <div>
 <div style={{ marginBottom: "24px" }}>
 <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Students</h1>
 <p style={{ fontSize: ".875rem", color: "var(--sub)", margin: 0 }}>{students.length} total {active} active {online} online now</p>
 </div>

 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
 style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "10px", padding: "10px 14px", fontSize: ".875rem", outline: "none", marginBottom: "16px", boxSizing: "border-box" }} />

 {filtered.length === 0 ? (
 <p style={{ color: "var(--sub)" }}>No students found.</p>
 ) : (
 filtered.map(s => {
 const sc = SC[s.status] || SC.pending;
 const lastSeen = s.last_online ? new Date(s.last_online).toLocaleDateString() : "Never";
 const isOnline = s.last_online && (Date.now() - new Date(s.last_online)) < 5 * 60 * 1000;
 return (
 <div key={s.id} style={card}>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
 <div style={{ position: "relative" }}>
 {s.avatar_url ? (
 <img src={s.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
 ) : (
 <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
 {s.name?.[0]?.toUpperCase() || "?"}
 </div>
 )}
 {isOnline && <span style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#34d399", border: "2px solid var(--surface)" }} />}
 </div>
 <div>
 <p style={{ fontWeight: 700, color: "var(--text)", margin: "0 0 2px" }}>{s.name}</p>
 <p style={{ color: "var(--sub)", fontSize: ".75rem", margin: 0 }}>
 Grade {s.grade || ""} Last seen {lastSeen}
 </p>
 </div>
 </div>
 <span style={{ fontSize: ".72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: sc.bg, color: sc.fg, textTransform: "capitalize" }}>
 {s.status}
 </span>
 </div>
 </div>
 );
 })
 )}
 </div>
 );
}
