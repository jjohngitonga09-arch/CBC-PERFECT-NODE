import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Avatar from '../../components/common/Avatar'
import toast from 'react-hot-toast'

const card = { background:'#161b27', border:'1px solid #1f2937', borderRadius:'16px', padding:'24px', marginBottom:'16px' }
const inp = { width:'100%', background:'#0f1421', border:'1px solid #1f2937', color:'#f9fafb', borderRadius:'10px', padding:'10px 14px', fontSize:'.875rem', outline:'none', boxSizing:'border-box' }
const lbl = { color:'#6b7280', fontSize:'.78rem', display:'block', marginBottom:'4px' }

export default function Profile() {
 const { user: authUser, setUser } = useAuthStore()
 const fileRef = useRef()
 const [profile, setProfile] = useState(null)
 const [name, setName] = useState('')
 const [phone, setPhone] = useState('')
 const [curPw, setCurPw] = useState('')
 const [newPw, setNewPw] = useState('')
 const [confPw, setConfPw] = useState('')
 const [saving, setSaving] = useState(false)
 const [uploading, setUploading] = useState(false)

 useEffect(() => {
 api.get('/users/me').then(r => {
 setProfile(r.data)
 setUser(r.data)
 setName(r.data.name || '')
 setPhone(r.data.phone || '')
 }).catch(() => {})
 }, [])

 async function uploadAvatar(e) {
 const f = e.target.files[0]
 if (!f) return
 if (!f.type.startsWith('image/')) return toast.error('Images only')
 if (f.size > 5 * 1024 * 1024) return toast.error('Max 5 MB')
 setUploading(true)
 try {
 const fd = new FormData()
 fd.append('avatar', f)
 const r = await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
 const updated = { ...profile, avatar_url: r.data.avatar_url }
 setProfile(updated)
 setUser(updated) // updates Navbar instantly
 toast.success('Profile picture updated!')
 } catch { toast.error('Upload failed') }
 finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
 }

 async function removeAvatar() {
 if (!window.confirm('Remove your profile picture?')) return
 try {
 await api.delete('/users/avatar')
 const updated = { ...profile, avatar_url: null }
 setProfile(updated)
 setUser(updated)
 toast.success('Picture removed')
 } catch { toast.error('Failed') }
 }

 async function saveProfile() {
 if (newPw && newPw !== confPw) return toast.error('Passwords do not match')
 if (newPw && newPw.length < 6) return toast.error('Password must be at least 6 characters')
 setSaving(true)
 try {
 const body = { name: name.trim() || undefined, phone: phone.trim() || undefined }
 if (newPw) { body.currentPassword = curPw; body.newPassword = newPw }
 const r = await api.patch('/users/me', body)
 setProfile(r.data)
 setUser(r.data)
 toast.success('Profile saved!')
 setCurPw(''); setNewPw(''); setConfPw('')
 } catch (err) { toast.error(err.response?.data?.error || 'Save failed') }
 finally { setSaving(false) }
 }

 if (!profile) return <div style={{ color:'#6b7280', padding:'40px', textAlign:'center' }}>Loading...</div>

 const roleColor = { admin:'#ef4444', teacher:'#6366f1', student:'#10b981', guardian:'#f59e0b' }

 return (
 <div style={{ maxWidth:'520px' }}>
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#f9fafb', margin:'0 0 4px' }}>My Profile</h1>
 <p style={{ fontSize:'.875rem', color:'#6b7280', margin:0 }}>Update your info, password and profile picture</p>
 </div>

 {/* Avatar card */}
 <div style={{ ...card, display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
 <div style={{ position:'relative' }}>
 <Avatar user={profile} size={80} clickable={true} />
 {uploading && (
 <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,.6)',
 display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'.7rem' }}>...</div>
 )}
 </div>
 <div>
 <p style={{ color:'#f9fafb', fontWeight:800, margin:'0 0 2px', fontSize:'1.05rem' }}>{profile.name}</p>
 <span style={{ fontSize:'.72rem', fontWeight:700, padding:'2px 10px', borderRadius:'20px',
 background: 'rgba(99,102,241,0.12)',

 color: roleColor[profile.role] || '#6366f1', textTransform:'capitalize' }}>
 {profile.role}
 </span>
 <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
 <button onClick={() => fileRef.current?.click()} disabled={uploading}
 style={{ background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)',
 color:'#a5b4fc', borderRadius:'8px', padding:'6px 14px', cursor:'pointer', fontSize:'.78rem', fontWeight:600 }}>
 {uploading ? 'Uploading...' : 'Change Photo'}
 </button>
 {profile.avatar_url && (
 <button onClick={removeAvatar}
 style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
 color:'#f87171', borderRadius:'8px', padding:'6px 14px', cursor:'pointer', fontSize:'.78rem', fontWeight:600 }}>
 Remove
 </button>
 )}
 </div>
 <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={uploadAvatar}/>
 <p style={{ color:'#4b5563', fontSize:'.7rem', marginTop:'8px', marginBottom:0 }}>
 Max 5MB. Visible in chats, leaderboard and across the app.
 </p>
 </div>
 </div>

 {/* Info */}
 <div style={card}>
 <p style={{ color:'#9ca3af', fontWeight:700, fontSize:'.78rem', margin:'0 0 14px' }}>ACCOUNT INFO</p>
 <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
 <div><label style={lbl}>Full Name</label><input style={inp} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></div>
 <div><label style={lbl}>Phone</label><input style={inp} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+254..."/></div>
 <div><label style={lbl}>Email</label><input style={{ ...inp, opacity:.5 }} value={profile.email||''} disabled/></div>
 {profile.grade && <div><label style={lbl}>Grade</label><input style={{ ...inp, opacity:.5 }} value={profile.grade} disabled/></div>}
 </div>
 </div>

 {/* Password */}
 <div style={card}>
 <p style={{ color:'#9ca3af', fontWeight:700, fontSize:'.78rem', margin:'0 0 14px' }}>CHANGE PASSWORD</p>
 <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
 <input style={inp} type="password" value={curPw} onChange={e=>setCurPw(e.target.value)} placeholder="Current password"/>
 <input style={inp} type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="New password (min 6 chars)"/>
 <input style={inp} type="password" value={confPw} onChange={e=>setConfPw(e.target.value)} placeholder="Confirm new password"/>
 </div>
 </div>

 <button onClick={saveProfile} disabled={saving}
 style={{ width:'100%', background: saving?'#1f2937':'linear-gradient(135deg,#6366f1,#4f46e5)',
 color: saving?'#6b7280':'#fff', border:'none', borderRadius:'12px', padding:'13px',
 fontWeight:800, fontSize:'.95rem', cursor: saving?'default':'pointer' }}>
 {saving ? 'Saving...' : 'Save Changes'}
 </button>
 </div>
 )
}

