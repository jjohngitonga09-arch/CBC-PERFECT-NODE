function VowelsConsonants(){
  const [tab, setTab] = useState('vowels')
  const [selSyl, setSelSyl] = useState(null)

  const vowelInfo = [
    {l:'A', word:'Apple',    emoji:'🍎', col:'#ef4444', sw:'Apeli'},
    {l:'E', word:'Egg',      emoji:'🥚', col:'#f97316', sw:'Yai'},
    {l:'I', word:'Insect',   emoji:'🐛', col:'#eab308', sw:'Mdudu'},
    {l:'O', word:'Orange',   emoji:'🍊', col:'#22c55e', sw:'Chungwa'},
    {l:'U', word:'Umbrella', emoji:'☂️', col:'#3b82f6', sw:'Mwavuli'},
  ]

  const vCols = {a:'#ef4444', e:'#f97316', i:'#eab308', o:'#22c55e', u:'#3b82f6'}
  const allFamilies = Object.entries(SYLLABLE_FAMILIES)

  return (
    <div>
      <p style={{fontSize:'1.3rem',fontWeight:900,color:'#f9fafb',margin:'0 0 18px'}}>
        Vowels &amp; Syllables — Irabu na Silabi
      </p>

      {/* Tab buttons */}
      <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
        {[
          {id:'vowels',    label:'🔴 Vowels — Irabu'},
          {id:'syllables', label:'📖 Syllable Families'},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding:'10px 20px', borderRadius:'24px', fontWeight:700,
              fontSize:'1rem', cursor:'pointer',
              border: `2px solid ${tab === t.id ? '#6366f1' : '#374151'}`,
              background: tab === t.id ? 'rgba(99,102,241,0.2)' : 'transparent',
              color:  tab === t.id ? '#a5b4fc' : '#9ca3af',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'vowels' && (
        <div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'16px'}}>
            There are <strong style={{color:'#f87171'}}>5 vowels</strong> in English —
            called <strong style={{color:'#f87171'}}>Irabu</strong> in Kiswahili.
            Every word needs at least one vowel!
          </p>

          {/* Vowel cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'14px',marginBottom:'24px'}}>
            {vowelInfo.map(v => (
              <div key={v.l} style={{
                background: v.col + '18',
                border: `2px solid ${v.col}50`,
                borderRadius:'16px', padding:'20px 12px', textAlign:'center',
              }}>
                <div style={{fontSize:'4.5rem',lineHeight:1}}>{v.emoji}</div>
                <div style={{fontSize:'4rem',fontWeight:900,color:v.col,lineHeight:1,marginTop:'8px'}}>{v.l}</div>
                <div style={{fontSize:'1.1rem',fontWeight:700,color:'#f9fafb',marginTop:'6px'}}>{v.word}</div>
                <div style={{fontSize:'0.9rem',color:'#5eead4',marginTop:'4px'}}>{v.sw}</div>
              </div>
            ))}
          </div>

          {/* Sing them banner */}
          <div style={{background:'rgba(239,68,68,0.08)',borderRadius:'14px',padding:'16px 20px',border:'1px solid rgba(239,68,68,0.25)',marginBottom:'20px',textAlign:'center'}}>
            <p style={{fontWeight:800,color:'#f87171',fontSize:'1.1rem',margin:'0 0 12px'}}>🎵 The 5 Vowels — Sing them!</p>
            <div style={{display:'flex',gap:'20px',justifyContent:'center',flexWrap:'wrap'}}>
              {['A','E','I','O','U'].map(v => (
                <span key={v} style={{fontSize:'3.5rem',fontWeight:900,color:'#f87171'}}>{v}</span>
              ))}
            </div>
          </div>

          {/* Consonants grid */}
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'12px'}}>
            All other letters are <strong style={{color:'#93c5fd'}}>Consonants — Konsonanti</strong> (21 letters):
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {'BCDFGHJKLMNPQRSTVWXYZ'.split('').map(c => (
              <div key={c} style={{
                width:'46px', height:'46px', borderRadius:'10px',
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.3)',
                fontWeight:800, fontSize:'1.3rem', color:'#93c5fd',
              }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'syllables' && (
        <div>
          <p style={{color:'#9ca3af',fontSize:'1rem',marginBottom:'16px'}}>
            A syllable = <strong style={{color:'#f9fafb'}}>consonant + vowel</strong>.
            Tap any cell to highlight it!
          </p>
          <div style={{overflowX:'auto'}}>
            <table style={{borderCollapse:'separate',borderSpacing:'4px',width:'100%'}}>
              <thead>
                <tr>
                  <th style={{padding:'10px 14px',background:'#111827',borderRadius:'8px',color:'#6b7280',fontWeight:700,textAlign:'center',minWidth:'52px'}}>—</th>
                  {['a','e','i','o','u'].map(v => (
                    <th key={v} style={{
                      padding:'10px 14px',
                      background: vCols[v] + '20',
                      borderRadius:'8px',
                      color: vCols[v],
                      fontWeight:900,
                      fontSize:'1.5rem',
                      textAlign:'center',
                      minWidth:'62px',
                    }}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFamilies.map(([fam, sylls]) => (
                  <tr key={fam}>
                    <td style={{padding:'10px 14px',background:'#111827',borderRadius:'8px',color:'#9ca3af',fontWeight:800,fontSize:'1.1rem',textAlign:'center'}}>
                      {fam}—
                    </td>
                    {sylls.map((s, i) => {
                      const v     = ['a','e','i','o','u'][i]
                      const isSel = selSyl === s
                      return (
                        <td key={s}
                          onClick={() => setSelSyl(isSel ? null : s)}
                          style={{
                            padding:'10px 8px', borderRadius:'10px',
                            textAlign:'center', cursor:'pointer',
                            background: isSel ? vCols[v] + '30' : '#0f1520',
                            border: `2px solid ${isSel ? vCols[v] : 'transparent'}`,
                            transition:'all .12s',
                          }}>
                          <span style={{fontWeight:900,fontSize:'1.5rem',color: isSel ? '#fff' : vCols[v]}}>
                            <span style={{color: isSel ? '#e2e8f0' : '#d1d5db'}}>{fam}</span>{v}
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
              <span style={{color:'#a5b4fc',fontSize:'1rem'}}>Selected: </span>
              <span style={{fontSize:'3rem',fontWeight:900,color:'#f9fafb',marginLeft:'10px'}}>{selSyl}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
