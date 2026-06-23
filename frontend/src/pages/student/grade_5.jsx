import { useState, useEffect, useRef } from 'react';

export default function AllGrade5Notes() {
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeSection, setActiveSection] = useState('notes');

  // ----- TIMER STATE -----
  const [timerSeconds, setTimerSeconds] = useState(1800);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // ----- Q&A / QUIZ STATE (placeholders; will be connected when data is added) -----
  const [qaAnswers, setQaAnswers] = useState({});
  const [qaSubmitted, setQaSubmitted] = useState(false);
  const [qaScore, setQaScore] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (activeSection === 'qa' && !qaSubmitted) handleSubmitQA();
            if (activeSection === 'quiz' && !quizSubmitted) handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerSeconds, activeSection, qaSubmitted, quizSubmitted]);

  const startTimer = () => {
    setTimerSeconds(1800);
    setTimerActive(true);
    setQaSubmitted(false);
    setQuizSubmitted(false);
    setQaAnswers({});
    setQuizAnswers({});
    setQaScore(null);
    setQuizScore(null);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitQA = () => { /* placeholder */ };
  const handleSubmitQuiz = () => { /* placeholder */ };

  // ---------- SUBJECTS ----------
  const subjects = [
    { id: 'math',        label: 'Mathematics',          short: 'M', desc: 'Number sense, operations, fractions, decimals, algebra, geometry', color: '#6366f1', notes: MathNotes },
    { id: 'english',     label: 'English Language Arts', short: 'E', desc: 'Reading comprehension, writing, grammar and literature',           color: '#0ea5e9', notes: EnglishNotes },
    { id: 'science',     label: 'Science & Technology', short: 'Sc', desc: 'Living things, matter, energy, earth and technology',              color: '#8b5cf6', notes: ScienceNotes },
    { id: 'social',      label: 'Social Studies',        short: 'SS', desc: 'History, geography, civics, economics and environment',            color: '#f59e0b', notes: SocialNotes },
    { id: 'cre',         label: 'CRE',                   short: 'C', desc: 'Christian Religious Education notes',                             color: '#ef4444', notes: CRENotes },
    { id: 'computer',    label: 'Computer Studies',      short: 'Co', desc: 'Hardware, software, internet, networks and programming',           color: '#06b6d4', notes: ComputerNotes },
    { id: 'agriculture', label: 'Agriculture',           short: 'Ag', desc: 'Farming, soils, crops, livestock and water management',           color: '#84cc16', notes: AgricultureNotes },
    { id: 'hre',         label: 'HRE',                   short: 'H', desc: 'Hindu Religious Education notes',                                 color: '#ec4899', notes: HRENotes },
    { id: 'ire',         label: 'IRE',                   short: 'I', desc: 'Islamic Religious Education notes',                               color: '#f97316', notes: IRENotes },
    { id: 'kiswahili',   label: 'Kiswahili',             short: 'K', desc: 'Lugha na fasihi, sarufi na ufahamu',                             color: '#10b981', notes: KiswahiliNotes },
  ];

  // RENDER
  if (!activeSubject) {
    return (
      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>Grade 5 Study App</h1>
          <p style={{ color: 'var(--sub)', fontSize: '.875rem', margin: 0 }}>Select a subject to begin learning</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSubject(s); setActiveSection('notes'); startTimer(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderLeft: '4px solid ' + s.color, borderRadius: '12px',
                padding: '16px 18px', cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: s.color + '18', border: '2px solid ' + s.color + '40',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '.85rem', color: s.color, flexShrink: 0,
              }}>
                {s.short}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.95rem', marginBottom: '3px' }}>{s.label}</div>
                <div style={{ color: 'var(--sub)', fontSize: '.78rem', lineHeight: 1.4 }}>{s.desc}</div>
              </div>
              <div style={{ color: 'var(--sub)', fontSize: '1.3rem', flexShrink: 0 }}>&#8250;</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const s = activeSubject;
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '12px',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10,
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => { setActiveSubject(null); clearInterval(timerRef.current); setTimerActive(false); }}
          style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px',
            padding: '6px 12px', cursor: 'pointer', color: 'var(--text)', fontSize: '.85rem',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
          }}
        >
          &#8592; Notes
        </button>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: s.color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '.75rem', flexShrink: 0,
        }}>
          {s.short}
        </div>
        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.95rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.label}
        </span>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={() => setActiveSection('notes')} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: activeSection === 'notes' ? s.color + '20' : 'transparent', color: activeSection === 'notes' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' }}>Notes</button>
          {s.qa && <button onClick={() => { setActiveSection('qa'); startTimer(); }} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: activeSection === 'qa' ? s.color + '20' : 'transparent', color: activeSection === 'qa' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' }}>Q&A</button>}
          {s.quiz && <button onClick={() => { setActiveSection('quiz'); startTimer(); }} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: activeSection === 'quiz' ? s.color + '20' : 'transparent', color: activeSection === 'quiz' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' }}>Quiz</button>}
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {activeSection === 'notes' && s.notes && (() => { const N = s.notes; return <N />; })()}
        {/* Q&A and Quiz sections will be rendered here when data is available */}
      </div>
    </div>
  );
}

// ---------- MATHEMATICS NOTES (FULL) ----------
function MathNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Mathematics Ultimate Revision Manual</h2>
      <p>Reference Standard: Grade 5 Made Familiar Mathematics & Primary Curriculum Matrix</p>

      {/* SECTION 1: NUMBERS, PLACE VALUE, AND OPERATIONS ON LARGE NUMBERS */}
      <Section title="SECTION 1: NUMBERS, PLACE VALUE, AND OPERATIONS ON LARGE NUMBERS">
        <p>Target Word Count: 2,000 | Subject Mastery: Reading, Writing, Partitioning, and Multi-Step Calculation up to Millions</p>
        <SubSection title="Core Architectural Concepts">
          <p>In Grade 5, number systems expand systematically up to 1,000,000 (one million). A clear structural distinction must be maintained between Place Value (the position or home a digit occupies within a number) and Value / Total Value (the numerical worth of that digit based on its position).</p>
          <p>The global base-10 system groups numbers into "periods" of three digits each, separated by commas for clear reading: the Units Period (Ones, Tens, Hundreds), the Thousands Period (Thousands, Ten Thousands, Hundred Thousands), and the Millions Period.</p>
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Millions (M)</th>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Hundred Thousands (HT)</th>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Ten Thousands (TT)</th>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Thousands (T)</th>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Hundreds (H)</th>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Tens (T)</th>
                <th style={{ border: '1px solid var(--border)', padding: '4px' }}>Ones (O)</th>
              </tr>
              <tr style={{ border: '1px solid var(--border)' }}>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>1,000,000</td>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>100,000</td>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>10,000</td>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>1,000</td>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>100</td>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>10</td>
                <td style={{ border: '1px solid var(--border)', padding: '4px' }}>1</td>
              </tr>
            </tbody>
          </table>
          <p>The Principle of Place Value Assignment: Every movement to the left across the place value chart increases the digit's value by a factor of 10. Conversely, every movement to the right decreases the value by a factor of 10. When partitioning a number, it can be written as the sum of its constituent parts in expanded form: Expanded Form = (Digit1 × PV1) + (Digit2 × PV2) + × + (Digit? × PV?)</p>
          <p>Operations Mechanics: Alignment and Exchange × Addition and Subtraction rely on rigid vertical alignment. Long Multiplication breaks down numbers by place value, using a placeholder zero when multiplying by the tens digit. Long Division follows the iterative algorithm: Divide, Multiply, Subtract, Bring Down (DMSB).</p>
        </SubSection>

        <SubSection title="Worked Examples (10 Step-by-Step Solutions)">
          {/* Example 1.1 */}
          <WorkedExample title="Example 1.1: Total Value Extraction" problem="Identify the place value and calculate the total value of the digit 7 in the number 4,725,309.">
            <Step>Step 1: Create a vertical place value alignment chart for the number 4,725,309 starting from the rightmost digit. 9 → Ones, 0 → Tens, 3 → Hundreds, 5 → Thousands, 2 → Ten Thousands, 7 → <strong>Hundred Thousands</strong>, 4 → Millions.</Step>
            <Step>Step 2: State the place value position. The place value of 7 is <strong>Hundred Thousands</strong>.</Step>
            <Step>Step 3: Apply the value formula: Total Value = Digit × Place Value Position. Total Value = 7 × 100,000 = <strong>700,000</strong>.</Step>
            <FinalAnswer>Place Value: Hundred Thousands; Total Value: <strong>700,000</strong>.</FinalAnswer>
          </WorkedExample>

          {/* Example 1.2 */}
          <WorkedExample title="Example 1.2: Advanced Word-Form to Digit Conversion" problem="Write out 'Eight hundred and thirty-four thousand, two hundred and fifteen' in standard numeral form and expand it.">
            <Step>Step 1: Isolate the thousands period group: 'Eight hundred and thirty-four thousand' translates to 834,000.</Step>
            <Step>Step 2: Isolate the units period group: 'Two hundred and fifteen' translates to 215.</Step>
            <Step>Step 3: Add the two period components together: 834,000 + 215 = <strong>834,215</strong>.</Step>
            <Step>Step 4: Write the expanded notation format explicitly: 834,215 = 800,000 + 30,000 + 4,000 + 200 + 10 + 5.</Step>
            <FinalAnswer>Numeral: <strong>834,215</strong>; Expansion: <strong>800,000 + 30,000 + 4,000 + 200 + 10 + 5</strong>.</FinalAnswer>
          </WorkedExample>

          {/* Example 1.3 */}
          <WorkedExample title="Example 1.3: Six-Digit Subtraction with Multiple Borrowing Steps" problem="Compute the exact difference between 834,215 and 547,189.">
            <Step>Step 1: Align the numbers vertically by columns.</Step>
            <Step>Step 2: Subtract the ones column (5 - 9). Since 5 &lt; 9, borrow 1 ten from the tens column. The 5 becomes 15, and the tens digit becomes 0. 15 - 9 = 6.</Step>
            <Step>Step 3: Subtract the tens column (0 - 8). Since 0 &lt; 8, borrow 1 hundred from the hundreds column. The 0 becomes 10, and the hundreds digit becomes 1. 10 - 8 = 2.</Step>
            <Step>Step 4: Subtract the hundreds column (1 - 1 = 0).</Step>
            <Step>Step 5: Subtract the thousands column (4 - 7). Borrow 1 ten-thousand. The 4 becomes 14, the ten-thousands digit becomes 2. 14 - 7 = 7.</Step>
            <Step>Step 6: Subtract the ten-thousands column (2 - 4). Borrow 1 hundred-thousand. The 2 becomes 12, the hundred-thousands digit becomes 7. 12 - 4 = 8.</Step>
            <Step>Step 7: Subtract the hundred-thousands column (7 - 5 = 2). Assemble the structural columns.</Step>
            <FinalAnswer><strong>287,026</strong></FinalAnswer>
          </WorkedExample>

          {/* Example 1.4 */}
          <WorkedExample title="Example 1.4: Long Multiplication with Partial Product Compilation" problem="Find the product of 426 × 35.">
            <Step>Step 1: Arrange the factors vertically. Multiply 426 by the ones digit (5). 426 × 5 = (400°5) + (20°5) + (6°5) = 2000 + 100 + 30 = 2,130.</Step>
            <Step>Step 2: Write down 2,130 as the first partial product line.</Step>
            <Step>Step 3: Multiply 426 by the tens digit (3, which represents 30). Write a placeholder 0 in the ones column. Then multiply 426 × 3 = 1,278 → With placeholder 0 → 12,780.</Step>
            <Step>Step 4: Stack and add the partial products together: 2,130 + 12,780 = <strong>14,910</strong>.</Step>
            <FinalAnswer><strong>14,910</strong></FinalAnswer>
          </WorkedExample>

          {/* Example 1.5 */}
          <WorkedExample title="Example 1.5: Three-Digit Divisor Long Division" problem="Solve 7,425 × 12 and identify the quotient and remainder.">
            <Step>Step 1: Set up the long division bracket. 74 × 12 = 6 with remainder 2. Place 6 in the quotient.</Step>
            <Step>Step 2: Bring down the next digit (2), creating 22. 22 × 12 = 1 remainder 10. Place 1 in the quotient.</Step>
            <Step>Step 3: Bring down the final digit (5), creating 105. 105 × 12 = 8 remainder 9. Place 8 in the quotient.</Step>
            <Step>Step 4: No more digits to bring down. The remainder is 9.</Step>
            <FinalAnswer>Quotient: <strong>618</strong>, Remainder: <strong>9</strong> (618 R 9).</FinalAnswer>
          </WorkedExample>

          {/* Example 1.6 */}
          <WorkedExample title="Example 1.6: Rounding to the Nearest Ten Thousand" problem="Round the population figure 584,792 to the nearest ten thousand.">
            <Step>Step 1: Locate the digit in the target rounding position (Ten Thousands). The digit is 8.</Step>
            <Step>Step 2: Look at the digit immediately to its right (Thousands place). The digit is 4.</Step>
            <Step>Step 3: Apply the rounding rule: If the check digit is less than 5, leave the target digit unchanged. Since 4 &lt; 5, the 8 remains unchanged. Change all digits to the right of the ten thousands place to zeros.</Step>
            <FinalAnswer><strong>580,000</strong></FinalAnswer>
          </WorkedExample>

          {/* Example 1.7 */}
          <WorkedExample title="Example 1.7: Multi-Step Real Estate Word Problem" problem="A coffee factory processed 145,200 kg in month one, 98,450 kg in month two, and lost 12,340 kg to spoilage. How many kg of usable coffee remain?">
            <Step>Step 1: Find the total weight processed: 145,200 + 98,450 = 243,650 kg.</Step>
            <Step>Step 2: Subtract the spoiled coffee: 243,650 - 12,340 = <strong>231,310 kg</strong>.</Step>
            <FinalAnswer><strong>231,310 kg</strong></FinalAnswer>
          </WorkedExample>

          {/* Example 1.8 */}
          <WorkedExample title="Example 1.8: Word Problem Involving Equal Distribution" problem="An NGO wants to distribute 45,000 exercise books equally among 75 primary schools. How many books will each school receive?">
            <Step>Step 1: Identify the operation × use division: 45,000 × 75.</Step>
            <Step>Step 2: Use division strategies: 75 × 6 = 450, so 450 × 75 = 6. Append the remaining two zeros from the dividend.</Step>
            <FinalAnswer><strong>600 books per school</strong></FinalAnswer>
          </WorkedExample>

          {/* Example 1.9 */}
          <WorkedExample title="Example 1.9: Identifying Missing Numbers via Place Value Partitioning" problem="Fill in the missing boxes to complete the equation: 706,423 = ? + 6,000 + 400 + ? + 3.">
            <Step>Step 1: Determine the value of every single digit based on its position in 706,423. 7 → 700,000; 0 → 0; 6 → 6,000; 4 → 400; 2 → 20; 3 → 3.</Step>
            <Step>Step 2: Compare your expanded values with the terms given. The box (?) corresponds to the hundred-thousands place (700,000). The triangle (?) corresponds to the tens place (20).</Step>
            <FinalAnswer>? = <strong>700,000</strong>, ? = <strong>20</strong></FinalAnswer>
          </WorkedExample>

          {/* Example 1.10 */}
          <WorkedExample title="Example 1.10: Formulating the Smallest/Largest Value Configurations" problem="Using the digits 5, 0, 8, 2, 9, 3 exactly once each, construct both the largest possible number and the smallest possible number.">
            <Step>Step 1: To create the largest number, arrange digits in descending order: 9,8,5,3,2,0 → 985,320.</Step>
            <Step>Step 2: To create the smallest number, arrange digits in ascending order: 0,2,3,5,8,9.</Step>
            <Step>Step 3: A standard 6-digit number cannot start with 0. Swap the 0 with the next smallest non-zero digit (2). Rearranged form: 2,0,3,5,8,9 → 203,589.</Step>
            <FinalAnswer>Largest: <strong>985,320</strong>; Smallest: <strong>203,589</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      {/* SECTION 2: FACTORS, MULTIPLES, AND PRIME NUMBERS */}
      <Section title="SECTION 2: FACTORS, MULTIPLES, AND PRIME NUMBERS">
        <p>Target Word Count: 2,000 | Subject Mastery: Complete Factorization, LCM/HCF Applications, and Prime Distribution</p>
        <SubSection title="Core Architectural Concepts">
          <p>Every whole number greater than 1 can be categorized based on its factor density. Factors are numbers that divide exactly into a target number without leaving a remainder. Multiples are numbers generated by multiplying a given whole number by any other whole number. Prime Numbers have exactly two distinct factors: 1 and the number itself. Composite Numbers have more than two distinct factors.</p>
          <p>The Fundamental Theorem of Arithmetic states that every composite number can be uniquely broken down into a product of prime numbers (Prime Factorization). We find these using a tree diagram or division ladder. HCF (Highest Common Factor) is the largest factor shared by a set of numbers. LCM (Lowest Common Multiple) is the smallest common multiple shared by a set of numbers.</p>
        </SubSection>

        <SubSection title="Worked Examples (10 Step-by-Step Solutions)">
          <WorkedExample title="Example 2.1: Full Factor Isolation Analysis" problem="Find all the individual factors of 48 and classify it as prime or composite.">
            <Step>Step 1: Find all factor pairs that multiply together to give 48. 1°48=48, 2°24=48, 3°16=48, 4°12=48, 6°8=48.</Step>
            <Step>Step 2: List these factors in ascending order: {1, 2, 3, 4, 6, 8, 12, 16, 24, 48}.</Step>
            <Step>Step 3: Count the total number of factors. There are 10 factors. Since 10 &gt; 2, the number is composite.</Step>
            <FinalAnswer>Factors: <strong>{1,2,3,4,6,8,12,16,24,48}</strong>; Classification: <strong>Composite</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.2: Prime Factorization Tree Mechanics" problem="Express 120 as a product of prime factors using exponent index notation.">
            <Step>Step 1: Divide 120 by its smallest prime factor (2): 120 = 2 × 60.</Step>
            <Step>Step 2: Break down 60: 60 = 2 × 30.</Step>
            <Step>Step 3: Break down 30: 30 = 2 × 15.</Step>
            <Step>Step 4: Break down 15: 15 = 3 × 5. Both 3 and 5 are primes × factorization complete.</Step>
            <Step>Step 5: Collect all prime factors: 120 = 2 × 2 × 2 × 3 × 5.</Step>
            <Step>Step 6: Convert to index notation: 120 = 2² × 3² × 5×.</Step>
            <FinalAnswer><strong>2³ × 3 × 5</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.3: Finding HCF via Prime Intersection" problem="Calculate the HCF of 36, 60, and 84.">
            <Step>Step 1: Prime factorizations: 36 = 2² × 3²; 60 = 2² × 3² × 5×; 84 = 2² × 3² × 7×.</Step>
            <Step>Step 2: Common primes: 2 and 3.</Step>
            <Step>Step 3: Lowest powers: 2° and 3².</Step>
            <Step>Step 4: Multiply: HCF = 2² × 3² = 4 × 3 = 12.</Step>
            <FinalAnswer><strong>12</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.4: Finding LCM via Unified Division Ladder" problem="Determine the LCM of 12, 18, and 24.">
            <Step>Step 1: Set up a unified division ladder. Divide by 2: 12?6, 18?9, 24?12. Divide by 2 again: 6?3, 9?9, 12?6. Divide by 2 again: 3?3, 9?9, 6?3. Divide by 3: 3?1, 9?3, 3?1. Divide by 3 again: 1?1, 3?1, 1?1.</Step>
            <Step>Step 2: Multiply all divisors: 2 × 2 × 2 × 3 × 3 = 8 × 9 = 72.</Step>
            <FinalAnswer><strong>72</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.5: Word Problem on Synchronous Events (LCM)" problem="Three school bells toll at intervals of 9, 12, and 15 minutes. If they toll together at 08:00 AM, when will they next toll together?">
            <Step>Step 1: Find LCM of 9, 12, and 15. Prime factors: 9=3×, 12=2××3, 15=3°5.</Step>
            <Step>Step 2: LCM = 2² × 3² × 5 = 4 × 9 × 5 = 180 minutes.</Step>
            <Step>Step 3: Convert to hours: 180 × 60 = 3 hours.</Step>
            <Step>Step 4: Add to start time: 08:00 AM + 3 hours = 11:00 AM.</Step>
            <FinalAnswer><strong>11:00 AM</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.6: Word Problem on Maximum Equal Grouping (HCF)" problem="A teacher has 45 red pens and 75 blue pens. She wants to divide them into identical packages with no pens left over. What is the maximum number of packages?">
            <Step>Step 1: Find HCF of 45 and 75. Prime factors: 45=3××5, 75=3°5×.</Step>
            <Step>Step 2: Lowest powers: 3² × 5× = 15.</Step>
            <Step>Step 3: Each package gets 45°15=3 red pens, 75°15=5 blue pens.</Step>
            <FinalAnswer><strong>15 packages</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.7: Sieve of Eratosthenes Prime Extraction Within Ranges" problem="List all prime numbers between 40 and 60.">
            <Step>Step 1: Write odd numbers in range: {41,43,45,47,49,51,53,55,57,59}.</Step>
            <Step>Step 2: Filter multiples of 3: 45 (4+5=9), 51 (5+1=6), 57 (5+7=12) × remove these.</Step>
            <Step>Step 3: Filter multiples of 5 (end in 5): 55 × remove.</Step>
            <Step>Step 4: Filter multiples of 7: 49 (7°7) × remove.</Step>
            <Step>Step 5: Remaining primes: {41,43,47,53,59}.</Step>
            <FinalAnswer><strong>41, 43, 47, 53, 59</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.8: Testing Large Numbers for Divisibility" problem="Test whether 4,392 is divisible by 3, 4, and 6 without long division.">
            <Step>Step 1: Test for 3: Sum of digits = 4+3+9+2 = 18 (divisible by 3) → divisible by 3.</Step>
            <Step>Step 2: Test for 4: Last two digits = 92, 92°4=23 → divisible by 4.</Step>
            <Step>Step 3: Test for 6: Divisible by both 2 (even) and 3 → divisible by 6.</Step>
            <FinalAnswer>Yes, <strong>4,392</strong> is divisible by 3, 4, and 6.</FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.9: Consecutive Factoring via Differences" problem="The product of two consecutive numbers is 210. Find these two numbers.">
            <Step>Step 1: Estimate v210 × 14.5. Try 14 and 15.</Step>
            <Step>Step 2: 14 × 15 = 14 × (10+5) = 140 + 70 = 210. Matches.</Step>
            <FinalAnswer><strong>14 and 15</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2.10: Divisibility Remainder Reconstruction" problem="Find the smallest number that leaves a remainder of 3 when divided by either 8 or 12.">
            <Step>Step 1: Find LCM of 8 and 12. Prime factors: 8=2×, 12=2××3.</Step>
            <Step>Step 2: LCM = 2² × 3 = 24.</Step>
            <Step>Step 3: Add remainder: 24 + 3 = 27.</Step>
            <FinalAnswer><strong>27</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      {/* SECTION 3: FRACTIONS AND FRACTIONAL OPERATIONS */}
      <Section title="SECTION 3: FRACTIONS AND FRACTIONAL OPERATIONS">
        <p>Target Word Count: 2,000 | Subject Mastery: Unlike Denominators, Mixed Structures, and Real-World Partitioning</p>
        <SubSection title="Core Architectural Concepts">
          <p>Fractions represent equal parts of a whole item or a collection. The Common Denominator Principle: You can add or subtract fractions directly only when they have identical denominators (Like Fractions). When fractions have different denominators (Unlike Fractions), you must first convert them into equivalent forms with a common denominator × the Least Common Denominator (LCD), which is the LCM of the original denominators.</p>
          <p>Conversion: Mixed Number to Improper Fraction: (Whole Number × Denominator + Numerator) / Denominator. Fraction Multiplication: Multiply numerators straight across and denominators straight across. Fraction Division: Multiply the first fraction by the reciprocal of the second (Keep-Change-Flip).</p>
        </SubSection>

        <SubSection title="Worked Examples (10 Step-by-Step Solutions)">
          <WorkedExample title="Example 3.1: Converting Mixed Numbers to Improper Fractions" problem="Convert 4 3/7 into an improper fraction.">
            <Step>Step 1: Multiply the whole number (4) by the denominator (7): 4 × 7 = 28.</Step>
            <Step>Step 2: Add the numerator (3): 28 + 3 = 31.</Step>
            <Step>Step 3: Write over the original denominator: 31/7.</Step>
            <FinalAnswer><strong>31/7</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 3.2: Simplifying Improper Fractions to Mixed Form" problem="Convert 53/12 into a mixed number in simplest form.">
            <Step>Step 1: Divide numerator by denominator: 53 × 12 = 4 remainder 5.</Step>
            <Step>Step 2: Quotient (4) becomes the whole number. Remainder (5) becomes numerator, denominator stays 12.</Step>
            <Step>Step 3: Check if 5/12 can be simplified × it cannot (5 is prime).</Step>
            <FinalAnswer><strong>4 5/12</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>

        <SubSection title="Fractions × Comprehensive Grade 5 Guide (Extended)">
          <p>Fractions represent parts of a whole, parts of a set, or division operations. In Grade 5, understanding fractions requires moving beyond simple visual models to mastering abstract operations, common denominators, and conversions between different fractional forms.</p>
          
          <SubSection title="1. Conceptual Foundations and Classifications">
            <p>A fraction is written in the form a/b, where a is the numerator and b is the denominator. The vinculum (horizontal line) functionally represents a division sign. The denominator states the total number of equal parts; the numerator indicates how many parts are taken.</p>
            <BulletList items={[
              'Proper Fractions: Numerator < Denominator. Values lie between 0 and 1 (e.g., 3/4, 5/8, 11/12).',
              'Improper Fractions: Numerator = Denominator. Values = 1 (e.g., 7/4, 15/8, 9/9).',
              'Mixed Numbers: Whole number + proper fraction (e.g., 1 3/4, 2 5/11, 5 1/2).'
            ]} />
          </SubSection>

          <SubSection title="2. Fractional Conversions and Equivalence">
            <BulletList items={[
              'Mixed to Improper: W a/b = ((W × b) + a) / b.',
              'Improper to Mixed: Divide numerator by denominator; quotient = whole number, remainder = numerator, denominator unchanged.',
              'Equivalence: a/b = (a × c)/(b × c) = (a × d)/(b × d) for non-zero c, d. Simplification: divide numerator and denominator by their HCF.',
            ]} />
          </SubSection>

          <SubSection title="3. Operations with Fractions">
            <BulletList items={[
              'Addition/Subtraction (Like Denominators): a/c × b/c = (a × b)/c. Simplify if needed.',
              'Addition/Subtraction (Unlike Denominators): Find LCD (LCM of denominators), convert each fraction, then add/subtract numerators. Convert improper results to mixed numbers.',
              'Multiplication: a/b × c/d = (a × c) / (b × d). Cross-cancel before multiplying to simplify.',
              'Division: a/b × c/d = a/b × d/c = (a × d) / (b × c). Apply Keep-Change-Flip.'
            ]} />
          </SubSection>

          <SubSection title="4. Ten Detailed Worked Examples with Step-by-Step Calculations">
            <WorkedExample title="Example 1: Converting Mixed Numbers to Improper Fractions" problem="Convert 4 5/7 into an improper fraction.">
              <Step>Step 1: Whole number W=4, Numerator a=5, Denominator b=7.</Step>
              <Step>Step 2: (W × b) + a = (4 × 7) + 5 = 28 + 5 = 33.</Step>
              <Step>Step 3: Result: 33/7.</Step>
              <FinalAnswer><strong>33/7</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 2: Converting Improper Fractions to Mixed Numbers" problem="Convert 57/8 into a mixed number.">
              <Step>Step 1: Divide 57 by 8: 57 × 8 = 7 remainder 1 (8°7=56, 57-56=1).</Step>
              <Step>Step 2: Whole number = 7, numerator = 1, denominator = 8.</Step>
              <FinalAnswer><strong>7 1/8</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 3: Simplifying Fractions to Lowest Terms" problem="Reduce 48/72 to simplest form.">
              <Step>Step 1: Find HCF of 48 and 72. Factors of 48: 1,2,3,4,6,8,12,16,24,48. Factors of 72: 1,2,3,4,6,8,9,12,18,24,36,72. HCF = 24.</Step>
              <Step>Step 2: Divide both by 24: 48°24=2, 72°24=3.</Step>
              <FinalAnswer><strong>2/3</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 4: Addition of Fractions with Unlike Denominators" problem="Calculate 2/5 + 3/7.">
              <Step>Step 1: LCD = LCM of 5 and 7 = 35.</Step>
              <Step>Step 2: Convert: 2/5 = (2°7)/(5°7) = 14/35; 3/7 = (3°5)/(7°5) = 15/35.</Step>
              <Step>Step 3: Add: 14/35 + 15/35 = 29/35. Cannot simplify.</Step>
              <FinalAnswer><strong>29/35</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 5: Subtraction of Mixed Numbers with Borrowing" problem="Compute 5 1/4 - 2 2/3.">
              <Step>Step 1: Convert to improper: 5 1/4 = 21/4; 2 2/3 = 8/3.</Step>
              <Step>Step 2: LCD of 4 and 3 = 12. Convert: 21/4 = 63/12; 8/3 = 32/12.</Step>
              <Step>Step 3: Subtract: 63/12 - 32/12 = 31/12.</Step>
              <Step>Step 4: Convert to mixed number: 31°12 = 2 remainder 7 → 2 7/12.</Step>
              <FinalAnswer><strong>2 7/12</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 6: Multiplication of a Fraction by a Whole Number" problem="Find the product of 8 × 5/12.">
              <Step>Step 1: Write 8 as 8/1 → problem becomes 8/1 × 5/12.</Step>
              <Step>Step 2: Multiply: (8°5)/(1°12) = 40/12.</Step>
              <Step>Step 3: Simplify: divide by 4 → 10/3.</Step>
              <Step>Step 4: Convert to mixed: 10°3 = 3 remainder 1 → 3 1/3.</Step>
              <FinalAnswer><strong>3 1/3</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 7: Multiplication of Two Fractions with Cross-Cancellation" problem="Find 9/14 × 7/15.">
              <Step>Step 1: Set up: (9°7)/(14°15).</Step>
              <Step>Step 2: Cross-cancel: 9 and 15 share factor 3 → 3/5; 7 and 14 share factor 7 → 1/2.</Step>
              <Step>Step 3: Multiply: (3°1)/(2°5) = 3/10.</Step>
              <FinalAnswer><strong>3/10</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 8: Division of a Whole Number by a Proper Fraction" problem="Calculate 6 × 3/4.">
              <Step>Step 1: Write 6 as 6/1. Apply KCF: 6/1 × 3/4 = 6/1 × 4/3.</Step>
              <Step>Step 2: Cross-cancel: 6 and 3 share factor 3 → 2/1 × 4/1.</Step>
              <Step>Step 3: Multiply: 2°4 = 8.</Step>
              <FinalAnswer><strong>8</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 9: Division of a Fraction by another Fraction" problem="Find 5/6 × 2/3.">
              <Step>Step 1: Apply KCF: 5/6 × 3/2.</Step>
              <Step>Step 2: Cross-cancel: 3 and 6 share factor 3 → 5/2 × 1/2.</Step>
              <Step>Step 3: Multiply: 5/4. Convert to mixed: 1 1/4.</Step>
              <FinalAnswer><strong>1 1/4</strong></FinalAnswer>
            </WorkedExample>

            <WorkedExample title="Example 10: Multi-Step Word Problem Involving Fractions" problem="A tailor has 12 1/2 m of fabric. She cuts off 4 2/3 m for a dress and 3 3/4 m for a coat. Find the remaining length.">
              <Step>Step 1: Total used = 4 2/3 + 3 3/4. Convert to improper: 14/3 + 15/4. LCD=12 → 56/12 + 45/12 = 101/12 m used.</Step>
              <Step>Step 2: Initial length = 12 1/2 = 25/2. Convert to denominator 12: (25°6)/(2°6) = 150/12.</Step>
              <Step>Step 3: Remaining = 150/12 - 101/12 = 49/12 = 4 1/12 m.</Step>
              <FinalAnswer><strong>4 1/12 metres</strong></FinalAnswer>
            </WorkedExample>
          </SubSection>

          <SubSection title="5. Critical Review and Common Pitfalls">
            <BulletList items={[
              '1. Adding Denominators Directly: Error: 1/2 + 1/3 = 2/5. Correction: Find a common denominator first × denominators indicate piece size, not how many pieces.',
              '2. Forgetting to Invert the Divisor: Error: During division, not flipping the second fraction. Correction: Always apply Keep-Change-Flip in order.',
              '3. Mismanaging Whole Numbers in Mixed Number Subtraction: Error: Subtracting smaller numerator from larger one without converting. Correction: Convert both mixed numbers to improper fractions first.'
            ]} />
          </SubSection>

          <SubSection title="6. Summary Reference Table">
            <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
              <tbody>
                <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Operation</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>General Rule</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Key Requirement</th></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Addition</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>a/c + b/d = (ad+bc)/cd</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Find LCD</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Subtraction</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>a/c - b/d = (ad-bc)/cd</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Find LCD</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Multiplication</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>a/b × c/d = (a × c)/(b × d)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Cross-cancel if possible</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Division</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>a/b × c/d = a/b × d/c</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Invert divisor (KCF)</td></tr>
              </tbody>
            </table>
          </SubSection>
        </SubSection>
      </Section>

      {/* SECTION 4: DECIMALS AND PERCENTAGES */}
      <Section title="SECTION 4: DECIMALS AND PERCENTAGES">
        <SubSection title="1. Place Value of Decimals">
          <p>A decimal point separates whole numbers from fractional parts. Each step to the right decreases the value by a factor of ten: Tenths (0.1), Hundredths (0.01), Thousandths (0.001).</p>
        </SubSection>
        <SubSection title="2. Conversions: Fractions, Decimals, and Percentages">
          <BulletList items={[
            'Decimal ? Fraction: Write digits after decimal point as numerator; denominator is the place value (10, 100, 1000). Simplify.',
            'Fraction ? Decimal: Divide numerator by denominator, adding decimal point and trailing zeros.',
            'Percentage ? Decimal: Divide by 100 (move decimal 2 places left).',
            'Decimal ? Percentage: Multiply by 100 (move decimal 2 places right) and add % symbol.'
          ]} />
        </SubSection>
        <SubSection title="3. Arithmetic Operations with Decimals">
          <BulletList items={[
            'Addition/Subtraction: Line up decimal points vertically. Add placeholder zeros for equal length.',
            'Multiplication: Multiply as whole numbers, then count total decimal places from both factors and place the point.',
            'Division by a Whole Number: Place decimal point in quotient directly above its position in the dividend.',
            'Division by a Decimal: Multiply both divisor and dividend by 10, 100, or 1000 to make the divisor a whole number.'
          ]} />
        </SubSection>
        <SubSection title="4. Ten Detailed Worked Examples with Step-by-Step Calculations">
          <WorkedExample title="Example 1: Determining Place Value and Value" problem="State the place value and actual value of digit 8 in 45.382.">
            <Step>Step 1: Positions: 4 (Tens), 5 (Ones), 3 (Tenths), 8 (Hundredths), 2 (Thousandths).</Step>
            <Step>Step 2: Value = 8 × 1/100 = 0.08.</Step>
            <FinalAnswer>Place Value: <strong>Hundredths</strong>; Value: <strong>0.08</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2: Converting a Decimal to a Fraction" problem="Convert 0.35 into a fraction in simplest form.">
            <Step>Step 1: Last digit (5) is in hundredths place → 35/100.</Step>
            <Step>Step 2: Simplify by dividing by HCF=5: 35°5=7, 100°5=20 → 7/20.</Step>
            <FinalAnswer><strong>7/20</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 3: Converting a Fraction to a Decimal" problem="Convert 5/8 into a decimal using long division.">
            <Step>Step 1: Set up 5 × 8. 5 &lt; 8 → write 0. and add zeros. 5.000 × 8 = 0.625.</Step>
            <FinalAnswer><strong>0.625</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 4: Converting a Percentage to a Fraction" problem="Convert 68% into a fraction in lowest terms.">
            <Step>Step 1: Write as 68/100.</Step>
            <Step>Step 2: Simplify by dividing by HCF=4: 68°4=17, 100°4=25 → 17/25.</Step>
            <FinalAnswer><strong>17/25</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 5: Addition of Decimals" problem="Find the sum of 14.7 + 3.845 + 0.92.">
            <Step>Step 1: Line up decimal points and add zeros: 14.700 + 3.845 + 0.920.</Step>
            <Step>Step 2: Add columns: thousandths 0+5+0=5; hundredths 0+4+2=6; tenths 7+8+9=24 (write 4, carry 2); ones 4+3+0+2=9; tens 1+0+0=1.</Step>
            <FinalAnswer><strong>19.465</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 6: Subtraction of Decimals with Borrowing" problem="Calculate 23.4 - 9.76.">
            <Step>Step 1: Line up with zero: 23.40 - 9.76.</Step>
            <Step>Step 2: Hundredths: 0-6 → borrow, 10-6=4; tenths: 3-7 → borrow, 13-7=6; ones: 2-9 → borrow, 12-9=3; tens: 1-0=1.</Step>
            <FinalAnswer><strong>13.64</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 7: Multiplication of Decimals" problem="Calculate 4.12 × 2.3.">
            <Step>Step 1: Multiply as whole numbers: 412 × 23 = 9,476.</Step>
            <Step>Step 2: Count decimal places: 4.12 (2 places) + 2.3 (1 place) = 3 places. Move decimal 3 places left: 9.476.</Step>
            <FinalAnswer><strong>9.476</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 8: Dividing a Decimal by a Whole Number" problem="Compute 15.54 × 6.">
            <Step>Step 1: Set up long division: 6 into 15.54. 15°6=2 rem 3; bring down 5 → 35°6=5 rem 5; bring down 4 → 54°6=9.</Step>
            <FinalAnswer><strong>2.59</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 9: Dividing a Decimal by another Decimal" problem="Calculate 3.24 × 0.4.">
            <Step>Step 1: Multiply both by 10 to make divisor whole: 3.24°10=32.4, 0.4°10=4.</Step>
            <Step>Step 2: Divide: 32.4 × 4 = 8.1.</Step>
            <FinalAnswer><strong>8.1</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 10: Percentage and Money Word Problem" problem="A farmer harvested 250 kg of tomatoes. He sold 60%. How many kg did he keep?">
            <Step>Step 1: Percentage kept = 100% - 60% = 40%.</Step>
            <Step>Step 2: 40% = 0.4. Multiply: 250 × 0.4 = 100 kg.</Step>
            <FinalAnswer><strong>100 kg of tomatoes kept</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
        <SubSection title="5. Critical Review and Common Pitfalls">
          <BulletList items={[
            '1. Misaligning Decimal Points during Addition/Subtraction × always line up decimal points.',
            '2. Bringing the Decimal Point Straight Down in Multiplication × count total decimal places instead.',
            '3. Forgetting to Scale the Dividend in Decimal Division × whatever you multiply divisor by, do the same to dividend.'
          ]} />
        </SubSection>
        <SubSection title="6. Summary Reference Table">
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Target Conversion</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Mechanical Action Required</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Example</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Decimal ? Fraction</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Write over place value base, then simplify</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>0.08 = 8/100 = 2/25</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Fraction ? Decimal</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Divide numerator by denominator</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>3/5 = 3°5 = 0.6</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Percentage ? Decimal</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Divide by 100 (move decimal 2 left)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>45% = 0.45</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Decimal ? Percentage</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Multiply by 100 (move decimal 2 right)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>0.125 = 12.5%</td></tr>
            </tbody>
          </table>
        </SubSection>
      </Section>

      {/* SECTION 5: ALGEBRA */}
      <Section title="SECTION 5: ALGEBRA">
        <SubSection title="1. Variables, Expressions, and Equations">
          <BulletList items={[
            'Variables: Letters (x, y, a, b) representing unknown numbers.',
            'Constants: Fixed numbers (7, -3, 14.5).',
            'Terms: Single number, variable, or product (5, x, 3y). In 3y, 3 is the coefficient.',
            'Algebraic Expressions: Mathematical phrases without an equals sign (2x + 7).',
            'Algebraic Equations: Mathematical statements with an equals sign (2x + 7 = 15).'
          ]} />
        </SubSection>
        <SubSection title="2. Simplifying Algebraic Expressions">
          <p>Combine like terms (terms with identical variable parts). Use the Commutative Property to rearrange terms before adding or subtracting their coefficients.</p>
        </SubSection>
        <SubSection title="3. Solving Single-Step and Two-Step Equations">
          <p>Isolate the variable using inverse operations. Whatever you do to one side, do to the other. Inverse pairs: Addition → Subtraction; Multiplication → Division.</p>
        </SubSection>
        <SubSection title="4. Ten Detailed Worked Examples with Step-by-Step Calculations">
          <WorkedExample title="Example 1: Evaluating Expressions" problem="Evaluate 4x - 3 when x = 6.">
            <Step>Step 1: Substitute: 4(6) - 3.</Step>
            <Step>Step 2: Multiply: 24 - 3 = 21.</Step>
            <FinalAnswer><strong>21</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 2: Simplifying Expressions" problem="Simplify: 7a + 5b - 2a + 4b + 3.">
            <Step>Step 1: Group like terms: (7a-2a) + (5b+4b) + 3 = 5a + 9b + 3.</Step>
            <FinalAnswer><strong>5a + 9b + 3</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 3: Solving an Addition Equation" problem="Solve for y: y + 14 = 39.">
            <Step>Step 1: Subtract 14 from both sides: y = 39 - 14 = 25.</Step>
            <FinalAnswer><strong>25</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 4: Solving a Subtraction Equation" problem="Solve for m: m - 8.5 = 12.3.">
            <Step>Step 1: Add 8.5 to both sides: m = 12.3 + 8.5 = 20.8.</Step>
            <FinalAnswer><strong>20.8</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 5: Solving a Multiplication Equation" problem="Solve for k: 6k = 72.">
            <Step>Step 1: Divide both sides by 6: k = 72 × 6 = 12.</Step>
            <FinalAnswer><strong>12</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 6: Solving a Division Equation" problem="Solve for x: x/5 = 13.">
            <Step>Step 1: Multiply both sides by 5: x = 13 × 5 = 65.</Step>
            <FinalAnswer><strong>65</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 7: Solving a Two-Step Equation (Type 1)" problem="Solve for p: 3p + 7 = 34.">
            <Step>Step 1: Subtract 7: 3p = 27.</Step>
            <Step>Step 2: Divide by 3: p = 9.</Step>
            <FinalAnswer><strong>9</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 8: Solving a Two-Step Equation (Type 2)" problem="Solve for w: w/4 - 6 = 5.">
            <Step>Step 1: Add 6: w/4 = 11.</Step>
            <Step>Step 2: Multiply by 4: w = 44.</Step>
            <FinalAnswer><strong>44</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 9: Word Problem" problem="Peter has some marbles. After giving 12 away, he has 25 left. How many did he start with?">
            <Step>Step 1: Let m be initial marbles. Equation: m - 12 = 25.</Step>
            <Step>Step 2: Add 12: m = 37.</Step>
            <FinalAnswer><strong>37 marbles</strong></FinalAnswer>
          </WorkedExample>

          <WorkedExample title="Example 10: Advanced Perimeter Word Problem" problem="Perimeter of rectangle is 40 cm, length is 12 cm. Find width w.">
            <Step>Step 1: P = 2(L+W) → 2(12+w) = 40.</Step>
            <Step>Step 2: Divide by 2: 12+w = 20. Subtract 12: w = 8.</Step>
            <FinalAnswer><strong>8 cm</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      {/* SECTIONS 6-10: Measurement, Volume, Geometry, Data Handling, and Final Exam */}
      {/* Due to extreme length, I'll include these as compact blocks while preserving all content and worked examples. */}
      <Section title="SECTION 6: MEASUREMENT × LENGTH, PERIMETER, AND AREA">
        <SubSection title="1. Metric Conversions for Length">
          <BulletList items={[
            '1 cm = 10 mm | 1 m = 100 cm = 1,000 mm | 1 km = 1,000 m',
            'Scaling up (big to small): Multiply. Scaling down (small to big): Divide.'
          ]} />
        </SubSection>
        <SubSection title="2. Perimeter Foundations">
          <BulletList items={[
            'Square: P = 4s | Rectangle: P = 2(L+W) | Equilateral Triangle: P = 3s | Regular Polygon: P = n × s',
            'Composite Shapes: Identify all external side lengths (compute missing sides using parallel edges), then add.'
          ]} />
        </SubSection>
        <SubSection title="3. Area Foundations">
          <BulletList items={[
            'Square: A = s× | Rectangle: A = L × W | Right-Angled Triangle: A = × × b × h',
            'Composite Shapes: Split into simpler rectangles/squares, compute individual areas, then add.'
          ]} />
        </SubSection>
        <SubSection title="4. Ten Detailed Worked Examples">
          <WorkedExample title="Example 1: Multi-Step Length Conversion" problem="Convert 0.45 km to cm.">
            <Step>Step 1: km to m: 0.45 × 1,000 = 450 m.</Step>
            <Step>Step 2: m to cm: 450 × 100 = 45,000 cm.</Step>
            <FinalAnswer><strong>45,000 cm</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 2: Perimeter of a Rectangle" problem="Length = 42.5 m, Width = 18.2 m. Find perimeter.">
            <Step>Step 1: P = 2(42.5+18.2) = 2(60.7) = 121.4 m.</Step>
            <FinalAnswer><strong>121.4 m</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 3: Missing Side of Regular Hexagon" problem="Perimeter = 54.6 cm. Find side length.">
            <Step>Step 1: P = 6s → s = 54.6 × 6 = 9.1 cm.</Step>
            <FinalAnswer><strong>9.1 cm</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 4: Area of a Square" problem="Side = 14 cm. Find area.">
            <Step>Step 1: A = 14 × 14 = 196 cm³.</Step>
            <FinalAnswer><strong>196 cm³</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 5: Missing Dimension from Area" problem="Area = 360 m×, Length = 24 m. Find width.">
            <Step>Step 1: A = L × W → 360 = 24W → W = 360 × 24 = 15 m.</Step>
            <FinalAnswer><strong>15 m</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 6: Area of Right-Angled Triangle" problem="Base = 16 cm, Height = 9 cm. Find area.">
            <Step>Step 1: A = × × 16 × 9 = 8 × 9 = 72 cm³.</Step>
            <FinalAnswer><strong>72 cm³</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 7: Perimeter with Unit Matching" problem="Length = 1.2 m, Width = 85 cm. Find perimeter in cm.">
            <Step>Step 1: Convert length to cm: 1.2 m = 120 cm.</Step>
            <Step>Step 2: P = 2(120+85) = 2(205) = 410 cm.</Step>
            <FinalAnswer><strong>410 cm</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 8: Area of Composite Shape (Split Method)" problem="L-shape: total length 10 m, total width 8 m, cutout length 6 m, cutout width 4 m. Find area.">
            <Step>Step 1: Rectangle A: 10°4=40 m³. Rectangle B: 4°4=16 m³. Total = 56 m³.</Step>
            <FinalAnswer><strong>56 m³</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 9: Cost of Fencing" problem="Square plot side 25 m. Fencing costs 150 shillings/m. Find total cost.">
            <Step>Step 1: P = 4°25 = 100 m. Cost = 100°150 = 15,000 shillings.</Step>
            <FinalAnswer><strong>15,000 shillings</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 10: Tiling a Floor" problem="Room 6 m × 4 m. Tiles 0.5 m × 0.5 m. How many tiles?">
            <Step>Step 1: Floor area = 6°4=24 m³. Tile area = 0.5°0.5=0.25 m³. 24°0.25 = 96 tiles.</Step>
            <FinalAnswer><strong>96 tiles</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      <Section title="SECTION 7: VOLUME AND CAPACITY">
        <SubSection title="1. Defining Volume and Capacity">
          <BulletList items={[
            'Volume: 3D space occupied, measured in cubic units (cm³, m³).',
            'Capacity: Amount of liquid a container holds (L, mL).',
            'Connection: 1 cm³ = 1 mL; 1,000 cm³ = 1 L; 1 m³ = 1,000 L.'
          ]} />
        </SubSection>
        <SubSection title="2. Core Volume Formulas">
          <BulletList items={[
            'Cuboid: V = L × W × H',
            'Cube: V = s³'
          ]} />
        </SubSection>
        <SubSection title="3. Metric Capacity Conversions">
          <BulletList items={[
            '1 L = 1,000 mL. L ? mL: × 1,000 (decimal right). mL ? L: × 1,000 (decimal left).'
          ]} />
        </SubSection>
        <SubSection title="4. Ten Detailed Worked Examples">
          <WorkedExample title="Example 1: Volume of Cuboid" problem="Box: 12 cm × 8 cm × 5 cm. Find volume.">
            <Step>Step 1: V = 12 × 8 × 5 = 96 × 5 = 480 cm³.</Step>
            <FinalAnswer><strong>480 cm³</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 2: Volume of Cube" problem="Side = 7 cm. Find volume.">
            <Step>Step 1: V = 7³ = 343 cm³.</Step>
            <FinalAnswer><strong>343 cm³</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 3: Missing Dimension" problem="Volume = 2,400 cm³, Length = 20 cm, Width = 12 cm. Find height.">
            <Step>Step 1: 2,400 = 20°12°H → 2,400 = 240H → H = 10 cm.</Step>
            <FinalAnswer><strong>10 cm</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 4: Litres to Millilitres" problem="Convert 3.75 L to mL.">
            <Step>Step 1: 3.75 × 1,000 = 3,750 mL.</Step>
            <FinalAnswer><strong>3,750 mL</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 5: Millilitres to Litres" problem="Convert 450 mL to L.">
            <Step>Step 1: 450 × 1,000 = 0.45 L.</Step>
            <FinalAnswer><strong>0.45 L</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 6: Volume to Capacity" problem="Container 10°5°6 cm. How many mL?">
            <Step>Step 1: V = 10°5°6 = 300 cm³ = 300 mL.</Step>
            <FinalAnswer><strong>300 mL</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 7: Adding Mixed Capacity Values" problem="4 L 250 mL + 2 L 850 mL.">
            <Step>Step 1: Litres: 4+2=6 L; mL: 250+850=1,100 mL = 1 L 100 mL. Total: 7 L 100 mL.</Step>
            <FinalAnswer><strong>7 L 100 mL (or 7.1 L)</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 8: Subtracting Capacity with Borrowing" problem="5 L - 1 L 650 mL.">
            <Step>Step 1: Borrow 1 L → 4 L 1,000 mL. Subtract: 4-1=3 L, 1,000-650=350 mL. Result: 3 L 350 mL.</Step>
            <FinalAnswer><strong>3 L 350 mL</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 9: Filling a Tank" problem="Tank 2 m × 1.5 m × 1 m. How many litres?">
            <Step>Step 1: V = 2°1.5°1 = 3 m³. 1 m³ = 1,000 L → 3,000 L.</Step>
            <FinalAnswer><strong>3,000 Litres</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 10: Distributing Liquid" problem="8 L solution into test tubes of 40 mL each. How many tubes?">
            <Step>Step 1: 8 L = 8,000 mL. 8,000 × 40 = 200 tubes.</Step>
            <FinalAnswer><strong>200 test tubes</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      <Section title="SECTION 8: GEOMETRY × ANGLES AND SHAPES">
        <SubSection title="1. Classification of Angles">
          <BulletList items={[
            'Acute: < 90° | Right: = 90° | Obtuse: > 90° and < 180° | Straight: = 180° | Reflex: > 180° and < 360°'
          ]} />
        </SubSection>
        <SubSection title="2. Core Geometric Angle Theorems">
          <BulletList items={[
            'Angles on a Straight Line: sum to 180°.',
            'Angles at a Point: sum to 360°.',
            'Interior Angles of a Triangle: sum to 180°.',
            'Interior Angles of a Quadrilateral: sum to 360°.'
          ]} />
        </SubSection>
        <SubSection title="3. Classification of Triangles and Quadrilaterals">
          <BulletList items={[
            'Equilateral Triangle: 3 equal sides, 3 equal angles (60° each).',
            'Isosceles Triangle: 2 equal sides, 2 equal base angles.',
            'Scalene Triangle: All sides and angles different.',
            'Right-Angled Triangle: One 90 × angle.',
            'Square: 4 equal sides, 4 right angles.',
            'Rectangle: Opposite sides equal, 4 right angles.',
            'Parallelogram: Opposite sides parallel and equal, opposite angles equal.',
            'Rhombus: 4 equal sides, opposite sides parallel, opposite angles equal.'
          ]} />
        </SubSection>
        <SubSection title="4. Ten Detailed Worked Examples">
          <WorkedExample title="Example 1: Identifying Angle Types" problem="Classify 45°, 90°, 135°, 180°, 240°.">
            <FinalAnswer>45°: Acute; 90°: Right; 135°: Obtuse; 180°: Straight; 240°: Reflex.</FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 2: Missing Angle on a Straight Line" problem="One angle is 63°. Find the missing angle x.">
            <Step>Step 1: x + 63° = 180° → x = 117°.</Step>
            <FinalAnswer><strong>117°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 3: Three Angles on a Line" problem="Angles: 42°, y, 75°. Find y.">
            <Step>Step 1: 42 + y + 75 = 180 → y + 117 = 180 → y = 63°.</Step>
            <FinalAnswer><strong>63°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 4: Angles at a Point" problem="Four angles: k, 110°, 85°, 95°. Find k.">
            <Step>Step 1: k + 290 = 360 → k = 70°.</Step>
            <FinalAnswer><strong>70°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 5: Missing Angle in a Triangle" problem="Two angles: 58° and 72°. Find third angle a.">
            <Step>Step 1: a + 130 = 180 → a = 50°.</Step>
            <FinalAnswer><strong>50°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 6: Right-Angled Triangle" problem="One acute angle = 34°. Find the other acute angle b.">
            <Step>Step 1: b + 90 + 34 = 180 → b = 56°.</Step>
            <FinalAnswer><strong>56°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 7: Isosceles Triangle" problem="Top angle = 40°. Find base angles x.">
            <Step>Step 1: 40 + 2x = 180 → 2x = 140 → x = 70°.</Step>
            <FinalAnswer><strong>70° each</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 8: Quadrilateral" problem="Three angles: 105°, 80°, 95°. Find fourth angle d.">
            <Step>Step 1: d + 280 = 360 → d = 80°.</Step>
            <FinalAnswer><strong>80°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 9: Straight Line with Algebra" problem="Angles: 3x and 60°. Find x.">
            <Step>Step 1: 3x + 60 = 180 → 3x = 120 → x = 40°.</Step>
            <FinalAnswer><strong>40°</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 10: Parallelogram Angles" problem="One angle = 115°. Find the other three angles.">
            <Step>Step 1: Opposite angle = 115°. Remaining two angles sum to 130° → each = 65°.</Step>
            <FinalAnswer><strong>115°, 65°, 65°</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      <Section title="SECTION 9: DATA HANDLING AND PROBABILITY">
        <SubSection title="1. Data Collection and Representation">
          <BulletList items={[
            'Tally Charts: Group counts in bundles of five.',
            'Bar Graphs: Rectangular columns comparing categories.',
            'Pictographs: Symbols with a key (e.g., 1 ?? = 5 students).'
          ]} />
        </SubSection>
        <SubSection title="2. Statistical Metrics: Mean and Mode">
          <BulletList items={[
            'Mean = Sum of all values × Total count of values.',
            'Mode = Value that appears most frequently.'
          ]} />
        </SubSection>
        <SubSection title="3. Foundations of Probability">
          <p>Probability measures chance on a scale from 0 (impossible) to 1 (certain). Formula: P = Favorable Outcomes / Total Possible Outcomes.</p>
        </SubSection>
        <SubSection title="4. Ten Detailed Worked Examples">
          <WorkedExample title="Example 1: Reading a Pictograph" problem="Key: 1 ?? = 4 books. Grade 5 row has 6 symbols. Total books?">
            <FinalAnswer><strong>24 books</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 2: Calculating the Mean" problem="Milk yields: 12, 15, 11, 14, 13 L. Find mean.">
            <Step>Step 1: Sum = 65 L, 5 days → Mean = 65°5 = 13 L/day.</Step>
            <FinalAnswer><strong>13 Litres per day</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 3: Finding the Mode" problem="Shoe sizes: 6,7,5,6,8,6,7,9,6,5. Find mode.">
            <Step>Step 1: Size 6 appears 4 times × most frequent. Mode = 6.</Step>
            <FinalAnswer><strong>Size 6</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 4: Mean with Decimals" problem="Heights: 1.4, 1.5, 1.3, 1.6 m. Find mean.">
            <Step>Step 1: Sum = 5.8 m, 4 students → Mean = 5.8°4 = 1.45 m.</Step>
            <FinalAnswer><strong>1.45 m</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 5: Missing Value Using Mean" problem="Mean of 4 tests is 8. Scores: 7,9,8,s. Find s.">
            <Step>Step 1: Sum must be 32. 7+9+8+s = 32 → s = 8.</Step>
            <FinalAnswer><strong>8</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 6: Probability of a Single Event" problem="Die rolled once. Probability of even number?">
            <Step>Step 1: Even outcomes: 2,4,6 (3). Total: 6. P = 3/6 = 1/2.</Step>
            <FinalAnswer><strong>1/2 (0.5 or 50%)</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 7: Marbles Probability" problem="Bag: 5 red, 3 blue, 2 green. P(blue)?">
            <Step>Step 1: Total = 10. P(blue) = 3/10.</Step>
            <FinalAnswer><strong>3/10 (0.3)</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 8: Impossible Event" problem="Same bag: P(yellow)?">
            <FinalAnswer><strong>0 (impossible × no yellow marbles)</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 9: Interpreting a Bar Graph" problem="Soccer bar = 15, Basketball bar = 9. How many more prefer soccer?">
            <FinalAnswer><strong>6 students</strong></FinalAnswer>
          </WorkedExample>
          <WorkedExample title="Example 10: Probability with Spinner" problem="8 sections: 4 Red, 2 Blue, 1 Green, 1 Yellow. P(Blue or Green)?">
            <Step>Step 1: Favorable = 2+1=3, Total=8 → P = 3/8.</Step>
            <FinalAnswer><strong>3/8</strong></FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>

      {/* FINAL PRACTICE EXAM */}
      <Section title="GRADE 5 MATHEMATICS COMPREHENSIVE FINAL PRACTICE EXAM">
        <p><strong>Time Allowed: 2 Hours</strong></p>
        
        <SubSection title="Part A: Numbers, Place Value, and Whole Number Operations">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 1:</strong> Write down the place value and actual total value of the digit 6 in the number 8,614,295.</p>
            <p><strong>Question 2:</strong> Find the exact difference between 912,403 and 456,785 using vertical column subtraction.</p>
            <p><strong>Question 3:</strong> A school purchased 45 modern tablets at 12,350 shillings each. Calculate the total amount of money spent.</p>
            <p><strong>Question 4:</strong> Divide 8,542 by 14 using long division. State quotient and remainder.</p>
          </div>
        </SubSection>

        <SubSection title="Part B: Factors, Multiples, Fractions, and Decimals">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 5:</strong> Using prime factorization, determine the HCF and LCM of 30 and 45.</p>
            <p><strong>Question 6:</strong> Calculate the sum: 3 3/5 + 2 1/2. Express as a mixed number in simplest form.</p>
            <p><strong>Question 7:</strong> Solve using KCF rule: 7/10 × 14/15. Simplify to lowest terms.</p>
            <p><strong>Question 8:</strong> Multiply 6.24 by 3.5. Show intermediate multiplication lines and place the decimal point correctly.</p>
          </div>
        </SubSection>

        <SubSection title="Part C: Algebra, Measurement, and Geometry">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 9:</strong> Solve for x: 4x - 9 = 27.</p>
            <p><strong>Question 10:</strong> An L-shaped garden plot has outer dimensions as shown. Calculate the total perimeter and total internal area. (Diagram provided in original).</p>
            <p><strong>Question 11:</strong> A rectangular water container is 50 cm long, 30 cm wide, and 20 cm high. (a) Calculate its volume in cm³. (b) How many full Litres of water can it hold?</p>
            <p><strong>Question 12:</strong> Three angles lie on a straight line. Two known angles measure 52° and 79°. Find the missing angle a.</p>
          </div>
        </SubSection>

        <SubSection title="Part D: Data Handling and Probability">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 13:</strong> A student scored the following marks across six weekly homework tasks: 8, 7, 10, 6, 9, and 8. (a) Calculate the Mean score. (b) State the Mode score.</p>
            <p><strong>Question 14:</strong> A box contains 6 yellow pencils, 4 green pencils, and 2 purple pencils. If one pencil is selected at random: (a) What is the probability of pulling out a green pencil? (b) What is the probability of pulling out a blue pencil?</p>
          </div>
        </SubSection>

        <SubSection title="?? Complete Step-by-Step Marking Scheme & Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> Place Value: Hundred Thousands. Total Value: 600,000.</p>
            <p><strong>Answer 2:</strong> 912,403 - 456,785 = 455,618.</p>
            <p><strong>Answer 3:</strong> 12,350 × 45 = 555,750 shillings.</p>
            <p><strong>Answer 4:</strong> 8,542 × 14 = 610 remainder 2.</p>
            <p><strong>Answer 5:</strong> HCF = 15; LCM = 90.</p>
            <p><strong>Answer 6:</strong> Convert: 18/5 + 5/2 = 36/10 + 25/10 = 61/10 = 6 1/10.</p>
            <p><strong>Answer 7:</strong> 7/10 × 15/14 = 3/4.</p>
            <p><strong>Answer 8:</strong> 6.24 × 3.5 = 21.84.</p>
            <p><strong>Answer 9:</strong> x = 9.</p>
            <p><strong>Answer 10:</strong> Perimeter = 36 m; Area = 64 m³.</p>
            <p><strong>Answer 11:</strong> (a) Volume = 30,000 cm³. (b) Capacity = 30 Litres.</p>
            <p><strong>Answer 12:</strong> a = 49°.</p>
            <p><strong>Answer 13:</strong> (a) Mean = 48 × 6 = 8. (b) Mode = 8.</p>
            <p><strong>Answer 14:</strong> (a) P(green) = 4/12 = 1/4. (b) P(blue) = 0 (impossible).</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}

// ---------- HELPER COMPONENTS ----------
function Section({ title, children }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', borderLeft: '4px solid var(--border)', paddingLeft: '12px', marginBottom: '12px' }}>{title}</h3>
      {children}
    </div>
  );
}
function SubSection({ title, children }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{title}</h4>
      {children}
    </div>
  );
}
function WorkedExample({ title, problem, children }) {
  return (
    <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
      <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>{title}</h4>
      <p><strong>Problem:</strong> {problem}</p>
      {children}
    </div>
  );
}
function Step({ children }) {
  return (
    <p style={{ marginBottom: '4px', paddingLeft: '8px' }}>{children}</p>
  );
}
function FinalAnswer({ children }) {
  return (
    <p style={{ fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>Final Answer: {children}</p>
  );
}
function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text)' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '6px', fontSize: '.9rem' }}>{item}</li>
      ))}
    </ul>
  );
}
// ---------- ENGLISH LANGUAGE ARTS NOTES ----------
function EnglishNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? English Language: Complete Mastery Guide</h2>
      <p>Curriculum Notes, Narrative Exemplars, and Comprehensive Assessments</p>

      <Section title="Section 1: Grammar and Structural Foundations">
        <SubSection title="1.1 The Architecture of Nouns">
          <p>A noun is a part of speech that names a person, place, thing, or abstract idea. In the Grade 5 curriculum, nouns are divided into specific categories based on their grammatical function and properties. Understanding these distinctions is critical for correct capitalization, subject-verb agreement, and precise descriptive writing.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                        +---------------------------+
                        ×        NOUN TYPES         ×
                        +---------------------------+
          +-------------------------------------------------------+
   +-------------+ +-------------+         +-------------+ +-------------+
   ×   Proper    × ×   Common    ×         × Collective  × ×  Abstract   ×
   +-------------+ +-------------+         +-------------+ +-------------+`}</pre>
          <SubSection title="Proper Nouns">
            <p>Proper nouns name specific unique entities. These include individual human names, geographical locations, institutions, days of the week, months of the year, and historical events. A foundational rule of syntax dictates that every proper noun must begin with a capital letter, regardless of its position within a sentence structure. Structural Rule: Proper Noun → Capital Initialization. Examples: Nairobi, Margaret, Monday, December, Mount Kenya, United Nations.</p>
          </SubSection>
          <SubSection title="Common Nouns">
            <p>Common nouns name general, non-specific items, people, places, or animals. They do not receive capital letters unless they appear as the initial word of a sentence. Examples: city, woman, day, month, mountain, organization, dog, desk, river, teacher.</p>
          </SubSection>
          <SubSection title="Collective Nouns">
            <p>Collective nouns name groups of individuals, animals, or objects considered as a single unit. They allow a writer to refer to an entire collection using a singular noun form, which influences subject-verb agreement.</p>
            <BulletList items={[
              'A herd of cattle / elephants / deer.',
              'A school of fish / dolphins.',
              'A pride of lions.',
              'A flight of birds / stairs.',
              'A crew of sailors / technicians.',
              'A swarm of bees / locusts.',
              'A pack of wolves / cards / lies.',
              'A bunch of bananas / keys / grapes.'
            ]} />
          </SubSection>
          <SubSection title="Abstract Nouns">
            <p>Abstract nouns name non-physical concepts, qualities, emotions, states of being, or ideas that cannot be perceived through the five physical senses. They are frequently formed by adding suffixes to adjectives or verbs. Examples: honesty, bravery, peace, victory, anger, childhood, intelligence, sorrow, justice, freedom.</p>
          </SubSection>
        </SubSection>

        <SubSection title="1.2 The System of Pronouns">
          <p>A pronoun functions as a substitute for a noun or noun phrase to prevent awkward repetition within a paragraph. The noun that the pronoun replaces is called its antecedent.</p>
          <SubSection title="Personal Pronouns">
            <p>Personal pronouns change their form based on grammatical case (subject vs. object), person (first, second, or third person), and number (singular or plural).</p>
            <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
              <tbody>
                <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Person</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Singular Subject</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Singular Object</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Plural Subject</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Plural Object</th></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>1st Person</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>I</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>me</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>we</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>us</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>2nd Person</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>you</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>you</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>you</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>you</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>3rd Person</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>he/she/it</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>him/her/it</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>they</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>them</td></tr>
              </tbody>
            </table>
          </SubSection>
          <SubSection title="Possessive Pronouns">
            <p>Possessive pronouns indicate ownership. Unlike possessive adjectives (e.g., my, your, her), possessive pronouns stand completely alone and do not precede a noun. Possessive pronouns never take an apostrophe. Form Checklist: mine, yours, his, hers, its, ours, theirs. Correct Example: The composition on the table is yours; the one by the window is mine.</p>
          </SubSection>
          <SubSection title="Reflexive Pronouns">
            <p>Reflexive pronouns are employed when the subject performing the action is identical to the object receiving the action. They are formed by appending the suffix -self (singular) or -selves (plural). Form Checklist: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. Sentence Formula: The boy hurt himself.</p>
          </SubSection>
        </SubSection>

        <SubSection title="1.3 Verbs and Tenses: The Timeline of Action">
          <p>Verbs are words that express action, occurrence, or a state of being. Tense indicates the time when an action takes place relative to the moment of speaking or writing.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                            THE FIVE CORE TENSES
 <-----------------------------------+----------------------------------->
   Past Continuous   Simple Past   Simple Present   Pres. Continuous   Simple Future`}</pre>
          <BulletList items={[
            'Simple Present Tense: Used for habitual actions, routines, permanent truths. Singular subject (he, she, it) ? Verb + -s/es. Plural subject (I, you, we, they) ? Base Verb Form. Examples: The earth revolves around the sun. They walk to school every morning.',
            'Present Continuous Tense: Used for actions occurring at the current moment. Formula: Subject + [am/is/are] + (Verb + -ing). Examples: I am writing an extended text right now. The teacher is explaining the rule.',
            'Simple Past Tense: Used for actions completed at a definite past time. Regular Verbs: add -ed. Irregular Verbs: change internal vowels or spelling entirely. Examples: go ? went, buy ? bought, write ? wrote, break ? broke, fly ? flew.',
            'Past Continuous Tense: Describes an ongoing past action interrupted by a shorter past event. Formula: Subject + [was/were] + (Verb + -ing). Example: We were playing football when the heavy storm began.',
            'Simple Future Tense: Indicates actions that will occur after the present moment. Formula: Subject + [will] + Base Verb. Example: Our class will visit the museum next term.'
          ]} />
        </SubSection>

        <SubSection title="1.4 Adjectives and the Order of Modifiers">
          <p>Adjectives are words that modify nouns or pronouns by providing details about their size, age, color, origin, material, or quality. When multiple adjectives modify a single noun, they must follow a strict semantic hierarchy.</p>
          <p><strong>The Grade 5 Modifier Hierarchy Formula:</strong> Number → Opinion → Size → Age → Shape → Color → Origin → Material → Noun</p>
          <p>Analysis Example: "Two (Number) beautiful (Opinion) large (Size) old (Age) round (Shape) blue (Color) Kenyan (Origin) clay (Material) pots."</p>
          <SubSection title="Degrees of Comparison">
            <BulletList items={[
              'Positive: Describes one entity. (heavy, clever, beautiful)',
              'Comparative: Compares two entities. Uses suffix -er or modifier more, followed by than. (heavier than, more beautiful than)',
              'Superlative: Compares three or more entities. Uses suffix -est or modifier most, preceded by the. (the heaviest, the most beautiful)'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.5 Adverbs: Modifying Actions">
          <p>Adverbs add detail to verbs, adjectives, or other adverbs, answering questions such as how, when, where, or how often.</p>
          <BulletList items={[
            'Adverbs of Manner: Indicate how an action is performed. Usually formed by adding -ly to an adjective. (The driver steered carefully.)',
            'Adverbs of Time: Specify when an event occurs. (We will complete the exam tomorrow.)',
            'Adverbs of Place: Indicate the location of an occurrence. (The boys ran outside.)',
            'Adverbs of Frequency: Describe how often an action takes place. (She always finishes her assignments on time.)'
          ]} />
        </SubSection>

        <SubSection title="1.6 Syntax, Structure, and Conjunctions">
          <p>A standard clause contains a Subject (S), a Verb (V), and an Object (O).</p>
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Subject (S)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Verb (V)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Object (O)</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The energetic student</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>read</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>the entire chapter.</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wild animals</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>avoid</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>bright fires.</td></tr>
            </tbody>
          </table>
          <SubSection title="Conjunctions">
            <BulletList items={[
              'Coordinate Conjunctions (and, but, or): Link elements of equal grammatical rank. (He was tired but determined.)',
              'Subordinate Conjunctions (because, although, if, while): Join a dependent clause to an independent clause. Example: Although the journey was long, the children did not complain.'
            ]} />
          </SubSection>
          <SubSection title="Question Tags">
            <p>Question tags are short questions appended to the end of a statement to seek confirmation. Positive Statement → Negative Question Tag. Negative Statement → Positive Question Tag. Example 1: You have finished your work, haven't you? Example 2: She does not like sweet tea, does she?</p>
          </SubSection>
        </SubSection>

        <SubSection title="1.7 Punctuation Mechanics">
          <BulletList items={[
            'Capitalization: Mandatory for sentence-initial words, the personal pronoun I, and all proper nouns.',
            'Comma (,): Used to mark pauses, separate clauses, and isolate items in a list. (He purchased paper, pens, and ink.)',
            "Apostrophe (’): Used to show ownership (The teacher’s desk) or contraction (Do not → don’t)."
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 2: Narrative and Reading Comprehension Exemplars">
        <SubSection title="Story 1: The Echo of the Great Rift">
          <SubSection title="Part I: The Discovery">
            <p>The morning sun rose over the jagged edges of the western escarpment, casting long, golden fingers across the valley floor. Kaelen wrapped his woollen blanket tighter around his shoulders to block out the high-altitude chill. At twelve years old, his primary responsibility was to lead his grandfather's prized herd of goats across the rocky ridges of the valley. It was a routine he had performed hundreds of times, yet today felt different. The air was unusually still, and the typical morning chatter of the weaver birds was absent.</p>
            <p>As he reached the high plateau near the dry riverbed, Kaelen noticed that the lead goat, an adventurous animal named Samson, had stopped dead in its tracks. Samson's ears were pinned back, and its gaze was fixed on a narrow opening in the volcanic rock face that had been hidden by dense bush for months. Curious, Kaelen moved closer, his leather sandals tapping softly on the hard stone. He cleared away the tangled branches, revealing a deep fissure that stretched down into the dark earth.</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       KAELEN'S ROUTINE PATHWAY
 [ Homestead ] ---> [ Valley Floor ] ---> [ High Plateau ] ---> [ Hidden Fissure ]`}</pre>
            <p>From deep inside the opening, a faint humming sound vibrated through the air. It didn't sound like wind or water; it was a rhythmic, mechanical pulse. Kaelen reached into his canvas bag, pulled out a small metallic torch his uncle had brought him from the city, and turned it on. The beam of light sliced through the darkness, reflecting off smooth, geometric patterns carved directly into the ancient stone walls. These were not natural formations. They looked like ancient, stylized symbols × letters from an alphabet that had been forgotten by modern civilization.</p>
            <p>Heart pounding, Kaelen leaned inward. The air coming from the cave smelled of dry dust and ozone. He took a deep breath, placed his palm flat against the cool rock face, and whispered a question into the void: "Is anyone down there?" The cave did not answer immediately. Instead, the rhythmic humming stopped. For three seconds, there was absolute silence. Then, a voice × clear, melodic, and completely mechanical × echoed back up through the stone opening: "System active. Identification required."</p>
          </SubSection>
          <SubSection title="Part II: The Cryptic Conversation">
            <p>Kaelen stumbled backward, tripping over a loose root and landing on the dusty ground. The torch dropped from his hand, its beam pointing toward the sky. Samson bleated in terror and bolted back toward the rest of the herd. Kaelen's breathing was shallow as he stared at the dark opening. He knew he should run, but his curiosity was stronger than his fear.</p>
            <p>He scrambled back to his feet, grabbed the torch, and approached the opening again, keeping his distance. "Who are you?" he called out, his voice shaking. The response was immediate: "I am the Archival Sentinel of the Third Age. My systems have been dormant for twelve thousand cycles. Your vocal patterns do not match any recorded user in my database. State your designation."</p>
            <p>Kaelen swallowed hard. "My name is Kaelen. I'm a herder. My family lives three kilometres down the valley. What is this place?" The mechanical voice replied: "This installation is a deep-crust knowledge vault, built to preserve the scientific history of your ancestors. I hold records of advanced geometry, astronomy, and agricultural formulas. However, my main data core is locked. To access the archive, you must prove your lineage by answering three diagnostic logic questions."</p>
            <p>The Sentinel continued: "Listen carefully to the first problem: The vault's inventory contains 120 metric storage crates. Two-fifths of these crates contain food provisions, and one-third contain hydration fluid cells. The remaining crates contain empty equipment modules. Calculate the exact number of empty modules."</p>
          </SubSection>
          <SubSection title="Part III: The Sentinel's Test">
            <p>Kaelen sat down on a flat boulder and closed his eyes to focus. He visualized the problem step by step, using the methods his teacher had demonstrated on the chalkboard.</p>
            <p>First, calculate food crates: 120 × 2/5. 120 × 5 = 24, then 24 × 2 = 48 crates.</p>
            <p>Next, calculate hydration crates: 120 × 1/3 = 40 crates.</p>
            <p>Total allocated crates: 48 + 40 = 88 crates.</p>
            <p>Remaining empty modules: 120 - 88 = 32 crates.</p>
            <p>Kaelen called out clearly: "The number of empty modules is thirty-two." A chime echoed from the cave. "Diagnostic verification successful. Data vault pathway partially unsealed. You possess the analytical mindset of the builders, herder. Prepare for the second assessment."</p>
          </SubSection>
          <SubSection title="Reading Comprehension Assessment: Story 1">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. What specific type of noun is "Samson" in the text, and what item does it refer to?</strong> Answer: "Samson" is a proper noun because it names a specific individual entity. It refers to the lead goat of Kaelen's herd.</p>
              <p><strong>2. How long had the Archival Sentinel been dormant?</strong> Answer: Twelve thousand cycles.</p>
              <p><strong>3. Why was Kaelen's torch able to reflect geometric patterns inside the fissure?</strong> Answer: The walls were artificially carved with symbols, indicating the cave was an ancient facility built by humans.</p>
              <p><strong>4. How did Kaelen feel when the voice first answered him? Quote a short sentence.</strong> Answer: Terrified and startled. "Kaelen stumbled backward, tripping over a loose root and landing on the dusty ground."</p>
              <p><strong>5. Find two abstract nouns used in Part II describing Kaelen's internal state.</strong> Answer: curiosity and fear.</p>
              <p><strong>6. Rewrite "System active. Identification required." into a polite interrogative sentence using modal verbs.</strong> Answer: "The system is now active; could you please provide your identification?"</p>
            </div>
          </SubSection>
        </SubSection>

        <SubSection title="Story 2: The Invention of Maisha-1">
          <SubSection title="Part I: The Workshop Below the Hill">
            <p>High in the green hills of Limuru, where the mist hung low over the tea bushes until noon, Dr. Asha Onditi maintained a workshop filled with gears and electronic components. Unlike commercial developers who built luxury items, Dr. Onditi focused on creating tools for small-scale farmers. Her latest project was Maisha-1: an automated, solar-powered water distributor designed to help farmers during dry seasons.</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                  MAISHA-1 COMPONENT ARCHITECTURE
   +--------------------------------------------------------+
   × Solar Harvesting Unit (Photovoltaic Canopy)             ×
   +--------------------------------------------------------+
                               ?
   +--------------------------------------------------------+
   × Central Microprocessing Brain (Logic Board)            ×
   +--------------------------------------------------------+
                               ?
   +--------------------------------------------------------+
   × Hydraulic Distribution Array (Pumps & Valves)          ×
   +--------------------------------------------------------+`}</pre>
            <p>The device looked like a metallic cylinder with a wide solar panel canopy. Inside its steel frame sat a network of processors, valves, and fluid tubes. Maisha-1 worked by monitoring soil moisture and distributing water directly to plant roots, ensuring no water was wasted through evaporation.</p>
            <p>For weeks, Dr. Onditi struggled with the irrigation calculation program. The machine's memory chip kept overheating because the logic loops were too complex. One evening, her ten-year-old nephew, Tariq, sat at the workbench assembling a wooden puzzle. "Aunt Asha," Tariq asked, "If the machine is giving too much water at once, can you add a rule that reduces the flow based on how long it has been running?" Dr. Onditi stopped typing. "Tariq, you've just described a linear balancing variable."</p>
          </SubSection>
          <SubSection title="Part II: Testing the Code">
            <p>She cleared her screen and created an equation based on Tariq's idea. Let W represent the total volume of water distributed in litres per minute. Let t represent the total operating runtime in minutes. The baseline water flow rate was set at 45 litres per minute, but it needed to decrease by 3 litres for every minute of operation: W = 45 - 3t.</p>
            <p>Tariq leaned over the table and set up the problem: If t = 8, then W = 45 - 3(8) = 45 - 24 = 21 litres per minute × safely above zero, so the engine won't stall. Dr. Onditi uploaded the updated code and a green LED light illuminated the workshop, signaling that the logic error had been resolved.</p>
          </SubSection>
          <SubSection title="Part III: The Field Trial">
            <p>The next morning, they carried Maisha-1 down to Mzee Mwangi's vegetable plot. They set the machine down, extended its solar canopy toward the sun, and connected its main intake pipe to a nearby rainwater storage tank. Maisha-1 hummed to life, its sensors evaluated the soil conditions, and water began to flow precisely at the base of each cabbage plant. Mzee Mwangi knelt down, touched the moist soil, and smiled. "This machine doesn't flood the field like old irrigation pumps. It gives the plants exactly what they need."</p>
          </SubSection>
          <SubSection title="Reading Comprehension Assessment: Story 2">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. Where is Dr. Onditi's workshop located, and what is her primary focus?</strong> Answer: In the hills of Limuru. Her primary focus is creating tools for small-scale farmers.</p>
              <p><strong>2. Write down the algebraic equation used to program Maisha-1.</strong> Answer: W = 45 - 3t. W = water volume (L/min), t = runtime (minutes).</p>
              <p><strong>3. Why did Tariq's puzzle prompt help Dr. Onditi?</strong> Answer: It demonstrated how to adjust a system dynamically using a simple, predictable rule.</p>
              <p><strong>4. Why was Mzee Mwangi skeptical at first, and what changed his mind?</strong> Answer: He was a traditional farmer wary of new technology. He changed his mind when he saw Maisha-1 distributed water precisely without flooding or wasting water.</p>
              <p><strong>5. Identify all the adjectives in: "They carried a small metallic cylinder down to the dry field."</strong> Answer: small (Size), metallic (Material), dry (Opinion/Quality).</p>
              <p><strong>6. Punctuate: Asha turned to Tariq and asked did you enjoy helping me fix the machine today.</strong> Answer: Asha turned to Tariq and asked, "Did you enjoy helping me fix the machine today?"</p>
            </div>
          </SubSection>
        </SubSection>
      </Section>

      <Section title="Section 3: Extended Vocabulary, Idioms, and Contextual Usage">
        <SubSection title="3.1 Lexical Enhancement List">
          <BulletList items={[
            'Adversity (Noun): A state of serious difficulty or misfortune. Synonyms: Hardship, misfortune. Antonyms: Prosperity, good fortune. Context: Overcoming adversity during the drought made the farming community stronger.',
            'Benevolent (Adjective): Well-meaning, kindly, marked by a desire to do good. Synonyms: Kind, charitable. Antonyms: Malevolent, cruel. Context: The benevolent elder donated land to build a community library.',
            'Curtail (Verb): To reduce in extent or quantity. Synonyms: Reduce, limit. Antonyms: Extend, expand. Context: The headmistress had to curtail outdoor sports because of heavy rainfall.',
            'Diligent (Adjective): Showing care, dedication, and hard work. Synonyms: Hardworking, industrious. Antonyms: Lazy, negligent. Context: Through diligent study, the student earned top marks.',
            'Elated (Adjective): Ecstatically happy or proud. Synonyms: Overjoyed, thrilled. Antonyms: Depressed, miserable. Context: The players were elated when the referee confirmed their victory.',
            'Frugal (Adjective): Economical regarding money or resources. Synonyms: Thrifty, economical. Antonyms: Extravagant, wasteful. Context: By maintaining a frugal budget, the family saved enough for a solar kit.',
            'Glisten (Verb): To shine with sparkling light. Synonyms: Sparkle, gleam. Antonyms: Dull, darken. Context: The morning dew caused the maize leaves to glisten.',
            'Hypothesize (Verb): To propose an explanation based on limited evidence. Synonyms: Theorize, speculate. Antonyms: Prove, verify. Context: The students hypothesize that red light filters will produce broader leaves.',
            'Illustrious (Adjective): Well-known and admired for achievements. Synonyms: Famous, distinguished. Antonyms: Unknown, obscure. Context: The university invited an illustrious scientist.',
            'Judicious (Adjective): Having good judgment or wisdom. Synonyms: Wise, prudent. Antonyms: Foolish, reckless. Context: A judicious use of irrigation water saved the harvest.'
          ]} />
        </SubSection>

        <SubSection title="3.2 Homophones in Academic Discourse">
          <BulletList items={[
            'Their (possessive ownership) / There (spatial orientation) / They\'re (contraction of they are).',
            'To (direction) / Too (excessive or inclusion) / Two (numerical value 2).',
            'Principal (head of school or primary matter) / Principle (fundamental truth or law).',
            'Stationery (writing materials) / Stationary (fixed in place, not moving).'
          ]} />
        </SubSection>

        <SubSection title="3.3 Figurative Expression, Similes, and Idioms">
          <BulletList items={[
            '"As busy as a bee": Working industriously and continuously on a task.',
            '"As clear as crystal": Easy to see through physically, or completely simple to understand.',
            '"Once in a blue moon": An event that occurs very rarely.',
            '"A piece of cake": A task that is incredibly easy to complete.',
            '"To burn the midnight oil": To study or work late into the night.',
            '"To hit the nail on the head": To state an exact truth or find the precise solution to a problem.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 4: Composition Theory and Structural Design">
        <SubSection title="4.1 Narrative Composition Architecture">
          <p>A narrative composition tells a story. To write a compelling narrative, Grade 5 students should organize their thoughts into a clear five-paragraph structure.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`               THE NARRATIVE COMPOSITION FLOWCHART
   +--------------------------------------------------------+
   × Paragraph 1: Introduction (Setting, Time, Characters)  ×
   +--------------------------------------------------------+
                               ?
   +--------------------------------------------------------+
   × Paragraph 2: Inciting Incident (The Conflict Begins)   ×
   +--------------------------------------------------------+
                               ?
   +--------------------------------------------------------+
   × Paragraph 3: Climax (The Most Intense/Exciting Moment)  ×
   +--------------------------------------------------------+
                               ?
   +--------------------------------------------------------+
   × Paragraph 4: Resolution (How the Problem Is Resolved)  ×
   +--------------------------------------------------------+
                               ?
   +--------------------------------------------------------+
   × Paragraph 5: Conclusion (The Lesson Learned/Final Mood)×
   +--------------------------------------------------------+`}</pre>
        </SubSection>

        <SubSection title="4.2 Detailed Structural Breakdown of Composition Paragraphs">
          <p>To master narrative composition architecture, you must understand the exact mechanical function of each paragraph. A story should never be written as one massive block of text. It must be separated into distinct paragraphs, each executing a specific role in the narrative journey.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       THE NARRATIVE TEXTURE MATRIX
+-----------------------------------------+
× SENSORY DETAILS                         ×
× (Sight, Sound, Smell, Taste, Touch)     ×
+-----------------------------------------+
                     ?
+-----------------------------------------+
× FIGURATIVE LANGUAGE                     ×
× (Similes, Metaphors, Idioms)            ×
+-----------------------------------------+
                     ?
+-----------------------------------------+
× DYNAMIC DIALOGUE                        ×
× (Punctuation, Tags, Actions)            ×
+-----------------------------------------+`}</pre>
          <BulletList items={[
            'Paragraph 1 (Introduction): Establish the Four Ws × Who (characters), When (time/day/season), Where (location), What (baseline activity). Begin with atmospheric description or vivid sensory observation.',
            'Paragraph 2 (Rising Action / Inciting Incident): Something unexpected disrupts the normal routine × a sudden storm, a strange noise, a lost object. Use transition words like Without warning, Suddenly, Out of the blue.',
            'Paragraph 3 (Climax): The highest point of tension or danger. Use short, punchy sentences for urgency. Pack with sensory details × what characters see, hear, and feel internally (racing heartbeat, cold sweat).',
            'Paragraph 4 (Resolution): Explains how the danger was avoided or the problem was fixed. Use words showing relief: Fortunately, With immense relief, At long last.',
            'Paragraph 5 (Conclusion): Tie up loose ends, state the emotional state of the characters, highlight the moral lesson. Use reflective frameworks: I realized that..., From that day forward..., Never again would I....'
          ]} />
        </SubSection>

        <SubSection title="4.3 Direct Speech Mechanics and Dialogue Formatting Rules">
          <BulletList items={[
            'The Enclosure Rule: All spoken words must be enclosed inside quotation marks (" ").',
            'The Capitalization Rule: The first word inside the speech marks must always begin with a capital letter.',
            'The Separation Rule: A comma must separate spoken words from the dialogue tag (said John, whispered Mary), unless the speech ends with ? or !.',
            'The Paragraphing Rule: Start a completely new paragraph every single time a different character speaks.'
          ]} />
          <p>Correct Examples: The teacher said, "Open your English notebooks immediately." / "We must find shelter before the storm hits," whispered Peter anxiously. / "Did you remember to lock the front gate?" mother asked.</p>
        </SubSection>
      </Section>

      <Section title="Section 5: Exhaustive Anthology of Exemplary Narrative Stories">
        <p>This section provides full-length narrative models that show how to apply grammar, vocabulary, and paragraph architecture to real writing. Each story is followed by a complete reading comprehension assessment with multiple-choice, structural, and vocabulary questions, complete with a detailed marking scheme.</p>

        <SubSection title="Story 1: The Perilous Journey to Mount Longonot">
          <p><strong>Paragraph 1: Introduction</strong></p>
          <p>The golden morning sun peeked over the horizon, casting long, dramatic shadows across the dusty terrain of the Great Rift Valley. It was a crisp, clear Saturday in August, a day that my class had eagerly anticipated for months. Thirty energetic Grade 5 pupils stood beside the school bus, our faces bright with excitement. We were embarking on an educational expedition to the base of Mount Longonot, a majestic, dormant volcano that stood like a silent giant in the distance. Armed with heavy canvas backpacks, sturdy leather hiking shoes, and bottles of ice-cold water, we felt completely prepared for an adventure. Our class teacher, Mr. Mwangi, stood by the door, counting us one by one to ensure no one was left behind.</p>
          <p><strong>Paragraph 2: Inciting Incident</strong></p>
          <p>Our hike began smoothly along a narrow, winding dirt path bordered by dry whistling thorn bushes. For the first hour, we laughed, sang school cheers, and pointed at the unique rock formations along the trail. However, as the incline grew steeper, the trail became increasingly treacherous. Loose volcanic gravel slid beneath our boots, creating thick clouds of grey dust. Without warning, the clear blue sky darkened as heavy, charcoal-coloured clouds rolled over the mountain peak. The wind began to howl through the valley, whipping dry dust into our eyes and mouths. Mr. Mwangi stopped and looked up at the sky, his face wrinkling with concern. "Stay close together, pupils!" he shouted over the rising wind. "The weather is turning against us!"</p>
          <p><strong>Paragraph 3: The Climax</strong></p>
          <p>Suddenly, a blinding flash of lightning ripped through the sky, followed instantly by a deafening crash of thunder that shook the ground beneath our feet. Torrents of icy rain poured down on us, turning the dusty trail into a slippery river of thick, red mud. Panic broke out among us. In the confusion, my best friend, Kamau, slipped on a wet rock, lost his footing, and tumbled down a steep, muddy slope into a deep thicket of brambles. "Help me!" he cried out, his voice filled with terror. His leg was jammed tightly between two jagged volcanic rocks, and he could not free himself. The water level in the trench beside him was rising rapidly. My heart hammered against my ribs like a trapped bird. Risking my own safety, I slid down the slippery slope, grabbed a sturdy tree branch, and held it out toward him while screaming for Mr. Mwangi.</p>
          <p><strong>Paragraph 4: Resolution</strong></p>
          <p>Fortunately, Mr. Mwangi heard my desperate cries above the roaring storm. With impressive speed, he rushed down the slope, his boots digging firmly into the mud. Using his immense strength, he carefully wedged a large wooden branch under the heavy rock that was trapping Kamau's ankle. "On the count of three, pull him up!" Mr. Mwangi commanded, his muscles straining against the weight. With a coordinated effort, we pulled Kamau free just as the muddy trench filled completely with rushing water. Working as a team, we pulled each other back up to the main path and found shelter beneath a thick, overhanging rock ledge nearby.</p>
          <p><strong>Paragraph 5: Conclusion</strong></p>
          <p>By the time the storm finally cleared, revealing a spectacular rainbow stretching across the valley, we were drenched to the bone and covered in mud, but safe. Though we never reached the mountain peak that day, we learned lessons that no textbook could ever teach. I realized that true bravery is not the absence of fear, but the willingness to help others when they are in trouble. From that unforgettable day forward, our class shared an unbreakable bond of unity, knowing that we could survive any storm as long as we stood together.</p>
          
          <SubSection title="Comprehensive Reading Assessment: Story 1">
            <p><strong>Part A: Multiple-Choice Questions</strong></p>
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. What is the primary setting/background of the story?</strong> B) A crisp, clear Saturday morning in August at Mount Longonot.</p>
              <p><strong>2. What structural role does Paragraph 2 play in the narrative?</strong> C) It introduces the inciting incident and rising action.</p>
              <p><strong>3. Why did Kamau cry out for help in Paragraph 3?</strong> B) His leg was trapped between two volcanic rocks down a slope.</p>
              <p><strong>4. How did Mr. Mwangi free Kamau's trapped leg?</strong> B) He used a large wooden branch as a lever to wedge the rock up.</p>
            </div>
            <p><strong>Part B: Structural and Analytical Questions</strong></p>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>5. Identify two sensory details in Paragraph 3 that create an intense mood.</strong> Answer: "blinding flash of lightning," "deafening crash of thunder," "slippery river of thick, red mud," or "heart hammered against my ribs."</p>
              <p><strong>6. Rewrite as indirect speech: "Stay close together, pupils!" he shouted.</strong> Answer: Mr. Mwangi shouted over the rising wind to the pupils to stay close together.</p>
              <p><strong>7. What moral lesson did the narrator learn?</strong> Answer: True bravery is not the absence of fear, but the willingness to help others when they are in trouble.</p>
            </div>
            <p><strong>Part C: Vocabulary</strong></p>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>8. Find a word in Paragraph 1 meaning "waiting with excitement."</strong> Answer: Anticipated.</p>
              <p><strong>9. What does "treacherous" mean in Paragraph 2?</strong> Answer: Extremely dangerous, unsafe, or unstable to walk on.</p>
              <p><strong>10. "My heart hammered against my ribs like a trapped bird." Identify the figurative device and its meaning.</strong> Answer: Simile (using "like"). It means the narrator's heart was beating incredibly fast and hard due to intense fear and panic.</p>
            </div>
          </SubSection>
        </SubSection>

        <SubSection title="Story 2: The Mystery of the Missing School Trophy">
          <p><strong>Paragraph 1: Introduction</strong></p>
          <p>The pristine corridors of Elimu Primary School were unusually quiet on Monday morning. Rows of highly polished wooden lockers stood in neat lines, and the concrete floors swept clean. In the center of the main administrative foyer stood a glass display cabinet. It usually held our school's most prized possession: the shimmering, golden Academic Excellence Trophy, won by our senior quiz team over fifty competing schools. It was a beautiful piece of art, made of solid brass with an emerald-green base. However, as I walked past the cabinet with my classmate, Amina, we stopped in our tracks. The glass door of the cabinet was wide open, and the velvet cushion inside was completely empty. The trophy had vanished.</p>
          <p><strong>Paragraph 2: Inciting Incident</strong></p>
          <p>"Look!" Amina whispered, pointing a shaking finger at the bottom of the display case. A trail of wet, muddy footprints led away from the cabinet, heading directly down the dark hallway toward the old science laboratory. The footprints were unusually small, suggesting they belonged to a child or someone wearing small shoes. Beside the cabinet lay a single clue: a unique, bright blue plastic button with a silver star engraved on its surface. I picked it up carefully, its cold plastic surface smooth against my hand. "This button belongs to our new school prefect uniforms," I noted, looking at Amina with wide eyes. A mystery was unfolding, and we knew we had to act quickly before the morning assembly began.</p>
          <p><strong>Paragraph 3: The Climax</strong></p>
          <p>We followed the muddy tracks down the corridor, our hearts thumping against our chests. The trail ended right at the door of the old science laboratory, which was slightly ajar. We peeked through the gap and saw a figure in a school uniform hovering over a large wooden crate in the corner. It was Brian, the head boy! He was holding the golden trophy, polishing its shiny surface with a yellow cloth. Suddenly, my foot hit a plastic bucket on the floor. It tipped over with a loud crash that echoed through the quiet room. Brian spun around, his face turning pale with shock. "What are you two doing here?" he stammered, quickly hiding the trophy behind his back. He looked guilty, trapped like a mouse in a corner.</p>
          <p><strong>Paragraph 4: Resolution</strong></p>
          <p>"We saw the empty cabinet, Brian," Amina said firmly, stepping into the room. "And we found your blue star button right next to the open glass door." Brian looked down at his shirt, noticing for the first time that his top button was missing. He sighed deeply, his shoulders dropping in defeat. To our surprise, his eyes filled with tears. "I didn't steal it to keep it," he confessed in a shaky voice. "Yesterday afternoon, I accidentally dropped the trophy while moving it for the parents' day display, and it got covered in black ink from my pen. I was terrified of being punished, so I came here early this morning to clean it off before anyone noticed." He held out the trophy, which was now spotless and gleaming brilliantly.</p>
          <p><strong>Paragraph 5: Conclusion</strong></p>
          <p>With a deep sense of relief, we helped Brian carry the heavy trophy back to the foyer and placed it safely inside the glass display cabinet, locking the door securely. We agreed to keep his early-morning cleaning mission a secret, as no damage had been done and his intentions were honest. I realized that things are not always as they appear at first glance, and it is vital to investigate before jumping to conclusions. From that day on, Amina and I felt like real detectives, keeping our eyes wide open to protect our school community.</p>
          
          <SubSection title="Comprehensive Reading Assessment: Story 2">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. What prized possession was missing?</strong> B) The shimmering, golden Academic Excellence Trophy.</p>
              <p><strong>2. What physical clue did they find beside the cabinet?</strong> B) A bright blue plastic button with a silver star engraved on it.</p>
              <p><strong>3. Where did the trail of muddy footprints lead?</strong> C) Down the dark hallway toward the old science laboratory.</p>
              <p><strong>4. Why did Brian take the trophy?</strong> C) He dropped it in ink and wanted to clean it before anyone noticed.</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>5. Identify the main conflict in Paragraph 2.</strong> Answer: The discovery of clues pointing to a theft drives the plot forward, turning the narrator and Amina into detectives.</p>
              <p><strong>6. How does punctuation show Brian is shocked and nervous?</strong> Answer: The exclamation mark ("head boy!") and broken sentences ("What are you two doing here?") show his stuttering panic.</p>
              <p><strong>7. What lesson does the narrator draw?</strong> Answer: Appearances can be deceiving; it is important to investigate before assuming someone is guilty.</p>
              <p><strong>8. Find a word in Paragraph 1 meaning "perfectly clean, spotless."</strong> Answer: Pristine.</p>
              <p><strong>9. What does "trapped like a mouse in a corner" mean?</strong> Answer: Brian had no way to escape, was completely caught, and felt helpless.</p>
              <p><strong>10. Find a word in Paragraph 3 meaning "speaking with sudden pauses due to fear."</strong> Answer: Stammered.</p>
            </div>
          </SubSection>
        </SubSection>

        <SubSection title="Story 3: The Day the River Chania Overflowed">
          <p><strong>Paragraph 1: Introduction</strong></p>
          <p>For three weeks, the sky above our village near Nyeri was a dark sheet of grey. Heavy rain beat down on our iron-roofed houses, filling the air with a constant drumming noise. I sat by the window of our small timber farmhouse, watching water stream off the eaves. Below the hills ran the Chania River. Usually, it was a gentle, clear stream where we gathered water and watched dragonflies dance over the reeds. My grandmother sat near the stone hearth, her knitting needles clicking as she worked on a thick woollen sweater. The smell of boiling maize and beans filled the kitchen, creating a warm shelter against the damp cold outside.</p>
          <p><strong>Paragraph 2: Inciting Incident</strong></p>
          <p>By Tuesday afternoon, the gentle rain turned into a fierce downpour. The wind tore through the banana plantations, ripping their broad green leaves to shreds. Suddenly, a low, rumbling roar echoed through the valley, completely different from the sound of thunder. I looked out the window and gasped in horror. The Chania River had burst its banks, turning into a raging wall of brown water mixed with mud, uprooted trees, and floating debris. The floodwater was spreading across the flat farmland, moving rapidly toward our livestock pens. "Grandmother, look!" I screamed, pointing at our three dairy cows, who were bellowing in terror as water swirled around their legs.</p>
          <p><strong>Paragraph 3: The Climax</strong></p>
          <p>Without hesitating, I grabbed my heavy yellow raincoat and rushed out into the storm, with Grandmother shouting warnings behind me. The cold rain stung my face like sharp needles, and the mud pulled at my boots with every step. By the time I reached the cattle pens, the freezing water was already up to my waist. The wooden gate was jammed shut by a large, floating log. Inside, our prize cow, Daisy, was struggling to keep her head above the rising flood. The current was strong, threatening to sweep me off my feet. I struggled against the water, using all my strength to lift the heavy log off the gate latch. My hands grew numb, and my muscles ached from the effort. With one final push, I cleared the log and swung the gate open.</p>
          <p><strong>Paragraph 4: Resolution</strong></p>
          <p>Fortunately, the cows understood the danger. As soon as the gate opened, they swam through the muddy water toward the safety of the higher hills. I grabbed Daisy's leather halter, letting her pull me along through the strong current until my feet found solid ground. My older brother, Jomo, arrived with a team of neighbours carrying thick ropes. They quickly secured our livestock on the high ridge and wrapped me in warm blankets. Our farmhouse remained safe on its raised stone foundation, just a few feet above the peak of the floodwaters.</p>
          <p><strong>Paragraph 5: Conclusion</strong></p>
          <p>As the evening sun broke through the clouds, lighting up the flooded valley below, we stood safe on the hillside. We had lost our maize crops, but our family and livestock were completely safe. This experience taught me that nature demands deep respect, and panic is our greatest enemy during a crisis. From that day on, I knew I could face unexpected challenges with courage and clear thinking.</p>
          
          <SubSection title="Comprehensive Reading Assessment: Story 3">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. Where is the story set?</strong> B) In a small timber farmhouse near the Chania River in Nyeri.</p>
              <p><strong>2. What did the river look like during the peak flood?</strong> B) A raging wall of brown water with mud and uprooted trees.</p>
              <p><strong>3. What obstacle prevented the cows from escaping?</strong> B) A large floating log was jamming the wooden gate shut.</p>
              <p><strong>4. How did the narrator reach safety?</strong> C) By holding Daisy's leather halter as she pulled them to high ground.</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>5. How does the author create contrast between Paragraph 1 and Paragraph 2?</strong> Answer: Paragraph 1 describes a cozy indoor scene; Paragraph 2 shatters this with fierce outdoor destruction as the river bursts its banks.</p>
              <p><strong>6. Find a simile in Paragraph 3 and explain it.</strong> Answer: "like sharp needles" × describes the painful sensation of freezing rain hitting the narrator's face.</p>
              <p><strong>7. What did the family lose and what survived?</strong> Answer: They lost their maize crop, but their family, farmhouse, and all three dairy cows survived safely.</p>
              <p><strong>8. Find a word in Paragraph 1 meaning "a fireplace or stone area floor."</strong> Answer: Hearth.</p>
              <p><strong>9. What does "debris" mean in Paragraph 2?</strong> Answer: Scattered pieces of waste, rubbish, or broken materials floating down the flooded river.</p>
              <p><strong>10. Find a word in Paragraph 2 meaning "making a deep, loud roar or crying out in fear (used for animals)."</strong> Answer: Bellowing.</p>
            </div>
          </SubSection>
        </SubSection>

        <SubSection title="Story 4: The Brave Firefighters of Shauri Moyo">
          <p><strong>Paragraph 1: Introduction</strong></p>
          <p>It was a quiet Tuesday evening in the Shauri Moyo neighborhood. The sun had set, leaving a deep purple sky over the busy streets. Families were gathered inside their apartments, enjoying dinner after a long day of work and school. I sat at the kitchen table, rewriting my English grammar notes, while the smell of fresh chapatis filled our cozy living room. Outside, we could hear the familiar sounds of neighbours chatting and children playing their final games of hide-and-seek under the streetlamps. Everything felt peaceful and normal.</p>
          <p><strong>Paragraph 2: Inciting Incident</strong></p>
          <p>Suddenly, a sharp, terrifying scream shattered the evening peace. "Fire! Fire! Help us!" a voice cried out from the street. I rushed to the balcony and looked out. Thick, black smoke was pouring from the ground floor of the community bakery across the road. Within seconds, bright orange flames burst through the wooden windows, licking up the side of the building toward the apartments above. Panic spread through the street as people ran out of their homes. My father immediately grabbed his phone and called the emergency services, his voice calm but urgent. "There is a massive fire on Shauri Moyo Road," he reported. "Please send help immediately!"</p>
          <p><strong>Paragraph 3: The Climax</strong></p>
          <p>The fire spread quickly, fueled by the bakery's cooking oil. The heat grew intense, warming our faces even from across the street. Suddenly, we noticed a young boy standing at a second-story window directly above the flames, crying for help. He was trapped by the thick smoke inside. Just then, the loud wail of sirens echoed down the street as a bright red fire engine arrived. The firefighters jumped into action with impressive speed. They connected thick canvas hoses to the water supply while lifting a long metal ladder toward the trapped boy. The smoke grew thicker, hiding the window from view. A brave firefighter, wearing a heavy protective suit and mask, climbed up into the dark smoke without hesitation.</p>
          <p><strong>Paragraph 4: Resolution</strong></p>
          <p>We held our breath, the street falling completely silent as we waited. A few moments later, the firefighter emerged from the smoke, carrying the young boy safely in his arms. The crowd broke into loud cheers and applause. Down on the ground, medical team members wrapped the boy in a blanket and checked his breathing. Meanwhile, the other firefighters directed powerful streams of water at the flames. Within an hour, the fire was completely extinguished, leaving behind a charred, smoking building but no serious injuries.</p>
          <p><strong>Paragraph 5: Conclusion</strong></p>
          <p>As we returned to our apartment, my heart was still racing, but I felt a deep sense of relief. That evening taught me the importance of community unity and the incredible bravery of emergency workers. I realized that true heroes are those who risk their lives to save others. From that day forward, I promised to always stay calm in an emergency and support those who protect our neighborhoods.</p>
          
          <SubSection title="Comprehensive Reading Assessment: Story 4">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. Where did the fire start?</strong> B) In the ground floor of a community bakery across the road.</p>
              <p><strong>2. How did the narrator's father help?</strong> C) He called the emergency services immediately.</p>
              <p><strong>3. Why did the fire spread quickly?</strong> A) It was fueled by the bakery's cooking oil.</p>
              <p><strong>4. How was the trapped boy saved?</strong> B) A brave firefighter climbed a metal ladder and carried him down.</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>5. Describe the contrast between Paragraph 1 and Paragraph 2.</strong> Answer: Paragraph 1 is peaceful and calm; Paragraph 2 destroys this peace with a sudden scream, smoke, and dangerous flames.</p>
              <p><strong>6. Why did the crowd cheer and applaud in Paragraph 4?</strong> Answer: Because the firefighter successfully saved the trapped boy from the burning building.</p>
              <p><strong>7. What main lesson did the narrator learn?</strong> Answer: The value of community unity and that true heroes risk their lives to save others.</p>
              <p><strong>8. Find a word in Paragraph 4 meaning "blackened or burned by fire."</strong> Answer: Charred.</p>
              <p><strong>9. What does "extinguished" mean?</strong> Answer: Put out completely, ensuring no more fire or sparks remained.</p>
              <p><strong>10. What figurative lesson does the narrator apply to future emergencies?</strong> Answer: To always stay calm in an emergency and support those who protect the community.</p>
            </div>
          </SubSection>
        </SubSection>

        <SubSection title="Story 5: The Hidden Treasure of Gedi Ruins">
          <p><strong>Paragraph 1: Introduction</strong></p>
          <p>The air inside the ancient coastal forest was thick and humid, filled with the scent of damp earth and blooming jasmine. It was a hot Thursday afternoon in October during our annual class trip to the historic Gedi Ruins near Watamu. Giant baobab trees stood over the crumbling stone walls, their grey trunks looking like ancient guardians of the past. Our Grade 5 class walked slowly along the shaded paths, listening to the chatter of birds and the rustle of lizards in the dry leaves. Our guide, an elderly man named Mr. Kahindi, spoke in a low, respectful voice about the people who lived in this stone city hundreds of years ago.</p>
          <p><strong>Paragraph 2: Inciting Incident</strong></p>
          <p>As the class stopped to look at the remains of the Sultan's Palace, my foot caught on a thick tree root. I tripped and stumbled forward, hitting a mossy stone wall in a dark corner of the ruins. To my surprise, the stone shifted under my weight, sliding backward with a scraping sound to reveal a small, dark opening in the wall. I peeked inside the hidden space, my eyes adjusting to the shadows. Resting on a bed of dry dirt was an old, clay pot decorated with faded geometric patterns. The top was sealed tightly with a plug of dark wax. "Hey, come look at this!" I whispered excitedly to my classmate, Mwangi, my heart beating fast with curiosity.</p>
          <p><strong>Paragraph 3: The Climax</strong></p>
          <p>Mwangi rushed over, and together we carefully pulled the heavy clay pot out into the sunlight. The rest of the class was busy listening to the guide on the other side of the palace, so we were completely alone. With shaking hands, I used a sharp stick to scrape away the old wax seal. The plug cracked and popped loose, releasing a musty smell of ancient dust. I tipped the pot forward onto a flat stone. Instead of gold coins, a beautifully preserved roll of thick, dark leather slid out, tied with a braided silver cord. Beside it lay a heavy bronze key covered in green rust. Just as I untied the cord, we heard footsteps approaching. It was Mr. Kahindi and our teacher, Mrs. Atieno! My breath caught in my throat as they walked around the corner and stopped, staring at what we had found.</p>
          <p><strong>Paragraph 4: Resolution</strong></p>
          <p>To our immense relief, Mr. Kahindi's stern face broke into a wide smile. "Do not be afraid, children," he said gently, kneeling beside us. "You have discovered a historical time capsule that we archaeologists have been searching for during the last three excavation seasons." Mrs. Atieno placed a hand on our shoulders and commended our careful handling of the artifacts. The leather scroll turned out to be a detailed trade record from the ancient Swahili merchants, and the bronze key matched a mysterious locked chest stored in the Fort Jesus Museum. Our names were recorded as the official student discoverers of the Gedi Merchant Scroll.</p>
          <p><strong>Paragraph 5: Conclusion</strong></p>
          <p>That hot Thursday afternoon became a defining moment in my life. I learned that history is not just a collection of dusty facts written in textbooks; it is a living treasure that lies hidden right beneath our feet, waiting to be discovered by those who are curious and observant. From that day forward, I paid close attention to the world around me, knowing that every old wall, ancient tree, and forgotten path holds a secret story waiting to be uncovered.</p>
          
          <SubSection title="Comprehensive Reading Assessment: Story 5">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. Where did the story take place?</strong> B) At the historic Gedi Ruins near Watamu during a class trip.</p>
              <p><strong>2. How was the hidden opening discovered?</strong> A) The narrator tripped on a tree root and hit a mossy stone wall that shifted.</p>
              <p><strong>3. What was inside the sealed clay pot?</strong> B) A preserved roll of thick, dark leather tied with a silver cord and a heavy bronze key.</p>
              <p><strong>4. What was the actual significance of the discovery?</strong> C) It was a historical time capsule containing ancient Swahili trade records.</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>5. How does the author create a mood of secrecy and discovery in Paragraph 2?</strong> Answer: By describing the dark, hidden corner, the scraping sound of the stone, and the "hidden space" with a sealed pot.</p>
              <p><strong>6. What was the resolution of the story?</strong> Answer: Mr. Kahindi revealed the find was historically important, and the students were credited as official discoverers.</p>
              <p><strong>7. What lesson did the narrator learn?</strong> Answer: History is a living treasure hidden beneath our feet, waiting to be discovered by the curious and observant.</p>
              <p><strong>8. Find a word in Paragraph 1 meaning "crumbling" or "falling apart."</strong> Answer: Crumbling (from "crumbling stone walls").</p>
              <p><strong>9. What does "artifacts" mean in Paragraph 4?</strong> Answer: Objects made by humans that have historical or cultural significance.</p>
              <p><strong>10. What figurative phrase could describe the narrator's new attitude toward the world?</strong> Answer: "Every old wall, ancient tree, and forgotten path holds a secret story waiting to be uncovered."</p>
            </div>
          </SubSection>
        </SubSection>
      </Section>

      <Section title="Section 6: Comprehensive English Language Master Exam">
        <p><strong>Time Allowed: 2 Hours</strong></p>
        <p>This examination tests all skills across the Grade 5 English language curriculum. Write clear, complete answers for each section.</p>
        
        <SubSection title="Section A: Grammar and Language Structures">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 1: Noun Classification</strong> × Identify the underlined nouns: (a) teacher → Common. (b) herd → Collective. (c) Honesty → Abstract. (d) Mombasa → Proper.</p>
            <p><strong>Question 2: Pronoun Selection</strong> × (a) itself. (b) yours. (c) I.</p>
            <p><strong>Question 3: Verb Tense Transitions</strong> × (a) David is walking to the village market. (b) We played football in the field. (c) The birds were flying over the school roof.</p>
            <p><strong>Question 4: Adjective Ordering</strong> × (a) My uncle bought a sleek, new, red, German car. (b) She carried a heavy, large, square, wooden box.</p>
            <p><strong>Question 5: Question Tags</strong> × (a) can't you? (b) did they? (c) isn't she?</p>
          </div>
        </SubSection>

        <SubSection title="Section B: Vocabulary and Punctuation Mechanics">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Question 6: Punctuation Correction</strong> × On Monday morning, Mr. Kamau said, "Do you know where Juma dropped his English textbook?"</p>
            <p><strong>Question 7: Homophone Distinctions</strong> × (a) principal. (b) there. (c) stationery.</p>
            <p><strong>Question 8: Synonyms and Antonyms</strong> × (a) Smart: Synonym = Clever / Intelligent; Antonym = Foolish / Dull. (b) Start: Synonym = Begin / Commence; Antonym = Finish / End.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- SCIENCE & TECHNOLOGY NOTES ----------
function ScienceNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Science and Technology: Complete Curriculum Study Guide</h2>
      <p>This comprehensive study guide covers the entire Grade 5 Science and Technology curriculum based on the current Primary School syllabus [8-4-4 / CBC models]. It includes theoretical breakdowns, technical points, specific calculation formulas for physical sciences, detailed structural summaries, and comprehensive interactive question-and-answer banks.</p>

      <Section title="Section 1: Living Things × Plants and Animals">
        <SubSection title="1.1 Classification and Characteristics of Plants">
          <p>Plants are living organisms that manufacture their own food through photosynthesis. In Grade 5, plants are primarily classified based on their structural methods of reproduction into two overarching groups: Flowering Plants and Non-Flowering Plants.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                       OVERARCHING PLANT KINGDOM
                                 Plants
                                   ×
         +---------------------------------------------------+
         ?                                                   ?
  Flowering Plants                                 Non-Flowering Plants
(Reproduce via Seeds)                             (Reproduce via Spores/Cones)
  - Maize, Beans, Rose, Mango                       - Ferns, Mosses, Conifers`}</pre>
          <SubSection title="Flowering Plants">
            <p>Flowering plants produce flowers, which develop into fruits containing seeds. Seeds serve as the primary units of reproduction.</p>
            <BulletList items={[
              'Structural Subdivisions: They can be monocotyledonous (one seed leaf, parallel veins, fibrous roots) or dicotyledonous (two seed leaves, net-like veins, taproots).',
              'Key Biological Examples: Maize (Zea mays), Beans (Phaseolus vulgaris), Mango, Orange, Hibiscus, Rose, and Grass.'
            ]} />
          </SubSection>
          <SubSection title="Non-Flowering Plants">
            <p>Non-Flowering plants do not produce flowers at any stage of their life cycle. Instead, they utilize alternative reproductive structures such as spores or cones.</p>
            <BulletList items={[
              'Spore-Bearing Plants: These organisms develop microscopic reproductive structures called spores, typically stored in specialized cases on the undersides of their leaves (sporangia). Key Biological Examples: Ferns, Mosses, Liverworts, and Horsetails.',
              'Cone-Bearing Plants (Conifers): These are gymnosperms that develop woody structures called cones to house their seeds. Key Biological Examples: Pine, Cedar, Cypress, and Fir trees.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.2 Classification and Characteristics of Animals (Vertebrates vs. Invertebrates)">
          <p>The animal kingdom is divided into two primary divisions based on the presence or absence of an internal skeletal structural backbone.</p>
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Phylum Category</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Skeletal Characteristic</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Core Classes / Groups</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Key Biological Examples</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Vertebrates</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Possess an internal backbone</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mammals, Birds, Reptiles, Amphibians, Fish</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Cow, Eagle, Lizard, Frog, Tilapia</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Invertebrates</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Lack an internal backbone</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Insects, Arachnids, Molluscs, Annelids</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Locust, Spider, Snail, Earthworm</td></tr>
            </tbody>
          </table>
          <SubSection title="Deep Breakdown of the 5 Vertebrate Classes">
            <BulletList items={[
              'Mammals (Mammalia): Warm-blooded (homoiothermic), possess mammary glands to suckle their young, have hair or fur on their skin surfaces, give birth to live young (except monotremes like the duck-billed platypus), breathe through lungs. Examples: Humans, cows, elephants, whales, dolphins, and bats (flying mammals).',
              'Birds (Aves): Warm-blooded, body covered with feathers, possess a horny beak without teeth, lay hard-shelled eggs, have wings for flight, breathe via lungs. Examples: Eagle, hawk, dove, chicken, ostrich, penguin.',
              'Reptiles (Reptilia): Cold-blooded (poikilothermic), body covered with dry, scaly skin surfaces, lay leathery-shelled eggs on dry land, breathe via lungs. Examples: Snake, lizard, crocodile, tortoise, turtle.',
              'Amphibians (Amphibia): Cold-blooded, undergo metamorphosis, spend their early life in water breathing through gills and adult life on land breathing through moist skin and lungs, lay soft jelly-like eggs in water. Examples: Frog, toad, salamander, newt.',
              'Fish (Pisces): Cold-blooded, streamline bodies covered in wet scales, possess fins for swimming, lay eggs in water habitats, breathe dissolved oxygen through gills. Examples: Tilapia, Nile Perch, Shark, Salmon, Catfish.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.3 Fungi × The Hidden Kingdom">
          <p>Fungi are distinct living organisms that look like plants but cannot manufacture their own food because they lack green colouring matter (chlorophyll).</p>
          <BulletList items={[
            'They are heterotrophic saprophytes, meaning they feed by absorbing nutrients from decaying organic matter.',
            'They reproduce via spores.',
            'They grow well in dark, warm, and damp conditions.',
            'Key Biological Examples: Mushrooms (large umbrella-shaped structures on decaying logs), Toadstools (poisonous mushrooms), Moulds (fuzzy growths on stale bread or rotting fruits), Yeast (microscopic unicellular fungi used in baking).'
          ]} />
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                  STRUCTURAL ANATOMY OF A MUSHROOM
                           (=====) → <- Cap (Pileus)

                             | |    <- Gills (Underneath Cap)
                             | |    <- Stalk (Stipe)
                            /   \\   <- Mycelium (Root-like threads in soil)`}</pre>
        </SubSection>
      </Section>

      <Section title="Section 2: Human Body Systems and Health">
        <SubSection title="2.1 The Human Digestive System">
          <p>The digestive system breaks down large, insoluble food molecules into small, soluble nutrients that the body can absorb into the bloodstream.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                    THE PATHWAY OF DIGESTION (SVO)
[Mouth] -> [Oesophagus] -> [Stomach] -> [Small Intestine] -> [Large Intestine] -> [Anus]`}</pre>
          <BulletList items={[
            'The Mouth: Mechanical Action × Teeth chew and grind solid food into a soft mass (bolus). Chemical Action × Saliva from salivary glands contains enzymes (amylase) that convert cooked starches into simple maltose sugars.',
            'Oesophagus (Food Pipe): Transports food down to the stomach via rhythmic, wave-like muscular contractions called peristalsis.',
            'The Stomach: A muscular bag that churns food into a semi-liquid mixture called chyme. It secretes gastric juices containing hydrochloric acid (which kills bacteria) and enzymes (pepsin) that initiate protein breakdown.',
            'The Small Intestine: The primary site for chemical digestion and nutrient absorption. Enzymes from the pancreas and bile from the liver break down proteins, carbohydrates, and fats. Soluble nutrients are absorbed into the bloodstream through finger-like projections called villi.',
            'The Large Intestine (Colon): Absorbs water and mineral salts from the undigested food waste residue.',
            'Rectum and Anus: The rectum stores solid undigested waste (faeces) temporarily until it is expelled out through the anus during egestion.'
          ]} />
        </SubSection>

        <SubSection title="2.2 Respiratory System Mechanics">
          <p>The respiratory system is responsible for breathing, which exchanges oxygen from the air for carbon dioxide produced by the body's cells.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                    THE PATHWAY OF INHALED AIR
[Nose/Nostrils] -> [Trachea / Windpipe] -> [Bronchi] -> [Bronchioles] -> [Alveoli / Lungs]`}</pre>
          <BulletList items={[
            'Nose: Air enters through the nostrils. It is lined with fine hairs and mucus that trap dust, soot particles, and microbes, while warming and moistening the incoming air.',
            'Trachea (Windpipe): A long tube reinforced with C-shaped rings of cartilage that prevent it from collapsing. It conducts air down toward the thoracic cavity.',
            'Bronchi and Bronchioles: The trachea splits into two bronchi, one leading to each lung. Inside the lungs, these tubes branch into smaller air passages called bronchioles.',
            'Alveoli (Air Sacs): Microscopic air sacs at the ends of bronchioles. They have extremely thin walls and are surrounded by a dense network of blood capillaries. This is the exact site of gaseous exchange (oxygen diffuses into the blood, while carbon dioxide diffuses out of the blood).'
          ]} />
        </SubSection>

        <SubSection title="2.3 Excretory System">
          <p>Excretion is the process by which living organisms remove metabolic waste products from their bodies.</p>
          <BulletList items={[
            'The Lungs: Excrete carbon dioxide and excess water vapour during exhalation.',
            'The Skin: Excretes sweat, which consists of excess water, excess mineral salts, and trace amounts of urea. This process also regulates body temperature through evaporative cooling.',
            'The Kidneys: Filter blood to remove excess water, mineral salts, and urea, forming urine, which is expelled from the body.'
          ]} />
        </SubSection>

        <SubSection title="2.4 Personal Hygiene, Cleanliness, and Management of Waste">
          <BulletList items={[
            'Body Hygiene: Regular bathing with clean water and soap removes sweat, dead skin cells, and dirt. Teeth must be brushed at least twice daily to prevent dental cavities. Hair must be kept clean and combed, and fingernails must be trimmed short to prevent dirt accumulation.',
            'Menstrual Hygiene Management: Adolescent girls must use clean sanitary pads during menstruation, changing them every 4 to 6 hours to prevent bacterial infections and unpleasant odours. Used pads should be wrapped in old newspapers and disposed of in designated bins. They should never be flushed down toilets.',
            'School and Home Waste Management: Waste should be sorted into categories using a modern waste management hierarchy: [Reduce] ? [Reuse] ? [Recycle] ? [Dispose].'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 3: Environment and Health">
        <SubSection title="3.1 Soil Components, Texture, and Properties">
          <p>Soil is the top loose layer of the earth's surface that supports plant life. It is formed through the weathering of rocks over thousands of years.</p>
          <BulletList items={[
            'Mineral Matter: Particles of sand, silt, and clay derived from weathered rocks.',
            'Organic Matter (Humus): Decayed remains of dead plants and animals that enrich soil fertility.',
            'Soil Water: Dissolves mineral nutrients so they can be absorbed by plant roots.',
            'Soil Air: Provides oxygen for soil organisms and plant roots to respire.',
            'Living Organisms: Microbes, fungi, earthworms, and insects that decompose matter and aerate the soil structure.'
          ]} />
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Soil Type</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Particle Size</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Water Retention</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Drainage Capacity</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Best Agricultural Use</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Sandy Soil</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Large/Coarse</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Very Poor</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Excellent / Fast</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Building and Coconut farming</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Clay Soil</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Very Small / Fine</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Excellent</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Poor / Waterlogs</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Pottery and Brick making</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Loam Soil</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Medium Mixture</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Moderate</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Moderate / Perfect</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>All Standard Crop Cultivation</td></tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title="3.2 Water Pollution × Causes, Prevention, and Conservation">
          <p>Water pollution occurs when harmful substances contaminants enter water bodies, rendering the water unsafe for human, animal, and plant use.</p>
          <BulletList items={[
            'Domestic Waste Discharges: Emptying untreated soapy water, sewage, and household trash directly into rivers.',
            'Agricultural Runoff: Rain washing excess chemical fertilizers and pesticides from farmlands into nearby streams.',
            'Industrial Effluents: Factories releasing toxic chemical liquids directly into waterways without treatment.',
            'Oil Spills: Leaks from transport tankers or boat engines that form a suffocating layer on water surfaces.'
          ]} />
          <SubSection title="Water-Borne Illnesses and Methods of Prevention">
            <BulletList items={[
              'Cholera: A bacterial infection caused by Vibrio cholerae. It triggers severe rice-water diarrhoea and rapid dehydration. Prevention requires boiling all drinking water and practicing proper handwashing.',
              'Typhoid Fever: Caused by Salmonella typhi. Symptoms include a sustained high fever, severe abdominal pain, and headaches. It is prevented by eating hot food and using latrines.',
              'Bilharzia (Schistosomiasis): A parasitic disease caused by microscopic blood flukes carried by freshwater snails. The parasites enter humans through open skin cuts when swimming in contaminated water. It is prevented by treating stagnant pools and wearing rubber boots in wetlands.'
            ]} />
          </SubSection>
        </SubSection>
      </Section>

      <Section title="Section 4: Matter and Physical Sciences">
        <SubSection title="4.1 States of Matter and Thermal Transitions">
          <p>Matter is anything that has mass and occupies space. It exists in three primary states: Solids, Liquids, and Gases.</p>
          <BulletList items={[
            'Solids: Have a definite shape, definite mass, and fixed volume. Their constituent molecules are packed tightly together in a rigid arrangement, vibrating in place.',
            'Liquids: Have a definite mass and fixed volume, but no definite shape. They take the shape of the container they occupy. Their molecules are loosely arranged and can slide past one another.',
            'Gases: Have a definite mass, but no definite shape or volume. They expand completely to fill any container they are placed in. Their particles move rapidly in random directions.'
          ]} />
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                 THE FIVE PHASE CHANGES OF MATTER
                     [Solid State (Ice)]
                        ×            ?
         Melting        ×            ×   Freezing
     (Heat Absorbed)    ?            × (Heat Released)
                    [Liquid State (Water)]
                        ×            ?
       Evaporation      ×            ×   Condensation
     (Heat Absorbed)    ?            × (Heat Released)
                     [Gaseous State (Steam)]`}</pre>
          <BulletList items={[
            'Melting: The physical transition of a solid into a liquid through the absorption of heat energy.',
            'Evaporation: The transition of a liquid into a gas through the absorption of heat energy.',
            'Freezing (Solidification): The transition of a liquid into a solid through the release of heat energy.',
            'Condensation: The transition of a gas into a liquid through cooling or the release of heat energy.',
            'Sublimation: A direct change from a solid to a gas without passing through the liquid state (e.g., dry ice, iodine flakes).'
          ]} />
        </SubSection>

        <SubSection title="4.2 Light × Properties and Mechanics">
          <p>Light is a form of energy that stimulates our sense of sight, allowing us to see the world around us.</p>
          <SubSection title="Rectilinear Propagation of Light">
            <p>Light travels in a straight line. This fundamental behavior is called the rectilinear propagation of light. It can be demonstrated by looking at a lit candle flame through three aligned cardboard sheets with small center pinholes. If even one sheet is moved out of alignment, the candle flame can no longer be seen.</p>
          </SubSection>
          <SubSection title="Interaction of Light with Materials">
            <BulletList items={[
              'Transparent Materials: Allow nearly all light to pass through them easily. This makes objects behind them clearly visible. Examples: Clear window glass, clean water, and clear plastic wrap.',
              'Translucent Materials: Allow some light to pass through, but scatter it in random directions. Objects behind them appear blurry and indistinct. Examples: Frosted glass, tracing paper, tissue paper, and oily paper.',
              'Opaque Materials: Do not allow any light to pass through them. Instead, they absorb or reflect all incoming light, casting a shadow on the opposite side. Examples: Wood, bricks, metal sheets, and human bodies.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="4.3 Forces and Energy Transfers">
          <p>A force is a push or a pull exerted on an object. Forces cannot be seen directly, but their effects on objects can be observed and measured using a spring balance in units called Newtons (N).</p>
          <BulletList items={[
            'A force can move a stationary object. A force can stop a moving object. A force can change the speed or direction of a moving object. A force can distort or deform the shape of an object.',
            'Gravitational Force: The invisible pull that the earth exerts on all objects, pulling them down toward its center.',
            'Magnetic Force: The push or pull exerted by magnets on magnetic materials like iron and steel.',
            'Frictional Force: The force that resists motion when two surfaces slide against each other. Friction always acts in the opposite direction to the movement.',
            'Magnetic Attraction and Repulsion Rules: Like Poles Repel Each Other (N?N or S?S). Unlike Poles Attract Each Other (N??S).'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 5: Step-by-Step Science Calculations and Word Problems">
        <p>This section covers specific calculation formulas used in Grade 5 physical sciences, including conversions, measurements, and numerical problems.</p>
        <WorkedExample title="Example 1: Calculating Magnetic Repulsion or Attraction Outcomes" problem="A student hangs a bar magnet from a piece of string. She brings the North Pole of a second magnet close to the North Pole of the hanging magnet. Describe the force generated and state the movement outcome.">
          <Step>Step 1: Identify the magnetic poles involved × Hanging magnet pole = North Pole (N). Approaching magnet pole = North Pole (N).</Step>
          <Step>Step 2: Apply the fundamental law of magnetism × Like poles repel each other.</Step>
          <Step>Step 3: State the final movement outcome × Since the poles are both North, they will push away from each other. Outcome: The magnets will experience repulsion, pushing away from each other.</Step>
        </WorkedExample>
        <WorkedExample title="Example 2: Calculating Percentage Water Composition in Soil Structures" problem="A group of Grade 5 students heated a 200 g sample of fresh garden soil in an open container to evaporate its water content. After heating, the completely dry soil sample weighed 160 g. Calculate the total percentage of water present in the original soil sample.">
          <Step>Step 1: Write down the formula for water mass loss × Mass of Soil Water = Initial Fresh Soil Mass - Final Dry Soil Mass.</Step>
          <Step>Step 2: Calculate the mass loss value × 200 g - 160 g = 40 g.</Step>
          <Step>Step 3: Apply the percentage composition formula × Percentage of Water = (Mass of Soil Water × Initial Fresh Soil Mass) × 100%.</Step>
          <Step>Step 4: Complete the calculation × (40 × 200) × 100% = 0.2 × 100% = 20%. The garden soil sample contained 20% water.</Step>
        </WorkedExample>
        <WorkedExample title="Example 3: Determining Total Soluble Material Yield Rates" problem="A researcher dissolves 15 grams of pure table salt into 150 grams of clean water. Calculate the total weight of the resulting saline solution, and find the concentration percentage of salt in the mixture.">
          <Step>Step 1: Calculate the total mass of the final solution × Total Solution Mass = Mass of Solute (Salt) + Mass of Solvent (Water). 15 g + 150 g = 165 g.</Step>
          <Step>Step 2: Write down the concentration percentage formula × Concentration Percentage = (Mass of Solute × Total Solution Mass) × 100%.</Step>
          <Step>Step 3: Complete the calculation × (15 × 165) × 100% = (1/11) × 100% × 9.09%. The saline solution weighs 165 g and has a concentration percentage of 9.09%.</Step>
        </WorkedExample>
        <WorkedExample title="Example 4: Converting Volumetric Capacity Units for Rainfall Analysis" problem="A weather station records 2.5 Litres of rainwater collected in a standard rain gauge container. Convert this total volume capacity into Millilitres (mL) for detailed data entry.">
          <Step>Step 1: Identify the standard conversion factor × 1 Litre (L) = 1,000 Millilitres (mL).</Step>
          <Step>Step 2: Set up the multiplication step × To convert a larger unit to a smaller unit, multiply by the conversion factor: 2.5 × 1,000.</Step>
          <Step>Step 3: Shift the decimal point to find the answer × Move the decimal point three places to the right: 2.5 → 25 → 250 → 2,500 mL. The rain gauge collected 2,500 mL of water.</Step>
        </WorkedExample>
        <WorkedExample title="Example 5: Calculating Frictional Drag Countermeasures" problem="A worker needs to slide a heavy wooden crate across a rough concrete floor. The frictional resistance force between the crate and the floor creates a backward drag force of 120 Newtons. What is the minimum forward pushing force the worker must apply to move the crate?">
          <Step>Step 1: Analyze the direction of the forces × Friction creates a backward resistance force of 120 N.</Step>
          <Step>Step 2: Apply the law of balanced forces × To overcome friction and start moving the crate, the forward pushing force must be strictly greater than the opposing frictional force.</Step>
          <Step>Step 3: State the required force × Minimum Pushing Force &gt; 120 N. The worker must apply a forward pushing force of at least 121 Newtons.</Step>
        </WorkedExample>
      </Section>

      <Section title="Section 6: Comprehensive Science Question and Answer Bank">
        <SubSection title="6.1 Interactive Multiple-Choice Questions">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Which plant reproduces by producing spores rather than seeds?</strong> B) Fern Plant.</p>
            <p><strong>2. Which organ system breaks down food into absorbable nutrients?</strong> B) Digestive System.</p>
            <p><strong>3. What primary site of gaseous exchange contains thin-walled air sacs wrapped in dense capillaries?</strong> B) Alveoli Lungs.</p>
            <p><strong>4. A soil type with extremely fine particles, excellent water retention, and poor drainage is:</strong> C) Clay Soil.</p>
            <p><strong>5. What water-borne illness is caused by Salmonella typhi?</strong> C) Typhoid Fever.</p>
            <p><strong>6. The physical process where a gas cools down and transforms back into a liquid state is:</strong> D) Condensation.</p>
            <p><strong>7. Tracing paper rubbed with oil that gives a blurry view is classified as:</strong> B) Translucent.</p>
            <p><strong>8. If South Pole (S) is brought close to South Pole (S) of another magnet, what happens?</strong> B) They will push apart via repulsion.</p>
            <p><strong>9. Which organism belongs to the Fungi Kingdom and is used in baking?</strong> C) Yeast Organism.</p>
            <p><strong>10. What type of force acts in the opposite direction of movement to resist sliding?</strong> A) Frictional Force.</p>
          </div>
        </SubSection>
        <SubSection title="6.2 Short-Answer Questions">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>1. Explain why a mushroom is classified under Fungi rather than Plants.</strong> Answer: A mushroom lacks chlorophyll and cannot perform photosynthesis. It is saprophytic, absorbing nutrients from decaying organic matter.</p>
            <p><strong>2. Define peristalsis and state where it takes place.</strong> Answer: Peristalsis is the automatic, wave-like contraction and relaxation of muscles along the walls of the alimentary canal. It takes place in the oesophagus to push swallowed food down into the stomach.</p>
            <p><strong>3. Give two reasons why loam soil is best for growing crops.</strong> Answer: Loam contains a balanced mixture of sand, silt, and clay. It has moderate water retention (enough for roots) and excellent drainage (preventing waterlogging), while being rich in organic matter (humus).</p>
            <p><strong>4. Describe how a pinhole camera demonstrates that light travels in straight lines.</strong> Answer: Light rays from the top and bottom of an object pass through the tiny pinhole in straight lines without bending, crossing over to create an inverted image on the screen inside the box.</p>
            <p><strong>5. State the rules for magnetic attraction and repulsion.</strong> Answer: Like poles repel each other (North pushes away from North, South pushes away from South). Unlike poles attract each other (North and South pull together).</p>
          </div>
        </SubSection>
      </Section>

      <Section title="Section 7: Summary Core Science Formulas">
        <BulletList items={[
          'Soil Moisture Loss Value: Fresh Soil Weight - Dry Soil Weight = Water Weight.',
          'Percentage of Soil Water: (Water Weight × Fresh Soil Weight) × 100%.',
          'Total Solution Weight: Mass of Solute + Mass of Solvent.',
          'Solution Concentration: (Mass of Solute × Total Solution Weight) × 100%.',
          'Magnetic Interaction: Like Poles = Repel | Unlike Poles = Attract.',
          'Capacity Conversions: 1 Litre (L) = 1,000 Millilitres (mL).'
        ]} />
      </Section>

      <Section title="Section 9: Plants and Crop Production × Growth Conditions and Pests">
        <SubSection title="9.1 Factors Necessary for Plant Growth">
          <BulletList items={[
            'Sunlight: Provides radiant energy trapped by chlorophyll within chloroplasts. This energy fuels the chemical reactions that combine carbon dioxide and water to synthesize glucose.',
            'Water: Serves as a universal solvent. It dissolves mineral salts in the soil so they can be absorbed through root hair cells. It also maintains cell turgidity, keeping the plant erect, and acts as a raw material in photosynthesis.',
            'Air (Carbon Dioxide and Oxygen): Carbon dioxide is essential for photosynthesis. Oxygen is required by night and day for plant cellular respiration, which breaks down stored sugars to release growth energy.',
            'Soil and Mineral Nutrients: Soil provides physical support for root anchoring. It also supplies key macronutrients like nitrogen (N) for leaf growth, phosphorus (P) for root development, and potassium (K) for disease resistance.'
          ]} />
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                  PHOTOSYNTHESIS CHEMICAL INFLOW/OUTFLOW
                     Radiant Sunlight Energy
                             ×
                             ?
  [Carbon Dioxide] + [Water] ---? [Glucose Sugar] + [Oxygen Gas]
  (From Atmosphere) → (From Soil)    (Stored Food)   (Released Out)`}</pre>
        </SubSection>
        <SubSection title="1.2 Common Crop Pests and Their Effects">
          <BulletList items={[
            'Field Pests: Attack crops while they are still growing out in the fields (e.g., aphids, stalk borers, caterpillars, locusts, and birds).',
            'Storage Pests: Attack harvested crops after they have been moved into storage facilities like granaries or silos (e.g., weevils, grain borers, rats, and mice).',
            'Defoliation: Caterpillars and locusts chew up leaves, reducing the surface area available for photosynthesis. This stunts plant growth.',
            'Sap-Sucking Damage: Aphids and whiteflies pierce plant stems or leaves to suck out nutrients. This causes leaves to curl, yellow, and wither.',
            'Boring: Stalk borers tunnel through crop stems, disrupting the internal flow of water and nutrients. This can cause the plant to collapse.',
            'Transmission of Diseases: Many pests act as vectors, carrying viral or bacterial pathogens from infected plants to healthy ones.',
            'Lower Market Value: Bored fruits or chewed grains look unappealing, reducing profits for farmers.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 10: Soil Conservation and Management">
        <SubSection title="10.1 Soil Erosion × Types and Causes">
          <p>Soil erosion is the physical detachment, transport, and removal of the fertile topsoil layer from land by agents like wind or water.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                      TYPES OF SOIL EROSION
                                ×
    +-----------------------------------------------------------+
    ?                   ?                   ?                   ?
Splash Erosion      Rill Erosion       Gully Erosion       Sheet Erosion
(Raindrop impact) (Tiny channels)    (Deep trenches)    (Uniform layer)`}</pre>
          <BulletList items={[
            'Splash Erosion: The initial stage of water erosion. It occurs when heavy raindrops hit bare, uncovered soil. The physical impact breaks up soil aggregates and splashes individual soil particles away.',
            'Rill Erosion: Occurs when fast-flowing rainwater concentrates into small, shallow channels across a slope. These tiny channels are called rills.',
            'Gully Erosion: An advanced stage that occurs when rills are left untreated. The running water cuts deeper and wider into the soil, creating steep, deep trenches called gullies. These gullies make land impossible to cultivate with machinery.',
            'Sheet Erosion: The uniform removal of a thin, entire layer of topsoil from a large, flat area of land. This type of erosion is dangerous because it happens gradually and can go unnoticed until soil fertility drops significantly.'
          ]} />
        </SubSection>
        <SubSection title="10.2 Practical Soil Conservation Methods">
          <BulletList items={[
            'Mulching: Covering bare soil surfaces between crop rows with a layer of dry organic matter, such as straw, grass, or leaves. Benefits: Absorbs the impact of raindrops to prevent splash erosion, slows evaporation to conserve soil moisture, and adds nutrients as it decomposes.',
            'Cover Cropping: Planting low-growing, dense crops (such as beans, cowpeas, or clover) that cover the soil completely. Benefits: Leaves intercept rain, and dense root systems bind soil particles together to resist erosion.',
            'Terracing: Constructing horizontal, step-like ridges across steep slopes. Benefits: Cuts long slopes into shorter sections, slowing down surface runoff and reducing its ability to wash away soil.',
            'Contour Ploughing: Ploughing and planting crops horizontally along the natural contour lines of a slope, rather than up and down. Benefits: Each crop row acts as a small dam that catches and slows down rainwater runoff.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 11: Comprehensive Water Quality and Conservation">
        <SubSection title="11.1 Water Softening and Purification Methods">
          <p>Natural water often contains suspended dirt particles, organic matter, and microscopic pathogens. It must be treated to make it safe for drinking and household use.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                   THE MUNICIPAL PURIFICATION PHASES
 [Sedimentation] --? [Coagulation] --? [Filtration] --? [Chlorination]
 (Large bits settle) (Chemical clumping) (Sand/Carbon beds) (Germs destroyed)`}</pre>
          <BulletList items={[
            'Sedimentation: Raw water is held in large reservoirs. Heavy suspended solids, such as sand and silt, naturally settle to the bottom over time due to gravity.',
            'Coagulation (Flocculation): Specialized chemicals, such as alum (aluminium sulfate), are added to the water. Alum neutralizes charges, causing tiny suspended dirt particles to clump together into larger flakes called flocs, which are easier to settle out.',
            'Filtration: Water flows through specialized beds of fine sand, gravel, and activated charcoal. This physical barrier traps smaller suspended particles, organic materials, and some microorganisms.',
            'Chlorination (Disinfection): Controlled amounts of chlorine gas or liquid chlorine compounds are mixed into the filtered water. Chlorine destroys remaining pathogenic bacteria, viruses, and parasites.',
            'Domestic Small-Scale Methods: For individual homes, the most reliable purification methods are boiling (maintaining a rolling boil for at least 1 minute to kill pathogens) and using chlorine tablets or home filtration systems.'
          ]} />
        </SubSection>
        <SubSection title="11.2 Water Conservation Strategies">
          <BulletList items={[
            'Rainwater Harvesting: Collecting and storing runoff from roofs using gutters and large storage tanks. This water can be used for irrigation, laundry, and cleaning.',
            'Recycling and Reuse: Using greywater (untreated wastewater from washing dishes, clothes, or bathing) for secondary tasks like flushing toilets or watering lawns.',
            'Drip Irrigation: Applying water directly to the base of individual plants through small tubes and emitters. This method minimizes evaporation and runoff, saving significant amounts of water compared to sprinkler systems.',
            'Repairing Leaks: Regularly maintaining pipes, taps, and storage tanks prevents water waste from hidden leaks.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 12: Human Health × Diseases and Immunity">
        <SubSection title="12.1 Communicable vs. Non-Communicable Diseases">
          <BulletList items={[
            'Communicable (Infectious) Diseases: Diseases that can spread from an infected person, animal, or environment to a healthy person. Caused by pathogens like bacteria, viruses, fungi, or parasites. Transmission Routes: Airborne droplets (flu, tuberculosis), contaminated food/water (cholera, typhoid), or vectors like insects (malaria). Key Examples: Influenza, Tuberculosis (TB), Malaria, Cholera, Covid-19, and Measles.',
            'Non-Communicable Diseases: Diseases that cannot spread from person to person. Typically caused by genetic factors, nutritional deficiencies, lifestyle choices, or environmental hazards. Key Examples: Diabetes, Cancer, Hypertension (high blood pressure), Asthma, and Kwashiorkor (severe protein deficiency).'
          ]} />
        </SubSection>
        <SubSection title="12.2 Pathogens and Insect Vectors">
          <p>A vector is an animal or insect that carries and transmits pathogens from an infected host to a healthy individual without getting sick itself.</p>
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Vector Insect</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Pathogen Type</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Disease Caused</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Primary Symptoms</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Female Anopheles</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Plasmodium (Parasite)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Malaria</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Chills, high fever, sweating, headaches</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Culex Mosquito</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Filarial Worms</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Elephantiasis</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Severe swelling of lower limbs</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Tsetse Fly</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Trypanosoma (Protozoa)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Sleeping Sickness</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Fever, extreme fatigue, lethargy</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Housefly</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Bacteria (Mechanical Carrier)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Dysentery / Cholera</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Severe abdominal cramps, diarrhoea</td></tr>
            </tbody>
          </table>
        </SubSection>
      </Section>

      <Section title="Section 13: Computational Devices, Coding, and Technology Foundations">
        <SubSection title="13.1 Elements of Computer Systems">
          <BulletList items={[
            'Input Devices: Hardware components used to enter raw data and commands into the computer. Examples: Keyboard (typing text), Mouse (clicking menus), Scanner (digitalizing documents), and Microphone (recording audio input).',
            'Processing Unit (CPU): The Central Processing Unit is the "brain" of the computer. It executes program instructions and performs arithmetic and logical operations.',
            'Output Devices: Hardware components that display the processed information in a readable format for the user. Examples: Monitor/Screen (visual output display), Printer (hard-copy paper documents), and Speakers (audio output sound).',
            'Storage Devices: Hardware used to save data and programs permanently. Examples: Hard Disk Drive (HDD), Solid State Drive (SSD), and portable USB Flash Drives.'
          ]} />
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                     THE COMPUTATIONAL PROCESS FLOW
    [Input Phase]   --?   [Processing Phase]   --?   [Output Phase]
 (Keyboard / Mouse)       (CPU Operations)          (Monitor / Printer)`}</pre>
        </SubSection>
        <SubSection title="13.2 Visual Programming Concepts (Scratch Blocks)">
          <BulletList items={[
            'Events Blocks (Yellow): These blocks detect triggers to start a program or action sequence. The most common trigger block is when green flag clicked.',
            'Motion Blocks (Dark Blue): These blocks control the physical movement and rotation of characters (sprites) on the screen. Examples: move 10 steps, turn right 15 degrees.',
            'Looks Blocks (Purple): These blocks change the sprite\'s appearance, handle speech bubbles, or switch background scenes. Examples: say Hello! for 2 seconds, switch costume to costume2.',
            'Control Blocks (Gold/Orange): These blocks manage loops and conditional logic within the program. Examples: repeat 10, forever, if...then.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 14: Practical Scientific Tools and Instrument Design">
        <SubSection title="14.1 Construction of a Liquid Thermometer">
          <p>A thermometer measures temperature based on the property of liquid thermal expansion (liquids expand when heated and contract when cooled).</p>
          <BulletList items={[
            'Materials Needed: A small plastic bottle, clear straw, water, food coloring, modeling clay, and index marker cards.',
            'Assembly Steps: Fill the small bottle completely with water and add a few drops of food coloring. Push the clear plastic straw down through the center of the bottle cap. Seal the bottle cap and the area around the straw tightly with modeling clay. Gently squeeze the bottle until the colored water rises slightly up into the straw. Mark this initial height as room temperature. Place the bottle in hot water; the liquid will expand and rise up the straw. When placed in cold water, the liquid will contract and drop down.'
          ]} />
        </SubSection>
        <SubSection title="14.2 Construction of a Wind Vane">
          <p>A wind vane is a meteorological instrument used to show the direction from which the wind is blowing.</p>
          <BulletList items={[
            'Materials Needed: A wooden base stand, a vertical support pin or nail, a plastic straw (the arrow shaft), thick card stock (for the arrow head and tail), a plastic pen casing (low-friction pivot), and a compass to align directional markers (N, S, E, W).',
            'Assembly Steps: Cut a pointed arrowhead and a wide tail fin out of the thick card stock. Glue the arrowhead onto one end of the plastic straw and the tail fin onto the opposite end. Find the exact balance point of the straw assembly and push a pin vertically through it into the low-friction pivot casing. Mount the pivot assembly on top of the vertical support nail on the wooden base stand. The arrow must be able to rotate freely 360 degrees. Attach directional markers (N, S, E, W) to the wooden base stand. Use a compass to align the North marker correctly during outdoor setup.',
            'Operating Rule: When wind blows, it exerts force on the wide tail fin, turning the arrow. The pointed arrowhead will always point into the direction from which the wind is blowing.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 15: Extended Science Practice Question and Answer Bank">
        <SubSection title="15.1 Advanced Multiple-Choice Questions">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Which raw material gas is absorbed by green plants from the atmosphere to perform photosynthesis?</strong> B) Carbon Dioxide.</p>
            <p><strong>2. A storage pest that tunnels into dried corn grains and destroys harvested crops inside a granary is:</strong> C) A maize weevil.</p>
            <p><strong>3. The uniform removal of a thin, flat layer of fertile topsoil from wide fields by sheet runoff water is called:</strong> B) Sheet erosion.</p>
            <p><strong>4. Which soil conservation method involves covering the ground between crop rows with dry grass or leaves?</strong> C) Mulching.</p>
            <p><strong>5. What chemical process is used during municipal water purification to destroy remaining pathogens?</strong> B) Chlorination.</p>
            <p><strong>6. Which disease is correctly classified as a non-communicable lifestyle disease?</strong> C) Diabetes.</p>
            <p><strong>7. What vector insect transmits the Trypanosoma protozoa that causes sleeping sickness?</strong> B) Tsetse Fly.</p>
            <p><strong>8. In a computer system, which component is classified as an input device?</strong> C) Keyboard.</p>
            <p><strong>9. Which color-coded Scratch block category is used to trigger a program?</strong> B) Events Blocks.</p>
            <p><strong>10. When setting up a wind vane outdoors, what direction does the pointed arrowhead indicate?</strong> B) The direction from which the wind is blowing.</p>
          </div>
        </SubSection>
        <SubSection title="15.2 Advanced Short-Answer Questions">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>1. Explain how coagulation helps clean dirty water.</strong> Answer: Coagulation uses chemicals like alum to clump tiny, suspended dirt particles together into larger flakes called flocs. These larger flocs settle out of the water much faster than individual dirt particles.</p>
            <p><strong>2. Describe the physical difference between rill erosion and gully erosion.</strong> Answer: Rill erosion creates small, shallow channels in the soil that can be easily flattened by regular farming tools. Gully erosion is an advanced stage that cuts deep, wide trenches into the land that cannot be removed by simple ploughing.</p>
            <p><strong>3. Why is a low-friction pivot casing important when building a wind vane?</strong> Answer: A low-friction pivot allows the wind vane to turn smoothly in response to gentle breezes. High friction could cause the arrow to get stuck, giving inaccurate wind direction readings.</p>
            <p><strong>4. Define the term vector and give one example.</strong> Answer: A vector is an organism, like an insect, that carries and transmits a disease-causing pathogen from one host to another without getting sick itself. For example, the female Anopheles mosquito is a vector that transmits the malaria parasite.</p>
            <p><strong>5. What is the function of a conditional if...then block in programming?</strong> Answer: An if...then block is a decision-making structure. It checks a condition; if the condition is true, the computer runs the instructions inside the block. If the condition is false, those instructions are skipped.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="Section 16: Science and Technology Primary Master Examination">
        <p><strong>Time Allowed: 2 Hours 30 Minutes</strong></p>
        <SubSection title="Part I: Multiple-Choice Questions (40 Marks)">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. A mushroom lacking chlorophyll is best classified as:</strong> C) Non-flowering spore-bearing fungus.</p>
            <p><strong>2. Which pair contains ONLY warm-blooded vertebrates?</strong> B) Whale and Ostrich.</p>
            <p><strong>3. Which feature in the small intestine maximizes nutrient absorption?</strong> C) Finger-like projections called villi.</p>
            <p><strong>4. Which organ is correctly matched with its excretory waste product?</strong> C) Skin × Sweat containing water, urea, and salts.</p>
            <p><strong>5. Soil experiment: X lost water instantly, Y held all water, Z allowed moderate flow. Identify the soils:</strong> B) X: Sandy, Y: Clay, Z: Loam.</p>
            <p><strong>6. Which water-borne illness is caused by blood fluke parasites entering through skin cuts?</strong> C) Bilharzia (Schistosomiasis).</p>
            <p><strong>7. A solid transitioning directly into a gas without a liquid phase is:</strong> B) Sublimation.</p>
            <p><strong>8. If South Pole faces North Pole, what force interaction occurs?</strong> B) They will experience magnetic attraction and pull together.</p>
            <p><strong>9. Storage pest that damages grains inside granaries and a method to protect leaf crops from caterpillars:</strong> C) Maize Weevil × Planting dense cover crops.</p>
            <p><strong>10. What raw materials are combined during photosynthesis to manufacture glucose?</strong> B) Carbon Dioxide and Water.</p>
            <p><strong>11. Thin parallel channels cut across bare soil after a rainstorm indicate:</strong> B) Rill Erosion.</p>
            <p><strong>12. How does organic mulching protect topsoil from splash erosion?</strong> B) It intercepts heavy raindrops, absorbing their direct physical impact.</p>
            <p><strong>13. Which list contains ONLY non-communicable diseases?</strong> C) Diabetes and Kwashiorkor.</p>
            <p><strong>14. Identify the vector that transmits Trypanosoma protozoa causing sleeping sickness:</strong> C) Tsetse Fly.</p>
            <p><strong>15. The "brain" of a computer and an input device are:</strong> A) Central Processing Unit (CPU) × Keyboard.</p>
            <p><strong>16. To start an animation when the green flag is clicked, which block category is used?</strong> C) Events Blocks (Yellow).</p>
            <p><strong>17. A school wind vane arrow points East. This means:</strong> B) The wind is blowing from the East toward the West.</p>
            <p><strong>18. Why does liquid water rise inside a straw when placed in hot water?</strong> C) Thermal expansion of liquids when heated.</p>
            <p><strong>19. Oily tracing paper that shows a blurry view is classified as:</strong> B) Translucent.</p>
            <p><strong>20. What chemical compound is added during the final phase of municipal water treatment to destroy pathogens?</strong> D) Chlorine.</p>
          </div>
        </SubSection>

        <SubSection title="Part II: Word Problems and Mathematical Calculations (20 Marks)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Question 21: Soil Water Percentage</strong> × (a) Mass of water lost = 250 g - 210 g = 40 g. (b) Percentage of water = (40 × 250) × 100% = 16%.</p>
            <p><strong>Question 22: Concentration Calculations</strong> × (a) Total solution mass = 20 g + 180 g = 200 g. (b) Concentration percentage = (20 × 200) × 100% = 10%.</p>
            <p><strong>Question 23: Capacity Volume Conversions</strong> × 3.45 L × 1,000 = 3,450 mL.</p>
            <p><strong>Question 24: Balanced Frictional Forces</strong> × Forward pushing force must be &gt; 165 N; minimum whole Newton force = 166 N.</p>
          </div>
        </SubSection>

        <SubSection title="Part III: Short-Answer Structured Questions (40 Marks)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Question 25: Botany/Mycology</strong> × Mushrooms lack chlorophyll and cannot perform photosynthesis. They are saprophytes that absorb nutrients from decaying organic matter.</p>
            <p><strong>Question 26: Human Respiration</strong> × Inhaled air travels through trachea, bronchi, bronchioles to alveoli. Gaseous exchange occurs: oxygen diffuses into blood, carbon dioxide diffuses out to be exhaled.</p>
            <p><strong>Question 27: Soil Conservation</strong> × Rill erosion creates small, shallow channels that can be smoothed over. Gully erosion cuts deep, wide trenches. Terracing cuts long slopes into flat steps, slowing water runoff and preventing topsoil loss.</p>
            <p><strong>Question 28: Optics and Light</strong> × Rectilinear propagation means light travels in straight lines. A pinhole camera demonstrates this: light rays from top and bottom of an object cross through the pinhole, forming an inverted image.</p>
            <p><strong>Question 29: Computer Programming Logic</strong> × A forever loop repeats instructions continuously. An if...then conditional checks a condition; if true, it runs the contained actions; if false, those actions are skipped.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- SOCIAL STUDIES NOTES ----------
function SocialNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Social Studies: Complete Curriculum Guide</h2>

      <Section title="Section 1: Physical Environment and Maps">
        <SubSection title="1.1 Map Reading and Direction">
          <p>Maps are scaled representations of the earth's surface drawn on a flat surface. To read maps accurately, Grade 5 students must master the Elements of a Map and Directional Orientation.</p>
          <SubSection title="The 5 Essential Elements of a Map">
            <BulletList items={[
              'Title: Tells the reader what the map is about or the name of the area represented.',
              'Frame/Border: The boundary line that encloses the map area.',
              'Key/Legend: A box containing symbols, colours, and signs used on the map, along with their precise meanings.',
              'Scale: The ratio that shows the relationship between distances on the map and actual distances on the real ground.',
              'Compass Rose: An arrow or symbol indicating directional orientation (usually pointing to the North).'
            ]} />
          </SubSection>
          <SubSection title="Cardinal and Ordinal Compass Points">
            <p>Direction is determined using the 8-point compass rose.</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                  THE 8-POINT COMPASS ROSE
                             North (N)
                                ?
                 North-West × North-East
                     (NW) × (NE) × West (W) ----------------+---------------- East (E) × South-West × South-East
                     (SW) × (SE)
                                ?
                             South (S)`}</pre>
          </SubSection>
        </SubSection>

        <SubSection title="1.2 Main Physical Features of the Region">
          <p>Physical features are natural landforms found on the earth's surface. They are divided into relief features (highlands, lowlands) and drainage features (water bodies).</p>
          <SubSection title="1. Mountains and Highlands">
            <BulletList items={[
              'Formed through volcanic activity (volcanicity) or earth movements (folding and faulting).',
              'Volcanic Mountains: Formed when molten rock (magma) forces its way out of the earth\'s crust, cooling and hardening to build a cone-shaped mountain. Examples: Mount Kenya, Mount Elgon, and the Aberdare Ranges.',
              'Highland Climate: These regions experience cool temperatures and receive high, reliable rainfall (relief rainfall), making them ideal for agricultural settlements.'
            ]} />
          </SubSection>
          <SubSection title="2. The Great Rift Valley">
            <BulletList items={[
              'A deep, long trench or depression with steep sides called escarpments. It was formed through the process of faulting.',
              'Faulting Mechanics: Tensional or compressional forces within the earth\'s crust caused lines of weakness (faults) to crack. The block of land between the fault lines sank down, leaving steep escarpments on either side.',
              'Features Inside the Valley: The floor of the Rift Valley contains numerous volcanic hills and lakes, many of which are salty (alkaline) due to high evaporation and a lack of river outlets.'
            ]} />
          </SubSection>
          <SubSection title="3. Lakes and Rivers">
            <BulletList items={[
              'Fault-built Lakes: Formed when water filled depressions on the Rift Valley floor. They are long, narrow, and deep. Examples: Lake Turkana, Lake Baringo, Lake Nakuru, Lake Naivasha, and Lake Elementeita.',
              'Downwarping Lakes: Formed when earth movements caused the land crust to sag or sink downward over a wide area, forming a shallow basin that filled with water. Example: Lake Victoria (the largest freshwater lake in Africa).',
              'Rivers and Drainage Basins: Rivers flow from highland water towers toward lowlands or oceans. Major rivers include the Tana River and Athi-Galana-Sabaki River, which drain into the Indian Ocean.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.3 Weather and Climate">
          <p><strong>Weather:</strong> The daily state of the atmosphere in a specific place over a short period (hours or days). <strong>Climate:</strong> The average weather conditions of a large region recorded over a long period (usually 30 to 35 years).</p>
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Weather Instrument</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Atmospheric Element Measured</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Standard Metric Unit</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Thermometer</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Air Temperature</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Degrees Celsius (×C)</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Rain Gauge</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Amount of Rainfall</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Millimetres (mm)</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Barometer</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Atmospheric Air Pressure</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Millibars (mb)</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wind Vane</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Direction of the Wind</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Compass Points (N, S, E, W)</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Anemometer</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Speed of the Wind</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Kilometres per hour (km/h)</td></tr>
            </tbody>
          </table>
        </SubSection>
      </Section>

      <Section title="Section 2: People and Population Distribution">
        <SubSection title="2.1 Language Groups and Migration Patterns">
          <p>The population of Kenya and East Africa is divided into distinct language groups based on shared language traits and historical origins.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                    MAIN LANGUAGE GROUPS MIGRATION
                               ×
       +-----------------------+-----------------------+
       ?                       ?                       ?
    Bantus                  Nilotes                 Cushites
(From Congo Basin)     (From Nile Valley)    (From Horn of Africa)
 - Kikuyu, Luhya,       - Luo, Maasai,        - Somali, Galla,
   Kamba, Mijikenda       Kalendjin, Turkana    Rendille, Borana`}</pre>
          <SubSection title="1. The Bantus">
            <BulletList items={[
              'The largest language group in Kenya. They migrated from their original homeland in the Congo Basin (Central Africa) in search of fertile land for farming.',
              'Settlement Areas: They settled in highland regions, river basins, and coastal plains because they practiced crop farming.',
              'Key Subgroups: Kikuyu, Luhya, Kamba, Meru, Kisii, Embu, Taita, and Mijikenda.'
            ]} />
          </SubSection>
          <SubSection title="2. The Nilotes">
            <BulletList items={[
              'They migrated into Kenya from the Nile Valley (South Sudan) in search of fresh pasture and water for their livestock, or better fishing grounds.',
              'River-Lake Nilotes: The Luo, who settled around the Lake Victoria basin and practiced fishing and crop farming.',
              'Plains Nilotes: Pastoralists who settled in open grassland regions (e.g., Maasai, Samburu, Turkana, and Iteso).',
              'Highland Nilotes: Pastoralists and crop farmers who settled in the Rift Valley highlands (e.g., the Kalenjin subgroups like the Nandi, Kipsigis, Pokot, and Tugen).'
            ]} />
          </SubSection>
          <SubSection title="3. The Cushites">
            <BulletList items={[
              'They migrated from the Horn of Africa (Ethiopia and Somalia). Most settled in arid and semi-arid regions of northern and eastern Kenya due to their nomadic pastoralist lifestyle.',
              'Key Subgroups: Somali, Borana, Galla, Rendille, and Orma.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="2.2 Population Density Factors">
          <BulletList items={[
            'High Population Density: Reliable Rainfall and Fertile Soil (highland areas like Kiambu, Kisii, Kakamega), Urbanization and Employment (Nairobi, Mombasa, Kisumu), Security and Transport Networks.',
            'Low Population Density: Arid and Semi-Arid Climates (Turkana, Marsabit, Wajir), Pests and Diseases (tsetse fly areas).'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 3: Resources and Economic Activities">
        <SubSection title="3.1 Agriculture and Crop Production">
          <BulletList items={[
            'Food Crops: Grown primarily for household consumption × Maize, beans, potatoes, cassava, sorghum, bananas.',
            'Cash Crops: Grown for sale in local markets or export × Tea, Coffee, Pyrethrum, Sisal, Sugar cane, Cotton.',
          ]} />
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Cash Crop</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Ideal Temperature</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Rainfall Requirement</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Soil Preference</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Tea</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Cool to Warm (15°C × 25°C)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>High, well-distributed (1500mm × 2000mm)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Deep, acidic, well-drained volcanic soils</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Coffee</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Warm (15°C × 27°C)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Moderate (1000mm × 1500mm)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Deep, fertile, volcanic soils on sloped terrain</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Sugar cane</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Hot / Tropical (&gt;21°C)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>High, stable (1200mm × 1500mm)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Heavy, fertile clay or loam soils on flat land</td></tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title="3.2 Livestock and Pastoralism">
          <BulletList items={[
            'Dairy Farming: Rearing cattle specifically for milk production. Practiced in cool, wet highland areas (Meru, Nyandarua, Kericho). Breeds: Friesian, Guernsey, Ayrshire, Jersey.',
            'Pastoralism: A nomadic lifestyle where communities move with their livestock (cattle, sheep, goats, camels) in search of pasture and water. Practiced in arid and semi-arid lowlands by the Maasai, Turkana, and Somali.'
          ]} />
        </SubSection>

        <SubSection title="3.3 Wildlife, Forestry, and Tourism">
          <BulletList items={[
            'Wildlife Conservation: Protecting wild animals and plants in natural habitats. National parks and reserves (Tsavo, Maasai Mara, Amboseli) protect animals from poaching.',
            'Forestry: Management and protection of forest resources. Forests are water towers that regulate climate, protect soil, and supply timber and firewood.',
            'Tourism: Visitors travel to see wildlife, beaches, and cultural heritage sites. A major source of foreign exchange and service jobs.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 4: History, Citizenship, and Governance">
        <SubSection title="4.1 Traditional Leadership and Social Structures">
          <p>Before colonial rule, African communities were organized under traditional governance systems that used council systems, clan leadership, or kingdoms.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                   EXAMPLES OF TRADITIONAL LEADERSHIP
  [Maasai Community]   --? → Led by an Oloiboni (A respected spiritual prophet).
  [Ameru Community]    --? → Governed by the Njuri Ncheke (A supreme council of elders).
  [Wanga Kingdom]      --? → Ruled by a Nabongo (A hereditary dynastic king).`}</pre>
          <BulletList items={[
            'Roles of Traditional Councils of Elders: Settling disputes between families or clans over land boundaries. Presiding over traditional religious ceremonies, blessings, and sacrifices. Making laws to guide the community and punishing lawbreakers. Declaring war or peace with neighboring communities and governing age-set systems.'
          ]} />
        </SubSection>

        <SubSection title="4.2 Citizenship and National Integration">
          <BulletList items={[
            'Citizenship: The legal status of being an official member of a specific country, which grants a person legal rights and duties.',
            'By Birth: If a person is born to parents who are Kenyan citizens.',
            'By Registration: A foreign national can apply to legally register as a citizen if they marry a Kenyan citizen or live in Kenya continuously for a specific number of years.',
            'National Symbols of Unity: The National Flag (Black: people, Red: struggle for freedom, Green: agriculture, White: peace, with shield and spears). The National Anthem (prayer promoting peace, unity, hard work). The Coat of Arms (official seal with two lions, shield, and motto "Harambee" × let us pull together).'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 5: Social Studies Question and Answer Revision Bank">
        <SubSection title="5.1 Multiple-Choice Questions">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Which element of a map explains the meaning of symbols and colours?</strong> C) The Key or Legend.</p>
            <p><strong>2. The Great Rift Valley was formed through:</strong> C) Faulting caused by internal tensional or compressional forces.</p>
            <p><strong>3. Which language group migrated from the Congo Basin?</strong> C) The Bantus.</p>
            <p><strong>4. High rainfall, cool temperatures, fertile volcanic soils attract:</strong> B) A dense, high population density.</p>
            <p><strong>5. Which cash crop grows best in cool highland climates with deep, acidic, well-drained volcanic soils?</strong> C) Tea.</p>
            <p><strong>6. The traditional supreme council of elders of the Ameru community:</strong> B) The Njuri Ncheke.</p>
            <p><strong>7. Red on the Kenyan National Flag represents:</strong> C) The blood shed during the struggle for independence.</p>
            <p><strong>8. What instrument measures wind speed?</strong> B) Anemometer.</p>
            <p><strong>9. Citizenship by Registration applies to:</strong> B) A foreign national who applies to become a legal citizen.</p>
            <p><strong>10. Lake Victoria was formed by:</strong> C) Downwarping of the earth's crust.</p>
          </div>
        </SubSection>

        <SubSection title="5.2 Short-Answer Questions">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>1. State three roles performed by traditional councils of elders.</strong> Answer: Settling disputes (land boundaries, family conflicts), acting as judges to punish lawbreakers, planning community ceremonies and sacrifices, and deciding on strategic matters like declaring war or peace.</p>
            <p><strong>2. Explain the difference between weather and climate.</strong> Answer: Weather is the short-term, day-to-day state of the atmosphere in a specific place (e.g., a rainy afternoon). Climate is the average weather condition of a large area recorded over a long period (30 to 35 years).</p>
            <p><strong>3. Name three national symbols of unity in Kenya.</strong> Answer: The National Flag, the National Anthem, and the Public Seal/Coat of Arms (featuring the motto Harambee).</p>
            <p><strong>4. Identify two factors that cause low population density in northern Kenya.</strong> Answer: Arid and semi-arid climate with low, unreliable rainfall, and poor sandy soils that cannot support large-scale farming.</p>
            <p><strong>5. What is pastoralism, and name two communities that practice it.</strong> Answer: Pastoralism is a livestock-rearing lifestyle where communities move herds from place to place in search of pasture and water. Two communities: the Maasai and the Turkana (or Somali/Borana).</p>
          </div>
        </SubSection>
      </Section>

      <Section title="Section 6: Weather, Climate, and Vegetation Zones">
        <SubSection title="6.1 Elements of Weather and Climate Dynamics">
          <p>Weather patterns vary daily across the region due to the interaction of major atmospheric elements. Grade 5 students must understand how these elements affect local environments and human activities.</p>
          <BulletList items={[
            'Temperature: The degree of hotness or coldness of the atmosphere, measured using a Max-Min (Six\'s) Thermometer in degrees Celsius (×C).',
            'Rainfall: Moisture falling from clouds as rain, measured using a Rain Gauge in millimetres (mm).',
            'Wind Direction and Speed: Wind direction is measured using a Wind Vane, which points from which the wind blows. Wind speed is tracked using an Anemometer in kilometres per hour (km/h).',
            'Air Pressure: The weight of air pressing down on the earth\'s surface, measured using a Barometer in millibars (mb).'
          ]} />
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                  THE WATER CYCLE AND RAINFALL MECHANICS
                       Radiant Sunlight Energy
                                ×
                                ?
  [Evaporation from Lakes] ---? [Condensation in Clouds] ---? [Relief / Conventional Rainfall]`}</pre>
        </SubSection>

        <SubSection title="6.2 Major Climate Zones of the Region">
          <BulletList items={[
            'Equatorial Climate Zone: High temperatures throughout the year (above 25°C) and high, well-distributed rainfall (over 2000mm annually). No distinct dry season. Locations: Lake Victoria Basin and coastal lowlands.',
            'Tropical Savannah Climate Zone: Alternating wet (rainy) and dry seasons. Temperatures generally warm to hot. Locations: Vast plains and plateau regions. Supports scattered trees and tall grasses.',
            'Arid and Semi-Arid Climate Zone: Very low, unreliable rainfall (less than 500mm per year) and extremely high daytime temperatures. Nights can be quite cold. Locations: Northern and eastern parts of Kenya (Turkana, Marsabit, Garissa, Wajir).',
            'Montane (Highland) Climate Zone: Cool temperatures due to high altitude (15°C × 20°C) and high, reliable relief rainfall. Locations: Central highlands (around Mt. Kenya) and western highlands (Kericho, Mau complex).'
          ]} />
        </SubSection>

        <SubSection title="6.3 Vegetation Zones and Their Characteristics">
          <p>Vegetation refers to the plant cover that grows naturally in a region. The type of vegetation found in an area depends directly on its climate and soil type.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                      REGIONAL VEGETATION ZONES
                                ×
    +-----------------------------------------------------------+
    ?                   ?                   ?                   ?
Tropical Rainforests Savannah Grasslands  Desert Scrub        Mangrove Forests
(Dense canopy, tall) (Scattered acacias) (Thorns, deep roots) (Salty coastal mud)`}</pre>
          <BulletList items={[
            'Tropical Rainforests: High rainfall, warm temperatures (Equatorial Zone). Tall, evergreen trees forming a dense canopy. Broad leaves, buttress roots. Examples: Kakamega Forest, Congo Basin extensions.',
            'Savannah Grasslands and Woodlands: Moderate, seasonal rainfall (Tropical Savannah Zone). Tall grasses with scattered, drought-resistant trees like Acacia and Baobab. Thick bark, long roots. Examples: Maasai Mara, Amboseli plains.',
            'Semi-Desert and Desert Scrub: Very low, erratic rainfall (Arid and Semi-Arid Zone). Short, thorny bushes, dry scrub, fleshy cacti. Small leaves/needles to reduce water loss, deep root systems. Examples: Chalbi Desert, Marsabit, parts of Wajir.',
            'Mangrove Forests: Hot, humid coastal climate. Specialized breathing roots (pneumatophores) growing upward out of salty, oxygen-poor mud. Examples: Mombasa and Lamu coastlines.'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 7: Mining, Industry, and Trade">
        <SubSection title="7.1 Mineral Resources and Mining Methods">
          <p>Mining is the extraction of valuable mineral resources from beneath the surface of the earth.</p>
          <BulletList items={[
            'Soda Ash: Extracted from Lake Magadi (Rift Valley). Used in glass manufacturing, soap making, paper processing. Method: Dredging.',
            'Fluorspar: Mined in Kerio Valley. Used as a fluxing agent in steel manufacturing and in toothpaste.',
            'Diatomite: Extracted at Kariandusi near Gilgil. Used as insulating material, in filtration, and paint manufacturing.',
            'Titanium: Mined along coastal areas of Kwale. Strong, lightweight metal used in aircraft and industrial manufacturing.',
            'Limestone: Mined in Bamburi (Mombasa) and Athi River. Primary raw material for cement manufacturing. Method: Open-cast mining.'
          ]} />
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                   MINING METHODS IN THE REGION
    [Open-Cast Mining] → --? Used for surface minerals like Limestone and Diatomite.
    [Dredging Method]   --? Used to scoop liquid mineral salts from Lake Magadi.
    [Underground Shaft] --? Used for deep mineral veins hidden below hard rock layers.`}</pre>
        </SubSection>

        <SubSection title="7.2 Types and Importance of Industries">
          <BulletList items={[
            'Primary (Processing) Industries: Process raw agricultural produce into semi-finished states. Examples: Tea factories, coffee hulling mills, sugar milling factories, milk creameries.',
            'Secondary (Manufacturing) Industries: Use processed materials to make complex consumer items. Examples: Cement manufacturing plants, textile mills, shoe factories, plastic processing shops.',
            'Tertiary (Service) Industries: Do not create physical items but provide vital professional services. Examples: Banking, insurance firms, transport companies, tourism, education.',
            'Importance of Industries: Create employment opportunities. Reduce dependency on expensive imports, saving national revenue. Earn foreign exchange through exports. Stimulate development of infrastructure (roads, power, water).'
          ]} />
        </SubSection>

        <SubSection title="7.3 Trade and Regional Co-operation">
          <BulletList items={[
            'Internal Trade: Buying and selling within the boundaries of the same country (e.g., selling farm produce from Meru in Nairobi).',
            'External (International) Trade: Trading across national borders. Imports (goods bought into the country × oil, vehicles, electronics). Exports (goods sold out × tea, flowers, coffee).',
            'East African Community (EAC): A regional organization grouping Kenya, Tanzania, Uganda, Rwanda, Burundi, South Sudan, and the DRC. Headquarters: Arusha, Tanzania.',
            'Aims of the EAC: Remove trade barriers (tariffs) between member states. Allow free movement of people, labor, and services. Improve regional transport links (railways, roads, communication).'
          ]} />
        </SubSection>
      </Section>

      <Section title="Section 8: Extended Practice Question and Answer Bank">
        <SubSection title="8.1 Advanced Multiple-Choice Questions">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Which climate zone has high temperatures year-round and high, well-distributed rainfall with no distinct dry season?</strong> B) Equatorial Climate Zone.</p>
            <p><strong>2. What adaptation allows mangrove trees to survive in salty, muddy coastal waters?</strong> C) Specialized upright breathing roots (pneumatophores).</p>
            <p><strong>3. From where is Soda Ash extracted using the dredging method?</strong> B) Lake Magadi.</p>
            <p><strong>4. A factory processing raw sugar cane stalks into sugar crystals is classified as:</strong> C) Primary Processing Industry.</p>
            <p><strong>5. Where are the administrative headquarters of the EAC located?</strong> C) Arusha, Tanzania.</p>
            <p><strong>6. What instrument uses a mercury column to track atmospheric air pressure?</strong> C) Barometer.</p>
            <p><strong>7. Vegetation with scattered acacia trees and tall grasses adapted to wet and dry seasons is:</strong> C) Savannah Grassland.</p>
            <p><strong>8. Which mineral resource is mined in Kwale and used in aircraft manufacturing?</strong> A) Titanium.</p>
            <p><strong>9. What term describes goods a country buys from foreign nations because it cannot produce them locally?</strong> B) Imports.</p>
            <p><strong>10. How do forests regulate climate for surrounding agricultural regions?</strong> B) They release moisture through transpiration, encouraging rainfall.</p>
          </div>
        </SubSection>
        <SubSection title="8.2 Advanced Short-Answer Questions">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>1. Distinguish between internal trade and external trade.</strong> Answer: Internal trade is buying and selling within a single country's borders. External trade is commerce across international borders between different countries.</p>
            <p><strong>2. How do plants in the semi-desert scrub zone adapt against extreme water loss?</strong> Answer: They develop small, waxy leaves or sharp needles to reduce transpiration. They have thick, fleshy stems to store water and deep root systems to reach underground water.</p>
            <p><strong>3. State two economic benefits member states gain by joining the EAC.</strong> Answer: Reduced or eliminated trade taxes (tariffs) on goods moved across borders. Free movement of citizens, labor, and services. Improved regional infrastructure (roads, railways).</p>
            <p><strong>4. Name the primary raw material mineral used in cement manufacturing and two mining locations.</strong> Answer: Limestone. Mined in Athi River (near Nairobi) and Bamburi (Mombasa).</p>
            <p><strong>5. What is the difference between a primary industry and a tertiary industry?</strong> Answer: A primary industry processes raw agricultural or natural resources into simpler forms (e.g., tea factory). A tertiary industry provides specialized services rather than physical goods (e.g., bank, transport company).</p>
          </div>
        </SubSection>
      </Section>

      <Section title="Section 9: Grade 5 Social Studies Primary Master Examination">
        <p><strong>Time Allowed: 2 Hours 30 Minutes</strong></p>
        <SubSection title="Part I: Multiple-Choice Questions (40 Marks)">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. The boxed area on a map containing symbols like a house for a school, a cross for a hospital, and a wavy line for a river is the:</strong> C) Key or Legend.</p>
            <p><strong>2. The Great Rift Valley was formed through:</strong> B) Faulting caused by internal crustal forces.</p>
            <p><strong>3. A 30-year average pattern of high relief rainfall is defined as:</strong> D) Climate.</p>
            <p><strong>4. A vegetation zone with tall, evergreen trees forming a dense canopy and buttress roots is a:</strong> B) Tropical Rainforest.</p>
            <p><strong>5. The largest language group in Kenya migrated from the Congo Basin. This group is the:</strong> C) Bantus.</p>
            <p><strong>6. The primary reason for high population density in highland districts like Kiambu, Kisii, and Kakamega is:</strong> C) Reliable rainfall and fertile volcanic soils.</p>
            <p><strong>7. A cash crop requiring cool to warm temperatures (15°C × 25°C), high well-distributed rainfall, and deep acidic well-drained volcanic soils is:</strong> D) Tea.</p>
            <p><strong>8. Nomadic communities in dry lowland plains moving with livestock in search of pasture and water practice:</strong> B) Pastoralism.</p>
            <p><strong>9. Soda Ash is extracted from saline waters at:</strong> B) Lake Magadi.</p>
            <p><strong>10. A factory that crushes fresh sugarcane stalks to process raw sugar crystals is classified as:</strong> B) Primary Processing Industry.</p>
            <p><strong>11. The supreme council of elders that governed the Ameru community is the:</strong> C) Njuri Ncheke.</p>
            <p><strong>12. In the Maasai traditional setup, the respected spiritual prophet was the:</strong> D) Oloiboni.</p>
            <p><strong>13. A foreign national who lives legally in Kenya for a specific number of years and applies to become a citizen acquires citizenship by:</strong> B) Registration.</p>
            <p><strong>14. Red on the Kenyan National Flag symbolizes:</strong> C) The blood shed during the struggle for freedom.</p>
            <p><strong>15. The administrative headquarters of the EAC are located in:</strong> C) Arusha, Tanzania.</p>
            <p><strong>16. Crude petroleum oil, motor vehicles, and electronics purchased from foreign nations are classified as:</strong> B) Imports.</p>
            <p><strong>17. Spinning metal cups used to calculate wind speed indicate the use of a/an:</strong> C) Anemometer.</p>
            <p><strong>18. A sealed capsule measuring atmospheric air pressure in millibars is a:</strong> B) Barometer.</p>
            <p><strong>19. National parks and game reserves primarily protect wild animals from:</strong> C) Illegal hunting and poaching.</p>
            <p><strong>20. Trees releasing moisture into the air through their leaves to encourage condensation into clouds is called:</strong> B) Transpiration.</p>
          </div>
        </SubSection>

        <SubSection title="Part II: Structured Short-Answer Questions (40 Marks)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Question 21: Mapping Skills and Cardinal Directions (8 Marks)</strong></p>
            <p>Draw a standard 8-point compass rose labeling all 4 cardinal points (N, S, E, W × 1 mark each) and all 4 ordinal points (NE, SE, SW, NW × 1 mark each).</p>
            <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{`                             N
                             ?
                 NW × NE
                    \\        ×        /
                      \\      ×      /
            W -----------+----------- E
                      /      ×      \\
                    /        ×        \\
                 SW × SE
                             ?
                             S`}</pre>
            <p><strong>Question 22: Migration and Settlement Analysis (8 Marks)</strong></p>
            <p>State three primary reasons the Nilotes migrated from the Nile Valley (South Sudan) into East Africa. Answer: (1) Search for fresh pasture and water for their livestock herds. (2) Population pressure / overcrowding in their original homeland. (3) Internal conflicts or wars between different clans. (Also accept: outbreaks of diseases and pests affecting humans or livestock).</p>
            <p><strong>Question 23: Industrial Economics (8 Marks)</strong></p>
            <p>Distinguish between a primary processing industry and a tertiary service industry with one practical example for each in Kenya. Answer: A primary processing industry processes raw agricultural produce or natural resources into semi-finished states (e.g., tea factory, coffee hulling mill, sugar milling). A tertiary service industry provides specialized services to consumers and businesses instead of making physical products (e.g., banking, insurance, transport companies, schools).</p>
            <p><strong>Question 24: Civics and Governance Structures (8 Marks)</strong></p>
            <p>Identify the three universal national symbols of unity in Kenya and explain how they help promote national integration. Answer: The three symbols are the National Flag, the National Anthem, and the Public Seal/Coat of Arms. They give citizens a shared identity and a sense of belonging to a single nation regardless of ethnic background. Singing the National Anthem together encourages patriotism, and the motto "Harambee" promotes teamwork and peaceful coexistence.</p>
            <p><strong>Question 25: Mineral Resource Extraction (8 Marks)</strong></p>
            <p>Name the mineral resource mined at Lake Magadi, describe the extraction method, and state two industrial uses. Answer: Mineral: Soda Ash (Sodium Carbonate). Extraction method: The dredging method × a floating dredge scoops raw trona crystals from the lake liquid and pumps them to a processing factory. Industrial uses: (1) Manufacturing glass. (2) Soap and detergent processing. (Also accept: paper manufacturing).</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- CRE NOTES ----------
function CRENotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? CRE: Christian Religious Education</h2>

      <Section title="STRAND 1: CREATION AND THE CHRISTIAN PURPOSE">
        <SubSection title="Sub-Strand 1.1: Personal Talents, Unique Abilities, and Divine Purpose">
          <p>God did not design any human being by accident. Every person is born into the world with a dual layer of identity: unique talents and unique abilities. In the Christian faith, understanding the distinction between these two elements is the foundation of discovering your destiny.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                           +------------------------+
                           |   God's Divine Plan    |
                           +-----------+------------+
                                       ×
                   +-------------------+-------------------+
                   ×                                       ×
        +----------v----------+                 +----------v----------+
        |  Natural Talents    |                 |  Acquired Abilities |
        | (Inborn gifts from  |                 | (Developed through  |
        |  God e.g. Singing)  |                 |  practice/learning) |
        +----------+----------+                 +----------+----------+
                   ×                                       ×
                   +-------------------+-------------------+
                                       ×
                                       v
                        +------------------------------+
                        |  Fulfilling Human Purpose    |
                        | (Serving God & Society)      |
                        +------------------------------+`}</pre>
          <SubSection title="1. Key Definitions and Concepts">
            <BulletList items={[
              'Talent: A natural skill or an inborn capability to do something remarkably well without formal training. Examples include a beautiful natural singing voice, an eye for art, or natural athletic speed.',
              'Ability: The power, knowledge, or skill to perform a specific task. While talents are inborn, abilities can be developed, trained, and sharpened over time through constant practice, school instruction, and dedication.',
              'Purpose: The ultimate reason for which something was created or why it exists. In Christian Religious Education, purpose is the divine assignment that God has planned for your life.',
              'Plan: A detailed scheme, method, or program worked out beforehand to achieve an objective. God has a master plan for every student, which is discovered when talents and abilities are correctly used to serve others.'
            ]} />
          </SubSection>
          <SubSection title="2. Biblical Foundations: The Parable of the Talents (Matthew 25:14°30)">
            <p>Jesus told a story of a master who was going on a long journey. Before leaving, he entrusted his wealth to his three servants according to their individual abilities:</p>
            <BulletList items={[
              'The First Servant: Received five talents of money. He immediately went to work, traded with them, and gained five more talents.',
              'The Second Servant: Received two talents of money. He also worked hard, invested wisely, and gained two more talents.',
              'The Third Servant: Received one talent of money. Driven by fear, laziness, and a wrong view of his master, he dug a hole in the ground and hid the money.'
            ]} />
            <p>When the master returned, he called them to give an account. The first two servants were highly praised: "Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master's happiness!" The third servant was condemned as a "wicked, lazy servant." His single talent was taken away and given to the one with ten talents, and he was cast into outer darkness.</p>
            <p><strong>Key Lessons for CBC Learners:</strong> God gives gifts to everyone; no one is left empty-handed. We are expected to work hard and maximize our gifts, not hide them out of laziness or fear. Failing to use what God gave you is a sin of omission and carries serious spiritual consequences. God rewards faithfulness and hard work, not just the size of the gift.</p>
          </SubSection>
          <SubSection title="3. Practical Exploitation of Talents and Abilities">
            <BulletList items={[
              'In School: Joining the school choir, representing your class in soccer matches, participating in Drama and Music Festivals, or offering peer tutoring to classmates who struggle with mathematics or languages.',
              'In Church: Volunteering to read scriptures during Sunday service, playing musical instruments during praise and worship, assisting Sunday school teachers in organizing chairs, or cleaning the sanctuary.',
              'In the Community: Organizing youth cleaning clean-ups in local markets, participating in tree-planting holidays, or helping elderly neighbors fetch water or cook.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="Sub-Strand 1.2: Human Beings as Co-Workers with God">
          <p>God did not abandon the earth after creation. Instead, He appointed human beings as stewards and co-workers to manage, preserve, and protect His world.</p>
          <BulletList items={[
            'Being a "co-worker" means participating in God\'s ongoing creative and sustaining work on earth. God provides the natural materials, but humans use their minds, energy, and spirits to build up society in an orderly way.',
            'Genesis 1:26°28: God said, "Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals..." This establishes human dominion over creation as a sacred duty to protect, not a license to destroy.',
            'Genesis 2:15: "The Lord God took the man and put him in the Garden of Eden to work it and take care of it." This shows that work is holy and was part of God\'s plan even before sin entered the world.',
            'Responsibilities Delegated to Humans by God: Environmental Stewardship × cultivating land sustainably, preventing soil erosion, protecting water catchments, planting indigenous trees. Animal Welfare × providing clean water, proper veterinary care, shelter. Social Justice × building communities where the weak, poor, and vulnerable are treated with dignity and fairness.'
          ]} />
        </SubSection>

        <SubSection title="The Menace of Child Labor: Distinguishing Work from Exploitation">
          <BulletList items={[
            'Definition of Child Labor: Any work that deprives children of their childhood, their potential, and their dignity, and that is harmful to their physical and mental development. It interferes with their regular schooling.',
            'Causes of Child Labor in Kenya: Severe family poverty forcing children to earn income. Death of parents due to illness, leading to child-headed households. Parental negligence and abandonment. Greed by business owners seeking cheap labor.',
            'Effects of Child Labor: High school dropout rates and chronic illiteracy. Physical injuries, stunted growth, and exposure to toxic substances. Emotional depression and loss of self-esteem. Vulnerability to criminal activities and early teenage pregnancies.'
          ]} />
        </SubSection>

        <SubSection title="Sub-Strand 1.3: The Fall of Human Beings and the Mechanics of Disobedience">
          <p>The perfect relationship between God and humanity was broken in the Garden of Eden. This event is known as the "Fall of Man."</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                 Perfect Communion (Garden of Eden) × Disobedience (Eating Forbidden Fruit)
                                 ×
            +-----------------------------------------+
            ?                                         ?
   Immediate Consequences                    Long-term Realities
   - Guilt and shame                         - Separation from God
   - Fear of God's presence                  - Pain, sweat, and hard labor
   - Blame-shifting (Adam/Eve)               - Introduction of physical death`}</pre>
          <BulletList items={[
            'Genesis 3:1°13: God gave Adam and Eve clear instructions × they could eat from any tree except the Tree of the Knowledge of Good and Evil. The serpent tempted Eve by distorting God\'s words. Eve listened, ate the fruit, and gave some to Adam.',
            'Immediate Consequences: Awareness of nakedness (guilt and shame). Fear of God × they ran and hid among the trees. Blame-shifting × Adam blamed Eve (and subtly God), Eve blamed the serpent. Expulsion from the Garden of Eden with cherubim and a flaming sword guarding the way back.',
            'Lessons for Moral Growth: Disobedience breaks trust between children, parents, teachers, and God. Choosing the path of honesty and following rules leads to safety and spiritual growth.'
          ]} />
        </SubSection>

        <SubSection title="Sub-Strand 1.4: Family Unity and Facing Contemporary Challenges">
          <BulletList items={[
            'Biblical Model of Family Unity: Ephesians 6:1°3 × "Children, obey your parents in the Lord, for this is right. Honor your father and mother × which is the first commandment with a promise × so that it may go well with you and that you may enjoy long life on the earth." Ephesians 6:4 × "Fathers, do not exasperate your children; instead, bring them up in the training and instruction of the Lord." Psalm 133:1 × "How good and pleasant it is when God\'s people live together in unity!"',
            'Challenges Facing Modern Families in Kenya: Financial Strains (poverty, unemployment, high cost of living). Substance Abuse (alcoholism and drug abuse leading to violence and neglect). Communication Breakdown (busy work schedules, misuse of social media). Sickness and Chronic Illness draining family savings.',
            'Resolving Family Conflicts Using Christian Values: Prayer × praying together as a family brings peace and divine intervention. Forgiveness × following Christ\'s example by forgiving family members when they make mistakes. Effective Communication × speaking the truth in love, listening carefully, avoiding angry insults. Mutual Respect × children obeying parents, parents protecting and loving their children.'
          ]} />
        </SubSection>
      </Section>

      <Section title="STRAND 2: THE BIBLE AS OUR DIVINE GUIDE">
        <SubSection title="Sub-Strand 2.1: Structure, Composition, and Categorization of the Holy Bible">
          <p>The Bible is not just a single book, but a divine library containing 66 distinct books written over a span of 1,500 years by more than 40 different human authors inspired by the Holy Spirit.</p>
          <BulletList items={[
            'The Old Testament: Contains 39 books, originally written mainly in Hebrew. It details creation, the history of the Israelite nation, the law, and prophecies about the coming Messiah.',
            'The New Testament: Contains 27 books, originally written in Greek. It focuses on the life, ministry, death, and resurrection of Jesus Christ, the growth of the early Church, and instructions for Christian living.'
          ]} />
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Testament</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Category Name</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Number of Books</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Example Books</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Old Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Law (Pentateuch)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>5</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Genesis, Exodus, Leviticus, Numbers, Deuteronomy</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Old Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>History</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>12</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Joshua, Judges, Ruth, 1 & 2 Samuel, 1 & 2 Kings, 1 & 2 Chronicles, Ezra, Nehemiah, Esther</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Old Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Poetry / Wisdom</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>5</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Old Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Major Prophets</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>5</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Old Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Minor Prophets</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>12</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Hosea through Malachi</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>New Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Gospels</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>4</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Matthew, Mark, Luke, John</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>New Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Church History</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>1</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Acts of the Apostles</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>New Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Epistles (Letters)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>21</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Romans through Jude</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>New Testament</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Prophecy</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>1</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Revelation</td></tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title="Sub-Strand 2.2: The Bible as a Daily Guide and Source of Comfort">
          <BulletList items={[
            'Psalm 119:105: "Your word is a lamp for my feet, a light on my path." God\'s word shows us how to make safe choices in an unstable world.',
            '2 Timothy 3:16°17: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work."',
            'Practical Ways of Using the Bible Daily: Reading a portion of scripture every morning before school. Memorizing verses to resist temptations like cheating or lying. Sharing Bible verses with sick, sad, or discouraged friends. Using scripture as a foundation for personal and family prayers.'
          ]} />
        </SubSection>

        <SubSection title="Sub-Strand 2.3: Historical Leadership in Israel: Stories of Wisdom and Respect">
          <SubSection title="1. King Solomon's Wisdom (1 Kings 3:16°28)">
            <p>When Solomon became king, he asked God for wisdom to lead the people justly, rather than asking for wealth or a long life. God granted his request, making him the wisest king to ever live.</p>
            <p><strong>The Case of the Two Mothers:</strong> Two women lived in the same house, and each gave birth to a baby boy. During the night, one mother accidentally rolled over her baby, and he died. She then swapped the dead baby with the living baby of the other woman while she slept. The next morning, the second woman realized the dead child was not hers. They brought their bitter dispute before King Solomon.</p>
            <p>Since there were no witnesses, Solomon called for a sword: "Cut the living child in two and give half to one and half to the other." The fake mother agreed: "Neither I nor you shall have him. Cut him in two!" The real mother, filled with deep love for her son, cried out: "Please, my lord, give her the living baby! Don't kill him!" Solomon instantly recognized the real mother by her love and compassion. He ordered the baby to be given to her unharmed.</p>
            <p><strong>Key Values Learnt:</strong> Justice and Fairness × protecting the innocent and revealing the truth. Active Listening × paying close attention to all sides before deciding. Godly Discernment × relying on God's wisdom rather than human cleverness alone.</p>
          </SubSection>
          <SubSection title="2. Respect for the Elderly: The Story of Noah and His Sons (Genesis 9:18°23)">
            <p>Noah planted a vineyard, made wine from the grapes, drank it, and became drunk. He fell asleep uncovered inside his tent. Ham, the father of Canaan, saw his father naked. Instead of covering him, he ran outside and mockingly told his two brothers. Shem and Japheth took a robe, laid it across their shoulders, and walked backward into the tent. They covered their father's nakedness while keeping their faces turned away so they would not see him uncovered. When Noah woke up and learned what had happened, he cursed Ham's descendants (Canaan) and blessed Shem and Japheth for their honor and respect.</p>
            <p><strong>Core Lessons on Respect:</strong> Never mock or expose the weaknesses and vulnerabilities of older people. Always protect the dignity of parents, elders, and leaders. Honoring elders brings blessings, while disrespect leads to dishonor.</p>
          </SubSection>
        </SubSection>
      </Section>

      <Section title="STRAND 3: THE LIFE, TEACHINGS, AND MINISTRY OF JESUS CHRIST">
        <SubSection title="Sub-Strand 3.1: John the Baptist: The Forerunner of Jesus Christ">
          <p>John the Baptist was chosen by God to prepare the hearts of the people for the arrival of the Messiah, Jesus Christ. John preached in the wilderness around the Jordan River. His message focused on repentance and the forgiveness of sins.</p>
          <BulletList items={[
            'To the General Public: "Anyone who has two shirts should share with the one who has none, and anyone who has food should do the same."',
            'To Tax Collectors: "Don\'t collect any more than you are required to." (Stop cheating and stealing from the public).',
            'To Soldiers: "Don\'t extort money and don\'t accuse people falsely × be content with your pay." (Stop abusing power and authority).',
            'Key Values: Honesty × being fair and truthful in all financial and professional duties. Social Justice and Generosity × caring for the needy by sharing food and clothing. Humility × John always pointed people toward Jesus, stating: "He who comes after me is mightier than I, whose sandals I am not worthy to carry."'
          ]} />
        </SubSection>

        <SubSection title="Sub-Strand 3.2: The Baptism of Jesus and the Commencement of His Ministry">
          <p>Jesus traveled from Galilee to the Jordan River to be baptized by John. John initially tried to refuse, saying, "I need to be baptized by you, and do you come to me?" Jesus replied, "Let it be so now; it is proper for us to do this to fulfill all righteousness."</p>
          <p>As soon as Jesus came up out of the water, heaven was opened. He saw the Spirit of God descending like a dove and lighting on Him. A voice from heaven said, "This is my Son, whom I love; with him I am well pleased." This event showed His complete obedience to God's plan, identified Him publicly with human sinners (though sinless), and was a formal confirmation of His identity as the Messiah by God the Father.</p>
        </SubSection>

        <SubSection title="Sub-Strand 3.3: Miracles of Jesus: Divine Authority Over Nature and Sickness">
          <SubSection title="1. Power Over Nature: Calming the Storm (Luke 8:22°25)">
            <p>One evening, Jesus and His disciples got into a boat to cross the lake. As they sailed, Jesus fell asleep. A fierce squall swept down, and the boat was taking on water. The terrified disciples woke Him, shouting, "Master, Master, we're going to drown!" Jesus got up and rebuked the wind and the raging waters. The storm stopped immediately, and all was calm. He asked, "Where is your faith?" In fear and amazement, they asked one another, "Who is this? He commands even the winds and the water, and they obey him."</p>
          </SubSection>
          <SubSection title="2. Power Over Sickness: Healing the Demoniac Boy (Luke 9:37°43)">
            <p>A man begged Jesus to look at his only son. A spirit would routinely seize the boy, making him scream, throw him into convulsions, cause him to foam at the mouth, and bruise him severely. The disciples had tried to drive out the spirit but lacked the faith. Jesus said, "Bring your son here." Even while the boy was coming, the demon threw him to the ground in a violent convulsion. Jesus rebuked the impure spirit, healed the boy, and gave him back to his father. Everyone was completely astonished at the greatness of God.</p>
          </SubSection>
          <p><strong>Core Lessons:</strong> Faith × trusting Jesus completely when facing scary or overwhelming situations. Compassion × following Jesus' example by helping and comforting those who are sick or suffering. Divine Sovereignty × recognizing that Jesus holds ultimate power over nature, disease, and spiritual forces.</p>
        </SubSection>
      </Section>

      <Section title="STRAND 4: THE CHURCH, CHRISTIAN UNITY, AND SACRAMENTS">
        <SubSection title="Sub-Strand 4.1: The Early Church: A Model of Christian Unity">
          <p>After Jesus ascended to heaven, the early believers lived together in a beautiful community. Acts 2:42°47 and Acts 4:32°35 describe how they dedicated themselves to the Apostles' teaching, lived in close fellowship, participated regularly in the breaking of bread and joint prayers, and shared all their possessions, selling land and property to give to anyone in need. They met together daily in the temple courts with glad and sincere hearts.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                        [ Pillars of Early Church Unity ]
                                        ×
         +-------------------------------------------------------------+
         ?                   ?                     ?                   ?
 Apostles' Teaching      Fellowship        Breaking of Bread        Prayers
  (Learning the Word)  (Sharing together)    (Holy Communion)   (Seeking God daily)`}</pre>
          <BulletList items={[
            'Defining Unity: Unity does not mean everyone looks or acts exactly the same. It means that despite our different backgrounds, tribes, races, or wealth, we are bound together by our shared faith in Jesus Christ.',
            'Practical Promotion of Christian Unity Today: Organizing joint inter-denominational prayers for national peace. Collaborating across different churches to run community projects. Welcoming visitors from different ethnic communities during church services. Refusing to participate in tribalism, gossip, or dividing people into cliques.'
          ]} />
        </SubSection>

        <SubSection title="Sub-Strand 4.2: The Sacraments of the Church: Baptism and the Holy Eucharist">
          <SubSection title="1. The Sacrament of Baptism (Matthew 28:19)">
            <p>Baptism is the holy rite of initiation into the Christian Church. Jesus commanded: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." Water represents the washing away of sins and spiritual cleansing. It symbolizes a believer dying to sin and being raised to a new life in Christ, marking a public commitment to follow Jesus.</p>
          </SubSection>
          <SubSection title="2. The Sacrament of the Holy Eucharist / Lord's Supper (1 Corinthians 11:23°26)">
            <p>The Holy Eucharist was instituted by Jesus during the Last Supper. Paul reminds us that on the night He was betrayed, Jesus took bread, gave thanks, broke it, and said, "This is my body, which is for you; do this in remembrance of me." In the same way, He took the cup, saying, "This cup is the new covenant in my blood; do this, whenever you drink it, in remembrance of me." The Bread represents the Body of Jesus broken for us. The Wine represents the Blood of Jesus shed for sins. It is a solemn remembrance of Christ's sacrifice, a regular renewal of our covenant relationship with God, and unites believers as they share from the same table as one family.</p>
          </SubSection>
        </SubSection>
      </Section>

      <Section title="STRAND 5: CHRISTIAN LIVING, MORAL VALUE SYSTEM, AND EXAM WORKBOOK">
        <SubSection title="Part A: Comprehensive Review & Key Term Glossary">
          <BulletList items={[
            'Repentance: A complete turnaround in lifestyle, characterized by turning away from sinful habits and returning to God with a sincere heart.',
            'Stewardship: The protective management and care of anything God has entrusted to your keeping, including the environment, time, and money.',
            'Exploitation: Taking unfair advantage of a person\'s vulnerability or weakness for selfish, financial gain (such as child labor).',
            'Canon of Scripture: The officially recognized and authoritative collection of books that make up the Holy Bible.',
            'Messiah: The "Anointed One" sent by God to save humanity from sin, fulfilled in Jesus Christ.'
          ]} />
        </SubSection>

        <SubSection title="Part B: Targeted Grade 5 CRE Revision Questions (KPSEA Style)">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 1:</strong> During a CBC talent day, Joan demonstrated excellence in painting, while Joseph learned to play the piano fluently. (a) Distinguish between the gifts exhibited by Joan and Joseph. (b) State three ways a learner can use their talents to serve God in their community.</p>
            <p><strong>Model Answer:</strong> (a) Joan exhibited a talent (inborn natural skill from God). Joseph exhibited an ability (skill developed through continuous practice and instruction). (b) Singing or playing instruments in the church choir. Teaching younger children Bible stories during Sunday school. Using artistic skills to design helpful posters for community cleaning days.</p>
            <p><strong>Question 2:</strong> Read Genesis 2:15: "The Lord God took the man and put him in the Garden of Eden to work it and take care of it." (a) Identify two responsibilities given to human beings. (b) Explain three negative environmental consequences when humans fail to perform these duties.</p>
            <p><strong>Model Answer:</strong> (a) The responsibility to cultivate/work the land, and to care for, guard, and preserve the environment. (b) Severe soil erosion from cutting trees without replanting. Pollution of water sources harming fish and wildlife. Droughts and crop failures from destruction of forests and water towers.</p>
            <p><strong>Question 3:</strong> A business owner employs ten young children to carry heavy stones in a quarry all day, preventing school attendance. (a) Give the technical term for this exploitation. (b) Outline four major reasons families allow children into this cycle. (c) List three physical or emotional effects on a growing child.</p>
            <p><strong>Model Answer:</strong> (a) Child Labor. (b) Severe family poverty. Loss of parents leaving child-headed households. Parental neglect or abandonment. Lack of awareness about the value of education. (c) Stunted physical growth and serious bodily injuries. Deep emotional sadness and loss of self-worth. Chronic exhaustion stopping them from thinking or learning properly.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="Christian Response to Digital Media and Contemporary Issues">
        <SubSection title="1. Christian Values in the Use of Digital Devices">
          <BulletList items={[
            'Self-Control: Managing time spent playing video games, watching videos, or browsing chat platforms.',
            'Integrity: Being honest online and avoiding the creation or sharing of false news or rumors.',
            'Respect: Communicating kindly with others online, avoiding abusive language, and avoiding cyberbullying.',
            'Responsibility: Protecting personal details and respecting other creators\' intellectual work.',
            'Biblical Reference: Galatians 5:22-23 (Fruit of the Spirit) × Self-control is a critical spiritual fruit required when using social media platforms. Christians must use digital tools to build others up rather than tear them down.'
          ]} />
        </SubSection>

        <SubSection title="2. Good Health Practices & Digital Well-being">
          <BulletList items={[
            'Physical Health Risks of Device Misuse: Eye Strain from staring at bright screens. Poor Posture leading to severe neck and back strain. Sleep Disruption from late-night screen use. Sedentary Lifestyle stopping children from healthy outdoor sports.',
            'Mental and Spiritual Challenges: Addiction × spending entire days online ruins focus on chores and schoolwork. Isolation × avoiding family unity and healthy face-to-face friendships.'
          ]} />
        </SubSection>

        <SubSection title="3. Dealing with Peer Influence on Social Media">
          <BulletList items={[
            'Choosing Friends Wisely (Proverbs 13:20): Walking with wise people online brings wisdom, while bad company brings ruin.',
            'Guarding the Mind (Philippians 4:8): Focus screen time purely on things that are true, pure, noble, and lovely.',
            'Standing Firm (Romans 12:2): Do not conform to harmful online trends; allow God to change your thinking patterns.'
          ]} />
        </SubSection>

        <SubSection title="4. Key Revision Questions (Made Familiar Style)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Question 1:</strong> A Grade 5 learner spends four hours playing mobile games instead of helping with home chores. Which Christian value is missing? <strong>Answer:</strong> Self-control and responsibility.</p>
            <p><strong>Question 2:</strong> Your school friend shares a mean, altered photograph of another student on a WhatsApp group chat. How should a Christian respond to online cyberbullying? <strong>Answer:</strong> Refuse to share the photo, tell the friend to delete it, and report the matter to a trusted teacher or parent.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="GRADE 5 CRE EXTENDED MOCK EXAMINATION">
        <p><strong>STRAND: Christian Response to Social Media, Digital Devices, and Contemporary Issues | TIME: 1 Hour 30 Minutes</strong></p>
        <SubSection title="SECTION A: MULTIPLE CHOICE QUESTIONS (20 MARKS)">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Spending five hours every evening scrolling through TikTok instead of doing homework × which fruit is lacking?</strong> B × Self-control.</p>
            <p><strong>2. A rumor on WhatsApp claims school will close. Best action?</strong> C × Verify the information with a teacher or parent before believing it.</p>
            <p><strong>3. Physical health risk of prolonged uninterrupted device use?</strong> C × Severe eye strain and blurred vision.</p>
            <p><strong>4. Applying Proverbs 13:20 on social media?</strong> B × By joining online groups that share uplifting and educational content.</p>
            <p><strong>5. Which Christian value directly helps fight cyberbullying?</strong> A × Respect.</p>
            <p><strong>6. Watching videos that teach drawing, cooking, or building fulfills God's command to:</strong> B × Cultivate our talents and skills.</p>
            <p><strong>7. Danger of sharing school location, full name, and home address online?</strong> B × It violates personal safety and opens doors to online predators.</p>
            <p><strong>8. Romans 12:2 × "Do not conform to the pattern of this world" means we should NOT:</strong> B × Copy harmful online trends, challenges, or bad language just to feel popular.</p>
            <p><strong>9. Symptom of digital device addiction?</strong> B × Feeling highly irritated and angry when asked to put the phone away.</p>
            <p><strong>10. Our bodies as the "temple of the Holy Spirit" regarding digital well-being?</strong> B × We must protect our physical and mental health by taking breaks from screens.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION B: SHORT ANSWER QUESTIONS (20 MARKS)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>11. Two positive ways to use a smartphone to grow Christian faith.</strong> Answer: Reading the Bible app; Listening to gospel music; Watching Christian animations/Bible stories; Sharing encouraging verses with friends. (Any two)</p>
            <p><strong>12. Two behavioral signs of addiction to internet video games.</strong> Answer: Neglecting school homework/household chores; Throwing tantrums when devices are confiscated; Secretly using devices at night; Losing interest in outdoor play/friends. (Any two)</p>
            <p><strong>13. One way to practice Integrity while using the internet for a school assignment.</strong> Answer: Avoiding plagiarism (copying someone else's work directly and claiming it as your own); Avoiding cheating during online quizzes. (Any one)</p>
            <p><strong>14. Two health complications from a sedentary lifestyle with tablets/computers.</strong> Answer: Poor posture/backaches; Obesity/excessive weight gain; Weakened physical muscles. (Any two)</p>
            <p><strong>15. Two examples of digital content a Christian child should avoid based on Philippians 4:8.</strong> Answer: Violent or abusive videos; Vulgar or bad language in songs/chats; Sexually explicit images or text. (Any two)</p>
          </div>
        </SubSection>

        <SubSection title="SECTION C: APPLICATION AND CASE STUDIES (10 MARKS)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>16. Case Study 1 × Cyberbullying:</strong> Moraa's friends post memes mocking a classmate who stammers. (a) Negative practice: Cyberbullying / Mockery / Lack of respect. (b) Advice: Tell the group members that mocking is wrong; Exit the group chat; Inform a teacher or parent about the bullying; Show direct kindness to the student who stammers. (Any two)</p>
            <p><strong>17. Case Study 2 × Digital Addiction:</strong> John stays up until 1:00 AM watching YouTube, his class performance has dropped. (a) Physical asset being neglected: His body / His physical health / Mind. (b) Steps to restore balance: Set a strict screen time curfew (no devices after 8:00 PM); Surrender the laptop to parents before bed; Prioritize schoolwork and sleep over videos. (Any two)</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- COMPUTER STUDIES NOTES ----------
function ComputerNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Computer Science: Comprehensive Learning & Revision Guide</h2>

      <Section title="MODULE 1: FOUNDATIONS OF COMPUTING & COMPUTER SYSTEMS">
        <SubSection title="1.1 Definition, Evolution, and Characteristics of Computers">
          <p>A computer is an advanced electronic device that takes raw data as input, processes it according to a set of instructions (a program), stores it, and produces output as meaningful information.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`+---------------+      +-------------------+      +----------------+
|               |      |                   |      |                |
|  RAW DATA     | ---> |    PROCESSING     | ---> |  INFORMATION   |
| (Input Stage) |      | (CPU Manipulation)|      | (Output Stage) |
+---------------+      +-------------------+      +----------------+
        ^                                                 ×
        +----------------- [ STORAGE ] <------------------+`}</pre>
          <p><strong>The Information Processing Cycle:</strong> Input: Capturing raw numbers, letters, images, or audio. Processing: Manipulating data into useful forms via the Central Processing Unit. Output: Displaying results via screens, speakers, or printers. Storage: Saving data on permanent media (hard drives, flash disks) for future use.</p>
          <BulletList items={[
            'Historical Evolution: The Abacus (ancient bead calculation device), The Pascaline (1642, first mechanical calculator by Blaise Pascal), The Analytical Engine (1837, designed by Charles Babbage, the Father of the Computer), ENIAC (1946, first general-purpose electronic digital computer using vacuum tubes), The Microprocessor (1971, silicon chip combining thousands of transistors onto a single chip).',
            'Core Characteristics of Modern Computers: Speed (millions of instructions per second in Gigahertz), Accuracy (no computational mistakes unless wrong human input × Garbage In, Garbage Out / GIGO), Diligence (no tiredness, boredom, or loss of focus), Versatility (different tasks like music, spreadsheets, gaming), Storage Capacity (huge volumes of media in compact digital units).'
          ]} />
        </SubSection>

        <SubSection title="1.2 Classification of Computers">
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                    +-------------------------------+
                    ×  COMPUTER CLASSIFICATION      ×
                    +-------------------------------+
         +--------------------------+--------------------------+
         ?                          ?                          ?
   [ BY SIZE/POWER ]         [ BY FUNCTION ]             [ BY PURPOSE ]
   × Supercomputers × Digital × General Purpose × Mainframes × Analog × Special Purpose × Minicomputers × Hybrid × Microcomputers`}</pre>
          <BulletList items={[
            'By Size/Power: Supercomputers (largest, most powerful, trillions of calculations per second, used for weather, nuclear research, space exploration). Mainframe Computers (large, support thousands of users, banking, insurance, census). Minicomputers (mid-range servers, university departments, manufacturing). Microcomputers (small, affordable, single-user × desktops, laptops, tablets, smartphones, wearables).',
            'By Functionality: Digital Computers (process discrete binary 0s and 1s, high accuracy). Analog Computers (process continuous physical variables like voltage, pressure, speed × e.g., speedometers, thermometers). Hybrid Computers (combine analog measurement with digital precision × e.g., ICU patient monitors).',
            'By Purpose: General-Purpose Computers (perform a wide variety of tasks depending on installed software × laptops, smartphones). Special-Purpose Computers (built for one specific task, hardwired instructions × ATMs, calculators, washing machines, traffic light controllers).'
          ]} />
        </SubSection>

        <SubSection title="1.3 Computer Hardware Components">
          <p>Hardware refers to the physical, tangible parts of a computer system that you can see, touch, and move.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                           +------------------------+
                           ×   COMPUTER HARDWARE    ×
                           +------------------------+
        +------------------------------+------------------------------+
        ?                              ?                              ?
  [ INPUT DEVICES ]            [ OUTPUT DEVICES ]            [ SYSTEM UNIT / CPU ]
  × Keyboard × Monitor (LCD/LED) × Control Unit (CU) × Mouse / Touchpad × Printer (Inkjet/Laser) × ALU × Scanner × Speakers / Headphones × Internal Registers × Microphone × Projector`}</pre>
          <BulletList items={[
            'Input Devices: Keyboard (primary text input, QWERTY layout, alphanumeric, function, navigation, modifier keys). Mouse/Touchpad (pointing device for GUI navigation, click, double-click, drag, drop). Scanner (converts physical documents/photos into digital image files). Microphone (captures sound waves, converts to digital audio). Barcode Reader (scans barcodes on product packaging for point-of-sale databases).',
            'Output Devices: Monitor (visual interface, LCD/LED technology, resolution in pixels). Printer (hard copy output × Inkjet uses liquid ink for photos, Laser uses toner powder and static electricity for fast office printing). Speakers/Headphones (convert electrical audio signals into sound waves). Projector (enlarges video output onto screens/walls for classrooms and presentations).',
            'System Unit and CPU: The system unit houses the motherboard, which connects all internal components. The CPU (Central Processing Unit) is the brain × it contains the Control Unit (fetches, decodes, directs data flow), the Arithmetic Logic Unit / ALU (performs arithmetic +, -, *, / and logical comparisons <, >, ==), and Internal Registers (tiny high-speed storage locations inside the CPU for temporary data and memory addresses).'
          ]} />
        </SubSection>

        <SubSection title="1.4 Memory and Storage Concepts">
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                      +-------------------------------+
                      ×       COMPUTER MEMORY         ×
                      +-------------------------------+
         +---------------------------------------------------------+
         ?                                                         ?
   [ PRIMARY MEMORY ]                                     [ SECONDARY STORAGE ]
   × RAM: Volatile, temporary workspace.                  × Magnetic: Hard Disk Drives (HDD).
   × ROM: Non-volatile, permanent boot rules.             × Optical: CDs, DVDs, Blu-ray discs.
                                                          × Solid-State: Flash disks, SSDs.`}</pre>
          <BulletList items={[
            'RAM (Random Access Memory): Volatile × contents vanish when power goes off. Read and write operations. Holds open apps, active files, and operating system. Extremely fast communication with the CPU.',
            'ROM (Read-Only Memory): Non-volatile × contents remain intact forever. Read-only; cannot be easily modified. Stores BIOS (Basic Input/Output System) boot rules.',
            'Secondary Storage Categories: Magnetic Storage (HDD × high-capacity, internal/external drives). Optical Storage (CDs ~700 MB, DVDs ~4.7 GB, use laser beams to read/write data). Solid-State Storage (SSDs and USB flash disks × no moving parts, faster, quieter, less energy).',
            'Storage Units of Measurement: 1 Bit = single binary digit (0 or 1). 1 Nibble = 4 Bits. 1 Byte = 8 Bits (stores one character like \'A\'). 1 Kilobyte (KB) = 1,024 Bytes. 1 Megabyte (MB) = 1,024 KB. 1 Gigabyte (GB) = 1,024 MB. 1 Terabyte (TB) = 1,024 GB.'
          ]} />
        </SubSection>

        <SubSection title="1.5 Computer Software">
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                           +------------------------+
                           ×   COMPUTER SOFTWARE    ×
                           +------------------------+
        +-------------------------------------------------------------+
        ?                                                             ?
  [ SYSTEM SOFTWARE ]                                           [ APPLICATION SOFTWARE ]
  × Operating Systems (Windows, Android) × Word Processors (MS Word) × Utility Programs (Antivirus, Disk Clean) × Spreadsheets (MS Excel) × Device Drivers × Web Browsers (Chrome) × Presentation Tools (PowerPoint)`}</pre>
          <BulletList items={[
            'System Software: Operating Systems (OS) × the critical bridge between hardware, software, and user. Functions: memory management, processor scheduling, file system organization, input/output management, user account security. Examples: Microsoft Windows, macOS, Linux, Google Android, Apple iOS. Utility Programs × antivirus, disk defragmenters, file compression (WinRAR), backup software. Device Drivers × small programs allowing OS to communicate with external hardware like printers or drawing tablets.',
            'Application Software: Word Processors (create, edit, format, print text documents × MS Word, Google Docs). Spreadsheet Software (organize data into grids of rows/columns, perform calculations, build charts × MS Excel, Google Sheets). Web Browsers (locate, retrieve, and display web pages × Google Chrome, Mozilla Firefox, Safari). Presentation Software (digital slides with text, images, audio for audiences × MS PowerPoint, Google Slides).'
          ]} />
        </SubSection>
      </Section>

      <Section title="MODULE 2: INTERACTIVE LEARNING & HANDS-ON GUIDE TO OPERATING SYSTEMS">
        <SubSection title="2.1 Booting the Computer and Desktop Environments">
          <p>The process of turning on a computer and loading the operating system into RAM is called Booting.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`+--------------------+      +--------------------+      +--------------------+
|                    |      |                    |      |                    |
|  1. POWER ON       | ---> |  2. POST RUNS      | ---> |  3. OS LOADS       |
|  (Press Button,    |      |  (BIOS checks RAM, |      |  (Kernel moves from|
|  Electricity flows)|      |  Keyboard, Mouse)  |      |  Drive into RAM)   |
+--------------------+      +--------------------+      +--------------------+
                                                                  ×
                                                                  v
                                                        +--------------------+
                                                        |                    |
                                                        |  4. DESKTOP SHOWS  |
                                                        |  (System ready for |
                                                        |  User Inputs)      |
                                                        +--------------------+`}</pre>
          <BulletList items={[
            'Cold Booting: Turning on a computer from a completely powered-off state by pushing the physical power button.',
            'Warm Booting (Restarting): Reloading the OS without cutting electrical power, done via software menus when the computer freezes or completes a software installation.',
            'Desktop GUI Elements: Icons (small clickable pictures representing files, folders, shortcuts, or applications). Taskbar (horizontal strip at bottom of screen showing open windows, system utilities, and clock). Start Button / App Menu (corner launcher for all installed applications, settings, and power controls). System Tray (far right of taskbar, displays network, battery, volume status indicators).'
          ]} />
        </SubSection>

        <SubSection title="2.2 Complete File Management System">
          <p>A File is a collection of related digital data saved under a unique name on a storage drive. A Folder (or directory) is a virtual container used to organize files into logical groups.</p>
          <BulletList items={[
            'File Naming Structure: filename.extension × Report.docx (Microsoft Word), Budget.xlsx (Microsoft Excel), Photo.jpg (compressed image), Song.mp3 (audio file).',
            'Creating a New Folder: Right-click empty desktop space ? New ? Folder ? Type name (e.g., Science Project) ? Enter.',
            'Renaming a File/Folder: Click to select ? Right-click ? Rename (or F2 key) ? Type new name ? Enter.',
            'Copying (Duplicating): Select file ? Ctrl + C ? Open destination folder ? Ctrl + V. File remains in original location.',
            'Moving (Cutting): Select file ? Ctrl + X ? Open destination folder ? Ctrl + V. File is removed from original location.',
            'Deleting and Recovering: Right-click file ? Delete (or Delete key). File moves to Recycle Bin (Trash). To recover: double-click Recycle Bin ? right-click file ? Restore. File returns to original location.'
          ]} />
        </SubSection>

        <SubSection title="2.3 Customizing System Settings">
          <BulletList items={[
            'Display Personalization: Change desktop background image (wallpaper), select automated screensavers, adjust screen brightness to prevent eye strain.',
            'Date and Time Configuration: Keeping correct local time ensures file timestamps are accurate and secure websites load properly without certificate errors.',
            'Managing User Accounts: Multiple users can share one computer with separate accounts, keeping documents, browser histories, and backgrounds private. Administrator Accounts have full control to install programs and alter settings. Standard Guest Accounts can run existing software but cannot modify core system structures or view other users\' private files.'
          ]} />
        </SubSection>
      </Section>

      <Section title="MODULE 3: DIGITAL LITERACY & OFFICE PRODUCTIVITY SUITES">
        <SubSection title="3.1 Word Processing Essentials">
          <p>A word processor allows you to create and format text documents.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`+--------------------------------------------------------------------------+
|  FILE   HOME   INSERT   PAGE LAYOUT   VIEW                             | <-- Ribbon Tabs
+--------------------------------------------------------------------------+
| [B] [I] [U]   [Font: Arial   ] [Size: 12 ]   [===] [====] [===]         | <-- Format Bar
+--------------------------------------------------------------------------+
|                                                                          |
|  Active Page Workspace Area...                                           |
|                                                                          |
+--------------------------------------------------------------------------+
| Page 1 of 1           Words: 425              English (US)               | <-- Status Bar
+--------------------------------------------------------------------------+`}</pre>
          <BulletList items={[
            'Typing and Basic Text Editing: Launch word processor, type text continuously × the program automatically wraps words to the next line (Word Wrap). Only press Enter to start a new paragraph.',
            'Formatting Typography: Font Type (typeface family like Times New Roman for formal essays, Arial for clear modern reading). Font Size (measured in points × headings 14°16pt, body text 11°12pt). Bold (Ctrl+B × darker, thicker text for titles). Italics (Ctrl+I × slanted for book titles, foreign words, quotes). Underline (Ctrl+U × clean line beneath text).',
            'Paragraph Alignment: Left Alignment (standard for business letters, flush left, uneven right). Center Alignment (precisely in middle of page, used for title pages and poems). Right Alignment (flush right, used for sender addresses or dates). Justified Alignment (evenly spaced to align both left and right margins, like newspaper columns).',
            'Inserting Tables and Visual Objects: Insert Tab ? Table ? hover to define rows and columns. Insert Tab ? Pictures to add images from hard drive, or Shapes to add arrows, boxes, callout stars.',
            'Page Layout and Printing: Page Orientation × Portrait (tall, narrow, standard essays) or Landscape (wide, short, certificates and maps). Margins × blank space around edges (standard 1 inch all sides). Printing × Ctrl+P to open Print Preview, choose copies, select printer, click Print.'
          ]} />
        </SubSection>

        <SubSection title="3.2 Spreadsheet Fundamentals">
          <p>Spreadsheet applications organize, calculate, and analyze numerical data.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`     A          B          C          D
1 → NAME     CAT 1       CAT 2       TOTAL
2 → Amos     45          40          =SUM(B2:C2) → <-- Active Cell Formula Entry
3 → Bridget → 48          47          95
4 → Charlie → 30          32          62`}</pre>
          <BulletList items={[
            'Anatomy of a Spreadsheet Grid: Worksheet (single page of rows and columns). Columns (vertical sections identified by letters A, B, C...). Rows (horizontal sections identified by numbers 1, 2, 3...). Cell (intersection of a column and row). Cell Address (unique identifier combining column letter and row number, e.g., C5). Formula Bar (text entry bar at top showing underlying code inside active cell).',
            'All formulas MUST begin with an equals sign (=). Manual Arithmetic: Addition (=B2+C2), Subtraction (=B2-C2), Multiplication (=B2*C2), Division (=B2/C2).',
            'Automated Built-in Functions: SUM (=SUM(B2:B5) × totals all numbers in range). AVERAGE (=AVERAGE(B2:B5) × adds values and divides by count). MIN (=MIN(B2:B5) × finds smallest number). MAX (=MAX(B2:B5) × finds largest number). A range is written using a colon (e.g., B2:B20).',
            'Creating Visual Data Charts: Highlight data table cells ? Insert Tab ? Charts Group ? select Bar Chart (compare categories) or Pie Chart (show percentages of a whole). Charts automatically update when data changes.'
          ]} />
        </SubSection>

        <SubSection title="3.3 Digital Presentation Mastery">
          <BulletList items={[
            'Principles of Good Slide Design: The 6x6 Rule × limit each slide to 6 bullet points, no more than 6 words per bullet. High Contrast × dark text on light backgrounds (or vice-versa) for projector legibility. Avoid Clutter × don\'t overcrowd slides with large text blocks or conflicting images.',
            'Creating a Presentation: Step 1 × Open presentation program; first slide is default Title Slide. Home tab ? New Slide to add more. Layout dropdown to choose configurations like Title and Content or Two Columns. Step 2 × Slide Transitions (animation effects when moving between slides, e.g., Fade, Wipe, Push). Custom Animations (entry and exit effects on individual text boxes, bullet points, or shapes × e.g., text flying in line-by-line). Step 3 × Press F5 to launch full-screen slideshow from beginning. Left mouse click, Spacebar, or Right Arrow to advance. Esc to exit slideshow mode.'
          ]} />
        </SubSection>
      </Section>

      <Section title="MODULE 4: THE GLOBAL INTERNET, NETWORKING, AND CYBERSECURITY">
        <SubSection title="4.1 Foundations of Computer Networks">
          <p>A Computer Network is a collection of interconnected computers and peripheral devices that communicate with each other to share resources, data, and hardware.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       +--------------------+                 +--------------------+
       |                    |                 |                    |
       |   Desktop Tower    |                 |    Office Laptop   |
       +--------------------+                 +--------------------+
                 ×                                       ×
                 +--------------? [ SWITCH ] ?-----------+
                                      ?
                                      ×
                                      ?
                             +-----------------+
                             |                 |
                             | CENTRAL PRINTER | (Shared Resource)
                             +-----------------+`}</pre>
          <BulletList items={[
            'LAN (Local Area Network): Interconnects computers within a limited physical area like a classroom, home, or office building. Fast, typically connected using Ethernet cables or local Wi-Fi.',
            'WAN (Wide Area Network): Spans large geographic regions × cities, countries, continents. The internet is the largest public WAN.',
            'Core Network Hardware: Network Interface Card (NIC × internal circuit board connecting computer to network cable or wireless signal). Transmission Media: Twisted-Pair Copper Ethernet Cables, Fiber-Optic Cables (glass strands transmitting data as pulses of light), Wireless / Wi-Fi (radio frequency waves). Switch (central connecting device linking computers within a LAN, directing data to correct recipient). Router (intelligent device linking different networks together, e.g., home LAN to global internet WAN).'
          ]} />
        </SubSection>

        <SubSection title="4.2 Navigating the World Wide Web (WWW)">
          <BulletList items={[
            'The Internet is the physical global infrastructure of interconnected networks. The World Wide Web (WWW) is the collection of digital multimedia pages hosted on those networks.',
            'Essential Terminology: Web Browser (client software to view websites × Chrome, Edge). Web Server (powerful permanently connected computer storing website files). Website (collection of related web pages). Homepage (default introductory page when a website loads). Hyperlink (highlighted word, icon, or image redirecting browser to a different page when clicked).',
            'URL (Uniform Resource Locator): Complete web address typed into browser bar. Structure: https:// (protocol × Hypertext Transfer Protocol Secure) + domain name (server identifier, e.g., education.go.ke) + specific web page file.',
            'Safe Online Searching: Use search engines (Google, Bing) with concise keywords. Boolean Operators: AND (finds pages with both terms × e.g., Computers AND Kenya). Quotes "" (forces engine to find exact phrase × e.g., "Grade 5 CBC Computer Science").'
          ]} />
        </SubSection>

        <SubSection title="4.3 Electronic Mail (E-mail) Operations">
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       +-------------------------------------------------------------+
       |                                                             |
       | To:       teacher.mwangi@school.ac.ke                      |
       | Subject:  Grade 5 Computer Science Project Submission       |
       | Cc:       parent.sharon@gmail.com                           |
       +-------------------------------------------------------------+
       |                                                             |
       | Dear Mr. Mwangi,                                            |
       |                                                             |
       | Please find attached my completed presentation slide deck.  |
       |                                                             |
       | Sincerely,                                                  |
       | David Kiprop                                                |
       +-------------------------------------------------------------+
       |                                                             |
       | [Attachment: project_deck.pptx (2.4 MB)]                    |
       +-------------------------------------------------------------+`}</pre>
          <BulletList items={[
            'Email Address Format: username@domain.extension (e.g., david.kiprop@student.co.ke). david.kiprop = unique user mailbox identity. @ = separator symbol. student.co.ke = host email server domain name.',
            'Email Form Fields: To (primary recipient email address). Subject (brief summary explaining purpose × never leave blank). Cc / Carbon Copy (sends exact copy to interested third party; all recipients can see who else received it). Bcc / Blind Carbon Copy (sends copy to another recipient, but their address is hidden from all other recipients for privacy). Attachment (a file × photo, document, spreadsheet × sent along with your email message).'
          ]} />
        </SubSection>

        <SubSection title="4.4 Cybersecurity and Digital Citizenship">
          <BulletList items={[
            'Common Digital Threats: Computer Viruses and Malware (malicious software deleting files, stealing data, slowing computers; spread through infected flash drives or shady downloads). Phishing Scams (deceptive emails, texts, or websites mimicking banks or schools to trick users into typing passwords or credit card numbers). Cyberbullying (using social media, chat groups, or online gaming to harass, insult, mock, or threaten peers). Online Predators (strangers creating fake profiles on games and social media to interact with children).',
            'Essential Safety Strategies: 1. Create Strong Passwords × never use your name, birthdate, or "123456". At least 8 characters combining uppercase letters, lowercase letters, numbers, and special symbols (e.g., K#7p!m9X). 2. Keep Personal Information Private × never share full name, school name, home address, telephone numbers, or daily routine on public chat boards. 3. Use Reliable Antivirus Software × keep firewall active and run regular updates. 4. The "Think Before You Post" Rule × everything posted online leaves a permanent Digital Footprint. Once uploaded, text and images can be saved or screenshotted by others even if you delete them later.'
          ]} />
        </SubSection>
      </Section>

      <Section title="MODULE 5: NETWORKING AND INTERNET TECHNOLOGIES">
        <SubSection title="5.1 Fundamentals of Computer Networks">
          <SubSection title="5.1.1 Definition and Core Objectives">
            <p>A computer network is an interconnected collection of autonomous computing devices, peripherals, and communication channels. These elements cooperate to exchange data, share resources, and facilitate interpersonal communication.</p>
            <BulletList items={[
              'Resource Sharing: Allows multiple workstations to share high-performance peripherals like laser printers, high-capacity network-attached storage (NAS) arrays, and optical drives. Also hosts application suites on centralized servers to reduce licensing costs.',
              'Centralized Data Management: Uses centralized file servers to store corporate data assets in a single location, simplifying data backup routines and ensuring users access the most current file versions. Administrators can enforce uniform security policies.',
              'Cost Mitigation: Lowers operational expenses by maximizing hardware use and reducing physical media costs. Networks replace "sneaker-net" (copying files onto floppy disks or USB drives to move them physically) with instant digital transfers over copper wire, fiber optics, or wireless frequencies.',
              'Enhanced Communication Facilitation: Supports electronic mail (email), instant messaging, Voice over Internet Protocol (VoIP) telephony, video conferencing, and collaborative workspaces, enabling real-time collaboration across continents.'
            ]} />
          </SubSection>

          <SubSection title="5.1.2 Structural Classification of Networks by Geographical Scope">
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`+-----------------------------------------------------------------------+
|  Wide Area Network (WAN) - Global / Continental Scope                 |
|  +-----------------------------------------------------------------+  |
|  |  Metropolitan Area Network (MAN) - City-Wide Scope              |  |
|  |  +-----------------------------------------------------------+  |  |
|  |  |  Local Area Network (LAN) - Building / Campus Scope       |  |  |
|  |  |  +-----------------------------------------------------+  |  |  |
|  |  |  |  Personal Area Network (PAN) - Immediate User Space|  |  |  |
|  |  |  +-----------------------------------------------------+  |  |  |
|  |  +-----------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+`}</pre>
            <BulletList items={[
              'Personal Area Network (PAN): Centers around an individual\'s immediate workspace, typically spanning less than 10 meters. Connects personal electronics like smartphones, tablets, laptops, wireless headphones, and smartwatches using Bluetooth or Ultra-Wideband (UWB).',
              'Local Area Network (LAN): Operates within a limited geographic footprint × a single room, home, office building, or school campus. Owned and managed by a single organization. Uses high-speed twisted-pair copper cables (Cat 6/6A) or localized fiber-optic lines. High data transfer rates (100 Mbps to 10 Gbps), very low error rates.',
              'Metropolitan Area Network (MAN): Spans an entire city, town, or large corporate/university campus, typically 10°100 kilometers. Connects multiple distinct LANs across an urban center. Uses high-speed fiber-optic backbones beneath city streets.',
              'Wide Area Network (WAN): Extends over vast geographic distances × cities, states, countries, continents. The internet is the largest WAN. Connects smaller networks using leased telephone lines, transoceanic fiber-optic cables, and satellite links. Multiple administrative owners, lower speeds than LANs, higher propagation delays.'
            ]} />
          </SubSection>

          <SubSection title="5.1.3 Comparative Evaluation of Network Topology Architectures">
            <BulletList items={[
              'Star Topology: Every node connects directly to a central switch/hub via its own dedicated cable. Advantages: Fault isolation is straightforward × if one cable fails, only that node loses connectivity. Easy to add/remove nodes. Disadvantages: Central switch is a single point of failure × if it breaks, entire network goes down. Requires large amount of cabling.',
              'Bus Topology: All devices connected along a single shared backbone cable with terminators at each end. Advantages: Simple to deploy, highly cost-effective for small networks, minimal cabling. Disadvantages: Main cable is single point of failure. Data collisions occur frequently. Difficult to troubleshoot backbone breaks.',
              'Ring Topology: Each device connects to exactly two neighbors forming a continuous circular loop. Data travels in one direction; each machine acts as a repeater. Advantages: No data collisions, performs predictably under heavy loads. Disadvantages: A single break or malfunctioning node disrupts the entire loop. Modern rings use dual-counter-rotating configurations at added cost.',
              'Mesh Topology: Devices connect to multiple other nodes. Full mesh: every node connects directly to every other node. Partial mesh: devices connect only to frequently communicated nodes. Advantages: Excellent fault tolerance × data automatically reroutes through alternative paths. Disadvantages: Extremely expensive and complex to install due to massive cabling and multiple network interfaces per device.'
            ]} />
          </SubSection>

          <SubSection title="5.1.4 Client-Server vs. Peer-to-Peer Architectural Frameworks">
            <BulletList items={[
              'Client-Server Architecture: Divides network functions between dedicated servers (high-performance computers managing data storage, user authentication, printing, applications) and clients (workstations requesting these resources). Centralization of Control × security policies, access privileges, updates, and backups managed directly on server. Scales efficiently to thousands of users. Single point of failure × if server goes down, clients cannot access shared resources. Requires dedicated network administrator.',
              'Peer-to-Peer (P2P) Architecture: Every computer shares equal status × no dedicated servers. Each peer acts as both client and server. Decentralization × each user manages security, sharing, and backups for their own machine. Works well for small groups (under 10 devices) but becomes disorganized in larger settings. Lacks single point of failure × if one peer crashes, remaining machines continue communicating. Inexpensive to implement using standard consumer operating systems.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="5.2 Network Components and Hardware Infrastructure">
          <SubSection title="5.2.1 Physical Transmission Media (Wired Channels)">
            <BulletList items={[
              'Twisted-Pair Cable: Pairs of insulated copper wires twisted together in a continuous spiral to balance signals and reduce electromagnetic interference (EMI) and crosstalk. Unshielded Twisted-Pair (UTP) × most common for local networks, flexible, inexpensive, but vulnerable to external noise. Shielded Twisted-Pair (STP) × adds protective foil sheath or braided metal mesh for industrial environments, stiffer and more expensive. Category 5e: up to 1 Gbps at 100 MHz over 100 meters. Category 6: up to 10 Gbps under 55 meters, includes internal plastic spline. Category 6A: maintains 10 Gbps across full 100 meters at up to 500 MHz.',
              'Coaxial Cable: Central solid copper conductor wrapped in thick plastic insulation, surrounded by woven copper shield or foil wrap, protected by durable outer plastic jacket. Outer metal shield blocks external radio frequencies and electrical interference. Once standard for bus networks; today used primarily for cable television, broadband internet, and high-frequency radio.',
              'Fiber-Optic Cable: Transmits data as pulses of light through thin strands of high-purity glass or plastic. Structure: central glass core, cladding (reflective layer forcing light to bounce using total internal reflection), protective buffer coatings and reinforcing Kevlar fibers. Single-Mode Fiber × narrow core (8°10 micrometers), uses laser for single straight light stream, eliminates distortion over long distances (transoceanic links). Multi-Mode Fiber × wider core (50°62.5 micrometers), allows multiple light streams from LEDs at different angles, less expensive but disperses over long distances (campus backbones). Advantages: massive bandwidth (hundreds of Gbps), immune to EMI and lightning, minimal signal loss, secure against data tapping.'
            ]} />
          </SubSection>

          <SubSection title="5.2.2 Wireless Transmission Media">
            <BulletList items={[
              'Radio Waves: Frequencies from 3 kHz to 1 GHz. Omnidirectional × propagate outward in all directions, pass easily through solid obstacles like walls. Perfect for indoor local networks but susceptible to interference from electronic appliances.',
              'Microwaves: Higher frequencies from 1 GHz to 300 GHz. Strictly unidirectional, travel in narrow straight lines. Terrestrial Microwave Systems use highly directional dish antennas on tall towers for line-of-sight signals; relay towers must be within 40°50 km with no obstacles. Satellite Microwave Systems use communications satellites in geostationary orbit ~35,786 km above equator × ground station beams uplink signal, satellite amplifies and sends downlink to different receiver, enabling continental broadcast coverage.',
              'Infrared: High-frequency light waves just below visible spectrum (300 GHz to 400 THz). Travel in strict line of sight; cannot pass through solid obstacles like walls. Restricted to short-range applications within a single room (TV remote controls, legacy laptop-to-printer connections). Secure from outside eavesdropping because signal cannot leave the room.'
            ]} />
          </SubSection>

          <SubSection title="5.2.3 Electronic Network Connectivity Hardware">
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`   Internet Cloud Connection
              |
              v
       +--------------+
       |              |
       | Modem Device |  (Demodulates incoming provider line)
       +--------------+
              |
              v
       +--------------+
       |              |
       | Edge Router  |  (Segments local network from Internet)
       +--------------+
              |
              v
       +--------------+
       |              |
       | Network Switch| (Directs packets inside the building)
       +--------------+
         /    |     \\
        v     v      v
     Node A  Node B  Access Point ===> Wireless Client`}</pre>
            <BulletList items={[
              'Network Interface Card (NIC): Internal hardware component connecting computer to a network. Converts computer\'s parallel internal data into sequential serial streams for transmission. Every NIC has a unique permanent MAC (Media Access Control) address burned into its hardware.',
              'Hub: Elementary hardware device connecting multiple network lines. Operates at physical layer; lacks intelligence to inspect data routing. When a hub receives a packet on one port, it blindly copies and broadcasts it to every other port × wastes bandwidth and creates security risks.',
              'Switch: Intelligent networking device connecting nodes within a LAN. Learns which device is connected to each physical port by tracking MAC addresses in an internal table. Reads destination MAC address and forwards packet out only the specific port leading to that device × eliminates unnecessary broadcasts, prevents collisions, improves speed and security.',
              'Router: Network device forwarding data packets between different networks (e.g., connecting office LAN to internet). Uses logical IP addresses rather than MAC addresses. Dynamic routing table analyzes traffic and determines fastest path for each packet. Also serves as security checkpoint, filtering traffic to protect local networks.',
              'Gateway: Interface connecting two completely different networks using incompatible protocols, data structures, or architectures. Acts as translator × strips away one network\'s protocol wrappers and repackages data so destination network can understand it.',
              'Modem (Modulator-Demodulator): Converts digital data from computer into analog signals for transmission over analog lines (Modulation), and converts incoming analog waves back into digital data (Demodulation).',
              'Wireless Access Point (WAP): Connects wireless devices (laptops, smartphones) to a wired network using radio signals. Plugs into wired network switch via Ethernet cable and broadcasts radio signal over a local area, creating a Wireless Local Area Network (WLAN).'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="5.3 Network Topologies and Architectures">
          <SubSection title="5.3.1 OSI Seven-Layer Reference Model vs. TCP/IP Protocol Suite">
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`  OSI Reference Model Layer Structure      TCP/IP Protocol Suite Framework
  +---------------------------------+      +---------------------------------+
  | Layer 7: Application            | ===> | Layer 4: Application            |
  +---------------------------------+      | (HTTP, FTP, SMTP, DNS, DHCP)    |
  | Layer 6: Presentation           | ===> |                                 |
  +---------------------------------+      +---------------------------------+
  | Layer 5: Session                | ===> |                                 |
  +---------------------------------+      |                                 |
  | Layer 4: Transport              | ===> | Layer 3: Transport              |
  | (End-to-End, TCP, UDP)          |      | (TCP, UDP Protocol Engines)     |
  +---------------------------------+      +---------------------------------+
  | Layer 3: Network                | ===> | Layer 2: Internet               |
  | (Routing, IP Addressing)        |      | (IPv4, IPv6 Routing Operations) |
  +---------------------------------+      +---------------------------------+
  | Layer 2: Data Link              | ===> | Layer 1: Network Access         |
  +---------------------------------+      | (Ethernet, Wi-Fi MAC layer)     |
  | Layer 1: Physical               | ===> |                                 |
  +---------------------------------+      +---------------------------------+`}</pre>
            <BulletList items={[
              'OSI Model Layer-by-Layer: Layer 1 Physical (cables, connectors, electrical/optical signals). Layer 2 Data Link (packages raw bits into frames, manages MAC addresses, error detection). Layer 3 Network (manages routing and logical IP addressing across multiple networks). Layer 4 Transport (ensures reliable end-to-end delivery via TCP or fast connectionless UDP). Layer 5 Session (establishes, manages, and terminates communication sessions). Layer 6 Presentation (translates data formats, handles compression and encryption). Layer 7 Application (closest to user, provides network services directly to applications like browsers and email clients).',
              'TCP/IP Four-Layer Model: Network Access Layer (combines OSI Physical and Data Link × handles physical connections and MAC addressing for Ethernet/Wi-Fi). Internet Layer (maps to OSI Network × uses IP addressing to route packets). Transport Layer (maps to OSI Transport × manages end-to-end communication via TCP or UDP). Application Layer (combines OSI Session, Presentation, and Application × runs high-level protocols like HTTP, FTP, SMTP, DNS).'
            ]} />
          </SubSection>

          <SubSection title="5.3.2 Essential Protocol Architectures">
            <BulletList items={[
              'TCP/IP (Transmission Control Protocol / Internet Protocol): Foundation protocol suite of the global internet. IP × connectionless network protocol for addressing and routing packets; does not guarantee order or error-free delivery. TCP × connection-oriented transport protocol establishing a formal connection via three-way handshake (SYN ? SYN-ACK ? ACK). Assigns sequence numbers, verifies packets arrive intact, automatically requests retransmission for lost/corrupted data.',
              'HTTP / HTTPS: HTTP × application protocol retrieving and transferring web documents via request-response model (browser asks, server delivers). HTTPS × secure version encrypting all web traffic using TLS/SSL to protect passwords, credit card numbers, and personal details from interception.',
              'FTP (File Transfer Protocol): Application protocol for moving files between client and remote server. Uses two separate connections × control channel (commands and passwords) and data channel (actual file content).',
              'SMTP / POP3 / IMAP (Electronic Mail Suite): SMTP sends outgoing emails from client to server or forwards between mail servers. POP3 downloads emails from server onto a single client device and deletes messages from server. IMAP syncs emails across multiple devices by keeping messages stored on central mail server.',
              'DNS (Domain Name System): The address book of the internet. Translates easy-to-remember domain names (e.g., example.com) into numeric IP addresses (e.g., 192.0.2.1) so browsers can locate and connect to remote servers.',
              'DHCP (Dynamic Host Configuration Protocol): Automates configuration of devices on an IP network. A DHCP server automatically assigns temporary IP addresses to devices as they connect, preventing address conflicts and simplifying network management.'
            ]} />
          </SubSection>

          <SubSection title="5.3.3 Data Transmission Concepts">
            <BulletList items={[
              'Circuit Switching: Establishes a dedicated, continuous physical path between two nodes before any data is sent (traditional analog telephone networks). Guarantees consistent quality but wastes bandwidth if line goes quiet; other users cannot use locked lines.',
              'Packet Switching: Breaks data into small packets containing raw data plus a header (source address, destination address, sequence order number). Packets travel independently, often taking different physical paths based on traffic conditions. Destination device uses sequence numbers to reassemble original file. Uses bandwidth efficiently because multiple users share same cables simultaneously.',
              'Bandwidth: Maximum theoretical data transmission capacity of a network link, measured in bps, Mbps, or Gbps (like the width of a pipe). Throughput: Actual amount of data successfully traveling across a network link over a given period (often lower than bandwidth due to congestion and overhead). Latency: Total time delay for a data packet to travel from source to destination, measured in milliseconds (ms); high latency causes lag during video calls or gaming.',
              'Transmission Modes: Simplex (data travels one way only × TV broadcasts, computer keyboards). Half-Duplex (data travels both ways but only one device transmits at a time × walkie-talkies). Full-Duplex (data travels both ways simultaneously × smartphone calls, modern switched Ethernet).'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="5.4 IP Addressing and Subnetting Frameworks">
          <SubSection title="5.4.1 IPv4 Addressing Foundations">
            <p>An Internet Protocol version 4 (IPv4) address is a 32-bit binary number assigned to a network interface. To make it easier for humans to read, this 32-bit string is divided into four 8-bit sections called octets, separated by periods. This format is known as dotted-decimal notation.</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`Binary String Construction:
11000000 . 10101000 . 00000001 . 01100100 → (32-Bits Total structural map)

   |          |          |          |
   v          v          v          v
  192   .    168   .     1     .   100     (Dotted-Decimal Form Notation)`}</pre>
            <p>Each octet contains 8 bits, meaning its decimal value can range from 0 to 255. A complete IPv4 address contains two parts: a Network ID, which identifies the specific network, and a Host ID, which identifies the unique device on that network.</p>
          </SubSection>
          <SubSection title="5.4.2 Legacy Classful Addressing Architecture">
            <p>Historically, the IPv4 address space was divided into five distinct classes (A, B, C, D, and E) based on the first few bits of the address. This classful design determined how many octets belonged to the network ID and how many belonged to the host ID.</p>
          </SubSection>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- AGRICULTURE & SOIL SCIENCE NOTES ----------
function AgricultureNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Agriculture & Soil Science</h2>

      <Section title="MODULE 1: AGRICULTURE & SOIL SCIENCE">
        <SubSection title="1.1 The Concept of Agriculture as a Science and Economy">
          <p>Agriculture is not merely the act of digging the ground or scattering seeds; it is a rigorous, multidisciplinary science and the foundational backbone of human civilization and economic survival. As a science, agriculture incorporates principles of biology, chemistry, physics, and ecology to optimize the production of food, fiber, fuel, and raw materials.</p>
          <BulletList items={[
            'Crop Production (Agronomy & Horticulture): The science and art of cultivating land, managing soils, and raising crops for human consumption, industrial processing, and livestock feed.',
            'Livestock Production (Animal Husbandry): The breeding, housing, feeding, and healthcare management of domestic animals to obtain meat, milk, eggs, wool, and skins.',
            'Soil Science (Edaphology & Pedology): The study of soil as a natural resource, focusing on its formation, chemical properties, physical structures, biological ecosystems, and management for sustainable crop productivity.',
            'Agricultural Engineering & Technology: The application of mechanical, structural, and digital tools to scale up food production, improve water efficiency, and reduce manual labor.'
          ]} />
          <p>From an economic perspective, agriculture is a primary driver of gross domestic product (GDP) in developing nations, a major source of employment for millions globally, and the provider of raw materials to secondary manufacturing industries (such as textiles, sugar refining, milling, and leather tanning).</p>
        </SubSection>

        <SubSection title="1.2 Soil Composition, Profile, and Properties">
          <p>Soil is a dynamic, living matrix that forms the topmost layer of the Earth's crust. It is not static dirt; rather, it is an intricate ecosystem composed of four distinct components:</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`+---------------------------------------------------------+
×                     SOIL COMPOSITION                    ×
+--------------------------------------------------------
×   Mineral × Organic × Soil Water × Soil Air  ×
×   Matter × Matter × (25% by × (25% by   ×
×  (45% by vol) × (5% by vol) × volume) × volume)   ×
+---------------------------------------------------------+`}</pre>
          <BulletList items={[
            'Mineral Matter (45%): Derived from the weathering of parent rocks. Consists of gravel, sand, silt, and clay particles.',
            'Organic Matter (5%): Composed of decomposed plant and animal residues, leaf litter, and microorganisms. Forms humus, which darkens the soil, increases water-retaining capacity, and supplies essential plant nutrients.',
            'Soil Water (25%): Held within the pore spaces between soil particles. Dissolves mineral nutrients, making them accessible to plant roots via osmotic absorption.',
            'Soil Air (25%): Fills the macro-pores not occupied by water. Provides oxygen to plant roots for cellular respiration and to aerobic soil microbes for decomposition.',
            'The Soil Profile: O-Horizon (Organic Layer × fresh, undecomposed debris), A-Horizon (Topsoil × rich in humus, dark, highly fertile, most plant roots concentrated here), B-Horizon (Subsoil × lighter-colored, zone of accumulation for minerals washed down), C-Horizon (Parent Material × partially weathered rock fragments), R-Horizon (Bedrock × unweathered solid rock foundation).'
          ]} />
          <SubSection title="Physical Properties of Soil Types">
            <BulletList items={[
              'Sand Soil: Large particles (0.05°2.0 mm). Predominantly macro-pores, high aeration. Rapid drainage, low water retention. Low fertility due to rapid leaching. Light, loose, easy to till.',
              'Silt Soil: Medium particles (0.002°0.05 mm). Intermediate pore space. Moderate drainage, smooth floury feel when dry, slippery when wet. Moderately fertile, retains nutrients better than sand. Medium difficulty, prone to crusting when dry.',
              'Clay Soil: Microscopic particles (<0.002 mm). Predominantly micro-pores, very high total pore space but minimal aeration. Poor drainage, highly prone to waterlogging and swelling when wet. Extremely high fertility, chemically active surfaces retain nutrients well. Heavy, sticky, difficult to till; shrinks and cracks deeply when dry.',
              'Loam Soil: Ideal balanced mixture of sand, silt, and clay. Well-distributed macro and micro-pores. Optimal drainage, retains enough moisture for crops. Highly fertile with excellent humus content. Best soil for general crop production; easy to cultivate and crumbles nicely (good tilth).'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.3 Soil Fertility and Nutrient Management">
          <p>Soil fertility refers to the capacity of the soil to supply essential chemical elements in the correct quantities and balances to support optimal plant growth. Plant nutrients are divided into macro-nutrients (required in large amounts) and micro-nutrients (required in trace amounts).</p>
          <BulletList items={[
            'Primary Macro-nutrients: Nitrogen (N) × promotes rapid vegetative growth, leaf development, deep green color (chlorophyll production). Deficiency causes chlorosis (yellowing of leaves) and stunted growth. Phosphorus (P) × stimulates early root development, enhances structural strength, accelerates flowering and seed formation. Deficiency causes purplish tints on leaves and weak root systems. Potassium (K) × regulates stomatal opening/closing, enhances disease resistance, improves water-use efficiency, assists starch and sugar transport. Deficiency causes marginal scorching (browning of leaf edges).',
            'Secondary Macro-nutrients: Calcium (Ca) × builds cell walls and maintains structural integrity. Magnesium (Mg) × central atom in chlorophyll molecule, essential for photosynthesis. Sulfur (S) × crucial for synthesis of amino acids and proteins.',
            'Methods of Restoring Soil Fertility: Organic Amendments (Farmyard Manure × decomposed livestock dung, urine, bedding; Compost Manure × stacked layers of green waste, dry leaves, kitchen scraps, ash, soil for aerobic decomposition into humus; Green Manure × growing leguminous crops and plowing them back into soil to boost nitrogen and organic matter). Inorganic Amendments (Straight Fertilizers × supply one primary nutrient, e.g., Urea for N, Triple Superphosphate / TSP for P; Compound Fertilizers × supply two or more nutrients, e.g., Diammonium Phosphate / DAP, NPK formulations like 17:17:17). Cultural Practices (Crop Rotation × alternating deep-rooted and shallow-rooted crops or heavy feeders with nitrogen-fixers in planned sequence to break pest cycles and balance nutrients; Fallowing × leaving field unplanted for one or more seasons to restore nutrient levels and moisture).'
          ]} />
        </SubSection>

        <SubSection title="1.4 Comprehensive Practical Laboratory Experiments">
          <SubSection title="Experiment 1.4.1: Determining the Water Retaining Capacity of Different Soils">
            <p><strong>Objective:</strong> To measure and compare how much water sand, loam, and clay soils can hold against the force of gravity.</p>
            <p><strong>Materials Needed:</strong> 3 identical glass or plastic funnels, 3 identical graduated cylinders (100 ml), filter papers or equal plugs of cotton wool, dry samples of Sand, Loam, and Clay soils (50 grams each), stopwatch or timer, water source and 50 ml measuring beaker.</p>
            <p><strong>Detailed Step-by-Step Procedure:</strong></p>
            <Step>Step 1: Place the three funnels securely into the openings of the three graduated cylinders.</Step>
            <Step>Step 2: Insert a small, tightly packed cotton wool plug into the bottom neck of each funnel, or line them carefully with folded filter paper.</Step>
            <Step>Step 3: Label the funnels: A (Sand), B (Loam), and C (Clay).</Step>
            <Step>Step 4: Weigh exactly 50 grams of dry sand soil and pour it into funnel A. Ensure the soil is leveled gently without tightly compacting it.</Step>
            <Step>Step 5: Weigh exactly 50 grams of dry loam soil and pour it into funnel B.</Step>
            <Step>Step 6: Weigh exactly 50 grams of dry clay soil and pour it into funnel C.</Step>
            <Step>Step 7: Measure exactly 50 ml of water into a beaker. Get your stopwatch ready. Pour the 50 ml of water into funnel A steadily and evenly over the soil surface. Start the timer immediately.</Step>
            <Step>Step 8: Allow the water to drain through the soil into the cylinder below for exactly 10 minutes.</Step>
            <Step>Step 9: Repeat the water pouring and timing procedure using fresh 50 ml water volumes for funnel B (Loam) and funnel C (Clay).</Step>
            <Step>Step 10: At the 10-minute mark for each setup, record the volume of water collected in the graduated cylinder below.</Step>
            <p><strong>Mathematical Calculation Formula:</strong></p>
            <p>Volume of Water Retained (ml) = Volume of Water Poured (50 ml) - Volume of Water Collected (ml)</p>
            <p>Percentage Water Retention (%) = (Volume of Water Retained × Volume of Water Poured (50 ml)) × 100</p>
            <p><strong>Expected Results Table:</strong></p>
            <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
              <tbody>
                <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Soil Type</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Water Poured (ml)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Collected (ml)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Retained (ml)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Rating</th></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Sand</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>50</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>42</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>8</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Very Low</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Loam</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>50</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>25</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>25</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Moderate / Balanced</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Clay</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>50</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>12</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>38</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>High / Excessive</td></tr>
              </tbody>
            </table>
            <p><strong>Scientific Explanation:</strong> Sand soil has large macro-pores; gravity easily pulls water down, resulting in high drainage and very low water retention. Clay soil has tiny, tightly packed micro-pores with strong surface-tension forces holding water tightly, leading to slow drainage and high water retention. Loam soil balances both properties, retaining enough water for roots while allowing excess moisture to drain away freely to prevent root rot.</p>
          </SubSection>

          <SubSection title="Experiment 1.4.2: Separating Soil Components by Sedimentation">
            <p><strong>Objective:</strong> To break down a soil sample into its individual particle layers by weight and size using water sedimentation.</p>
            <p><strong>Materials Needed:</strong> A clear, straight-sided plastic or glass jar with a tight lid (500 ml capacity), a handful of fresh garden soil, clean water, 1 teaspoon of liquid dishwashing soap (dispersing agent), a ruler.</p>
            <p><strong>Detailed Step-by-Step Procedure:</strong></p>
            <Step>Step 1: Clear away large stones, visible roots, and surface leaves from your garden soil sample.</Step>
            <Step>Step 2: Fill the glass jar roughly one-third full with the soil sample.</Step>
            <Step>Step 3: Pour in clean water until the jar is roughly four-fifths full, leaving a small air gap at the very top.</Step>
            <Step>Step 4: Add 1 teaspoon of liquid dishwashing soap. The soap acts as a chemical dispersing agent that breaks apart soil aggregates and stops clay particles from sticking together.</Step>
            <Step>Step 5: Screw the lid on tightly. Shake the jar vigorously for at least 3 to 5 minutes. Make sure all soil clumps are thoroughly dissolved and mixed into a uniform muddy suspension.</Step>
            <Step>Step 6: Place the jar flat on a level, vibration-free table or shelf. Do not move or bump the jar.</Step>
            <Step>Step 7: Observe the jar at three specific time intervals: 2 minutes, 2 hours, and 24 hours.</Step>
            <p><strong>Expected Stratification Observations (Layers from Bottom to Top):</strong> The Bottom Layer (Gravel and Sand) settles within the first 30 to 60 seconds. The Middle Layer (Silt) settles over the next 1 to 2 hours, forming a distinct smooth layer above the sand. The Upper Sediment Layer (Clay) settles very slowly, taking up to 24 hours, forming a smooth dense layer on top of the silt. The Water Layer stays cloudy for hours before turning mostly clear. The Floating Layer (Humus) × organic material, leaf fragments, root fibers float on top of the water because they are less dense than water.</p>
          </SubSection>
        </SubSection>
      </Section>

      <Section title="MODULE 2: CROP PRODUCTION, MANAGEMENT & HORTICULTURE">
        <SubSection title="2.1 Categorization and Classification of Crops">
          <BulletList items={[
            'Cereal Crops (Grains): Members of the grass family (Poaceae), produce edible starchy seeds. Examples: Maize, wheat, rice, barley, sorghum, finger millet, oats. Primary source of dietary carbohydrates.',
            'Leguminous Crops (Pulses): Members of the Fabaceae family, produce seeds in pods, symbiotic relationship with Rhizobium bacteria in root nodules to fix atmospheric nitrogen into the soil. Examples: Beans, peas, cowpeas, green grams, groundnuts, soybeans. Rich in plant-based proteins.',
            'Horticultural Crops: Pomology (Fruit Culture) × mangoes, avocados, oranges, pineapples, passion fruits, bananas, pawpaws. Olericulture (Vegetable Production) × kales/sukuma wiki, cabbages, tomatoes, onions, spinach, carrots, French beans. Floriculture (Ornamental & Flower Gardening) × roses, carnations, lilies, orchids for aesthetic displays, landscaping, and export.',
            'Root and Tuber Crops: Modified root structures or underground stems storing carbohydrates. Examples: Cassava, sweet potatoes, Irish potatoes, yams, arrowroots/cocoyams.',
            'Industrial and Cash Crops: Grown primarily for processing into commercial products or for export. Examples: Tea, coffee, sugarcane, cotton, pyrethrum, sisal.'
          ]} />
        </SubSection>

        <SubSection title="2.2 Land Preparation and Seedbed Cultivation">
          <BulletList items={[
            'Primary Land Cultivation: Initial breaking and turning over of hard, uncultivated soil, usually at the end of the dry season or ahead of the rains. Objectives: loosen compact soil, bury weeds and crop residues to decompose, expose underground pests to predators and sunlight, open up soil to absorb early rainfall. Tools: Hand hoes (jembe), ox-drawn moldboard plows, or tractor-mounted disc plows.',
            'Secondary Land Cultivation: Refines the rough layout left by primary cultivation. Breaks up large clods, levels the surface, clears remaining weeds. Objectives: create a fine, crumbly soil texture (fine tilth) for good seed-to-soil contact and easy root establishment, level the seedbed for uniform planting depths and water distribution. Tools: Rakes, hand forks, spring-tooth harrows, rotary tillers.',
            'Types of Planting Beds: Flat Beds (level land with well-drained soils and reliable rainfall). Raised Beds (mounded soil 15°30 cm above ground level, useful in heavy clay soils or low-lying areas prone to waterlogging, improve root aeration and drainage). Sunken Beds (dug slightly below ground level, common in arid and semi-arid regions because they catch and hold scarce water, sheltering seedlings from dry winds).'
          ]} />
        </SubSection>

        <SubSection title="2.3 Nursery Establishment and Transplanting Protocols">
          <p>A nursery is a small, specialized, intensely managed plot of land where delicate seeds are sown to grow into healthy seedlings under protected conditions before being moved to their permanent fields.</p>
          <BulletList items={[
            'Crops That Require a Nursery: Small-seeded crops with delicate early growth stages × tomatoes, cabbages, kales, onions, green peppers, eggplants.',
            'Advantages: Concentrated Protection (easy to shelter young plants from harsh sunlight, heavy downpours, pests, and diseases). Efficient Resource Use (reduces water waste, allows targeted fertilizer/compost application). Quality Control (select only the healthiest, most vigorous seedlings for transplanting, ensuring uniform stand). Better Seed Management (maximizes germination success of expensive or tiny hybrid seeds).',
            'Steps to Establish a Standard Nursery Bed: Site Selection (well-drained, secure spot close to clean water source, sheltered from strong winds, gentle slope; avoid areas where same crop family was recently grown). Clearing and Digging (dig thoroughly to deep depth, break all soil clumps to very fine tilth, mix in plenty of well-decomposed compost manure). Bed Dimensions (standard width of 1 meter for easy reach from both sides without stepping on bed; length can vary). Drilling Seeds (make shallow parallel grooves/drills spaced 10°15 cm apart across bed surface, sow seeds thinly along drills, cover lightly with fine soil). Mulching (cover bed surface with thin layer of dry grass or clean straw to keep soil moist, prevent seeds from washing away, stop soil crusting). Watering (use watering can fitted with fine rose spray; water twice daily, early morning and late evening). Shade Construction (once seeds sprout, lift mulch and place onto low wooden frame 50 cm high to form protective shade canopy; gradually reduce shade to harden off seedlings).',
            'Hardening-Off Process: Over 7 to 10 days before transplanting, gradually reduce water given to seedlings and remove shade structure completely. This slows vegetative growth, thickens cell walls, and helps prevent transplant shock.',
            'Execution of Transplanting: Timing × late afternoon (from 4:00 PM onwards) or cloudy, overcast day to minimize water loss from transpiration and reduce heat stress. Selection × pick thick, sturdy seedlings with 4 to 6 true leaves or roughly 10°15 cm tall. Extraction × water nursery bed thoroughly an hour before lifting; use hand fork or trowel to lift seedlings gently with ball of soil (earth ball) attached to roots. Planting × place seedlings into pre-dug holes in main field at same depth they were growing in nursery; firm soil gently around base and water immediately.'
          ]} />
        </SubSection>

        <SubSection title="2.4 Crop Maintenance Practices">
          <BulletList items={[
            'Thinning: Removing weak, diseased, or overcrowded seedlings from a row to give remaining plants enough space, light, and nutrients to thrive.',
            'Gapping: Sowing seeds or planting seedlings in spots where original seeds failed to sprout or died after transplanting, ensuring a full crop stand across the field.',
            'Weeding: Removing unwanted plants (weeds) that compete with the main crop for sunlight, water, space, and soil nutrients. Weeds can also harbor pests and diseases.',
            'Mulching: Covering soil surface around crops with organic materials (dry grass, leaves, sawdust) or synthetic sheets. Conserves soil moisture, suppresses weed growth, regulates soil temperature, adds organic matter as it breaks down.',
            'Pruning: Trimming away excess side branches, dead leaves, or diseased sections of a plant. Improves air circulation, lets in more sunlight, reduces pest habitats, directs plant energy toward producing high-quality fruits or pods.',
            'Staking: Supporting weak-stemmed plants (tall tomato varieties, peas, passion fruit vines) by tying them gently to upright wooden stakes or wire trellises. Keeps fruits off damp ground, reducing rots and making harvesting easier.'
          ]} />
        </SubSection>
      </Section>

      <Section title="MODULE 3: ANIMAL HUSBANDRY & LIVESTOCK PRODUCTION">
        <SubSection title="3.1 Categorization and Economic Import of Livestock">
          <BulletList items={[
            'Large Ruminants (Cattle): Dairy Cattle (Holstein-Friesian, Ayrshire, Guernsey, Jersey). Beef Cattle (Hereford, Aberdeen Angus, Charolais, Brahman). Dual-Purpose Cattle (Simmental, Sahiwal).',
            'Small Ruminants (Sheep and Goats): Sheep × wool (Merino), meat/mutton (Dorper, Blackhead Persian), dual-purpose. Goats × dairy (Saanen, Toggenburg, Alpine), meat/chevon (Boer goat, East African Goat).',
            'Non-Ruminant Monogastrics (Pigs and Poultry): Pigs × Large White, Landrace, Duroc for pork and bacon. Poultry × Layers (White Leghorn for high egg production), Broilers (fast-growing meat birds), Dual-Purpose/Indigenous (Kienyeji, hardy and well-adapted).',
            'Camelids and Equines: Camels (valued in arid regions for milk, meat, transport due to drought tolerance). Donkeys and Horses (transport and draft power to pull farm carts or plows).'
          ]} />
        </SubSection>

        <SubSection title="3.2 Livestock Housing Systems & Structures">
          <BulletList items={[
            'Dairy Cattle Housing (Zero-Grazing Unit): Walking Area (secure concrete floor sloped toward drainage channel, slightly roughened to prevent slipping). Cubicles/Resting Stalls (elevated individual stalls bedded with sawdust, straw, or rubber mats to prevent mastitis and hock injuries). Feeding Trough (long, smooth concrete or wooden troughs along front of unit). Milking Parlor (clean, hygienic, separate area with clean water connections and easy-to-sanitize structures).',
            'Poultry Housing Systems: Free-Range System (birds roam freely across open pasture during day, return to simple shelter at night; minimal capital but higher risks from predators, theft, disease). Deep Litter System (birds kept inside completely enclosed, draught-free house; floor covered with 15°20 cm layer of clean, absorbent litter like wood shavings or chopped straw; litter absorbs droppings and must be kept dry to prevent coccidiosis). Battery Cage System (birds housed in long rows of tiered wire cages, typically 1 to 4 birds per compartment; sloped cage floors allow eggs to roll out automatically into collection tray; maximizes space but requires significant upfront investment and raises animal welfare concerns).'
          ]} />
        </SubSection>

        <SubSection title="3.3 Livestock Nutrition and Feeding Strategies">
          <BulletList items={[
            'Roughages: High fiber content, lower nutrient density. Succulent Roughages × fresh, moisture-rich feeds (Napier grass, lucerne, sweet potato vines, green pasture grasses). Dry Roughages × low-moisture dry season reserves (maize stalks, wheat straw, baled grass hay). Silage × fresh green forage (maize or sorghum) chopped, packed tightly into airtight pit or bunker, preserved through anaerobic lactic acid fermentation.',
            'Concentrates: Low fiber content, high energy or protein density. Energy Concentrates × rich in carbohydrates (maize germ, wheat bran, molasses). Protein Concentrates × rich in amino acids (cotton seed cake, sunflower cake, fish meal / omena). Commercial Formulations × ready-mixed feeds targeted to specific growth stages (Chick Mash, Growers Mash, Layers Mash, Dairy Meal).',
            'Supplements and Additives: Mineral Licks/Blocks placed in habitats to provide essential micronutrients like calcium, phosphorus, iron, and iodine, helping prevent deficiency conditions like milk fever.'
          ]} />
        </SubSection>

        <SubSection title="3.4 Animal Health Management, Vectors, and Parasites">
          <p>A healthy animal is alert, has a bright coat, eats eagerly, moves freely, and maintains steady milk or egg production. Diseases and parasites can cause serious production losses or death.</p>
          <BulletList items={[
            'Ectoparasites (External Parasites): Ticks (attach to skin, suck blood causing anemia, damage hides, transmit deadly diseases like East Coast Fever/ECF, Anaplasmosis, Redwater). Lice and Mites (cause severe skin irritation, scratching, hair loss, scabs). Control Methods: Acaricide Spraying or Dipping (pass animals through plunge dip or use backpack sprayer every week). Biological Control (keep pastures short, rotate livestock to break tick life cycle).',
            'Endoparasites (Internal Parasites): Roundworms/Nematodes (inhabit stomach and intestines, suck blood, steal nutrients, cause rough coat, potbelly, diarrhea, weight loss). Tapeworms/Cestodes (segmented flatworms living in digestive tract, absorb digested food causing nutritional deficiencies). Liver Flukes/Trematodes (leaf-shaped worms living in liver bile ducts, cause liver damage and bottle jaw × fluid swelling under jaw; require mud snails as intermediate hosts in wet pastures). Control Methods: Routine Deworming (administer anthelmintic drugs orally or via injection every 3 months). Pasture Management (drain swampy areas to kill mud snails, rotate pastures to prevent grazing on contaminated grass).'
          ]} />
        </SubSection>
      </Section>

      <Section title="MODULE 4: WATER MANAGEMENT, IRRIGATION & CONSERVATION">
        <SubSection title="4.1 The Hydrological Cycle and Agricultural Water Sources">
          <p>Water is an essential input for all agricultural systems. It acts as a solvent that transports plant nutrients, maintains plant cell turgor pressure for upright growth, cools plants through transpiration, and satisfies livestock metabolic needs.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       [ Condensation / Clouds ]
            ?             ×
            ×             ?  (Precipitation / Rain)
     Evaporation &  +-------------------------------+
     Transpiration × AGRICULTURAL WATER       ×
            ×       +-------------------------------+
            ×                       ×
      [ Plants/Oceans ]    +-----------------+
                           ?                 ?
                     [ Surface Water ] [ Ground Water ]
                      × Rivers & Dams × Boreholes × Roof Runoff × Shallow Wells`}</pre>
          <BulletList items={[
            'Surface Water: Rivers, streams, natural lakes, and man-made earth dams. Easily accessible but prone to pollution and evaporation losses.',
            'Groundwater: Deep boreholes and shallow hand-dug wells. Often cleaner than surface water but may require specialized pumps and energy to lift to the surface.'
          ]} />
        </SubSection>
      </Section>

      <Section title="ANIMAL PRODUCTION, LIVESTOCK STRUCTURES, AND HEALTH MANAGEMENT">
        <SubSection title="4.1 Introduction to Livestock Structures">
          <p>Livestock structures are custom-built physical frameworks or enclosures designed to house domesticated animals. They protect animals from extreme weather, minimize disease transmission, simplify daily management routines, and protect stock from predators or thieves.</p>
          <BulletList items={[
            'Adequate Ventilation and Air Quality: Constant air exchange to remove toxic gases (ammonia NH3, carbon dioxide CO2, hydrogen sulfide H2S) from decomposing manure and animal respiration. Open-sided or high-ceiling designs capitalize on natural convection and wind currents. Poor ventilation causes excessive humidity, accelerates pathogens, and causes respiratory infections like pneumonia.',
            'Adequate Floor Space Allocations: Insufficient floor space causes physical crowding, elevates stress hormones, triggers negative behaviors like tail-biting in pigs, cannibalism in poultry, or bullying at feeding troughs in cattle. Minimum Space Requirement per Animal (m×) = Total Pen Floor Area × Maximum Number of Stocking Animals.',
            'Efficient Drainage and Waste Removal Systems: Liquid waste accumulation breeds harmful bacteria and foot-rot fungi. Concrete floors in cattle sheds and pig sties require a minimum slope of 1% to 2% (1 cm to 2 cm drop for every 1 meter of length) leading toward drainage channels.',
            'Thermal Comfort and Insulation: Animals use significant metabolic energy to stay warm or cool when kept outside their thermal comfort zone. Roof heights must be high enough to minimize radiant heat transfer. Use insulating materials like thatch or treated timber roofs where commercial metallic sheets create intense heat or noise.',
            'Safety, Security, and Biosecurity Access Control: Use smooth, durable building materials to prevent physical injury, puncture wounds, or bruising. Fences and gates must keep out wild predators and stray domestic animals. Footbaths containing broad-spectrum disinfectants should be placed at every main entrance to control incoming pathogens.'
          ]} />
        </SubSection>

        <SubSection title="4.2 Dairy Cattle Housing Systems">
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                     [ Dairy Cattle Housing Systems ]
                                     ×
         +-------------------------------------------------------+
         ?                                                       ?
[ Intensive Systems ]                                  [ Semi-Intensive Systems ]
  × Complete Zero-Grazing Units × Loose Housing Barns × Stanchion Barns (Tie-Stalls) × Open Corrals with Feed Bunks × Cubicle/Freestall Housing × Semi-Permanent Shelters`}</pre>
          <SubSection title="4.2.1 Detailed Engineering Design of a Zero-Grazing Unit">
            <p>A zero-grazing unit is an intensive production system where dairy cattle are confined to a permanent structure. All feed, water, and health services are brought directly to the animals.</p>
            <BulletList items={[
              'The Cubicle Section (Resting Area): Divided into individual stalls where cows can lie down without interference from herd mates. Dimensions: 2.10 m length × 1.20 m width for standard dairy breeds like Friesians or Ayrshires. Floor Construction: Raised 10°15 cm above walking lane to stay dry, using packed red soil, sand, or heavy-duty rubber mats over concrete to prevent skin abrasions and hock joint injuries. Dividers: 50 mm diameter galvanized steel pipes, curved to guide cow into straight resting position so manure falls cleanly into adjacent walking lane.',
              'The Walking Lane (Exercise Area): Concrete must be finished with rough pattern (deep grooves or herringbone scoring) to prevent slipping. Width: minimum 2.4 m for single-row configurations, increasing to 3.0 m for double-row structures so two cows can pass comfortably.',
              'The Feeding and Watering Section: Feeding Trough/Manger × built along outer wall of walking lane, smooth plaster finish to prevent oral irritation, 60 cm wide at top, 40 cm wide at base, front wall height 30 cm. Head Barriers × diagonal neck rails or self-locking stanchions above feed trough to prevent cows from stepping into feed, tossing silage, or pushing weaker herd members away. Watering Trough × placed away from feed troughs to keep water free of decaying organic matter, automatic float-valve systems for continuous water access (high-yielding dairy cows require up to 150 liters of water daily).',
              'The Drainage Canal: Located directly behind cubicles and along walking lane. Dimensions: 30°40 cm wide and at least 15 cm deep. Floor must maintain continuous downward slope (2%) toward external manure storage tank or biogas digester.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="4.6 Comprehensive Structural Calculations">
          <SubSection title="4.6.1 Mathematical Problem 1: Designing an Intensive Deep Litter Poultry Unit">
            <p><strong>Problem:</strong> A poultry farmer wants to establish a commercial layer enterprise housing a flock of 3,500 mature birds using the intensive deep litter system. The design guidelines specify a stocking density of exactly 0.22 square meters of floor space per bird. To maintain natural ventilation across the building, the width of the structure must not exceed 9.0 meters.</p>
            <p><strong>Calculate:</strong></p>
            <Step>Step 1: Total Internal Floor Area = Total Flock Population × Space Allocation per Bird = 3,500 × 0.22 = 770 m³.</Step>
            <Step>Step 2: Structural Length = Total Floor Area × Fixed Structure Width = 770 m³ × 9.0 m = 85.56 meters.</Step>
            <Step>Step 3: Feeder Units Required = Total Flock Population × Capacity per Feeder Unit = 3,500 × 50 = 70 feeder units.</Step>
          </SubSection>

          <SubSection title="4.6.2 Mathematical Problem 2: Dairy Unit Slurry Storage Pit Volumetric Sizing">
            <p><strong>Problem:</strong> A zero-grazing dairy unit houses 12 lactating cows. Each adult cow produces an average of 55 liters (0.055 m³) of combined solid and liquid manure slurry per day. The farmer wants to construct a rectangular, concrete-lined underground slurry storage tank capable of holding 60 days of total waste accumulation without overflowing. The local water table limits the maximum excavation depth of the pit to exactly 2.0 meters, and the width is fixed at 2.5 meters.</p>
            <p><strong>Calculate:</strong></p>
            <Step>Step 1: Total Slurry Volume = Cows × Daily Waste/Cow × Storage Days = 12 × 0.055 m³ × 60 = 39.6 m³.</Step>
            <Step>Step 2: Required Horizontal Length = Volume × (Width × Depth) = 39.6 m³ × (2.5 m × 2.0 m) = 39.6 × 5.0 = 7.92 meters.</Step>
          </SubSection>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- HRE NOTES ----------
function HRENotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>??? HRE: Hindu Religious Education</h2>

      <Section title="MODULE 1: HINDUISM (HRE) GRADE 5 COMPREHENSIVE CURRICULUM NOTES">
        <Section title="CHAPTER 1: PARAMATMA (THE SUPREME BEING) AND HIS MANIFESTATIONS">
          <SubSection title="1.1 The Concept of Paramatma">
            <p>In Hindu Religious Education (HRE), God is referred to as Paramatma or Brahman. Paramatma is the Supreme Soul, the ultimate reality, and the source of everything in the universe. He is without beginning and without end (eternal).</p>
            <BulletList items={[
              'Nirguna Brahman: God without form, attributes, or visible qualities. In this aspect, Paramatma is omnipresent (everywhere), omniscient (all-knowing), and omnipotent (all-powerful). He is like electricity × invisible but filling the entire world with energy.',
              'Saguna Brahman: God with form, attributes, and characteristics. To help humans understand, love, and pray to Him, Paramatma manifests Himself in visible shapes, forms, and personalities known as Deotas (deities) and Avatars (incarnations).'
            ]} />
          </SubSection>

          <SubSection title="1.2 The Trimurti (The Triple Manifestation)">
            <p>Paramatma controls the universe through three primary cosmic functions: Creation, Preservation, and Dissolution (Destruction for rebirth). These three functions are represented by the Trimurti:</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                       [ PARAMATMA / BRAHMAN ]
                                  ×
         +------------------------+------------------------+
         ?                        ?                        ?
    [ BRAHMA ]               [ VISHNU ]                [ SHIVA ]
 (The Creator)            (The Preserver)           (The Dissolver)
 Consort: Saraswati        Consort: Lakshmi          Consort: Parvati
 Vahana: Hamsa            Vahana: Garuda            Vahana: Nandi`}</pre>

            <SubSection title="A. Lord Brahma (The Creator)">
              <BulletList items={[
                'Role: He is responsible for the creation of the universe and all living beings.',
                'Appearance: He is depicted with four heads facing the four cardinal directions (North, South, East, West), representing the four Vedas. He holds a water pot (Kamandalu), a rosary (Akshamala), the Vedas, and a lotus flower. He does not hold any weapons, symbolizing that creation happens through peace and knowledge.',
                'Consort: Goddess Saraswati, the deity of wisdom, arts, music, and learning.',
                'Vehicle (Vahana): The Hamsa (swan), which symbolizes spiritual discrimination × the ability to separate good from evil, just as a swan is said to separate milk from water.'
              ]} />
            </SubSection>

            <SubSection title="B. Lord Vishnu (The Preserver)">
              <BulletList items={[
                'Role: He protects, preserves, and maintains cosmic order (Dharma) in the universe. Whenever evil threatens the world, Lord Vishnu incarnates on Earth to restore balance.',
                'Appearance: He has a dark blue complexion, representing the infinite sky and ocean. He has four arms holding: Shankha (Conch shell × primordial sound of creation Om), Chakra (Discus/Sudarshana × wheel of time and destruction of evil), Gada (Mace × mental and physical strength), Padma (Lotus × purity, spiritual liberation, and beauty).',
                'Consort: Goddess Lakshmi, the deity of wealth, prosperity, and good fortune.',
                'Vehicle (Vahana): Garuda, a divine eagle-like bird that represents speed, courage, and soaring spiritual awareness.'
              ]} />
            </SubSection>

            <SubSection title="C. Lord Shiva (The Dissolver/Transformer)">
              <BulletList items={[
                'Role: He is responsible for the dissolution, destruction, and transformation of the universe. His destruction is not negative; it clears away old, decayed matter to allow for new creation.',
                'Appearance: He is depicted as an ascetic yogi sitting in deep meditation on Mount Kailash. Key features include: Third Eye (spiritual wisdom and cosmic destruction of ignorance), Crescent Moon (control over time), River Ganga flowing from his hair (purification), Trishul/Trident (mastery over the three worlds × physical, ancestral, spiritual), Damru/Drum (rhythm of cosmic vibrations), Snakes around his neck (control over fear, death, and poison).',
                'Consort: Goddess Parvati (also known as Durga, Kali, or Shakti), representing divine cosmic energy.',
                'Vehicle (Vahana): Nandi, the sacred bull, representing strength, devotion, and righteousness.'
              ]} />
            </SubSection>
          </SubSection>
        </Section>

        <Section title="CHAPTER 2: SCRIPTURES (HOLY BOOKS)">
          <SubSection title="2.1 Classification of Hindu Scriptures">
            <p>Hindu scriptures are vast and are divided into two main categories: Shruti and Smriti.</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                         [ HINDU SCRIPTURES ]
                                  ×
         +-------------------------------------------------+
         ?                                                 ?
    [ SHRUTI ]                                        [ SMRITI ]
 "That which is heard"                             "That which is remembered"
  × Direct divine revelations × Human compositions, epics, laws × Examples: The Four Vedas × Examples: Ramayana, Mahabharata, Puranas`}</pre>
            <BulletList items={[
              'Shruti (Divine Revelation): Means "that which is heard." These are the oldest, most authoritative texts. Ancient sages (Rishis) heard these eternal truths directly from Paramatma while in deep meditation. They were passed down orally for generations before being written down. The Vedas are the core of Shruti.',
              'Smriti (Tradition/Remembered Texts): Means "that which is remembered." These are human compositions written by wise sages to explain the deep philosophy of the Vedas through stories, historical epics (Itihasas), codes of conduct, and poems. They change over time to suit different eras. Examples include the Ramayana, Mahabharata, and Puranas.'
            ]} />
          </SubSection>

          <SubSection title="2.2 The Four Vedas">
            <p>The word Veda comes from the Sanskrit root Vid, which means "to know." Therefore, Veda means Sacred Knowledge. Sanyasi Veda Vyasa compiled and organized the vast Vedic knowledge into four parts:</p>
            <BulletList items={[
              'Rig Veda: The oldest and most important Veda. It contains 1,028 hymns (Mantras or Suktas) dedicated to deities like Agni (fire), Indra (rain/thunder), and Varuna (water). It teaches praise, devotion, and cosmic order.',
              'Sama Veda: The Veda of melodies and chants. It consists of musical arrangements of the hymns found in the Rig Veda. It is sung by priests during religious sacrifices (Yajnas) and forms the foundation of Indian classical music.',
              'Yajur Veda: The Veda of rituals and sacrifices. It contains specific instructions, prose formulas, and guidelines on how to perform prayers, altars, offerings, and ceremonial rituals correctly.',
              'Atharva Veda: The Veda of daily living and practical sciences. It contains formulas, prayers, spells, and hymns covering medicine (Ayurveda), mathematical principles, agriculture, domestic peace, and defense against diseases or negative energies.'
            ]} />
          </SubSection>

          <SubSection title="2.3 The Great Epics (Itihasas)">
            <p>The Epics are part of Smriti literature and teach moral values, duty (Dharma), family relationships, and governance through real-life historical examples.</p>
            <SubSection title="A. The Ramayana">
              <BulletList items={[
                'Author: Written by the sage Valmiki.',
                'Core Story: It describes the life, journey, and trials of Lord Rama (the 7th Avatar of Lord Vishnu), his wife Sita, and his loyal brother Lakshmana. Lord Rama is exiled to the forest for 14 years due to his stepmother\'s demands. While in the forest, the demon king Ravana kidnaps Sita and takes her to Lanka. With the help of the monkey warrior Hanuman and an army of Vanaras, Lord Rama builds a bridge across the ocean, defeats Ravana, frees Sita, and returns to Ayodhya to be crowned king.',
                'Key Moral Teachings: Obedience (Rama shows total obedience to his father King Dasharatha). Loyalty (Lakshmana shows unmatched brotherly devotion). Chastity & Patience (Sita shows strength and purity under captivity). Selfless Service (Hanuman shows total devotion to God). Victory of Dharma (Good always triumphs over evil).'
              ]} />
            </SubSection>
            <SubSection title="B. The Mahabharata">
              <BulletList items={[
                'Author: Written by the sage Veda Vyasa.',
                'Core Story: It is the longest epic poem in the world. It describes the massive conflict and war between two groups of cousins over the kingdom of Hastinapur: the Pandavas (five righteous brothers led by Yudhishthira) and the Kauravas (one hundred wicked brothers led by Duryodhana). The conflict reaches its peak at the Battle of Kurukshetra. Lord Krishna acts as the charioteer for the Pandava warrior Arjuna. With Krishna\'s spiritual guidance, the Pandavas defeat the Kauravas and restore righteousness.',
                'The Bhagavad Gita: A sacred 700-verse text found within the Bhishma Parva chapter of the Mahabharata. Right before the battle starts, Arjuna becomes sad and confused about fighting his own relatives. Lord Krishna delivers a deep spiritual discourse to him on the battlefield.',
                'Key Teachings of the Bhagavad Gita: Karma Yoga (do your duty selflessly without worrying about rewards or results). Immortality of the Soul/Atman (the body can be destroyed, but the soul never dies). Bhakti Yoga (surrender your mind and actions to Paramatma with complete love and devotion).'
              ]} />
            </SubSection>
          </SubSection>
        </Section>

        <Section title="CHAPTER 3: SADHACHAR (MORAL VALUES AND ETHICAL LIVING)">
          <SubSection title="3.1 The Concept of Dharma">
            <p>Dharma is the foundation of Hindu life. The word comes from the Sanskrit root Dhri, which means "to sustain" or "to hold together." Dharma refers to righteousness, duty, moral obligation, correct behavior, and cosmic order.</p>
            <BulletList items={[
              'Samanya Dharma (Universal Duties): Values that must be practiced by every human being regardless of age, caste, race, or country. These include truthfulness, non-violence, purity, compassion, and self-control.',
              'Visesha Dharma (Specific Duties): Specific roles and responsibilities dependent on one\'s stage in life (e.g., a student\'s duty is to study hard; a parent\'s duty is to protect and provide for children).'
            ]} />
          </SubSection>

          <SubSection title="3.2 The Five Yamas (Restraints / Social Ethics)">
            <p>According to the Yoga Sutras, the Yamas are moral, ethical, and societal rules designed to govern how humans interact harmoniously with society and the environment.</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                          [ THE FIVE YAMAS ]
                                  ×
      +---------------------------+---------------------------+
      ?               ?           ?           ?               ?
 [ AHIMSA ]       [ Satya ]  [ ASTEYA ]  [ Brahmacharya ] [ APARIGRAHA ]
Non-violence     Truthfulness Non-stealing Self-restraint Non-possessiveness`}</pre>
            <BulletList items={[
              'Ahimsa (Non-violence): Not causing harm, pain, or injury to any living being through thoughts, words, or actions. This is why many Hindus choose a vegetarian diet. It involves avoiding abusive words or angry thoughts toward classmates and family.',
              'Satya (Truthfulness): Speaking the truth with kindness. It means being honest in your words and actions, avoiding lies, cheating, or deceit. A true Hindu student does not cheat in exams or spread rumors.',
              'Asteya (Non-stealing): Not taking or desiring something that belongs to someone else without their permission. It includes respecting other people\'s intellectual property, personal belongings, and space.',
              'Brahmacharya (Self-Restraint / Purity): Controlling one\'s senses, desires, and impulses. For students, it means channeling all mental and physical energy into learning, sports, moral growth, and respecting elders, rather than wasting time on harmful distractions.',
              'Aparigraha (Non-possessiveness / Non-greed): Living a simple life and not accumulating material things beyond what is truly necessary. It fights greed, envy, and hoarding, encouraging sharing and charity (Daana).'
            ]} />
          </SubSection>

          <SubSection title="3.3 The Concept of Seva (Selfless Service)">
            <p>Seva means serving others without expecting any material reward, praise, or recognition in return. Hinduism teaches that since Paramatma resides within the hearts of all living beings as the Atman, serving humanity and animals is equivalent to serving God directly (Manav Seva is Madhav Seva).</p>
            <BulletList items={[
              'Seva to Parents: Helping with household chores, cooking, cleaning, and taking care of them in their old age.',
              'Seva to School/Community: Keeping classrooms clean, planting trees, helping classmates who struggle with schoolwork, and donating clothes or food to those in need.',
              'Seva to Animals & Environment: Feeding stray animals, placing water bowls outside for birds during hot weather, avoiding pollution, and recycling plastic.'
            ]} />
          </SubSection>
        </Section>

        <Section title="CHAPTER 4: RITUALS, FESTIVALS, AND SANSKARS">
          <SubSection title="4.1 Understanding Sanskars (Sacraments)">
            <p>Sanskars are sacred rites of passage, ceremonies, and sacraments performed throughout a person's life to purify the mind, body, and soul, marking transitions from one stage of growth to another. Traditional texts list 16 main Sanskars (Shodasha Sanskaras).</p>
            <BulletList items={[
              'Vidyarambha (Beginning of Education): Performed when a child is around 3-4 years old. The child is taught to write their first letters (usually the sacred symbol Om or a mantra) in a tray of rice grains or sand. This invokes Goddess Saraswati to bless the child\'s mind.',
              'Upanayana (The Sacred Thread Ceremony): Marks a child\'s formal entry into the world of spiritual and academic learning (Brahmacharya Ashrama). The child receives a three-stranded sacred thread called the Yajnopavita, representing three duties: duty to God, duty to ancestors, and duty to sages. They are initiated into chanting the Gayatri Mantra.',
              'Vivaha (Marriage): The holy union of a man and a woman to start a family, entering the Grihastha Ashrama (householder stage). The couple walks seven steps (Saptapadi) together around the sacred fire, making vows of love, loyalty, mutual support, and joint adherence to Dharma.'
            ]} />
          </SubSection>

          <SubSection title="4.2 Major Hindu Festivals">
            <p>Festivals are times for community unity, spiritual renewal, charity, and joyful celebration.</p>
            <SubSection title="A. Diwali (The Festival of Lights)">
              <BulletList items={[
                'Significance: Celebrates the return of Lord Rama, Sita, and Lakshmana to their kingdom of Ayodhya after 14 years of exile and their historic victory over the demon king Ravana. The citizens of Ayodhya lit rows of clay lamps (Diyas) to welcome them home on a dark moonless night (Amavasya).',
                'How it is celebrated: Cleaning and painting homes; decorating thresholds with beautiful colorful chalk powder designs called Rangoli; lighting oil diyas; wearing new clothes; sharing sweets with family and neighbors; and offering prayers (Puja) to Goddess Lakshmi for spiritual and material prosperity.',
                'Spiritual lesson: The victory of light over darkness, knowledge over ignorance, and righteousness over evil.'
              ]} />
            </SubSection>
            <SubSection title="B. Janmashtami">
              <BulletList items={[
                'Significance: Marks the divine birth (Avatarana) of Lord Krishna, the eighth incarnation of Lord Vishnu, who appeared on Earth to destroy the tyrant king Kansa and deliver the Bhagavad Gita.',
                'How it is celebrated: Devotees fast until midnight (the exact time Lord Krishna was born in a prison cell in Mathura). Temples are decorated with flowers and lights. Tiny cradles with idols of baby Krishna (Ladoo Gopal) are gently rocked. Devotees sing devotional songs (Bhajans) and perform traditional dances.',
                'Dahi Handi: In many areas, teams build human pyramids to reach and break an earthen pot filled with yogurt and butter tied high up, recreating Krishna\'s childhood fun of stealing butter with his friends.'
              ]} />
            </SubSection>
            <SubSection title="C. Navratri and Dussehra">
              <BulletList items={[
                'Navratri means "nine nights." It is dedicated to the worship of the Divine Mother in her various forms: Goddess Durga (strength and protection), Goddess Lakshmi (wealth and peace), and Goddess Saraswati (wisdom and music). It celebrates Goddess Durga\'s battle and victory over the buffalo demon Mahishasura.',
                'Dussehra (Vijayadashami): The tenth day following Navratri. It marks the day Lord Rama killed Ravana, as well as the day Goddess Durga completed her victory.',
                'How it is celebrated: Performing special daily Pujas for nine nights; participating in vibrant community folk dances like Garba and Dandiya Raas using wooden sticks; fasting; and displaying artistic arrangements of dolls (Golu). On Dussehra, large paper models of Ravana are burned to symbolize the complete destruction of negative ego and pride.'
              ]} />
              <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                           [ NAVRATRI STAGES ]
                                    ×
         +--------------------------+--------------------------+
         ?                          ?                          ?
   [ DAYS 1 - 3 ]             [ DAYS 4 - 6 ]             [ DAYS 7 - 9 ]
   Goddess Durga              Goddess Lakshmi           Goddess Saraswati
(Destroys bad habits)      (Grants good qualities)     (Bestows ultimate wisdom)`}</pre>
            </SubSection>
          </SubSection>
        </Section>
      </Section>

      <Section title="MODULE 2: REVISION COMPANION (HIGH-DENSITY PRACTICE QUESTIONS)">
        <p>This section contains highly structured practice questions designed to assess comprehension, analytical skill, and application of HRE principles according to Grade 5 curriculum patterns.</p>

        <SubSection title="PART I: MULTIPLE-CHOICE QUESTIONS (40 MARKS)">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Paramatma has two aspects: Nirguna and Saguna. Which describes Nirguna?</strong> C × God who is formless, invisible, omnipresent, and beyond human sight.</p>
            <p><strong>2. A deity holding a trident (Trishul), crescent moon in matted hair, snake coiled around neck × which deity?</strong> B × Lord Shiva.</p>
            <p><strong>3. Lord Vishnu's consort is Goddess Lakshmi. Her role?</strong> C × She grants spiritual and material wealth, prosperity, and good fortune.</p>
            <p><strong>4. Correct match of Trimurti deity to their Vahana?</strong> D × Lord Brahma × Hamsa (The Swan).</p>
            <p><strong>5. What makes Shruti texts unique?</strong> B × They are direct divine revelations heard by ancient Rishis in deep meditation.</p>
            <p><strong>6. Which Veda focuses on musical melodies and chants?</strong> C × Sama Veda.</p>
            <p><strong>7. Why did Lord Rama leave Ayodhya for 14 years?</strong> C × He chose to obey his father's command and protect family honor.</p>
            <p><strong>8. Who speaks in the Bhagavad Gita dialogue?</strong> C × Lord Krishna and the Pandava prince Arjuna.</p>
            <p><strong>9. Returning a lost wallet to find the owner × which Yama?</strong> B × Asteya.</p>
            <p><strong>10. "Manav Seva is Madhav Seva" means?</strong> A × Serving humanity and helping others is the same as serving God.</p>
            <p><strong>11. Cheating on an exam violates which value?</strong> B × Satya (Truthfulness and Integrity).</p>
            <p><strong>12. Example of Aparigraha at home?</strong> C × Living simply, being content, donating extra items to the poor.</p>
            <p><strong>13. What does Vidyarambha Sanskar mark?</strong> B × A child's formal entry into education, writing their first letters.</p>
            <p><strong>14. Why light Diyas during Diwali?</strong> C × To guide Lord Rama back to Ayodhya and celebrate light over darkness.</p>
            <p><strong>15. Janmashtami celebrates whose birth?</strong> B × Lord Krishna.</p>
            <p><strong>16. How long does Navratri last?</strong> C × Nine nights.</p>
            <p><strong>17. What item represents the primordial sound of creation?</strong> B × The Shankha (Conch shell).</p>
            <p><strong>18. Which Veda deals with medicine and daily living?</strong> C × Atharva Veda.</p>
            <p><strong>19. How to practice Ahimsa toward animals?</strong> C × Providing water bowls for birds and refusing to mistreat stray animals.</p>
            <p><strong>20. The Yajnopavita sacred thread has how many strands?</strong> C × Three strands representing duties to God, ancestors, and sages.</p>
          </div>
        </SubSection>

        <SubSection title="PART II: SHORT ANSWER QUESTIONS (40 MARKS)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>21. Define Paramatma and list the two main aspects.</strong> Answer: Paramatma is the Supreme Soul, the ultimate reality and source of everything, eternal without beginning or end. Two aspects: Nirguna Brahman (formless, invisible) and Saguna Brahman (God with form and attributes).</p>
            <p><strong>22. Identify the Trimurti deities and their cosmic roles.</strong> Answer: Lord Brahma (The Creator), Lord Vishnu (The Preserver), Lord Shiva (The Dissolver/Transformer).</p>
            <p><strong>23. Differentiate between Shruti and Smriti scriptures with examples.</strong> Answer: Shruti means "that which is heard" × direct divine revelations heard by Rishis in meditation (e.g., The Four Vedas). Smriti means "that which is remembered" × human compositions explaining Vedic philosophy through stories and epics (e.g., Ramayana, Mahabharata).</p>
            <p><strong>24. Name the four Vedas.</strong> Answer: Rig Veda, Sama Veda, Yajur Veda, Atharva Veda.</p>
            <p><strong>25. Three moral lessons from the Ramayana.</strong> Answer: Obedience (Rama obeyed his father), Loyalty (Lakshmana's brotherly devotion), Selfless Service (Hanuman's devotion to God), Victory of Dharma (good triumphs over evil).</p>
            <p><strong>26. Core message of the Bhagavad Gita regarding work?</strong> Answer: Karma Yoga × do your duty selflessly without worrying about the rewards or results.</p>
            <p><strong>27. List the five Yamas.</strong> Answer: Ahimsa (Non-violence), Satya (Truthfulness), Asteya (Non-stealing), Brahmacharya (Self-restraint/Purity), Aparigraha (Non-possessiveness/Non-greed).</p>
            <p><strong>28. Three ways to perform Seva at school.</strong> Answer: Keeping classrooms clean, planting trees on school grounds, helping classmates who struggle with schoolwork, sharing food with those in need.</p>
            <p><strong>29. How is Diwali traditionally celebrated?</strong> Answer: Cleaning and painting homes, decorating with Rangoli designs, lighting oil Diyas, wearing new clothes, sharing sweets, offering prayers (Puja) to Goddess Lakshmi.</p>
            <p><strong>30. Three forms of the Divine Mother during Navratri.</strong> Answer: Days 1-3: Goddess Durga (destroys bad habits, strength and protection). Days 4-6: Goddess Lakshmi (grants good qualities, wealth and peace). Days 7-9: Goddess Saraswati (bestows wisdom, music, and ultimate knowledge).</p>
            <p><strong>31. Significance of Upanayana Sanskar?</strong> Answer: It marks a child's formal entry into spiritual and academic learning (Brahmacharya Ashrama). The child receives the Yajnopavita (sacred thread) and is initiated into chanting the Gayatri Mantra.</p>
          </div>
        </SubSection>

        <SubSection title="PART III: APPLICATION AND CASE STUDIES (20 MARKS)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>32. Case Study 1 × Resolving Conflict through Dharma:</strong> (a) If Anil punches Rajesh, he directly violates Ahimsa (Non-violence), which means not causing harm through thoughts, words, or actions. (b) Anil can use Dharma and self-control by: taking deep breaths and walking away to cool down; remembering that Rajesh apologized and that accidents happen; speaking calmly about his feelings instead of using physical force.</p>
            <p><strong>33. Case Study 2 × Environmental Stewardship as Seva:</strong> (a) Meera can apply Seva by: organizing a weekly class cleanup roster to pick up litter around the assembly ground; setting up labeled recycling bins for plastic, paper, and food waste; educating fellow students through posters about keeping the environment clean. (b) Keeping the environment clean connects to Ahimsa because plastic litter and pollution can choke, injure, or kill local birds and animals. By removing harmful waste, Meera is practicing non-violence and protecting living beings from suffering.</p>
            <p><strong>34. Case Study 3 × Overcoming Peer Pressure on Social Media:</strong> (a) Ketan should apply the principle of Brahmacharya (self-restraint and purity) by controlling his impulses and refusing to engage with harmful content. He should guard his mind by remembering that violent and inappropriate material damages spiritual growth and inner peace. (b) Positive alternatives: Use educational apps to learn coding, mathematics, or languages; watch spiritual discourses, bhajans, or stories from the Ramayana and Mahabharata; create digital art or presentations about Hindu values to share with classmates.</p>
            <p><strong>35. Case Study 4 × Practicing Aparigraha at School:</strong> (a) Dev's behavior violates Aparigraha (Non-greed/Non-possessiveness). He has accumulated far more items than he needs and refuses to share even a basic item with a classmate in crisis. The moral correction required is to practice generosity (Daana), overcome greed and attachment to material objects, and understand that hoarding while others suffer is against Dharma. (b) Dev should: immediately lend a pencil to his desk mate without hesitation; after the exam, share some of his extra stationery items with classmates who lack basic supplies, keeping only what he truly needs.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="?? DETAILED MARKING SCHEME & COMPREHENSIVE ANSWER KEY">
        <p>The complete answer key and marking scheme is provided inline with each question above. Refer to the answers embedded within each question block for grading.</p>
      </Section>
    </div>
  );
}
// ---------- IRE NOTES ----------
function IRENotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? IRE: Islamic Religious Education</h2>

      <Section title="MODULE 1: QUR'AN (THE HOLY SCRIPTURES & REVELATION)">
        <SubSection title="1.1 Understanding the Qur'an as Divine Revelation">
          <p>The Qur'an is the literal word of Allah (SWT), revealed to Prophet Muhammad (PBUH) over a period of 23 years through the Agency of Angel Jibril (Gabriel). The word "Qur'an" linguistically stems from the Arabic root qa-ra-a, meaning "the recitation" or "that which is read."</p>
          <SubSection title="The Stages of Revelation (Tanzil)">
            <p>The descent of the Qur'an occurred in distinct evolutionary and chronological phases:</p>
            <BulletList items={[
              'From Allah (SWT) to Al-Lawh Al-Mahfuz (The Preserved Tablet): The entire text of the Qur\'an existed eternally as a whole within the heavenly realm, protected from alterations, additions, or structural corruption.',
              'From Al-Lawh Al-Mahfuz to Bayt al-Izzah (The House of Honor): Located in the lowest heaven (Samaa ad-Dunya), the entire Qur\'an was sent down as a single unit on Laylat al-Qadr (The Night of Decree) during the month of Ramadan.',
              'From Bayt al-Izzah to the Heart of Prophet Muhammad (PBUH): Brought down piecemeal (Mufassalan) over 23 years, adapting dynamically to the shifting social, legal, and political realities of the budding Muslim community in Makkah and Madinah.'
            ]} />
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       [ Allah (SWT) ]
              ×
              ?
    [ Al-Lawh Al-Mahfuz ] → (The Preserved Tablet)
              ×
              ?
     [ Bayt al-Izzah ]     (Lowest Heaven - Night of Power)
              ×
              ?
   [ Prophet Muhammad ]    (Revealed over 23 Years via Jibril)`}</pre>
          </SubSection>
          <SubSection title="Contextual Differences: Makkan vs. Madinan Surahs">
            <p>The textual landscape of the Qur'an is systematically split between the chronological periods of the Hijrah (migration).</p>
            <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
              <tbody>
                <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Feature</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Makkan Surahs (Pre-Hijrah)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Madinan Surahs (Post-Hijrah)</th></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Primary Theme</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Establishment of Tawheed (Monotheism), Akhirah (Hereafter), stories of old Prophets.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Shariah (Jurisprudence), social laws, governance, treaties, family framework.</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Length & Rhythm</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Short, punchy verses with powerful rhythms and poetic cadences.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Long, prose-like verses detailing legal conditions and societal contracts.</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Audience Target</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Addressed to humanity generally using "Ya Ayyuha al-Nas" (O Mankind).</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Addressed to believers specifically using "Ya Ayyuha alladhina amanu" (O Believers).</td></tr>
                <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Core Tone</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Emphasizes patience under persecution, confronting idolatry, and moral rectitude.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Directs military defense, economic spending, inheritance distribution, and statecraft.</td></tr>
              </tbody>
            </table>
          </SubSection>
        </SubSection>

        <SubSection title="1.2 Exegetical Analysis of Selected Surahs">
          <SubSection title="Surah Al-Fatiha (The Opening) × Core Theological Pillars">
            <p>Known as Umm al-Kitab (The Mother of the Book), this seven-verse Surah condenses the entire metaphysical philosophy of Islam into a perfect supplicatory framework.</p>
            <BulletList items={[
              'Pillar of Rububiyyah (Lordship): "Al-Hamdu lillahi Rabb il-\'Alamin" firmly establishes Allah as the sole Sustainer, Creator, Provider, and Governor of all cosmic dimensions.',
              'Pillar of Asma was-Sifat (Names & Attributes): "Ar-Rahman ar-Rahim" balances divine majesty with absolute mercy, reminding humanity that God\'s compassion encompasses all creation.',
              'Pillar of Uluhiyyah (Worship & Devotion): "Iyyaka na\'budu wa iyyaka nasta\'in" cuts down all paths of polytheism (Shirk). It establishes that worship and the seeking of ultimate aid belong strictly to Allah alone.',
              'The Supplicatory Roadmap: The petition for "Al-Sirat al-Mustaqim" (The Straight Path) explicitly categorises humanity into three historical streams: those who received grace and acted correctly upon knowledge; those who earned divine anger by choosing to act against true knowledge; those who went astray due to spiritual ignorance.'
            ]} />
          </SubSection>
          <SubSection title="Surah Al-Asr (The Flight of Time) × The Four Criteria of Human Salvation">
            <p>This three-verse chapter sets up a strict mathematical equation for human success, proving that unless four specific conditions are met, human life ends in absolute loss (Khusr).</p>
            <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`[ Human Existence in Time ] --> DEFAULT STATE: Absolute Loss (Khusr)
                                       ×
            +-----------------------------------------------------+
            ? (UNLESS FOUR CONDITIONS ARE MET)                    ?
   1. Iman (True Faith)                                  2. Amalus-Salihat (Righteous Deeds)
   3. Tawasaw bil-Haqq (Mutual Counseling to Truth)       4. Tawasaw bis-Sabr (Mutual Counseling to Patience)`}</pre>
            <BulletList items={[
              'Iman (Faith): Activating internal belief rooted in empirical and spiritual validation of Allah\'s oneness.',
              'Amalus-Salihat (Righteous Deeds): Translating internal faith into observable external actions that benefit society and fulfill ritual demands.',
              'Tawasaw bil-Haqq (Counseling to Truth): Stepping beyond individual righteousness to actively advocate for justice, transparency, and objective truth within the public sphere.',
              'Tawasaw bis-Sabr (Counseling to Patience): Building community resilience by encouraging steadfastness, emotional restraint, and endurance when facing systemic hardships.'
            ]} />
          </SubSection>
          <SubSection title="Surah Al-Ma'un (The Neighborly Needs) × Condemnation of Ritual Hypocrisy">
            <p>This Surah attacks the decoupling of ritual devotion from social morality. It warns those who perform empty ritual prayers (Salah) while systematically oppressing vulnerable populations.</p>
            <BulletList items={[
              'Denial of the Deen: Allah defines the practical denial of faith not merely as theoretical atheism, but as the active mistreatment of orphans (Yatim) and refusing to feed the desperately poor (Miskin).',
              'The Danger of Heedlessness (Sahoon): Woe is pronounced upon those who pray merely to be seen by men (Riyaa). Their prayers are nothing but theatrical performances designed to gain social standing.',
              'Withholding Small Kindnesses (Al-Ma\'un): The ultimate mark of the hypocrite is their refusal to share everyday household items or small acts of charity with neighbors, highlighting that true worship must generate real-world empathy.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.3 Preservation and Compilation of the Qur'an">
          <SubSection title="Phase 1: The Prophetic Era (Oral & Fragmentary Writing)">
            <p>During the lifetime of the Prophet (PBUH), preservation relied primarily on oral memorization (Hifdh). The Prophet's heart was divinely fortified to lock in the verses instantly upon revelation.</p>
            <BulletList items={[
              'Scribes of Revelation (Kuttab al-Wahy): Prominent companions like Zayd ibn Thabit, Ubayy ibn Ka\'b, and Ali ibn Abi Talib were assigned to write down verses immediately upon primitive mediums.',
              'Writing Mediums: Inscriptions were recorded on flat stones (Likhaf), palm stalks (Asb), pieces of leather (Ruga\'ah), and the shoulder blades of large animals (Aktaf).',
              'The Annual Review: Every year during Ramadan, Angel Jibril would orally audit the entire revealed corpus with the Prophet (PBUH). In the final year of his life, this cross-examination was conducted twice (Al-Ardah al-Akhiroh), locking down the ultimate canonical order of the chapters.'
            ]} />
          </SubSection>
          <SubSection title="Phase 2: The Abu Bakr Era (The First Official Compilation)">
            <p>Following the Battle of Yamamah (12 AH), where over seventy elite Quranic memorizers (Huffadh) were killed, Umar ibn al-Khattab realized the risk of losing the text. He persuaded Khalifah Abu Bakr As-Siddiq to commission a unified written volume.</p>
            <BulletList items={[
              'The Standard of Zayd ibn Thabit: Zayd was appointed to head the collection project due to his youth, integrity, and position as a primary scribe.',
              'Strict Verification Method: Zayd refused to accept any written verse unless it met two independent criteria: it must be written down in the direct presence of the Prophet (PBUH); it must be verified by two reliable eyewitnesses who heard the Prophet recite it.',
              'The Suhoof: The resulting master compilation, written on uniform parchment, was deposited with Abu Bakr, transferred to Umar upon his death, and subsequently kept safe by Hafsah bint Umar, the Prophet\'s widow.'
            ]} />
          </SubSection>
          <SubSection title="Phase 3: The Uthman Era (The Canonical Standardization)">
            <p>As the Islamic empire expanded into Persia, Syria, and North Africa, non-Arab converts began mispronouncing the text due to regional dialectical differences (Ahruf). This threatened to splinter the Muslim community over the core scripture.</p>
            <BulletList items={[
              'The Commission of Four: Khalifah Uthman ibn Affan retrieved the Suhoof from Hafsah and ordered Zayd ibn Thabit, Abdullah ibn al-Zubayr, Sa\'id ibn al-Aas, and Abdur-Rahman ibn al-Harith to standardize the text into a single master dialect.',
              'The Quraishi Dialect: The commission was ordered to write exclusively in the linguistic style of the Quraish dialect if any textual variations appeared, as the Qur\'an was originally revealed through its vocal patterns.',
              'The Mus-haf Al-Uthmani: Multiple identical copies were produced and dispatched to key administrative hubs (Makkah, Kufah, Basrah, Damascus, and Al-Madinah), paired with an elite reciter to teach the standardized pronunciation. Uthman ordered all other personal, non-standardized notebooks to be burned to prevent sectarian division.'
            ]} />
          </SubSection>
        </SubSection>

        <SubSection title="1.4 Comprehensive Module 1 Assessment">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. Zayd ibn Thabit required two independent eyewitnesses for any written verse. What was the primary legal purpose?</strong> A × To ensure the verse was written down in the presence of the Prophet (PBUH) at the time of revelation.</p>
            <p><strong>2. "Woe to those who pray, who are heedless of their prayer." This warning targets:</strong> B × Hypocrites who use ritual worship as an ostentatious display for social standing while ignoring social welfare.</p>
            <p><strong>3. Analyze the socio-political factors that forced Khalifah Uthman to standardize the Qur'an.</strong> Answer: As Islam expanded into non-Arab regions, dialectical variations threatened to create sectarian divisions. Uthman's standardization preserved the text in the original Quraishi dialect, preventing the textual drift seen in other ancient scriptures, and dispatched identical copies with trained reciters to major cities.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="MODULE 2: HADITH & SUNNAH (PROPHETIC TRADITIONS)">
        <SubSection title="2.1 Epistemological Framework of Hadith Studies">
          <p>Hadith refers to the recorded sayings, actions, approvals, and physical descriptions of Prophet Muhammad (PBUH). While the Qur'an provides the foundational principles of Islam, Hadith serves as the dynamic practical template that explains these laws.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       [ HADITH REPORT ]
               ×
       +---------------+
       ?               ?
   [ ISNAD ]       [ MATN ]
 (Chain of       (Actual Text/
 Narrators)      Message)`}</pre>
          <BulletList items={[
            'Isnad (The Chain of Transmission): The chronological sequence of historical narrators who passed the report down from one to another until it reached the final collector. Example: Imam Al-Bukhari heard from Abdullah ibn Yusuf, who heard from Malik ibn Anas, who heard from Nafi, who heard from Abdullah ibn Umar, who heard from the Prophet.',
            'Matn (The Core Text): The actual spoken words, described action, or silent approval of the Prophet (PBUH) located at the terminus of the Isnad.',
            'Hadith Qawli (Verbal Sayings): Direct statements issued by the Prophet. Example: "Actions are judged by intentions."',
            'Hadith Fi\'li (Actions): Practical demonstrations recorded by the companions. Example: The step-by-step physical performance of the Hajj pilgrimage or the units of Salah.',
            'Hadith Taqriri (Silent Approvals): Situations where companions performed an action in the presence of the Prophet, and he remained silent or smiled without issuing a prohibition. This silence legally denotes permissibility.'
          ]} />
        </SubSection>

        <SubSection title="2.2 The Science of Hadith Verification (Mustalah al-Hadith)">
          <p>To eliminate fabrications (Mawdoo), scholars developed a system of historical criticism to evaluate Hadith based on the reliability of their transmission chains.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                       [ HADITH AUTHENTICITY LEVELS ]
                                      ×
         +----------------------------+----------------------------+
         ?                            ?                            ?
   [ SAHIH ]                      [ HASAN ]                    [ DA'IF ]
 (Rigorously Authentic)       (Good/Acceptable)             (Weak/Deficient)`}</pre>
          <BulletList items={[
            'Ittisal al-Isnad (Unbroken Chain): Every narrator in the chain must have directly met and heard the tradition from the immediate narrator before them.',
            'Adalah (Moral Integrity of Narrators): Every person in the chain must be a practicing Muslim who avoids major sins, stays away from public misconduct, and possesses a clean reputation for honesty.',
            'Dabt (Intellectual & Retentive Capacity): Each narrator must possess a tested memory, capable of accurately preserving and recalling the transmission without mixing up names or phrasing.',
            'Shudhudh (Absence of Eccentricity): The text or chain must not contradict another report transmitted by a narrator who is historically proven to be more reliable.',
            'Illah (Absence of Hidden Defects): The Hadith must be free from subtle, hidden logical or chronological flaws that could undermine its authenticity.'
          ]} />
        </SubSection>

        <SubSection title="2.3 Hadith Textual Analysis">
          <BulletList items={[
            'Hadith on Intention (Niyyah): "Actions are but by intentions, and every man shall have only that which he intended..." (Al-Bukhari & Muslim). Legal Implications: This Hadith serves as the foundational pillar of Islamic Jurisprudence (Fiqh), establishing that ritual acts like Salah, Siyam, and Zakat are structurally void unless preceded by an internal choice of intent directed solely toward Allah. Moral Implications: It warns against the spiritual corruption of Riyaa (showing off), where actions that look good on the outside lose their spiritual reward because they were driven by a desire for social status or fame.',
            'Hadith on Social Responsibility & Environmental Care: "Whosoever removes a harmful thing from the path of Muslims, Allah writes for him a good deed..." (Al-Tirmidhi). Civic Duty: This text broadens the definition of worship (Ibadah) far beyond ritual prayers, framing community service, infrastructure maintenance, and keeping public spaces clean as spiritual duties. Environmental Responsibility: It implicitly forbids littering, polluting water sources, and damaging public roads, making environmental stewardship a direct expression of individual Iman (faith).'
          ]} />
        </SubSection>

        <SubSection title="2.4 Comprehensive Module 2 Assessment">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. A narrator suffered from progressive memory loss in later years. Which criteria is compromised?</strong> C × Dabt (Retentive Capacity).</p>
            <p><strong>2. The Prophet watched Khalid consume lizard meat without forbidding it. This tradition is classified as:</strong> C × Hadith Taqriri (Silent Approval).</p>
            <p><strong>3. Distinguish between Hadith Nabawi and Hadith Qudsi.</strong> Answer: Hadith Nabawi are the words, actions, and approvals of the Prophet (PBUH), with wording composed by the Prophet himself. Hadith Qudsi are sacred narrations where the meaning is from Allah but the wording is from the Prophet (PBUH), often beginning with "Allah says..." Both carry legislative authority and guide the daily performance of ritual worship.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="MODULE 3: TAWHEED & AKIDAH (ISLAMIC MONOTHEISM & CREED)">
        <SubSection title="3.1 The Dimensions of Tawheed">
          <p>Tawheed is the absolute foundational core of Islamic belief, defining God as an absolute, uncompromising unity. Islamic theologians systematically organize Tawheed into three distinct operational dimensions, all of which must be embraced simultaneously.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`                            [ ARKAN AL-TAWHEED ]
                                     ×
         +---------------------------+---------------------------+
         ?                           ?                           ?
 [ TAWHEED AL-RUBUBIYYAH ]   [ TAWHEED AL-ULUHIYYAH ]    [ TAWHEED AS-ASMA WAS-SIFAT ]
(Lordship & Dominion)       (Exclusive Devotion)        (Divine Names & Attributes)`}</pre>
          <BulletList items={[
            'Tawheed al-Rububiyyah (Unity of Lordship): Asserting that Allah is the sole Creator, King, Sustainer, and Controller of the universe. The Qur\'an notes that even pre-Islamic pagan Arabs accepted this dimension: "If you ask them, \'Who created the heavens and the earth?\' They will surely say, \'Allah.\'" (Surah Luqman: 25). However, they remained polytheists because they failed to uphold the second dimension.',
            'Tawheed al-Uluhiyyah (Unity of Worship): Directing all acts of worship, both internal and external, exclusively to Allah. It forbids making supplications (Dua), offering sacrifices (Dhabh), swearing vows, or seeking ultimate spiritual rescue (Istighatha) from any created being, whether an idol, an angel, or a Prophet. This was the primary battleground between all Prophets and their societies.',
            'Tawheed al-Asma was-Sifat (Unity of Names and Attributes): Affirming all the names and attributes that Allah used to describe Himself in the Qur\'an or that were taught by the Prophet (PBUH), exactly as stated, without twisting their meanings or drawing comparisons to creation. The foundational rule is established in Surah Al-Shura: 11: "There is nothing like unto Him, and He is the All-Hearing, the All-Seeing."'
          ]} />
        </SubSection>

        <SubSection title="3.2 Systemic Violations of Tawheed (Shirk)">
          <p>Shirk is the practice of associating partners with Allah, representing the ultimate sin in Islamic theology because it directly undermines the purpose of creation.</p>
          <BulletList items={[
            'Shirk al-Akbar (Major Shirk): Completely removes a person from Islam, destroys all their spiritual deeds, and if they die without repenting, leads to eternal punishment. Includes Shirk ad-Dua (directing prayers to deceased saints or idols), and Shirk al-Hakimiyah (attributing ultimate legislative right to entities other than Allah\'s divine law).',
            'Shirk al-Asghar (Minor Shirk): Does not immediately remove a person from Islam but constitutes a massive sin that tarnishes Tawheed. Includes Al-Riyaa (performing worship to gain praise or status from people × the Prophet described it as more hidden than a black ant crawling on a black stone in the dark of night), and Superstitious Charms/Timaam (hanging amulets or threads believing the object itself possesses power to ward off harm).'
          ]} />
        </SubSection>

        <SubSection title="3.3 Eschatology and the Six Pillars of Iman">
          <p>True faith requires absolute submission to the six pillars established in the famous Hadith of Jibril.</p>
          <BulletList items={[
            'Belief in Allah: Embracing His oneness across all three dimensions of Tawheed.',
            'Belief in His Angels: Recognizing them as beings created from light who possess no free will and execute divine commands flawlessly (e.g., Jibril for revelation, Israfil for blowing the trumpet, Malakul-Maut for taking souls).',
            'Belief in His Books: Confirming that Allah sent down scriptures including the Torah to Musa, the Psalms to Dawud, the Gospel to Isa, and the final Qur\'an to Muhammad (PBUH).',
            'Belief in His Prophets: Recognizing a single chain of guidance starting with Adam and running through Nuh, Ibrahim, Musa, and Isa, concluding with Muhammad (PBUH) as the final seal.',
            'Belief in Al-Qadr (Divine Decree): Believing that Allah knows everything before it happens, has recorded all events in Al-Lawh Al-Mahfuz, wills everything that exists, and creates all actions, while still granting humans moral free will and accountability.',
            'Belief in Al-Akhirah (The Hereafter): Recognizing that physical life is temporary and leads toward an absolute day of judgment, characterized by distinct metaphysical realities: Barzakh (Realm of the Grave) ? Resurrection (Ba\'th) ? The Assembly (Hashr) ? The Scales (Mizan) ? The Bridge (Sirat) ? Final Destination: Jannah or Jahannam.'
          ]} />
        </SubSection>

        <SubSection title="3.4 Comprehensive Module 3 Assessment">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. A person believes Allah is the Creator but visits graves to sacrifice animals to saints for healing. Which dimension is violated?</strong> B × Tawheed al-Uluhiyyah.</p>
            <p><strong>2. Prolonging a voluntary prayer because an employer walked into the room is classified as:</strong> C × Shirk al-Asghar (Riyaa / Showing Off).</p>
            <p><strong>3. How does Islam balance God's absolute foreknowledge with individual human moral accountability?</strong> Answer: Islam teaches that Allah's foreknowledge (Al-Qadr) does not negate human free will. Allah knows what choices each person will make, but He does not force them. Humans are given genuine moral agency, and their accountability on the Day of Judgment is based on their actual choices and actions, not on Allah's prior knowledge of those choices.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="MODULE 4: FIQH & IBADAH (JURISPRUDENCE & RITUALS)">
        <SubSection title="4.1 Foundations of Shariah Regulation">
          <p>Islamic Jurisprudence (Fiqh) is the systematic human understanding of Shariah (Divine Law), extracted from textual sources. Every human action is organized into a clear five-tiered legal framework known as Al-Ahkam Al-Khamsa.</p>
          <BulletList items={[
            'Fard / Wajib (Compulsory): Actions that must be performed. Doing them brings spiritual reward, while intentionally skipping them results in legal or divine punishment (e.g., Five daily prayers, fasting during Ramadan).',
            'Mustahabb / Sunnah (Recommended): Actions that are encouraged. Doing them brings spiritual reward, but skipping them carries no punishment (e.g., Using the siwak before prayer, performing voluntary night prayers).',
            'Mubah (Permissible/Neutral): Everyday actions that carry no automatic reward or punishment in themselves (e.g., Choosing to eat rice instead of bread). However, these can turn into rewarding actions if done with a good intention, like eating to gain physical strength for worship.',
            'Makruh (Disliked): Actions that should be avoided. Refraining from them brings spiritual reward, but doing them does not bring punishment (e.g., Consuming raw onions immediately before going to the mosque for congregational prayer).',
            'Haram (Forbidden): Actions that are strictly prohibited. Avoiding them brings reward, while committing them brings punishment and legal accountability (e.g., Consuming alcohol, engaging in usury/Riba, stealing).'
          ]} />
        </SubSection>

        <SubSection title="4.2 Taharah (Ritual Purification) × Foundations of Devotion">
          <p>Ritual prayer (Salah) is completely invalid without first establishing Taharah (Purification) from both visible physical filth (Najasah) and ritual states of impurity (Hadath).</p>
          <BulletList items={[
            'Najasah Mukhaffafah (Light Impurity): The urine of a nursing male infant who has consumed nothing but breast milk. It is purified simply by sprinkling water over the affected area until it is covered.',
            'Najasah Mutawassitah (Medium Impurity): Standard impurities like human urine, feces, blood, and vomit. It requires thorough washing with water until the physical substance, color, and odor are entirely removed.',
            'Najasah Mughalladhah (Heavy Impurity): Filth originating from dogs or swine. Purifying an item contaminated by a dog\'s saliva requires washing it seven times with water, and the very first wash must be mixed with clean soil.',
            'Hadath al-Asghar (Minor Impurity): Triggered by normal bodily functions like passing gas, urination, or deep sleep. It is resolved exclusively by performing Wudu (Ritual Ablution).',
            'Hadath al-Akbar (Major Impurity): Triggered by marital intimacy, nocturnal emissions, menstruation (Hayd), or post-natal bleeding (Nifas). It requires a complete ritual bath known as Ghusl, ensuring that clean water reaches every single part of the body and scalp.',
            'Tayammum (Dry Ablution): A conditional alternative used when water is completely unavailable, dangerous to health due to medical issues, or when temperatures are low enough to threaten life. It involves clean earth or sand wiped over the face and hands to temporarily replace Wudu or Ghusl.'
          ]} />
        </SubSection>

        <SubSection title="4.3 Advanced Jurisprudence of Salah (Prayer)">
          <p>Salah serves as the primary practical pillar of daily life. It features strict internal requirements (Arkan) and external prerequisites (Shuroot) that must be met to ensure validity.</p>
          <BulletList items={[
            'Shuroot al-Salah (Prerequisites Before Prayer): Certainty of entry of time, full purification from filth, facing the Qiblah direction, covering the Awrah properly.',
            'Arkan al-Salah (Internal Core Pillars): Takbirat al-Ihram, recitation of Al-Fatiha, Ruku (bowing) and Sujud (prostrating), the final Taslim closure.',
            'The Invalidation Matrix (Mubtilat): A prayer is instantly broken by intentionally eating or drinking during the recitation, speaking articulate words that do not belong to the remembrance of Allah, experiencing a break in ritual purity (e.g., breaking Wudu), uncovering the mandatory Awrah and failing to fix it instantly, or making major continuous movements outside the actions of prayer (such as taking three consecutive steps without a pressing safety reason).'
          ]} />
        </SubSection>

        <SubSection title="4.4 Comprehensive Module 4 Assessment">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>1. A traveler cannot find water and Asr prayer time is ending. What is the correct course?</strong> B × Perform Tayammum using clean topsoil and pray immediately before the time runs out.</p>
            <p><strong>2. Blood flowing from a cut finger staining clothing falls under:</strong> B × Najasah Mutawassitah, requiring thorough washing until color and odor are removed.</p>
            <p><strong>3. Status of a prayer where a pillar was left out due to forgetfulness vs. a condition left out due to lack of options.</strong> Answer: If a pillar (Rukn) is left out due to forgetfulness, the prayer may be remedied by performing Sujud as-Sahw (prostration of forgetfulness) at the end. If a condition (Shart) cannot be met due to genuine lack of options (e.g., no water), Shariah provides concessions like Tayammum, and the prayer remains valid. A condition deliberately abandoned without valid excuse invalidates the prayer entirely.</p>
          </div>
        </SubSection>
      </Section>

      <Section title="MODULE 5: SEERAH & HISTORICAL CRITICISM (PROPHETIC BIOGRAPHY)">
        <SubSection title="5.1 The Pre-Islamic Social Fabric (Jahiliyyah)">
          <p>The period before the Prophetic mission is historically classified as Jahiliyyah (The Age of Ignorance). This was not a lack of literacy, but rather a state of moral, social, and spiritual chaos.</p>
          <BulletList items={[
            'Spiritual Landscape: The Arabian Peninsula was dominated by polytheism centered around the Ka\'bah, which housed 360 distinct tribal idols (such as Hubal, Lat, Uzza, and Manat). Monotheism was kept alive only by a rare minority known as the Hunafa, who followed the original faith of Prophet Ibrahim.',
            'Social & Gender Crises: Tribalism served as the supreme political law, leading to blood feuds that lasted for generations over minor insults. Women were treated as property with no inheritance rights, and the practice of female infanticide (Wa\'d al-Banat) was widespread due to a fear of economic burden and social disgrace.',
            'Economic Inequality: The economy relied heavily on Riba (usury/high-interest loans) and exploitative trade monopolies run by the Quraish tribe, which trapped the poor, orphans, and slaves in cycles of poverty.'
          ]} />
        </SubSection>

        <SubSection title="5.2 Chronological Milestones of the Makkan Period">
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`[ Year 1: First Revelation ] --> [ Year 3: Public Da'wah Shift ] --> [ Year 5: Abyssinian Hijrah ]
                                                                             ×
         +-------------------------------------------------------------------+
         ?
[ Year 7: Total Economic Boycott ] --> [ Year 10: Year of Sorrow ] --> [ Year 13: The Great Hijrah ]`}</pre>
          <BulletList items={[
            'The First Revelation (610 CE): At age forty, while meditating inside the Cave of Hira on Mount Nur, Prophet Muhammad (PBUH) was visited by Angel Jibril, who commanded him: "Iqra!" (Read!). This event marked the beginning of his role as a prophet, bringing the first five verses of Surah Al-Alaq.',
            'The Shift to Public Preaching: For three years, the mission remained secret, focusing on building a core group of believers (including Khadijah, Abu Bakr, Ali, and Zayd). Allah then commanded: "Expound openly what you are commanded..." (Surah Al-Hijr: 94). The Prophet ascended Mount Safa, gathered the Quraish clans, and warned them of a severe punishment if they did not leave idolatry.',
            'Institutional Persecution & Strategy: The Quraish responded with physical torture against vulnerable converts like Bilal ibn Rabah and Sumayyah (the first martyr of Islam), alongside smear campaigns labeling the Prophet a magician or a madman.',
            'The Abyssinian Migration (615 CE): The Prophet directed a group of companions to seek political asylum under the Christian King Negus (Najashi) of Abyssinia, who was known for his absolute justice. This move protected the believers and built their very first international diplomatic connection.',
            'The Year of Sorrow (619 CE): The Prophet faced deep personal losses with the successive deaths of his wife Khadijah, his emotional anchor, and his uncle Abu Talib, who provided vital tribal protection. This left him vulnerable to assassination plots by the Quraish leadership.'
          ]} />
        </SubSection>
      </Section>

      <Section title="COMPREHENSIVE ASSESSMENT QUESTION BANK (QUESTIONS & ANSWERS)">
        <SubSection title="SECTION 1: SURAH AL-ADIYAT (THE COURSERS)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q1: Why does Allah use the image of panting warhorses in Surah Al-Adiyat?</strong> Answer: The warhorse is completely loyal and obedient to its human master, risking its life simply because the master feeds it. In contrast, human beings receive endless blessings from Allah yet frequently show ungratefulness (Kanood). The spiritual message is that humans should be far more loyal and grateful to Allah than a trained horse is to its rider.</p>
            <p><strong>Q2: Translate and explain "Al-Adiyat", "Kanood", and "Al-Kuboor".</strong> Answer: Al-Adiyat × charging warhorses that pant heavily, representing intense devotion to a mission. Kanood × someone ungrateful and unfaithful who counts their problems while ignoring countless blessings. Al-Kuboor × the graves, pointing to the Day of Judgement when all secrets and buried bodies will be raised for accountability.</p>
            <p><strong>Q3: Complete English translation of Surah Al-Adiyat (verses 1-11).</strong> Answer: By the regular warhorses that run panting heavily / And those that strike sparks of fire with their hooves / And those that push forward home raids at dawn / And stir up clouds of dust collectively / And penetrate right into the center of the enemy lines together / Verily, mankind is ungrateful to his Lord / And hidden within himself, he is a witness to that fact / And violent is he in his passionate love for material wealth / Does he not know that when the contents of the graves are poured out / And all secret human thoughts are brought to light / Verily, their Lord will be fully aware of them on that Day?</p>
            <p><strong>Q4: Connect Surah Al-Adiyat's warnings about wealth with Surah At-Takathur.</strong> Answer: Both Surahs target human obsession with material wealth. Surah Al-Adiyat states man is "violent in his love of wealth," showing greed clouds moral judgment. Surah At-Takathur warns that "Competition in worldly gains distracts you until you visit the graves." Together, they warn that ignoring the afterlife to hoard property is a dangerous trap; true wealth in Islam is content hearts and good deeds.</p>
            <p><strong>Q5: Apply Surah Al-Adiyat to correct a businessman who drops prayers to accumulate wealth.</strong> Answer: Verse 8 targets the passionate obsession with wealth. Gathering money while dropping obligatory prayers and ignoring orphans is ungratefulness (Kanood) to Allah. Verses 9-10 warn that graves will be overturned and hidden intentions made public. Wealth will not save anyone in the grave. The correct approach is to balance clean business with primary duties to Allah and the community.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 2: SURAH AL-ASR (THE TIME)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q6: Why did Imam Ash-Shafi'i say Surah Al-Asr alone would be enough for humanity?</strong> Answer: Because Surah Al-Asr contains a complete guide for human salvation in three short verses, listing four conditions that save a person from permanent loss (Khusr): Iman (Faith), Amal As-Salihat (Righteous Deeds), Tawasaw Bil-Haqq (Exhorting to Truth), and Tawasaw Bis-Sabr (Exhorting to Patience).</p>
            <p><strong>Q7: What is the definition of "Al-Asr" and why did Allah swear by it?</strong> Answer: Al-Asr means time that is running out, specifically the afternoon hours when the day draws to a close. Allah swears by Al-Asr because time is the most valuable asset a human being owns. Every passing second brings us closer to death. The oath emphasizes that humans lose their capital every day unless they spend their hours doing good deeds and preparing for the eternal afterlife.</p>
            <p><strong>Q8: Create a practical life plan based on Surah Al-Asr.</strong> Answer: Internal Values × Iman: Start day with Fajr prayer. Amal: Complete homework honestly, respect parents and teachers. Social Values × Haqq: Form clean study groups, stop cheating and lying. Sabr: Stay calm under exam stress, help classmates patiently.</p>
            <p><strong>Q9: How does "Khusr" (Loss) in Surah Al-Asr differ from secular financial loss?</strong> Answer: Secular financial loss means losing material property or money, which can often be recovered. In Surah Al-Asr, Khusr refers to spiritual bankruptcy. If a person finishes their life with lots of money but has no faith and no good deeds, they have lost their eternal afterlife. This loss is irreversible once death arrives. True profit is saving one's soul from the fire of Jahannam.</p>
            <p><strong>Q10: How does Surah Al-Asr prove a brilliant but bullying student is in a state of loss?</strong> Answer: Surah Al-Asr states that all humans are in a state of loss except those who combine faith with righteous actions and exhorting the truth. Even though the classmate is brilliant academically, bullying violates righteous actions, and lying violates the truth (Haqq). Intellectual success without moral behavior is a spiritual loss. The student is wasting their time accumulating worldly praises while building up sins for the afterlife.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 3: SURAH AL-HUMAZAH (THE SCORNER)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q11: Define Humazah and Lumazah and their destructive impact.</strong> Answer: Humazah × slandering and mocking people openly through physical gestures, facial expressions, or winking eyes behind their backs. Lumazah × defaming and criticizing people verbally, spreading rumors, and attacking their reputation through words. These sins destroy communities by breaking trust, causing hatred, ruining reputations, and turning friends into bitter enemies.</p>
            <p><strong>Q12: Describe Al-Hutamah and how it interacts with the human heart.</strong> Answer: Al-Hutamah is The Crushing Fire, a unique fire fueled directly by Allah (Narullahil Mooqadah). Unlike regular fire, it leaps up and penetrates right into the human chest to reach the hearts (Allati tattali'u 'alal af'idah). Because the slanderer used their heart to plot malice and arrogance, the fire targets their physical and spiritual heart directly. The fire is also locked over them in towering columns (Fee 'amadim mumaddadah), preventing any escape.</p>
            <p><strong>Q13: Which Quraish leaders triggered Surah Al-Humazah, and how does this relate to modern cyberbullying?</strong> Answer: Leaders like Al-Walid bin al-Mughirah, Umayyah bin Khalaf, and Al-Aas bin Wa'il regularly mocked the Prophet (PBUH). This relates directly to modern cyberbullying × today people use social media to mock, post memes, spread lies, and attack others behind screens. Surah Al-Humazah warns modern internet users that typing insults and sharing humiliating content carries the exact same punishment as the historical slanderers of Quraish.</p>
            <p><strong>Q14: Why does hoarding wealth give a human a false sense of security?</strong> Answer: When a person accumulates immense wealth, they begin to feel self-sufficient (Istighna). They believe their money can buy health, protection, status, and escape from any earthly problem. This breeds an illusion of immortality × they live as if they will never die, stand trial, or turn to dust. The Surah breaks this illusion by showing that wealth cannot stop death or shield an arrogant soul from Al-Hutamah.</p>
            <p><strong>Q15: A student discovers classmates mocking their teacher online. What is their Islamic responsibility?</strong> Answer: The student must: (1) Refuse to join, like, or comment on any mocking posts, as participating makes them a Humazah. (2) Speak out within the group chat, reminding classmates that mocking authority figures is a grave sin that leads to Al-Hutamah. (3) Exit the group to protect themselves from bad company. (4) Report the cyberbullying to school heads or parents if the behavior continues, protecting the teacher's dignity.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 4: HADITH STUDIES (SAYINGS OF THE PROPHET ?)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q16: Analyze the Hadith prohibiting pollution of water sources and shade trees.</strong> Answer: The Prophet → said: "Fear the three things that bring curses: defecating in water sources, on pathways, and in the shade where people rest." (Abu Dawud). This Hadith shows that environmental care is an essential part of faith. Clean water prevents deadly diseases, clear pathways allow safe travel, and shade trees protect travelers from harsh heat. Modern environmental sustainability matches these teachings perfectly.</p>
            <p><strong>Q17: Define Gheebah (backbiting) and distinguish it from Buhtan (slander).</strong> Answer: The Prophet → defined backbiting by saying: "It is to speak about your Muslim brother in a manner he dislikes." The Sahabah asked: "What if my brother actually has that fault?" The Prophet replied: "If he has that fault, you have backbited against him (Gheebah); and if he does not have it, you have falsely slandered him (Buhtan)." (Muslim). Gheebah means speaking the truth about someone's real flaws behind their back. Buhtan means inventing a complete lie to damage someone's reputation.</p>
            <p><strong>Q18: Quote the Hadith on neighborly rights and outline three practical rights of a neighbor.</strong> Answer: The Prophet → stated: "Whoever believes in Allah and the Last Day, let him be hospitable and good to his neighbor." (Al-Bukhari). Three practical rights: (1) Sharing food and meals, especially when you know they are struggling financially. (2) Keeping your living space clean and making sure your trash, loud noise, or parked cars do not block or disturb them. (3) Visiting them when they fall sick, offering comfort during hardships, and congratulating them on happy occasions.</p>
            <p><strong>Q19: What constitutes good character (Husn al-Khuluq) based on prophetic guidance?</strong> Answer: Good character means keeping a smiling face, speaking softly and truthfully, controlling anger when provoked, forgiving those who hurt you, and keeping your hands from harming people or animals. It means matching internal faith with external manners. This outweighs extra voluntary prayers and fasts on the Day of Judgement.</p>
            <p><strong>Q20: Amina finds a wallet in a mosque and keeps it. Correct her understanding using Hadith.</strong> Answer: Amina's reasoning is wrong. The Prophet → said: "A Muslim's property is illegal for another to take unless they give it willingly." Finding something in a mosque does not make it a free gift. Mosque items must be handed over to the management to locate the true owner. Keeping lost items without making a public announcement is theft. Honest earnings must be completely clean; you cannot use stolen or misplaced money to fund your life or education.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 5: PILLARS OF IMAN (ARTICLES OF FAITH)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q21: Name four major angels and their specific cosmic duties.</strong> Answer: Jibril (Gabriel) × carries Allah's revelations (Wahi) down to the Prophets. Mikail (Michael) × in charge of rain, weather patterns, plants, and managing earthly provisions (Rizq). Israfil × tasked with blowing the Trumpet twice to signal the end of the world and the start of Resurrection Day. Malik × guardian angel who oversees the gates of Hellfire (Jahannam).</p>
            <p><strong>Q22: Who are the Kiraman Katibin and how should belief in them change a Muslim's lifestyle?</strong> Answer: The Kiraman Katibin are the Noble Recorders × two angels assigned to every human being; one sits on the right shoulder to record good deeds, and the other on the left shoulder to record sins. Believing in them creates continuous self-awareness (Muraqabah). A Muslim will hesitate to cheat, lie, look at bad things, or commit sins, knowing that every single action is being permanently written down in an individual record book.</p>
            <p><strong>Q23: Correct the common misconception about the Angel of Death's name.</strong> Answer: The common cultural misconception is naming the Angel of Death "Azrael," a name that does not appear in the authentic Quran or Sahih Hadith. The Quran refers to him strictly as Malak al-Mawt (The Angel of Death). His scriptural duty is to extract the souls of living creatures at the exact second their earthly life span finishes, as decreed by Allah, without delaying or advancing them by a single moment.</p>
            <p><strong>Q24: Name the four major Divine Books and match each to its Prophet.</strong> Answer: Tawrat (Torah) × revealed to Prophet Musa (Moses). Zabur (Psalms) × revealed to Prophet Dawud (David). Injeel (Gospel) × revealed to Prophet Isa (Jesus). Quran × revealed to Prophet Muhammad ?. Unique Status: While earlier books were altered or lost over time, the Quran remains unchanged because Allah promised to protect it until the end of time. It cancels and updates all previous scriptures, serving as the final guide for all mankind.</p>
            <p><strong>Q25: How does divine revelation (Wahi) distinguish the Quran from regular human textbooks?</strong> Answer: Human textbooks and biographies are written by human authors. They contain personal opinions, cultural biases, and mistakes that require regular updates and corrections. The Quran is the literal Speech of Allah (Kalamullah), sent down via Angel Jibril to the Prophet ?. It contains zero errors, zero contradictions, and absolute truth that remains perfect across all centuries and locations.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 6: AKHLAQ (ISLAMIC MORALS AND MANNERS)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q26: Systematize how a Muslim maintains physical, environmental, and spiritual purity.</strong> Answer: Physical Purity × Perform Wudu/Ghusl, brush teeth with miswak regularly, wash clothes from fecal impurities. Environmental Purity × Keep bedrooms clean, clear public pathways of trash and blockages, maintain clean school and mosque spaces. Spiritual Purity × Cleanse heart of envy, avoid showing off (Riyaa) and arrogance, seek forgiveness through Istighfar.</p>
            <p><strong>Q27: How can small lies ruin a student's character according to Hadith?</strong> Answer: The Prophet → said that a person keeps lying until they are recorded with Allah as a professional liar (Kadhhab). When a student tells small lies (like lying about missing homework or blaming a classmate for a mistake), it hardens their heart. One lie requires five more lies to hide it. This habit destroys trust with parents and teachers, eventually leading to bigger sins like cheating in national exams, theft, and forgery.</p>
            <p><strong>Q28: What three step-by-step actions should a student take to control anger?</strong> Answer: (1) Say the Isti'adhah: Immediately say "A'oodhu billahi minash-shaitanir-rajeem" (I seek refuge in Allah from the accursed Satan) to break the whisper of anger. (2) Change Physical Posture: If standing, sit down; if sitting, lie down. This grounds the body and lowers blood pressure. (3) Perform Wudu: Go wash with cold water. The Prophet → explained that anger comes from fire, and water extinguishes fire.</p>
            <p><strong>Q29: Define the boundary lines of obedience to parents in Islam.</strong> Answer: Islam places obedience to parents right next to worshipping Allah. A child must never talk back, roll their eyes, or say "Uff" to their parents. They must serve them in old age with humility. The only exception is if parents command the child to commit Shirk (associate partners with Allah) or break a clear Islamic law (like stealing or dropping prayers). Even then, the child must refuse the sinful command kindly while continuing to care for them with respect.</p>
            <p><strong>Q30: What are the spiritual rules for hosting guests and how long is the obligatory period?</strong> Answer: Hosting a guest is an obligatory sign of true Iman. A Muslim should welcome guests warmly, offer them the best food available, and ensure a comfortable place to rest. The Prophet → stated that the obligatory period of high-quality hospitality is three days. Beyond three days, whatever the host provides becomes an act of voluntary charity (Sadaqah). The guest should also be mindful not to overstay and burden the host family.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 7: SEERAH (LIFE OF THE PROPHET MUHAMMAD ?)">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q31: Describe the conditions of the boycott against Banu Hashim and how it ended.</strong> Answer: Conditions × The Quraish prohibited anyone from buying from, selling to, marrying, or speaking with the Banu Hashim. No food or provisions were allowed into the valley. Hardships × The Muslims were forced to eat wild tree leaves and leather pieces to survive. Cries of starving babies could be heard across Makkah. The End × After three years, a group of fair-minded Makkan leaders challenged the unjust treaty. When they went to tear down the scroll hung inside the Ka'bah, they discovered that termites had eaten the entire document except for the words: "Bismika Allahumma" (In Your Name, O Allah), just as the Prophet → had prophesied.</p>
            <p><strong>Q32: Differentiate between the First and Second Pledge of Aqabah.</strong> Answer: First Pledge of Aqabah (12 Men) × Known as the "Pledge of Women" because it did not involve fighting. The citizens of Yathrib promised to worship Allah alone, avoid theft, avoid adultery, avoid killing their children, avoid slandering, and obey the Prophet → in all good things. Second Pledge of Aqabah (73 Men and 2 Women) × This was a strategic military and defensive pact. The leaders of Yathrib invited the Prophet → to migrate to their city and swore an oath to protect him and the Makkan Muslims with their lives and property, just as they protected their own families.</p>
            <p><strong>Q33: Detail the roles played by Abu Bakr, Ali, and Asma during the Hijrah.</strong> Answer: Abu Bakr Al-Siddiq (RA) × The chosen traveling companion who prepared the riding camels, provided financial support, and protected the Prophet → inside the Cave of Thawr. Ali bin Abi Talib (RA) × The brave young man who slept in the Prophet's bed on the night of the assassination plot to trick the Quraish spies, and later returned left-behind items to their non-Muslim owners. Asma bint Abi Bakr (RA) × The courageous daughter of Abu Bakr who secretly carried food up to the Cave of Thawr at night. She famously tore her waistbelt into two strips to tie the food containers, earning the title Dhat al-Nitaqayn (She of the Two Belts).</p>
            <p><strong>Q34: Identify the three foundational pillars established in Madinah immediately after Hijrah.</strong> Answer: (1) Building the Masjid (Masjid an-Nabawi) × Established as the spiritual center, school, community parliament, and operational headquarters of the new Islamic state. (2) The System of Mu'akhat (Brotherhood) × Pairing up one Makkan migrant (Muhajir) with one local resident of Madinah (Ansari). The Ansari shared half their home, land, and wealth to help their new brother settle without begging. (3) The Constitution of Madinah × A written political treaty between the Muslims and the local Jewish tribes, establishing religious freedom, mutual defense against outside attacks, and naming the Prophet → as the final judge for disputes.</p>
            <p><strong>Q35: Build a timeline mapping the major milestones from first revelation to Hijrah.</strong> Answer: Year 1 of Prophethood × First Revelation at Cave Hira (Angel Jibril arrives). Year 3 of Prophethood × The call goes public at Mount Safa; persecution begins. Year 5 of Prophethood × First Migration of early Muslims to Abyssinia (Habasha). Year 10 of Prophethood × Year of Sorrow ('Am al-Huzn): Death of Khadijah & Abu Talib. Year 13 of Prophethood × Great Hijrah (Migration) to Madinah; Start of Islamic Calendar.</p>
          </div>
        </SubSection>

        <SubSection title="SECTION 8: ISLAMIC HISTORY, FIQH, AND DAILY APPLICATION">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Q36: Why did the Prophet choose Abyssinia for the first migration, and how did Ja'far defend Islam before King Najashi?</strong> Answer: The Prophet → chose Abyssinia because it was ruled by a Christian King named Najashi (The Negus), known for absolute justice and refusing to oppress anyone. The Muslim delegation was led by Ja'far bin Abi Talib (RA). Before King Najashi, Ja'far spoke eloquently about how Islam changed them from a lawless society into people of virtue. He then recited the opening verses of Surah Maryam (about the birth of Jesus). King Najashi wept upon hearing the verses and refused to hand the Muslims over to the Quraish, granting them permanent protection.</p>
            <p><strong>Q37: Define Qasr and Jam' prayers and list the exact conditions required to use them.</strong> Answer: Qasr (Shortening) × Reducing the four-rak'ah prayers (Dhuhr, Asr, and Isha) down to exactly two rak'ahs. Maghrib (3 rak'ahs) and Fajr (2 rak'ahs) cannot be shortened. Jam' (Combining) × Joining two prayers together within the time frame of one. Dhuhr can be combined with Asr, and Maghrib can be combined with Isha. Fajr must always be prayed on its own. Conditions: The travel distance must exceed roughly 80 kilometers, the journey must be for a clean purpose, and the concessions apply as long as the traveler remains away from home.</p>
            <p><strong>Q38: Differentiate between Zakah and Sadaqah.</strong> Answer: Zakah × An obligatory pillar of Islam (2.5% of excess wealth held for one full year). It is collected from wealthy Muslims and distributed strictly to eight specific groups listed in the Quran, starting with the poor and needy. Failing to pay it is a major sin. Sadaqah × A completely voluntary charity given at any time, in any amount, to any person or cause. It is not limited by calculations. It can be money, food, clothes, or even a simple smile to a classmate.</p>
            <p><strong>Q39: What did the Prophet say about caregivers of orphans, and what is the community's duty toward fatherless children?</strong> Answer: The Prophet → held his index and middle finger close together and said: "The one who takes care of an orphan and myself will be together in Paradise like these two fingers." (Al-Bukhari). A Muslim community must protect the property of orphans, pay for their food, clothing, and education, and treat them with warmth and respect. Harming or stealing an orphan's inheritance is a major sin.</p>
            <p><strong>Q40: Tariq skips Dhuhr and Asr prayers while traveling. Critique his decision using Fiqh.</strong> Answer: Tariq's decision is wrong. A Muslim is never allowed to intentionally skip a prayer past its valid time zone, even while traveling. Tariq should have used the concession of Jam' and Qasr. Before leaving, or during a brief refueling stop, he could have combined Dhuhr and Asr together (2 rak'ahs each). If the bus never stopped at all, he was obligated to pray sitting down in his bus seat, gesturing for Ruku and Sujud, rather than delaying the prayers until the next morning.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- KISWAHILI NOTES ----------
function KiswahiliNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Kiswahili: Mwongozo Kamili wa Gredi ya 5</h2>

      <Section title="Sehemu ya 1: Sarufi na Akisami za Maneno (Parts of Speech)">
        <p>Sarufi ndio uti wa mgongo wa lugha yoyote. Katika sehemu hii, tutachambua aina nne kuu za maneno ambazo mwanafunzi wa Gredi ya 5 anapaswa kuzimudu kikamilifu.</p>

        <SubSection title="1.1 Nomino (Nouns)">
          <p>Nomino ni neno linalotaja jina la mtu, mahali, kitu, mnyama, dhana au hali.</p>
          <BulletList items={[
            'Nomino za Kawaida (Common Nouns): majina ya jumla ya vitu, watu au mahali. Mifano: mwalimu, kiti, mto, mbwa, shule.',
            'Nomino za Pekee (Proper Nouns): majina maalum ya watu, mahali, nchi, siku. Huanza kwa herufi kubwa. Mifano: Juma, Mombasa, Kenya, Jumatatu.',
            'Nomino za Makundi (Collective Nouns): mkusanyiko wa vitu au watu. Mifano: chama cha wasaidizi, bumba la nyuki, tita la kuni, kikozi cha askari.',
            'Nomino za Dhahania (Abstract Nouns): dhana zisizoshikika. Mifano: wema, uaminifu, amani, upendo, huzuni.',
          ]} />
        </SubSection>

        <SubSection title="1.2 Viwakilishi (Pronouns)">
          <p>Viwakilishi ni maneno yanayochukua nafasi ya nomino.</p>
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Nafsi</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Umoja</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Wingi</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Kwanza</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mimi</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Sisi</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Pili</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wewe</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Nyinyi</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Tatu</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Yeye</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wao</td></tr>
            </tbody>
          </table>
          <BulletList items={[
            'Viwakilishi Vimilikishi: -angu, -ako, -ake, -etu, -enu, -ao. Mfano: Kitabu hiki ni changu.',
            'Mifano katika sentensi: Mimi ninasoma Kiswahili. Yeye alikuja kututembelea.'
          ]} />
        </SubSection>

        <SubSection title="1.3 Vitenzi na Nyakati (Verbs and Tenses)">
          <p>Kitenzi ni neno linaloeleza jambo linalofanyika. Nyakati kuu:</p>
          <BulletList items={[
            'Wakati Uliopo (-NA-): Mtoto ananalia. Sisi tunasoma.',
            'Wakati Uliopita (-LI-): Mwalimu aliliingia darasani. Wanafunzi walilifanya mtihani.',
            'Wakati Ujao (-TA-): Kesho tutatasafiri. Yeye atatanunua sare mpya.',
            'Wakati wa Mazoea (HU-): Paka hula panya. Sisi huenda kanisani kila juma.',
          ]} />
        </SubSection>

        <SubSection title="1.4 Vivumishi (Adjectives)">
          <BulletList items={[
            'Vivumishi vya Sifa: Mtu mzuri, miti mirefu, kiti kibaya.',
            'Vivumishi vya Idadi: Wanafunzi watatu, matunda mengi, kila mtoto.',
          ]} />
        </SubSection>

        <SubSection title="1.5 Viunganishi (Conjunctions)">
          <BulletList items={[
            'Na: kuunganisha mambo yanayofanana. Ali anapenda hesabu na Amina anapenda Kiswahili.',
            'Lakini: kuonyesha kinyume. Alikimbia kwa kasi lakini alichelewa.',
            'Kwa sababu: kutoa sababu. Hakufika shuleni kwa sababu alikuwa mgonjwa.',
            'Ingawa: kuonyesha hali ya kukiuka matarajio. Ingawa mvua ilinyesha, mechi iliendelea.',
          ]} />
        </SubSection>
      </Section>

      <Section title="Sehemu ya 2: Muundo wa Sentensi na Ngeli za Kiswahili">
        <SubSection title="2.1 Ngeli Kuu">
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Ngeli</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Mfano Umoja</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Sentensi (Umoja)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Mfano Wingi</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Sentensi (Wingi)</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>A-WA</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mwalimu</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mwalimu anafundisha.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Walimu</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Walimu wanafundisha.</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>KI-VI</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Kisu</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Kisu kimepotea.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Visu</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Visu vimepotea.</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>U-I</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mzinga</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mzinga umeanguka.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mizinga</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mizinga imeanguka.</td></tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title="2.2 Akisami na Alama za Uandishi">
          <BulletList items={[
            'Herufi Kubwa: mwanzo wa sentensi, majina ya pekee.',
            'Kituo / Nukta (.): mwishoni mwa sentensi ya taarifa.',
            'Koma (,): kutenganisha maneno katika orodha.',
            'Alama ya Kiulizi (?): mwishoni mwa sentensi ya swali.',
            'Alama ya Kishangao (!): hisia kali kama furaha au mshtuko.',
          ]} />
        </SubSection>
      </Section>

      <Section title="Sehemu ya 3: Msamiati wa Kimuktadha">
        <BulletList items={[
          'Nyumbani na Jikoni: seke/uma, sufuria, kikombe, sahani, mwiko, bata, kifyekeo.',
          'Shuleni: ubao, daftari, rula, chaki, maktaba, katibu.',
          'Sehemu za Mwili: kichwa, bega/mabega, kifua, kiwiko, goti/magoti, kiganja.',
        ]} />
      </Section>

      <Section title="Sehemu ya 4: Tamathali za Usemi, Misemo na Mafumbo">
        <SubSection title="4.1 Tashbihi (Similes)">
          <BulletList items={[
            'Tamu kama asali, Mweusi kama masizi, Siri kama ya kaburi, Mwepesi kama manyoya, Mpole kama kondoo, Mkali kama simba.',
          ]} />
        </SubSection>
        <SubSection title="4.2 Methali (Proverbs)">
          <BulletList items={[
            'Asiyesikia la mkuu huvunjika guu.',
            'Akili ni nywele, kila mtu ana zake.',
            'Haba na haba hujaza kibaba.',
            'Mtegemea cha ndugu hufa masikini.',
            'Polepole ndio mwendo.',
          ]} />
        </SubSection>
        <SubSection title="4.3 Vitendawili (Riddles)">
          <BulletList items={[
            'Kitendawili: Nyumba yangu haina mlango lakini ina wapangaji wengi ndani. × Jibu: Embe / Tikiti maji / Yai.',
            'Kitendawili: Kila nikienda anafuata, lakini nikimshika simuoni. × Jibu: Kivuli.',
            'Kitendawili: Kuku wangu ametaga mayai chini ya miba. × Jibu: Nanasi.',
            'Kitendawili: Askari wangu wote huvaa nguo nyeupe na mlinzi wao ni mwekundu. × Jibu: Meno na Ulimi.',
          ]} />
        </SubSection>
      </Section>

      <Section title="Sehemu ya 5: Ufahamu, Hadithi na Usomaji">
        <SubSection title="Hadithi ya 1: Safari ya Shule Hadi Hifadhi ya Tsavo">
          <p><strong>Sehemu ya Kwanza: Maandalizi ya Alfajiri</strong></p>
          <p>Jua la asubuhi lilianza kuchomoza polepole likisambaza miale yake ya dhahabu juu ya anga la kijiji cha Tumaini. Ilikuwa siku ya Jumamosi tulivu ya mwezi wa Aprili, siku ambayo wanafunzi wa Gredi ya 5 walikuwa wameisubiri kwa hamu kubwa kwa miezi mingi. Walikuwa wanakwenda katika ziara ya kimasomo kwenye Hifadhi ya Kitaifa ya Wanyamapori ya Tsavo.</p>
          <p>"Hakikisheni kila mtu ana mkoba wake wa shule, chupa ya maji ya kunywa, na daftari la kuandikia maelezo!" alisema Bwana Kamau, mwalimu mkuu wa shule, huku akipita na kukagua uandikaji wa majina ya wanafunzi kwenye orodha maalum.</p>
          <p>Amina na rafiki yake wa dhati, Asha, walikuwa wamesimama karibu na mlango wa basi kubwa la shule. Walikuwa wakizungumza kwa furaha na kicheko tele kuhusu wanyama mbalimbali waliotarajia kuwaona kama vile tembo, simba, na twiga. Amina alikuwa amebeba mkoba mkubwa, mwepesi wa plastiki uliokuwa na kamera yake ya picha, ilhali Asha alikuwa ameweka kalamu na karatasi za uandishi alizonunua kutoka duka la vifaa vya shuleni. Kila mtu alijawa na uchangamfu na basi lilipoanza kuondoka, wote waliruka kwa furaha wakisema, "Hifadhi ya Tsavo, huko tunaja!"</p>

          <p><strong>Sehemu ya Pili: Shida Katikati ya Safari</strong></p>
          <p>Muda wa adhuhuri ulipofika, basi la shule lilikuwa likitembea katikati ya barabara ndefu, yenye vumbi jingi inayoelekea kwenye milima ya hifadhi hiyo. Mazingira ya huko yalikuwa ya kuvutia sana, lakini hewa ilianza kuwa ya joto kali na miti ilizidi kuwa michache. Ghafla, anga safi la buluu lilibadilika na kuwa na mawingu mazito yenye rangi ya kijivu kama masizi. Upepo mkali ulianza kuvuma ukirusha mawingu makubwa ya vumbi angani.</p>
          <p>"Tazama kule!" alipiga kelele Asha huku akionyesha kwa kidole upande wa magharibi ambako mawingu meusi yalikuwa yakisogea kwa kasi kubwa sana. Ndani ya dakika chache, hali ya hewa ilibadilika na kuwa hatari. Matone makubwa ya mvua yalianza kuanguka yakigonga kwa nguvu juu ya paa la mabati la basi.</p>
          <p>Ghafla, gari lilitoa sauti kubwa "Puuu!" na likasimama imara katikati ya matope. Gurudumu la nyuma lilikuwa limeingia ndani kabisa ya shimo la matope na basi lisingeweza kusonga mbele tena. Mwalimu mkuu alipiga filimbi yake ya shaba kuwatuliza wanafunzi waliokuwa wameanza kuingiwa na woga. "Tusiwe na wasiwasi," alisema kwa utulivu, "sisi ni timu moja thabiti na tutapata suluhisho."</p>

          <p><strong>Sehemu ya Tatu: Usaidizi na Ushindi</strong></p>
          <p>Mvua ilizidi kunyesha kwa nguvu na barabara ikawa kama mto wa matope mekundu. Walimu walijaribu kusukuma gari lakini lilizidi kuzama ndani ya shimo. Wanafunzi walikaa ndani ya basi kwa utulivu mkubwa wakifuata maelezo ya walimu wao bila kufanya fujo yoyote.</p>
          <p>Baada ya nusu saa, gari kubwa la walinzi wa mbuga hiyo (Park Rangers) lilifika likiwa na kamba ndefu ya chuma. Walinzi hao walishuka wakiwa wamevalia makoti mazito ya mvua. Waliunganisha kamba ile kwenye mbele ya basi la shule na kisha wakawasha injini ya gari lao kubwa la nguvu. "Moja, mbili, tatu, vuta!" walisema kwa pamoja. Kwa msaada wa walinzi hao na nguvu ya gari lao, basi la shule lilivutwa kwa urahisi kutoka kwenye shimo la matope na kusimama kwenye sehemu kavu na salama ya barabara.</p>

          <p><strong>Sehemu ya Nne: Hitimisho</strong></p>
          <p>Hatimaye, walifika salama kwenye lango kuu la Hifadhi ya Tsavo ambapo mvua ilikuwa imekatika kabisa na jua likaanza kuonekana tena. Ndani ya hifadhi hiyo, walifanikiwa kuona kundi kubwa la tembo wakubwa wakila majani na twiga warefu wakitembea kwa madaha karibu na miti ya acacia. Amina alipiga picha nyingi nzuri kwa kutumia kamera yake na Asha aliandika kila kitu kwenye daftari lake. Walijifunza kuwa methali isemayo "polepole ndio mwendo" na "uaminifu na ushirikiano" ni mambo muhimu sana unapokabiliwa na changamoto maishani.</p>

          <SubSection title="Mazoezi ya Ufahamu kuhusu Hadithi ya 1">
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
              <p><strong>1. Wanafunzi wa Gredi ya 5 walikuwa wanasafiri kwenda wapi?</strong> B) Hifadhi ya Kitaifa ya Wanyamapori ya Tsavo.</p>
              <p><strong>2. Ni aina gani ya mkoba aliobeba Amina?</strong> B) Mkoba mkubwa, mwepesi wa plastiki.</p>
              <p><strong>3. Ni changamoto gani iliyokabili basi?</strong> B) Gurudumu la nyuma liliingia ndani ya shimo la matope.</p>
              <p><strong>4. Nani aliyesaidia kuvuta basi?</strong> B) Walinzi wa mbuga (Park Rangers) kwa gari lao kubwa na kamba ya chuma.</p>
              <p><strong>5. Ni methali gani iliyotajwa mwishoni?</strong> C) Polepole ndio mwendo.</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
              <p><strong>6. Taja nomino ya dhahania iliyotumika katika "Uaminifu na ushirikiano ni mambo muhimu sana."</strong> Jibu: Uaminifu, ushirikiano.</p>
              <p><strong>7. Badilisha kuwa Wakati Ujao: "Walimu wanajaribu kusukuma gari kubwa."</strong> Jibu: Walimu watajaribu kusukuma gari kubwa.</p>
              <p><strong>8. Ngeli ya nomino "Twiga" (umoja) / "Twiga" (wingi) ni ipi?</strong> Jibu: Ngeli ya A-WA (Twiga anaruka / Twiga wanaruka).</p>
              <p><strong>9. Weka alama ya uandishi: "Je, wanafunzi waliona tembo katika hifadhi ya Tsavo"</strong> Jibu: Je, wanafunzi waliona tembo katika hifadhi ya Tsavo?</p>
              <p><strong>10. Tafuta tashbihi iliyotumika kueleza mawingu.</strong> Jibu: "Mawingu mazito yenye rangi ya kijivu kama masizi."</p>
            </div>
          </SubSection>
        </SubSection>
      </Section>
    </div>
  );
}
