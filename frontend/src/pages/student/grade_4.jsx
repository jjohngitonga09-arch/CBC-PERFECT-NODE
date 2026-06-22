import { useState } from 'react'

// ==================== MATHEMATICS ====================
const MATH_TOPICS = [
  {
    id: 'num-sense',
    title: 'Number Sense, Place Value & Multi-Digit Operations',
    summary: 'Base-10 to 1,000,000, comparing, rounding, addition, subtraction, multiplication, division.',
    body: `BASE‑10 PLACE VALUE SYSTEM UP TO 1,000,000
Our number system is based on the number 10. Each place has 10 times the value of the place to its right.
- Units, Tens, Hundreds, Thousands, Ten‑Thousands, Hundred‑Thousands, Millions.
- Standard form: 430,502
- Expanded form: 400,000 + 30,000 + 500 + 2
- Word form: four hundred thirty thousand, five hundred two.

Identifying Place Value
The digit 7 in 573,201 is in the ten‑thousands place; its value is 70,000.
The digit 5 in 5,628,419 is in the millions place; its value is 5,000,000.

Multiplicative Comparison of Adjacent Places
A digit in one place represents 10 times what it represents in the place to its right.
Example: 300 (hundreds) = 10 × 30 (tens).

Comparing Multi‑Digit Numbers
Use >, <, =.
456,789 > 456,123 because the thousands digits: 6 vs 1.
Always start from the leftmost place.

Rounding Whole Numbers
To round to any place, look at the digit immediately to the right. If 5 or more, round up; else round down.
Example: Round 34,678 to the nearest thousand → 35,000.
Round 789,432 to the nearest hundred‑thousand → 800,000.

ADDITION AND SUBTRACTION OF MULTI‑DIGIT WHOLE NUMBERS
Standard algorithm:
Addition: line up places, add columns, carry when sum ≥ 10.
Subtraction: line up places, subtract columns, regroup if needed.
Complex regrouping across zeros: 600,000 − 274,389 = 325,611.
Estimating sums/differences by rounding helps check reasonableness.

MULTI‑DIGIT MULTIPLICATION
Multiplicative comparison: "35 is 5 times as many as 7" → 35 = 5 × 7.
Multiply up to 4‑digit numbers by a 1‑digit number: 1,652 × 7 = 11,564.
Multiply two 2‑digit numbers: 72 × 46 using area model, partial products, or standard algorithm.
Area model: (70 + 2) × (40 + 6) = 70×40 + 70×6 + 2×40 + 2×6 = 2800 + 420 + 80 + 12 = 3,312.
Standard algorithm: 72 × 46 = 72 × 6 + 72 × 40 = 432 + 2,880 = 3,312.

MULTI‑DIGIT DIVISION
Divide up to 4‑digit dividends by 1‑digit divisors: 2,800 ÷ 4 = 700.
Quotients with remainders: 51 ÷ 8 = 6 R3.
Interpret remainders: drop if extra can’t be split, round up if more needed, or express as fraction (3/8).
Strategies: partial quotients, area models, long division (A = q × d + r).

PRACTICE QUESTIONS
1. In 841,275 the 4 is in the ________________ place.
2. Write 500,000 + 20,000 + 3,000 + 400 + 5 in standard form: ________________.
3. Round 76,349 to the nearest thousand: ________________.
4. 500,000 − 287,456 = ________________.
5. 638 × 5 = ________________.
6. 84 × 37 using area model: (___ + 4) × (___ + 7).
7. Divide 1,500 by 6. Quotient = ______; remainder = ______.
8. 8,765 ______ 8,756 (use >, <, =).
9. The value of the digit 9 in 293,401 is ________.
10. 4,000 ÷ 8 = ________.`
  },
  {
    id: 'algebra',
    title: 'Algebraic Thinking, Patterns & Problem Solving',
    summary: 'Multi-step word problems, factors/multiples, prime/composite, number patterns.',
    body: `MULTI‑STEP WORD PROBLEMS
Word problems involving all four operations. Represent unknowns with a variable (e.g., x).
Example: "A toy store had 245 toys. They sold 87 in the morning and 56 in the afternoon. How many toys are left?" Step 1: total sold = 87+56 = 143; Step 2: 245−143 = 102 toys left.
Equation: 245 − (87+56) = t.
Always estimate to check reasonableness.

FACTORS, MULTIPLES, PRIME & COMPOSITE
Factors: numbers that divide evenly into a whole number.
Factor pairs for 24: (1,24), (2,12), (3,8), (4,6).
Multiples: e.g., multiples of 7: 7,14,21,28,….
Prime numbers: exactly two factors (1 and itself). Examples: 2,3,5,7,11,13,17,19,23,29.
Composite numbers: more than two factors. Examples: 4,6,8,9,10,12.
1 is neither prime nor composite.

PATTERNS AND RULES
Generate patterns: "Start at 3, add 4" → 3,7,11,15,19…
Notice features: all numbers are odd; alternating odd/even if rule adds an odd number to an odd start gives even? Actually: 3+4=7 (odd), +4=11 (odd) – pattern remains odd because odd+even=odd. Recognize.

PRACTICE QUESTIONS
1. "A farm has 125 cows and 348 goats. They sell 97 animals. How many animals remain?" Write equation: ____________. Answer: ________.
2. Find all factor pairs of 36: ________________, ________________, ________________, ________________, ________________.
3. Is 29 prime or composite? ________.
4. List the first five multiples of 8: ________, ________, ________, ________, ________.
5. Start at 5, add 3: next three terms: ________, ________, ________.
6. The sum of two numbers is 540. One number is 325. The other is ________.
7. If a number has more than two factors, it is called ________.
8. Write a comparison equation: "40 is 8 times as many as 5" → 40 = ___ × ___.
9. 1 is neither prime nor ________.
10. The only even prime number is ________.`
  },
  {
    id: 'fractions',
    title: 'Fractions and Decimals',
    summary: 'Fraction equivalence, comparing, operations, decimal notation.',
    body: `FRACTION EQUIVALENCE AND ORDERING
Equivalence: a/b = (n×a)/(n×b). Example: 1/2 = 2/4 = 3/6 = 4/8.
Use visual fraction models (fraction bars, number lines).
Compare fractions with unlike denominators: find common denominator (e.g., 2/3 and 3/4 → 8/12 and 9/12, so 2/3 < 3/4). Record with >,<,=.
Benchmark comparison: e.g., 7/8 > 1/2 because 7/8 is more than half.

OPERATIONS WITH FRACTIONS (LIKE DENOMINATORS)
Addition: join parts of same whole. 1/6 + 2/6 = 3/6 = 1/2.
Subtraction: separate parts. 7/8 − 3/8 = 4/8 = 1/2.
Decompose fractions: 3/8 = 1/8 + 1/8 + 1/8, or 2/8 + 1/8.
Mixed numbers: 3 1/6 + 4 2/6 = 7 3/6 = 7 1/2.

FRACTION MULTIPLICATION BY WHOLE NUMBERS
5/4 = 5 × (1/4). Multiply: 3 × 2/5 = 6/5 = 1 1/5. Use visual models.

DECIMAL FRACTIONS AND DECIMAL NOTATION
Convert tenths to hundredths: 3/10 = 30/100.
Decimal notation: 62/100 = 0.62; 4/10 = 0.4.
Compare decimals to hundredths: 0.7 > 0.25 because 0.7 = 70/100 > 25/100.

PRACTICE QUESTIONS
1. Find two equivalent fractions for 3/4: ________, ________.
2. Compare: 5/6 and 2/3 using a common denominator. 5/6 = __/6, 2/3 = __/6. So 5/6 ______ 2/3.
3. 2/5 + 2/5 = ________.
4. Subtract: 7/10 − 3/10 = ________.
5. Decompose 5/8 into sum of unit fractions: ________ + ________ + ________ + ________ + ________.
6. 4 × 3/5 = ________ (improper) = ______ (mixed).
7. Write 0.9 as a fraction with denominator 10: ________.
8. Convert 70/100 to decimal: ________.
9. Which is larger: 0.63 or 0.6? ________.
10. 2 3/4 + 1 1/4 = ________.
11. Fraction a/b where b=10, a=7: decimal ________.
12. 5/10 = ?/100. Answer: ________.
13. Compare 0.4 and 0.40: 0.4 ______ 0.40.
14. 3 × 4/5 = ________ (improper).
15. 1/2 is equivalent to how many eighths? ________.`
  },
  {
    id: 'measurement',
    title: 'Measurement and Data',
    summary: 'Units, conversions, area/perimeter, line plots.',
    body: `MEASUREMENT UNITS AND CONVERSIONS
Metric: 1 km = 1000 m, 1 m = 100 cm, 1 kg = 1000 g, 1 L = 1000 mL.
US Customary: 1 ft = 12 in, 1 yd = 3 ft, 1 mi = 5280 ft; 1 lb = 16 oz; 1 gal = 4 qt = 8 pt.
Convert larger to smaller unit: 3 km = 3 × 1000 = 3000 m.
Record in two‑column table: km | m
    1   | 1000
    2   | 2000

AREA AND PERIMETER FORMULAS
Perimeter of rectangle: P = 2l + 2w or 2(l+w).
Area of rectangle: A = l × w.
Solve for missing side: if A = 48 sq cm, l = 8 cm, then w = 48 ÷ 8 = 6 cm.

LINE PLOTS AND DATA
Make line plot of measurements in fractions (1/2, 1/4, 1/8).
Solve addition/subtraction problems using data from line plot.

PRACTICE QUESTIONS
1. Convert 5 km to meters: ________________ m.
2. 4 lb = ________ oz.
3. A rectangle has length 12 cm, width 5 cm. Perimeter = ________ cm, Area = ________ sq cm.
4. Missing side: area=72 sq m, width=8 m, length=________ m.
5. 3 L = ________ mL.
6. 2 gallons = ________ quarts.
7. On a line plot, lengths: 1/2 in, 1/2 in, 1/4 in. Total length combined = ________ inches.
8. Elapsed time: start 2:45 PM, end 5:10 PM. Elapsed = ________ h ________ min.
9. 6 ft = ________ in.
10. A rectangle perimeter is 34 cm, length is 10 cm, width is ________ cm.
11. 1 kg = ________ g.
12. 2.5 L = ________ mL.
13. 3 miles = ________ ft.
14. 5/8 + 3/8 = ________ (use line plot data).
15. Area 99 sq cm, width 9 cm, length = ________.`
  },
  {
    id: 'geometry',
    title: 'Geometry and Geometric Measurement',
    summary: 'Angles, lines, two‑dimensional figures, symmetry.',
    body: `GEOMETRIC MEASUREMENT: ANGLES
Angle: formed by two rays sharing a common endpoint (vertex).
Measured in degrees (°) with a protractor. Full circle = 360°.
Acute angle < 90°, Right angle = 90°, Obtuse angle > 90° but < 180°, Straight angle = 180°.
Sketch angles of specific measure using protractor.
Angle additivity: unknown angle = total known part subtracted from whole (e.g., straight line 180°).

LINES, RAYS, AND ANGLES CLASSIFICATION
Point, line, line segment, ray.
Right angle (90°), acute, obtuse.
Perpendicular lines intersect at 90°.
Parallel lines never intersect.

TWO‑DIMENSIONAL FIGURES CLASSIFICATION
Classify based on parallel/perpendicular sides, angles.
Quadrilaterals: square (4 right angles, parallel sides), rectangle, rhombus, trapezoid.
Right triangle: one right angle.

SYMMETRY
Line of symmetry: a line across figure where folding makes matching parts.
Identify line‑symmetric figures and draw lines of symmetry.

PRACTICE QUESTIONS
1. A 90° angle is called a ________ angle.
2. An angle measuring 35° is ________.
3. Two lines that intersect forming a right angle are ________.
4. A triangle with one right angle is a ________ triangle.
5. A quadrilateral with both pairs of opposite sides parallel and all sides equal is a ________.
6. Draw a line of symmetry on a square. How many lines of symmetry does a square have? ________.
7. If one angle of a straight line is 70°, the other is ________°.
8. Use protractor: angle of 120° is ________ (acute/obtuse/right).
9. A line segment has ________ endpoints.
10. A figure that can be folded along a line into two matching parts has ________.
11. The sum of angles around a point is ________°.
12. Two lines that never meet are ________.
13. A rectangle has ________ right angles.
14. A ray has ________ endpoint(s).
15. Classify a triangle with angles 60°, 60°, 60°: ________ triangle.`
  }
]

function Grade4MathNotes() {
  const [search, setSearch] = useState('')
  const filtered = MATH_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 Mathematics Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Number sense, algebra, fractions, measurement, geometry – deep practice</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
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
    title: 'Reading Comprehension: Literature',
    summary: 'Key ideas, craft, structure, integration of knowledge.',
    body: `KEY IDEAS AND DETAILS
Refer to explicit details in the text. Quote specific sentences. Draw inferences.
Determine theme of story, drama, poem; summarize.
Describe character, setting, event using details (thoughts, words, actions).

CRAFT AND STRUCTURE
Interpret figurative language: simile, metaphor, idiom.
Explain structural differences between poems (stanzas, rhyme, meter), drama (casts, stage directions), prose (paragraphs, chapters).
Compare point of view: first‑person (I) vs. third‑person (he/she/they) limited or omniscient.

INTEGRATION OF KNOWLEDGE
Connect story to visual/oral presentation.
Compare similar themes, topics, patterns across cultures.

PRACTICE QUESTIONS
1. The lesson of a story is called its ________.
2. "Her eyes were stars" is an example of a ________.
3. A poem is divided into groups of lines called ________.
4. In first‑person narration, the narrator uses the word ________.
5. A play is divided into ________ and scenes.
6. To draw an inference means to read between the ________.
7. A simile uses the words ________ or as.
8. A story’s high point is the ________.
9. A summary should be ________ (long/short) and include main points.
10. A drama’s instructions are called ________ directions.`
  },
  {
    id: 'info-comp',
    title: 'Reading Comprehension: Informational Text',
    summary: 'Main idea, text structure, primary/secondary sources, integrate info.',
    body: `MAIN IDEA AND KEY DETAILS
Find main idea and supporting details. Summarize objectively.
Explain events, procedures, concepts using cause/effect.

CRAFT AND STRUCTURE
Academic vocabulary meaning. Organizational structures: chronological, compare/contrast, cause/effect, problem/solution.
Primary vs. secondary accounts of same event.

INTEGRATION OF KNOWLEDGE
Interpret charts, graphs, timelines, maps.
Analyze author’s reasons and evidence.
Integrate info from two texts on same topic.

PRACTICE QUESTIONS
1. The most important point of a text is the ________ idea.
2. A text structure that shows events in order is ________.
3. A firsthand account is called a ________ source.
4. A map that shows population density is a ________ map.
5. To integrate information means to ________.
6. The author’s attitude toward a topic is the ________.
7. A diagram is an example of ________ information.
8. "Because" signals a ________ text structure.
9. A timeline is used to show ________ order.
10. Comparing means finding ________ and differences.`
  },
  {
    id: 'writing',
    title: 'Writing Foundation & Production',
    summary: 'Opinion, informative, narrative writing, process & research.',
    body: `OPINION WRITING
State opinion, organize reasons, support with facts and details, use linking words (e.g., for instance), provide conclusion.

INFORMATIVE/EXPLANATORY WRITING
Introduce topic, group information, use headings, illustrations. Develop with facts, definitions, quotations. Link ideas with transitions. Use domain‑specific vocabulary.

NARRATIVE WRITING
Establish situation, narrator/characters. Use dialogue, description, pacing. Use sensory details and transition words. Provide natural conclusion.

WRITING PROCESS
Plan, draft, revise, edit, rewrite. Type one page in single sitting. Conduct short research projects. Gather info from print/digital; take notes and sort evidence.

PRACTICE QUESTIONS
1. An opinion piece must state a clear ________.
2. To support an opinion, you use ________ and details.
3. An informative text often includes ________ to organize sections.
4. Dialogue in a story is the words that ________ say.
5. The steps of writing process are: plan, ________, revise, edit, publish.
6. A research project begins with a ________.
7. A conclusion ________ up the writing.
8. Transitions like "for example" help ________ ideas.
9. Sensory details describe what we see, hear, smell, taste, and ________.
10. A narrative should have a clear ________, middle, and end.`
  },
  {
    id: 'grammar',
    title: 'Language, Grammar & Conventions',
    summary: 'Relative pronouns, progressive tenses, modals, adjective order, fragments, punctuation, vocabulary.',
    body: `GRAMMAR
Relative pronouns: who, whose, whom, which, that.
Relative adverbs: where, when, why.
Progressive tenses: past (was walking), present (am walking), future (will be walking).
Modal auxiliaries: can, may, must, should, will.
Adjective order: opinion, size, age, color, origin, material, purpose (e.g., lovely small old red Italian leather racing car).
Prepositional phrases: on the table, after lunch.
Correct fragments and run‑ons.

MECHANICS
Capitalization: proper adjectives, historical events, book titles.
Commas and quotation marks in direct speech: She said, "Hello."
Possessives: apostrophe (girl’s, girls’).
Spelling: use dictionary.

VOCABULARY
Context clues: definitions, examples, restatements.
Greek/Latin roots: tele (far), graph (write), photo (light).
Figurative language: simile, metaphor, idiom, synonym/antonym.

PRACTICE QUESTIONS
1. The pronoun used for a person object is ________.
2. "I am eating" is in the ________ progressive tense.
3. Choose the correct modal: You ________ brush your teeth twice a day (must/can).
4. Correct order: a ________ (small red) bag.
5. Identify the prepositional phrase: The cat slept under the table. ________.
6. Fix run‑on: I love reading I do it every day. ________.
7. Correct capitalization: the great wall of china → ________.
8. Add quotes: He said it is raining. → He said, "________."
9. The root "graph" means ________.
10. "As brave as a lion" is a ________.`
  }
]

function Grade4EnglishNotes() {
  const [search, setSearch] = useState('')
  const filtered = ENGLISH_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 English Language Arts Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Reading comprehension, writing, grammar, vocabulary – deep gaps</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
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
    id: 'physical-science',
    title: 'Physical Science: Energy, Force, and Waves',
    summary: 'Energy transfers, collisions, circuits, forces, simple machines, wave properties, light, and information technology.',
    body: `ENERGY DEFINITIONS AND TRANSFERS
Energy is the ability to cause change or do work.
Kinetic energy: the energy of motion. Faster objects have more kinetic energy.
Energy transfer: energy moves from place to place via sound, light, heat, and electrical currents.
Collisions: when moving objects collide, kinetic energy transfers from one to another (e.g., a moving ball hits a stationary ball; the first slows, the second moves).
Electric circuits: a power source (battery), wires, switch, and output (light bulb, buzzer, motor) convert electrical energy into light, sound, or motion.

FORCES AND MOTION / SIMPLE MACHINES
Balanced forces: equal, opposite – no change in motion.
Unbalanced forces: cause motion or change direction.
Simple machines make work easier by changing the direction or magnitude of a force.
- Lever: a rigid bar pivoting on a fulcrum (e.g., seesaw).
- Pulley: a rope over a wheel (e.g., flagpole).
- Inclined plane: a ramp.
- Wedge: two inclined planes back‑to‑back (e.g., knife).
- Wheel and axle: round disc attached to a rod (e.g., doorknob).
- Screw: an inclined plane wrapped around a cylinder.

WAVE PROPERTIES AND INFORMATION TECHNOLOGY
Waves: amplitude (height), wavelength (distance between peaks).
Waves cause objects to oscillate without permanently moving the medium.
Light waves: travel in straight lines, reflect off surfaces, refract (bend) through water/prisms, absorbed by dark objects.
Digitized patterns (1s and 0s, pixels) transmit information over distances using electronic devices.

PRACTICE QUESTIONS
1. The ability to cause change is called ________.
2. A faster object has ________ kinetic energy.
3. In a collision, energy ________ from one object to another.
4. A battery is a ________ source in a circuit.
5. When forces are equal and opposite, they are ________ forces.
6. A lever pivots on a ________.
7. A ramp is an example of an ________ plane.
8. The height of a wave is its ________.
9. Light bends when it passes through water; this is called ________.
10. Computers use patterns of ________ and zeros to send information.
11. A wheel attached to a rod forms a ________ and axle.
12. A knife is an example of a ________.
13. Electrical energy can be converted to ________, sound, or motion.
14. The distance between two wave peaks is the ________.
15. Light travels in ________ lines.`
  },
  {
    id: 'life-science',
    title: 'Life Science: Structures, Ecosystems, and Adaptation',
    summary: 'Plant and animal structures, information processing, food chains, interdependence.',
    body: `INTERNAL AND EXTERNAL STRUCTURES OF ORGANISMS
Plants: Roots absorb water; stems support and transport; leaves perform photosynthesis; flowers produce seeds. Internal vascular bundles (xylem) move water upward.
Animals: External structures (claws, fur, shells, wings) protect; internal structures (skeleton, lungs, heart, brain) support and sustain life.

INFORMATION PROCESSING AND THE NERVOUS SYSTEM
Animals use sensory receptors: eyes (light), ears (sound), skin (touch, temperature), nose (smell).
Signals travel from receptors along nerves to the brain, which processes information, stores memories, or triggers reflexes.

ECOSYSTEM DYNAMICS AND ENERGY FLOW
Food chains: Producers (plants) → Primary consumers (herbivores) → Secondary consumers (carnivores). Decomposers (fungi, bacteria) break down waste.
Food webs show interconnected chains.
Interdependence: if one population changes, the whole web is affected (e.g., fewer predators → more herbivores → less vegetation).

PRACTICE QUESTIONS
1. The part of a plant that takes in water and minerals is the ________.
2. Photosynthesis occurs mostly in the ________.
3. Xylem tissue moves ________ upward.
4. An animal’s fur is an ________ structure.
5. The brain and spinal cord form the ________ nervous system.
6. A reflex is a fast, automatic ________.
7. Plants are called ________ because they make their own food.
8. An organism that eats only plants is a ________.
9. An organism that breaks down dead material is a ________.
10. A food web is many connected food ________.
11. If predators are removed, herbivore population may ________.
12. The heart is an ________ organ.
13. Sensory receptors in the eye detect ________.
14. A signal from skin travels through ________ to the brain.
15. In a food chain, energy flows from ________ to consumers.`
  },
  {
    id: 'earth-space',
    title: 'Earth and Space Science: Systems, Landscapes, and Resources',
    summary: 'Rock strata, weathering, erosion, mapping, water cycle, weather forecasting, human impact, natural hazards.',
    body: `EARTH’S HISTORY AND CHANGING LANDSCAPES
Rock strata: layers of rock; fossils in lower layers are older. Marine fossils in deserts indicate past oceans.
Weathering: breakdown of rocks into smaller pieces by water, ice, wind, plant roots, chemicals.
Erosion: transport of weathered materials by water, wind, ice.
Deposition: accumulation of eroded materials in new places.

EARTH FEATURES AND MAPPING
Topographic maps show elevation. Patterns: mountain ranges, ocean trenches, volcanoes, earthquake epicenters occur along tectonic plate boundaries.

WEATHER PATTERNS AND THE WATER CYCLE
Water cycle: Evaporation (sun heats water → vapor), Transpiration (plants release vapor), Condensation (vapor cools → clouds), Precipitation (rain, snow), Runoff (water flows back to oceans).
Weather instruments: barometer (air pressure), anemometer (wind speed), hygrometer (humidity). Fronts: cold front meets warm air, causing storms.

HUMAN IMPACTS AND EARTH'S RESOURCES
Renewable resources: solar, wind, geothermal, hydroelectric – infinite.
Non‑renewable: coal, oil, natural gas – finite, pollution from burning.
Natural hazards: earthquakes, floods, hurricanes. Engineers design earthquake‑resistant buildings, flood levees.

PRACTICE QUESTIONS
1. The breakdown of rocks is called ________.
2. Moving weathered material is ________.
3. Dropping sediment in a new place is ________.
4. Older fossils are found in ________ rock layers.
5. Marine fossils in a desert indicate a past ________.
6. A map showing elevation is a ________ map.
7. The water cycle is driven by the ________ and gravity.
8. Water vapor turning into liquid is ________.
9. Rain is a form of ________.
10. An instrument for wind speed is an ________.
11. Coal is a ________ resource (renewable/non‑renewable).
12. Solar energy comes from the ________.
13. A barrier to hold back flood water is a ________.
14. Earthquakes often occur along ________ boundaries.
15. The three main types of fossil fuels are coal, oil, and ________.`
  }
]

function Grade4ScienceNotes() {
  const [search, setSearch] = useState('')
  const filtered = SCIENCE_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 Science Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Physical, life, earth & space sciences – detailed explanations with gaps</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
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
    id: 'geography',
    title: 'Geography, Spatial Thinking, and Map Skills',
    summary: 'Intermediate directions, scale, latitude/longitude, map types, human-environment interaction.',
    body: `ADVANCED MAP INTERPRETATION
Compass rose shows cardinal (N, S, E, W) and intermediate directions (NE, NW, SE, SW).
Map scale: used to calculate real distances. E.g., 1 cm = 10 km.
Absolute location: latitude (parallels) – distance north/south of Equator; longitude (meridians) – distance east/west of Prime Meridian.
Map types: Political maps (borders, cities), Physical maps (landforms, elevation), Thematic maps (population density, climate zones).

HUMAN-ENVIRONMENT INTERACTION (HEI)
Adaptation: people change their lifestyle to fit climate (e.g., Inuit wear fur; desert dwellers build thick walls).
Modification: humans change land (dams, canals, deforestation, terracing).

PRACTICE QUESTIONS
1. The direction halfway between north and east is ________.
2. On a map, the scale shows the ________ between places.
3. Latitude lines run parallel to the ________.
4. The Prime Meridian is a line of ________.
5. A map that shows countries and capitals is a ________ map.
6. A map that shows mountains and rivers is a ________ map.
7. Changing the environment to grow crops on hillsides is called ________.
8. Building a dam is an example of environmental ________.
9. The Equator is at ________° latitude.
10. Intermediate direction between south and west is ________.
11. Latitude and longitude together give an ________ location.
12. A map that uses colors to show population density is a ________ map.
13. Wearing warm clothing in a cold climate is an ________.
14. 1 cm on a map equals 5 km on Earth: real distance of 3 cm is ________ km.
15. The line at 0° longitude is the ________.`
  },
  {
    id: 'history',
    title: 'History, Colonization, and Regional Development',
    summary: 'Indigenous cultures, exploration motives, colonization, regional evolution.',
    body: `INDIGENOUS CULTURES
Before European contact, Native tribes had diverse cultures, housing (tepees, longhouses), food (hunting, gathering, farming), and social systems.

EXPLORATION, COLONIZATION, AND SETTLEMENT
European explorers sought new trade routes, resources, and land. Colonization established permanent settlements. Deep‑water ports and fertile river valleys attracted settlers.

REGIONAL EVOLUTION OVER TIME
Economies shifted from agriculture to industry. Inventions, migration, and cultural exchange changed societies. Example: the Industrial Revolution led to urbanization.

PRACTICE QUESTIONS
1. People native to a land are called ________.
2. Native Americans of the Great Plains lived in ________.
3. European explorers were looking for a faster ________ to Asia.
4. A permanent settlement established by a foreign power is a ________.
5. Fertile soil near ________ rivers attracted early settlers.
6. The shift from handmade goods to machines is the ________ Revolution.
7. Moving from farms to cities is called ________.
8. An invention that changed transportation was the ________ engine.
9. A primary source from the colonial era might be a ________.
10. Trade routes brought goods and ________ between continents.`
  },
  {
    id: 'civics',
    title: 'Civics, Government Structure, and Citizenship',
    summary: 'Three branches, checks and balances, rights and responsibilities.',
    body: `THE THREE BRANCHES OF GOVERNMENT
Legislative: makes laws; Congress (Senate + House of Representatives).
Executive: enforces laws; President (federal), Governor (state).
Judicial: interprets laws; Supreme Court and lower courts.
Checks and balances: each branch can limit the others to prevent abuse of power.

RIGHTS AND RESPONSIBILITIES OF CITIZENS
Rights: freedom of speech, religion, press, assembly, fair trial.
Responsibilities: voting, serving on juries, paying taxes, obeying laws, respecting others.

PRACTICE QUESTIONS
1. The branch that makes laws is the ________.
2. The head of the executive branch at federal level is the ________.
3. The highest court in the land is the ________ Court.
4. The system that prevents one branch from becoming too powerful is called ________ and balances.
5. A citizen’s duty to help decide a court case is called ________ duty.
6. Voting is both a right and a ________.
7. Freedom of ________ means you can practice any religion.
8. The legislative branch has two houses: Senate and ________ of Representatives.
9. A governor is the head of the ________ branch at state level.
10. The right to gather peacefully is freedom of ________.
11. Paying taxes is a civic ________.
12. The president can veto a law; this is an example of a ________.
13. The judicial branch ________ laws.
14. The first ten amendments to the U.S. Constitution are the ________ of Rights.
15. A person who is a member of a country is a ________.`
  },
  {
    id: 'economics',
    title: 'Economics, Trade, and Financial Literacy',
    summary: 'Supply & demand, scarcity, specialization, global trade, personal finance.',
    body: `MARKET MECHANICS
Supply: how much of a product is available. Demand: how much people want it.
Price: when demand > supply, price rises; when supply > demand, price falls.
Scarcity: not enough resources. Opportunity cost: what you give up when you choose.

SPECIALIZATION AND GLOBAL TRADE
Regions specialize in producing goods they can make best (natural resources, skills). They trade to get other goods.

PERSONAL FINANCIAL LITERACY
Needs vs. Wants. Budget: plan income (money earned) minus expenses.
Savings: money set aside. Banks pay interest on savings.
Credit: borrowing money that must be repaid.

PRACTICE QUESTIONS
1. How much of a product people want is ________.
2. When supply is low and demand is high, prices go ________.
3. The next best alternative you give up is the ________ cost.
4. A country making only cars and trading for food is an example of ________.
5. Things you must have to survive are called ________.
6. A plan for spending and saving is a ________.
7. Money paid by a bank to savers is called ________.
8. Borrowing money means using ________.
9. If you have $10 and spend $7, you have $3 left as ________.
10. Global trade involves buying and selling between ________.
11. A person who makes goods is a ________.
12. The basic economic problem is ________.
13. A good example of a want is a ________.
14. A budget compares income and ________.
15. When many people want the newest toy, ________ increases.`
  }
]

function Grade4SocialStudiesNotes() {
  const [search, setSearch] = useState('')
  const filtered = SS_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 Social Studies Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Geography, history, civics, economics – detailed explanations with gaps</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
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
    title: 'Kusikiliza na Kuzungumza',
    summary: 'Maamkizi, mazungumzo, kusikiliza na kufahamu, matamshi bora.',
    body: `MAAMKIZI NA MAZUNGUMZO
- Hujambo / Sijambo
- Shikamoo / Marahaba
- Sabalkheri / Asubuhi njema
- Alamsiki
Majibu na shukrani: Asante sana, Samahani, Pole kwa msiba/ugonjwa.
Mazungumzo maalum: Afya na usafi, usalama barabarani, utunzaji wa mazingira, teknolojia.

KUSIKILIZA NA KUFAHAMU
Kusikiliza hadithi, habari, au maagizo.
Kutambua mawazo makuu na ujumbe.
Kufuatilia maagizo ya hatua nyingi (kupika, kufika mahali).

MATAMSHI BORA NA LAFUDHI
Sauti ng’, ny, mb, nd, nj, nz, ch.
Lafudhi na kiimbo: swali, mshangao, amri.

MASWALI NA MAJIBU
1. Andika maamkizi ya asubuhi. _____________
2. “Pole kwa msiba” hutumika wakati wa ________.
3. Sauti “ng’” inatamkwa kwa kutumia ________.
4. Unaposikiliza hadithi, lengo kuu ni kupata ________.
5. Kiimbo kinachopanda mwishoni huonyesha ________.`
  },
  {
    id: 'sarufi',
    title: 'Sarufi',
    summary: 'Ngeli za nomino, viambishi, nyakati, aina za maneno.',
    body: `NGELI ZA NOMINO
- A‑WA: mtoto / watoto; anacheza / wanacheza
- KI‑VI: kiti / viti; kimevunjika / vimevunjika
- LI‑YA: jicho / macho; limefumba / yamefumba
- U‑I: mti / miti; umeanguka / imeanguka

VIAMBISHI NA NYAKATI
- Uliopo (-NA-): anasoma
- Uliopita (-LI-): alisoma
- Ujao (-TA-): atasoma
- Timilifu (-ME-): amesoma
- Kukanusha: hasomi, hakusoma, hatasoma, hajasoma

AINA ZA MANENO
Viwakilishi: mimi, wewe, yeye, sisi, ninyi, wao.
Vivumishi: -baya, -zuri, -refu; hupatana na ngeli.
Vielezi: kwa haraka, sokoni, asubuhi.
Viunganishi: kwa sababu, lakini, ingawa, kisha, ilhali.

MASWALI NA MAJIBU
Swali la 7 (Upatanisho):
Geuza sentensi kuwa wingi:
a) Mvulana mmoja amesoma kitabu vizuri. → ________________
b) Kiti changu kipya kimevunjika jana. → ________________
Sheria za upatanisho:
- Mvulana yumo katika ngeli ya _______. Katika wingi, kiambishi cha kitenzi hubadilika kuwa _______.
- Kiti kipo katika ngeli ya _______. Katika wingi, kiambishi hubadilika kuwa _______.`
  },
  {
    id: 'kusoma',
    title: 'Kusoma na Ufahamu',
    summary: 'Kusoma kwa burudani, kupanua msamiati, uchambuzi wa maandishi.',
    body: `KUSOMA KWA BURUDANI NA MAARIFA
- Hadithi fupi, habari, vitabu vya ziada.
- Kutafuta maana ya maneno mapya kwa muktadha au kamusi.

UCHAMBUZI WA MAANDISHI
- Maswali ya moja kwa moja na yasiyo ya moja kwa moja.
- Kutambua funzo au maadili ya hadithi.
- Sifa za wahusika: mkarimu, mlafi, mjanja.

MASWALI NA MAJIBU
1. Kusoma hadithi kwa ajili ya kujifurahisha huitwa ________.
2. Neno “mlafi” lina maana ya ________.
3. Funzo la hadithi pia huitwa ________.
4. Kupata maana ya neno bila kamusi ni kutumia ________.
5. Wahusika wakuu katika hadithi ndio ________.`
  },
  {
    id: 'kuandika',
    title: 'Kuandika',
    summary: 'Insha za kiubunifu, uandishi wa kiuamilifu, imla, alama za uakifishaji.',
    body: `INSHA ZA KIUBUNIFU
- Insha ya wasifu: kueleza kwa kina mtu, mnyama, mahali.
- Insha ya kusimulia: mwanzo, kati (mgogoro), mwisho (suluhisho).

UANDISHI WA KIMUUNDO MAALUM
- Barua ya kirafiki: anwani moja, tarehe, salamu, mwili, hitimisho.
- Orodha ya vitu (vifaa vya shule, bidhaa sokoni).

IMLA NA MIUNDO YA SENTENSI
- Tahajia sahihi.
- Alama za uakifishaji: nukta (.), mkato (,), kuuliza (?), hisia (!).

MASWALI NA MAJIBU
1. Alama ya mwisho wa sentensi ni ________.
2. Barua ya kirafiki huanza na ________.
3. Katika insha ya kusimulia, sehemu ya tatizo ni ________.
4. Kuandika maneno kwa usahihi huitwa ________.
5. Orodha ya vitu vya kununua inaitwa ________.`
  },
  {
    id: 'fasihi',
    title: 'Fasihi Simulizi na Msamiati',
    summary: 'Methali, vitendawili, nahau, msamiati maalum.',
    body: `METHALI, VITENDAWILI, NA NAHAU
- Methali: “Asiyefunzwa na mamae hufunzwa na ulimwengu”, “Haraka haraka haina baraka”.
- Vitendawili: Hutegua na kueleza umuhimu wake katika kukuza fikra.
- Nahau: piga picha (chukua picha), kaza kamba (fanya bidii), amua ngumi (pigana).

MSAMIATI MAALUM
- Ukoo: babu, nyanya, mjukuu, shemeji, mkwe, ami, shangazi.
- Magonjwa na Afya: homa, mafua, malaria, kikohozi; hospitali, daktari, muuguzi, dawa.
- Mavazi na Vyombo: kitambaa, mshipi, sufuria, kijiko, mwiko.

MASWALI NA MAJIBU
1. “Asiyefunzwa na mamae hufunzwa na ulimwengu” ni ________.
2. Kifungu cha maneno chenye maana fiche ni ________.
3. “Piga picha” maana yake ni ________.
4. Mama wa mume wangu anaitwa ________.
5. Daktari anafanya kazi katika ________.`
  }
]

function Grade4KiswahiliNotes() {
  const [search, setSearch] = useState('')
  const filtered = KISWAHILI_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 Kiswahili Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Lugha na Fasihi – maelezo ya kina na maswali ya kujaza pengo</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
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
    summary: 'God’s purpose, human responsibility, stewardship.',
    body: `GOD’S PURPOSE FOR CREATION
- Genesis 1 & 2: creation sequence, “goodness”.
- Humans created in God’s image, given breath and intellect.

HUMAN RESPONSIBILITY / STEWARDSHIP
- Dominion: not exploitation but responsible care.
- Practical conservation: soil, water, plants, animals.
- Biblical examples of judgment for mismanaging creation.

MASWALI NA MAJIBU
1. Mwanadamu aliumbwa kwa ________ ya Mungu.
2. Jukumu la mwanadamu kutunza mazingira huitwa ________.
3. Mungu aliumba ulimwengu kwa siku ________.
4. Dhambi ya uharibifu wa mazingira huleta ________.
5. Njia moja ya kutunza mazingira ni ________.`
  },
  {
    id: 'ot-leaders',
    title: 'Old Testament: Leaders, Covenants, Faith',
    summary: 'Abraham, Moses, David.',
    body: `THE CALL AND FAITH OF ABRAHAM
- Genesis 12: leaving Haran, covenant promises.
- Genesis 22: sacrifice of Isaac, ram provided.

MOSES AND THE EXODUS
- Burning bush, “I AM”, mission to free Israel.
- Passover: unleavened bread, unblemished lamb, blood.
- Sinai Covenant: Ten Commandments; duties to God (1‑4) and humans (5‑10).

DAVID AND LEADERSHIP
- Anointing by Samuel, heart over appearance.
- Courage (Goliath), humility, repentance (Psalm 51), loyalty to Saul.

MASWALI NA MAJIBU
Swali la 8 (Sinai Covenant):
Eleza madhumuni ya agano la Sinai na tofauti kati ya amri nne za kwanza na sita za mwisho. ________

Jibu: Agano la Sinai liliwaunganisha Waisraeli na Mungu; amri za kwanza zinahusu uhusiano na Mungu, sita za mwisho uhusiano na wanadamu.`
  },
  {
    id: 'nt-jesus',
    title: 'New Testament: Life, Ministry, Teachings',
    summary: 'Birth, ministry, miracles, parables, passion, resurrection.',
    body: `BIRTH AND EARLY LIFE
- Annunciation to Mary and Joseph; Immanuel.
- Bethlehem: manger, shepherds, Temple (Simeon, Anna).
- Escape to Egypt, Nazareth.

MINISTRY AND MIRACLES
- Baptism, temptations.
- Calming storm, feeding 5,000, healing paralytic.
- Parables: Good Samaritan, Prodigal Son.

PASSION, DEATH, RESURRECTION
- Last Supper, Gethsemane, trials, crucifixion.
- Resurrection, Emmaus, Great Commission.

MASWALI NA MAJIBU
1. Yesu alizaliwa katika mji wa ________.
2. Mfano wa Msamaria mwema unatufundisha kuwapenda ________.
3. Sadaka ya mwisho ya Yesu ilikuwa ________.
4. Ufufuo ulithibitisha kuwa Yesu ni ________.
5. Agizo kuu ni ________.`
  },
  {
    id: 'christian-living',
    title: 'Christian Living, Morality, Church History',
    summary: 'Fruits/Gifts of Holy Spirit, values, early church.',
    body: `FRUITS AND GIFTS OF THE HOLY SPIRIT
- Gifts (1 Cor 12): wisdom, healing, prophecy.
- Fruits (Gal 5): love, joy, peace, patience, kindness, self‑control.

CHRISTIAN VALUES
- Honesty, integrity, respect, empathy for orphans, widows, refugees.
- Resisting peer pressure: Daniel and friends.

EARLY CHURCH (Acts)
- Sharing possessions, caring for poor, breaking bread.

MASWALI NA MAJIBU
1. Tunda la kwanza la Roho ni ________.
2. Karama ya uponyaji ni mfano wa ________.
3. Kanisa la kwanza lilishirikiana kwa ________.
4. Kukataa shinikizo la marafiki kunahitaji ________.
5. Wajane na mayatima wanapaswa ________.`
  }
]

function Grade4CRENotes() {
  const [search, setSearch] = useState('')
  const filtered = CRE_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 CRE Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Creation, OT leaders, Jesus, Christian living – deep content and Q&A</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
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
    title: 'Quranic Studies',
    summary: 'Surah Al-Maun, Al-Fil, Al-Qadr, Al-Asr, tajweed.',
    body: `SURAH TRANSLATION, MEMORIZATION, THEMES
- Al-Maun: hypocrisy, neglecting orphans, small kindnesses.
- Al-Fil: Abrahah’s army, Ababil birds, Allah’s protection.
- Al-Qadr: Laylatul Qadr, angels, better than 1000 months.
- Al-Asr: time, humanity in loss except faith, good deeds, truth, patience.

RULES OF TAJWEED
- Madd (elongation), Makharij (articulation points).

MASWALI NA MAJIBU
1. Surah Al-Maun inalaani wale wanao ________.
2. Katika Al-Fil, ndege walioleta mawe walikuwa ________.
3. Laylatul Qadr iko katika mwezi wa ________.
4. Katika Al-Asr, waliookoka ni wenye ________ na matendo mema.
5. Tajweed inahusu ________ ya herufi.`
  },
  {
    id: 'hadith',
    title: 'Hadith',
    summary: 'Cleanliness, manners, kindness to animals.',
    body: `AUTHENTIC SAYINGS
- Cleanliness is half of faith (Iman).
- Honor parents, show mercy, avoid gossip.
- Person forgiven for giving water to a thirsty dog; punishment for locking up a cat.

MASWALI NA MAJIBU
1. “Usafi ni nusu ya ________.”
2. Kusema uwongo kuhusu mtu bila yeye kujua ni ________.
3. Mtu alisamehewa kwa kumpa ________ maji.
4. Mnyama aliyefungwa bila chakula alikuwa ________.
5. Heshima kwa wazazi ni sehemu ya ________.`
  },
  {
    id: 'pillars-fiqh',
    title: 'Pillars of Iman & Fiqh',
    summary: 'Tawheed, angels, holy books, wudhu, salah.',
    body: `PILLARS OF IMAN
- Tawheed: Rububiyyah, Uluhiyyah.
- Asmaul Husna: Al-Khaliq, Al-Ghaffar, Ar-Razzaq.
- Angels: Jibril, Mikail, Israfil, Malik, Ridwan.
- Holy Books: Taurat (Musa), Zabur (Dawud), Injeel (Isa), Quran (Muhammad).

FIQH – TWAHARA
- Wudhu: Fardh steps, Sunnah, invalidators.
- Tayammum when water unavailable.
- Salah: conditions, arkan, times, rak'ahs; congregational prayer.

SWALI LA 9 (Wudhu):
Taja tofauti kati ya Fardh na Sunnah za Wudhu. ________
Jibu: Fardh ni lazima kama kuosha uso, mikono, kichwa, miguu; Sunnah ni kama kuanza kwa Bismillah. Viharibifu ni kujisaidia, kulala, kupoteza fahamu, kugusa tupu.`
  }
]

function Grade4IRENotes() {
  const [search, setSearch] = useState('')
  const filtered = IRE_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 IRE Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Quran, Hadith, Iman, Fiqh – detailed with Q&A</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
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
    title: 'Paramatma (God and Manifestations)',
    summary: 'Nirguna/Saguna Brahman, Trimurti, Avatars.',
    body: `THE FORMLESS AND MANIFESTED DIVINE
- Nirguna Brahman: formless, infinite, omnipotent.
- Saguna Brahman: forms with attributes for devotion.

THE TRIMURTI
- Brahma: Creator (Saraswati).
- Vishnu: Preserver (Lakshmi).
- Shiva: Transformer (Parvati).

AVATARS
- Rama: ideal king.
- Krishna: divine teacher of Gita.

MASWALI NA MAJIBU
1. Hali ya Mungu asiye na umbo huitwa ________.
2. Muumba katika Trimurti ni ________.
3. Mhifadhi ni ________.
4. Mwokozi aliyezaliwa kama binadamu ni ________.
5. Ushirika wa Vishnu ni ________.`
  },
  {
    id: 'scriptures',
    title: 'Holy Scriptures (Granthas)',
    summary: 'Shruti, Smriti, Bhagavad Gita.',
    body: `CLASSIFICATION
- Shruti: Vedas (Rig, Yajur, Sama, Atharva), Upanishads.
- Smriti: Ramayana (Valmiki), Mahabharata (Vyasa).

BHAGAVAD GITA
- Setting: Kurukshetra.
- Lesson: Nishkama Karma – selfless action.

MASWALI NA MAJIBU
1. Vitabu vilivyosikika moja kwa moja huitwa ________.
2. Ramayana iliandikwa na ________.
3. Vita vya Kurukshetra vipo katika ________.
4. Fundisho la Gita ni ________.
5. Mahabharata iliandikwa na ________.`
  },
  {
    id: 'festivals',
    title: 'Festivals, Rituals, Worship',
    summary: 'Diwali, Janmashtami, Holi, Mandir, Puja.',
    body: `MAJOR FESTIVALS
- Diwali: lights, Rama’s return, victory of good.
- Janmashtami: birth of Krishna.
- Holi: colors, unity, forgiveness.

MANDIR AND PUJA
- Garbhagriha, Shikhara.
- Puja: Diya, incense, flowers, fruits, Aarti.
- Prasad: consecrated food.

MASWALI NA MAJIBU
1. Diwali inajulikana kama sikukuu ya ________.
2. Krushna alizaliwa siku ya ________.
3. Rangi za Holi zinaashiria ________.
4. Mahali patakatifu pa hekalu ni ________.
5. Chakula kilichobarikiwa baada ya puja ni ________.`
  }
]

function Grade4HRENotes() {
  const [search, setSearch] = useState('')
  const filtered = HRE_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 HRE Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Paramatma, scriptures, festivals – deep content and Q&A</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== SUPPLEMENTARY SUBJECTS ====================
const SUPP_TOPICS = [
  {
    id: 'visual-arts',
    title: 'Visual Arts Foundations',
    summary: 'Elements of design, color theory, techniques.',
    body: `ELEMENTS OF DESIGN
Line, shape, color, value (light/dark), texture, form (3‑D), and space.
Color theory: primary (red, yellow, blue), secondary (orange, green, purple), complementary (opposite on color wheel).
Techniques: sketching, printmaking, sculpting, painting, perspective scaling.

PRACTICE QUESTIONS
1. The path made by a moving point is a ________.
2. Red, yellow, and blue are ________ colors.
3. Mixing red and yellow makes ________.
4. The lightness or darkness of a color is its ________.
5. A 3‑D shape is called a ________.
6. Complementary colors are ________ on the color wheel.
7. A technique of making prints by pressing is ________.
8. To show depth in a drawing, artists use ________.
9. Green is a ________ color.
10. The empty area around objects is called ________.`
  },
  {
    id: 'music',
    title: 'Music Theory and Performance',
    summary: 'Note reading, rhythm, pitch, instruments, genres.',
    body: `MUSIC THEORY
Treble clef staff: lines E-G-B-D-F, spaces F-A-C-E.
Note values: whole note (4 beats), half note (2 beats), quarter note (1 beat), rests.
Time signatures: 4/4 (four quarter beats per measure), 3/4.
Pitch: how high or low a note sounds.
Instrument families: strings (violin), woodwinds (flute), brass (trumpet), percussion (drum).
Genres: classical, jazz, folk.

PRACTICE QUESTIONS
1. The treble clef is also called the ________ clef.
2. The note that gets 4 beats is a ________ note.
3. A quarter rest means silence for ________ beat.
4. In 3/4 time, there are ________ beats per measure.
5. The violin belongs to the ________ family.
6. A flute is a ________ instrument.
7. Highness or lowness of a sound is ________.
8. A genre with syncopated rhythms is ________.
9. The space notes in treble clef spell ________.
10. A trumpet is a ________ instrument.`
  },
  {
    id: 'theater',
    title: 'Theater, Drama, and Expressive Movement',
    summary: 'Characterization, blocking, script reading, vocal projection, improvisation.',
    body: `THEATER BASICS
Characterization: how an actor shows personality through voice, movement.
Blocking: planned movement on stage.
Script reading: understanding dialogue and stage directions.
Vocal projection: speaking loudly and clearly.
Improvisation: acting without a script.

PRACTICE QUESTIONS
1. An actor’s plan of where to move on stage is called ________.
2. Speaking loudly enough for the audience is vocal ________.
3. Acting without a written script is ________.
4. The written text of a play is the ________.
5. Instructions in a script for movement are ________ directions.
6. Creating a believable character is ________.
7. A performance space is a ________.
8. The person who directs the play is the ________.
9. An actor’s costume helps show ________.
10. The audience’s reaction is part of the ________ experience.`
  },
  {
    id: 'pe',
    title: 'Health and Physical Education',
    summary: 'Motor skills, cooperative gameplay, nutrition, wellness.',
    body: `MOTOR SKILLS AND MOVEMENT
Locomotor: walking, running, skipping, leaping.
Non‑locomotor: stretching, balancing, twisting.
Manipulative: throwing, catching, kicking, dribbling.

COOPERATIVE GAMEPLAY
Offensive and defensive strategies. Sportsmanship: following rules, respecting opponents, teamwork.

NUTRITION AND WELLNESS
Food groups: grains, vegetables, fruits, protein, dairy.
Nutrition facts label: serving size, calories, nutrients.
Cardiorespiratory exercise: activities that raise heart rate. Resting vs active heart rate.

PRACTICE QUESTIONS
1. Skipping is a ________ movement.
2. Throwing a ball is a ________ skill.
3. Playing fair is called ________.
4. The food group that includes rice and bread is ________.
5. A heart rate taken when you are sitting is the ________ heart rate.
6. Running is a ________ exercise.
7. A nutrient that builds muscles is ________.
8. The number of servings per container is found on the ________ label.
9. A balanced meal has items from different food ________.
10. The FITT principle stands for Frequency, Intensity, Time, and ________.`
  },
  {
    id: 'tech',
    title: 'Technology and Digital Literacy',
    summary: 'Hardware, software, keyboarding, digital citizenship, internet safety.',
    body: `HARDWARE, SOFTWARE, AND KEYBOARDING
Hardware: physical parts (monitor, keyboard, CPU).
Software: programs (word processor, browser).
Keyboarding: touch typing with proper posture; aim for accuracy and speed.

DIGITAL CITIZENSHIP AND INTERNET SAFETY
Keep personal information private. Cyberbullying: report, don’t engage.
Credible sources: check author, date, domain. Avoid plagiarism: cite sources.

PRACTICE QUESTIONS
1. The physical parts of a computer are called ________.
2. A program used to type documents is a ________ processor.
3. The correct finger placement on a keyboard is called ________ typing.
4. Information like your address is ________ information.
5. Being mean online repeatedly is ________.
6. A website ending in .gov is usually a ________ source.
7. Copying someone else’s work without credit is ________.
8. To stay safe online, never share your ________.
9. The brain of the computer is the ________.
10. A browser is used to view ________ pages.
11. The “save” command stores a file on the ________ drive.
12. A strong password should contain letters, numbers, and ________.
13. When you cite a source, you give ________.
14. The motherboard is a piece of ________.
15. Emails from strangers should not be ________.`
  }
]

function Grade4SupplementaryNotes() {
  const [search, setSearch] = useState('')
  const filtered = SUPP_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 4 Supplementary Subjects</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Arts, Music, Theater, Health & PE, Technology – deep gaps</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 4</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

// ==================== MAIN COMBINED COMPONENT ====================
export default function AllGrade4Notes() {
  const [activeSubject, setActiveSubject] = useState(null)

  const subjects = [
    { id: 'math',    label: 'Mathematics',           short: 'M',  desc: 'Number sense, operations, fractions and geometry',   color: '#6366f1', Component: Grade4MathNotes },
    { id: 'english', label: 'English Language Arts',  short: 'E',  desc: 'Reading comprehension, writing and grammar',         color: '#0ea5e9', Component: Grade4EnglishNotes },
    { id: 'science', label: 'Science',                short: 'Sc', desc: 'Physical, life, earth and space sciences',           color: '#8b5cf6', Component: Grade4ScienceNotes },
    { id: 'ss',      label: 'Social Studies',         short: 'SS', desc: 'Geography, history, civics and economics',          color: '#f59e0b', Component: Grade4SocialStudiesNotes },
    { id: 'kisw',    label: 'Kiswahili',              short: 'K',  desc: 'Lugha na fasihi, sarufi na ufahamu',                color: '#10b981', Component: Grade4KiswahiliNotes },
    { id: 'cre',     label: 'CRE',                    short: 'C',  desc: 'Christian Religious Education notes',               color: '#ef4444', Component: Grade4CRENotes },
    { id: 'ire',     label: 'IRE',                    short: 'I',  desc: 'Islamic Religious Education notes',                 color: '#f97316', Component: Grade4IRENotes },
    { id: 'hre',     label: 'HRE',                    short: 'H',  desc: 'Hindu Religious Education notes',                   color: '#ec4899', Component: Grade4HRENotes },
    { id: 'supp',    label: 'Supplementary',          short: 'S',  desc: 'Arts, Music, Theater, PE and Technology',           color: '#06b6d4', Component: Grade4SupplementaryNotes },
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>Grade 4 Notes</h1>
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