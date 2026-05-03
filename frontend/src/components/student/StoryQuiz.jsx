import { useState } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const BADGE_THRESHOLDS = [
 { id:'story_starter', label:'Story Starter', desc:'Complete your first story quiz', icon:'', req:1 },
 { id:'bookworm', label:'Bookworm', desc:'Complete 5 story quizzes', icon:'', req:5 },
 { id:'story_master', label:'Story Master', desc:'Complete 10 story quizzes', icon:'', req:10 },
 { id:'perfect_reader', label:'Perfect Reader', desc:'Score 5/5 on any story quiz', icon:'', req:1 },
]

export default function StoryQuiz({ storyId, storyTitle, questions, genre, onDone }) {
 const userId = useAuthStore(s => s.userId)
 const [answers, setAnswers] = useState({})
 const [submitted, setSubmitted] = useState(false)
 const [saving, setSaving] = useState(false)
 const [result, setResult] = useState(null)
 const [current, setCurrent] = useState(0)

 if (!questions || questions.length === 0) return null

 const total = questions.length
 const correct = submitted ? questions.filter((q,i) => answers[i] === q.answer).length : 0
 const stars = correct === 5 ? 3 : correct >= 3 ? 2 : correct >= 1 ? 1 : 0
 const pct = Math.round((correct / total) * 100)

 async function submit() {
 if (Object.keys(answers).length < total) { toast.error('Answer all questions first'); return }
 setSubmitted(true)
 const sc = questions.filter((q,i) => answers[i] === q.answer).length
 setSaving(true)
 try {
 const r = await api.post('/quiz/story-attempt', {
 studentId: userId,
 storyId: storyId || storyTitle,
 storyTitle,
 genre: genre || 'general',
 score: sc,
 total,
 stars: sc === 5 ? 3 : sc >= 3 ? 2 : sc >= 1 ? 1 : 0,
 answers: Object.values(answers),
 })
 setResult(r.data)
 if (sc === total) toast.success('Perfect score! You earned 3 stars!')
 else toast.success(`You scored ${sc}/${total}!`)
 } catch { toast.error('Could not save result -- check your connection') }
 finally { setSaving(false) }
 }

 const pick = (qIdx, optIdx) => {
 if (submitted) return
 setAnswers(p => ({ ...p, [qIdx]: optIdx }))
 }

 const q = questions[current]

 /* -- RESULT SCREEN -- */
 if (submitted && result !== null) return (
 <div style={{ marginTop:32, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'16px', padding:'28px' }}>
 <div style={{ textAlign:'center', marginBottom:24 }}>
 <div style={{ fontSize:'3.5rem', marginBottom:8 }}>
 {pct===100?'':pct>=60?'':''}
 </div>
 <h2 style={{ color:'var(--text)', fontWeight:800, fontSize:'1.4rem', margin:'0 0 4px' }}>
 {pct===100?'Perfect!':pct>=60?'Well done!':'Keep Reading!'}
 </h2>
 <p style={{ color:'var(--sub)', fontSize:'.9rem', margin:'0 0 16px' }}>
 You scored <strong style={{color:'var(--text)'}}>{correct}/{total}</strong> -- {pct}%
 </p>

 {/* Stars */}
 <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginBottom:16 }}>
 {[1,2,3].map(i => (
 <span key={i} style={{ fontSize:'2rem', opacity: i<=stars ? 1 : 0.2 }}></span>
 ))}
 </div>

 {/* Stars earned label */}
 <div style={{ display:'inline-block', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20, padding:'4px 16px', fontSize:'.82rem', color:'#fbbf24', fontWeight:700, marginBottom:20 }}>
 +{stars} stars earned
 </div>

 {/* Badges unlocked */}
 {result?.badges?.length > 0 && (
 <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:12, padding:'14px 18px', marginBottom:16 }}>
 <p style={{ color:'#a5b4fc', fontWeight:700, fontSize:'.82rem', margin:'0 0 10px' }}>BADGES UNLOCKED!</p>
 <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center' }}>
 {result.badges.map(b => (
 <div key={b.id} style={{ background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
 <div style={{ fontSize:'1.8rem' }}>{b.icon}</div>
 <div style={{ color:'var(--text)', fontWeight:700, fontSize:'.75rem' }}>{b.label}</div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Review answers */}
 <div style={{ borderTop:'1px solid var(--border)', paddingTop:20, marginBottom:20 }}>
 <p style={{ color:'var(--sub)', fontWeight:700, fontSize:'.78rem', margin:'0 0 12px' }}>REVIEW</p>
 {questions.map((q, i) => {
 const mine = answers[i]
 const correct = q.answer
 const right = mine === correct
 return (
 <div key={i} style={{ marginBottom:14, background: right?'rgba(16,185,129,0.06)':'rgba(239,68,68,0.06)', border:`1px solid ${right?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`, borderRadius:10, padding:'12px 14px' }}>
 <p style={{ color:'var(--text)', fontWeight:600, fontSize:'.875rem', margin:'0 0 6px' }}>
 {right?'':''} {i+1}. {q.q}
 </p>
 {!right && (
 <p style={{ color:'var(--sub)', fontSize:'.78rem', margin:'0 0 2px' }}>
 Your answer: <span style={{color:'#f87171'}}>{q.options[mine]}</span>
 </p>
 )}
 <p style={{ color:'#34d399', fontSize:'.78rem', margin:0 }}>
 Correct: {q.options[correct]}
 </p>
 </div>
 )
 })}
 </div>

 <div style={{ display:'flex', gap:'10px' }}>
 <button onClick={onDone}
 style={{ flex:1, padding:'11px', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer' }}>
 Back to Stories
 </button>
 </div>
 </div>
 )

 /* -- SUBMITTED but saving -- */
 if (submitted) return (
 <div style={{ marginTop:32, textAlign:'center', padding:40, color:'var(--sub)' }}>
 <div style={{ fontSize:'2rem', marginBottom:8 }}></div>
 <p>Saving your result...</p>
 </div>
 )

 /* -- QUIZ SCREEN -- */
 const answered = Object.keys(answers).length

 return (
 <div style={{ marginTop:32 }}>
 {/* Header */}
 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
 <div>
 <h2 style={{ color:'var(--text)', fontWeight:800, fontSize:'1.1rem', margin:'0 0 2px' }}>Story Quiz</h2>
 <p style={{ color:'var(--sub)', fontSize:'.78rem', margin:0 }}>{answered}/{total} answered</p>
 </div>
 <div style={{ display:'flex', gap:'4px' }}>
 {questions.map((_,i) => (
 <div key={i} onClick={() => setCurrent(i)} style={{
 width:28, height:28, borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
 fontSize:'.72rem', fontWeight:700,
 background: answers[i]!==undefined ? (current===i?'#6366f1':'rgba(99,102,241,0.3)') : (current===i?'var(--surface-hover)':'var(--bg)'),
 border: current===i ? '2px solid #6366f1' : '1px solid var(--border)',
 color: answers[i]!==undefined ? '#fff' : 'var(--sub)',
 }}>{i+1}</div>
 ))}
 </div>
 </div>

 {/* Progress bar */}
 <div style={{ height:4, background:'var(--surface-hover)', borderRadius:4, marginBottom:24, overflow:'hidden' }}>
 <div style={{ height:'100%', width:`${(answered/total)*100}%`, background:'#6366f1', borderRadius:4, transition:'width .3s' }}/>
 </div>

 {/* Question */}
 <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px 22px', marginBottom:16 }}>
 <p style={{ color:'var(--sub)', fontSize:'.72rem', fontWeight:700, margin:'0 0 8px', textTransform:'uppercase' }}>
 Question {current+1} of {total}
 </p>
 <p style={{ color:'var(--text)', fontWeight:700, fontSize:'1rem', margin:0, lineHeight:1.5 }}>{q.q}</p>
 </div>

 {/* Options */}
 <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:24 }}>
 {q.options.map((opt, oi) => {
 const chosen = answers[current] === oi
 return (
 <button key={oi} onClick={() => pick(current, oi)}
 style={{
 textAlign:'left', padding:'12px 16px', borderRadius:12, cursor:'pointer',
 border: chosen ? '2px solid #6366f1' : '1px solid var(--border)',
 background: chosen ? 'rgba(99,102,241,0.12)' : 'var(--bg)',
 color: chosen ? '#a5b4fc' : '#d1d5db',
 fontWeight: chosen ? 700 : 400, fontSize:'.875rem',
 transition:'all .15s',
 }}>
 <span style={{ display:'inline-block', width:24, height:24, borderRadius:'50%', marginRight:10, textAlign:'center', lineHeight:'24px', fontSize:'.72rem', fontWeight:800,
 background: chosen ? '#6366f1' : 'var(--surface-hover)', color: chosen ? '#fff' : 'var(--sub)',
 }}>
 {['A','B','C','D'][oi]}
 </span>
 {opt}
 </button>
 )
 })}
 </div>

 {/* Navigation */}
 <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
 <button onClick={() => setCurrent(c => Math.max(0,c-1))} disabled={current===0}
 style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', color: current===0?'var(--surface-hover)':'var(--sub)', cursor:current===0?'default':'pointer', fontWeight:600 }}>
 Prev
 </button>

 {current < total-1 ? (
 <button onClick={() => setCurrent(c => c+1)}
 style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--surface-hover)', color:'var(--text)', cursor:'pointer', fontWeight:700 }}>
 Next Question
 </button>
 ) : (
 <button onClick={submit} disabled={answered < total}
 style={{ flex:1, padding:'10px', borderRadius:10, border:'none',
 background: answered===total ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'var(--surface-hover)',
 color: answered===total ? '#fff' : 'var(--sub)',
 cursor: answered===total ? 'pointer' : 'default', fontWeight:700 }}>
 {answered < total ? `Answer ${total-answered} more` : 'Submit Quiz'}
 </button>
 )}
 </div>
 </div>
 )
}