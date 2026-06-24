// src/pages/admin/LockedAccounts.jsx
// Admin page: view locked/suspended users and unlock them with one click

import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'

/* -- shared styles -- */
const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px', boxShadow:'var(--shadow)' }
const h2style = { fontSize:'1rem', fontWeight:700, color:'var(--text)', margin:'0 0 14px' }

function Badge({ label, bg, fg }) {
 return (
 <span style={{ fontSize:'.68rem', fontWeight:700, padding:'3px 10px', borderRadius:20, background:bg, color:fg, whiteSpace:'normal', wordBreak:'break-word' }}>
 {label}
 </span>
 )
}

function StatusBadge({ status }) {
 const map = {
 locked: { bg:'rgba(239,68,68,.15)', fg:'#ef4444', label:'Locked' },
 suspended: { bg:'rgba(245,158,11,.15)', fg:'#f59e0b', label:'Suspended' },
 banned: { bg:'rgba(239,68,68,.15)', fg:'#ef4444', label:'Banned' },
 }
 const s = map[status] ?? map.locked
 return <Badge {...s} />
}

function RoleBadge({ role }) {
 const map = {
 student: { bg:'rgba(99,102,241,.15)', fg:'#6366f1' },
 teacher: { bg:'rgba(16,185,129,.15)', fg:'#10b981' },
 parent: { bg:'rgba(245,158,11,.15)', fg:'#f59e0b' },
 admin: { bg:'rgba(239,68,68,.15)', fg:'#ef4444' },
 }
 const s = map[role] ?? map.student
 return <Badge label={role} bg={s.bg} fg={s.fg} />
}

/* -- Main component -- */
export default function LockedAccounts() {
 const [users, setUsers] = useState([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)
 const [search, setSearch] = useState('')
 const [busy, setBusy] = useState({}) // { [userId]: true } while unlocking
 const [toast, setToast] = useState(null) // { msg, ok }

 /* fetch locked/suspended users */
 const fetchLocked = useCallback(async () => {
 setLoading(true); setError(null)
 try {
 const { data } = await api.get('/admin/users?status=locked,suspended,banned')
 // filter client-side in case the backend returns all users
 const locked = data.filter(u => ['locked','suspended','banned'].includes(u.status))
 setUsers(locked)
 } catch (e) {
 setError(e?.response?.data?.error ?? 'Failed to load locked accounts.')
 } finally { setLoading(false) }
 }, [])

 useEffect(() => { fetchLocked() }, [fetchLocked])

 /* show toast helper */
 const showToast = (msg, ok = true) => {
 setToast({ msg, ok })
 setTimeout(() => setToast(null), 3500)
 }

 /* unlock a single user */
 const unlock = async (user) => {
 setBusy(b => ({ ...b, [user.id]: true }))
 try {
 await api.patch(`/admin/users/${user.id}/status`, { status: 'active' })
 setUsers(prev => prev.filter(u => u.id !== user.id))
 showToast(` ${user.name} has been unlocked.`, true)
 } catch (e) {
 showToast(` Could not unlock ${user.name}: ${e?.response?.data?.error ?? 'Server error'}`, false)
 } finally {
 setBusy(b => { const n = { ...b }; delete n[user.id]; return n })
 }
 }

 /* unlock ALL visible filtered users */
 const unlockAll = async () => {
 const targets = filtered
 if (!targets.length) return
 if (!window.confirm(`Unlock all ${targets.length} account(s)?`)) return
 setBusy(Object.fromEntries(targets.map(u => [u.id, true])))
 const results = await Promise.allSettled(
 targets.map(u => api.patch(`/admin/users/${u.id}/status`, { status: 'active' }))
 )
 const failed = results.filter(r => r.status === 'rejected').length
 await fetchLocked()
 setBusy({})
 showToast(failed ? ` ${targets.length - failed} unlocked, ${failed} failed.` : ` All ${targets.length} accounts unlocked.`, !failed)
 }

 const filtered = users.filter(u =>
 !search ||
 u.name?.toLowerCase().includes(search.toLowerCase()) ||
 u.email?.toLowerCase().includes(search.toLowerCase()) ||
 u.phone?.includes(search)
 )

 /* -- render -- */
 return (
 <div style={{ padding:'24px 20px', maxWidth:900, margin:'0 auto' }}>

 {/* Toast */}
 {toast && (
 <div style={{
 position:'fixed', top:20, right:20, zIndex:9999,
 background: toast.ok ? 'rgba(16,185,129,.92)' : 'rgba(239,68,68,.92)',
 color:'#fff', padding:'12px 20px', borderRadius:10,
 fontSize:'.875rem', fontWeight:600, boxShadow:'0 4px 20px rgba(0,0,0,.3)',
 animation:'fadeIn .2s ease',
 }}>
 {toast.msg}
 </div>
 )}

 {/* Page header */}
 <div style={{ marginBottom:24 }}>
 <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>
 Locked Accounts
 </h1>
 <p style={{ margin:0, fontSize:'.85rem', color:'var(--sub)' }}>
 Users whose accounts are locked, suspended, or banned. Unlock them to restore access.
 </p>
 </div>

 {/* Controls */}
 <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by name, email or phone..."
 style={{
 flex:1, minWidth:200,
 background:'var(--surface)', border:'1px solid var(--border)',
 borderRadius:'var(--radius)', padding:'9px 14px',
 color:'var(--text)', fontSize:'.875rem', outline:'none',
 }}
 />
 <button
 onClick={fetchLocked}
 style={{ padding:'9px 16px', borderRadius:'var(--radius)', border:'1px solid var(--border)',
 background:'var(--surface)', color:'var(--text)', cursor:'pointer', fontSize:'.875rem', fontWeight:600 }}>
  Refresh
 </button>
 {filtered.length > 1 && (
 <button
 onClick={unlockAll}
 style={{ padding:'9px 18px', borderRadius:'var(--radius)', border:'none',
 background:'#10b981', color:'#fff', cursor:'pointer', fontSize:'.875rem', fontWeight:700 }}>
 Unlock All ({filtered.length})
 </button>
 )}
 </div>

 {/* Summary strip */}
 <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
 {[
 { label:'Locked', key:'locked', bg:'rgba(239,68,68,.12)', fg:'#ef4444' },
 { label:'Suspended', key:'suspended', bg:'rgba(245,158,11,.12)', fg:'#f59e0b' },
 { label:'Banned', key:'banned', bg:'rgba(239,68,68,.12)', fg:'#ef4444' },
 ].map(({ label, key, bg, fg }) => {
 const cnt = users.filter(u => u.status === key).length
 if (!cnt) return null
 return (
 <span key={key} style={{ fontSize:'.78rem', fontWeight:700, padding:'4px 12px', borderRadius:20, background:bg, color:fg }}>
 {cnt} {label}
 </span>
 )
 })}
 </div>

 {/* Table card */}
 <div style={card}>
 <p style={h2style}>
 {loading ? 'Loading...' : `${filtered.length} account${filtered.length !== 1 ? 's' : ''} found`}
 </p>

 {loading && <div style={{ display:'flex', justifyContent:'center', padding:'40px 0' }}><Spinner /></div>}
 {error && <p style={{ color:'#ef4444', fontSize:'.875rem' }}>{error}</p>}

 {!loading && !error && filtered.length === 0 && (
 <div style={{ textAlign:'center', padding:'40px 0', color:'var(--sub)' }}>
 <p style={{ fontSize:'2rem', margin:'0 0 8px' }}></p>
 <p style={{ margin:0, fontWeight:600 }}>No locked accounts</p>
 <p style={{ margin:'4px 0 0', fontSize:'.82rem' }}>All users have normal access.</p>
 </div>
 )}

 {!loading && !error && filtered.length > 0 && (
 <div style={{ overflowX:'auto', maxWidth:'100%', WebkitOverflowScrolling:'touch' }}>
 <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.875rem' , fontSize:'.78rem'}}>
 <thead>
 <tr style={{ borderBottom:'1px solid var(--border)' }}>
 {['User','Role','Status','Locked Since','Actions'].map(h => (
 <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:'.72rem',
 fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:'var(--sub)' }}>
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map(u => (
 <tr key={u.id} style={{ borderBottom:'1px solid var(--border)' }}>
 {/* User */}
 <td style={{ padding:'12px 12px' }}>
 <div style={{ display:'flex', alignItems:'center', gap:10 }}>
 <div style={{
 width:34, height:34, borderRadius:'50%',
 background:'rgba(99,102,241,.18)', border:'1px solid rgba(99,102,241,.3)',
 display:'flex', alignItems:'center', justifyContent:'center',
 fontWeight:800, fontSize:'.875rem', color:'#6366f1', flexShrink:0,
 }}>
 {u.name?.[0]?.toUpperCase() ?? '?'}
 </div>
 <div>
 <p style={{ margin:0, fontWeight:600, color:'var(--text)' }}>{u.name}</p>
 <p style={{ margin:0, fontSize:'.72rem', color:'var(--sub)' }}>{u.email}</p>
 {u.phone && <p style={{ margin:0, fontSize:'.68rem', color:'var(--sub)' }}>{u.phone}</p>}
 </div>
 </div>
 </td>

 {/* Role */}
 <td style={{ padding:'12px 12px' }}>
 <RoleBadge role={u.role} />
 </td>

 {/* Status */}
 <td style={{ padding:'12px 12px' }}>
 <StatusBadge status={u.status} />
 </td>

 {/* Locked since */}
 <td style={{ padding:'12px 12px', color:'var(--sub)', fontSize:'.8rem' }}>
 {u.updated_at
 ? new Date(u.updated_at).toLocaleString()
 : u.created_at
 ? new Date(u.created_at).toLocaleString()
 : '--'}
 </td>

 {/* Actions */}
 <td style={{ padding:'12px 12px' }}>
 <button
 disabled={!!busy[u.id]}
 onClick={() => unlock(u)}
 style={{
 padding:'7px 16px', borderRadius:8, border:'none', cursor: busy[u.id] ? 'default' : 'pointer',
 background: busy[u.id] ? 'var(--border)' : '#10b981',
 color: busy[u.id] ? 'var(--sub)' : '#fff',
 fontWeight:700, fontSize:'.78rem', transition:'opacity .2s',
 opacity: busy[u.id] ? .7 : 1,
 }}
 >
 {busy[u.id] ? 'Unlocking...' : ' Unlock'}
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 <style>{`
 @keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
 `}</style>
 </div>
 )
}
