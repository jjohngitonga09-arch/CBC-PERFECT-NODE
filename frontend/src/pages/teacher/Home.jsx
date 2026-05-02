import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import KpiCard from '../../components/dashboard/KpiCard'
import StatRow from '../../components/dashboard/StatRow'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'20px',boxShadow:'var(--shadow)'}

const ACTIONS = [
 {to:'/teacher/create-card', icon:'C', label:'Create Card'},
 {to:'/teacher/upload-video', icon:'V', label:'Upload Video'},
 {to:'/teacher/assignments', icon:'A', label:'Assignments'},
 {to:'/teacher/submissions', icon:'S', label:'Submissions'},
 {to:'/teacher/class-progress', icon:'%', label:'Progress'},
 {to:'/teacher/messages', icon:'M', label:'Messages'},
]

export default function TeacherHome() {
 const userId = useAuthStore(s => s.userId)
 const name = useAuthStore(s => s.user?.name)

 const [kpis, setKpis] = useState(null)
 const [students, setStudents] = useState({}) // id name map
 const [loading, setLoading] = useState(true)
 const [msgStudentId, setMsgStudentId] = useState('')
 const [msgText, setMsgText] = useState('')
 const [sending, setSending] = useState(false)

 useEffect(() => {
 Promise.allSettled([
 api.get(`/dashboard/teacher/kpis/${userId}`),
 api.get('/admin/users'),
 ]).then(([k, u]) => {
 if (k.status === 'fulfilled') setKpis(k.value.data)
 if (u.status === 'fulfilled') {
 const map = {}
 ;(u.value.data || []).forEach(s => { map[s.id] = s.name || s.email || s.id.slice(0,10)+'' })
 setStudents(map)
 }
 }).finally(() => setLoading(false))
 }, [userId])

 if (loading) return <Spinner />

 const struggling = kpis?.strugglingStudents || []
 const total = kpis?.studentsAssigned || 1
 const pending = kpis?.pendingSubmissions || 0
 const reviewed = total - pending
 const healthPct = Math.round((reviewed / total) * 100)

 async function sendQuickMsg() {
 if (!msgStudentId || !msgText.trim()) { toast.error('Pick a student and enter a message'); return }
 setSending(true)
 try {
 await api.post('/messages', { receiver_id: msgStudentId, content: msgText.trim() })
 toast.success('Message sent!')
 setMsgText('')
 setMsgStudentId('')
 } catch (e) {
 toast.error(e.response?.data?.error || 'Failed to send')
 } finally { setSending(false) }
 }

 return (
 <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>

 {/* Header */}
 <div>
 <h1 style={{fontSize:'1.65rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>
 Welcome back, {name?.split(' ')[0]} 
 </h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>Here is your class at a glance</p>
 </div>

 {/* KPIs */}
 <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'14px'}}>
 <KpiCard icon="S" label="Students" value={kpis?.studentsAssigned} color="brand" />
 <KpiCard icon="P" label="Pending Reviews" value={kpis?.pendingSubmissions} color="yellow" />
 <KpiCard icon="*" label="Avg Stars" value={kpis?.avgStars?.toFixed(1) ?? ''} color="green" />
 <KpiCard icon="A" label="Recent Activity" value={kpis?.recentActivity?.length ?? 0} color="purple" />
 </div>

 {/* Class health bar */}
 <div style={card}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px',flexWrap:'wrap',gap:'8px'}}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'var(--text)',margin:0}}>Class Health</p>
 <span style={{fontSize:'.8rem',fontWeight:700,
 color: healthPct>=80?'#10b981':healthPct>=50?'#f59e0b':'#ef4444'}}>
 {healthPct}% reviewed
 </span>
 </div>
 <StatRow label="Submissions Reviewed" value={reviewed} max={total} color={healthPct>=80?'#10b981':healthPct>=50?'#f59e0b':'#ef4444'} />
 <StatRow label="Average Stars" value={Math.round(kpis?.avgStars ?? 0)} max={5} color="#6366f1" />
 {pending > 0 && (
 <div style={{marginTop:'12px',padding:'10px 14px',borderRadius:'10px',
 background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',
 display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
 <span style={{fontSize:'.85rem',color:'#fbbf24',fontWeight:600}}> {pending} submission{pending!==1?'s':''} waiting for review</span>
 <Link to="/teacher/submissions"
 style={{fontSize:'.78rem',fontWeight:700,color:'#fbbf24',textDecoration:'none',
 background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.25)',
 padding:'5px 12px',borderRadius:'8px'}}>
 Review 
 </Link>
 </div>
 )}
 </div>

 {/* Quick Actions */}
 <div>
 <p style={{fontSize:'.8rem',fontWeight:700,color:'var(--sub)',margin:'0 0 10px',textTransform:'uppercase',letterSpacing:'.5px'}}>Quick Actions</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px'}}>
 {ACTIONS.map(l => (
 <Link key={l.to} to={l.to}
 style={{...card,display:'flex',alignItems:'center',gap:'12px',
 textDecoration:'none',padding:'14px 16px',transition:'transform .15s,box-shadow .15s'}}
 onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-hover)'}}
 onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='var(--shadow)'}}>
 <span style={{fontSize:'1.4rem',lineHeight:1}}>{l.icon}</span>
 <span style={{fontSize:'.82rem',fontWeight:700,color:'var(--text)'}}>{l.label}</span>
 </Link>
 ))}
 </div>
 </div>

 {/* Struggling Students with real names */}
 {struggling.length > 0 && (
 <div style={{...card,border:'1px solid rgba(239,68,68,0.25)',background:'rgba(239,68,68,0.04)'}}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'#ef4444',margin:'0 0 14px'}}> Students Needing Help</p>
 {struggling.map((s, i) => {
 const displayName = students[s.student_id] || s.student_name || s.student_id?.slice(0,12)+''
 return (
 <div key={s.student_id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
 padding:'10px 0',borderBottom:i<struggling.length-1?'1px solid var(--border)':'none',gap:'10px',flexWrap:'wrap'}}>
 <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
 <div style={{width:34,height:34,borderRadius:'50%',background:'rgba(239,68,68,0.15)',
 display:'flex',alignItems:'center',justifyContent:'center',
 fontSize:'.9rem',fontWeight:800,color:'#ef4444',flexShrink:0}}>
 {displayName.charAt(0).toUpperCase()}
 </div>
 <span style={{fontSize:'.875rem',color:'var(--text)',fontWeight:600}}>{displayName}</span>
 </div>
 <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
 <span style={{fontSize:'.82rem',color:'#ef4444',fontWeight:700}}>Avg {Number(s.avg_stars).toFixed(1)} </span>
 <button onClick={() => setMsgStudentId(s.student_id)}
 style={{fontSize:'.75rem',padding:'4px 10px',borderRadius:'8px',cursor:'pointer',fontWeight:600,
 background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',color:'#a5b4fc'}}>
 Message
 </button>
 </div>
 </div>
 )
 })}
 </div>
 )}

 {/* Quick Message */}
 <div style={card}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'var(--text)',margin:'0 0 14px'}}> Quick Message</p>
 <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
 <input value={msgStudentId} onChange={e=>setMsgStudentId(e.target.value)}
 placeholder="Student ID (click 'Message' above to auto-fill)"
 style={{padding:'9px 14px',borderRadius:'10px',border:'1px solid var(--border)',
 background:'var(--bg)',color:'var(--text)',fontSize:'.875rem',outline:'none'}}/>
 <textarea value={msgText} onChange={e=>setMsgText(e.target.value)}
 rows={3} placeholder="Type your message"
 style={{padding:'9px 14px',borderRadius:'10px',border:'1px solid var(--border)',
 background:'var(--bg)',color:'var(--text)',fontSize:'.875rem',outline:'none',resize:'vertical'}}/>
 <button onClick={sendQuickMsg} disabled={sending}
 style={{padding:'10px',borderRadius:'10px',border:'none',fontWeight:700,fontSize:'.875rem',
 background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',cursor:sending?'wait':'pointer'}}>
 {sending ? 'Sending' : 'Send Message'}
 </button>
 </div>
 </div>

 {/* Recent Activity */}
 {kpis?.recentActivity?.length > 0 && (
 <div style={card}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'var(--text)',margin:'0 0 14px'}}>Recent Activity</p>
 {kpis.recentActivity.map((a,i) => (
 <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',
 borderBottom:i<kpis.recentActivity.length-1?'1px solid var(--border)':'none',fontSize:'.875rem'}}>
 <span style={{color:'var(--sub)',textTransform:'capitalize'}}>{a.action?.replace(/_/g,' ')}</span>
 <span style={{color:'var(--sub)'}}>{new Date(a.timestamp).toLocaleDateString()}</span>
 </div>
 ))}
 </div>
 )}

 </div>
 )
}
