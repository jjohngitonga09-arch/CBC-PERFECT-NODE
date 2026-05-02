import { useState, useEffect, useRef, useCallback } from 'react'

const MODES = [
 { id:'study', label:'Study', mins:25, color:'#6366f1' },
 { id:'short', label:'Short Break', mins:5, color:'#10b981' },
 { id:'long', label:'Long Break', mins:15, color:'#f59e0b' },
]

const SUBJECTS = ['Mathematics','English','Science','Social Studies','Kiswahili','CRE','Art','Music','PE']

export default function StudyTime() {
 const [modeIdx, setModeIdx] = useState(0)
 const [seconds, setSeconds] = useState(MODES[0].mins * 60)
 const [running, setRunning] = useState(false)
 const [sessions, setSessions] = useState(0)
 const [subject, setSubject] = useState(SUBJECTS[0])
 const [log, setLog] = useState([])
 const intervalRef = useRef(null)
 const modeIdxRef = useRef(modeIdx)
 const subjectRef = useRef(subject)
 const mode = MODES[modeIdx]

 // Keep refs in sync so interval closure always has fresh values
 useEffect(() => { modeIdxRef.current = modeIdx }, [modeIdx])
 useEffect(() => { subjectRef.current = subject }, [subject])

 useEffect(() => {
 setSeconds(mode.mins * 60)
 setRunning(false)
 clearInterval(intervalRef.current)
 }, [modeIdx])

 useEffect(() => {
 if (running) {
 const currentMode = MODES[modeIdxRef.current]
 intervalRef.current = setInterval(() => {
 setSeconds(s => {
 if (s <= 1) {
 clearInterval(intervalRef.current)
 setRunning(false)
 if (modeIdxRef.current === 0) {
 setSessions(n => n + 1)
 setLog(l => [...l, {
 subject: subjectRef.current,
 mins: currentMode.mins,
 time: new Date().toLocaleTimeString()
 }])
 }
 return 0
 }
 return s - 1
 })
 }, 1000)
 } else {
 clearInterval(intervalRef.current)
 }
 return () => clearInterval(intervalRef.current)
 }, [running])

 const totalSecs = mode.mins * 60
 const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
 const secs = String(seconds % 60).padStart(2, '0')
 const pct = 1 - seconds / totalSecs

 const radius = 88
 const circ = 2 * Math.PI * radius
 const dash = pct * circ

 const reset = () => { setRunning(false); setSeconds(mode.mins * 60) }
 const toggleRunning = () => setRunning(r => !r)

 const card = { background:'#111827', border:'1px solid #1f2937', borderRadius:'14px', padding:'16px 20px', marginBottom:'12px' }

 return (
 <div>
 <div style={{ marginBottom:'24px' }}>
 <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#f9fafb', margin:'0 0 4px' }}>Study Time</h1>
 <p style={{ fontSize:'.875rem', color:'#6b7280', margin:0 }}>Pomodoro timer -- focus for 25 minutes, then take a break</p>
 </div>

 <div style={{ display:'flex', gap:'8px', marginBottom:'24px', background:'#111827', padding:'6px', borderRadius:'14px' }}>
 {MODES.map((m,i) => (
 <button key={m.id} onClick={() => setModeIdx(i)}
 style={{ flex:1, padding:'10px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:700, fontSize:'.82rem',
 background: modeIdx===i ? m.color : 'transparent',
 color: modeIdx===i ? '#fff' : '#6b7280' }}>
 {m.label}
 </button>
 ))}
 </div>

 <div style={{ ...card, marginBottom:'24px' }}>
 <label style={{ color:'#6b7280', fontSize:'.78rem', fontWeight:600, display:'block', marginBottom:'8px' }}>STUDYING:</label>
 <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
 {SUBJECTS.map(s => (
 <button key={s} onClick={() => setSubject(s)}
 style={{ padding:'6px 14px', borderRadius:'20px', border:'1px solid', cursor:'pointer', fontSize:'.78rem', fontWeight:600,
 background: subject===s ? 'rgba(99,102,241,0.15)' : 'transparent',
 borderColor: subject===s ? '#6366f1' : '#374151',
 color: subject===s ? '#a5b4fc' : '#9ca3af' }}>
 {s}
 </button>
 ))}
 </div>
 </div>

 <div style={{ textAlign:'center', marginBottom:'24px' }}>
 <div style={{ position:'relative', display:'inline-block' }}>
 <svg width="220" height="220" viewBox="0 0 200 200">
 <circle cx="100" cy="100" r={radius} fill="none" stroke="#1f2937" strokeWidth="10"/>
 <circle cx="100" cy="100" r={radius} fill="none"
 stroke={mode.color}
 strokeWidth="10"
 strokeLinecap="round"
 strokeDasharray={`${dash} ${circ}`}
 transform="rotate(-90 100 100)"
 style={{ transition: running ? 'stroke-dasharray 1s linear' : 'none' }}
 />
 </svg>
 <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
 <div style={{ fontSize:'2.4rem', fontWeight:800, color:'#f9fafb', fontFamily:'monospace', lineHeight:1 }}>
 {mins}:{secs}
 </div>
 <div style={{ fontSize:'.8rem', color:'#6b7280', marginTop:'4px' }}>{mode.label}</div>
 </div>
 </div>

 <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginTop:'20px' }}>
 <button onClick={toggleRunning}
 style={{ padding:'12px 36px', borderRadius:'12px', border:'none', cursor:'pointer', fontWeight:800, fontSize:'1rem',
 background: running ? '#374151' : mode.color, color:'#fff' }}>
 {running ? 'Pause' : seconds === totalSecs ? 'Start' : 'Resume'}
 </button>
 <button onClick={reset}
 style={{ padding:'12px 20px', borderRadius:'12px', border:'1px solid #374151', background:'transparent', color:'#9ca3af', cursor:'pointer', fontWeight:600 }}>
 Reset
 </button>
 </div>
 </div>

 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px' }}>
 <div style={{ ...card, textAlign:'center' }}>
 <p style={{ fontSize:'2.2rem', fontWeight:800, color:'#6366f1', margin:'0 0 4px' }}>{sessions}</p>
 <p style={{ color:'#6b7280', fontSize:'.78rem', margin:0 }}>Sessions today</p>
 </div>
 <div style={{ ...card, textAlign:'center' }}>
 <p style={{ fontSize:'2.2rem', fontWeight:800, color:'#10b981', margin:'0 0 4px' }}>{sessions * 25}m</p>
 <p style={{ color:'#6b7280', fontSize:'.78rem', margin:0 }}>Total study time</p>
 </div>
 </div>

 {log.length > 0 && (
 <div style={card}>
 <p style={{ fontWeight:700, color:'#f9fafb', margin:'0 0 14px', fontSize:'.9rem' }}>Session Log</p>
 {[...log].reverse().map((l,i) => (
 <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #1f2937' }}>
 <span style={{ color:'#d1d5db', fontSize:'.85rem' }}>{l.subject}</span>
 <span style={{ color:'#6b7280', fontSize:'.78rem' }}>{l.mins} min -- {l.time}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 )
}