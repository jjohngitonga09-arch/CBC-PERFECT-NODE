import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'
import { getSocket } from '../../services/socketService'

export default function ManualPayments() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [acting, setActing] = useState(null)
  const [replyInputs, setReplyInputs] = useState({})
  const [sendingReplyId, setSendingReplyId] = useState(null)

  const load = async () => {
    try {
      const r = await api.get('/subscriptions/messages')
      setRequests(Array.isArray(r.data) ? r.data : [])
    } catch(e) { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load(); const iv = setInterval(load, 20000); return () => clearInterval(iv) }, [])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = (payload) => {
      if (!payload || !payload.payment_message_id) return
      setRequests(prev => prev.map(r => {
        if (r.id !== payload.payment_message_id) return r
        const existing = Array.isArray(r.replies) ? r.replies : []
        if (existing.some(rep => rep.id === payload.id)) return r
        return { ...r, replies: [...existing, payload] }
      }))
      if (payload.sender_role === 'user') {
        toast('New message from a student', { icon: '💬' })
      }
    }
    socket.on('payment:reply', handler)
    return () => socket.off('payment:reply', handler)
  }, [])

  const act = async (id, action) => {
    setActing(id + action)
    try {
      await api.patch(`/subscriptions/messages/${id}/${action}`)
      toast.success(action === 'confirm' ? '✅ Subscription activated!' : 'Request rejected')
      load()
    } catch(e) { toast.error(e.response?.data?.error || 'Failed') }
    finally { setActing(null) }
  }

  const sendReply = async (id) => {
    const text = (replyInputs[id] || '').trim()
    if (!text) return
    setSendingReplyId(id)
    try {
      await api.post(`/subscriptions/messages/${id}/reply`, { message: text })
      setReplyInputs(prev => ({ ...prev, [id]: '' }))
      load()
    } catch(e) { toast.error(e.response?.data?.error || 'Failed to send reply') }
    finally { setSendingReplyId(null) }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)
  const pending = requests.filter(r => r.status === 'pending').length
  const sc = { pending: '#fbbf24', confirmed: '#34d399', rejected: '#f87171' }
  const sl = { pending: '⏳ Pending', confirmed: '✅ Confirmed', rejected: '❌ Rejected' }
  const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px 20px' }

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.4px' }}>Manual Payments</h1>
        {pending > 0 && <span style={{ background: '#fbbf24', color: '#000', borderRadius: '20px', padding: '3px 12px', fontSize: '.75rem', fontWeight: 700 }}>{pending} pending</span>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['pending', 'confirmed', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '.8rem', background: filter === f ? '#6366f1' : 'var(--surface)', color: filter === f ? '#fff' : 'var(--sub)', border: filter === f ? 'none' : '1px solid var(--border)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}{f === 'pending' && pending > 0 ? ` (${pending})` : ''}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...card, padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--sub)', margin: 0 }}>No {filter === 'all' ? '' : filter} payment requests yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(req => (
            <div key={req.id} style={{ ...card, borderLeft: `4px solid ${sc[req.status] || '#6366f1'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{req.user_name}</span>
                    <span style={{ fontSize: '.72rem', fontWeight: 700, color: sc[req.status], background: (sc[req.status] || '#6366f1') + '22', padding: '2px 8px', borderRadius: '10px' }}>{sl[req.status]}</span>
                    <span style={{ fontSize: '.72rem', color: 'var(--sub)' }}>{new Date(req.created_at).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: req.message ? '10px' : 0 }}>
                    <span style={{ fontSize: '.8rem', color: 'var(--sub)' }}>Plan: <strong style={{ color: 'var(--text)' }}>{req.plan_name || req.plan_id || '—'}</strong></span>
                    <span style={{ fontSize: '.8rem', color: 'var(--sub)' }}>Amount: <strong style={{ color: 'var(--text)' }}>KES {req.amount || '—'}</strong></span>
                    {req.mpesa_ref && <span style={{ fontSize: '.8rem', color: 'var(--sub)' }}>Ref: <strong style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{req.mpesa_ref}</strong></span>}
                    <span style={{ fontSize: '.8rem', color: 'var(--sub)' }}>Role: {req.user_role}</span>
                  </div>
                  {req.message && (
                    <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '10px 14px', fontSize: '.8rem', color: 'var(--text)', fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '500px' }}>
                      {req.message}
                    </div>
                  )}

                  {Array.isArray(req.replies) && req.replies.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', maxWidth: '500px' }}>
                      {req.replies.map(rep => (
                        <div key={rep.id} style={{
                          alignSelf: rep.sender_role === 'admin' ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          background: rep.sender_role === 'admin' ? 'rgba(99,102,241,0.12)' : 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '.78rem',
                        }}>
                          <div style={{ fontWeight: 700, fontSize: '.68rem', color: rep.sender_role === 'admin' ? '#a5b4fc' : 'var(--sub)', marginBottom: '2px' }}>
                            {rep.sender_role === 'admin' ? (rep.sender_name || 'Admin') : req.user_name}
                          </div>
                          <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{rep.message}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', maxWidth: '500px' }}>
                    <input
                      value={replyInputs[req.id] || ''}
                      onChange={e => setReplyInputs(prev => ({ ...prev, [req.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') sendReply(req.id) }}
                      placeholder="Reply to this user..."
                      style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', padding: '8px 12px', fontSize: '.8rem', outline: 'none' }}
                    />
                    <button
                      onClick={() => sendReply(req.id)}
                      disabled={sendingReplyId === req.id || !(replyInputs[req.id] || '').trim()}
                      style={{
                        background: (sendingReplyId === req.id || !(replyInputs[req.id] || '').trim()) ? 'var(--surface-hover)' : '#6366f1',
                        color: (sendingReplyId === req.id || !(replyInputs[req.id] || '').trim()) ? 'var(--sub)' : '#fff',
                        border: 'none', borderRadius: '10px', padding: '8px 16px', fontWeight: 700, fontSize: '.78rem',
                        cursor: (sendingReplyId === req.id || !(replyInputs[req.id] || '').trim()) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {sendingReplyId === req.id ? '...' : 'Reply'}
                    </button>
                  </div>
                </div>
                {req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                    <button onClick={() => act(req.id, 'confirm')} disabled={!!acting} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 20px', fontWeight: 700, fontSize: '.85rem', cursor: acting ? 'wait' : 'pointer', opacity: acting ? 0.7 : 1 }}>
                      {acting === req.id + 'confirm' ? 'Activating…' : '✅ Unlock'}
                    </button>
                    <button onClick={() => act(req.id, 'reject')} disabled={!!acting} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '9px 20px', fontWeight: 700, fontSize: '.85rem', cursor: acting ? 'wait' : 'pointer', opacity: acting ? 0.7 : 1 }}>
                      {acting === req.id + 'reject' ? 'Rejecting…' : '❌ Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}