import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function videoUrl(url) {
 if (!url) return ''
 if (url.startsWith('http')) return url
 return API_BASE + url
}

export default function StudentVideos() {
 const grade = useAuthStore(s => s.grade) || useAuthStore(s => s.user)?.grade
 const [videos, setVideos] = useState([])
 const [loading, setLoading] = useState(true)
 const [loadingMore, setLoadingMore] = useState(false)
 const [active, setActive] = useState(null)
 const [autoAdv, setAutoAdv] = useState(false)
 const [search, setSearch] = useState('')
 const [subject, setSubject] = useState('')
 const [page, setPage] = useState(1)
 const [hasMore, setHasMore] = useState(false)
 const [total, setTotal] = useState(0)
 const LIMIT = 12

 const fetchVideos = (pg=1, replace=true, q=search) => {
   if (pg===1) setLoading(true); else setLoadingMore(true)
   const params = new URLSearchParams()
   const gradeNum = grade ? grade.replace(/^Grade\s*/i, '') : ''
   if (gradeNum) params.set('grade', gradeNum)
   if (subject) params.set('subject', subject)
   if (q)       params.set('search', q)
   params.set('limit', LIMIT)
   params.set('page', pg)
   api.get('/videos?' + params.toString())
     .then(r => {
       const data = r.data
       const rows = data.videos || []
       setTotal(data.total || 0)
       setHasMore(pg < (data.pages || 1))
       setVideos(prev => replace ? rows : [...prev, ...rows])
       setPage(pg)
     })
     .catch(() => {})
     .finally(() => { setLoading(false); setLoadingMore(false) })
 }

 useEffect(() => {
   const timer = setTimeout(() => fetchVideos(1, true, search), 350)
   return () => clearTimeout(timer)
 }, [search])
 useEffect(() => { fetchVideos(1, true) }, [subject])

 async function downloadVideo(url, title) {
 try {
 const res = await fetch(url)
 const blob = await res.blob()
 const a = document.createElement('a')
 a.href = URL.createObjectURL(blob)
 a.download = (title || 'video') + '.mp4'
 a.click()
 URL.revokeObjectURL(a.href)
 } catch(e) { window.open(url, '_blank') }
 }

 function openVideo(v) {
 setActive(v)
 api.post(`/videos/${v.id}/view`).then(() => { setVideos(prev => prev.map(x => x.id === v.id ? { ...x, view_count: Number(x.view_count||0)+1 } : x)) }).catch(() => {})
 }

 const filtered = videos
 const activeIdx = active ? filtered.findIndex(v => v.id === active.id) : -1

 const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden' }
 const inputStyle = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', padding:'8px 12px', fontSize:'.85rem', outline:'none', flex:1 }

 if (loading) return <Spinner />

 return (
 <div>
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px', letterSpacing:'-0.4px' }}>Videos</h1>
 <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>
 {grade ? `${grade} � ` : ''}{total} video{total !== 1 ? 's' : ''} total
 </p>
 </div>

 {active && (
 <div
 onClick={() => setActive(null)}
 style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
 >
 <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:'860px', background:'var(--bg)', borderRadius:'16px', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,.6)' }}>
 <video
 src={videoUrl(active.url)}
 controls
 autoPlay
 crossOrigin="anonymous"
 style={{ width:'100%', maxHeight:'70vh', background:'#000', display:'block' }}
 onEnded={() => { if (autoAdv && activeIdx < filtered.length - 1) setActive(filtered[activeIdx + 1]) }}
 />
 <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
 <div>
 <p style={{ fontWeight:700, color:'var(--text)', margin:'0 0 3px', fontSize:'1rem' }}>{active.title}</p>
 <p style={{ color:'var(--sub)', fontSize:'.78rem', margin:0 }}>{active.subject} Grade {active.grade} {active.teacher_name || 'Teacher'}</p>
 </div>
 <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
 <span style={{ color:'var(--sub)', fontSize:'.75rem' }}>{activeIdx + 1}/{filtered.length}</span>
 <button
 onClick={() => activeIdx > 0 && setActive(filtered[activeIdx - 1])}
 disabled={activeIdx <= 0}
 style={{ background: activeIdx > 0 ? 'var(--surface-hover)' : 'var(--surface)', color: activeIdx > 0 ? 'var(--text)' : 'var(--sub)', border:'none', borderRadius:'8px', padding:'7px 14px', cursor: activeIdx > 0 ? 'pointer' : 'default', fontSize:'.82rem', fontWeight:600 }}
 >&#8592; Prev</button>
 <button
 onClick={() => activeIdx < filtered.length - 1 && setActive(filtered[activeIdx + 1])}
 disabled={activeIdx >= filtered.length - 1}
 style={{ background: activeIdx < filtered.length - 1 ? '#6366f1' : 'var(--surface)', color: activeIdx < filtered.length - 1 ? '#fff' : 'var(--sub)', border:'none', borderRadius:'8px', padding:'7px 14px', cursor: activeIdx < filtered.length - 1 ? 'pointer' : 'default', fontSize:'.82rem', fontWeight:700 }}
 >Next &#8594;</button>
 <button
 onClick={() => setAutoAdv(a => !a)}
 style={{ background: autoAdv ? 'rgba(16,185,129,0.15)' : 'var(--surface-hover)', color: autoAdv ? '#34d399' : 'var(--sub)', border: autoAdv ? '1px solid rgba(16,185,129,0.35)' : 'none', borderRadius:'8px', padding:'7px 14px', cursor:'pointer', fontSize:'.82rem', fontWeight:600 }}
 >{autoAdv ? 'Auto: ON' : 'Auto: OFF'}</button>
 <a
 href={videoUrl(active.url)}
 download
 style={{ background:'var(--surface-hover)', color:'var(--sub)', padding:'7px 16px', borderRadius:'8px', textDecoration:'none', fontSize:'.82rem', fontWeight:600 }}
 >Download</a>
 <button
 onClick={() => setActive(null)}
 style={{ background:'var(--surface-hover)', color:'var(--sub)', border:'none', borderRadius:'8px', padding:'7px 14px', cursor:'pointer', fontSize:'.82rem' }}
 >Close</button>
 </div>
 </div>
 </div>
 </div>
 )}

 <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px', alignItems:'stretch' }}>
 <input
 style={inputStyle}
 placeholder="Search videos..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 />
 <select
 style={{ ...inputStyle, flex:'0 0 auto' }}
 value={subject}
 onChange={e => setSubject(e.target.value)}
 >
 <option value="">All Subjects</option>
 {['English','Kiswahili','Mathematics','Science'].map(s =>
 <option key={s}>{s}</option>
 )}
 </select>
 </div>

 {filtered.length === 0 ? (
 <div style={{ ...card, padding:'48px', textAlign:'center' }}>
 <p style={{ color:'var(--sub)', margin:0 }}>No videos found for your grade yet.</p>
 </div>
 ) : (
 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap:'16px' }}>
 {filtered.map(v => (
 <div key={v.id} style={{ ...card, cursor:'pointer' }} onClick={() => openVideo(v)}>
 <div style={{ position:'relative', background:'var(--bg)', height:'170px', display:'flex', alignItems:'center', justifyContent:'center' }}>
 {v.thumbnail_url
 ? <img src={videoUrl(v.thumbnail_url)} alt={v.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
 : <span style={{ fontSize:'3.5rem' }}>Video</span>
 }
 <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.3)', opacity:0, transition:'opacity .2s' }}
 onMouseEnter={e => e.currentTarget.style.opacity=1}
 onMouseLeave={e => e.currentTarget.style.opacity=0}
 >
 <div style={{ background:'rgba(99,102,241,.9)', borderRadius:'50%', width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center' }}>
 <span style={{ color:'#fff', fontSize:'1.4rem', marginLeft:'4px' }}></span>
 </div>
 </div>
 </div>
 <div style={{ padding:'14px 16px' }}>
 <p style={{ fontWeight:700, color:'var(--text)', margin:'0 0 4px', fontSize:'.92rem', lineHeight:1.3 }}>{v.title}</p>
 <p style={{ color:'var(--sub)', fontSize:'.75rem', margin:'0 0 12px' }}>
 {v.subject} Grade {v.grade} {v.view_count || 0} views
 </p>
 <div style={{ display:'flex', gap:'8px' }}>
 <button
 onClick={e => { e.stopPropagation(); openVideo(v) }}
 style={{ flex:1, background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', padding:'7px', fontWeight:600, cursor:'pointer', fontSize:'.8rem' }}
 >
 Watch
 </button>
 
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 {hasMore && (
   <div style={{ textAlign:'center', marginTop:'24px' }}>
     <button
       onClick={() => fetchVideos(page + 1, false)}
       disabled={loadingMore}
       style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:'10px',
         padding:'10px 32px', fontWeight:700, fontSize:'.9rem',
         cursor: loadingMore ? 'wait' : 'pointer', opacity: loadingMore ? 0.7 : 1 }}
     >
       {loadingMore ? 'Loading...' : 'Load More'}
     </button>
   </div>
 )}
 </div>
 )
}
