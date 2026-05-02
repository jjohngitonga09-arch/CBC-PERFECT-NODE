const fs   = require('fs');
const path = require('path');

// ── 1. Find StudyTime.jsx ────────────────────────────────────────────────────
function findFile(dir, target, depth = 0) {
  if (depth > 6) return null;
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return null; }
  for (const e of entries) {
    if (['node_modules', '.git', 'dist', 'build'].includes(e)) continue;
    const full = path.join(dir, e);
    try {
      if (fs.statSync(full).isDirectory()) {
        const r = findFile(full, target, depth + 1);
        if (r) return r;
      } else if (e === target) return full;
    } catch {}
  }
  return null;
}

const filePath = findFile(process.cwd(), 'StudyTime.jsx');
if (!filePath) { console.error('ERROR: StudyTime.jsx not found'); process.exit(1); }
console.log('Found:', filePath);

let src = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(filePath + '.bak9', src);
console.log('Backup saved:', filePath + '.bak9');

let changes = 0;

// ── 2. Fix FillInBlank blank display ─────────────────────────────────────────
const BLANK_INNER = '          {blankDisplay}';
if (src.includes(BLANK_INNER)) {
  src = src.replace(
    "        <div style={{fontSize:'2.8rem',fontWeight:900,color:'#f9fafb',letterSpacing:'8px',marginBottom:'8px',fontFamily:'monospace'}}>",
    "        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2px',marginBottom:'12px',flexWrap:'wrap'}}>"
  );
  src = src.replace(BLANK_INNER, '          {renderBlankWord(w.b)}');
  changes++;
  console.log('OK   [FillInBlank display]');
} else {
  console.log('SKIP [FillInBlank] - already patched or pattern not found');
}

// ── 3. Replace VowelsConsonants ───────────────────────────────────────────────
// We splice from "function VowelsConsonants(){" up to "function SyllableChart(){"
// using function-name boundaries which are unique and encoding-safe.
const VC_START     = '\nfunction VowelsConsonants(){';
const NEXT_FUNC    = '\nfunction SyllableChart(){';

const si = src.indexOf(VC_START);
const ei = src.indexOf(NEXT_FUNC);

if (si !== -1 && ei !== -1) {
  const newVCPath = path.join(__dirname, 'new_vc_component.jsx');
  if (!fs.existsSync(newVCPath)) {
    console.error('ERROR: new_vc_component.jsx not found.');
    console.error('Place new_vc_component.jsx in the same folder as patch9.js:', __dirname);
    process.exit(1);
  }
  const newVC = fs.readFileSync(newVCPath, 'utf8').trim();
  // Keep the newline before VC_START, insert new component, then continue from SyllableChart
  src = src.slice(0, si + 1) + newVC + '\n\n\n' + src.slice(ei + 1);
  changes++;
  console.log('OK   [VowelsConsonants replaced]');
} else {
  if (si === -1) console.log('WARN [VowelsConsonants] - function start not found');
  if (ei === -1) console.log('WARN [VowelsConsonants] - SyllableChart boundary not found');
}

// ── 4. Save ──────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, src, 'utf8');
console.log('\nDone! ' + changes + ' patch(es) applied to', filePath);
