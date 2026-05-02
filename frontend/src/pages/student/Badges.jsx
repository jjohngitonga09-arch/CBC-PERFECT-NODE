import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const DEFS = [
 {id:'first_submit', icon:'', label:'First Submit', desc:'Submitted first assignment', req:k=>+k.submittedAssignments>=1},
 {id:'streak_7', icon:'=%', label:'7-Day Streak', desc:'7 days in a row', req:k=>+k.dailyStreak>=7},
 {id:'streak_14', icon:'', label:'Dedicated', desc:'14-day streak', req:k=>+k.dailyStreak>=14},
 {id:'star_10', icon:'P', label:'Rising Star', desc:'Earned 10 stars', req:k=>+k.starsEarned>=10},
 {id:'star_50', icon:'<', label:'Star Collector', desc:'Earned 50 stars', req:k=>+k.starsEarned>=50},
 {id:'star_100', icon:'', label:'Legend', desc:'Earned 100 stars', req:k=>+k.starsEarned>=100},
 {id:'video_5', icon:'', label:'Video Fan', desc:'Watched 5 videos this week', req:k=>+k.videosWatched7d>=5},
 {id:'all_done', icon:'', label:'Overachiever', desc:'All assignments submitted', req:k=>+k.totalAssignments>0&&+k.submittedAssignments>=+k.totalAssignments},
]

export default function StudentBadges() {
 const userId = useAuthStore(s => s.userId)
 const [kpis, setKpis] = useState({})
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get(`/dashboard/student/kpis/${userId}`)
 .then(r => setKpis(r.data || {}))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 if (loading) return <Spinner />

 const count = DEFS.filter(b => b.req(kpis)).length

 return (
 <div>
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Badges</h1>
 <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{count} of {DEFS.length} earned</p>
 </div>

 <div style={{background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
 <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
 <span style={{fontSize:'.875rem',fontWeight:600,color:'#f9fafb'}}>Collection Progress</span>
 <span style={{fontSize:'.875rem',color:'#6366f1',fontWeight:700}}>{count}/{DEFS.length}</span>
 </div>
 <div style={{height:'8px',background:'#1f2937',borderRadius:'99px',overflow:'hidden'}}>
 <div style={{height:'100%',width:`${(count/DEFS.length)*100}%`,background:'linear-gradient(90deg,#6366f1,#818cf8)',borderRadius:'99px',transition:'width 0.6s'}} />
 </div>
 </div>

 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'12px'}}>
 {DEFS.map(b => {
 const has = b.req(kpis)
 return (
 <div key={b.id} style={{background:has?'rgba(99,102,241,0.08)':'#161b27',border:`1px solid ${has?'rgba(99,102,241,0.3)':'#1f2937'}`,borderRadius:'16px',padding:'20px 16px',textAlign:'center',opacity:has?1:0.4,transition:'opacity 0.2s'}}>
 <p style={{fontSize:'2.5rem',margin:'0 0 10px',filter:has?'none':'grayscale(1)'}}>{b.icon}</p>
 <p style={{fontSize:'.875rem',fontWeight:700,color:has?'#a5b4fc':'#6b7280',margin:'0 0 4px'}}>{b.label}</p>
 <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>{b.desc}</p>
 {has && <p style={{fontSize:'.7rem',color:'#6366f1',fontWeight:700,margin:'8px 0 0',textTransform:'uppercase',letterSpacing:'.5px'}}> Earned</p>}
 </div>
 )
 })}
 </div>
 </div>
 )
}
