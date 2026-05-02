import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const reasons = {
 locked: 'Your account has been locked by an administrator.',
 suspended: 'Your account has been temporarily suspended.',
 dashboard_locked: 'This dashboard has been temporarily locked by an administrator.',
 'Account is locked': 'Your account has been locked by an administrator.',
 'Account is suspended': 'Your account has been temporarily suspended.',
}

export default function Maintenance() {
 const [params] = useSearchParams()
 const navigate = useNavigate()
 const clearMaintenance = useAuthStore(s => s.clearMaintenance)
 const logout = useAuthStore(s => s.logout)
 const token = useAuthStore(s => s.token)
 const reason = params.get('reason') || 'locked'
 const message = reasons[reason] || reason

 useEffect(() => {
 if (!token) return;

 const check = async () => {
 try {
 const res = await fetch('/auth/status', {
 headers: { Authorization: `Bearer ${token}` }
 });
 const data = await res.json();
 if (data.status === 'active') {
 clearMaintenance();
 logout();
 navigate('/login', { replace: true });
 }
 } catch {}
 };

 check();
 const interval = setInterval(check, 4000);
 return () => clearInterval(interval);
 }, [token]);

 return (
 <div style={{
 minHeight: '100vh',
 background: '#0a0a1a',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 fontFamily: 'sans-serif',
 padding: '2rem',
 textAlign: 'center',
 }}>
 <img
 src="/hacker.png"
 alt="Maintenance"
 style={{ width: 220, marginBottom: '2rem', filter: 'drop-shadow(0 0 24px #3b82f6)' }}
 />
 <h1 style={{ color: '#3b82f6', fontSize: '2rem', margin: '0 0 1rem' }}>
 Dashboard Under Maintenance
 </h1>
 <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 480, margin: '0 0 0.5rem' }}>
 {message}
 </p>
 <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 480 }}>
 We will be back online shortly. Thank you for your patience. 
 </p>
 </div>
 )
}
