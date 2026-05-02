import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'

const card = {background:'#161b27',border:'1px solid #1f2937',borderRadius:'16px',padding:'20px'}

export default function StudentQuizzes() {
 const userId = useAuthStore(s => s.userId)
 const [quizzes, setQuizzes] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get(`/quizzes?studentId=${userId}`)
 .then(r => setQuizzes(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 if (loading) return <Spinner />

 return (
 <div>
 <div style={{marginBottom:'24px'}}>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'#f9fafb',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Quizzes</h1>
 <p style={{fontSize:'.875rem',color:'#6b7280',margin:0}}>{quizzes.length} available</p>
 </div>

 {quizzes.length === 0 ? (
 <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
 <p style={{fontSize:'3rem',margin:'0 0 12px'}}>=</p>
 <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>No quizzes yet</p>
 <p style={{color:'#6b7280',fontSize:'.875rem',margin:0}}>Your teacher will assign quizzes here.</p>
 </div>
 ) : (
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'12px'}}>
 {quizzes.map(q => (
 <div key={q.id} style={card}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
 <span style={{fontSize:'1.8rem'}}>{q.icon || '='}</span>
 {q.score != null && (
 <span style={{fontSize:'.75rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',background:'rgba(16,185,129,0.15)',color:'#34d399'}}>{q.score}%</span>
 )}
 </div>
 <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 4px'}}>{q.title}</p>
 <p style={{fontSize:'.8rem',color:'#6b7280',margin:'0 0 14px'}}>{q.question_count || '?'} questions {q.subject || 'General'}</p>
 <button style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',border:'none',borderRadius:'10px',padding:'9px',fontWeight:700,fontSize:'.875rem',cursor:'pointer'}}>
 {q.attempts > 0 ? 'Retry Quiz' : 'Start Quiz'}
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}
