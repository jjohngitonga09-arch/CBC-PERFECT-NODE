import { useEffect, useState, useRef } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import { getSocket } from '../../services/socketService'
import toast from 'react-hot-toast'
import Avatar from '../../components/common/Avatar'

const EMOJIS = [
 '','','','','','','','','','',
 '','','','','','','','','','',
 '','','','','','','','','','',
 '','','','','','','','','','',
 '','','','','','','','','','',
 '','','','','','','','','','',
 '','','','','','','','','','',
 '','','','','','','','','','',
]

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function fileUrl(url) {
 if (!url) return ''
 if (url.startsWith('http')) return url
 return API_BASE + url
}



function fmtTime(ts) {
 if (!ts) return ''
 const d = new Date(ts)
 const now = new Date()
 const sameDay = d.toDateString() === now.toDateString()
 if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function fmtFull(ts) {
 if (!ts) return ''
 return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Messages() {
 const { userId } = useAuthStore()
 const [convos, setConvos] = useState([])
 const [users, setUsers] = useState([])
 const [active, setActive] = useState(null) // { id, name, role, ... }
 const [msgs, setMsgs] = useState([])
 const [text, setText] = useState('')
 const [showEmoji, setShowEmoji] = useState(false)
 const [showNewChat, setShowNewChat] = useState(false)
 const [search, setSearch] = useState('')
 const [uSearch, setUSearch] = useState('')
 const [loading, setLoading] = useState(true)
 const [sending, setSending] = useState(false)
 const [isMobile, setIsMobile] = useState(window.innerWidth < 700)
 const [mView, setMView] = useState('sidebar')

 const endRef = useRef(null)
 const fileRef = useRef(null)
 const inputRef = useRef(null)

 /* loaders */
 async function loadConvos() {
 try { const r = await api.get('/messages/conversations'); setConvos(r.data) } catch {}
 }
 async function loadThread(otherId) {
 try { const r = await api.get('/messages/thread/' + otherId); setMsgs(r.data) } catch {}
 }
 async function loadUsers() {
 try { const r = await api.get('/messages/users'); setUsers(r.data) } catch {}
 }

 useEffect(() => {
 Promise.all([loadConvos(), loadUsers()]).finally(() => setLoading(false))
 }, [])

 useEffect(() => {
 const onResize = () => setIsMobile(window.innerWidth < 700)
 window.addEventListener('resize', onResize)
 return () => window.removeEventListener('resize', onResize)
 }, [])

 /* socket */
 useEffect(() => {
 const socket = getSocket()
 if (!socket) return
 const handler = (msg) => {
 loadConvos()
 if (active && (msg.sender_id === active.id || msg.receiver_id === active.id)) {
 setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg])
 }
 }
 socket.on('message:new', handler)
 return () => socket.off('message:new', handler)
 }, [active])

 useEffect(() => {
 endRef.current?.scrollIntoView({ behavior: 'smooth' })
 }, [msgs])

 /* actions */
 async function openChat(user) {
 setActive(user)
 setShowNewChat(false)
 if (isMobile) setMView('chat')
 setMsgs([])
 await loadThread(user.id)
 setConvos(prev => prev.map(c => c.id === user.id ? { ...c, unread_count: 0 } : c))
 }

 async function sendText() {
 if (!text.trim() || !active || sending) return
 const content = text.trim()
 setText('')
 setSending(true)
 try {
 const r = await api.post('/messages', { receiverId: active.id, content, type: 'text' })
 setMsgs(prev => [...prev, r.data])
 loadConvos()
 } catch { toast.error('Failed to send') }
 finally { setSending(false) }
 }

 async function sendFile(file) {
 if (!active) return
 if (file.size > 50 * 1024 * 1024) { toast.error('File must be under 50 MB'); return }
 const fd = new FormData()
 fd.append('file', file)
 fd.append('receiverId', active.id)
 try {
 const r = await api.post('/messages/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
 setMsgs(prev => [...prev, r.data])
 loadConvos()
 toast.success('File sent!')
 } catch { toast.error('Upload failed') }
 }

 function onKey(e) {
 if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText() }
 }

 const filteredConvos = convos.filter(c =>
 (c.name || '').toLowerCase().includes(search.toLowerCase())
 )
 const filteredUsers = users.filter(u =>
 (u.name || '').toLowerCase().includes(uSearch.toLowerCase()) ||
 (u.role || '').toLowerCase().includes(uSearch.toLowerCase())
 )

 /* styles */
 const SIDE_W = 300
 const containerH = 'calc(100vh - 100px)'

 const sidebarEl = (
 <div style={{
 width: isMobile ? '100%' : SIDE_W,
 minWidth: isMobile ? 'unset' : SIDE_W,
 height: containerH,
 display: 'flex', flexDirection: 'column',
 background: 'var(--surface)',
 borderRight: isMobile ? 'none' : '1px solid var(--border)',
 borderRadius: isMobile ? 'var(--radius)' : 'var(--radius) 0 0 var(--radius)',
 overflow: 'hidden',
 }}>
 {/* Sidebar header */}
 <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
 <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}> Messages</span>
 <button onClick={() => { setShowNewChat(s => !s); setUSearch('') }} style={{
 background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8,
 padding: '5px 12px', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer',
 }}>+ New</button>
 </div>
 <input
 value={search} onChange={e => setSearch(e.target.value)}
 placeholder="Search conversations"
 style={{
 width: '100%', boxSizing: 'border-box',
 background: 'var(--bg)', border: '1.5px solid var(--border)',
 borderRadius: 10, padding: '8px 12px', color: 'var(--text)',
 fontSize: '.82rem', outline: 'none',
 }}
 />
 </div>

 {/* New chat user picker */}
 {showNewChat && (
 <div style={{ borderBottom: '1px solid var(--border)', flexShrink: 0, maxHeight: 200, overflowY: 'auto' }}>
 <input
 value={uSearch} onChange={e => setUSearch(e.target.value)}
 placeholder="Find user"
 autoFocus
 style={{
 width: '100%', boxSizing: 'border-box', padding: '10px 14px',
 background: 'var(--bg)', border: 'none', borderBottom: '1px solid var(--border)',
 color: 'var(--text)', fontSize: '.82rem', outline: 'none',
 }}
 />
 {filteredUsers.map(u => (
 <div key={u.id} onClick={() => openChat(u)} style={{
 display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer',
 }}
 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
 >
 <Avatar user={u} size={32} clickable={true} />
 <div>
 <p style={{ margin: 0, fontWeight: 600, fontSize: '.82rem', color: 'var(--text)' }}>{u.name}</p>
 <p style={{ margin: 0, fontSize: '.7rem', color: 'var(--sub)', textTransform: 'capitalize' }}>{u.role}</p>
 </div>
 </div>
 ))}
 {filteredUsers.length === 0 && (
 <p style={{ padding: '10px 14px', color: 'var(--sub)', fontSize: '.8rem', margin: 0 }}>No users found</p>
 )}
 </div>
 )}

 {/* Conversations list */}
 <div style={{ flex: 1, overflowY: 'auto' }}>
 {loading && <p style={{ padding: 16, color: 'var(--sub)', fontSize: '.82rem' }}>Loading</p>}
 {!loading && filteredConvos.length === 0 && (
 <div style={{ padding: '40px 16px', textAlign: 'center' }}>
 <p style={{ fontSize: '2rem', margin: '0 0 8px' }}></p>
 <p style={{ color: 'var(--sub)', fontSize: '.82rem', margin: 0 }}>No conversations yet. Start one!</p>
 </div>
 )}
 {filteredConvos.map(c => {
 const isActive = active?.id === c.id
 const unread = c.unread_count || 0
 const preview = c.last_type === 'image' ? ' Photo'
 : c.last_type === 'video' ? ' Video'
 : c.last_type === 'gif' ? ' GIF'
 : c.last_message || ''
 return (
 <div key={c.id} onClick={() => openChat(c)} style={{
 display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer',
 background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
 borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
 transition: 'background .15s',
 }}>
 <Avatar user={c} size={40} clickable={true} />
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontWeight: unread > 0 ? 700 : 500, fontSize: '.88rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 {c.name}
 </span>
 <span style={{ fontSize: '.68rem', color: 'var(--sub)', flexShrink: 0, marginLeft: 4 }}>
 {fmtTime(c.last_at)}
 </span>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
 <span style={{
 fontSize: '.75rem', color: unread > 0 ? 'var(--text)' : 'var(--sub)',
 overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
 fontWeight: unread > 0 ? 600 : 400,
 }}>
 {preview}
 </span>
 {unread > 0 && (
 <span style={{
 background: '#ef4444', color: '#fff', borderRadius: '50%',
 width: 18, height: 18, display: 'flex', alignItems: 'center',
 justifyContent: 'center', fontSize: '.65rem', fontWeight: 800,
 flexShrink: 0, marginLeft: 6,
 }}>{unread > 9 ? '9+' : unread}</span>
 )}
 </div>
 </div>
 </div>
 )
 })}
 </div>
 </div>
 )

 const chatEl = (
 <div style={{
 flex: 1, height: containerH, display: 'flex', flexDirection: 'column',
 background: 'var(--bg)',
 borderRadius: isMobile ? 'var(--radius)' : '0 var(--radius) var(--radius) 0',
 overflow: 'hidden',
 }}>
 {!active ? (
 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
 <span style={{ fontSize: '3rem' }}></span>
 <p style={{ color: 'var(--sub)', fontWeight: 600, fontSize: '.9rem', margin: 0 }}>Select a conversation to start chatting</p>
 </div>
 ) : (
 <>
 {/* Chat header */}
 <div style={{
 display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
 borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0,
 }}>
 {isMobile && (
 <button onClick={() => setMView('sidebar')} style={{
 background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)',
 fontSize: '1.1rem', padding: '4px 8px 4px 0', fontWeight: 700,
 }}></button>
 )}
 <Avatar user={active} size={40} clickable={true} />
 <div>
 <p style={{ margin: 0, fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>{active.name}</p>
 <p style={{ margin: 0, fontSize: '.72rem', color: 'var(--sub)', textTransform: 'capitalize' }}>{active.role}</p>
 </div>
 </div>

 {/* Messages area */}
 <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
 {msgs.length === 0 && (
 <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <p style={{ color: 'var(--sub)', fontSize: '.82rem' }}>No messages yet. Say hello! </p>
 </div>
 )}
 {msgs.map((m, i) => {
 const mine = m.sender_id === userId
 const prevSame = i > 0 && msgs[i-1].sender_id === m.sender_id
 return (
 <div key={m.id || i} style={{
 display: 'flex', flexDirection: 'column',
 alignItems: mine ? 'flex-end' : 'flex-start',
 marginTop: prevSame ? 2 : 10,
 }}>
 {!mine && !prevSame && (
 <span style={{ fontSize: '.68rem', color: 'var(--sub)', marginBottom: 3, marginLeft: 4 }}>
 {m.sender_name || 'Unknown'}
 </span>
 )}
 <div style={{
 maxWidth: '72%', padding: m.type === 'text' ? '8px 12px' : '4px',
 borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
 background: mine ? 'var(--accent)' : 'var(--surface)',
 color: mine ? '#fff' : 'var(--text)',
 boxShadow: 'var(--shadow)',
 fontSize: '.88rem', lineHeight: 1.45,
 border: mine ? 'none' : '1px solid var(--border)',
 wordBreak: 'break-word',
 }}>
 {m.type === 'text' && <span>{m.content}</span>}
 {(m.type === 'image' || m.type === 'gif') && (
 <img src={fileUrl(m.content)} alt="media"
 style={{ maxWidth: 240, maxHeight: 240, borderRadius: 12, display: 'block', cursor: 'pointer' }}
 onClick={() => window.open(fileUrl(m.content), '_blank')}
 />
 )}
 {m.type === 'video' && (
 <video controls style={{ maxWidth: 280, borderRadius: 12, display: 'block' }}>
 <source src={fileUrl(m.content)} />
 </video>
 )}
 {m.type === 'file' && (
 <a href={fileUrl(m.content)} target="_blank" rel="noreferrer"
 style={{ color: mine ? '#fff' : 'var(--accent)', fontWeight: 600, fontSize: '.82rem' }}>
 Download file
 </a>
 )}
 </div>
 <span style={{ fontSize: '.62rem', color: 'var(--sub)', marginTop: 2, marginLeft: 4, marginRight: 4 }}>
 {fmtFull(m.created_at)}
 </span>
 </div>
 )
 })}
 <div ref={endRef} />
 </div>

 {/* Emoji picker */}
 {showEmoji && (
 <div style={{
 display: 'flex', flexWrap: 'wrap', gap: 4, padding: 10,
 background: 'var(--surface)', borderTop: '1px solid var(--border)',
 maxHeight: 160, overflowY: 'auto', flexShrink: 0,
 }}>
 {EMOJIS.map((em, i) => (
 <button key={i} onClick={() => { setText(t => t + em); inputRef.current?.focus() }} style={{
 background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem',
 padding: '3px 4px', borderRadius: 6, lineHeight: 1,
 transition: 'background .1s',
 }}
 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
 onMouseLeave={e => e.currentTarget.style.background = 'none'}
 >{em}</button>
 ))}
 </div>
 )}

 {/* Input bar */}
 <div style={{
 display: 'flex', alignItems: 'flex-end', gap: 8, padding: '10px 12px',
 borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0,
 }}>
 {/* Emoji toggle */}
 <button onClick={() => setShowEmoji(s => !s)} style={{
 background: showEmoji ? 'rgba(99,102,241,0.15)' : 'none',
 border: 'none', cursor: 'pointer', fontSize: '1.3rem', padding: '6px',
 borderRadius: 8, lineHeight: 1, flexShrink: 0,
 }}></button>

 {/* File attach */}
 <button onClick={() => fileRef.current?.click()} style={{
 background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
 padding: '6px', borderRadius: 8, lineHeight: 1, flexShrink: 0,
 }}></button>
 <input
 ref={fileRef} type="file" style={{ display: 'none' }}
 accept="image/*,image/gif,video/*"
 onChange={e => { if (e.target.files[0]) sendFile(e.target.files[0]); e.target.value = '' }}
 />

 {/* Text input */}
 <textarea
 ref={inputRef}
 value={text}
 onChange={e => setText(e.target.value)}
 onKeyDown={onKey}
 placeholder="Type a message"
 rows={1}
 style={{
 flex: 1, resize: 'none', background: 'var(--bg)',
 border: '1.5px solid var(--border)', borderRadius: 12,
 padding: '9px 12px', color: 'var(--text)', fontSize: '.88rem',
 outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
 maxHeight: 100, overflowY: 'auto',
 }}
 />

 {/* Send */}
 <button onClick={sendText} disabled={!text.trim() || sending} style={{
 background: text.trim() ? 'var(--accent)' : 'var(--border)',
 color: text.trim() ? '#fff' : 'var(--sub)',
 border: 'none', borderRadius: '50%', width: 38, height: 38,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 cursor: text.trim() ? 'pointer' : 'default', flexShrink: 0,
 fontSize: '1rem', transition: 'background .2s',
 }}></button>
 </div>
 </>
 )}
 </div>
 )

 /* layout */
 if (isMobile) {
 return (
 <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
 {mView === 'sidebar' ? sidebarEl : chatEl}
 </div>
 )
 }

 return (
 <div style={{
 display: 'flex', borderRadius: 'var(--radius)', overflow: 'hidden',
 boxShadow: 'var(--shadow)', border: '1px solid var(--border)',
 }}>
 {sidebarEl}
 {chatEl}
 </div>
 )
}
