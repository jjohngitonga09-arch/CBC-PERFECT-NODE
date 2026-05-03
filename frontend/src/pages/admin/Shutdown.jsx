import { useEffect, useState, useCallback, useRef } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ROLES = ['teacher', 'guardian', 'student']
const ROLE_LABELS = { teacher: 'Teachers', guardian: 'Parents', student: 'Students' }
const POLL_INTERVAL = 5000

// -- Kenya SVG map with animated user dots ------------------------------------
// Major Kenyan cities mapped to SVG coordinates (viewBox 0 0 300 340)
const KENYA_CITIES = [
 { name: 'Nairobi', x: 168, y: 208, size: 7 },
 { name: 'Mombasa', x: 224, y: 298, size: 5 },
 { name: 'Kisumu', x: 96, y: 196, size: 5 },
 { name: 'Nakuru', x: 132, y: 182, size: 4 },
 { name: 'Eldoret', x: 110, y: 158, size: 4 },
 { name: 'Thika', x: 174, y: 196, size: 3 },
 { name: 'Garissa', x: 234, y: 182, size: 3 },
 { name: 'Nyeri', x: 164, y: 178, size: 3 },
 { name: 'Machakos', x: 182, y: 218, size: 3 },
 { name: 'Malindi', x: 238, y: 268, size: 3 },
 { name: 'Kitale', x: 102, y: 138, size: 3 },
 { name: 'Kisii', x: 108, y: 212, size: 3 },
]

// Simplified Kenya outline path (SVG polygon points)
const KENYA_PATH = "M 110,18 L 130,12 L 158,10 L 188,14 L 210,22 L 238,28 L 260,40 L 272,62 L 278,90 L 276,118 L 270,148 L 264,172 L 258,196 L 248,220 L 238,248 L 228,272 L 218,294 L 208,312 L 196,328 L 180,336 L 164,334 L 148,326 L 132,310 L 116,292 L 100,268 L 88,244 L 76,220 L 64,196 L 56,172 L 52,148 L 54,124 L 58,100 L 60,76 L 66,56 L 76,40 L 88,28 Z"

function KenyaMap({ userCount = 0 }) {
 const [tick, setTick] = useState(0)
 useEffect(() => {
 const id = setInterval(() => setTick(t => t + 1), 1200)
 return () => clearInterval(id)
 }, [])

 // Distribute dots across cities proportionally
 const activeCities = userCount > 0
 ? KENYA_CITIES.slice(0, Math.min(KENYA_CITIES.length, Math.max(1, Math.ceil(userCount / 3))))
 : KENYA_CITIES.slice(0, 4)

 return (
 <div style={{ position: 'relative', width: '100%' }}>
 <style>{`
 @keyframes pulse-dot {
 0% { r: 4px; opacity: 1; }
 70% { r: 12px; opacity: 0; }
 100% { r: 4px; opacity: 0; }
 }
 @keyframes blink-core {
 0%, 100% { opacity: 1; }
 50% { opacity: 0.6; }
 }
 .sat-dot-ring { animation: pulse-dot 2s ease-out infinite; }
 .sat-dot-core { animation: blink-core 1.8s ease-in-out infinite; }
 @keyframes scan-line {
 0% { transform: translateY(-340px); opacity: 0; }
 10% { opacity: 1; }
 90% { opacity: 1; }
 100% { transform: translateY(340px); opacity: 0; }
 }
 .scan { animation: scan-line 4s linear infinite; }
 `}</style>

 <svg viewBox="0 0 300 340" width="100%" style={{ maxHeight: 320, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.15))' }}>
 {/* Grid lines - satellite aesthetic */}
 <defs>
 <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
 <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16,185,129,0.06)" strokeWidth="0.5"/>
 </pattern>
 <clipPath id="kenya-clip">
 <path d={KENYA_PATH} />
 </clipPath>
 <radialGradient id="glow-nairobi" cx="50%" cy="50%" r="50%">
 <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
 <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
 </radialGradient>
 </defs>

 {/* Background rect for grid */}
 <rect width="300" height="340" fill="transparent" />

 {/* Kenya fill */}
 <path d={KENYA_PATH} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.35)" strokeWidth="1.5" strokeLinejoin="round"/>

 {/* Grid inside Kenya */}
 <rect width="300" height="340" fill="url(#grid)" clipPath="url(#kenya-clip)" />

 {/* Scanning line */}
 <g clipPath="url(#kenya-clip)">
 <line className="scan" x1="0" y1="0" x2="300" y2="0" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
 </g>

 {/* Nairobi glow */}
 <ellipse cx="168" cy="208" rx="30" ry="30" fill="url(#glow-nairobi)" />

 {/* User dots */}
 {activeCities.map((city, i) => (
 <g key={city.name}>
 {/* Pulse ring */}
 <circle
 className="sat-dot-ring"
 cx={city.x} cy={city.y} r={city.size}
 fill="none" stroke="#10b981" strokeWidth="1.5"
 style={{ animationDelay: `${i * 0.3}s` }}
 />
 {/* Core dot */}
 <circle
 className="sat-dot-core"
 cx={city.x} cy={city.y} r={city.size * 0.55}
 fill="#10b981"
 style={{ animationDelay: `${i * 0.3}s` }}
 />
 </g>
 ))}

 {/* Nairobi label */}
 <text x="176" y="206" fontSize="7" fill="rgba(16,185,129,0.9)" fontFamily="monospace" fontWeight="bold">NBI</text>
 <text x="232" y="296" fontSize="6" fill="rgba(16,185,129,0.7)" fontFamily="monospace">MBA</text>
 <text x="70" y="194" fontSize="6" fill="rgba(16,185,129,0.7)" fontFamily="monospace">KSM</text>

 {/* Coordinate crosshair on Nairobi */}
 <line x1="160" y1="208" x2="164" y2="208" stroke="#10b981" strokeWidth="0.8" opacity="0.8"/>
 <line x1="172" y1="208" x2="176" y2="208" stroke="#10b981" strokeWidth="0.8" opacity="0.8"/>
 <line x1="168" y1="200" x2="168" y2="204" stroke="#10b981" strokeWidth="0.8" opacity="0.8"/>
 <line x1="168" y1="212" x2="168" y2="216" stroke="#10b981" strokeWidth="0.8" opacity="0.8"/>
 </svg>

 {/* Legend */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
 <span style={{ fontSize: '.7rem', color: 'var(--sub)', fontFamily: 'monospace' }}>ACTIVE USERS</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <div style={{ width: 8, height: 2, background: 'rgba(16,185,129,0.4)' }} />
 <span style={{ fontSize: '.7rem', color: 'var(--sub)', fontFamily: 'monospace' }}>SCAN ACTIVE</span>
 </div>
 </div>
 </div>
 )
}

export default function AdminShutdown() {
 const [users, setUsers] = useState([])
 const [loading, setLoading] = useState(true)
 const [tab, setTab] = useState('teacher')
 const [selected, setSelected] = useState({})
 const [acting, setActing] = useState(false)
 const [shutdownReady, setShutdownReady] = useState(false)
 const pollRef = useRef(null)

 const load = useCallback(async (silent = false) => {
 if (!silent) setLoading(true)
 try {
 const r = await api.get('/admin/users')
 setUsers(Array.isArray(r.data) ? r.data : [])
 } catch {
 if (!silent) toast.error('Failed to load users')
 } finally {
 if (!silent) setLoading(false)
 }
 }, [])

 useEffect(() => {
 load()
 pollRef.current = setInterval(() => load(true), POLL_INTERVAL)
 return () => clearInterval(pollRef.current)
 }, [load])

 const byRole = ROLES.reduce((acc, r) => { acc[r] = users.filter(u => u.role === r); return acc }, {})
 const tabUsers = byRole[tab] || []

 function toggleUser(id) { setSelected(p => ({ ...p, [id]: !p[id] })) }
 function selectAllTab(val) {
 const patch = {}
 tabUsers.forEach(u => { patch[u.id] = val })
 setSelected(p => ({ ...p, ...patch }))
 }

 const allTabSelected = tabUsers.length > 0 && tabUsers.every(u => selected[u.id])
 const anySelected = Object.values(selected).some(Boolean)

 async function toggleUserLock(user) {
 if (acting) return
 setActing(true)
 const endpoint = user.status === 'locked' ? `/admin/users/${user.id}/unlock` : `/admin/users/${user.id}/lock`
 try {
 await api.put(endpoint)
 await load(true)
 toast.success(`${user.name || user.email} ${user.status === 'locked' ? 'unlocked' : 'locked'}`)
 } catch { toast.error('Action failed') }
 finally { setActing(false) }
 }

 async function lockSelected() {
 const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
 if (!ids.length) return toast.error('Select users first')
 setActing(true)
 try { await Promise.all(ids.map(id => api.put(`/admin/users/${id}/lock`))); await load(true); setSelected({}); toast.success(`Locked ${ids.length} user(s)`) }
 catch { toast.error('Some locks failed') }
 finally { setActing(false) }
 }

 async function unlockSelected() {
 const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
 if (!ids.length) return toast.error('Select users first')
 setActing(true)
 try { await Promise.all(ids.map(id => api.put(`/admin/users/${id}/unlock`))); await load(true); setSelected({}); toast.success(`Unlocked ${ids.length} user(s)`) }
 catch { toast.error('Some unlocks failed') }
 finally { setActing(false) }
 }

 async function lockRole(role) {
 setActing(true)
 try { await api.put(`/admin/roles/${role}/lock`, { exempt: [] }); await load(true); toast.success(`All ${role}s locked`) }
 catch { toast.error('Failed') }
 finally { setActing(false) }
 }

 async function unlockRole(role) {
 setActing(true)
 try { await api.put(`/admin/roles/${role}/unlock`); await load(true); toast.success(`All ${role}s unlocked`) }
 catch { toast.error('Failed') }
 finally { setActing(false) }
 }

 async function lockAll() {
 setActing(true)
 try { await Promise.all(ROLES.map(r => api.put(`/admin/roles/${r}/lock`, { exempt: [] }))); await load(true); toast.success('All roles locked') }
 catch { toast.error('Failed') }
 finally { setActing(false) }
 }

 async function unlockAll() {
 setActing(true)
 try { await Promise.all(ROLES.map(r => api.put(`/admin/roles/${r}/unlock`))); await load(true); toast.success('All roles unlocked') }
 catch { toast.error('Failed') }
 finally { setActing(false) }
 }

 async function executeShutdown() {
 setActing(true)
 try { await api.post('/system/shutdown'); toast.success('Shutdown initiated.') }
 catch (err) { toast.error(err.response?.data?.error || 'Failed') }
 finally { setActing(false) }
 }

 const lockedCount = users.filter(u => u.status === 'locked').length
 const activeCount = users.filter(u => u.status === 'active').length

 // -- Styles --------------------------------------------------------------
 const S = {
 page: { maxWidth: 740, fontFamily: "'Segoe UI', system-ui, sans-serif" },
 panel: {
 background: 'linear-gradient(135deg,var(--bg) 0%,#0f1621 100%)',
 border: '1px solid #1e2738',
 borderRadius: 16,
 padding: '20px',
 marginBottom: 14,
 boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
 },
 glassPanel: {
 background: 'rgba(15,22,33,0.85)',
 backdropFilter: 'blur(12px)',
 border: '1px solid rgba(255,255,255,0.06)',
 borderRadius: 16,
 padding: '20px',
 marginBottom: 14,
 boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
 },
 btn: (bg, fg = '#fff', extra = {}) => ({
 background: bg, color: fg, border: 'none', borderRadius: 10,
 padding: '8px 18px', fontWeight: 700, fontSize: '.8rem',
 cursor: 'pointer', transition: 'all .15s', ...extra,
 }),
 lockBtn: { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
 unlockBtn: { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' },
 badge: (locked) => ({
 padding: '3px 12px', borderRadius: 20, fontSize: '.7rem', fontWeight: 700, flexShrink: 0,
 background: locked ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
 color: locked ? '#f87171' : '#34d399',
 border: locked ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(16,185,129,0.2)',
 }),
 tag: (bg, fg, border) => ({ fontSize: '.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: bg, color: fg, border }),
 }

 return (
 <div style={S.page}>
 <style>{`
 @keyframes shimmer { 0%,100% { opacity:.7 } 50% { opacity:1 } }
 @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
 .ctrl-btn { transition: transform .12s, box-shadow .12s !important; }
 .ctrl-btn:hover:not(:disabled) { transform: translateY(-1px) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important; }
 .ctrl-btn:active:not(:disabled) { transform: translateY(0) !important; }
 .user-row:hover { background: rgba(99,102,241,0.05) !important; }
 .tab-btn { transition: all .2s !important; }
 `}</style>

 {/* -- Header ------------------------------------------------------ */}
 <div style={{ marginBottom: 24, animation: 'fadeUp .4s ease' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}></div>
 <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Emergency Controls</h1>
 <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
 <span style={S.tag('rgba(16,185,129,0.12)', '#34d399', '1px solid rgba(16,185,129,0.25)')}>{activeCount} active</span>
 <span style={S.tag('rgba(239,68,68,0.12)', '#f87171', '1px solid rgba(239,68,68,0.2)')}>{lockedCount} locked</span>
 <span style={S.tag('rgba(99,102,241,0.12)', '#a5b4fc', '1px solid rgba(99,102,241,0.2)')}>{users.length} total</span>
 </div>
 </div>
 <p style={{ color: 'var(--sub)', fontSize: '.8rem', margin: 0, fontFamily: 'monospace' }}>
 SYS:ADMIN &nbsp;|&nbsp; AUTO-REFRESH 5s &nbsp;|&nbsp; {loading ? 'SYNCING...' : 'LIVE'}
 {!loading && <span style={{ color: '#10b981', animation: 'shimmer 2s infinite' }}> *</span>}
 </p>
 </div>

 {/* -- Two-column layout: controls + Kenya map ---------------------- */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, marginBottom: 14, alignItems: 'start' }}>

 {/* Global Actions */}
 <div style={S.panel}>
 <p style={{ color: 'var(--sub)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 12px', fontFamily: 'monospace' }}>Global Controls</p>
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <button className="ctrl-btn" onClick={lockAll} disabled={acting} style={{ ...S.lockBtn, ...S.btn('',''), ...S.lockBtn, padding: '9px 20px', borderRadius: 10 }}> Lock All Roles</button>
 <button className="ctrl-btn" onClick={unlockAll} disabled={acting} style={{ ...S.unlockBtn, ...S.btn('',''), ...S.unlockBtn, padding: '9px 20px', borderRadius: 10 }}> Unlock All Roles</button>
 </div>
 </div>

 {/* Kenya Map */}
 <div style={{ ...S.panel, padding: '14px', gridRow: '1 / 4' }}>
 <p style={{ color: 'var(--sub)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 10px', fontFamily: 'monospace' }}> User Distribution</p>
 <KenyaMap userCount={activeCount} />
 </div>

 </div>

 {/* -- Role Tabs ---------------------------------------------------- */}
 <div style={{ display: 'flex', gap: 6, marginBottom: 10, background: '#090d14', borderRadius: 12, padding: 4 }}>
 {ROLES.map(r => (
 <button
 key={r}
 className="tab-btn"
 onClick={() => setTab(r)}
 style={{
 flex: 1, padding: '9px 6px', borderRadius: 9, border: 'none',
 fontWeight: 700, fontSize: '.78rem', cursor: 'pointer',
 background: tab === r ? '#6366f1' : 'transparent',
 color: tab === r ? '#fff' : 'var(--sub)',
 boxShadow: tab === r ? '0 2px 12px rgba(99,102,241,0.4)' : 'none',
 }}
 >
 {ROLE_LABELS[r]} ({byRole[r]?.length || 0})
 </button>
 ))}
 </div>

 {/* -- Role-level actions ------------------------------------------- */}
 <div style={{ ...S.panel, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: '12px 16px' }}>
 <span style={{ color: 'var(--sub)', fontWeight: 600, fontSize: '.78rem', flex: 1, fontFamily: 'monospace' }}>
 TARGET: {ROLE_LABELS[tab].toUpperCase()}
 </span>
 <button className="ctrl-btn" onClick={() => lockRole(tab)} disabled={acting} style={{ ...S.lockBtn, ...S.btn('',''), ...S.lockBtn }}> Lock All {ROLE_LABELS[tab]}</button>
 <button className="ctrl-btn" onClick={() => unlockRole(tab)} disabled={acting} style={{ ...S.unlockBtn, ...S.btn('',''), ...S.unlockBtn }}> Unlock All {ROLE_LABELS[tab]}</button>
 </div>

 {/* -- User List ---------------------------------------------------- */}
 <div style={{ ...S.glassPanel, padding: '14px' }}>
 {/* Select all row */}
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #1e2738' }}>
 <input type="checkbox" checked={allTabSelected} onChange={e => selectAllTab(e.target.checked)}
 style={{ width: 15, height: 15, accentColor: '#6366f1', cursor: 'pointer' }} />
 <span style={{ color: 'var(--sub)', fontSize: '.78rem', fontWeight: 600, fontFamily: 'monospace' }}>
 SELECT ALL ({tabUsers.length})
 </span>
 {anySelected && (
 <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
 <button className="ctrl-btn" onClick={lockSelected} disabled={acting} style={{ ...S.lockBtn, ...S.btn('',''), ...S.lockBtn, padding: '6px 14px' }}> Lock</button>
 <button className="ctrl-btn" onClick={unlockSelected} disabled={acting} style={{ ...S.unlockBtn, ...S.btn('',''), ...S.unlockBtn, padding: '6px 14px' }}> Unlock</button>
 </div>
 )}
 </div>

 {loading ? (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 10 }}>
 <style>{`@keyframes sspin{to{transform:rotate(360deg)}}`}</style>
 <div style={{ width: 20, height: 20, border: '2px solid #1e2738', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'sspin .7s linear infinite' }} />
 <span style={{ color: 'var(--sub)', fontSize: '.8rem', fontFamily: 'monospace' }}>LOADING USERS...</span>
 </div>
 ) : tabUsers.length === 0 ? (
 <p style={{ color: 'var(--sub)', textAlign: 'center', padding: '28px 0', fontFamily: 'monospace', fontSize: '.8rem' }}>
 NO {ROLE_LABELS[tab].toUpperCase()} FOUND
 </p>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
 {tabUsers.map(u => {
 const locked = u.status === 'locked'
 return (
 <div
 key={u.id}
 className="user-row"
 style={{
 display: 'flex', alignItems: 'center', gap: 10,
 background: selected[u.id] ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
 border: `1px solid ${selected[u.id] ? 'rgba(99,102,241,0.3)' : '#1e2738'}`,
 borderRadius: 10, padding: '10px 12px',
 transition: 'all .15s', cursor: 'default',
 }}
 >
 <input type="checkbox" checked={!!selected[u.id]} onChange={() => toggleUser(u.id)}
 style={{ width: 14, height: 14, accentColor: '#6366f1', cursor: 'pointer', flexShrink: 0 }} />

 {/* Avatar */}
 <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
 background: locked ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 800, color: locked ? '#f87171' : '#a5b4fc' }}>
 {(u.name || u.email || '?')[0].toUpperCase()}
 </div>

 <div style={{ flex: 1, minWidth: 0 }}>
 <p style={{ color: '#e5e7eb', fontWeight: 600, margin: 0, fontSize: '.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 {u.name || u.email}
 </p>
 <p style={{ color: 'var(--sub)', fontSize: '.7rem', margin: 0, fontFamily: 'monospace' }}>{u.email}</p>
 </div>

 <span style={S.badge(locked)}>{locked ? ' Locked' : '* Active'}</span>

 <button
 className="ctrl-btn"
 disabled={acting}
 onClick={() => toggleUserLock(u)}
 style={locked
 ? { ...S.unlockBtn, ...S.btn('',''), ...S.unlockBtn, padding: '5px 14px', fontSize: '.75rem' }
 : { ...S.lockBtn, ...S.btn('',''), ...S.lockBtn, padding: '5px 14px', fontSize: '.75rem' }
 }
 >
 {locked ? 'Unlock' : 'Lock'}
 </button>
 </div>
 )
 })}
 </div>
 )}
 </div>

 {/* -- Emergency Shutdown ------------------------------------------- */}
 <div style={{ ...S.panel, border: '1px solid rgba(239,68,68,0.3)', background: 'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(15,22,33,0.95))', position: 'relative', overflow: 'hidden' }}>
 {/* Decorative top stripe */}
 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#ef4444,transparent)' }} />

 <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
 <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
 
 </div>
 <div style={{ flex: 1 }}>
 <p style={{ color: '#f87171', fontWeight: 800, fontSize: '1rem', margin: '0 0 6px', letterSpacing: '-0.3px' }}>Emergency Shutdown</p>
 <p style={{ color: 'var(--sub)', fontSize: '.8rem', margin: '0 0 18px', lineHeight: 1.6 }}>
 Immediately stops all incoming requests and terminates the server process.
 All active sessions will be forcibly disconnected. This action cannot be undone remotely.
 </p>

 {!shutdownReady ? (
 <button
 className="ctrl-btn"
 onClick={() => setShutdownReady(true)}
 style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: '.875rem', cursor: 'pointer' }}
 >
 Arm Shutdown
 </button>
 ) : (
 <div>
 <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
 <p style={{ color: '#f87171', fontSize: '.78rem', fontWeight: 700, margin: 0, fontFamily: 'monospace' }}>
 SHUTDOWN ARMED -- CONFIRM TO EXECUTE
 </p>
 </div>
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <button
 className="ctrl-btn"
 onClick={executeShutdown}
 disabled={acting}
 style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 800, fontSize: '.875rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}
 >
 {acting ? ' Shutting down...' : ' Execute Shutdown'}
 </button>
 <button
 className="ctrl-btn"
 onClick={() => setShutdownReady(false)}
 style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--sub)', border: '1px solid #1e2738', borderRadius: 10, padding: '11px 20px', fontWeight: 700, fontSize: '.875rem', cursor: 'pointer' }}
 >
 Cancel
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>

 </div>
 )
}
