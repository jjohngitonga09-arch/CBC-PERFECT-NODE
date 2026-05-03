import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import KpiCard from '../../components/dashboard/KpiCard'
import StatRow from '../../components/dashboard/StatRow'
import Spinner from '../../components/common/Spinner'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}

export default function ParentProgress() {
 const { studentId: paramId } = useParams()
 const userId = useAuthStore(s => s.userId)
 const linkedStudentIds = useAuthStore(s => s.linkedStudentIds)
 const target = paramId || linkedStudentIds?.[0] || userId

 const [kpis, setKpis] = useState(null)
 const [assignments, setAssignments] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 Promise.allSettled([
 api.get(`/dashboard/parent/kpis/${target}`),
 api.get(`/assignments/student/${target}`),
 ]).then(([k, a]) => {
 if (k.status === 'fulfilled') setKpis(k.value.data)
 if (a.status === 'fulfilled') setAssignments(a.value.data)
 }).finally(() => setLoading(false))
 }, [target])

 if (loading) return <Spinner />

 const total = kpis?.totalAssignments ?? 0
 const done = kpis?.completedAssignments ?? 0

 return (
 <div>
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Child Progress</h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>Learning report for your child</p>
 </div>

 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:'12px',marginBottom:'24px'}}>
 <KpiCard icon="" label="Completion" value={`${kpis?.childProgress ?? 0}%`} color="brand" />
 <KpiCard icon="" label="Streak" value={`${kpis?.learningStreak ?? 0}d`} color="yellow" />
 <KpiCard icon="" label="Assignments" value={`${done}/${total}`} color="green" />
 <KpiCard icon="" label="Unread Msgs" value={kpis?.unreadMessages ?? 0} color="purple" />
 </div>

 <div style={{...card,marginBottom:'20px'}}>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 16px'}}>Progress Overview</p>
 <StatRow label={`Assignments ${done} of ${total} done`} value={kpis?.childProgress ?? 0} max={100} color="#6366f1" />
 <StatRow label="Learning streak" value={Math.min(kpis?.learningStreak??0,30)} max={30} color="#f97316" />
 </div>

 {assignments.length > 0 && (
 <div style={card}>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 14px'}}>Recent Assignments</p>
 {assignments.slice(0, 10).map((a, i) => (
 <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:i<Math.min(assignments.length,10)-1?'1px solid var(--border)':'none',gap:'12px'}}>
 <div style={{flex:1,minWidth:0}}>
 <p style={{fontSize:'.875rem',fontWeight:600,color:'var(--text)',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</p>
 <p style={{fontSize:'.72rem',color:'var(--sub)',margin:0}}>Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : ''}</p>
 </div>
 <span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',flexShrink:0,textTransform:'capitalize',
 background:a.submission_status==='graded'?'rgba(16,185,129,0.15)':a.submission_status==='submitted'?'rgba(245,158,11,0.15)':'rgba(99,102,241,0.15)',
 color:a.submission_status==='graded'?'#34d399':a.submission_status==='submitted'?'#fbbf24':'#a5b4fc'}}>
 {a.submission_status || 'assigned'}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}
