import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import StatRow from '../../components/dashboard/StatRow'
import KpiCard from '../../components/dashboard/KpiCard'
import Spinner from '../../components/common/Spinner'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}

export default function ClassProgress() {
 const userId = useAuthStore(s => s.userId)
 const [kpis, setKpis] = useState(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get(`/dashboard/teacher/kpis/${userId}`)
 .then(r => setKpis(r.data))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 if (loading) return <Spinner />

 const reviewed = (kpis?.studentsAssigned ?? 0) - (kpis?.pendingSubmissions ?? 0)
 const pctReviewed = kpis?.studentsAssigned > 0 ? Math.round((reviewed / kpis.studentsAssigned) * 100) : 0
 const avgStarsPct = Math.round(((kpis?.avgStars ?? 0) / 5) * 100)

 return (
 <div>
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Class Progress</h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>How your students are doing</p>
 </div>

 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:'12px',marginBottom:'24px'}}>
 <KpiCard icon="" label="Students" value={kpis?.studentsAssigned ?? 0} color="brand" />
 <KpiCard icon="" label="Pending" value={kpis?.pendingSubmissions ?? 0} color="yellow" />
 <KpiCard icon="" label="Avg Stars" value={kpis?.avgStars?.toFixed(1) ?? ''} color="green" />
 <KpiCard icon="" label="Reviewed" value={`${pctReviewed}%`} color="purple" />
 </div>

 <div style={{...card,marginBottom:'16px'}}>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 16px'}}>Submission Progress</p>
 <StatRow label="Submissions reviewed" value={pctReviewed} max={100} color="#10b981" />
 <StatRow label="Average star rating" value={avgStarsPct} max={100} color="#6366f1" />
 </div>

 {(kpis?.pendingSubmissions ?? 0) > 0 && (
 <div style={{...card,background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.2)',marginBottom:'16px'}}>
 <p style={{fontWeight:700,color:'#fbbf24',margin:'0 0 6px'}}> {kpis.pendingSubmissions} submission{kpis.pendingSubmissions !== 1 ? 's' : ''} awaiting review</p>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>Go to Submissions to grade them.</p>
 </div>
 )}

 {kpis?.studentsAssigned === 0 && (
 <div style={{...card,textAlign:'center',padding:'40px 20px'}}>
 <p style={{fontSize:'2.5rem',margin:'0 0 10px'}}></p>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 6px'}}>No students yet</p>
 <p style={{color:'var(--sub)',fontSize:'.875rem',margin:0}}>Assign work to students to track progress here.</p>
 </div>
 )}
 </div>
 )
}
