import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import useAuthStore from '../../store/authStore'
import { connectSocket, disconnectSocket, getSocket } from '../../services/socketService'

const CSS_VARS = `
  :root, [data-theme="light"] {
    --bg: #f0f2f5;
    --surface: #ffffff;
    --surface-hover: #f3f4f6;
    --border: #e5e7eb;
    --border-hover: #d1d5db;
    --text: #111827;
    --sub: #6b7280;
    --input-bg: #ffffff;
    --accent: #6366f1;
    --accent2: #818cf8;
    --shadow: 0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05);
    --shadow-hover: 0 4px 12px rgba(0,0,0,0.10), 0 8px 30px rgba(0,0,0,0.07);
    --radius: 18px;
  }
  [data-theme="dark"] {
    --bg: #0a0e17;
    --surface: #161b27;
    --surface-hover: #1a2234;
    --border: #1f2937;
    --border-hover: #374151;
    --text: #f9fafb;
    --sub: #9ca3af;
    --input-bg: #0f1421;
    --accent: #818cf8;
    --accent2: #a5b4fc;
    --shadow: 0 2px 8px rgba(0,0,0,0.35), 0 6px 24px rgba(0,0,0,0.25);
    --shadow-hover: 0 4px 16px rgba(0,0,0,0.45), 0 10px 36px rgba(0,0,0,0.3);
    --radius: 18px;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: 'Segoe UI', system-ui, sans-serif;
    transition: background 0.3s, color 0.3s;
    overflow-x: hidden;
    min-width: 320px;
  }
  img, video { max-width: 100%; height: auto; }
  @keyframes spin { to { transform: rotate(360deg) } }

  /* ── Responsive main padding ── */
  .main-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px 16px 40px;
    width: 100%;
  }
  @media (max-width: 600px) {
    .main-content { padding: 14px 12px 32px; }
  }
  @media (min-width: 1200px) {
    .main-content { padding: 28px 24px 48px; }
  }

  /* ── Responsive grids used across pages ── */
  .responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
    gap: 14px;
  }
  @media (max-width: 480px) {
    .responsive-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  }
  @media (max-width: 340px) {
    .responsive-grid { grid-template-columns: 1fr; }
  }

  /* ── Tables scroll on mobile ── */
  .table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }

  /* ── Cards full width on mobile ── */
  @media (max-width: 480px) {
    [style*="minmax(220px"] { grid-template-columns: 1fr !important; }
    [style*="minmax(140px"] { grid-template-columns: 1fr 1fr !important; }
  }
`

export default function Layout() {
  const { token, logout, role, impersonating, backToParent } = useAuthStore()
  const nav = useNavigate()

  function handleBackToParent() {
    backToParent()
    nav('/parent/home', { replace: true })
  }

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token)

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

    socket.on('dashboard:unlocked', () => {
      logout()
      nav('/login', { replace: true })
    })

    return () => {
      const state = useAuthStore.getState();
      if (!state.maintenanceReason) disconnectSocket();
    }
  }, [token])

  return (
    <>
      <style>{CSS_VARS}</style>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        {impersonating && (
          <div style={{
            background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff',
            padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', flexWrap: 'wrap', fontSize: '.85rem', fontWeight: 700,
          }}>
            <span>You're using {impersonating.childName}'s account</span>
            <button onClick={handleBackToParent} style={{
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)',
              color: '#fff', borderRadius: '8px', padding: '5px 14px', fontWeight: 700,
              fontSize: '.8rem', cursor: 'pointer',
            }}>
              Back to Parent
            </button>
          </div>
        )}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
