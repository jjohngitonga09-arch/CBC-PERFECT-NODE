import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import KpiCard from '../../components/dashboard/KpiCard'
import StatRow from '../../components/dashboard/StatRow'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

function Detail({ label, value }) {
 if (!value) return null
 return (
 <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
 <span style={{fontSize:'.68rem',color:'#4b5563',textTransform:'uppercase',letterSpacing:'.5px',fontWeight:700}}>{label}</span>
 <span style={{fontSize:'.85rem',color:'#e5e7eb',fontWeight:500}}>{value}</span>
 </div>
 )
}

function daysUntil(dateStr) {
 if (!dateStr) return null
 const diff = new Date(dateStr) - new Date()
 return Math.ceil(diff / 86400000)
}

export default function ParentHome() {
 const { studentId } = useParams()
 const userId = useAuthStore(s => s.userId)
 const linkedStudentIds = useAuthStore(s => s.linkedStudentIds)

 const [children, setChildren] = useState([])
 const [activeId, setActiveId] = useState(null)
 const [kpis, setKpis] = useState(null)
 const [activity, setActivity] = useState([])
 const [loading, setLoading] = useState(true)
 const [kpiLoading, setKpiLoading] = useState(false)
 const [expanded, setExpanded] = useState(null)

 // Load children list once
 useEffect(() => {
 api.get('/parent-student/my-children')
 .then(r => {
 const list = Array.isArray(r.data) ? r.data : []
 setChildren(list)
 const init = studentId || list[0]?.id || linkedStudentIds?.[0] || userId
 setActiveId(init)
 })
 .catch(() => {
 const init = studentId || linkedStudentIds?.[0] || userId
 setActiveId(init)
 })
 }, [])

 // Load KPIs whenever active child changes
 useEffect(() => {
 if (!activeId) return
 setKpiLoading(true)
 Promise.allSettled([
 api.get(`/dashboard/parent/kpis/${activeId}`),
 api.get(`/dashboard/student/kpis/${activeId}`),
 ]).then(([p, s]) => {
 if (p.status === 'fulfilled') setKpis(p.value.data)
 if (s.status === 'fulfilled') {
 const d = s.value.data
 setActivity([
 d.dailyStreak != null && { icon:'~', label:`${d.dailyStreak}-day learning streak` },
 d.starsEarned != null && { icon:'*', label:`${d.starsEarned} stars earned total` },
 d.videosWatched7d != null && { icon:'V', label:`${d.videosWatched7d} videos this week` },
 d.badges != null && { icon:'#', label:`${d.badges} badges unlocked` },
 ].filter(Boolean))
 }
 }).finally(() => { setLoading(false); setKpiLoading(false) })
 }, [activeId])

 if (loading) return <Spinner />

 const subStatus = kpis?.subscriptionStatus?.status
 const subExpiry = kpis?.subscriptionStatus?.expiry_date
 const daysLeft = daysUntil(subExpiry)
 const activeChild = children.find(c => c.id === activeId)

 return (
 <div>
 {/* Header */}
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Parent Dashboard</h1>
 <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>Monitoring your child's learning journey</p>
 </div>

 {/* Child switcher real names */}
 {children.length > 1 && (
 <div style={{...card, marginBottom:'20px', padding:'14px 16px'}}>
 <p style={{fontSize:'.72rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'.5px',margin:'0 0 10px'}}>Viewing</p>
 <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
 {children.map(c => (
 <button key={c.id} onClick={() => setActiveId(c.id)}
 style={{padding:'7px 16px',borderRadius:'20px',fontSize:'.82rem',fontWeight:700,cursor:'pointer',
 border:'1px solid', transition:'all .15s',
 borderColor: c.id===activeId ? '#6366f1' : '#374151',
 background: c.id===activeId ? 'rgba(99,102,241,0.15)' : 'transparent',
 color: c.id===activeId ? '#a5b4fc' : '#6b7280'}}>
 {c.name || c.email || c.id.slice(0,8)+''}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Subscription banners */}
 {subStatus !== 'active' && (
 <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)',borderRadius:'14px',
 padding:'16px 18px',marginBottom:'20px',display:'flex',alignItems:'center',
 justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
 <div>
 <p style={{fontWeight:700,color:'#fbbf24',margin:'0 0 3px'}}>No active subscription</p>
 <p style={{fontSize:'.85rem',color:'#9ca3af',margin:0}}>Subscribe to unlock all content for your child.</p>
 </div>
 <Link to="/parent/subscription"
 style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',padding:'8px 16px',
 borderRadius:'10px',textDecoration:'none',fontSize:'.875rem',fontWeight:700,flexShrink:0}}>
 Subscribe 
 </Link>
 </div>
 )}

 {subStatus === 'active' && daysLeft != null && daysLeft <= 7 && (
 <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.3)',
 borderRadius:'14px',padding:'14px 18px',marginBottom:'20px',
 display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
 <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
 <span style={{fontSize:'1.5rem'}}></span>
 <div>
 <p style={{fontWeight:700,color:'#fbbf24',margin:'0 0 2px'}}>Subscription expires in {daysLeft} day{daysLeft!==1?'s':''}</p>
 <p style={{fontSize:'.82rem',color:'#9ca3af',margin:0}}>Renew now to avoid interrupting {activeChild?.name?.split(' ')[0]}'s learning</p>
 </div>
 </div>
 <Link to="/parent/subscription"
 style={{background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)',
 color:'#fbbf24',padding:'8px 16px',borderRadius:'10px',
 textDecoration:'none',fontSize:'.82rem',fontWeight:700,flexShrink:0}}>
 Renew 
 </Link>
 </div>
 )}

 {subStatus === 'active' && (daysLeft == null || daysLeft > 7) && (
 <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',
 borderRadius:'14px',padding:'14px 18px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px'}}>
 <span style={{fontSize:'1.5rem'}}></span>
 <div>
 <p style={{fontWeight:700,color:'#34d399',margin:'0 0 2px'}}>Subscription active</p>
 <p style={{fontSize:'.85rem',color:'#9ca3af',margin:0}}>
 {subExpiry ? `Renews ${new Date(subExpiry).toLocaleDateString()}` : 'All content unlocked'}
 </p>
 </div>
 </div>
 )}

 {/* KPI Cards */}
 {kpiLoading ? (
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:'12px',marginBottom:'24px'}}>
 {[1,2,3,4].map(i=>(
 <div key={i} style={{...card,height:'80px',background:'#1a2234',animation:'pulse 1.5s infinite'}}/>
 ))}
 </div>
 ) : (
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:'12px',marginBottom:'24px'}}>
 <KpiCard icon="%" label="Progress" value={`${kpis?.childProgress??0}%`} color="brand" />
 <KpiCard icon="M" label="Unread Msgs" value={kpis?.unreadMessages??0} color="yellow" />
 <KpiCard icon="~" label="Day Streak" value={`${kpis?.learningStreak??0}d`} color="green" />
 <KpiCard icon="" label="Videos (7d)" value={kpis?.engagement?.videosWatched??0} color="blue" />
 </div>
 )}

 {/* Assignment completion bar */}
 <div style={{...card,marginBottom:'20px'}}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'#f9fafb',margin:'0 0 16px'}}>Assignment Completion</p>
 <StatRow label="Completed" value={kpis?.childProgress??0} max={100} color="#6366f1" />
 </div>

 {/* Activity snapshot */}
 {activity.length > 0 && (
 <div style={{...card,marginBottom:'20px'}}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'#f9fafb',margin:'0 0 14px'}}>
 {activeChild?.name?.split(' ')[0] || 'Child'}'s Activity
 </p>
 {activity.map((a,i) => (
 <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',
 borderBottom:i<activity.length-1?'1px solid #1f2937':'none'}}>
 <span style={{fontSize:'1.3rem'}}>{a.icon}</span>
 <span style={{fontSize:'.875rem',color:'#e5e7eb'}}>{a.label}</span>
 </div>
 ))}
 </div>
 )}

 {/* My Children expandable */}
 <div style={{...card,marginBottom:'20px'}}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'#f9fafb',margin:'0 0 16px',display:'flex',alignItems:'center',gap:'8px'}}>
 My Children
 <span style={{fontSize:'.75rem',fontWeight:500,color:'#6b7280'}}>({children.length} linked)</span>
 </p>
 {children.length === 0 ? (
 <div style={{textAlign:'center',padding:'20px 0'}}>
 <p style={{color:'#6b7280',fontSize:'.85rem',margin:'0 0 4px'}}>No students linked yet</p>
 <p style={{color:'#4b5563',fontSize:'.78rem',margin:0}}>Ask your child to link you from their dashboard</p>
 </div>
 ) : children.map(child => (
 <div key={child.id} style={{borderRadius:'12px',border:'1px solid #1f2937',marginBottom:'10px',overflow:'hidden'}}>
 <div style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',
 background:'#0f1421',cursor:'pointer'}}
 onClick={() => setExpanded(expanded===child.id ? null : child.id)}>
 <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#4f46e5)',
 display:'flex',alignItems:'center',justifyContent:'center',
 fontSize:'1.2rem',fontWeight:800,color:'#fff',flexShrink:0}}>
 {child.avatar_url
 ? <img src={child.avatar_url} alt="" style={{width:44,height:44,borderRadius:'50%',objectFit:'cover'}}/>
 : child.name?.charAt(0).toUpperCase()}
 </div>
 <div style={{flex:1,minWidth:0}}>
 <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 2px',fontSize:'.95rem'}}>{child.name}</p>
 <p style={{fontSize:'.75rem',color:'#6b7280',margin:0}}>
 {[child.username && `@${child.username}`, child.grade && `Grade ${child.grade}`, child.status].filter(Boolean).join(' ')}
 </p>
 </div>
 <span style={{color:'#4b5563',fontSize:'.8rem'}}>{expanded===child.id?'':''}</span>
 </div>
 {expanded === child.id && (
 <div style={{padding:'16px',borderTop:'1px solid #1f2937',display:'flex',flexDirection:'column',gap:'16px'}}>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'12px'}}>
 <Detail label="Full Name" value={child.name} />
 <Detail label="Username" value={child.username} />
 <Detail label="Email" value={child.email} />
 <Detail label="Grade" value={child.grade} />
 <Detail label="Status" value={child.status} />
 <Detail label="Last Online" value={child.last_online ? new Date(child.last_online).toLocaleString() : null} />
 <Detail label="Joined" value={child.created_at ? new Date(child.created_at).toLocaleDateString() : null} />
 </div>
 <div style={{display:'flex',gap:'8px',flexWrap:'wrap',paddingTop:'8px',borderTop:'1px solid #1f2937'}}>
 <Link to={`/parent/child/${child.id}/progress`}
 style={{background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',
 color:'#a5b4fc',borderRadius:'8px',padding:'7px 16px',textDecoration:'none',fontSize:'.8rem',fontWeight:600}}>
 Progress
 </Link>
 <Link to={`/parent/child/${child.id}/messages`}
 style={{background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.3)',
 color:'#93c5fd',borderRadius:'8px',padding:'7px 16px',textDecoration:'none',fontSize:'.8rem',fontWeight:600}}>
 Messages
 </Link>
 <button onClick={() => { setActiveId(child.id); toast.success(`Switched to ${child.name}`) }}
 style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',
 color:'#34d399',borderRadius:'8px',padding:'7px 16px',fontSize:'.8rem',fontWeight:600,cursor:'pointer'}}>
 View Stats
 </button>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>

 {/* Quick links */}
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:'10px'}}>
 {[
 {to:`/parent/child/${activeId}/progress`, icon:'', label:'Progress'},
 {to:`/parent/child/${activeId}/messages`, icon:'', label:'Messages'},
 {to:'/parent/subscription', icon:'', label:'Subscription'},
 {to:'/parent/notifications', icon:'', label:'Notifications'},
 ].map(l => (
 <Link key={l.to} to={l.to}
 style={{...card,textAlign:'center',textDecoration:'none',padding:'16px 10px',transition:'background 0.15s,border-color 0.15s'}}
 onMouseEnter={e=>{e.currentTarget.style.background='#1a2234';e.currentTarget.style.borderColor='#374151'}}
 onMouseLeave={e=>{e.currentTarget.style.background='#161b27';e.currentTarget.style.borderColor='#1f2937'}}>
 <p style={{fontSize:'1.9rem',margin:'0 0 6px'}}>{l.icon}</p>
 <p style={{fontSize:'.78rem',fontWeight:600,color:'#9ca3af',margin:0}}>{l.label}</p>
 </Link>
 ))}
 </div>
 </div>
 )
}
