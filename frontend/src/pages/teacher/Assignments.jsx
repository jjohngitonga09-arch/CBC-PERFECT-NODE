import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px'}

export default function TeacherAssignments() {
 const userId = useAuthStore(s => s.userId)
 const [assignments, setAssignments] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get(`/assignments/teacher/${userId}`)
 .then(r => setAssignments(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 async function del(id) {
 if (!confirm('Delete this assignment?')) return
 try {
 await api.delete(`/assignments/${id}`)
 setAssignments(p => p.filter(a => a.id !== id))
 toast.success('Deleted.')
 } catch { toast.error('Failed to delete') }
 }

 if (loading) return <Spinner />

 const statusStyle = s => s === 'graded' ? {bg:'rgba(16,185,129,0.15)',fg:'#34d399'} : {bg:'rgba(99,102,241,0.15)',fg:'#a5b4fc'}

 return (
 <div>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',gap:'12px',flexWrap:'wrap'}}>
 <div>
 <h1 style={{fontSize:'1.7rem',fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.4px'}}>Assignments</h1>
 <p style={{fontSize:'.875rem',color:'var(--sub)',margin:0}}>{assignments.length} total</p>
 </div>
 <Link to="/teacher/create-card" style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',padding:'10px 18px',borderRadius:'12px',textDecoration:'none',fontSize:'.875rem',fontWeight:700}}>
 + New Assignment
 </Link>
 </div>

 {assignments.length === 0 ? (
 <div style={{...card,textAlign:'center',padding:'56px 20px'}}>
 <p style={{fontSize:'3rem',margin:'0 0 12px'}}></p>
 <p style={{fontWeight:700,color:'var(--text)',margin:'0 0 8px'}}>No assignments yet</p>
 <p style={{color:'var(--sub)',fontSize:'.875rem',margin:'0 0 20px'}}>Create your first assignment to get started.</p>
 <Link to="/teacher/create-card" style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)',color:'#fff',padding:'10px 20px',borderRadius:'12px',textDecoration:'none',fontWeight:700,fontSize:'.875rem'}}>
 Create Assignment
 </Link>
 </div>
 ) : (
 <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
 {assignments.map(a => {
 const sc = statusStyle(a.status)
 return (
 <div key={a.id} style={{...card,display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap',padding:'14px 18px'}}>
 <div style={{flex:1,minWidth:'150px'}}>
 <p style={{fontWeight:600,color:'var(--text)',margin:'0 0 3px'}}>{a.title}</p>
 <p style={{fontSize:'.75rem',color:'var(--sub)',margin:0}}>
 {a.assigned_count || 0} student{a.assigned_count !== 1 ? 's' : ''} {a.submission_count || 0} submissions Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : ''}
 </p>
 </div>
 <div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}>
 <span style={{fontSize:'.7rem',fontWeight:700,padding:'3px 9px',borderRadius:'20px',background:sc.bg,color:sc.fg,textTransform:'capitalize'}}>
 {a.status || 'active'}
 </span>
 <button onClick={() => del(a.id)}
 style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171',borderRadius:'8px',padding:'5px 10px',fontSize:'.75rem',fontWeight:600,cursor:'pointer'}}>
 Delete
 </button>
 </div>
 </div>
 )
 })}
 </div>
 )}
 </div>
 )
}
