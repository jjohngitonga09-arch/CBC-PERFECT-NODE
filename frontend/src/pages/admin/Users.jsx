import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'

const S = {
 card: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 18px', boxShadow:'var(--shadow)' },
 badge: (c) => ({ fontSize:'.7rem', fontWeight:700, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.fg }),
 btn: (c) => ({ background:c.bg, border:`1px solid ${c.bd}`, color:c.fg, padding:'5px 12px', borderRadius:8, fontSize:'.78rem', fontWeight:600, cursor:'pointer', transition:'opacity .15s' }),
}
const SC = {
 active: { bg:'rgba(16,185,129,.12)', fg:'#10b981', bd:'rgba(16,185,129,.3)' },
 pending: { bg:'rgba(245,158,11,.12)', fg:'#f59e0b', bd:'rgba(245,158,11,.3)' },
 locked: { bg:'rgba(239,68,68,.12)', fg:'#ef4444', bd:'rgba(239,68,68,.3)' },
 suspended: { bg:'rgba(139,92,246,.12)', fg:'#8b5cf6', bd:'rgba(139,92,246,.3)' },
 bin: { bg:'rgba(107,114,128,.12)', fg:'#6b7280', bd:'rgba(107,114,128,.3)' },
 danger: { bg:'rgba(239,68,68,.15)', fg:'#ef4444', bd:'rgba(239,68,68,.4)' },
}

const ROLES = ['teacher','student','guardian']
const ROLE_LABELS = { teacher:'Teachers', student:'Students', guardian:'Parents' }

export default function AdminUsers() {
 const [tab, setTab] = useState('pending')
 const [users, setUsers] = useState([])
 const [pending, setPending] = useState([])
 const [bin, setBin] = useState([])
 const [loading, setLoading] = useState(true)
 const [search, setSearch] = useState('')
 const [roleFilter, setRoleFilter] = useState('all')
 const [suspendId, setSuspendId] = useState(null)
 const [suspendDays, setSuspendDays] = useState(1)
 const [roleLocks, setRoleLocks] = useState({})
 const [exemptMap, setExemptMap] = useState({})
 const [lockingRole, setLockingRole] = useState(null)

 // -- Confirm delete modal state ---------------------------------
 const [deleteTarget, setDeleteTarget] = useState(null) // { id, name }

 async function load() {
 setLoading(true)
 try {
 const [uRes, pRes, bRes, sRes] = await Promise.all([
 api.get('/admin/users'),
 api.get('/auth/admin/pending'),
 api.get('/admin/bin'),
 api.get('/admin/settings'),
 ])
 setUsers(uRes.data)
 setPending(pRes.data)
 setBin(bRes.data)
 const locks = {}
 const exmps = {}
 for (const role of ROLES) {
 locks[role] = !!sRes.data[`dashboard_locked_${role}`]
 const raw = sRes.data[`dashboard_lock_exempt_${role}`]
 exmps[role] = new Set(Array.isArray(raw) ? raw : [])
 }
 setRoleLocks(locks)
 setExemptMap(exmps)
 } catch { toast.error('Could not load users') }
 finally { setLoading(false) }
 }

 useEffect(() => { load() }, [])

 async function act(id, type, extra = {}) {
 try {
 if (type === 'approve' || type === 'reject') {
 await api.put(`/auth/admin/${type}/${id}`, extra)
 } else if (type === 'lock' || type === 'unlock') {
 await api.put(`/auth/admin/${type}/${id}`)
 } else {
 await api.put(`/admin/users/${id}/${type}`, extra)
 }
 toast.success('Done ')
 load()
 } catch(e) { toast.error(e.response?.data?.error || 'Action failed') }
 }

 // -- Permanently delete from bin --------------------------------
 async function hardDeleteFromBin(id) {
 if (!confirm('Permanently delete this user? This cannot be undone.')) return
 try { await api.delete(`/admin/bin/${id}`); toast.success('Permanently deleted'); load() }
 catch { toast.error('Delete failed') }
 }

 // -- Permanently delete directly (from All Users tab) ----------
 async function permanentDelete(id) {
 try {
 await api.delete(`/users/${id}`)
 toast.success('User permanently deleted')
 setDeleteTarget(null)
 load()
 } catch(e) {
 toast.error(e.response?.data?.error || 'Delete failed')
 setDeleteTarget(null)
 }
 }

 async function toggleRoleLock(role) {
 const isLocked = roleLocks[role]
 const newLocked = !isLocked
 try {
 if (newLocked) {
 const exempt = Array.from(exemptMap[role] || [])
 await api.put(`/admin/roles/${role}/lock`, { exempt })
 toast.success(`${ROLE_LABELS[role]} dashboard locked they are being logged out`)
 } else {
 await api.put(`/admin/roles/${role}/unlock`)
 toast.success(`${ROLE_LABELS[role]} dashboard unlocked`)
 }
 setRoleLocks(prev => ({ ...prev, [role]: newLocked }))
 } catch { toast.error('Role lock failed') }
 }

 function toggleExempt(role, userId) {
 setExemptMap(prev => {
 const s = new Set(prev[role])
 s.has(userId) ? s.delete(userId) : s.add(userId)
 return { ...prev, [role]: s }
 })
 }

 const filtered = users.filter(u => {
 if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) &&
 !u.email?.toLowerCase().includes(search.toLowerCase()) &&
 !u.role?.toLowerCase().includes(search.toLowerCase())) return false
 if (roleFilter !== 'all' && u.role !== roleFilter) return false
 return true
 })

 if (loading) return <Spinner />

 const tabStyle = (t) => ({
 padding:'8px 16px', borderRadius:50, border:'none', cursor:'pointer',
 fontWeight:700, fontSize:'.8rem', fontFamily:'inherit', transition:'.15s',
 background: tab===t ? 'var(--accent)' : 'var(--surface)',
 color: tab===t ? '#fff' : 'var(--sub)',
 boxShadow: tab===t ? 'var(--shadow)' : 'none',
 })

 return (
 <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

 {/* Header */}
 <div>
 <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>User Management</h1>
 <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>
 {users.length} total {pending.length} pending {bin.length} in bin
 </p>
 </div>

 {/* Role Dashboard Lock Panel */}
 <div style={{ ...S.card, display:'flex', flexDirection:'column', gap:14 }}>
 <p style={{ fontWeight:700, fontSize:'.95rem', color:'var(--text)', margin:0 }}>
 Dashboard Access Control
 </p>
 <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:'-8px 0 0' }}>
 Locking a dashboard instantly kicks all active users of that role.
 </p>
 {ROLES.map(role => {
 const locked = roleLocks[role]
 const usersOfRole = users.filter(u => u.role === role)
 return (
 <div key={role} style={{ display:'flex', flexDirection:'column', gap:8, padding:'12px 0', borderTop:'1px solid var(--border)' }}>
 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
 <div>
 <span style={{ fontWeight:700, color:'var(--text)', fontSize:'.9rem' }}>{ROLE_LABELS[role]}</span>
 <span style={{ fontSize:'.75rem', color:'var(--sub)', marginLeft:8 }}>
 {usersOfRole.length} users {Array.from(exemptMap[role]||[]).length} exempt
 </span>
 </div>
 <div style={{ display:'flex', alignItems:'center', gap:10 }}>
 {locked && (
 <span style={{ fontSize:'.72rem', fontWeight:600, color:'#ef4444', background:'rgba(239,68,68,.1)', padding:'3px 10px', borderRadius:20 }}>
 LOCKED
 </span>
 )}
 <button
 onClick={() => toggleRoleLock(role)}
 style={{ ...S.btn(locked ? SC.active : SC.locked), padding:'6px 16px', fontSize:'.82rem' }}
 >
 {locked ? ' Unlock' : ' Lock All'}
 </button>
 <button
 onClick={() => setLockingRole(lockingRole===role ? null : role)}
 style={{ ...S.btn(SC.pending), padding:'6px 12px', fontSize:'.78rem' }}
 >
 {lockingRole===role ? 'Hide' : 'Exemptions'}
 </button>
 </div>
 </div>
 {lockingRole === role && (
 <div style={{ background:'var(--bg)', borderRadius:10, padding:12, display:'flex', flexWrap:'wrap', gap:6 }}>
 <p style={{ width:'100%', fontSize:'.75rem', color:'var(--sub)', margin:'0 0 6px' }}>
 Tick users who will NOT be locked:
 </p>
 {usersOfRole.map(u => {
 const on = exemptMap[role]?.has(u.id)
 return (
 <button key={u.id} onClick={() => toggleExempt(role, u.id)} style={{
 padding:'4px 12px', borderRadius:20, border:'1px solid var(--border)',
 background: on ? 'rgba(99,102,241,.15)' : 'var(--surface)',
 color: on ? 'var(--accent)' : 'var(--sub)',
 fontSize:'.75rem', fontWeight:600, cursor:'pointer',
 }}>
 {on ? ' ' : ''}{u.name || u.email}
 </button>
 )
 })}
 </div>
 )}
 </div>
 )
 })}
 </div>

 {/* Tabs */}
 <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
 {[['pending',' Pending', pending.length],['all',' All Users',null],['bin',' Bin',bin.length]].map(([t,label,count]) => (
 <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
 {label}
 {count != null && (
 <span style={{ marginLeft:6, background:'rgba(255,255,255,.2)', borderRadius:50, padding:'1px 7px', fontSize:'.7rem' }}>
 {count}
 </span>
 )}
 </button>
 ))}
 </div>

 {/* PENDING TAB */}
 {tab === 'pending' && (
 pending.length === 0
 ? <div style={{ textAlign:'center', padding:'48px', color:'var(--sub)' }}>
 <div style={{ fontSize:'2.5rem', marginBottom:8 }}></div>
 <p style={{ fontWeight:600, color:'var(--sub)', margin:0 }}>No pending users</p>
 </div>
 : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
 {pending.map(u => (
 <div key={u.id} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
 <div style={{ flex:1, minWidth:150 }}>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px' }}>{u.name}</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
 {u.role} {u.email || u.phone || ''}
 </p>
 <p style={{ fontSize:'.7rem', color:'var(--sub)', margin:'2px 0 0' }}>
 {new Date(u.created_at).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})}
 </p>
 </div>
 <span style={S.badge(SC.pending)}>pending</span>
 <div style={{ display:'flex', gap:6 }}>
 <button onClick={() => act(u.id,'approve')} style={S.btn(SC.active)}> Approve</button>
 <button onClick={() => { const r=window.prompt('Reason (optional):'); if(r!==null) act(u.id,'reject',{reason:r}) }} style={S.btn(SC.locked)}> Reject</button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* ALL USERS TAB */}
 {tab === 'all' && (
 <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
 <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
 <input
 value={search} onChange={e => setSearch(e.target.value)}
 placeholder="Search name, email, role"
 style={{ flex:1, minWidth:180, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 14px', color:'var(--text)', fontSize:'.88rem', outline:'none' }}
 />
 {['all',...ROLES].map(r => (
 <button key={r} onClick={() => setRoleFilter(r)} style={{
 padding:'8px 14px', borderRadius:50, border:'none', cursor:'pointer',
 fontWeight:700, fontSize:'.78rem', fontFamily:'inherit',
 background: roleFilter===r ? 'var(--accent)' : 'var(--surface)',
 color: roleFilter===r ? '#fff' : 'var(--sub)',
 boxShadow: roleFilter===r ? 'var(--shadow)' : 'none',
 }}>
 {r === 'all' ? 'All' : ROLE_LABELS[r]}
 </button>
 ))}
 </div>

 {filtered.length === 0 && <p style={{ color:'var(--sub)', fontSize:'.875rem' }}>No users found.</p>}

 {filtered.map(u => {
 const sc = SC[u.status] || SC.pending
 return (
 <div key={u.id} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
 <div style={{ flex:1, minWidth:150 }}>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px' }}>{u.name}</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
 {u.role} {u.email || u.phone || ''}
 </p>
 {u.status==='suspended' && u.suspended_until && (
 <p style={{ fontSize:'.7rem', color:'#8b5cf6', margin:'2px 0 0' }}>
 Until {new Date(u.suspended_until).toLocaleDateString()}
 </p>
 )}
 </div>

 <span style={S.badge(sc)}>{u.status}</span>

 <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
 {u.status === 'pending' && <button onClick={() => act(u.id,'approve')} style={S.btn(SC.active)}>Approve</button>}
 {u.status === 'active' && <button onClick={() => act(u.id,'lock')} style={S.btn(SC.locked)}> Lock</button>}
 {u.status === 'locked' && <button onClick={() => act(u.id,'unlock')} style={S.btn(SC.active)}> Unlock</button>}
 {u.status === 'suspended' && <button onClick={() => act(u.id,'unsuspend')} style={S.btn(SC.active)}> Unsuspend</button>}
 {u.status === 'active' && <button onClick={() => setSuspendId(u.id)} style={S.btn(SC.suspended)}> Suspend</button>}
 <button onClick={() => { if(confirm('Move to bin?')) act(u.id,'bin') }} style={S.btn(SC.bin)}> Bin</button>
 {/* -- Permanent Delete -- */}
 <button
 onClick={() => setDeleteTarget({ id: u.id, name: u.name || u.email })}
 style={S.btn(SC.danger)}
 >
 Delete
 </button>
 </div>
 </div>
 )
 })}
 </div>
 )}

 {/* BIN TAB */}
 {tab === 'bin' && (
 <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
 {bin.length === 0 && <p style={{ color:'var(--sub)', fontSize:'.875rem' }}>Bin is empty.</p>}
 {bin.map(u => (
 <div key={u.id} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', opacity:.8 }}>
 <div style={{ flex:1, minWidth:150 }}>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px' }}>{u.name}</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
 {u.role} {u.email || ''}
 </p>
 </div>
 <span style={S.badge(SC.bin)}>deleted</span>
 <div style={{ display:'flex', gap:6 }}>
 <button onClick={() => { api.put(`/admin/bin/${u.id}/restore`).then(()=>{toast.success('Restored'); load()}).catch(()=>toast.error('Failed')) }}
 style={S.btn(SC.active)}> Restore</button>
 <button onClick={() => hardDeleteFromBin(u.id)} style={S.btn(SC.locked)}> Delete Forever</button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* -- Suspend modal --------------------------------------- */}
 {suspendId && (
 <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
 <div style={{ background:'var(--surface)', borderRadius:'var(--radius)', padding:28, maxWidth:340, width:'90%', boxShadow:'var(--shadow-hover)' }}>
 <h3 style={{ color:'var(--text)', margin:'0 0 16px', fontWeight:800 }}> Suspend User</h3>
 <label style={{ fontSize:'.85rem', color:'var(--sub)', display:'block', marginBottom:6 }}>Suspend for how many days?</label>
 <input type="number" min={1} max={365} value={suspendDays} onChange={e => setSuspendDays(Number(e.target.value))}
 style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'1rem', outline:'none', marginBottom:16 }} />
 <div style={{ display:'flex', gap:8 }}>
 <button onClick={() => { act(suspendId,'suspend',{days:suspendDays}); setSuspendId(null) }}
 style={{ ...S.btn(SC.suspended), flex:1, padding:'10px', fontSize:'.9rem', justifyContent:'center', display:'flex' }}>
 Suspend {suspendDays}d
 </button>
 <button onClick={() => setSuspendId(null)} style={{ ...S.btn(SC.bin), flex:1, padding:'10px', fontSize:'.9rem' }}>
 Cancel
 </button>
 </div>
 </div>
 </div>
 )}

 {/* -- Permanent Delete Confirmation Modal ----------------- */}
 {deleteTarget && (
 <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
 <div style={{ background:'var(--surface)', borderRadius:'var(--radius)', padding:28, maxWidth:380, width:'90%', boxShadow:'var(--shadow-hover)', border:'1px solid rgba(239,68,68,.3)' }}>
 <div style={{ fontSize:'2.2rem', marginBottom:12, textAlign:'center' }}></div>
 <h3 style={{ color:'#ef4444', margin:'0 0 10px', fontWeight:800, textAlign:'center' }}>Permanently Delete User</h3>
 <p style={{ color:'var(--sub)', fontSize:'.88rem', textAlign:'center', margin:'0 0 20px', lineHeight:1.6 }}>
 You are about to permanently delete <strong style={{ color:'var(--text)' }}>{deleteTarget.name}</strong>.
 <br/>This <strong>cannot be undone</strong>. All their data will be gone forever.
 </p>
 <div style={{ display:'flex', gap:10 }}>
 <button
 onClick={() => permanentDelete(deleteTarget.id)}
 style={{ ...S.btn(SC.danger), flex:1, padding:'11px', fontSize:'.9rem', display:'flex', justifyContent:'center', fontWeight:800 }}
 >
 Yes, Delete Forever
 </button>
 <button
 onClick={() => setDeleteTarget(null)}
 style={{ ...S.btn(SC.bin), flex:1, padding:'11px', fontSize:'.9rem', display:'flex', justifyContent:'center' }}
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 )
}
