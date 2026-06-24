import React, { useState } from "react";

// â•â•â• DATA CONSTANTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const ALPHABET   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const VOWELS     = new Set(['A', 'E', 'I', 'O', 'U']);
const WORDS_20   = [
  'cat','dog','mat','hat','bat',
  'rat','pan','can','man','fan',
  'sun','run','fun','bus','cup',
  'bug','mug','rug','jug','hen',
];
const CLASSROOM  = ['Door','Table','Chair','Board','Window','Bag','Book','Pen'];
const IRABU      = ['A','E','I','O','U'];
const KONSONANTI = ['B','C','D','F','G','H','J','K','L','M','N','P','R','S','T','V','W','Y','Z'];

const COLORS_DATA = [
  { name:'Red',    hex:'#ef4444' },
  { name:'Blue',   hex:'#3b82f6' },
  { name:'Yellow', hex:'#eab308' },
  { name:'Green',  hex:'#22c55e' },
  { name:'Orange', hex:'#f97316' },
  { name:'Purple', hex:'#a855f7' },
  { name:'Pink',   hex:'#ec4899' },
  { name:'Brown',  hex:'#92400e' },
  { name:'Black',  hex:'#111827' },
  { name:'White',  hex:'#f9fafb', border:true },
];

const DAYS   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SENTENCES = [
  { en:'I am a student.',        sw:'Mimi ni mwanafunzi.' },
  { en:'This is my book.',       sw:'Hii ni kitabu changu.' },
  { en:'Good morning.',          sw:'Habari za asubuhi.' },
  { en:'How are you?',           sw:'Habari yako?' },
  { en:'I like to read.',        sw:'Napenda kusoma.' },
  { en:'The cat is on the mat.', sw:'Paka yuko juu ya mkeka.' },
  { en:'We go to school.',       sw:'Tunaenda shuleni.' },
  { en:'Please sit down.',       sw:'Tafadhali kaa chini.' },
];

const BODY_PARTS_EMOJI = [
  { name:'Head',     emoji:'ðŸ§ ' }, { name:'Eyes',    emoji:'ðŸ‘ï¸' },
  { name:'Nose',     emoji:'ðŸ‘ƒ' }, { name:'Mouth',   emoji:'ðŸ‘„' },
  { name:'Ears',     emoji:'ðŸ‘‚' }, { name:'Neck',    emoji:'ðŸ«€' },
  { name:'Shoulders',emoji:'ðŸ¦´' }, { name:'Arms',    emoji:'ðŸ’ª' },
  { name:'Hands',    emoji:'âœ‹' }, { name:'Fingers', emoji:'ðŸ¤š' },
  { name:'Chest',    emoji:'ðŸ«' }, { name:'Stomach', emoji:'ðŸ«ƒ' },
  { name:'Legs',     emoji:'ðŸ¦µ' }, { name:'Knees',   emoji:'ðŸ¦¿' },
  { name:'Feet',     emoji:'ðŸ¦¶' }, { name:'Toes',    emoji:'ðŸ¦¶' },
];

const MATH_OPS = [
  {a:1,b:1},{a:2,b:1},{a:3,b:2},{a:4,b:2},{a:5,b:3},
  {a:6,b:4},{a:7,b:3},{a:8,b:5},{a:9,b:4},{a:10,b:5},
];

const SIGHT_WORDS = [
  'the','and','a','to','said','in','he','I',
  'of','it','was','you','they','on','she','is',
  'for','at','his','but','that','with','all','we',
  'can','are','up','had','my','her','what','there',
];

const ENV_SOUNDS = [
  { label:'Dog',      img:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop&auto=format', color:'#f59e0b' },
  { label:'Cat',      img:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop&auto=format', color:'#ec4899' },
  { label:'Cow',      img:'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=300&h=300&fit=crop&auto=format', color:'#8b5cf6' },
  { label:'Car',      img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&h=300&fit=crop&auto=format', color:'#3b82f6' },
  { label:'Airplane', img:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=300&fit=crop&auto=format', color:'#06b6d4' },
  { label:'Train',    img:'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300&h=300&fit=crop&auto=format', color:'#10b981' },
  { label:'Rain',     img:'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=300&h=300&fit=crop&auto=format', color:'#6366f1' },
  { label:'Thunder',  img:'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=300&h=300&fit=crop&auto=format', color:'#64748b' },
  { label:'Wind',     img:'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=300&h=300&fit=crop&auto=format', color:'#22c55e' },
];

const GREETINGS = [
  { text:'Good Morning', color:'#f59e0b', ask:'Good morning!',          reply:'Good morning too!' },
  { text:'Hello',        color:'#3b82f6', ask:'Hello!',                 reply:'Hello, friend!' },
  { text:'How are you?', color:'#10b981', ask:'How are you?',           reply:'I am fine, thank you!' },
  { text:'Please',       color:'#8b5cf6', ask:'Please give me a pencil.',reply:'Here you are!' },
  { text:'Thank you',    color:'#ec4899', ask:'Thank you!',             reply:'You are welcome!' },
  { text:'Sorry',        color:'#ef4444', ask:'Sorry! Are you okay?',   reply:'I am okay, thank you.' },
];

const BODY_PARTS_IMG = [
  { label:'Head',  img:'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=300&h=300&fit=crop&auto=format', color:'#ef4444' },
  { label:'Eyes',  img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=300&fit=crop&auto=format', color:'#3b82f6' },
  { label:'Ears',  img:'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&auto=format', color:'#f59e0b' },
  { label:'Mouth', img:'https://images.unsplash.com/photo-1542596594-649edbc13630?w=300&h=300&fit=crop&auto=format', color:'#ec4899' },
  { label:'Hands', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format', color:'#10b981' },
  { label:'Legs',  img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop&auto=format', color:'#8b5cf6' },
];

const FAMILY = [
  { label:'Father',  img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', color:'#3b82f6' },
  { label:'Mother',  img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format', color:'#ec4899' },
  { label:'Brother', img:'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=300&h=300&fit=crop&auto=format', color:'#10b981' },
  { label:'Sister',  img:'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&auto=format', color:'#f59e0b' },
  { label:'Baby',    img:'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop&auto=format', color:'#8b5cf6' },
];

const STORY_SEQUENCE = [
  { label:'First', img:'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=300&h=300&fit=crop&auto=format' },
  { label:'Next',  img:'https://images.unsplash.com/photo-1508921108053-9f757ead871c?w=300&h=300&fit=crop&auto=format' },
  { label:'Last',  img:'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&h=300&fit=crop&auto=format' },
];

const ALPHABET_FRIEZE = [
  {l:'A',w:'Apple',e:'ðŸŽ',    img:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop&auto=format'},
  {l:'B',w:'Ball',e:'âš½',     img:'https://images.unsplash.com/photo-1559829604-7b5f83f59c2b?w=200&h=200&fit=crop&auto=format'},
  {l:'C',w:'Cat',e:'ðŸ±',      img:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&auto=format'},
  {l:'D',w:'Dog',e:'ðŸ¶',      img:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format'},
  {l:'E',w:'Egg',e:'ðŸ¥š',      img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200&h=200&fit=crop&auto=format'},
  {l:'F',w:'Fish',e:'ðŸŸ',     img:'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&h=200&fit=crop&auto=format'},
  {l:'G',w:'Grapes',e:'ðŸ‡',   img:'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop&auto=format'},
  {l:'H',w:'Hat',e:'ðŸŽ©',      img:'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=200&h=200&fit=crop&auto=format'},
  {l:'I',w:'Ice cream',e:'ðŸ¦',img:'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&h=200&fit=crop&auto=format'},
  {l:'J',w:'Juice',e:'ðŸ§ƒ',    img:'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop&auto=format'},
  {l:'K',w:'Kite',e:'ðŸª',     img:'https://images.unsplash.com/photo-1559734840-f9509ee5677f?w=200&h=200&fit=crop&auto=format'},
  {l:'L',w:'Lion',e:'ðŸ¦',     img:'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=200&h=200&fit=crop&auto=format'},
  {l:'M',w:'Mango',e:'ðŸ¥­',    img:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop&auto=format'},
  {l:'N',w:'Nest',e:'ðŸªº',     img:'https://images.unsplash.com/photo-1522767131594-6b7e96848fba?w=200&h=200&fit=crop&auto=format'},
  {l:'O',w:'Orange',e:'ðŸŠ',   img:'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop&auto=format'},
  {l:'P',w:'Penguin',e:'ðŸ§',  img:'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=200&h=200&fit=crop&auto=format'},
  {l:'Q',w:'Queen',e:'ðŸ‘¸',    img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format'},
  {l:'R',w:'Rabbit',e:'ðŸ‡',   img:'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop&auto=format'},
  {l:'S',w:'Sun',e:'â˜€ï¸',      img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format'},
  {l:'T',w:'Tiger',e:'ðŸ¯',    img:'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=200&h=200&fit=crop&auto=format'},
  {l:'U',w:'Umbrella',e:'â˜‚ï¸', img:'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=200&h=200&fit=crop&auto=format'},
  {l:'V',w:'Vegetables',e:'ðŸ¥¦',img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop&auto=format'},
  {l:'W',w:'Water',e:'ðŸ’§',    img:'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=200&h=200&fit=crop&auto=format'},
  {l:'X',w:'X-ray',e:'ðŸ©»',    img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&auto=format'},
  {l:'Y',w:'Yam',e:'ðŸ ',      img:'https://images.unsplash.com/photo-1602859137824-c42fd2286e68?w=200&h=200&fit=crop&auto=format'},
  {l:'Z',w:'Zebra',e:'ðŸ¦“',    img:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&h=200&fit=crop&auto=format'},
];
const FRIEZE_COLORS = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316'];

// â•â•â• TINY HELPERS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function Tag({ children, color = '#6366f1' }) {
  return (
    <div style={{
      display:'inline-block', background:color, color:'#fff',
      fontWeight:800, fontSize:'.72rem', letterSpacing:'1px',
      textTransform:'uppercase', padding:'5px 12px',
      borderRadius:'6px', marginBottom:'10px',
    }}>
      {children}
    </div>
  );
}

function Section({ children }) {
  return <div style={{ marginBottom:'28px' }}>{children}</div>;
}

// â•â•â• ALPHABET & LANGUAGE CHARTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function AlphabetChart() {
  return (
    <Section>
      <Tag>Alphabet Chart A â€“ Z</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(46px, 1fr))', gap:'5px' }}>
        {ALPHABET.map(l => (
          <div key={l} style={{
            background: VOWELS.has(l) ? 'rgba(99,102,241,.18)' : 'var(--surface, #f9fafb)',
            border:'1.5px solid', borderColor: VOWELS.has(l) ? '#6366f1' : 'var(--border, #e5e7eb)',
            borderRadius:'8px', padding:'8px 4px', textAlign:'center',
          }}>
            <div style={{ color: VOWELS.has(l) ? '#a5b4fc' : 'var(--text, #111827)', fontWeight:900, fontSize:'1.55rem', lineHeight:1 }}>{l}</div>
            <div style={{ color:'var(--sub, #6b7280)', fontSize:'.6rem', marginTop:'2px' }}>{l.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function VowelsChart() {
  return (
    <Section>
      <Tag>Vowels A E I O U</Tag>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
        {[...VOWELS].map(v => (
          <div key={v} style={{
            background:'rgba(99,102,241,.15)', border:'2px solid #6366f1',
            borderRadius:'12px', width:'64px', height:'64px',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          }}>
            <div style={{ color:'#a5b4fc', fontWeight:900, fontSize:'2rem', lineHeight:1 }}>{v}</div>
            <div style={{ color:'var(--sub, #6b7280)', fontSize:'.68rem' }}>{v.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SimpleWordsChart() {
  return (
    <Section>
      <Tag>20 Simple Words</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(88px,1fr))', gap:'5px' }}>
        {WORDS_20.map((w, i) => (
          <div key={w} style={{
            background:'var(--surface, #f9fafb)',
            border:'1px solid var(--border, #e5e7eb)',
            borderRadius:'8px', padding:'7px 10px',
            display:'flex', alignItems:'center', gap:'6px',
          }}>
            <span style={{ color:'var(--sub, #6b7280)', fontSize:'.62rem', fontWeight:700 }}>{i+1}.</span>
            <span style={{ color:'var(--text, #111827)', fontWeight:700, fontSize:'.875rem' }}>{w}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function LinesTracingChart() {
  return (
    <Section>
      <Tag>Shapes &amp; Lines Tracing</Tag>
      <div style={{ background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'12px', padding:'14px' }}>
        <div style={{ color:'var(--sub, #6b7280)', fontSize:'.68rem', fontWeight:700, marginBottom:'4px' }}>STRAIGHT DOTTED LINE</div>
        <svg width="100%" height="22" viewBox="0 0 300 22" style={{ marginBottom:'12px' }}>
          <line x1="10" y1="11" x2="290" y2="11" stroke="#6366f1" strokeWidth="3" strokeDasharray="8 6"/>
        </svg>
        <div style={{ color:'var(--sub, #6b7280)', fontSize:'.68rem', fontWeight:700, marginBottom:'4px' }}>ZIGZAG LINE</div>
        <svg width="100%" height="36" viewBox="0 0 300 36" style={{ marginBottom:'12px' }}>
          <polyline points="10,28 40,8 70,28 100,8 130,28 160,8 190,28 220,8 250,28 280,8"
            fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round"/>
        </svg>
        <div style={{ color:'var(--sub, #6b7280)', fontSize:'.68rem', fontWeight:700, marginBottom:'4px' }}>CURVED LINE</div>
        <svg width="100%" height="36" viewBox="0 0 300 36">
          <path d="M10,28 Q50,4 90,28 Q130,52 170,28 Q210,4 250,28 Q270,38 290,28"
            fill="none" stroke="#10b981" strokeWidth="3"/>
        </svg>
      </div>
    </Section>
  );
}

function ClassroomChart() {
  return (
    <Section>
      <Tag>Classroom Vocabulary</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))', gap:'8px' }}>
        {CLASSROOM.map(word => (
          <div key={word} style={{
            background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)',
            borderRadius:'10px', padding:'12px 8px', textAlign:'center',
            fontWeight:700, fontSize:'.95rem', color:'var(--text, #111827)',
          }}>{word}</div>
        ))}
      </div>
    </Section>
  );
}

function ClassroomLabels() {
  return (
    <Section>
      <Tag>Classroom Labels (2 cm)</Tag>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
        {CLASSROOM.map(item => (
          <div key={item} style={{
            background:'var(--surface, #f9fafb)', border:'2px dashed #6366f1',
            borderRadius:'8px', height:'75px', minWidth:'90px', padding:'0 14px',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'var(--text, #111827)', fontWeight:800, fontSize:'1rem' }}>{item}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function VowelConsonantChart() {
  return (
    <Section>
      <Tag>Irabu (Vowels) &amp; Konsonanti (Consonants)</Tag>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ flex:'0 0 auto', background:'rgba(99,102,241,.08)', border:'1.5px solid #6366f1', borderRadius:'12px', padding:'14px 18px' }}>
          <div style={{ fontWeight:800, fontSize:'.75rem', color:'#6366f1', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Irabu / Vowels</div>
          <div style={{ display:'flex', gap:'8px' }}>
            {IRABU.map(v => (
              <span key={v} style={{ fontSize:'1.5rem', fontWeight:800, color:'#6366f1', background:'#fff', border:'1.5px solid #6366f1', borderRadius:'8px', padding:'4px 10px' }}>{v}</span>
            ))}
          </div>
        </div>
        <div style={{ flex:'1 1 200px', background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'12px', padding:'14px 18px' }}>
          <div style={{ fontWeight:800, fontSize:'.75rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Konsonanti / Consonants</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
            {KONSONANTI.map(c => (
              <span key={c} style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--text, #111827)', background:'#fff', border:'1px solid var(--border, #e5e7eb)', borderRadius:'6px', padding:'3px 8px' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function IrabuChart() {
  return (
    <Section>
      <Tag>Irabu (Vowels / Vokali)</Tag>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {IRABU.map(v => (
          <div key={v} style={{
            background:'rgba(99,102,241,.15)', border:'2px solid #6366f1',
            borderRadius:'8px', width:'38px', height:'38px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:'1.05rem', color:'#a5b4fc',
          }}>{v}</div>
        ))}
      </div>
    </Section>
  );
}

function KonsonantiChart() {
  return (
    <Section>
      <Tag>Konsonanti (Consonants)</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(38px,1fr))', gap:'5px' }}>
        {KONSONANTI.map(c => (
          <div key={c} style={{
            background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)',
            borderRadius:'8px', width:'38px', height:'38px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'1rem', color:'var(--text, #111827)',
          }}>{c}</div>
        ))}
      </div>
    </Section>
  );
}

function ShapesChart() {
  const S = 113;
  const shapes = [
    { name:'Circle',    svg:<svg width={S} height={S} viewBox="0 0 100 100"><circle cx="50" cy="50" r="43" fill="rgba(99,102,241,.15)" stroke="#6366f1" strokeWidth="5"/></svg> },
    { name:'Square',    svg:<svg width={S} height={S} viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" fill="rgba(245,158,11,.15)" stroke="#f59e0b" strokeWidth="5"/></svg> },
    { name:'Triangle',  svg:<svg width={S} height={S} viewBox="0 0 100 100"><polygon points="50,7 93,93 7,93" fill="rgba(16,185,129,.15)" stroke="#10b981" strokeWidth="5"/></svg> },
    { name:'Rectangle', svg:<svg width={S} height={S} viewBox="0 0 100 100"><rect x="8" y="23" width="84" height="54" fill="rgba(239,68,68,.15)" stroke="#ef4444" strokeWidth="5"/></svg> },
  ];
  return (
    <Section>
      <Tag>Shapes Chart (3 cm each)</Tag>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
        {shapes.map(s => (
          <div key={s.name} style={{
            background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)',
            borderRadius:'12px', padding:'12px', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
          }}>
            {s.svg}
            <span style={{ color:'var(--text, #111827)', fontWeight:700, fontSize:'.875rem' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AlphabetFriezeChart() {
  return (
    <Section>
      <Tag>Alphabet Frieze A to Z</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px,1fr))', gap:'10px' }}>
        {ALPHABET_FRIEZE.map((item, i) => {
          const color = FRIEZE_COLORS[i % FRIEZE_COLORS.length];
          return (
            <div key={item.l} style={{ background:color+'18', border:'3px solid '+color, borderRadius:'14px', overflow:'hidden', textAlign:'center' }}>
              <img src={item.img} alt={item.w} style={{ width:'100%', height:'100px', objectFit:'cover', display:'block' }} />
              <div style={{ padding:'6px 4px 2px' }}>
                <div style={{ fontWeight:900, fontSize:'1.2rem', color }}>{item.l}{item.l.toLowerCase()}</div>
                <div style={{ fontSize:'.72rem', color:'var(--text, #111827)', fontWeight:700, paddingBottom:'4px' }}>{item.w}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// â•â•â• NUMBER CHARTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function NumberChart() {
  const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6'];
  return (
    <Section>
      <Tag>Number Chart 1 â€“ 20</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'8px' }}>
        {Array.from({ length:20 }, (_, idx) => {
          const n = idx + 1;
          const color = colors[idx % colors.length];
          return (
            <div key={n} style={{ background:'var(--surface, #f9fafb)', borderRadius:'12px', padding:'10px 14px', border:'1px solid var(--border, #e5e7eb)' }}>
              <div style={{ marginBottom:'8px' }}>
                <span style={{ fontSize:'1.6rem', fontWeight:800, color }}>{n}</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {Array.from({ length:n }).map((_, i) => (
                  <span key={i} style={{ display:'inline-block', width:'18px', height:'18px', borderRadius:'50%', background:color, boxShadow:'0 2px 4px rgba(0,0,0,.18)' }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function NambariChart() {
  return (
    <Section>
      <Tag>Nambari 1 â€“ 50</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(38px,1fr))', gap:'5px' }}>
        {Array.from({length:50}, (_, i) => i+1).map(n => (
          <div key={n} style={{
            background: n%5===0 ? 'rgba(99,102,241,.15)' : 'var(--surface, #f9fafb)',
            border: n%5===0 ? '2px solid #6366f1' : '1px solid var(--border, #e5e7eb)',
            borderRadius:'8px', width:'38px', height:'38px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: n%5===0 ? 800 : 600, fontSize:'.85rem',
            color: n%5===0 ? '#a5b4fc' : 'var(--text, #111827)',
          }}>{n}</div>
        ))}
      </div>
    </Section>
  );
}

export function NumberChart100({ grade }) {
  const ROW_COLORS = ['#5bc8f5','#fde84e','#f97c2b','#6abf69','#f06292','#9575cd','#4dd0e1','#ef5350','#42a5f5','#c6e03b'];
  const TITLE_COLORS = ['#e53935','#f57c00','#fbc02d','#388e3c','#1976d2','#7b1fa2','#e53935','#f57c00','#fbc02d','#388e3c','#1976d2'];
  const ONES = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const toWord = n => {
    if (n===100) return 'hundred';
    if (n<20)    return ONES[n];
    const t=Math.floor(n/10), o=n%10;
    return o===0 ? TENS[t] : TENS[t]+'-'+ONES[o];
  };
  return (
    <div style={{ fontFamily:'sans-serif', padding:'8px', userSelect:'none' }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:10, flexWrap:'wrap' }}>
        {'Numbers 1-100'.split('').map((ch,i) => (
          <span key={i} style={{ fontSize:'1.6rem', fontWeight:900, color: ch===' ' ? 'transparent' : TITLE_COLORS[i%TITLE_COLORS.length], textShadow:'1px 1px 0 rgba(0,0,0,.15)' }}>{ch===' ' ? '\u00A0' : ch}</span>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(10,1fr)', gap:4 }}>
        {Array.from({length:100},(_,i)=>i+1).map(n => {
          const row = Math.floor((n-1)/10);
          const bg  = ROW_COLORS[row];
          const dark = row===1||row===9;
          return (
            <div key={n} style={{ background:bg, borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'5px 1px 4px', boxShadow:'inset 0 -3px 0 rgba(0,0,0,.2)', border:'2px solid rgba(255,255,255,.5)', minHeight:'58px', overflow:'hidden' }}>
              <span style={{ fontWeight:900, fontSize: n===100 ? 'clamp(0.85rem,2.8vw,1.15rem)' : 'clamp(1.05rem,3.8vw,1.5rem)', color: dark ? '#222' : '#fff', lineHeight:1, whiteSpace:'nowrap' }}>{n}</span>
              <span style={{ fontWeight:700, fontSize:'clamp(0.42rem,1.3vw,0.6rem)', color: dark ? '#333' : 'rgba(255,255,255,.95)', marginTop:3, textAlign:'center', lineHeight:1.1, maxWidth:'100%', overflow:'hidden' }}>{toWord(n)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â•â•â• NEW CHARTS (added in current version) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function ColorsChart() {
  const SHAPES_SVG = [
    { name:'Circle',    el:<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#6366f1" opacity=".85"/></svg> },
    { name:'Square',    el:<svg width="48" height="48" viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="2" fill="#f59e0b" opacity=".85"/></svg> },
    { name:'Triangle',  el:<svg width="48" height="48" viewBox="0 0 48 48"><polygon points="24,4 44,44 4,44" fill="#10b981" opacity=".85"/></svg> },
    { name:'Rectangle', el:<svg width="48" height="48" viewBox="0 0 48 48"><rect x="2" y="12" width="44" height="24" rx="2" fill="#3b82f6" opacity=".85"/></svg> },
    { name:'Star',      el:<svg width="48" height="48" viewBox="0 0 48 48"><polygon points="24,2 29,18 46,18 33,28 38,45 24,35 10,45 15,28 2,18 19,18" fill="#eab308" opacity=".85"/></svg> },
    { name:'Oval',      el:<svg width="48" height="48" viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="22" ry="14" fill="#ec4899" opacity=".85"/></svg> },
  ];
  return (
    <Section>
      <Tag color="#f97316">Colors &amp; Shapes</Tag>
      <div style={{ marginBottom:'16px' }}>
        <div style={{ fontWeight:700, fontSize:'.8rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Colors</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {COLORS_DATA.map(c => (
            <div key={c.name} style={{ display:'flex', alignItems:'center', gap:'6px', background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'8px', padding:'6px 12px' }}>
              <span style={{ display:'inline-block', width:'22px', height:'22px', borderRadius:'50%', background:c.hex, border: c.border ? '1.5px solid #d1d5db' : 'none' }} />
              <span style={{ fontWeight:700, fontSize:'.92rem' }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight:700, fontSize:'.8rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Shapes</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
          {SHAPES_SVG.map(s => (
            <div key={s.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'10px', padding:'10px 16px', minWidth:'80px' }}>
              {s.el}
              <span style={{ fontWeight:700, fontSize:'.88rem' }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function DaysMonthsChart() {
  const dayColors = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#a855f7','#ec4899'];
  return (
    <Section>
      <Tag color="#10b981">Days &amp; Months</Tag>
      <div style={{ marginBottom:'14px' }}>
        <div style={{ fontWeight:700, fontSize:'.8rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Days of the Week</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{ background:dayColors[i], color:'#fff', borderRadius:'8px', padding:'6px 14px', fontWeight:700, fontSize:'.9rem' }}>{d}</div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight:700, fontSize:'.8rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Months of the Year</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:'6px' }}>
          {MONTHS.map((m, i) => (
            <div key={m} style={{ background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'8px', padding:'7px 10px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontWeight:800, fontSize:'.8rem', color:'#6366f1', minWidth:'22px' }}>{String(i+1).padStart(2,'0')}</span>
              <span style={{ fontWeight:600, fontSize:'.88rem' }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function SentencesChart() {
  return (
    <Section>
      <Tag color="#3b82f6">Simple Sentences</Tag>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {SENTENCES.map((s, i) => (
          <div key={i} style={{ display:'flex', gap:'12px', flexWrap:'wrap', background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'10px', padding:'10px 14px', alignItems:'center' }}>
            <span style={{ fontWeight:800, fontSize:'.78rem', color:'#6366f1', minWidth:'20px' }}>{i+1}.</span>
            <span style={{ fontWeight:700, fontSize:'.95rem', flex:1 }}>{s.en}</span>
            <span style={{ fontSize:'.85rem', color:'var(--sub, #6b7280)', fontStyle:'italic', flex:1 }}>{s.sw}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BodyPartsEmojiChart() {
  return (
    <Section>
      <Tag color="#ec4899">Body Parts</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))', gap:'8px' }}>
        {BODY_PARTS_EMOJI.map(p => (
          <div key={p.name} style={{ background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'10px', padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontSize:'1.6rem', marginBottom:'4px' }}>{p.emoji}</div>
            <div style={{ fontWeight:700, fontSize:'.88rem' }}>{p.name}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function MathChart() {
  return (
    <Section>
      <Tag color="#f59e0b">Basic Math</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'14px' }}>
        <div>
          <div style={{ fontWeight:700, fontSize:'.8rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Addition âž•</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {MATH_OPS.map(({a,b}) => (
              <div key={'add'+a+b} style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'8px', padding:'7px 12px', fontWeight:700, fontSize:'1rem' }}>
                <span>{a}</span><span style={{ color:'#10b981' }}>+</span><span>{b}</span><span style={{ color:'var(--sub, #6b7280)' }}>=</span><span style={{ color:'#6366f1' }}>{a+b}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:'.8rem', color:'var(--sub, #6b7280)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Subtraction âž–</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {MATH_OPS.map(({a,b}) => (
              <div key={'sub'+a+b} style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--surface, #f9fafb)', border:'1px solid var(--border, #e5e7eb)', borderRadius:'8px', padding:'7px 12px', fontWeight:700, fontSize:'1rem' }}>
                <span>{a+b}</span><span style={{ color:'#ef4444' }}>âˆ’</span><span>{b}</span><span style={{ color:'var(--sub, #6b7280)' }}>=</span><span style={{ color:'#6366f1' }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SightWordsChart() {
  const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#a855f7','#ec4899','#f97316'];
  return (
    <Section>
      <Tag color="#a855f7">Sight Words</Tag>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
        {SIGHT_WORDS.map((w, i) => (
          <div key={w} style={{ background:colors[i%colors.length], color:'#fff', borderRadius:'8px', padding:'6px 14px', fontWeight:800, fontSize:'1rem', letterSpacing:'.5px' }}>{w}</div>
        ))}
      </div>
    </Section>
  );
}

// â•â•â• PP1 KEY CHARTS (from backup) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function EnvironmentalSoundsChart() {
  return (
    <Section>
      <Tag>Sounds Around Us</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'12px' }}>
        {ENV_SOUNDS.map(s => (
          <div key={s.label} style={{ background:s.color+'18', border:'3px solid '+s.color, borderRadius:'16px', overflow:'hidden', textAlign:'center' }}>
            <img src={s.img} alt={s.label} style={{ width:'100%', height:'120px', objectFit:'cover', display:'block' }} />
            <div style={{ padding:'8px 4px', color:'var(--text, #111827)', fontWeight:900, fontSize:'1rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function GreetingsChart() {
  return (
    <Section>
      <Tag>Greetings Chart</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'14px' }}>
        {GREETINGS.map(g => (
          <div key={g.text} style={{ background:g.color+'15', border:'3px solid '+g.color, borderRadius:'18px', overflow:'hidden', textAlign:'center', boxShadow:'0 3px 10px '+g.color+'30' }}>
            <div style={{ padding:'16px 8px 4px', fontWeight:900, fontSize:'1rem', color:g.color }}>{g.text}</div>
            <div style={{ background:g.color+'22', padding:'6px 8px', borderTop:'2px dashed '+g.color+'44' }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, color:'#1a1a1a', marginBottom:'3px' }}>ðŸ‘¤ {g.ask}</div>
              <div style={{ fontSize:'.75rem', fontWeight:700, color:g.color }}>ðŸ‘¤ {g.reply}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BodyPartsImgChart() {
  return (
    <Section>
      <Tag color="#ec4899">My Body</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'12px' }}>
        {BODY_PARTS_IMG.map(b => (
          <div key={b.label} style={{ background:b.color+'18', border:'3px solid '+b.color, borderRadius:'16px', overflow:'hidden', textAlign:'center' }}>
            <img src={b.img} alt={b.label} style={{ width:'100%', height:'120px', objectFit:'cover', display:'block' }} />
            <div style={{ padding:'8px 4px', color:'var(--text, #111827)', fontWeight:900, fontSize:'1rem' }}>{b.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FamilyChart() {
  return (
    <Section>
      <Tag>My Family</Tag>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'12px' }}>
        {FAMILY.map(f => (
          <div key={f.label} style={{ background:f.color+'18', border:'3px solid '+f.color, borderRadius:'16px', overflow:'hidden', textAlign:'center' }}>
            <img src={f.img} alt={f.label} style={{ width:'100%', height:'130px', objectFit:'cover', display:'block' }} />
            <div style={{ padding:'8px 4px', color:'var(--text, #111827)', fontWeight:900, fontSize:'1rem' }}>{f.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function StorySequenceChart() {
  return (
    <Section>
      <Tag>Story Sequence</Tag>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
        {STORY_SEQUENCE.map((s, i) => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ border:'3px solid #6366f1', borderRadius:'16px', overflow:'hidden', textAlign:'center', minWidth:'120px' }}>
              <img src={s.img} alt={s.label} style={{ width:'120px', height:'110px', objectFit:'cover', display:'block' }} />
              <div style={{ padding:'8px', background:'rgba(99,102,241,.12)', color:'#6366f1', fontWeight:900, fontSize:'1rem', textTransform:'uppercase', letterSpacing:'.05em' }}>{s.label}</div>
            </div>
            {i < STORY_SEQUENCE.length - 1 && (
              <span style={{ fontSize:'2rem', color:'#6366f1', fontWeight:900 }}>â†’</span>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

// â•â•â• INTERACTIVE COMPONENTS (from backup) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export function PP1ListeningAndSpeaking() {
  const [myName,  setMyName]  = React.useState('');
  const [family,  setFamily]  = React.useState('');
  const [feeling, setFeeling] = React.useState('');
  const feelings = [
    { label:'Happy', emoji:'ðŸ˜Š', color:'#10b981' },
    { label:'Sad',   emoji:'ðŸ˜¢', color:'#3b82f6' },
    { label:'Tired', emoji:'ðŸ˜´', color:'#8b5cf6' },
  ];
  const inputStyle = { width:'100%', padding:'10px 14px', marginTop:'6px', fontSize:'1rem', fontWeight:700, border:'2.5px solid #d1d5db', borderRadius:'12px', outline:'none', background:'white', color:'#1a1a1a', boxSizing:'border-box', transition:'border-color .2s' };
  const labelStyle = { display:'block', fontWeight:800, fontSize:'.88rem', color:'#374151', marginBottom:'14px' };
  const sectionHead = { fontWeight:900, fontSize:'.9rem', color:'#374151', margin:'0 0 8px', borderLeft:'4px solid #6366f1', paddingLeft:'8px' };
  return (
    <div style={{ fontSize:'.875rem', lineHeight:1.75 }}>
      <p style={sectionHead}>ðŸ—£ï¸ Greetings â€“ say these every day:</p>
      <ul style={{ margin:'0 0 18px', paddingLeft:'20px', color:'#374151' }}>
        {['"Good morning"','"Please"','"Thank you"','"Sorry"'].map(g => (
          <li key={g} style={{ marginBottom:'4px', fontWeight:600 }}>{g}</li>
        ))}
      </ul>
      <div style={{ background:'linear-gradient(135deg,#EEF2FF,#F5F3FF)', border:'2.5px solid #6366f1', borderRadius:'16px', padding:'16px', marginBottom:'18px' }}>
        <p style={{ ...sectionHead, borderColor:'#6366f1', margin:'0 0 14px' }}>âœï¸ Talk about yourself â€“ write your answers:</p>
        <label style={labelStyle}>
          My name is:
          <input style={{ ...inputStyle, borderColor: myName ? '#6366f1' : '#d1d5db', boxShadow: myName ? '0 0 0 3px #6366f133' : 'none' }} placeholder="Write your name here..." value={myName} onChange={e => setMyName(e.target.value)} />
          {myName && <span style={{ fontSize:'.8rem', color:'#6366f1', fontWeight:700, marginTop:'4px', display:'block' }}>ðŸ‘‹ Hello, {myName}!</span>}
        </label>
        <label style={labelStyle}>
          My family members are:
          <input style={{ ...inputStyle, borderColor: family ? '#6366f1' : '#d1d5db', boxShadow: family ? '0 0 0 3px #6366f133' : 'none' }} placeholder="e.g. Mum, Dad, Sister..." value={family} onChange={e => setFamily(e.target.value)} />
          {family && <span style={{ fontSize:'.8rem', color:'#6366f1', fontWeight:700, marginTop:'4px', display:'block' }}>ðŸ‘¨â€ðŸ‘©â€ðŸ‘§ My family: {family}</span>}
        </label>
        <div style={{ fontWeight:800, fontSize:'.88rem', color:'#374151', marginBottom:'10px' }}>Today I feel:</div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'8px' }}>
          {feelings.map(f => (
            <button key={f.label} onClick={() => setFeeling(f.label)} style={{ padding:'12px 18px', fontSize:'1rem', fontWeight:900, border: feeling===f.label ? '3px solid '+f.color : '2.5px solid #d1d5db', borderRadius:'14px', background: feeling===f.label ? f.color+'22' : 'white', color: feeling===f.label ? f.color : '#374151', cursor:'pointer', transform: feeling===f.label ? 'scale(1.08)' : 'scale(1)', transition:'all .15s', boxShadow: feeling===f.label ? '0 4px 12px '+f.color+'44' : 'none' }}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
        {feeling && (
          <div style={{ background:'white', border:'2px solid #d1d5db', borderRadius:'10px', padding:'8px 12px', fontSize:'.85rem', fontWeight:800, color:'#374151' }}>
            I feel <span style={{ color: feelings.find(f=>f.label===feeling)?.color }}>{feelings.find(f=>f.label===feeling)?.emoji} {feeling}</span> today.
          </div>
        )}
      </div>
      <p style={sectionHead}>ðŸ‘‚ Listen for sounds:</p>
      <ul style={{ margin:0, paddingLeft:'20px', color:'#374151' }}>
        {['Animals','Cars','Rain','Thunder'].map(s => (
          <li key={s} style={{ marginBottom:'4px', fontWeight:600 }}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

export function PP1MathCounting() {
  const items = ['ðŸŽ','ðŸŒ','ðŸŠ','ðŸ‡','ðŸ“','ðŸ«','ðŸ¥','ðŸ‹','ðŸ‰','ðŸ‘'];
  const [count, setCount] = React.useState(0);
  const [done,  setDone]  = React.useState(false);
  const tap = () => { if (done) return; const next = count+1; setCount(next); if (next===10) setDone(true); };
  const reset = () => { setCount(0); setDone(false); };
  return (
    <div style={{ fontFamily:'sans-serif', padding:'12px' }}>
      <p style={{ fontWeight:700, marginBottom:8 }}>Tap each fruit to count it! ðŸŽ</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:12 }}>
        {items.map((fruit,i) => (
          <span key={i} onClick={tap} style={{ fontSize:'2rem', cursor:'pointer', opacity: i<count ? 1 : 0.25, transform: i<count ? 'scale(1.1)' : 'scale(1)', transition:'all .2s' }}>{fruit}</span>
        ))}
      </div>
      <p style={{ fontSize:'1.4rem', fontWeight:800, color:'#10b981' }}>Count: {count} {done ? 'ðŸŽ‰ Well done!' : ''}</p>
      {done && <button onClick={reset} style={{ marginTop:8, padding:'6px 18px', borderRadius:8, background:'#3b82f6', color:'#fff', border:'none', cursor:'pointer', fontWeight:700 }}>Try Again</button>}
    </div>
  );
}

export function PP1MathSequence() {
  const correct = [1,2,3,4,5,6,7,8,9,10];
  const shuffle = arr => [...arr].sort(() => Math.random()-0.5);
  const [cards,   setCards]   = React.useState(() => shuffle(correct));
  const [picked,  setPicked]  = React.useState([]);
  const [success, setSuccess] = React.useState(false);
  const pick = n => {
    if (picked.includes(n) || success) return;
    const next = [...picked, n];
    setPicked(next);
    if (next.length===10) setSuccess(JSON.stringify(next)===JSON.stringify(correct));
  };
  const reset = () => { setCards(shuffle(correct)); setPicked([]); setSuccess(false); };
  return (
    <div style={{ fontFamily:'sans-serif', padding:'12px' }}>
      <p style={{ fontWeight:700, marginBottom:8 }}>Tap the numbers in order from 1 to 10! ðŸ”¢</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:12 }}>
        {cards.map(n => (
          <button key={n} onClick={() => pick(n)} style={{ width:48, height:48, borderRadius:10, border:'2px solid #6366f1', background: picked.includes(n) ? '#6366f1' : '#fff', color: picked.includes(n) ? '#fff' : '#1e1b4b', fontSize:'1.25rem', fontWeight:800, cursor:'pointer', opacity: picked.includes(n) ? 0.5 : 1 }}>{n}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
        {picked.map((n,i) => <span key={i} style={{ background:'#10b981', color:'#fff', borderRadius:8, padding:'4px 10px', fontWeight:700 }}>{n}</span>)}
      </div>
      {picked.length===10 && <p style={{ fontWeight:800, fontSize:'1.1rem', color: success ? '#10b981' : '#ef4444' }}>{success ? 'ðŸŽ‰ Perfect order!' : 'âŒ Not quite â€“ try again!'}</p>}
      <button onClick={reset} style={{ marginTop:8, padding:'6px 18px', borderRadius:8, background:'#6366f1', color:'#fff', border:'none', cursor:'pointer', fontWeight:700 }}>Shuffle &amp; Retry</button>
    </div>
  );
}

export function PP1MathMeasurement() {
  const Card = ({ title, children }) => (
    <div style={{ background:'#f8faff', borderRadius:16, padding:'14px 12px', boxShadow:'0 2px 8px rgba(0,0,0,.08)', marginBottom:14 }}>
      <p style={{ fontWeight:800, fontSize:'1rem', color:'#1e1b4b', marginBottom:10, textAlign:'center' }}>{title}</p>
      {children}
    </div>
  );
  const Sub = ({ label, color }) => (
    <div style={{ textAlign:'center', fontWeight:800, fontSize:'1rem', color:color||'#1e1b4b', marginBottom:6, letterSpacing:'.5px', textTransform:'uppercase' }}>{label}</div>
  );
  return (
    <div style={{ fontFamily:'sans-serif', padding:'8px' }}>
      <Card title="ðŸ“ Comparing Sizes">
        <Sub label="Big vs Small" color="#f97c2b"/>
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'flex-end', marginBottom:20 }}>
          <div style={{ textAlign:'center' }}>
            <svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="40" fill="#f97c2b" opacity=".9"/><text x="45" y="50" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">BIG</text></svg>
            <div style={{ fontWeight:700, color:'#f97c2b' }}>Big ðŸ˜</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="60" r="20" fill="#6366f1" opacity=".9"/><text x="45" y="65" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">small</text></svg>
            <div style={{ fontWeight:700, color:'#6366f1' }}>Small ðŸ­</div>
          </div>
        </div>
        <Sub label="Tall vs Short" color="#10b981"/>
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'flex-end', marginBottom:20 }}>
          <div style={{ textAlign:'center' }}>
            <svg width="60" height="110" viewBox="0 0 60 110"><rect x="15" y="5" width="30" height="100" rx="6" fill="#10b981"/><text x="30" y="58" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">TALL</text></svg>
            <div style={{ fontWeight:700, color:'#10b981' }}>Tall ðŸ¦’</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <svg width="60" height="110" viewBox="0 0 60 110"><rect x="15" y="65" width="30" height="40" rx="6" fill="#ec407a"/><text x="30" y="89" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">short</text></svg>
            <div style={{ fontWeight:700, color:'#ec407a' }}>Short ðŸ¢</div>
          </div>
        </div>
        <Sub label="Long vs Short" color="#f59e0b"/>
        <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
          <div style={{ textAlign:'center', width:'100%' }}>
            <svg width="100%" height="40" viewBox="0 0 300 40"><rect x="10" y="10" width="270" height="22" rx="8" fill="#f59e0b"/><text x="145" y="25" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">LONG ðŸ</text></svg>
          </div>
          <div style={{ textAlign:'center', width:'60%' }}>
            <svg width="100%" height="40" viewBox="0 0 300 40"><rect x="80" y="10" width="140" height="22" rx="8" fill="#7c3aed"/><text x="150" y="25" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">short ðŸ›</text></svg>
          </div>
        </div>
      </Card>
      <Card title="âš–ï¸ Comparing Mass">
        <Sub label="Heavy vs Light" color="#ef4444"/>
        <svg viewBox="0 0 280 160" width="100%" style={{ maxHeight:170 }}>
          <polygon points="140,135 120,155 160,155" fill="#78716c"/>
          <rect x="110" y="155" width="60" height="8" rx="3" fill="#57534e"/>
          <line x1="50" y1="95" x2="230" y2="75" stroke="#44403c" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="140" cy="85" r="6" fill="#a8a29e"/>
          <line x1="50" y1="95" x2="50" y2="115" stroke="#a8a29e" strokeWidth="2" strokeDasharray="4,3"/>
          <line x1="230" y1="75" x2="230" y2="105" stroke="#a8a29e" strokeWidth="2" strokeDasharray="4,3"/>
          <ellipse cx="50" cy="118" rx="30" ry="8" fill="#d6d3d1"/>
          <ellipse cx="230" cy="108" rx="30" ry="8" fill="#d6d3d1"/>
          <ellipse cx="50" cy="108" rx="22" ry="14" fill="#78716c"/>
          <text x="50" y="113" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">ðŸª¨ Heavy</text>
          <text x="230" y="100" textAnchor="middle" fontSize="20">ðŸª¶</text>
          <text x="50" y="145" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">Heavy â†“</text>
          <text x="230" y="135" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Light â†‘</text>
        </svg>
      </Card>
      <Card title="ðŸ’§ Capacity">
        <Sub label="Empty / Half Full / Full" color="#3b82f6"/>
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'flex-end' }}>
          {[
            { label:'Empty',     fill:null },
            { label:'Half Full', fill:'half' },
            { label:'Full',      fill:'full' },
          ].map(({label, fill}) => (
            <div key={label} style={{ textAlign:'center' }}>
              <svg width="90" height="110" viewBox="0 0 90 110">
                <path d="M15,10 L75,10 L65,100 L25,100 Z" fill={fill==='full' ? '#3b82f6' : 'none'} stroke={fill==='full' ? '#1d4ed8' : fill==='half' ? '#38bdf8' : '#94a3b8'} strokeWidth="3" opacity={fill==='full' ? '.85' : 1}/>
                {fill==='half' && <path d="M20,55 L70,55 L65,100 L25,100 Z" fill="#38bdf8" opacity=".5"/>}
                <path d="M75,30 Q95,50 75,70" fill="none" stroke={fill==='full' ? '#1d4ed8' : fill==='half' ? '#38bdf8' : '#94a3b8'} strokeWidth="3"/>
                <text x="45" y={fill==='full' ? 60 : 85} textAnchor="middle" fill={fill==='full' ? '#fff' : fill==='half' ? '#0369a1' : '#94a3b8'} fontSize="9" fontWeight="bold">{label.toUpperCase()}</text>
              </svg>
              <div style={{ fontWeight:800, color: fill==='full' ? '#3b82f6' : fill==='half' ? '#38bdf8' : '#94a3b8', fontSize:'.9rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function PP1MathClassificationCard() {
  const Dot = ({ color, size=38 }) => <span style={{ display:'inline-block', width:size+'px', height:size+'px', borderRadius:'50%', background:color, margin:'3px', boxShadow:'0 2px 6px rgba(0,0,0,.25)', flexShrink:0 }} />;
  const Sq  = ({ color, size=38 }) => <span style={{ display:'inline-block', width:size+'px', height:size+'px', background:color, margin:'3px', borderRadius:'4px', flexShrink:0 }} />;
  const Tri = ({ color, size=40 }) => <span style={{ display:'inline-block', width:0, height:0, borderLeft:(size/2)+'px solid transparent', borderRight:(size/2)+'px solid transparent', borderBottom:size+'px solid '+color, margin:'4px', flexShrink:0 }} />;
  const Row = ({ children }) => <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'4px', marginBottom:'8px' }}>{children}</div>;
  const GroupBox = ({ label, color, children }) => (
    <div style={{ border:'2px solid '+color, borderRadius:'10px', padding:'8px 10px', margin:'4px', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
      <span style={{ fontSize:'.7rem', fontWeight:700, color, textTransform:'uppercase' }}>{label}</span>
      <div style={{ display:'flex', flexWrap:'wrap' }}>{children}</div>
    </div>
  );
  const SH  = { fontWeight:700, color:'var(--text)', margin:'16px 0 6px', fontSize:'.88rem' };
  const SUB = { margin:'0 0 6px', fontSize:'.8rem', color:'var(--sub)' };
  return (
    <div style={{ fontSize:'.875rem', lineHeight:1.7 }}>
      <p style={SH}>A Â· SORTING &amp; GROUPING</p>
      <p style={SUB}>Sort by COLOUR:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'14px' }}>
        <GroupBox label="Red group"    color="#ef4444"><Dot color="#ef4444"/><Dot color="#ef4444"/><Dot color="#ef4444"/></GroupBox>
        <GroupBox label="Blue group"   color="#3b82f6"><Dot color="#3b82f6"/><Dot color="#3b82f6"/><Dot color="#3b82f6"/></GroupBox>
        <GroupBox label="Yellow group" color="#f59e0b"><Dot color="#f59e0b"/><Dot color="#f59e0b"/><Dot color="#f59e0b"/></GroupBox>
      </div>
      <p style={SUB}>Sort by SIZE:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'20px', alignItems:'flex-end', marginBottom:'14px' }}>
        <div style={{ textAlign:'center' }}><div><Dot color="#a78bfa" size={56}/><Dot color="#a78bfa" size={56}/></div><span style={{ fontSize:'.72rem', fontWeight:700, color:'#a78bfa' }}>Big pile</span></div>
        <div style={{ textAlign:'center' }}><div><Dot color="#a78bfa" size={24}/><Dot color="#a78bfa" size={24}/></div><span style={{ fontSize:'.72rem', fontWeight:700, color:'#a78bfa' }}>Small pile</span></div>
      </div>
      <p style={SUB}>Sort by SHAPE:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'20px' }}>
        <GroupBox label="Circles"   color="#f87171"><Dot color="#f87171" size={40}/><Dot color="#f87171" size={40}/><Dot color="#f87171" size={40}/></GroupBox>
        <GroupBox label="Squares"   color="#60a5fa"><Sq  color="#60a5fa" size={38}/><Sq  color="#60a5fa" size={38}/><Sq  color="#60a5fa" size={38}/></GroupBox>
        <GroupBox label="Triangles" color="#34d399"><Tri color="#34d399" size={40}/><Tri color="#34d399" size={40}/><Tri color="#34d399" size={40}/></GroupBox>
      </div>
      <p style={SH}>B Â· PATTERNING</p>
      <p style={SUB}>Colour pattern:</p>
      <Row>{['#ef4444','#3b82f6','#ef4444','#3b82f6','#ef4444','#3b82f6'].map((c,i)=><Dot key={i} color={c} size={75}/>)}<span style={{ fontSize:'1.4rem' }}>...</span></Row>
      <p style={SUB}>Shape pattern:</p>
      <Row>{[0,1,2,3,4].map(i=>i%2===0?<Dot key={i} color="#a78bfa" size={110}/>:<Sq key={i} color="#f59e0b" size={105}/>)}<span style={{ fontSize:'1.4rem' }}>...</span></Row>
      <p style={SUB}>Object pattern:</p>
      <Row>{['ðŸ¥„','ðŸ´','ðŸ¥„','ðŸ´','ðŸ¥„','ðŸ´'].map((e,i)=><span key={i} style={{ fontSize:'2.4rem', margin:'2px' }}>{e}</span>)}<span style={{ fontSize:'1.4rem' }}>...</span></Row>
      <p style={SH}>C Â· MATCHING &amp; PAIRING</p>
      <p style={SUB}>Match objects you play with:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
        {[['âš½','âš½'],['ðŸª†','ðŸª†'],['ðŸš—','ðŸš—']].map(([a,b],i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', background:'var(--surface,#f3f4f6)', borderRadius:'12px', padding:'8px 14px', fontSize:'2.4rem', border:'1px solid var(--border,#e5e7eb)' }}>{a}<span style={{ fontSize:'1rem' }}>â†”</span>{b}</div>
        ))}
      </div>
      <p style={SH}>D Â· ODD ONE OUT</p>
      <p style={SUB}>By shape:</p>
      <Row><Tri color="#34d399" size={70}/><Tri color="#34d399" size={70}/><Sq color="#ef4444" size={62}/><Tri color="#34d399" size={70}/><span style={{ fontSize:'.85rem', marginLeft:'8px' }}>â†’ <b style={{ color:'#ef4444' }}>â–¡ square</b> is different!</span></Row>
      <p style={SUB}>By colour â€“ hearts:</p>
      <Row><span style={{ fontSize:'3rem', color:'#ef4444' }}>â™¥</span><span style={{ fontSize:'3rem', color:'#ef4444' }}>â™¥</span><span style={{ fontSize:'3rem', color:'#3b82f6' }}>â™¥</span><span style={{ fontSize:'3rem', color:'#ef4444' }}>â™¥</span><span style={{ fontSize:'.85rem', marginLeft:'8px' }}>â†’ <b style={{ color:'#3b82f6' }}>blue heart</b> is odd one out!</span></Row>
    </div>
  );
}

export function PP1MathNumberWorkCard() {
  const countRows = [
    { n:1, word:'one',   color:'#ef4444' }, { n:2, word:'two',   color:'#f97316' },
    { n:3, word:'three', color:'#eab308' }, { n:4, word:'four',  color:'#22c55e' },
    { n:5, word:'five',  color:'#3b82f6' }, { n:6, word:'six',   color:'#8b5cf6' },
    { n:7, word:'seven', color:'#ec4899' }, { n:8, word:'eight', color:'#f59e0b' },
  ];
  const words = [['0','zero'],['1','one'],['2','two'],['3','three'],['4','four'],['5','five'],['6','six'],['7','seven'],['8','eight'],['9','nine'],['10','ten']];
  return (
    <div style={{ fontSize:'.875rem', lineHeight:1.7 }}>
      <p style={{ fontWeight:700, color:'var(--text)', margin:'0 0 6px' }}>A Â· COUNTING OBJECTS</p>
      <p style={{ margin:'0 0 12px', fontSize:'.8rem', color:'var(--sub)' }}>Touch each circle and say its number. The LAST number = the total!</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px' }}>
        {countRows.map(({ n, word, color }) => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap', background:'var(--surface,#f9fafb)', borderRadius:'12px', padding:'10px 14px', border:'1px solid var(--border,#e5e7eb)' }}>
            <div style={{ display:'flex', flexWrap:'wrap', minWidth:'180px', flex:1 }}>
              {Array.from({ length:n }).map((_,i) => <span key={i} style={{ display:'inline-block', width:'38px', height:'38px', borderRadius:'50%', background:color, margin:'3px', boxShadow:'0 2px 6px rgba(0,0,0,.22)' }} />)}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', minWidth:'80px' }}>
              <span style={{ fontSize:'1.6rem', fontWeight:800, color }}>{n}</span>
              <span style={{ fontSize:'.82rem', color:'var(--sub)' }}>({word})</span>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontWeight:700, color:'var(--text)', margin:'0 0 10px' }}>B Â· NUMBER WORDS</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px' }}>
        {words.map(([n,w]) => (
          <div key={n} style={{ background:'var(--surface,#f3f4f6)', borderRadius:'10px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px', border:'1px solid var(--border,#e5e7eb)' }}>
            <span style={{ fontSize:'1.7rem', fontWeight:800, color:'#6366f1', minWidth:'32px' }}>{n}</span>
            <span style={{ fontSize:'.88rem', fontWeight:600, color:'var(--text)' }}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PP1VowelsCard() {
  const vowels = [
    { letter:'A', color:'#ef4444', short:'apple',    long:'acorn',   se:'ðŸŽ', le:'ðŸŒ°' },
    { letter:'E', color:'#f97316', short:'egg',      long:'eel',     se:'ðŸ¥š', le:'ðŸ' },
    { letter:'I', color:'#eab308', short:'igloo',    long:'ice',     se:'ðŸ ', le:'ðŸ§Š' },
    { letter:'O', color:'#22c55e', short:'olive',    long:'oval',    se:'ðŸ«’', le:'â­•' },
    { letter:'U', color:'#3b82f6', short:'umbrella', long:'unicorn', se:'â˜‚ï¸', le:'ðŸ¦„' },
  ];
  const consonants = 'B C D F G H J K L M N P Q R S T V W X Y Z'.split(' ');
  const pics = [
    ['ðŸŽ','Apple'],['âš½','Ball'],['ðŸ§','Cupcake'],['ðŸ¦†','Duck'],['ðŸ˜','Elephant'],
    ['ðŸš©','Flag'],['ðŸŽ¸','Guitar'],['ðŸŽ©','Hat'],['ðŸ¦Ž','Iguana'],['ðŸ§¥','Jacket'],
    ['ðŸª','Kite'],['ðŸƒ','Leaf'],['ðŸµ','Monkey'],['9ï¸âƒ£','Nine'],['ðŸŠ','Orange'],
    ['ðŸ§','Penguin'],['ðŸ‘¸','Queen'],['ðŸ‡','Rabbit'],['â­','Star'],['ðŸš‚','Train'],
    ['â˜‚ï¸','Umbrella'],['ðŸ¦º','Vest'],['ðŸ‹','Whale'],['ðŸŽµ','Xylophone'],['ðŸª€','Yo-yo'],
    ['ðŸ¦“','Zebra'],['ðŸ±','Cat'],['ðŸŸ','Fish'],['ðŸ•','Dog'],['â˜€ï¸','Sun'],
  ];
  const missing = [
    { seq:['A','B','_','D','E'], ans:'C' }, { seq:['_','E','F','G','H'], ans:'D' },
    { seq:['C','D','E','_','G'], ans:'F' }, { seq:['L','M','N','O','_'], ans:'P' },
    { seq:['H','_','J','K','L'], ans:'I' }, { seq:['S','T','_','V','W'], ans:'U' },
  ];
  const SH = { fontWeight:800, color:'var(--text)', margin:'22px 0 10px', fontSize:'1rem' };
  return (
    <div style={{ fontSize:'.9rem', lineHeight:1.7 }}>
      <p style={SH}>ðŸ”¤ THE 5 VOWELS</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'24px' }}>
        {vowels.map(v => (
          <div key={v.letter} style={{ border:'3px solid '+v.color, borderRadius:'14px', padding:'12px 10px', textAlign:'center', minWidth:'110px', flex:1 }}>
            <div style={{ fontSize:'4rem', fontWeight:900, color:v.color, lineHeight:1 }}>{v.letter}</div>
            <div style={{ fontSize:'3rem', margin:'6px 0 2px' }}>{v.se}</div>
            <div style={{ fontSize:'.8rem', fontWeight:700, color:v.color }}>SHORT: {v.short}</div>
            <div style={{ fontSize:'3rem', margin:'6px 0 2px' }}>{v.le}</div>
            <div style={{ fontSize:'.8rem', fontWeight:700, color:v.color }}>LONG: {v.long}</div>
          </div>
        ))}
      </div>
      <p style={SH}>ðŸ”¡ CONSONANTS â€“ All 21</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' }}>
        {consonants.map(c => (
          <div key={c} style={{ width:'54px', height:'54px', borderRadius:'10px', background:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.9rem', fontWeight:900, color:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,.2)' }}>{c}</div>
        ))}
      </div>
      <p style={SH}>ðŸ”  Capital Letters A â€“ Z</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px', marginBottom:'24px' }}>
        {ALPHABET_FRIEZE.map(({l,w,e},i) => (
          <div key={l} style={{ borderRadius:'12px', background:'hsl('+(i*13)+',70%,55%)', padding:'10px 4px 8px', textAlign:'center', boxShadow:'0 2px 6px rgba(0,0,0,.2)' }}>
            <div style={{ fontSize:'2rem', lineHeight:1, marginBottom:'4px' }}>{e||'ðŸ”¤'}</div>
            <div style={{ fontWeight:900, fontSize:'1.5rem', color:'#fff', lineHeight:1 }}>{l}</div>
            <div style={{ fontWeight:700, fontSize:'.68rem', color:'#fff', marginTop:'3px', opacity:.95, letterSpacing:'.3px' }}>{w}</div>
          </div>
        ))}
      </div>
      <p style={SH}>ðŸ”¡ Small Letters a â€“ z</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px', marginBottom:'24px' }}>
        {ALPHABET_FRIEZE.map(({l,w,e},i) => (
          <div key={l+'s'} style={{ borderRadius:'12px', border:'2px solid hsl('+(i*13)+',70%,55%)', padding:'10px 4px 8px', textAlign:'center', background:'var(--surface,#1e1e2e)' }}>
            <div style={{ fontSize:'2rem', lineHeight:1, marginBottom:'4px' }}>{e||'ðŸ”¤'}</div>
            <div style={{ fontWeight:900, fontSize:'1.5rem', color:'hsl('+(i*13)+',70%,60%)', lineHeight:1 }}>{l.toLowerCase()}</div>
            <div style={{ fontWeight:700, fontSize:'.68rem', color:'hsl('+(i*13)+',70%,60%)', marginTop:'3px', letterSpacing:'.3px' }}>{w}</div>
          </div>
        ))}
      </div>
      <p style={SH}>ðŸ–¼ï¸ PICTURE â€“ WORD CARDS</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(105px,1fr))', gap:'10px', marginBottom:'24px' }}>
        {pics.map(([emoji,word]) => (
          <div key={word} style={{ background:'var(--surface,#f3f4f6)', border:'1px solid var(--border,#e5e7eb)', borderRadius:'12px', padding:'10px 6px', textAlign:'center' }}>
            <div style={{ fontSize:'3.5rem', lineHeight:1.1 }}>{emoji}</div>
            <div style={{ fontSize:'.9rem', fontWeight:800, color:'var(--text)', marginTop:'6px' }}>{word}</div>
          </div>
        ))}
      </div>
      <p style={SH}>â“ MISSING LETTERS</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {missing.map((row,ri) => (
          <div key={ri} style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', background:'var(--surface,#f9fafb)', borderRadius:'12px', padding:'10px 14px', border:'1px solid var(--border,#e5e7eb)' }}>
            {row.seq.map((ch,ci) => ch==='_' ? (
              <div key={ci} style={{ width:'58px', height:'58px', borderRadius:'10px', border:'3px dashed #6366f1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:900, color:'#6366f1', background:'#eef2ff' }}>{row.ans}</div>
            ) : (
              <div key={ci} style={{ width:'58px', height:'58px', borderRadius:'10px', background:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:900, color:'#fff' }}>{ch}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PP1CreativeMotorSkills() {
  const Note = ({text}) => <div style={{ background:'#fef9c3', borderRadius:8, padding:'8px 12px', marginBottom:8, fontSize:'.85rem', color:'#854d0e' }}>Note: {text}</div>;
  const Q    = ({text}) => <div style={{ background:'#eff6ff', borderRadius:8, padding:'8px 12px', fontSize:'.85rem', color:'#1e40af' }}>Try it: {text}</div>;
  const Step = ({n, text, color}) => (
    <div style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
      <span style={{ background:color, color:'#fff', borderRadius:'50%', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:800, flexShrink:0 }}>{n}</span>
      <span style={{ fontSize:'.9rem', color:'#374151', lineHeight:1.4 }}>{text}</span>
    </div>
  );
  return (
    <div style={{ fontFamily:'sans-serif', padding:'8px' }}>
      {[
        { title:'Throwing Underarm', img:'/creative/underarm-throw-steps.png', color:'#f97c2b', steps:['Stand with feet apart, one foot forward','Hold the ball with both hands at your side','Swing your arm underarm like a pendulum','Release the ball and follow through with your arm'], note:'Start close to your partner, then move further away!', q:'Can you throw a ball to a friend 3 times without dropping it?' },
        { title:'Catching a Beach Ball', img:'/creative/catching-beach-ball.png', color:'#10b981', steps:['Watch the ball coming towards you!','Reach your arms out wide, making a big basket','Grab the ball with both hands at the same time','Hug it to your chest to secure it'], note:'A big beach ball is much easier to catch. Start with a big one!', q:'Can you catch a ball thrown gently to you 5 times in a row?' },
        { title:'Kicking a Ball', img:'/creative/kicking-a-ball.png', color:'#6366f1', steps:['Stand behind the stationary ball','Look at where you want the ball to go','Step forward with your non-kicking foot','Swing your kicking foot and strike with your instep'], note:'Use the inside of your foot for better aim and control!', q:'Can you kick a ball and hit a target like a wall or a cone?' },
      ].map(({ title, color, steps, note, q, img }) => (
        <div key={title} style={{ background:'#f9fafb', borderLeft:'5px solid '+color, borderRadius:12, padding:14, marginBottom:14 }}>
          <div style={{ fontWeight:800, fontSize:'1.1rem', color, marginBottom:10 }}>{title}</div>
          {steps.map((s,i) => <Step key={i} n={i+1} text={s} color={color}/>)}
          <Note text={note}/><Q text={q}/>
          {img && <img src={img} alt={title} style={{ width:'100%', borderRadius:10, marginTop:10, border:'1px solid #e5e7eb' }}/>}
        </div>
      ))}
    </div>
  );
}

export function PP1CreativeArtCraft() {
  const Note = ({text}) => <div style={{ background:'#fef9c3', borderRadius:8, padding:'8px 12px', marginBottom:8, fontSize:'.85rem', color:'#854d0e' }}>Note: {text}</div>;
  const Q    = ({text}) => <div style={{ background:'#eff6ff', borderRadius:8, padding:'8px 12px', fontSize:'.85rem', color:'#1e40af' }}>Try it: {text}</div>;
  return (
    <div style={{ fontFamily:'sans-serif', padding:'8px' }}>
      {[
        { title:'Drawing and Scribbling', img:'/creative/drawing-scribbling.png', color:'#f97c2b', body:'Use crayons to draw freely! Try colouring large simple outlines.', tags:['Stars','House','Flower','Sun','Elephant'], note:'There is NO wrong way to draw! Every scribble is art.', q:'Can you draw your family using at least 3 different coloured crayons?' },
        { title:'Modelling with Clay',    img:'/creative/modelling-with-clay.png', color:'#10b981', body:'Playdough helps make your fingers strong for writing later!',     tags:['Ball â€“ Roll between palms','Snake â€“ Roll on flat surface','Pinch pot â€“ Poke and pinch!'], note:'Playdough helps make your fingers strong for writing!', q:'Can you make a ball AND a snake from playdough?' },
        { title:'Tearing and Pasting Collage', color:'#6366f1', body:'Tear paper, spread glue, stick pieces, press and let dry â€“ this is called a COLLAGE!', tags:['Tear paper','Spread glue','Stick pieces','Let it dry'], note:'This is called a COLLAGE!', q:'Can you make a collage of your favourite animal using torn coloured paper?' },
      ].map(({ title, color, body, tags, note, q, img }) => (
        <div key={title} style={{ background:'#f9fafb', borderLeft:'5px solid '+color, borderRadius:12, padding:14, marginBottom:14 }}>
          <div style={{ fontWeight:800, fontSize:'1.1rem', color, marginBottom:8 }}>{title}</div>
          <p style={{ fontSize:'.9rem', color:'#374151', marginBottom:10 }}>{body}</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
            {tags.map((t,i) => <span key={i} style={{ background:'#fff', border:'2px dashed '+color, borderRadius:8, padding:'4px 10px', fontSize:'.85rem', fontWeight:600, color }}>{t}</span>)}
          </div>
          <Note text={note}/><Q text={q}/>
          {img && <img src={img} alt={title} style={{ width:'100%', borderRadius:10, marginTop:10, border:'1px solid #e5e7eb' }}/>}
        </div>
      ))}
    </div>
  );
}

export function PP1CreativeMusic() {
  const Note = ({text}) => <div style={{ background:'#fef9c3', borderRadius:8, padding:'8px 12px', marginBottom:8, fontSize:'.85rem', color:'#854d0e' }}>Note: {text}</div>;
  const Q    = ({text}) => <div style={{ background:'#eff6ff', borderRadius:8, padding:'8px 12px', fontSize:'.85rem', color:'#1e40af' }}>Try it: {text}</div>;
  return (
    <div style={{ fontFamily:'sans-serif', padding:'8px' }}>
      <div style={{ background:'#fdf2f8', borderLeft:'5px solid #ec407a', borderRadius:12, padding:14, marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#ec407a', marginBottom:8 }}>Singing Games and Action Songs</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
          {['Sing the words','Do the actions','Watch your teacher','Have fun!'].map((s,i) => <div key={i} style={{ flex:'1 1 100px', background:'#fff', borderRadius:8, padding:'8px', textAlign:'center', fontSize:'.82rem', fontWeight:600, color:'#ec407a' }}>{s}</div>)}
        </div>
        <Note text="Action songs help you remember words AND build coordination!"/>
        <Q text="Can you sing an action song and do all the correct actions?"/>
        <img src='/creative/jumping.png' alt='Action Song' style={{ width:'100%', borderRadius:10, marginTop:10, border:'1px solid #e5e7eb' }}/>
      </div>
      <div style={{ background:'#fffbeb', borderLeft:'5px solid #f59e0b', borderRadius:12, padding:14, marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#f59e0b', marginBottom:8 }}>Body Percussion</div>
        <div style={{ display:'flex', justifyContent:'space-around', marginBottom:12 }}>
          {[['CLAP','Hands together','#ef4444'],['TAP','Tap your knees','#f59e0b'],['STAMP','Feet on ground','#10b981']].map(([l,d,c],i) => (
            <div key={i} style={{ textAlign:'center', flex:1 }}>
              <div style={{ fontWeight:900, color:c, fontSize:'1rem', marginBottom:2 }}>{l}</div>
              <div style={{ fontSize:'.78rem', color:'#6b7280' }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:10, padding:'10px', marginBottom:10 }}>
          <div style={{ fontWeight:700, color:'#374151', marginBottom:6, fontSize:'.9rem' }}>Try this rhythm:</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['CLAP','CLAP','TAP','STAMP','CLAP','TAP','STAMP','STAMP'].map((beat,i) => <span key={i} style={{ background:'#f59e0b', color:'#fff', borderRadius:8, padding:'4px 8px', fontSize:'.78rem', fontWeight:700 }}>{beat}</span>)}
          </div>
        </div>
        <Note text="Start slowly, then speed up. Music is all about RHYTHM!"/>
        <Q text="Can you clap, tap knees, and stamp feet in a repeating pattern?"/>
        <img src='/creative/body-percussion.png' alt='Body Percussion' style={{ width:'100%', borderRadius:10, marginTop:10, border:'1px solid #e5e7eb' }}/>
      </div>
      <div style={{ background:'#f0fdf4', borderLeft:'5px solid #10b981', borderRadius:12, padding:14 }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#10b981', marginBottom:8 }}>Exploring Sound</div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:12 }}>
          {[['Shakers','Fill a bottle with seeds and shake it!','#10b981'],['Drums','Tap a tin or box with a stick!','#6366f1'],['Humming','Hum with your mouth closed!','#ec407a']].map(([t,d,c],i) => (
            <div key={i} style={{ flex:'1 1 140px', background:'#fff', borderRadius:10, padding:'10px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
              <div style={{ fontWeight:800, color:c, marginBottom:4 }}>{t}</div>
              <div style={{ fontSize:'.82rem', color:'#6b7280' }}>{d}</div>
            </div>
          ))}
        </div>
        <Note text="Every object around you can make a sound!"/>
        <Q text="Can you make your own shaker at home and play a rhythm with it?"/>
      </div>
    </div>
  );
}

export function PP1CreativeKeyCharts() {
  return (
    <div style={{ fontFamily:'sans-serif', padding:'8px' }}>
      <div style={{ background:'#f8faff', borderRadius:14, padding:14, marginBottom:14, boxShadow:'0 2px 8px rgba(0,0,0,.07)' }}>
        <div style={{ fontWeight:800, fontSize:'1rem', color:'#1e1b4b', marginBottom:10, textAlign:'center' }}>How to Throw and Catch</div>
        <div style={{ display:'flex', justifyContent:'space-around' }}>
          {[['THROW','#f97c2b',['Stand sideways','Arm back','Swing underarm','Release and follow']],['CATCH','#10b981',['Face the thrower','Arms out wide','Watch the ball','Grab and hug!']]].map(([label,color,steps],i) => (
            <div key={i} style={{ textAlign:'center', flex:1 }}>
              <div style={{ fontWeight:900, color, fontSize:'1.1rem', marginBottom:8 }}>{label}</div>
              {steps.map((s,j) => (
                <div key={j} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <span style={{ background:color, color:'#fff', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:800, flexShrink:0 }}>{j+1}</span>
                  <span style={{ fontSize:'.82rem', color:'#374151', textAlign:'left' }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:'#f8faff', borderRadius:14, padding:14, marginBottom:14, boxShadow:'0 2px 8px rgba(0,0,0,.07)' }}>
        <div style={{ fontWeight:800, fontSize:'1rem', color:'#1e1b4b', marginBottom:12, textAlign:'center' }}>Primary Colours Chart</div>
        <div style={{ display:'flex', justifyContent:'space-around', marginBottom:12 }}>
          {[['#ef4444','RED'],['#fde047','YELLOW'],['#3b82f6','BLUE']].map(([color,label],i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:color, margin:'0 auto 6px', boxShadow:'0 3px 8px rgba(0,0,0,.2)' }}/>
              <div style={{ fontWeight:800, color, fontSize:'.9rem' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', fontWeight:700, color:'#6b7280', marginBottom:10 }}>Mix Primary Colours to make new ones!</div>
        <div style={{ display:'flex', justifyContent:'space-around' }}>
          {[['#ef4444','#fde047','#f97c2b','Red+Yellow=Orange'],['#fde047','#3b82f6','#10b981','Yellow+Blue=Green'],['#ef4444','#3b82f6','#7c3aed','Red+Blue=Purple']].map(([c1,c2,mix,label],i) => (
            <div key={i} style={{ textAlign:'center', flex:1 }}>
              <svg width="60" height="40" viewBox="0 0 60 40">
                <circle cx="18" cy="20" r="14" fill={c1} opacity=".85"/>
                <circle cx="42" cy="20" r="14" fill={c2} opacity=".85"/>
                <circle cx="30" cy="20" r="10" fill={mix} opacity=".9"/>
              </svg>
              <div style={{ fontSize:'.72rem', fontWeight:700, color:'#374151' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:'#f8faff', borderRadius:14, padding:14, boxShadow:'0 2px 8px rgba(0,0,0,.07)' }}>
        <div style={{ fontWeight:800, fontSize:'1rem', color:'#1e1b4b', marginBottom:12, textAlign:'center' }}>Playdough Steps Chart</div>
        <div style={{ display:'flex', gap:8 }}>
          {[['ROLL','Between palms in circles','#f97c2b'],['PINCH','Squeeze between fingers','#ec407a'],['SQUEEZE','Press with whole hand','#6366f1'],['SHAPE','Make a ball or snake!','#10b981']].map(([action,desc,color],i) => (
            <div key={i} style={{ flex:1, background:'#fff', borderRadius:10, padding:'8px 6px', textAlign:'center', boxShadow:'0 1px 3px rgba(0,0,0,.07)' }}>
              <div style={{ fontWeight:800, color, fontSize:'.85rem', marginBottom:2 }}>{action}</div>
              <div style={{ fontSize:'.72rem', color:'#6b7280' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â•â•â• COMPOSITE EXPORTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export function LanguageCharts() {
  return (
    <div style={{ marginBottom:'20px', padding:'16px', background:'var(--bg, #ffffff)', borderRadius:'14px', border:'1px solid var(--border, #e5e7eb)' }}>
      <AlphabetChart />
      <VowelsChart />
      <SimpleWordsChart />
      <LinesTracingChart />
      <ClassroomChart />
      <ClassroomLabels />
      <ShapesChart />
    </div>
  );
}

export function KiswahiliCharts() {
  return (
    <div style={{ marginBottom:'20px', padding:'16px', background:'var(--bg, #ffffff)', borderRadius:'14px', border:'1px solid var(--border, #e5e7eb)' }}>
      <IrabuChart />
      <KonsonantiChart />
      <NambariChart />
      <ShapesChart />
    </div>
  );
}


export function PP1KiswahiliCharts() {
  const salamu = [
    {sw:'Habari yako?', en:'How are you?', e:'ðŸ‘‹'},
    {sw:'Nzuri',        en:'Fine / Good',  e:'ðŸ˜Š'},
    {sw:'Asante',       en:'Thank you',    e:'ðŸ™'},
    {sw:'Tafadhali',    en:'Please',       e:'ðŸ¤²'},
    {sw:'Samahani',     en:'Sorry/Excuse', e:'ðŸ˜”'},
    {sw:'Karibu',       en:'Welcome',      e:'ðŸ '},
    {sw:'Kwaheri',      en:'Goodbye',      e:'ðŸ‘‹'},
    {sw:'Ndiyo',        en:'Yes',          e:'âœ…'},
    {sw:'Hapana',       en:'No',           e:'âŒ'},
  ]
  const familia = [
    {sw:'Mama',   en:'Mother', e:'ðŸ‘©'},
    {sw:'Baba',   en:'Father', e:'ðŸ‘¨'},
    {sw:'Kaka',   en:'Brother',e:'ðŸ‘¦'},
    {sw:'Dada',   en:'Sister', e:'ðŸ‘§'},
    {sw:'Bibi',   en:'Grandma',e:'ðŸ‘µ'},
    {sw:'Babu',   en:'Grandpa',e:'ðŸ‘´'},
    {sw:'Mtoto',  en:'Child',  e:'ðŸ§’'},
    {sw:'Familia',en:'Family', e:'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦'},
  ]
  const maneno = [
    {sw:'Maji',    en:'Water',  e:'ðŸ’§'},
    {sw:'Chakula', en:'Food',   e:'ðŸ½ï¸'},
    {sw:'Shule',   en:'School', e:'ðŸ«'},
    {sw:'Kitabu',  en:'Book',   e:'ðŸ“–'},
    {sw:'Kalamu',  en:'Pen',    e:'âœï¸'},
    {sw:'Mwalimu', en:'Teacher',e:'ðŸ‘©â€ðŸ«'},
    {sw:'Rafiki',  en:'Friend', e:'ðŸ¤'},
    {sw:'Nyumba',  en:'House',  e:'ðŸ '},
    {sw:'Mbwa',    en:'Dog',    e:'ðŸ¶'},
    {sw:'Paka',    en:'Cat',    e:'ðŸ±'},
    {sw:'Ndege',   en:'Bird',   e:'ðŸ¦'},
    {sw:'Samaki',  en:'Fish',   e:'ðŸŸ'},
  ]
  const rangi = [
    {sw:'Nyekundu', en:'Red',    c:'#ef4444'},
    {sw:'Njano',    en:'Yellow', c:'#eab308'},
    {sw:'Bluu',     en:'Blue',   c:'#3b82f6'},
    {sw:'Kijani',   en:'Green',  c:'#22c55e'},
    {sw:'Nyeupe',   en:'White',  c:'#e5e7eb'},
    {sw:'Nyeusi',   en:'Black',  c:'#1f2937'},
    {sw:'Machungwa',en:'Orange', c:'#f97316'},
    {sw:'Pinki',    en:'Pink',   c:'#ec4899'},
  ]
  const hesabu = [
    {n:1,sw:'Moja',  e:'1ï¸âƒ£'},
    {n:2,sw:'Mbili', e:'2ï¸âƒ£'},
    {n:3,sw:'Tatu',  e:'3ï¸âƒ£'},
    {n:4,sw:'Nne',   e:'4ï¸âƒ£'},
    {n:5,sw:'Tano',  e:'5ï¸âƒ£'},
    {n:6,sw:'Sita',  e:'6ï¸âƒ£'},
    {n:7,sw:'Saba',  e:'7ï¸âƒ£'},
    {n:8,sw:'Nane',  e:'8ï¸âƒ£'},
    {n:9,sw:'Tisa',  e:'9ï¸âƒ£'},
    {n:10,sw:'Kumi', e:'ðŸ”Ÿ'},
  ]
  const silabi = ['Ba','Be','Bi','Bo','Bu','Ma','Me','Mi','Mo','Mu','Na','Ne','Ni','No','Nu','Pa','Pe','Pi','Po','Pu','Sa','Se','Si','So','Su','Ta','Te','Ti','To','Tu']
  const Card = ({e,top,bot,sub}) => (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',background:'var(--surface,#1e1e2e)',borderRadius:'14px',padding:'12px 8px',border:'1px solid var(--border,#2d2d3d)',gap:'4px',textAlign:'center'}}>
      <span style={{fontSize:'2.2rem',lineHeight:1}}>{e}</span>
      <span style={{fontSize:'1rem',fontWeight:800,color:'var(--text,#fff)',marginTop:'4px'}}>{top}</span>
      {bot && <span style={{fontSize:'.72rem',fontWeight:600,color:'#6366f1'}}>{bot}</span>}
      {sub && <span style={{fontSize:'.65rem',color:'var(--sub,#9ca3af)'}}>{sub}</span>}
    </div>
  )
  const SH = {fontWeight:800,color:'var(--text)',margin:'24px 0 12px',fontSize:'1rem',display:'flex',alignItems:'center',gap:'8px'}
  return (
    <div style={{fontSize:'.9rem',lineHeight:1.7}}>

      <p style={SH}>ðŸ‘‹ Salamu (Greetings)</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'8px'}}>
        {salamu.map(s => <Card key={s.sw} e={s.e} top={s.sw} bot={s.en} />)}
      </div>

      <p style={SH}>ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ Familia (Family)</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'8px'}}>
        {familia.map(f => <Card key={f.sw} e={f.e} top={f.sw} bot={f.en} />)}
      </div>

      <p style={SH}>ðŸ“š Maneno ya Kila Siku (Daily Words)</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'8px'}}>
        {maneno.map(m => <Card key={m.sw} e={m.e} top={m.sw} bot={m.en} />)}
      </div>

      <p style={SH}>ðŸŽ¨ Rangi (Colours)</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'8px'}}>
        {rangi.map(r => (
          <div key={r.sw} style={{display:'flex',flexDirection:'column',alignItems:'center',borderRadius:'14px',padding:'12px 8px',border:'2px solid '+r.c,gap:'4px',textAlign:'center',background:r.c+'22'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:r.c,border:'3px solid '+r.c+'88',boxShadow:'0 2px 8px '+r.c+'66'}}/>
            <span style={{fontSize:'.85rem',fontWeight:800,color:'var(--text,#fff)'}}>{r.sw}</span>
            <span style={{fontSize:'.68rem',color:'var(--sub,#9ca3af)'}}>{r.en}</span>
          </div>
        ))}
      </div>

      <p style={SH}>ðŸ”¢ Hesabu (Numbers 1â€“10)</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px',marginBottom:'8px'}}>
        {hesabu.map(h => (
          <div key={h.n} style={{display:'flex',flexDirection:'column',alignItems:'center',background:'var(--surface,#1e1e2e)',borderRadius:'14px',padding:'12px 6px',border:'2px solid #6366f1',gap:'2px',textAlign:'center'}}>
            <span style={{fontSize:'2rem',lineHeight:1}}>{h.e}</span>
            <span style={{fontSize:'1.5rem',fontWeight:900,color:'#6366f1'}}>{h.n}</span>
            <span style={{fontSize:'.8rem',fontWeight:700,color:'var(--text,#fff)'}}>{h.sw}</span>
          </div>
        ))}
      </div>

      <p style={SH}>ðŸ”¤ Silabi za Msingi</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px',marginBottom:'8px'}}>
        {silabi.map((s,i) => (
          <div key={s} style={{display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'10px',padding:'10px 4px',background:'hsl('+(i*12)+',65%,55%)22',border:'2px solid hsl('+(i*12)+',65%,55%)',fontWeight:900,fontSize:'1.2rem',color:'hsl('+(i*12)+',65%,65%)'}}>
            {s}
          </div>
        ))}
      </div>

    </div>
  )
}
export function PP1KeyCharts() {
  return (
    <div style={{ marginBottom:'8px', padding:'16px', background:'var(--bg, #ffffff)', borderRadius:'14px', border:'1px solid var(--border, #e5e7eb)' }}>
      <EnvironmentalSoundsChart />
      <GreetingsChart />
      <BodyPartsImgChart />
      <FamilyChart />
      <LinesTracingChart />
      <StorySequenceChart />
      <ClassroomLabels />
      <VowelsChart />
      <AlphabetFriezeChart />
    </div>
  );
}

// â•â•â• DEFAULT EXPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function CurriculumCharts() {
  return (
    <div style={{ padding:'20px', maxWidth:'900px', margin:'0 auto' }}>
      <AlphabetChart />
      <VowelsChart />
      <NumberChart />
      <NambariChart />
      <SimpleWordsChart />
      <ColorsChart />
      <ShapesChart />
      <DaysMonthsChart />
      <SentencesChart />
      <BodyPartsEmojiChart />
      <BodyPartsImgChart />
      <FamilyChart />
      <MathChart />
      <SightWordsChart />
      <LinesTracingChart />
      <ClassroomChart />
      <ClassroomLabels />
      <VowelConsonantChart />
      <IrabuChart />
      <KonsonantiChart />
      <StorySequenceChart />
      <AlphabetFriezeChart />
      <EnvironmentalSoundsChart />
      <GreetingsChart />
    </div>
  );
}
export function PP1CapitalLetters() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const rows = [];
  for (let i = 0; i < letters.length; i += 5) rows.push(letters.slice(i, i + 5));
  return (
    <div style={{ background:'#FFF8E1', borderRadius:16, padding:'24px 20px' }}>
      <p style={{ fontWeight:700, fontSize:15, color:'#b45309', marginBottom:20, letterSpacing:1 }}>CAPITAL LETTERS A - Z</p>
      <div style={{ textAlign:'center' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display:'flex', gap:20, justifyContent:'center', marginBottom:24 }}>
            {row.map(l => (
              <span key={l} style={{ fontSize:'2cm', fontWeight:900, lineHeight:1, color:'#1e3a5f', minWidth:'2cm', display:'inline-block', textAlign:'center' }}>{l}</span>
            ))}
          </div>
        ))}
      </div>
      <p style={{ marginTop:16, fontStyle:'italic', color:'#6b7280', fontSize:13 }}>Say each letter out loud!</p>
      <p style={{ letterSpacing:6, fontWeight:600, fontSize:15, marginTop:8, color:'#374151' }}>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
    </div>
  );
}

export function PP1SmallLetters() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const rows = [];
  for (let i = 0; i < letters.length; i += 5) rows.push(letters.slice(i, i + 5));
  const pairs = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'.match(/.{2}/g);
  const pairRows = [];
  for (let i = 0; i < pairs.length; i += 6) pairRows.push(pairs.slice(i, i + 6));
  return (
    <div style={{ background:'#E8F5E9', borderRadius:16, padding:'24px 20px' }}>
      <p style={{ fontWeight:700, fontSize:15, color:'#166534', marginBottom:20, letterSpacing:1 }}>SMALL LETTERS a - z</p>
      <div style={{ textAlign:'center' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display:'flex', gap:20, justifyContent:'center', marginBottom:24 }}>
            {row.map(l => (
              <span key={l} style={{ fontSize:'2cm', fontWeight:700, lineHeight:1, color:'#14532d', minWidth:'2cm', display:'inline-block', textAlign:'center' }}>{l}</span>
            ))}
          </div>
        ))}
      </div>
      <p style={{ marginTop:20, fontWeight:600, color:'#166534', fontSize:13 }}>Every CAPITAL letter has a small letter friend!</p>
      <div style={{ marginTop:12 }}>
        {pairRows.map((row, i) => (
          <div key={i} style={{ display:'flex', gap:16, marginBottom:10, flexWrap:'wrap' }}>
            {row.map(p => <span key={p} style={{ fontSize:18, fontWeight:700, color:'#374151', minWidth:36 }}>{p}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PP1SimpleWords() {
  const words = ['cat','hat','bat','rat','cap','map','egg','hen','box','dog','log','fog','sun','bun','run','pig','fig','six','bed','red','web','pot','dot','net','tub','bug','jug','cup','mat','sit'];
  const [answers, setAnswers] = React.useState({});
  const [results, setResults] = React.useState({});
  const getMasked = (word) => ({ first: word[0].toUpperCase(), blank: word[1], last: word.slice(2).toUpperCase() });
  const check = (word) => {
    const { blank } = getMasked(word);
    setResults(p => ({ ...p, [word]: (answers[word]||'').toLowerCase() === blank }));
  };
  const col1 = words.slice(0, 15);
  const col2 = words.slice(15);
  const WordRow = ({ word }) => {
    const { first, blank, last } = getMasked(word);
    const ok = results[word] === true;
    const fail = results[word] === false;
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
        <span style={{ fontSize:22, fontWeight:800, fontFamily:'monospace', color:'#1e3a5f', minWidth:90, display:'flex', alignItems:'center', gap:2 }}>
          {first}
          <input maxLength={1} value={answers[word]||''} onChange={e=>{setAnswers(p=>({...p,[word]:e.target.value}));setResults(p=>({...p,[word]:undefined}));}}
            style={{ width:34, height:34, textAlign:'center', fontSize:20, fontWeight:800, border: ok?'2px solid #16a34a':fail?'2px solid #dc2626':'2px solid #9ca3af', borderRadius:8, background:ok?'#dcfce7':fail?'#fee2e2':'#fff', outline:'none', margin:'0 3px', fontFamily:'monospace' }} />
          {last}
        </span>
        <button onClick={()=>check(word)} style={{ padding:'5px 14px', borderRadius:8, border:'none', background:'#6366f1', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13 }}>✓</button>
        {ok && <span style={{ color:'#16a34a', fontWeight:800, fontSize:16 }}>✓ Great!</span>}
        {fail && <span style={{ color:'#dc2626', fontWeight:700, fontSize:14 }}>Try "{blank}"</span>}
      </div>
    );
  };
  return (
    <div style={{ background:'#E3F2FD', borderRadius:16, padding:'24px 20px' }}>
      <p style={{ fontWeight:700, fontSize:15, color:'#1e40af', marginBottom:20 }}>30 SIMPLE WORDS — Fill in the missing letter!</p>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:160 }}>{col1.map(w=><WordRow key={w} word={w}/>)}</div>
        <div style={{ flex:1, minWidth:160 }}>{col2.map(w=><WordRow key={w} word={w}/>)}</div>
      </div>
      <div style={{ marginTop:20, padding:'12px 16px', background:'rgba(99,102,241,0.08)', borderRadius:10 }}>
        <p style={{ fontSize:13, color:'#374151', margin:0 }}>Say each sound slowly then say the whole word!</p>
      </div>
    </div>
  );
}
export function PP1MathOverviewCard() {
  const numWord = (n) => {
    const ones = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    if (n === 100) return 'one hundred';
    if (n < 20) return ones[n];
    return tens[Math.floor(n/10)] + (n % 10 ? '-' + ones[n % 10] : '');
  };
  const examples = [
    [1,1],[2,2],[3,1],[4,2],[5,3],[6,1],[7,2],[8,1],[9,1],[10,0],
    [2,3],[3,3],[4,3],[5,4],[6,3],[7,3],[5,5],[6,4],[4,4],[3,4],
    [2,6],[1,8],[3,6],[4,5],[5,2],[6,2],[7,0],[8,0],[9,0],[4,6]
  ];
  const homework = [
    [2,3],[5,1],[3,3],[4,4],[6,2],[7,1],[5,3],[8,2],[9,0],[4,3],
    [3,5],[6,3],[2,7],[5,4],[1,9],[7,2],[4,5],[6,4],[3,6],[5,5]
  ];
  const [hw, setHw] = React.useState({});
  const [checked, setChecked] = React.useState({});
  const checkAll = () => {
    const res = {};
    homework.forEach(([a,b],i) => { res[i] = parseInt(hw[i]) === a+b; });
    setChecked(res);
  };
  const resetAll = () => { setHw({}); setChecked({}); };
  const rowColors = ['#fff3e0','#fce4ec','#e8f5e9','#e3f2fd','#f3e5f5','#e0f7fa','#fff8e1','#fbe9e7','#f9fbe7','#ede7f6'];
  return (
    <div>
      <p style={{ fontWeight:800, fontSize:16, color:'#1e3a5f', marginBottom:12, letterSpacing:.5 }}>NUMBER CHART 1 – 100</p>
      <div style={{ overflowX:'auto', marginBottom:32 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:4, minWidth:520 }}>
          {Array.from({length:100},(_,i)=>i+1).map(n => (
            <div key={n} style={{ background:rowColors[Math.floor((n-1)/10)], border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 4px 10px', textAlign:'center', minHeight:'90px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:'1.5cm', fontWeight:900, lineHeight:1, color:'#1e3a5f' }}>{n}</div>
              <div style={{ fontSize:'11px', fontWeight:600, color:'#374151', marginTop:3, lineHeight:1.2, wordBreak:'break-word' }}>{numWord(n)}</div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontWeight:800, fontSize:16, color:'#166534', marginBottom:12, letterSpacing:.5 }}>SIMPLE CALCULATIONS — 30 EXAMPLES</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:32 }}>
        {examples.map(([a,b],i) => (
          <div key={i} style={{ background:'#e8f5e9', borderRadius:8, padding:'8px 10px', textAlign:'center', fontWeight:700, fontSize:16, color:'#14532d' }}>
            {a} + {b} = <span style={{ color:'#6366f1' }}>{a+b}</span>
          </div>
        ))}
      </div>
      <p style={{ fontWeight:800, fontSize:16, color:'#1e40af', marginBottom:4, letterSpacing:.5 }}>HOMEWORK — Fill in the answer!</p>
      <p style={{ fontSize:12, color:'#6b7280', marginBottom:14 }}>Write your answer in the box, then tap Check All.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12, marginBottom:16 }}>
        {homework.map(([a,b],i) => {
          const ok = checked[i] === true;
          const fail = checked[i] === false;
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:ok?'#dcfce7':fail?'#fee2e2':'#f8fafc', borderRadius:10, padding:'10px 12px', border:`1px solid ${ok?'#16a34a':fail?'#dc2626':'#e5e7eb'}` }}>
              <span style={{ fontWeight:700, fontSize:18, minWidth:90 }}>{a} + {b} =</span>
              <input type="number" min="0" max="20" value={hw[i]||''} onChange={e=>setHw(p=>({...p,[i]:e.target.value}))}
                style={{ width:52, height:36, textAlign:'center', fontSize:18, fontWeight:800, border:'2px solid #9ca3af', borderRadius:8, outline:'none' }} />
              {ok && <span style={{ color:'#16a34a', fontWeight:800, fontSize:18 }}>✓</span>}
              {fail && <span style={{ color:'#dc2626', fontWeight:700, fontSize:13 }}>= {a+b}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={checkAll} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontWeight:700, fontSize:15, cursor:'pointer' }}>Check All Answers</button>
        <button onClick={resetAll} style={{ background:'transparent', color:'#6b7280', border:'1px solid #e5e7eb', borderRadius:10, padding:'12px 20px', fontWeight:600, fontSize:14, cursor:'pointer' }}>Reset</button>
      </div>
    </div>
  );
}

export function AssessmentChecklist({ content }) {
  const questions = (content || '')
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean);
  const [answers, setAnswers] = React.useState({});
  const [confirmed, setConfirmed] = React.useState({});
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
      {questions.map((q, i) => {
        const done = confirmed[i];
        return (
          <div key={i} style={{ background: done ? '#f0fdf4' : '#f8fafc', border:`1px solid ${done?'#16a34a':'#e5e7eb'}`, borderRadius:10, padding:'12px 14px' }}>
            <p style={{ margin:0, marginBottom:8, fontWeight:600, fontSize:14, color:'#1e3a5f' }}>{q}</p>
            <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
              <input
                type="text"
                placeholder="Type your answer..."
                value={answers[i] || ''}
                onChange={e => { setAnswers(p=>({...p,[i]:e.target.value})); setConfirmed(p=>({...p,[i]:false})); }}
                style={{ flex:1, minWidth:140, padding:'8px 10px', borderRadius:8, border:'1.5px solid #cbd5e1', fontSize:14, outline:'none' }}
              />
              <button
                onClick={() => answers[i] && setConfirmed(p=>({...p,[i]:true}))}
                style={{ padding:'8px 16px', borderRadius:8, border:'none', background: done?'#16a34a':'#6366f1', color:'#fff', fontWeight:700, cursor: answers[i]?'pointer':'not-allowed', opacity: answers[i]?1:0.6, fontSize:13 }}
              >
                {done ? '✓ Confirmed' : 'Confirm'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function Grade1LettersAndWords() {
  const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const small = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const capRows = []; for (let i=0;i<caps.length;i+=6) capRows.push(caps.slice(i,i+6));
  const smallRows = []; for (let i=0;i<small.length;i+=6) smallRows.push(small.slice(i,i+6));
  const words = ['bat','mat','fan','pan','van','bed','hen','net','pen','ten','bin','pin','tin','sit','pig','pot','hot','cot','dog','log','sun','cup','mug','bug','rug'];
  const [answers, setAnswers] = React.useState({});
  const [results, setResults] = React.useState({});
  const getMasked = (word) => ({ first: word[0].toUpperCase(), blank: word[1], last: word.slice(2).toUpperCase() });
  const check = (word) => {
    const { blank } = getMasked(word);
    setResults(p => ({ ...p, [word]: (answers[word]||'').toLowerCase() === blank }));
  };
  const col1 = words.slice(0,13); const col2 = words.slice(13);
  const WordRow = ({ word }) => {
    const { first, blank, last } = getMasked(word);
    const ok = results[word] === true; const fail = results[word] === false;
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <span style={{ fontSize:22, fontWeight:800, fontFamily:'monospace', color:'#1e3a5f', minWidth:90, display:'flex', alignItems:'center', gap:2 }}>
          {first}
          <input maxLength={1} value={answers[word]||''} onChange={e=>{setAnswers(p=>({...p,[word]:e.target.value}));setResults(p=>({...p,[word]:undefined}));}}
            style={{ width:34, height:34, textAlign:'center', fontSize:20, fontWeight:800, border: ok?'2px solid #16a34a':fail?'2px solid #dc2626':'2px solid #9ca3af', borderRadius:8, background:ok?'#dcfce7':fail?'#fee2e2':'#fff', outline:'none', margin:'0 3px', fontFamily:'monospace' }} />
          {last}
        </span>
        <button onClick={()=>check(word)} style={{ padding:'5px 14px', borderRadius:8, border:'none', background:'#6366f1', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13 }}>✓</button>
        {ok && <span style={{ color:'#16a34a', fontWeight:800, fontSize:16 }}>✓ Confirmed!</span>}
        {fail && <span style={{ color:'#dc2626', fontWeight:700, fontSize:14 }}>Try "{blank}"</span>}
      </div>
    );
  };
  return (
    <div>
      <p style={{ fontWeight:800, fontSize:15, color:'#b45309', marginBottom:14 }}>CAPITAL LETTERS A - Z</p>
      <div style={{ background:'#FFF8E1', borderRadius:14, padding:'18px 14px', marginBottom:22 }}>
        {capRows.map((row,i)=>(
          <div key={i} style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:18, flexWrap:'wrap' }}>
            {row.map(l=> <span key={l} style={{ fontSize:'1.5cm', fontWeight:900, lineHeight:1, color:'#1e3a5f', minWidth:'1.5cm', textAlign:'center' }}>{l}</span>)}
          </div>
        ))}
      </div>
      <p style={{ fontWeight:800, fontSize:15, color:'#166534', marginBottom:14 }}>SMALL LETTERS a - z</p>
      <div style={{ background:'#E8F5E9', borderRadius:14, padding:'18px 14px', marginBottom:26 }}>
        {smallRows.map((row,i)=>(
          <div key={i} style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:18, flexWrap:'wrap' }}>
            {row.map(l=> <span key={l} style={{ fontSize:'1.5cm', fontWeight:700, lineHeight:1, color:'#14532d', minWidth:'1.5cm', textAlign:'center' }}>{l}</span>)}
          </div>
        ))}
      </div>
      <p style={{ fontWeight:800, fontSize:15, color:'#1e40af', marginBottom:4 }}>25 SIMPLE WORDS — Fill in the missing letter!</p>
      <p style={{ fontSize:12, color:'#6b7280', marginBottom:16 }}>Type the missing letter, then tap ✓ to confirm.</p>
      <div style={{ background:'#E3F2FD', borderRadius:14, padding:'18px 14px', display:'flex', gap:32, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:160 }}>{col1.map(w=><WordRow key={w} word={w}/>)}</div>
        <div style={{ flex:1, minWidth:160 }}>{col2.map(w=><WordRow key={w} word={w}/>)}</div>
      </div>
    </div>
  );
}