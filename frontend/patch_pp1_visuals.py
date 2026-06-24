"""
patch_pp1_visuals.py
Adds PP1MathClassificationCard & PP1MathNumberWorkCard to CurriculumCharts.jsx
and wires them up in Notes.jsx.

Run from: C:\\Users\\pc\\OneDrive\\Desktop\\eduapp\\frontend>
Command : python patch_pp1_visuals.py
"""

import sys
from pathlib import Path

CHARTS = Path("src/pages/student/CurriculumCharts.jsx")
NOTES  = Path("src/pages/student/Notes.jsx")

# ── guard ──────────────────────────────────────────────────────────────────
charts_text = CHARTS.read_text(encoding="utf-8")
if "PP1MathClassificationCard" in charts_text:
    print("\n⚠️  Already patched. Nothing changed.\n")
    sys.exit(0)

# ── NEW COMPONENTS ─────────────────────────────────────────────────────────
NEW_COMPONENTS = r"""

// ─── PP1 Classification Visual Card ──────────────────────────────────────────
export function PP1MathClassificationCard() {
  const Dot = ({ color, size = 38 }) => (
    <span style={{ display:'inline-block', width:size+'px', height:size+'px',
      borderRadius:'50%', background:color, margin:'3px',
      boxShadow:'0 2px 6px rgba(0,0,0,.25)', flexShrink:0 }} />
  );
  const Sq = ({ color, size = 38 }) => (
    <span style={{ display:'inline-block', width:size+'px', height:size+'px',
      background:color, margin:'3px', borderRadius:'4px', flexShrink:0 }} />
  );
  const Tri = ({ color, size = 40 }) => (
    <span style={{ display:'inline-block', width:0, height:0,
      borderLeft:(size/2)+'px solid transparent',
      borderRight:(size/2)+'px solid transparent',
      borderBottom:size+'px solid '+color, margin:'4px', flexShrink:0 }} />
  );
  const Row = ({ children }) => (
    <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'4px', marginBottom:'8px' }}>
      {children}
    </div>
  );
  const GroupBox = ({ label, color, children }) => (
    <div style={{ border:'2px solid '+color, borderRadius:'10px', padding:'8px 10px',
      margin:'4px', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
      <span style={{ fontSize:'.7rem', fontWeight:700, color:color, textTransform:'uppercase' }}>{label}</span>
      <div style={{ display:'flex', flexWrap:'wrap' }}>{children}</div>
    </div>
  );
  const SH  = { fontWeight:700, color:'var(--text)', margin:'16px 0 6px', fontSize:'.88rem' };
  const SUB = { margin:'0 0 6px', fontSize:'.8rem', color:'var(--sub)' };

  return (
    <div style={{ fontSize:'.875rem', lineHeight:1.7 }}>

      <p style={SH}>A · SORTING &amp; GROUPING</p>

      <p style={SUB}>Sort by COLOUR — put the same colours together:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'14px' }}>
        <GroupBox label="Red group"    color="#ef4444"><Dot color="#ef4444"/><Dot color="#ef4444"/><Dot color="#ef4444"/></GroupBox>
        <GroupBox label="Blue group"   color="#3b82f6"><Dot color="#3b82f6"/><Dot color="#3b82f6"/><Dot color="#3b82f6"/></GroupBox>
        <GroupBox label="Yellow group" color="#f59e0b"><Dot color="#f59e0b"/><Dot color="#f59e0b"/><Dot color="#f59e0b"/></GroupBox>
      </div>

      <p style={SUB}>Sort by SIZE — big in one pile, small in another:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'20px', alignItems:'flex-end', marginBottom:'14px' }}>
        <div style={{ textAlign:'center' }}>
          <div><Dot color="#a78bfa" size={56}/><Dot color="#a78bfa" size={56}/></div>
          <span style={{ fontSize:'.72rem', fontWeight:700, color:'#a78bfa' }}>Big pile</span>
        </div>
        <div style={{ textAlign:'center' }}>
          <div><Dot color="#a78bfa" size={24}/><Dot color="#a78bfa" size={24}/></div>
          <span style={{ fontSize:'.72rem', fontWeight:700, color:'#a78bfa' }}>Small pile</span>
        </div>
      </div>

      <p style={SUB}>Sort by SHAPE — same shapes go together:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'20px' }}>
        <GroupBox label="Circles ○"   color="#f87171"><Dot color="#f87171" size={40}/><Dot color="#f87171" size={40}/><Dot color="#f87171" size={40}/></GroupBox>
        <GroupBox label="Squares □"   color="#60a5fa"><Sq  color="#60a5fa" size={38}/><Sq  color="#60a5fa" size={38}/><Sq  color="#60a5fa" size={38}/></GroupBox>
        <GroupBox label="Triangles △" color="#34d399"><Tri color="#34d399" size={40}/><Tri color="#34d399" size={40}/><Tri color="#34d399" size={40}/></GroupBox>
      </div>

      <p style={SH}>B · PATTERNING — a pattern REPEATS again and again!</p>

      <p style={SUB}>Colour pattern:</p>
      <Row>
        {['#ef4444','#3b82f6','#ef4444','#3b82f6','#ef4444','#3b82f6'].map((c,i) =>
          <Dot key={i} color={c} size={75}/>)}
        <span style={{ fontSize:'1.4rem', margin:'0 6px' }}>...</span>
      </Row>

      <p style={SUB}>Shape pattern:</p>
      <Row>
        {[0,1,2,3,4].map(i => i % 2 === 0
          ? <Dot key={i} color="#a78bfa" size={110}/>
          : <Sq  key={i} color="#f59e0b" size={105}/>)}
        <span style={{ fontSize:'1.4rem', margin:'0 6px' }}>...</span>
      </Row>

      <p style={SUB}>Object pattern — spoon and fork:</p>
      <Row>
        {['\uD83E\uDD44','\uD83C\uDF74','\uD83E\uDD44','\uD83C\uDF74','\uD83E\uDD44','\uD83C\uDF74'].map((e,i) =>
          <span key={i} style={{ fontSize:'2.4rem', margin:'2px' }}>{e}</span>)}
        <span style={{ fontSize:'1.4rem', margin:'0 6px' }}>...</span>
      </Row>

      <p style={SH}>C · MATCHING &amp; PAIRING — find the pair!</p>

      <p style={SUB}>Match objects you play with:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
        {[['\u26BD','\u26BD'],['\uD83E\uDEB6','\uD83E\uDEB6'],['\uD83D\uDE97','\uD83D\uDE97']].map(([a,b],i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px',
            background:'var(--surface,#f3f4f6)', borderRadius:'12px',
            padding:'8px 14px', fontSize:'2.4rem', border:'1px solid var(--border,#e5e7eb)' }}>
            {a}<span style={{ fontSize:'1rem' }}>&#8596;</span>{b}
          </div>
        ))}
      </div>

      <p style={SH}>D · ODD ONE OUT — find what does NOT belong!</p>

      <p style={SUB}>By colour — hearts:</p>
      <Row>
        <span style={{ fontSize:'3rem', color:'#ef4444' }}>&#9829;</span>
        <span style={{ fontSize:'3rem', color:'#ef4444' }}>&#9829;</span>
        <span style={{ fontSize:'3rem', color:'#3b82f6' }}>&#9829;</span>
        <span style={{ fontSize:'3rem', color:'#ef4444' }}>&#9829;</span>
        <span style={{ fontSize:'.85rem', marginLeft:'8px' }}>
          &#8594; <b style={{ color:'#3b82f6' }}>blue heart</b> is the odd one out!
        </span>
      </Row>

      <p style={SUB}>By size — cups:</p>
      <Row>
        <span style={{ fontSize:'3rem' }}>&#9749;</span>
        <span style={{ fontSize:'3rem' }}>&#9749;</span>
        <span style={{ fontSize:'1.5rem' }}>&#9749;</span>
        <span style={{ fontSize:'3rem' }}>&#9749;</span>
        <span style={{ fontSize:'.85rem', marginLeft:'8px' }}>
          &#8594; <b style={{ color:'#ef4444' }}>small cup</b> is different!
        </span>
      </Row>

    </div>
  );
}


// ─── PP1 Number Work Visual Card ──────────────────────────────────────────────
export function PP1MathNumberWorkCard() {
  const countRows = [
    { n:1, word:'one',   color:'#ef4444' },
    { n:2, word:'two',   color:'#f97316' },
    { n:3, word:'three', color:'#eab308' },
    { n:4, word:'four',  color:'#22c55e' },
    { n:5, word:'five',  color:'#3b82f6' },
    { n:6, word:'six',   color:'#8b5cf6' },
    { n:7, word:'seven', color:'#ec4899' },
    { n:8, word:'eight', color:'#f59e0b' },
  ];
  const words = [
    ['0','zero'],['1','one'],['2','two'],['3','three'],['4','four'],
    ['5','five'],['6','six'],['7','seven'],['8','eight'],['9','nine'],['10','ten'],
  ];

  return (
    <div style={{ fontSize:'.875rem', lineHeight:1.7 }}>

      <p style={{ fontWeight:700, color:'var(--text)', margin:'0 0 6px' }}>C · COUNTING OBJECTS</p>
      <p style={{ margin:'0 0 12px', fontSize:'.8rem', color:'var(--sub)' }}>
        Touch each circle and say its number. The LAST number = the total!
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px' }}>
        {countRows.map(({ n, word, color }) => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap',
            background:'var(--surface,#f9fafb)', borderRadius:'12px', padding:'10px 14px',
            border:'1px solid var(--border,#e5e7eb)' }}>
            <div style={{ display:'flex', flexWrap:'wrap', minWidth:'180px', flex:1 }}>
              {Array.from({ length:n }).map((_,i) => (
                <span key={i} style={{ display:'inline-block', width:'38px', height:'38px',
                  borderRadius:'50%', background:color, margin:'3px',
                  boxShadow:'0 2px 6px rgba(0,0,0,.22)' }} />
              ))}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'2px' }}>
              {Array.from({ length:n }).map((_,i) => (
                <span key={i} style={{ fontSize:'1.5rem' }}>&#9999;&#65039;</span>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', minWidth:'80px' }}>
              <span style={{ fontSize:'1.6rem', fontWeight:800, color }}>{n}</span>
              <span style={{ fontSize:'.82rem', color:'var(--sub)' }}>({word})</span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontWeight:700, color:'var(--text)', margin:'0 0 10px' }}>B · NUMBER WORDS</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px' }}>
        {words.map(([n,w]) => (
          <div key={n} style={{ background:'var(--surface,#f3f4f6)', borderRadius:'10px',
            padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px',
            border:'1px solid var(--border,#e5e7eb)' }}>
            <span style={{ fontSize:'1.7rem', fontWeight:800, color:'#6366f1', minWidth:'32px' }}>{n}</span>
            <span style={{ fontSize:'.88rem', fontWeight:600, color:'var(--text)' }}>{w}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
"""

# ── 1. Append to CurriculumCharts.jsx ──────────────────────────────────────
with CHARTS.open("a", encoding="utf-8") as f:
    f.write(NEW_COMPONENTS)
print("✅  CurriculumCharts.jsx — 2 components appended.")

# ── 2. Patch Notes.jsx import ──────────────────────────────────────────────
notes_text = NOTES.read_text(encoding="utf-8")

OLD_IMPORT = "PP1CreativeKeyCharts } from './CurriculumCharts'"
NEW_IMPORT = "PP1CreativeKeyCharts, PP1MathClassificationCard, PP1MathNumberWorkCard } from './CurriculumCharts'"

if OLD_IMPORT in notes_text:
    notes_text = notes_text.replace(OLD_IMPORT, NEW_IMPORT)
    print("✅  Notes.jsx import updated.")
else:
    print("⚠️   Import anchor not found — check Notes.jsx manually.")

# ── 3. Patch Notes.jsx rendering ──────────────────────────────────────────
OLD_RENDER = "grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Number Sense'"

NEW_RENDER = (
    "grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Classification' ? (\n"
    "                      <PP1MathClassificationCard />\n"
    "                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Number Work' ? (\n"
    "                      <PP1MathNumberWorkCard />\n"
    "                    ) : grade.id === 'PP1' && subject.id === 'Mathematics Activities' && card.title === 'Number Sense'"
)

if OLD_RENDER in notes_text:
    notes_text = notes_text.replace(OLD_RENDER, NEW_RENDER)
    print("✅  Notes.jsx rendering updated.")
else:
    print("⚠️   Render anchor not found — check Notes.jsx manually.")

NOTES.write_text(notes_text, encoding="utf-8")

print("\n🎉  All done!")
print("    Classification → coloured circles, shapes, patterns, odd-one-out")
print("    Number Work    → counting circles + number words grid\n")