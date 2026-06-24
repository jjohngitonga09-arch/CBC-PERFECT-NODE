import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { getSocket } from '../../services/socketService'
import InviteCard from '../../components/student/InviteCard'

export default function StudentSubscription() {
 return <><SubscriptionPage role="student" /><PaymentFAB /></>
}

export function ParentSubscriptionPage() {
 return <><SubscriptionPage role="parent" /><PaymentFAB /></>
}

function SubscriptionPage({ role }) {
 const { userId, user } = useAuthStore(s => ({ userId: s.userId, user: s.user }))
 const setSubscriptionStatus = useAuthStore(s => s.setSubscriptionStatus)
 const navigate = useNavigate()

 const [plans, setPlans] = useState([])
 const [sub, setSub] = useState(null)
 const [loading, setLoading] = useState(true)
 const [modal, setModal] = useState(null) // selected plan
 const [phone, setPhone] = useState('')
 const [paying, setPaying] = useState(false)
 const [checkoutId, setCheckoutId] = useState(null)
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
 if (subRes.status === 'fulfilled') { setSub(subRes.value.data); setSubscriptionStatus?.(subRes.value.data?.status) }
 } catch {}
 setLoading(false)
 }, [])

 useEffect(() => { load() }, [load])

 useEffect(() => {
 const socket = getSocket()
 if (!socket) return
 const handler = () => {
  toast.success('Payment confirmed! Welcome back!', { duration: 3000, icon: '??' })
 setTimeout(() => navigate('/'), 2500)
 }
 socket.on('subscription:activated', handler)
 socket.on('subscription:unlocked', handler)
 return () => { socket.off('subscription:activated', handler); socket.off('subscription:unlocked', handler) }
 }, [navigate])

 //  STK Push 
 async function pay() {
 if (!phone) return toast.error('Enter your M-Pesa phone number')
 if (phone.length < 9) return toast.error('Invalid phone number')
 setPaying(true)
 try {
 const r = await api.post('/mpesa/pay', {
 phone, amount: modal.price, plan: modal.id, userId
 })
 setCheckoutId(r.data.CheckoutRequestID)
 toast.success('Payment prompt sent to your phone! Enter M-Pesa PIN.')
 setShowConfirm(true)
 setPolling(true)
 pollStatus(r.data.CheckoutRequestID, modal)
 } catch(e) {
 toast.error(e.response?.data?.error || 'Failed to send payment prompt')
 } finally { setPaying(false) }
 }

 function pollStatus(cid, plan) {
 let tries = 0
 const iv = setInterval(async () => {
 tries++
 try {
 const r = await api.get('/mpesa/status/' + cid)
 if (r.data.ResultCode === 0) {
 clearInterval(iv)
 setPolling(false)
 toast.success('Payment successful!')
 setShowConfirm(true)
 setModal(null)
 load()
 } else if (r.data.ResultCode !== undefined && r.data.ResultCode !== '') {
 clearInterval(iv)
 setPolling(false)
 toast.error('Payment failed or cancelled. Please try again.')
 }
 } catch {}
 if (tries >= 12) { clearInterval(iv); setPolling(false); setShowConfirm(true); setModal(null) }
 }, 5000)
 }

 //  Send confirmation message 
 async function sendConfirmation() {
 if (!modal && !showConfirm) return
 setSending(true)
 try {
 await api.post('/subscriptions/message', {
 planId: (modal || {}).id, planName: (modal || {}).name,
 amount: (modal || {}).price, phone,
 mpesaRef: mpesaRef.trim(), message: confMsg.trim()
 })
 setSent(true)
 setShowConfirm(false)
 toast.success('Confirmation sent to admin!')
 } catch { toast.error('Failed to send. Try again.') }
 finally { setSending(false) }
 }

 const isLocked = sub?.status === 'locked'
 const isActive = sub?.status === 'active'
 const isExpired = sub?.status === 'expired'

 const card = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'20px', padding:'28px 24px' }

 if (loading) return <Spinner />

 return (
 <div style={{ maxWidth:'560px', margin:'0 auto' }}>

 {/* Header */}
 <div style={{ marginBottom:'28px', textAlign:'center' }}>
 <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--text)', margin:'0 0 6px' }}>Choose Your Plan</h1>
 <p style={{ color:'var(--sub)', margin:0, fontSize:'.9rem' }}>Unlock full access to EduApp learning tools</p>
 </div>

 {/* Status banner */}
 {isLocked && (
 <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.3)', borderRadius:'14px', padding:'16px 20px', marginBottom:'24px', display:'flex', gap:'12px', alignItems:'center' }}>
 <span style={{ fontSize:'1.8rem' }}>ðŸ”’</span>
 <div>
 <p style={{ fontWeight:700, color:'#f87171', margin:'0 0 3px' }}>Dashboard Locked</p>
 <p style={{ color:'var(--sub)', fontSize:'.83rem', margin:0 }}>Your access has been restricted. Please choose a plan below to restore access.</p>
 </div>
 </div>
 )}
 {isActive && (
 <div style={{ background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.3)', borderRadius:'14px', padding:'16px 20px', marginBottom:'24px', display:'flex', gap:'12px', alignItems:'center' }}>
 <span style={{ fontSize:'1.8rem' }}>…</span>
 <div>
 <p style={{ fontWeight:700, color:'#34d399', margin:'0 0 3px' }}>Active â€” {sub.plan_name || sub.plan_id} Plan</p>
 <p style={{ color:'var(--sub)', fontSize:'.83rem', margin:0 }}>
 {sub.expiry_date ? 'Renews ' + new Date(sub.expiry_date).toLocaleDateString() : 'Active subscription'}
 </p>

 </div>
 <button onClick={() => navigate('/student/home')} style={{ background:'#34d399', color:'#000', border:'none', borderRadius:'10px', padding:'9px 20px', fontWeight:700, fontSize:'.85rem', cursor:'pointer', flexShrink:0 }}>Go to Dashboard</button>
 </div>
 )}

 {/* Sent confirmation notice */}
 {sent && (
 <div style={{ background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.3)', borderRadius:'14px', padding:'16px 20px', marginBottom:'24px', textAlign:'center' }}>
 <p style={{ fontWeight:700, color:'#a5b4fc', margin:'0 0 4px' }}>… Confirmation Sent!</p>
 <p style={{ color:'var(--sub)', fontSize:'.83rem', margin:0 }}>Admin will review and activate your plan shortly. You will receive a notification.</p>
 </div>
 )}

 {/* Zigzag Plans */}
 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px', marginBottom:'32px' }}>
 {plans.map((plan, i) => {
 const isCurrent = sub?.plan_id === plan.id && isActive
 return (
 <div key={plan.id} style={{
 ...card,
 border: isCurrent ? `2px solid ${plan.color}` : '1px solid var(--border)',
 background: isCurrent ? `rgba(99,102,241,0.06)` : 'var(--surface)',
 position:'relative', overflow:'hidden'
 }}>
 {/* Color accent bar */}
 <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:plan.color, borderRadius:'20px 20px 0 0' }} />
 {isCurrent && (
 <span style={{ position:'absolute', top:'14px', right:'14px', background:plan.color+'33', color:plan.color, fontSize:'.68rem', fontWeight:700, padding:'3px 10px', borderRadius:'99px', textTransform:'uppercase' }}>
 Current
 </span>
 )}
 <p style={{ fontWeight:800, fontSize:'1.15rem', color:'var(--text)', margin:'8px 0 4px' }}>{plan.name}</p>
 <p style={{ fontWeight:800, fontSize:'1.6rem', color:plan.color, margin:'0 0 2px' }}>
 KES {Number(plan.price).toLocaleString()}
 <span style={{ fontSize:'.75rem', fontWeight:400, color:'var(--sub)' }}>/{plan.period || 'month'}</span>
 </p>
 <ul style={{ listStyle:'none', padding:0, margin:'14px 0 18px' }}>
 {(plan.features || []).map((feat, fi) => (
 <li key={fi} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px', fontSize:'.82rem', color: feat.included ? '#d1d5db' : 'var(--sub)' }}>
 <span style={{ color: feat.included ? '#34d399' : '#ef4444', fontWeight:700, fontSize:'.9rem', flexShrink:0 }}>
  {feat.included ? '?' : '?'}
 </span>
 {feat.text}
 </li>
 ))}
 </ul>
 <button
 onClick={() => { if (!isCurrent) { setModal(plan); setSent(false) } }}
 disabled={isCurrent}
 style={{
 width:'100%', padding:'10px', borderRadius:'10px', border:'none',
 background: isCurrent ? 'rgba(255,255,255,0.05)' : plan.color,
 color: isCurrent ? 'var(--sub)' : '#fff',
 fontWeight:700, cursor: isCurrent ? 'default' : 'pointer', fontSize:'.875rem'
 }}
 >
 {isCurrent ? 'Current Plan' : 'Choose Plan'}
 </button>
 </div>
 )
 })}
 </div>

 <InviteCard />

 {/* Confirmation message form (after payment) */}
 {showConfirm && (
 <div style={{ ...card, marginBottom:'24px' }}>
 <h3 style={{ color:'var(--text)', fontWeight:700, margin:'0 0 4px' }}>ðŸ“¨ Confirm Your Payment</h3>
 <p style={{ color:'var(--sub)', fontSize:'.83rem', margin:'0 0 16px' }}>Enter your M-Pesa confirmation code and send a message to admin for activation.</p>
 <input
 style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', borderRadius:'10px', padding:'10px 12px', marginBottom:'10px', fontSize:'.85rem', boxSizing:'border-box' }}
 placeholder="M-Pesa confirmation code (e.g. QJK3X4Y2WZ)"
 value={mpesaRef} onChange={e=>setMpesaRef(e.target.value)}
 />
 <textarea
 style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', borderRadius:'10px', padding:'10px 12px', marginBottom:'10px', fontSize:'.85rem', boxSizing:'border-box', minHeight:'70px', resize:'vertical' }}
 placeholder="Optional message to admin..."
 value={confMsg} onChange={e=>setConfMsg(e.target.value)}
 />
 <button onClick={sendConfirmation} disabled={sending || !mpesaRef}
 style={{ width:'100%', padding:'11px', background: mpesaRef ? '#6366f1' : 'var(--surface-hover)', color: mpesaRef ? '#fff' : 'var(--sub)', border:'none', borderRadius:'10px', fontWeight:700, cursor: mpesaRef ? 'pointer' : 'default', fontSize:'.875rem' }}>
 {sending ? 'Sending...' : 'Send Confirmation to Admin'}
 </button>
 </div>
 )}

 {/* Polling status */}
 {polling && (
 <div style={{ textAlign:'center', padding:'24px', color:'var(--sub)' }}>
 <Spinner />
 <p style={{ marginTop:'12px', fontSize:'.85rem' }}>Waiting for M-Pesa payment confirmation...</p>
 <p style={{ fontSize:'.75rem', color:'var(--sub)' }}>Enter your PIN on your phone to complete</p>
 </div>
 )}

 {/* Payment modal */}
 {modal && !polling && (
 <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
 <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'400px' }}>
 <h3 style={{ color:'var(--text)', fontWeight:800, margin:'0 0 4px', fontSize:'1.2rem' }}>Pay with M-Pesa</h3>
 <p style={{ color:'var(--sub)', margin:'0 0 20px', fontSize:'.85rem' }}>Plan: {modal.name} â€” KES {Number(modal.price).toLocaleString()}/{modal.period}</p>
 <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 8px', fontWeight:600 }}>M-Pesa Phone Number</p>
 <input
 style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', borderRadius:'10px', padding:'11px 14px', fontSize:'1rem', boxSizing:'border-box', marginBottom:'16px' }}
 placeholder="07XX XXX XXX"
 value={phone} onChange={e=>setPhone(e.target.value)}
 type="tel" maxLength={12}
 />
 <div style={{ background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.2)', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', fontSize:'.82rem', color:'#a5b4fc' }}>
 ðŸ“± You will receive an M-Pesa prompt on your phone. Enter your PIN to complete payment.
 </div>
 <div style={{ display:'flex', gap:'10px' }}>
 <button onClick={()=>setModal(null)} style={{ flex:1, padding:'11px', background:'var(--surface-hover)', color:'var(--sub)', border:'none', borderRadius:'10px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
 <button onClick={pay} disabled={paying}
 style={{ flex:2, padding:'11px', background: paying?'var(--surface-hover)':'#4ade80', color: paying?'var(--sub)':'#000', border:'none', borderRadius:'10px', fontWeight:700, cursor: paying?'default':'pointer', fontSize:'.875rem' }}>
 {paying ? 'Sending...' : 'Pay KES '+Number(modal.price).toLocaleString()}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}



function PaymentFAB() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [plans, setPlans] = useState([])
  const [input, setInput] = useState('')
  const [selPlan, setSelPlan] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const prevConfirmed = useRef(null)
  const redirected = useRef(false)

  useEffect(() => {
    api.get('/subscriptions/plans').then(r => {
      const pl = Array.isArray(r.data) ? r.data : []
      setPlans(pl)
      if (pl.length) setSelPlan(pl[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return
    const load = () => api.get('/subscriptions/messages/mine')
      .then(r => { const d = Array.isArray(r.data) ? r.data : []; setMsgs([...d].reverse()) })
      .catch(() => {})
    load()
    const iv = setInterval(load, 15000)
    return () => clearInterval(iv)
  }, [open])

  useEffect(() => {
    if (!open) return
    const socket = getSocket()
    if (!socket) return
    const handler = (payload) => {
      if (!payload || payload.sender_role !== 'admin') return
      setMsgs(prev => prev.map(m => {
        if (m.id !== payload.payment_message_id) return m
        const existing = Array.isArray(m.replies) ? m.replies : []
        if (existing.some(r => r.id === payload.id)) return m
        return { ...m, replies: [...existing, payload] }
      }))
      toast('New reply from support', { icon: 'ðŸ›¡ï¸' })
    }
    socket.on('payment:reply', handler)
    return () => socket.off('payment:reply', handler)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [msgs, open])

  useEffect(() => {
    if (redirected.current) return
    if (!msgs.length && prevConfirmed.current === null) return
    const hasConfirmed = msgs.some(m => m.status === 'confirmed')
    if (hasConfirmed && prevConfirmed.current === false) {
      redirected.current = true
      toast.success('Payment verified! Entering your account...', { duration: 3000, icon: '??' })
      setTimeout(() => window.location.reload(), 2800)
    }
    prevConfirmed.current = hasConfirmed
  }, [msgs])

  const latestMsg = msgs.length ? msgs[msgs.length - 1] : null
  const isReplyMode = !!latestMsg && latestMsg.status === 'pending'

  const send = async () => {
    if (!input.trim()) return
    if (!isReplyMode && !selPlan) return
    setSending(true)
    try {
      if (isReplyMode) {
        await api.post(`/subscriptions/messages/${latestMsg.id}/reply-mine`, { message: input.trim() })
      } else {
        const pl = plans.find(p => p.id === selPlan)
        await api.post('/subscriptions/message', { planId: selPlan, planName: pl?.name || selPlan, amount: pl?.price || 0, message: input.trim() })
      }
      setInput('')
      const r = await api.get('/subscriptions/messages/mine')
      const d = Array.isArray(r.data) ? r.data : []
      setMsgs([...d].reverse())
    } catch(e) { toast.error(e.response?.data?.error || 'Failed to send') }
    finally { setSending(false) }
  }

  const user = useAuthStore(s => s.user)
  const userId2 = useAuthStore(s => s.userId)
  const firstName = (user?.name || user?.username || '').split(' ')[0] || 'there'
  const getReply = (status, isDuplicatePending) => {
    if (status === 'pending' && isDuplicatePending) {
      return { text: 'Please wait, ' + firstName + ' â€” we are still reviewing your earlier message. No need to resend.', col: '#fbbf24', bg: 'rgba(251,191,36,0.1)' }
    }
    return ({
      confirmed: { text: 'Hi ' + firstName + '! Great news â€” your payment has been verified and your account is now active. Welcome back! ðŸŽ‰', col: '#34d399', bg: 'rgba(52,211,153,0.12)' },
      rejected:  { text: 'Hi ' + firstName + ', unfortunately we could not confirm your payment. Please resend the correct M-Pesa message or contact support. We are happy to help!', col: '#f87171', bg: 'rgba(248,113,113,0.1)' },
      pending:   { text: 'Hi ' + firstName + ', I hope your day is going well! We have found your message. Sit tight, your account will resume in a few minutes once verified. Thank you for your patience!', col: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    }[status] || { text: 'Hi ' + firstName + ', awaiting review...', col: 'var(--sub)', bg: 'var(--surface-hover)' })
  }

  const hasPending = msgs.some(m => m.status === 'pending')

  return (
    <>
      {/* FAB Button - green double chat bubble - hidden when open */}
      <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 1100, display: open ? 'none' : 'block' }}>
        {!open && hasPending && (
          <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '16px', height: '16px', borderRadius: '50%', background: '#f59e0b', border: '2px solid #fff', zIndex: 1 }} />
        )}
        <button
          onClick={() => setOpen(v => !v)}
          title="Payment Support"
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(34,197,94,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
        >
          {open ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="34" height="28" viewBox="0 0 40 32" fill="none">
              <rect x="8" y="6" width="26" height="17" rx="5" fill="white" opacity="0.35"/>
              <rect x="2" y="1" width="26" height="17" rx="5" fill="white"/>
              <circle cx="9" cy="9.5" r="2" fill="#16a34a"/>
              <circle cx="15" cy="9.5" r="2" fill="#16a34a"/>
              <circle cx="21" cy="9.5" r="2" fill="#16a34a"/>
              <path d="M5 18 L2 24 L11 20" fill="white"/>
            </svg>
          )}
        </button>
      </div>

      {/* Full-screen chat overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1099,
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="22" viewBox="0 0 40 32" fill="none">
                  <rect x="8" y="6" width="26" height="17" rx="5" fill="white" opacity="0.4"/>
                  <rect x="2" y="1" width="26" height="17" rx="5" fill="white"/>
                  <circle cx="9" cy="9.5" r="2" fill="#16a34a"/>
                  <circle cx="15" cy="9.5" r="2" fill="#16a34a"/>
                  <circle cx="21" cy="9.5" r="2" fill="#16a34a"/>
                  <path d="M5 18 L2 24 L11 20" fill="white"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>Payment Support</p>
                <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '.78rem' }}>Paste your M-Pesa message â€” we will activate your account</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            {msgs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>ðŸ’³</div>
                <p style={{ color: 'var(--sub)', fontSize: '.9rem', margin: 0, lineHeight: 1.6 }}>
                  Already paid via M-Pesa?<br/>Select your plan below and paste your M-Pesa confirmation message â€” we will verify and activate your account.
                </p>
              </div>
            )}
            {(() => {
              const firstPendingIdx = msgs.findIndex(m => m.status === 'pending')
              return msgs.map((msg, idx) => {
                const isDuplicatePending = msg.status === 'pending' && firstPendingIdx !== -1 && idx !== firstPendingIdx
                const hasRealReplies = Array.isArray(msg.replies) && msg.replies.length > 0
                const rp = getReply(msg.status, isDuplicatePending)
                return (
                  <div key={msg.id}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                      <div style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', borderRadius: '18px 18px 4px 18px', padding: '12px 16px', maxWidth: '75%', fontSize: '.88rem', lineHeight: 1.6, wordBreak: 'break-word', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}>
                        {msg.message || 'Payment for ' + msg.plan_name + ' â€” KES ' + msg.amount}
                        <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px', textAlign: 'right' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                    {!hasRealReplies && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '8px', marginBottom: '14px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.8rem' }}>ðŸ›¡ï¸</div>
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', maxWidth: '75%', fontSize: '.88rem', lineHeight: 1.6, color: 'var(--text)', wordBreak: 'break-word' }}>
                          {rp.text}
                        </div>
                      </div>
                    )}
                    {hasRealReplies && msg.replies.map(rep => (
                      <div key={rep.id} style={{ display: 'flex', justifyContent: rep.sender_role === 'admin' ? 'flex-start' : 'flex-end', alignItems: 'flex-end', gap: '8px', marginBottom: '10px' }}>
                        {rep.sender_role === 'admin' && (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.8rem' }}>ðŸ›¡ï¸</div>
                        )}
                        <div style={{
                          background: rep.sender_role === 'admin' ? 'var(--surface)' : 'linear-gradient(135deg,#22c55e,#16a34a)',
                          color: rep.sender_role === 'admin' ? 'var(--text)' : '#fff',
                          border: rep.sender_role === 'admin' ? '1px solid var(--border)' : 'none',
                          borderRadius: rep.sender_role === 'admin' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                          padding: '12px 16px', maxWidth: '75%', fontSize: '.88rem', lineHeight: 1.6, wordBreak: 'break-word'
                        }}>
                          {rep.message}
                          <div style={{ fontSize: '.68rem', color: rep.sender_role === 'admin' ? 'var(--sub)' : 'rgba(255,255,255,0.6)', marginTop: '4px', textAlign: rep.sender_role === 'admin' ? 'left' : 'right' }}>
                            {new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })
            })()}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--surface)', maxWidth: '680px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            {!isReplyMode && (
              <select value={selPlan} onChange={e => setSelPlan(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', padding: '10px 14px', fontSize: '.85rem', outline: 'none', marginBottom: '10px' }}>
                <option value="">Select the plan you paid for...</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name} â€” KES {p.price}/{p.period}</option>)}
              </select>
            )}
            {isReplyMode && (
              <p style={{ fontSize: '.75rem', color: 'var(--sub)', margin: '0 0 10px' }}>Continuing your conversation about your pending payment...</p>
            )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={isReplyMode ? 'Type a message...' : 'Paste your M-Pesa message here...'}
                rows={3}
                style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', color: 'var(--text)', padding: '12px 16px', fontSize: '.88rem', resize: 'none', outline: 'none', lineHeight: 1.6, fontFamily: 'inherit' }}
              />
              <button
                onClick={send}
                disabled={sending || !input.trim() || (!isReplyMode && !selPlan)}
                style={{
                  background: (sending || !input.trim() || (!isReplyMode && !selPlan)) ? 'var(--surface-hover)' : 'linear-gradient(135deg,#22c55e,#16a34a)',
                  color: (sending || !input.trim() || (!isReplyMode && !selPlan)) ? 'var(--sub)' : '#fff',
                  border: 'none', borderRadius: '14px', padding: '14px 20px',
                  cursor: (sending || !input.trim() || (!isReplyMode && !selPlan)) ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: (!sending && input.trim() && (isReplyMode || selPlan)) ? '0 4px 12px rgba(34,197,94,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {sending ? '...' : (
                  <>Send <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
