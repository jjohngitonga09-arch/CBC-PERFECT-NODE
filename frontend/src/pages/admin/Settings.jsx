import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px', boxShadow:'var(--shadow)', marginBottom:16 }
const label = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid var(--border)' }
const last = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0' }

function Toggle({ value, onChange }) {
 return (
 <div onClick={() => onChange(!value)} style={{
 width:46, height:26, borderRadius:13, cursor:'pointer', transition:'background .25s',
 background: value ? 'var(--accent)' : 'rgba(156,163,175,.4)', position:'relative', flexShrink:0,
 }}>
 <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, transition:'left .25s', left: value ? 23 : 3 }} />
 </div>
 )
}

const DEFAULTS = {
 allow_registration: true, require_admin_approval: true,
 maintenance_mode: false, max_login_attempts: 5, session_timeout: 24,
 enable_notifications: true,
}

export default function AdminSettings() {
 const [cfg, setCfg] = useState(DEFAULTS)
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)

 useEffect(() => {
 api.get('/admin/settings')
 .then(r => setCfg({ ...DEFAULTS, ...r.data }))
 .catch(() => toast.error('Could not load settings'))
 .finally(() => setLoading(false))
 }, [])

 const set = (k, v) => setCfg(p => ({ ...p, [k]: v }))

 async function save() {
 setSaving(true)
 try {
 await api.put('/admin/settings', cfg)
 toast.success('Settings saved ')
 } catch { toast.error('Save failed') }
 finally { setSaving(false) }
 }

 if (loading) return <Spinner />

 return (
 <div>
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
 <div>
 <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>System Settings</h1>
 <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Changes are saved to the database immediately.</p>
 </div>
 <button onClick={save} disabled={saving} style={{
 background:'var(--accent)', color:'#fff', border:'none', borderRadius:12,
 padding:'10px 24px', fontWeight:700, fontSize:'.95rem', cursor:'pointer', fontFamily:'inherit',
 }}>
 {saving ? 'Saving' : ' Save Changes'}
 </button>
 </div>

 {/* Access & Registration */}
 <div style={card}>
 <p style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', margin:'0 0 4px' }}>Access & Registration</p>
 <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:'0 0 12px' }}>Control who can sign up and how accounts are managed.</p>

 {[
 { k:'allow_registration', title:'Allow Registration', sub:'New users can sign up' },
 { k:'require_admin_approval',title:'Require Admin Approval', sub:'New accounts need approval before login' },
 { k:'maintenance_mode', title:'Maintenance Mode', sub:'Block all non-admin access' },
 ].map(({ k, title, sub }, i, arr) => (
 <div key={k} style={i < arr.length-1 ? label : last}>
 <div>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>{title}</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>{sub}</p>
 </div>
 <Toggle value={!!cfg[k]} onChange={v => set(k, v)} />
 </div>
 ))}

 <div style={last}>
 <div>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>Max Login Attempts</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>Before account lockout</p>
 </div>
 <input type="number" min={1} max={20} value={cfg.max_login_attempts}
 onChange={e => set('max_login_attempts', Number(e.target.value))}
 style={{ width:64, padding:'6px 10px', borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'.9rem', textAlign:'center', outline:'none' }} />
 </div>

 <div style={last}>
 <div>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>Session Timeout (hours)</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>Auto-logout after inactivity</p>
 </div>
 <input type="number" min={1} max={720} value={cfg.session_timeout}
 onChange={e => set('session_timeout', Number(e.target.value))}
 style={{ width:64, padding:'6px 10px', borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'.9rem', textAlign:'center', outline:'none' }} />
 </div>
 </div>

 {/* Notifications */}
 <div style={card}>
 <p style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', margin:'0 0 4px' }}>Notifications</p>
 <p style={{ fontSize:'.8rem', color:'var(--sub)', margin:'0 0 12px' }}>Control system-wide notification behaviour.</p>
 <div style={last}>
 <div>
 <p style={{ fontWeight:600, color:'var(--text)', margin:'0 0 3px', fontSize:'.9rem' }}>Enable Notifications</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)', margin:0 }}>Send system notifications to users</p>
 </div>
 <Toggle value={!!cfg.enable_notifications} onChange={v => set('enable_notifications', v)} />
 </div>
 </div>
 </div>
 )
}
