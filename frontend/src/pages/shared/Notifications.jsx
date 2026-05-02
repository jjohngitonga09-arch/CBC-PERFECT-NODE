import { useEffect, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

const EMOJIS = ["","","","","","","","","",""];
const TYPE_COLORS = { system:"#6366f1", assignment:"#f59e0b", payment:"#34d399", message:"#3b82f6", announcement:"#a78bfa", link_request:"#10b981" };
const card = { background:"#161b27", border:"1px solid #1f2937", borderRadius:"14px", padding:"16px 18px", marginBottom:"8px", position:"relative", transition:"opacity 0.2s" };
const inp = { width:"100%", background:"#0f1421", border:"1px solid #1f2937", color:"#f9fafb", borderRadius:"10px", padding:"10px 14px", fontSize:".875rem", outline:"none", boxSizing:"border-box" };

export default function Notifications() {
 const { userId, role } = useAuthStore(s => ({ userId: s.userId, role: s.role }));
 const [notes, setNotes] = useState([]);
 const [loading, setLoading] = useState(true);
 const [tab, setTab] = useState("unread");
 const [openEmoji, setOpenEmoji] = useState(null);
 const [showCompose, setShowCompose] = useState(false);
 const [compose, setCompose] = useState({ title:"", message:"", type:"system", targetRole:"all", targetUserId:"" });
 const [sending, setSending] = useState(false);

 const load = () => api.get(`/notifications/${userId}`)
 .then(r => setNotes(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false));

 useEffect(() => { load(); }, [userId]);

 async function markRead(id) {
 try {
 await api.patch(`/notifications/${id}`);
 setNotes(p => p.map(n => n.id === id ? { ...n, read: true } : n));
 } catch {}
 }

 async function markAllRead() {
 const unread = notes.filter(n => !n.read);
 await Promise.all(unread.map(n => api.patch(`/notifications/${n.id}`).catch(() => {})));
 setNotes(p => p.map(n => ({ ...n, read: true })));
 toast.success("All marked as read");
 }

 async function deleteNotif(id, broadcastId) {
 if (role === "admin") {
 if (!window.confirm("Permanently delete for ALL users?")) return;
 try {
 await api.delete(`/notifications/${id}`);
 if (broadcastId) setNotes(p => p.filter(n => n.broadcast_id !== broadcastId));
 else setNotes(p => p.filter(n => n.id !== id));
 toast.success("Permanently deleted for everyone");
 } catch { toast.error("Failed to delete"); }
 } else {
 setNotes(p => p.filter(n => n.id !== id));
 toast.success("Removed from your notifications");
 try { await api.patch(`/notifications/${id}/dismiss`); } catch {}
 }
 }

 async function togglePin(id) {
 try {
 const r = await api.patch(`/notifications/${id}/pin`);
 setNotes(p => p.map(n => n.id === id ? { ...n, pinned: r.data.pinned } : n));
 } catch { toast.error("Failed"); }
 }

 async function react(id, emoji) {
 setOpenEmoji(null);
 try {
 const r = await api.post(`/notifications/${id}/react`, { emoji });
 setNotes(p => p.map(n => n.id === id ? { ...n, reactions: r.data.reactions } : n));
 } catch { toast.error("Failed to react"); }
 }

 async function respondToLink(notifId, action) {
 try {
 await api.post(`/parent-student/${action}/${notifId}`);
 toast.success(action === 'accept' ? 'Student linked! You can now view their progress.' : 'Request declined.');
 setNotes(p => p.map(n => n.id === notifId ? { ...n, action_taken: true, read: true } : n));
 load();
 } catch(e) { toast.error(e.response?.data?.error || 'Failed'); }
 }

 async function sendNotif() {
 if (!compose.title.trim() || !compose.message.trim()) return toast.error("Title and message required");
 setSending(true);
 try {
 const body = { ...compose };
 if (compose.targetRole !== "specific") delete body.targetUserId;
 const r = await api.post("/notifications", body);
 toast.success(`Sent to ${r.data.sent} user(s)!`);
 setShowCompose(false);
 setCompose({ title:"", message:"", type:"system", targetRole:"all", targetUserId:"" });
 load();
 } catch { toast.error("Failed to send"); }
 finally { setSending(false); }
 }

 if (loading) return <Spinner />;

 const canManage = n => role === "admin" || String(n.sender_id) === String(userId) || !n.sender_id;
 const unreadCount = notes.filter(n => !n.read).length;
 const displayed = tab === "unread" ? notes.filter(n => !n.read) : notes;
 const ordered = [...displayed.filter(n => n.pinned), ...displayed.filter(n => !n.pinned)];

 return (
 <div>
 {/* Header */}
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
 <div>
 <h1 style={{ fontSize:"1.7rem", fontWeight:800, color:"#f9fafb", margin:"0 0 4px", display:"flex", alignItems:"center", gap:"10px" }}>
 Notifications
 {unreadCount > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:"20px", fontSize:".72rem", fontWeight:800, padding:"2px 10px" }}>{unreadCount}</span>}
 </h1>
 <p style={{ fontSize:".875rem", color:"#6b7280", margin:0 }}>{unreadCount} unread {notes.length} total</p>
 </div>
 <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
 {unreadCount > 0 && (
 <button onClick={markAllRead} style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)", color:"#a5b4fc", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontWeight:600, fontSize:".8rem" }}>
 Mark all read
 </button>
 )}
 <button onClick={() => setShowCompose(true)} style={{ background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none", color:"#fff", borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:".82rem" }}>
 + Compose
 </button>
 </div>
 </div>

 {/* Tabs */}
 <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
 {[["unread", `Unread (${unreadCount})`], ["all", `All (${notes.length})`]].map(([key, label]) => (
 <button key={key} onClick={() => setTab(key)}
 style={{ background: tab===key ? "rgba(99,102,241,0.15)" : "transparent", border: tab===key ? "1px solid rgba(99,102,241,0.3)" : "1px solid #1f2937", color: tab===key ? "#a5b4fc" : "#6b7280", borderRadius:"10px", padding:"7px 16px", cursor:"pointer", fontWeight: tab===key ? 700 : 400, fontSize:".82rem" }}>
 {label}
 </button>
 ))}
 </div>

 {/* Notification list */}
 {ordered.length === 0 ? (
 <div style={{ ...card, textAlign:"center", padding:"48px 20px" }}>
 <p style={{ fontSize:"2.5rem", margin:"0 0 10px" }}></p>
 <p style={{ color:"#f9fafb", fontWeight:700, margin:"0 0 6px" }}>{tab==="unread" ? "All caught up!" : "No notifications yet"}</p>
 <p style={{ color:"#6b7280", fontSize:".85rem", margin:0 }}>{tab==="unread" ? "Switch to 'All' to see past ones." : "Notifications will appear here."}</p>
 </div>
 ) : ordered.map(n => {
 const color = TYPE_COLORS[n.type] || "#6b7280";
 const reactions = Object.entries(n.reactions || {});
 const myReactions = reactions.filter(([,users]) => users.includes(String(userId))).map(([e]) => e);
 return (
 <div key={n.id}
 onClick={() => { if (!n.read) markRead(n.id); setOpenEmoji(null); }}
 style={{ ...card, borderLeft:`3px solid ${n.pinned?"#f59e0b":n.read?"#1f2937":color}`, cursor:n.read?"default":"pointer", opacity:n.read?0.88:1 }}>

 {n.pinned && <span style={{ position:"absolute", top:10, right:12, fontSize:".68rem", background:"rgba(245,158,11,.15)", color:"#f59e0b", padding:"2px 8px", borderRadius:"20px", fontWeight:700 }}> Pinned</span>}

 <div style={{ paddingRight: n.pinned?"80px":"0" }}>
 <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px", flexWrap:"wrap" }}>
 {!n.read && <span style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0, display:"inline-block" }} />}
 <p style={{ fontWeight:700, color:"#f9fafb", margin:0, fontSize:".9rem" }}>{n.title}</p>
 <span style={{ fontSize:".65rem", fontWeight:700, padding:"1px 7px", borderRadius:"20px", background:`${color}22`, color, textTransform:"capitalize" }}>{n.type}</span>
 </div>
 <p style={{ color:"#9ca3af", fontSize:".82rem", margin:"0 0 5px", lineHeight:1.5 }}>{n.message}</p>
 {n.type === "link_request" && !n.action_taken && (
 <div onClick={e=>e.stopPropagation()} style={{ display:"flex", gap:"8px", marginTop:"10px", flexWrap:"wrap" }}>
 <button onClick={() => respondToLink(n.id, 'accept')}
 style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", borderRadius:"8px", padding:"8px 20px", cursor:"pointer", fontWeight:700, fontSize:".85rem", flex:1 }}>
 Yes, Accept Link this student
 </button>
 <button onClick={() => respondToLink(n.id, 'decline')}
 style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)", color:"#f87171", borderRadius:"8px", padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:".85rem" }}>
 Decline
 </button>
 </div>
 )}
 {n.type === "link_request" && n.action_taken && (
 <p style={{ color:"#6b7280", fontSize:".78rem", marginTop:"8px", fontStyle:"italic" }}>You already responded to this request.</p>
 )}
 <p style={{ color:"#6b7280", fontSize:".7rem", margin:0 }}>{new Date(n.created_at).toLocaleString()}</p>
 </div>

 {/* Reactions + actions */}
 <div onClick={e => e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"12px", flexWrap:"wrap" }}>
 {reactions.map(([emoji, users]) => (
 <button key={emoji} onClick={() => react(n.id, emoji)}
 style={{ background: myReactions.includes(emoji)?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)", border: myReactions.includes(emoji)?"1px solid rgba(99,102,241,0.4)":"1px solid #1f2937", borderRadius:"20px", padding:"3px 10px", cursor:"pointer", fontSize:".8rem", color:"#d1d5db", display:"flex", alignItems:"center", gap:"4px" }}>
 {emoji} <span style={{ fontSize:".72rem", color:"#6b7280" }}>{users.length}</span>
 </button>
 ))}

 {/* Emoji picker */}
 <div style={{ position:"relative" }}>
 <button onClick={() => setOpenEmoji(openEmoji===n.id ? null : n.id)}
 style={{ background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:"20px", padding:"3px 10px", cursor:"pointer", fontSize:".75rem", color:"#6b7280" }}>
 + 
 </button>
 {openEmoji===n.id && (
 <div style={{ position:"absolute", bottom:"115%", left:0, background:"#1f2937", border:"1px solid #374151", borderRadius:"12px", padding:"8px", display:"flex", gap:"4px", flexWrap:"wrap", width:"176px", zIndex:100, boxShadow:"0 8px 32px rgba(0,0,0,0.6)" }}>
 {EMOJIS.map(e => (
 <button key={e} onClick={() => react(n.id, e)}
 style={{ background:"transparent", border:"none", fontSize:"1.2rem", cursor:"pointer", borderRadius:"6px", padding:"4px", width:"32px", height:"32px", transition:"background 0.1s" }}
 onMouseEnter={ev=>ev.target.style.background="#374151"}
 onMouseLeave={ev=>ev.target.style.background="transparent"}>
 {e}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Pin + Delete (owner or admin) */}
 {canManage(n) && (
 <div style={{ display:"flex", gap:"6px", marginLeft:"auto" }}>
 <button onClick={() => togglePin(n.id)}
 title={n.pinned ? "Unpin" : "Pin to top"}
 style={{ background: n.pinned ? "rgba(245,158,11,0.22)" : "rgba(255,255,255,0.07)", border: n.pinned ? "1px solid rgba(245,158,11,0.6)" : "1px solid #4b5563", borderRadius:"8px", padding:"5px 12px", cursor:"pointer", fontSize:".75rem", fontWeight:700, color: n.pinned ? "#fbbf24" : "#9ca3af" }}>
 {n.pinned ? "Unpin" : "Pin"}
 </button>
 <button onClick={() => deleteNotif(n.id, n.broadcast_id)}
 title={role === "admin" ? "Delete for everyone" : "Remove from my view"}
 style={{ background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.55)", borderRadius:"8px", padding:"5px 12px", cursor:"pointer", fontSize:".75rem", fontWeight:700, color:"#fca5a5" }}>
 {role === "admin" ? "Del All" : "Remove"}
 </button>
 </div>
 )}
 </div>
 </div>
 );
 })}

 {/* Compose Modal */}
 {showCompose && (
 <div onClick={() => setShowCompose(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(4px)" }}>
 <div onClick={e => e.stopPropagation()} style={{ background:"#161b27", border:"1px solid #1f2937", borderRadius:"16px", padding:"24px", width:"100%", maxWidth:"480px", maxHeight:"90vh", overflowY:"auto" }}>
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
 <h2 style={{ color:"#f9fafb", fontWeight:800, margin:0, fontSize:"1.2rem" }}> Send Notification</h2>
 <button onClick={() => setShowCompose(false)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid #374151", borderRadius:"8px", width:"30px", height:"30px", cursor:"pointer", color:"#9ca3af", fontSize:"1rem" }}></button>
 </div>
 <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
 <div>
 <label style={{ color:"#6b7280", fontSize:".78rem", display:"block", marginBottom:"4px" }}>Title *</label>
 <input style={inp} value={compose.title} onChange={e=>setCompose(p=>({...p,title:e.target.value}))} placeholder="Notification title..." />
 </div>
 <div>
 <label style={{ color:"#6b7280", fontSize:".78rem", display:"block", marginBottom:"4px" }}>Message *</label>
 <textarea style={{...inp, height:"90px", resize:"vertical"}} value={compose.message} onChange={e=>setCompose(p=>({...p,message:e.target.value}))} placeholder="Write your message..." />
 </div>
 <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
 <div>
 <label style={{ color:"#6b7280", fontSize:".78rem", display:"block", marginBottom:"4px" }}>Type</label>
 <select style={{...inp}} value={compose.type} onChange={e=>setCompose(p=>({...p,type:e.target.value}))}>
 <option value="system"> System</option>
 <option value="announcement"> Announcement</option>
 <option value="assignment"> Assignment</option>
 <option value="payment"> Payment</option>
 <option value="message"> Message</option>
 </select>
 </div>
 <div>
 <label style={{ color:"#6b7280", fontSize:".78rem", display:"block", marginBottom:"4px" }}>Send to</label>
 <select style={{...inp}} value={compose.targetRole} onChange={e=>setCompose(p=>({...p,targetRole:e.target.value,targetUserId:""}))}>
 <option value="all"> Everyone</option>
 <option value="student"> Students only</option>
 <option value="guardian"> Parents only</option>
 <option value="teacher"> Teachers only</option>
 <option value="admin"> Admins only</option>
 <option value="specific"> Specific user</option>
 </select>
 </div>
 </div>
 {compose.targetRole === "specific" && (
 <div>
 <label style={{ color:"#6b7280", fontSize:".78rem", display:"block", marginBottom:"4px" }}>User ID</label>
 <input style={inp} value={compose.targetUserId} onChange={e=>setCompose(p=>({...p,targetUserId:e.target.value}))} placeholder="Paste the user's ID..." />
 </div>
 )}
 <button onClick={sendNotif} disabled={sending}
 style={{ background:sending?"#1f2937":"linear-gradient(135deg,#6366f1,#4f46e5)", color:sending?"#6b7280":"#fff", border:"none", borderRadius:"10px", padding:"12px", fontWeight:700, fontSize:".9rem", cursor:sending?"default":"pointer", marginTop:"4px" }}>
 {sending ? "Sending..." : " Send Notification"}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

