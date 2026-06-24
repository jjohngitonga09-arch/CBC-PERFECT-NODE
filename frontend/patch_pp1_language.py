import sys
from pathlib import Path

CHARTS = Path("src/pages/student/CurriculumCharts.jsx")
NOTES  = Path("src/pages/student/Notes.jsx")

charts_text = CHARTS.read_text(encoding="utf-8")
if "PP1VowelsCard" in charts_text:
    print("\n Already patched. Nothing changed.\n")
    sys.exit(0)

NEW_COMPONENT = r"""

// ─── PP1 Vowels, Consonants, Alphabet & Picture-Word Card ───────────────────
export function PP1VowelsCard() {
  const vowels = [
    { letter:'A', color:'#ef4444', short:'apple',    long:'acorn',   se:'\uD83C\uDF4E', le:'\uD83C\uDF30' },
    { letter:'E', color:'#f97316', short:'egg',      long:'eel',     se:'\uD83E\uDD5A', le:'\uD83D\uDC0D' },
    { letter:'I', color:'#eab308', short:'igloo',    long:'ice',     se:'\uD83C\uDFE0', le:'\uD83E\uDDCA' },
    { letter:'O', color:'#22c55e', short:'olive',    long:'oval',    se:'\uD83E\uDED2', le:'\u2B55' },
    { letter:'U', color:'#3b82f6', short:'umbrella', long:'unicorn', se:'\u2602\uFE0F', le:'\uD83E\uDD84' },
  ];
  const consonants = 'B C D F G H J K L M N P Q R S T V W X Y Z'.split(' ');
  const pics = [
    ['\uD83C\uDF4E','Apple'],['\u26BD','Ball'],['\uD83E\uDDC1','Cupcake'],['\uD83E\uDD86','Duck'],['\uD83D\uDC18','Elephant'],
    ['\uD83D\uDEA9','Flag'],['\uD83C\uDFB8','Guitar'],['\uD83C\uDFA9','Hat'],['\uD83E\uDD8E','Iguana'],['\uD83E\uDDE5','Jacket'],
    ['\uD83E\uDE81','Kite'],['\uD83C\uDF43','Leaf'],['\uD83D\uDC35','Monkey'],['\u0039\uFE0F\u20E3','Nine'],['\uD83C\uDF4A','Orange'],
    ['\uD83D\uDC27','Penguin'],['\uD83D\uDC78','Queen'],['\uD83D\uDC07','Rabbit'],['\u2B50','Starfish'],['\uD83D\uDE82','Train'],
    ['\u2602\uFE0F','Umbrella'],['\uD83E\uDDBA','Vest'],['\uD83D\uDC0B','Whale'],['\uD83C\uDFB5','Xylophone'],['\uD83E\uDE80','Yo-yo'],
    ['\uD83E\uDD93','Zebra'],['\uD83D\uDC31','Cat'],['\uD83D\uDC1F','Fish'],['\uD83D\uDC15','Dog'],['\u2600\uFE0F','Sun'],
  ];
  const missing = [
    { seq:['A','B','_','D','E'], ans:'C' },
    { seq:['_','E','F','G','H'], ans:'D' },
    { seq:['C','D','E','_','G'], ans:'F' },
    { seq:['L','M','N','O','_'], ans:'P' },
    { seq:['H','_','J','K','L'], ans:'I' },
    { seq:['S','T','_','V','W'], ans:'U' },
  ];
  const SH = { fontWeight:800, color:'var(--text)', margin:'22px 0 10px', fontSize:'1rem' };

  return (
    <div style={{ fontSize:'.9rem', lineHeight:1.7 }}>

      <p style={SH}>\uD83D\uDD24 THE 5 VOWELS</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'24px' }}>
        {vowels.map(v => (
          <div key={v.letter} style={{ border:'3px solid '+v.color, borderRadius:'14px',
            padding:'12px 10px', textAlign:'center', minWidth:'110px', flex:1 }}>
            <div style={{ fontSize:'4rem', fontWeight:900, color:v.color, lineHeight:1 }}>{v.letter}</div>
            <div style={{ fontSize:'3rem', margin:'6px 0 2px' }}>{v.se}</div>
            <div style={{ fontSize:'.8rem', fontWeight:700, color:v.color }}>SHORT: {v.short}</div>
            <div style={{ fontSize:'3rem', margin:'6px 0 2px' }}>{v.le}</div>
            <div style={{ fontSize:'.8rem', fontWeight:700, color:v.color }}>LONG: {v.long}</div>
          </div>
        ))}
      </div>

      <p style={SH}>\uD83D\uDD21 CONSONANTS — All 21</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' }}>
        {consonants.map(c => (
          <div key={c} style={{ width:'54px', height:'54px', borderRadius:'10px',
            background:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.9rem', fontWeight:900, color:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,.2)' }}>
            {c}
          </div>
        ))}
      </div>

      <p style={SH}>\uD83D\uDD20 BIG LETTERS — A to Z</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c,i) => (
          <div key={c} style={{ width:'54px', height:'54px', borderRadius:'10px',
            background:'hsl('+(i*13)+',70%,55%)', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'1.9rem', fontWeight:900, color:'#fff',
            boxShadow:'0 2px 6px rgba(0,0,0,.2)' }}>
            {c}
          </div>
        ))}
      </div>

      <p style={SH}>\uD83D\uDD21 SMALL LETTERS — a to z</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' }}>
        {'abcdefghijklmnopqrstuvwxyz'.split('').map((c,i) => (
          <div key={c} style={{ width:'54px', height:'54px', borderRadius:'10px',
            border:'2px solid hsl('+(i*13)+',70%,55%)', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'1.9rem', fontWeight:900,
            color:'hsl('+(i*13)+',70%,40%)' }}>
            {c}
          </div>
        ))}
      </div>

      <p style={SH}>\uD83D\uDDBC\uFE0F PICTURE — WORD CARDS</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(105px,1fr))',
        gap:'10px', marginBottom:'24px' }}>
        {pics.map(([emoji,word]) => (
          <div key={word} style={{ background:'var(--surface,#f3f4f6)',
            border:'1px solid var(--border,#e5e7eb)', borderRadius:'12px',
            padding:'10px 6px', textAlign:'center' }}>
            <div style={{ fontSize:'3.5rem', lineHeight:1.1 }}>{emoji}</div>
            <div style={{ fontSize:'.9rem', fontWeight:800, color:'var(--text)', marginTop:'6px' }}>{word}</div>
          </div>
        ))}
      </div>

      <p style={SH}>\u2753 MISSING LETTERS — Find what goes in the blank!</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
        {missing.map((row,ri) => (
          <div key={ri} style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap',
            background:'var(--surface,#f9fafb)', borderRadius:'12px', padding:'10px 14px',
            border:'1px solid var(--border,#e5e7eb)' }}>
            {row.seq.map((ch,ci) => ch === '_' ? (
              <div key={ci} style={{ width:'58px', height:'58px', borderRadius:'10px',
                border:'3px dashed #6366f1', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'2rem', fontWeight:900,
                color:'#6366f1', background:'#eef2ff' }}>
                {row.ans}
              </div>
            ) : (
              <div key={ci} style={{ width:'58px', height:'58px', borderRadius:'10px',
                background:'#6366f1', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'2rem', fontWeight:900, color:'#fff' }}>
                {ch}
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
"""

with CHARTS.open("a", encoding="utf-8") as f:
    f.write(NEW_COMPONENT)
print("OK  CurriculumCharts.jsx updated.")

notes_text = NOTES.read_text(encoding="utf-8")

OLD_IMPORT = "PP1MathNumberWorkCard } from './CurriculumCharts'"
NEW_IMPORT = "PP1MathNumberWorkCard, PP1VowelsCard } from './CurriculumCharts'"
if OLD_IMPORT in notes_text:
    notes_text = notes_text.replace(OLD_IMPORT, NEW_IMPORT)
    print("OK  import updated.")
else:
    print("WARN import anchor not found.")

OLD_RENDER = "grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Key Charts to Know'"
NEW_RENDER = (
    "grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Vowels \u2014 Short and Long' ? (\n"
    "                          <PP1VowelsCard />\n"
    "                        ) : grade.id === 'PP1' && subject.id === 'Language Activities' && card.title === 'Key Charts to Know'"
)
if OLD_RENDER in notes_text:
    notes_text = notes_text.replace(OLD_RENDER, NEW_RENDER)
    print("OK  render updated.")
else:
    print("WARN render anchor not found.")

NOTES.write_text(notes_text, encoding="utf-8")
print("\nDone! Restart dev server then open Vowels card.")