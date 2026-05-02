// new_parts_p10.jsx — replacement content for StudyTime patch 10
// Place this file next to patch10.js before running: node patch10.js

// ===MUSIC_START===
function MusicMovementSection(){
  const songs=[
    {t:"Head, Shoulders, Knees & Toes",e:'🎵',actions:'Touch each body part as you sing — head, shoulders, knees, toes, eyes, ears, mouth and nose!'},
    {t:"If You're Happy and You Know It",e:'👏',actions:'Clap your hands · Stamp your feet · Shout "Hooray!" · Turn around!'},
    {t:'The Alphabet Song',e:'🎼',actions:'Point to each letter on the chart as you sing A-B-C-D-E-F-G…'},
    {t:'Old MacDonald Had a Farm',e:'🐄',actions:'Moo like a cow · Baa like a sheep · Cluck like a chicken — make the sounds!'},
    {t:'Twinkle Twinkle Little Star',e:'⭐',actions:'Raise hands up for stars · Wave side to side · Open and close hands like twinkling'},
    {t:'Ten Green Bottles',e:'🍾',actions:'Hold up 10 fingers, fold one down as each bottle "falls" — great for counting backwards!'},
  ]
  const movements=[
    {a:'Hop on one foot',e:'🦘',s:'Balance! Strengthens legs and coordination'},
    {a:'Jump with both feet',e:'🐸',s:'Builds strong leg muscles'},
    {a:'Run and stop',e:'🏃',s:'Develops speed control and listening skills'},
    {a:'Walk like an elephant',e:'🐘',s:'Slow, heavy steps — great for body awareness'},
    {a:'Gallop like a horse',e:'🐴',s:'Skip-step movement — develops rhythm'},
    {a:'Crawl like a crab',e:'🦀',s:'Great for core strength'},
    {a:'Stretch up tall',e:'🙆',s:'Reach up high like a giraffe!'},
    {a:'Roll like a log',e:'🪵',s:'Develops spatial awareness'},
  ]
  return(
    <div>
      <p style={sectionTitle('#f9fafb')}>Music & Movement — Muziki na Harakati</p>
      <p style={{fontSize:'.75rem',fontWeight:700,color:'#fdba74',textTransform:'uppercase',letterSpacing:'.5px',margin:'0 0 12px'}}>🎵 Action Songs:</p>
      <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'24px'}}>
        {songs.map(s=>(
          <div key={s.t} style={{display:'flex',gap:'12px',alignItems:'flex-start',paddingBottom:'12px',borderBottom:'1px solid #1f2937'}}>
            <span style={{fontSize:'1.6rem',flexShrink:0,marginTop:'2px'}}>{s.e}</span>
            <div>
              <div style={{fontWeight:700,color:'#f9fafb',fontSize:'.95rem',marginBottom:'3px'}}>{s.t}</div>
              <div style={{color:'#9ca3af',fontSize:'.82rem',lineHeight:1.5}}>{s.actions}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{fontSize:'.75rem',fontWeight:700,color:'#fdba74',textTransform:'uppercase',letterSpacing:'.5px',margin:'0 0 12px'}}>🏃 Movement Activities:</p>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {movements.map(m=>(
          <div key={m.a} style={{display:'flex',gap:'12px',alignItems:'center',paddingBottom:'10px',borderBottom:'1px solid #111827'}}>
            <span style={{fontSize:'1.8rem',flexShrink:0,width:'36px',textAlign:'center'}}>{m.e}</span>
            <div>
              <div style={{fontWeight:700,color:'#f9fafb',fontSize:'.9rem'}}>{m.a}</div>
              <div style={{color:'#9ca3af',fontSize:'.78rem'}}>{m.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
// ===MUSIC_END===

// ===STUDYNOTE_START===
function StudyNoteCard({note}){
  return(
    <div style={{marginBottom:'32px',paddingBottom:'28px',borderBottom:'1px solid #1f2937'}}>
      <p style={{fontWeight:900,color:'#f9fafb',fontSize:'1.15rem',margin:'0 0 16px'}}>{note.title}</p>
      <p style={{fontSize:'.75rem',fontWeight:700,color:'#86efac',textTransform:'uppercase',letterSpacing:'.8px',margin:'0 0 10px'}}>✅ Learning Outcomes</p>
      {note.outcomes.map((o,i)=>(
        <div key={i} style={{display:'flex',gap:'10px',marginBottom:'10px',lineHeight:1.7}}>
          <span style={{color:'#22c55e',flexShrink:0,marginTop:'2px'}}>•</span>
          <span style={{color:'#d1fae5',fontSize:'.92rem'}}>{o}</span>
        </div>
      ))}
      <p style={{fontSize:'.75rem',fontWeight:700,color:'#a5b4fc',textTransform:'uppercase',letterSpacing:'.8px',margin:'18px 0 10px'}}>❓ Key Inquiry Questions</p>
      {note.inquiries.map((q,i)=>(
        <div key={i} style={{display:'flex',gap:'10px',marginBottom:'10px',lineHeight:1.7}}>
          <span style={{color:'#6366f1',flexShrink:0,fontWeight:800,minWidth:'24px',fontSize:'.85rem'}}>Q{i+1}.</span>
          <span style={{color:'#e0e7ff',fontSize:'.92rem'}}>{q}</span>
        </div>
      ))}
      <div style={{marginTop:'16px',paddingLeft:'14px',borderLeft:'3px solid #fbbf24'}}>
        <span style={{color:'#fde68a',fontSize:'.9rem',lineHeight:1.7}}>{note.tip}</span>
      </div>
    </div>
  )
}
// ===STUDYNOTE_END===

// ===CREATION_START===
  if(topic.includes('Creation')){
    const days=[
      {day:'Day 1',e:'💡',created:"Light — Nuru",k:'Mwanga ulitenganishwa na giza',desc:"God said 'Let there be light!' and light appeared instantly. He separated light from darkness, calling the light 'Day' and the darkness 'Night.' Before this moment, the whole universe was completely dark. God created light simply by speaking — showing He is all-powerful."},
      {day:'Day 2',e:'☁️',created:'Sky & Atmosphere — Anga',k:'Mbingu zilizogawanya maji',desc:"God made the sky (called the firmament) to stretch above the earth like a great tent. It separated the waters above (clouds and rain) from the waters below (seas and rivers). The fresh air we breathe every day is part of what God made on this day."},
      {day:'Day 3',e:'🌍',created:'Land, Seas & Plants — Ardhi, Bahari na Mimea',k:'Ardhi kavu ilionekana; mimea ilizaliwa',desc:"God gathered the waters into seas and oceans, letting dry land appear for the first time. He then commanded the earth to produce plants — grass, herbs, and fruit trees of every kind, each with seeds inside. Plants still grow from seeds today, exactly as God designed!"},
      {day:'Day 4',e:'⭐',created:'Sun, Moon & Stars — Jua, Mwezi na Nyota',k:'Vitu vikuu vya mwanga vilifikia mahali pake',desc:"God placed the sun to rule the day, giving us warmth and light. He made the moon to rule the night. He also made all the stars — billions of them! They help us know the seasons, days and years, and guide farmers on when to plant and harvest."},
      {day:'Day 5',e:'🐟',created:'Fish & Birds — Samaki na Ndege',k:'Bahari na anga zilijazwa na viumbe',desc:"God filled the seas with fish, whales, dolphins, and every water creature. He filled the sky with birds of every kind — soaring eagles, tiny sparrows, colourful parrots, and flamingos. God blessed them and said 'Be fruitful and multiply and fill the earth!'"},
      {day:'Day 6',e:'🐘',created:'Animals & People — Wanyama na Watu',k:'Taji la uumbaji — binadamu aliumbiwa kwa mfano wa Mungu',desc:"God made every land animal — lions, cattle, insects, reptiles and more. Then came the greatest act: God said 'Let Us make people in Our own image.' He formed man from dust and breathed His own life into him. People alone were made in God's image — able to love, think, create, and know God personally."},
      {day:'Day 7',e:'😌',created:'Rest — Mapumziko (Sabato)',k:'Mungu alipumzika na kubariki siku ya saba',desc:"God looked at everything He had made and said it was VERY GOOD — not just good, but perfectly good! He rested on the seventh day and blessed it, making it holy. This is why we have a weekly day of rest called the Sabbath — a gift from God for worship, family and thanksgiving."},
    ]
    return(
      <div>
        <p style={sectionTitle('#f9fafb')}>{"God's Creation — Uumbaji wa Mungu"}</p>
        <div style={{marginBottom:'18px',padding:'14px 16px',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'12px'}}>
          <p style={{fontWeight:700,color:'#a5b4fc',margin:'0 0 6px',fontSize:'.95rem'}}>📖 Genesis 1 & 2 — The Creation Account</p>
          <p style={{color:'#9ca3af',fontSize:'.83rem',margin:0,lineHeight:1.65}}>In the beginning there was nothing — no light, no world, no people. God created everything by <strong style={{color:'#c4b5fd'}}>simply speaking</strong>. He said "Let there be…" and it was so. This is called <em>creation out of nothing</em>. In six amazing days God made the entire universe, and on the seventh day He rested and declared the day holy.</p>
        </div>
        {days.map((d,i)=>(
          <div key={d.day} style={{display:'flex',gap:'14px',marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #111827',alignItems:'flex-start'}}>
            <div style={{flexShrink:0,textAlign:'center',width:'68px'}}>
              <div style={{fontSize:'2.4rem',marginBottom:'4px'}}>{d.e}</div>
              <div style={{fontSize:'.62rem',fontWeight:800,color:'#6366f1',textTransform:'uppercase',letterSpacing:'.3px'}}>{d.day}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:'#f9fafb',fontSize:'.97rem',marginBottom:'3px'}}>{d.created}</div>
              <div style={{color:'#5eead4',fontSize:'.72rem',fontWeight:700,marginBottom:'7px'}}>{d.k}</div>
              <div style={{color:'#9ca3af',fontSize:'.84rem',lineHeight:1.68}}>{d.desc}</div>
            </div>
          </div>
        ))}
        <div style={{padding:'12px 16px',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'12px',marginBottom:'12px'}}>
          <p style={{color:'#c4b5fd',fontSize:'.88rem',margin:0,fontStyle:'italic',lineHeight:1.6}}>"God saw all that He had made, and it was very good." — Genesis 1:31</p>
        </div>
        <div style={{padding:'14px 16px',background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:'12px'}}>
          <p style={{fontWeight:700,color:'#86efac',margin:'0 0 8px'}}>🌟 You Are Special — Wewe ni wa Pekee!</p>
          <p style={{color:'#9ca3af',fontSize:'.85rem',margin:'0 0 6px',lineHeight:1.65}}>God made you <strong style={{color:'#d1fae5'}}>in His own image</strong> (Genesis 1:27). This means you can love, think, create, and choose right from wrong — just like God. You are <strong style={{color:'#d1fae5'}}>fearfully and wonderfully made</strong> (Psalm 139:14).</p>
          <p style={{color:'#9ca3af',fontSize:'.85rem',margin:0,lineHeight:1.65}}>No one else in the whole world has your exact fingerprints, your exact voice, or your exact personality. You are God's masterpiece (Ephesians 2:10). God loves you completely and has a perfect plan for your life (Jeremiah 29:11).</p>
        </div>
      </div>
    )
  }
// ===CREATION_END===

// ===CREATION_NOTES_START===
  creation:{
    title:"Religious Education — God's Creation (Genesis 1 & 2)",
    outcomes:[
      "State clearly that God is the all-powerful Creator of the universe, the earth, and every living thing, as revealed in Genesis chapters 1 and 2. Understand that before God created, absolutely nothing existed — not light, land, water, animals, or people. God alone brought everything into being.",
      "Retell the entire creation account in correct chronological order across all 7 days without prompting: Day 1 — Light; Day 2 — Sky and Atmosphere; Day 3 — Land, Seas and Plants; Day 4 — Sun, Moon and Stars; Day 5 — Fish and Birds; Day 6 — Land Animals and People; Day 7 — God rested and blessed the Sabbath day as holy.",
      "Explain HOW God created — He simply spoke and it appeared ('Let there be light… and there was light'). This demonstrates God's unlimited power called omnipotence. He needed no tools, no materials, no helpers — His word alone was enough to bring the entire universe into existence from nothing.",
      "Define and apply 'Imago Dei' — being made in God's image (Genesis 1:27): Human beings alone among all creatures were made in God's likeness, meaning people can think deeply, love unconditionally, create things of beauty, make moral choices between right and wrong, and have a personal relationship with God. This is what sets people apart from all animals.",
      "Explain the concept of stewardship: after creating, God gave human beings the responsibility to care for, protect, and manage all of creation — animals, plants, water, land, and air. Being a good steward means treating the environment with respect and care, not wasting or destroying it (Genesis 1:28, 2:15).",
      "Understand the full significance of Day 7 — the Sabbath: God rested and blessed the seventh day, making it holy and special. This established the weekly day of rest — a deliberate gift from God to all humanity for physical rest, worship of God, family time, and reflection on His goodness and provision.",
      "Articulate personal identity and worth as God's unique and intentional creation: every person ever born has a distinct fingerprint, voice, face, personality and set of gifts that has never existed before and will never exist again in all of history. Reference Psalm 139:13-14 — 'You knit me together… I am fearfully and wonderfully made.'",
      "Connect the beauty and order of the natural world — sunrises, mountains, rain, flowers, seasons, animals, the human body — directly to the creativity, wisdom and goodness of God the Creator. Develop a habit of wonder, praise and gratitude when encountering creation.",
      "Identify at least 5 specific, practical ways to be a responsible steward of God's creation in everyday life: reducing water waste, avoiding littering, caring for animals, planting trees or a garden, saving electricity, keeping waterways clean, recycling, and buying only what you need.",
    ],
    inquiries:[
      "Who created the universe and everything in it? What did God use to create things — did He use tools, materials, or helpers? (He simply spoke! 'Let there be…') What does that tell us about how powerful God truly is?",
      "Can you name what God created on each of the 7 days without looking? Start with 'In the beginning, on Day 1 God made…' all the way to Day 7. Which day's creation do you find most amazing and why?",
      "The Bible says God made people 'in His image' (Genesis 1:27). What special abilities do human beings have that animals do not? How does knowing you were made in God's image change the way you see yourself and other people?",
      "God looked at everything He made and declared it 'very good' (Genesis 1:31). Step outside or look around you. Name 5 specific things in God's creation that you find beautiful, surprising, or fascinating. What makes each one special?",
      "Why did God rest on Day 7 and make it holy? What happens to your body and mind when you do not get enough rest? How do you and your family honour a day of rest each week? Why do you think God gave us this gift?",
      "God made YOU completely unique — your fingerprints, your smile, your voice, your personality are one of a kind in all of human history (Psalm 139:14). What specific gifts, talents or qualities do you think God has placed in you? How can you use these gifts to serve others?",
      "What does it mean to be a 'steward' — a caretaker — of God's creation? Name 5 things that young children can do right now to take care of God's creation at home, at school, and in your community.",
      "What problems in our world today — pollution, deforestation, endangered animals — show that people have not been taking good care of God's creation? What specific steps can you and your class take to be better stewards starting this week?",
    ],
    tip:"💡 Study Tip: Make a Creation Wheel! Draw a large circle and divide it into 7 equal sections like a pie. In each section, write the day number, draw a picture of what God made, and write the name in both English and Kiswahili. Colour each section with bright, vibrant colours. Then fold the wheel face-down and try to retell the complete creation story from memory — starting with 'In the beginning, God created…' all the way through Day 7. Challenge yourself to retell it clearly in under 2 minutes without any help!",
  },
// ===CREATION_NOTES_END===

// ===SIMPLE_WORDS_START===
const SIMPLE_WORDS = {
  PP1: [
    {w:'cat',e:'🐱'},{w:'bat',e:'🦇'},{w:'hat',e:'🎩'},{w:'mat',e:'🛋️'},{w:'rat',e:'🐀'},
    {w:'bag',e:'🎒'},{w:'tag',e:'🏷️'},{w:'fan',e:'🌀'},{w:'can',e:'🥫'},{w:'man',e:'👨'},
    {w:'hen',e:'🐔'},{w:'pen',e:'✏️'},{w:'ten',e:'🔟'},{w:'bed',e:'🛏️'},{w:'leg',e:'🦵'},
    {w:'jet',e:'✈️'},{w:'net',e:'🕸️'},{w:'pet',e:'🐾'},{w:'red',e:'🔴'},{w:'web',e:'🌐'},
    {w:'pig',e:'🐷'},{w:'dig',e:'⛏️'},{w:'big',e:'🐘'},{w:'wig',e:'💇'},{w:'fig',e:'🍇'},
    {w:'tin',e:'🫙'},{w:'bin',e:'🗑️'},{w:'pin',e:'📌'},{w:'sit',e:'🪑'},{w:'bit',e:'🍕'},
    {w:'hot',e:'🌡️'},{w:'pot',e:'🍲'},{w:'dot',e:'⚫'},{w:'top',e:'🔝'},{w:'hop',e:'🐸'},
    {w:'log',e:'🪵'},{w:'fog',e:'🌫️'},{w:'mop',e:'🧹'},{w:'cob',e:'🌽'},{w:'jog',e:'👟'},
    {w:'cup',e:'☕'},{w:'bus',e:'🚌'},{w:'bug',e:'🐛'},{w:'rug',e:'🟫'},{w:'mug',e:'🫖'},
    {w:'sun',e:'☀️'},{w:'fun',e:'🎉'},{w:'run',e:'🏃'},{w:'mud',e:'🟤'},{w:'nut',e:'🥜'},
  ],
  PP2: [
    {w:'cake',e:'🎂'},{w:'lake',e:'🌊'},{w:'bake',e:'🧁'},{w:'make',e:'🔨'},{w:'take',e:'✋'},
    {w:'fake',e:'🎭'},{w:'wake',e:'⏰'},{w:'rake',e:'🍂'},{w:'same',e:'🪞'},{w:'fame',e:'🌟'},
    {w:'bike',e:'🚲'},{w:'hike',e:'🥾'},{w:'like',e:'👍'},{w:'pike',e:'🐟'},{w:'kite',e:'🪁'},
    {w:'fire',e:'🔥'},{w:'hire',e:'💼'},{w:'wire',e:'🔌'},{w:'tile',e:'🧱'},{w:'mile',e:'📏'},
    {w:'bone',e:'🦴'},{w:'cone',e:'🍦'},{w:'tone',e:'🎵'},{w:'zone',e:'🗺️'},{w:'home',e:'🏠'},
    {w:'hope',e:'🕊️'},{w:'rope',e:'🪢'},{w:'rose',e:'🌹'},{w:'note',e:'📝'},{w:'vote',e:'🗳️'},
    {w:'rule',e:'📜'},{w:'tune',e:'🎶'},{w:'cube',e:'📦'},{w:'cute',e:'🥰'},{w:'fuse',e:'💡'},
    {w:'huge',e:'🐋'},{w:'mute',e:'🤫'},{w:'tube',e:'🧪'},{w:'dune',e:'🏜️'},{w:'mule',e:'🐴'},
    {w:'five',e:'🖐️'},{w:'give',e:'🎁'},{w:'live',e:'🏡'},{w:'hive',e:'🐝'},{w:'dive',e:'🤿'},
    {w:'cave',e:'🦇'},{w:'save',e:'💾'},{w:'wave',e:'🌊'},{w:'gate',e:'🚪'},{w:'late',e:'🕐'},
  ],
}
// ===SIMPLE_WORDS_END===
