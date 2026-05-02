
import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

export default function ParentSubscription() {
 const { userId } = useAuthStore(s => ({ userId: s.userId }))
 const linkedStudentIds = useAuthStore(s => s.linkedStudentIds)

 const [plans, setPlans] = useState([])
 const [sub, setSub] = useState(null)
 const [loading, setLoading] = useState(true)
 const [modal, setModal] = useState(null)
 const [phone, setPhone] = useState('')
 const [paying, setPaying] = useState(false)
 const [polling, setPolling] = useState(false)
 const [showConfirm, setShowConfirm] = useState(false)
 const [mpesaRef, setMpesaRef] = useState('')
 const [confMsg, setConfMsg] = useState('')
 const [sending, setSending] = useState(false)
 const [sent, setSent] = useState(false)

 const load = useCallback(async () => {
 setLoading(true)
 try {
 const [plansRes, subRes] = await Promise.allSettled([
 api.get('/subscriptions/plans'),
 api.get('/subscriptions/me'),
 ])
 if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data || [])
 if (subRes.status === 'fulfilled') setSub(subRes.value.data)
 } catch {}
 setLoading(false)
 }, [])

 useEffect(() => { load() }, [load])

 async function pay() {
 if (!phone) return toast.error('Enter M-Pesa phone number')
 setPaying(true)
 try {
 const studentId = linkedStudentIds?.[0]
 const r = await api.post('/mpesa/pay', {
 phone, amount: modal.price, plan: modal.id,
 userId: studentId || userId
 })
 setCheckoutId && setCheckoutId(r.data.CheckoutRequestID)
 toast.success('Payment prompt sent! Enter M-Pesa PIN.')
 setShowConfirm(true)
 setPolling(true)
 let tries = 0
 const iv = setInterval(async () => {
 tries++
 try {
 const res = await api.get('/mpesa/status/' + r.data.CheckoutRequestID)
 if (res.data.ResultCode === 0) {
 clearInterval(iv); setPolling(false)
 toast.success('Payment successful!'); setShowConfirm(true); setModal(null); load()
 } else if (res.data.ResultCode !== undefined && res.data.ResultCode !== '') {
 clearInterval(iv); setPolling(false)
 toast.error('Payment failed or cancelled.')
 }
 } catch {}
 if (tries >= 12) { clearInterval(iv); setPolling(false); setShowConfirm(true); setModal(null) }
 }, 5000)
 } catch(e) { toast.error(e.response?.data?.error || 'Failed') }
 finally { setPaying(false) }
 }

 async function sendConfirmation() {
 setSending(true)
 try {
 await api.post('/subscriptions/message', {
 planId: modal?.id, planName: modal?.name,
 amount: modal?.price, phone, mpesaRef: mpesaRef.trim(), message: confMsg.trim()
 })
 setSent(true); setShowConfirm(false)
 toast.success('Confirmation sent to admin!')
 } catch { toast.error('Failed to send.') }
 finally { setSending(false) }
 }

 const isActive = sub?.status === 'active'
 const isLocked = sub?.status === 'locked'
 const card = { background:'#161b27', border:'1px solid #1f2937', borderRadius:'20px', padding:'28px 24px' }

 if (loading) return <Spinner />

 return (
 <div style={{ maxWidth:'560px', margin:'0 auto' }}>
 <div style={{ marginBottom:'28px', textAlign:'center' }}>
 <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#f9fafb', margin:'0 0 6px' }}>Subscription Plans</h1>
 <p style={{ color:'#6b7280', margin:0, fontSize:'.9rem' }}>
 {linkedStudentIds?.length ? 'Paying for linked student account' : 'Manage your subscription'}
 </p>
 </div>

 {isActive && (
 <div style={{ background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.3)', borderRadius:'14px', padding:'16px 20px', marginBottom:'24px', display:'flex', gap:'12px', alignItems:'center' }}>
 <span style={{ fontSize:'1.8rem' }}></span>
 <div>
 <p style={{ fontWeight:700, color:'#34d399', margin:'0 0 3px' }}>Active {sub.plan_name || sub.plan_id} Plan</p>
 <p style={{ color:'#9ca3af', fontSize:'.83rem', margin:0 }}>
 {sub.expiry_date ? 'Renews ' + new Date(sub.expiry_date).toLocaleDateString() : 'Active'}
 {linkedStudentIds?.length ? ' Student dashboard is unlocked' : ''}
 </p>
 </div>
 </div>
 )}

 {sent && (
 <div style={{ background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.3)', borderRadius:'14px', padding:'16px 20px', marginBottom:'24px', textAlign:'center' }}>
 <p style={{ fontWeight:700, color:'#a5b4fc', margin:'0 0 4px' }}> Confirmation Sent!</p>
 <p style={{ color:'#9ca3af', fontSize:'.83rem', margin:0 }}>Admin will review and activate the plan shortly.</p>
 </div>
 )}

 {/* Zigzag Plans */}
 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px', marginBottom:'32px' }}>
 {plans.map((plan, i) => {
 const isCurrent = sub?.plan_id === plan.id && isActive
 return (
 <div key={plan.id} style={{...card,
 border: isCurrent ? `2px solid ${plan.color}` : '1px solid #1f2937',
 position:'relative', overflow:'hidden'
 }}>
 <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:plan.color }} />
 {isCurrent && <span style={{ position:'absolute', top:'14px', right:'14px', background:plan.color+'33', color:plan.color, fontSize:'.68rem', fontWeight:700, padding:'3px 10px', borderRadius:'99px' }}>Current</span>}
 <p style={{ fontWeight:800, fontSize:'1.15rem', color:'#f9fafb', margin:'8px 0 4px' }}>{plan.name}</p>
 <p style={{ fontWeight:800, fontSize:'1.6rem', color:plan.color, margin:'0 0 2px' }}>
 KES {Number(plan.price).toLocaleString()}
 <span style={{ fontSize:'.75rem', fontWeight:400, color:'#6b7280' }}>/{plan.period||'month'}</span>
 </p>
 <ul style={{ listStyle:'none', padding:0, margin:'14px 0 18px' }}>
 {(plan.features||[]).map((feat,fi) => (
 <li key={fi} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px', fontSize:'.82rem', color:feat.included?'#d1d5db':'#4b5563' }}>
 <span style={{ color:feat.included?'#34d399':'#ef4444', fontWeight:700, flexShrink:0 }}>{feat.included?'':''}</span>
 {feat.text}
 </li>
 ))}
 </ul>
 <button onClick={()=>{ if(!isCurrent){ setModal(plan); setSent(false) } }} disabled={isCurrent}
 style={{ width:'100%', padding:'10px', borderRadius:'10px', border:'none', background:isCurrent?'rgba(255,255,255,.05)':plan.color, color:isCurrent?'#6b7280':'#fff', fontWeight:700, cursor:isCurrent?'default':'pointer', fontSize:'.875rem' }}>
 {isCurrent ? 'Current Plan' : 'Pay Now'}
 </button>
 </div>
 )
 })}
 </div>

 {showConfirm && (
 <div style={{ ...card, marginBottom:'24px' }}>
 <h3 style={{ color:'#f9fafb', fontWeight:700, margin:'0 0 4px' }}> Confirm Your Payment</h3>
 <p style={{ color:'#6b7280', fontSize:'.83rem', margin:'0 0 16px' }}>Send M-Pesa ref to admin for manual activation.</p>
 <input style={{ width:'100%', background:'#0f1421', border:'1px solid #1f2937', color:'#f9fafb', borderRadius:'10px', padding:'10px 12px', marginBottom:'10px', fontSize:'.85rem', boxSizing:'border-box' }}
 placeholder="M-Pesa confirmation code" value={mpesaRef} onChange={e=>setMpesaRef(e.target.value)} />
 <textarea style={{ width:'100%', background:'#0f1421', border:'1px solid #1f2937', color:'#f9fafb', borderRadius:'10px', padding:'10px 12px', marginBottom:'10px', fontSize:'.85rem', boxSizing:'border-box', minHeight:'70px', resize:'vertical' }}
 placeholder="Optional message..." value={confMsg} onChange={e=>setConfMsg(e.target.value)} />
 <button onClick={sendConfirmation} disabled={sending||!mpesaRef}
 style={{ width:'100%', padding:'11px', background:mpesaRef?'#6366f1':'#1f2937', color:mpesaRef?'#fff':'#6b7280', border:'none', borderRadius:'10px', fontWeight:700, cursor:mpesaRef?'pointer':'default' }}>
 {sending?'Sending':'Send to Admin'}
 </button>
 </div>
 )}

 {polling && (
 <div style={{ textAlign:'center', padding:'24px', color:'#9ca3af' }}>
 <Spinner />
 <p style={{ marginTop:'12px', fontSize:'.85rem' }}>Waiting for M-Pesa confirmation</p>
 </div>
 )}

 {modal && !polling && (
 <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
 <div style={{ background:'#0f1421', border:'1px solid #1f2937', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'400px' }}>
 <h3 style={{ color:'#f9fafb', fontWeight:800, margin:'0 0 4px' }}>Pay with M-Pesa</h3>
 <p style={{ color:'#6b7280', margin:'0 0 20px', fontSize:'.85rem' }}>{modal.name} KES {Number(modal.price).toLocaleString()}/{modal.period}</p>
 <input style={{ width:'100%', background:'#161b27', border:'1px solid #1f2937', color:'#f9fafb', borderRadius:'10px', padding:'11px 14px', fontSize:'1rem', boxSizing:'border-box', marginBottom:'16px' }}
 placeholder="M-Pesa phone (07XX XXX XXX)" value={phone} onChange={e=>setPhone(e.target.value)} type="tel" maxLength={12} />
 <div style={{ background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.2)', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', fontSize:'.82rem', color:'#a5b4fc' }}>
 You will receive an M-Pesa prompt on your phone. Enter your PIN to complete.
 </div>
 <div style={{ display:'flex', gap:'10px' }}>
 <button onClick={()=>setModal(null)} style={{ flex:1, padding:'11px', background:'#1f2937', color:'#9ca3af', border:'none', borderRadius:'10px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
 <button onClick={pay} disabled={paying}
 style={{ flex:2, padding:'11px', background:paying?'#1f2937':'#4ade80', color:paying?'#6b7280':'#000', border:'none', borderRadius:'10px', fontWeight:700, cursor:paying?'default':'pointer' }}>
 {paying?'Sending':' Pay KES '+Number(modal.price).toLocaleString()}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
