import { useState } from 'react'
import PREMADE_STORIES from './storiesData'

const bg = '#0a0e17'

const GENRES = [
 { id: 'adventure', label: 'Adventure', desc: 'Exciting journeys and brave heroes', color: '#f59e0b' },
 { id: 'fantasy', label: 'Fantasy / Magic', desc: 'Magic, wizards and enchanted worlds', color: '#8b5cf6' },
 { id: 'scifi', label: 'Science Fiction', desc: 'Robots, space and future technology', color: '#3b82f6' },
 { id: 'horror', label: 'Horror', desc: 'Spooky, mysterious and thrilling tales', color: '#ef4444' },
 { id: 'humour', label: 'Humour', desc: 'Funny, silly and laugh-out-loud stories', color: '#10b981' },
 { id: 'realistic', label: 'Realistic Fiction', desc: 'Everyday life and real feelings', color: '#6366f1' },
 { id: 'survival', label: 'Survival Story', desc: 'Staying alive against all odds', color: '#f97316' },
]

function Modal({ story, genre, onClose }) {
 const [tab, setTab] = useState('story')
 const [answers, setAnswers] = useState({})
 const [score, setScore] = useState(null)
 const [copied, setCopied] = useState(false)

 const copy = () => {
 navigator.clipboard.writeText(story.title + '\n\n' + story.body)
 setCopied(true)
 setTimeout(() => setCopied(false), 2000)
 }

 const submitQuiz = () => {
 let correct = 0
 story.questions.forEach((q, i) => { if (answers[i] === q.answer) correct++ })
 setScore(correct)
 }

 const answeredAll = Object.keys(answers).length >= story.questions.length

 return (
 <div onClick={onClose} style={{
 position: 'fixed', inset: 0, zIndex: 1000,
 background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
 display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
 }}>
 <div onClick={e => e.stopPropagation()} style={{
 background: '#111827', border: '1px solid #1f2937', borderRadius: '18px',
 width: '100%', maxWidth: '700px', maxHeight: '90vh',
 display: 'flex', flexDirection: 'column', overflow: 'hidden'
 }}>
 <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1f2937', flexShrink: 0 }}>
 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
 <div>
 <p style={{ fontWeight: 800, color: '#f9fafb', margin: '0 0 3px', fontSize: '1.1rem' }}>{story.title}</p>
 <p style={{ color: '#6b7280', fontSize: '.78rem', margin: 0 }}>
 <span style={{ color: genre.color, fontWeight: 700 }}>{genre.emoji} {genre.label}</span>
 &nbsp;.&nbsp;{story.questions.length} quiz questions
 </p>
 </div>
 <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
 <button onClick={copy} style={{
 padding: '7px 14px', borderRadius: '8px', border: '1px solid #374151',
 background: copied ? 'rgba(34,197,94,0.15)' : '#0f1520',
 color: copied ? '#4ade80' : '#9ca3af', fontWeight: 600, fontSize: '.75rem', cursor: 'pointer'
 }}>{copied ? ' Copied!' : 'Copy'}</button>
 <button onClick={onClose} style={{
 padding: '7px 12px', borderRadius: '8px', border: '1px solid #374151',
 background: '#0f1520', color: '#9ca3af', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1
 }}>x</button>
 </div>
 </div>
 <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
 {['story', 'quiz'].map(t => (
 <button key={t} onClick={() => { setTab(t); if (t === 'story') { setAnswers({}); setScore(null) } }} style={{
 padding: '6px 16px', borderRadius: '8px', border: '1px solid',
 borderColor: tab === t ? genre.color : '#1f2937',
 background: tab === t ? genre.color + '22' : 'transparent',
 color: tab === t ? genre.color : '#6b7280',
 fontWeight: 700, fontSize: '.75rem', cursor: 'pointer'
 }}>
 {t === 'story' ? 'Full Story' : 'Quiz'}
 </button>
 ))}
 </div>
 </div>

 <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
 {tab === 'story' ? (
 <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '10px', padding: '24px' }}>
 {story.body.split('\n\n').map((para, i) => (
 <p key={i} style={{ color: '#d1d5db', fontSize: '.88rem', lineHeight: 1.9, margin: '0 0 14px', whiteSpace: 'pre-line' }}>{para}</p>
 ))}
 </div>
 ) : score !== null ? (
 <div style={{ textAlign: 'center', padding: '40px 20px' }}>
 <p style={{ fontSize: '3.5rem', margin: '0 0 8px' }}>
 {score === story.questions.length ? '' : score >= Math.ceil(story.questions.length / 2) ? '' : ''}
 </p>
 <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 6px' }}>
 {score}/{story.questions.length}
 </p>
 <p style={{ color: '#6b7280', fontSize: '.875rem', margin: '0 0 24px' }}>
 {score === story.questions.length ? 'Perfect score! Outstanding!' : score >= Math.ceil(story.questions.length / 2) ? 'Good job! Keep reading!' : 'Read the story again and try once more!'}
 </p>
 <button onClick={() => { setScore(null); setAnswers({}) }} style={{
 padding: '11px 28px', borderRadius: '10px', border: 'none',
 background: 'linear-gradient(135deg,' + genre.color + ',' + genre.color + 'aa)',
 color: '#fff', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer'
 }}>Try Again</button>
 </div>
 ) : (
 <div>
 {story.questions.map((q, i) => (
 <div key={i} style={{ marginBottom: '16px', padding: '16px', background: '#0d1117', borderRadius: '10px', border: '1px solid #1f2937' }}>
 <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 12px', fontSize: '.88rem', lineHeight: 1.5 }}>
 {i + 1}. {q.q}
 </p>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
 {q.options.map((opt, j) => (
 <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))} style={{
 padding: '9px 14px', borderRadius: '8px', border: '1px solid',
 borderColor: answers[i] === j ? genre.color : '#1f2937',
 background: answers[i] === j ? genre.color + '22' : '#111827',
 color: answers[i] === j ? genre.color : '#9ca3af',
 fontWeight: answers[i] === j ? 700 : 400,
 fontSize: '.82rem', cursor: 'pointer', textAlign: 'left', transition: 'all .12s'
 }}>{opt}</button>
 ))}
 </div>
 </div>
 ))}
 <button onClick={submitQuiz} disabled={!answeredAll} style={{
 width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
 background: answeredAll ? 'linear-gradient(135deg,' + genre.color + ',' + genre.color + 'bb)' : '#1f2937',
 color: answeredAll ? '#fff' : '#4b5563',
 fontWeight: 800, fontSize: '.9rem', cursor: answeredAll ? 'pointer' : 'default', marginTop: '4px'
 }}>
 {answeredAll ? 'Submit Quiz' : `Answer all questions (${Object.keys(answers).length}/${story.questions.length})`}
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 )
}

function GenreSection({ genre, onSelect }) {
 const stories = PREMADE_STORIES[genre.id] || []
 if (!stories.length) return null
 return (
 <div style={{ marginBottom: '52px' }}>
 <div style={{
 display: 'flex', alignItems: 'center', gap: '14px',
 marginBottom: '20px', paddingBottom: '14px',
 borderBottom: `2px solid ${genre.color}33`
 }}>
 <span style={{ fontSize: '1.8rem' }}>{genre.emoji}</span>
 <div style={{ flex: 1 }}>
 <h2 style={{ fontWeight: 900, color: '#f9fafb', margin: 0, fontSize: '1.4rem' }}>{genre.label}</h2>
 <p style={{ color: '#6b7280', fontSize: '.78rem', margin: 0 }}>{genre.desc}</p>
 </div>
 <span style={{
 background: genre.color + '22', color: genre.color,
 fontSize: '.68rem', fontWeight: 800, padding: '3px 10px',
 borderRadius: '20px', border: `1px solid ${genre.color}44`
 }}>{stories.length} {stories.length === 1 ? 'story' : 'stories'}</span>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
 {stories.map(s => (
 <button key={s.title} onClick={() => onSelect(s, genre)}
 onMouseEnter={e => { e.currentTarget.style.borderColor = genre.color; e.currentTarget.style.background = genre.color + '11' }}
 onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.background = '#0d1117' }}
 style={{
 background: '#0d1117', border: '1px solid #1f2937', borderRadius: '12px',
 padding: '16px', cursor: 'pointer', textAlign: 'left',
 transition: 'border-color .15s, background .15s', width: '100%'
 }}>
 <p style={{ fontWeight: 700, color: '#f9fafb', fontSize: '.9rem', margin: '0 0 6px', lineHeight: 1.4 }}>{s.title}</p>
 <p style={{ color: '#6b7280', fontSize: '.72rem', margin: 0 }}>{s.questions.length} quiz questions</p>
 </button>
 ))}
 </div>
 </div>
 )
}

export default function Stories() {
 const [modal, setModal] = useState(null)
 return (
 <div style={{ background: bg, minHeight: '100vh', padding: '28px 24px' }}>
 {modal && <Modal story={modal.story} genre={modal.genre} onClose={() => setModal(null)} />}
 <div style={{ maxWidth: '780px', margin: '0 auto' }}>
 <div style={{ marginBottom: '40px' }}>
 <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 8px' }}> Stories</h1>
 <p style={{ color: '#6b7280', margin: 0, fontSize: '.88rem' }}>
 Click any story to read in full -- then test yourself with a quiz
 </p>
 </div>
 {GENRES.map(genre => (
 <GenreSection key={genre.id} genre={genre} onSelect={(s, g) => setModal({ story: s, genre: g })} />
 ))}
 </div>
 </div>
 )
}
