import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = { background: '#161b27', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }
const ALLOWED_EXT = ['.pdf', '.doc', '.docx', '.txt']
const ALLOWED_TYPES = [
 'application/pdf', 'application/msword',
 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'text/plain',
]
const FILE_ICONS = { pdf: '=', doc: '=', docx: '=', txt: '=' }
function fIcon(name = '') { const e = name.split('.').pop()?.toLowerCase(); return FILE_ICONS[e] || '=' }

function SubmitModal({ assignment, onClose, onSubmitted }) {
 const userId = useAuthStore(s => s.userId)
 const fileRef = useRef()
 const [mode, setMode] = useState('text') // 'text' | 'file'
 const [text, setText] = useState('')
 const [file, setFile] = useState(null)
 const [loading, setLoading] = useState(false)

 function pickFile(e) {
 const f = e.target.files[0]
 if (!f) return
 const ext = '.' + f.name.split('.').pop().toLowerCase()
 if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXT.includes(ext)) {
 toast.error('Only PDF, DOC, DOCX, TXT allowed'); return
 }
 if (f.size > 10 * 1024 * 1024) { toast.error('Max 10 MB'); return }
 setFile(f)
 }

 async function submit() {
 if (mode === 'text' && !text.trim()) return toast.error('Write your answer first')
 if (mode === 'file' && !file) return toast.error('Attach a file first')
 setLoading(true)
 try {
 if (mode === 'file') {
 const fd = new FormData()
 fd.append('file', file)
 fd.append('assignment_id', assignment.id)
 fd.append('student_id', userId)
 await api.post('/submissions', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
 } else {
 await api.post('/submissions', { assignment_id: assignment.id, student_id: userId, answer: text })
 }
 toast.success('Submitted! ')
 onSubmitted(assignment.id)
 onClose()
 } catch (err) {
 toast.error(err.response?.data?.error || 'Failed to submit')
 } finally { setLoading(false) }
 }

 return (
 <div
 onClick={onClose}
 style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
 >
 <div
 onClick={e => e.stopPropagation()}
 style={{ background: '#161b27', border: '1px solid #1f2937', borderRadius: '18px', width: '100%', maxWidth: '520px', padding: '24px' }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
 <h2 style={{ color: '#f9fafb', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Submit: {assignment.title}</h2>
 <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.2rem' }}></button>
 </div>

 {assignment.model_text && (
 <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
 <p style={{ color: '#a5b4fc', fontWeight: 600, fontSize: '.75rem', margin: '0 0 6px' }}>ASSIGNMENT</p>
 <p style={{ color: '#d1d5db', fontSize: '.85rem', margin: 0, lineHeight: 1.55 }}>{assignment.model_text || assignment.objective}</p>
 </div>
 )}

 {/* Mode toggle */}
 <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', background: '#0f1421', borderRadius: '10px', padding: '4px' }}>
 {[['text', ' Write Answer'], ['file', '= Attach File']].map(([val, label]) => (
 <button
 key={val}
 onClick={() => setMode(val)}
 style={{
 flex: 1, padding: '7px', borderRadius: '7px', border: 'none', fontWeight: 700,
 fontSize: '.8rem', cursor: 'pointer',
 background: mode === val ? '#6366f1' : 'transparent',
 color: mode === val ? '#fff' : '#6b7280',
 }}
 >{label}</button>
 ))}
 </div>

 {mode === 'text' ? (
 <textarea
 value={text}
 onChange={e => setText(e.target.value)}
 placeholder="Type your answer here&"
 rows={5}
 style={{ width: '100%', background: '#0f1421', border: '1px solid #374151', color: '#f9fafb', borderRadius: '10px', padding: '12px', fontSize: '.875rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none', marginBottom: '14px' }}
 />
 ) : (
 <div style={{ marginBottom: '14px' }}>
 {!file ? (
 <div
 onClick={() => fileRef.current?.click()}
 style={{ border: '2px dashed #374151', borderRadius: '12px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer' }}
 >
 <p style={{ fontSize: '2rem', margin: '0 0 6px' }}>=</p>
 <p style={{ color: '#f9fafb', fontWeight: 600, fontSize: '.875rem', margin: '0 0 4px' }}>Click to choose file</p>
 <p style={{ color: '#6b7280', fontSize: '.78rem', margin: 0 }}>PDF, DOC, DOCX, TXT Max 10 MB</p>
 </div>
 ) : (
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', padding: '12px 14px' }}>
 <span style={{ fontSize: '1.5rem' }}>{fIcon(file.name)}</span>
 <div style={{ flex: 1 }}>
 <p style={{ color: '#a5b4fc', fontWeight: 600, margin: 0, fontSize: '.82rem' }}>{file.name}</p>
 <p style={{ color: '#6b7280', fontSize: '.72rem', margin: 0 }}>{(file.size / 1024).toFixed(0)} KB</p>
 </div>
 <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}></button>
 </div>
 )}
 <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={pickFile} />
 </div>
 )}

 <button
 onClick={submit}
 disabled={loading}
 style={{ width: '100%', background: loading ? '#1f2937' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color: loading ? '#6b7280' : '#fff', border: 'none', borderRadius: '10px', padding: '11px', fontWeight: 700, fontSize: '.875rem', cursor: loading ? 'default' : 'pointer' }}
 >
 {loading ? 'Submitting&' : 'Submit Assignment'}
 </button>
 </div>
 </div>
 )
}

export default function StudentAssignments() {
 const userId = useAuthStore(s => s.userId)
 const [assignments, setAssignments] = useState([])
 const [loading, setLoading] = useState(true)
 const [submitting, setSubmitting] = useState(null) // assignment being submitted
 const [submitted, setSubmitted] = useState(new Set())

 useEffect(() => {
 api.get(`/assignments/student/${userId}`)
 .then(r => {
 const data = Array.isArray(r.data) ? r.data : []
 setAssignments(data)
 setSubmitted(new Set(data.filter(a => a.submitted).map(a => a.id)))
 })
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 function markSubmitted(id) {
 setSubmitted(p => new Set([...p, id]))
 }

 if (loading) return <Spinner />

 const pending = assignments.filter(a => !submitted.has(a.id))
 const done = assignments.filter(a => submitted.has(a.id))

 function AssignCard({ a }) {
 const isSubmitted = submitted.has(a.id)
 const hasFile = a.file_url || a.file_name
 return (
 <div style={{ ...card, marginBottom: '10px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
 <div style={{ flex: 1, minWidth: '140px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
 <span style={{ fontSize: '1.2rem' }}>{hasFile ? fIcon(a.file_name) : '='}</span>
 <p style={{ fontWeight: 700, color: '#f9fafb', margin: 0, fontSize: '.95rem' }}>{a.title}</p>
 </div>
 <p style={{ fontSize: '.75rem', color: '#6b7280', margin: '0 0 4px' }}>
 Grade {a.grade} {a.subject}
 {a.due_date ? ` Due ${new Date(a.due_date).toLocaleDateString()}` : ''}
 </p>
 {a.objective && <p style={{ fontSize: '.82rem', color: '#9ca3af', margin: 0 }}>{a.objective}</p>}
 </div>
 {isSubmitted ? (
 <span style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', borderRadius: '20px', padding: '4px 12px', fontSize: '.75rem', fontWeight: 700, flexShrink: 0 }}>
  Submitted
 </span>
 ) : (
 <button
 onClick={() => setSubmitting(a)}
 style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '.82rem', flexShrink: 0 }}
 >
 Submit
 </button>
 )}
 </div>

 {/* Teacher file attachment */}
 {hasFile && (
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
 <span style={{ fontSize: '1.1rem' }}>{fIcon(a.file_name)}</span>
 <p style={{ color: '#fbbf24', fontSize: '.78rem', fontWeight: 600, margin: 0, flex: 1 }}>Attached: {a.file_name}</p>
 <a
 href={`${import.meta.env.VITE_API_URL || ''}${a.file_url}`}
 download={a.file_name}
 style={{ color: '#fbbf24', fontSize: '.72rem', fontWeight: 700, textDecoration: 'none' }}
 > Download</a>
 </div>
 )}

 {/* Grade received */}
 {a.stars && (
 <p style={{ marginTop: '8px', color: '#f59e0b', fontWeight: 700, margin: '10px 0 0', fontSize: '.9rem' }}>
 Grade: {''.repeat(+a.stars)}{''.repeat(5 - +a.stars)}
 {a.feedback && <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '.78rem', marginLeft: '8px' }}>"{a.feedback}"</span>}
 </p>
 )}
 </div>
 )
 }

 return (
 <div>
 <div style={{ marginBottom: '24px' }}>
 <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f9fafb', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Assignments</h1>
 <p style={{ fontSize: '.875rem', color: '#6b7280', margin: 0 }}>{pending.length} pending {done.length} submitted</p>
 </div>

 {assignments.length === 0 ? (
 <div style={{ ...card, textAlign: 'center', padding: '56px 20px' }}>
 <p style={{ fontSize: '3rem', margin: '0 0 12px' }}>=</p>
 <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 6px' }}>No assignments yet</p>
 <p style={{ color: '#6b7280', fontSize: '.875rem', margin: 0 }}>Your teacher hasn't sent any assignments yet.</p>
 </div>
 ) : (
 <>
 {pending.length > 0 && (
 <div style={{ marginBottom: '24px' }}>
 <p style={{ fontWeight: 700, color: '#fbbf24', margin: '0 0 10px', fontSize: '.9rem' }}> Pending ({pending.length})</p>
 {pending.map(a => <AssignCard key={a.id} a={a} />)}
 </div>
 )}
 {done.length > 0 && (
 <div>
 <p style={{ fontWeight: 700, color: '#34d399', margin: '0 0 10px', fontSize: '.9rem' }}> Submitted ({done.length})</p>
 {done.map(a => <AssignCard key={a.id} a={a} />)}
 </div>
 )}
 </>
 )}

 {submitting && (
 <SubmitModal
 assignment={submitting}
 onClose={() => setSubmitting(null)}
 onSubmitted={markSubmitted}
 />
 )}
 </div>
 )
}