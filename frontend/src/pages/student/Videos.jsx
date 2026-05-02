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
 const [active, setActive] = useState(null)
 const [search, setSearch] = useState('')
 const [subject, setSubject] = useState('')

 useEffect(() => {
 const params = new URLSearchParams()
 if (grade) params.set('grade', grade)
 if (subject) params.set('subject', subject)
 api.get('/videos?' + params.toString())
 .then(r => setVideos(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [grade, subject])

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

 const filtered = videos.filter(v =>
 !search || v.title?.toLowerCase().includes(search.toLowerCase())
 )

 const card = { background:'#161b27', border:'1px solid #1f2937', borderRadius:'16px', overflow:'hidden' }
 const inputStyle = { background:'#111827', border:'1px solid #1f2937', borderRadius:'8px', color:'#f9fafb', padding:'8px 12px', fontSize:'.85rem', outline:'none', flex:1 }

 if (loading) return <Spinner />

 return (
 <div>
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#f9fafb', margin:'0 0 4px', letterSpacing:'-0.4px' }}>Videos</h1>
 <p style={{ fontSize:'.875rem', color:'#6b7280', margin:0 }}>
 {grade ? `Grade ${grade} ` : ''}{filtered.length} video{filtered.length !== 1 ? 's' : ''}
 </p>
 </div>

 {active && (
 <div
 onClick={() => setActive(null)}
 style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
 >
 <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:'860px', background:'#0f1421', borderRadius:'16px', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,.6)' }}>
 <video
 src={videoUrl(active.url)}
 controls
 autoPlay
 crossOrigin="anonymous"
 style={{ width:'100%', maxHeight:'500px', background:'#000', display:'block' }}
 />
 <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
 <div>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 3px', fontSize:'1rem' }}>{active.title}</p>
 <p style={{ color:'#6b7280', fontSize:'.78rem', margin:0 }}>{active.subject} Grade {active.grade} {active.teacher_name || 'Teacher'}</p>
 </div>
 <div style={{ display:'flex', gap:'8px' }}>
 
 <a
 href={videoUrl(active.url)}
 download
 style={{ background:'#6366f1', color:'#fff', padding:'7px 16px', borderRadius:'8px', textDecoration:'none', fontSize:'.82rem', fontWeight:600 }}
 >
 Download
 </a>
 <button
 onClick={() => setActive(null)}
 style={{ background:'#1f2937', color:'#9ca3af', border:'none', borderRadius:'8px', padding:'7px 14px', cursor:'pointer', fontSize:'.82rem' }}
 >
 Close
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'20px' }}>
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
 <p style={{ color:'#6b7280', margin:0 }}>No videos found for your grade yet.</p>
 </div>
 ) : (
 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
 {filtered.map(v => (
 <div key={v.id} style={{ ...card, cursor:'pointer' }} onClick={() => openVideo(v)}>
 <div style={{ position:'relative', background:'#0f1421', height:'170px', display:'flex', alignItems:'center', justifyContent:'center' }}>
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
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 4px', fontSize:'.92rem', lineHeight:1.3 }}>{v.title}</p>
 <p style={{ color:'#6b7280', fontSize:'.75rem', margin:'0 0 12px' }}>
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
 </div>
 )
}
