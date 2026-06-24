import { useState, useEffect, useMemo, useCallback } from 'react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { CURRICULUM } from './curriculumData'
import { PP1KeyCharts, PP1ListeningAndSpeaking, PP1MathCounting, PP1MathSequence , NumberChart100 , PP1MathMeasurement, PP1CreativeMotorSkills, PP1CreativeArtCraft, PP1CreativeMusic, PP1CreativeKeyCharts, PP1MathClassificationCard, PP1MathNumberWorkCard, PP1VowelsCard, PP1CapitalLetters, PP1SmallLetters, PP1SimpleWords, PP1MathOverviewCard } from './CurriculumCharts'

const GRADES = [
  { id:'PP1',     label:'PP 1' },
  { id:'PP2',     label:'PP 2' },
  { id:'Grade 1', label:'Grade 1' },
  { id:'Grade 2', label:'Grade 2' },
  { id:'Grade 3', label:'Grade 3' },
]

const PP_SUBJECTS = [
  { id:'Language Activities',            label:'Language Activities' },
  { id:'Mathematics Activities',         label:'Mathematics Activities' },
  { id:'Creative Activities',            label:'Creative Activities' },
  { id:'Environmental Activities',       label:'Environmental Activities' },
  { id:'Religious Education Activities', label:'Religious Education' },
  { id:'PPI',                            label:'Pastoral Programme (PPI)' },
]

const UPPER_SUBJECTS = [
  { id:'Indigenous Language Activities', label:'Indigenous Language' },
  { id:'Kiswahili Language Activities',  label:'Kiswahili' },
  { id:'English Language Activities',    label:'English' },
  { id:'Mathematical Activities',        label:'Mathematics' },
  { id:'Environmental Activities',       label:'Environmental Activities' },
  { id:'Religious Education Activities', label:'Religious Education' },
  { id:'Creative Activities',            label:'Creative Activities' },
  { id:'PPI',                            label:'Pastoral Programme (PPI)' },
]

const getSubjects = (gradeId) => ['PP1','PP2'].includes(gradeId) ? PP_SUBJECTS : UPPER_SUBJECTS

const fmtDate = d => new Date(d).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })

function useNotes(userId) {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    if (!userId) return
    try { setNotes(JSON.parse(localStorage.getItem('notes_' + userId) || '[]')) } catch { setNotes([]) }
  }, [userId])
  const persist = useCallback((updated) => {
    setNotes(updated)
    try { localStorage.setItem('notes_' + userId, JSON.stringify(updated)) }
    catch (err) { console.error('[useNotes] persist failed:', err); toast.error('Could not save â€“ storage may be full.') }
  }, [userId])
  return { notes, persist }
}

function NoteModal({ note, subject, onSave, onClose }) {
  const [title,   setTitle]   = useState(note?.title   || '')
  const [content, setContent] = useState(note?.content || '')
  const isEdit = !!note?.id
  const handleSave = () => {
    if (!content.trim()) { toast.error('Please write something!'); return }
    onSave({ title: title.trim(), content: content.trim() })
  }
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div onClick={onClose}
        style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.78)' }} />
      <div style={{ position:'relative', background:'var(--surface,var(--bg))',
        border:'1px solid var(--border,var(--surface-hover))', borderRadius:'16px',
        width:'100%', maxWidth:'520px', padding:'28px',
        boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
          <h3 style={{ color:'var(--text,var(--text))', fontWeight:700, fontSize:'1rem', margin:0 }}>
            {isEdit ? 'Edit Note' : 'Add Note'}
          </h3>
          <button onClick={onClose} aria-label="Close"
            style={{ background:'var(--bg,var(--border))', border:'none', borderRadius:'8px',
              color:'var(--sub,var(--sub))', width:'32px', height:'32px',
              cursor:'pointer', fontSize:'1rem' }}>âœ•</button>
        </div>
        <p style={{ color:'var(--sub,var(--sub))', fontSize:'.78rem', margin:'0 0 16px' }}>
          {subject?.label}
        </p>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Note title (optional)"
          style={{ width:'100%', padding:'11px 14px', borderRadius:'10px',
            border:'1px solid var(--border,var(--surface-hover))', background:'var(--bg,var(--bg))',
            color:'var(--text,var(--text))', fontSize:'.9rem', outline:'none',
            marginBottom:'12px', boxSizing:'border-box' }} />
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder="Write your note here..." rows={7}
          style={{ width:'100%', padding:'11px 14px', borderRadius:'10px',
            border:'1px solid var(--border,var(--surface-hover))', background:'var(--bg,var(--bg))',
            color:'var(--text,var(--text))', fontSize:'.9rem', outline:'none',
            resize:'vertical', fontFamily:'inherit', boxSizing:'border-box', marginBottom:'20px' }} />
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={onClose}
            style={{ flex:1, padding:'11px', borderRadius:'10px',
              border:'1px solid var(--border,var(--surface-hover))', background:'transparent',
              color:'var(--sub,var(--sub))', fontWeight:600, cursor:'pointer', fontSize:'.9rem' }}>
            Cancel
          </button>
          <button onClick={handleSave}
            style={{ flex:2, padding:'11px', borderRadius:'10px', border:'none',
              background:'#6366f1', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'.9rem' }}>
            {isEdit ? 'Save Changes' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentNotes() {
  const userId = useAuthStore(s => s.userId)
  const [screen,      setScreen]      = useState('select')
  const [grade,       setGrade]       = useState(null)
  const [subject,     setSubject]     = useState(null)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [tab,         setTab]         = useState('curriculum')
  const [delId,       setDelId]       = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { notes, persist } = useNotes(userId)

  const gradeSubjects   = useMemo(() => getSubjects(grade?.id),                                                [grade])
  const myNotes         = useMemo(() => notes.filter(n => n.grade === grade?.id && n.subject === subject?.id), [notes, grade, subject])
  const curriculumCards = useMemo(() => (CURRICULUM[grade?.id] || {})[subject?.id] || [],                      [grade, subject])

  const openNew    = ()     => { setEditingNote(null); setModalOpen(true)  }
  const openEdit   = (note) => { setEditingNote(note); setModalOpen(true)  }
  const closeModal = ()     => { setEditingNote(null); setModalOpen(false) }

  const handleSave = async ({ title, content }) => {
    const isEdit = !!editingNote?.id
    let updated
    if (isEdit) {
      updated = notes.map(n => n.id === editingNote.id
        ? { ...n, title, content, updatedAt: new Date().toISOString() } : n)
      toast.success('Note updated!')
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        grade: grade.id, subject: subject.id,
        title, content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      updated = [newNote, ...notes]
      toast.success('Note saved!')
      try { await api.post('/studytime/log', { subject: subject.label, minutes: 0, points: 5 }) }
      catch (err) { if (process.env.NODE_ENV === 'development') console.error('[Notes] studytime log failed:', err) }
    }
    persist(updated)
    closeModal()
  }

  const handleDelete = id => {
    persist(notes.filter(n => n.id !== id))
    setDelId(null)
    toast.success('Note deleted')
  }

  const switchSubject = (s) => { setSubject(s); setTab('curriculum'); setSidebarOpen(false) }

  if (screen === 'select') return (
    <div style={{ maxWidth:'480px', margin:'0 auto', padding:'8px 0' }}>
      <h1 style={{ fontSize:'1.4rem', fontWeight:700, color:'var(--text,var(--text))', margin:'0 0 28px' }}>My Notes</h1>
      <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--sub,var(--sub))',
        textTransform:'uppercase', letterSpacing:'.5px', margin:'0 0 10px' }}>Select Grade</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'2px', marginBottom:'28px' }}>
        {GRADES.map(g => {
          const selected = grade?.id === g.id
          if (grade && !selected) return null
          return (
            <button key={g.id} onClick={() => { setGrade(g); setSubject(null) }}
              style={{ padding:'13px 16px', borderRadius:'10px', border:'none',
                background: selected ? '#6366f1' : 'var(--surface,var(--border))',
                color: selected ? '#fff' : 'var(--text,var(--text))',
                fontWeight: selected ? 700 : 500, fontSize:'.95rem',
                cursor:'pointer', textAlign:'left', transition:'background .15s' }}>
              {g.label}
            </button>
          )
        })}
        {grade && (
          <button onClick={() => { setGrade(null); setSubject(null) }}
            style={{ padding:'8px 16px', borderRadius:'8px', border:'none',
              background:'transparent', color:'var(--sub,var(--sub))',
              fontSize:'.78rem', cursor:'pointer', textAlign:'left', marginTop:'4px' }}>
            Change grade
          </button>
        )}
      </div>
      {grade && (
        <>
          <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--sub,var(--sub))',
            textTransform:'uppercase', letterSpacing:'.5px', margin:'0 0 10px' }}>Select Subject</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'2px', marginBottom:'28px' }}>
            {gradeSubjects.map(s => {
              const selected = subject?.id === s.id
              return (
                <button key={s.id} onClick={() => setSubject(s)}
                  style={{ padding:'13px 16px', borderRadius:'10px', border:'none',
                    background: selected ? 'var(--bg)' : 'var(--surface,var(--border))',
                    color: selected ? 'var(--text)' : 'var(--text,var(--text))',
                    fontWeight: selected ? 700 : 400, fontSize:'.9rem',
                    cursor:'pointer', textAlign:'left',
                    borderLeft: selected ? '3px solid #6366f1' : '3px solid transparent',
                    transition:'all .15s' }}>
                  {s.label}
                </button>
              )
            })}
          </div>
        </>
      )}
      {grade && subject && (
        <button onClick={() => setScreen('notes')}
          style={{ width:'100%', padding:'14px', borderRadius:'10px', border:'none',
            background:'#6366f1', color:'#fff', fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
          Continue
        </button>
      )}
    </div>
  )

  return (
    <div style={{ display:'flex', gap:'0', position:'relative', minHeight:'60vh' }}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:90 }} />
      )}
      <div style={{ position:'fixed', top:0, left:0, height:'100%', width:'240px',
        background:'var(--surface,var(--bg))', borderRight:'1px solid var(--border,var(--border))',
        zIndex:100, padding:'24px 0',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition:'transform .25s ease', overflowY:'auto' }}>
        <div style={{ padding:'0 20px 16px', borderBottom:'1px solid var(--border,var(--border))' }}>
          <p style={{ color:'var(--sub,var(--sub))', fontSize:'.72rem', fontWeight:600,
            textTransform:'uppercase', letterSpacing:'.5px', margin:'0 0 4px' }}>{grade.label}</p>
          <p style={{ color:'var(--text,var(--text))', fontWeight:700, fontSize:'.9rem', margin:0 }}>Subjects</p>
        </div>
        <div style={{ padding:'8px 0' }}>
          {gradeSubjects.map(s => (
            <button key={s.id} onClick={() => switchSubject(s)}
              style={{ width:'100%', padding:'12px 20px', border:'none',
                background: subject?.id === s.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: subject?.id === s.id ? '#a5b4fc' : 'var(--text,#d1d5db)',
                fontWeight: subject?.id === s.id ? 700 : 400, fontSize:'.875rem',
                cursor:'pointer', textAlign:'left',
                borderLeft: subject?.id === s.id ? '3px solid #6366f1' : '3px solid transparent',
                transition:'all .15s' }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border,var(--border))', marginTop:'8px' }}>
          <button onClick={() => { setSidebarOpen(false); setScreen('select') }}
            style={{ background:'transparent', border:'none', color:'var(--sub,var(--sub))',
              fontSize:'.78rem', cursor:'pointer', padding:0 }}>
            Change grade
          </button>
        </div>
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
          <button aria-label="Switch subject" onClick={() => setSidebarOpen(true)}
            style={{ background:'var(--surface,var(--border))', border:'1px solid var(--border,var(--surface-hover))',
              borderRadius:'10px', color:'var(--text,var(--text))', height:'40px', padding:'0 12px',
              cursor:'pointer', fontSize:'.78rem', fontWeight:700, flexShrink:0,
              display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap' }}>
            <span style={{ fontSize:'.95rem' }}>ðŸ“š</span> Subjects
          </button>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ color:'var(--sub,var(--sub))', fontSize:'.72rem', fontWeight:600,
              textTransform:'uppercase', letterSpacing:'.5px', margin:'0 0 2px' }}>{grade.label}</p>
            <h2 style={{ color:'var(--text,var(--text))', fontWeight:700, fontSize:'1rem', margin:0,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{subject.label}</h2>
          </div>
          <button onClick={openNew}
            style={{ background:'#6366f1', border:'none', borderRadius:'10px', color:'#fff',
              padding:'10px 16px', fontWeight:700, fontSize:'.82rem', cursor:'pointer',
              flexShrink:0, whiteSpace:'nowrap' }}>
            + Add Note
          </button>
        </div>

        <div style={{ display:'flex', gap:'0', marginBottom:'20px',
          borderBottom:'1px solid var(--border,var(--border))' }}>
          {[
            { key:'curriculum', label:'Lesson Notes', count: curriculumCards.length },
            { key:'my',         label:'My Notes',     count: myNotes.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer',
                fontWeight: tab === t.key ? 700 : 400, fontSize:'.875rem',
                color: tab === t.key ? 'var(--text,var(--text))' : 'var(--sub,var(--sub))',
                borderBottom: tab === t.key ? '2px solid #6366f1' : '2px solid transparent',
                marginBottom:'-1px', transition:'all .15s' }}>
              {t.label} <span style={{ marginLeft:'6px', fontSize:'.75rem', color:'var(--sub,var(--sub))' }}>({t.count})</span>
            </button>
          ))}
        </div>

        {tab === 'curriculum' && (
          <div>
            {curriculumCards.length === 0 ? (
              <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--sub,var(--sub))', fontSize:'.9rem' }}>
                No lesson notes yet for this subject.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {curriculumCards.map((card, i) => (
                  <div key={i} style={{ border:'1px solid var(--border,var(--border))', borderRadius:'12px',
                    background:'var(--surface,var(--bg))', padding:'14px 18px' }}>
                    <p style={{ color:'var(--text,var(--text))', fontWeight:800, fontSize:'.95rem', margin:'0 0 10px' }}>{card.title}</p>
                    {grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Capital Letters A-Z' ? (
                          <PP1CapitalLetters />
                        ) : grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Small Letters a-z' ? (
                          <PP1SmallLetters />
                        ) : grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Simple Words with Pictures' ? (
                          <PP1SimpleWords />
                        ) : grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Vowels â€” Short and Long' ? (
                          <PP1VowelsCard />
                        ) : grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Key Charts to Know' ? (
                      <PP1KeyCharts />
                    ) : grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Listening and Speaking' ? (
                      <PP1ListeningAndSpeaking />
                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Classification' ? (
                      <PP1MathClassificationCard />
                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Number Work' ? (
                      <PP1MathNumberWorkCard />
                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Number Sense' ? (
                      <PP1MathCounting />
                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Overview' ? (
                          <PP1MathOverviewCard />
                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Measurement' ? (
                      <PP1MathMeasurement />
                    ) : grade.id === 'PP1' && subject.id === 'Creative Activities' && card.title === 'Basic Motor Skills' ? (
                      <PP1CreativeMotorSkills />
                    ) : grade.id === 'PP1' && subject.id === 'Creative Activities' && card.title === 'Art and Craft' ? (
                      <PP1CreativeArtCraft />
                    ) : grade.id === 'PP1' && subject.id === 'Creative Activities' && card.title === 'Music and Rhythm' ? (
                      <PP1CreativeMusic />
                    ) : grade.id === 'PP1' && subject.id === 'Creative Activities' && card.title === 'Key Charts to Know' ? (
                      <PP1CreativeKeyCharts />
                    ) : ((['PP1','PP2'].includes(grade.id) && subject.id === 'Mathematics Activities') || (['Grade 1','Grade 2'].includes(grade.id) && subject.id === 'Mathematical Activities')) && card.title === 'Key Charts to Know' ? (
                      <NumberChart100 grade={grade.id} />
                    ) : (
                      <>
                        <p style={{ color:'var(--text,var(--text))', fontWeight:500, fontSize:'.875rem',
                          margin:0, lineHeight:1.75, whiteSpace:'pre-wrap' }}>{card.content}</p>
                        {card.images && (
                          <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'16px' }}>
                            {card.images.map((src, idx) => (
                              <img key={idx} src={src} alt={`${card.title} ${idx+1}`}
                                style={{ width:'100%', borderRadius:'10px', border:'1px solid var(--border,var(--surface-hover))' }} />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'my' && (
          <div>
            {myNotes.length === 0 ? (
              <div style={{ padding:'48px 20px', textAlign:'center' }}>
                <p style={{ color:'var(--text,var(--text))', fontWeight:600, fontSize:'.95rem', margin:'0 0 6px' }}>No notes yet</p>
                <p style={{ color:'var(--sub,var(--sub))', fontSize:'.85rem', margin:'0 0 20px' }}>
                  Write your first note for {subject.label}
                </p>
                <button onClick={openNew}
                  style={{ background:'#6366f1', border:'none', borderRadius:'10px', color:'#fff',
                    padding:'11px 24px', fontWeight:700, cursor:'pointer', fontSize:'.9rem' }}>
                  Write Note
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {myNotes.map(n => (
                  <div key={n.id} style={{ background:'var(--surface,var(--bg))',
                    border:'1px solid var(--border,var(--border))', borderLeft:'3px solid #6366f1',
                    borderRadius:'12px', padding:'16px 18px' }}>
                    {n.title && (
                      <p style={{ color:'var(--text,var(--text))', fontWeight:700, fontSize:'.9rem', margin:'0 0 8px' }}>
                        {n.title}
                      </p>
                    )}
                    <p style={{ color:'var(--text-muted,#d1d5db)', fontSize:'.875rem',
                      margin:'0 0 14px', lineHeight:1.65, whiteSpace:'pre-wrap' }}>{n.content}</p>
                    <div style={{ display:'flex', alignItems:'center',
                      justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                      <span style={{ color:'var(--sub,var(--sub))', fontSize:'.72rem' }}>
                        {n.updatedAt !== n.createdAt ? 'Edited' : 'Created'} Â· {fmtDate(n.updatedAt)}
                      </span>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => openEdit(n)}
                          style={{ background:'transparent', border:'1px solid var(--border,var(--surface-hover))',
                            color:'var(--sub,var(--sub))', borderRadius:'8px', padding:'5px 14px',
                            fontSize:'.75rem', fontWeight:600, cursor:'pointer' }}>Edit</button>
                        {delId === n.id ? (
                          <>
                            <button onClick={() => handleDelete(n.id)}
                              style={{ background:'transparent', border:'1px solid rgba(239,68,68,0.4)',
                                color:'#f87171', borderRadius:'8px', padding:'5px 12px',
                                fontSize:'.75rem', fontWeight:700, cursor:'pointer' }}>Confirm</button>
                            <button onClick={() => setDelId(null)}
                              style={{ background:'transparent', border:'none', color:'var(--sub,var(--sub))',
                                borderRadius:'8px', padding:'5px 10px', fontSize:'.75rem', cursor:'pointer' }}>Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => setDelId(n.id)}
                            style={{ background:'transparent', border:'1px solid rgba(239,68,68,0.2)',
                              color:'#f87171', borderRadius:'8px', padding:'5px 14px',
                              fontSize:'.75rem', fontWeight:600, cursor:'pointer' }}>Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <NoteModal
          note={editingNote}
          subject={subject}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
