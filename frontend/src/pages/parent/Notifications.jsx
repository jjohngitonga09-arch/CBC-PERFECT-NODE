import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}
const ICON = { assignment:'', grade:'', message:'', subscription:'', system:'' }

export default function ParentNotifications() {
 const userId = useAuthStore(s => s.userId)
 const [notifs, setNotifs] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get(`/notifications/${userId}`)
 .then(r => setNotifs(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 async function markRead(id) {
 try {
 await api.patch(`/notifications/${id}`, { read: true })
 setNotifs(p => p.map(n => n.id === id ? {...n, read: true} : n))
 } catch {}
 }

 if (loading) return <Spinner />

 const unread = notifs.filter(n => !n.read).length

 return (
 <div>
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Notifications</h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
 </div>

 {notifs.length === 0 ? (
 <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
 <p style={{fontSize:'3rem',margin:'0 0 12px'}}></p>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 6px'}}>No notifications</p>
 <p style={{color:'var(--sub)',fontSize:'.875rem',margin:0}}>You're all caught up!</p>
 </div>
 ) : (
 <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
 {notifs.map((n, i) => (
 <div key={n.id || i} onClick={() => !n.read && markRead(n.id)}
 style={{...card,padding:'14px 18px',display:'flex',gap:'14px',alignItems:'flex-start',
 opacity:n.read?0.6:1,cursor:n.read?'default':'pointer',
 borderColor:n.read?'var(--surface-hover)':'rgba(99,102,241,0.25)'}}>
 <span style={{fontSize:'1.5rem',flexShrink:0}}>{ICON[n.type] || ''}</span>
 <div style={{flex:1,minWidth:0}}>
 <p style={{fontWeight:600,color:n.read?'var(--sub)':'var(--text)',margin:'0 0 4px'}}>{n.title || n.type || 'Notification'}</p>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:'0 0 4px'}}>{n.message || n.content}</p>
 <p style={{fontSize:'.72rem',color:'var(--sub)',margin:0}}>{new Date(n.created_at || n.timestamp || Date.now()).toLocaleString()}</p>
 </div>
 {!n.read && <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#6366f1',flexShrink:0,marginTop:'6px'}} />}
 </div>
 ))}
 </div>
 )}
 </div>
 )
}
