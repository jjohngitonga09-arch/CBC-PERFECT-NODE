import { useEffect, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import Spinner from "../../components/common/Spinner";

const MEDALS = ["", "", ""];

export default function Leaderboard() {
 const userId = useAuthStore(s => s.userId);
 const [board, setBoard] = useState([]);
 const [myRank, setMyRank] = useState(null);
 const [myStats, setMyStats] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 // Fetch leaderboard -- backend already filters role=student only
 api.get("/leaderboard")
 .then(r => {
 const rows = r.data?.leaderboard || [];
 setBoard(rows);
 })
 .catch(() => {})
 .finally(() => setLoading(false));

 // Fetch this student's personal rank
 if (userId) {
 api.get(`/leaderboard/me/${userId}`)
 .then(r => {
 setMyRank(r.data?.rank);
 setMyStats(r.data);
 })
 .catch(() => {});
 }
 }, [userId]);

 if (loading) return <Spinner />;

 const card = {
 background: "#161b27",
 border: "1px solid #1f2937",
 borderRadius: "14px",
 padding: "14px 18px",
 marginBottom: "8px",
 };

 return (
 <div>
 {/* Header */}
 <div style={{ marginBottom: "24px" }}>
 <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f9fafb", margin: "0 0 4px" }}>Leaderboard</h1>
 <p style={{ fontSize: ".875rem", color: "#6b7280", margin: 0 }}>
 {board.length} students ranked -- story quizzes, badges and stars
 </p>
 </div>

 {/* My rank card */}
 {myRank && myStats && (
 <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 18px", marginBottom: "20px" }}>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
 <div>
 <p style={{ color: "#a5b4fc", fontWeight: 800, fontSize: "1rem", margin: "0 0 4px" }}>
 Your Rank: #{myRank}
 </p>
 <p style={{ color: "#6b7280", fontSize: ".78rem", margin: 0 }}>
 {myStats.total_stars || 0} stars . {myStats.story_count || 0} stories . {myStats.total_correct || 0} correct answers
 </p>
 </div>
 <span style={{ fontSize: "2rem" }}>
 {myRank === 1 ? "" : myRank === 2 ? "" : myRank === 3 ? "" : `#${myRank}`}
 </span>
 </div>
 </div>
 )}

 {/* Board */}
 {board.length === 0 ? (
 <div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>
 <p style={{ fontSize: "2.5rem", margin: "0 0 8px" }}></p>
 <p style={{ fontWeight: 600, margin: 0 }}>No entries yet -- complete a story quiz to appear here!</p>
 </div>
 ) : (
 board.map((s, i) => {
 const isMe = s.student_id === userId;
 return (
 <div key={s.student_id} style={{
 ...card,
 border: isMe ? "1px solid rgba(99,102,241,0.5)" : "1px solid #1f2937",
 background: isMe ? "rgba(99,102,241,0.07)" : "#161b27",
 }}>
 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
 {/* Rank */}
 <span style={{
 fontSize: i < 3 ? "1.6rem" : ".9rem",
 width: "32px", textAlign: "center", flexShrink: 0,
 color: i >= 3 ? "#4b5563" : undefined, fontWeight: 700,
 }}>
 {i < 3 ? MEDALS[i] : `#${i + 1}`}
 </span>

 {/* Avatar */}
 <div style={{
 width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
 background: isMe ? "#6366f1" : "#1f2937",
 display: "flex", alignItems: "center", justifyContent: "center",
 fontSize: ".9rem", fontWeight: 800, color: "#fff",
 overflow: "hidden",
 }}>
 {s.avatar_url
 ? <img src={s.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
 : (s.name?.[0] || "S").toUpperCase()
 }
 </div>

 {/* Name + grade */}
 <div style={{ flex: 1, minWidth: 0 }}>
 <p style={{
 fontWeight: 700,
 color: isMe ? "#a5b4fc" : "#f9fafb",
 margin: "0 0 2px",
 overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
 }}>
 {s.name} {isMe && <span style={{ fontSize: ".72rem", color: "#818cf8" }}>(You)</span>}
 </p>
 <p style={{ color: "#6b7280", fontSize: ".72rem", margin: 0 }}>
 {s.story_count || 0} stories . {s.total_correct || 0} correct
 </p>
 </div>

 {/* Stars */}
 <div style={{ textAlign: "right", flexShrink: 0 }}>
 <p style={{ color: "#f59e0b", fontWeight: 800, margin: "0 0 2px", fontSize: "1rem" }}>
 {s.total_stars || 0}
 </p>
 <p style={{ color: "#6b7280", fontSize: ".7rem", margin: 0 }}>stars</p>
 </div>
 </div>
 </div>
 );
 })
 )}
 </div>
 );
}