import { useState } from 'react'

// ==================== MATHEMATICS ====================
const MATH_TOPICS = [
  {
    id: 'num-decimal',
    title: 'Number Sense, Place Value, and Decimals',
    summary: 'Base‑10 to millions, decimal thousandths, powers of 10, comparing & rounding.',
    body: `The base‑10 number system is the foundation for all mathematics. Each place value is exactly 10 times greater than the one to its right. Moving from right to left, we have ones, tens, hundreds, thousands, ten‑thousands, hundred‑thousands, millions. In Grade 5 we extend this to ten‑millions and down to decimal thousandths. A digit’s value is determined by its location. For example, in 5,302,019, the digit 3 means 300,000, while the 2 means 2,000. The expanded form breaks the number into a sum of each digit’s place value: 5,000,000 + 300,000 + 2,000 + 10 + 9. Word form writes it as five million three hundred two thousand nineteen.

Decimals are a special way to write fractions with denominators that are powers of 10. The decimal point separates whole numbers from fractional parts. The first place after the point is tenths (1/10), the second is hundredths (1/100), the third is thousandths (1/1000). So 0.4 = 4/10, 0.25 = 25/100, 0.008 = 8/1000. Expanded form of a decimal uses fractions: 0.392 = 3 × (1/10) + 9 × (1/100) + 2 × (1/1000).

We compare decimals by looking at the digits from left to right. 0.6 > 0.59 because 0.6 = 0.60, and 60 hundredths > 59 hundredths. Rounding decimals follows the same rules as whole numbers: look at the digit to the right of the place you’re rounding to; if it’s 5 or more, round up. Example: 3.276 to the nearest tenth → 3.3 (the digit to the right of tenths is 7, which is ≥5). Rounding to the nearest whole number: 3.276 → 3, because 2 < 5.

Powers of 10 are a powerful tool. 10¹ = 10, 10² = 100, 10³ = 1,000. Multiplying a number by a power of 10 shifts the decimal point to the right by the exponent’s value. Dividing shifts it to the left. For example, 0.392 × 10³ = 0.392 × 1,000 = 392. The digits all moved three places left. This understanding helps us convert measurements and operate with large and small numbers.

ADDITIONAL DEEP DIVE: The decimal system is also called the Hindu‑Arabic numeral system because it was developed in India and transmitted to Europe via Arab mathematicians. Every digit’s value is ten times that of the digit to its immediate right, which is why we say it is “base‑10.” The concept of zero as a placeholder is crucial – without it, we couldn’t distinguish numbers like 52 and 502. In expanded form with powers of ten, 6,432,109 = 6×10⁶ + 4×10⁵ + 3×10⁴ + 2×10³ + 1×10² + 0×10¹ + 9×10⁰. This shows each digit multiplied by a power of ten based on its position. Decimal fractions extend this pattern to negative powers of ten: 0.1 = 10⁻¹, 0.01 = 10⁻², 0.001 = 10⁻³. So 0.392 = 3×10⁻¹ + 9×10⁻² + 2×10⁻³. Using exponents helps us understand why multiplying by 10ⁿ moves the decimal n places right (because each digit’s power of ten increases by n). Dividing by 10ⁿ moves it n places left. When comparing decimals, it is often helpful to annex zeros so both numbers have the same number of decimal places. This ensures an accurate digit‑by‑digit comparison. Rounding is used in everyday life: money is rounded to the nearest cent (hundredth), and measurements are often rounded to a convenient place. To avoid rounding errors in multi‑step problems, keep extra digits until the final answer.`

    + `\n\nPRACTICE QUESTIONS (fill in the blanks)\n1. In 4,607,218 the digit 6 represents ________.\n2. Write 200,000 + 30,000 + 500 + 60 + 7 as a single number: ________.\n3. 0.05 means five ________.\n4. 0.7 is ________ tenths, which is ________ as a fraction.\n5. Round 5.438 to the nearest hundredth: ________.\n6. 10³ equals ________.\n7. 0.6 ________ 0.58 (use > or <).\n8. The digit 9 in 0.192 is in the ________ place.\n9. Multiply 34.5 by 100: ________.\n10. Divide 8.1 by 10: ________.`
  },
  {
    id: 'operations',
    title: 'Multi‑Digit Whole Number & Decimal Operations',
    summary: 'Multiplication, division, decimals, estimation, remainders.',
    body: `Whole number multiplication in Grade 5 extends to three‑digit factors. The standard algorithm multiplies each digit, remembering to shift left for each lower place. Example: 324 × 256 = 324 × 200 + 324 × 50 + 324 × 6 = 64,800 + 16,200 + 1,944 = 82,944. Estimation helps check reasonableness: 300 × 260 ≈ 78,000, so 82,944 is plausible. Division with two‑digit divisors uses long division: 6,350 ÷ 42. We estimate 42 × 100 = 4,200, then 42 × 50 = 2,100; bringing it down step‑by‑step yields quotient 151 remainder 8. Remainders can be expressed as a fraction (8/42 = 4/21) or rounded up depending on context.

Decimal addition and subtraction require aligning decimal points. For example, 3.45 + 2.6 becomes 3.45 + 2.60 = 6.05. Multiplication of decimals ignores the decimal initially, then places it in the product based on the total number of decimal places in the factors. 1.2 × 0.35: 12 × 35 = 420; 1.2 has one decimal place, 0.35 has two, total three, so result is 0.420 = 0.42. Division of a decimal by a whole number keeps the decimal point directly above in the quotient: 3.24 ÷ 4 = 0.81. When dividing by a decimal, multiply both divisor and dividend by a power of 10 to make the divisor whole: 4.5 ÷ 0.15 → 450 ÷ 15 = 30. Always use inverse operations to check.

ADDITIONAL DEEP DIVE: The standard multiplication algorithm is based on the distributive property. For 324 × 256, we compute 324 × (200 + 50 + 6) = 324×200 + 324×50 + 324×6. This is why we shift partial products. The lattice method is another visual way to multiply multi‑digit numbers, breaking the multiplication into a grid and adding along diagonals. Estimation is a critical skill: rounding each factor to its highest place value gives a rough answer quickly; for 324 × 256, round to 300 × 300 = 90,000 to see if the product is reasonable. In division, remainders can be interpreted in three ways: as a fraction (remainder / divisor), as a decimal (by adding a decimal point and continuing division), or by rounding up or down depending on the context (e.g., you can’t have a fraction of a bus, so you round up). In decimal division, we rely on the property that multiplying both numbers by the same power of 10 does not change the quotient because a ÷ b = (a×10ⁿ) ÷ (b×10ⁿ).`

    + `\n\nPRACTICE QUESTIONS\n1. 528 × 47 = ________.\n2. 3,654 ÷ 18 = ________ remainder ________.\n3. 5.6 + 4.38 = ________.\n4. 7.2 − 3.05 = ________.\n5. 0.25 × 0.4 = ________.\n6. 8.4 ÷ 0.2 = ________.\n7. Round 13,488 ÷ 24 to the nearest hundred to estimate: ________.\n8. In 47 ÷ 5, the quotient is 9 R2; as a mixed number: ________.\n9. 1.25 × 8 = ________.\n10. A recipe uses 0.75 cup sugar. If we triple it, total sugar = ________ cup(s).`
  },
  {
    id: 'fractions',
    title: 'Fractions: Operations, Equivalence, and Scaling',
    summary: 'Add, subtract, multiply, divide fractions with unlike denominators; area models.',
    body: `To add or subtract fractions with unlike denominators, we must first find a common denominator. The Least Common Multiple (LCM) is the smallest multiple both denominators share. Example: 2/3 + 1/4. LCM of 3 and 4 is 12. Convert: 2/3 = 8/12, 1/4 = 3/12. Then add: 8/12 + 3/12 = 11/12. The same process works for mixed numbers: 1 2/3 + 2 1/4 = (1 + 2) + (8/12 + 3/12) = 3 + 11/12 = 3 11/12. Always simplify answers when possible.

Multiplication of fractions is straightforward: multiply numerators, multiply denominators. a/b × c/d = ac/bd. Example: 2/5 × 3/4 = 6/20 = 3/10. When multiplying a fraction by a whole number, write the whole number as a fraction: 3 × (2/5) = 3/1 × 2/5 = 6/5 = 1 1/5. Multiplication can be thought of as scaling: multiplying by a fraction less than 1 reduces the size; 5 × 2/3 is less than 5 because 2/3 < 1.

Division of a unit fraction by a whole number: 1/4 ÷ 3 = 1/12, because we split 1/4 into 3 equal pieces. Visually, if a whole is divided into fourths, and we take one fourth and split it three ways, each piece is 1/12. Dividing a whole number by a unit fraction asks how many of those fractions fit into the whole: 5 ÷ 1/2 = 10, because there are 10 halves in 5. This is the foundation of fraction division. Solving area problems with fractional side lengths uses multiplication; e.g., a rectangle 3/4 ft by 2/3 ft has area = 3/4 × 2/3 = 6/12 = 1/2 sq ft.

ADDITIONAL DEEP DIVE: The LCM can be found by listing multiples or by prime factorization. For 3 and 4, multiples of 3: 3,6,9,12; of 4: 4,8,12; LCM=12. When adding mixed numbers, an alternative method is to convert both to improper fractions, add, then convert back. For division, the “invert and multiply” rule (multiply by the reciprocal) will be learned later, but in Grade 5 we focus on the conceptual meaning. For 5 ÷ 1/2, we ask “how many halves in 5 wholes?” This connects to the measurement interpretation of division. Area models with fraction tiles or grid paper help visualize multiplication of fractions: shade one fraction horizontally, the other vertically, and the overlapping part represents the product.`

    + `\n\nPRACTICE QUESTIONS\n1. 3/8 + 1/4 = ________.\n2. 5/6 − 1/3 = ________.\n3. 2/3 × 4/5 = ________.\n4. 4 × 3/8 = ________ (simplest form).\n5. 1/3 ÷ 2 = ________.\n6. 6 ÷ 1/3 = ________.\n7. Find the LCM of 6 and 8: ________.\n8. Compare 3/4 and 2/3 using >,<,= (first convert): ________.\n9. A rectangle is 3/5 m by 1/2 m; area = ________ m².\n10. 1 3/4 + 2 2/3 = ________ (as mixed number).`
  },
  {
    id: 'algebra',
    title: 'Algebraic Thinking, Expressions, and Patterns',
    summary: 'Order of operations, writing expressions, generating patterns, coordinate plane.',
    body: `The order of operations (PEMDAS) ensures everyone evaluates an expression the same way. P = parentheses first; E = exponents (powers of 10); MD = multiplication and division from left to right; AS = addition and subtraction from left to right. Example: 24 ÷ 6 × 2 + (5 − 3)². First, inside parentheses: 5−3=2. Then exponent: 2²=4. Then division/multiplication left to right: 24÷6=4, then 4×2=8. Finally addition: 8+4=12. Without the rules, someone might get 24÷(6×2) etc., leading to different answers.

Writing numerical expressions from words translates a verbal description into math. “Add 5 and 8, then multiply by 3” becomes (5 + 8) × 3 or 3 × (5 + 8). “Subtract 12 from 50, then divide by 2” is (50 − 12) ÷ 2. The parentheses group the operation that must be done first. This helps us model real‑world situations.

Patterns help us see relationships. Two numerical patterns can be generated simultaneously with different rules. Rule 1: start at 0, add 3 → 0,3,6,9,12,15… Rule 2: start at 0, add 6 → 0,6,12,18,24,30… Corresponding terms form ordered pairs: (0,0), (3,6), (6,12), (9,18), (12,24), (15,30). We observe that each y‑coordinate is double the x‑coordinate. Plotting these points on a coordinate plane (first quadrant only initially) shows the relationship as a straight line. The coordinate plane has perpendicular axes intersecting at the origin (0,0). The x‑axis is horizontal, y‑axis vertical. An ordered pair (x,y) locates a point.

ADDITIONAL DEEP DIVE: PEMDAS is a convention, not a law of mathematics, but it is essential for unambiguous communication. A common mnemonic is “Please Excuse My Dear Aunt Sally.” In the expression 3 + 4 × 2, multiplication must be done first: 4×2=8, then 3+8=11. If parentheses were missing, writing (3+4)×2 gives 14. When writing expressions from word problems, pay attention to phrases like “the sum of,” “the difference between,” “the product of,” and “the quotient of,” which indicate grouping. Patterns with two rules help introduce the idea of proportional relationships – here the ratio y:x is constant (2:1). In the coordinate plane, the first quadrant has both coordinates positive. The horizontal axis is also called the abscissa (x) and the vertical the ordinate (y). Points like (2,0) lie on the x‑axis, (0,5) on the y‑axis.`

    + `\n\nPRACTICE QUESTIONS\n1. Evaluate: 3 + 4 × 2 = ________.\n2. (15 − 7) ÷ 2 + 3 = ________.\n3. Write an expression for: multiply the sum of 6 and 4 by 2: ________.\n4. If the rule is start at 2, add 5, the first three terms are ________, ________, ________.\n5. Two patterns: P1: 0,4,8,12; P2: 0,2,4,6. Corresponding pairs: ________.\n6. In the ordered pair (3,7), the 3 is the ________ coordinate.\n7. Plot point (5,2). The x‑coordinate tells you to move ________ units to the right.\n8. The origin is at (______, ______).\n9. 10³ = ________, which is a power of 10.\n10. Simplify: 2 × (3 + 4²) − 5 = ________.`
  },
  {
    id: 'measurement',
    title: 'Measurement, Data, and Volume',
    summary: 'Unit conversions, line plots, volume of prisms and composite solids.',
    body: `Measurements can be converted within the same system. In the metric system: 1 km = 1,000 m, 1 m = 100 cm, 1 cm = 10 mm; for mass, 1 kg = 1,000 g; for capacity, 1 L = 1,000 mL. The US Customary system uses different relationships: 1 mi = 5,280 ft, 1 yd = 3 ft, 1 ft = 12 in; 1 lb = 16 oz; 1 gal = 4 qt, 1 qt = 2 pt, 1 pt = 2 c. To convert a larger unit to a smaller unit, multiply. For example, 3 km = 3 × 1,000 = 3,000 m. Converting smaller to larger units divides.

Line plots (dot plots) display data measured in fractional units (1/2, 1/4, 1/8). Each X marks a data point. We can use the plot to answer questions: total length, how many more, average, etc., requiring fraction addition and subtraction.

Volume measures the space a 3‑D object occupies. A unit cube (1 cm³, 1 in³) is the basic unit. For a right rectangular prism, volume = length × width × height (V = lwh) or area of base × height (V = Bh). If a prism is 5 cm long, 3 cm wide, 2 cm high, V = 5 × 3 × 2 = 30 cm³. Composite solids are made of two or more non‑overlapping prisms. Find the volume of each part and add them together. Example: a bottom prism 10×6×4 and top 4×3×2: V = 240 + 24 = 264 cm³.

ADDITIONAL DEEP DIVE: The metric system is based on powers of ten, which makes conversion very simple – just move the decimal point. The US Customary system evolved from older English units and has more irregular conversion factors, so students must memorize them. A line plot can be used to find the fair share or mean by redistributing the data evenly. For volume, we distinguish between cubic units and the formula; the formula comes from finding how many unit cubes fill the prism: the base layer has l×w cubes, and there are h layers. For composite solids, it is crucial that the two parts do not overlap and share a common face; sometimes you need to subtract hidden volumes.`

    + `\n\nPRACTICE QUESTIONS\n1. Convert 4.5 km to meters: ________ m.\n2. 3 lb = ________ oz.\n3. A line plot shows five Xs at 1/4 inch. Total length = ________ in.\n4. A rectangular prism 8 cm × 3 cm × 5 cm has volume ________ cm³.\n5. A cube of edge 4 cm: volume = ________ cm³.\n6. Convert 7 ft to inches: ________ in.\n7. 2 gal = ________ qt.\n8. A base area of 20 cm², height 6 cm: volume = ________ cm³.\n9. Composite solid: prism A 6×5×2, prism B 4×3×2; total volume = ________.\n10. 1.5 L = ________ mL.`
  },
  {
    id: 'geometry',
    title: 'Geometry & The Coordinate Plane',
    summary: 'Coordinate system, classifying 2‑D figures, polygons, triangles, quadrilaterals.',
    body: `The coordinate plane is formed by two perpendicular number lines intersecting at the origin (0,0). The horizontal line is the x‑axis, vertical is the y‑axis. Any location is given as an ordered pair (x, y). The first coordinate tells you how far to move right from the origin, the second tells how far to move up. We work primarily in the first quadrant where both numbers are positive.

Classifying two‑dimensional figures is based on their properties. Polygons are closed shapes with straight sides. Triangles can be classified by angles: acute (all angles < 90°), right (one 90°), obtuse (one angle > 90°). By sides: equilateral (all sides equal), isosceles (two equal sides), scalene (no equal sides).

Quadrilaterals have four sides. A trapezoid has at least one pair of parallel sides. A parallelogram has both pairs of opposite sides parallel. A rhombus is a parallelogram with all sides equal. A rectangle is a parallelogram with four right angles. A square is both a rhombus and a rectangle – all sides equal and four right angles. These relationships form a hierarchy: all squares are rectangles, rhombuses, and parallelograms, but not all rectangles are squares.

We also examine symmetry: a figure has a line of symmetry if it can be folded along that line into two matching parts. For example, a square has four lines of symmetry.

ADDITIONAL DEEP DIVE: The coordinate plane was invented by René Descartes and is a foundation for algebra and data representation. A point’s coordinates can be used to calculate distance (later) and to draw shapes. In classifying polygons, the sum of interior angles of an n‑gon is (n−2)×180°. A triangle’s angles sum to 180°. So if one angle is 90°, the other two must be acute and sum to 90°. The hierarchy of quadrilaterals shows inclusive definitions: a square belongs to many categories. A trapezoid can be defined inclusively (at least one pair of parallel sides) or exclusively (exactly one pair); the inclusive definition is more common now. Symmetry lines can be vertical, horizontal, or diagonal.`

    + `\n\nPRACTICE QUESTIONS\n1. The point (0,0) is called the ________.\n2. To locate (7,3), from the origin move right ________, then up ________.\n3. A triangle with angles 50°, 60°, 70° is ________.\n4. A triangle with sides 5 cm, 5 cm, 8 cm is ________.\n5. A quadrilateral with exactly one pair of parallel sides is a ________.\n6. A parallelogram with all sides equal but angles not necessarily 90° is a ________.\n7. Every square is a ________ (name all: rectangle, rhombus, parallelogram).\n8. A shape with four lines of symmetry is a ________.\n9. The y‑axis is ________ (horizontal/vertical).\n10. If a shape has two lines of symmetry, it is at least a ________ (possible: rectangle).`
  },
  {
    id: 'assessment',
    title: 'Comprehensive Assessment & Answers',
    summary: 'Multi‑step problems testing all topics; answers included.',
    body: `QUESTION 1 (Decimal Place Value & Patterns)
Write 0.392 in expanded form using fractions: ________ (Answer: 3×(1/10) + 9×(1/100) + 2×(1/1000)).
Explain the relationship between the digit 9 and digit 2: The 9 is in the ________ place (hundredths), the 2 in the ________ place (thousandths). The value of the 9 is 10 times the value it would have if it were in the thousandths place.
Multiply 0.392 by 10³ = ________ g. The decimal moves ________ places to the right. (Answer: 392; three)

QUESTION 2 (Fraction Operations)
Add 3/4 + 5/6 + 1 1/3. Convert 1 1/3 = __/3. LCD of 4,6,3 = 12. 3/4 = 9/12, 5/6 = 10/12, 4/3 = 16/12. Sum = 35/12 = ________ as improper, ________ as mixed number. Subtract 1/8 from the total: 35/12 − 1/8 → LCD 24: 70/24 − 3/24 = 67/24 = ________ as mixed number. (Answers: 4/3; 35/12, 2 11/12; 2 19/24)

QUESTION 3 (Geometric Measurement – Volume)
Bottom prism 12×8×5 = ________ cm³; top 6×4×3 = ________ cm³. Total = ________ cm³. (Answers: 480; 72; 552)

QUESTION 4 (Order of Operations)
Evaluate: 50 ÷ (2 + 3) × 2 − 1. Inside parentheses: ____. Division: ____. Multiplication: ____. Subtraction: ____. (Answers: 5; 10; 20; 19)

QUESTION 5 (Patterns)
Rule1: start 0, add 3 → ____, ____, ____, ____. Rule2: start 0, add 6 → ____, ____, ____, ____. Corresponding pairs: (0,0), (__,__), (__,__), (__,__). Notice each y is ____ times x. (Answers: 0,3,6,9; 0,6,12,18; (3,6),(6,12),(9,18); two)

ADDITIONAL DEEP DIVE: This assessment integrates multiple concepts. Problem 1 links decimal place value to powers of ten and expanded form. Problem 2 requires fluency with LCM, converting mixed numbers, and fraction subtraction with unlike denominators. Problem 3 combines volume of composite solids. Problem 4 checks adherence to order of operations, especially the left‑to‑right rule for division and multiplication. Problem 5 connects patterns to coordinate graphing and proportional reasoning. When solving multi‑step problems, it is helpful to write down each step, not just the final answer, to minimize errors and show reasoning.`
  }
]

function Grade5MathNotes() {
  const [search, setSearch] = useState('')
  const filtered = MATH_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Mathematics Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Number sense, operations, fractions, algebra, measurement, geometry – with 10 exercises each</p>
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
    id: 'lit-comprehension',
    title: 'Reading Comprehension: Literature',
    summary: 'Textual analysis, theme, character & plot, figurative language, point of view.',
    body: `Reading literature deeply means going beyond the surface to understand what the author is saying and how they are saying it. When we quote accurately from a text, we pull exact words or sentences that support our thinking. For example, if a character's hands tremble, we can infer they are nervous or afraid. The theme of a story is the central message or lesson the author wants us to learn – it is not just what happened, but what it means. To find the theme, ask: what did the main character learn? How did they change? A good summary captures the main events in order without adding your own opinions.

Characters drive the plot forward through their choices and motivations. We compare characters by examining their traits, goals, and responses to challenges. For instance, in a story about two siblings, one might be brave and reckless while the other is cautious and thoughtful. Their different approaches create conflict and move the story forward. The plot structure includes exposition (introduction), rising action (building tension), climax (turning point), falling action, and resolution.

Figurative language adds richness to literature. A simile compares two things using "like" or "as" – "She was as brave as a lion." A metaphor says one thing is another – "Her heart was stone." Personification gives human qualities to non‑human things – "The wind whispered through the trees." Hyperbole is extreme exaggeration – "I've told you a million times." Understanding these helps us appreciate the author's craft. An idiom is a phrase whose meaning cannot be understood from the individual words alone, like "break a leg" meaning good luck.

The point of view determines who is telling the story and how much they know. In first‑person, the narrator is a character in the story using "I" and "we." We only know what that character thinks and feels. In third‑person limited, the narrator is outside the story but focuses on one character's thoughts. In third‑person omniscient, the narrator knows everything about all characters. The choice of point of view dramatically affects how readers experience the story – first‑person creates intimacy, while third‑person omniscient provides a broader perspective.

ADDITIONAL DEEP DIVE: When analyzing a text, readers should also consider the author’s tone (attitude toward the subject) and mood (atmosphere created for the reader). For example, a gloomy setting with dark clouds and chilly air can establish a suspenseful mood. Foreshadowing is a technique where the author gives hints about what will happen later. Flashbacks interrupt the chronological order to show past events. A symbol is an object that represents an idea (a dove symbolizes peace). Recognizing these devices deepens comprehension.`

    + `\n\nPRACTICE QUESTIONS\n1. The central message of a story is its ________.\n2. A comparison using "like" or "as" is a ________.\n3. "The angry sky roared" is an example of ________.\n4. "I am so hungry I could eat a horse" is a ________.\n5. First‑person narration uses the pronoun ________.\n6. The turning point of a story is the ________.\n7. To ________ means to read between the lines and make an educated guess.\n8. A phrase like "it's raining cats and dogs" is an ________.\n9. When a narrator knows everything about all characters, the point of view is ________.\n10. Quoting from the text means using the author's ________ words.`
  },
  {
    id: 'info-comprehension',
    title: 'Reading Comprehension: Informational Text',
    summary: 'Main ideas, text structures, vocabulary, multiple accounts, evaluating evidence.',
    body: `Informational texts teach us about the world. Unlike stories, their purpose is to convey facts, explain concepts, or argue a position. When reading an informational text, we must identify the main idea – the most important point the author wants us to understand. A text may have two or more main ideas, each supported by key details such as facts, statistics, examples, and expert opinions. We quote the text accurately to show exactly where we found our evidence.

Text structure refers to how an author organizes information. Common structures include: chronological order (events in time sequence), cause and effect (why something happened and what resulted), compare and contrast (similarities and differences), problem and solution (a difficulty and how it was addressed), and description (detailed information about a topic). Authors often use multiple structures within one text. For example, a text about climate change might begin with a problem‑solution structure, then switch to cause and effect to explain why temperatures are rising.

Domain‑specific vocabulary consists of words that are particular to a subject, like "photosynthesis" in science or "amendment" in civics. We use context clues – words and sentences around an unknown word – to determine its meaning. Context clues can be definitions, examples, synonyms, antonyms, or explanations.

When reading multiple accounts of the same event, we notice similarities and differences. A primary account comes from someone who experienced the event directly; a secondary account is written later by someone who studied the event. Comparing accounts helps us understand bias and perspective. We also evaluate the author's reasoning: are the reasons supported by evidence? Is the evidence relevant and sufficient? Strong arguments use multiple pieces of credible evidence to support each claim.

ADDITIONAL DEEP DIVE: Graphic features such as diagrams, charts, timelines, and maps support informational text. Captions explain images. Headings and subheadings preview sections. A table of contents and index aid navigation. When evaluating evidence, consider if it is from a trustworthy source (e.g., .gov, .edu, or reputable organizations). Cross‑checking facts with other sources builds credibility.`

    + `\n\nPRACTICE QUESTIONS\n1. The most important point in a text is the ________ idea.\n2. A text structure showing events in time order is ________.\n3. Why something happens and what results is ________ and ________.\n4. Words specific to a subject area are called ________ vocabulary.\n5. A firsthand account written by someone present is a ________ source.\n6. Hints in the surrounding text that help define a word are ________ clues.\n7. To find similarities and differences, an author uses ________ and contrast.\n8. An author's claim should be supported by ________.\n9. A biography written about Abraham Lincoln 100 years after his death is a ________ source.\n10. The structure that presents a difficulty and how it was fixed is ________ and ________.`
  },
  {
    id: 'writing',
    title: 'Writing: Opinion, Informative, and Narrative',
    summary: 'Crafting arguments, explaining ideas, telling stories, research process.',
    body: `Strong writing follows a clear structure and uses evidence to support ideas. Opinion (argumentative) writing begins with a clear position on a topic. The introduction states the claim. Body paragraphs each present a reason supported by facts, examples, and quotations from credible sources. Transitional phrases like "consequently," "specifically," and "in contrast" connect ideas smoothly. The conclusion restates the claim and summarizes reasons, leaving the reader with a final thought.

Informative writing teaches the reader about a topic. It starts with an introduction that presents the focus. Information is grouped logically into paragraphs with headings and subheadings. Each paragraph develops one aspect of the topic using facts, definitions, concrete details, and quotations. Domain‑specific vocabulary adds precision. Illustrations, charts, and multimedia can help explain complex ideas. The conclusion wraps up the information without introducing new points.

Narrative writing tells a story. It establishes a situation, introduces a narrator and characters, and organizes events in a logical sequence. Dialogue brings characters to life – use quotation marks correctly and vary dialogue tags (said, whispered, shouted). Pacing controls how quickly events unfold: short sentences create tension, while longer descriptions slow the pace for reflection. Sensory details (sight, sound, smell, touch, taste) make the story vivid. Transitional words show the passage of time (meanwhile, later, after). The conclusion reflects on the experience or provides a satisfying ending.

The writing process involves planning (brainstorming, outlining), drafting (getting ideas on paper), revising (improving content and structure), editing (correcting grammar and spelling), and publishing (sharing the final piece). Research projects require gathering information from multiple print and digital sources, taking notes, summarizing or paraphrasing, and listing sources in a bibliography. Keyboarding fluency is essential – Grade 5 students should type at least two pages in a sitting.

ADDITIONAL DEEP DIVE: Peer review helps writers improve; peers can offer feedback on clarity, organization, and interest. When revising, look for sentence variety – mix simple, compound, and complex sentences. Use a checklist: does the writing stay on topic? Is the evidence convincing? Are there any grammar or spelling errors? Editing marks (caret ^, delete, etc.) are used for corrections. In research, note‑taking strategies include the Cornell method or bullet points. Paraphrasing is restating in your own words while preserving meaning; it is not just swapping synonyms.`

    + `\n\nPRACTICE QUESTIONS\n1. An opinion essay begins by stating a clear ________.\n2. Each body paragraph should provide a ________ supported by evidence.\n3. The final paragraph that wraps up ideas is the ________.\n4. Information grouped under topics uses ________ to organize sections.\n5. In a story, the words characters speak are called ________.\n6. Details that appeal to the five senses are ________ details.\n7. The first step of the writing process is ________.\n8. When you use someone else's words, you must ________ them.\n9. A list of sources used in research is called a ________.\n10. Grade 5 students should type at least ________ pages in one sitting.`
  },
  {
    id: 'grammar',
    title: 'Language, Grammar, and Conventions',
    summary: 'Conjunctions, prepositions, interjections, perfect tenses, sentence types, punctuation, vocabulary.',
    body: `Grammar rules help us communicate clearly. Conjunctions connect words, phrases, and clauses. Coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so) join equal parts. Subordinating conjunctions (because, although, since, unless) introduce dependent clauses. Correlative conjunctions work in pairs: either/or, neither/nor, both/and, not only/but also. Prepositions show relationships in time, place, or direction (on, under, through, during). Interjections express emotion (Wow! Oh no! Hey!).

Verb tenses indicate when an action occurs. The perfect tenses show completed actions: past perfect (I had walked before it rained), present perfect (I have walked three miles today), future perfect (I will have walked ten miles by noon). Avoid shifting tenses unnecessarily within a paragraph. Sentences come in three structures: simple (one independent clause), compound (two independent clauses joined by a conjunction), and complex (one independent and at least one dependent clause). Using variety makes writing more interesting.

Punctuation clarifies meaning. A comma separates items in a series and sets off introductory elements. Use commas, parentheses, or dashes to set off nonrestrictive elements – information that adds detail but is not essential. Quotation marks enclose direct speech. An apostrophe shows possession (the girl's book) or contraction (can't = cannot).

Vocabulary grows by using context clues, understanding Greek and Latin roots (bio = life, graph = write, geo = earth), and consulting reference materials. Synonyms are words with similar meanings; antonyms are opposites. Homographs are words spelled the same but with different meanings (bat – animal / baseball equipment). Idioms, adages, and proverbs are expressions with deeper cultural meanings.

ADDITIONAL DEEP DIVE: Subject‑verb agreement means the verb must match the subject in number (he runs, they run). Pronoun‑antecedent agreement ensures pronouns refer correctly to nouns (the student brought his or her book – or their book, which is increasingly accepted). When using quotation marks, periods and commas go inside the closing quotation marks in American English. An apostrophe is not used to form plurals (apple’s is possessive; apples is plural).`

    + `\n\nPRACTICE QUESTIONS\n1. The conjunctions for, and, nor, but, or, yet, so are called ________ conjunctions.\n2. "Either you start now, ________ you will be late" – use correlative conjunction.\n3. A word that shows relationship like "under" or "during" is a ________.\n4. "Wow!" is an example of an ________.\n5. "I have finished my homework" uses the ________ perfect tense.\n6. A sentence with two independent clauses joined by "and" is a ________ sentence.\n7. Commas separate items in a ________.\n8. The apostrophe in "dog's" shows ________.\n9. The Greek root "bio" means ________.\n10. Words with opposite meanings are called ________.`
  }
]

function Grade5EnglishNotes() {
  const [search, setSearch] = useState('')
  const filtered = ENGLISH_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 English Language Arts Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Literature, informational text, writing, grammar – 10 exercises per topic</p>
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
    title: 'Physical Science: Matter, Its Properties and Interactions',
    summary: 'Particles, mass, volume, conservation of matter, physical vs chemical changes.',
    body: `All matter is made of particles too small to be seen – atoms and molecules. These particles are in constant motion. The particle model explains many observations: a balloon inflates because gas particles spread out and push against the walls; sugar seems to disappear in water because its particles separate and mix between water particles. Properties of matter include mass (amount of matter), volume (space taken), density (mass per volume), electrical conductivity (ability to carry electricity), thermal conductivity (ability to carry heat), magnetism (response to magnetic fields), and solubility (ability to dissolve). We measure and graph these properties to compare substances.

The Law of Conservation of Matter states that matter cannot be created or destroyed; it only changes form. In a sealed container, the total mass before and after any change – heating, cooling, mixing, dissolving, or reacting – stays exactly the same. If 15 grams of baking soda and 100 grams of vinegar react in a sealed flask‑balloon system, the final mass is still 115 grams plus the mass of the container. The gas produced stays trapped in the balloon, so nothing is lost.

A physical change alters the form or appearance of matter but does not create a new substance. Examples: melting ice (solid to liquid), boiling water (liquid to gas), tearing paper, dissolving sugar. The substance itself remains the same. A chemical change produces one or more new substances with different properties. Evidence of chemical change includes: unexpected color change, gas production (bubbles or fizzing), formation of a solid precipitate, temperature change (gets hot or cold without heating/cooling), and light production. For example, burning wood changes it into ash, smoke, and gases – it cannot be undone. Rusting iron is a slow chemical change. Cooking an egg changes its proteins permanently.

ADDITIONAL DEEP DIVE: The particle model also explains why different substances have different densities – the mass of particles and how tightly they are packed. An object will float if its density is less than the fluid it’s in. Solubility is temperature‑dependent; most solids dissolve better in hot water. Conservation of matter is a cornerstone of chemistry; even in nuclear reactions, matter and energy are conserved together (Einstein’s E=mc²), but at the Grade 5 level we focus on ordinary chemical and physical changes. A common misconception is that mass disappears when something dissolves; it does not, it just becomes part of the solution.`

    + `\n\nPRACTICE QUESTIONS\n1. All matter is made of tiny ________ called atoms and molecules.\n2. The amount of matter in an object is its ________.\n3. The space an object takes up is its ________.\n4. The Law of Conservation of ________ states that matter cannot be created or destroyed.\n5. Melting ice is a ________ change.\n6. Evidence of a chemical change includes gas production, color change, and ________.\n7. When baking soda and vinegar react, the mass after the reaction is ________ the mass before (if sealed).\n8. Rust forming on iron is a ________ change.\n9. Sugar dissolving in water is a ________ change.\n10. The ability of a substance to dissolve is called ________.`
  },
  {
    id: 'ecosystems',
    title: 'Life Science: Ecosystems, Energy, and Matter Cycling',
    summary: 'Food chains/webs, energy flow, decomposers, plant nutrition from air and water.',
    body: `Every ecosystem runs on energy. The primary source of energy for almost all ecosystems is the sun. Through photosynthesis, plants (producers) capture sunlight energy and use it to convert carbon dioxide and water into glucose (food) and oxygen. This energy then flows through the ecosystem as organisms eat one another. A food chain shows a single path of energy: sun → grass → grasshopper → frog → snake → hawk. A food web is a network of interconnected food chains, showing the complex feeding relationships in an ecosystem.

Organisms are grouped by how they obtain energy. Producers (autotrophs) make their own food through photosynthesis. Consumers (heterotrophs) eat other organisms. Primary consumers (herbivores) eat only plants. Secondary and tertiary consumers (carnivores) eat other animals. Omnivores eat both plants and animals. Decomposers (bacteria, fungi, worms) break down dead organisms and waste, returning nutrients to the soil. Without decomposers, nutrients would remain locked in dead matter and plants could not grow.

Matter cycles through ecosystems continuously. Unlike energy, which flows in one direction and is eventually lost as heat, matter is recycled. The carbon cycle, nitrogen cycle, and water cycle all move matter between organisms and the environment. When plants and animals die, decomposers break them down, releasing nutrients back into the soil. Plants absorb these nutrients through their roots. Interestingly, most of a plant's mass comes from air (carbon dioxide) and water, not from soil. Plants use carbon from CO₂ and hydrogen and oxygen from water to build their structures through photosynthesis. Soil provides minerals, but the bulk of the plant's body is built from air and water.

ADDITIONAL DEEP DIVE: The energy pyramid explains why only about 10% of energy passes from one trophic level to the next – the rest is used for metabolism or lost as heat. This limits the length of food chains (rarely more than 4‑5 levels). Keystone species are organisms that have a disproportionately large effect on their environment (like sea otters). Invasive species can disrupt existing food webs. Pollution can biomagnify up the food chain (e.g., DDT).`

    + `\n\nPRACTICE QUESTIONS\n1. The primary source of energy for almost all ecosystems is the ________.\n2. Organisms that make their own food are called ________.\n3. An animal that eats only plants is a ________.\n4. An animal that eats both plants and animals is an ________.\n5. A network of interconnected food chains is a food ________.\n6. Organisms that break down dead matter are ________.\n7. Plants get most of their mass from ________ and water.\n8. The process by which plants make food is ________.\n9. Unlike energy, ________ cycles through the ecosystem.\n10. A hawk eating a snake is an example of a ________ consumer.`
  },
  {
    id: 'earth-space',
    title: 'Earth and Space Science: Systems, Water, Stars, and Motion',
    summary: 'Four spheres, water distribution, apparent brightness, seasons, day/night.',
    body: `Earth is a system of four interacting spheres. The geosphere includes all rocks, minerals, mountains, and the planet's internal layers (crust, mantle, core). The hydrosphere contains all water – oceans, lakes, rivers, ice caps, glaciers, groundwater, and atmospheric water vapor. The biosphere encompasses all living organisms, from microscopic bacteria to giant whales, across land, water, and air. The atmosphere is the layer of gases surrounding Earth, stratified by temperature: troposphere (weather), stratosphere (ozone layer), mesosphere, thermosphere.

These spheres constantly interact. For example, the geosphere and hydrosphere interact when rivers erode mountains, carrying sediment to oceans. The biosphere and atmosphere interact when plants take in carbon dioxide and release oxygen. A rain shadow effect occurs when moist ocean air rises over a coastal mountain range (geosphere‑hydrosphere‑atmosphere interaction), cooling and releasing rain on the windward side, leaving the leeward side dry.

Earth's water is not evenly distributed. Approximately 97% of all water on Earth is salt water in oceans. Only about 3% is fresh water, and of that, about two‑thirds is locked in ice caps and glaciers. Less than 1% of Earth's total water is easily accessible fresh water in lakes, rivers, and groundwater. This makes fresh water a precious resource that must be conserved and protected.

In space, the sun appears much brighter than other stars not because it is larger or more luminous than all stars, but because it is so much closer to Earth. Other stars are incredibly far away, so their light appears dimmer even though many are actually larger and brighter than our sun. Earth's rotation on its axis (once every 24 hours) causes day and night. Earth's revolution around the sun (365¼ days) combined with its tilted axis (23.5°) causes seasons. As Earth orbits, different hemispheres tilt toward or away from the sun, changing the angle and duration of sunlight, creating summer and winter.

ADDITIONAL DEEP DIVE: The ozone layer in the stratosphere absorbs harmful ultraviolet radiation. The water cycle (evaporation, condensation, precipitation, collection) continuously renews fresh water supplies. Stars appear to twinkle because of turbulence in Earth’s atmosphere. The sun is a medium‑sized yellow dwarf star. The moon’s phases and eclipses are caused by the alignment of Earth, moon, and sun.`

    + `\n\nPRACTICE QUESTIONS\n1. The four spheres are geosphere, hydrosphere, biosphere, and ________.\n2. The layer of gases around Earth is the ________.\n3. About 97% of Earth's water is ________ water.\n4. Most fresh water is locked in ________ and glaciers.\n5. The sun appears brighter than other stars because it is ________ to Earth.\n6. Earth's ________ on its axis causes day and night.\n7. Earth takes ________ days to orbit the sun.\n8. The Earth's axis is tilted at approximately ________ degrees.\n9. The ________ effect occurs when mountains block rain from reaching the leeward side.\n10. The ________ contains all living organisms on Earth.`
  },
  {
    id: 'space-gravity',
    title: 'Gravity and Space Systems',
    summary: 'Gravitational force, Earth\'s pull, orbits, moon phases, constellations.',
    body: `Gravity is a universal attractive force between any two objects that have mass. The more mass an object has, the stronger its gravitational pull. The closer two objects are, the stronger the gravitational force between them. Earth's gravity pulls all objects downward toward the center of the planet – this is why things fall to the ground and why we stay on Earth's surface rather than floating into space. The gravitational force exerted by Earth is directed toward the center of the Earth, which appears as "down" to us no matter where we stand on the planet.

Gravity keeps the moon orbiting Earth and Earth orbiting the sun. Without gravity, these bodies would fly off into space in straight lines. The balance between the forward motion of a planet or moon and the inward pull of gravity creates a stable orbit. This same principle explains why satellites stay in orbit around Earth. The International Space Station continuously falls toward Earth due to gravity, but its forward speed is so great that it keeps missing Earth, creating a perpetual free‑fall orbit.

The moon's changing appearance throughout the month is called phases. The moon doesn't produce its own light; we see it because it reflects sunlight. As the moon orbits Earth, different amounts of its sunlit side face us, creating the phases: new moon (dark side facing us), waxing crescent, first quarter, waxing gibbous, full moon (entire sunlit side facing us), waning gibbous, last quarter, waning crescent, and back to new moon. The full cycle takes about 29.5 days, called a lunar month. Constellations are patterns of stars that ancient people named. As Earth orbits the sun, different constellations become visible at different times of year because our night‑time view of space changes.

ADDITIONAL DEEP DIVE: The force of gravity is calculated by Newton’s law of universal gravitation: F = G×(m₁×m₂)/r². Weight is the measure of gravitational force on an object; mass stays the same anywhere, but weight changes with gravity. The moon’s gravity is 1/6 of Earth’s, so you would weigh less there. Eclipses occur when the moon passes into Earth’s shadow (lunar eclipse) or the moon casts a shadow on Earth (solar eclipse).`

    + `\n\nPRACTICE QUESTIONS\n1. Gravity is a force of ________ between all objects with mass.\n2. Earth's gravity pulls objects toward the ________ of the Earth.\n3. The moon stays in orbit around Earth because of ________.\n4. The moon does not produce its own ________; it reflects sunlight.\n5. When the entire sunlit side of the moon faces Earth, it is a ________ moon.\n6. The full cycle of moon phases takes about ________ days.\n7. A pattern of stars named by ancient people is a ________.\n8. Gravity depends on mass and ________ between objects.\n9. The International Space Station stays in orbit because of its high forward ________.\n10. During a new moon, the ________ side of the moon faces Earth.`
  }
]

function Grade5ScienceNotes() {
  const [search, setSearch] = useState('')
  const filtered = SCIENCE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Science Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Matter, ecosystems, earth systems, space, gravity – 10 exercises per topic</p>
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
    title: 'Early American History, Colonization, and Conflict',
    summary: 'Indigenous civilizations, European exploration, Columbian Exchange, colonial regions, Atlantic slave trade.',
    body: `Long before Europeans arrived, complex civilizations flourished in the Americas. The Aztec built massive cities with temples and aqueducts in central Mexico. The Maya developed advanced writing, mathematics, and astronomy in the Yucatán. The Inca constructed a vast road network through the Andes Mountains. In North America, the Mississippian culture built large earthen mounds like Cahokia, while the Ancestral Puebloans carved cliff dwellings in the Southwest. The Iroquois League united five (later six) nations under a sophisticated constitution that influenced American democracy. These societies had diverse social hierarchies, agricultural innovations like the Three Sisters (corn, beans, squash planted together), and complex governance structures.

European exploration began in the late 1400s, driven by desires for new trade routes to Asia, wealth from gold and spices, and the spread of Christianity. Spain and Portugal led the way, followed by France, England, and the Netherlands. Christopher Columbus's 1492 voyage connected the Eastern and Western Hemispheres permanently. The Columbian Exchange was the global transfer of plants, animals, people, culture, technology, and diseases between the Old World (Europe, Africa, Asia) and the New World (the Americas). Europeans brought wheat, rice, sugar, horses, cattle, and diseases like smallpox. From the Americas, they took corn, potatoes, tomatoes, tobacco, and cacao. This exchange transformed diets and populations worldwide but also devastated indigenous communities through disease.

Three distinct colonial regions emerged in British North America. The New England Colonies (Massachusetts, Connecticut, Rhode Island, New Hampshire) had rocky soil, cold winters, and short growing seasons. They turned to subsistence farming, fishing, shipbuilding, and trade. Their society centered on religion and town meetings. The Middle Colonies (New York, New Jersey, Pennsylvania, Delaware) had fertile soil and a moderate climate, earning the nickname "Breadbasket" for their grain production. They were ethnically diverse and religiously tolerant. The Southern Colonies (Maryland, Virginia, North Carolina, South Carolina, Georgia) had warm climates, long growing seasons, and vast fertile land ideal for large‑scale agriculture. They developed a plantation economy based on cash crops: tobacco, rice, and indigo. The plantation system required massive labor, which led to the institutionalization of chattel slavery. The Atlantic slave trade became part of the triangular trade, in which European goods went to Africa, enslaved Africans were transported through the brutal Middle Passage to the Americas, and raw materials from the colonies were shipped to Europe.

ADDITIONAL DEEP DIVE: The Proclamation of 1763 restricted colonial expansion west of the Appalachian Mountains, angering settlers. Mercantilism was the economic theory that colonies existed to benefit the mother country. The Navigation Acts restricted colonial trade to England. Indentured servitude was an early labor system before slavery became dominant. Bacon’s Rebellion (1676) showed tensions between frontier settlers and the elite, accelerating the shift to racial slavery.`

    + `\n\nPRACTICE QUESTIONS\n1. The ________ Exchange was the global transfer of plants, animals, and diseases between hemispheres.\n2. The Three Sisters farming method planted corn, beans, and ________ together.\n3. The ________ League united five Iroquois nations under a constitution.\n4. The ________ built cliff dwellings in the American Southwest.\n5. The Middle Colonies were called the "________" for their grain production.\n6. The Southern economy relied on cash crops like tobacco, rice, and ________.\n7. The brutal voyage of enslaved Africans across the Atlantic was the ________ Passage.\n8. The first permanent English settlement in America was ________, Virginia.\n9. Smallpox was a ________ brought by Europeans that killed many Native Americans.\n10. The triangular trade connected Europe, Africa, and the ________.`
  },
  {
    id: 'revolution',
    title: 'The American Revolution and Nation Building',
    summary: 'Causes of the Revolution, Declaration of Independence, war, Articles of Confederation, Constitutional Convention.',
    body: `Tensions between the American colonies and Great Britain grew throughout the 1760s and 1770s. After the French and Indian War (1754–1763), Britain was deeply in debt and sought to raise revenue from the colonies through a series of acts. The Stamp Act (1765) taxed all paper documents, leading to protests and the cry "No taxation without representation!" The Townshend Acts taxed goods like tea, glass, and paint. The Boston Massacre (1770) saw British soldiers fire on a crowd, killing five colonists. The Tea Act led to the Boston Tea Party (1773), when colonists dumped tea into Boston Harbor. In retaliation, Britain passed the Intolerable Acts, closing Boston's port and restricting self‑government.

These actions united the colonies. The First Continental Congress met in 1774 to discuss grievances. In early 1775, the first shots of the Revolutionary War were fired at Lexington and Concord. Thomas Paine's pamphlet "Common Sense" (1776) argued powerfully for independence, convincing many colonists. On July 4, 1776, the Second Continental Congress adopted the Declaration of Independence, primarily written by Thomas Jefferson. The Declaration stated that all men are created equal and have unalienable rights to life, liberty, and the pursuit of happiness. It listed grievances against King George III and declared the colonies free and independent states.

The Revolutionary War was long and difficult. Key turning points included the American victory at Saratoga (1777), which convinced France to openly ally with the Americans. The harsh winter at Valley Forge tested the Continental Army's endurance, but training under Baron von Steuben improved the troops. The final major battle at Yorktown (1781) resulted in British surrender. The Treaty of Paris (1783) officially recognized American independence.

After the war, the new nation operated under the Articles of Confederation, which created a weak central government with no power to tax or regulate trade. Shays' Rebellion (1786–87) exposed these weaknesses. In 1787, delegates met at the Constitutional Convention in Philadelphia and drafted the U.S. Constitution. Key compromises included the Great Compromise (bicameral legislature with Senate and House of Representatives) and the Three‑Fifths Compromise (counting three‑fifths of the enslaved population for representation and taxation).

ADDITIONAL DEEP DIVE: The Bill of Rights, the first ten amendments to the Constitution, was added to address Anti‑Federalist concerns about individual liberties. The Federalist Papers, written by Hamilton, Madison, and Jay, promoted ratification. The Northwest Ordinance (1787) set rules for creating new states and banned slavery in the Northwest Territory.`

    + `\n\nPRACTICE QUESTIONS\n1. "No taxation without ________" was a colonial slogan.\n2. The Boston Tea Party protested the ________ Act.\n3. Thomas Paine wrote "________ Sense" to argue for independence.\n4. The Declaration of Independence was adopted on July 4, ________.\n5. The American victory at ________ convinced France to join the war.\n6. The harsh winter camp of the Continental Army was at ________ Forge.\n7. The final major battle of the war was at ________.\n8. The first U.S. government under the ________ of Confederation was weak.\n9. The ________ Compromise created a two‑house legislature.\n10. The ________‑Fifths Compromise counted enslaved people partially for representation.`
  },
  {
    id: 'civics',
    title: 'Advanced Civics and Constitutional Frameworks',
    summary: 'Constitutional principles, Bill of Rights, citizenship, voting rights.',
    body: `The U.S. Constitution is built on several core principles. Federalism divides power between the national (federal) government and state governments. The national government handles issues like defense, foreign policy, and interstate commerce, while states manage education, local law enforcement, and elections. Separation of powers divides the federal government into three branches: Legislative (Congress, makes laws), Executive (President, enforces laws), and Judicial (Supreme Court, interprets laws). Checks and balances ensure no single branch becomes too powerful. For example, Congress passes laws, but the President can veto them; Congress can override a veto with a two‑thirds vote; the Supreme Court can declare laws unconstitutional through judicial review.

Popular sovereignty means that the government's authority comes from the people, who exercise power through voting. The Constitution begins with "We the People," emphasizing this principle. The Bill of Rights, the first ten amendments to the Constitution, protects individual liberties. The First Amendment guarantees freedom of speech, press, religion, assembly, and petition. The Second protects the right to bear arms. The Fourth protects against unreasonable searches and seizures. The Fifth ensures due process and protects against self‑incrimination. The Sixth guarantees a speedy and public trial. The Eighth prohibits cruel and unusual punishment. The Tenth reserves powers not given to the federal government to the states or the people.

Citizenship comes with both rights and responsibilities. Natural‑born citizens are those born in the United States or to U.S. citizen parents. Immigrants can become citizens through naturalization, a process requiring residency, knowledge of U.S. history and government, and an oath of allegiance. Voting rights have expanded over time. Originally, only white male property owners could vote. The 15th Amendment (1870) prohibited denying the vote based on race. The 19th Amendment (1920) gave women the right to vote. The 26th Amendment (1971) lowered the voting age to 18.

ADDITIONAL DEEP DIVE: The Civil Rights Movement of the 1950s‑60s led to the Voting Rights Act of 1965, which enforced the 15th Amendment by removing discriminatory practices like literacy tests. Civic duties include obeying laws, paying taxes, serving on a jury, and registering for selective service (for men). The naturalization exam tests English proficiency and knowledge of civics.`

    + `\n\nPRACTICE QUESTIONS\n1. The division of power between national and state governments is called ________.\n2. The ________ branch makes laws.\n3. The President leads the ________ branch.\n4. The Supreme Court can declare laws ________ through judicial review.\n5. "We the People" expresses the principle of popular ________.\n6. The first ten amendments are the ________ of Rights.\n7. The ________ Amendment guarantees freedom of speech.\n8. The process of becoming a citizen is called ________.\n9. The 19th Amendment gave ________ the right to vote.\n10. The 26th Amendment lowered the voting age to ________.`
  },
  {
    id: 'economics',
    title: 'Macroeconomics, Trade Networks, and Geography',
    summary: 'Specialization, trade, tariffs, supply/demand, maps, GIS, migration.',
    body: `Economics is the study of how people make choices to satisfy their wants and needs with limited resources. Scarcity forces individuals, businesses, and governments to make decisions. Opportunity cost is the value of the next best alternative that is given up when a choice is made. Specialization occurs when people, businesses, or countries focus on producing specific goods or services they can make most efficiently, often due to natural resources, climate, or skills. Specialization increases productivity but makes trade necessary. Nations export goods they specialize in and import goods they need.

Global trade policies affect economies. A tariff is a tax on imported goods, making them more expensive and protecting domestic industries. An import quota limits the quantity of a good that can be brought into a country. A trade deficit occurs when a country imports more than it exports. Free trade agreements reduce barriers between nations. Supply and demand determine prices in a market economy. Demand is how much of a product consumers want and can pay for. Supply is how much producers are willing to sell. When demand exceeds supply, prices rise; when supply exceeds demand, prices fall.

Geography helps us understand the world. Physical maps show landforms like mountains and rivers. Political maps show borders, cities, and countries. Thematic maps focus on specific topics like population density, climate zones, or economic activity. Geographic Information Systems (GIS) use computers to layer multiple types of data on maps, helping planners and scientists analyze patterns. Migration is the movement of people from one place to another. Push factors (war, famine, poverty) drive people away, while pull factors (jobs, freedom, safety) attract them to new places. Urbanization is the growth of cities as people move from rural areas. These movements reshape demographics, economies, and cultures.

ADDITIONAL DEEP DIVE: The global supply chain illustrates interdependence; a smartphone might be designed in the US, assembled in China with parts from Japan, Korea, and Germany. The North American Free Trade Agreement (NAFTA) eliminated many tariffs between the US, Canada, and Mexico. Climate regions (tropical, arid, temperate, polar) affect human settlement and economic activities.`

    + `\n\nPRACTICE QUESTIONS\n1. The basic economic problem of limited resources is called ________.\n2. The next best alternative given up is the ________ cost.\n3. A tax on imported goods is a ________.\n4. When a country exports more than it imports, it has a trade ________.\n5. When demand is greater than supply, prices ________.\n6. A map showing population density is a ________ map.\n7. GIS stands for Geographic ________ Systems.\n8. Factors that push people to leave a place are ________ factors.\n9. The growth of cities is called ________.\n10. Specialization makes countries ________ because they rely on each other for goods.`
  }
]

function Grade5SocialStudiesNotes() {
  const [search, setSearch] = useState('')
  const filtered = SS_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Social Studies Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Early America, Revolution, Civics, Economics – 10 exercises per topic</p>
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
    title: 'Kusikiliza na Kuzungumza',
    summary: 'Maamkizi, mazungumzo, kufahamu kwa kusikiliza, matamshi na lafudhi.',
    body: `MAAMKIZI NA MAZUNGUMZO
Kusikiliza na kuongea ni msingi wa mawasiliano. Katika Kiswahili, maamkizi hutegemea umri, wakati, na muktadha. "Hujambo?" hutumika kwa watu wa rika lako au vijana; jibu lake ni "Sijambo." "Shikamoo" ni heshima kwa wazee au wakuu; jibu lake ni "Marahaba." Asubuhi tunaamkiana "Sabalkheri" au "Asubuhi njema." Jioni ni "Masalkheri." Usiku ni "Alamsiki." Pia, kuna salamu za dini kama "Assalamu Alaikum."

Kujibu salamu kwa heshima na kutoa shukrani ni muhimu. "Asante sana" ni shukrani; "Samahani" ni kuomba msamaha; "Pole" hutumika kumfariji mtu mwenye msiba, ugonjwa, au shida. "Pole na kazi" ni kumtia moyo mtu anayefanya kazi.

Mazungumzo maalum hujengwa juu ya mada kama: afya na usafi (umuhimu wa kunawa mikono, kula chakula bora), usalama barabarani (kuvuka barabara salama, kutumia njia za waenda kwa miguu), utunzaji wa mazingira (kutunza misitu, kutupa taka vizuri), na teknolojia (matumizi ya simu, kompyuta, mtandao). Katika mazungumzo haya, washiriki huuliza na kujibu maswali, kutoa maoni, na kuonyesha hisia zao.

KUSIKILIZA NA KUFAHAMU
Kusikiliza kwa makini ni ujuzi muhimu. Mwalimu anaposoma hadithi au habari, mwanafunzi anapaswa kutambua mawazo makuu na ujumbe uliokusudiwa. Baada ya kusikiliza, maswali ya ufahamu hulenga maelezo ya wazi na yale yaliyofichika. Pia, mwanafunzi anapaswa kufuata na kutekeleza maagizo yenye hatua nyingi, kama vile maelekezo ya kupika chakula au kuelekea mahali fulani.

MATAMSHI NA LAFUDHI
Matamshi bora yanajumuisha kutamka vizuri sauti za herufi kama ving'ong'o (ng', ny) na mchanganyiko wa konsonanti (mb, nd, nj, nz, ch). Kiimbo cha sauti (lafudhi) huonyesha hisia: sauti inapopanda mwishoni huashiria swali; inaposhuka mwishoni huashiria amri au kauli; kupanda na kushuka kwa ghafla huonyesha mshangao.

MAELEZO YA ZIADA: Kuna pia maamkizi ya mazingira maalum kama sherehe za harusi, mazishi, au sikukuu. Kwa mfano, "Hongera!" hutumika kumpongeza mtu. Katika mazungumzo ya simu, utamaduni wa Kiswahili unasisitiza kuanza na salamu za kwanza kabla ya kueleza lengo la simu.`

    + `\n\nMASWALI YA KUJAZA PENGO\n1. Salamu ya heshima kwa mzee ni ________.\n2. Jibu la "Hujambo?" ni ________.\n3. Unapomfariji mtu mwenye msiba unasema ________.\n4. Kutoa shukrani ni kusema ________.\n5. Sauti ya "ng'" inatamkwa kwa kutumia ________.\n6. Kiimbo kinachopanda mwishoni huonyesha ________.\n7. Kusikiliza hadithi na kujibu maswali ni zoezi la ________.\n8. "Pole na kazi" hutumika kumtia moyo ________.\n9. Maagizo ya hatua nyingi hufuatwa kwa ________.\n10. "Sabalkheri" inamaanisha ________.`
  },
  {
    id: 'sarufi',
    title: 'Sarufi',
    summary: 'Ngeli za nomino, viambishi na nyakati, aina za maneno.',
    body: `NGELI ZA NOMINO
Kiswahili kina ngeli za nomino zinazosimamia upatanisho wa kisarufi. Ngeli ya A‑WA inahusisha viumbe hai (watu, wanyama, ndege, wadudu). Katika umoja, viambishi ni A‑, YU‑, au M‑ (e.g., mtoto anacheza); katika wingi ni WA‑ (watoto wanacheza). Ngeli ya KI‑VI inahusisha vifaa na vitu visivyo hai (kiti / viti; kimevunjika / vimevunjika). Ngeli ya LI‑YA inahusisha vitu vinavyopatikana kwa wingi au matunda (jicho / macho; limefumba / yamefumba; embe / maembe; limeiva / yameiva). Ngeli ya U‑I inahusisha miti na vitu vyenye umbo refu (mti / miti; umeanguka / imeanguka). Kila ngeli ina viambishi vyake vya nomino, vivumishi, na vitenzi.

VIAMBISHI NA NYAKATI
Nyakati huonyeshwa kwa viambishi awali vya kitenzi. Wakati uliopo hutumia ‑NA‑ (anasoma). Wakati uliopita hutumia ‑LI‑ (alisoma). Wakati ujao hutumia ‑TA‑ (atasoma). Hali ya timilifu hutumia ‑ME‑ kuonyesha kitendo kimetokea hivi punde na athari yake bado ipo (amesoma). Kukanusha kunabadilisha viambishi: hasomi (uliopo), hakusoma (uliopita), hatasoma (ujao), hajasoma (timilifu). Katika wingi, viambishi vya ukanushi hubadilika kulingana na ngeli.

AINA ZA MANENO
Viwakilishi vya nafsi: mimi, wewe, yeye, sisi, ninyi, wao. Vivumishi vya sifa kama ‑baya, ‑zuri, ‑refu hupatana na ngeli: mtoto mzuri, watoto wazuri; kiti kizuri, viti vizuri. Vielezi huonyesha jinsi (kwa haraka), mahali (sokoni), au wakati (asubuhi). Viunganishi kama kwa sababu, lakini, ingawa, kisha, ilhali huunganisha sentensi.

MAELEZO YA ZIADA: Kuna ngeli nyingine kama U‑YA (uzi, nyuzi) na PA‑KU‑MU (mahali). Viambishi vya upatanisho katika vitenzi pia hubadilika katika nyakati tofauti; kwa mfano, katika wakati ujao, kiambishi cha nafsi + TA + kitenzi: nitasoma, utasoma, atasoma, tutasoma, mtasoma, watasoma.`

    + `\n\nMASWALI YA KUJAZA PENGO\n1. Ngeli ya A‑WA inahusisha ________ hai.\n2. "Watoto wanacheza" ni wingi wa "mtoto ________".\n3. "Alisoma" ipo katika wakati ________.\n4. "Atasoma" ipo katika wakati ________.\n5. "Hajasoma" ni kukanusha hali ya ________.\n6. Neno "sisi" ni kiwakilishi cha ________.\n7. Kivumishi "‑zuri" kinapotumika na "kiti" kinakuwa ________.\n8. Neno "sokoni" ni kielezi cha ________.\n9. "Lakini" ni mfano wa ________.\n10. Katika ngeli ya KI‑VI, wingi wa "changu" ni ________.`
  },
  {
    id: 'kusoma',
    title: 'Kusoma na Ufahamu',
    summary: 'Usomaji wa burudani na maarifa, uchambuzi wa maandishi.',
    body: `KUSOMA KWA BURUDANI NA MAARIFA
Kusoma ni mlango wa kupata maarifa na kujifurahisha. Katika kiwango hiki, wanafunzi husoma vifungu vya habari, hadithi fupi, na vitabu vya ziada. Kila kifungu huongeza msamiati. Maneno mapya yanaweza kuelezwa kwa kutumia muktadha – maneno yanayozunguka neno jipya yanatoa dokezo la maana yake – au kwa kutumia kamusi. Kusoma kwa sauti (kusoma kwa kiada) kunaboresha matamshi na ufasaha. Kusoma kimoyomoyo (kimya) huongeza kasi na ufahamu wa kina.

UCHAMBUZI WA MAANDISHI
Baada ya kusoma, wanafunzi hujibu maswali ya ufahamu. Maswali ya moja kwa moja yanahitaji jibu la wazi kutoka katika kifungu. Maswali yasiyo ya moja kwa moja yanahitaji mwanafunzi kuhusisha mawazo na kufanya hitimisho. Kila hadithi huwa na funzo au maadili (moral) – somo la maana tunalojifunza kutoka kwa wahusika. Wahusika wana sifa mbalimbali: mkarimu (mpole na mwenye kutoa), mlafi (anayependa chakula kupita kiasi), mjanja (mwenye ujanja), mwaminifu (mkweli), msaliti (anayesaliti wenzake). Kuchambua wahusika hutusaidia kuelewa nia na matendo yao.

MAELEZO YA ZIADA: Aina za hadithi ni pamoja na ngano, hekaya, visasili, na mikasa. Ngano hufundisha maadili. Hekaya hutumia wahusika wanyama. Katika ushairi, kuna mizani na vina vinavyotumika. Mashairi maarufu ya Kiswahili kama vile ya Shaaban Robert ni mifano ya kazi za kifasihi zenye ujumbe mzito.`

    + `\n\nMASWALI YA KUJAZA PENGO\n1. Kusoma kwa ajili ya kujifurahisha ni kusoma kwa ________.\n2. Kutafuta maana ya neno kwa kutumia maneno ya jirani ni kutumia ________.\n3. Kitabu chenye maneno mengi na maana zake huitwa ________.\n4. Maswali yanayohitaji jibu la wazi kutoka kifunguni ni ya ________ kwa moja.\n5. Somo tunalojifunza kutoka hadithi huitwa ________ au maadili.\n6. Mhusika mwenye ukarimu na upole anaitwa ________.\n7. Mhusika anayependa chakula kupita kiasi ni ________.\n8. Kusoma kimya kunaboresha ________ na ufahamu.\n9. Mhusika anayesema ukweli daima ni ________.\n10. Kufanya hitimisho kutoka kifunguni kunahitaji kusoma ________ ya maneno.`
  },
  {
    id: 'kuandika',
    title: 'Kuandika',
    summary: 'Insha za kiubunifu, uandishi wa kiuamilifu, imla, alama za uakifishaji.',
    body: `INSHA ZA KIUBUNIFU
Uandishi wa insha hukuza uwezo wa kujieleza. Insha ya wasifu inaelezea kwa kina mtu, mnyama, au mahali. Hutumia lugha ya picha, vivumishi vingi, na maelezo ya kuvutia. Mfano: kuelezea rafiki yako – sura yake, tabia, mavazi, na kwa nini unampenda. Insha ya kusimulia husimulia hadithi yenye mwanzo (utangulizi), kati (mgogoro au tatizo), na mwisho (suluhisho au hitimisho). Wahusika, mandhari, na mtiririko wa matukio huunda hadithi.

UANDISHI WA KIUAMILIFU
Barua ya kirafiki ina muundo maalum: anwani ya mwandikaji upande wa kulia juu, tarehe, salamu (e.g., Ndugu yangu), mwili wa barua (maelezo), na hitimisho (e.g., Wako mpendwa, jina). Barua rasmi ina anwani mbili, kichwa cha barua, na lugha rasmi. Kuandika orodha ya vitu (e.g., vifaa vya shule) kunahitaji mpangilio na alama za kuorodhesha.

IMLA NA MIUNDO YA SENTENSI
Imla ni zoezi la kuandika maneno kwa tahajia sahihi mwalimu anapoyasoma. Husaidia kujua tahajia, uakifishaji, na umbuji wa sentensi. Alama za uakifishaji ni muhimu: nukta (.) mwishoni mwa sentensi, mkato (,) kutenganisha vitu, alama ya kuuliza (?) kwa swali, na alama ya hisia (!) kwa mshangao.

MAELEZO YA ZIADA: Insha ya mjadala hujadili pande mbili za suala (kwa upande mmoja... kwa upande mwingine). Insha ya methali huongozwa na methali fulani na kutoa mifano halisi. Katika uandishi wa kiuamilifu, barua za kuomba kazi au barua za wateja zina muundo maalum na lugha ya heshima.`

    + `\n\nMASWALI YA KUJAZA PENGO\n1. Insha inayoelezea mtu au mahali kwa kina ni insha ya ________.\n2. Insha inayosimulia hadithi ni insha ya ________.\n3. Sehemu ya barua ya kirafiki inayokuja baada ya tarehe ni ________.\n4. Neno linalotumika kumalizia barua "Wako ________" ni mfano.\n5. Kuandika maneno kwa usahihi wakati mwalimu anayasoma ni ________.\n6. Alama ya mwisho wa sentensi ni ________.\n7. Alama ya kuonyesha mshangao ni ________.\n8. Alama ya kutenganisha vitu katika orodha ni ________.\n9. Orodha ya vitu vya shule inaitwa ________.\n10. Katika hadithi, tatizo kuu linalojenga hadithi huitwa ________.`
  },
  {
    id: 'fasihi',
    title: 'Fasihi Simulizi na Msamiati',
    summary: 'Methali, vitendawili, nahau, msamiati wa ukoo, afya, mavazi.',
    body: `FASIHI SIMULIZI
Fasihi simulizi ni sanaa ya maneno inayopitishwa kwa mdomo. Methali ni misemo mifupi yenye hekima. "Asiyefunzwa na mamae hufunzwa na ulimwengu" inamaanisha mtoto asiyesikiliza wazazi atajifunza kwa uchungu kutoka kwa maisha. "Haraka haraka haina baraka" inahimiza uvumilivu. Vitendawili ni mafumbo yenye picha ya kuwaza. Mfano: "Nyumba yangu haina mlango" – jibu ni yai. Vitendawili hukuza fikra na kuburudisha. Nahau ni misemo ya picha yenye maana tofauti na maneno yenyewe. "Piga picha" maana yake ni kupiga picha (kutumia kamera), si kupiga picha kwa ngumi. "Kaza kamba" maana yake ni kufanya bidii. "Amua ngumi" maana yake ni kupigana.

MSAMIATI MAALUM
Msamiati wa ukoo: babu (baba wa baba au mama), nyanya (mama wa baba au mama), mjukuu (mtoto wa mwanao), shemeji (mume wa dada yako au kaka wa mkeo), mkwe (baba au mama wa mkeo au mumeo), ami (kaka wa baba), shangazi (dada wa baba). Msamiati wa afya: homa, mafua, malaria, kikohozi, daktari, muuguzi, hospitali, dawa, sindano, bendeji. Msamiati wa mavazi: koti, suruali, shati, gauni, sketi, sweta, soksi, viatu. Msamiati wa vyombo vya nyumbani: sufuria, kijiko, mwiko, sahani, kikombe, jiko, meza, kiti, kabati.

MAELEZO YA ZIADA: Pia kuna misemo ya hekima kama "Mchele mmoja wapika nawote" kumaanisha ushirikiano. Katika shairi, kuna tarbia (mashairi yenye mistari minne). Msamiati wa wanyama ni kama simba, ndovu, twiga, chui, pundamilia. Msamiati wa matunda: embe, parachichi, nanasi, ndizi, chungwa.`

    + `\n\nMASWALI YA KUJAZA PENGO\n1. "Haraka haraka haina ________" ni mfano wa methali.\n2. Kitendawili ni ________ lenye kufumbua.\n3. "Kaza kamba" maana yake ni ________.\n4. Baba wa mama yako anaitwa ________.\n5. Mama wa baba yako anaitwa ________.\n6. Mume wa dada yako anaitwa ________.\n7. Mtu anayetibu wagonjwa ni ________.\n8. Chombo cha kupikia chakula ni ________.\n9. Nguo ya kufunika miguu ni ________.\n10. "Piga picha" kwa Kiswahili sanifu inamaanisha ________.`
  }
]

function Grade5KiswahiliNotes() {
  const [search, setSearch] = useState('')
  const filtered = KISWAHILI_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Kiswahili Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Kusikiliza, sarufi, kusoma, kuandika, fasihi – mazoezi 10 kila mada</p>
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

// ==================== CHRISTIAN RELIGIOUS EDUCATION ====================
const CRE_TOPICS = [
  {
    id: 'creation',
    title: 'Creation and the Environment',
    summary: 'God’s purpose, human stewardship, practical conservation.',
    body: `In the beginning, God created the heavens and the earth. The book of Genesis chapters 1 and 2 describes the orderly sequence of creation. On day one, God created light and separated it from darkness. On day two, He created the sky. On day three, dry land and vegetation. On day four, the sun, moon, and stars. On day five, sea creatures and birds. On day six, land animals and finally human beings, created in His own image and likeness. Each stage of creation was declared “good.” The creation of humans was special because God breathed into them the breath of life and gave them intellect, free will, and the ability to relate to Him.

God gave humans a unique responsibility: to rule over creation as stewards. This dominion is not a license to exploit or destroy nature, but rather a sacred duty to care for it. In Genesis 2:15, God placed Adam in the Garden of Eden “to work it and take care of it.” This establishes the principle of stewardship: we are caretakers, not owners. The earth belongs to God; we are to manage it responsibly.

Practical stewardship includes conserving soil through proper farming methods, protecting water sources from pollution, planting trees to replace those cut down, and treating animals humanely. In the Bible, God gave Israel laws about allowing the land to rest every seventh year (the Sabbath year) and about not destroying fruit trees even during war. These show God’s concern for environmental sustainability.

The consequences of failing to care for creation are serious. When humans mismanage the environment, we see deforestation, desertification, polluted waters, and climate change. The book of Revelation speaks of God judging “those who destroy the earth.” This reminds us that environmental care is not just practical but spiritual. Christians are called to be earth‑keepers, reflecting God’s love for all He has made.

We can all practice stewardship in small ways: turning off lights when not in use, recycling, not littering, planting trees, and educating others about the importance of caring for the environment. Our schools, homes, and communities are places where we can demonstrate our commitment to God’s creation.

MAELEZO YA ZIADA: The story of Noah and the flood also highlights preservation of species. Proverbs 12:10 says “A righteous man cares for the needs of his animal,” emphasizing kindness to animals. The concept of Jubilee (Leviticus 25) involved returning land to original owners, preventing accumulation of wealth and environmental degradation.`

    + `\n\nPRACTICE QUESTIONS\n1. According to Genesis, humans were created on the ________ day.\n2. God created humans in His own ________ and likeness.\n3. The responsibility to care for creation is called ________.\n4. God placed Adam in the Garden of ________.\n5. The land was to rest every ________ year.\n6. Cutting down trees without replanting causes ________.\n7. One practical way to care for creation is to plant ________.\n8. The book of Revelation says God will judge those who ________ the earth.\n9. Pollution of rivers harms both humans and ________.\n10. The Sabbath year was a time for the ________ to rest.`
  },
  {
    id: 'ot-leaders',
    title: 'Old Testament: Leaders, Covenants, and Faith',
    summary: 'Abraham’s call and faith, Moses and the Exodus, David’s leadership.',
    body: `God calls ordinary people to do extraordinary things. Abraham, originally named Abram, lived in the city of Haran when God spoke to him. In Genesis 12, God told Abraham to leave his country, his people, and his father’s household and go to a land God would show him. God made a covenant (a sacred agreement) with Abraham, promising to make him into a great nation, to bless him, and to make his name great. God also promised that all peoples on earth would be blessed through Abraham. Abraham obeyed immediately, setting out by faith without knowing his destination.

The supreme test of Abraham’s faith came in Genesis 22, when God asked him to sacrifice his only son Isaac. Although it made no sense humanly, Abraham trusted God completely. He took Isaac to Mount Moriah, built an altar, and was about to sacrifice him when an angel stopped him. God provided a ram caught in a thicket as a substitute. This event foreshadowed God providing His own Son, Jesus, as a sacrifice for sin. Abraham’s faith was credited to him as righteousness.

Moses was another great leader. Born to Hebrew slaves in Egypt, he was hidden as a baby and later adopted by Pharaoh’s daughter. After killing an Egyptian who was beating a Hebrew, Moses fled to Midian. There, at the burning bush, God revealed His sacred name “I AM WHO I AM” (Yahweh) and commissioned Moses to lead the Israelites out of Egypt. The Passover event was the final plague: the Israelites sacrificed a lamb and put its blood on their doorposts, and the angel of death passed over their homes. This event pointed forward to Jesus, the Lamb of God.

At Mount Sinai, God gave Moses the Ten Commandments. These laws form the moral foundation of God’s covenant with Israel. The first four commandments concern duties to God (no other gods, no idols, honor God’s name, keep the Sabbath). The remaining six concern duties to fellow humans (honor parents, do not murder, commit adultery, steal, lie, or covet). Together they establish a blueprint for community harmony.

David was an unlikely king. When the prophet Samuel came to Jesse’s house to anoint the next king, David was the youngest son, a shepherd boy. God told Samuel, “The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart.” David had a heart for God. He demonstrated courage by defeating Goliath, humility by refusing to kill King Saul even when he had the chance, and true repentance after his sin with Bathsheba (Psalm 51). David wrote many psalms and is described as a man after God’s own heart.

MAELEZO YA ZIADA: The covenant with Abraham was unconditional; it depended solely on God’s faithfulness. The Mosaic covenant was conditional, requiring Israel’s obedience. David’s covenant promised that his descendant would rule forever, fulfilled in Jesus. The Tabernacle built in the wilderness was a portable sanctuary where God dwelled among His people, prefiguring Jesus’ incarnation.`

    + `\n\nPRACTICE QUESTIONS\n1. God told Abraham to leave his country and go to a land He would ________.\n2. The sacred agreement between God and Abraham is a ________.\n3. God provided a ________ to replace Isaac on the altar.\n4. Moses received the Ten Commandments at Mount ________.\n5. The “I AM WHO I AM” is God’s sacred name, ________.\n6. The blood on the doorposts during the ________ protected the Israelites.\n7. The first four commandments concern duties to ________.\n8. David defeated the giant ________ with a sling and a stone.\n9. Samuel anointed David as the future ________ of Israel.\n10. David wrote many of the ________ in the Bible.`
  },
  {
    id: 'nt-jesus',
    title: 'New Testament: Life and Ministry of Jesus Christ',
    summary: 'Birth, baptism, temptations, miracles, parables, passion, resurrection, Great Commission.',
    body: `The birth of Jesus Christ was foretold centuries before by prophets like Isaiah and Micah. The angel Gabriel appeared to Mary, a young virgin in Nazareth, announcing that she would conceive by the Holy Spirit and give birth to the Son of God. Joseph, her betrothed, was initially troubled but an angel appeared to him in a dream, confirming the divine nature of the child and instructing him to name the baby Jesus, meaning “the Lord saves.” Jesus was also called Immanuel, meaning “God with us.”

Jesus was born in Bethlehem during a census under Caesar Augustus. Because there was no room in the inn, He was laid in a manger. Shepherds, the first to hear the news from a host of angels, came to worship Him. Forty days later, Mary and Joseph presented Jesus at the Temple in Jerusalem, where Simeon and Anna, elderly prophets, recognized Him as the promised Messiah. Magi (wise men) from the East followed a star to bring gifts of gold, frankincense, and myrrh. Warned in a dream, Joseph fled with Mary and Jesus to Egypt to escape King Herod’s massacre of infants. They later returned and settled in Nazareth, where Jesus grew in wisdom and stature.

Jesus’ public ministry began when He was about thirty years old. He was baptized by John the Baptist in the Jordan River, where the Holy Spirit descended like a dove and a voice from heaven declared, “This is my beloved Son.” Immediately after, Jesus was led into the wilderness and fasted for forty days, where He was tempted by Satan. Jesus overcame each temptation by quoting Scripture, showing the power of God’s Word.

Jesus performed many miracles demonstrating the arrival of the Kingdom of God. He calmed a storm with a command, fed five thousand people with five loaves and two fish, healed a paralyzed man, gave sight to the blind, and raised Lazarus from the dead. He taught through parables: the Good Samaritan teaches us that our neighbor is anyone in need, regardless of race or background. The Prodigal Son illustrates God’s infinite grace and forgiveness for repentant sinners.

Jesus’ passion began with the Last Supper, where He instituted the Eucharist. He prayed in agony at Gethsemane, was betrayed by Judas, arrested, tried before the Sanhedrin and Pilate, and sentenced to death by crucifixion. He was crucified at Golgotha, died, and was buried. On the third day, He rose from the dead, appearing first to Mary Magdalene, then to the disciples on the road to Emmaus, and later to the eleven apostles. Before ascending to heaven, He gave the Great Commission: to go and make disciples of all nations.

MAELEZO YA ZIADA: The Sermon on the Mount (Matthew 5‑7) contains the Beatitudes and teachings on love, prayer (the Lord’s Prayer), and forgiveness. Jesus frequently used “I am” statements (I am the bread of life, the light of the world) that echoed the divine name. The miracles were signs pointing to His identity as the Son of God.`

    + `\n\nPRACTICE QUESTIONS\n1. The angel Gabriel appeared to Mary in the town of ________.\n2. Jesus was born in the town of ________.\n3. The name “Immanuel” means “________ with us.”\n4. John the Baptist baptized Jesus in the ________ River.\n5. Jesus fasted in the wilderness for ________ days.\n6. The parable of the Good Samaritan teaches about being a good ________.\n7. The Prodigal Son was welcomed back by his ________.\n8. Jesus was crucified at a place called ________.\n9. Jesus rose from the dead on the ________ day.\n10. The Great Commission commands us to make ________ of all nations.`
  },
  {
    id: 'christian-living',
    title: 'Christian Living and Morality',
    summary: 'Gifts and fruits of the Holy Spirit, Christian values, peer pressure resistance.',
    body: `The Holy Spirit plays a vital role in the life of every believer. The gifts of the Spirit (1 Corinthians 12) are special abilities given for building up the church: wisdom, knowledge, faith, healing, miraculous powers, prophecy, distinguishing between spirits, speaking in tongues, and interpretation of tongues. These gifts are distributed by the Spirit as He determines, and they are meant to serve others, not for personal glory.

The fruits of the Spirit (Galatians 5:22‑23) are the character qualities produced in believers as they walk with the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self‑control. Unlike gifts, which are given as God chooses, every believer is expected to grow in all the fruits. These nine qualities reflect the character of Jesus and are evidence of a transformed life.

Christian values guide our behavior. Honesty means always telling the truth, even when it is difficult. Integrity is doing the right thing even when no one is watching. Respect for authority means obeying parents, teachers, and government leaders, as long as they do not ask us to disobey God. Empathy is feeling with others, especially the marginalized: orphans, widows, refugees, and the poor. The Bible repeatedly commands care for these vulnerable groups.

Peer pressure is a powerful force, especially for young people. Friends can influence us to do things we know are wrong. The story of Daniel and his three friends (Shadrach, Meshach, and Abednego) provides a model for resisting negative peer pressure. Taken as captives to Babylon, they were offered the king’s rich food and wine, but they resolved not to defile themselves. They politely but firmly requested a vegetarian diet and water. God honored their faithfulness by making them healthier than the others. When later commanded to bow to a golden statue, they refused even under threat of death, and God miraculously delivered them from the fiery furnace.

The early church in Acts exemplified Christian community. They devoted themselves to the apostles’ teaching, fellowship, breaking of bread, and prayer. They shared their possessions so that no one was in need. They met daily in the temple courts and in homes, praising God and enjoying the favor of all people. This is a model for how Christians should live today: in unity, generosity, worship, and witness.

MAELEZO YA ZIADA: The armor of God (Ephesians 6:10‑18) equips believers against spiritual challenges: belt of truth, breastplate of righteousness, shoes of the gospel of peace, shield of faith, helmet of salvation, and sword of the Spirit (God’s Word). Prayer is the seventh vital element. The story of Joseph shows integrity under pressure – he fled from temptation, saying “How can I do this great wickedness and sin against God?”`

    + `\n\nPRACTICE QUESTIONS\n1. The gifts of the Spirit are found in 1 Corinthians chapter ________.\n2. The first fruit of the Spirit listed in Galatians 5 is ________.\n3. The fruit of self‑________ helps us control our desires.\n4. Honesty means always telling the ________.\n5. Daniel and his friends refused the king’s food to avoid ________ themselves.\n6. Shadrach, Meshach, and Abednego were thrown into a fiery ________.\n7. The early church shared their ________ so no one was in need.\n8. Empathy means caring for ________, widows, and the poor.\n9. Peer pressure can lead people to do what is ________.\n10. The early church met daily in the temple and in ________.`
  }
]

function Grade5CRENotes() {
  const [search, setSearch] = useState('')
  const filtered = CRE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Christian Religious Education Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Creation, Old & New Testament, Christian living – 10 exercises per topic</p>
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

// ==================== ISLAMIC RELIGIOUS EDUCATION ====================
const IRE_TOPICS = [
  {
    id: 'quran',
    title: 'Quranic Studies',
    summary: 'Surah Al‑Maun, Al‑Fil, Al‑Qadr, Al‑Asr with themes and tajweed.',
    body: `The Holy Quran is the final revelation from Allah, sent down to Prophet Muhammad (PBUH) through Angel Jibril over 23 years. It contains 114 surahs, each with its own themes and lessons. In Grade 5, we focus on four important surahs.

Surah Al‑Maun (Chapter 107) is also called “The Neighborly Needs” or “Small Kindnesses.” It has seven verses and was revealed in Makkah. The surah strongly condemns those who claim to be religious but neglect orphans, do not encourage feeding the poor, and perform prayers only to be seen by others while refusing even small acts of kindness to their neighbors. It teaches that true faith must be expressed through compassionate actions, not empty rituals. The person who denies the Day of Judgment is the one who pushes away orphans and does not feed the hungry. Woe to those who pray only for show but are careless about their prayers and withhold basic assistance.

Surah Al‑Fil (Chapter 105) recounts the historical event of the Year of the Elephant, around 570 CE, the year the Prophet was born. Abrahah, the Christian governor of Yemen, marched with a large army and war elephants toward Makkah, intending to destroy the Kaaba. Allah sent flocks of birds (Ababil) carrying small stones of baked clay, which they dropped on the army, destroying them completely. The surah teaches that Allah alone protects His sacred house and that no power, however mighty, can prevail against His will. It is a lesson in Tawheed and reliance on Allah.

Surah Al‑Qadr (Chapter 97) celebrates the Night of Decree or Power (Laylatul Qadr), which occurs during the last ten nights of Ramadhan. This is the night when the Quran was first revealed. The surah declares that this night is better than a thousand months (over 83 years of worship). On this night, angels descend with the permission of their Lord for every matter, and there is peace until the break of dawn. Muslims seek this night through extra prayers, Quran recitation, and supplication.

Surah Al‑Asr (Chapter 103) is one of the shortest but most profound surahs. It begins with an oath by “time” (‘Asr), emphasizing that all of humanity is in a state of loss – wasting their lives – except those who have four qualities: true faith, righteous deeds, enjoining one another to truth, and enjoining one another to patience. It is a complete formula for success.

Tajweed rules ensure proper Quran recitation. Madd is elongation of certain letters, held for two or more counts. Makharij are the precise articulation points of Arabic letters from the throat, tongue, lips, and nasal cavity.

MAELEZO YA ZIADA: The Quran was compiled into a single book during the caliphate of Uthman (RA). The science of Tafsir explains the meanings and contexts of verses. The Prophet encouraged memorization (Hifz) of the Quran, and those who memorize it are called Hafiz. The last ten surahs are often memorized for daily prayers.`

    + `\n\nPRACTICE QUESTIONS\n1. The Quran was revealed over a period of ________ years.\n2. Surah Al‑Maun condemns those who neglect ________.\n3. Surah Al‑Fil describes the army destroyed by ________ carrying stones.\n4. Abrahah’s army had ________ animals for war.\n5. Laylatul Qadr is better than ________ thousand months.\n6. Surah Al‑Qadr says angels descend with ________ on that night.\n7. Surah Al‑Asr swears by ________ as a witness.\n8. The four qualities of the saved in Surah Al‑Asr are faith, good deeds, truth, and ________.\n9. Tajweed rules include ________ (elongation) and Makharij.\n10. Makharij refers to the ________ points of letters.`
  },
  {
    id: 'hadith',
    title: 'Hadith (Prophetic Traditions)',
    summary: 'Sayings on cleanliness, manners, respect, and kindness to animals.',
    body: `The Hadith are the recorded sayings, actions, and approvals of Prophet Muhammad (PBUH). They are the second source of Islamic law after the Quran. Several famous hadith collections exist, including Sahih Bukhari and Sahih Muslim. The Prophet’s words provide practical guidance for every aspect of life.

One of the most comprehensive hadiths is: “Cleanliness is half of faith (Iman).” (Sahih Muslim). This teaches that physical and spiritual purity are essential parts of being a Muslim. Physical cleanliness (Twahara) includes maintaining personal hygiene, performing wudhu before prayer, keeping clothes and surroundings clean. Spiritual purity includes having a clean heart free from envy, hatred, and pride. Together they form a complete approach to life.

The Prophet placed great emphasis on good manners (Akhlaq). He said, “The best among you are those who have the best manners and character” (Sahih Bukhari). This includes respecting parents and elders, showing mercy to children, being truthful in speech, fulfilling promises, and avoiding gossip (Gheebah). Gheebah is speaking about someone behind their back in a way they would dislike; it is a major sin in Islam. The Prophet compared it to eating the flesh of a dead brother.

Kindness to animals is also strongly emphasized. One hadith tells of a man who was forgiven his sins because he gave water to a thirsty dog. He climbed down into a well, filled his shoe with water, and gave it to the panting dog. Allah appreciated his act and forgave him. In contrast, another hadith tells of a woman who was punished because she locked up a cat without providing food or water until it died. These stories show that mercy to all living beings is rewarded, and cruelty is punished.

Other important hadiths teach us to smile as an act of charity, to remove harmful things from the path, to say good words or remain silent, and to love for others what we love for ourselves. These simple teachings, when practiced, create a harmonious and compassionate society.

MAELEZO YA ZIADA: The hadith on intention: “Actions are judged by intentions” (Sahih Bukhari) establishes that the reward of an act depends on the niyyah. The Prophet also said, “None of you truly believes until he loves for his brother what he loves for himself.” This reinforces empathy and unity.`

    + `\n\nPRACTICE QUESTIONS\n1. The sayings of Prophet Muhammad are called ________.\n2. The hadith “Cleanliness is half of ________” emphasizes purity.\n3. Physical purification before prayer is called ________.\n4. The best among people are those with the best ________.\n5. Speaking badly about someone behind their back is called ________.\n6. The man who gave water to a thirsty ________ was forgiven.\n7. A woman was punished for locking up a ________ without food.\n8. Smiling at someone is an act of ________.\n9. We should love for others what we love for ________.\n10. The two most authentic hadith collections are Sahih Bukhari and Sahih ________.`
  },
  {
    id: 'iman',
    title: 'Pillars of Iman (Faith)',
    summary: 'Belief in Allah (Tawheed), angels, holy books, prophets.',
    body: `Iman (faith) in Islam is built on six pillars. The first and most fundamental is belief in Allah (Tawheed). Tawheed means affirming that Allah is One, without partners, rivals, or equals. It has three categories: Tawheed ar‑Rububiyyah (Oneness of Lordship) – Allah alone is the Creator, Sustainer, and Controller of everything. Tawheed al‑Uluhiyyah (Oneness of Worship) – only Allah deserves worship; no prayer, sacrifice, or devotion should be directed to anyone else. Tawheed al‑Asma wa Sifat (Oneness of Names and Attributes) – Allah has the most beautiful names and perfect attributes without comparison.

Among the 99 beautiful names (Asmaul Husna) are: Al‑Khaliq (The Creator), who brought everything into existence from nothing. Al‑Ghaffar (The All‑Forgiving), who repeatedly forgives the sins of those who repent. Ar‑Razzaq (The Sustainer), who provides for all creatures. Al‑Malik (The King), who owns the entire universe. Al‑Quddus (The Holy), who is free from any imperfection.

Belief in angels (Malaika) is the second pillar. Angels are created from light, are neither male nor female, and do not possess free will – they obey Allah perfectly. Jibril (Gabriel) is the chief angel responsible for delivering revelation to the prophets. Mikail (Michael) is in charge of rain and sustenance. Israfil will blow the trumpet to announce the Day of Judgment. Malik is the guardian of Hellfire. Ridwan is the guardian of Paradise. Munkar and Nakir question the dead in their graves. Every person has two recording angels, Raqib (on the right) and Atid (on the left), who write down all deeds.

Belief in the holy books is the third pillar. Allah revealed scriptures to guide humanity: the Suhuf (Scrolls) to Ibrahim, the Taurat (Torah) to Musa, the Zabur (Psalms) to Dawud, the Injeel (Gospel) to Isa, and the Quran to Muhammad (PBUH). Muslims believe in all of them, but the Quran is the final, preserved, and complete revelation.

MAELEZO YA ZIADA: The fifth pillar of Iman is belief in the Day of Judgment, and the sixth is belief in Qadr (divine decree). On the Day of Judgment, all souls will be resurrected, their deeds weighed on a scale (Mizan), and they will cross the Sirat (bridge) over Hell. Paradise (Jannah) and Hell (Jahannam) are real abodes.`

    + `\n\nPRACTICE QUESTIONS\n1. The Oneness of Allah in His Lordship is called Tawheed ar‑________.\n2. Al‑Khaliq means The ________.\n3. The angel responsible for revelation is ________.\n4. The angel in charge of rain and sustenance is ________.\n5. The trumpet will be blown on the Day of Judgment by ________.\n6. The guardian of Hellfire is ________.\n7. Every person has two ________ angels recording deeds.\n8. The Taurat was revealed to Prophet ________.\n9. The Injeel was revealed to Prophet ________.\n10. The ________ is the final and complete revelation.`
  },
  {
    id: 'fiqh',
    title: 'Fiqh: Purification and Prayer',
    summary: 'Wudhu (Fardh and Sunnah), Tayammum, Salah conditions, times, rak\'ahs.',
    body: `Ritual purification (Twahara) is a prerequisite for Salah. Wudhu is the partial ablution performed before prayer. It has mandatory acts (Fardh) that must be done for Wudhu to be valid: (1) Intention (Niyyah) in the heart, (2) Washing the entire face from hairline to chin and ear to ear, (3) Washing both arms up to and including the elbows, (4) Wiping a portion of the head with wet hands, (5) Washing both feet up to and including the ankles, (6) Performing these acts in the correct sequence without long interruptions (Tartib).

Sunnah acts are recommended traditions that bring extra reward but are not required: saying Bismillah at the start, washing hands to the wrists first, rinsing the mouth (Madmadah), inhaling water into the nostrils (Istinshaq), wiping the ears, washing each part three times instead of once, and starting from the right side. Wudhu is invalidated (nullified) by: any discharge from private parts (urine, feces, gas), deep sleep causing loss of awareness, loss of consciousness (fainting, intoxication, anesthesia), and direct skin contact with private parts without a barrier.

When water is unavailable or harmful (due to illness, extreme cold, or scarcity), Tayammum (dry ablution) is performed using clean earth or dust. One strikes the earth with palms, blows off excess, wipes the face, then strikes again and wipes the right arm then left arm up to the elbows.

Salah is the five daily prayers. Conditions for validity include: Islam, sanity, having reached the age of discernment, being in a state of purification, facing the Qiblah (Kaaba), covering the awrah (private areas), and the correct time. The five prayers with their rak’ahs: Fajr (2 rak’ahs, dawn), Dhuhr (4, noon), Asr (4, afternoon), Maghrib (3, sunset), Isha (4, night). Each prayer has Fardh (obligatory) and Sunnah parts. Congregational prayer (Jama’ah) is strongly encouraged, especially for men in the mosque. The Imam leads, and the Ma’mum follows.

MAELEZO YA ZIADA: The Adhan (call to prayer) was instituted by the Prophet’s companion Bilal (RA). The Qiblah was changed from Jerusalem to Makkah during the Prophet’s life. In Jama’ah, the Imam recites aloud in Fajr, Maghrib, and Isha. Women also pray in congregation but in separate rows or sections.`

    + `\n\nPRACTICE QUESTIONS\n1. The intention for Wudhu is made in the ________.\n2. Washing the arms in Wudhu must include the ________.\n3. Wiping a portion of the ________ is a Fardh act of Wudhu.\n4. Rinsing the mouth is called ________ and is a Sunnah act.\n5. Deep ________ invalidates Wudhu.\n6. Dry ablution using clean earth is called ________.\n7. The five daily prayers are obligatory and are called ________.\n8. The dawn prayer is called ________ and has two rak’ahs.\n9. The night prayer is ________ and has four rak’ahs.\n10. The person who leads the congregational prayer is the ________.`
  }
]

function Grade5IRENotes() {
  const [search, setSearch] = useState('')
  const filtered = IRE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Islamic Religious Education Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Quran, Hadith, Iman, Fiqh – 10 exercises per topic</p>
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

// ==================== HINDU RELIGIOUS EDUCATION ====================
const HRE_TOPICS = [
  {
    id: 'paramatma',
    title: 'Paramatma: The Divine Concept',
    summary: 'Nirguna and Saguna Brahman, Trimurti, avatars of Vishnu.',
    body: `Hinduism teaches that there is one Supreme God, Paramatma, also called Brahman. Brahman can be understood in two ways: Nirguna Brahman is God without form or attributes – infinite, eternal, omnipresent, and beyond human comprehension. Saguna Brahman is God with form and attributes, which allows devotees to connect personally through worship, love, and devotion. These are not two different Gods but two ways of understanding the same Supreme Reality.

The Trimurti represents the three fundamental cosmic functions of Brahman. Brahma is the Creator – he brings the universe into existence. He is depicted with four faces representing the four Vedas, which he revealed. His consort is Saraswati, the goddess of knowledge, music, and arts. Vishnu is the Preserver – he sustains and protects the universe. He is often shown reclining on the cosmic serpent Shesha, with Lakshmi, the goddess of wealth and prosperity, at his feet. Vishnu incarnates on Earth whenever dharma (righteousness) declines and adharma (evil) rises. Shiva is the Transformer or Destroyer – he dissolves the universe at the end of each cosmic cycle so it can be recreated. He is associated with dynamic balance, meditation, and the cosmic dance (Tandava). His consort is Parvati, who appears in many forms including Durga and Kali.

The concept of avatars is central to Vaishnavism (worship of Vishnu). An avatar is a descent of the divine into the material world. The most celebrated avatars are Lord Rama and Lord Krishna. Rama, the seventh avatar, is the hero of the Ramayana. He is the ideal king, son, husband, and warrior. His life exemplifies dharma, truth, and sacrifice. Krishna, the eighth avatar, is the divine teacher of the Bhagavad Gita. He was born in Mathura, raised in Vrindavan, and played a key role in the Mahabharata war. On the battlefield of Kurukshetra, he taught Arjuna about duty, devotion, and the nature of the self. The Dashavatara lists ten major avatars, including Matsya (fish), Kurma (tortoise), Varaha (boar), and Narasimha (half‑man, half‑lion).

MAELEZO YA ZIADA: The concept of Ishta Devata allows a devotee to choose a personal deity form (such as Ganesha, Hanuman, or a form of Devi) while still acknowledging the oneness of Brahman. Bhakti (devotion) is the easiest path to connect with God. The river Ganga is considered sacred and is associated with purification. The mantra “Om” represents the primordial sound of the universe.`

    + `\n\nPRACTICE QUESTIONS\n1. The formless, infinite aspect of God is called ________ Brahman.\n2. The aspect of God with forms and attributes is ________ Brahman.\n3. The three cosmic functions are Creation, Preservation, and ________.\n4. The Creator in the Trimurti is ________.\n5. The consort of Vishnu is ________.\n6. The Preserver incarnates when ________ declines.\n7. The hero of the Ramayana is Lord ________.\n8. The divine teacher of the Bhagavad Gita is Lord ________.\n9. The Gita was spoken on the battlefield of ________.\n10. The Dashavatara lists ________ major incarnations of Vishnu.`
  },
  {
    id: 'scriptures',
    title: 'Holy Scriptures (Granthas)',
    summary: 'Shruti vs Smriti, Vedas, Upanishads, Ramayana, Mahabharata, Bhagavad Gita.',
    body: `Hindu scriptures are vast and classified into two broad categories: Shruti and Smriti. Shruti means “that which is heard.” These are the eternal, divine revelations heard by ancient sages (rishis) in deep meditation. They are considered the most authoritative. Shruti includes the four Vedas – Rig, Yajur, Sama, and Atharva – and the Upanishads, which are philosophical texts exploring the nature of Brahman, Atman (the soul), and the universe.

Smriti means “that which is remembered.” These are composed by human authors based on memory and tradition. They include the Itihasas (epics) and Puranas. The Ramayana, authored by Sage Valmiki, is the story of Lord Rama. It contains 24,000 verses divided into seven books. It teaches ideals of duty, loyalty, and the victory of good over evil. The Mahabharata, authored by Sage Vyasa, is the longest epic poem in the world with over 100,000 verses. It tells the story of the Kuru dynasty, culminating in the great war between the Pandavas and Kauravas.

The Bhagavad Gita is a small section of the Mahabharata but is considered one of the most important Hindu scriptures. It consists of 700 verses in 18 chapters. It records the conversation between Lord Krishna and the warrior Arjuna just before the battle. Arjuna is paralyzed by moral dilemma – he does not want to fight his own relatives and teachers. Krishna teaches him about karma yoga (selfless action), bhakti yoga (devotion), and jnana yoga (knowledge). The central message is Nishkama Karma: perform your duty without attachment to the fruits of your actions. Act selflessly, dedicating all actions to God.

Other Smriti texts include the Puranas (stories of gods, sages, and kings), the Dharma Shastras (codes of conduct), and the Sutras (concise teachings). Together, Shruti and Smriti provide a complete guide for spiritual life, ethics, and philosophy.

MAELEZO YA ZIADA: The Puranas are eighteen in number; the Bhagavata Purana focuses on the life of Krishna and bhakti. The Devi Mahatmya is a text glorifying the Goddess. The Manusmriti is an ancient legal text. The Grihya Sutras outline domestic rituals.`

    + `\n\nPRACTICE QUESTIONS\n1. Scriptures that were “heard” by rishis are called ________.\n2. The four ________ are the core of Shruti.\n3. The philosophical texts within the Vedas are the ________.\n4. Scriptures “remembered” are called ________.\n5. The Ramayana was written by Sage ________.\n6. The Mahabharata was written by Sage ________.\n7. The Bhagavad Gita has ________ chapters.\n8. Krishna taught Arjuna about ________ Karma (selfless action).\n9. The Gita is part of the epic ________.\n10. The two warring families in the Mahabharata are Pandavas and ________.`
  },
  {
    id: 'values',
    title: 'Sadachar: Righteous Living and Karma',
    summary: 'Law of Karma, Yamas (non‑violence, truth, non‑stealing, purity, non‑greed).',
    body: `The law of Karma is a fundamental teaching in Hinduism. Karma literally means “action.” It is the universal law of cause and effect: every action, thought, and word has consequences. Good actions (punya) bring positive results in this life or future lives. Bad actions (papa) bring suffering. Karma is not fate; it is created by our own choices. Understanding karma encourages personal responsibility – we are the architects of our own destiny. The effects of karma may not be immediate but accumulate over time and across lifetimes, influencing future rebirths (samsara).

To live righteously and create good karma, Hinduism prescribes ethical guidelines. The Five Yamas are moral restraints described by the sage Patanjali in the Yoga Sutras. Ahimsa (Non‑violence) means not harming any living being through thought, word, or deed. It includes vegetarianism for many Hindus and respect for all life forms. Mahatma Gandhi practiced Ahimsa as a powerful force for social change. Satya (Truthfulness) means being honest in thought, speech, and action. Truth must be spoken kindly and at the right time; truth that harms unnecessarily may violate Ahimsa. Asteya (Non‑stealing) means not taking what belongs to others, whether material possessions, credit, time, or opportunities. Brahmacharya (Purity / Self‑control) originally meant celibacy for monks but is interpreted for laypeople as moderation, faithfulness in marriage, and controlling sensual desires. Aparigraha (Non‑greed / Non‑possessiveness) means not hoarding or being attached to material things beyond one’s needs.

These five Yamas are the foundation of sadachar (righteous conduct). They are complemented by the five Niyamas (positive observances): Shaucha (cleanliness), Santosha (contentment), Tapas (discipline), Svadhyaya (self‑study), and Ishvara Pranidhana (surrender to God). Together, the Yamas and Niyamas provide a complete ethical framework for spiritual growth.

MAELEZO YA ZIADA: The principle of Karma also ties to the concept of Dharma (righteous duty). Each person has a svadharma based on their nature and station in life. The Bhagavad Gita teaches that it is better to perform one’s own dharma imperfectly than another’s dharma perfectly.`

    + `\n\nPRACTICE QUESTIONS\n1. Karma means ________.\n2. Good actions create good ________.\n3. The universal law of cause and effect is the law of ________.\n4. Ahimsa means ________.\n5. The practice of truthfulness is called ________.\n6. Non‑stealing is called ________.\n7. Self‑control or purity is ________.\n8. Non‑possessiveness is called ________.\n9. The Yamas are ________ restraints.\n10. The Niyamas are positive ________.`
  },
  {
    id: 'festivals',
    title: 'Festivals, Rituals, and Worship',
    summary: 'Diwali, Janmashtami, Holi, Mandir structure, Puja and Prasad.',
    body: `Hindu festivals are vibrant celebrations of spiritual truths, historical events, and seasonal rhythms. Diwali, also called Deepavali (row of lights), is the most widely celebrated festival. It marks the return of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile and the defeat of the demon king Ravana. The people of Ayodhya lit thousands of oil lamps (diyas) to welcome them home. Diwali symbolizes the victory of light over darkness, good over evil, and knowledge over ignorance. It is celebrated over five days, featuring cleaning and decorating homes, lighting diyas, creating rangoli (colored powder patterns), bursting firecrackers, exchanging sweets, and performing Lakshmi Puja for prosperity.

Janmashtami celebrates the birth of Lord Krishna at midnight in Mathura. Devotees fast during the day, sing bhajans, and reenact scenes from Krishna’s childhood. A popular tradition is Dahi Handi, where young men form human pyramids to break a pot of curd hung high – mimicking young Krishna’s playful stealing of butter.

Holi is the spring festival of colors. It celebrates the divine love of Radha and Krishna and the destruction of the demoness Holika, who tried to kill Prahlada, a devotee of Vishnu. People throw colored powders and water on each other, dance, and feast. Holi signifies the triumph of devotion over evil, the end of winter, and a time of forgiveness and renewal.

The Mandir (temple) is the house of God. Its heart is the Garbhagriha (inner sanctum), where the main deity’s murti (sacred image) resides. Above it rises the Shikhara (tower), symbolizing the cosmic mountain. Puja is the daily worship ritual. It involves waking the deity, bathing and dressing the murti, offering flowers, fruits, incense (agarbatti), lighting a diya, and waving it in a circular motion (Aarti) while singing hymns. Prasad is food that has been offered to the deity and is then distributed to devotees. It is considered blessed and is shared among all present, symbolizing equality and divine grace.

MAELEZO YA ZIADA: Navaratri is a nine‑night festival dedicated to Goddess Durga. Raksha Bandhan celebrates the bond between brothers and sisters. Makar Sankranti marks the sun’s transition into Capricorn. Puja can be performed at home with a simple altar, using a bell, conch, and offerings.`

    + `\n\nPRACTICE QUESTIONS\n1. Diwali is the festival of ________.\n2. Diwali celebrates the return of Lord ________ to Ayodhya.\n3. Oil lamps lit during Diwali are called ________.\n4. Janmashtami celebrates the birth of Lord ________.\n5. The pot of curd broken during Janmashtami is called ________ Handi.\n6. Holi is the festival of ________.\n7. The inner sanctum of a temple is the ________.\n8. The tower above the sanctum is the ________.\n9. The circular waving of a lamp before the deity is called ________.\n10. Blessed food distributed after worship is called ________.`
  }
]

function Grade5HRENotes() {
  const [search, setSearch] = useState('')
  const filtered = HRE_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Hindu Religious Education Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Divine concept, scriptures, righteous living, festivals – 10 exercises per topic</p>
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

// ==================== SUPPLEMENTARY SUBJECTS ====================
const SUPP_TOPICS = [
  {
    id: 'visual-arts',
    title: 'Visual Arts Foundations',
    summary: 'Elements of art, color theory, one‑point perspective, art history.',
    body: `Visual arts use a language of their own. The seven elements of art are the building blocks: line (a mark with length), shape (2‑D enclosed area), form (3‑D object), color (hue), value (lightness or darkness), texture (surface quality), and space (area around or within objects). Understanding these elements helps us describe, analyze, and create art.

Color theory guides how we use colors. Primary colors (red, yellow, blue) cannot be made by mixing. Secondary colors (orange, green, purple) are made by mixing two primaries. Tertiary colors mix a primary with a neighboring secondary. Complementary colors are opposite on the color wheel (red/green, blue/orange, yellow/purple) – when placed side by side, they create strong contrast. Analogous colors are neighbors (blue, blue‑green, green) and create harmony. Monochromatic schemes use one color with different values (tints by adding white, shades by adding black).

One‑point perspective creates the illusion of depth on a flat surface. All parallel lines going into the distance converge at a single vanishing point on the horizon line. Objects closer appear larger; objects farther away appear smaller and higher on the picture plane. This technique was perfected during the Renaissance.

Global art history includes many movements. Impressionism (late 19th century) focused on capturing fleeting effects of light and color, with artists like Monet using visible brushstrokes. Traditional African art often emphasizes stylized human figures, masks, and functional objects with spiritual significance. Indigenous Australian art includes dot paintings that represent Dreamtime stories. Ancient Egyptian art used hierarchical proportion (more important figures drawn larger) and profile views for the human body.

Practicing art involves techniques like sketching (quick, rough drawings), shading (creating value with hatching, cross‑hatching, or blending), printmaking (transferring an image from a plate to paper), and sculpting (carving, modeling, or assembling 3‑D forms).

MAELEZO YA ZIADA: Pottery and ceramics are ancient art forms still practiced today. Collage involves assembling different materials (paper, fabric, photos) onto a surface. Digital art uses software like Photoshop or Procreate. Art criticism follows four steps: describe, analyze, interpret, and evaluate.`

    + `\n\nPRACTICE QUESTIONS\n1. The seven ________ of art are line, shape, form, color, value, texture, and space.\n2. Red, yellow, and blue are the ________ colors.\n3. Mixing red and blue makes ________.\n4. Colors opposite on the color wheel are ________.\n5. Adding white to a color creates a ________.\n6. In one‑point perspective, all parallel lines converge at a ________ point.\n7. The Impressionist movement focused on capturing ________ and color.\n8. Ancient Egyptian art used ________ proportion for important figures.\n9. Creating value with parallel lines is called ________.\n10. The horizon line in perspective represents the viewer's ________ level.`
  },
  {
    id: 'music',
    title: 'Music Theory and Performance',
    summary: 'Rhythm, notes, time signatures, accidentals, textures, musical forms.',
    body: `Music is organized sound and silence. Rhythm is the pattern of durations. Basic note values: whole note (4 beats), half note (2 beats), quarter note (1 beat), eighth note (½ beat), sixteenth note (¼ beat). Rests indicate silence for the same durations. A dot after a note adds half its value. Time signatures tell how many beats are in a measure and which note gets the beat. 4/4 means four quarter‑note beats per measure; 3/4 means three; 6/8 means six eighth‑note beats, often felt in two groups of three.

Pitch is the highness or lowness of a sound. Notes are named A through G on the treble and bass staves. Accidentals alter pitch: a sharp (#) raises a note by a half step; a flat (b) lowers it; a natural (♮) cancels a previous sharp or flat. The distance between two notes is an interval (e.g., C to G is a fifth). Scales are patterns of whole and half steps: major scales have a bright sound; minor scales sound sadder.

Texture describes how layers of sound interact. Monophonic texture has a single melody line alone. Homophonic texture has a melody with chordal accompaniment (most songs). Polyphonic texture has two or more independent melodies sounding together (e.g., a round like “Row, Row, Row Your Boat”).

Musical form organizes a piece into sections. Binary form (AB) has two contrasting sections. Ternary form (ABA) returns to the first section after a contrasting middle. Rondo form (ABACA) has a recurring main theme alternating with contrasting episodes. Theme and Variations takes a melody and changes it in successive variations (altering rhythm, harmony, tempo, or instrumentation).

MAELEZO YA ZIADA: Dynamics describe volume: pianissimo (very soft) to fortissimo (very loud). Tempo indicates speed: largo (slow), allegro (fast), presto (very fast). Articulation marks like staccato (short) and legato (smooth) affect style. The conductor keeps the ensemble together.`

    + `\n\nPRACTICE QUESTIONS\n1. A whole note receives ________ beats in 4/4 time.\n2. A quarter note receives ________ beat.\n3. The time signature 3/4 has ________ beats per measure.\n4. A sharp raises a note by a ________ step.\n5. A flat ________ a note by a half step.\n6. A single melody line alone is ________ texture.\n7. A melody with chordal accompaniment is ________ texture.\n8. Binary form has the pattern ________.\n9. Ternary form has the pattern ________.\n10. Rondo form has a recurring ________ theme.`
  },
  {
    id: 'theater',
    title: 'Theater Arts and Production',
    summary: 'Characterization, blocking, script reading, stage design, production elements.',
    body: `Theater is a collaborative art form combining acting, writing, design, and direction. Characterization is how an actor creates a believable person on stage. This involves understanding the character's background, motivations, relationships, and personality. Actors use their voice (pitch, volume, pace, tone) and body (posture, gestures, facial expressions, movement) to bring the character to life. A character arc is the transformation the character undergoes through the story.

Blocking is the planned movement of actors on stage. The director works with actors to determine where they stand, when they move, and how they interact physically. Stage directions use a specific vocabulary: upstage (away from audience), downstage (toward audience), stage right (actor's right facing audience), stage left (actor's left). Blocking ensures that important actions are visible, sightlines are clear, and the stage picture is balanced.

Script reading involves interpreting the playwright's words. A script contains dialogue (what characters say) and stage directions (instructions for movement, setting, and tone). Reading a script aloud with proper expression, pausing, and timing is essential. Vocal projection means speaking loudly enough to be heard by the entire audience without shouting. Diction is clear pronunciation of words.

Stage design creates the visual world of the play. Sets suggest location and time period using flats (wall panels), platforms, furniture, and props (objects handled by actors). Lighting design uses color, intensity, and focus to create mood, indicate time of day, and direct attention. Sound design includes background music, sound effects, and amplification. Costume design reflects character through clothing, accessories, hair, and makeup.

Improvisation is acting without a script. Actors create scenes spontaneously based on a given situation or suggestion. It develops creativity, listening skills, and quick thinking. Theater games and improvisation exercises build ensemble, trust, and spontaneity.

MAELEZO YA ZIADA: Auditions are held to cast actors for roles. Rehearsals are practice sessions where blocking, lines, and timing are refined. A tech rehearsal focuses on lighting, sound, and set changes. The dress rehearsal is the final run‑through in full costume before opening night.`

    + `\n\nPRACTICE QUESTIONS\n1. Creating a believable person on stage is ________.\n2. Moving toward the audience is ________ stage.\n3. The actor's right facing the audience is stage ________.\n4. The written text of a play is the ________.\n5. Speaking loudly enough to be heard is vocal ________.\n6. Clear pronunciation is called ________.\n7. Objects handled by actors are called ________.\n8. Acting without a script is ________.\n9. The person who guides the actors and vision of the play is the ________.\n10. Costume design reflects a character's ________.`
  },
  {
    id: 'pe-health',
    title: 'Health, Physical Education, and Nutrition',
    summary: 'Motor skills, gameplay strategy, anatomy, nutrition, substance prevention.',
    body: `Physical education develops the whole person – body, mind, and social skills. Locomotor skills move the body through space: running (both feet off the ground briefly), skipping (step‑hop pattern), leaping (exaggerated running step), galloping (one foot always leads), and sliding (sideways galloping). Non‑locomotor skills are stationary: stretching, twisting, bending, swaying, balancing. Manipulative skills involve controlling objects: throwing (overhand, underhand), catching (absorbing force with hands), kicking (instep, toe), dribbling (feet or hands), and striking (bat, racquet).

Team sports require strategy. In offense, players work to advance the ball or object toward the opponent's goal. In defense, players protect their own goal and try to regain possession. Effective teams communicate, maintain spacing, and anticipate opponents' moves. Sportsmanship means playing fairly, respecting officials, accepting outcomes gracefully, and supporting teammates. Good sports are humble in victory and gracious in defeat.

The human body responds to exercise. The cardiovascular system (heart and blood vessels) delivers oxygen to muscles. Regular aerobic exercise (running, swimming) strengthens the heart. The muscular system allows movement; strength training builds muscle. Flexibility exercises (stretching) improve range of motion. Resting heart rate indicates fitness level – lower is generally better.

Nutrition fuels the body. Macronutrients: carbohydrates (main energy source – grains, fruits), proteins (build and repair tissues – meat, beans, dairy), fats (long‑term energy, cell membranes – oils, nuts). Micronutrients: vitamins and minerals support body functions. Reading a nutrition facts label helps make healthy choices. Check serving size, calories, and nutrients.

Substance abuse prevention is critical. Tobacco contains nicotine, which is highly addictive and damages lungs. Alcohol impairs judgment, coordination, and can lead to addiction. Misuse of medicines (taking someone else's prescription or exceeding dosage) is dangerous. Saying “no” confidently, choosing healthy friends, and seeking help from trusted adults are strategies to resist peer pressure.

MAELEZO YA ZIADA: Hydration is crucial; water is the best drink. Sleep (9‑12 hours for children) is essential for growth and learning. Stress management techniques include journaling, talking to someone, and engaging in hobbies. First aid basics: for cuts, clean with water and apply a bandage; for burns, cool under running water.`

    + `\n\nPRACTICE QUESTIONS\n1. Skipping is a ________ skill.\n2. Throwing and catching are ________ skills.\n3. Playing fairly and respecting opponents is ________.\n4. The system that delivers oxygen to muscles is the ________ system.\n5. The main energy source in food is ________.\n6. Proteins help ________ and repair tissues.\n7. Checking a food's serving size and nutrients is reading the ________ label.\n8. Tobacco contains ________, an addictive substance.\n9. Alcohol impairs ________ and coordination.\n10. Saying “no” to harmful substances requires ________ skills.`
  },
  {
    id: 'technology',
    title: 'Technology, Digital Literacy, and Coding',
    summary: 'Hardware, software, spreadsheets, block‑based coding, algorithms, digital citizenship.',
    body: `Technology is woven into modern life. Computer hardware includes physical components: CPU (central processing unit – the brain), RAM (random access memory – temporary storage), hard drive (permanent storage), motherboard (connects everything), and peripherals (keyboard, mouse, monitor, printer). Software includes operating systems (Windows, macOS, ChromeOS) that manage hardware, and application software (word processors, spreadsheets, browsers, games) that perform specific tasks.

Spreadsheets are powerful tools for organizing and analyzing data. Data is entered into cells identified by column letter and row number (e.g., A1, B2). Formulas perform calculations: =SUM(A1:A5) adds the values in those cells, =AVERAGE(B1:B10) finds the mean. The fill handle can copy formulas to adjacent cells. Spreadsheets can create charts and graphs to visualize data.

Coding (computer programming) is giving instructions to a computer. Block‑based coding environments like Scratch use visual blocks that snap together, eliminating syntax errors. Key concepts include: sequence (order of steps), loops (repeating blocks – “repeat 10 times”), conditionals (if‑then‑else decisions – “if touching edge, bounce”), variables (storing values that can change – score), and events (triggers – “when green flag clicked”). An algorithm is a step‑by‑step procedure for solving a problem. Debugging is finding and fixing errors in code.

Digital citizenship means using technology responsibly. Keep personal information private (full name, address, phone number, passwords). Treat others with respect online; don't post hurtful comments. Cyberbullying is repeated mean behavior using technology; it must be reported to a trusted adult. Evaluate online sources for credibility: check the author, date, and whether the information is supported by evidence. A digital footprint is the trail of data left online – posts, comments, photos – that can be permanent. Be thoughtful about what you share.

MAELEZO YA ZIADA: The internet is a global network of computers. Browsers interpret HTML to display web pages. Search engines use keywords to find information. Strong passwords mix letters, numbers, and symbols. Two‑factor authentication adds extra security. Phishing emails try to trick you into revealing personal data.`

    + `\n\nPRACTICE QUESTIONS\n1. The brain of the computer is the ________.\n2. Temporary memory is called ________.\n3. In a spreadsheet, the cell at column A, row 1 is called ________.\n4. The spreadsheet function to add numbers is ________.\n5. Repeating blocks in coding is a ________.\n6. An if‑then‑else block is a ________.\n7. A step‑by‑step procedure to solve a problem is an ________.\n8. Finding and fixing errors in code is ________.\n9. Repeated mean behavior online is ________.\n10. The trail of data you leave online is your digital ________.`
  }
]

function Grade5SupplementaryNotes() {
  const [search, setSearch] = useState('')
  const filtered = SUPP_TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()))
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 5 Supplementary Subjects</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Arts, Music, Theater, PE, Technology – 10 exercises per topic</p>
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

// ==================== MAIN COMPONENT ====================
export default function AllGrade5Notes() {
  const [activeSubject, setActiveSubject] = useState(null)

  const subjects = [
    { id: 'math',    label: 'Mathematics',           short: 'M',  desc: 'Number sense, operations, fractions and geometry',   color: '#6366f1', Component: Grade5MathNotes },
    { id: 'english', label: 'English Language Arts',  short: 'E',  desc: 'Reading comprehension, writing and grammar',         color: '#0ea5e9', Component: Grade5EnglishNotes },
    { id: 'science', label: 'Science',                short: 'Sc', desc: 'Matter, ecosystems, earth systems and space',        color: '#8b5cf6', Component: Grade5ScienceNotes },
    { id: 'ss',      label: 'Social Studies',         short: 'SS', desc: 'Early America, Revolution, civics and economics',   color: '#f59e0b', Component: Grade5SocialStudiesNotes },
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>Grade 5 Notes</h1>
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