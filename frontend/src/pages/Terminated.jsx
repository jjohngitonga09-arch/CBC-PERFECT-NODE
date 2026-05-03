import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Terminated() {
 const navigate = useNavigate()

 // If somehow a non-terminated user lands here, send them away
 useEffect(() => {
 const terminated = localStorage.getItem('account_terminated')
 if (!terminated) navigate('/login', { replace: true })
 }, [navigate])

 return (
 <div style={{
 minHeight: '100vh',
 background: 'var(--bg)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '24px',
 fontFamily: 'system-ui, -apple-system, sans-serif',
 }}>
 <div style={{
 maxWidth: '480px',
 width: '100%',
 textAlign: 'center',
 }}>
 {/* Icon */}
 <div style={{
 width: 80, height: 80,
 borderRadius: '50%',
 background: 'rgba(239,68,68,0.12)',
 border: '2px solid rgba(239,68,68,0.3)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 margin: '0 auto 28px',
 fontSize: '2.2rem',
 }}>
 
 </div>

 {/* Title */}
 <h1 style={{
 fontSize: '1.6rem',
 fontWeight: 900,
 color: '#ef4444',
 margin: '0 0 14px',
 lineHeight: 1.2,
 }}>
 Account Permanently Terminated
 </h1>

 {/* Divider */}
 <div style={{
 width: 48, height: 3,
 background: 'rgba(239,68,68,0.4)',
 borderRadius: 4,
 margin: '0 auto 24px',
 }} />

 {/* Message */}
 <p style={{
 fontSize: '1rem',
 color: 'var(--text)',
 lineHeight: 1.75,
 margin: '0 0 12px',
 }}>
 Your account has been <strong style={{ color: '#f9fafb' }}>permanently removed</strong> from this platform.
 </p>
 <p style={{
 fontSize: '.92rem',
 color: '#9ca3af',
 lineHeight: 1.75,
 margin: '0 0 32px',
 }}>
 This action was taken because your account was found to be in violation of our{' '}
 <strong style={{ color: 'var(--text)' }}>Terms and Conditions</strong>.
 You are no longer permitted to access this service.
 </p>

 {/* Info box */}
 <div style={{
 background: 'rgba(239,68,68,0.06)',
 border: '1px solid rgba(239,68,68,0.2)',
 borderRadius: 12,
 padding: '16px 20px',
 marginBottom: 32,
 textAlign: 'left',
 }}>
 <p style={{ fontSize: '.82rem', color: '#9ca3af', margin: 0, lineHeight: 1.7 }}>
 If you believe this is a mistake, please contact our support team directly.
 Do not attempt to create a new account -- repeated violations may result in
 further action.
 </p>
 </div>

 {/* Support contact */}
 <p style={{ fontSize: '.8rem', color: '#6b7280', margin: 0 }}>
 Support: <span style={{ color: '#a5b4fc' }}>support@elimu.app</span>
 </p>
 </div>
 </div>
 )
}
