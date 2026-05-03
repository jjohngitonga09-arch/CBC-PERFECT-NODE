import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'

const ALLOWED_TYPES = [
 'application/pdf',
 'application/msword',
 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'text/plain',
]
const ALLOWED_EXT = ['.pdf', '.doc', '.docx', '.txt']
const MAX_FILE_MB = 10

const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }

const FILE_ICONS = { pdf: '', doc: '', docx: '', txt: '' }
function fIcon(name = '') {
 const ext = name.split('.').pop()?.toLowerCase()
 return FILE_ICONS[ext] || ''
}

export default function TeacherCreateCard() {
 const userId = useAuthStore(s => s.userId)
 const fileRef = useRef()

 const [tab, setTab] = useState('text') // 'text' | 'file'
 const [form, setForm] = useState({
 grade: '1', subject: 'English', title: '', objective: '',
 modelText: '', practiceSpec: '', tags: '', dueDate: '',
 })
 const [file, setFile] = useState(null)
 const [students, setStudents] = useState([])
 const [selectedStudents, setSelectedStudents] = useState([])
 const [loading, setLoading] = useState(false)
 const [assignments, setAssignments] = useState([])
 const [loadingList, setLoadingList] = useState(true)

 /* fetch students and existing assignments */
 useEffect(() => {
 api.get('/users?role=student').then(r => setStudents(Array.isArray(r.data) ? r.data : [])).catch(() => {})
 api.get(`/assignments/teacher/${userId}`)
 .then(r => setAssignments(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoadingList(false))
 }, [userId])

 function setF(key) { return e => setForm(f => ({ ...f, [key]: e.target.value })) }

 function pickFile(e) {
 const f = e.target.files[0]
 if (!f) return
 const ext = '.' + f.name.split('.').pop().toLowerCase()
 if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXT.includes(ext)) {
 toast.error('Only PDF, DOC, DOCX, TXT allowed'); return
 }
 if (f.size > MAX_FILE_MB * 1024 * 1024) {
 toast.error(`Max ${MAX_FILE_MB} MB per file`); return
 }
 setFile(f)
 }

 function toggleStudent(id) {
 setSelectedStudents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
 }

 async function handleSubmit() {
 if (!form.title.trim()) return toast.error('Title required')
 if (tab === 'text' && !form.modelText.trim()) return toast.error('Content required')
 if (tab === 'file' && !file) return toast.error('Pick a file to attach')
 setLoading(true)
 try {
 if (tab === 'file') {
 // Send as assignment with file attachment
 const fd = new FormData()
 fd.append('file', file)
 fd.append('title', form.title)
 fd.append('subject', form.subject)
 fd.append('grade', form.grade)
 fd.append('due_date', form.dueDate || '')
 fd.append('tags', form.tags)
 fd.append('assigned_to', JSON.stringify(selectedStudents))
 fd.append('teacher_id', userId)
 const res = await api.post('/assignments', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
 setAssignments(p => [res.data, ...p])
 } else {
 const payload = {
 grade: form.grade, subject: form.subject, title: form.title,
 objective: form.objective, modelText: form.modelText,
 practiceSpec: form.practiceSpec, due_date: form.dueDate || null,
 tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
 assigned_to: selectedStudents, teacher_id: userId,
 }
 const res = await api.post('/assignments', payload)
 setAssignments(p => [res.data, ...p])
 }
 toast.success('Assignment sent to students!')
 setForm({ grade: '1', subject: 'English', title: '', objective: '', modelText: '', practiceSpec: '', tags: '', dueDate: '' })
 setFile(null)
 setSelectedStudents([])
 if (fileRef.current) fileRef.current.value = ''
 } catch (err) {
 toast.error(err.response?.data?.error || 'Failed to send')
 } finally { setLoading(false) }
 }

 async function deleteAssignment(id) {
 if (!window.confirm('Delete assignment?')) return
 try {
 await api.delete(`/assignments/${id}`)
 setAssignments(p => p.filter(a => a.id !== id))
 toast.success('Deleted')
 } catch { toast.error('Delete failed') }
 }

 const wordCount = form.modelText.trim().split(/\s+/).filter(Boolean).length

 return (
 <div>
 <div style={{ marginBottom: '24px' }}>
 <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Create Assignment</h1>
 <p style={{ fontSize: '.875rem', color: 'var(--sub)', margin: 0 }}>Send text or file assignments Students see them in Assignments</p>
 </div>

 <div style={{ ...card, marginBottom: '28px' }}>
 {/* Tab toggle */}
 <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg)', borderRadius: '10px', padding: '4px' }}>
 {[['text', ' Text / Card'], ['file', ' File Upload']].map(([val, label]) => (
 <button
 key={val}
 onClick={() => setTab(val)}
 style={{
 flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 700,
 fontSize: '.82rem', cursor: 'pointer', transition: 'all .15s',
 background: tab === val ? '#6366f1' : 'transparent',
 color: tab === val ? '#fff' : 'var(--sub)',
 }}
 >{label}</button>
 ))}
 </div>

 {/* Common fields */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
 <select style={sel} value={form.grade} onChange={setF('grade')}>
 {['1', '2', '3'].map(g => <option key={g} value={g}>Grade {g}</option>)}
 </select>
 <select style={sel} value={form.subject} onChange={setF('subject')}>
 {['English', 'Kiswahili', 'Mathematics', 'Science'].map(s => <option key={s}>{s}</option>)}
 </select>
 </div>
 <input style={{ ...inp, marginBottom: '10px' }} placeholder="Assignment title" value={form.title} onChange={setF('title')} />
 <input style={{ ...inp, marginBottom: '10px' }} type="date" placeholder="Due date" value={form.dueDate} onChange={setF('dueDate')} />

 {/* Text tab */}
 {tab === 'text' && (
 <>
 <input style={{ ...inp, marginBottom: '10px' }} placeholder="Objective" value={form.objective} onChange={setF('objective')} />
 <textarea
 style={{ ...inp, marginBottom: '4px', resize: 'vertical' }} rows={5}
 placeholder="Content / Model text (max 120 words)"
 value={form.modelText} onChange={setF('modelText')}
 />
 <p style={{ color: wordCount > 120 ? '#f87171' : 'var(--sub)', fontSize: '.75rem', margin: '0 0 10px' }}>{wordCount}/120 words</p>
 <textarea
 style={{ ...inp, marginBottom: '10px', resize: 'vertical' }} rows={2}
 placeholder="Practice instructions for student"
 value={form.practiceSpec} onChange={setF('practiceSpec')}
 />
 </>
 )}

 {/* File tab */}
 {tab === 'file' && (
 <div style={{ marginBottom: '10px' }}>
 {!file ? (
 <div
 onClick={() => fileRef.current?.click()}
 style={{ border: '2px dashed var(--surface-hover)', borderRadius: '12px', padding: '36px 20px', textAlign: 'center', cursor: 'pointer' }}
 onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
 onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--surface-hover)'}
 >
 <p style={{ fontSize: '2rem', margin: '0 0 8px' }}></p>
 <p style={{ color: 'var(--text)', fontWeight: 600, margin: '0 0 4px', fontSize: '.9rem' }}>Click to attach a file</p>
 <p style={{ color: 'var(--sub)', fontSize: '.78rem', margin: 0 }}>PDF, DOC, DOCX, TXT Max {MAX_FILE_MB} MB</p>
 </div>
 ) : (
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '12px 16px' }}>
 <span style={{ fontSize: '1.6rem' }}>{fIcon(file.name)}</span>
 <div style={{ flex: 1 }}>
 <p style={{ color: '#a5b4fc', fontWeight: 600, margin: '0 0 2px', fontSize: '.85rem' }}>{file.name}</p>
 <p style={{ color: 'var(--sub)', fontSize: '.72rem', margin: 0 }}>{(file.size / 1024).toFixed(0)} KB</p>
 </div>
 <button
 onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}
 style={{ background: 'none', border: 'none', color: 'var(--sub)', cursor: 'pointer', fontSize: '1.1rem' }}
 ></button>
 </div>
 )}
 <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={pickFile} />
 </div>
 )}

 <input style={{ ...inp, marginBottom: '14px' }} placeholder="Tags (comma separated)" value={form.tags} onChange={setF('tags')} />

 {/* Assign to students */}
 {students.length > 0 && (
 <div style={{ marginBottom: '14px' }}>
 <p style={{ color: 'var(--sub)', fontWeight: 600, fontSize: '.8rem', margin: '0 0 8px' }}>ASSIGN TO (leave empty = all students)</p>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
 {students.map(s => {
 const sel2 = selectedStudents.includes(s.id)
 return (
 <button
 key={s.id}
 onClick={() => toggleStudent(s.id)}
 style={{
 padding: '5px 12px', borderRadius: '20px', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${sel2 ? '#6366f1' : 'var(--surface-hover)'}`,
 background: sel2 ? 'rgba(99,102,241,0.2)' : 'transparent', color: sel2 ? '#a5b4fc' : 'var(--sub)',
 }}
 >
 {s.name || s.email}
 </button>
 )
 })}
 </div>
 </div>
 )}

 <button
 onClick={handleSubmit}
 disabled={loading}
 style={{ width: '100%', background: loading ? 'var(--surface-hover)' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color: loading ? 'var(--sub)' : '#fff', border: 'none', borderRadius: '10px', padding: '11px', fontWeight: 700, fontSize: '.875rem', cursor: loading ? 'default' : 'pointer' }}
 >
 {loading ? 'Sending' : ' Send Assignment to Students'}
 </button>
 </div>

 {/* Past assignments */}
 <h2 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 12px' }}>Sent Assignments</h2>
 {loadingList ? <p style={{ color: 'var(--sub)' }}>Loading</p> : assignments.length === 0 ? (
 <p style={{ color: 'var(--sub)', fontSize: '.875rem' }}>No assignments sent yet.</p>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
 {assignments.map(a => (
 <div key={a.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '1.4rem' }}>{a.file_url ? fIcon(a.file_name) : ''}</span>
 <div style={{ flex: 1, minWidth: '120px' }}>
 <p style={{ fontWeight: 600, color: 'var(--text)', margin: '0 0 3px', fontSize: '.9rem' }}>{a.title}</p>
 <p style={{ fontSize: '.75rem', color: 'var(--sub)', margin: 0 }}>
 Grade {a.grade} {a.subject}{a.due_date ? ` Due ${new Date(a.due_date).toLocaleDateString()}` : ''}
 </p>
 </div>
 <button
 onClick={() => deleteAssignment(a.id)}
 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}
 >Delete</button>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}

const sel = { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '10px', padding: '10px 12px', fontSize: '.875rem', width: '100%' }
const inp = { ...sel, display: 'block', width: '100%', boxSizing: 'border-box', outline: 'none' }