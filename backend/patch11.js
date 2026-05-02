const fs   = require('fs');
const path = require('path');

// ── Find StudyTime.jsx ───────────────────────────────────────────────────────
function findFile(dir, target, depth = 0) {
  if (depth > 6) return null;
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return null; }
  for (const e of entries) {
    if (['node_modules','.git','dist','build'].includes(e)) continue;
    const full = path.join(dir, e);
    try {
      if (fs.statSync(full).isDirectory()) { const r = findFile(full, target, depth+1); if (r) return r; }
      else if (e === target) return full;
    } catch {}
  }
  return null;
}

const filePath = findFile(process.cwd(), 'StudyTime.jsx');
if (!filePath) { console.error('ERROR: StudyTime.jsx not found'); process.exit(1); }
console.log('Found:', filePath);

let src = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(filePath + '.bak10', src);
console.log('Backup saved:', filePath + '.bak10');

// ── Read parts file ──────────────────────────────────────────────────────────
const partsPath = path.join(__dirname, 'new_parts_p10.jsx');
if (!fs.existsSync(partsPath)) {
  console.error('ERROR: new_parts_p10.jsx not found. Place it next to patch10.js in:', __dirname);
  process.exit(1);
}
const parts = fs.readFileSync(partsPath, 'utf8');

function extract(marker) {
  const startTag = '// ===' + marker + '_START===\n';
  const endTag   = '\n// ===' + marker + '_END===';
  const si = parts.indexOf(startTag);
  if (si === -1) { console.error('  Marker not found: ' + marker + '_START'); return null; }
  const contentStart = si + startTag.length;
  const ei = parts.indexOf(endTag, contentStart);
  if (ei === -1) { console.error('  End marker not found: ' + marker + '_END'); return null; }
  return parts.slice(contentStart, ei);
}

let changes = 0;

// Replaces from startStr (inclusive) to endStr (exclusive)
function splice(label, startStr, endStr, newContent) {
  if (!newContent) { console.log('SKIP [' + label + '] - no replacement content'); return; }
  const si = src.indexOf(startStr);
  const ei = src.indexOf(endStr, si);
  if (si === -1) { console.log('SKIP [' + label + '] - start not found: ' + startStr.slice(0,40).replace(/\n/g,'\\n')); return; }
  if (ei === -1) { console.log('SKIP [' + label + '] - end not found: '   + endStr.slice(0,40).replace(/\n/g,'\\n')); return; }
  src = src.slice(0, si) + newContent + src.slice(ei);
  changes++;
  console.log('OK   [' + label + ']');
}

// Simple find-and-replace (first occurrence only)
function swap(label, oldStr, newStr) {
  if (!src.includes(oldStr)) { console.log('SKIP [' + label + '] - pattern not found'); return; }
  src = src.replace(oldStr, newStr);
  changes++;
  console.log('OK   [' + label + ']');
}

// ── 1. SyllableChart interactive cards — BIGGER ──────────────────────────────
swap('SyllableChart card padding',
  "style={{padding:'16px 20px',borderRadius:'14px',textAlign:'center',cursor:'pointer',minWidth:'80px',",
  "style={{padding:'24px 30px',borderRadius:'14px',textAlign:'center',cursor:'pointer',minWidth:'100px',"
);
swap('SyllableChart card font',
  "fontSize:'3.2rem',fontWeight:900,color:isSel?col:'#f9fafb',letterSpacing:'-1px'",
  "fontSize:'4.4rem',fontWeight:900,color:isSel?col:'#f9fafb',letterSpacing:'-1px'"
);

// ── 2. VowelsConsonants syllable table cells — BIGGER ────────────────────────
swap('VC syllable cell padding',
  "padding:'10px 8px', borderRadius:'10px',",
  "padding:'14px 12px', borderRadius:'10px',"
);
swap('VC syllable cell font',
  "fontSize:'1.5rem',color: isSel ? '#fff' : vCols[v]",
  "fontSize:'2.3rem',color: isSel ? '#fff' : vCols[v]"
);
swap('VC syllable header font',
  "fontSize:'1.5rem',\n                      textAlign:'center',",
  "fontSize:'2rem',\n                      textAlign:'center',"
);

// ── 3. SimpleWordsSection — bigger emoji, bigger words ───────────────────────
swap('SimpleWords card padding',
  "style={{...card({cursor:'pointer',textAlign:'center',padding:'12px 8px',",
  "style={{...card({cursor:'pointer',textAlign:'center',padding:'18px 10px',"
);
swap('SimpleWords emoji size',
  "style={{fontSize:'2.6rem',marginBottom:'6px'}}>{w.e}</div>",
  "style={{fontSize:'3.8rem',marginBottom:'8px'}}>{w.e}</div>"
);
swap('SimpleWords word size',
  "style={{fontWeight:900,color:'#93c5fd',fontSize:'1.3rem',fontFamily:'monospace'}}>{w.w}</div>",
  "style={{fontWeight:900,color:'#93c5fd',fontSize:'2rem',fontFamily:'monospace'}}>{w.w}</div>"
);

// ── 4. MusicMovementSection — no boxes, plain layout ─────────────────────────
splice('MusicMovementSection',
  'function MusicMovementSection(){',
  '\nfunction ArtSection({topic}){',
  extract('MUSIC')
);

// ── 5. StudyNoteCard — plain bullets, no boxes ───────────────────────────────
splice('StudyNoteCard',
  'function StudyNoteCard({note}){',
  '\n\nfunction QuizMode(',
  extract('STUDYNOTE')
);

// ── 6. God's Creation — detailed day-by-day ──────────────────────────────────
splice("God's Creation block",
  "  if(topic.includes('Creation')){",
  "\n\n  if(topic.includes('Bible')){",
  extract('CREATION')
);

// ── 7. CURRICULUM_NOTES.creation — 5× expanded ───────────────────────────────
splice('CURRICULUM_NOTES creation',
  "  creation:{",
  "\n\n  bible:{",
  extract('CREATION_NOTES')
);

// ── 8. SIMPLE_WORDS — 50 words per level ─────────────────────────────────────
splice('SIMPLE_WORDS data',
  'const SIMPLE_WORDS = {',
  '\n\nconst HEALTH_SAFETY = [',
  extract('SIMPLE_WORDS')
);

// ── Save ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, src, 'utf8');
console.log('\nDone! ' + changes + ' patch(es) applied to', filePath);