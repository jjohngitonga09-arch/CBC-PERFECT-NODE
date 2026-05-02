import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const card = { background: '#161b27', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }
const MAX_MB = 50
const MAX_BYTES = MAX_MB * 1024 * 1024

export default function TeacherUploadVideo() {
 const userId = useAuthStore(s => s.userId)
 const fileRef = useRef()

 const [file, setFile] = useState(null)
 const [preview, setPreview] = useState(null)
 const [form, setForm] = useState({ title: '', subject: 'English', grade: '1' })
 const [progress, setProgress] = useState(0)
 const [uploading, setUploading] = useState(false)
 const [videos, setVideos] = useState([])
 const [loadingList, setLoadingList] = useState(true)

 /* fetch existing videos */
 useEffect(() => {
 api.get('/videos')
 .then(r => setVideos(Array.isArray(r.data) ? r.data : []))
 .catch(() => {})
 .finally(() => setLoadingList(false))
 }, [])

 function pickFile(e) {
 const f = e.target.files[0]
 if (!f) return
 if (!f.type.startsWith('video/')) { toast.error('Only video files allowed'); return }
 if (f.size > MAX_BYTES) { toast.error(`Max ${MAX_MB} MB per video`); return }
 setFile(f)
 setPreview(URL.createObjectURL(f))
 }

 function clearFile() {
 setFile(null)
 if (preview) URL.revokeObjectURL(preview)
 setPreview(null)
 if (fileRef.current) fileRef.current.value = ''
 }

 async function handleUpload() {
 if (!file) return toast.error('Pick a video first')
 if (!form.title.trim()) return toast.error('Enter a title')
 setUploading(true)
 setProgress(0)
 try {
 const fd = new FormData()
 fd.append('video', file)
 fd.append('title', form.title.trim())
 fd.append('subject', form.subject)
 fd.append('grade', form.grade)
 const res = await api.post('/videos', fd, {
 headers: { 'Content-Type': 'multipart/form-data' },
 onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100))
 })
 setVideos(prev => [res.data, ...prev])
 toast.success('Video uploaded!')
 clearFile()
 setForm(f => ({ ...f, title: '' }))
 } catch (err) {
 toast.error(err.response?.data?.error || 'Upload failed')
 } finally {
 setUploading(false)
 setProgress(0)
 }
 }

 async function deleteVideo(id) {
 if (!window.confirm('Delete this video?')) return
 try {
 await api.delete(`/videos/${id}`)
 setVideos(prev => prev.filter(v => v.id !== id))
 toast.success('Deleted')
 } catch { toast.error('Delete failed') }
 }

 return (
 <div>
 <div style={{ marginBottom: '24px' }}>
 <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f9fafb', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Upload Video</h1>
 <p style={{ fontSize: '.875rem', color: '#6b7280', margin: 0 }}>Max {MAX_MB} MB Students will see videos on their dashboard</p>
 </div>

 {/* Upload card */}
 <div style={{ ...card, marginBottom: '28px' }}>
 {/* Drop / pick area */}
 {!preview ? (
 <div
 onClick={() => fileRef.current?.click()}
 style={{ border: '2px dashed #374151', borderRadius: '14px', padding: '48px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s' }}
 onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
 onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}
 >
 <p style={{ fontSize: '2.8rem', margin: '0 0 10px' }}></p>
 <p style={{ color: '#f9fafb', fontWeight: 600, margin: '0 0 4px' }}>Click to choose a video</p>
 <p style={{ color: '#6b7280', fontSize: '.8rem', margin: 0 }}>MP4, MOV, WebM Max {MAX_MB} MB</p>
 </div>
 ) : (
 <div style={{ position: 'relative', marginBottom: '16px' }}>
 <video
 src={preview}
 controls
 style={{ width: '100%', maxHeight: '320px', borderRadius: '12px', background: '#000', display: 'block' }}
 />
 <button
 onClick={clearFile}
 style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,.7)', border: 'none', color: '#f9fafb', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '.8rem' }}
 > Remove</button>
 <p style={{ color: '#6b7280', fontSize: '.78rem', margin: '8px 0 0' }}>
 {file?.name} {(file?.size / (1024 * 1024)).toFixed(1)} MB
 </p>
 </div>
 )}

 <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={pickFile} />

 {/* Meta fields */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
 <select
 value={form.grade}
 onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
 style={{ background: '#0f1421', border: '1px solid #1f2937', color: '#f9fafb', borderRadius: '10px', padding: '10px 12px', fontSize: '.875rem' }}
 >
 {['1', '2', '3'].map(g => <option key={g} value={g}>Grade {g}</option>)}
 </select>
 <select
 value={form.subject}
 onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
 style={{ background: '#0f1421', border: '1px solid #1f2937', color: '#f9fafb', borderRadius: '10px', padding: '10px 12px', fontSize: '.875rem' }}
 >
 {['English', 'Kiswahili', 'Mathematics', 'Science'].map(s => <option key={s}>{s}</option>)}
 </select>
 </div>

 <input
 style={{ width: '100%', marginTop: '10px', background: '#0f1421', border: '1px solid #1f2937', color: '#f9fafb', borderRadius: '10px', padding: '10px 12px', fontSize: '.875rem', boxSizing: 'border-box' }}
 placeholder="Video title"
 value={form.title}
 onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
 />

 {/* Progress bar */}
 {uploading && (
 <div style={{ marginTop: '14px' }}>
 <div style={{ background: '#1f2937', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
 <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', width: `${progress}%`, transition: 'width .3s' }} />
 </div>
 <p style={{ color: '#6b7280', fontSize: '.75rem', marginTop: '4px' }}>{progress}% uploading</p>
 </div>
 )}

 <button
 onClick={handleUpload}
 disabled={uploading || !file}
 style={{ width: '100%', marginTop: '14px', background: uploading || !file ? '#1f2937' : 'linear-gradient(135deg,#6366f1,#4f46e5)', color: uploading || !file ? '#6b7280' : '#fff', border: 'none', borderRadius: '10px', padding: '11px', fontWeight: 700, fontSize: '.875rem', cursor: uploading || !file ? 'default' : 'pointer' }}
 >
 {uploading ? `Uploading ${progress}%` : 'Upload Video'}
 </button>
 </div>

 {/* Uploaded videos list */}
 <h2 style={{ color: '#f9fafb', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 14px' }}>Uploaded Videos</h2>
 {loadingList ? (
 <p style={{ color: '#6b7280' }}>Loading</p>
 ) : videos.length === 0 ? (
 <div style={{ ...card, textAlign: 'center', padding: '40px 20px' }}>
 <p style={{ color: '#6b7280' }}>No videos uploaded yet.</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 {videos.map(v => (
 <div key={v.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '1.6rem', flexShrink: 0 }}></span>
 <div style={{ flex: 1, minWidth: '120px' }}>
 <p style={{ fontWeight: 600, color: '#f9fafb', margin: '0 0 3px' }}>{v.title}</p>
 <p style={{ fontSize: '.75rem', color: '#6b7280', margin: 0 }}>
 Grade {v.grade} {v.subject} {v.view_count || 0} views
 </p>
 </div>
 <button
 onClick={() => deleteVideo(v.id)}
 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}
 >
 Delete
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}