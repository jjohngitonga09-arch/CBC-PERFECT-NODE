import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import useAuthStore from '../../store/authStore'
import { connectSocket, disconnectSocket, getSocket } from '../../services/socketService'

const CSS_VARS = `
 :root,[data-theme="light"] {
 --bg: #f8f9fc;
 --surface: #ffffff;
 --border: rgba(0,0,0,0.07);
 --text: #111827;
 --sub: #6b7280;
 --accent: #6366f1;
 --accent2: #818cf8;
 --shadow: 0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05);
 --shadow-hover: 0 4px 12px rgba(0,0,0,0.10), 0 8px 30px rgba(0,0,0,0.07);
 --radius: 18px;
 }
 [data-theme="dark"] {
 --bg: #0f172a;
 --surface: #1e293b;
 --border: rgba(255,255,255,0.06);
 --text: #f1f5f9;
 --sub: #94a3b8;
 --accent: #818cf8;
 --accent2: #a5b4fc;
 --shadow: 0 2px 8px rgba(0,0,0,0.35), 0 6px 24px rgba(0,0,0,0.25);
 --shadow-hover: 0 4px 16px rgba(0,0,0,0.45), 0 10px 36px rgba(0,0,0,0.3);
 --radius: 18px;
 }
 *, *::before, *::after { box-sizing: border-box; }
 body { margin:0; background:var(--bg); color:var(--text); font-family:'Segoe UI',system-ui,sans-serif; transition:background 0.3s,color 0.3s; }
 @keyframes spin { to { transform: rotate(360deg) } }
`

export default function Layout() {
 const { token, logout, role } = useAuthStore()
 const nav = useNavigate()

 useEffect(() => {
 if (!token) return;
 const socket = connectSocket(token)

 // Kicked by admin (locked, suspended, deleted)
 socket.on('force:logout', ({ reason }) => {
 disconnectSocket()
 logout()
 const msgs = {
 account_locked: 'Your account has been locked by an administrator.',
 account_suspended: 'Your account has been suspended.',
 account_deleted: 'Your account has been removed.',
 dashboard_locked: 'Your dashboard has been locked by an administrator.',
 }
 nav('/login?notice=' + encodeURIComponent(msgs[reason] || 'You have been logged out.'))
 })

 // Admin unlocked the dashboard just reload
 socket.on('dashboard:unlocked', () => {
 logout()
 nav('/login', { replace: true })
 })

 return () => {
 // Only disconnect if not in maintenance (maintenance page needs socket alive)
 const state = useAuthStore.getState();
 if (!state.maintenanceReason) disconnectSocket();
 }
 }, [token])

 return (
 <>
 <style>{CSS_VARS}</style>
 <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)' }}>
 <Navbar />
 <main style={{ maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' }}>
 <Outlet />
 </main>
 </div>
 </>
 )
}




