import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import HamburgerMenu from './HamburgerMenu'
import Avatar from '../common/Avatar'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'

const HOME = { student: '/student/home', teacher: '/teacher/home', guardian: '/parent/home', admin: '/admin/home' }

const ROLE_STYLES = {
  admin:    { bg: 'rgba(239,68,68,0.15)',  fg: '#ef4444', dot: '#ef4444' },
  teacher:  { bg: 'rgba(99,102,241,0.15)', fg: '#818cf8', dot: '#6366f1' },
  student:  { bg: 'rgba(16,185,129,0.15)', fg: '#34d399', dot: '#10b981' },
  guardian: { bg: 'rgba(245,158,11,0.15)', fg: '#fbbf24', dot: '#f59e0b' },
}

export default function Navbar() {
  const { role, logout, user, setUser, subscriptionInfo } = useAuthStore()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const nav = useNavigate()
  const location = useLocation()
  const isSubscriptionPage = location.pathname === '/student/subscription'
  const rs = ROLE_STYLES[role] || ROLE_STYLES.student
  const roleLabel = role === 'guardian' ? 'Parent' : role?.charAt(0).toUpperCase() + role?.slice(1)
  const daysLeft = (subscriptionInfo?.status === 'active' && subscriptionInfo?.expiry_date) ? Math.max(0, Math.ceil((new Date(subscriptionInfo.expiry_date) - new Date()) / 86400000)) : null
  const isTrial = subscriptionInfo?.plan_id === 'trial'

  async function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('avatar', file)
      const { data } = await api.post('/users/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setUser({ ...user, avatar_url: data.avatar_url })
      toast.success('Profile picture updated!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false); e.target.value = '' }
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .nav-icon-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sub);
          transition: background 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .nav-icon-btn:hover { background: var(--bg); border-color: var(--accent); color: var(--accent); }
        .hamburger-line {
          display: block;
          width: 18px;
          height: 2px;
          background: currentColor;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s, width 0.3s;
          transform-origin: center;
        }
        .ham-open .line1 { transform: translateY(6px) rotate(45deg); }
        .ham-open .line2 { opacity: 0; width: 0; }
        .ham-open .line3 { transform: translateY(-6px) rotate(-45deg); }
        @media(max-width:360px) { .hide-xs { display: none !important; } }
      `}</style>

      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 40,
        boxShadow: 'var(--shadow)',
        transition: 'background 0.3s',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '0 14px', height: '58px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '8px',
        }}>

          {/* LEFT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>

            {/* Animated hamburger button */}
            {!isSubscriptionPage && (
              <button
                className={`nav-icon-btn ${open ? 'ham-open' : ''}`}
                onClick={() => setOpen(v => !v)}
                aria-label="Toggle menu"
                style={{ gap: 0, flexDirection: 'column', rowGap: '4px', padding: '10px 9px', border: open ? '1px solid var(--accent)' : '1px solid var(--border)', background: open ? 'rgba(99,102,241,0.08)' : 'transparent' }}
              >
                <span className="hamburger-line line1" />
                <span className="hamburger-line line2" />
                <span className="hamburger-line line3" />
              </button>
            )}

            {/* Logo */}
            <Link to={HOME[role] || '/'} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minWidth: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                📚
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent)', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
                EduApp
              </span>
            </Link>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

            {(role === 'student' || role === 'guardian') && daysLeft !== null && (
              <div className="hide-xs" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: daysLeft <= 1 ? 'rgba(251,191,36,0.15)' : 'rgba(16,185,129,0.15)', borderRadius: '20px', padding: '4px 10px' }}>
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: daysLeft <= 1 ? '#fbbf24' : '#34d399' }}>
                  {isTrial ? '🎁 Trial: ' : ''}{daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                </span>
              </div>
            )}

            {/* Role pill */}
            <div className="hide-xs" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: rs.bg, borderRadius: '20px', padding: '4px 10px 4px 6px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: rs.dot }} />
              <span style={{ fontSize: '.72rem', fontWeight: 700, color: rs.fg }}>{roleLabel}</span>
            </div>

            {/* Theme toggle */}
            <button className="nav-icon-btn" onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}>
              {dark
                ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-5.66-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/></svg>
                : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
              }
            </button>

            {/* Avatar with upload */}
            <div style={{ position: 'relative', cursor: 'pointer' }} title="Click to change photo" onClick={() => !uploading && fileRef.current?.click()}>
              <Avatar user={user} size={34} clickable={false} />
              {uploading && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 13, height: 13, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                </div>
              )}
              {/* Online indicator */}
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#10b981', border: '2px solid var(--surface)' }} />
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
        </div>
      </nav>

      <HamburgerMenu open={open} onClose={() => setOpen(false)} onLogout={() => { logout(); nav('/login') }} />
    </>
  )
}
