import { useState } from 'react'

// ==================== MATHEMATICS ====================
const MATH_TOPICS = [
  {
    id: 'place-value',
    title: 'Number Sense, Place Value, and Decimals',
    summary: 'Whole numbers to 10,000,000; decimal thousandths; powers of 10; comparing & rounding.',
    body: `WHOLE NUMBER PLACE VALUE
In our base‑10 system, each place is 10 times the place to its right. Places from right to left: ones, tens, hundreds, thousands, ten‑thousands, hundred‑thousands, millions, ten‑millions. Example: 6,432,109 reads six million four hundred thirty‑two thousand one hundred nine. Expanded form breaks it into a sum: 6,000,000 + 400,000 + 30,000 + 2,000 + 100 + 9. Standard form is the compact number. Word form uses words.

DECIMALS TO THOUSANDTHS
Decimal places: tenths (0.1 = 1/10), hundredths (0.01 = 1/100), thousandths (0.001 = 1/1000). Example: 0.487 = 4/10 + 8/100 + 7/1000. Expanded fraction form: 4 × (1/10) + 8 × (1/100) + 7 × (1/1000).

POWERS OF 10 AND DECIMAL SHIFT
10¹ = 10, 10² = 100, 10³ = 1,000. Multiplying by a power of 10 moves the decimal right. Dividing moves it left. Example: 3.25 × 100 = 325 (moves right two places). 78.1 ÷ 10 = 7.81 (moves left one place). This is because each digit’s value becomes 10 times larger or smaller.

COMPARING DECIMALS
Compare digit by digit starting from the leftmost place. Example: 0.65 vs 0.7: 0.65 = 0.650, 0.7 = 0.700, so 0.65 < 0.7. Use >, <, or =.

ROUNDING DECIMALS
Look at the digit to the right of the rounding place. If 5 or more, round up; else stay same. Example: Round 12.387 to the nearest hundredth: hundredths digit is 8, next digit 7 (≥5), so round up to 12.39. To nearest tenth: 12.387 → tenths digit 3, next digit 8, round up to 12.4.`
    + `\n\nPRACTICE QUESTIONS (Fill in the blanks)\n1. The digit 5 in 5,208,134 is in the ________ place.\n2. Write 8,000,000 + 200,000 + 5,000 + 30 + 2 in standard form: ________.\n3. 0.009 means nine ________.\n4. 0.6 is ________ tenths, which equals the fraction ________.\n5. Round 23.649 to the nearest tenth: ________.\n6. 10⁴ equals ________.\n7. Compare: 0.89 ________ 0.9 (use >, <, =).\n8. Multiply 7.35 by 1000: ________.\n9. Divide 84.2 by 100: ________.\n10. In 0.472, the digit 7 is in the ________ place.`
  },
  {
    id: 'operations',
    title: 'Multi‑Digit Operations (Whole Numbers & Decimals)',
    summary: 'Multiplication, long division, decimal arithmetic, interpreting remainders.',
    body: `MULTIPLYING WHOLE NUMBERS
Standard algorithm: multiply each digit of the bottom factor by the top factor, shifting left for tens, hundreds, etc., then add. Example: 456 × 23 = (456×3) + (456×20) = 1,368 + 9,120 = 10,488. Estimation: 500 × 20 = 10,000, close to answer.

DIVIDING WHOLE NUMBERS (Long Division)
Divide, multiply, subtract, bring down. Example: 7,890 ÷ 15. 15 × 500 = 7,500, remainder 390; 15 × 26 = 390, total quotient 526. Remainder 0. If there is a remainder, express it as a fraction (e.g., 47 ÷ 5 = 9 R2 = 9 2/5). Real‑world: round up or drop depending on context.

DECIMAL ADDITION & SUBTRACTION
Align decimal points. Add zeros as placeholders. Example: 4.3 + 5.68 → 4.30 + 5.68 = 9.98. Subtraction: 7.2 − 3.45 → 7.20 − 3.45 = 3.75.

DECIMAL MULTIPLICATION
Multiply as whole numbers, then count total decimal places in factors. Example: 1.25 (2 decimal places) × 0.4 (1 place) → 125×4=500, total 3 decimal places → 0.500 = 0.5.

DECIMAL DIVISION
If divisor is a decimal, multiply divisor and dividend by a power of 10 to make divisor whole. Example: 3.6 ÷ 0.12 → 360 ÷ 12 = 30. For whole number divisor, decimal in quotient goes directly above decimal in dividend.

CHECKING WITH ESTIMATION & INVERSE OPERATIONS
Always estimate first. Use addition to check subtraction, multiplication to check division.`
    + `\n\nPRACTICE QUESTIONS\n1. 245 × 36 = ________.\n2. 5,832 ÷ 18 = ________.\n3. 4.6 + 3.85 = ________.\n4. 9.0 − 2.43 = ________.\n5. 0.6 × 0.3 = ________.\n6. 7.2 ÷ 0.9 = ________.\n7. Estimate 2,876 ÷ 32 by rounding both numbers: ________.\n8. Express 67 ÷ 8 as a mixed number: ________.\n9. 0.25 × 4 = ________.\n10. If you divide 50 by 7, the remainder is ________.`
  },
  {
    id: 'fractions',
    title: 'Fractions: Equivalence, Operations, and Scaling',
    summary: 'Adding/subtracting unlike denominators, multiplying/dividing fractions, mixed numbers.',
    body: `EQUIVALENT FRACTIONS
Equivalent fractions represent the same part of a whole: 1/2 = 2/4 = 3/6 = 4/8. Multiply or divide numerator and denominator by the same number.

ADDING/SUBTRACTING UNLIKE FRACTIONS
Find the Least Common Denominator (LCD), which is the LCM of the denominators. Example: 2/3 + 1/4. LCM of 3 and 4 = 12. 2/3 = 8/12, 1/4 = 3/12; sum = 11/12. For mixed numbers: 1 2/3 + 2 1/4 = (1+2) + (8/12+3/12) = 3 11/12.

MULTIPLYING FRACTIONS
Multiply numerators, multiply denominators. Simplify if possible. Example: 3/5 × 2/3 = 6/15 = 2/5. Whole number × fraction: write whole number over 1, e.g., 4 × 3/8 = 4/1 × 3/8 = 12/8 = 1 1/2.

SCALING
Multiplication by a fraction less than 1 reduces the size. 5 × 2/3 is less than 5 because 2/3 < 1. Area of rectangle with fractional sides: length = 3/4 ft, width = 2/3 ft → area = 3/4 × 2/3 = 6/12 = 1/2 sq ft.

DIVIDING FRACTIONS
Divide a unit fraction by a whole number: 1/4 ÷ 3 = 1/12 (split quarter into three). Divide a whole number by a unit fraction: 5 ÷ 1/2 = 10 (how many halves in 5?).`
    + `\n\nPRACTICE QUESTIONS\n1. 5/6 + 1/3 = ________.\n2. 7/8 − 1/2 = ________.\n3. 3/4 × 2/5 = ________.\n4. 6 × 2/3 = ________.\n5. 1/5 ÷ 2 = ________.\n6. 8 ÷ 1/4 = ________.\n7. Find LCM of 6 and 8: ________.\n8. Compare 5/8 and 2/3: 5/8 ________ 2/3.\n9. Area of rectangle 4/5 m by 1/2 m = ________ m².\n10. 2 3/4 + 1 1/2 = ________ (as mixed number).`
  },
  {
    id: 'algebra',
    title: 'Algebraic Thinking, Expressions, and Patterns',
    summary: 'Order of operations, writing expressions, two‑rule patterns, coordinate plane.',
    body: `ORDER OF OPERATIONS (PEMDAS)
Parentheses, Exponents, Multiplication & Division (left to right), Addition & Subtraction (left to right). Example: (3+2)² − 4×3 = 5² − 12 = 25 − 12 = 13.

WRITING EXPRESSIONS
Translate words: “add 8 and 2, then multiply by 5” → (8+2)×5. Use variables: “A number n decreased by 7” → n − 7.

PATTERNS WITH TWO RULES
Rule 1: start at 0, add 3 → 0,3,6,9,12,15. Rule 2: start at 0, add 6 → 0,6,12,18,24,30. Corresponding terms form ordered pairs: (0,0), (3,6), (6,12), etc. Notice each y‑coordinate is twice the x‑coordinate. Plot these in the first quadrant.

COORDINATE PLANE
Horizontal x‑axis, vertical y‑axis, origin (0,0). Ordered pair (x,y): move right x units, then up y units. Used to represent relationships and solve real‑world problems.`
    + `\n\nPRACTICE QUESTIONS\n1. Evaluate: 10 − 2 × 3 + 4 = ________.\n2. (15 − 5) ÷ 2 + 6 = ________.\n3. Write expression: subtract 4 from 20, then divide by 2: ________.\n4. Rule: start at 5, add 7. First three terms: ________, ________, ________.\n5. Two patterns: P1: 0,4,8,12; P2: 0,2,4,6. Corresponding pairs: ________, ________, ________, ________.\n6. In (7,3), 7 is the ________ coordinate.\n7. The origin is (______, ______).\n8. 10³ = ________.\n9. Simplify: 2×(5+3²)−4 = ________.\n10. A point on the y‑axis has x‑coordinate ________.`
  },
  {
    id: 'measurement',
    title: 'Measurement, Data, and Volume',
    summary: 'Unit conversions, line plots, volume of prisms & composite solids.',
    body: `UNIT CONVERSIONS
Metric: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm; 1 kg = 1000 g; 1 L = 1000 mL. US Customary: 1 mi = 5280 ft, 1 yd = 3 ft, 1 ft = 12 in; 1 lb = 16 oz; 1 gal = 4 qt, 1 qt = 2 pt, 1 pt = 2 c. Convert larger to smaller: multiply. Smaller to larger: divide.

LINE PLOTS
Display data with fractional increments (1/2, 1/4, 1/8). Use Xs above number line. Solve problems: total length, difference, average using fraction operations.

VOLUME
Volume = space occupied by a 3‑D solid, measured in cubic units. Right rectangular prism: V = l × w × h, or V = B × h where B = area of base. Composite solid: sum volumes of non‑overlapping rectangular prisms. Example: bottom prism 10×6×4 = 240 cm³, top 4×3×2 = 24 cm³, total = 264 cm³.`
    + `\n\nPRACTICE QUESTIONS\n1. 4.2 km = ________ m.\n2. 3 lb = ________ oz.\n3. A line plot shows 5 Xs at 1/2 inch. Total = ________ in.\n4. Volume of prism 7×5×3 = ________ cm³.\n5. Cube edge 6 cm: volume = ________ cm³.\n6. Convert 9 ft to inches: ________ in.\n7. 5 gal = ________ qt.\n8. Base area 25 cm², height 8 cm: V = ________ cm³.\n9. Composite: prism A 8×3×5, prism B 4×3×2; total = ________ cm³.\n10. 2.5 L = ________ mL.`
  },
  {
    id: 'geometry',
    title: 'Geometry & Coordinate Plane',
    summary: 'Classifying 2‑D figures, polygons, symmetry, coordinate system.',
    body: `CLASSIFYING TRIANGLES
By angles: acute (all <90°), right (one 90°), obtuse (one >90°). By sides: equilateral (3 equal sides), isosceles (2 equal), scalene (no equal). Example: a triangle with angles 45°,45°,90° is a right isosceles.

QUADRILATERALS
Trapezoid: at least one pair of parallel sides. Parallelogram: both pairs of opposite sides parallel. Rhombus: parallelogram with all sides equal. Rectangle: parallelogram with four right angles. Square: rectangle with all sides equal (so it is a rhombus and parallelogram too).

HIERARCHY
All squares are rectangles, rhombuses, and parallelograms. Not all rectangles are squares.

SYMMETRY
A line of symmetry divides a figure into two mirror‑image halves. Square has 4 lines, rectangle has 2, equilateral triangle has 3.

COORDINATE PLANE
Coordinates (x,y) give location. The axes divide plane into quadrants, but Grade 5 focuses on first quadrant (positive x,y).`
    + `\n\nPRACTICE QUESTIONS\n1. A triangle with all sides equal is ________.\n2. A right triangle has one angle of ________°.\n3. A quadrilateral with both pairs of opposite sides parallel is a ________.\n4. A square is a special ________ and also a ________.\n5. A ________ has exactly one pair of parallel sides.\n6. A rectangle has ________ lines of symmetry.\n7. The point (0,0) is the ________.\n8. To plot (4,5), move right ________, then up ________.\n9. If a shape folds along a line and matches exactly, it has ________.\n10. An obtuse triangle has one angle ________ than 90°.`
  },
  {
    id: 'assessment',
    title: 'Comprehensive Assessment (Review & Answers)',
    summary: 'Test all core Grade 5 math skills with worked‑out answers.',
    body: `MULTI‑STEP PRACTICE PROBLEMS WITH ANSWERS
1. Decimal place value: Write 0.392 in expanded form: 3×(1/10)+9×(1/100)+2×(1/1000). The digit 9 is in the hundredths place; its value is 10 times the thousandths value (2). Multiply by 10³: 0.392×1000 = 392.
2. Fraction operations: Add 3/4+5/6+1 1/3. Convert 1 1/3 to 4/3. LCD=12. 3/4=9/12, 5/6=10/12, 4/3=16/12. Sum=35/12=2 11/12. Subtract 1/8: 35/12−1/8, LCD=24, 70/24−3/24=67/24=2 19/24.
3. Volume: Bottom prism 12×8×5=480 cm³, top 6×4×3=72 cm³, total=552 cm³.
4. Order of operations: 50÷(2+3)×2−1 = 50÷5×2−1 = 10×2−1 = 20−1 = 19.
5. Patterns: Rule1 start 0, add 3 → 0,3,6,9. Rule2 start 0, add 6 → 0,6,12,18. Pairs: (0,0), (3,6), (6,12), (9,18). Each y is twice x.`
    + `\n\nPRACTICE QUESTIONS (Self‑check)\n1. 0.392 = ________ hundredths + 2 thousandths.\n2. 1 1/3 as improper fraction: ________.\n3. LCD of 4,6,3 is ________.\n4. 35/12 as mixed number: ________.\n5. 1/8 subtracted from total leaves ________ cups.\n6. Volume of 12×8×5 = ________.\n7. 6×4×3 = ________.\n8. Evaluate (3+2²)×2 = ________.\n9. In pattern 0,3,6,9 and 0,6,12,18, the ratio y:x is ________.\n10. Decimal shift: 0.392×1000 moves decimal ________ places right.`
  }
]

function Grade5MathNotes() {
  const [search, setSearch] = useState('')
  const filtered = MATH_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Mathematics – Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Place value to geometry – each topic has rich explanations and 10 practice blanks</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>
            {t.body.split('\n\n').map((p,i) => <p key={i} style={{marginBottom:'14px'}}>{p}</p>)}
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== ENGLISH LANGUAGE ARTS ====================
const ENGLISH_TOPICS = [
  {
    id: 'lit-comp',
    title: 'Literature Comprehension',
    summary: 'Quoting, theme, character analysis, figurative language, point of view.',
    body: `QUOTING ACCURATELY
When you explain what a text says, use exact words from the text enclosed in quotation marks. This provides evidence. Example: In the story, Arthur's "knuckles turning white" shows his fear.

DETERMINING THEME
Theme is the central lesson or message. It’s not the plot, but the deeper meaning. Ask: What did the main character learn? How did they change? For instance, a story about a selfish child who learns to share might have the theme "Generosity brings more happiness than greed."

CHARACTER AND PLOT
Compare characters using their traits, motivations, and reactions. Describe how a character’s choices drive the plot. A plot diagram includes exposition (introduction), rising action (build‑up), climax (turning point), falling action, and resolution (ending).

FIGURATIVE LANGUAGE
- Simile: compares using "like" or "as" ("as brave as a lion").
- Metaphor: says one thing is another ("The world is a stage").
- Personification: gives human traits to non‑human things ("The wind whispered").
- Hyperbole: extreme exaggeration ("I'm so hungry I could eat a horse").
- Idiom: an expression whose meaning differs from literal words ("It's raining cats and dogs" means heavy rain).

POINT OF VIEW
- First‑person: narrator is in the story, uses "I," "we." Limits what one character knows.
- Third‑person limited: outside narrator, focuses on one character’s thoughts.
- Third‑person omniscient: narrator knows all characters’ thoughts.
Point of view affects how we understand events and characters.

COMPARING ACROSS CULTURES
Stories from different cultures often share similar themes (good vs. evil, love, courage) but express them through unique traditions and settings.`
    + `\n\nPRACTICE QUESTIONS\n1. The main message of a story is its ________.\n2. "The angry sky growled" is an example of ________.\n3. A comparison using "like" is a ________.\n4. In first‑person narration, the pronoun ________ is used.\n5. The turning point of a story is the ________.\n6. An exaggeration like "I've told you a million times" is ________.\n7. "Break a leg" meaning good luck is an ________.\n8. When an author writes "he thought," the point of view is ________‑person limited.\n9. To ________ means to read between the lines and infer.\n10. Quoting requires using the author's ________ words in quotation marks.`
  },
  {
    id: 'info-comp',
    title: 'Informational Text Comprehension',
    summary: 'Main idea, text structures, vocabulary, multiple accounts, evaluating arguments.',
    body: `MAIN IDEA AND DETAILS
Main idea is the most important point. Supporting details explain or prove it. A text may have multiple main ideas.

TEXT STRUCTURE
- Chronological: order of time (first, then, finally).
- Cause/Effect: why something happened and the result.
- Compare/Contrast: similarities and differences.
- Problem/Solution: issue and how it was resolved.
- Description: details about a topic.

DOMAIN‑SPECIFIC VOCABULARY
Words specific to a subject (e.g., "photosynthesis" in science, "amendment" in civics). Use context clues (surrounding words, examples) to infer meaning.

MULTIPLE ACCOUNTS
Primary sources: firsthand accounts (diary, letter). Secondary sources: interpret primary sources (textbook). Comparing them reveals different perspectives and biases.

EVALUATING EVIDENCE
Authors make claims and support them with reasons and evidence. Strong evidence is factual, relevant, and sufficient. Weak evidence may be opinion or insufficient.`
    + `\n\nPRACTICE QUESTIONS\n1. The most important point of a text is the ________ idea.\n2. A text that explains how a problem was fixed uses ________ structure.\n3. Words like "first, next, last" signal ________ order.\n4. A firsthand account is a ________ source.\n5. A textbook written about an event later is a ________ source.\n6. Hints around an unknown word are ________ clues.\n7. To find similarities and differences, look for ________/contrast structure.\n8. An author’s ________ is supported by reasons and evidence.\n9. The cause explains ________ something happened.\n10. The effect is ________ happened.`
  },
  {
    id: 'writing',
    title: 'Writing: Opinion, Informative, Narrative',
    summary: 'Structuring essays, using evidence, dialogue, research process.',
    body: `OPINION WRITING
State a clear claim. Organize reasons logically. Each paragraph presents a reason with facts, examples, quotations. Use linking words (consequently, specifically). End with a conclusion that restates the claim.

INFORMATIVE WRITING
Introduce the topic, group information under headings. Develop with facts, definitions, details. Use domain‑specific vocabulary. Illustrations help. Conclude without new information.

NARRATIVE WRITING
Establish a situation, introduce characters, sequence events naturally. Use dialogue (with quotation marks) and descriptions. Show rather than tell. Vary pace with sentence length. Use sensory details. End with a reflection or resolution.

RESEARCH
Gather from multiple sources. Take notes, summarize/paraphrase. List sources (bibliography). Use technology to produce and publish writing.`
    + `\n\nPRACTICE QUESTIONS\n1. An opinion essay begins with a ________.\n2. Each body paragraph should support the ________.\n3. The final paragraph that wraps up is the ________.\n4. In informative writing, ________ organize sections.\n5. The words characters speak are ________.\n6. Details that appeal to the five senses are ________ details.\n7. The first step of the writing process is ________.\n8. Using someone else's words without credit is ________.\n9. A list of sources is called a ________.\n10. A good narrative has a clear beginning, middle, and ________.`
  },
  {
    id: 'grammar',
    title: 'Language, Grammar, and Conventions',
    summary: 'Conjunctions, prepositions, perfect tenses, sentence types, punctuation, vocabulary.',
    body: `CONJUNCTIONS
Coordinating (FANBOYS): for, and, nor, but, or, yet, so – join equal parts.
Subordinating: because, although, since, unless – join dependent clause to independent.
Correlative: either/or, neither/nor, both/and.

PREPOSITIONS & INTERJECTIONS
Prepositions show relationships (on, under, during, after). Interjections express emotion (Wow! Oh no!).

PERFECT VERB TENSES
Past perfect: had walked. Present perfect: have/has walked. Future perfect: will have walked. Avoid inappropriate tense shifts.

SENTENCE STRUCTURE
Simple: one independent clause. Compound: two independent clauses joined. Complex: one independent + at least one dependent.

PUNCTUATION
Commas in series, after introductory elements, to set off nonrestrictive elements. Quotation marks for direct speech. Apostrophe for possession.

VOCABULARY BUILDING
Use context, Greek/Latin roots (bio=life, graph=write, geo=earth). Synonyms/antonyms. Homographs (bat). Idioms, adages.`
    + `\n\nPRACTICE QUESTIONS\n1. The conjunction "but" is ________.\n2. "Either you go, ________ you stay" needs a correlative.\n3. A word like "under" is a ________.\n4. "Wow!" is an ________.\n5. "I have eaten" is ________ perfect tense.\n6. A sentence with two independent clauses is ________.\n7. Commas separate items in a ________.\n8. The apostrophe in "teacher's" shows ________.\n9. The root "geo" means ________.\n10. Words with opposite meanings are ________.`
  }
]

function Grade5EnglishNotes() {
  const [search, setSearch] = useState('')
  const filtered = ENGLISH_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 English Language Arts – Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Literature, informational text, writing, grammar – 10 practice blanks each</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== SCIENCE ====================
const SCIENCE_TOPICS = [
  {
    id: 'matter',
    title: 'Matter: Properties, Particles, and Changes',
    summary: 'Particle model, mass/volume, conservation, physical vs chemical changes.',
    body: `PARTICLE MODEL OF MATTER
All matter is made of tiny particles (atoms, molecules) too small to see. These particles are always moving. In solids, they vibrate in fixed positions; in liquids, they slide past each other; in gases, they fly freely. This model explains many observations: a balloon inflates because gas particles spread and push outward; sugar dissolves as particles mix among water particles.

PROPERTIES OF MATTER
Measurable properties: mass (grams), volume (mL or cm³), density (mass/volume), electrical conductivity, thermal conductivity, magnetism, solubility. We use these to identify substances. For example, iron is magnetic; salt is soluble in water.

CONSERVATION OF MATTER
Mass stays the same during physical and chemical changes, as long as nothing escapes. If 15 g baking soda + 100 g vinegar react in a sealed system, total mass remains 115 g (plus container). The atoms rearrange but are never lost.

PHYSICAL VS CHEMICAL CHANGES
Physical change alters form or state but not chemical identity: melting, freezing, boiling, tearing, dissolving. Chemical change produces new substances with different properties. Evidence: unexpected color change, gas bubbles, precipitate, temperature change, light. Example: burning wood yields ash, CO₂, and water – irreversible.

EVERYDAY EXAMPLES
- Physical: melting ice, shredding paper.
- Chemical: rusting iron, cooking egg, digesting food.`
    + `\n\nPRACTICE QUESTIONS\n1. All matter is made of tiny ________.\n2. The amount of matter in an object is its ________.\n3. Space an object takes up is ________.\n4. Mass is conserved in a ________ system.\n5. Melting wax is a ________ change.\n6. A sign of a chemical change is ________ production.\n7. When vinegar and baking soda react, a gas called ________ forms.\n8. Density is mass divided by ________.\n9. An iron nail rusting is a ________ change.\n10. Sugar dissolving is a ________ change.`
  },
  {
    id: 'ecosystems',
    title: 'Ecosystems: Energy Flow and Matter Cycles',
    summary: 'Food chains/webs, producers, consumers, decomposers, plant nutrition.',
    body: `ENERGY FLOW
Almost all energy comes from the sun. Producers (plants, algae) use photosynthesis to convert sunlight into food (glucose). Consumers eat other organisms. Primary consumers (herbivores) eat plants; secondary consumers (carnivores) eat herbivores; tertiary consumers eat secondary. Decomposers (bacteria, fungi) break down dead matter, returning nutrients to soil.

FOOD CHAINS AND WEBS
A food chain shows one path: sun → grass → rabbit → fox. A food web is interconnected chains, showing many feeding relationships. Energy flows in one direction; it is not recycled. Only about 10% of energy passes to the next level; the rest is lost as heat.

MATTER CYCLES
Unlike energy, matter cycles. Carbon cycle: CO₂ in air → plants through photosynthesis → animals eat plants → respiration returns CO₂. Decomposers release carbon from dead organisms. Water cycle: evaporation, condensation, precipitation, runoff. Nitrogen cycle: bacteria fix nitrogen for plants.

PLANT NUTRITION
Plants get most of their mass from air (CO₂) and water, not soil. Through photosynthesis: CO₂ + H₂O + sunlight → glucose + O₂. Soil provides minerals (nitrogen, phosphorus, potassium) but the bulk of plant tissue is built from air and water.

ADAPTATIONS
Organisms have traits suited to their environment: camel stores fat in hump for energy/water; cactus stores water; polar bear white fur for camouflage.`
    + `\n\nPRACTICE QUESTIONS\n1. The source of energy for most ecosystems is the ________.\n2. Organisms that make their own food are ________.\n3. An animal that eats only plants is a ________.\n4. A network of interconnected food chains is a food ________.\n5. Organisms that break down dead matter are ________.\n6. Plants get most of their mass from ________ and water.\n7. Photosynthesis uses sunlight, CO₂, and ________.\n8. Matter cycles; energy ________ through the ecosystem.\n9. An animal that eats both plants and animals is an ________.\n10. A polar bear’s white fur is an ________ for camouflage.`
  },
  {
    id: 'earth',
    title: 'Earth’s Systems, Water, and Weather',
    summary: 'Four spheres, water distribution, rain shadow, water cycle, weather instruments.',
    body: `EARTH’S FOUR SPHERES
Geosphere (rocks, mountains, core), hydrosphere (oceans, lakes, ice, groundwater), biosphere (all life), atmosphere (gases surrounding Earth). They interact constantly. Example: a volcano (geosphere) erupts, ash enters atmosphere, affects weather, impacts biosphere.

WATER DISTRIBUTION
~97% salt water (oceans), ~3% fresh water. Of fresh water, ~2% locked in ice caps/glaciers, <1% accessible in rivers, lakes, groundwater. Fresh water is precious; we must conserve.

WATER CYCLE
Evaporation (sun heats water → vapor), transpiration (plants release vapor), condensation (vapor cools → clouds), precipitation (rain, snow, sleet, hail), runoff (water flows to oceans). The cycle is powered by solar energy and gravity.

WEATHER AND CLIMATE
Weather is short‑term atmospheric conditions; climate is long‑term average. Instruments: barometer (air pressure), anemometer (wind speed), hygrometer (humidity), thermometer (temperature), rain gauge. Cold fronts and warm fronts bring weather changes.

RAIN SHADOW EFFECT
Moist air rises over mountain, cools, condenses, rains on windward side. Dry air descends on leeward side, creating desert.`
    + `\n\nPRACTICE QUESTIONS\n1. The solid Earth is the ________ sphere.\n2. The layer of gases is the ________.\n3. About 97% of Earth’s water is ________ water.\n4. Most fresh water is in ________ and glaciers.\n5. Rain, snow, sleet are forms of ________.\n6. Water vapor turning to liquid is ________.\n7. A barometer measures air ________.\n8. The dry side of a mountain is the ________ side.\n9. The water cycle is driven by the sun and ________.\n10. An anemometer measures ________ speed.`
  },
  {
    id: 'space',
    title: 'Space Systems: Gravity, Orbits, Stars, Moon Phases',
    summary: 'Gravity, Earth’s motion, apparent brightness, moon phases, constellations.',
    body: `GRAVITY
Gravity is a force of attraction between all masses. More mass = stronger pull; closer objects = stronger force. Earth’s gravity pulls objects toward its center (down). Keeps moon in orbit, planets around sun.

EARTH’S MOTIONS
Rotation (spins on axis, 24 hours) → day and night. Revolution (orbit around sun, 365¼ days) + tilted axis (23.5°) → seasons. When northern hemisphere tilts toward sun, it’s summer there; away = winter.

MOON PHASES
Moon reflects sunlight. As it orbits Earth, we see varying amounts of the lit side: new moon (dark side facing us), waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, last quarter, waning crescent. Cycle ≈ 29.5 days.

APPARENT BRIGHTNESS OF STARS
The sun appears brightest because it’s closest. Many other stars are intrinsically brighter but much farther away, so appear dimmer.

CONSTELLATIONS
Patterns of stars (e.g., Orion, Ursa Major). As Earth orbits, different constellations are visible in different seasons.`
    + `\n\nPRACTICE QUESTIONS\n1. Gravity depends on mass and ________.\n2. Earth’s rotation causes ________ and night.\n3. One full orbit around the sun takes ________ days.\n4. The moon’s light comes from ________.\n5. The moon phase when the entire lit side faces Earth is ________ moon.\n6. The lunar cycle takes about ________ days.\n7. The sun appears bright because it is ________ to Earth.\n8. A group of stars forming a pattern is a ________.\n9. Seasons are caused by Earth’s ________ and orbit.\n10. The force that keeps planets in orbit is ________.`
  }
]

function Grade5ScienceNotes() {
  const [search, setSearch] = useState('')
  const filtered = SCIENCE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Science – Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Matter, ecosystems, earth systems, space – 10 exercises per topic</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== SOCIAL STUDIES ====================
const SS_TOPICS = [
  {
    id: 'early-america',
    title: 'Early America & Colonization',
    summary: 'Indigenous civilizations, Columbian Exchange, colonial regions, Atlantic slave trade.',
    body: `INDIGENOUS CIVILIZATIONS
Before European contact, advanced societies thrived: Aztec (Mexico, pyramids, chinampas), Maya (Yucatán, hieroglyphics, calendar), Inca (Andes, roads, quipu). In North America: Mississippian (mound builders like Cahokia), Ancestral Puebloans (cliff dwellings, Mesa Verde), Iroquois League (Great Law of Peace, inspiration for US Constitution). Agriculture: “Three Sisters” – corn, beans, squash grown together.

EUROPEAN EXPLORATION
Motives: gold, God, glory. New trade routes. Spain/Portugal led, then France, England, Netherlands. Columbus 1492 connected hemispheres.

COLUMBIAN EXCHANGE
Global transfer: from Europe/Africa/Asia: wheat, rice, sugar, horses, cattle, smallpox, measles. From Americas: corn, potatoes, tomatoes, tobacco, cacao. Disease devastated Native populations.

COLONIAL REGIONS
New England: rocky soil, cold, subsistence farming, fishing, shipbuilding, town meetings, Puritan religion. Middle Colonies: fertile “Breadbasket,” diverse, religious tolerance, grain exports. Southern Colonies: warm, long growing season, plantation economy, cash crops (tobacco, rice, indigo), reliance on enslaved labor. Triangular Trade: goods from Europe to Africa, enslaved Africans to Americas (Middle Passage), raw materials to Europe. Chattel slavery became institutionalized.`
    + `\n\nPRACTICE QUESTIONS\n1. The ________ Exchange refers to the global transfer of plants, animals, and diseases.\n2. Corn, beans, and squash are the ________ Sisters.\n3. The ________ League united five (later six) Native nations.\n4. The Aztec built their capital on an island in Lake ________.\n5. The Middle Colonies were called the ________ for their grain.\n6. The Southern Colonies relied on cash crops like tobacco, rice, and ________.\n7. The brutal voyage of enslaved Africans was the ________ Passage.\n8. The first permanent English settlement was ________, Virginia.\n9. Smallpox was a deadly ________ brought by Europeans.\n10. The triangular trade connected Europe, Africa, and the ________.`
  },
  {
    id: 'revolution',
    title: 'Revolution & Nation Building',
    summary: 'Causes of Revolution, war, Declaration, Articles, Constitution.',
    body: `CAUSES OF THE REVOLUTION
After French and Indian War, Britain taxed colonies to pay debt. Acts: Stamp Act (1765, taxed paper), Townshend Acts (taxed imports), Tea Act (led to Boston Tea Party 1773). Colonists protested “No taxation without representation.” Boston Massacre 1770, Intolerable Acts 1774.

DECLARATION OF INDEPENDENCE
1776, Thomas Jefferson primary author. Declared colonies free, all men created equal, rights to life, liberty, pursuit of happiness. Grievances against King George III.

WAR
Lexington & Concord 1775 first battles. Saratoga 1777 turning point – France allied. Valley Forge harsh winter, training by von Steuben. Yorktown 1781 British surrender. Treaty of Paris 1783 recognized independence.

ARTICLES OF CONFEDERATION
Weak central government, no power to tax or regulate trade. Shays’ Rebellion showed need for change.

CONSTITUTIONAL CONVENTION 1787
Compromises: Great Compromise (bicameral Congress: Senate equal, House by population), Three‑Fifths Compromise (counted 3/5 of enslaved people for representation). Constitution created stronger federal government.`
    + `\n\nPRACTICE QUESTIONS\n1. The slogan “No taxation without ________” protested British taxes.\n2. The Boston Tea Party protested the ________ Act.\n3. The Declaration of Independence was adopted on July 4, ________.\n4. The American victory at ________ convinced France to ally.\n5. The final battle was at ________.\n6. The first constitution was the ________ of Confederation.\n7. The ________ Compromise created a two‑house Congress.\n8. The Three‑Fifths Compromise concerned counting ________ people.\n9. The president heads the ________ branch.\n10. The ________ branch interprets laws.`
  },
  {
    id: 'civics',
    title: 'Civics: Constitution, Rights, Citizenship',
    summary: 'Principles, Bill of Rights, voting amendments, citizenship duties.',
    body: `CONSTITUTIONAL PRINCIPLES
Federalism: power shared between national and state. Separation of powers: three branches (legislative, executive, judicial). Checks and balances: each branch limits others (veto, override, judicial review). Popular sovereignty: government authority from the people.

BILL OF RIGHTS
First 10 amendments: freedom of speech, press, religion; right to bear arms; protection against unreasonable searches; due process; speedy trial; cruel and unusual punishment prohibited; rights not listed reserved to states/people.

CITIZENSHIP
Natural‑born or naturalized. Naturalization process: residency, test, oath. Voting rights expanded: 15th Amendment (race), 19th (women), 26th (age 18). Duties: obey laws, pay taxes, serve on jury, vote.`
    + `\n\nPRACTICE QUESTIONS\n1. The division of power between nation and states is ________.\n2. The ________ branch enforces laws.\n3. The Supreme Court can declare laws ________.\n4. The first 10 amendments are the ________ of Rights.\n5. The ________ Amendment guarantees free speech.\n6. The 19th Amendment gave ________ the vote.\n7. Becoming a citizen through process is ________.\n8. The 26th Amendment lowered voting age to ________.\n9. Paying taxes is a civic ________.\n10. “We the People” shows popular ________.`
  },
  {
    id: 'economics',
    title: 'Economics, Trade, and Geography',
    summary: 'Supply/demand, specialization, tariffs, maps, migration, GIS.',
    body: `ECONOMIC CONCEPTS
Scarcity: limited resources, unlimited wants → choices. Opportunity cost: next best alternative given up. Supply and demand determine price. Demand > supply → higher price.

TRADE
Specialization increases productivity; nations trade for what they lack. Exports (goods sold), imports (bought). Tariffs (tax on imports), quotas (limits). Free trade agreements reduce barriers.

GEOGRAPHY TOOLS
Political maps (borders), physical maps (landforms), thematic maps (population, climate). GIS (Geographic Information Systems) layers data. Migration: push factors (war, poverty) push people out; pull factors (jobs, freedom) attract. Urbanization: growth of cities.`
    + `\n\nPRACTICE QUESTIONS\n1. Limited resources force ________.\n2. The next best alternative is ________ cost.\n3. When demand exceeds supply, price ________.\n4. A tax on imports is a ________.\n5. A limit on quantity imported is a ________.\n6. A map showing landforms is a ________ map.\n7. GIS stands for ________ Information System.\n8. Factors that push people to leave are ________ factors.\n9. City growth is ________.\n10. When a country exports more than imports, it has a trade ________.`
  }
]

function Grade5SocialStudiesNotes() {
  const [search, setSearch] = useState('')
  const filtered = SS_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Social Studies – Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Early America to economics – 10 blanks per topic</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== KISWAHILI ====================
const KISWAHILI_TOPICS = [
  {
    id: 'kusikiliza',
    title: 'Kusikiliza na Kuzungumza (Listening and Speaking)',
    summary: 'Maamkizi, mazungumzo ya mada maalum, kufahamu kwa kusikiliza, matamshi na lafudhi.',
    body: `KUSIKILIZA NA KUZUNGUMZA: Msingi wa mawasiliano ya Kiswahili

Kusikiliza na kuongea ni stadi mbili za kwanza za lugha ambazo humwezesha mwanadamu kuwasiliana na wenzake. Katika Kiswahili, maamkizi ni uti wa mgongo wa mazungumzo. Maamkizi hutofautiana kulingana na wakati, umri, na muktadha. Kwa mfano, asubuhi huamkiana "Sabalkheri" au "Asubuhi njema". Mchana hutumia "Habari za mchana?" na jioni "Masalkheri". Usiku ni "Alamsiki". Kwa wazee na viongozi, "Shikamoo" ni heshima kubwa, na jibu lake ni "Marahaba". Vijana na watu wa rika moja huamkiana "Hujambo?" na kujibu "Sijambo". Pia kuna salamu za kidini kama "Assalamu Alaikum" na jibu "Waalaikum Salaam".

Baada ya salamu, mazungumzo hujengwa juu ya mada maalum. Katika darasa la tano, wanafunzi hushiriki mazungumzo kuhusu afya na usafi, usalama barabarani, utunzaji wa mazingira, na teknolojia. Kwa mfano, kuhusu afya, mwanafunzi anaweza kuuliza: "Je, unajua njia za kujikinga na maradhi?" na mwenzake kujibu: "Ndiyo, kunawa mikono kwa sabuni ni muhimu." Katika mazingira, mada kama upandaji miti na utupaji taka hupewa kipaumbele. Majibu ya shukrani kama "Asante sana" na "Samahani" pia hujadiliwa. "Pole" hutumika kufariji: "Pole kwa msiba", "Pole na kazi".

Kusikiliza kwa makini (auditory comprehension) ni ujuzi muhimu. Mwalimu anaposoma hadithi au habari, mwanafunzi hutakiwa kutambua mawazo makuu na ujumbe uliokusudiwa. Baada ya kusikiliza, maswali ya ufahamu hujibu. Kuna maswali ya moja kwa moja (explicit) na yale yanayohitaji kuhusisha mawazo (inferential). Mfano: "Kwa nini mhusika alifanya hivyo?" Pia, wanafunzi hufuatilia maagizo yenye hatua nyingi. Mwalimu anaweza kusema: "Chukua kalamu, andika jina lako, kisha nipe karatasi." Hii hujenga uwezo wa kufuata maelekezo.

Matamshi bora na lafudhi (pronunciation and intonation) ni sehemu ya mwisho ya kusikiliza na kuongea. Sauti za Kiswahili kama ng', ny, mb, nd, nj, nz, na ch hutamkwa kwa usahihi. Kuna ving'ong'o (velar nasal) ambavyo hutamkwa kwa kaakaa laini. Kiimbo cha sauti (lafudhi) huonyesha hisia: sauti inayopanda mwishoni huashiria swali, kushuka kwa ghafla huonyesha amri, na kupanda na kushuka kwa msisimko huonyesha mshangao. Kufanya mazoezi ya kutamka kwa sauti kubwa husaidia kujenga ufasaha na kujiamini.`
    + `\n\nMASWALI YA KUJAZA PENGO (FILL IN THE BLANKS)\n1. Salamu ya asubuhi kwa Kiswahili ni "________".\n2. Mtu anaposema "Shikamoo", jibu sahihi ni "________".\n3. Unapomfariji mtu mwenye msiba, unasema "________".\n4. Mazungumzo kuhusu usalama barabarani yanajumuisha mada kama ________.\n5. Sauti "ng'" inatamkwa kwa kutumia ________.\n6. Kiimbo kinachopanda mwishoni huonyesha ________.\n7. Kufuatilia maagizo ya hatua nyingi hujenga uwezo wa ________.\n8. "Asante sana" ni ________.\n9. Kusikiliza hadithi na kujibu maswali ni zoezi la ________.\n10. Matamshi bora hujumuisha kutamka ________ za Kiswahili kwa usahihi.`
  },
  {
    id: 'sarufi',
    title: 'Sarufi (Grammar)',
    summary: 'Ngeli za nomino, nyakati, ukanushaji, viwakilishi, vivumishi, vielezi, viunganishi.',
    body: `SARUFI YA KISWAHILI: Mfumo wa lugha ulio na utaratibu

Sarufi ya Kiswahili inajikita katika ngeli za nomino. Ngeli ni makundi ya majina yanayotawala upatanisho wa kisarufi kati ya nomino, vivumishi, na vitenzi. Ngeli ya A‑WA inahusisha viumbe hai (watu, wanyama, ndege, wadudu). Katika umoja, kiambishi cha nomino ni A‑, YU‑, au M‑ (mfano: mtoto, mwanafunzi). Katika wingi, kiambishi ni WA‑ (watoto, wanafunzi). Vitenzi hupokea viambishi vya upatanisho: mtoto anacheza → watoto wanacheza. Vivumishi navyo hupatana: mtoto mzuri → watoto wazuri.

Ngeli ya KI‑VI inahusisha vifaa na vitu visivyo hai. Umoja ni KI‑ au CH‑ (kiti, chakula). Wingi ni VI‑ au VY‑ (viti, vyakula). Mfano wa sentensi: Kiti changu kimevunjika → Viti vyangu vimevunjika. Hapa, kivumishi "changu" kinabadilika kuwa "vyangu". Ngeli ya LI‑YA inahusisha vitu vingi au matunda. Umoja: jicho, embe; wingi: macho, maembe. Mfano: Jicho limefumba → Macho yamefumba. Ngeli ya U‑I inahusisha miti na vitu vyenye umbo refu: mti umeanguka → miti imeanguka. Kuna ngeli nyingine kama U‑ZI (uzi, nyuzi) na I‑ZI (nyumba, nyumba).

Nyakati za Kiswahili huonyeshwa kwa viambishi awali vinavyoingizwa kati ya kiambishi cha nafsi na shina la kitenzi. Wakati uliopo hutumia ‑NA‑: anasoma (a‑na‑soma). Uliopita: ‑LI‑ (alisoma). Ujao: ‑TA‑ (atasoma). Timilifu: ‑ME‑ (amesoma – amemaliza kusoma hivi punde). Ukanushaji hubadilisha kabisa muundo. Kwa mfano, uliopo: anasoma → hasomi; uliopita: alisoma → hakusoma; ujao: atasoma → hatasoma; timilifu: amesoma → hajasoma. Kukanusha kunahusisha viambishi vya 'ha‑' na kubadilisha silabi za mwisho.

Aina za maneno hujumuisha viwakilishi (mimi, wewe, yeye, sisi, ninyi, wao), vivumishi (‑baya, ‑zuri, ‑refu, ‑fupi), vielezi (vya namna: kwa haraka; vya mahali: sokoni; vya wakati: asubuhi), na viunganishi (kwa sababu, lakini, ingawa, kisha, ilhali). Sentensi hujengwa kwa kuunganisha haya kwa kufuata muundo sahihi.`
    + `\n\nMASWALI YA KUJAZA PENGO\n1. Ngeli ya A‑WA inahusisha viumbe ________.\n2. Wingi wa "mtoto anacheza" ni "watoto ________".\n3. Katika ngeli ya KI‑VI, wingi wa "changu" ni ________.\n4. Wakati uliopita hutumia kiambishi ________.\n5. "Amesoma" ipo katika hali ya ________.\n6. Kukanusha "anasoma" ni ________.\n7. Neno "sisi" ni kiwakilishi cha ________.\n8. Kivumishi "‑zuri" kikitumika na "kiti" kinakuwa ________.\n9. "Kwa sababu" ni mfano wa ________.\n10. "Sokoni" ni kielezi cha ________.`
  },
  {
    id: 'kusoma',
    title: 'Kusoma na Ufahamu (Reading and Comprehension)',
    summary: 'Usomaji wa burudani, msamiati, uchambuzi wa maandishi, sifa za wahusika.',
    body: `KUSOMA NA UFAHAMU: Kufungua milango ya maarifa na burudani

Kusoma ni msingi wa elimu. Katika kiwango hiki, wanafunzi husoma vifungu vya habari, hadithi fupi, na vitabu vya ziada (makala). Kusoma kwa sauti (kiada) huboresha matamshi, fasaha, na kasi. Kusoma kimoyomoyo (kimya) huongeza ufahamu na kasi ya kuelewa. Wanafunzi hupanua msamiati kwa kutafuta maana ya maneno mapya. Kuna njia mbili: kutumia muktadha – maneno yanayozunguka neno jipya – au kutumia kamusi. Kwa mfano, katika sentensi "Jua kali lilimfanya atokwe na jasho", tunaweza kufahamu kuwa "jasho" ni kitu kinachotoka mwilini wakati wa joto.

Uchambuzi wa maandishi ni hatua muhimu baada ya kusoma. Maswali ya ufahamu hugawanyika katika: maswali ya moja kwa moja – yenye majibu yaliyo wazi katika kifungu; na maswali yasiyo ya moja kwa moja – yanayohitaji mwanafunzi kufanya hitimisho. Mfano wa swali lisilo la moja kwa moja: "Kwa nini unafikiri mhusika alifurahi mwishoni?" Mwanafunzi lazima achunguze ushahidi kutoka kifunguni.

Kila hadithi huwa na funzo au maadili. Funzo ni somo tunalojifunza. Kwa mfano, hadithi ya "Sungura na Fisi" inaweza kufundisha kwamba ujanja sio sifa nzuri, na kuwa mwaminifu kuna baraka. Wahusika hutathminiwa: sifa zao za nje na za ndani. Mhusika mkarimu ni yule anayetoa na kusaidia wengine. Mlafi anapenda chakula kupita kiasi. Mjanja anatumia ujanja kufikia malengo. Mwaminifu ni mkweli na mwenye kutegemeka. Msaliti anasaliti wenzake. Kuelewa sifa hizi hutusaidia kuungana na hadithi na kujifunza maisha.`
    + `\n\nMASWALI YA KUJAZA PENGO\n1. Kusoma kwa ajili ya kujiburudisha ni kusoma kwa ________.\n2. Kutafuta maana ya neno kwa maneno yanayozunguka ni kutumia ________.\n3. Kitabu chenye maneno na maana zake huitwa ________.\n4. Maswali yenye majibu ya wazi huitwa ya ________.\n5. Somo la maana katika hadithi ni ________ au maadili.\n6. Mhusika mkarimu anajulikana kwa kutoa na ________.\n7. Mhusika mlafi hupenda ________ kupita kiasi.\n8. Mhusika anayesema ukweli daima ni ________.\n9. Kusoma kimya husaidia kuongeza ________ na ufahamu.\n10. Hadithi ya "Sungura na Fisi" inafundisha kwamba ________ sio sifa nzuri.`
  },
  {
    id: 'kuandika',
    title: 'Kuandika (Writing)',
    summary: 'Insha za kiubunifu, uandishi wa kiuamilifu, imla, alama za uakifishaji.',
    body: `KUANDIKA: Kujieleza kwa ubunifu na uamilifu

Uandishi ni stadi ya kujieleza kwa maandishi. Kuna aina mbili kuu: insha za kiubunifu na uandishi wa kiuamilifu. Insha ya wasifu inaelezea mtu, mnyama, au mahali kwa kina. Inahitaji lugha ya picha na vivumishi vingi ili msomaji aweze kuelewa anachoelezwa. Mfano: "Rafiki yangu Juma ana umbo la kuvutia, nywele nyeusi za singa, na tabasamu la kudumu." Insha ya kusimulia husimulia hadithi yenye mwanzo (utangulizi), kati (mgogoro), na mwisho (suluhisho). Wahusika, mandhari, na mtiririko wa matukio hujenga hadithi. Mgogoro ndio kiini cha hadithi – tatizo linalohitaji kutatuliwa.

Uandishi wa kiuamilifu unahusu kuandika barua, orodha, na taarifa. Barua ya kirafiki ina muundo maalum: anwani ya mwandikaji upande wa kulia, tarehe, salamu (Ndugu yangu), mwili, na hitimisho (Wako mpendwa, jina). Barua rasmi ina anwani mbili, kichwa cha barua, na lugha rasmi. Orodha ya vitu huwa na mpangilio na alama za kuorodhesha.

Imla ni zoezi la kuandika maneno kwa usahihi mwalimu anapoyasoma. Inajenga tahajia na uakifishaji. Alama za uakifishaji ni muhimu sana: nukta (.) mwishoni mwa sentensi, mkato (,) kutenganisha vitu katika orodha, alama ya kuuliza (?) kwa swali, alama ya hisia (!) kwa mshangao. Sentensi sahihi huwa na umbo kamili: kiima (mtenda) na kiarifu (kitenzi). Mfano: "Mwalimu anafunza." Ni sentensi kamili. Tungo la sentensi hubeba maana. Kukosea uakifishaji kunaweza kubadilisha maana kabisa.`
    + `\n\nMASWALI YA KUJAZA PENGO\n1. Insha inayoeleza mtu kwa kina ni ya ________.\n2. Insha ya kusimulia ina sehemu tatu: mwanzo, ________, na mwisho.\n3. Barua ya kirafiki huanza na ________.\n4. Mwisho wa barua ya kirafiki huandikwa "Wako ________".\n5. Alama ya mwisho wa sentensi ni ________.\n6. Alama ya mshangao ni ________.\n7. Kuandika maneno kwa usahihi wakati wa kusoma sauti ni ________.\n8. Alama ya kutenganisha vitu katika orodha ni ________.\n9. Katika sentensi, mtenda huitwa ________.\n10. Kukosea uakifishaji kunaweza kubadilisha ________ ya sentensi.`
  },
  {
    id: 'fasihi',
    title: 'Fasihi Simulizi na Msamiati (Oral Literature & Vocabulary)',
    summary: 'Methali, vitendawili, nahau, msamiati wa ukoo, afya, mavazi.',
    body: `FASIHI SIMULIZI NA MSAMIATI: Hazina ya hekima na utamaduni

Fasihi simulizi ni sanaa ya maneno inayopitishwa kwa mdomo kutoka kizazi hadi kizazi. Inajumuisha methali, vitendawili, na nahau. Methali ni misemo mifupi yenye hekima. Mfano: "Asiyefunzwa na mamae hufunzwa na ulimwengu" inamaanisha kwamba mtoto asiyesikia wazazi atajifunza kwa uchungu. "Haraka haraka haina baraka" inahimiza uvumilivu. "Mpiga ngumi ukuta huumiza mkonowe" inaonya dhidi ya hasira. Methali hufundisha maadili na busara.

Vitendawili ni mafumbo. Mfano: "Nyumba yangu haina mlango" – jibu ni yai. Vitendawili huchangamsha akili na kukuza uwezo wa kufikiri kwa kina. Nahau ni misemo ya picha yenye maana tofauti na maneno yenyewe. "Piga picha" maana yake ni kupiga picha (kutumia kamera). "Kaza kamba" maana yake ni kufanya bidii. "Amua ngumi" maana yake ni kupigana. Nahau hutumika katika mazungumzo na uandishi.

Msamiati maalum hujumuisha maneno ya ukoo: babu (baba wa mzazi), nyanya (mama wa mzazi), mjukuu (mtoto wa mwanao), shemeji (mume wa dada), mkwe (mzazi wa mume/mke), ami (kaka wa baba), shangazi (dada wa baba). Katika afya, kuna homa, mafua, malaria, kikohozi, pamoja na wahudumu kama daktari, muuguzi, hospitali. Mavazi ni kama koti, suruali, shati, gauni, sketi. Vyombo vya nyumbani ni sufuria, mwiko, sahani, kijiko. Msamiati huu husaidia katika mawasiliano ya kila siku na katika kuelewa muktadha tofauti.`
    + `\n\nMASWALI YA KUJAZA PENGO\n1. "Asiyefunzwa na mamae hufunzwa na ________" ni mfano wa methali.\n2. Kitendawili "Nyumba yangu haina mlango" jibu lake ni ________.\n3. "Kaza kamba" maana yake ni ________.\n4. Baba wa baba yako anaitwa ________.\n5. Mama wa mama yako anaitwa ________.\n6. Mume wa dada yako anaitwa ________.\n7. Mtu anayetibu wagonjwa hospitalini ni ________.\n8. Chombo cha kupikia kinachoitwa ________.\n9. Nguo ya kufunika miguu ni ________.\n10. "Piga picha" kwa Kiswahili sanifu inamaanisha ________.`
  }
]

function Grade5KiswahiliNotes() {
  const [search, setSearch] = useState('')
  const filtered = KISWAHILI_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Kiswahili – Lugha na Fasihi (Deep Notes)</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Kusikiliza, Sarufi, Kusoma, Kuandika, Fasihi – kila mada ina maelezo ya kina na mazoezi 10</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>
            {t.body.split('\n\n').map((p,i) => <p key={i} style={{marginBottom:'14px'}}>{p}</p>)}
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== CHRISTIAN RELIGIOUS EDUCATION ====================
const CRE_TOPICS = [
  {
    id: 'creation',
    title: 'Creation and the Environment',
    summary: 'God’s purpose for creation, human stewardship, practical conservation, and the consequences of neglect.',
    body: `CREATION AND THE ENVIRONMENT – A Biblical Foundation

The Bible opens with the majestic account of creation in Genesis chapters 1 and 2. Over six days, God spoke the universe into existence. On day one, He created light, separating it from darkness. On day two, He made the sky and the atmosphere. On day three, He gathered the waters to reveal dry land and brought forth vegetation – plants, trees, and flowers. On day four, He set the sun, moon, and stars in place to govern day and night and to mark seasons. On day five, He filled the waters with living creatures and the sky with birds. On day six, He created land animals and finally, the crown of His creation – human beings, made in His own image and likeness. Each stage was declared “good,” and the finished creation was “very good.” The seventh day was set apart as a day of rest, establishing the Sabbath.

The creation of humans was unique. God formed Adam from the dust of the ground and breathed into his nostrils the breath of life. Eve was made from Adam’s side as a suitable partner. They were given intellect, free will, and the ability to communicate with God. Most importantly, they were given a responsibility: to rule over creation as stewards. Genesis 1:28 commands them to “fill the earth and subdue it; have dominion over the fish of the sea, over the birds of the air, and over every living thing.” This dominion is not a licence to exploit, but a sacred duty to care for and manage God’s world.

Genesis 2:15 reinforces this stewardship: “The LORD God took the man and put him in the Garden of Eden to work it and take care of it.” From the beginning, humanity’s role was that of a caretaker. The earth belongs to God; we are temporary managers. Stewardship involves protecting natural resources, preserving biodiversity, and ensuring that the earth can sustain future generations.

The Bible contains numerous laws that highlight environmental care. In Leviticus 25, God commanded the Israelites to let the land rest every seventh year – the Sabbath year – during which fields were not to be planted, allowing the soil to regain its fertility. During wartime, Israel was forbidden from destroying fruit trees (Deuteronomy 20:19‑20), recognising their long‑term value for food. These principles are echoed in modern environmental ethics, emphasising sustainability and conservation.

The consequences of failing to care for creation are serious. When humans exploit the earth greedily, we see deforestation, desertification, species extinction, air and water pollution, and climate change. The book of Revelation warns that God will “destroy those who destroy the earth” (Revelation 11:18). Thus, environmental stewardship is not merely a practical matter but a spiritual imperative. Caring for creation is an act of worship and obedience to the Creator.

Practically, Christians can exercise stewardship in simple but meaningful ways. Turning off lights when not in use conserves energy. Reducing, reusing, and recycling materials minimises waste. Planting trees helps restore forests and provides oxygen. Keeping water sources clean ensures safe drinking water. Treating animals humanely reflects God’s compassion. At school, we can start environmental clubs, participate in clean‑up activities, and educate others about the importance of caring for God’s world. Stewardship begins with small, consistent actions.

The connection between creation and the Creator is profound. Romans 1:20 says that God’s invisible qualities – His eternal power and divine nature – are clearly seen in what has been made. When we look at a starry sky, a majestic mountain, or the intricate design of a flower, we glimpse God’s glory. Protecting creation is thus a way of honouring its Creator. As stewards, we are called to be earth‑keepers, reflecting God’s love to the entire world.`
    + `\n\nPRACTICE QUESTIONS (Fill in the blanks)\n1. According to Genesis, humans were created on the ________ day.\n2. God placed Adam in the Garden of ________.\n3. The responsibility to care for creation is called ________.\n4. The Sabbath year allowed the ________ to rest.\n5. During war, Israelites were forbidden to destroy ________ trees.\n6. Revelation 11:18 says God will judge those who ________ the earth.\n7. One practical way to care for the environment is to ________ trees.\n8. Romans 1:20 says God’s qualities are seen in ________.\n9. Stewardship means being a ________, not an owner.\n10. The Bible says that creation is ________ good.`
  },
  {
    id: 'ot-leaders',
    title: 'Old Testament: Leaders, Covenants, and Faith',
    summary: 'The call and faith of Abraham, Moses and the Exodus, the Sinai Covenant, and the leadership qualities of David.',
    body: `OLD TESTAMENT LEADERS – Models of Faith and Obedience

Abraham is one of the most significant figures in the Bible. Originally named Abram, he lived in the city of Ur and later Haran. In Genesis 12, God called him to leave his country, his people, and his father’s household and go to a land that God would show him. God made a solemn covenant with Abraham, promising to make him into a great nation, to bless him, to make his name great, and to bless all the peoples of the earth through him. Abraham obeyed immediately, setting out by faith even though he did not know his destination. His faith was counted to him as righteousness.

The supreme test of Abraham’s faith came in Genesis 22. God asked him to sacrifice his beloved son Isaac, the son of the promise. Although this command seemed to contradict God’s promise, Abraham trusted God completely. He took Isaac to Mount Moriah, built an altar, and was about to sacrifice him when an angel stopped him. God provided a ram caught in a thicket as a substitute sacrifice. This event foreshadowed God’s provision of His own Son, Jesus Christ, as the ultimate sacrifice for sin. Abraham’s willingness to obey, even when he did not understand, makes him the father of faith.

Moses is another towering leader. He was born to Hebrew slaves in Egypt at a time when Pharaoh had ordered all male Hebrew babies to be killed. His mother hid him for three months, then placed him in a basket on the Nile River. Pharaoh’s daughter discovered him and raised him as her own son. After killing an Egyptian who was beating a Hebrew, Moses fled to Midian, where he lived as a shepherd for forty years.

At the burning bush (Exodus 3), God revealed His sacred name, “I AM WHO I AM” (Yahweh), and commissioned Moses to lead the Israelites out of Egypt. After a series of ten plagues, the final one – the Passover – secured their release. The Israelites were instructed to sacrifice an unblemished lamb and put its blood on their doorposts. That night, the angel of death “passed over” the homes marked by blood, sparing the firstborn inside. This event became the central act of redemption in the Old Testament and points forward to Jesus, the Lamb of God who takes away the sin of the world.

After crossing the Red Sea, the Israelites journeyed to Mount Sinai. There, God gave Moses the Ten Commandments, the core of the Sinai Covenant. These commandments are divided into two sections: the first four concern duties to God (no other gods, no idols, honour God’s name, keep the Sabbath), and the remaining six concern duties to fellow humans (honour parents, do not murder, commit adultery, steal, bear false witness, or covet). Together, they form a comprehensive moral blueprint for a just and harmonious community.

David is a model of leadership after God’s heart. He was the youngest son of Jesse, a shepherd boy anointed by the prophet Samuel. God chose David not because of his outward appearance, but because of his heart. David demonstrated incredible courage when he faced the Philistine giant Goliath. Armed with only a sling and five smooth stones, he declared that the battle belongs to the Lord, and he defeated Goliath with a single stone to the forehead.

David’s life was not without failure. He sinned grievously with Bathsheba and arranged the death of her husband Uriah. However, when confronted by the prophet Nathan, David repented sincerely. Psalm 51 records his heartfelt confession and plea for mercy. David’s humility, repentance, and unwavering loyalty to God – even when being hunted by King Saul – highlight qualities that made him a great leader. He composed many psalms that continue to inspire worship today.`
    + `\n\nPRACTICE QUESTIONS\n1. God called Abraham from the city of ________.\n2. God promised Abraham that all nations would be ________ through him.\n3. The substitute sacrifice provided for Abraham was a ________.\n4. Moses encountered God at the ________ bush.\n5. God’s sacred name revealed to Moses is “________”.\n6. The blood of the ________ lamb protected the Israelites during the Passover.\n7. The Ten Commandments were given at Mount ________.\n8. The first four commandments concern duties to ________.\n9. David defeated Goliath with a ________ and a stone.\n10. David wrote many of the ________ in the Bible.`
  },
  {
    id: 'nt-jesus',
    title: 'New Testament: Life, Ministry, and Teachings of Jesus Christ',
    summary: 'The birth, baptism, temptations, miracles, parables, passion, death, resurrection, and Great Commission of Jesus.',
    body: `THE LIFE AND MINISTRY OF JESUS CHRIST – The Gospel Story

The birth of Jesus was foretold centuries before by prophets such as Isaiah and Micah. The angel Gabriel appeared to a young virgin named Mary in Nazareth and announced that she would conceive by the Holy Spirit and give birth to the Son of God. Her betrothed, Joseph, was troubled, but an angel appeared to him in a dream, confirming the divine nature of the child and instructing him to name the baby Jesus, meaning “the LORD saves.” The child would also be called Immanuel, which means “God with us.”

A decree from Caesar Augustus required Joseph to travel to Bethlehem, the city of David, for a census. While there, Mary gave birth to Jesus. Because there was no room in the inn, He was laid in a manger – a feeding trough for animals. The first to hear the news were shepherds watching their flocks at night, to whom an angel announced, “I bring you good tidings of great joy.” A heavenly host appeared, praising God. The shepherds hurried to Bethlehem and found the baby just as they had been told.

Forty days later, Mary and Joseph presented Jesus at the Temple in Jerusalem. There, two elderly prophets, Simeon and Anna, recognised Him as the promised Messiah. Later, Magi (wise men) from the East arrived in Jerusalem, guided by a star. They brought gifts of gold (symbolising kingship), frankincense (priesthood), and myrrh (suffering and death). Warned in a dream, Joseph fled with Mary and Jesus to Egypt to escape King Herod’s massacre of infant boys. After Herod’s death, they returned and settled in Nazareth.

Jesus’ public ministry began when He was about thirty years old. He was baptised by John the Baptist in the Jordan River. As He came out of the water, the heavens opened, the Holy Spirit descended like a dove, and a voice from heaven declared, “This is my beloved Son, in whom I am well pleased.” Immediately afterward, Jesus was led by the Spirit into the wilderness, where He fasted for forty days and was tempted by Satan. Jesus overcame each temptation by quoting Scripture, demonstrating the power of God’s Word to defeat evil.

Jesus performed many miracles that revealed His divine authority. He turned water into wine at a wedding in Cana. He calmed a raging storm with a simple command: “Peace, be still.” He fed a crowd of five thousand men (plus women and children) with only five loaves and two fish, with twelve baskets of leftovers. He healed the sick: a paralysed man lowered through a roof, a blind beggar named Bartimaeus, ten lepers (of whom only one, a Samaritan, returned to give thanks). He raised Lazarus from the dead after four days in the tomb.

Jesus taught using parables – simple stories with deep spiritual meanings. The Parable of the Good Samaritan answers the question, “Who is my neighbour?” by showing that true neighbourly love crosses racial and social boundaries. The Parable of the Prodigal Son illustrates God’s boundless grace and forgiveness for sinners who repent. The Parable of the Sower teaches about different responses to God’s word.

The passion of Jesus began with the Last Supper, where He instituted the Lord’s Supper (Holy Communion), breaking bread and sharing wine as symbols of His body and blood. In the Garden of Gethsemane, He prayed in agony, submitting to the Father’s will. He was betrayed by Judas Iscariot with a kiss and arrested. He faced trial before the Sanhedrin and the Roman governor Pilate, who sentenced Him to death by crucifixion, although he found no fault in Him.

Jesus was crucified at Golgotha, the Place of the Skull. He was nailed to a cross between two criminals. At the moment of His death, the curtain of the Temple was torn in two from top to bottom, and the earth shook. His body was placed in a tomb, and a large stone was rolled over the entrance. On the third day, the tomb was found empty. Jesus had risen! He appeared first to Mary Magdalene, then to other disciples, including two on the road to Emmaus. Later, He appeared to the eleven apostles and gave them the Great Commission: “Go into all the world and make disciples of all nations, baptising them… and teaching them to obey everything I have commanded you.” After forty days, He ascended into heaven.`
    + `\n\nPRACTICE QUESTIONS\n1. The angel Gabriel appeared to Mary in the town of ________.\n2. Jesus was born in the city of ________.\n3. The name Immanuel means “________ with us.”\n4. John the Baptist baptised Jesus in the ________ River.\n5. Jesus fasted in the wilderness for ________ days.\n6. The Parable of the Good Samaritan teaches about being a good ________.\n7. The Last Supper is also called ________.\n8. Jesus was crucified at a place called ________.\n9. Jesus rose from the dead on the ________ day.\n10. The Great Commission commands us to make ________ of all nations.`
  },
  {
    id: 'christian-living',
    title: 'Christian Living, Morality, and Church History',
    summary: 'Fruits and gifts of the Holy Spirit, Christian values, resisting peer pressure, and the early church community.',
    body: `CHRISTIAN LIVING AND MORALITY – Walking in the Spirit

The Holy Spirit is the third Person of the Trinity, sent by the Father and the Son to dwell in believers. The Spirit equips the Church with gifts and produces fruit in the lives of Christians. In 1 Corinthians 12, the apostle Paul lists various spiritual gifts, including wisdom, knowledge, faith, healing, miraculous powers, prophecy, distinguishing between spirits, speaking in tongues, and the interpretation of tongues. These gifts are given for the common good – to build up the Church and serve others. No one person has all the gifts, and the Spirit distributes them as He determines.

While gifts are specific enablements for ministry, the fruit of the Spirit (Galatians 5:22‑23) refers to the character qualities that the Holy Spirit cultivates in every believer. These are: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self‑control. Unlike gifts, every Christian is expected to grow in all nine fruits. They reflect the character of Jesus and are evidence of a transformed life. Love is the first and greatest fruit – the selfless, sacrificial love that God shows us. Joy is deeper than happiness; it is a steady assurance of God’s presence. Peace is inner calm and reconciliation with God and others. Patience is the ability to endure difficult circumstances without losing hope. Kindness and goodness are actions that benefit others. Faithfulness is loyalty and trustworthiness. Gentleness is strength under control. Self‑control is the ability to manage one’s desires and impulses.

Christian values guide our behaviour in a complex world. Honesty means always telling the truth, even when it is costly. Integrity is doing the right thing even when no one is watching. Respect for authority includes obeying parents, teachers, and government leaders – provided they do not ask us to disobey God. Empathy is feeling with others and showing compassion for the marginalised: orphans, widows, refugees, the poor, and the sick. The Bible repeatedly calls for care for the vulnerable, as in James 1:27: “Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress.”

Peer pressure is a significant challenge, especially for young people. Friends can influence us to do things we know are wrong. The story of Daniel and his three friends – Shadrach, Meshach, and Abednego – provides a model for resisting negative peer pressure. Taken as captives to Babylon, they were offered the king’s rich food and wine, but they resolved not to defile themselves with food that had been sacrificed to idols. They politely but firmly requested a diet of vegetables and water. God honoured their faithfulness by making them healthier than the others. Later, when commanded to bow down to a golden statue, they refused even under the threat of being thrown into a blazing furnace. God miraculously delivered them, and King Nebuchadnezzar himself praised their God.

The early church described in Acts chapters 2 and 4 provides a model for Christian community. The believers devoted themselves to the apostles’ teaching, fellowship, the breaking of bread, and prayer. They shared their possessions so that no one was in need. They met daily in the temple courts and in homes, praising God and enjoying the favour of all the people. This spirit of generosity, unity, and worship is the blueprint for how Christians should live today. Modern believers are called to live in community, support one another, and be witnesses to the resurrection of Jesus in word and deed.`
    + `\n\nPRACTICE QUESTIONS\n1. The gifts of the Spirit are listed in 1 Corinthians chapter ________.\n2. The first fruit of the Spirit is ________.\n3. Self‑________ is the ninth fruit of the Spirit.\n4. Daniel and his friends refused the king’s food to avoid ________ themselves.\n5. Shadrach, Meshach, and Abednego were thrown into a fiery ________.\n6. The early church shared their ________ so no one was in need.\n7. Empathy means caring for orphans and ________.\n8. Integrity means doing the right thing even when ________ is watching.\n9. Peer pressure can lead people to do what is ________.\n10. The early church met daily in the temple courts and in ________.`
  },
  {
    id: 'assessment',
    title: 'Comprehensive Assessment (Review & Answers)',
    summary: 'Key questions covering all four main topics, with detailed answers for self‑evaluation.',
    body: `COMPREHENSIVE ASSESSMENT – Review of all CRE Topics

1. CREATION: Explain God’s purpose for creating human beings in His image and the responsibility that comes with it. Answer: Humans are created to reflect God’s character, to have a relationship with Him, and to act as stewards over creation – caring for the earth and all living things.
2. ABRAHAM: Why is Abraham called the “father of faith”? Answer: Because he believed God’s promises even when they seemed impossible, obeyed God’s call to leave his homeland without knowing the destination, and was willing to sacrifice his son Isaac, trusting that God could raise the dead.
3. MOSES: What are the two main sections of the Ten Commandments? Answer: The first four concern our relationship with God (vertical); the remaining six concern our relationships with other people (horizontal).
4. DAVID: What quality made David “a man after God’s own heart” despite his sins? Answer: His sincere repentance when confronted with his sin, his deep love for God, and his trust in God’s mercy.
5. JESUS’ BIRTH: Why is it significant that Jesus was born in a manger? Answer: It shows His humility – though He was the King of kings, He identified with the poor and lowly.
6. PARABLES: In the Parable of the Prodigal Son, what does the father’s response teach about God? Answer: God is always ready to forgive and welcome back repentant sinners with love and celebration.
7. CRUCIFIXION: What was the meaning of the temple curtain tearing at Jesus’ death? Answer: It symbolised that the barrier between God and humanity was removed; through Jesus’ sacrifice, all people can now approach God directly.
8. RESURRECTION: Why is the resurrection central to the Christian faith? Answer: It confirms Jesus’ victory over sin and death, validates His divine identity, and gives believers hope of eternal life.
9. FRUITS OF THE SPIRIT: Name all nine fruits. Answer: Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self‑control.
10. EARLY CHURCH: What can modern Christians learn from the early church in Acts? Answer: The importance of community, sharing resources, regular worship, and being a witness to Christ.`
    + `\n\nSELF‑TEST QUESTIONS\n1. God created humans in His own ________.\n2. Abraham was willing to sacrifice his son ________.\n3. The Passover lamb’s blood was placed on the ________.\n4. David’s great sin involved Bathsheba and ________.\n5. Jesus was born in ________, the city of David.\n6. The Good Samaritan helped a man who had been ________.\n7. Jesus rose from the dead on the ________ day.\n8. The Holy Spirit gives ________ and fruits.\n9. The early church shared their ________.\n10. The Great Commission tells us to go into all the ________.`
  }
]

function Grade5CRENotes() {
  const [search, setSearch] = useState('')
  const filtered = CRE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Christian Religious Education – Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Creation, OT leaders, Jesus' life, Christian living – with 10 practice blanks each</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>
            {t.body.split('\n\n').map((p,i) => <p key={i} style={{marginBottom:'14px'}}>{p}</p>)}
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== ISLAMIC RELIGIOUS EDUCATION ====================
const IRE_TOPICS = [
  {
    id: 'quran',
    title: 'Quranic Studies (Al‑Quran)',
    summary: 'Surah Al‑Maun, Al‑Fil, Al‑Qadr, Al‑Asr – themes, translation, tajweed basics.',
    body: `QURANIC STUDIES – The Final Revelation

The Holy Quran is the exact word of Allah, revealed to the Prophet Muhammad (peace be upon him) through the Angel Jibril over 23 years. It contains 114 chapters (surahs), each with its own name and theme. Muslims believe the Quran is the ultimate and preserved guidance for all humanity. Reciting, understanding, and implementing its teachings are central to Islamic life.

Surah Al‑Maun (Chapter 107) – “The Small Kindnesses” or “The Neighborly Needs”
This surah consists of 7 short verses revealed in Makkah. It addresses the core of religious hypocrisy. It begins with a powerful question: “Have you seen the one who denies the Recompense (Day of Judgment)?” The answer is described: such a person drives away the orphan and does not encourage feeding the poor. Then the surah turns to those who perform prayers but are heedless – they pray to be seen by others, but they refuse even the smallest acts of kindness. The word “Maun” refers to small household items that neighbors commonly borrow, like a cooking pot or a tool. The surah teaches that true faith must be expressed through compassion, charity, and genuine care for others. Empty rituals without kindness are rejected by Allah.

Surah Al‑Fil (Chapter 105) – “The Elephant”
This surah recounts a historical event that occurred around 570 CE, the year of the Prophet Muhammad’s birth. Abrahah, the Christian governor of Yemen, built a grand cathedral in Sana’a and intended to make it the center of pilgrimage, diverting people from the Kaaba in Makkah. When his plans failed, he marched with a large army that included war elephants toward Makkah, intending to destroy the Kaaba. Allah sent flocks of birds (Ababil) that carried small stones of baked clay. The birds dropped these stones on the army, destroying them completely. Abrahah’s mighty force was rendered like “straw eaten up” by cattle. This miracle demonstrated that Allah alone protects His sacred house, and no worldly power can succeed against His will.

Surah Al‑Qadr (Chapter 97) – “The Night of Decree”
This surah, with only 5 verses, describes the majesty of Laylatul Qadr – the Night of Power or Decree. It was on this night that the Quran was first revealed from the Preserved Tablet (Al‑Lawh Al‑Mahfuz) to the lowest heaven. The surah declares that this night is better than a thousand months (over 83 years of continuous worship). On this blessed night, angels descend with the permission of their Lord for every matter. There is peace until the break of dawn. Laylatul Qadr occurs during one of the odd nights of the last ten days of Ramadhan, and Muslims seek it through extra prayers (Taraweeh, Tahajjud), Quran recitation, and supplication.

Surah Al‑Asr (Chapter 103) – “The Time”
This is one of the shortest surahs in the Quran, with only 3 verses, yet it contains a complete formula for human success. Allah swears by “time” (Al‑Asr), emphasizing its precious and fleeting nature. The surah states that all of humanity is in a state of loss – wasting their lives in pursuit of worldly gains that ultimately perish. However, there are four exceptions, four qualities that save a person from this loss: (1) True faith (Iman), (2) Righteous deeds (Amal Salih), (3) Enjoining one another to truth (Tawasi bil‑Haqq), and (4) Enjoining one another to patience (Tawasi bis‑Sabr). These four together form the path to eternal success.

Tajweed Basics – Proper Quran Recitation
Reciting the Quran correctly is an obligation. Tajweed refers to the rules governing pronunciation during recitation. Important rules include:
- Makharij (Articulation Points): Each Arabic letter must be pronounced from its exact origin in the throat, tongue, lips, or nasal cavity.
- Madd (Elongation): Certain letters are elongated for specific counts (2, 4, or 6 beats). For example, Madd letters are Alif, Waw, and Ya preceded by the corresponding short vowels.
- Ghunnah (Nasalisation): Sounds that pass through the nose, such as the letters Noon and Meem when certain conditions apply.
- Idgham, Iqlab, Ikhfa, and Izhar are rules for how letters interact when they meet, particularly regarding the Noon Sakinah and Tanween.`
    + `\n\nPRACTICE QUESTIONS\n1. The Quran was revealed through the Angel ________.\n2. Surah Al‑Maun condemns those who neglect ________.\n3. The army destroyed in Surah Al‑Fil was led by ________.\n4. The birds that dropped stones were called ________.\n5. Laylatul Qadr is better than ________ thousand months.\n6. Surah Al‑Asr begins with an oath by ________.\n7. The four qualities in Surah Al‑Asr are faith, good deeds, truth, and ________.\n8. The rules for proper Quran recitation are called ________.\n9. The articulation points of letters are called ________.\n10. Madd refers to ________ of letters.`
  },
  {
    id: 'hadith',
    title: 'Hadith (Prophetic Traditions)',
    summary: 'Sayings on cleanliness, manners, respect, and kindness to animals.',
    body: `HADITH – The Sayings of the Prophet Muhammad (PBUH)

The Hadith are the recorded sayings, actions, and approvals of Prophet Muhammad (peace be upon him). They are the second source of Islamic law after the Quran, providing explanation and practical application of Quranic teachings. The most authentic collections are Sahih Bukhari and Sahih Muslim, compiled by Imam Bukhari and Imam Muslim respectively.

Hadith on Cleanliness
The Prophet (PBUH) said: “Cleanliness is half of faith (Iman).” (Sahih Muslim). This profound statement links physical purity with spiritual purity. Islam requires Muslims to maintain bodily hygiene, to keep their clothes and surroundings clean, and to perform ritual purification (Wudhu) before prayer. The Prophet also emphasized cleanliness of the heart – being free from envy, hatred, arrogance, and other spiritual impurities. External cleanliness reflects internal purity.

Hadith on Manners and Respect
The Prophet said: “The best among you are those who have the best manners and character.” (Sahih Bukhari). Good manners include respecting parents and elders, showing mercy to children, speaking truthfully, keeping promises, and avoiding harmful speech. The Prophet emphasized the importance of honoring one's parents, declaring that Paradise lies at the feet of mothers. He also taught that a believer does not taunt, curse, or engage in obscene talk.

Gossip (Gheebah) is strictly forbidden. The Prophet described it as “mentioning about your brother what he would dislike.” The Quran compares it to eating the flesh of a dead brother, highlighting its repulsiveness. Muslims are commanded to speak good or remain silent.

Hadith on Kindness to Animals
Islam teaches mercy to all living beings. A famous hadith recounts that a man was forgiven his sins because he gave water to a thirsty dog. He saw a dog panting with extreme thirst, went down into a well, filled his shoe with water, and let the dog drink. Allah appreciated this act and forgave him. Conversely, another hadith tells of a woman who was punished because she confined a cat without providing food or water until it died. These stories illustrate that mercy is rewarded and cruelty is punished, regardless of the recipient.

Another narration states that the Prophet observed a bird fluttering in distress because someone had taken its chicks. He commanded, “Return her chicks to her.” The Prophet prohibited targeting animals for sport and commanded that when an animal is slaughtered for food, it should be done with a sharp knife and minimal pain.`
    + `\n\nPRACTICE QUESTIONS\n1. The sayings of the Prophet are called ________.\n2. The hadith “Cleanliness is half of ________” emphasizes purity.\n3. The most authentic hadith collections are Sahih Bukhari and Sahih ________.\n4. Speaking badly about someone behind their back is called ________.\n5. The man who gave water to a thirsty ________ was forgiven.\n6. A woman was punished for confining a ________ without food.\n7. Smiling at someone is considered an act of ________.\n8. The Prophet said the best among you are those with the best ________.\n9. We should love for others what we love for ________.\n10. Returning chicks to their mother shows ________ to animals.`
  },
  {
    id: 'iman',
    title: 'Pillars of Iman (Faith)',
    summary: 'Belief in Allah (Tawheed), angels, holy books, prophets.',
    body: `PILLARS OF IMAN – The Core Beliefs of Islam

Iman (faith) in Islam is built on six foundational pillars. The first and most important is belief in Allah, the One and Only God. This belief is called Tawheed. Tawheed has three essential categories:

1. Tawheed ar‑Rububiyyah (Oneness of Lordship): Belief that Allah alone is the Creator, Sustainer, Provider, and Controller of the entire universe. He has no partners in these functions. Every atom, every galaxy, every living being is created and sustained by Him.

2. Tawheed al‑Uluhiyyah (Oneness of Worship): Belief that only Allah is worthy of worship. No prayer, sacrifice, supplication, or any act of devotion should be directed to anyone or anything else. Idols, saints, angels, prophets, or natural objects are not to be worshipped.

3. Tawheed al‑Asma wa Sifat (Oneness of Names and Attributes): Belief that Allah has the most beautiful names and perfect attributes, as mentioned in the Quran. These names include Al‑Khaliq (The Creator), Al‑Ghaffar (The All‑Forgiving), Ar‑Razzaq (The Provider), Al‑Malik (The Sovereign King), Al‑Quddus (The Most Holy), As‑Sami’ (The All‑Hearing), Al‑Basir (The All‑Seeing), and Al‑Alim (The All‑Knowing). Muslims believe in these attributes without comparing Allah to His creation.

The second pillar is belief in angels (Malaika). Angels are created from light. They have no free will and obey Allah perfectly. They are neither male nor female. Among the most prominent angels are:
- Jibril (Gabriel): The chief angel responsible for delivering divine revelations to the prophets.
- Mikail (Michael): Responsible for rain, sustenance, and the distribution of provisions.
- Israfil: The angel tasked with blowing the trumpet on the Day of Judgment.
- Malik: The guardian of Hellfire.
- Ridwan: The guardian of Paradise.
- Munkar and Nakir: The angels who question the dead in their graves.
- Raqib and Atid: The recording angels who write down every good and bad deed – Raqib on the right shoulder recording good deeds, Atid on the left recording bad deeds.

The third pillar is belief in the holy books (Kutub). Allah revealed scriptures to guide humanity through different prophets. These include the Suhuf (Scrolls) revealed to Ibrahim, the Taurat (Torah) to Musa, the Zabur (Psalms) to Dawud, the Injeel (Gospel) to Isa, and the final, complete revelation – the Quran – to Muhammad (PBUH). Muslims believe in all of them in their original forms, but the Quran supersedes and preserves the final guidance.

The fourth pillar is belief in the prophets (Anbiya). Allah sent 124,000 prophets to every nation, of whom 25 are mentioned in the Quran. The five greatest (Ulul Azm) are Nuh, Ibrahim, Musa, Isa, and Muhammad (peace be upon them all). Prophet Muhammad is the seal of the prophets – there is no prophet after him.`
    + `\n\nPRACTICE QUESTIONS\n1. The Oneness of Allah in His Lordship is called Tawheed ar‑________.\n2. Al‑Khaliq means The ________.\n3. The angel who delivered revelation to the prophets is ________.\n4. The angel responsible for rain and sustenance is ________.\n5. The angel who will blow the trumpet on the Day of Judgment is ________.\n6. The guardian of Hellfire is ________.\n7. Every person has two ________ angels recording deeds.\n8. The Torah was revealed to Prophet ________.\n9. The Gospel was revealed to Prophet ________.\n10. The final and complete revelation is the ________.`
  },
  {
    id: 'fiqh',
    title: 'Fiqh: Purification and Prayer',
    summary: 'Wudhu (Fardh and Sunnah), Tayammum, Salah conditions, times, rak\'ahs, congregational prayer.',
    body: `FIQH – Islamic Jurisprudence on Purification and Prayer

Ritual purification (Twahara) is a prerequisite for performing Salah (prayer) and other acts of worship. Wudhu (ablution) is the partial washing of specific body parts with clean water.

Fardh (Obligatory) Acts of Wudhu:
If any of these six mandatory acts are missed, the Wudhu is invalid.
1. Intention (Niyyah): Making the internal intention in the heart to perform Wudhu for the purpose of purification. This is not said aloud.
2. Washing the entire face: From the hairline (top of forehead) to the chin, and from earlobe to earlobe.
3. Washing both arms: Including the hands, wrists, and up to the elbows.
4. Wiping a portion of the head: With wet hands, passing them over any part of the head.
5. Washing both feet: Including the ankles and heels.
6. Sequence (Tartib): Performing the above steps in the exact order without long pauses between them.

Sunnah (Recommended) Acts of Wudhu:
These actions bring extra rewards but omitting them does not invalidate Wudhu:
- Saying “Bismillah” (in the Name of Allah) before starting.
- Washing the hands up to the wrists three times first.
- Rinsing the mouth (Madmadah) three times.
- Inhaling water into the nostrils and blowing it out (Istinshaq) three times.
- Wiping the entire head (not just a portion).
- Wiping the outer and inner parts of the ears.
- Washing each part three times instead of once.
- Starting from the right side.

Actions that Invalidate (Nullify) Wudhu:
1. Any discharge from the private passages (urine, feces, gas).
2. Deep sleep that causes loss of awareness.
3. Loss of consciousness through fainting, intoxication, illness, or anesthesia.
4. Direct physical contact with the private organs using the bare palm without a barrier.

Tayammum (Dry Ablution):
When water is unavailable, or its use is harmful (due to illness, extreme cold, or scarcity), Islam allows Tayammum using clean earth or dust. The steps are: strike the palms on clean earth, blow off excess dust, wipe the face, then strike again and wipe the right arm from wrist to elbow, then the left arm.

Salah (The Five Daily Prayers):
Salah is the second pillar of Islam and is obligatory on every sane, adult Muslim. The five prayers and their obligatory rak’ahs are:
- Fajr: 2 rak’ahs, performed at dawn before sunrise.
- Dhuhr: 4 rak’ahs, after the sun passes its zenith.
- Asr: 4 rak’ahs, in the late afternoon.
- Maghrib: 3 rak’ahs, immediately after sunset.
- Isha: 4 rak’ahs, at night after the twilight disappears.
Each prayer must be performed within its specific time window. Muslims face the Qiblah (direction of the Kaaba in Makkah) during prayer. Congregational prayer (Jama’ah) is highly encouraged, especially for men in the mosque. The Imam leads the prayer, and the Ma’mum (followers) follow in rows behind.`
    + `\n\nPRACTICE QUESTIONS\n1. The intention for Wudhu is made in the ________.\n2. Washing the face in Wudhu is a ________ act.\n3. Rinsing the mouth is called ________ and is Sunnah.\n4. Dry ablution using earth is called ________.\n5. Fajr prayer has ________ rak’ahs.\n6. The night prayer is called ________.\n7. Muslims face the ________ during Salah.\n8. The person who leads the prayer is the ________.\n9. Deep sleep ________ Wudhu.\n10. The five daily prayers are called ________.`
  },
  {
    id: 'sirah-akhlaq',
    title: 'Sirah (Prophetic History) and Akhlaq (Morals)',
    summary: 'The Prophet’s life in Makkah, his character, and core Islamic morals.',
    body: `SIRAH – The Life of Prophet Muhammad (PBUH) in Makkah

The Prophet Muhammad (peace be upon him) was born in Makkah in the Year of the Elephant (around 570 CE). His father, Abdullah, died before his birth, and his mother, Amina, died when he was six years old. He was then cared for by his grandfather, Abdul Muttalib, and later by his uncle, Abu Talib.

From a young age, Muhammad was known for his honesty and trustworthiness. He was called “Al‑Amin” (the trustworthy) and “As‑Sadiq” (the truthful). People would entrust him with their belongings, and he never betrayed their trust. As a young man, he worked as a shepherd and later as a merchant. His integrity in business caught the attention of a wealthy widow named Khadijah, who proposed marriage to him. He accepted, and they lived a loving and supportive marriage for 25 years until her death.

At the age of forty, during one of his retreats in the Cave of Hira on the mountain of Nur near Makkah, the Angel Jibril appeared to him and commanded, “Iqra!” – “Read!” or “Recite!” Muhammad was illiterate and could not read, but after the angel’s firm embrace, the first verses of the Quran were revealed: “Read in the name of your Lord who created…” (Surah Al‑Alaq 96:1‑5). This marked the beginning of his prophethood.

The early years of Islam involved secret preaching to close family and friends. The first converts included his wife Khadijah, his young cousin Ali, his friend Abu Bakr, and his freed slave Zaid. After three years, the Prophet was commanded to preach publicly. The Quraysh leaders of Makkah fiercely opposed him, persecuting the early Muslims. Despite the hardships, the Prophet remained patient, forgiving, and steadfast.

AKHLAQ – Islamic Morals
The Prophet embodied the highest moral character. He was truthful (Sidq), so much so that even his enemies acknowledged his honesty. He fulfilled every promise (Amanah) he made. He was generous and hospitable to guests. He treated neighbors with kindness, saying, “Jibril kept advising me about the rights of the neighbor until I thought he would make him an heir.” He visited the sick, fed the hungry, and cared for orphans and widows. He taught that all humans are equal, like the teeth of a comb – no Arab is superior to a non‑Arab, and no white person is superior to a black person, except through piety and good deeds. He forgave his enemies even when he had the power to punish them, as shown when he conquered Makkah and declared a general amnesty. His life is the ultimate example for Muslims to follow.`
    + `\n\nPRACTICE QUESTIONS\n1. The Prophet was born in the city of ________.\n2. His nickname “Al‑Amin” means the ________.\n3. The first revelation occurred in the Cave of ________.\n4. The first word revealed was “________”.\n5. The Prophet’s first wife was ________.\n6. Truthfulness in Islam is called ________.\n7. Fulfilling promises is called ________.\n8. The Prophet conquered Makkah and declared a general ________.\n9. The Prophet said no Arab is superior to a non‑Arab except through ________.\n10. The angel Jibril kept advising about the rights of the ________.`
  }
]

function Grade5IRENotes() {
  const [search, setSearch] = useState('')
  const filtered = IRE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Islamic Religious Education – Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Quran, Hadith, Iman, Fiqh, Sirah & Akhlaq – 10 practice blanks per topic</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>
            {t.body.split('\n\n').map((p,i) => <p key={i} style={{marginBottom:'14px'}}>{p}</p>)}
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== HINDU RELIGIOUS EDUCATION ====================
const HRE_TOPICS = [
  {
    id: 'paramatma',
    title: 'Paramatma – The Supreme Divine Reality',
    summary: 'Nirguna Brahman, Saguna Brahman, Trimurti, Avatars, and the Dashavatara.',
    body: `PARAMATMA – Understanding God in Hinduism

Hinduism teaches that there is one Supreme Being, called Brahman or Paramatma, who is the source, sustainer, and ultimate goal of the entire universe. Brahman is not a distant or indifferent creator; rather, Brahman is the very essence of existence, the reality behind all appearances. To help devotees of different temperaments connect with this Supreme Reality, Hindu philosophy describes Brahman in two complementary ways: Nirguna Brahman and Saguna Brahman.

Nirguna Brahman means “Brahman without attributes” or “the formless Absolute.” This is the understanding of God as pure consciousness, infinite, eternal, unchanging, and beyond all human categories. Nirguna Brahman cannot be described in words or imagined with the mind. It is beyond space, time, and causation. The Upanishads declare that the truest description of Brahman is “Neti, Neti” – “Not this, not this” – because any attempt to limit the Infinite to words or concepts falls short. Realizing Nirguna Brahman is the goal of the path of knowledge (Jnana Yoga), where the seeker meditates deeply to experience the unity of Atman (the individual soul) with Brahman.

However, most people need a personal relationship with God. For this purpose, the same Supreme Brahman is understood as Saguna Brahman – “Brahman with attributes.” God takes on form, qualities, and personality so that devotees can love, worship, and interact with the Divine. Saguna Brahman is not a different God from Nirguna Brahman; it is the same Supreme Reality appearing through the lens of devotion (Bhakti). The various gods and goddesses of Hinduism – Brahma, Vishnu, Shiva, Devi, and others – are all manifestations of Saguna Brahman, each representing different aspects of the One Supreme.

THE TRIMURTI – The Divine Triad
The Trimurti (literally “three forms”) represents the three fundamental cosmic functions of Brahman. Brahma is the Creator. He brings the universe into existence at the beginning of each cosmic cycle. He is depicted with four heads, each facing a different direction, symbolising that he sees all of creation. His four mouths continuously recite the four Vedas, which he revealed. His consort is Saraswati, the goddess of knowledge, music, and the arts. Brahma rides a swan, symbolising wisdom and discrimination.

Vishnu is the Preserver. He sustains the universe and protects it from forces of evil. He is depicted with dark blue skin, holding a conch shell (shankha, representing the primordial sound Om), a discus (chakra, representing the mind), a mace (gada, representing strength), and a lotus (padma, representing purity). He reclines on the cosmic serpent Shesha, floating on the ocean of milk, with Lakshmi, the goddess of wealth and prosperity, at his feet. Vishnu incarnates on Earth whenever dharma (righteousness) declines and adharma (evil) rises.

Shiva is the Transformer or Dissolver. He destroys the universe at the end of each cosmic cycle so that a new creation can emerge. However, Shiva’s destruction is not negative; it is the necessary clearing away of the old to make way for the new. He is often depicted as a yogi meditating on Mount Kailash, with matted hair, a crescent moon on his head, and the Ganges River flowing from his locks. He holds a trident (trishul) and a small drum (damaru). His consort is Parvati, who appears in many forms including Durga (the warrior goddess) and Kali (the goddess of time). Shiva’s cosmic dance, the Tandava, represents the rhythm of creation and destruction.

AVATARS – Divine Incarnations
The concept of avatars is central to Vaishnavism (the worship of Vishnu). An avatar is a deliberate descent of the Supreme Being into the material world to restore dharma. The Bhagavad Gita (Chapter 4, verses 7‑8) records Lord Krishna’s promise: “Whenever there is a decline in righteousness and a rise in unrighteousness, O Arjuna, then I manifest Myself. For the protection of the good and the destruction of the wicked, and for the establishment of dharma, I am born in every age.”

The Dashavatara lists the ten major incarnations of Vishnu:
1. Matsya (the Fish) – saved the first man, Manu, and the Vedas from a great flood.
2. Kurma (the Tortoise) – supported Mount Mandara during the churning of the ocean.
3. Varaha (the Boar) – rescued the Earth (Bhumidevi) from the demon Hiranyaksha who had submerged it in the cosmic ocean.
4. Narasimha (the half‑Man, half‑Lion) – emerged from a pillar to kill the tyrant demon Hiranyakashipu, who could not be killed by man or beast, inside or outside, during day or night. Narasimha killed him at twilight on the threshold of a doorway.
5. Vamana (the Dwarf) – appeared to humble the demon king Bali, who had conquered the three worlds. Vamana asked for three paces of land, then grew to cosmic size, covering heaven and earth in two steps, and placing the third on Bali’s head.
6. Parashurama (the Warrior with an Axe) – appeared to rid the world of corrupt kshatriyas (warrior‑class rulers) who had abandoned dharma.
7. Rama – the hero of the Ramayana, the ideal king, son, husband, and warrior.
8. Krishna – the divine teacher of the Bhagavad Gita, the central figure of the Mahabharata.
9. Buddha – some traditions list Gautama Buddha as the ninth avatar, emphasising compassion and non‑violence.
10. Kalki – the future avatar, who will appear at the end of the current age (Kali Yuga) riding a white horse, wielding a flaming sword, to destroy evil and usher in a new age of truth.

Rama and Krishna are the most widely worshipped avatars. Rama’s life demonstrates perfect adherence to dharma even in the face of immense personal suffering. Krishna’s teachings in the Bhagavad Gita provide the philosophical foundation for Hindu ethics and spirituality.`
    + `\n\nPRACTICE QUESTIONS (Fill in the blanks)\n1. The formless, infinite aspect of God is called ________ Brahman.\n2. The aspect of God with forms and attributes is called ________ Brahman.\n3. The three cosmic functions are Creation, Preservation, and ________.\n4. The Creator in the Trimurti is ________.\n5. The consort of Vishnu is ________.\n6. Lord Vishnu incarnates on Earth when ________ declines.\n7. The hero of the Ramayana is Lord ________.\n8. The divine teacher of the Bhagavad Gita is Lord ________.\n9. The Dashavatara lists ________ major incarnations of Vishnu.\n10. The future avatar who will appear at the end of Kali Yuga is ________.`
  },
  {
    id: 'scriptures',
    title: 'Holy Scriptures (Granthas)',
    summary: 'Classification of Shruti and Smriti, the Vedas, Upanishads, Ramayana, Mahabharata, and the Bhagavad Gita.',
    body: `HOLY SCRIPTURES – The Granthas of Sanatana Dharma

Hindu scriptures are among the oldest religious texts in the world. They encompass a vast body of literature spanning philosophy, ritual, mythology, law, and devotion. Traditionally, these scriptures are classified into two broad categories: Shruti and Smriti.

SHRUTI – “That Which Is Heard”
Shruti texts are considered eternal, unauthored, and divinely revealed. They were “heard” by ancient sages (rishis) in deep states of meditation and passed down orally with extraordinary precision for thousands of years before being written down.

The four Vedas form the core of Shruti:
- Rig Veda: The oldest Veda, containing 1,028 hymns (suktas) divided into ten books (mandalas). The hymns are addressed to various deities, including Agni (fire), Indra (warrior god), Surya (sun), and Ushas (dawn). They praise cosmic order (Rita) and express profound philosophical insights about creation.
- Yajur Veda: The “Veda of Sacrificial Formulas,” containing prose mantras and instructions for performing rituals (yajnas). It has two recensions: the Shukla (White) Yajur Veda and the Krishna (Black) Yajur Veda.
- Sama Veda: The “Veda of Melodies,” setting many of the Rig Veda’s hymns to music. It is the foundation of Indian classical music.
- Atharva Veda: The “Veda of the Atharvans,” containing hymns for daily life – healing spells, protection charms, marriage rituals, and philosophical reflections.

Each Veda has four layers:
1. Samhitas – the core collection of mantras and hymns.
2. Brahmanas – prose texts explaining the rituals.
3. Aranyakas – “forest texts” for hermits, bridging ritual and philosophy.
4. Upanishads – the philosophical culmination, exploring the nature of Brahman, Atman, and liberation (moksha).

The Upanishads are also called Vedanta (the end of the Vedas) because they form the concluding portions. There are over 200 Upanishads, but the principal ones are about 10 to 13. They teach that Atman (the individual soul) is identical to Brahman (the Supreme Soul). Famous mahavakyas (great sayings) from the Upanishads include: “Tat Tvam Asi” (That Thou Art), “Aham Brahmasmi” (I am Brahman), and “Ayam Atma Brahma” (This Self is Brahman).

SMRITI – “That Which Is Remembered”
Smriti texts are composed by human authors, based on memory and tradition. They include the Itihasas (epics), Puranas (ancient stories), Dharma Shastras (law codes), and Sutras (aphorisms).

The Ramayana, authored by the sage Valmiki, is considered the Adi Kavya (first poem). It contains 24,000 verses divided into seven Kandas (books): Bala Kanda (childhood), Ayodhya Kanda (the city of Ayodhya), Aranya Kanda (the forest), Kishkindha Kanda (the monkey kingdom), Sundara Kanda (the beautiful section – Hanuman’s leap to Lanka), Yuddha Kanda (the war), and Uttara Kanda (the later events). The epic tells the story of Lord Rama, the prince of Ayodhya, who is exiled for fourteen years due to palace intrigue. During his exile, his wife Sita is abducted by the demon king Ravana. With the help of Hanuman and an army of vanaras (monkeys), Rama wages war against Ravana and rescues Sita. The Ramayana teaches ideals of duty (dharma), loyalty, courage, and the ultimate victory of good over evil.

The Mahabharata is the longest epic poem in the world, with over 100,000 verses divided into 18 Parvas (books). It was composed by the sage Vyasa and written down by Lord Ganesha. The epic recounts the story of the Kuru dynasty, focusing on the conflict between two branches of the family: the Pandavas (five brothers led by Yudhishthira) and the Kauravas (one hundred brothers led by Duryodhana). This conflict culminates in the devastating 18‑day war of Kurukshetra. The Mahabharata is not merely a war story; it is a vast encyclopedia of Hindu philosophy, ethics, politics, and culture. It contains numerous sub‑stories and discourses, the most famous of which is the Bhagavad Gita.

The Bhagavad Gita (the Song of God) is a dialogue of 700 verses in 18 chapters. It occurs on the battlefield of Kurukshetra, just before the war begins. The great warrior Arjuna is paralysed by a moral dilemma: he does not want to kill his own relatives, teachers, and friends, even though they are on the opposing side. He turns to his charioteer, Lord Krishna, for guidance. Krishna’s response forms the Gita. He teaches three paths to liberation: Karma Yoga (the path of selfless action – performing one’s duty without attachment to results), Bhakti Yoga (the path of devotion – surrendering to God with love), and Jnana Yoga (the path of knowledge – understanding the true nature of the Self). The central teaching is Nishkama Karma: act selflessly, dedicating all actions to God, without obsession with success or failure. The Gita also contains a magnificent vision of Krishna’s cosmic form (Vishvarupa), revealing his identity as the Supreme Being who contains all universes.

The Puranas are eighteen major texts containing stories of gods, sages, and kings, along with cosmology, genealogies, and religious practices. The most important Puranas include the Vishnu Purana, Shiva Purana, Bhagavata Purana, and Devi Bhagavata Purana. The Dharma Shastras, particularly the Manusmriti, provide codes of law and conduct. The Sutras are concise aphoristic texts on philosophy, ritual, and grammar.`
    + `\n\nPRACTICE QUESTIONS\n1. Scriptures that were “heard” by rishis are called ________.\n2. The oldest Veda is the ________ Veda.\n3. The philosophical texts at the end of the Vedas are the ________.\n4. Scriptures that were “remembered” are called ________.\n5. The Ramayana was written by Sage ________.\n6. The Mahabharata was written by Sage ________.\n7. The Bhagavad Gita has ________ verses.\n8. The three paths taught in the Gita are Karma, Bhakti, and ________.\n9. The vision of Krishna’s universal form is called ________.\n10. Performing duty without attachment to results is called ________ Karma.`
  },
  {
    id: 'sadachar',
    title: 'Sadachar – Righteous Living and Karma',
    summary: 'The law of Karma, the Five Yamas, the Five Niyamas, and ethical living.',
    body: `SADACHAR – Righteous Conduct in Hinduism

The concept of Karma is one of the most fundamental and distinctive teachings of Hinduism. The word “Karma” literally means “action” or “deed.” It refers to the universal law of cause and effect: every action – whether physical, verbal, or mental – produces a corresponding result. There are three types of karma: Sanchita Karma (accumulated past actions from all previous lives), Prarabdha Karma (the portion of accumulated karma that has begun to bear fruit and determines the circumstances of this life), and Kriyamana Karma (actions currently being performed that will bear fruit in the future). Karma is not fate or predestination; it is created by our own free will. Every moment, we are generating new karma through our choices. This empowers us to take responsibility for our lives. By performing good actions, we create positive karma that leads to happiness; by avoiding harmful actions, we prevent negative karma that leads to suffering.

The effects of karma may not be immediate. Some karma bears fruit within the same lifetime; some in future lifetimes. This explains the inequalities of birth: a child born into poverty or privilege is experiencing the results of past karma. However, past karma does not determine the future. Through conscious effort, we can transcend past patterns and achieve liberation (moksha) from the cycle of birth and death (samsara).

To guide human conduct and create good karma, Hindu ethics prescribes a system of Yamas and Niyamas, described by the sage Patanjali in the Yoga Sutras as the first two limbs of Ashtanga Yoga. The Yamas are ethical restraints – things we should not do. The Niyamas are positive observances – things we should do. Together, they form the foundation of sadachar (righteous living).

THE FIVE YAMAS (Ethical Restraints)
1. Ahimsa (Non‑violence): This is the supreme ethical principle. Ahimsa means not causing harm to any living being through thought, word, or deed. It extends to all creatures, which is why many Hindus practice vegetarianism. Ahimsa requires us to cultivate compassion, gentleness, and respect for all life. Mahatma Gandhi applied Ahimsa as a powerful force for social change, leading India to independence through non‑violent resistance.

2. Satya (Truthfulness): Satya means being truthful in thought, speech, and action. One should speak the truth, but always with kindness. The Mahabharata says: “Speak the truth, speak what is pleasant. Do not speak unpleasant truth. Do not speak pleasant falsehood.” Truth must be tempered by Ahimsa.

3. Asteya (Non‑stealing): Asteya means not taking what does not belong to us. This includes material possessions, but also intangible things like credit for someone else’s work, someone’s time, or opportunities.

4. Brahmacharya (Purity / Self‑control): Traditionally, this meant celibacy for monks. For laypeople, it means practising moderation, faithfulness in marriage, and controlling sensual desires. It is the conservation of vital energy for spiritual growth.

5. Aparigraha (Non‑greed / Non‑possessiveness): Aparigraha means not hoarding or being overly attached to material things. It encourages living simply and taking only what is necessary, leaving the rest for others and for nature.

THE FIVE NIYAMAS (Positive Observances)
1. Shaucha (Cleanliness): Both external cleanliness of the body and environment, and internal cleanliness of the mind through positive thoughts.
2. Santosha (Contentment): Being satisfied with what one has, not constantly craving more. Contentment brings peace.
3. Tapas (Discipline / Austerity): Practising self‑discipline, enduring hardships for a higher purpose, and cultivating willpower.
4. Svadhyaya (Self‑study): Studying sacred scriptures and reflecting on oneself to understand one’s true nature.
5. Ishvara Pranidhana (Surrender to God): Dedicating all actions to God, trusting in the Divine will, and surrendering the ego.`
    + `\n\nPRACTICE QUESTIONS\n1. Karma literally means ________.\n2. The universal law of cause and effect is the law of ________.\n3. Ahimsa means ________.\n4. The practice of truthfulness is called ________.\n5. Non‑stealing is called ________.\n6. Self‑control or purity is called ________.\n7. Non‑possessiveness is called ________.\n8. The Yamas are ethical ________.\n9. The Niyamas are positive ________.\n10. Surrender to God is called ________.`
  },
  {
    id: 'festivals',
    title: 'Major Festivals, Worship, and Sacred Spaces',
    summary: 'Diwali, Janmashtami, Holi, the structure of a Mandir, daily Puja, and Prasad.',
    body: `MAJOR FESTIVALS – Celebration of Divine and Cosmic Events

Hinduism is a religion rich in festivals, each celebrating a divine event, a seasonal change, or a moral victory. Festivals bring communities together, reinforce values, and provide joy and spiritual upliftment.

DIWALI (Deepavali) – The Festival of Lights
Diwali is the most widely celebrated Hindu festival, usually falling in October or November. The name “Deepavali” means “a row of lights.” The festival spans five days. The third day, the darkest night of the lunar month Kartika, is the main celebration. People clean and decorate their homes, light rows of oil lamps (diyas), create colourful rangoli (floor patterns made with coloured powder or rice), burst firecrackers, and exchange sweets and gifts. Diwali has multiple significances: in North India, it celebrates the return of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile, with the citizens lighting lamps to welcome them home. In South India, it celebrates Lord Krishna’s defeat of the demon Narakasura. For business communities, it marks the new financial year, and Goddess Lakshmi is worshipped for prosperity. Diwali symbolises the eternal victory of light over darkness, knowledge over ignorance, good over evil, and hope over despair.

JANMASHTAMI – The Birth of Lord Krishna
Janmashtami is celebrated in August/September on the eighth day (Ashtami) of the dark fortnight in the month of Shravana. It commemorates the birth of Lord Krishna at midnight in Mathura. Krishna was born in a prison cell where his parents, Devaki and Vasudeva, were held by the tyrant King Kamsa. Miraculously, at his birth, the prison doors unlocked, the guards fell asleep, and Vasudeva carried baby Krishna across the Yamuna River to safety in Gokul. Devotees fast through the day, sing bhajans, and stay awake until midnight, when the birth is celebrated with great joy. A popular tradition is Dahi Handi, where young men form human pyramids to break a pot of curd hung high – mimicking young Krishna’s mischievous stealing of butter from the homes of Gokul. Temples and homes are decorated, and stories of Krishna’s childhood (Bal Leela) are recited.

HOLI – The Festival of Colours
Holi is the spring festival, celebrated at the end of February or March. It marks the end of winter and the beginning of spring. There are two main aspects: Holika Dahan, the night before Holi, when bonfires are lit to symbolise the burning of the demoness Holika, who tried to kill her nephew Prahlada, a devotee of Lord Vishnu. Prahlada’s devotion saved him, while Holika was consumed by the fire. This represents the victory of devotion over evil. The next day, Rangwali Holi, people of all ages take to the streets and throw coloured powders (gulal) and water on each other. Social distinctions are temporarily erased; enemies reconcile; and everyone celebrates together in a spirit of joy, forgiveness, and unity. Special sweets like gujiya are prepared and shared. Holi’s colours represent the diversity and beauty of life.

THE MANDIR – The Sacred Temple
The Mandir (Hindu temple) is not just a building; it is the dwelling place of the Divine on earth. Its architecture is based on sacred principles. The most important part of the Mandir is the Garbhagriha (womb‑chamber), the innermost sanctum where the main deity’s murti (sacred image or icon) resides. The Garbhagriha is typically a small, dark, quiet room that represents the heart of the devotee where God dwells. Above it rises the Shikhara (spire or tower), which represents Mount Meru, the mythical cosmic mountain at the centre of the universe. The Mandir often has a Mandapa (hall) where devotees gather for prayers and discourses. Temples are built according to the principles of Vastu Shastra (sacred architecture) and are aligned to astronomical directions. Major temples are places of pilgrimage (tirtha).

DAILY PUJA – Worship at Home and Temple
Puja is the ritual of worship. It can be simple or elaborate. A typical daily home puja involves waking the deity (by ringing a bell), bathing and dressing the murti (if it is a small personal deity), lighting a diya (oil lamp) and incense sticks (agarbatti), offering fresh flowers, fruits, water, and naivedya (food). The devotee chants mantras (sacred syllables), recites the names of God (japa), and performs Aarti – the waving of a lighted lamp in a circular motion before the deity while singing hymns. The Aarti lamp is then passed to all present, who pass their hands over the flame and touch their eyes, receiving blessings. Prasad is food that has been offered to the deity and is then distributed. It is considered consecrated by divine grace. Eating prasad is a sacred act, and it is shared among all present regardless of caste, class, or background, symbolising equality in the eyes of God. Other common puja items include kumkum (red powder for tilak), sandalwood paste, and sacred ash (vibhuti).`
    + `\n\nPRACTICE QUESTIONS\n1. Diwali is the festival of ________.\n2. Diwali celebrates the return of Lord ________ to Ayodhya.\n3. Oil lamps lit during Diwali are called ________.\n4. Janmashtami celebrates the birth of Lord ________.\n5. The pot of curd broken during Janmashtami is called ________ Handi.\n6. Holi is the festival of ________.\n7. The night before Holi, bonfires burn the demoness ________.\n8. The innermost sanctum of a temple is the ________.\n9. The waving of a lamp before the deity is called ________.\n10. Consecrated food distributed after worship is called ________.`
  }
]

function Grade5HRENotes() {
  const [search, setSearch] = useState('')
  const filtered = HRE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Hindu Religious Education – Ultra‑Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Paramatma, Scriptures, Sadachar, Festivals & Worship – 10 practice blanks per topic</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>
            {t.body.split('\n\n').map((p,i) => <p key={i} style={{marginBottom:'14px'}}>{p}</p>)}
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== SUPPLEMENTARY SUBJECTS ====================
const SUPP_TOPICS = [
  // ==================== VISUAL ARTS ====================
  {
    id: 'va-elements',
    title: 'Visual Arts – Elements of Art',
    summary: 'Line, shape, form, color, value, texture, space – the building blocks of visual expression.',
    body: `ELEMENTS OF ART – The Language of Visual Expression

Every work of art, from a simple sketch to a complex painting, is built from seven fundamental elements. Understanding these elements allows us to describe, analyse, and create art with greater skill.

LINE is the path made by a moving point. Lines can be straight, curved, zigzag, wavy, thin, thick, dashed, or dotted. They define edges, create movement, and suggest emotion. Horizontal lines often feel calm, like the horizon; vertical lines suggest strength and stability; diagonal lines create a sense of action or tension. In drawing, contour lines outline shapes; hatching uses parallel lines to create shading.

SHAPE is a two‑dimensional enclosed area. Shapes can be geometric (precise, like circles, squares, triangles) or organic (free‑form, found in nature like leaves and clouds). Shapes are flat and have only height and width. In a painting, shapes are created when lines connect or when areas of colour contrast with the background.

FORM is a three‑dimensional object that has height, width, and depth. In two‑dimensional art, form is created through shading, perspective, and highlights that give the illusion of three dimensions. A sphere is the form of a circle; a cube is the form of a square. Sculpture, ceramics, and architecture are all art forms that deal with actual three‑dimensional form.

COLOUR is perceived when light reflects off objects and enters our eyes. Colour has three properties: hue (the name of the colour, e.g., red, blue), value (lightness or darkness of a colour), and intensity (brightness or dullness). The colour wheel organises hues: primary colours (red, yellow, blue) cannot be made by mixing; secondary colours (orange, green, purple) are made by mixing two primaries; tertiary colours mix a primary with a neighbouring secondary. Complementary colours (opposite on the wheel, like red and green) create strong contrast. Analogous colours (side by side, like blue, blue‑green, green) create harmony. Warm colours (reds, oranges, yellows) advance toward the viewer; cool colours (blues, greens, purples) recede.

VALUE is the lightness or darkness of a colour or of grey. Value creates depth, volume, and emphasis. A light area draws attention; dark areas create shadows and mystery. In drawing, value is built through shading techniques: hatching, cross‑hatching, stippling (dots), and blending. Artists use a value scale from pure white to pure black, with many greys in between.

TEXTURE is the surface quality of an object – how it feels or looks like it would feel. Actual texture can be felt by touch (rough bark, smooth glass). Implied texture is the visual illusion of texture created through drawing or painting techniques (e.g., drawing the roughness of a rock, the softness of fur).

SPACE is the area around, between, and within objects. Positive space is the subject itself; negative space is the empty area around it. Both are equally important in composition. The illusion of depth on a flat surface is created through perspective – overlapping, size variation (closer objects larger), placement on the picture plane (higher = farther), and atmospheric perspective (distant objects are lighter and bluer).`
    + `\n\nPRACTICE QUESTIONS\n1. The path made by a moving point is a ________.\n2. A shape that is free‑form and irregular is called ________.\n3. The three‑dimensional version of a circle is a ________.\n4. The lightness or darkness of a colour is its ________.\n5. Colours opposite on the colour wheel are called ________.\n6. Blue, green, and purple are ________ colours.\n7. The surface quality of an object is its ________.\n8. The empty area around a subject is called ________ space.\n9. Creating depth by making distant objects lighter is ________ perspective.\n10. Red, yellow, and blue are the ________ colours.`
  },
  {
    id: 'va-history',
    title: 'Visual Arts – Art History and Techniques',
    summary: 'Major art movements, cultural art forms, and practical art techniques.',
    body: `ART HISTORY AND TECHNIQUES – A Global Perspective

Art reflects the culture, beliefs, and history of its creators. Understanding art history helps us appreciate the diversity of human expression and the evolution of artistic ideas.

PREHISTORIC AND ANCIENT ART – The earliest known art dates back tens of thousands of years. Cave paintings in Lascaux, France and Altamira, Spain depict animals, hunting scenes, and handprints, created with natural pigments like charcoal and ochre. These works likely had ritual or storytelling purposes. Ancient Egyptian art spanned over 3,000 years and was deeply tied to religion and the afterlife. It is characterised by hierarchical proportion (more important figures drawn larger), composite view (head in profile, eye frontal, shoulders frontal, legs profile), and the use of registers (horizontal bands to organise scenes). Temples and pyramids were decorated with reliefs and paintings depicting gods, pharaohs, and the journey to the afterlife.

CLASSICAL ART – Ancient Greek and Roman art established ideals of beauty, harmony, and proportion that influenced Western art for centuries. Greek sculpture evolved from stiff Archaic kouroi to the naturalistic, contrapposto poses of the Classical period (e.g., the Discus Thrower) and the emotional Hellenistic period (e.g., Laocoön and His Sons). The Parthenon exemplifies Greek architecture with its Doric columns and optical refinements. Romans adopted Greek styles but excelled in realistic portraiture, monumental architecture (Colosseum, aqueducts), and mosaics.

IMPRESSIONISM AND POST‑IMPRESSIONISM – In the late 19th century, artists like Claude Monet, Pierre‑Auguste Renoir, and Edgar Degas rejected the rigid academic style. Impressionists focused on capturing fleeting moments – the play of light, movement, and atmosphere. They painted outdoors (en plein air) using quick, visible brushstrokes and pure, unmixed colours. Post‑Impressionists like Vincent van Gogh, Paul Cézanne, and Georges Seurat extended these experiments. Van Gogh expressed emotion through swirling, vibrant brushstrokes and intense colour. Seurat developed Pointillism, applying tiny dots of pure colour that blend in the viewer’s eye.

AFRICAN ART – Traditional African art is diverse and deeply connected to spirituality, community, and identity. Masks are central to many cultures, used in ceremonies, initiations, and storytelling. Sculptures in wood, bronze (e.g., Benin Bronzes), and ivory often represent ancestors, deities, or idealised human forms. Textiles like kente cloth (Ghana) and mud cloth (Mali) carry symbolic patterns. Rock paintings in the Sahara and Southern Africa record ancient life. African art emphasises abstraction, stylisation, and rhythm rather than strict realism.

PRACTICAL TECHNIQUES – Artists employ various techniques to realise their visions. Sketching is a quick, loose drawing that captures the essential shapes and movement. Shading creates value through hatching (parallel lines), cross‑hatching (intersecting lines), stippling (dots), and blending (smooth transitions). Printmaking transfers an image from a prepared surface (woodblock, metal plate, screen) onto paper. Relief printing (woodcut, linocut) involves carving away areas so the raised surface prints. Sculpture can be subtractive (carving from stone or wood) or additive (modelling in clay and casting in bronze). Painting media include watercolour (transparent washes), acrylic (fast‑drying, versatile), and oil (slow‑drying, rich colours).`
    + `\n\nPRACTICE QUESTIONS\n1. Cave paintings in Lascaux, France date to ________ times.\n2. Egyptian art used ________ proportion, making important figures larger.\n3. The Greek ideal of beauty was based on ________ and proportion.\n4. Impressionists painted outdoors, a technique called ________.\n5. Vincent van Gogh expressed ________ through swirling brushstrokes.\n6. African masks are often used in ________ and initiations.\n7. Parallel lines used for shading are called ________.\n8. Carving away areas in a woodblock is ________ printing.\n9. A transparent painting medium is ________.\n10. The Benin Bronzes are a famous example of African ________ art.`
  },
  // ==================== MUSIC ====================
  {
    id: 'music-theory',
    title: 'Music – Theory and Notation',
    summary: 'Staff, clefs, note values, time signatures, scales, intervals, and key signatures.',
    body: `MUSIC THEORY – The Written Language of Sound

Music is sound organised in time. To communicate musical ideas, composers and performers use a system of notation. The staff consists of five horizontal lines and four spaces, each representing a different pitch. The treble clef (G clef) curls around the second line, indicating that this line is the note G above middle C. The bass clef (F clef) places the note F on the fourth line. Together, the grand staff (treble and bass staves joined by a brace) covers the full range of many instruments.

Note values indicate the duration of a sound. In 4/4 time: a whole note (semibreve) lasts 4 beats; a half note (minim) lasts 2 beats; a quarter note (crotchet) lasts 1 beat; an eighth note (quaver) lasts half a beat; a sixteenth note (semiquaver) lasts a quarter beat. Each note has an equivalent rest (silence) of the same duration. A dot after a note adds half the note’s original value. Ties and slurs connect notes: a tie joins two notes of the same pitch into one longer sound; a slur connects notes of different pitches to be played smoothly (legato).

Time signatures appear at the beginning of a piece, after the clef. The top number tells how many beats are in each measure (bar). The bottom number tells which note value receives one beat. Common time (4/4, often written as C) has four quarter‑note beats per measure. 3/4 time (waltz time) has three beats per measure. 6/8 time has six eighth‑note beats, typically grouped into two groups of three, giving a compound duple feel. Measures are separated by bar lines; a double bar line marks the end.

Scales are patterns of whole steps (tones) and half steps (semitones) ascending or descending within an octave. The major scale follows the pattern: W‑W‑H‑W‑W‑W‑H (e.g., C‑D‑E‑F‑G‑A‑B‑C, all white keys). The natural minor scale follows: W‑H‑W‑W‑H‑W‑W (e.g., A‑B‑C‑D‑E‑F‑G‑A). The chromatic scale includes all twelve half steps within an octave (all black and white keys). An interval is the distance between two notes, measured in half steps. Common intervals: unison (same note), second, third, fourth, fifth, sixth, seventh, octave. Perfect intervals (unison, fourth, fifth, octave) have a pure, open sound; major/minor intervals create different colours.

Key signatures indicate which notes are consistently sharped or flatted throughout a piece. They appear after the clef, before the time signature. The order of sharps is F‑C‑G‑D‑A‑E‑B; the order of flats is B‑E‑A‑D‑G‑C‑F (reverse of sharps). Each key signature corresponds to a major key and its relative minor key (three half steps below). For example, one sharp (F#) indicates G major or E minor.`
    + `\n\nPRACTICE QUESTIONS\n1. The five lines on which music is written form the ________.\n2. The treble clef is also called the ________ clef.\n3. A quarter note receives ________ beat in 4/4 time.\n4. A ________ after a note adds half its value.\n5. 3/4 time has ________ beats per measure.\n6. The pattern of whole and half steps in a major scale is W‑W‑H‑W‑________‑H.\n7. The distance between two notes is an ________.\n8. Sharps or flats at the beginning of a piece form the ________ signature.\n9. One flat indicates the key of ________ major.\n10. The chromatic scale contains all ________ half steps within an octave.`
  },
  {
    id: 'music-genre',
    title: 'Music – Genres, Forms, and Instruments',
    summary: 'Musical genres, structural forms, instrument families, and ensemble types.',
    body: `MUSICAL GENRES, FORMS, AND INSTRUMENTS – The Diversity of Music

Music comes in countless genres, each with distinct characteristics. Classical music spans centuries of Western art music. The Baroque period (1600‑1750) featured composers like Bach and Handel, characterised by ornamentation, harpsichord continuo, and contrapuntal textures (fugues). The Classical period (1750‑1820) with Mozart and Haydn emphasised clarity, balance, and homophonic textures. The Romantic period (1820‑1900) with Beethoven, Chopin, and Tchaikovsky expressed intense emotion, expanded orchestras, and programmatic music (music that tells a story). 20th‑century music saw impressionism (Debussy), atonality (Schoenberg), minimalism (Reich), and jazz influence.

Jazz originated in African‑American communities in New Orleans in the late 19th/early 20th century, blending blues, ragtime, and European harmony. It features swing rhythms, improvisation, and syncopation. Key instruments: trumpet, saxophone, piano, double bass, drums. Folk music is the traditional music of a community, passed orally through generations. It reflects local culture, stories, and work life. Instruments vary by region – fiddles, banjos, accordions, drums, flutes. Pop music is commercial popular music designed for mass appeal, with strong beats, simple melodies, and verse‑chorus structures. Rock music evolved from rock and roll, with electric guitars, strong backbeats, and often rebellious themes.

Musical forms organise a piece into sections. Binary form (AB) has two contrasting sections; each may be repeated. Ternary form (ABA) returns to the first section after a contrasting middle. Rondo form (ABACA) features a recurring main theme alternating with contrasting episodes. Theme and variations takes a melody and alters it in successive variations – changing rhythm, harmony, tempo, instrumentation, or mode. Sonata form (exposition – development – recapitulation) is used in first movements of symphonies and sonatas. The exposition presents two contrasting themes; the development explores and fragments them; the recapitulation restates them in the home key.

Instruments are grouped into families. The orchestra has four main families:
1. STRINGS: violin, viola, cello, double bass, harp. Sound produced by bowing, plucking (pizzicato), or strumming.
2. WOODWINDS: flute, oboe, clarinet, bassoon. Sound produced by blowing across an edge or through a reed. Despite the name, modern instruments may be made of metal or other materials.
3. BRASS: trumpet, French horn, trombone, tuba. Sound produced by buzzing lips into a mouthpiece. Valves or slides change pitch.
4. PERCUSSION: timpani, snare drum, cymbals, xylophone, triangle. Sound produced by striking, shaking, or scraping. Pitched percussion (xylophone, marimba) plays definite notes; unpitched (snare, cymbals) produces indefinite pitch.
Keyboard instruments (piano, organ, harpsichord) can be classified as percussion (piano hammers strike strings) or wind (organ pipes).`
    + `\n\nPRACTICE QUESTIONS\n1. Johann Sebastian Bach was a composer of the ________ period.\n2. Music that tells a story is called ________ music.\n3. A recurring main theme in rondo form alternates with contrasting ________.\n4. The instrument family that includes violin and cello is ________.\n5. The flute belongs to the ________ family.\n6. The trumpet is a ________ instrument.\n7. A timpani is a ________ instrument.\n8. Sonata form has three main sections: exposition, ________, recapitulation.\n9. Jazz originated in ________ in the United States.\n10. Syncopation places accents on the ________ beats.`
  },
  // ==================== THEATRE ====================
  {
    id: 'theatre-basics',
    title: 'Theatre – Performance and Production',
    summary: 'Acting, character development, stagecraft, and the collaborative nature of theatre.',
    body: `THEATRE ARTS – Bringing Stories to Life on Stage

Theatre is a collaborative art form where live performers present an experience to a live audience in a specific space. It combines acting, writing, directing, design, and technology. The script is the written text of a play, containing dialogue (what characters say) and stage directions (instructions for movement, setting, and delivery). The playwright creates this blueprint; the director interprets it and guides the entire production toward a unified vision.

Acting is the art of creating a believable character. An actor uses their voice (pitch, volume, pace, tone, accent) and body (posture, gestures, facial expressions, movement) to communicate the character’s thoughts, emotions, and intentions. Characterisation involves understanding the character’s background (backstory), objectives (what they want), obstacles (what stands in their way), and relationships with other characters. An actor must also listen and react authentically to fellow performers in the moment. Stanislavski’s system emphasises emotional truth: actors draw on their own experiences (emotional memory) to connect genuinely with the character’s feelings.

Blocking is the precise movement and positioning of actors on stage, planned by the director. Stage directions use a specific vocabulary based on the actor’s perspective facing the audience: downstage (toward the audience), upstage (away), stage right (actor’s right), stage left (actor’s left). Centre stage is the focal point. Blocking ensures that important actions are visible, sightlines are clear, and the stage picture is balanced and dynamic. Cross means to move from one area to another; a counter‑cross is a movement to restore balance after another actor moves.

Vocal production is critical. Projection means speaking loudly enough to be heard by the entire audience without shouting – using breath support from the diaphragm. Diction is clear, precise pronunciation of words. Articulation exercises (tongue twisters) improve clarity. An actor’s voice can convey subtext – the unspoken thoughts and feelings beneath the words. Pauses and silence can be as powerful as speech.

The production team includes: the director (artistic leader), stage manager (organises rehearsals and runs the show), set designer (creates the physical environment), lighting designer (uses colour, intensity, angle to create mood and focus), costume designer (dresses characters to reflect period, status, personality), sound designer (creates sound effects and manages amplification), and props master (manages handheld objects). All work together to create a cohesive world.

Theatre spaces vary: proscenium arch (traditional picture‑frame stage), thrust (audience on three sides), arena/theatre‑in‑the‑round (audience on all sides), and black box (flexible space). Each presents unique challenges for staging and design.`
    + `\n\nPRACTICE QUESTIONS\n1. The written text of a play is the ________.\n2. The person who interprets the script and guides the production is the ________.\n3. Moving toward the audience on stage is ________.\n4. The actor’s right facing the audience is stage ________.\n5. Speaking loudly enough to be heard is ________.\n6. Clear pronunciation of words is ________.\n7. The unspoken thoughts beneath the words are ________.\n8. The person who manages rehearsals and runs the show is the ________ manager.\n9. A theatre with audience on three sides is a ________ stage.\n10. Stanislavski’s system uses ________ memory to connect with emotions.`
  },
  // ==================== PHYSICAL EDUCATION & HEALTH ====================
  {
    id: 'pe-skills',
    title: 'Physical Education – Motor Skills and Movement',
    summary: 'Locomotor and non‑locomotor skills, manipulative skills, and complex movement patterns.',
    body: `PHYSICAL EDUCATION – Building Motor Competence

Physical education develops the skills, knowledge, and attitudes needed for an active, healthy life. Motor skills are the foundation of all physical activity. They are classified into three main categories.

LOCOMOTOR SKILLS move the body from one place to another. Walking involves a heel‑to‑toe roll, with one foot always in contact with the ground. Running has a flight phase where both feet are off the ground simultaneously. Skipping combines a step and a hop on alternating feet, requiring rhythm and coordination. Galloping is a forward step with one foot leading, followed by the trailing foot closing up – a smooth, gliding motion. Leaping is an exaggerated running step with a longer flight phase, often used in dance and gymnastics. Sliding is a sideways gallop. Hopping is taking off and landing on the same foot, requiring balance and leg strength. Jumping takes off from both feet and lands on both feet, building power.

NON‑LOCOMOTOR SKILLS are performed in place. Stretching extends muscles to improve flexibility and prevent injury. Bending flexes joints – touching toes, doing squats. Twisting rotates the body around the spine. Swinging moves limbs back and forth like a pendulum. Swaying is a gentle side‑to‑side motion. Balancing maintains equilibrium – standing on one foot, holding a gymnastic pose. These skills form the basis of body awareness and control.

MANIPULATIVE SKILLS involve controlling objects with hands or feet. Throwing: overhand (hand above shoulder, good for distance), underhand (hand below waist, good for accuracy). Catching: receiving with hands, absorbing force by giving with the object. Kicking: using the instep (laces) for power, inside of foot for accuracy. Dribbling: in football, tapping the ball with feet while moving; in basketball, bouncing with fingertips. Striking: hitting an object with a bat, racquet, or hand (volleyball). These skills are essential for sports and games.

FITNESS COMPONENTS – Health‑related fitness includes cardiorespiratory endurance (heart and lungs), muscular strength (maximum force), muscular endurance (sustained force), flexibility (range of motion), and body composition (ratio of fat to lean mass). Skill‑related fitness includes agility (quick direction change), balance, coordination (smooth movement), power (strength × speed), reaction time, and speed.

WARM‑UP AND COOL‑DOWN – Every exercise session should begin with a warm‑up (light cardio, dynamic stretches) to increase heart rate and blood flow to muscles, reducing injury risk. It should end with a cool‑down (gentle movement, static stretches) to gradually lower heart rate and improve flexibility.`
    + `\n\nPRACTICE QUESTIONS\n1. Skipping is a ________ skill that combines a step and a hop.\n2. A sideways gallop is called ________.\n3. Stretching is a ________ skill performed in place.\n4. Throwing overhand is good for ________.\n5. Catching should involve absorbing force by ________ with the object.\n6. Cardiorespiratory endurance involves the heart and ________.\n7. Agility is the ability to change ________ quickly.\n8. A warm‑up should include light ________ and dynamic stretches.\n9. A cool‑down helps gradually lower ________ rate.\n10. Muscular endurance is the ability to sustain force over ________.`
  },
  {
    id: 'health-nutrition',
    title: 'Health – Nutrition, Wellness, and Substance Prevention',
    summary: 'Balanced diet, nutrients, fitness, mental health, and avoiding harmful substances.',
    body: `HEALTH AND WELLNESS – A Holistic Approach

Health is not merely the absence of disease; it is a state of complete physical, mental, and social well‑being. Achieving good health involves balanced nutrition, regular exercise, mental hygiene, and avoiding harmful substances.

NUTRITION – The body needs six essential nutrients: carbohydrates (main energy source – grains, fruits, vegetables), proteins (build and repair tissues – meat, beans, dairy, nuts), fats (long‑term energy, cell membranes – oils, avocados, fish), vitamins (regulate body processes – found in fruits, vegetables), minerals (build bones, carry oxygen – calcium, iron), and water (medium for all chemical reactions, temperature regulation). A balanced diet includes a variety of foods from all food groups: grains, vegetables, fruits, protein, dairy. The plate model suggests half the plate as vegetables and fruits, one‑quarter grains, one‑quarter protein.

Reading a nutrition facts label helps make informed choices. Key information includes serving size (all values refer to this), calories (energy), total fat, saturated fat, trans fat (avoid), cholesterol, sodium, total carbohydrates, dietary fibre, sugars, protein, and micronutrients (% daily value). Ingredients are listed by weight, highest first. Limiting added sugars, saturated fats, and sodium reduces the risk of chronic diseases.

PHYSICAL ACTIVITY – Children aged 5‑17 should engage in at least 60 minutes of moderate‑to‑vigorous physical activity daily. Activities should include aerobic exercise (running, cycling), muscle‑strengthening (climbing, push‑ups), and bone‑strengthening (jumping, skipping). Sedentary screen time should be limited.

MENTAL AND EMOTIONAL HEALTH – Mental health includes emotional, psychological, and social well‑being. Strategies include positive self‑talk, setting realistic goals, managing stress through relaxation techniques (deep breathing, mindfulness), and seeking help from trusted adults when overwhelmed. Empathy, kindness, and building healthy relationships contribute to emotional well‑being.

SUBSTANCE PREVENTION – Tobacco contains nicotine, highly addictive and damaging to lungs, heart, and blood vessels. Second‑hand smoke harms others. Alcohol impairs brain development in young people, damages the liver, and increases risky behaviour. Misuse of medicines (taking unprescribed drugs or exceeding dosages) can cause addiction and organ damage. Resisting peer pressure involves assertive communication (“No, I don’t want that”), choosing supportive friends, and involving adults.`
    + `\n\nPRACTICE QUESTIONS\n1. The main energy source in food is ________.\n2. Proteins help ________ and repair tissues.\n3. The plate model suggests half the plate as vegetables and ________.\n4. On a nutrition label, the first value to check is ________ size.\n5. Children should get at least ________ minutes of daily physical activity.\n6. Nicotine is the addictive substance in ________.\n7. Alcohol impairs ________ development in young people.\n8. Saying “No, I don’t want that” is an example of ________ communication.\n9. Deep breathing is a technique for managing ________.\n10. Empathy means understanding and sharing the ________ of others.`
  },
  // ==================== TECHNOLOGY & DIGITAL LITERACY ====================
  {
    id: 'tech-computing',
    title: 'Technology – Computing Fundamentals',
    summary: 'Hardware, software, operating systems, file management, and productivity tools.',
    body: `COMPUTING FUNDAMENTALS – Understanding the Machine

A computer is an electronic device that processes data according to instructions. It consists of hardware (physical components) and software (programs). The central processing unit (CPU) is the “brain,” executing instructions at billions of cycles per second (gigahertz). Random access memory (RAM) is temporary, volatile memory used to store data the CPU is actively using; it is cleared when the computer turns off. Storage devices (hard disk drives, solid‑state drives) provide permanent, non‑volatile storage for files, applications, and the operating system.

Input devices allow users to send data to the computer: keyboard, mouse, touchscreen, microphone, scanner, webcam. Output devices display or produce results: monitor, printer, speakers, headphones. The motherboard is the main circuit board connecting all components. The power supply converts wall electricity to the voltages needed by internal components.

Software is divided into two main categories. System software includes the operating system (OS), which manages hardware, runs applications, and provides a user interface. Common OSs: Microsoft Windows, macOS, ChromeOS, and Linux distributions. The OS handles memory management, file system organisation, security, and multitasking. Application software performs specific tasks for users: word processors (Microsoft Word, Google Docs), spreadsheets (Excel, Google Sheets), presentation software (PowerPoint, Google Slides), web browsers (Chrome, Firefox), and graphic design tools.

File management involves organising digital information. A file is a collection of data stored under a name with an extension indicating its type (e.g., .docx, .pdf, .jpg, .mp3). Folders (directories) group related files hierarchically. Good practices: use descriptive file names, avoid special characters, create logical folder structures, back up important files regularly to external drives or cloud storage. Cloud storage (Google Drive, OneDrive, iCloud) stores files on remote servers accessible from any device with internet.

Productivity suites integrate several applications. In a word processor, you can format text (font, size, colour), insert images and tables, use spell check, and collaborate in real‑time. In a spreadsheet, data is organised in rows and columns within cells. Formulas perform calculations: =SUM(A1:A10), =AVERAGE(B1:B5). Charts visualise data trends. Presentation software creates slides with text, images, animations, and transitions.`
    + `\n\nPRACTICE QUESTIONS\n1. The brain of the computer is the ________.\n2. RAM stands for Random ________ Memory.\n3. A keyboard is an ________ device.\n4. The main circuit board is the ________.\n5. Software that manages hardware is the ________ system.\n6. A file extension .docx indicates a ________ document.\n7. Cloud storage stores files on ________ servers.\n8. In a spreadsheet, the formula =SUM(A1:A10) ________ the values.\n9. Folders are used to ________ related files.\n10. Google Docs is an example of a ________ processor.`
  },
  {
    id: 'tech-coding',
    title: 'Technology – Coding, Robotics, and Digital Citizenship',
    summary: 'Block‑based coding, algorithms, debugging, robotics basics, and responsible online behaviour.',
    body: `CODING AND DIGITAL CITIZENSHIP – Creating and Connecting Responsibly

Coding (computer programming) is the process of writing instructions for a computer to execute. Block‑based coding environments like Scratch use visual blocks that snap together, eliminating syntax errors and allowing beginners to focus on logic. Key programming concepts are universal.

SEQUENCE: Instructions are executed in order, top to bottom. LOOP: A block of code that repeats. For loops repeat a specific number of times; while loops repeat as long as a condition is true. CONDITIONAL: If‑then‑else structures make decisions. “If the sprite touches the edge, bounce; else keep moving.” VARIABLE: A named container that stores a value (e.g., score) that can change during program execution. EVENT: A trigger that starts a script – “when green flag clicked,” “when key pressed.” OPERATORS perform mathematical comparisons (>, <, =) and logical operations (and, or, not). BROADCAST: One sprite sends a message that other sprites can respond to, enabling coordination.

An algorithm is a step‑by‑step procedure for solving a problem. Everyday algorithms include recipes, directions, and morning routines. In coding, algorithms are expressed as programs. Debugging is the process of finding and fixing errors (bugs) in code. Strategies: read the code line by line, use print/display blocks to check variable values, isolate sections, and test incrementally.

ROBOTICS combines coding with physical machines. Robots have sensors (light, touch, ultrasonic, colour) that gather environmental data, a controller (micro‑computer) that processes this data and runs code, and actuators (motors, lights, speakers) that produce actions. Educational robotics kits like LEGO Mindstorms or VEX allow students to build and program robots to navigate mazes, follow lines, or sort objects.

DIGITAL CITIZENSHIP is the responsible use of technology. Key principles: 1) Protect personal information – never share full name, address, phone number, passwords, or school name with strangers online. 2) Be respectful – treat others online as you would in person. Do not post hurtful comments. 3) Cyberbullying is repeated, intentional harm using technology; report it immediately to a trusted adult. 4) Digital footprint – everything posted online can be permanent and searchable. Think before posting. 5) Evaluate information – not everything online is true. Check the source’s authority, date, and bias. Use multiple reliable sources. 6) Copyright and plagiarism – respect others’ creative work. Cite sources and ask permission to use images or text. 7) Balance – limit screen time, take breaks, and engage in offline activities.`
    + `\n\nPRACTICE QUESTIONS\n1. Instructions executed in order from top to bottom form a ________.\n2. A block of code that repeats is a ________.\n3. An if‑then‑else structure is a ________.\n4. A named container that stores a changing value is a ________.\n5. Finding and fixing errors in code is ________.\n6. A robot’s electronic brain is the ________.\n7. Never share your ________ online with strangers.\n8. Repeated mean behaviour online is ________.\n9. The trail of information you leave online is your digital ________.\n10. Before using someone else’s image, you should ask for ________.`
  }
]

function Grade5SupplementaryNotes() {
  const [search, setSearch] = useState('')
  const filtered = SUPP_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Supplementary Subjects – Ultra‑Deep Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Visual Arts, Music, Theatre, PE/Health, Technology – 10 practice blanks per topic (~6000 lines total)</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 5</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>
            {t.body.split('\n\n').map((p,i) => <p key={i} style={{marginBottom:'14px'}}>{p}</p>)}
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function AllGrade5Notes() {
  const [activeSubject, setActiveSubject] = useState(null)

  const subjects = [
    { id: 'math',    label: 'Mathematics',           short: 'M',  desc: 'Number sense, operations, fractions and geometry',   color: '#6366f1', Component: Grade5MathNotes },
    { id: 'english', label: 'English Language Arts',  short: 'E',  desc: 'Reading comprehension, writing and grammar',         color: '#0ea5e9', Component: Grade5EnglishNotes },
    { id: 'science', label: 'Science',                short: 'Sc', desc: 'Matter, ecosystems, earth systems and space',        color: '#8b5cf6', Component: Grade5ScienceNotes },
    { id: 'ss',      label: 'Social Studies',         short: 'SS', desc: 'History, geography, civics and economics',          color: '#f59e0b', Component: Grade5SocialStudiesNotes },
    { id: 'kisw',    label: 'Kiswahili',              short: 'K',  desc: 'Lugha na fasihi, sarufi na ufahamu',                color: '#10b981', Component: Grade5KiswahiliNotes },
    { id: 'cre',     label: 'CRE',                    short: 'C',  desc: 'Christian Religious Education notes',               color: '#ef4444', Component: Grade5CRENotes },
    { id: 'ire',     label: 'IRE',                    short: 'I',  desc: 'Islamic Religious Education notes',                 color: '#f97316', Component: Grade5IRENotes },
    { id: 'hre',     label: 'HRE',                    short: 'H',  desc: 'Hindu Religious Education notes',                   color: '#ec4899', Component: Grade5HRENotes },
    { id: 'supp',    label: 'Supplementary',          short: 'S',  desc: 'Arts, Music, Theater, PE and Technology',           color: '#06b6d4', Component: Grade5SupplementaryNotes },
  ]

  if (activeSubject) {
    const s = subjects.find(sub => sub.id === activeSubject)
    const ActiveComponent = s.Component
    return (
      <div>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
          zIndex: 10,
        }}>
          <button
            onClick={() => setActiveSubject(null)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              color: 'var(--text)',
              fontSize: '.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            &#8592; Notes
          </button>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: s.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '.75rem', flexShrink: 0,
          }}>
            {s.short}
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {s.label}
          </span>
        </div>
        <div style={{ padding: '20px' }}>
          <ActiveComponent />
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>Grade 6 Notes</h1>
        <p style={{ color: 'var(--sub)', fontSize: '.875rem', margin: 0 }}>Select a subject to read your notes</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSubject(s.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderLeft: '4px solid ' + s.color,
              borderRadius: '12px',
              padding: '16px 18px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: s.color + '18',
              border: '2px solid ' + s.color + '40',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '.85rem', color: s.color,
              flexShrink: 0,
            }}>
              {s.short}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.95rem', marginBottom: '3px' }}>
                {s.label}
              </div>
              <div style={{ color: 'var(--sub)', fontSize: '.78rem', lineHeight: 1.4 }}>
                {s.desc}
              </div>
            </div>
            <div style={{ color: 'var(--sub)', fontSize: '1.3rem', flexShrink: 0 }}>&#8250;</div>
          </button>
        ))}
      </div>
    </div>
  )
}