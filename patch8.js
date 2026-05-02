const fs = require('fs');
const path = require('path');

function find(dir, target, depth = 0) {
  if (depth > 6) return null;
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return null; }
  for (const e of entries) {
    if (['node_modules','.git','dist','build'].includes(e)) continue;
    const full = path.join(dir, e);
    try {
      if (fs.statSync(full).isDirectory()) { const r = find(full, target, depth+1); if (r) return r; }
      else if (e === target) return full;
    } catch {}
  }
  return null;
}

const filePath = find(process.cwd(), 'StudyTime.jsx');
if (!filePath) { console.error('StudyTime.jsx not found'); process.exit(1); }
console.log('Found:', filePath);

let src = fs.readFileSync(filePath, 'utf8');
const backup = filePath + '.backup2';
fs.writeFileSync(backup, src);
console.log('Backup saved:', backup);

let count = 0;
function patch(label, oldStr, newStr) {
  if (!src.includes(oldStr)) { console.warn('SKIP [' + label + '] – pattern not found'); return; }
  src = src.replace(oldStr, newStr);
  count++;
  console.log('OK   [' + label + ']');
}

// ── 1. FillInBlank JSX — replace {blankDisplay} with renderBlankWord call ──
patch(
  'FillInBlank blank JSX',
  `        <div style={{fontSize:'2.8rem',fontWeight:900,color:'#f9fafb',letterSpacing:'8px',marginBottom:'8px',fontFamily:'monospace'}}>
          {blankDisplay}
        </div>`,
  `        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2px',marginBottom:'12px',flexWrap:'wrap'}}>
          {renderBlankWord(w.b)}
        </div>`
);

// ── 2. VowelsConsonants — full replace ──
patch(
  'VowelsConsonants component',
  `function VowelsConsonants(){

  const [sel,setSel]=useState(null)

  const vowelWords={A:'Apple \uD83C\uDF4E',E:'Egg \uD83E\uDD5A',I:'Insect \uD83D\uDC1B',O:'Orange \uD83C\uDF4A',U:'Umbrella \u2602\uFE0F'}

  return(

    <div>

      <p style={sectionTitle('#f9fafb')}>Vowels (Irabu) & Consonants (Konsonanti)</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>

        <div style={{...card({background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)'})}}>

          <p style={{...sectionTitle('#f87171'),fontSize:'.85rem'}}>Vowels \u2014 Irabu (5)</p>

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

          <p style={{...sectionTitle('#60a5fa'),fontSize:'.85rem'}}>Consonants \u2014 Konsonanti (21)</p>

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

          <div style={{fontSize:'4rem'}}>{LETTERS[sel]?.e||'\uD83D\uDD24'}</div>

          <div>

            <div style={{fontSize:'2.5rem',fontWeight:900,color:'#f9fafb'}}>{sel}</div>

            <div style={{color:'#a5b4fc',fontSize:'.9rem',fontWeight:600}}>{LETTERS[sel]?.w} \u00B7 {LETTERS[sel]?.s}</div>

            <div style={{color:'#5eead4',fontSize:'.8rem',marginTop:'2px'}}>Kiswahili: {LETTERS[sel]?.k}</div>

            <div style={{...badge(VOWELS.includes(sel)?'#ef4444':'#3b82f6',{marginTop:'6px',display:'inline-block'})}}>

              {VOWELS.includes(sel)?'VOWEL \u2014 Irabu':'CONSONANT \u2014 Konsonanti'}

            </div>

          </div>

        </div>

      )}

    </div>

  )

}`,
  `function VowelsConsonants(){
  const [tab, setTab] = useState('vowels')
  const [selSyl, setSelSyl] = useState(null)
  const vowelInfo = [
    {l:'A', word:'Apple',   emoji:'\uD83C\uDF4E', col:'#ef4444', sw:'Apeli'},
    {l:'E', word:'Egg',     emoji:'\uD83E\uDD5A', col:'#f97316', sw:'Yai'},
    {l:'I', word:'Insect',  emoji:'\uD83D\uDC1B', col:'#eab308', sw:'Mdudu'},
    {l:'O', word:'Orange',  emoji:'\uD83C\uDF4A', col:'#22c55e', sw:'Chungwa'},
    {l:'U', word:'Umbrella',emoji:'\u2602\uFE0F', col:'#3b82f6', sw:'Mwavuli'},
  ]
  const vCols = {a:'#ef4444',e:'#f97316',i:'#eab308',o:'#22c55e',u:'#3b82f6'}
  const allFamilies = Object.entries(SYLLABLE_FAMILIES)
  return (
    <div>
      <p style={{fontSize:'1.3rem',fontWeight:900,color:'#f9fafb',margin:'0 0 18px'}}>
        Vowels &amp; Syllables \u2014 Irabu na Silabi
      </p>
      <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
        {[{id:'vowels',label:'\uD83D\uDD34 Vowels \u2014 Irabu'},{id:'syllables',label:'\uD83D\uDCD6 Syllable Families'}].map(t=>(
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
            There are <strong style={{color:'#f87171'}}>5 vowels</strong> in English \u2014 called <strong style={{color:'#f87171'}}>Irabu</strong> in Kiswahili. Every word must have at least one vowel!
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'14px',marginBottom:'24px'}}>
            {vowelInfo.map(v=>(
              <div key={v.l} style={{background:v.col+'18',border:`2px solid ${v.col}50`,borderRadius:'16px',padding:'20px 12px',textAlign:'center'}}>
                <div style={{fontSize:'4.5rem',lineHeight:1}}>{v.emoji}</div>
                <div style={{fontSize:'4rem',fontWeight:900,color:v.col,lineHeight:1,marginTop:'8px'}}>{v.l}</div>
                <div style={{fontSize:'1.1rem',fontWeight:700,color:'#f9fafb',marginTop:'6px'}}>{v.word}</div>
                <div style={{fontSize:'0.9rem',color:'#5eead4',marginTop:'4px'}}>{v.sw}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(239,68,68,0.08)',borderRadius:'14px',padding:'16px 20px',border:'1px solid rgba(239,68,68,0.25)',marginBottom:'20px'}}>
            <p style={{fontWeight:800,color:'#f87171',fontSize:'1.1rem',margin:'0 0 10px'}}>\uD83C\uDFB5 The 5 Vowels \u2014 Sing them!</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              {['A','E','I','O','U'].map(v=>(
                <span key={v} style={{fontSize:'3.5rem',fontWeight:900,color:'#f87171',textShadow:'0 2px 8px rgba(239,68,68,0.4)'}}>{v}</span>
              ))}
            </div>
          </div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'12px'}}>
            All other letters are <strong style={{color:'#93c5fd'}}>Consonants \u2014 Konsonanti</strong> (21 letters):
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {'BCDFGHJKLMNPQRSTVWXYZ'.split('').map(c=>(
              <div key={c} style={{width:'46px',height:'46px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.3)',fontWeight:800,fontSize:'1.3rem',color:'#93c5fd'}}>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==='syllables' && (
        <div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'16px'}}>
            A syllable = <strong style={{color:'#f9fafb'}}>consonant + vowel</strong>. Tap any syllable to highlight it!
          </p>
          <div style={{overflowX:'auto'}}>
            <table style={{borderCollapse:'separate',borderSpacing:'4px',width:'100%'}}>
              <thead>
                <tr>
                  <th style={{padding:'10px 14px',background:'#111827',borderRadius:'8px',color:'#6b7280',fontWeight:700,fontSize:'1rem',textAlign:'center',minWidth:'52px'}}>\u2014</th>
                  {['a','e','i','o','u'].map(v=>(
                    <th key={v} style={{padding:'10px 14px',background:vCols[v]+'20',borderRadius:'8px',color:vCols[v],fontWeight:900,fontSize:'1.5rem',textAlign:'center',minWidth:'62px'}}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFamilies.map(([fam, sylls])=>(
                  <tr key={fam}>
                    <td style={{padding:'10px 14px',background:'#111827',borderRadius:'8px',color:'#9ca3af',fontWeight:800,fontSize:'1.1rem',textAlign:'center'}}>{fam}\u2014</td>
                    {sylls.map((s,i)=>{
                      const v=['a','e','i','o','u'][i]
                      const isSel=selSyl===s
                      return(
                        <td key={s} onClick={()=>setSelSyl(isSel?null:s)}
                          style={{padding:'10px 8px',borderRadius:'10px',textAlign:'center',cursor:'pointer',
                            background:isSel?vCols[v]+'30':'#0f1520',
                            border:`2px solid ${isSel?vCols[v]:'transparent'}`,transition:'all .12s'}}>
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
            <div style={{marginTop:'16px',padding:'16px 20px',background:'rgba(99,102,241,0.12)',borderRadius:'12px',border:'1px solid rgba(99,102,241,0.3)',textAlign:'center'}}>
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

// ── 3. SyllableChart consonant family header font ──
patch(
  'SyllableChart consonant header',
  `style={{padding:'8px',color:'#9ca3af',fontWeight:700,borderBottom:'1px solid #111827'}}>{f}\u2014</td>`,
  `style={{padding:'10px',color:'#9ca3af',fontWeight:800,fontSize:'1.1rem',borderBottom:'1px solid #111827'}}>{f}\u2014</td>`
);

// ── 4. SIMPLE_WORDS expanded data ──
patch(
  'SIMPLE_WORDS data',
  `  PP1: [

    {w:'cat',e:'\uD83D\uDC31'},{w:'dog',e:'\uD83D\uDC15'},{w:'mat',e:'\uD83D\uDECF\uFE0F'},{w:'rat',e:'\uD83D\uDC00'},{w:'hat',e:'\uD83C\uDFA9'},

    {w:'bat',e:'\uD83E\uDD87'},{w:'hen',e:'\uD83D\uDC14'},{w:'pen',e:'\u270F\uFE0F'},{w:'ten',e:'\uD83D\uDD1F'},{w:'men',e:'\uD83D\uDC65'},

    {w:'big',e:'\uD83D\uDE2E'},{w:'pig',e:'\uD83D\uDC37'},{w:'dig',e:'\u26CF\uFE0F'},{w:'fig',e:'\uD83C\uDF51'},{w:'wig',e:'\uD83D\uDC87'},

    {w:'hot',e:'\uD83C\uDF21\uFE0F'},{w:'pot',e:'\uD83C\uDF72'},{w:'dot',e:'\u26AB'},{w:'rot',e:'\uD83C\uDF42'},{w:'got',e:'\uD83C\uDF81'},

  ],

  PP2: [

    {w:'cake',e:'\uD83C\uDF82'},{w:'lake',e:'\uD83C\uDF0A'},{w:'bake',e:'\uD83E\uDDC1'},{w:'make',e:'\uD83D\uDD28'},{w:'take',e:'\u270B'},

    {w:'bike',e:'\uD83D\uDEB2'},{w:'hike',e:'\uD83E\uDD7E'},{w:'like',e:'\u2764\uFE0F'},{w:'mike',e:'\uD83C\uDFA4'},{w:'pike',e:'\uD83D\uDC1F'},

    {w:'bone',e:'\uD83E\uDDB4'},{w:'cone',e:'\uD83C\uDF66'},{w:'tone',e:'\uD83C\uDFB5'},{w:'zone',e:'\uD83D\uDDFA\uFE0F'},{w:'lone',e:'\uD83D\uDC64'},

    {w:'mule',e:'\uD83E\uDEB7'},{w:'rule',e:'\uD83D\uDCCF'},{w:'yule',e:'\uD83C\uDF84'},{w:'dune',e:'\uD83C\uDFDC\uFE0F'},{w:'tune',e:'\uD83C\uDFB6'},

  ],`,
  `  PP1: [
    {w:'cat',e:'\uD83D\uDC31'},{w:'dog',e:'\uD83D\uDC15'},{w:'mat',e:'\uD83D\uDECF\uFE0F'},{w:'rat',e:'\uD83D\uDC00'},{w:'hat',e:'\uD83C\uDFA9'},
    {w:'bat',e:'\uD83E\uDD87'},{w:'hen',e:'\uD83D\uDC14'},{w:'pen',e:'\u270F\uFE0F'},{w:'ten',e:'\uD83D\uDD1F'},{w:'men',e:'\uD83D\uDC65'},
    {w:'big',e:'\uD83D\uDE2E'},{w:'pig',e:'\uD83D\uDC37'},{w:'dig',e:'\u26CF\uFE0F'},{w:'fig',e:'\uD83C\uDF51'},{w:'wig',e:'\uD83D\uDC87'},
    {w:'hot',e:'\uD83C\uDF21\uFE0F'},{w:'pot',e:'\uD83C\uDF72'},{w:'dot',e:'\u26AB'},{w:'log',e:'\uD83E\uDEB5'},{w:'fog',e:'\uD83C\uDF2B\uFE0F'},
    {w:'cup',e:'\u2615'},{w:'bun',e:'\uD83C\uDF5E'},{w:'bug',e:'\uD83D\uDC1B'},{w:'jug',e:'\uD83E\uDEB9'},{w:'sun',e:'\u2600\uFE0F'},
    {w:'run',e:'\uD83C\uDFC3'},{w:'fun',e:'\uD83C\uDF89'},{w:'nut',e:'\uD83E\uDD5C'},{w:'mud',e:'\uD83C\uDF27\uFE0F'},{w:'pup',e:'\uD83D\uDC36'},
    {w:'lip',e:'\uD83D\uDC44'},{w:'dip',e:'\uD83C\uDF76'},{w:'tip',e:'\u261D\uFE0F'},{w:'sit',e:'\uD83E\uDE91'},{w:'bit',e:'\uD83D\uDD29'},
    {w:'map',e:'\uD83D\uDDFA\uFE0F'},{w:'cap',e:'\uD83E\uDDE2'},{w:'lap',e:'\uD83E\uDDB5'},{w:'tap',e:'\uD83D\uDEB0'},{w:'nap',e:'\uD83D\uDE34'},
    {w:'web',e:'\uD83D\uDD78\uFE0F'},{w:'bed',e:'\uD83D\uDECF\uFE0F'},{w:'red',e:'\uD83D\uDD34'},{w:'fed',e:'\uD83C\uDF7D\uFE0F'},{w:'led',e:'\uD83D\uDCA1'},
    {w:'hop',e:'\uD83D\uDC38'},{w:'mop',e:'\uD83E\uDDF9'},{w:'top',e:'\uD83C\uDFAA'},{w:'pop',e:'\uD83C\uDF7E'},{w:'cop',e:'\uD83D\uDC6E'},
    {w:'ant',e:'\uD83D\uDC1C'},{w:'can',e:'\uD83E\uDD6B'},{w:'fan',e:'\uD83C\uDF2C\uFE0F'},{w:'van',e:'\uD83D\uDE90'},{w:'man',e:'\uD83D\uDC66'},
    {w:'bin',e:'\uD83D\uDDD1\uFE0F'},{w:'fin',e:'\uD83D\uDC1F'},{w:'pin',e:'\uD83D\uDCCC'},{w:'win',e:'\uD83C\uDFC6'},{w:'tin',e:'\uD83E\uDD6B'},
  ],
  PP2: [
    {w:'cake',e:'\uD83C\uDF82'},{w:'lake',e:'\uD83C\uDF0A'},{w:'bake',e:'\uD83E\uDDC1'},{w:'make',e:'\uD83D\uDD28'},{w:'take',e:'\u270B'},
    {w:'bike',e:'\uD83D\uDEB2'},{w:'hike',e:'\uD83E\uDD7E'},{w:'like',e:'\u2764\uFE0F'},{w:'kite',e:'\uD83E\uDE81'},{w:'bite',e:'\uD83D\uDE2C'},
    {w:'bone',e:'\uD83E\uDDB4'},{w:'cone',e:'\uD83C\uDF66'},{w:'tone',e:'\uD83C\uDFB5'},{w:'zone',e:'\uD83D\uDDFA\uFE0F'},{w:'lone',e:'\uD83D\uDC64'},
    {w:'mule',e:'\uD83E\uDEB7'},{w:'rule',e:'\uD83D\uDCCF'},{w:'tune',e:'\uD83C\uDFB6'},{w:'dune',e:'\uD83C\uDFDC\uFE0F'},{w:'cube',e:'\uD83D\uDCE6'},
    {w:'fire',e:'\uD83D\uDD25'},{w:'hire',e:'\uD83D\uDCBC'},{w:'ride',e:'\uD83C\uDFA0'},{w:'hide',e:'\uD83D\uDE48'},{w:'side',e:'\u2194\uFE0F'},
    {w:'pole',e:'\uD83E\uDE84'},{w:'hole',e:'\uD83D\uDD73\uFE0F'},{w:'note',e:'\uD83D\uDCDD'},{w:'vote',e:'\uD83D\uDDF3\uFE0F'},{w:'rope',e:'\uD83E\uDEA2'},
    {w:'hope',e:'\uD83C\uDF1F'},{w:'pipe',e:'\uD83E\uDEC8'},{w:'lane',e:'\uD83D\uDEE3\uFE0F'},{w:'cane',e:'\uD83E\uDDAF'},{w:'game',e:'\uD83C\uDFAE'},
    {w:'name',e:'\uD83C\uDFF7\uFE0F'},{w:'same',e:'\uD83E\uDD1F'},{w:'pine',e:'\uD83C\uDF32'},{w:'mine',e:'\u26CF\uFE0F'},{w:'fine',e:'\uD83D\uDC85'},
    {w:'line',e:'\uD83D\uDCD0'},{w:'time',e:'\u23F0'},{w:'lime',e:'\uD83C\uDF4B'},{w:'dime',e:'\uD83E\uDE99'},{w:'fame',e:'\u2B50'},
    {w:'vine',e:'\uD83C\uDF47'},{w:'wine',e:'\uD83C\uDF77'},{w:'tame',e:'\uD83E\uDD81'},{w:'cute',e:'\uD83D\uDE0A'},{w:'mole',e:'\uD83E\uDD94'},
  ],`
);

// ── 5. Prayer & Church detailed content ──
patch(
  'Prayer Church detailed',
  `  if(topic.includes('Prayer')){

    const prayers=[

      {t:'Morning Prayer',e:'\uD83C\uDF05',p:'Dear God, thank You for this new day. Help me to learn, to be kind, and to do what is right. Amen.'},

      {t:'Meal Time Prayer',e:'\uD83C\uDF7D\uFE0F',p:'Thank You God for the food we are about to eat. Bless those who prepared it and those who are hungry. Amen.'},

      {t:'Bedtime Prayer',e:'\uD83C\uDF19',p:'Dear God, thank You for today. Forgive me where I went wrong. Keep me and my family safe through the night. Amen.'},

      {t:'School Prayer',e:'\uD83D\uDCDA',p:'Lord God, help me to pay attention and learn well today. Give me wisdom, patience and a good heart. Amen.'},

    ]

    return(

      <div>

        <p style={sectionTitle('#f9fafb')}>Prayer & Church \u2014 Sala na Kanisa</p>

        <div style={{...card({background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',marginBottom:'16px',padding:'16px'})}}>

          <p style={{fontWeight:700,color:'#a5b4fc',margin:'0 0 6px'}}>\u26EA What is a Church?</p>

          <p style={{color:'#9ca3af',fontSize:'.85rem',margin:0}}>A church is a place where Christians gather to worship God, pray together, sing songs of praise, and listen to God's Word (the Bible). God lives in the hearts of believers \u2014 you are the church too!</p>

        </div>

        <p style={{...label,marginBottom:'10px',color:'#a5b4fc'}}>Simple Prayers \u2014 Sala Rahisi:</p>

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
      {t:'Morning Prayer',e:'\uD83C\uDF05',sw:'Sala ya Asubuhi',p:'Dear God, thank You for this new day. The sun has risen and I am alive because of You. Help me to learn well today, to be kind to my friends, and to do what is right. Guard me and my family as we go about our day. In Jesus name, Amen.'},
      {t:'Meal Time Prayer',e:'\uD83C\uDF7D\uFE0F',sw:'Sala ya Chakula',p:'Heavenly Father, thank You for this food we are about to eat. You provide for us every day and we are grateful. Bless those who prepared this meal, and remember those who are hungry today. May this food give us strength to serve You. Amen.'},
      {t:'Bedtime Prayer',e:'\uD83C\uDF19',sw:'Sala ya Usiku',p:'Dear God, thank You for today. Thank You for keeping me safe. Forgive me for the things I did wrong today. As I sleep, watch over me, my family, and my friends. Give me good rest so I can wake up strong tomorrow. In Jesus name, Amen.'},
      {t:'School Prayer',e:'\uD83D\uDCDA',sw:'Sala ya Shule',p:'Lord God, thank You for the gift of learning. Help me to listen to my teacher and understand what is taught. Give me a sharp mind, a patient heart, and the courage to ask questions when I do not understand. Help me also to be a good friend to my classmates. Amen.'},
      {t:'Prayer When Afraid',e:'\uD83D\uDE4F',sw:'Sala Wakati wa Hofu',p:'Dear Jesus, I am afraid right now and I need You. The Bible says "Do not fear, for I am with you." Please calm my heart and remind me that You are always with me. Help me to be brave because You are stronger than anything that scares me. Amen.'},
      {t:'Prayer of Thankfulness',e:'\uD83C\uDF1F',sw:'Sala ya Shukrani',p:'Lord, I come to You with a thankful heart. Thank You for my family who loves me. Thank You for food, for water, for clothes, and for a place to sleep. Thank You for my teachers and my school. Most of all, thank You for sending Jesus who loves me. Amen.'},
    ]
    const churchFacts = [
      {icon:'\u26EA',title:'What is a Church?',body:"A church is a place where Christians come together to worship God. They sing praise songs, pray together, read the Bible, and encourage one another. But the Bible also says WE are the church \u2014 every believer is part of God\u2019s family!"},
      {icon:'\uD83D\uDCD6',title:'What Happens in Church?',body:'When Christians meet, they: (1) Worship \u2014 sing songs to honour God. (2) Pray \u2014 talk to God together. (3) Listen \u2014 a pastor shares from the Bible. (4) Give \u2014 they offer gifts to help those in need. (5) Fellowship \u2014 they share friendship and care for one another.'},
      {icon:'\u271D\uFE0F',title:'Why Do We Go to Church?',body:'God asks us to meet with other believers. Hebrews 10:25 says "Do not give up meeting together." Church helps us grow in faith, find support when life is hard, and remind each other of God\u2019s love every week.'},
      {icon:'\uD83D\uDC4F',title:'What is Prayer?',body:"Prayer is simply talking to God. You don\u2019t need special words \u2014 God hears you wherever you are. You can pray in the morning, at night, at school, or anywhere! Types of prayer: PRAISE, THANKS, SORRY, and ASKING."},
      {icon:'\uD83D\uDCFF',title:"The Lord's Prayer",body:'Jesus taught His disciples how to pray: "Our Father in heaven, holy is Your name. Your kingdom come, Your will be done on earth as it is in heaven. Give us today our daily bread. Forgive us our sins as we forgive those who sin against us. Lead us not into temptation but deliver us from evil. Amen." \u2014 Matthew 6:9-13'},
    ]
    return(
      <div>
        <p style={{fontSize:'1.3rem',fontWeight:900,color:'#f9fafb',margin:'0 0 20px'}}>Prayer & Church \u2014 Sala na Kanisa</p>
        <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'28px'}}>
          {churchFacts.map(f=>(
            <div key={f.title} style={{background:'rgba(99,102,241,0.06)',borderLeft:'4px solid #6366f1',borderRadius:'0 12px 12px 0',padding:'16px 20px'}}>
              <p style={{fontWeight:800,color:'#a5b4fc',margin:'0 0 8px',fontSize:'1.05rem'}}>{f.icon} {f.title}</p>
              <p style={{color:'#d1d5db',fontSize:'1rem',margin:0,lineHeight:1.8}}>{f.body}</p>
            </div>
          ))}
        </div>
        <p style={{fontWeight:800,color:'#f9fafb',fontSize:'1.1rem',marginBottom:'14px'}}>\uD83D\uDE4F Simple Prayers \u2014 Sala Rahisi</p>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          {prayers.map(p=>(
            <div key={p.t} style={{background:'rgba(99,102,241,0.08)',borderRadius:'14px',padding:'18px 20px',border:'1px solid rgba(99,102,241,0.2)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px',flexWrap:'wrap',gap:'6px'}}>
                <p style={{fontWeight:800,color:'#f9fafb',margin:0,fontSize:'1.05rem'}}>{p.e} {p.t}</p>
                <span style={{background:'rgba(20,184,166,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:'20px',padding:'3px 12px',fontSize:'0.8rem',fontWeight:700,color:'#5eead4'}}>{p.sw}</span>
              </div>
              <p style={{color:'#c4b5fd',fontSize:'1rem',fontStyle:'italic',margin:0,lineHeight:1.8}}>"{p.p}"</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:'20px',background:'rgba(34,197,94,0.06)',borderRadius:'12px',padding:'16px 20px',border:'1px solid rgba(34,197,94,0.2)'}}>
          <p style={{fontWeight:700,color:'#86efac',margin:'0 0 6px',fontSize:'1rem'}}>\uD83D\uDCD6 Bible Verse on Prayer</p>
          <p style={{color:'#d1fae5',fontSize:'1rem',margin:0,lineHeight:1.7,fontStyle:'italic'}}>"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."</p>
          <p style={{color:'#6b7280',fontSize:'0.85rem',margin:'6px 0 0'}}>\u2014 Philippians 4:6</p>
        </div>
      </div>
    )
  }`
);

fs.writeFileSync(filePath, src, 'utf8');
console.log('\nDone! ' + count + ' patches applied.');