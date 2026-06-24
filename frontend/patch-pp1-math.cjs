// ============================================================
//  patch-pp1-math.js
//  Adds 3 new cards to PP1 → Mathematics Activities:
//    + Core Strands   (overview of the 3 strands)
//    + Classification (sorting, patterns, matching, odd one out)
//    + Number Work    (chart, words, counting, tracing, addition)
//
//  HOW TO RUN (from your frontend folder in PowerShell):
//    node patch-pp1-math.js
//
//  SAFE: only inserts — never rewrites or deletes existing cards.
// ============================================================

const fs   = require('fs');
const path = require('path');

const FILE = path.join('src', 'pages', 'student', 'curriculumData.js');

if (!fs.existsSync(FILE)) {
  console.error('\n❌  File not found: ' + FILE);
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');

// Detect line endings so we match whatever the file already uses
const EOL = src.includes('\r\n') ? '\r\n' : '\n';

// ── anchor: unique string = end of PP1 Overview card + start of Number Sense ──
const ANCHOR = "feel.`}, { title:'Number Sense'";

if (!src.includes(ANCHOR)) {
  console.error('\n❌  Anchor not found.  File was NOT changed.');
  console.error('    Expected to find: ' + ANCHOR);
  process.exit(1);
}

// ── guard: do not patch twice ──
if (src.includes("{ title:'Core Strands'")) {
  console.log('\n⚠️   Patch already applied (Core Strands card found).  Nothing changed.\n');
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────
//  CARD 1 — CORE STRANDS  (structural overview)
// ─────────────────────────────────────────────────────────────
const CORE_STRANDS =
  "{ title:'Core Strands', content: `" +
  "PP1 Mathematics Activities is organised into 3 Core Learning Strands." + EOL +
  EOL +
  "★  STRAND 1 — CLASSIFICATION" + EOL +
  "   We sort, group, pattern, and match objects." + EOL +
  "   Sort objects by colour, size, or shape." + EOL +
  "   Find and copy repeating patterns." + EOL +
  "   Match and pair things that belong together." + EOL +
  "   Spot the odd one out in a group." + EOL +
  EOL +
  "★  STRAND 2 — NUMBER WORK" + EOL +
  "   We learn to count, read, write, and use numbers." + EOL +
  "   Count objects 1 to 10 one by one." + EOL +
  "   Recognise and write digits 1 to 9." + EOL +
  "   Learn number words: one, two, three …" + EOL +
  "   Put together (add) objects to find the total." + EOL +
  "   Take away (subtract) objects to find what is left." + EOL +
  EOL +
  "★  STRAND 3 — MEASUREMENT" + EOL +
  "   We compare sizes, weights, and amounts." + EOL +
  "   Compare sizes:  big / small  ·  tall / short  ·  long / short." + EOL +
  "   Compare weight: heavy / light using a balance scale." + EOL +
  "   Compare capacity: empty / full using cups and sand." + EOL +
  "   Learn about coins and notes through play." +
  "`}";

// ─────────────────────────────────────────────────────────────
//  CARD 2 — CLASSIFICATION
//  (Content extracted from exam papers — learning format)
// ─────────────────────────────────────────────────────────────
const CLASSIFICATION =
  "{ title:'Classification', content: `" +
  "★ STRAND 1 — CLASSIFICATION" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " A · SORTING & GROUPING" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "We put things that are the SAME together." + EOL +
  "Choose ONE rule, then sort!" + EOL +
  EOL +
  " Sort by COLOUR:" + EOL +
  "   All red things    go in the red group." + EOL +
  "   All blue things   go in the blue group." + EOL +
  "   All yellow things go in the yellow group." + EOL +
  EOL +
  " Sort by SIZE:" + EOL +
  "   Big things   → big pile." + EOL +
  "   Small things → small pile." + EOL +
  EOL +
  " Sort by SHAPE:" + EOL +
  "   All circles   ○  go together." + EOL +
  "   All squares   □  go together." + EOL +
  "   All triangles △  go together." + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " B · PATTERNING" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "A pattern REPEATS again and again!" + EOL +
  EOL +
  " Colour pattern:" + EOL +
  "   Red  Blue  Red  Blue  Red  Blue  ..." + EOL +
  EOL +
  " Shape pattern:" + EOL +
  "   Circle  Square  Circle  Square  Circle  ..." + EOL +
  EOL +
  " Object pattern:" + EOL +
  "   Spoon  Fork  Spoon  Fork  Spoon  Fork  ..." + EOL +
  EOL +
  " How to continue a pattern — 3 steps:" + EOL +
  "   Step 1  Say the pattern out loud to hear it repeat." + EOL +
  "   Step 2  Find where the pattern stopped." + EOL +
  "   Step 3  Say what comes next, then place it!" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " C · MATCHING & PAIRING" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "Find the two things that BELONG together." + EOL +
  EOL +
  " Match same objects:" + EOL +
  "   Left shoe   ↔  Right shoe" + EOL +
  "   One sock    ↔  Other sock" + EOL +
  "   Cup         ↔  Saucer" + EOL +
  EOL +
  " Match a number to its group of objects:" + EOL +
  "   1  ↔  ○" + EOL +
  "   2  ↔  ○ ○" + EOL +
  "   3  ↔  ○ ○ ○" + EOL +
  "   4  ↔  ○ ○ ○ ○" + EOL +
  "   5  ↔  ○ ○ ○ ○ ○" + EOL +
  EOL +
  " Match objects you play with:" + EOL +
  "   Ball  ↔  Ball    Doll ↔  Doll    Toy car ↔ Toy car" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " D · ODD ONE OUT" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "Find the one that does NOT belong." + EOL +
  EOL +
  " By shape:" + EOL +
  "   △  △  □  △   →  the □ is different." + EOL +
  EOL +
  " By colour:" + EOL +
  "   Red heart  Red heart  Blue heart  Red heart" + EOL +
  "   → the Blue heart is the odd one out." + EOL +
  EOL +
  " By size:" + EOL +
  "   Big cup  Big cup  Small cup  Big cup" + EOL +
  "   → the Small cup is different." + EOL +
  EOL +
  " How to find it — 3 steps:" + EOL +
  "   Step 1  Look at all the items." + EOL +
  "   Step 2  Find the rule (same colour? same shape? same size?)." + EOL +
  "   Step 3  The one that breaks the rule = ODD ONE OUT." +
  "`}";

// ─────────────────────────────────────────────────────────────
//  CARD 3 — NUMBER WORK
//  (Content extracted from exam papers — learning format)
// ─────────────────────────────────────────────────────────────
const NUMBER_WORK =
  "{ title:'Number Work', content: `" +
  "★ STRAND 2 — NUMBER WORK" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " A · NUMBER CHART 1 – 10" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "  1   2   3   4   5" + EOL +
  "  6   7   8   9   10" + EOL +
  EOL +
  " Point to each number and say it out loud!" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " B · NUMBER WORDS" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "  0 = zero      1 = one       2 = two" + EOL +
  "  3 = three     4 = four      5 = five" + EOL +
  "  6 = six       7 = seven     8 = eight" + EOL +
  "  9 = nine     10 = ten" + EOL +
  EOL +
  " Read them aloud, then trace them!" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " C · COUNTING OBJECTS (one by one)" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " Touch each object and say its number." + EOL +
  " Do NOT skip.  Do NOT count the same one twice." + EOL +
  " The LAST number you say = the total." + EOL +
  EOL +
  "   ○                =  1   (one)" + EOL +
  "   ○ ○              =  2   (two)" + EOL +
  "   ○ ○ ○            =  3   (three)" + EOL +
  "   ○ ○ ○ ○          =  4   (four)" + EOL +
  "   ○ ○ ○ ○ ○        =  5   (five)" + EOL +
  "   ○ ○ ○ ○ ○ ○      =  6   (six)" + EOL +
  "   ○ ○ ○ ○ ○ ○ ○    =  7   (seven)" + EOL +
  "   ○ ○ ○ ○ ○ ○ ○ ○  =  8   (eight)" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " D · TRACING & WRITING NUMBERS" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " Trace with your finger first, then use a pencil." + EOL +
  EOL +
  "   1  →  one straight line going down  ↓" + EOL +
  "   2  →  curve to the right, then a flat line →" + EOL +
  "   3  →  two bumps both facing to the right" + EOL +
  "   4  →  line down  +  line across  +  line down" + EOL +
  "   5  →  flat top  →  curve down  →  flat base" + EOL +
  "   6  →  curve round and close into a loop" + EOL +
  "   7  →  flat top then slant down  ↘" + EOL +
  "   8  →  two loops, one on top of the other" + EOL +
  "   9  →  circle at top, tail going down" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " E · NUMBER SEQUENCES (forward counting)" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " Always count forward from 1:" + EOL +
  "   1  2  3  4  5  6  7  8  9  10" + EOL +
  "   10 11 12 13 14 15 16 17 18 ..." + EOL +
  EOL +
  " Say the numbers aloud to find any missing one:" + EOL +
  "   1, 2, 3, 4,  ___ , 6      →   5" + EOL +
  "   6, 7,  ___ , 9, 10        →   8" + EOL +
  "   10, 11, 12,  ___ , 14     →  13" + EOL +
  "   12, 13,  ___ , 15, 16     →  14" + EOL +
  "   ___ , 2, 3, 4, 5          →   1" + EOL +
  "   6,  ___ ,  ___ , 9, 10    →   7 and 8" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " F · PUTTING TOGETHER (Early Addition)" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " Use fingers, counters, or sticks." + EOL +
  EOL +
  "   ○○   +  ○        =  3      (2 + 1 = 3)" + EOL +
  "   ○○○  +  ○○       =  5      (3 + 2 = 5)" + EOL +
  "   6    +  2        =  8" + EOL +
  "   2    +  8        =  10" + EOL +
  "   3    +  1  +  0  =  4" + EOL +
  "   1    +  2  +  4  =  7" + EOL +
  EOL +
  " Steps to add — always 3 steps:" + EOL +
  "   Step 1  Count the first group." + EOL +
  "   Step 2  Count the second group." + EOL +
  "   Step 3  Count ALL of them together — that is your answer!" + EOL +
  EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  " G · SHAPE NAMES TO KNOW" + EOL +
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━" + EOL +
  "   Circle     — round, smooth, no corners" + EOL +
  "   Square     — 4 equal sides, 4 corners" + EOL +
  "   Triangle   — 3 sides, 3 corners" + EOL +
  "   Rectangle  — 4 sides (2 long, 2 short), 4 corners" + EOL +
  "   Oval       — like a stretched circle (egg shape)" + EOL +
  "   Star       — many sharp points all around" +
  "`}";

// ── assemble: new cards are inserted between Overview and Number Sense ─────────
const REPLACEMENT =
  "feel.`}," + EOL +
  CORE_STRANDS  + "," + EOL +
  CLASSIFICATION + "," + EOL +
  NUMBER_WORK    + "," + EOL +
  "{ title:'Number Sense'";

src = src.replace(ANCHOR, REPLACEMENT);
fs.writeFileSync(FILE, src, 'utf8');

console.log('\n✅  Patch applied successfully!');
console.log('   3 cards added to PP1 › Mathematics Activities:');
console.log('    + Core Strands');
console.log('    + Classification');
console.log('    + Number Work');
console.log('   All existing cards (Number Sense, Measurement, Patterns…) are unchanged.\n');
