
import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'

const ACTION_COLORS = {
 login: { bg:'#052e16', color:'#4ade80', label:'LOGIN' },
 login_failed: { bg:'#431407', color:'#fb923c', label:'FAILED' },
 login_blocked: { bg:'#450a0a', color:'#f87171', label:'BLOCKED' },
 logout: { bg:'#0c1a2e', color:'#60a5fa', label:'LOGOUT' },
 shutdown: { bg:'#450a0a', color:'#f87171', label:'SHUTDOWN' },
 'approved user':{ bg:'#1a1a2e', color:'#a78bfa', label:'APPROVED' },
}

function Badge({ action }) {
 const key = Object.keys(ACTION_COLORS).find(k => action?.startsWith(k)) || 'other'
 const cfg = ACTION_COLORS[key] || { bg:'var(--surface-hover)', color:'var(--sub)', label: (action||'').toUpperCase().replace(/_/g,' ') }
 return (
 <span style={{
 background: cfg.bg, color: cfg.color,
 padding:'2px 9px', borderRadius:'99px',
 fontWeight:700, fontSize:'.68rem', letterSpacing:'.5px',
 textTransform:'uppercase', whiteSpace:'nowrap'
 }}>{cfg.label || action}</span>
 )
}

function RoleBadge({ role }) {
 const colors = { admin:'#a78bfa', teacher:'#60a5fa', student:'#4ade80', parent:'#fb923c' }
 if (!role) return <span style={{color:'var(--sub)'}}></span>
 return <span style={{ color: colors[role]||'var(--sub)', fontWeight:600, textTransform:'capitalize', fontSize:'.8rem' }}>{role}</span>
}

export default function AdminLogs() {
 const [logs, setLogs] = useState([])
 const [loading, setLoading] = useState(true)
 const [search, setSearch] = useState('')
 const [action, setAction] = useState('')
 const [role, setRole] = useState('')
 const [from, setFrom] = useState('')
 const [to, setTo] = useState('')
 const [limit, setLimit] = useState(200)

 const fetchLogs = useCallback(async () => {
 setLoading(true)
 try {
 const params = new URLSearchParams({ limit })
 if (search) params.set('search', search)
 if (action) params.set('action', action)
 if (role) params.set('role', role)
 if (from) params.set('from', from)
 if (to) params.set('to', to)
 const r = await api.get('/system/logs?' + params.toString())
 setLogs(r.data)
 } catch {}
 setLoading(false)
 }, [search, action, role, from, to, limit])

 async function clearLogs() {
 if (!window.confirm('Delete ALL logs permanently? This cannot be undone.')) return
 try {
 await api.delete('/system/logs')
 await fetchLogs()
 } catch { alert('Failed to delete logs') }
 }

 useEffect(() => { fetchLogs() }, [fetchLogs])

 const stats = {
 total: logs.length,
 logins: logs.filter(l => l.action === 'login').length,
 failed: logs.filter(l => l.action === 'login_failed').length,
 blocked: logs.filter(l => l.action === 'login_blocked').length,
 logouts: logs.filter(l => l.action === 'logout').length,
 }

 const inputStyle = {
 background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px',
 color:'var(--text)', padding:'7px 12px', fontSize:'.82rem', outline:'none'
 }

 return (
 <div style={{ maxWidth:'1200px' }}>

 {/* Header */}
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px', letterSpacing:'-0.4px' }}>
 System Logs
 </h1>
 <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>
 Real-time audit trail all logins, logouts, failures and admin actions
 </p>
 </div>

 {/* Stat cards */}
 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px', marginBottom:'24px' }}>
 {[
 { label:'Total Events', value:stats.total, color:'#a78bfa' },
 { label:'Logins', value:stats.logins, color:'#4ade80' },
 { label:'Failed', value:stats.failed, color:'#fb923c' },
 { label:'Blocked', value:stats.blocked, color:'#f87171' },
 { label:'Logouts', value:stats.logouts, color:'#60a5fa' },
 ].map(s => (
 <div key={s.label} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px' }}>
 <p style={{ margin:'0 0 4px', fontSize:'.75rem', color:'var(--sub)', textTransform:'uppercase', letterSpacing:'.4px' }}>{s.label}</p>
 <p style={{ margin:0, fontSize:'1.6rem', fontWeight:800, color:s.color }}>{s.value}</p>
 </div>
 ))}
 </div>

 {/* Filters */}
 <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px', marginBottom:'16px', display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'center' }}>
 <input style={{...inputStyle, flex:'1', minWidth:'160px'}}
 placeholder=" Search name, action, IP"
 value={search} onChange={e=>setSearch(e.target.value)} />

 <select style={inputStyle} value={action} onChange={e=>setAction(e.target.value)}>
 <option value="">All Events</option>
 <option value="login">Login</option>
 <option value="login_failed">Failed Login</option>
 <option value="login_blocked">Blocked</option>
 <option value="logout">Logout</option>
 <option value="shutdown">Shutdown</option>
 </select>

 <select style={inputStyle} value={role} onChange={e=>setRole(e.target.value)}>
 <option value="">All Roles</option>
 <option value="admin">Admin</option>
 <option value="teacher">Teacher</option>
 <option value="student">Student</option>
 <option value="parent">Parent</option>
 </select>

 <input type="date" style={inputStyle} value={from} onChange={e=>setFrom(e.target.value)} title="From date" />
 <input type="date" style={inputStyle} value={to} onChange={e=>setTo(e.target.value)} title="To date" />

 <select style={inputStyle} value={limit} onChange={e=>setLimit(+e.target.value)}>
 <option value={100}>100 rows</option>
 <option value={200}>200 rows</option>
 <option value={500}>500 rows</option>
 </select>

 <button onClick={fetchLogs} style={{
 background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px',
 padding:'7px 16px', fontWeight:600, cursor:'pointer', fontSize:'.82rem'
 }}>Refresh</button>

 <button onClick={clearLogs} style={{
 background:'#450a0a', color:'#f87171', border:'1px solid #7f1d1d', borderRadius:'8px',
 padding:'7px 16px', fontWeight:600, cursor:'pointer', fontSize:'.82rem', marginLeft:'auto'
 }}> Delete All Logs</button>

 {(search||action||role||from||to) && (
 <button onClick={()=>{setSearch('');setAction('');setRole('');setFrom('');setTo('')}} style={{
 background:'var(--surface-hover)', color:'var(--sub)', border:'none', borderRadius:'8px',
 padding:'7px 12px', cursor:'pointer', fontSize:'.82rem'
 }}> Clear</button>
 )}
 </div>

 {/* Table */}
 <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden' }}>
 {loading ? (
 <div style={{ padding:'48px', display:'flex', justifyContent:'center' }}><Spinner /></div>
 ) : logs.length === 0 ? (
 <div style={{ padding:'48px', textAlign:'center', color:'var(--sub)' }}>No log entries found.</div>
 ) : (
 <div style={{ overflowX:'auto' }}>
 <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
 <thead>
 <tr style={{ borderBottom:'1px solid var(--border)' }}>
 {['Time','Event','User','Role','Email','IP','Attempts'].map(h=>(
 <th key={h} style={{
 padding:'11px 14px', textAlign:'left', color:'var(--sub)',
 fontWeight:600, fontSize:'.72rem', textTransform:'uppercase',
 letterSpacing:'.4px', whiteSpace:'nowrap'
 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {logs.map((l,i) => {
 const isAlert = l.action==='login_failed'||l.action==='login_blocked'
 return (
 <tr key={l.id||i}
 style={{
 borderBottom:'1px solid var(--border)',
 background: isAlert ? 'rgba(239,68,68,.04)' : 'transparent',
 transition:'background .1s'
 }}
 onMouseEnter={e=>e.currentTarget.style.background = isAlert?'rgba(239,68,68,.09)':'var(--surface)'}
 onMouseLeave={e=>e.currentTarget.style.background = isAlert?'rgba(239,68,68,.04)':'transparent'}>

 <td style={{ padding:'10px 14px', color:'var(--sub)', whiteSpace:'nowrap', fontFamily:'monospace', fontSize:'.75rem' }}>
 {new Date(l.timestamp).toLocaleString()}
 </td>
 <td style={{ padding:'10px 14px' }}>
 <Badge action={l.action} />
 </td>
 <td style={{ padding:'10px 14px', color:'var(--text)', fontWeight:500 }}>
 {l.user_name || <span style={{color:'var(--sub)'}}></span>}
 </td>
 <td style={{ padding:'10px 14px' }}>
 <RoleBadge role={l.role} />
 </td>
 <td style={{ padding:'10px 14px', color:'var(--sub)', fontSize:'.75rem' }}>
 {l.email || ''}
 </td>
 <td style={{ padding:'10px 14px', color:'var(--sub)', fontFamily:'monospace', fontSize:'.75rem' }}>
 {l.ip || ''}
 </td>
 <td style={{ padding:'10px 14px', textAlign:'center' }}>
 {l.action==='login_failed'||l.action==='login_blocked'
 ? <span style={{ color:'#f87171', fontWeight:700 }}>
 {l.meta?.attempts || ''}/3
 </span>
 : <span style={{color:'var(--sub)'}}></span>}
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>

 <p style={{ marginTop:'10px', color:'var(--sub)', fontSize:'.75rem', textAlign:'right' }}>
 Showing {logs.length} entries
 </p>
 </div>
 )
}
