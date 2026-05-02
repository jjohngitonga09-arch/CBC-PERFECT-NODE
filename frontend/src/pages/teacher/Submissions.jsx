import { useEffect, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const card = { background: '#161b27', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }

const FILE_ICONS = {
 pdf: '', doc: '', docx: '', txt: '', default: ''
}
function fileIcon(name = '') {
 const ext = name.split('.').pop()?.toLowerCase()
 return FILE_ICONS[ext] || FILE_ICONS.default
}

function StarPicker({ onGrade }) {
 const [hovered, setHovered] = useState(0)
 return (
 <div style={{ display: 'flex', gap: '4px' }}>
 {[1, 2, 3, 4, 5].map(n => (
 <button
 key={n}
 onMouseEnter={() => setHovered(n)}
 onMouseLeave={() => setHovered(0)}
 onClick={() => onGrade(n)}
 style={{
 background: n <= hovered ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.1)',
 border: '1px solid rgba(245,158,11,0.35)',
 color: '#fbbf24', borderRadius: '8px', padding: '5px 9px',
 cursor: 'pointer', fontWeight: 700, fontSize: '.85rem', transition: 'background .15s'
 }}
 >
 {n}
 </button>
 ))}
 </div>
 )
}

function FilePreviewModal({ file, onClose }) {
 if (!file) return null
 const ext = (file.file_name || '').split('.').pop()?.toLowerCase()
 const url = file.file_url?.startsWith('http') ? file.file_url : `${import.meta.env.VITE_API_URL || ''}${file.file_url}`

 return (
 <div
 onClick={onClose}
 style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
 >
 <div
 onClick={e => e.stopPropagation()}
 style={{ background: '#161b27', border: '1px solid #1f2937', borderRadius: '18px', width: '100%', maxWidth: '760px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1f2937' }}>
 <p style={{ color: '#f9fafb', fontWeight: 600, margin: 0, fontSize: '.9rem' }}>{file.file_name}</p>
 <div style={{ display: 'flex', gap: '8px' }}>
 <a
 href={url}
 download={file.file_name}
 style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', borderRadius: '8px', padding: '5px 12px', fontSize: '.78rem', fontWeight: 600, textDecoration: 'none' }}
 >
 Download
 </a>
 <button
 onClick={onClose}
 style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#9ca3af', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '.85rem' }}
 ></button>
 </div>
 </div>
 <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
 {ext === 'pdf' ? (
 <iframe src={url} title="PDF Preview" style={{ width: '100%', height: '60vh', border: 'none', display: 'block' }} />
 ) : ext === 'txt' ? (
 <pre style={{ color: '#d1d5db', padding: '20px', fontFamily: 'monospace', fontSize: '.85rem', whiteSpace: 'pre-wrap', margin: 0 }}>
 {file.text_content || 'Loading'}
 </pre>
 ) : (
 <div style={{ textAlign: 'center', padding: '48px 20px' }}>
 <p style={{ fontSize: '3rem', margin: '0 0 12px' }}>{fileIcon(file.file_name)}</p>
 <p style={{ color: '#f9fafb', fontWeight: 600, margin: '0 0 6px' }}>{file.file_name}</p>
 <p style={{ color: '#6b7280', fontSize: '.85rem', margin: '0 0 20px' }}>Preview not available for this file type.</p>
 <a
 href={url}
 download={file.file_name}
 style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, textDecoration: 'none', fontSize: '.875rem' }}
 >
 Download to View
 </a>
 </div>
 )}
 </div>
 </div>
 </div>
 )
}

export default function TeacherSubmissions() {
 const userId = useAuthStore(s => s.userId)
 const [subs, setSubs] = useState([])
 const [loading, setLoading] = useState(true)
 const [grading, setGrading] = useState({})
 const [preview, setPreview] = useState(null)
 const [feedback, setFeedback] = useState({})

 useEffect(() => {
 api.get(`/assignments/teacher/${userId}/submissions`)
 .then(r => setSubs(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [userId])

 async function grade(subId, stars) {
 try {
 const fb = feedback[subId] || ''
 await api.patch(`/submissions/${subId}`, { stars, status: 'graded', feedback: fb })
 setSubs(p => p.map(s => s.id === subId ? { ...s, stars, status: 'graded', feedback: fb } : s))
 setGrading(p => ({ ...p, [subId]: false }))
 toast.success('Marked ')
 } catch { toast.error('Failed to save grade') }
 }

 if (loading) return <Spinner />

 const pending = subs.filter(s => s.status !== 'graded')
 const graded = subs.filter(s => s.status === 'graded')

 function SubCard({ s }) {
 const hasFile = s.file_url || s.file_name
 return (
 <div style={{ ...card, padding: '16px 18px', marginBottom: '10px' }}>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
 <div style={{ flex: 1, minWidth: '140px' }}>
 <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 3px', fontSize: '.95rem' }}>{s.assignment_title || 'Assignment'}</p>
 <p style={{ fontSize: '.75rem', color: '#6b7280', margin: 0 }}>
 {s.student_name || s.student_id?.slice(0, 10)} {new Date(s.created_at || s.submitted_at || Date.now()).toLocaleDateString()}
 </p>
 </div>
 {s.status === 'graded' ? (
 <div style={{ textAlign: 'right' }}>
 <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>{''.repeat(+s.stars || 0)}{''.repeat(5 - (+s.stars || 0))}</span>
 <p style={{ color: '#34d399', fontSize: '.72rem', margin: '2px 0 0', fontWeight: 600 }}>Marked</p>
 </div>
 ) : grading[s.id] ? (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
 <StarPicker onGrade={n => grade(s.id, n)} />
 <input
 placeholder="Optional feedback"
 value={feedback[s.id] || ''}
 onChange={e => setFeedback(p => ({ ...p, [s.id]: e.target.value }))}
 style={{ background: '#0f1421', border: '1px solid #374151', color: '#d1d5db', borderRadius: '8px', padding: '6px 10px', fontSize: '.78rem', width: '220px' }}
 />
 </div>
 ) : (
 <button
 onClick={() => setGrading(p => ({ ...p, [s.id]: true }))}
 style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '.78rem', flexShrink: 0 }}
 >
 Mark
 </button>
 )}
 </div>

 {/* Text answer */}
 {s.answer && (
 <p style={{ fontSize: '.82rem', color: '#9ca3af', margin: '0 0 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px', lineHeight: 1.55 }}>
 {s.answer}
 </p>
 )}

 {/* File attachment */}
 {hasFile && (
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '10px 14px' }}>
 <span style={{ fontSize: '1.4rem' }}>{fileIcon(s.file_name)}</span>
 <div style={{ flex: 1, minWidth: 0 }}>
 <p style={{ color: '#a5b4fc', fontWeight: 600, margin: 0, fontSize: '.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.file_name || 'Attachment'}</p>
 {s.file_size && <p style={{ color: '#6b7280', fontSize: '.72rem', margin: 0 }}>{(s.file_size / 1024).toFixed(0)} KB</p>}
 </div>
 <button
 onClick={() => setPreview(s)}
 style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, flexShrink: 0 }}
 >
 View
 </button>
 </div>
 )}

 {/* Feedback shown after graded */}
 {s.status === 'graded' && s.feedback && (
 <p style={{ fontSize: '.78rem', color: '#6b7280', margin: '8px 0 0', fontStyle: 'italic' }}>Feedback: {s.feedback}</p>
 )}
 </div>
 )
 }

 return (
 <div>
 <div style={{ marginBottom: '24px' }}>
 <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f9fafb', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Submissions</h1>
 <p style={{ fontSize: '.875rem', color: '#6b7280', margin: 0 }}>{pending.length} pending {graded.length} marked</p>
 </div>

 {subs.length === 0 ? (
 <div style={{ ...card, textAlign: 'center', padding: '56px 20px' }}>
 <p style={{ fontSize: '3rem', margin: '0 0 12px' }}></p>
 <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 6px' }}>No submissions yet</p>
 <p style={{ color: '#6b7280', fontSize: '.875rem', margin: 0 }}>Student submissions will appear here once they submit work.</p>
 </div>
 ) : (
 <>
 {pending.length > 0 && (
 <div style={{ marginBottom: '24px' }}>
 <p style={{ fontWeight: 700, color: '#fbbf24', margin: '0 0 10px', fontSize: '.95rem' }}> Pending ({pending.length})</p>
 {pending.map(s => <SubCard key={s.id} s={s} />)}
 </div>
 )}
 {graded.length > 0 && (
 <div>
 <p style={{ fontWeight: 700, color: '#34d399', margin: '0 0 10px', fontSize: '.95rem' }}> Marked ({graded.length})</p>
 {graded.map(s => <SubCard key={s.id} s={s} />)}
 </div>
 )}
 </>
 )}

 {preview && <FilePreviewModal file={preview} onClose={() => setPreview(null)} />}
 </div>
 )
}