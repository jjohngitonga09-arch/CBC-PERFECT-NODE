/**
 * ╔══════════════════════════════════════════╗
 * ║   STUDYTIME PATCH — run from project     ║
 * ║   root:  node patch.js                   ║
 * ╚══════════════════════════════════════════╝
 */
const fs   = require('fs');
const path = require('path');

// ─── 1. FIND FILE ─────────────────────────────────────────────
function find(dir, target, depth = 0) {
  if (depth > 6) return null;
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return null; }
  for (const e of entries) {
    if (['node_modules','.git','dist','build','.next'].includes(e)) continue;
    const full = path.join(dir, e);
    try {
      if (fs.statSync(full).isDirectory()) {
        const r = find(full, target, depth + 1);
        if (r) return r;
      } else if (e === target) return full;
    } catch {}
  }
  return null;
}

const filePath = find(process.cwd(), 'StudyTime.jsx');
if (!filePath) {
  console.error('❌  StudyTime.jsx not found. Run this script from your project root.');
  process.exit(1);
}
console.log('✅  Found file:', filePath);

let src = fs.readFileSync(filePath, 'utf8');
const backup = filePath + '.backup';
fs.writeFileSync(backup, src);
console.log('💾  Backup saved:', backup);

// ─── 2. PATCH HELPER ──────────────────────────────────────────
let patchCount = 0;
function patch(label, oldStr, newStr) {
  if (!src.includes(oldStr)) {
    console.warn('⚠️  [' + label + '] pattern not found – skipping');
    return;
  }
  src = src.replace(oldStr, newStr);
  patchCount++;
  console.log('✔  [' + label + ']');
}

// ══════════════════════════════════════════════════════════════
// PATCH 1 — Fix Fill-in-Blank: show correct number of blanks
// ══════════════════════════════════════════════════════════════
patch(
  'FillInBlank – blank renderer',
  `  const blankDisplay=w.b.replace('_','___')`,
`  // Render blank pattern: each consecutive run of _ = one gap bar
  const renderBlankWord = (pattern) => {
    const segs = []
    let i = 0
    while (i < pattern.length) {
      if (pattern[i] === '_') {
        let count = 0
        while (i < pattern.length && pattern[i] === '_') { count++; i++ }
        segs.push({ type:'blank', count })
      } else {
        let txt = ''
        while (i < pattern.length && pattern[i] !== '_') { txt += pattern[i]; i++ }
        segs.push({ type:'text', txt })
      }
    }
    return segs.map((seg, idx) =>
      seg.type === 'text'
        ? <span key={idx} style={{color:'#f9fafb',fontSize:'3.2rem',fontWeight:900,fontFamily:'monospace',letterSpacing:'4px'}}>{seg.txt}</span>
        : <span key={idx} style={{
            display:'inline-block',
            width: seg.count === 1 ? '56px' : '100px',
            height:'8px',
            borderRadius:'4px',
            background:'#6366f1',
            margin:'0 8px',
            verticalAlign:'middle',
            position:'relative',
            top:'-6px'
          }}/>
    )
  }`
);

patch(
  'FillInBlank – blank render JSX',
  `        <div style={{fontSize:'2.8rem',fontWeight:900,color:'#f9fafb',letterSpacing:'8px',marginBottom:'8px',fontFamily:'monospace'}}>
          {blankDisplay}
        </div>`,
  `        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2px',marginBottom:'12px',flexWrap:'wrap'}}>
          {renderBlankWord(w.b)}
        </div>`
);

// ══════════════════════════════════════════════════════════════
// PATCH 2 — Vowels section: big child-friendly letters
// ══════════════════════════════════════════════════════════════
patch(
  'VowelsConsonants – component',
  `/* ── VOWELS & CONSONANTS ── */
function VowelsConsonants(){
  const [sel,setSel]=useState(null)
  const vowelWords={A:'Apple 🍎',E:'Egg 🥚',I:'Insect 🐛',O:'Orange 🍊',U:'Umbrella ☂️'}
  return(
    <div>
      <p style={sectionTitle('#f9fafb')}>Vowels (Irabu) & Consonants (Konsonanti)</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
        <div style={{...card({background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)'})}}>
          <p style={{...sectionTitle('#f87171'),fontSize:'.85rem'}}>Vowels — Irabu (5)</p>
          {VOWELS.map(v=>(
            <div key={v} onClick={()=>setSel(sel===v?null:v)}
              style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px',borderRadius:'8px',
                background:sel===v?'rgba(239,68,68,0.15)':'transparent',cursor:'pointer',marginBottom:'4px'}}>
              <span style={{fontSize:'1.5rem',fontWeight:900,color:'#f87171',width:'28px'}}>{v}</span>
              <span style={{fontSize:'.8rem',color:'#9ca3af'}}>{vowelWords[v]}</span>
            </div>
          ))}
        </div>
        <div style={{...card({background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.25)'})}}>
          <p style={{...sectionTitle('#60a5fa'),fontSize:'.85rem'}}>Consonants — Konsonanti (21)</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            {'BCDFGHJKLMNPQRSTVWXYZ'.split('').map(c=>(
              <span key={c} onClick={()=>setSel(sel===c?null:c)}
                style={{...badge('#3b82f6',{cursor:'pointer',fontSize:'.85rem',padding:'4px 8px',
                  background:sel===c?'rgba(59,130,246,0.25)':'rgba(59,130,246,0.1)'})}}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      {sel&&(
        <div style={{...card({background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'})}}>
          <div style={{fontSize:'4rem'}}>{LETTERS[sel]?.e||'🔤'}</div>
          <div>
            <div style={{fontSize:'2.5rem',fontWeight:900,color:'#f9fafb'}}>{sel}</div>
            <div style={{color:'#a5b4fc',fontSize:'.9rem',fontWeight:600}}>{LETTERS[sel]?.w} · {LETTERS[sel]?.s}</div>
            <div style={{color:'#5eead4',fontSize:'.8rem',marginTop:'2px'}}>Kiswahili: {LETTERS[sel]?.k}</div>
            <div style={{...badge(VOWELS.includes(sel)?'#ef4444':'#3b82f6',{marginTop:'6px',display:'inline-block'})}}>
              {VOWELS.includes(sel)?'VOWEL — Irabu':'CONSONANT — Konsonanti'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`,
  `/* ── VOWELS & CONSONANTS ── */
function VowelsConsonants(){
  const [tab, setTab] = useState('vowels')
  const [selSyl, setSelSyl] = useState(null)
  const vowelInfo = [
    {l:'A', word:'Apple',   emoji:'🍎', col:'#ef4444', sw:'Apeli'},
    {l:'E', word:'Egg',     emoji:'🥚', col:'#f97316', sw:'Yai'},
    {l:'I', word:'Insect',  emoji:'🐛', col:'#eab308', sw:'Mdudu'},
    {l:'O', word:'Orange',  emoji:'🍊', col:'#22c55e', sw:'Chungwa'},
    {l:'U', word:'Umbrella',emoji:'☂️', col:'#3b82f6', sw:'Mwavuli'},
  ]
  const vCols = {a:'#ef4444',e:'#f97316',i:'#eab308',o:'#22c55e',u:'#3b82f6'}
  const allFamilies = Object.entries(SYLLABLE_FAMILIES)
  return (
    <div>
      <p style={{fontSize:'1.3rem',fontWeight:900,color:'#f9fafb',margin:'0 0 18px'}}>
        Vowels &amp; Syllables — Irabu na Silabi
      </p>
      {/* Tab switcher */}
      <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
        {[
          {id:'vowels',  label:'🔴 Vowels — Irabu'},
          {id:'syllables',label:'📖 Syllable Families'},
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:'10px 20px',borderRadius:'24px',fontWeight:700,fontSize:'1rem',cursor:'pointer',
              border:`2px solid ${tab===t.id?'#6366f1':'#374151'}`,
              background:tab===t.id?'rgba(99,102,241,0.2)':'transparent',
              color:tab===t.id?'#a5b4fc':'#9ca3af'}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==='vowels' && (
        <div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'16px'}}>
            There are <strong style={{color:'#f87171'}}>5 vowels</strong> in English — called <strong style={{color:'#f87171'}}>Irabu</strong> in Kiswahili. Every word must have at least one vowel!
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'14px',marginBottom:'24px'}}>
            {vowelInfo.map(v=>(
              <div key={v.l} style={{background:v.col+'18',border:\`2px solid \${v.col}50\`,borderRadius:'16px',
                padding:'20px 12px',textAlign:'center'}}>
                <div style={{fontSize:'4.5rem',lineHeight:1}}>{v.emoji}</div>
                <div style={{fontSize:'4rem',fontWeight:900,color:v.col,lineHeight:1,marginTop:'8px'}}>{v.l}</div>
                <div style={{fontSize:'1.1rem',fontWeight:700,color:'#f9fafb',marginTop:'6px'}}>{v.word}</div>
                <div style={{fontSize:'0.9rem',color:'#5eead4',marginTop:'4px'}}>{v.sw}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(239,68,68,0.08)',borderRadius:'14px',padding:'16px 20px',
            border:'1px solid rgba(239,68,68,0.25)',marginBottom:'20px'}}>
            <p style={{fontWeight:800,color:'#f87171',fontSize:'1.1rem',margin:'0 0 10px'}}>🎵 The 5 Vowels — Sing them!</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              {['A','E','I','O','U'].map(v=>(
                <span key={v} style={{fontSize:'3.5rem',fontWeight:900,color:'#f87171',
                  textShadow:'0 2px 8px rgba(239,68,68,0.4)'}}>{v}</span>
              ))}
            </div>
          </div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'12px'}}>
            All other letters are <strong style={{color:'#93c5fd'}}>Consonants — Konsonanti</strong> (21 letters):
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {'BCDFGHJKLMNPQRSTVWXYZ'.split('').map(c=>(
              <div key={c} style={{width:'46px',height:'46px',borderRadius:'10px',display:'flex',alignItems:'center',
                justifyContent:'center',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.3)',
                fontWeight:800,fontSize:'1.3rem',color:'#93c5fd'}}>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='syllables' && (
        <div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'16px'}}>
            A syllable = <strong style={{color:'#f9fafb'}}>consonant + vowel</strong>. Each colored letter is a vowel sound. Tap any syllable to highlight it!
          </p>
          {/* Header row */}
          <div style={{overflowX:'auto'}}>
            <table style={{borderCollapse:'separate',borderSpacing:'4px',width:'100%'}}>
              <thead>
                <tr>
                  <th style={{padding:'10px 14px',background:'#111827',borderRadius:'8px',
                    color:'#6b7280',fontWeight:700,fontSize:'1rem',textAlign:'center',minWidth:'52px'}}>—</th>
                  {['a','e','i','o','u'].map(v=>(
                    <th key={v} style={{padding:'10px 14px',background:vCols[v]+'20',borderRadius:'8px',
                      color:vCols[v],fontWeight:900,fontSize:'1.5rem',textAlign:'center',minWidth:'62px'}}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFamilies.map(([fam, sylls])=>(
                  <tr key={fam}>
                    <td style={{padding:'10px 14px',background:'#111827',borderRadius:'8px',
                      color:'#9ca3af',fontWeight:800,fontSize:'1.1rem',textAlign:'center'}}>{fam}—</td>
                    {sylls.map((s,i)=>{
                      const v = ['a','e','i','o','u'][i]
                      const isSel = selSyl===s
                      return (
                        <td key={s} onClick={()=>setSelSyl(isSel?null:s)}
                          style={{padding:'10px 8px',borderRadius:'10px',textAlign:'center',cursor:'pointer',
                            background:isSel?vCols[v]+'30':'#0f1520',
                            border:\`2px solid \${isSel?vCols[v]:'transparent'}\`,
                            transition:'all .12s'}}>
                          <span style={{fontWeight:900,fontSize:'1.5rem',color:isSel?'#fff':vCols[v]}}>
                            <span style={{color:isSel?'#e2e8f0':'#d1d5db'}}>{fam}</span>{v}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selSyl && (
            <div style={{marginTop:'16px',padding:'16px 20px',background:'rgba(99,102,241,0.12)',
              borderRadius:'12px',border:'1px solid rgba(99,102,241,0.3)',textAlign:'center'}}>
              <span style={{color:'#a5b4fc',fontSize:'1rem'}}>You selected: </span>
              <span style={{fontSize:'3rem',fontWeight:900,color:'#f9fafb',marginLeft:'10px'}}>{selSyl}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}`
);

// ══════════════════════════════════════════════════════════════
// PATCH 3 — SyllableChart: much bigger font sizes
// ══════════════════════════════════════════════════════════════
patch(
  'SyllableChart – syllable card font',
  `                <span style={{fontSize:'2rem',fontWeight:900,color:isSel?col:'#f9fafb',letterSpacing:'-1px'}}>`,
  `                <span style={{fontSize:'3.2rem',fontWeight:900,color:isSel?col:'#f9fafb',letterSpacing:'-1px'}}>`,
);

patch(
  'SyllableChart – table cell font',
  `                    fontWeight:800,fontSize:'1rem',color:vowelColors[v],cursor:'pointer'}}`,
  `                    fontWeight:800,fontSize:'1.4rem',color:vowelColors[v],cursor:'pointer'}}`,
);

patch(
  'SyllableChart – consonant family header font',
  `style={{padding:'8px',color:'#9ca3af',fontWeight:700,borderBottom:'1px solid #111827'}}>{f}—</td>`,
  `style={{padding:'10px',color:'#9ca3af',fontWeight:800,fontSize:'1.1rem',borderBottom:'1px solid #111827'}}>{f}—</td>`,
);

// ══════════════════════════════════════════════════════════════
// PATCH 4 — Simple Words: 50+ words + bigger display
// ══════════════════════════════════════════════════════════════
patch(
  'SIMPLE_WORDS data',
  `const SIMPLE_WORDS = {
  PP1: [
    {w:'cat',e:'🐱'},{w:'dog',e:'🐕'},{w:'mat',e:'🛏️'},{w:'rat',e:'🐀'},{w:'hat',e:'🎩'},
    {w:'bat',e:'🦇'},{w:'hen',e:'🐔'},{w:'pen',e:'✏️'},{w:'ten',e:'🔟'},{w:'men',e:'👥'},
    {w:'big',e:'😮'},{w:'pig',e:'🐷'},{w:'dig',e:'⛏️'},{w:'fig',e:'🍑'},{w:'wig',e:'💇'},
    {w:'hot',e:'🌡️'},{w:'pot',e:'🍲'},{w:'dot',e:'⚫'},{w:'rot',e:'🍂'},{w:'got',e:'🎁'},
  ],
  PP2: [
    {w:'cake',e:'🎂'},{w:'lake',e:'🌊'},{w:'bake',e:'🧁'},{w:'make',e:'🔨'},{w:'take',e:'✋'},
    {w:'bike',e:'🚲'},{w:'hike',e:'🥾'},{w:'like',e:'❤️'},{w:'mike',e:'🎤'},{w:'pike',e:'🐟'},
    {w:'bone',e:'🦴'},{w:'cone',e:'🍦'},{w:'tone',e:'🎵'},{w:'zone',e:'🗺️'},{w:'lone',e:'👤'},
    {w:'mule',e:'🫏'},{w:'rule',e:'📏'},{w:'yule',e:'🎄'},{w:'dune',e:'🏜️'},{w:'tune',e:'🎶'},
  ],
}`,
  `const SIMPLE_WORDS = {
  PP1: [
    {w:'cat',e:'🐱'},{w:'dog',e:'🐕'},{w:'mat',e:'🛏️'},{w:'rat',e:'🐀'},{w:'hat',e:'🎩'},
    {w:'bat',e:'🦇'},{w:'hen',e:'🐔'},{w:'pen',e:'✏️'},{w:'ten',e:'🔟'},{w:'men',e:'👥'},
    {w:'big',e:'😮'},{w:'pig',e:'🐷'},{w:'dig',e:'⛏️'},{w:'fig',e:'🍑'},{w:'wig',e:'💇'},
    {w:'hot',e:'🌡️'},{w:'pot',e:'🍲'},{w:'dot',e:'⚫'},{w:'log',e:'🪵'},{w:'fog',e:'🌫️'},
    {w:'cup',e:'☕'},{w:'bun',e:'🍞'},{w:'bug',e:'🐛'},{w:'jug',e:'🫙'},{w:'sun',e:'☀️'},
    {w:'run',e:'🏃'},{w:'fun',e:'🎉'},{w:'nut',e:'🥜'},{w:'mud',e:'🌧️'},{w:'pup',e:'🐶'},
    {w:'lip',e:'👄'},{w:'dip',e:'🍶'},{w:'tip',e:'☝️'},{w:'sit',e:'🪑'},{w:'bit',e:'🔩'},
    {w:'map',e:'🗺️'},{w:'cap',e:'🧢'},{w:'lap',e:'🦵'},{w:'tap',e:'🚿'},{w:'nap',e:'😴'},
    {w:'web',e:'🕸️'},{w:'bed',e:'🛏️'},{w:'red',e:'🔴'},{w:'fed',e:'🍽️'},{w:'led',e:'💡'},
    {w:'hop',e:'🐸'},{w:'mop',e:'🧹'},{w:'top',e:'🎪'},{w:'pop',e:'🍾'},{w:'cop',e:'👮'},
    {w:'ant',e:'🐜'},{w:'can',e:'🥫'},{w:'fan',e:'🌬️'},{w:'van',e:'🚐'},{w:'man',e:'👦'},
    {w:'bin',e:'🗑️'},{w:'fin',e:'🐟'},{w:'pin',e:'📌'},{w:'win',e:'🏆'},{w:'tin',e:'🥫'},
  ],
  PP2: [
    {w:'cake',e:'🎂'},{w:'lake',e:'🌊'},{w:'bake',e:'🧁'},{w:'make',e:'🔨'},{w:'take',e:'✋'},
    {w:'bike',e:'🚲'},{w:'hike',e:'🥾'},{w:'like',e:'❤️'},{w:'kite',e:'🪁'},{w:'bite',e:'😬'},
    {w:'bone',e:'🦴'},{w:'cone',e:'🍦'},{w:'tone',e:'🎵'},{w:'zone',e:'🗺️'},{w:'lone',e:'👤'},
    {w:'mule',e:'🫏'},{w:'rule',e:'📏'},{w:'tune',e:'🎶'},{w:'dune',e:'🏜️'},{w:'cube',e:'📦'},
    {w:'fire',e:'🔥'},{w:'hire',e:'💼'},{w:'ride',e:'🎠'},{w:'hide',e:'🙈'},{w:'side',e:'↔️'},
    {w:'pole',e:'🪄'},{w:'hole',e:'🕳️'},{w:'note',e:'📝'},{w:'vote',e:'🗳️'},{w:'rope',e:'🪢'},
    {w:'hope',e:'🌟'},{w:'pipe',e:'🪈'},{w:'lane',e:'🛣️'},{w:'cane',e:'🦯'},{w:'game',e:'🎮'},
    {w:'name',e:'🏷️'},{w:'same',e:'👯'},{w:'pine',e:'🌲'},{w:'mine',e:'⛏️'},{w:'fine',e:'💅'},
    {w:'line',e:'📐'},{w:'time',e:'⏰'},{w:'lime',e:'🍋'},{w:'dime',e:'🪙'},{w:'fame',e:'⭐'},
    {w:'vine',e:'🍇'},{w:'wine',e:'🍷'},{w:'tame',e:'🦁'},{w:'cute',e:'😊'},{w:'mole',e:'🦔'},
    {w:'wade',e:'🌊'},{w:'fade',e:'🌅'},{w:'made',e:'🏭'},{w:'jade',e:'💎'},{w:'cape',e:'🦸'},
  ],
}`
);

// Bigger word display card
patch(
  'SimpleWordsSection – word font size',
  `              <div style={{fontWeight:700,color:'#93c5fd',fontSize:'.9rem',fontFamily:'monospace'}}>{w.w}</div>`,
  `              <div style={{fontWeight:900,color:'#93c5fd',fontSize:'1.3rem',fontFamily:'monospace'}}>{w.w}</div>`,
);

// Bigger emoji in word card
patch(
  'SimpleWordsSection – emoji size',
  `              <div style={{fontSize:'1.8rem',marginBottom:'4px'}}>{w.e}</div>`,
  `              <div style={{fontSize:'2.6rem',marginBottom:'6px'}}>{w.e}</div>`,
);

// Bigger selected word display
patch(
  'SimpleWordsSection – selected word big',
  `          <div style={{fontSize:'2rem',fontWeight:900,color:'#f9fafb',fontFamily:'monospace',letterSpacing:'4px'}}>{sel.w}</div>`,
  `          <div style={{fontSize:'3.5rem',fontWeight:900,color:'#f9fafb',fontFamily:'monospace',letterSpacing:'6px'}}>{sel.w}</div>`,
);

// ══════════════════════════════════════════════════════════════
// PATCH 5 — Prayer & Church: much more detailed content
// ══════════════════════════════════════════════════════════════
patch(
  'Prayer & Church – detailed content',
  `  if(topic.includes('Prayer')){
    const prayers=[
      {t:'Morning Prayer',e:'🌅',p:'Dear God, thank You for this new day. Help me to learn, to be kind, and to do what is right. Amen.'},
      {t:'Meal Time Prayer',e:'🍽️',p:'Thank You God for the food we are about to eat. Bless those who prepared it and those who are hungry. Amen.'},
      {t:'Bedtime Prayer',e:'🌙',p:'Dear God, thank You for today. Forgive me where I went wrong. Keep me and my family safe through the night. Amen.'},
      {t:'School Prayer',e:'📚',p:'Lord God, help me to pay attention and learn well today. Give me wisdom, patience and a good heart. Amen.'},
    ]
    return(
      <div>
        <p style={sectionTitle('#f9fafb')}>Prayer & Church — Sala na Kanisa</p>
        <div style={{...card({background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',marginBottom:'16px',padding:'16px'})}}>
          <p style={{fontWeight:700,color:'#a5b4fc',margin:'0 0 6px'}}>⛪ What is a Church?</p>
          <p style={{color:'#9ca3af',fontSize:'.85rem',margin:0}}>A church is a place where Christians gather to worship God, pray together, sing songs of praise, and listen to God's Word (the Bible). God lives in the hearts of believers — you are the church too!</p>
        </div>
        <p style={{...label,marginBottom:'10px',color:'#a5b4fc'}}>Simple Prayers — Sala Rahisi:</p>
        {prayers.map(p=>(
          <div key={p.t} style={{...card({marginBottom:'10px',padding:'14px'})}}>
            <p style={{fontWeight:700,color:'#f9fafb',margin:'0 0 6px'}}>{p.e} {p.t}</p>
            <p style={{color:'#c4b5fd',fontSize:'.88rem',fontStyle:'italic',margin:0,lineHeight:1.6}}>"{p.p}"</p>
          </div>
        ))}
      </div>
    )
  }`,
  `  if(topic.includes('Prayer')){
    const prayers=[
      {t:'Morning Prayer',e:'🌅',sw:'Sala ya Asubuhi',
        p:'Dear God, thank You for this new day. The sun has risen and I am alive because of You. Help me to learn well today, to be kind to my friends, and to do what is right. Guard me and my family as we go about our day. In Jesus name, Amen.'},
      {t:'Meal Time Prayer',e:'🍽️',sw:'Sala ya Chakula',
        p:'Heavenly Father, thank You for this food we are about to eat. You provide for us every day and we are grateful. Bless those who prepared this meal, and remember those who are hungry today. May this food give us strength to serve You. Amen.'},
      {t:'Bedtime Prayer',e:'🌙',sw:'Sala ya Usiku',
        p:'Dear God, thank You for today. Thank You for keeping me safe. Forgive me for the things I did wrong today. As I sleep, watch over me, my family, and my friends. Give me good rest so I can wake up strong tomorrow. In Jesus name, Amen.'},
      {t:'School Prayer',e:'📚',sw:'Sala ya Shule',
        p:'Lord God, thank You for the gift of learning. Help me to listen to my teacher and understand what is taught. Give me a sharp mind, a patient heart, and the courage to ask questions when I do not understand. Help me also to be a good friend to my classmates. Amen.'},
      {t:'Prayer When Afraid',e:'🙏',sw:'Sala Wakati wa Hofu',
        p:'Dear Jesus, I am afraid right now and I need You. The Bible says "Do not fear, for I am with you." Please calm my heart and remind me that You are always with me. Help me to be brave because You are stronger than anything that scares me. Amen.'},
      {t:'Prayer of Thankfulness',e:'🌟',sw:'Sala ya Shukrani',
        p:'Lord, I come to You with a thankful heart. Thank You for my family who loves me. Thank You for food, for water, for clothes, and for a place to sleep. Thank You for my teachers and my school. Most of all, thank You for sending Jesus who loves me. Amen.'},
    ]
    const churchFacts = [
      {icon:'⛪',title:'What is a Church?',
        body:"A church is a place where Christians — followers of Jesus — come together to worship God. They sing praise songs, pray together, read the Bible, and encourage one another. But the Bible also says WE are the church — every believer is part of God's family!"},
      {icon:'📖',title:'What Happens in Church?',
        body:'When Christians meet, they: (1) Worship — sing songs to honour God. (2) Pray — talk to God together. (3) Listen — a pastor or teacher shares a message from the Bible. (4) Give — they offer gifts to help the church and those in need. (5) Fellowship — they share friendship and care for one another.'},
      {icon:'✝️',title:'Why Do We Go to Church?',
        body:"We go to church because God asks us to meet with other believers. Hebrews 10:25 says \"Do not give up meeting together.\" Church helps us grow in faith, find support when life is hard, and remind each other of God's love every week."},
      {icon:'🕊️',title:'What is Prayer?',
        body:"Prayer is simply talking to God. You don't need special words — God hears you wherever you are. You can pray in the morning, at night, at school, or anywhere! There are different kinds of prayer: PRAISE (telling God how great He is), THANKS (thanking God), SORRY (asking forgiveness), and ASKING (bringing our needs to God)."},
      {icon:'📿',title:"The Lord's Prayer",
        body:'Jesus taught His disciples how to pray. This is the Lord\'s Prayer:\n"Our Father in heaven, holy is Your name. Your kingdom come, Your will be done on earth as it is in heaven. Give us today our daily bread. Forgive us our sins as we forgive those who sin against us. Lead us not into temptation but deliver us from evil. For Yours is the kingdom, the power and the glory forever. Amen." — Matthew 6:9-13'},
      {icon:'🌍',title:'Church in East Africa',
        body:"Kenya has many churches of different types — Catholic, Protestant, Pentecostal, Anglican, and more. Every Sunday, millions of Kenyan families go to church to worship God. Many schools in Kenya were started by churches who believed every child deserves an education. Your school may have been started by a church!"},
    ]
    return(
      <div>
        <p style={{fontSize:'1.3rem',fontWeight:900,color:'#f9fafb',margin:'0 0 20px'}}>Prayer & Church — Sala na Kanisa</p>

        {/* Church Facts */}
        <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'28px'}}>
          {churchFacts.map(f=>(
            <div key={f.title} style={{background:'rgba(99,102,241,0.06)',borderLeft:'4px solid #6366f1',
              borderRadius:'0 12px 12px 0',padding:'16px 20px'}}>
              <p style={{fontWeight:800,color:'#a5b4fc',margin:'0 0 8px',fontSize:'1.05rem'}}>{f.icon} {f.title}</p>
              <p style={{color:'#d1d5db',fontSize:'1rem',margin:0,lineHeight:1.8,whiteSpace:'pre-line'}}>{f.body}</p>
            </div>
          ))}
        </div>

        {/* Prayers */}
        <p style={{fontWeight:800,color:'#f9fafb',fontSize:'1.1rem',marginBottom:'14px'}}>🙏 Simple Prayers — Sala Rahisi</p>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          {prayers.map(p=>(
            <div key={p.t} style={{background:'rgba(99,102,241,0.08)',borderRadius:'14px',padding:'18px 20px',
              border:'1px solid rgba(99,102,241,0.2)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',flexWrap:'wrap',gap:'6px'}}>
                <p style={{fontWeight:800,color:'#f9fafb',margin:0,fontSize:'1.05rem'}}>{p.e} {p.t}</p>
                <span style={{background:'rgba(20,184,166,0.15)',border:'1px solid rgba(20,184,166,0.3)',
                  borderRadius:'20px',padding:'3px 12px',fontSize:'0.8rem',fontWeight:700,color:'#5eead4'}}>{p.sw}</span>
              </div>
              <p style={{color:'#c4b5fd',fontSize:'1rem',fontStyle:'italic',margin:0,lineHeight:1.8}}>"{p.p}"</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:'20px',background:'rgba(34,197,94,0.06)',borderRadius:'12px',
          padding:'16px 20px',border:'1px solid rgba(34,197,94,0.2)'}}>
          <p style={{fontWeight:700,color:'#86efac',margin:'0 0 6px',fontSize:'1rem'}}>📖 Bible Verse on Prayer</p>
          <p style={{color:'#d1fae5',fontSize:'1rem',margin:0,lineHeight:1.7,fontStyle:'italic'}}>
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
          </p>
          <p style={{color:'#6b7280',fontSize:'0.85rem',margin:'6px 0 0'}}>— Philippians 4:6</p>
        </div>
      </div>
    )
  }`
);

// ══════════════════════════════════════════════════════════════
// PATCH 6 — StudyNoteCard: clean professional look, no box-in-box
// ══════════════════════════════════════════════════════════════
patch(
  'StudyNoteCard – styling',
  `function StudyNoteCard({note}){
  return(
    <div style={{...card({marginBottom:'18px',padding:'20px',border:'1px solid #2a3547'})}}>
      <p style={{fontWeight:800,color:'#f9fafb',fontSize:'1.05rem',margin:'0 0 14px',paddingBottom:'10px',borderBottom:'1px solid #1f2937'}}>{note.title}</p>
      <p style={{fontSize:'.7rem',fontWeight:700,color:'#86efac',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'10px'}}>✅ Learning Outcomes:</p>
      {note.outcomes.map((o,i)=>(
        <div key={i} style={{color:'#d1fae5',fontSize:'.92rem',marginBottom:'10px',display:'flex',gap:'10px',lineHeight:1.65}}>
          <span style={{color:'#22c55e',flexShrink:0,marginTop:'2px'}}>•</span>{o}
        </div>
      ))}
      <p style={{fontSize:'.7rem',fontWeight:700,color:'#a5b4fc',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'10px',marginTop:'16px'}}>❓ Key Inquiry Questions:</p>
      {note.inquiries.map((q,i)=>(
        <div key={i} style={{color:'#e0e7ff',fontSize:'.92rem',marginBottom:'10px',display:'flex',gap:'10px',lineHeight:1.65}}>
          <span style={{color:'#6366f1',flexShrink:0,fontWeight:700}}>Q{i+1}.</span>{q}
        </div>
      ))}
      <div style={{marginTop:'14px',padding:'12px 16px',background:'rgba(251,191,36,0.08)',borderRadius:'10px',border:'1px solid rgba(251,191,36,0.2)'}}>
        <span style={{color:'#fde68a',fontSize:'.9rem',lineHeight:1.65}}>{note.tip}</span>
      </div>
    </div>
  )
}`,
  `function StudyNoteCard({note}){
  return(
    <div style={{marginBottom:'32px',paddingBottom:'28px',borderBottom:'1px solid #1f2937'}}>
      <p style={{fontWeight:900,color:'#f9fafb',fontSize:'1.15rem',margin:'0 0 16px'}}>{note.title}</p>
      <p style={{fontSize:'.75rem',fontWeight:700,color:'#86efac',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'12px'}}>✅ Learning Outcomes</p>
      {note.outcomes.map((o,i)=>(
        <div key={i} style={{color:'#d1fae5',fontSize:'1rem',marginBottom:'12px',display:'flex',gap:'12px',lineHeight:1.75}}>
          <span style={{color:'#22c55e',flexShrink:0,fontSize:'1.1rem',marginTop:'1px'}}>•</span>{o}
        </div>
      ))}
      <p style={{fontSize:'.75rem',fontWeight:700,color:'#a5b4fc',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'12px',marginTop:'20px'}}>❓ Key Inquiry Questions</p>
      {note.inquiries.map((q,i)=>(
        <div key={i} style={{color:'#e0e7ff',fontSize:'1rem',marginBottom:'12px',display:'flex',gap:'12px',lineHeight:1.75}}>
          <span style={{color:'#6366f1',flexShrink:0,fontWeight:800,minWidth:'28px'}}>Q{i+1}.</span>{q}
        </div>
      ))}
      <div style={{marginTop:'18px',borderLeft:'4px solid #fbbf24',paddingLeft:'16px'}}>
        <span style={{color:'#fde68a',fontSize:'1rem',lineHeight:1.75}}>{note.tip}</span>
      </div>
    </div>
  )
}`
);

// ══════════════════════════════════════════════════════════════
// PATCH 7 — Letter chart: bigger cards for children
// ══════════════════════════════════════════════════════════════
patch(
  'LetterChart – letter font size',
  `<div style={{fontSize:'2.6rem',fontWeight:900,color:isVowel?'#f87171':'#f9fafb',lineHeight:1.1}}>{l}</div>`,
  `<div style={{fontSize:'3.2rem',fontWeight:900,color:isVowel?'#f87171':'#f9fafb',lineHeight:1.1}}>{l}</div>`,
);

// ══════════════════════════════════════════════════════════════
// PATCH 8 — Animals section: bigger emoji
// ══════════════════════════════════════════════════════════════
patch(
  'AnimalsSection – emoji size',
  `<div style={{fontSize:'5rem',lineHeight:1.1,marginBottom:'2px'}}>{a.e}</div>`,
  `<div style={{fontSize:'5.5rem',lineHeight:1.1,marginBottom:'4px'}}>{a.e}</div>`,
);

// ══════════════════════════════════════════════════════════════
// PATCH 9 — FillInBlank answer buttons: bigger for kids
// ══════════════════════════════════════════════════════════════
patch(
  'FillInBlank – option buttons size',
  `style={{padding:'14px 22px',borderRadius:'12px',fontWeight:900,fontSize:'1.3rem',cursor:ans?'default':'pointer',`,
  `style={{padding:'18px 28px',borderRadius:'14px',fontWeight:900,fontSize:'1.6rem',cursor:ans?'default':'pointer',`,
);

// ══════════════════════════════════════════════════════════════
// PATCH 10 — emoji in word cards grid (SimpleWordsSection)
//             bigger grid min-width
// ══════════════════════════════════════════════════════════════
patch(
  'SimpleWordsSection – grid size',
  `<div style={grid('90px','8px')}>`,
  `<div style={grid('110px','10px')}>`,
);

// ─── 3. WRITE BACK ────────────────────────────────────────────
fs.writeFileSync(filePath, src, 'utf8');
console.log('\n🎉  All ' + patchCount + ' patches applied!');
console.log('🔄  Restart your dev server (npm start / npm run dev) to see changes.');
console.log('💾  Original backed up to:', backup);
