import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'

function fmtTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function VideoComments() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userId, user } = useAuthStore()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    Promise.all([
      api.get(`/videos/${id}`).catch(() => null),
      api.get(`/videos/${id}/comments`).catch(() => ({ data: [] }))
    ]).then(([v, c]) => {
      if (v) setVideo(v.data)
      setComments(Array.isArray(c.data) ? c.data : [])
    }).finally(() => setLoading(false))
  }, [id])

  async function sendComment() {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const r = await api.post(`/videos/${id}/comments`, {
        content: text.trim(),
        parent_id: replyTo?.id || null
      })
      setComments(prev => [...prev, r.data])
      setText('')
      setReplyTo(null)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to send comment')
    } finally { setSending(false) }
  }

  async function deleteComment(commentId) {
    if (!window.confirm('Delete this comment?')) return
    await api.delete(`/videos/${id}/comments/${commentId}`).catch(() => {})
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComment() }
  }

  const topLevel = comments.filter(c => !c.parent_id)
  const replies = (parentId) => comments.filter(c => c.parent_id === parentId)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 60, display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
          width: 36, height: 36, color: '#fff', fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>&#8592;</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {video?.title || 'Comments'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '.72rem', margin: 0 }}>{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '.85rem' }}>Loading comments...</p>
          </div>
        )}

        {!loading && topLevel.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '2.5rem', margin: '0 0 12px' }}>💬</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0 0 6px' }}>No comments yet</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '.82rem', margin: 0 }}>Be the first to comment!</p>
          </div>
        )}

        {topLevel.map(c => (
          <div key={c.id}>
            <CommentCard
              c={c}
              userId={userId}
              onReply={() => { setReplyTo(c); inputRef.current?.focus() }}
              onDelete={() => deleteComment(c.id)}
            />
            {/* Replies */}
            {replies(c.id).length > 0 && (
              <div style={{ marginLeft: 44, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {replies(c.id).map(r => (
                  <CommentCard
                    key={r.id}
                    c={r}
                    userId={userId}
                    isReply
                    onDelete={() => deleteComment(r.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* INPUT BAR */}
      <div style={{
        padding: '10px 14px 14px', background: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0
      }}>
        {replyTo && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '6px 10px', background: 'rgba(99,102,241,0.2)', borderRadius: 8, borderLeft: '3px solid #6366f1' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '.75rem' }}>Replying to <strong style={{ color: '#a5b4fc' }}>{replyTo.user_name}</strong></span>
            <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>✕</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '.85rem', flexShrink: 0
          }}>
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder={replyTo ? `Reply to ${replyTo.user_name}...` : 'Add a comment...'}
            rows={1}
            style={{
              flex: 1, resize: 'none', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20,
              padding: '9px 14px', color: '#fff', fontSize: '.88rem',
              outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
              maxHeight: 100, overflowY: 'auto'
            }}
          />
          <button
            onClick={sendComment}
            disabled={!text.trim() || sending}
            style={{
              background: text.trim() ? '#6366f1' : 'rgba(255,255,255,0.1)',
              color: '#fff', border: 'none', borderRadius: '50%',
              width: 38, height: 38, cursor: text.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', flexShrink: 0, transition: 'background .2s'
            }}
          >➤</button>
        </div>
      </div>
    </div>
  )
}

function CommentCard({ c, userId, onReply, onDelete, isReply }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: isReply ? 28 : 34, height: isReply ? 28 : 34,
        borderRadius: '50%', background: '#374151', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: isReply ? '.72rem' : '.85rem'
      }}>
        {(c.user_name || 'U')[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '.82rem' }}>{c.user_name || 'User'}</span>
          {c.user_role && <span style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', borderRadius: 4, padding: '1px 6px', fontSize: '.65rem', fontWeight: 600, textTransform: 'capitalize' }}>{c.user_role}</span>}
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '.7rem' }}>{fmtTime(c.created_at)}</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '.85rem', margin: '0 0 6px', lineHeight: 1.45, wordBreak: 'break-word' }}>{c.content}</p>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {!isReply && onReply && (
            <button onClick={onReply} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '.72rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Reply</button>
          )}
          {c.user_id === userId && (
            <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '.72rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Delete</button>
          )}
        </div>
      </div>
    </div>
  )
}
