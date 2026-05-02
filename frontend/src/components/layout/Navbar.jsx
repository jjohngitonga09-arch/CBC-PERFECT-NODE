import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import HamburgerMenu from './HamburgerMenu'
import Avatar from '../common/Avatar'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'

const RC = {
 admin: { bg:'rgba(239,68,68,0.12)', fg:'#ef4444', label:'Admin' },
 teacher: { bg:'rgba(99,102,241,0.12)', fg:'#6366f1', label:'Teacher' },
 student: { bg:'rgba(16,185,129,0.12)', fg:'#10b981', label:'Student' },
 guardian: { bg:'rgba(245,158,11,0.12)', fg:'#f59e0b', label:'Parent' },
}
const HOME = { student:'/student/home', teacher:'/teacher/home', guardian:'/parent/home', admin:'/admin/home' }

export default function Navbar() {
 const { role, viewAs, toggleView, logout, user, setUser } = useAuthStore()
 const { dark, toggle } = useTheme()
 const [open, setOpen] = useState(false)
 const [uploading, setUploading] = useState(false)
 const fileRef = useRef()
 const nav = useNavigate()
 const location = useLocation()
 const isSubscriptionPage = location.pathname === '/student/subscription'
 const rc = RC[role] || RC.student

 async function handleAvatarChange(e) {
 const file = e.target.files[0]
 if (!file) return
 setUploading(true)
 try {
 const form = new FormData()
 form.append('avatar', file)
 const { data } = await api.post('/users/avatar', form, {
 headers: { 'Content-Type': 'multipart/form-data' }
 })
 setUser({ ...user, avatar_url: data.avatar_url })
 toast.success('Profile picture updated!')
 } catch {
 toast.error('Upload failed')
 } finally {
 setUploading(false)
 e.target.value = ''
 }
 }

 const iconBtn = {
 background: 'transparent',
 border: '1px solid var(--border)',
 borderRadius: '10px',
 padding: '7px',
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 lineHeight: 0,
 transition: 'background 0.15s',
 color: 'var(--sub)',
 }

 return (
 <>
 <nav style={{
 background: 'var(--surface)',
 borderBottom: '1px solid var(--border)',
 position: 'sticky',
 top: 0,
 zIndex: 40,
 boxShadow: 'var(--shadow)',
 transition: 'background 0.3s, box-shadow 0.3s',
 }}>
 <div style={{
 maxWidth: '1100px',
 margin: '0 auto',
 padding: '0 16px',
 height: '60px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 }}>

 {/* LEFT: Hamburger + Logo */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <button
 onClick={() => setOpen(v => !v)}
 style={{ ...iconBtn, visibility: isSubscriptionPage ? 'hidden' : 'visible' }}
 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
 >
 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/>
 </svg>
 </button>

 <Link to={HOME[role] || '/'} style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
 <span style={{ fontSize: '1.4rem' }}></span>
 <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)', letterSpacing: '-0.3px' }}>
 EduApp
 </span>
 </Link>
 </div>

 {/* RIGHT: role badge, guardian toggle, theme, avatar */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <span style={{
 background: rc.bg,
 color: rc.fg,
 padding: '3px 10px',
 borderRadius: '20px',
 fontSize: '.72rem',
 fontWeight: 700,
 letterSpacing: '.3px',
 }}>
 {rc.label}
 </span>

 {role === 'guardian' && (
 <button
 onClick={toggleView}
 style={{ ...iconBtn, padding: '4px 10px', fontSize: '.72rem', fontWeight: 600, color: 'var(--accent)' }}
 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
 >
 {viewAs === 'guardian' ? ' Child' : ' Parent'}
 </button>
 )}

 {/* Dark / Light toggle */}
 <button
 onClick={toggle}
 title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
 style={iconBtn}
 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
 >
 {dark
 ? <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-5.66-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/></svg>
 : <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
 }
 </button>

 {/* Avatar */}
 <div style={{ position: 'relative' }} title="Click to change profile picture">
 <div onClick={() => !uploading && fileRef.current.click()} style={{ cursor: 'pointer' }}>
 <Avatar user={user} size={34} clickable={false} />
 </div>
 {uploading && (
 <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
 <div style={{ width:14, height:14, border:'2px solid #fff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
 </div>
 )}
 <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
 </div>
 </div>
 </div>
 </nav>

 <HamburgerMenu open={open} onClose={() => setOpen(false)} onLogout={() => { logout(); nav('/login') }} />
 </>
 )
}
