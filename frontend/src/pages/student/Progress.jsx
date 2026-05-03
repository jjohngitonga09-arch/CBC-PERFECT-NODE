import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import StatRow from '../../components/dashboard/StatRow'
import Spinner from '../../components/common/Spinner'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}

export default function StudentProgress() {
 const userId = useAuthStore(s => s.userId)
 const [kpis, setKpis] = useState(null)
 const [assignments, setAssignments] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 Promise.allSettled([
 api.get(`/dashboard/student/kpis/${userId}`),
 api.get(`/assignments/student/${userId}`),
 ]).then(([k, a]) => {
 if (k.status === 'fulfilled') setKpis(k.value.data)
 if (a.status === 'fulfilled') setAssignments(a.value.data)
 }).finally(() => setLoading(false))
 }, [userId])

 if (loading) return <Spinner />

 const total = kpis?.totalAssignments ?? assignments.length
 const done = kpis?.submittedAssignments ?? assignments.filter(a => a.submission_status === 'graded' || a.submission_status === 'submitted').length
 const pct = total > 0 ? Math.round((done / total) * 100) : 0

 const statusStyle = s => s === 'graded'
 ? {bg:'rgba(16,185,129,0.15)',fg:'#34d399'}
 : s === 'submitted'
 ? {bg:'rgba(245,158,11,0.15)',fg:'#fbbf24'}
 : {bg:'rgba(99,102,241,0.15)',fg:'#a5b4fc'}

 return (
 <div>
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>My Progress</h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>Your learning journey at a glance</p>
 </div>

 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:'12px',marginBottom:'24px'}}>
 {[
 {label:'Completion', value:`${pct}%`, icon:'%', color:'#6366f1'},
 {label:'Day Streak', value:kpis?.dailyStreak??0, icon:'~', color:'#f97316'},
 {label:'Stars', value:kpis?.starsEarned??0, icon:'*', color:'#f59e0b'},
 {label:'Videos (7d)',value:kpis?.videosWatched7d??0, icon:'%', color:'#0ea5e9'},
 ].map(s => (
 <div key={s.label} style={{...card,textAlign:'center'}}>
 <p style={{fontSize:'2rem',margin:'0 0 8px'}}>{s.icon}</p>
 <p style={{fontSize:'1.35rem',fontWeight:800,color:s.color,margin:'0 0 4px'}}>{s.value}</p>
 <p style={{fontSize:'.75rem',color:'var(--sub)',margin:0}}>{s.label}</p>
 </div>
 ))}
 </div>

 <div style={{...card,marginBottom:'20px'}}>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 16px'}}>Overview</p>
 <StatRow label={`Assignments  ${done} of ${total} done`} value={pct} max={100} color="#6366f1" />
 <StatRow label="Stars earned" value={Math.min(kpis?.starsEarned??0,100)} max={100} color="#f59e0b" />
 <StatRow label="Streak (days)" value={Math.min(kpis?.dailyStreak??0,30)} max={30} color="#f97316" />
 </div>

 <div style={card}>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 14px'}}>Assignments ({assignments.length})</p>
 {assignments.length === 0 && <p style={{color:'var(--sub)',fontSize:'.875rem',margin:0}}>No assignments yet.</p>}
 {assignments.map((a, i) => {
 const sc = statusStyle(a.submission_status)
 return (
 <div key={a.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:i<assignments.length-1?'1px solid var(--border)':'none',gap:'12px'}}>
 <div style={{flex:1,minWidth:0}}>
 <p style={{fontWeight:600,color:'var(--text)',margin:'0 0 3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</p>
 <p style={{fontSize:'.75rem',color:'var(--sub)',margin:0}}>Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : ''}</p>
 </div>
 <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
 {a.stars != null && <span style={{color:'#f59e0b',fontSize:'.875rem'}}>{'*'.repeat(Math.min(+a.stars||0,5))}</span>}
 <span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',background:sc.bg,color:sc.fg,textTransform:'capitalize'}}>
 {a.submission_status || 'assigned'}
 </span>
 </div>
 </div>
 )
 })}
 </div>
 </div>
 )
}
