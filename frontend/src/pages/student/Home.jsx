import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import KpiCard from '../../components/dashboard/KpiCard'
import InviteCard from '../../components/student/InviteCard'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}

export default function StudentHome() {
 const userId = useAuthStore(s=>s.userId)
 const name = useAuthStore(s=>s.user?.name)
 const grade = useAuthStore(s=>s.grade) || useAuthStore(s=>s.user)?.grade
 const GRADE_PAGE = { 'Grade 3':'/student/grade-3','Grade 4':'/student/grade-4','Grade 5':'/student/grade-5','Grade 6':'/student/grade-6' }
 const notesPath = GRADE_PAGE[grade] || '/student/notes'
 const [kpis,setKpis] = useState(null)
 const [assignments,setAssignments] = useState([])
 const [videos,setVideos] = useState([])
 const [loading,setLoading] = useState(true)
 const [linkedParent,setLinkedParent] = useState(null)
 const [showLink,setShowLink] = useState(false)
 const [nationalId,setNationalId] = useState('')
 const [linking,setLinking] = useState(false)
 const [rank,setRank] = useState(null)
 const [goals,setGoals] = useState({videos:false,quiz:false,study:false})

 const fetchAll = (initial=false)=>{
 const bust = '&_t=' + Date.now()
 const gradeNum = grade ? grade.replace(/^Grade\s*/i, '') : ''
 const videoUrl = '/videos?_t=' + Date.now() + (gradeNum ? '&grade=' + encodeURIComponent(gradeNum) : '')
 Promise.allSettled([
 api.get(`/dashboard/student/kpis/${userId}`),
 api.get(`/assignments/student/${userId}`),
 api.get(videoUrl),
 api.get('/parent-student/my-parent'),
 api.get(`/leaderboard${grade ? '?grade=' + encodeURIComponent(grade) : ''}`),

 ]).then(([k,a,v,p,lb])=>{
 if(k.status==='fulfilled') setKpis(k.value.data)
 if(a.status==='fulfilled') setAssignments(Array.isArray(a.value.data) ? a.value.data.slice(0,3) : [])
 if(v.status==='fulfilled') { const vl = Array.isArray(v.value.data) ? v.value.data : (Array.isArray(v.value.data?.videos) ? v.value.data.videos : []); setVideos(vl.slice(0,3)) }
 if(p.status==='fulfilled') setLinkedParent(p.value.data||null)
 if(lb.status==='fulfilled'){
 const list = Array.isArray(lb.value.data) ? lb.value.data : []
 const idx = list.findIndex(s=>s.student_id===userId)
 if(idx>=0) setRank(idx+1)
 }
 }).finally(()=>{ if(initial) setLoading(false) })
 }

 useEffect(()=>{
 fetchAll(true)
 const interval = setInterval(()=>fetchAll(false), 30000)
 return ()=>clearInterval(interval)
 },[userId])

 if(loading) return <Spinner />

 async function linkParent(){
 if(!nationalId.trim()) return
 setLinking(true)
 try{
 const r = await api.post('/parent-student/link',{parent_national_id:nationalId.trim()})
 setLinkedParent(r.data.parent)
 setShowLink(false)
 setNationalId('')
 toast.success('Parent linked successfully!')
 }catch(e){
 toast.error(e.response?.data?.error||'Failed to link parent')
 }finally{ setLinking(false) }
 }

 async function unlinkParent(){
 if(!window.confirm('Unlink your parent?')) return
 await api.delete('/parent-student/link').catch(()=>{})
 setLinkedParent(null)
 toast.success('Parent unlinked')
 }

 const nextDue = assignments.find(a=>a.status!=='graded'&&a.due_date)
 const goalsDone = Object.values(goals).filter(Boolean).length

 return (
 <div>
 {/* Header */}
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>
 Hello, {name?.split(' ')[0]}
 </h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>Keep learning, you are doing great!</p>
 </div>

 {/* Streak banner */}
 {kpis?.dailyStreak>0 && (
 <div style={{borderRadius:'16px',background:'linear-gradient(135deg,#f97316,#f59e0b)',padding:'16px 20px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'14px'}}>
 <div>
 <p style={{fontWeight:800,fontSize:'1.2rem',color:'#fff',margin:'0 0 2px'}}>{kpis.dailyStreak}-day streak!</p>
 <p style={{color:'rgba(255,255,255,0.8)',fontSize:'.85rem',margin:0}}>Come back tomorrow to keep it going.</p>
 </div>
 </div>
 )}

 {/* KPI Cards */}
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(45%,160px),1fr))',gap:'12px',marginBottom:'24px'}}>
 <KpiCard label="Day Streak" value={kpis?.dailyStreak??0} color="yellow" />
 <KpiCard label="Stars Earned" value={kpis?.starsEarned??0} color="green" />
 <KpiCard label="Videos (7d)" value={kpis?.videosWatched7d??0} color="blue" />
 <KpiCard label="Badges" value={kpis?.badges??0} color="purple" />
 </div>

 {/* Leaderboard rank card */}
 {rank && (
 <div style={{...card,background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',marginBottom:'20px',display:'flex',alignItems:'center',gap:'16px'}}>
 <div style={{flex:1}}>
 <p style={{fontWeight:800,color:'var(--text)',margin:'0 0 2px',fontSize:'1rem'}}>
 You are #{rank} on the leaderboard!
 </p>
 <p style={{fontSize:'.8rem',color:'var(--sub)',margin:0}}>Earn more stars to climb higher</p>
 </div>
 <Link to="/student/leaderboard" style={{background:'rgba(99,102,241,0.2)',border:'1px solid rgba(99,102,241,0.3)',color:'#a5b4fc',padding:'7px 14px',borderRadius:'10px',textDecoration:'none',fontSize:'.8rem',fontWeight:700,flexShrink:0}}>
 View
 </Link>
 </div>
 )}

 {/* Daily Goals */}
 <div style={{...card,marginBottom:'20px'}}>
 <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px',flexWrap:'wrap',gap:'8px'}}>
 <p style={{fontWeight:700,color:'var(--text)',margin:0,fontSize:'1rem'}}>Today's Goals</p>
 <span style={{fontSize:'.78rem',fontWeight:700,color:goalsDone===3?'#10b981':'#9ca3af'}}>{goalsDone}/3 done</span>
 </div>
 {[
 {key:'videos',label:'Watch a video', to:'/student/videos'},
 {key:'quiz', label:'Complete a quiz', to:'/student/quizzes'},
 {key:'study', label:'Open Study Time', to:'/student/study-time'},
 ].map((g,i,arr)=>(
 <div key={g.key} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',
 borderBottom:i<arr.length-1?'1px solid var(--border)':'none',cursor:'pointer',userSelect:'none'}}
 onClick={()=>setGoals(p=>({...p,[g.key]:!p[g.key]}))}>
 <div style={{width:'22px',height:'22px',borderRadius:'6px',border:'2px solid',flexShrink:0,
 borderColor:goals[g.key]?'#10b981':'var(--border-hover)',background:goals[g.key]?'#10b981':'transparent',
 display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'}}>
 {goals[g.key]&&<span style={{color:'#fff',fontSize:'11px',fontWeight:800}}></span>}
 </div>
 <span style={{fontSize:'.875rem',flex:1,
 color:goals[g.key]?'var(--sub)':'var(--text)',
 textDecoration:goals[g.key]?'line-through':'none',transition:'all .15s'}}>
 {g.label}
 </span>
 <Link to={g.to} onClick={e=>e.stopPropagation()}
 style={{fontSize:'.75rem',color:'#818cf8',textDecoration:'none',flexShrink:0}}>Go</Link>
 </div>
 ))}
 </div>

 {/* Next assignment due */}
 {nextDue && (
 <div style={{...card,background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',marginBottom:'20px'}}>
 <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
 <div>
 <p style={{fontSize:'.72rem',color:'#818cf8',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',margin:'0 0 4px'}}>Next Assignment Due</p>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 3px'}}>{nextDue.title}</p>
 <p style={{fontSize:'.8rem',color:'var(--sub)',margin:0}}>Due {new Date(nextDue.due_date).toLocaleDateString()}</p>
 </div>
 <Link to="/student/assignments" style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',padding:'8px 16px',borderRadius:'10px',textDecoration:'none',fontSize:'.875rem',fontWeight:700,flexShrink:0}}>
 Start
 </Link>
 </div>
 </div>
 )}

 {/* Quick nav grid -- labels only, no icons */}
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(45%,140px),1fr))',gap:'10px',marginBottom:'24px'}}>
 {[
 {to:'/student/videos', label:'Videos'},
 {to:'/student/assignments', label:'Assignments'},
 {to:'/student/quizzes', label:'Quizzes'},
 {to:'/student/badges', label:'Badges'},
 {to:'/student/progress', label:'Progress'},
 {to:'/student/study-time', label:'Study Time'},
 {to:'/student/leaderboard', label:'Leaderboard'},
 {to:'/student/stories', label:'Stories'},
 {to:'/student/bible-stories', label:'Bible Stories'},
 {to:'/student/writing', label:'Writing'},
 {to:'/student/math-knowledge',label:'Maths'},
 {to:'/student/world-explorer',label:'World Explorer'},
 {to:notesPath,           label:'My Notes'},
 {to:'/student/junior-basics',label:'Junior Basics'},
 {to:'/student/messages', label:'Messages'},
 ].map(l=>(
 <Link key={l.to} to={l.to}
 style={{...card,textAlign:'center',textDecoration:'none',padding:'20px 10px',transition:'background 0.15s,border-color 0.15s',display:'flex',alignItems:'center',justifyContent:'center'}}
 onMouseEnter={e=>{e.currentTarget.style.background='var(--surface-hover)';e.currentTarget.style.borderColor='var(--border-hover)'}}
 onMouseLeave={e=>{e.currentTarget.style.background='var(--surface)';e.currentTarget.style.borderColor='var(--border)'}}>
 <p style={{fontSize:'.85rem',fontWeight:600,color:'var(--sub)',margin:0}}>{l.label}</p>
 </Link>
 ))}
 </div>

 {/* Parent link section */}
 <div style={{...card,marginBottom:'20px',background:'rgba(99,102,241,0.04)'}}>
 <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'10px'}}>
 <div>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 3px',fontSize:'1rem'}}>Parent Link</p>
 <p style={{fontSize:'.8rem',color:'var(--sub)',margin:0}}>
 {linkedParent ? `Linked to: ${linkedParent.name}` : 'Link your parent to share your progress'}
 </p>
 </div>
 {linkedParent
 ? <button onClick={unlinkParent}
 style={{padding:'7px 16px',borderRadius:'10px',border:'1px solid rgba(239,68,68,0.3)',
 background:'rgba(239,68,68,0.08)',color:'#f87171',fontWeight:600,fontSize:'.8rem',cursor:'pointer'}}>
 Unlink
 </button>
 : <button onClick={()=>setShowLink(v=>!v)}
 style={{padding:'7px 16px',borderRadius:'10px',border:'1px solid rgba(99,102,241,0.3)',
 background:'rgba(99,102,241,0.08)',color:'#a5b4fc',fontWeight:600,fontSize:'.8rem',cursor:'pointer'}}>
 {showLink?'Cancel':'Link Parent'}
 </button>
 }
 </div>
 {showLink&&(
 <div style={{marginTop:'14px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
 <input value={nationalId} onChange={e=>setNationalId(e.target.value)}
 placeholder="Enter parent's National ID"
 style={{flex:1,minWidth:'0',width:'100%',padding:'9px 14px',borderRadius:'10px',
 border:'1px solid var(--border-hover)',background:'var(--input-bg)',color:'var(--text)',fontSize:'.875rem',outline:'none'}}/>
 <button onClick={linkParent} disabled={linking}
 style={{padding:'9px 18px',borderRadius:'10px',border:'none',
 background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',
 fontWeight:700,fontSize:'.875rem',cursor:linking?'wait':'pointer'}}>
 {linking?'Linking...':'Confirm'}
 </button>
 </div>
 )}
 </div>

 {/* Invite Card */}
 <InviteCard />

 {/* Latest videos */}
 {videos.length>0&&(
 <div>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
 <p style={{fontSize:'1rem',fontWeight:700,color:'var(--text)',margin:0}}>Latest Videos</p>
 <Link to="/student/videos" style={{fontSize:'.8rem',color:'#818cf8',textDecoration:'none'}}>See all</Link>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,220px),1fr))',gap:'12px'}}>
 {videos.map(v=>(
 <div key={v.id} style={{...card,padding:'0',overflow:'hidden'}}>
 {v.thumbnail_url
 ? <img src={v.thumbnail_url} alt={v.title} loading="lazy"
 style={{width:'100%',height:'120px',objectFit:'cover'}}/>
 : <div style={{width:'100%',height:'120px',display:'flex',alignItems:'center',
 justifyContent:'center',
 background:'var(--surface-hover)'}}></div>
 }
 <div style={{padding:'12px'}}>
 <p style={{fontSize:'.875rem',fontWeight:600,color:'var(--text)',margin:'0 0 3px',
 overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.title}</p>
 <p style={{fontSize:'.75rem',color:'var(--sub)',margin:0}}>{v.subject} . Grade {v.grade}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )
}
