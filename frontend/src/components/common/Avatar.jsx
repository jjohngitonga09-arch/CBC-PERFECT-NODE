import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Full-image lightbox
function Lightbox({ src, name, onClose }) {
 return (
 <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out"}}>
 <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px"}}>
 <img src={src} alt={name} style={{maxWidth:"90vw",maxHeight:"80vh",borderRadius:"16px",objectFit:"contain",boxShadow:"0 8px 48px rgba(0,0,0,0.6)"}} />
 <p style={{color:"#f9fafb",fontWeight:600,margin:0}}>{name}</p>
 <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",borderRadius:"8px",padding:"6px 18px",cursor:"pointer",fontWeight:600}}>Close</button>
 </div>
 </div>
 );
}

// Avatar component use everywhere
export default function Avatar({ user, size = 38, clickable = true, style = {} }) {
 const [lightbox, setLightbox] = useState(false);

 const name = user?.name || "?";
 const initial = name[0]?.toUpperCase() || "?";
 const src = user?.avatar_url ? `${API}${user.avatar_url}` : null;

 const roleColors = {
 admin: "linear-gradient(135deg,#ef4444,#dc2626)",
 teacher: "linear-gradient(135deg,#0ea5e9,#0284c7)",
 student: "linear-gradient(135deg,#6366f1,#4f46e5)",
 guardian: "linear-gradient(135deg,#10b981,#059669)",
 };
 const bg = roleColors[user?.role] || "linear-gradient(135deg,#6366f1,#4f46e5)";

 return (
 <>
 <div
 onClick={() => clickable && src && setLightbox(true)}
 title={name}
 style={{
 width: size, height: size, borderRadius: "50%", flexShrink: 0,
 background: src ? "transparent" : bg,
 display: "flex", alignItems: "center", justifyContent: "center",
 color: "#fff", fontWeight: 700, fontSize: size * 0.38,
 cursor: clickable && src ? "zoom-in" : "default",
 overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)",
 ...style
 }}
 >
 {src
 ? <img src={src} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
 : initial
 }
 </div>
 {lightbox && <Lightbox src={`${API}${user.avatar_url}`} name={name} onClose={() => setLightbox(false)} />}
 </>
 );
}
