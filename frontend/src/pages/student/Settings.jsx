import { useState, useRef, useEffect } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import LinkParent from '../../components/student/LinkParent'
import Avatar from '../../components/common/Avatar'

export default function StudentSettings() {
 const { user, setUser } = useAuthStore()
 const [name, setName] = useState(user?.name || '')
 const [phone, setPhone] = useState(user?.phone || '')
 const [curPw, setCurPw] = useState('')
 const [newPw, setNewPw] = useState('')
 const [saving, setSaving] = useState(false)
 const [uploading, setUploading] = useState(false)
 const fileRef = useRef()

 useEffect(() => {
 api.get('/users/me').then(r => {
 setUser(r.data)
 setName(r.data.name || '')
 setPhone(r.data.phone || '')
 }).catch(() => {})
 }, [])

 async function handleAvatarChange(e) {
 const file = e.target.files[0]
 if (!file) return
 setUploading(true)
 try {
 const fd = new FormData()
 fd.append('avatar', file)
 const { data } = await api.post('/users/avatar', fd, {
 headers: { 'Content-Type': 'multipart/form-data' }
 })
 setUser({ ...user, avatar_url: data.avatar_url })
 toast.success('Profile picture updated!')
 } catch (e) {
 toast.error(e.response?.data?.error || 'Upload failed')
 } finally { setUploading(false); e.target.value = '' }
 }

 async function removeAvatar() {
 if (!window.confirm('Remove your profile picture?')) return
 setUploading(true)
 try {
 await api.delete('/users/avatar')
 setUser({ ...user, avatar_url: null })
 toast.success('Picture removed')
 } catch { toast.error('Failed') }
 finally { setUploading(false) }
 }

 async function saveProfile() {
 setSaving(true)
 try {
 const body = { name: name.trim(), phone: phone.trim() }
 if (newPw) {
 if (!curPw) { toast.error('Enter current password'); setSaving(false); return }
 body.currentPassword = curPw
 body.newPassword = newPw
 }
 const r = await api.patch('/users/me', body)
 setUser(r.data)
 setCurPw(''); setNewPw('')
 toast.success('Profile saved!')
 } catch (e) { toast.error(e.response?.data?.error || 'Save failed') }
 finally { setSaving(false) }
 }

 const card = { background:'#111827', border:'1px solid #1f2937', borderRadius:'16px', padding:'24px', marginBottom:'16px' }
 const inp = { width:'100%', padding:'10px 14px', borderRadius:'10px', border:'1px solid #374151', background:'#0f1421', color:'#f9fafb', fontSize:'.875rem', outline:'none', boxSizing:'border-box' }
 const lbl = { color:'#6b7280', fontSize:'.75rem', fontWeight:600, display:'block', marginBottom:'6px' }

 return (
 <div style={{ maxWidth:'560px' }}>
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#f9fafb', margin:'0 0 4px' }}>Settings</h1>
 <p style={{ fontSize:'.875rem', color:'#6b7280', margin:0 }}>Manage your profile and account</p>
 </div>

 <div style={card}>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 20px' }}>Profile Picture</p>
 <div style={{ display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
 <div style={{ position:'relative' }}>
 <Avatar user={user} size={80} clickable={true} />
 {uploading && (
 <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,0.6)',
 display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'.7rem' }}>...</div>
 )}
 </div>
 <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
 <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange}/>
 <button onClick={() => fileRef.current?.click()} disabled={uploading}
 style={{ padding:'9px 20px', borderRadius:'10px', border:'none', cursor:'pointer',
 background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', fontWeight:700, fontSize:'.85rem' }}>
 {uploading ? 'Uploading...' : 'Change Photo'}
 </button>
 {user?.avatar_url && (
 <button onClick={removeAvatar} disabled={uploading}
 style={{ padding:'9px 20px', borderRadius:'10px', border:'1px solid rgba(239,68,68,0.3)',
 background:'rgba(239,68,68,0.08)', color:'#f87171', fontWeight:600, fontSize:'.85rem', cursor:'pointer' }}>
 Remove
 </button>
 )}
 </div>
 </div>
 <p style={{ color:'#4b5563', fontSize:'.72rem', marginTop:'12px', marginBottom:0 }}>
 Max 5MB. JPG, PNG or GIF. Visible in chats, leaderboard and across the app.
 </p>
 </div>

 <div style={card}>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 20px' }}>Profile Info</p>
 <div style={{ marginBottom:'14px' }}>
 <label style={lbl}>Full Name</label>
 <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/>
 </div>
 <div style={{ marginBottom:'14px' }}>
 <label style={lbl}>Phone</label>
 <input style={inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"/>
 </div>
 <div style={{ marginBottom:'14px' }}>
 <label style={lbl}>Email</label>
 <input style={{ ...inp, color:'#6b7280' }} value={user?.email || ''} disabled/>
 </div>
 <div style={{ marginBottom:'14px' }}>
 <label style={lbl}>Role</label>
 <input style={{ ...inp, color:'#6b7280', textTransform:'capitalize' }} value={user?.role || ''} disabled/>
 </div>
 </div>

 <div style={card}>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 20px' }}>Change Password</p>
 <div style={{ marginBottom:'14px' }}>
 <label style={lbl}>Current Password</label>
 <input style={inp} type="password" value={curPw} onChange={e => setCurPw(e.target.value)} placeholder="Current password"/>
 </div>
 <div style={{ marginBottom:'14px' }}>
 <label style={lbl}>New Password</label>
 <input style={inp} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (min 8 chars)"/>
 </div>
 </div>

 <button onClick={saveProfile} disabled={saving}
 style={{ width:'100%', padding:'13px', borderRadius:'12px', border:'none',
 background: saving ? '#374151' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
 color:'#fff', fontWeight:800, fontSize:'1rem', cursor: saving ? 'wait' : 'pointer', marginBottom:'16px' }}>
 {saving ? 'Saving...' : 'Save Changes'}
 </button>

 <div style={card}>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 16px' }}>Parent Link</p>
 <LinkParent />
 </div>
 </div>
 )
}