import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import KpiCard from '../../components/dashboard/KpiCard'

const card = { background:'var(--surface)', border:'1px solid var(--border)',
  borderRadius:'var(--radius)', padding:'20px', boxShadow:'var(--shadow)' }
const h2 = { fontSize:'1rem', fontWeight:700, color:'var(--text)', margin:'0 0 14px' }
const mkBadge = (bg, fg) => ({ fontSize:'.7rem', fontWeight:600, padding:'3px 9px', borderRadius:20,
  background:bg, color:fg, flexShrink:0, whiteSpace:'nowrap' })

const SC = s =>
  s === 'active' ? { bg:'rgba(16,185,129,.12)', fg:'#10b981' } :
  s === 'pending' ? { bg:'rgba(245,158,11,.12)', fg:'#f59e0b' } :
  { bg:'rgba(239,68,68,.12)', fg:'#ef4444' }

const ALERT_COLOR = { failed_login:'#f59e0b', account_locked:'#ef4444',
  suspicious_activity:'#ef4444', login_blocked:'#f59e0b' }
const ROLE_COLOR = { student:'#6366f1', teacher:'#10b981', parent:'#f59e0b', admin:'#ef4444' }

const QUICK = [
  { to:'/admin/users', icon:'U', label:'Users' },
  { to:'/admin/subscriptions', icon:'S', label:'Subscriptions' },
  { to:'/admin/payments', icon:'P', label:'Payments' },
  { to:'/admin/messages', icon:'M', label:'Messages' },
  { to:'/admin/logs', icon:'L', label:'Logs' },
  { to:'/admin/system-settings', icon:'G', label:'Settings' },
]

function Loader() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'60vh', gap:16 }}>
      <style>{`@keyframes kspin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid var(--border)',
        borderTopColor:'#6366f1', animation:'kspin .8s linear infinite' }} />
      <p style={{ color:'var(--sub)', fontSize:'.875rem', margin:0 }}>Loading dashboard...</p>
    </div>
  )
}

function RingChart({ segments, size = 120 }) {
  const r = 44, cx = 60, cy = 60, stroke = 14, circ = 2 * Math.PI * r
  let offset = 0
  const total = segments.reduce((s, g) => s + g.value, 0) || 1
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={-offset} strokeLinecap="round"
          style={{ transform:'rotate(-90deg)', transformOrigin:'center' }} />
        offset += dash; return el
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text)" fontSize="18" fontWeight="800">{total}</text>
    </svg>
  )
}

function MiniBar({ label, value, max, color }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0
  return (
    <div style={{ marginBottom:'10px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
        <span style={{ fontSize:'.8rem', color:'var(--sub)' }}>{label}</span>
        <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--text)' }}>{value?.toLocaleString?.() ?? value}</span>
      </div>
      <div style={{ height:'6px', borderRadius:'99px', background:'var(--border)', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, borderRadius:'99px', background:color, transition:'width .6s' }} />
      </div>
    </div>
  )
}

function Sparkline({ data = [], color = '#10b981', height = 60 }) {
  if (!data.length) return <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:0 }}>No data yet</p>
  const vals = data.map(d => Number(d.total) || 0)
  const max = Math.max(...vals, 1), min = Math.min(...vals)
  const W = 300, H = height, pad = 6
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1 || 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow:'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {vals.map((v, i) => {
        const x = pad + (i / (vals.length - 1 || 1)) * (W - pad * 2)
        const y = H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2)
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />
      })}
    </svg>
  )
}

function BarChart({ data = [], color = '#6366f1', height = 80 }) {
  if (!data.length) return <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:0 }}>No data yet</p>
  const vals = data.map(d => Number(d.count) || 0)
  const max = Math.max(...vals, 1)
  const W = 300, H = height, gap = 2, bw = (W / vals.length) - gap
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {vals.map((v, i) => {
        const bh = Math.max(2, (v / max) * (H - 8))
        return <rect key={i} x={i * (bw + gap)} y={H - bh} width={bw} height={bh} rx="2" fill={color} opacity=".85" />
      })}
    </svg>
  )
}

function GlobalSearch() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const wrapRef = useRef(), timer = useRef()

  useEffect(() => {
    const close = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const search = v => {
    setQ(v); clearTimeout(timer.current)
    if (v.length < 2) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      setBusy(true)
      try {
        const { data } = await api.get(`/admin/search?q=${encodeURIComponent(v)}`)
        setResults(data); setOpen(true)
      } catch { } finally { setBusy(false) }
    }, 300)
  }

  return (
    <div ref={wrapRef} style={{ position:'relative', flex:1, maxWidth:440 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, ...card, padding:'10px 14px' }}>
        <span>&#128269;</span>
        <input value={q} onChange={e => search(e.target.value)} placeholder="Search users..."
          style={{ flex:1, border:'none', background:'transparent', outline:'none',
            color:'var(--text)', fontSize:'.875rem' }} />
        {busy && <span style={{ fontSize:'.72rem', color:'var(--sub)' }}>searching...</span>}
      </div>
      {open && results.length > 0 && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, zIndex:99,
          ...card, padding:'6px 0', maxHeight:300, overflowY:'auto' }}>
          {results.map(u => {
            const sc = SC(u.status)
            return (
              <Link key={u.id} to={`/admin/users/${u.id}`}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'10px 16px', textDecoration:'none', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:'.875rem', fontWeight:600, color:'var(--text)' }}>{u.name}</p>
                  <p style={{ margin:0, fontSize:'.72rem', color:'var(--sub)', textTransform:'capitalize' }}>
                    {u.role} &middot; {u.email || u.phone || ''}
                  </p>
                </div>
                <span style={mkBadge(sc.bg, sc.fg)}>{u.status}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminHome() {
  const [kpis, setKpis] = useState(null)
  const [online, setOnline] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState([])
  const [revTrend, setRevTrend] = useState([])
  const [alerts, setAlerts] = useState([])
  const [userGrowth, setUserGrowth] = useState([])
  const [subHealth, setSubHealth] = useState(null)
  const [roleBreak, setRoleBreak] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [trendDays, setTrendDays] = useState(7)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [approvingId, setApprovingId] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [exportingType, setExportingType] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentLogs, setRecentLogs] = useState([])

  const fetchAll = useCallback(() => {
    setLoading(true)
    const qs = dateFrom && dateTo ? `&from=${dateFrom}&to=${dateTo}` : ''
    Promise.allSettled([
      api.get('/dashboard/admin/kpis'),
      api.get('/admin/online'),
      api.get(`/dashboard/admin/revenue-trend?days=${trendDays}${qs}`),
      api.get('/admin/alerts'),
      api.get(`/dashboard/admin/user-growth?days=30${qs}`),
      api.get('/dashboard/admin/subscription-health'),
      api.get('/dashboard/admin/role-breakdown'),
      api.get('/admin/pending'),
      api.get('/admin/recent-users'),
      api.get('/admin/recent-logs'),
    ]).then(([k, o, rt, al, ug, sh, rb, p, ru, rl]) => {
      if (k.status === 'fulfilled') setKpis(k.value.data)
      if (o.status === 'fulfilled') setOnline(o.value.data.count || 0)
      if (rt.status === 'fulfilled') setRevTrend(rt.value.data)
      if (al.status === 'fulfilled') setAlerts(al.value.data)
      if (ug.status === 'fulfilled') setUserGrowth(ug.value.data)
      if (sh.status === 'fulfilled') setSubHealth(sh.value.data)
      if (rb.status === 'fulfilled') setRoleBreak(rb.value.data)
      if (p.status === 'fulfilled') setPending(p.value.data)
      if (ru.status === 'fulfilled') setRecentUsers(ru.value.data)
      if (rl.status === 'fulfilled') setRecentLogs(rl.value.data)
      setLastRefresh(new Date())
    }).finally(() => setLoading(false))
  }, [trendDays, dateFrom, dateTo])

  useEffect(() => { fetchAll() }, [fetchAll])

  const approve = async id => {
    setApprovingId(id)
    try {
      await api.post(`/admin/users/${id}/approve`)
      fetchAll()
    } catch { } finally { setApprovingId(null) }
  }

  const reject = async id => {
    setRejectingId(id)
    try {
      await api.post(`/admin/users/${id}/reject`)
      fetchAll()
    } catch { } finally { setRejectingId(null) }
  }

  const exportCSV = async type => {
    setExportingType(type)
    try {
      const res = await api.get(`/admin/export/${type}`, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url; a.download = `${type}-export-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    } catch (e) { alert('Export failed: ' + (e.response?.data?.error || e.message)) }
    finally { setExportingType(null) }
  }

  const refreshLabel = () => {
    if (!lastRefresh) return ''
    const mins = Math.floor((Date.now() - lastRefresh.getTime()) / 60000)
    return mins === 0 ? 'Updated just now' : `Updated ${mins}m ago`
  }

  if (loading) return <Loader />

  const revenue = kpis?.revenue?.total ? Number(kpis.revenue.total) : 0
  const tu = kpis?.users || {}
  const ringSegs = [
    { label:'Active', value: tu.active || 0, color:'#10b981' },
    { label:'Pending', value: tu.pending || 0, color:'#f59e0b' },
    { label:'Locked', value: tu.locked || 0, color:'#ef4444' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.65rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px', letterSpacing:'-0.4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize:'.875rem', color:'var(--text)', margin:0 }}>System overview &amp; controls</p>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center', justifyContent:'flex-end' }}>
          {lastRefresh && <span style={{ fontSize:'.72rem', color:'var(--sub)' }}>{refreshLabel()}</span>}
          <button onClick={fetchAll} style={{ background:'var(--surface)', border:'1px solid var(--border)',
            color:'var(--text)', padding:'7px 12px', borderRadius:10, fontSize:'.8rem', fontWeight:600, cursor:'pointer' }}>
            Refresh
          </button>
          <button onClick={() => exportCSV('users')} disabled={exportingType === 'users'} style={{
            background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)',
            padding:'7px 12px', borderRadius:10, fontSize:'.8rem', fontWeight:600, cursor:'pointer' }}>
            {exportingType === 'users' ? '...' : 'Export Users'}
          </button>
          <button onClick={() => exportCSV('payments')} disabled={exportingType === 'payments'} style={{
            background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)',
            padding:'7px 12px', borderRadius:10, fontSize:'.8rem', fontWeight:600, cursor:'pointer' }}>
            {exportingType === 'payments' ? '...' : 'Export Payments'}
          </button>
          <span style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(16,185,129,0.1)',
            border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', padding:'7px 12px', borderRadius:10,
            fontSize:'.8rem', fontWeight:600 }}>
            {online} online
          </span>
          <Link to="/admin/shutdown" style={{ display:'flex', alignItems:'center', gap:6,
            background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', color:'#ef4444',
            padding:'8px 14px', borderRadius:10, textDecoration:'none', fontSize:'.875rem', fontWeight:600 }}>
            Shutdown
          </Link>
        </div>
      </div>

      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <GlobalSearch />
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ ...card, padding:'9px 12px', fontSize:'.8rem', color:'var(--text)', cursor:'pointer' }} />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ ...card, padding:'9px 12px', fontSize:'.8rem', color:'var(--text)', cursor:'pointer' }} />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo('') }}
              style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'.8rem', fontWeight:700 }}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <p style={h2}>System Overview</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(45%,160px),1fr))', gap:14 }}>
          <KpiCard icon="A" label="Active" value={tu.active} color="green" />
          <KpiCard icon="P" label="Pending" value={tu.pending} color="yellow" />
          <KpiCard icon="L" label="Locked" value={tu.locked} color="red" />
          <KpiCard icon="$" label="Revenue" value={revenue ? `KES ${revenue.toLocaleString()}` : '--'} color="green" />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
        <div style={card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <p style={{ ...h2, margin:0 }}>Pending Approvals</p>
            <span style={mkBadge('rgba(245,158,11,.12)', '#f59e0b')}>{pending.length} waiting</span>
          </div>
          {pending.length === 0
            ? <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>No pending approvals</p>
            : pending.map(u => (
              <div key={u.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'11px 0', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:'.875rem', fontWeight:600, color:'var(--text)' }}>{u.name}</p>
                  <p style={{ margin:0, fontSize:'.72rem', color:'var(--sub)', textTransform:'capitalize' }}>
                    {u.role} &middot; {u.email || u.phone || ''}
                  </p>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={() => approve(u.id)} disabled={approvingId === u.id} style={{
                    background:'rgba(16,185,129,.15)', border:'1px solid rgba(16,185,129,.3)', color:'#10b981',
                    padding:'5px 10px', borderRadius:8, fontSize:'.75rem', fontWeight:700, cursor:'pointer',
                    opacity: approvingId === u.id ? .5 : 1 }}>
                    {approvingId === u.id ? '...' : 'Approve'}
                  </button>
                  <button onClick={() => reject(u.id)} disabled={rejectingId === u.id} style={{
                    background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', color:'#ef4444',
                    padding:'5px 10px', borderRadius:8, fontSize:'.75rem', fontWeight:700, cursor:'pointer',
                    opacity: rejectingId === u.id ? .5 : 1 }}>
                    {rejectingId === u.id ? '...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        <div style={card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <p style={{ ...h2, margin:0 }}>Revenue Trend</p>
            <div style={{ display:'flex', gap:4 }}>
              {[7, 30].map(d => (
                <button key={d} onClick={() => setTrendDays(d)} style={{ padding:'4px 10px', borderRadius:8,
                  border:'1px solid var(--border)', fontSize:'.75rem', fontWeight:600, cursor:'pointer',
                  background: trendDays === d ? '#6366f1' : 'var(--surface)',
                  color: trendDays === d ? '#fff' : 'var(--sub)' }}>{d}d</button>
              ))}
            </div>
          </div>
          <Sparkline data={revTrend} color="#10b981" height={70} />
          {revTrend.length > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
              <span style={{ fontSize:'.7rem', color:'var(--sub)' }}>{revTrend[0]?.date}</span>
              <span style={{ fontSize:'.7rem', color:'var(--sub)' }}>{revTrend[revTrend.length - 1]?.date}</span>
            </div>
          )}
          <p style={{ fontSize:'.82rem', color:'var(--sub)', marginTop:10, marginBottom:0 }}>
            Period total: <strong style={{ color:'var(--text)' }}>
              KES {revTrend.reduce((s, d) => s + (Number(d.total) || 0), 0).toLocaleString()}
            </strong>
          </p>
        </div>
      </div>

      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <p style={{ ...h2, margin:0 }}>Alert Centre</p>
        </div>
        {alerts.length === 0
          ? <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>No recent security alerts</p>
          : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
              {alerts.slice(0, 6).map((a, i) => {
                const col = ALERT_COLOR[a.action] || '#6366f1'
                return (
                  <div key={a.id || i} style={{ background:'rgba(0,0,0,.04)', border:`1px solid ${col}33`,
                    borderLeft:`3px solid ${col}`, borderRadius:8, padding:'10px 14px' }}>
                    <p style={{ margin:'0 0 4px', fontSize:'.8rem', fontWeight:700, color:'var(--text)',
                      textTransform:'capitalize' }}>{a.action?.replace(/_/g, ' ')}</p>
                    <p style={{ margin:0, fontSize:'.72rem', color:'var(--sub)' }}>
                      {a.type} &middot; {new Date(a.timestamp || a.created_at).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
          )
        }
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
        <div style={card}>
          <p style={h2}>User Growth (30d)</p>
          <BarChart data={userGrowth} color="#6366f1" height={80} />
          <p style={{ fontSize:'.8rem', color:'var(--sub)', marginTop:8, marginBottom:0 }}>
            New signups: <strong style={{ color:'var(--text)' }}>
              {userGrowth.reduce((s, d) => s + (Number(d.count) || 0), 0)}
            </strong>
          </p>
        </div>
        <div style={card}>
          <p style={h2}>Subscription Health</p>
          {subHealth ? (
            <>
              <MiniBar label="Expiring this week" value={subHealth.expiringThisWeek} max={subHealth.active || 1} color="#ef4444" />
              <MiniBar label="Expiring this month" value={subHealth.expiringThisMonth} max={subHealth.active || 1} color="#f59e0b" />
              <MiniBar label="Active" value={subHealth.active} max={subHealth.total || 1} color="#10b981" />
              <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)',
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'.8rem', color:'var(--sub)' }}>Renewal rate (30d)</span>
                <span style={{ fontSize:'1.1rem', fontWeight:800,
                  color: subHealth.renewalRate >= 70 ? '#10b981' : subHealth.renewalRate >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {subHealth.renewalRate}%
                </span>
              </div>
            </>
          ) : <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>No data</p>}
        </div>
        <div style={card}>
          <p style={h2}>Role Breakdown</p>
          {roleBreak
            ? Object.entries(roleBreak).map(([role, count]) => (
              <MiniBar key={role} label={role.charAt(0).toUpperCase() + role.slice(1)} value={count}
                max={Math.max(...Object.values(roleBreak), 1)} color={ROLE_COLOR[role] || '#6366f1'} />
            ))
            : <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>No data</p>
          }
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
        <div style={card}>
          <p style={h2}>User Breakdown</p>
          <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <RingChart segments={ringSegs} />
            <div style={{ flex:1, minWidth:120 }}>
              {ringSegs.map(s => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0 }} />
                  <span style={{ fontSize:'.8rem', color:'var(--sub)', flex:1 }}>{s.label}</span>
                  <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--text)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={card}>
          <p style={h2}>Revenue</p>
          <MiniBar label="Total (KES)" value={revenue} max={revenue || 1} color="#10b981" />
          <MiniBar label="Transactions" value={kpis?.revenue?.count || 0}
            max={Math.max(kpis?.revenue?.count || 0, 1)} color="#6366f1" />
        </div>
      </div>

      <div>
        <p style={h2}>Quick Actions</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(45%,130px),1fr))', gap:10 }}>
          {QUICK.map(a => (
            <Link key={a.to} to={a.to}
              style={{ ...card, display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                textDecoration:'none', padding:'18px 10px', textAlign:'center',
                transition:'transform .15s,box-shadow .15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow)' }}>
              <span style={{ fontSize:'1.6rem' }}>{a.icon}</span>
              <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--text)' }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
        <div style={card}>
          <p style={h2}>Recent Users</p>
          {recentUsers.length === 0
            ? <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>No recent users</p>
            : recentUsers.map(u => {
              const sc = SC(u.status)
              return (
                <div key={u.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize:'.875rem', fontWeight:600, color:'var(--text)', margin:'0 0 2px' }}>{u.name}</p>
                    <p style={{ fontSize:'.72rem', color:'var(--sub)', margin:0, textTransform:'capitalize' }}>
                      {u.role} &middot; {u.email || u.phone || ''}
                    </p>
                  </div>
                  <span style={mkBadge(sc.bg, sc.fg)}>{u.status}</span>
                </div>
              )
            })
          }
        </div>
        <div style={card}>
          <p style={h2}>Recent Logs</p>
          {recentLogs.length === 0
            ? <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>No recent logs</p>
            : recentLogs.map((l, i) => (
              <div key={l.id || i} style={{ padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <p style={{ fontSize:'.875rem', fontWeight:600, color:'var(--text)', margin:'0 0 2px',
                  textTransform:'capitalize' }}>{l.action?.replace(/_/g, ' ')}</p>
                <p style={{ fontSize:'.72rem', color:'var(--sub)', margin:0 }}>
                  {l.type} &middot; {new Date(l.timestamp || l.created_at).toLocaleString()}
                </p>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}
