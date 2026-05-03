const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const VOWELS   = new Set(['A','E','I','O','U'])
const WORDS_20 = [
  'cat','dog','mat','hat','bat',
  'rat','pan','can','man','fan',
  'sun','run','fun','bus','cup',
  'bug','mug','rug','jug','hen',
]
const CLASSROOM = ['Door','Table','Chair','Board','Window','Bag','Book','Pen']
const IRABU       = ['A','E','I','O','U']
const KONSONANTI  = ['B','C','D','F','G','H','J','K','L','M','N','P','R','S','T','V','W','Y','Z']

// ── tiny helpers ────────────────────────────────────────────────
function Tag({ children }) {
  return (
    <div style={{ display:'inline-block', background:'#6366f1', color:'#fff',
      fontWeight:800, fontSize:'.72rem', letterSpacing:'1px',
      textTransform:'uppercase', padding:'5px 12px', borderRadius:'6px',
      marginBottom:'10px' }}>
      {children}
    </div>
  )
}

// ── A–Z grid ────────────────────────────────────────────────────
function AlphabetChart() {
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Alphabet Chart  A – Z</Tag>
      <div style={{ display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(46px,1fr))', gap:'5px' }}>
        {ALPHABET.map(l => (
          <div key={l} style={{
            background: VOWELS.has(l) ? 'rgba(99,102,241,.18)' : 'var(--surface,var(--border))',
            border: VOWELS.has(l) ? '2px solid #6366f1' : '1px solid var(--border,var(--surface-hover))',
            borderRadius:'8px', textAlign:'center', padding:'7px 2px',
          }}>
            <div style={{ color: VOWELS.has(l) ? '#a5b4fc' : 'var(--text,var(--text))',
              fontWeight:900, fontSize:'1.55rem', lineHeight:1 }}>{l}</div>
            <div style={{ color:'var(--sub,var(--sub))', fontSize:'.6rem', marginTop:'2px' }}>{l.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Vowels ──────────────────────────────────────────────────────
function VowelsChart() {
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Vowels  A  E  I  O  U</Tag>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
        {[...VOWELS].map(v => (
          <div key={v} style={{
            background:'rgba(99,102,241,.15)', border:'2px solid #6366f1',
            borderRadius:'12px', width:'64px', height:'64px',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
          }}>
            <div style={{ color:'#a5b4fc', fontWeight:900, fontSize:'2rem', lineHeight:1 }}>{v}</div>
            <div style={{ color:'var(--sub,var(--sub))', fontSize:'.68rem' }}>{v.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 20 Simple Words ─────────────────────────────────────────────
function SimpleWordsChart() {
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>20 Simple Words</Tag>
      <div style={{ display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))', gap:'5px' }}>
        {WORDS_20.map((w,i) => (
          <div key={w} style={{
            background:'var(--surface,var(--border))',
            border:'1px solid var(--border,var(--surface-hover))',
            borderRadius:'8px', padding:'7px 10px',
            display:'flex', alignItems:'center', gap:'6px',
          }}>
            <span style={{ color:'var(--sub,var(--sub))', fontSize:'.62rem', fontWeight:700 }}>{i+1}.</span>
            <span style={{ color:'var(--text,var(--text))', fontWeight:700, fontSize:'.875rem' }}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Lines Tracing ───────────────────────────────────────────────
function LinesTracingChart() {
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Shapes &amp; Lines Tracing</Tag>
      <div style={{
        background:'var(--surface,var(--border))',
        border:'1px solid var(--border,var(--surface-hover))',
        borderRadius:'12px', padding:'14px',
      }}>
        <div style={{ color:'var(--sub,var(--sub))', fontSize:'.68rem', fontWeight:700, marginBottom:'4px' }}>
          STRAIGHT DOTTED LINE
        </div>
        <svg width="100%" height="22" viewBox="0 0 300 22" style={{ marginBottom:'12px' }}>
          <line x1="10" y1="11" x2="290" y2="11" stroke="#6366f1" strokeWidth="3" strokeDasharray="8 6"/>
        </svg>

        <div style={{ color:'var(--sub,var(--sub))', fontSize:'.68rem', fontWeight:700, marginBottom:'4px' }}>
          ZIGZAG LINE
        </div>
        <svg width="100%" height="36" viewBox="0 0 300 36" style={{ marginBottom:'12px' }}>
          <polyline
            points="10,28 40,8 70,28 100,8 130,28 160,8 190,28 220,8 250,28 280,8"
            fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round"/>
        </svg>

        <div style={{ color:'var(--sub,var(--sub))', fontSize:'.68rem', fontWeight:700, marginBottom:'4px' }}>
          CURVED LINE
        </div>
        <svg width="100%" height="36" viewBox="0 0 300 36">
          <path d="M10,28 Q50,4 90,28 Q130,52 170,28 Q210,4 250,28 Q270,38 290,28"
            fill="none" stroke="#10b981" strokeWidth="3"/>
        </svg>
      </div>
    </div>
  )
}

// ── Classroom Labels  (~2 cm = 75 px tall) ──────────────────────
function ClassroomLabels() {
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Classroom Labels  (2 cm)</Tag>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
        {CLASSROOM.map(item => (
          <div key={item} style={{
            background:'var(--surface,var(--border))',
            border:'2px dashed #6366f1', borderRadius:'8px',
            height:'75px', minWidth:'90px', padding:'0 14px',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'var(--text,var(--text))', fontWeight:800, fontSize:'1rem' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Shapes Chart  (~3 cm = 113 px per shape) ────────────────────
function ShapesChart() {
  const S = 113
  const shapes = [
    { name:'Circle',
      svg:<svg width={S} height={S} viewBox="0 0 100 100"><circle cx="50" cy="50" r="43" fill="rgba(99,102,241,.15)" stroke="#6366f1" strokeWidth="5"/></svg> },
    { name:'Square',
      svg:<svg width={S} height={S} viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" fill="rgba(245,158,11,.15)" stroke="#f59e0b" strokeWidth="5"/></svg> },
    { name:'Triangle',
      svg:<svg width={S} height={S} viewBox="0 0 100 100"><polygon points="50,7 93,93 7,93" fill="rgba(16,185,129,.15)" stroke="#10b981" strokeWidth="5"/></svg> },
    { name:'Rectangle',
      svg:<svg width={S} height={S} viewBox="0 0 100 100"><rect x="8" y="23" width="84" height="54" fill="rgba(239,68,68,.15)" stroke="#ef4444" strokeWidth="5"/></svg> },
  ]
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Shapes Chart  (3 cm each)</Tag>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
        {shapes.map(s => (
          <div key={s.name} style={{
            background:'var(--surface,var(--border))',
            border:'1px solid var(--border,var(--surface-hover))',
            borderRadius:'12px', padding:'12px',
            display:'flex', flexDirection:'column',
            alignItems:'center', gap:'6px',
          }}>
            {s.svg}
            <span style={{ color:'var(--text,var(--text))', fontWeight:700, fontSize:'.875rem' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Kiswahili: Irabu ────────────────────────────────────────────
function IrabuChart() {
  const C = '38px'   // ~1 cm
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Irabu  (Vowels / Vokali)</Tag>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {IRABU.map(v => (
          <div key={v} style={{
            background:'rgba(99,102,241,.15)', border:'2px solid #6366f1',
            borderRadius:'8px', width:C, height:C,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:'1.05rem', color:'#a5b4fc',
          }}>{v}</div>
        ))}
      </div>
    </div>
  )
}

// ── Kiswahili: Konsonanti ───────────────────────────────────────
function KonsonantiChart() {
  const C = '38px'
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Konsonanti  (Consonants)</Tag>
      <div style={{ display:'grid',
        gridTemplateColumns:`repeat(auto-fill,minmax(${C},1fr))`, gap:'5px' }}>
        {KONSONANTI.map(c => (
          <div key={c} style={{
            background:'var(--surface,var(--border))',
            border:'1px solid var(--border,var(--surface-hover))',
            borderRadius:'8px', width:C, height:C,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'1rem', color:'var(--text,var(--text))',
          }}>{c}</div>
        ))}
      </div>
    </div>
  )
}

// ── Kiswahili: Nambari 1–50 ─────────────────────────────────────
function NambariChart() {
  const C = '38px'
  return (
    <div style={{ marginBottom:'22px' }}>
      <Tag>Nambari  1 – 50</Tag>
      <div style={{ display:'grid',
        gridTemplateColumns:`repeat(auto-fill,minmax(${C},1fr))`, gap:'5px' }}>
        {Array.from({length:50},(_,i)=>i+1).map(n => (
          <div key={n} style={{
            background: n%5===0 ? 'rgba(99,102,241,.15)' : 'var(--surface,var(--border))',
            border: n%5===0 ? '2px solid #6366f1' : '1px solid var(--border,var(--surface-hover))',
            borderRadius:'8px', width:C, height:C,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: n%5===0 ? 800 : 600,
            fontSize:'.85rem',
            color: n%5===0 ? '#a5b4fc' : 'var(--text,var(--text))',
          }}>{n}</div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// Exported composites
// ════════════════════════════════════════════════════════════════
export function LanguageCharts() {
  return (
    <div style={{ marginBottom:'20px', padding:'16px',
      background:'var(--bg,var(--bg))', borderRadius:'14px',
      border:'1px solid var(--border,var(--border))' }}>
      <AlphabetChart />
      <VowelsChart />
      <SimpleWordsChart />
      <LinesTracingChart />
      <ClassroomLabels />
      <ShapesChart />
    </div>
  )
}

export function KiswahiliCharts() {
  return (
    <div style={{ marginBottom:'20px', padding:'16px',
      background:'var(--bg,var(--bg))', borderRadius:'14px',
      border:'1px solid var(--border,var(--border))' }}>
      <IrabuChart />
      <KonsonantiChart />
      <NambariChart />
      <ShapesChart />
    </div>
  )
}
