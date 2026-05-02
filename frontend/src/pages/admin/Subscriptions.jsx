
import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const TABS = [' Plans',' Financial Messages',' Payment History']

export default function AdminSubscriptions() {
 const [tab, setTab] = useState(0)
 return (
 <div>
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#f9fafb', margin:'0 0 4px' }}>Subscriptions</h1>
 <p style={{ color:'#6b7280', margin:0, fontSize:'.875rem' }}>Manage plans, payments and user access</p>
 </div>
 <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
 {TABS.map((t,i)=>(
 <button key={i} onClick={()=>setTab(i)}
 style={{ padding:'9px 18px', borderRadius:'10px', cursor:'pointer', fontWeight:600, fontSize:'.85rem', background: tab===i ? '#6366f1' : '#161b27', color: tab===i ? '#fff' : '#9ca3af', border: tab===i ? 'none' : '1px solid #1f2937' }}>
 {t}
 </button>
 ))}
 </div>
 {tab === 0 && <PlansTab />}
 {tab === 1 && <MessagesTab />}
 {tab === 2 && <HistoryTab />}
 </div>
 )
}

// Plans Tab 
function PlansTab() {
 const [plans, setPlans] = useState([])
 const [loading, setLoading] = useState(true)
 const [editing, setEditing] = useState({})
 const [saving, setSaving] = useState(null)

 useEffect(()=>{
 api.get('/subscriptions/plans').then(r=>{ setPlans(r.data); setEditing(Object.fromEntries(r.data.map(p=>[p.id, { ...p, features: p.features||[] }]))) }).finally(()=>setLoading(false))
 },[])

 function updateField(id, field, val) {
 setEditing(e=>({ ...e, [id]: { ...e[id], [field]: val } }))
 }

 function updateFeature(planId, fi, field, val) {
 setEditing(e=>{
 const feats = [...(e[planId].features||[])]
 feats[fi] = { ...feats[fi], [field]: val }
 return { ...e, [planId]: { ...e[planId], features: feats } }
 })
 }

 function addFeature(planId) {
 setEditing(e=>({ ...e, [planId]: { ...e[planId], features: [...(e[planId].features||[]), { text:'New feature', included:true }] } }))
 }

 function removeFeature(planId, fi) {
 setEditing(e=>({ ...e, [planId]: { ...e[planId], features: e[planId].features.filter((_,i)=>i!==fi) } }))
 }

 async function savePlan(id) {
 setSaving(id)
 try {
 await api.patch('/subscriptions/plans/'+id, editing[id])
 toast.success('Plan saved!')
 } catch { toast.error('Save failed') }
 finally { setSaving(null) }
 }

 const card = { background:'#111827', border:'1px solid #1f2937', borderRadius:'16px', padding:'24px', marginBottom:'16px' }
 const inp = { width:'100%', background:'#0f1421', border:'1px solid #1f2937', color:'#f9fafb', borderRadius:'8px', padding:'8px 12px', fontSize:'.85rem', boxSizing:'border-box' }

 if (loading) return <Spinner />

 return (
 <div>
 <p style={{ color:'#6b7280', fontSize:'.82rem', marginBottom:'20px' }}>Edit plans here changes reflect immediately on parent and student subscription pages.</p>
 {plans.map(plan => {
 const e = editing[plan.id] || plan
 return (
 <div key={plan.id} style={{ ...card, borderTop:`3px solid ${e.color||'#6366f1'}` }}>
 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'10px', marginBottom:'16px', alignItems:'end' }}>
 <div>
 <p style={{ color:'#9ca3af', fontSize:'.72rem', margin:'0 0 4px', textTransform:'uppercase' }}>Plan Name</p>
 <input style={inp} value={e.name||''} onChange={ev=>updateField(plan.id,'name',ev.target.value)} />
 </div>
 <div>
 <p style={{ color:'#9ca3af', fontSize:'.72rem', margin:'0 0 4px', textTransform:'uppercase' }}>Price (KES)</p>
 <input style={inp} type="number" value={e.price||''} onChange={ev=>updateField(plan.id,'price',ev.target.value)} />
 </div>
 <div>
 <p style={{ color:'#9ca3af', fontSize:'.72rem', margin:'0 0 4px', textTransform:'uppercase' }}>Color</p>
 <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
 <input type="color" value={e.color||'#6366f1'} onChange={ev=>updateField(plan.id,'color',ev.target.value)} style={{ width:'40px', height:'36px', borderRadius:'6px', border:'none', cursor:'pointer', background:'none' }} />
 <input style={{ ...inp, flex:1 }} value={e.color||''} onChange={ev=>updateField(plan.id,'color',ev.target.value)} />
 </div>
 </div>
 <button onClick={()=>savePlan(plan.id)} disabled={saving===plan.id}
 style={{ padding:'9px 20px', background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
 {saving===plan.id?'Saving':'Save Plan'}
 </button>
 </div>
 <p style={{ color:'#9ca3af', fontSize:'.72rem', margin:'0 0 8px', textTransform:'uppercase' }}>Features</p>
 {(e.features||[]).map((feat,fi)=>(
 <div key={fi} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
 <select value={feat.included?'yes':'no'} onChange={ev=>updateFeature(plan.id,fi,'included',ev.target.value==='yes')}
 style={{ ...inp, width:'70px', flex:'0 0 auto' }}>
 <option value="yes"></option>
 <option value="no"></option>
 </select>
 <input style={{ ...inp, flex:1 }} value={feat.text||''} onChange={ev=>updateFeature(plan.id,fi,'text',ev.target.value)} />
 <button onClick={()=>removeFeature(plan.id,fi)} style={{ background:'rgba(239,68,68,.1)', color:'#f87171', border:'none', borderRadius:'6px', padding:'6px 10px', cursor:'pointer', fontSize:'.8rem' }}></button>
 </div>
 ))}
 <button onClick={()=>addFeature(plan.id)} style={{ background:'#1f2937', color:'#9ca3af', border:'1px dashed #374151', borderRadius:'8px', padding:'7px 14px', cursor:'pointer', fontSize:'.8rem', marginTop:'4px' }}>
 + Add Feature
 </button>
 </div>
 )
 })}
 </div>
 )
}

// Financial Messages Tab 
function MessagesTab() {
 const [msgs, setMsgs] = useState([])
 const [loading, setLoading] = useState(true)
 const [acting, setActing] = useState(null)

 const load = useCallback(async()=>{
 setLoading(true)
 try { const r = await api.get('/subscriptions/messages'); setMsgs(r.data) } catch {}
 setLoading(false)
 },[])

 useEffect(()=>{ load() },[load])

 async function confirm(id) {
 setActing(id+'c')
 try { await api.patch('/subscriptions/messages/'+id+'/confirm'); toast.success('Subscription activated!'); load() }
 catch { toast.error('Failed') } finally { setActing(null) }
 }

 async function reject(id) {
 setActing(id+'r')
 try { await api.patch('/subscriptions/messages/'+id+'/reject'); toast.success('Rejected.'); load() }
 catch { toast.error('Failed') } finally { setActing(null) }
 }

 async function lockUser(userId) {
 setActing(userId+'l')
 try { await api.patch('/subscriptions/lock/'+userId); toast.success('User locked.'); load() }
 catch { toast.error('Failed') } finally { setActing(null) }
 }

 async function unlockUser(userId) {
 setActing(userId+'u')
 try { await api.patch('/subscriptions/unlock/'+userId); toast.success('User unlocked.'); load() }
 catch { toast.error('Failed') } finally { setActing(null) }
 }

 const statusColor = { pending:'#f59e0b', confirmed:'#34d399', rejected:'#f87171' }

 if (loading) return <Spinner />

 return (
 <div>
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
 <p style={{ color:'#6b7280', fontSize:'.82rem', margin:0 }}>{msgs.length} message{msgs.length!==1?'s':''}</p>
 <button onClick={load} style={{ background:'#1f2937', color:'#9ca3af', border:'none', borderRadius:'8px', padding:'7px 14px', cursor:'pointer', fontSize:'.8rem' }}> Refresh</button>
 </div>
 {msgs.length === 0 ? (
 <div style={{ background:'#111827', border:'1px solid #1f2937', borderRadius:'16px', padding:'48px', textAlign:'center' }}>
 <p style={{ color:'#6b7280', margin:0 }}>No payment messages yet.</p>
 </div>
 ) : msgs.map(m=>(
 <div key={m.id} style={{ background:'#111827', border:'1px solid #1f2937', borderRadius:'16px', padding:'20px', marginBottom:'12px' }}>
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'10px', marginBottom:'12px' }}>
 <div>
 <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'4px' }}>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:0 }}>{m.user_name}</p>
 <span style={{ fontSize:'.7rem', fontWeight:600, padding:'2px 8px', borderRadius:'99px', background:'rgba(99,102,241,.15)', color:'#a5b4fc', textTransform:'capitalize' }}>{m.user_role}</span>
 <span style={{ fontSize:'.7rem', fontWeight:700, padding:'2px 8px', borderRadius:'99px', background:`${statusColor[m.status]||'#6b7280'}22`, color:statusColor[m.status]||'#9ca3af', textTransform:'capitalize' }}>{m.status}</span>
 </div>
 <p style={{ color:'#6b7280', fontSize:'.78rem', margin:0 }}>
 {m.email} {m.phone || m.user_phone} {new Date(m.created_at).toLocaleString()}
 </p>
 </div>
 <div style={{ textAlign:'right' }}>
 <p style={{ fontWeight:800, color:'#4ade80', margin:'0 0 2px', fontSize:'1.1rem' }}>KES {Number(m.amount||0).toLocaleString()}</p>
 <p style={{ color:'#9ca3af', fontSize:'.75rem', margin:0 }}>{m.plan_name}</p>
 </div>
 </div>
 {m.mpesa_ref && <p style={{ background:'rgba(74,222,128,.05)', border:'1px solid rgba(74,222,128,.15)', borderRadius:'8px', padding:'8px 12px', color:'#4ade80', fontFamily:'monospace', fontSize:'.8rem', margin:'0 0 10px' }}>M-Pesa Ref: {m.mpesa_ref}</p>}
 {m.message && <p style={{ color:'#9ca3af', fontSize:'.82rem', margin:'0 0 12px', fontStyle:'italic' }}>"{m.message}"</p>}
 {m.status === 'pending' && (
 <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
 <button onClick={()=>confirm(m.id)} disabled={acting===m.id+'c'}
 style={{ padding:'8px 16px', background:'rgba(74,222,128,.15)', color:'#4ade80', border:'1px solid rgba(74,222,128,.3)', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontSize:'.82rem' }}>
 {acting===m.id+'c'?'Confirming':' Confirm & Activate'}
 </button>
 <button onClick={()=>reject(m.id)} disabled={acting===m.id+'r'}
 style={{ padding:'8px 16px', background:'rgba(239,68,68,.1)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontSize:'.82rem' }}>
 {acting===m.id+'r'?'Rejecting':' Reject'}
 </button>
 <button onClick={()=>lockUser(m.user_id)} disabled={acting===m.user_id+'l'}
 style={{ padding:'8px 16px', background:'rgba(245,158,11,.1)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.25)', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontSize:'.82rem' }}>
 Lock Dashboard
 </button>
 </div>
 )}
 {m.status === 'confirmed' && (
 <div style={{ display:'flex', gap:'8px' }}>
 <span style={{ color:'#34d399', fontSize:'.82rem', fontWeight:600 }}> Subscription activated</span>
 <button onClick={()=>lockUser(m.user_id)} disabled={acting===m.user_id+'l'}
 style={{ padding:'5px 12px', background:'rgba(245,158,11,.1)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.25)', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontSize:'.75rem' }}>
 Lock
 </button>
 <button onClick={()=>unlockUser(m.user_id)} disabled={acting===m.user_id+'u'}
 style={{ padding:'5px 12px', background:'rgba(74,222,128,.08)', color:'#4ade80', border:'1px solid rgba(74,222,128,.2)', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontSize:'.75rem' }}>
 Unlock
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 )
}

// Payment History Tab 
function HistoryTab() {
 const [subs, setSubs] = useState([])
 const [loading, setLoading] = useState(true)
 const [acting, setActing] = useState(null)

 const load = useCallback(async()=>{
 setLoading(true)
 try { const r = await api.get('/subscriptions/all'); setSubs(r.data) } catch {}
 setLoading(false)
 },[])

 useEffect(()=>{ load() },[load])

 async function lockUser(userId) {
 setActing(userId)
 try { await api.patch('/subscriptions/lock/'+userId); toast.success('Locked.'); load() }
 catch { toast.error('Failed') } finally { setActing(null) }
 }

 async function unlockUser(userId) {
 setActing(userId)
 try { await api.patch('/subscriptions/unlock/'+userId); toast.success('Unlocked.'); load() }
 catch { toast.error('Failed') } finally { setActing(null) }
 }

 const statusColor = { active:'#34d399', locked:'#f87171', expired:'#fbbf24', pending:'#9ca3af' }
 if (loading) return <Spinner />

 return (
 <div>
 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
 <p style={{ color:'#6b7280', fontSize:'.82rem', margin:0 }}>{subs.length} subscribers</p>
 <button onClick={load} style={{ background:'#1f2937', color:'#9ca3af', border:'none', borderRadius:'8px', padding:'7px 14px', cursor:'pointer', fontSize:'.8rem' }}> Refresh</button>
 </div>
 <div style={{ background:'#111827', border:'1px solid #1f2937', borderRadius:'16px', overflow:'hidden' }}>
 <div style={{ overflowX:'auto' }}>
 <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
 <thead>
 <tr style={{ borderBottom:'1px solid #1f2937' }}>
 {['User','Role','Plan','Amount','Status','Last Payment','Expires','Actions'].map(h=>(
 <th key={h} style={{ padding:'11px 14px', textAlign:'left', color:'#6b7280', fontWeight:600, fontSize:'.72rem', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {subs.map((s,i)=>(
 <tr key={s.id||i} style={{ borderBottom:'1px solid #1f2937' }}
 onMouseEnter={e=>e.currentTarget.style.background='#161b27'}
 onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
 <td style={{ padding:'10px 14px' }}>
 <p style={{ fontWeight:600, color:'#f9fafb', margin:'0 0 2px' }}>{s.name||''}</p>
 <p style={{ color:'#6b7280', fontSize:'.72rem', margin:0 }}>{s.email||''}</p>
 </td>
 <td style={{ padding:'10px 14px', color:'#9ca3af', textTransform:'capitalize' }}>{s.role||''}</td>
 <td style={{ padding:'10px 14px', color:'#a5b4fc', fontWeight:600 }}>{s.plan_name||s.plan_id||''}</td>
 <td style={{ padding:'10px 14px', color:'#4ade80', fontWeight:700 }}>{s.amount ? 'KES '+Number(s.amount).toLocaleString() : ''}</td>
 <td style={{ padding:'10px 14px' }}>
 <span style={{ color:statusColor[s.status]||'#9ca3af', fontWeight:700, fontSize:'.75rem', textTransform:'uppercase' }}>{s.status}</span>
 </td>
 <td style={{ padding:'10px 14px', color:'#6b7280', fontSize:'.75rem', whiteSpace:'nowrap' }}>{s.last_payment_date ? new Date(s.last_payment_date).toLocaleDateString() : ''}</td>
 <td style={{ padding:'10px 14px', color:'#6b7280', fontSize:'.75rem', whiteSpace:'nowrap' }}>{s.expiry_date ? new Date(s.expiry_date).toLocaleDateString() : ''}</td>
 <td style={{ padding:'10px 14px' }}>
 <div style={{ display:'flex', gap:'6px' }}>
 {s.status !== 'locked'
 ? <button onClick={()=>lockUser(s.user_id)} disabled={acting===s.user_id}
 style={{ padding:'5px 10px', background:'rgba(239,68,68,.1)', color:'#f87171', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'.75rem', fontWeight:600 }}>
 
 </button>
 : <button onClick={()=>unlockUser(s.user_id)} disabled={acting===s.user_id}
 style={{ padding:'5px 10px', background:'rgba(74,222,128,.1)', color:'#4ade80', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'.75rem', fontWeight:600 }}>
 
 </button>
 }
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )
}
