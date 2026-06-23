import { useState, useEffect, useRef } from 'react';

export default function AllGrade6Notes() {
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeSection, setActiveSection] = useState('notes');

  const [timerSeconds, setTimerSeconds] = useState(1800);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

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

  const handleAnswerChange = (index, value) => {
    setQaAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleQuizSelect = (index, option) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [index]: option }));
  };

  const handleSubmitQA = () => {
    const questions = subjects.find(s => s.id === activeSubject?.id)?.qa;
    if (!questions) return;
    clearInterval(timerRef.current);
    setTimerActive(false);
    let correct = 0;
    questions.forEach((q, i) => {
      const userAns = (qaAnswers[i] || '').trim().toLowerCase();
      const correctAns = q.answer.trim().toLowerCase();
      if (userAns === correctAns) correct++;
    });
    setQaScore(correct);
    setQaSubmitted(true);
  };

  const handleSubmitQuiz = () => {
    const questions = subjects.find(s => s.id === activeSubject?.id)?.quiz;
    if (!questions) return;
    clearInterval(timerRef.current);
    setTimerActive(false);
    let correct = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    setQuizScore(correct);
    setQuizSubmitted(true);
  };

  const subjects = [
    { id: 'math', label: 'Mathematics', short: 'M', desc: 'Real numbers, factors, fractions, ratios, percentages, algebra', color: '#6366f1', notes: MathNotes, qa: null, quiz: null },
    { id: 'english', label: 'English', short: 'E', desc: 'Grammar, verbs, modifiers, comprehension, functional & creative writing', color: '#0ea5e9', notes: EnglishNotes, qa: null, quiz: null },
    { id: 'kiswahili', label: 'Kiswahili', short: 'K', desc: 'Sarufi, ngeli, nyakati, msamiati, methali, vitendawili, hadithi, insha', color: '#10b981', notes: KiswahiliNotes, qa: null, quiz: null },
    { id: 'science', label: 'Science', short: 'Sc', desc: 'Living things, human body, environment, matter, energy, solar system', color: '#8b5cf6', notes: ScienceNotes, qa: null, quiz: null },
    { id: 'social', label: 'Social Studies', short: 'SS', desc: 'Physical environment, people, resources, governance, history, civics', color: '#f59e0b', notes: SocialNotes, qa: null, quiz: null },
    { id: 'cre', label: 'CRE', short: 'C', desc: 'Creation, patriarchs, kings, prophets, Jesus, early Church, Christian living', color: '#ef4444', notes: CRENotes, qa: null, quiz: null },
    { id: 'ire', label: 'IRE', short: 'I', desc: 'Quran, Hadith, pillars of Iman, Sawm, Seerah, Akhlaq', color: '#14b8a6', notes: IRENotes, qa: null, quiz: null },
    { id: 'agriculture', label: 'Agriculture', short: 'Ag', desc: 'Soil conservation, crop production, animal husbandry, nutrition, farm tools', color: '#84cc16', notes: AgricultureNotes, qa: null, quiz: null },
    { id: 'hre', label: 'HRE', short: 'H', desc: 'Paramatma, scriptures, Sadachar, festivals, Puja, Purusharthas', color: '#f97316', notes: HRENotes, qa: null, quiz: null },
  ];

  if (!activeSubject) {
    return (
      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>Grade 6 Notes</h1>
          <p style={{ color: 'var(--sub)', fontSize: '.875rem', margin: 0 }}>Select a subject to read your notes</p>
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
  const showTimer = activeSection === 'qa' || activeSection === 'quiz';

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
          <button onClick={() => { setActiveSection('notes'); clearInterval(timerRef.current); setTimerActive(false); }} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: activeSection === 'notes' ? s.color + '20' : 'transparent', color: activeSection === 'notes' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' }}>Notes</button>
          {s.qa && <button onClick={() => { setActiveSection('qa'); startTimer(); }} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: activeSection === 'qa' ? s.color + '20' : 'transparent', color: activeSection === 'qa' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' }}>Q&A</button>}
          {s.quiz && <button onClick={() => { setActiveSection('quiz'); startTimer(); }} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: activeSection === 'quiz' ? s.color + '20' : 'transparent', color: activeSection === 'quiz' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' }}>Quiz</button>}
        </div>
      </div>
      {showTimer && timerActive && (
        <div style={{ padding: '12px 20px', background: s.color + '10', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: s.color }}>?? Time Left: {formatTime(timerSeconds)}</span>
          {timerSeconds === 0 && <span style={{ color: '#ef4444', fontWeight: 600 }}>Time's up!</span>}
        </div>
      )}
      <div style={{ padding: '20px' }}>
        {activeSection === 'notes' && s.notes && (() => { const N = s.notes; return <N />; })()}
        {activeSection === 'qa' && s.qa && <QASection questions={s.qa} answers={qaAnswers} onChange={handleAnswerChange} submitted={qaSubmitted} score={qaScore} onSubmit={handleSubmitQA} />}
        {activeSection === 'quiz' && s.quiz && <QuizSection questions={s.quiz} selected={quizAnswers} onSelect={handleQuizSelect} submitted={quizSubmitted} score={quizScore} onSubmit={handleSubmitQuiz} />}
      </div>
    </div>
  );
}

function QASection({ questions, answers, onChange, submitted, score, onSubmit }) {
  return (
    <div>
      <h2 style={{ color: 'var(--text)', marginBottom: '16px' }}>?? Written Practice</h2>
      {submitted && score !== null && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', background: score === questions.length ? '#d1fae5' : '#fee2e2', color: score === questions.length ? '#065f46' : '#991b1b', fontWeight: 700, marginBottom: '16px' }}>
          You got {score}/{questions.length} correct!
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {questions.map((q, idx) => {
          const userAns = answers[idx] || '';
          const correct = submitted && userAns.trim().toLowerCase() === q.answer.trim().toLowerCase();
          return (
            <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: submitted ? (correct ? '#f0fdf4' : '#fef2f2') : 'var(--bg)' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>{idx + 1}. {q.question}</div>
              <input type="text" value={userAns} onChange={(e) => onChange(idx, e.target.value)} disabled={submitted} placeholder="Type your answer..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '.95rem', background: submitted ? '#f9fafb' : '#fff', color: 'var(--text)' }} />
              {submitted && (
                <div style={{ marginTop: '8px', fontSize: '.85rem' }}>
                  {correct ? <span style={{ color: '#16a34a', fontWeight: 600 }}>? Correct!</span> : <span><span style={{ color: '#dc2626', fontWeight: 600 }}>? Wrong. </span><span style={{ color: '#16a34a' }}>Correct answer: {q.answer}</span></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && <button onClick={onSubmit} style={{ marginTop: '24px', padding: '14px 32px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Submit Answers</button>}
    </div>
  );
}

function QuizSection({ questions, selected, onSelect, submitted, score, onSubmit }) {
  return (
    <div>
      <h2 style={{ color: 'var(--text)', marginBottom: '16px' }}>?? Multiple Choice Quiz</h2>
      {submitted && score !== null && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', background: score === questions.length ? '#d1fae5' : '#fee2e2', color: score === questions.length ? '#065f46' : '#991b1b', fontWeight: 700, marginBottom: '16px' }}>
          You got {score}/{questions.length} correct!
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {questions.map((q, idx) => {
          const chosen = selected[idx];
          const correctOpt = q.correct;
          return (
            <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: submitted ? (chosen === correctOpt ? '#f0fdf4' : '#fef2f2') : 'var(--bg)' }}>
              <div style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>{idx + 1}. {q.question}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(97 + optIdx);
                  const isSelected = chosen === letter;
                  const isCorrect = letter === correctOpt;
                  let bg = 'transparent';
                  if (submitted) { if (isCorrect) bg = '#d1fae5'; else if (isSelected && !isCorrect) bg = '#fee2e2'; }
                  else if (isSelected) { bg = '#e0e7ff'; }
                  return (
                    <button key={optIdx} onClick={() => onSelect(idx, letter)} disabled={submitted} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: bg, color: 'var(--text)', cursor: submitted ? 'default' : 'pointer', fontSize: '.9rem', textAlign: 'left' }}>
                      <span style={{ fontWeight: 700, width: '20px' }}>{letter}.</span><span>{opt}</span>
                      {submitted && isCorrect && <span style={{ marginLeft: 'auto', color: '#16a34a' }}>?</span>}
                      {submitted && isSelected && !isCorrect && <span style={{ marginLeft: 'auto', color: '#dc2626' }}>?</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!submitted && <button onClick={onSubmit} style={{ marginTop: '24px', padding: '14px 32px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Submit Exam</button>}
    </div>
  );
}

// ---------- MATHEMATICS ----------
function MathNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Grade 6 Mathematics</h2>
      <Section title="MODULE 1: THE REAL NUMBER SYSTEM, ADVANCED ARITHMETIC, AND NUMBER THEORY">
        <SubSection title="1.1 Integers, Signed Numbers, and the Coordinate Continuum">
          <p>The concept of number begins with counting integers (natural numbers N = &#123;1, 2, 3, …&#125;) and whole numbers (?? = &#123;0, 1, 2, 3, …&#125;). In Grade 6, this domain expands to the set of Integers (Z), which comprises all positive whole numbers, their negative opposites, and zero: Z = &#123;…, -3, -2, -1, 0, 1, 2, 3, …&#125;. An integer is a directed quantity. Positive integers represent values above a baseline; negative integers represent values below a baseline; zero acts as the absolute origin.</p>
          <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`       Negative Direction <------------------  0  ------------------> Positive Direction
... ---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--- ...
      -8  -7  -6  -5  -4  -3  -2  -1   0   1   2   3   4   5   6   7   8`}</pre>
          <p>The Absolute Value of an integer x, denoted by |x|, is defined analytically as the non-negative distance between the coordinate of x and the origin 0: |x| = x if x = 0, and |x| = -x if x &lt; 0.</p>
          <SubSection title="Analytical Formula Registry">
            <BulletList items={[
              'Additive Inverse Identity: a + (-a) = 0',
              'Absolute Value Equivalence: |-a| = |a|',
              'Distance Formula on a 1D Number Line: d(a,b) = |a - b|',
              'Sign Rules for Multiplication/Division: (+a) × (+b) = +(ab); (-a) × (-b) = +(ab); (-a) × (+b) = -(ab); (+a) × (-b) = -(ab)'
            ]} />
          </SubSection>
          <WorkedExample title="Example 1: Thermal Fluid Dynamics Simulation" problem="A chemical solution begins at -14°C. It is heated by 27°C, cooled by 35°C, cooled further by 12°C, and finally heated by 18°C. Calculate the final equilibrium temperature and its absolute distance from 0°C.">
            <Step>Step 1: T_final = -14 + 27 - 35 - 12 + 18</Step>
            <Step>Step 2: Convert to additive inverse: (-14) + 27 + (-35) + (-12) + 18</Step>
            <Step>Step 3: Group: (27+18) + ((-14)+(-35)+(-12)) = 45 + (-61)</Step>
            <Step>Step 4: 61 - 45 = 16; since |-61| &gt; |45|, result is -16°C</Step>
            <Step>Step 5: Distance = |-16 - 0| = 16 units</Step>
            <FinalAnswer>The final temperature is -16°C, which is 16°C below the 0°C threshold.</FinalAnswer>
          </WorkedExample>
        </SubSection>
        <SubSection title="1.2 Factors, Multiples, and Prime Decompositions">
          <p>A Prime Number is a natural number &gt; 1 with exactly two distinct positive divisors: 1 and itself. A Composite Number has more than two distinct positive divisors. The Fundamental Theorem of Arithmetic states that every integer n &gt; 1 can be represented as a unique product of prime numbers.</p>
          <BulletList items={[
            'GCF (Greatest Common Factor): Product of the lowest power of each common prime factor.',
            'LCM (Least Common Multiple): Product of the highest power of all prime factors present.',
            'Fundamental Identity: GCF(A,B) × LCM(A,B) = A × B'
          ]} />
          <WorkedExample title="Example 2: Industrial Supply Synchronization" problem="Track A dispatches every 48 minutes; Track B every 60 minutes. They depart together at 08:00 AM. Also, pack 48 steel bolts and 60 copper brackets into identical boxes with no leftovers. Find max boxes, components per box, and next simultaneous departure.">
            <Step>Step 1: Prime factorizations: 48 = 24 × 3×; 60 = 2² × 3² × 5²</Step>
            <Step>Step 2: GCF = 2² × 3² = 12 → Maximum 12 storage boxes.</Step>
            <Step>Step 3: Steel bolts per box = 48 × 12 = 4; Copper brackets per box = 60 × 12 = 5.</Step>
            <Step>Step 4: LCM = 24 × 3² × 5× = 240 minutes = 4 hours.</Step>
            <Step>Step 5: Next simultaneous departure: 08:00 AM + 4 hours = 12:00 PM.</Step>
            <FinalAnswer>12 boxes, each with 4 bolts and 5 brackets. Next departure at 12:00 PM.</FinalAnswer>
          </WorkedExample>
        </SubSection>
        <SubSection title="1.3 Rational Quantities: Advanced Operations with Fractions and Decimals">
          <p>A Rational Number is any number expressible as p/q where p and q are integers and q → 0. Division of fractions: Keep the first fraction, change × to ×, invert the second fraction (multiply by its reciprocal).</p>
          <WorkedExample title="Example 3: Precision Resource Division" problem="An industrial reservoir holds 17.5 liters of chemical sealant. Each vial has a capacity of 3/8 of a liter. Calculate how many complete vials can be filled and the remaining volume as a fraction of a liter.">
            <Step>Step 1: Convert 17.5 to fraction: 17.5 = 35/2 liters.</Step>
            <Step>Step 2: Division: N = (35/2) × (3/8) = (35/2) × (8/3) = (35°4)/(1°3) = 140/3.</Step>
            <Step>Step 3: 140 × 3 = 46 remainder 2 → 46 complete vials.</Step>
            <Step>Step 4: Leftover volume = (2/3) × (3/8) = 6/24 = 1/4 liter.</Step>
            <FinalAnswer>46 vials filled; 1/4 liter (0.25 L) of sealant remains.</FinalAnswer>
          </WorkedExample>
        </SubSection>
      </Section>
      <Section title="MODULE 2: RATIOS, RATES, AND PERCENTAGES">
        <SubSection title="2.1 Theoretical Foundations of Ratios, Unit Rates, and Proportions">
          <p>A Ratio is a mathematical comparison of two quantities, denoted as a:b or a/b where b → 0. A Rate compares two quantities with different units. A Unit Rate simplifies a rate so its denominator is 1. A Proportion states that two ratios are equal: a/b = c/d, implying a × d = b × c (cross-multiplication property).</p>
          <WorkedExample title="Example 4: Commercial Resource Efficiency" problem="Facility X fabricates 360 components every 8 hours. A competitor produces 215 components every 5 hours. Compare unit rates and find the time for Facility X to produce 1,080 components.">
            <Step>Step 1: Rate_X = 360/8 = 45 components/hour.</Step>
            <Step>Step 2: Rate_Competitor = 215/5 = 43 components/hour. Facility X is faster.</Step>
            <Step>Step 3: Proportion: 45/1 = 1080/t → 45t = 1080 → t = 24 hours.</Step>
            <FinalAnswer>Facility X operates at 45 components/hour (vs. 43). It takes 24 hours for 1,080 components.</FinalAnswer>
          </WorkedExample>
        </SubSection>
        <SubSection title="2.2 Percentages: Core Concepts, Fraction-Decimal Equivalence, and Real-World Applications">
          <p>The term Percent means "by the hundred." The Master Percent Equation: Part (V) = (Percent (P)/100) × Base Whole (W).</p>
          <WorkedExample title="Example 5: Retail Financial Analysis" problem="A computer workstation costs $1,250. A 15% promotional discount is applied, then an 8.5% sales tax is added. Calculate the final total cost.">
            <Step>Step 1: Discount value = 0.15 × 1250 = $187.50 saved.</Step>
            <Step>Step 2: Subtotal = 1250.00 - 187.50 = $1,062.50.</Step>
            <Step>Step 3: Sales tax = 0.085 × 1062.50 = $90.31.</Step>
            <Step>Step 4: Total invoice = 1062.50 + 90.31 = $1,152.81.</Step>
            <FinalAnswer>The total purchase cost is $1,152.81.</FinalAnswer>
          </WorkedExample>
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
  return <p style={{ marginBottom: '4px', paddingLeft: '8px' }}>{children}</p>;
}
function FinalAnswer({ children }) {
  return <p style={{ fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>Final Answer: {children}</p>;
}
function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text)' }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: '6px', fontSize: '.9rem' }}>{item}</li>)}
    </ul>
  );
}
// ---------- ENGLISH ----------
function EnglishNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? English Language Arts</h2>

      <Section title="Chapter 1: Foundations of Language Structure">
        <SubSection title="Abstract and Concrete Nouns">
          <p>Language relies on nouns to identify people, places, things, and ideas. At the Grade 6 level, the curriculum differentiates between concrete and abstract nouns to deepen textual comprehension and writing clarity.</p>
          <p><strong>Concrete nouns</strong> are entities that can be perceived through the five physical senses: sight, hearing, touch, taste, or smell. Objects such as a wooden desk, a physical textbook, a noisy school bell, or a cold glass of water are concrete nouns because they occupy physical space and can be directly observed. In narrative composition, using concrete nouns creates clear images for the reader. For instance, writing "The rain splattered against the tin roof" uses specific concrete entities (rain, roof) to build an immediate setting.</p>
          <p><strong>Abstract nouns</strong> represent ideas, emotional states, qualities, or conditions that have no physical existence. They cannot be seen, touched, or heard, yet they are vital for expressing complex thoughts. Examples include concepts like bravery, honesty, friendship, curiosity, intelligence, and justice. Understanding abstract nouns allows learners to look beyond basic actions and analyze themes within a text. In a comprehension passage, when a character acts with integrity, the reader evaluates the moral motivation behind the actions, rather than just tracking physical movements.</p>
          <BulletList items={[
            'Concrete Nouns (perceived via five senses): desk, bell, water, roof, student',
            'Abstract Nouns (ideas, qualities, states): bravery, honesty, friendship, curiosity, justice'
          ]} />
          <p>To use these word classes effectively, a writer must balance both types. Over-reliance on concrete nouns can make a text read like a simple inventory of objects, while an overabundance of abstract nouns can make writing vague and difficult to visualize. Combining them effectively × such as anchoring an abstract concept like fear to concrete details like sweaty palms and a racing heart × is a key marker of advanced Grade 6 literacy.</p>
        </SubSection>

        <SubSection title="Collective Nouns and Plurals">
          <p>Nouns change their forms to signal quantity and group dynamics. Standard pluralization often involves adding suffixes like -s or -es to a singular base (e.g., book to books, box to boxes). However, irregular plurals require distinct structural transformations. Some nouns change internal vowels (man becomes men, tooth becomes teeth, mouse becomes mice), while others modify their endings entirely (child becomes children, ox becomes oxen). Additionally, a unique subset of irregular nouns retains identical singular and plural forms, such as sheep, deer, and series. Recognizing these variations prevents grammatical mistakes during assessments.</p>
          <p>Collective nouns name a collection or group of individuals, animals, or items considered as a single unit. Common examples include: a pride of lions, a school of fish, a flock of birds, a pack of wolves, a herd of cattle, a swarm of bees, a colony of ants, a pod of whales, a troop of monkeys, a litter of puppies, a brood of chickens, a gaggle of geese, a murder of crows, a parliament of owls, a pack of cards, a deck of cards, a flight of stairs, a suite of rooms, a fleet of ships, a clump of trees, a bunch of grapes, a cluster of stars, a choir of singers, a band of musicians, a crew of sailors, a team of players, a staff of employees, a crowd of onlookers, a congregation of worshippers, a board of directors.</p>
          <p>The main grammatical challenge with collective nouns is subject-verb agreement. In standard English usage, when a collective noun operates as a single, unified entity, it takes a singular verb. For example, "The team is celebrating its victory." Conversely, if the individual members within the group act independently, the collective noun can take a plural verb: "The committee were divided on their opinions."</p>
        </SubSection>
      </Section>

      <Section title="Chapter 2: The Mechanics of Verbs and Tenses">
        <SubSection title="Regular and Irregular Verbs">
          <p>Verbs drive action and ground sentences within a specific timeframe. Regular verbs follow a predictable pattern when shifting from the present tense to the past tense and past participle, simply adding the suffix -ed or -d. For instance, walk → walked, play → played, decide → decided.</p>
          <p>Irregular verbs do not follow these standard rules. They change their spelling entirely or do not change at all when transitioning across tenses:</p>
          <BulletList items={[
            'Total Change: go ? went ? gone; fly ? flew ? flown; write ? wrote ? written',
            'Vowel Alternation: sing ? sang ? sung; swim ? swam ? swum; run ? ran ? run',
            'Identical Forms: put, cut, hit, hurt, cost, burst (all remain the same)'
          ]} />
          <p>Using the wrong past tense form of irregular verbs (such as writing "goed" instead of went, or "singed" instead of sang) is a common mistake for young writers.</p>
        </SubSection>

        <SubSection title="Progressive and Perfect Tenses">
          <p>Tenses allow writers to show the exact timing and status of actions, indicating whether they are finished or ongoing. The progressive (continuous) tenses describe ongoing, incomplete actions. They are formed by combining a variant of the auxiliary verb to be with the present participle (base verb ending in -ing).</p>
          <BulletList items={[
            'Present Progressive: "The students are writing their compositions." (happening right now)',
            'Past Progressive: "While the teacher was explaining the formula, the bell rang." (ongoing past action interrupted)'
          ]} />
          <p>The perfect tenses show actions that have already been completed relative to a specific point in time. They are formed using a variant of to have paired with the past participle.</p>
          <BulletList items={[
            'Present Perfect: "Mary has finished her homework, so she can now read for pleasure." (completed past action with present consequences)',
            'Past Perfect: "The train had departed by the time we arrived at the station." (action completed before another past event)'
          ]} />
        </SubSection>

        <SubSection title="Active and Passive Voice">
          <p>Voice refers to the relationship between the action expressed by the verb and the participants (subject and object). In the active voice, the subject performs the action directly: "The headteacher praised the choir." In the passive voice, the subject receives the action: "The choir was praised by the headteacher." To construct the passive voice, use the appropriate tense of to be followed by the past participle of the main verb. The passive voice is particularly useful when the actor is unknown, obvious, or less important than the action itself: "The classroom windows were cleaned yesterday."</p>
        </SubSection>
      </Section>

      <Section title="Chapter 3: Advanced Modifiers and Connectives">
        <SubSection title="Adjectives and Adverbs">
          <p>Modifiers add descriptive detail and precision to sentences. Adjectives modify nouns or pronouns. Grade 6 learners are taught to arrange multiple adjectives in a conventional order: Opinion → Size → Age → Shape → Color → Origin → Material → Purpose. Example: "She carried a beautiful, large, old, round, brown, Kenyan, wooden, writing desk."</p>
          <p>Adverbs modify verbs, adjectives, or other adverbs, explaining how, when, where, or to what extent an action occurs. Types include: Adverbs of Manner (gracefully), Adverbs of Time (tomorrow), Adverbs of Place (outside), Adverbs of Degree (extremely).</p>
        </SubSection>

        <SubSection title="Conjunctions and Question Tags">
          <p>Conjunctions serve as grammatical glue linking words, phrases, or clauses together. Correlative conjunctions operate in pairs: either...or (presents a choice), neither...nor (rejects both options), not only...but also (adds emphasis).</p>
          <p>Question tags are short clauses added to the end of a statement to turn it into a question. Rule: Positive statement → Negative tag; Negative statement → Positive tag. Examples: "You have finished your meal, haven't you?" / "They did not see the signal, did they?" / "Open the door, will you?" / "Let's go for a walk, shall we?"</p>
        </SubSection>
      </Section>

      <Section title="Chapter 4: Syntax and Sentence Mechanics">
        <SubSection title="Direct and Indirect Speech">
          <p>Direct speech repeats a person's exact words using quotation marks. Example: The doctor said, "You need to rest for three days." Proper punctuation requires commas before quotation marks, capitalizing the first spoken word, and keeping terminal punctuation inside closing quotation marks.</p>
          <p>Indirect (reported) speech relays what someone said without exact words. Converting requires: tense backshifting (present → past), pronoun realignment, and time/place adjustments. Example: He said, "I am buying a book here today." → He said that he was buying a book there that day.</p>
        </SubSection>

        <SubSection title="Conditionals and Determiners">
          <p><strong>Zero Conditional:</strong> Both clauses use simple present tense for facts and truths. Example: "If you heat ice, it melts."</p>
          <p><strong>First Conditional:</strong> Condition clause in simple present, result clause in simple future (will + base verb) for possible future events. Example: "If it rains this evening, we will cancel the outdoor practice."</p>
          <p>Determiners are words placed before nouns to clarify what the noun refers to: some/enough (quantity), each (individual members, singular), a lot of (large quantity).</p>
        </SubSection>
      </Section>

      <Section title="Chapter 5: Vocabulary and Practical Writing">
        <SubSection title="Word Meaning from Context">
          <p>Developing strong reading comprehension requires the ability to figure out the meaning of unfamiliar words using clues from the surrounding text. Types of context clues include:</p>
          <BulletList items={[
            'Synonym Clues: A similar meaning word appears nearby. (e.g., "The explorer felt apprehensive, anxious about what lay ahead.")',
            'Antonym Clues: The unfamiliar word is contrasted with an opposite concept. (e.g., "Unlike his energetic brother, Kamau was entirely lethargic.")',
            'Definition Clues: The sentence explicitly defines the term. (e.g., "The canopy × the high, leafy layer of trees × blocked out the direct sunlight.")',
            'Cause and Effect Clues: Surrounding events explain the word\'s meaning. (e.g., "Because the rainfall was so scanty, the crops withered and the wells dried up.")'
          ]} />
        </SubSection>

        <SubSection title="Functional and Creative Writing">
          <p>Writing assignments are generally divided into functional formats and creative narratives. <strong>Functional writing</strong> follows specific rules, such as formal letters, which must include: sender's address, date, recipient's official title and address, formal salutation (Dear Sir/Madam), a clear subject line (RE: APPLICATION FOR...), a concise polite body, and a formal sign-off (Yours faithfully) followed by signature and full name.</p>
          <p><strong>Creative writing</strong> allows personal expression, requiring students to brainstorm topics, organize ideas logically, and write engaging narratives usually between 160 and 200 words. A good narrative needs a clear beginning establishing setting and characters, a middle introducing conflict, and a satisfying conclusion resolving the issue. Writers should use sensory details, varied sentence structures, and precise vocabulary.</p>
        </SubSection>
      </Section>

      <Section title="Part 2: Anthology of Reading Passages">
        <SubSection title="Story 1: The Echoes of the Whispering Forest">
          <p>The Whispering Forest was a dense, ancient wilderness that bordered the village of Kiboko. For generations, the elders had warned the children against entering the forest past dusk, claiming that the ancient trees held memories and spoke in soft echoes to those who lost their way. Twelve-year-old Juma, known throughout the village for his curiosity and adventurous spirit, often sat at the forest edge, listening to the rustling leaves and wondering what secrets lay hidden beneath the canopy.</p>
          <p>One cool Tuesday afternoon, Juma's younger sister, Amina, lost her favorite silver bracelet while playing near the forest boundary. The bracelet had belonged to their grandmother, and Amina was heartbroken, weeping bitterly at the loss. Seeing his sister's distress, Juma made a quiet vow to find it. He waited until the sun began to dip below the horizon, casting long, dramatic shadows across the landscape. Armed with nothing but a small brass flashlight and a stout wooden walking stick, he stepped past the boundary markers and into the forest.</p>
          <p>Inside, the air was cool and filled with the scent of damp moss and decaying leaves. The forest canopy was so thick that it blocked out the emerging stars, plunging the interior into deep shadow. Juma walked carefully, sweeping his flashlight beam across the forest floor, searching for the reflection of silver. The only sounds were the crunching of twigs under his boots and the distant, rhythmic hooting of an owl.</p>
          <p>As he walked deeper, the path began to twist and turn, confusing his sense of direction. He stopped, realizing he could no longer see the village lights behind him. Suddenly, a soft, whistling wind blew through the branches, creating a sound that resembled human whispering. Juma felt his heart beat faster. He remembered the elders' warnings and felt a wave of fear. However, his determination to find his sister's bracelet kept him moving forward.</p>
          <p>Near the base of an ancient, knotted baobab tree, something glittered in the mud. Juma rushed forward and knelt. It was the silver bracelet, half-buried but undamaged. He picked it up and wiped it clean, feeling a wave of relief. But as he stood up to leave, his flashlight flickered twice and went completely dark.</p>
          <p>Silence fell over the woods. Juma stood frozen in the dark, unable to see his hand in front of his face. He closed his eyes, took a deep breath, and decided to listen instead of panic. He noticed that the soft whistling of the wind seemed to flow in a steady direction. Remembering that the evening breeze always blew from the hills toward the village, he realized the sound could help guide him home.</p>
          <p>Using his wooden stick to feel the ground ahead and keeping the wind at his back, Juma slowly walked forward. He walked through the darkness for what felt like hours, focusing on the steady breeze. Finally, the thick trees began to thin out, and he saw the warm, welcoming glow of the village fires ahead. He burst through the trees into the open fields, safe and victorious. Amina ran to meet him, crying with joy as he slipped the silver bracelet back onto her wrist. That night, Juma realized that the forest was not full of monsters, but a place that demanded respect, focus, and a calm mind.</p>
        </SubSection>

        <SubSection title="Story 2: The Innovation of Kijani Village">
          <p>Kijani Village was situated in a semi-arid valley where water was a scarce and precious resource. For years, the community depended on a single seasonal river that dried up completely during the hot months, leaving the fields parched and the cattle weak. The villagers were often forced to walk long distances to fetch water from a distant reservoir, an exhausting task that took up hours of their day.</p>
          <p>Among the residents was a young, resourceful girl named Wanjiku. Wanjiku was passionate about science and technology, often spending her afternoons reading old textbooks and constructing small mechanical models from scrap materials. She watched her community struggle each dry season and became determined to find a sustainable solution to their water scarcity issue.</p>
          <p>One afternoon, Wanjiku noticed how dew accumulated on large plastic sheets left outside overnight. She realized that if she could collect and scale up this condensation process, she could create a continuous source of clean water. She began designing a simple water harvester using locally available materials: bamboo poles for the frame, large sheets of clear plastic to catch moisture, and split bamboo gutters to direct the water into a central storage tank.</p>
          <p>Many of the older villagers were skeptical of her plan. They believed that only heavy rainfall could solve their problems and viewed her experiment as a waste of time. Undeterred by their doubts, Wanjiku continued working on her prototype behind her house. She carefully adjusted the angles of the plastic sheets to maximize collection and sealed every connection with tree resin to prevent leaks.</p>
          <p>When her prototype was ready, she convinced her schoolteacher, Mr. Mwangi, to help her present the project to the village council. Impressed by her resourcefulness, Mr. Mwangi provided her with a large, clean plastic barrel to use as a storage tank. Together, they set up the first full-scale water harvester on a hill overlooking the village, where the night mist was thickest.</p>
          <p>The next morning, a group of curious villagers gathered around the harvester to see the results. To their amazement, the storage barrel contained several liters of clear, clean water, collected entirely from the overnight condensation. The doubts melted away, replaced by excitement and admiration for Wanjiku's ingenuity.</p>
          <p>Recognizing the value of her invention, the village elder authorized a community project to build dozens of water harvesters across the ridges. Within weeks, every household had access to a steady supply of water for cooking, drinking, and watering small vegetable gardens. Kijani Village transformed from a dry, struggling community into a model of innovation and self-reliance, proving that even young minds can solve major challenges using science and determination.</p>
        </SubSection>

        <SubSection title="Story 3: The Guardian of the Marine Sanctuary">
          <p>Along the coast of the Indian Ocean lay the village of Watamu, where the community relied heavily on fishing for their food and income. Over time, advanced commercial fishing methods and a lack of regulations led to overfishing, which severely damaged the local coral reefs and caused fish numbers to drop dangerously low. The fishermen had to sail further into the rough open sea just to bring home a modest catch, threatening their livelihoods and safety.</p>
          <p>A seasoned fisherman named Mzee Ali saw the damage being done to the marine ecosystem. He knew that if the coral reefs died, the fish populations would disappear entirely, leaving future generations with nothing. Mzee Ali decided to advocate for creating a protected marine sanctuary × a designated zone close to the shore where all fishing would be strictly banned to allow the coral and fish to recover.</p>
          <p>His proposal faced strong resistance from the younger fishermen, who feared that restricting their fishing grounds would lower their daily earnings. They argued that the ocean was vast and could never run out of fish. Mzee Ali held community meetings, explaining how coral reefs act as nurseries for young fish and showing how protecting the area would eventually benefit everyone.</p>
          <p>To prove his point, Mzee Ali worked with a group of young conservationists to create a small voluntary protection zone around a degraded reef section. They built artificial structures out of concrete and old coral fragments to give young fish a place to hide and grow. They also took turns patrolling the area to prevent illegal fishing and net placements.</p>
          <p>Months passed, and the voluntary sanctuary began to show remarkable changes. The coral fragments grew into colorful reefs, and schools of fish returned to the area. Because the sanctuary was thriving, surplus fish began swimming out into the surrounding waters where fishing was allowed, resulting in larger catches for the local fishermen nearby.</p>
          <p>Seeing the tangible benefits, the fishermen who had opposed the project became its strongest supporters. The village elders officially declared the entire reef a community-managed marine sanctuary, establishing strict penalties for violations. Watamu's marine life recovered, ensuring long-term food security and income for the village while teaching everyone the importance of conservation and sustainable fishing practices.</p>
        </SubSection>

        <SubSection title="Story 4: The Great Debate of Mapalo Academy">
          <p>Mapalo Academy was known for its excellence in academics and sports, but the school lacked an active debate club. The headteacher, Mrs. Nabwire, believed that public speaking was essential for building confidence and critical thinking skills. She announced that Mapalo Academy would host a grand inter-school debate tournament, and the student chosen as the lead speaker would represent the school at the national finals.</p>
          <p>Two Grade 6 students, Amina and Brian, emerged as the top candidates for the position. Amina was an avid reader with an extensive vocabulary and a deep knowledge of current events, though she often felt nervous when speaking in public. Brian was a charismatic speaker who could engage any audience with his humor and confidence, but he sometimes neglected research and relied on personal style over hard facts.</p>
          <p>Mrs. Nabwire decided that the school's lead speaker would be chosen through an open debate in front of the entire student body and a panel of teachers. The topic selected for the debate was: "Is Technology Doing More Harm Than Good to Modern Education?" Amina was assigned to argue for the motion, while Brian was assigned to argue against it.</p>
          <p>Amina spent the week researching in the school library, gathering statistics, reading expert analyses, and organizing her points onto neat index cards. She practiced her delivery in front of a mirror, focusing on maintaining steady eye contact and managing her breathing to calm her nerves. Brian, confident in his natural public speaking abilities, spent his time brainstorming witty jokes and catchphrases, confident he could win over the judges with his delivery alone.</p>
          <p>On the day of the debate, the assembly hall was packed with excited students and teachers. Brian spoke first, delivering an entertaining speech filled with humor that kept the audience laughing. He argued that gadgets made school fun and engaging, but he offered few concrete facts to support his claims. When Brian finished, the hall erupted in loud applause, and he smiled confidently, certain he had secured the position.</p>
          <p>Then, Amina stepped up to the podium. Though her hands trembled slightly at first, she took a deep breath and spoke with clarity and conviction. Instead of relying on humor, she presented a structured argument supported by clear evidence, demonstrating how screen time could cause distractions and reduce attention spans if left unmanaged. She balanced her criticisms with a fair acknowledgment of technology's benefits, presenting a well-rounded argument.</p>
          <p>When the panel of judges returned from their deliberations, Mrs. Nabwire stood up to announce the winner. She praised Brian for his engaging delivery but awarded the lead speaker position to Amina, highlighting her thorough research, logical arguments, and balanced analysis. Brian congratulated Amina, realizing that public speaking requires both confidence and solid preparation. Amina went on to represent Mapalo Academy at the national tournament, winning the championship trophy and inspiring her peers to join the school's new debate club.</p>
        </SubSection>

        <SubSection title="Story 5: The Journey of the Midnight Train">
          <p>The railway line running through the Highlands was an engineering marvel, winding along deep gorges and crossing high stone bridges built decades earlier. The most famous train on the line was the Midnight Express, a large steam locomotive that transported agricultural produce, machinery, and passengers between the capital city and the busy port towns. For eleven-year-old Leo, whose house sat on a ridge overlooking the tracks, watching the train pass by each night was a favorite ritual.</p>
          <p>One stormy Friday evening, heavy torrential rain fell across the Highlands, causing localized flooding and small mudslides along the ridges. Leo sat by his window, watching the lightning flash across the sky and listening to the wind roar through the trees. As he watched, a flash of lightning revealed a large mudslide on the hillside above the tracks, sending a massive pile of rocks and earth sliding down onto the rails below.</p>
          <p>Leo gasped, realizing that the tracks were completely blocked at a dangerous bend just a mile ahead of the stone bridge. He looked at the clock on his wall; it was 11:15 PM. The Midnight Express was scheduled to pass through his ridge in less than twenty minutes, traveling at high speed around the blind corner. He knew that if the train hit the mudslide, it would derail and potentially plunge into the gorge below.</p>
          <p>With his parents away in town due to the storm, Leo knew he had to act immediately. He grabbed his heavy yellow raincoat, a bright red emergency lantern from the kitchen, and rushed out into the storm. The wind fought against him, and the muddy path was slick and dangerous, but he pushed forward through the driving rain toward the tracks.</p>
          <p>He reached the railway line out of breath, his boots soaked and covered in mud. He ran along the gravel path beside the rails until he stood about five hundred yards ahead of the mudslide, giving the train enough space to stop safely. In the distance, he heard the low, rhythmic rumbling of the approaching locomotive and saw its bright headlight cutting through the rain.</p>
          <p>Standing in the center of the tracks, Leo held the red lantern high and began waving it side to side frantically. The train roared closer, its horn blowing loudly through the night air. For a terrifying moment, Leo feared the engineer wouldn't see him in the heavy rain, but he stood his ground, waving the lantern with all his strength.</p>
          <p>Suddenly, the screech of metal on metal echoed across the valley as the engineer applied the emergency brakes. Sparks flew from the wheels as the massive train slowed down, finally skidding to a complete stop just fifty yards away from where Leo stood.</p>
          <p>The engineer climbed down from the cab, shaken but grateful, as he saw the massive mudslide blocking the tracks just ahead. Thanks to Leo's bravery and quick thinking, hundreds of passengers and crew members were saved from a catastrophic accident. The story of the boy with the red lantern spread across the country, reminding everyone that courage and a quick response can save lives in times of crisis.</p>
        </SubSection>

        <SubSection title="Story 6: The Secret of the Ancient Artifact">
          <p>The National Museum was a quiet place of learning, filled with old manuscripts, historical clothing, and artifacts from ancient civilizations. Twelve-year-old Maya, whose mother worked as a senior curator at the museum, spent most of her weekend afternoons exploring the quiet exhibition halls. She was fascinated by history, often carrying a small sketchbook to draw the ancient tools and ornaments on display.</p>
          <p>During a renovation of the museum's basement vaults, workers uncovered a heavy, iron-bound wooden chest that had been mislabeled and forgotten for over a century. Intrigued by the discovery, Maya's mother brought the chest into the conservation lab to carefully examine its contents. Inside, wrapped in decayed layers of protective linen, lay a beautifully preserved clay tablet covered in strange, geometric inscriptions.</p>
          <p>Maya watched as her mother and a team of researchers spent days trying to decipher the writing on the tablet. They used advanced digital scanners and compared the symbols with known historical alphabets, but the meaning remained a mystery. The researchers concluded that the tablet was written in a rare code designed to hide important historical records from tomb raiders.</p>
          <p>One afternoon, while studying her mother's photographs of the tablet, Maya noticed a repeating pattern among the geometric shapes. She realized that the symbols were not individual letters, but coordinates that formed an ancient map when mirrored across a central axis. She traced the geometric lines onto a sheet of grid paper, flipped the paper over against the light, and saw a clear map layout emerge.</p>
          <p>She shared her discovery with her mother, who was amazed by her insight. By following Maya's mirrored layout, the research team successfully decoded the entire inscription. The tablet did not lead to hidden gold, but contained an ancient text explaining advanced crop rotation and water conservation techniques used by a civilization that had thrived in a drought-prone region thousands of years ago.</p>
          <p>The discovery made headlines in scientific journals, and the museum created a special exhibition dedicated to the decoded tablet and the civilization's history. Maya's grid drawing was placed on display alongside the ancient artifact, proving that fresh perspectives and careful observation can unlock long-forgotten historical secrets.</p>
        </SubSection>

        <SubSection title="Story 7: The Regeneration of the Wasteland">
          <p>At the edge of a growing industrial town lay a ten-acre plot of land known as the Wasteland. For years, the area had been used as an illegal dumping ground for factory waste, construction debris, and household garbage. The soil was contaminated, the air carried an unpleasant odor, and the local wildlife had entirely abandoned the area, leaving it a barren eyesore for the neighboring communities.</p>
          <p>A retired agricultural officer named Mr. Kamau refused to give up on the land. He believed that with proper soil management, dedication, and community support, any piece of land could be restored to health. He launched an ambitious community campaign called "Project Green Space" to transform the toxic dumping ground into a vibrant public park and wildlife sanctuary.</p>
          <p>Mr. Kamau began by organizing weekend cleanup drives. Local families, schoolchildren, and volunteers joined him to clear away rusted metal scraps, broken glass, and mounds of plastic waste. Once the physical debris was removed, he introduced a soil remediation plan. He planted rows of deep-rooted vetiver grass and leguminous cover crops to stabilize the soil, absorb heavy metals, and restore nitrogen levels.</p>
          <p>Months of hard work transformed the Wasteland. The grass grew thick and green, and the soil began to recover its natural dark color. Mr. Kamau then led the community in planting over five hundred indigenous trees, including acacias, neem, and fruit-bearing pawpaw and guava trees. They dug a small pond and lined it with clay to collect rainwater, creating a watering hole for birds and small animals.</p>
          <p>Within two years, the Wasteland had become a lush public park filled with birdsong and blooming wildflowers. Families gathered there for picnics, students came to study under the shade of the growing trees, and butterflies and bees returned to pollinate the flowers. Mr. Kamau's vision proved that no piece of land is beyond healing if a community works together with knowledge, patience, and love for the environment.</p>
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
// ---------- SCIENCE ----------
function ScienceNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Science and Technology</h2>

      <Section title="UNIT 1: LIVING THINGS (PLANTS AND INVERTEBRATES)">
        <SubSection title="1. Plant Structural Mechanics and Classification">
          <p>Plants are structurally categorized based on their vascular infrastructure, reproductive systems, and physical morphology. The global plant kingdom divides into two primary groups: vascular plants (tracheophytes), which contain specialized transport tissues like xylem and phloem, and non-vascular plants (bryophytes), such as mosses and liverworts, which lack these complex channels and absorb water directly through their cell walls via osmosis.</p>
          <BulletList items={[
            'Flowering Plants (Angiosperms): These plants produce flowers as their primary reproductive organs. The flower houses reproductive cells that, upon pollination and subsequent fertilization, develop into seeds enclosed within a protective fruit layer. Examples include maize, beans, mangoes, and hibiscus.',
            'Non-Flowering Plants (Gymnosperms, Ferns, and Mosses): These plants reproduce without developing flowers. Gymnosperms (such as pine, cypress, and cedar) produce naked seeds carried on specialized wooden structures called cones. Ferns and mosses reproduce through microscopic, single-celled structures called spores, which release from specialized cases (sporangia) on the undersides of leaves when mature.'
          ]} />
        </SubSection>

        <SubSection title="Cellular Transpiration and Photosynthesis">
          <p>Leaves serve as the primary chemical manufacturing sites and thermodynamic regulators for the plant body. Two vital physiological processes occur within these green structures:</p>
          <p><strong>Photosynthesis:</strong> This is the biochemical synthesis of organic compounds using solar energy. The structural formula is: Carbon Dioxide (6CO2) + Water (6H2O) × (Sunlight/Chlorophyll)? Glucose (C6H12O6) + Oxygen (6O2). Chloroplasts are microscopic cellular organelles containing chlorophyll, which acts as a biological solar panel trapping light energy. Stomata are microscopic pores located primarily on the lower epidermis of the leaf, acting as regulatory gateways, letting carbon dioxide in and releasing oxygen and water vapor.</p>
          <p><strong>Transpiration:</strong> This is the evaporation of excess water from the aerial parts of a plant, primarily through the stomata. Transpiration serves three critical structural purposes: Cooling Mechanism (evaporating water lowers the plant's internal temperature), Transpiration Stream (creates suction that pulls water and dissolved minerals upward from roots through xylem vessels), and Turgor Maintenance (keeps plant cells filled with water, providing structural support).</p>
        </SubSection>

        <SubSection title="Structural Root Architecture">
          <BulletList items={[
            'Taproot Systems: Characterized by a single, thick, dominant central root (the primary root) that grows deep vertically into the soil profile. Smaller lateral roots branch out horizontally. Taproots are common in dicotyledonous plants, such as beans, carrots, and mango trees. They allow the plant to access deep underground water reservoirs.',
            'Fibrous Root Systems: Formed by a dense, tangled mat of thin, similarly sized roots branching out directly from the base of the stem. There is no single dominant central root. Fibrous roots are common in monocotyledonous plants, like maize, grass, wheat, and onions. This system spreads out close to the soil surface, anchors plants firmly across a wide area, and efficiently prevents soil erosion.'
          ]} />
        </SubSection>

        <SubSection title="Invertebrate Taxonomy and Ecological Roles">
          <p>Invertebrates are organisms completely lacking an internal skeletal backbone (vertebral column). They make up over 95% of all animal species on Earth.</p>
          <BulletList items={[
            'Insects: The largest class of invertebrates. Their bodies divide into three distinct sections: the head, thorax, and abdomen. They possess six jointed legs attached to the thorax and typically have one or two pairs of wings and a pair of antennae. Examples include bees, grasshoppers, ants, and houseflies.',
            'Arachnids: Organisms with bodies divided into two main sections: a fused head and thorax called a cephalothorax, and an abdomen. They have eight jointed legs and lack wings and antennae. Examples include spiders, scorpions, ticks, and mites.',
            'Myriapods: Multi-segmented terrestrial invertebrates with elongated bodies. Millipedes have cylindrical bodies with two pairs of legs per body segment (detritivores). Centipedes have flattened bodies with one pair of legs per body segment and possess venomous claws (predators).',
            'Mollusks: Soft-bodied, unsegmented invertebrates. Most develop a hard external shell made of calcium carbonate. They move using a muscular structure called a foot. Examples include land snails, slugs, octopuses, and oysters.'
          ]} />
          <p><strong>Ecological and Economic Importance:</strong> Pollination by bees and butterflies, soil aeration and nutrient cycling by earthworms and snails, and biological decomposition by detritivores like fly maggots and beetles.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 2: HUMAN BODY SYSTEMS (RESPIRATORY AND REPRODUCTIVE)">
        <SubSection title="The Respiratory System: Anatomical Infrastructure and Gas Exchange">
          <p>The human respiratory system is an intricate network of organs designed to deliver oxygen to blood cells and remove carbon dioxide.</p>
          <BulletList items={[
            'The Nose and Nasal Cavity: Air enters through the nostrils, where tiny hair-like structures called cilia and sticky mucus trap dust, pollen, and bacteria. Blood vessels warm and humidify the air.',
            'The Trachea (Windpipe): A vertical tube directed down into the chest cavity, supported by rigid C-shaped rings of cartilage that prevent it from collapsing.',
            'The Bronchial Tree: At its base, the trachea splits into two primary bronchi, each entering a lung. Inside the lungs, bronchi divide into smaller bronchioles, distributing air evenly.',
            'The Alveoli (Air Sacs): Located at the tips of bronchioles, these are tiny grape-like clusters where gas exchange occurs. They have ultra-thin walls (one cell thick), are wrapped in dense capillary networks, and have a moist surface that dissolves oxygen for easier diffusion.'
          ]} />
          <p><strong>Gaseous Diffusion:</strong> Oxygen moves from the high-concentration alveoli into the low-concentration blood, binding to red blood cells. Simultaneously, carbon dioxide moves from the high-concentration blood into the alveoli to be exhaled.</p>
        </SubSection>

        <SubSection title="The Mechanics of Breathing (Inspiration vs. Expiration)">
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Feature</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Inspiration (Breathing In)</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Expiration (Breathing Out)</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Intercostal muscles</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Contract</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Relax</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Ribcage</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Moves upward/outward</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Moves downward/inward</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Diaphragm</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Contracts (flattens)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Relaxes (domes up)</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Chest cavity volume</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Increases</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Decreases</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Internal pressure</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Decreases</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Increases</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Air movement</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Air rushes into lungs</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Air is forced out of lungs</td></tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title="The Human Reproductive System: Anatomy and Pubertal Development">
          <BulletList items={[
            'Male Anatomy: Testes (held in scrotum outside body for cooler temperatures needed for sperm production, also produce testosterone), Urethra (tube through penis serving as pathway for urine and semen), Penis (external organ for sperm transfer).',
            'Female Anatomy: Ovaries (store and release ova/eggs, produce estrogen and progesterone), Fallopian Tubes (site of fertilization, connect ovaries to uterus), Uterus/Womb (hollow muscular organ where fertilized egg implants and fetus develops), Vagina (muscular canal receiving sperm and serving as birth canal).',
            'Puberty Changes: Males × voice deepening, broadening shoulders, facial/body hair, enlargement of testes and penis, onset of sperm production. Females × breast development, hip widening, body hair, onset of menstrual cycle (menarche). Both genders × rapid height/weight increase (growth spurts), increased oil/sweat gland activity, emotional shifts and mood swings.'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 3: ENVIRONMENT AND WASTE MANAGEMENT">
        <SubSection title="Classification and Characteristics of Waste Materials">
          <BulletList items={[
            'Biodegradable Waste: Materials that can be naturally broken down into simpler organic molecules by decomposers like bacteria, fungi, and earthworms. Examples: fruit peels, leftover food, paper, cotton fabrics, livestock manure, crop residues.',
            'Non-Biodegradable Waste: Materials made of synthetic or inorganic compounds that decomposers cannot break down. These persist for centuries. Examples: plastic bottles, polythene bags, glass jars, aluminum cans, synthetic nylon fabrics, dry cell batteries.'
          ]} />
        </SubSection>
        <SubSection title="Environmental Degradation Caused by Poor Waste Disposal">
          <BulletList items={[
            'Leachate Contamination: Rain filtering through open garbage dumps dissolves harmful chemicals and heavy metals, creating a toxic liquid (leachate) that seeps into underground water tables.',
            'Eutrophication: Organic waste and fertilizers washing into water bodies overload them with nutrients, triggering massive algae blooms that block sunlight and strip oxygen from the water, suffocating aquatic life.',
            'Air Pollution: Burning plastics releases hazardous gases including dioxins and furans that cause respiratory illnesses.',
            'Disease Vectors: Stagnant water in uncollected garbage creates breeding grounds for mosquitoes (malaria, dengue) and rats (leptospirosis).'
          ]} />
        </SubSection>
        <SubSection title="Waste Management Solutions (The 3Rs Framework)">
          <BulletList items={[
            'Reduce (Source Reduction): Stop waste from being created × choose products with minimal packaging, use cloth bags instead of single-use plastics, buy durable goods.',
            'Reuse (Direct Reutilization): Use items multiple times × wash and reuse glass jars for storage, use plastic containers as storage bins, donate outgrown clothes and books.',
            'Recycle (Industrial Processing): Collect, sort, and process waste materials into raw materials for new products × melt plastic bottles into polyester fibers, process scrap aluminum into new metal sheets, turn old newspapers into fresh paper products.'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 4: MATTER AND ENERGY (FORCES, ENERGY TRANSFORMATION, & SEPARATION)">
        <SubSection title="Forces: Types, Measurement, and Mechanical Applications">
          <p>A force is a push or a pull exerted on an object, measured in Newtons (N) using a spring balance.</p>
          <BulletList items={[
            'Gravitational Force (Weight): Non-contact attractive force pulling objects toward Earth\'s center. Weight = Mass × Gravitational Field Strength (g × 10 N/kg on Earth). Mass stays constant everywhere; weight changes with gravity.',
            'Frictional Force: Contact force opposing motion between two surfaces. Advantages: provides grip for walking and vehicle tires, enables brakes to work, allows matches to ignite. Disadvantages: causes wear and tear, generates unwanted heat. Reduced by lubricants (oil, grease), ball bearings, and streamlining.',
            'Magnetic Force: Non-contact force from magnets. Like poles repel (N-N or S-S push apart); opposite poles attract (N-S pull together).'
          ]} />
        </SubSection>
        <SubSection title="Energy Transformations and Applications">
          <p>The Law of Conservation of Energy states that energy cannot be created or destroyed; it can only be transformed from one form into another. A basic electrical circuit includes an energy source (battery), conductive wires, a switch, and a load (lightbulb). Chemical Energy (battery) → Electrical Energy (wires) → Light/Heat Energy (bulb) or Sound Energy (speaker).</p>
        </SubSection>
        <SubSection title="Advanced Separation of Mixtures">
          <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
            <tbody>
              <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Mixture Components</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Separating Method</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Physical Property Exploited</th></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Liquid + Insoluble Solid (e.g., Muddy Water)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Filtration</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Difference in particle size</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Soluble Solid + Liquid (e.g., Salt Solution)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Evaporation</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Differences in boiling point</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Immiscible Liquids (e.g., Oil and Water)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Decantation (or Separating Funnel)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Differences in density</td></tr>
              <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Magnetic + Non-Magnetic (e.g., Iron Filings + Sand)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Magnetic Extraction</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Magnetic susceptibility</td></tr>
            </tbody>
          </table>
        </SubSection>
      </Section>

      <Section title="UNIT 5: COMPUTING DEVICES AND CODING CONCEPTS">
        <SubSection title="Coding Concepts: Computational Logic and Visual Block Coding">
          <p>Coding is the process of writing step-by-step instructions that tell a computer exactly what to do. At the Grade 6 level, students learn computational thinking using visual block coding platforms like Scratch or Blockly.</p>
          <BulletList items={[
            'Sequence (Linear Order): Computers execute code strictly from top to bottom, one block at a time. If the order of blocks is altered, the entire output or software behavior changes.',
            'Loops (Iteration): Iteration eliminates repetitive coding blocks by telling the program to cycle through a set of instructions multiple times. A Repeat 10 loop runs actions exactly ten times; a Forever loop keeps running continuously.',
            'Conditionals (Decision-Making Logic): If...Then blocks test a condition (e.g., Is the sprite touching the edge?). If true, the nested code executes. If...Then...Else provides an alternate pathway if the condition is false.',
            'Hat/Event Blocks: Start the execution of a script (e.g., When green flag clicked).',
            'Motion Blocks: Control physical movement of a sprite (Move 10 steps, Turn 15 degrees).',
            'Sensing Blocks: Detect inputs, touches, colors, or distances (Touching color?, Ask [name] and wait).',
            'Variables Blocks: Store, track, and modify dynamic data values (Change [score] by 1, Set [lives] to 3).'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 6: MATTER AND CHEMICAL CHANGES">
        <SubSection title="States of Matter and Particle Theory">
          <p>Matter is anything that has mass and occupies space. According to the Kinetic Particle Theory, all matter is composed of tiny, discrete particles that are constantly moving.</p>
          <BulletList items={[
            'Solids: Particles tightly packed in a fixed, regular pattern; vibrate about fixed positions; definite shape and volume.',
            'Liquids: Particles close together but arranged randomly; slide past one another; flow and take shape of container; fixed volume.',
            'Gases: Particles spaced very far apart; move rapidly and randomly; no fixed shape or volume; expand to fill any container.'
          ]} />
          <p><strong>Phase Changes:</strong> Melting (solid → liquid via heating), Evaporation/Boiling (liquid → gas via heating), Condensation (gas → liquid via cooling), Freezing/Solidification (liquid → solid via cooling), Sublimation (solid → gas directly, e.g., dry ice).</p>
        </SubSection>
        <SubSection title="Permanent vs. Temporary Changes">
          <BulletList items={[
            'Temporary (Physical) Changes: Alter form or appearance without creating a new substance; easily reversible. Examples: melting of ice, dissolving salt in water, freezing juice into an ice pop.',
            'Permanent (Chemical) Changes: Substances react chemically to form entirely new products with different properties; irreversible. Examples: rusting of iron, burning firewood into ash, souring of milk, baking a cake. Indicators: unexpected color shifts, gas bubble production (effervescence), heat release.'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 7: ENERGY AND ITS TRANSMISSION">
        <SubSection title="Forms of Energy">
          <BulletList items={[
            'Chemical Energy: Stored inside chemical bonds (food, batteries, fuels).',
            'Kinetic Energy: Energy of motion (speeding car, flowing water, turning wind turbine).',
            'Potential Energy: Stored energy due to position or state (water behind a dam).',
            'Thermal (Heat) Energy: Internal energy from atomic movement (hot objects have fast-moving particles).'
          ]} />
        </SubSection>
        <SubSection title="Methods of Heat Transfer">
          <BulletList items={[
            'Conduction: Transfer through solids via direct particle collisions. Conductors: copper, iron, aluminum. Insulators: wood, plastic, rubber, cork.',
            'Convection: Transfer through fluids (liquids and gases) by movement of heated particles. Warm fluid rises; cool fluid sinks, creating convection currents.',
            'Radiation: Transfer through space via electromagnetic waves without needing a medium. How solar heat reaches Earth across the vacuum of space.'
          ]} />
        </SubSection>
        <SubSection title="Light Energy and Optics">
          <BulletList items={[
            'Reflection: Bouncing back of light rays when they strike a smooth, polished surface. Angle of incidence = Angle of reflection.',
            'Refraction: Bending of light rays as they pass from one transparent medium into another of different density (e.g., air into glass or water). Makes a straight pencil look bent in water.'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 8: EARTH, SPACE, AND THE SOLAR SYSTEM">
        <SubSection title="Components of the Solar System">
          <BulletList items={[
            'The Sun: Massive central star of glowing hydrogen and helium gases; exerts gravitational pull holding the solar system in place; primary source of light and thermal energy.',
            'Inner Rocky Planets: Mercury (smallest, closest, extreme temperature swings), Venus (hottest, thick CO2 atmosphere, runaway greenhouse effect), Earth (only known planet with life, liquid water, oxygen-rich atmosphere), Mars (Red Planet, iron oxide soil, thin atmosphere, polar ice caps).',
            'Outer Gas Giants: Jupiter (largest planet, Great Red Spot storm), Saturn (spectacular ring system of ice particles and debris), Uranus (ice giant, pale blue-green from methane, rotates on its side), Neptune (farthest, coldest, supersonic winds, deep blue appearance).'
          ]} />
        </SubSection>
        <SubSection title="Movements of the Earth">
          <BulletList items={[
            'Rotation: Earth spins on its internal axis from West to East. One complete rotation = 24 hours (1 day), creating the daily cycle of day and night.',
            'Revolution: Earth orbits the Sun along an elliptical path. One complete revolution = 365 × days (1 year). Earth\'s axis is tilted at 23.5°, causing varying sunlight throughout the year, creating seasons (Spring, Summer, Autumn, Winter).'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 9: PRACTICE EVALUATION QUESTIONS">
        <SubSection title="Questions">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 1 (Human Biology):</strong> Describe the structural differences and functional relationship between the trachea and the alveoli during human respiration.</p>
            <p><strong>Question 2 (Botany):</strong> A Grade 6 student noticed that water droplets formed inside a clear, dry plastic bag tied around a leafy branch of a live plant. Explain the biological process responsible for this observation.</p>
            <p><strong>Question 3 (Computing):</strong> Explain the function of an If-Then-Else control block in visual coding, and provide a practical real-world computing example.</p>
            <p><strong>Question 4 (Chemistry):</strong> When iron nails are left exposed to moist air, they turn reddish-brown over time. State whether this is a physical or chemical change, and justify your answer with two scientific reasons.</p>
            <p><strong>Question 5 (Physics):</strong> Explain why a metal spoon feels much colder than a wooden block when both are left in a freezing room at 0°C for several hours.</p>
          </div>
        </SubSection>
        <SubSection title="Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> The trachea (windpipe) is a long tube reinforced with C-shaped rings of cartilage that prevent it from collapsing. Its function is to provide an open pathway for air entering the body. The alveoli are tiny, grape-like air sacs located at the end of the bronchioles deep within the lungs. They have micro-thin walls and are surrounded by a dense network of blood capillaries. Their functional relationship is that the trachea delivers inhaled oxygen-rich air down to the alveoli, where gas exchange takes place: oxygen diffuses into the bloodstream, and carbon dioxide diffuses out of the blood into the alveoli to be exhaled.</p>
            <p><strong>Answer 2:</strong> The biological process responsible is transpiration. Transpiration is the loss of excess water vapor from plants, primarily through microscopic pores called stomata located on the undersides of leaves. When the plant releases invisible water vapor into the air, the vapor becomes trapped inside the sealed plastic bag. Because the plastic surface is cooler than the air inside, the trapped water vapor loses heat energy and undergoes condensation, turning back into visible liquid water droplets.</p>
            <p><strong>Answer 3:</strong> An If-Then-Else block is a conditional decision-making control structure that allows a program to choose between two alternate paths based on a true/false condition. If the specific condition evaluates to true, the program runs the code inside the Then section. If the condition evaluates to false, the program skips the first section and runs the code inside the Else section instead. Example: Programming an automated gate system: IF vehicle sensor detects a valid gate pass is true, THEN open the security gate, ELSE keep the gate locked and flash an alarm light.</p>
            <p><strong>Answer 4:</strong> This is a chemical change (specifically known as rusting or iron oxidation). This transformation is classified as a chemical change for two reasons: Formation of a New Substance × The chemical reaction between iron, oxygen, and water produces an entirely new compound called hydrated iron oxide (rust), which has different physical and chemical properties than the original metal. Irreversibility × The process is permanent and cannot be easily reversed to recover the original shiny iron metal using simple physical methods.</p>
            <p><strong>Answer 5:</strong> Both items are at the exact same temperature (0°C), but they feel different because of their thermal properties. The metal spoon is an excellent thermal conductor. When you touch it, heat energy flows rapidly away from your warm fingers into the metal, making your skin drop in temperature quickly, which registers as a cold sensation. The wooden block is a thermal insulator. It resists the flow of heat, meaning energy leaves your fingers very slowly when you touch it, so it does not feel as cold as the metal.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- SOCIAL STUDIES ----------
function SocialNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Social Studies: Eastern Africa and Global Integration</h2>

      <Section title="CHAPTER 1: THE PHYSICAL ENVIRONMENT OF EASTERN AFRICA">
        <SubSection title="1.1 Position, Size, and Shape of Eastern Africa">
          <p>Eastern Africa is a premier geographical sub-region of the African continent. Geographically, it is located in the eastern portion of Africa, stretching across a vast network of latitudes and longitudes that define its climatic diversity.</p>
          <BulletList items={[
            'Latitudinal Boundaries: It lies between 5 × North and 12 × South of the Equator. The Equator (0×) cuts directly through the middle of the region, specifically partitioning Kenya, Uganda, and the Democratic Republic of Congo borderlands.',
            'Longitudinal Boundaries: It extends from 22 × East to 51 × East of the Prime Meridian (Greenwich Meridian).',
            'The collective land surface area spans approximately 6.3 million square kilometres, comprising eleven autonomous republics and states: Kenya, Tanzania, Uganda, Somalia, Ethiopia, South Sudan, Sudan, Eritrea, Djibouti, Rwanda, and Burundi.',
            'Territorial Maritime Boundaries: To the North × Egypt and Mediterranean access zones. To the Northeast × the Red Sea. To the East × the Indian Ocean. To the South × Mozambique and Malawi. To the West × the Democratic Republic of Congo and the Central African Republic.'
          ]} />
        </SubSection>

        <SubSection title="1.2 Geological Processes and Formation of Main Physical Features">
          <BulletList items={[
            'The Great Rift Valley: A continuous geographic trench stretching over 6,000 kilometres from the Middle East to Mozambique. Formed through faulting driven by tectonic forces: Tensional Force Theory × parallel underground forces pull the Earth\'s crust apart, causing the central block to collapse downward forming the valley floor, leaving steep escarpments on either side. Compressional Force Theory × parallel forces push crust toward each other, forcing side blocks upward over the central block.',
            'Volcanic Mountains: Formed by volcanicity where molten rock (magma) forces its way up through deep cracks or vents in the crust. When magma erupts onto the surface as lava, it cools, solidifies, and piles up around the vent over repeated eruptions, building a cone-shaped mountain. Examples: Mount Kilimanjaro (Tanzania, 5,895m), Mount Kenya (5,199m), Mount Elgon, the Virunga Mountains.',
            'Block Mountains (Horsts): Formed by tectonic faulting where the central block of land between parallel fault lines is squeezed and forced directly upward by compressional forces. Examples: Ruwenzori Mountains (Uganda/DRC), Aberdare Range (Kenya), Usambara and Pare Mountains (Tanzania).'
          ]} />
        </SubSection>

        <SubSection title="1.3 Drainage Systems: Lakes and Rivers">
          <BulletList items={[
            'Rift Valley Lakes: Formed when water collected in deep depressions on the Rift Valley floor after faulting. They are long, narrow, and deep. Many have no river outlets, leading to high mineral concentration (salty/alkaline). Examples: Lake Tanganyika (longest freshwater lake in the world, deepest in Africa), Lake Turkana (largest permanent desert lake), Lake Nakuru, Lake Naivasha, Lake Magadi.',
            'Downwarped Lakes (Basin Lakes): Formed by warping where a wide area of land sinks in the center while surrounding edges tilt upward, creating a vast shallow basin. Examples: Lake Victoria (largest lake in Africa, shared by Kenya, Tanzania, and Uganda), Lake Kyoga (Uganda).',
            'Major River Systems: The River Nile (longest river in the world, originating from Lake Victoria as the White Nile), Tana River (Kenya\'s longest river, flowing into the Indian Ocean), Rufiji River (Tanzania, one of the largest drainage basins in East Africa), Ewaso Ng\'iro North (inland-draining river disappearing into Lorian Swamp in northern Kenya).'
          ]} />
        </SubSection>

        <SubSection title="1.4 Weather and Climate Dynamics">
          <BulletList items={[
            'Factors Influencing Climate: Altitude (temperature drops approx. 1°C for every 150m ascent × highlands are cool, lowlands are hot). Latitude (Equator passes through, so sun is directly overhead twice a year, resulting in generally high temperatures year-round). Distance from Water Bodies/Continentality (areas near Indian Ocean or Lake Victoria receive higher, more reliable rainfall). Relief/Orographic Effect (mountains force moist air upward, causing heavy rainfall on windward slopes; leeward slopes are dry rain shadows). Wind Systems (Northeast Monsoons bring dry air November-April; Southeast Monsoons bring moist air May-October triggering the primary rainy season).',
            'Major Climatic Zones: Equatorial and Modified Equatorial Zone (high temperatures 24°C-28°C, heavy rainfall 1200mm-2000mm annually, no distinct dry season). Savanna/Tropical Zone (covers largest part, distinct wet and dry seasons, grasslands with acacia and baobab trees). Arid and Semi-Arid Zone (low rainfall <300mm annually, high temperatures 30°C-38°C, thorny shrubs and dry scrubland). Montane/Alpine Zone (high-altitude areas above 2,000m, cool temperatures, high relief rainfall, vegetation zones changing with altitude from bamboo forests to afro-alpine moorland).'
          ]} />
        </SubSection>
      </Section>

      <Section title="CHAPTER 2: PEOPLE AND POPULATION OF EASTERN AFRICA">
        <SubSection title="2.1 Linguistic Classifications and Roots">
          <BulletList items={[
            'The Bantus: Largest linguistic group in Eastern Africa (over 60% of population). Originated from the Congo Basin and West-Central Africa. Migrated eastward around 1000 BCE in search of fertile farming land. Key sub-groups: Kenya (Kikuyu, Luhya, Kamba, Meru, Kisii, Mijikenda), Tanzania (Sukuma, Nyamwezi, Chagga, Haya), Uganda (Baganda, Banyankole, Basoga).',
            'The Nilotes: Second-largest group. Originated from South Sudan along the Nile River plains. Migrated southward seeking green pastures and water. Sub-divided into: River-Lake Nilotes (Luo of Kenya/Uganda × settled near water, fishing and crop farming), Plain Nilotes (Maasai, Samburu, Turkana, Iteso × pastoralists in open grassland plains), Highland Nilotes (Kalenjin of Kenya × Nandi, Kipsigis, Pokot × settled in high-altitude regions, dairy and crop farming).',
            'The Cushites: Primarily live in arid and semi-arid plains of the Horn of Africa. Originated from southern Ethiopia and Somalia. Eastern Cushites: Somali, Oromo, Borana, Rendille. Southern Cushites: smaller older group in central Tanzania including the Iraqw.',
            'The Semites: Smallest linguistic family. Originated from the Middle East, crossing the Red Sea into the Horn of Africa around 1000 BCE. Primary communities: Amhara and Tigrayans (Ethiopia), Arabic-speaking populations. Heavily influenced the development of Kiswahili along the East African coast.'
          ]} />
        </SubSection>

        <SubSection title="2.2 Historical Migrations: Causes and Regional Impacts">
          <BulletList items={[
            'Push Factors: Drought and famine (drying water sources in South Sudan forced Nilotes southward), Overpopulation (Congo Basin crowding pushed Bantus outward), Disease outbreaks (sleeping sickness forced communities away from fly-infested forests), Internal conflicts and wars.',
            'Pull Factors: Fertile agricultural land (volcanic soils around Mt. Kenya attracted Bantu farmers), Abundant grazing pasture (Rift Valley grasslands pulled pastoralist Nilotes), Reliable water sources (rivers and lakes attracted fishing and farming communities), Peaceful unoccupied areas.',
            'Regional Impacts: Cultural exchange and borrowing (Bantus adopted age-set systems from Cushites; Luo adopted iron-working from Bantus), Intermarriage between language families, Introduction of new crops and farming techniques, Displacement of indigenous communities (Khoisan and Okiek pushed into remote areas), Rise of Kiswahili as the region\'s primary lingua franca through mixing of coastal Bantu dialects with Arabic and Semitic vocabulary.'
          ]} />
        </SubSection>

        <SubSection title="2.3 Population Distribution Dynamics">
          <BulletList items={[
            'High-Density Zones: Lake Victoria Basin (western Kenya, southern Uganda, northern Tanzania), Kenyan Highlands, Ethiopian Highlands, Rwanda, Burundi, coastal port cities × due to reliable rainfall, fertile volcanic soils, urbanization, and employment opportunities.',
            'Low-Density Zones: Chalbi Desert (northern Kenya), Ogaden Plains (eastern Ethiopia), Miombo Woodlands (central Tanzania), dry scrublands of Somalia and northern South Sudan × due to low erratic rainfall, poor sandy soils, and high presence of disease vectors like tsetse flies.'
          ]} />
        </SubSection>
      </Section>

      <Section title="CHAPTER 3: NATURAL RESOURCES AND ECONOMIC ACTIVITIES">
        <SubSection title="3.1 Agricultural Systems and Crop Production">
          <BulletList items={[
            'Subsistence Farming: Small plots under two acres, simple hand tools, low chemical use, family labor, food crops (maize, beans, cassava, millet), little surplus for sale.',
            'Tea Cultivation: Requires high altitudes (1500m-2200m), cool temperatures (15°C-20°C), heavy rainfall (1500mm-2500mm), deep acidic well-drained volcanic soils. Major areas: Kericho, Kisii, Nandi (Kenya); Southern Highlands (Tanzania); Fort Portal region (Uganda). Kenya is a top global exporter of black tea.',
            'Coffee Cultivation: Arabica (cool high-altitude highlands) and Robusta (warmer lower-altitude environments). Requires moderate rainfall (1000mm-1500mm) and deep fertile soils. Major areas: Buganda region (Uganda, top Robusta producer), Mt. Kenya and Mt. Elgon slopes, Kilimanjaro and Arusha regions (Tanzania), Kaffa region (Ethiopia, birthplace of Arabica coffee).',
            'Clove Cultivation: Dried aromatic flower buds requiring hot humid tropical climate with high rainfall and deep fertile sandy loam soils. Major area: Zanzibar and Pemba islands (Tanzania), which historically produced a significant share of the global clove supply.'
          ]} />
        </SubSection>

        <SubSection title="3.2 Mining and Mineral Wealth">
          <BulletList items={[
            'Soda Ash Extraction at Lake Magadi: A white soluble compound found at Lake Magadi, a Rift Valley lake in southern Kenya. Extraction process (Dredging): A floating dredge cuts through the thick trona crust, scoops it up, crushes it into slurry, and pumps it to a lakeshore refinery where it is washed, heated in furnaces (calcined), and converted into pure soda ash powder. Industrial uses: glass manufacturing (bottles, windows, mirrors), soap and detergent production, water treatment (pH adjustment and softening), paper manufacturing.',
            'Gold and Diamond Mining in Tanzania: Gold × one of Africa\'s largest producers, major mines around Lake Victoria basin (Geita, Sukumaland, Kahama, Chunya), extracted through deep underground shafts and large open-pit mines. Diamond × extracted at Williamson Diamond Mine in Mwadui near Shinyanga, an open-pit operation on a large kimberlite pipe, mined rock is crushed and passed over grease tables where diamonds stick to the surface.',
            'Tanzanite Mining: A rare blue-violet gemstone found nowhere else on Earth except a small mining zone covering about eight square kilometres in the Mererani Hills near Arusha, Tanzania. Extracted through deep underground shafts. Due to its scarcity, tanzanite is highly valued in the global jewelry market.'
          ]} />
        </SubSection>

        <SubSection title="3.3 Forestry, Wildlife, and Tourism">
          <BulletList items={[
            'Forest Types: Natural Forests (indigenous forests with native tree species like cedar, podo, and mahogany) and Plantation Forests (man-made forests planted with fast-growing exotic trees like pine, cypress, and eucalyptus for timber). Forests protect critical water towers (Mau Complex, Mt. Kenya, Aberdares), hold soil to prevent erosion, and provide wildlife habitat.',
            'Major Wildlife Conservation Areas: Serengeti National Park (Tanzania) and Maasai Mara Game Reserve (Kenya) × form a continuous ecosystem where millions of wildebeests, zebras, and antelopes migrate annually across the Mara River. Ngorongoro Conservation Area (Tanzania) × volcanic crater enclosing over 25,000 large animals including endangered black rhino. Murchison Falls National Park (Uganda) × where the Nile River forces through a narrow canyon.',
            'Economic Value of Tourism: Top earner of foreign currency, creates direct and indirect jobs (tour guides, hotel workers, drivers, artisans), spurs local infrastructure development (roads, airstrips, communication networks), provides market for local beadwork, wood carvings, and cultural artifacts.'
          ]} />
        </SubSection>

        <SubSection title="3.4 Transport and Communication Infrastructure">
          <BulletList items={[
            'Port of Mombasa (Kenya): Largest port in East Africa, gateway for the Northern Corridor linking Kenya\'s coast to Uganda, Rwanda, Burundi, and South Sudan. Handles heavy cargo containers, petroleum products, and vehicle imports.',
            'Port of Dar es Salaam (Tanzania): Gateway for the Central Corridor, handling trade for Tanzania, Burundi, Rwanda, DRC, Zambia, and Malawi.',
            'Standard Gauge Railway (SGR): Modern railway network replacing old meter-gauge lines. In Kenya, runs from Mombasa through Nairobi to Naivasha. Tanzania\'s SGR connects Dar es Salaam to central regions like Dodoma and Mwanza, with plans to extend to Rwanda and Burundi.',
            'Trans-African Highways: All-weather tarmac highways linking regional capitals (e.g., Nairobi to Kampala and Kigali), helping cross-border trade and movement of people.'
          ]} />
        </SubSection>
      </Section>

      <Section title="CHAPTER 4: CIVICS, GOVERNANCE, AND HISTORICAL BACKGROUND">
        <SubSection title="4.1 Pre-Colonial Governance Structures">
          <BulletList items={[
            'Centralized Kingdoms × The Buganda Kingdom: Ruled by an absolute hereditary king (Kabaka), assisted by a Prime Minister (Katikiro) who ran day-to-day business, and advised by a council of elders and noble chiefs (Lukiko) that drafted laws and collected taxes. The kingdom was divided into provinces (Sazas), further split into sub-districts (Gombololas), each overseen by a chief appointed by the Kabaka.',
            'Decentralized Societies × The Kikuyu: Power distributed among council tiers, primarily the Kiama. Elders classified by age-sets (Mariika). Admission to higher councils required passing through lifelong initiation phases, culminating in the Kiama kia Mataathi (Council of Peace) and Kiama kia Kurakura (Senior Council of Elders). These senior elders held exclusive authority to adjudicate complex land disputes, perform sacrificial rituals under sacred Mugumo trees, and declare community laws.',
            'Decentralized Societies × The Nyamwezi: Located in central Tanzania, organized into multiple autonomous chiefdoms. Each chiefdom led by a Ntemi (or Mtemi), who relied on a steering council of elders known as the Wanyampala. The Wanyampala represented different ancestral clans, collected agricultural tributes, and held power to veto the Ntemi\'s declarations if they threatened peace and stability.'
          ]} />
        </SubSection>

        <SubSection title="4.2 The Scramble, Partition, and Resistance in Eastern Africa">
          <BulletList items={[
            'The Scramble for Eastern Africa: Competitive rush by European superpowers to annex African territories in the late nineteenth century, fueled by: Economic motives (Industrial Revolution demand for raw materials and new consumer markets), Strategic motives (control of River Nile headwaters and Red Sea shipping lanes), Political/National Prestige (demonstrating global military dominance).',
            'The Berlin Conference (1884-1885): Convened by German Chancellor Otto von Bismarck to partition Africa systematically and prevent inter-European wars. Established the Principle of Effective Occupation: any European power claiming territory must physically deploy administrators, hoist their flag, and establish military presence.',
            'The Heligoland Treaty of 1890: Finalized colonial partition between Britain and Germany. Germany surrendered claims to Zanzibar and the Kenyan coast in exchange for Heligoland island in the North Sea. This treaty established the formal border currently separating Kenya and Tanzania.',
            'African Resistance × The Nandi Resistance (1895-1905): Led by spiritual and military leader (Orkoiyot) Koitalel Arap Samoei against the construction of the Uganda Railway across Nandi ancestral grazing lands. Nandi warriors sabotaged rail tracks and cut telegraph wires. Resistance ended when British officer Richard Meinertzhagen treacherously assassinated Koitalel during a deceptive peace truce meeting.',
            'The Maji Maji Rebellion (1905-1907): Massive multi-ethnic uprising against oppressive German colonial rule in southern Tanganyika, triggered by forced cotton cultivation, harsh physical floggings, and exorbitant tax rates. Organized by spiritual prophet Kinjikitile Ngwale, fighters were unified by sacred water medicine (maji) believed to turn German bullets into water vapor. German military responded with brutal scorched-earth policy causing catastrophic famine claiming over 100,000 African lives.',
            'Collaboration of Nabongo Mumia of Wanga: The ruler of the Wanga Kingdom in western Kenya chose peaceful cooperation with British administrators, using British military alliances to protect his state against regional rivals. His capital Elureko (Mumias) became the primary base for British colonial expansion across western Kenya and Uganda.'
          ]} />
        </SubSection>

        <SubSection title="4.3 Civics, Governance, and the System of Government">
          <BulletList items={[
            'Concept of Citizenship: A citizen is an individual legally recognized by the state as a member of a country, enjoying constitutional rights, privileges, and protections. Citizenship by Birth: automatically acquired if either parent is a Kenyan citizen at the time of the individual\'s birth. Citizenship by Registration: a foreign national can apply after living continuously in Kenya for at least seven years, demonstrating proficiency in Kiswahili or English, possessing a clean criminal record, and contributing positively to the national economy.',
            'Fundamental Rights and Freedoms: Enshrined in Chapter Four of the Kenyan Constitution (The Bill of Rights), including the right to life, human dignity, freedom of expression, freedom of worship, the right to own private property, and the right to a fair legal trial.',
            'Civic Responsibilities: Obeying all state laws, paying required taxes to fund public services, voting in general elections, exposing corruption, and protecting the natural environment.',
            'The Three Arms of Government: The Legislature (Parliament × National Assembly and Senate × drafts, debates, and passes national laws, approves budgets, vets appointments). The Executive (President, Deputy President, Cabinet, Civil Service × enforces laws, administers public services, implements development projects). The Judiciary (Supreme Court, Court of Appeal, High Court, Magistrates\' Courts led by the Chief Justice × interprets laws, resolves civil and criminal disputes, administers justice).',
            'Checks and Balances: Constitutional mechanism ensuring no single arm becomes too powerful. The Judiciary can declare a law unconstitutional, the President can veto a bill, and Parliament can impeach a President or judges who violate the constitution.'
          ]} />
        </SubSection>

        <SubSection title="4.4 Regional Integration and Economic Blocs">
          <BulletList items={[
            'The East African Community (EAC): Originally formed in 1967, collapsed in 1977, officially revived on January 15, 2000. Headquartered in Arusha, Tanzania. Founding members: Kenya, Tanzania, Uganda. Expanded to include Rwanda, Burundi, South Sudan, DRC, and Somalia.',
            'Pillars of EAC Integration: Customs Union (common external tariff, removal of internal trade duties between member states). Common Market (free movement of goods, labor, services, capital, and citizens across borders without visas). Monetary Union (merging financial systems, introducing a single unified regional currency). Political Federation (final phase aiming to merge member states into a single sovereign federal state with unified president, foreign policy, and military command).',
            'Benefits: Expanded market size (over 300 million consumers for local manufacturers). Infrastructural development (jointly funded trans-border highways, oil pipelines, cross-border electricity grids). Free movement of labor (teachers, doctors, engineers can work anywhere within the bloc without restrictive permits).',
            'Challenges: Inter-state political rivalries causing border closures and trade bans. Non-Tariff Barriers/NTBs (delays at border checkpoints, excessive customs documentation, arbitrary police roadblocks slowing cargo movement). Similar economic activities (most nations produce similar agricultural cash crops like tea, coffee, and flowers, limiting internal trade).'
          ]} />
        </SubSection>
      </Section>

      <Section title="PRACTICE EVALUATION QUESTIONS">
        <SubSection title="Questions">
          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
            <p><strong>Question 1 (Physical Geography):</strong> Analyze how the geological process of downwarping differs from faulting, and name one prominent lake formed by each process in Eastern Africa.</p>
            <p><strong>Question 2 (Meteorology/Climatology):</strong> A meteorological team notes that a town at the base of Mt. Kilimanjaro (800m above sea level) has a temperature of 28°C. Calculate the estimated temperature at a high-altitude camp located at 3,800m above sea level on the same mountain, explaining the scientific rule used.</p>
            <p><strong>Question 3 (History/Migration):</strong> Discuss how the introduction of iron-smelting technology influenced the migration and settlement patterns of the Bantu during the pre-colonial period.</p>
            <p><strong>Question 4 (Economic Resources):</strong> Explain how a landlocked country like Uganda relies on regional transport infrastructure to participate in international trade, identifying the specific maritime gateways used.</p>
            <p><strong>Question 5 (Civics/History):</strong> Compare and contrast the political structure of the pre-colonial Buganda Kingdom with the traditional administrative system of the decentralized Kikuyu society.</p>
          </div>
        </SubSection>
        <SubSection title="Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> Downwarping is a gradual geological process where tectonic forces cause an extensive, shallow dip or sag in the Earth's crust over a broad area. The center of this depressed basin sinks slowly, and over millennia, it collects rainwater and river drainage to form a wide, shallow lake with irregular shorelines. The prominent downwarped lake in Eastern Africa is Lake Victoria. In contrast, faulting is a rapid, violent process where crustal rocks fracture under immense tension or compression forces. This fractures the crust into parallel fault lines, causing the central block of land to slide downward between the steep escarpments, forming the floor of the Rift Valley. Water collects in these deep, narrow trenches to form long, deep, steep-sided lakes. The prominent rift valley lake is Lake Tanganyika (or Lake Turkana).</p>
            <p><strong>Answer 2:</strong> Scientific Rule (Lapse Rate): In the troposphere, temperature drops at a steady rate of approximately 1°C for every 150 meters rise in altitude. Step 1: Altitude Difference = 3,800m - 800m = 3,000m. Step 2: Temperature Drop = 3,000m × 150m = 20°C. Step 3: Final Temperature = 28°C - 20°C = 8°C. The estimated temperature at the high-altitude camp is 8°C.</p>
            <p><strong>Answer 3:</strong> Iron-smelting technology transformed Bantu migration patterns in two key ways: Agricultural Expansion × The ability to smelt iron allowed the Bantu to forge strong iron hoes and axes, which were far more effective at clearing dense equatorial forests and tilling hard soils than previous stone or wooden implements. This increased food production, causing population growth that pushed them to migrate in search of more farmland. Military Dominance × Iron weapons (spears, arrows, and machetes) gave the Bantu a significant military advantage over groups who still used stone or wooden weapons. This allowed the Bantu to conquer and settle securely in fertile areas like the Lake Victoria basin and the highlands of Eastern Africa.</p>
            <p><strong>Answer 4:</strong> As a landlocked country, Uganda has no direct access to the ocean. To participate in international trade, it relies on the Northern Corridor and the Central Corridor transport networks. Uganda imports and exports heavy freight by transporting goods across international borders via highways and railways that connect to maritime ports in neighboring countries. Its primary gateway is the Port of Mombasa in Kenya, accessed via the Standard Gauge Railway (SGR) and the Trans-African Highway. To a lesser extent, it uses the Port of Dar es Salaam in Tanzania, accessed via lake ferries across Lake Victoria or rail links. Without regional cooperation and shared infrastructure, landlocked countries would face trade isolation and extremely high transportation costs.</p>
            <p><strong>Answer 5:</strong> Similarities: Both administrative systems maintained social order, successfully resolved internal communal disputes, regulated land ownership, and passed down cultural values and traditions through successive generations without relying on written laws. Differences: The Buganda Kingdom was a highly centralized state ruled by an absolute, hereditary king (Kabaka) who held supreme legislative, executive, and military power. He appointed regional chiefs (Bataka) to administer land on his behalf and maintained a standing army. In contrast, Kikuyu society was a decentralized community that lacked a single central leader, king, or chief. Political power was distributed horizontally among senior elders organized into hereditary councils (Kiama). Governance and legal decisions were made through consensus rather than executive orders, and security relied on temporary warrior age-groups (Anake) rather than a permanent standing army.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- CRE ----------
function CRENotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? CRE: Christian Religious Education</h2>

      <Section title="UNIT 1: CREATION AND THE HEAVENLY BODIES">
        <SubSection title="The Biblical Accounts of Creation">
          <p>Genesis chapters 1 and 2 present God as the sole author of life and the universe. In Genesis 1, creation occurs in an orderly, six-day sequence through God's spoken word ("Let there be..."): Day 1: Light and darkness. Day 2: Sky (the expanse separating waters). Day 3: Dry land, seas, and vegetation. Day 4: Sun, moon, and stars (the heavenly bodies). Day 5: Marine creatures and birds. Day 6: Land animals and human beings (Adam and Eve). Day 7: God rested, blessing and sanctifying the Sabbath.</p>
        </SubSection>
        <SubSection title="Human Unique Positioning">
          <p>Genesis 1:26°27 outlines that human beings were created in the image and likeness of God (Imago Dei). This spiritual endowment gives humans the capacity for reasoning, moral judgment, love, fellowship, and a conscience, which sets them apart from the rest of creation.</p>
        </SubSection>
        <SubSection title="Christian Stewardship and Responsibility">
          <p>God placed the first human beings in the Garden of Eden and gave them two specific mandates: cultivation (working the land to produce food) and preservation (guarding and protecting the ecosystem). This establishes that humans are stewards, not owners, of the Earth.</p>
        </SubSection>
        <SubSection title="The Heavenly Bodies as Signs">
          <p>God created the sun, moon, and stars on the fourth day to serve specific purposes: to separate day from night, to provide light upon the earth, and to serve as signs for marking seasons, days, and years. In Christian practice, observing these celestial rhythms helps communities plan their agricultural calendars, celebrate holy days, and appreciate God's order.</p>
        </SubSection>
        <SubSection title="Misuse of Heavenly Bodies">
          <p>The Bible explicitly condemns the worship or divining of the sun, moon, and stars (astrology, horoscopes, and occultism). In Deuteronomy 4:19, believers are warned against looking up to the sky, seeing the heavenly bodies, and being led astray to bow down and worship things that the Lord has allotted to all nations under heaven. Christians are called to worship the Creator, not the creation.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 2: THE JOURNEY OF FAITH × OLD TESTAMENT PATRIARCHS">
        <SubSection title="The Concept of a Patriarch">
          <p>A patriarch is a male head of a family, tribe, or religious lineage. In the Old Testament, the primary patriarchs are Abraham, Isaac, Jacob, and Joseph. Their lives demonstrate how God initiates a relationship with humanity through personal callings, covenants, and promises.</p>
        </SubSection>
        <SubSection title="The Call of Abraham (Genesis 12)">
          <p>Abraham (initially Abram) lived in Haran when God commanded him to leave his native country, his kinsmen, and his father's house to travel to an unknown land that God would show him. Abraham demonstrated extraordinary faith by obeying immediately, packing his belongings, and journeying with his wife Sarah and nephew Lot toward Canaan.</p>
          <BulletList items={[
            'God\'s Covenant Promises to Abraham: (1) Great Nation × numerous descendants, birth of the Israelites, father of many nations. (2) Chosen Land × the land of Canaan given as an everlasting inheritance. (3) Global Blessing × all nations on Earth will be blessed through his lineage (Jesus Christ).'
          ]} />
        </SubSection>
        <SubSection title="The Test of Abraham's Faith (Genesis 22)">
          <p>The ultimate test of Abraham's obedience occurred when God commanded him to take his only son, Isaac × whom he loved deeply and who was the key to God's promises × and offer him as a burnt sacrifice on Mount Moriah. Abraham did not argue or hesitate. He built the altar, bound Isaac, and raised the knife. At that exact moment, the Angel of the Lord stopped him, declaring: "Now I know that you fear God." God provided a ram caught in a nearby thicket for the sacrifice. As a result, Mount Moriah was named Jehovah Jireh, which means "The Lord Will Provide."</p>
        </SubSection>
        <SubSection title="Moses and the Exodus Call">
          <p>Centuries after Joseph brought the Israelites to Egypt to escape famine, a new Pharaoh arose who enslaved the Hebrew population. God heard their cries and called Moses out of a burning bush on Mount Horeb (the mountain of God). God commanded Moses to remove his sandals, as the ground he stood upon was made holy by the divine presence. Moses was commanded to return to Egypt, confront Pharaoh, and demand the release of the Israelites. Despite his initial self-doubt and stammering speech, God promised him divine companionship and appointed his brother Aaron to be his spokesman.</p>
        </SubSection>
        <SubSection title="The Passover and the Ten Plagues">
          <p>When Pharaoh hardened his heart and refused to release the Israelites, God unleashed ten plagues upon Egypt to demonstrate His supremacy over Egyptian gods. The final plague was the death of every firstborn male across Egypt. To protect the Israelites, God instituted the Passover (Pesach): slaughter a year-old male lamb without any physical blemish, smear the lamb's blood onto the doorposts and lintels of the house, roast the meat over open fire (do not boil or eat it raw), consume it with unleavened bread (without yeast) and bitter herbs, and eat in a state of readiness: cloak tucked in, sandals on, staff in hand. When the Lord passed through Egypt to strike down the firstborn, He bypassed (passed over) every home marked with the lamb's blood, saving the families inside. This event marked the liberation of Israel from Egyptian slavery.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 3: LEADERSHIP AND NATIONHOOD × THE KINGS AND PROPHETS">
        <SubSection title="The Transition to Monarchy">
          <p>Originally, Israel was governed directly by God through charismatic leaders known as Judges (e.g., Gideon, Deborah, Samson). As the prophet Samuel aged, the elders of Israel demanded a human king so they could be like neighboring nations. Although this request rejected God's direct rule, God directed Samuel to anoint Saul as the first king of Israel. Saul started well but was later rejected by God for disobedience and pride.</p>
        </SubSection>
        <SubSection title="David: The Exemplary King">
          <p>David, a humble shepherd boy and the youngest son of Jesse, was anointed by Samuel to succeed Saul. David's leadership is defined by several key accomplishments: A Man After God's Heart × relied entirely on God, demonstrated when he defeated Goliath using a sling and a single stone. Political Achievements × captured Jerusalem from the Jebusites, established it as the national capital, and successfully united the twelve fractured tribes of Israel. Religious Devotion × brought the Ark of the Covenant to Jerusalem. Repentance × when David sinned with Bathsheba and arranged Uriah's murder, he confessed completely when confronted by Nathan, receiving God's forgiveness (Psalm 51).</p>
        </SubSection>
        <SubSection title="Solomon's Wisdom and Downfall">
          <p>Solomon succeeded his father David. When God appeared to him in a dream at Gibeon and offered him anything he wished, Solomon asked for an understanding heart (wisdom) to govern the people justly. God granted him unmatched wisdom, along with wealth and honor. Solomon constructed the First Temple in Jerusalem. However, later in life, he disobeyed God's commands by marrying hundreds of foreign wives from pagan nations. These wives turned his heart after foreign gods, leading him to build pagan altars in Israel, which caused the kingdom to split after his death.</p>
        </SubSection>
        <SubSection title="Prophets as Defenders of Monotheism">
          <p>Prophets were spokespersons called by God to deliver messages, correct errant kings, defend the poor, and condemn idolatry. Elijah on Mount Carmel (1 Kings 18): King Ahab and Queen Jezebel brought Baal worship to Israel. Elijah challenged 450 prophets of Baal to a spiritual duel on Mount Carmel to prove who was the true God. Two altars were built, and it was agreed that the God who answered by fire would be recognized as the true God. The prophets of Baal prayed, danced, and cut themselves all day, but nothing happened. Elijah repaired the altar of the Lord, dug a trench around it, and poured twelve jars of water over the wood and sacrifice until everything was soaked. He then prayed a simple, faithful prayer. Instantly, the fire of the Lord fell, consuming the sacrifice, the wood, the stones, the soil, and licking up the water in the trench. The people fell prostrate and cried: "The Lord, He is God!"</p>
        </SubSection>
      </Section>

      <Section title="UNIT 4: THE INCARNATION, MINISTRY, AND PASSION OF JESUS CHRIST">
        <SubSection title="The Annunciation and Birth">
          <p>The New Testament shifts from preparation to fulfillment with the birth of Jesus Christ. The angel Gabriel appeared to Mary, a virgin betrothed to Joseph of the lineage of David, announcing that she would conceive by the Holy Spirit and give birth to the Son of God, whose name would be Emmanuel ("God with us"). Jesus was born in a humble manger in Bethlehem of Judea, fulfilling the Old Testament prophecy of Micah 5:2.</p>
        </SubSection>
        <SubSection title="The Baptism and Temptation of Jesus">
          <p>Baptism: Jesus began His public ministry at age thirty by being baptized by John the Baptist in the River Jordan. As He emerged from the water, the Holy Spirit descended on Him like a dove, and a voice from heaven declared: "This is my beloved Son, with whom I am well pleased." This event manifested the Holy Trinity: the Father speaking, the Son being baptized, and the Holy Spirit descending.</p>
          <p>Temptation: Following His baptism, Jesus was led by the Spirit into the wilderness, where He fasted for forty days and forty nights. Satan tempted Him on three fronts: (1) Physical Appetite × command stones to become bread. Jesus: "Man shall not live by bread alone." (2) Pride and Presumption × throw Himself from the Temple pinnacle. Jesus: "You shall not tempt the Lord your God." (3) Power and Idolatry × bow down to receive all kingdoms. Jesus: "You shall worship the Lord your God and him only shall you serve." Jesus defeated every temptation by quoting Scripture.</p>
        </SubSection>
        <SubSection title="The Teachings and Miracles of Jesus">
          <p>Jesus taught about the Kingdom of God using parables × earthly stories with heavenly meanings. Examples include the Parable of the Sower (representing how different hearts receive the Word of God) and the Parable of the Prodigal Son (illustrating God's unconditional love and forgiveness toward repentant sinners). His miracles demonstrated His authority over nature (calming the storm), sickness (healing the leper), spiritual forces (casting out demons), and death (raising Lazarus).</p>
        </SubSection>
        <SubSection title="The Passion, Death, and Resurrection">
          <p>The Last Supper: On the night He was betrayed, Jesus shared the Passover meal with His disciples, establishing Holy Communion (Eucharist). He broke bread (representing His broken body) and shared wine (representing His blood poured out for the forgiveness of sins). The Crucifixion: Arrested in the Garden of Gethsemane, Jesus faced illegal trials before the Sanhedrin, King Herod, and Pontius Pilate. He was crucified at Golgotha (Calvary) to bear the sins of humanity. The Resurrection: On the third day, Jesus rose from the dead, defeating sin and death. This event serves as the foundation of Christian hope, ensuring eternal life for all believers.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 5: THE CHURCH × FELLOWSHIP AND THE EARLY BELIEVERS">
        <SubSection title="The Day of Pentecost (Acts 2)">
          <p>Before His ascension, Jesus instructed His disciples to wait in Jerusalem until they were clothed with power from on high. On the Day of Pentecost, while 120 disciples were gathered in one accord, the Holy Spirit descended upon them. The Signs: a sound like a rushing mighty wind that filled the house, and divided tongues of fire resting on each disciple. The Effect: the disciples were filled with the Holy Spirit and began speaking in other languages, enabling foreign visitors in Jerusalem to hear the wonders of God in their own native tongues. The Apostle Peter delivered a powerful sermon, leading to the repentance and baptism of about three thousand people that day, marking the birth of the Christian Church.</p>
        </SubSection>
        <SubSection title="Characteristics of the Early Church Community">
          <p>Acts 2:42°47 outlines the foundational pillars of the early Christian fellowship: Apostles' Doctrine (committing to studying the Word of God daily), Breaking of Bread (sharing meals and celebrating Holy Communion), Shared Possessions (selling property to distribute wealth to the poor), Corporate Prayer (meeting daily in the Temple courts to pray), and Unity and Joy (living with glad and sincere hearts, praising God).</p>
        </SubSection>
        <SubSection title="Saul's Conversion to Paul (Acts 9)">
          <p>Saul of Tarsus was a zealous Pharisee who systematically persecuted the early Church, arresting Christians and approving the stoning of Stephen, the first Christian martyr. While traveling to Damascus to arrest more believers, a blinding light from heaven flashed around him, throwing him to the ground. He heard a voice saying: "Saul, Saul, why do you persecute me?" Saul asked who was speaking, and the voice replied: "I am Jesus, whom you are persecuting." Saul was blinded for three days. In Damascus, God sent a disciple named Ananias to pray for him. Saul's sight was restored, he was baptized, and he became the Apostle Paul, the primary missionary who spread the gospel to the Gentile world.</p>
        </SubSection>
        <SubSection title="The Fruits and Gifts of the Holy Spirit">
          <p>Gifts of the Holy Spirit (1 Corinthians 12): Specific abilities distributed by the Holy Spirit for the edification of the Church, including wisdom, knowledge, faith, healing, miracles, prophecy, discernment of spirits, speaking in tongues, and interpretation of tongues. Fruits of the Holy Spirit (Galatians 5:22°23): Continuous attributes of Christ-like character produced by the Holy Spirit living within a believer: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 6: CHRISTIAN VALUES AND MORAL LIVING">
        <SubSection title="The Concept of Values">
          <p>Values are core principles, beliefs, and standards that guide human behavior, choices, and lifestyle. Christian values are rooted directly in the character of God and the teachings of Jesus Christ, as revealed in the Scriptures.</p>
        </SubSection>
        <SubSection title="Core Christian Values">
          <BulletList items={[
            'Integrity and Honesty: Christians are called to be truthful in their speech, academic work, and dealings with others. Jesus taught that our "Yes" should mean yes and our "No" should mean no (Matthew 5:37). Illustrated by the story of Ananias and Sapphira (Acts 5), who faced severe judgment for lying to the Holy Spirit.',
            'Love and Compassion: The foundational command of Christ is to love God with all one\'s heart, soul, mind, and strength, and to love one\'s neighbor as oneself. This includes showing compassion to the marginalized, poor, and vulnerable, as demonstrated in the Parable of the Good Samaritan.',
            'Respect for Authority and Citizens\' Duties: Romans 13:1°7 instructs Christians to be subject to governing authorities, obey state laws, pay required taxes, and honor leaders. Jesus balanced this principle by stating: "Render to Caesar the things that are Caesar\'s, and to God the things that are God\'s" (Mark 12:17).',
            'The Christian Work Ethic: Work is a divine institution established before the fall of man. The Apostle Paul condemned idleness: "If anyone is not willing to work, let him not eat" (2 Thessalonians 3:10). Colossians 3:23 provides the ultimate standard: "Whatever you do, work heartily, as for the Lord and not for men."',
            'Environmental and Wildlife Conservation: As stewards of God\'s creation, Christians have a moral obligation to protect the environment. Deforestation, pollution, and poaching violate the stewardship mandate of Genesis 2:15. Protecting natural resources preserves God\'s handiwork for future generations.'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 7: MAJOR AND MINOR PROPHETS × JUSTICE AND RIGHTEOUSNESS">
        <SubSection title="The Categorization of Prophets">
          <p>In the Old Testament, prophetic books are divided into two primary categories based on the length of their written records: Major Prophets (Isaiah, Jeremiah × who also wrote Lamentations, Ezekiel, and Daniel) and Minor Prophets (twelve shorter books including Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, and Malachi).</p>
        </SubSection>
        <SubSection title="Amos: The Prophet of Social Justice">
          <p>Amos was a shepherd and a dresser of sycamore fig trees from Tekoa in Judah, but God called him to prophesy to the Northern Kingdom of Israel. During his ministry, Israel was experiencing immense economic prosperity, but this wealth led to severe moral decay, corruption, and oppression of the poor. Amos boldly condemned the wealthy elites who lived in luxurious houses decorated with ivory while neglecting the destitute. He declared that God despised their religious festivals because their hearts were wicked. In Amos 5:24, he delivered the central message: "But let justice roll down like waters, and righteousness like an ever-flowing stream."</p>
        </SubSection>
        <SubSection title="Jeremiah: The Prophet of Resilience">
          <p>Jeremiah was called by God at a very young age during the reign of King Josiah. When Jeremiah objected, saying, "Ah, Lord God! Behold, I do not know how to speak, for I am only a youth," the Lord touched his mouth and said, "Behold, I have put my words in your mouth." Known as the "Weeping Prophet," Jeremiah faced severe persecution because he accurately predicted that Babylon would conquer Jerusalem due to Israel's idolatry. He was mocked by his neighbors, beaten by Pashhur the priest, branded a traitor, and thrown into a deep, muddy cistern belonging to Malchiah, where he sank into the mire and was left to starve. A Cushite court official named Ebed-Melech showed great compassion by securing the king's permission to rescue Jeremiah using ropes and rags. Despite these trials, Jeremiah remained resilient and faithful to his calling, teaching Christians to stand firmly for God's truth even when facing intense opposition.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 8: THE PARABLES OF JESUS × HIDDEN KINGDOM TRUTHS">
        <SubSection title="Why Jesus Taught in Parables">
          <p>Parables were Jesus' primary method of public teaching. When His disciples asked why He spoke to the crowds in parables, Jesus explained that it was to reveal the mysteries of the Kingdom of Heaven to those with open hearts, while concealing them from those who were spiritually blind and hard-hearted (Matthew 13:10°17). Parables used familiar, everyday elements × such as farming, fishing, baking, and family life × to illustrate profound, eternal spiritual realities.</p>
        </SubSection>
        <SubSection title="The Parable of the Sower (Matthew 13:1°23)">
          <p>This foundational parable explains how different human hearts receive and respond to the preaching of the Word of God: The Wayside (Path) × hard ground where birds ate the seed immediately, representing a hard heart where Satan snatches away the Word. The Stony Ground × shallow soil where seeds sprouted fast but withered, representing a superficial heart that abandons faith during persecution. The Thorny Ground × soil where weeds choked the growing plants, representing a distracted heart where worries and wealth choke the Word. The Good Soil × fertile ground where seeds produced a massive harvest, representing a receptive heart that hears, understands, and obeys God.</p>
        </SubSection>
        <SubSection title="The Parable of the Prodigal Son (Luke 15:11°32)">
          <p>This famous narrative illustrates the depth of human sin, the reality of repentance, and God's unconditional love and forgiveness. The Rebellion: The younger son demanded his share of the family inheritance early, left home for a distant country, and squandered his wealth on wild, sinful living. The Repentance: When a severe famine struck, he found himself destitute and working in a pigsty, longing to eat the pods given to the swine. Coming to his senses, he decided to return home, confess his sins, and ask to be treated as a servant. The Restoration: While the son was still a long way off, his father saw him and was filled with deep compassion. The father ran to his son, threw his arms around him, and kissed him. Instead of punishing or demoting him, the father ordered the best robe, a ring, sandals, and the fattened calf for a celebratory feast, declaring: "For this my son was dead, and is alive again; he was lost, and is found."</p>
        </SubSection>
      </Section>

      <Section title="UNIT 9: THE CHOSEN DISCIPLES AND THE GREAT COMMISSION">
        <SubSection title="The Selection of the Twelve Apostles">
          <p>Jesus did not isolate Himself during His earthly ministry; instead, He chose a core group of twelve men to be His close companions, learn His teachings, witness His miracles, and eventually carry on His mission after His ascension. He selected ordinary, working-class men rather than wealthy religious elites.</p>
          <BulletList items={[
            'Simon Peter: A passionate, outspoken fisherman from Bethsaida. Although he famously denied Jesus three times during Christ\'s trial out of fear, he repented deeply and was later restored by Jesus. He became the chief leader of the early Church in Jerusalem.',
            'John and James (The Sons of Zebedee): Partners in the fishing trade, Jesus nicknamed them Boanerges, which means "Sons of Thunder," because of their fiery, impulsive tempers. John became known as "the disciple whom Jesus loved" and wrote the Gospel of John, three epistles, and Revelation.',
            'Matthew (Levi): A tax collector working for the Roman government in Capernaum. Tax collectors were despised by the Jewish community, who viewed them as traitors and thieves. When Jesus walked past his tax booth and said, "Follow me," Matthew immediately left his lucrative business to follow Christ.'
          ]} />
        </SubSection>
        <SubSection title="The Great Commission (Matthew 28:16°20)">
          <p>Following His resurrection, Jesus met His disciples on a mountain in Galilee to deliver His final mandate before ascending into heaven. The Great Commission forms the core mission of the global Christian Church: Go and make disciples of all nations, crossing cultural borders. Baptize new believers in the name of the Father, Son, and Holy Spirit. Teach them to observe and obey everything Jesus commanded. Take comfort in His promise: "I am with you always, to the end of the age."</p>
        </SubSection>
      </Section>

      <Section title="UNIT 10: ESCHATOLOGY × THE CHRISTIAN HOPE AND THE RETURN OF CHRIST">
        <SubSection title="The Meaning of Eschatology">
          <p>Eschatology is the study of the end times, final events, and the ultimate destiny of humanity and creation. It focuses on the promise of the Second Coming of Jesus Christ (Parousia), the final judgment, the resurrection of the dead, and the creation of a new heaven and a new earth.</p>
        </SubSection>
        <SubSection title="Signs of the End Times (Matthew 24)">
          <p>Sitting on the Mount of Olives, the disciples asked Jesus what signs would signal His return. Jesus warned them not to be deceived by false teachers and detailed several signs: False Christs × many claiming to be the Messiah, leading many astray. Cosmic Crisis × wars, rumors of wars, famines, pestilences, and earthquakes in various places. Global Witness × the gospel of the Kingdom will be preached globally to all nations. Jesus emphasized that no human, angel, or even the Son knows the exact day or hour of His return × only the Father knows. Therefore, Christians are called to live in constant spiritual readiness.</p>
        </SubSection>
        <SubSection title="The Metaphor of the Ten Virgins (Matthew 25:1°13)">
          <p>This parable illustrates the vital importance of continuous spiritual preparation. Ten virgins took their lamps to meet the bridegroom. The Foolish Virgins brought no extra oil; when the bridegroom was delayed, their lamps went out. The Wise Virgins brought extra jars of oil, keeping their lamps burning. At midnight, a shout rang out: "Behold, the bridegroom comes!" The foolish virgins, running out of oil, begged the wise to share, but there wasn't enough for everyone. While they were away buying oil, the bridegroom arrived, the wise entered the feast, and the door was shut. When the foolish returned and cried, "Lord, Lord, open to us!" the bridegroom replied, "I do not know you." The Lamp represents outward profession of faith; The Oil represents the inner presence of the Holy Spirit; The Bridegroom represents Jesus Christ returning for His Church; The Shut Door represents the finality of judgment.</p>
        </SubSection>
        <SubSection title="The New Heaven and the New Earth (Revelation 21)">
          <p>The ultimate hope for Christians is not a broken world, but complete restoration. In the Book of Revelation, the Apostle John describes a vision of a new heaven and a new earth, where the holy city, New Jerusalem, descends from God. In this eternal home, God will dwell directly with His people, and there will be no more death, sorrow, crying, or pain, as the old order of things will have passed away.</p>
        </SubSection>
      </Section>

      <Section title="PRACTICE EVALUATION QUESTIONS">
        <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
          <p><strong>Question 1:</strong> Explain how human creation in Genesis 2 differs from the creation of other living things, and discuss the dual responsibility given to humans in the Garden of Eden.</p>
          <p><strong>Question 2:</strong> Describe how Abraham demonstrated faith during the sacrifice of his son Isaac on Mount Moriah, and explain the significance of the name Jehovah Jireh.</p>
          <p><strong>Question 3:</strong> Analyze the spiritual conflict on Mount Carmel between Prophet Elijah and the prophets of Baal, outlining how the true God was vindicated.</p>
          <p><strong>Question 4:</strong> Discuss the three temptations Jesus faced in the wilderness after His baptism, and explain how He used Scripture to overcome each temptation.</p>
          <p><strong>Question 5:</strong> Identify four characteristics of the early Church fellowship in Acts 2, and explain how a Grade 6 student can apply these values to serve their school or local community today.</p>
        </div>
        <SubSection title="Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> In Genesis 2, God did not simply speak humans into existence. Instead, God formed man out of the dust of the ground and personally breathed into his nostrils the breath of life, making him a living soul. This personal, intimate act of creation signifies that humans have a unique spiritual connection with God, created in His image and likeness. The dual responsibility given in Genesis 2:15 consists of cultivation (tilling the ground, managing resources, working creatively) and preservation (guarding, protecting, and conserving the natural ecosystem from destruction or depletion). Together, these establish the concept of Christian stewardship over creation.</p>
            <p><strong>Answer 2:</strong> Abraham demonstrated profound faith by obeying God's command to offer his son Isaac as a burnt sacrifice without hesitation, questioning, or complaint. He traveled to Mount Moriah, built the altar, arranged the wood, bound Isaac, and drew the knife, fully trusting that God was righteous and able to raise Isaac from the dead if necessary (Hebrews 11:19). The name Jehovah Jireh means "The Lord Will Provide." Its significance comes from the moment the Angel of the Lord stopped Abraham and pointed out a ram caught by its horns in a nearby thicket. Abraham offered the ram instead of his son. The name reminds Christians that when they obey God faithfully, He will provide for their needs in His timing and way.</p>
            <p><strong>Answer 3:</strong> The spiritual conflict on Mount Carmel was a confrontation between monotheism (worship of Yahweh) and polytheism/idolatry (worship of Baal, promoted by Queen Jezebel). Elijah challenged 450 prophets of Baal to a test where each built an altar, and the god who answered by sending fire would be recognized as the true God. After the prophets of Baal spent hours cutting themselves and screaming to their silent god, Elijah repaired the altar of the Lord with twelve stones, placed the sacrifice, and had it drenched with twelve jars of water. Elijah prayed a simple, faithful prayer. Instantly, the fire of the Lord fell from heaven and consumed the wet sacrifice, the wood, the stones, the soil, and licked up all the water in the trench, proving that Yahweh is the only living God.</p>
            <p><strong>Answer 4:</strong> The three temptations: (1) Physical Appetite × Satan tempted Jesus to turn stones into bread. Jesus overcame this by quoting Deuteronomy 8:3: "Man shall not live by bread alone, but by every word that comes from the mouth of God." (2) Pride and Presumption × Satan challenged Jesus to throw Himself from the Temple. Jesus rejected this by quoting Deuteronomy 6:16: "You shall not put the Lord your God to the test." (3) Power and Idolatry × Satan offered Jesus all the kingdoms if He would bow down. Jesus rejected this by quoting Deuteronomy 6:13: "You shall worship the Lord your God and him only shall you serve." Jesus defeated every temptation by quoting Scripture.</p>
            <p><strong>Answer 5:</strong> Four characteristics of the early Church in Acts 2: Devotion to the Apostles' Doctrine (continuously studying and applying God's Word), Breaking of Bread (celebrating Holy Communion and sharing regular meals together), Corporate Prayer (gathering regularly to pray for one another), and Sharing Possessions (voluntarily pooling resources to care for the needy). A Grade 6 student can apply these values by: studying and sharing biblical truths with friends during Christian Union; showing compassion by sharing snacks, stationery, or clothes with needy peers; participating in corporate prayers for school performance, sick family members, or national peace; and promoting unity by avoiding bullying, resolving conflicts amicably, and treating classmates with Christ-like kindness and respect.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- IRE ----------
function IRENotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? IRE: Islamic Religious Education</h2>

      <Section title="UNIT 1: SURAH AL-INSHIRAH AND SURAH AL-QADR">
        <SubSection title="Surah Al-Inshirah (Solace and Comfort)">
          <p>This Makkan Surah (Chapter 94) was revealed to comfort Prophet Muhammad (PBUH) during a time of intense hardship and persecution by the Quraysh. God reminds the Prophet of three divine favors: the expansion/opening of his heart (Sharh) to receive divine knowledge, the removal of his heavy spiritual burden that weighed on his back, and the raising of his name and reputation across the world.</p>
          <p>The Principle of Relief: In verses 5 and 6, Allah repeats a fundamental law of life: "Fa inna ma'al 'usri yusra, Inna ma'al 'usri yusra" (Verily, along with every hardship is relief). The repetition emphasizes certainty. For Muslims, this teaches that difficulties are temporary trials, and patience (Sabr) always opens the door to ease.</p>
        </SubSection>
        <SubSection title="Surah Al-Qadr (The Night of Decree)">
          <p>This Surah (Chapter 97) celebrates Laylatul Qadr, the night the Holy Quran was first sent down from the Preserved Tablet (Al-Lawh Al-Mahfuz) to the lowest heaven during the month of Ramadan. Allah describes this night as being "better than a thousand months" (approx. 83 years and 4 months) of worship without it. On this night, the Archangel Jibril (Al-Ruh) and hosts of angels descend to earth with divine decrees for the upcoming year. The night is filled with profound spiritual peace (Salam) that guards believers against evil until the break of dawn (Fajr).</p>
        </SubSection>
      </Section>

      <Section title="UNIT 2: PILLARS OF IMAN × ALLAH'S BOOKS AND THE ANGELS">
        <SubSection title="Belief in the Kutub (Divine Books)">
          <p>The third Pillar of Iman requires a Muslim to believe in all the original scriptures revealed by Allah to His messengers. These books served as divine guidance for specific nations at different points in human history.</p>
          <BulletList items={[
            'Tawrat (Torah): Given to Prophet Musa (Moses) for the Children of Israel (Bani Israel).',
            'Zabur (Psalms): Given to Prophet Dawud (David), containing praises, hymns, and wise counsels.',
            'Injeel (Gospel): Given to Prophet Isa (Jesus), a message of guidance and mercy for his people.',
            'Suhuf (Scrolls): Revealed to Prophet Ibrahim (Abraham).',
            'The Holy Quran: The final, complete, and unalterable revelation sent to Prophet Muhammad (PBUH) for all of humanity. Unlike earlier books that were altered or lost over time, Allah has guaranteed the physical preservation of the Quran until the Day of Judgment (Surah Al-Hijr 15:9).'
          ]} />
        </SubSection>
        <SubSection title="Belief in the Malaikah (Angels)">
          <p>Angels are creations made from pure light (Nur). They do not possess free will, do not require food, drink, or sleep, and are completely free from gender. They exist solely to obey Allah's commands perfectly without hesitation.</p>
          <BulletList items={[
            'Jibril: The Archangel responsible for delivering divine revelation (Wahy) to all prophets.',
            'Mikail: Assigned to manage rain, sustenance, and the growth of plants across the earth.',
            'Israfil: Responsible for blowing the trumpet (Sur) to mark the end of the world and the resurrection.',
            'Malik: The stern guardian and gatekeeper of Hellfire (Jahannam).',
            'Ridwan: The welcoming guardian and gatekeeper of Paradise (Jannah).',
            'Kiraman Katibin: The two recording angels assigned to every human × the right shoulder angel records every good deed, sincere intention, and act of charity; the left shoulder angel records every bad deed, sin, and act of disobedience. Their purpose is to compile the Book of Deeds opened on the Day of Judgment.'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 3: PILLARS OF ISLAM × THE DEPTH OF SAWM (FASTING)">
        <SubSection title="The Obligation of Sawm">
          <p>Fasting during the holy month of Ramadan is the fourth Pillar of Islam, made mandatory in the second year of Hijrah (2 AH). It requires a believer to abstain completely from food, drink, smoking, and marital relations from dawn (Fajr) until sunset (Maghrib), accompanied by a clear intention (Niyyah). The ultimate goal of fasting is stated in Surah Al-Baqarah (2:183): to attain Taqwa (God-consciousness, piety, and self-restraint).</p>
        </SubSection>
        <SubSection title="The Conditions and Nullifiers of Fasting">
          <BulletList items={[
            'Things that break the fast: Eating or drinking intentionally (accidental consumption is forgiven), deliberate self-induced vomiting, the onset of menstruation (Haydh) or post-birth bleeding (Nifas), intentionally swallowing thick smoke or non-nutritious objects.',
            'Exemptions from Fasting: The sick, travelers on long journeys (exceeding approximately 80 km), elderly individuals who lack physical strength, and pregnant or nursing mothers who fear for their health or their child\'s safety. These individuals must either make up the missed days later (Qadha) or pay Fidyah (feeding a poor person for every day missed), depending on their long-term health condition.'
          ]} />
        </SubSection>
        <SubSection title="Spiritual and Social Benefits">
          <p>Fasting trains a Muslim in self-discipline and patience (Sabr). It purifies the soul by steering a believer away from lying, backbiting, and arguments. On a social level, experiencing hunger fosters deep empathy for the poor and less fortunate, encouraging Muslims to increase their charity (Sadaqah) and communal meals (Iftar).</p>
        </SubSection>
      </Section>

      <Section title="UNIT 4: HADITH × EXCELLENCE OF CHARACTER AND SOCIAL MORALS">
        <SubSection title="The Definition of Hadith">
          <p>Hadith refers to the sayings, actions, silent approvals, and physical characteristics of Prophet Muhammad (PBUH). It is the second source of Islamic law (Shariah) after the Quran, providing practical explanations of how to apply Quranic principles to daily life.</p>
        </SubSection>
        <SubSection title="Key Hadith Teachings">
          <BulletList items={[
            'Hadith on Good Manners (Husn al-Khuluq): The Prophet (PBUH) stated: "Nothing is weightier on the Scale of Deeds on the Day of Judgment than good manners." Islam places excellent character at the heart of faith. True righteousness must be reflected in kindness, truthfulness, humility, and fairness when dealing with family, neighbors, and classmates.',
            'Hadith on True Wealth (Ghena al-Nafs): The Prophet (PBUH) taught: "Wealth is not in having vast material possessions, but true wealth is the contentment of the soul (Ghena al-Nafs)." This teaches students to avoid greed, envy (Hasad), and constant comparisons with others. A Muslim should thank Allah for their blessings (Shukr) and find contentment in what they have.',
            'Hadith on Environmental Care and Cleanliness: Cleanliness is an essential part of faith ("Al-Tahooro Shatrul Iman" × Purification is half of faith). The Prophet (PBUH) prohibited polluting public spaces, water sources, and shade trees. He encouraged planting trees, stating that if a Muslim plants a tree and a human, bird, or animal eats from it, it is recorded as an act of charity (Sadaqah).'
          ]} />
        </SubSection>
      </Section>

      <Section title="UNIT 5: SIRAH × THE MIGRATION TO MADINAH (HIJRAH)">
        <SubSection title="The Background to Hijrah">
          <p>After thirteen years of preaching Islam in Makkah, the persecution of Muslims by the Quraysh leaders reached its peak. The Quraysh subjected the early believers to physical torture, social boycotts, and starvation. When the leaders formed a conspiracy to assassinate Prophet Muhammad (PBUH) in his bed, Allah commanded the Prophet to migrate north to the city of Yathrib, which was later renamed Madinah al-Munawwarah (The Illuminated City).</p>
        </SubSection>
        <SubSection title="The Miraculous Escape">
          <p>The Prophet (PBUH) instructed his young cousin, Ali bin Abi Talib, to sleep in his bed to deceive the assassins surrounding the house and to safely return trust properties (Amanat) back to their Makkan owners the next morning. The Prophet then slipped past the attackers undetected. He met his loyal companion, Abu Bakr Al-Siddiq, and they set out on their historic journey under the cover of night. They hid inside Cave Thawr for three days to evade Quraysh scouts. A spider spun a web and a dove laid eggs at the cave entrance, fooling the tracking party into believing no one had entered.</p>
        </SubSection>
        <SubSection title="The Arrival and Foundations of Madinah">
          <p>The arrival of the Prophet (PBUH) in Madinah in 622 CE marks the beginning of the Islamic Calendar (Hijri Calendar). To establish a stable society, the Prophet took three immediate, foundational steps: (1) Building Masjid an-Nabawi × a mosque that served as a center for daily worship, a school for learning, a hall for leadership meetings, and a shelter for the poor. (2) The System of Mu'akhat (Brotherhood) × he paired every Muhajir (Makkan migrant who arrived empty-handed) with an Ansar (Madinan helper who owned land and property). The Ansar shared their homes, businesses, and food with their new brothers. (3) The Charter of Madinah × a formal written constitution that bound Muslims, Jews, and local tribes together, guaranteeing freedom of religion, establishing collective security, and designating the Prophet as the supreme leader and judge of the city-state.</p>
        </SubSection>
      </Section>

      <Section title="UNIT 6: AKHLAQ (ISLAMIC MORALS) AND SOCIAL VALUES">
        <SubSection title="The Concept of Akhlaq">
          <p>Akhlaq refers to the moral code, ethics, and manners taught by Islam. A Muslim's relationship with Allah (Ibadah) is incomplete unless it leads to upright behavior and respectful treatment of all creations.</p>
        </SubSection>
        <SubSection title="Core Moral Values">
          <BulletList items={[
            'Honesty (Sidiq) and Trustworthiness (Amanah): Long before receiving prophecy, Muhammad was known in Makkah as Al-Amin (The Trustworthy) and Al-Sadiq (The Truthful). Islam commands Muslims to speak the truth in all circumstances, avoid cheating in school exams, and fulfill their promises. Amanah means keeping secrets safe, returning borrowed items in good condition, and respecting public property.',
            'Kindness to Parents (Birr al-Walidayn): In the Quran, Allah connects worship of Him directly with showing kindness to parents (Surah Al-Isra 17:23). Students are taught to speak to their parents with respect, avoid saying even a sigh of irritation ("Uff"), help them with household tasks, and pray for them daily: "My Lord, have mercy upon them as they brought me up when I was small."',
            'Respect for Diversity and Peaceful Coexistence: Islam teaches that differences in race, language, and skin color are signs of Allah\'s creative wisdom, designed so humans can learn from one another, not despise each other (Surah Al-Hujurat 49:13). Muslims are called to treat non-Muslim neighbors with kindness and justice, protect the rights of minorities, and live peacefully within multi-cultural societies.'
          ]} />
        </SubSection>
      </Section>

      <Section title="PRACTICE EVALUATION QUESTIONS">
        <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
          <p><strong>Question 1 (Quranic Studies):</strong> Explain the historical context of Surah Al-Inshirah and analyze how its main message can comfort a student facing academic challenges.</p>
          <p><strong>Question 2 (Pillars of Iman):</strong> Discuss the functions of the Kiraman Katibin angels and explain how awareness of their presence influences a Muslim's daily choices.</p>
          <p><strong>Question 3 (Fiqh/Islamic Law):</strong> Identify three groups of people exempted from fasting during Ramadan and describe how they should compensate for their missed fasts.</p>
          <p><strong>Question 4 (Sirah/History):</strong> Analyze the importance of the Mu'akhat system established by the Prophet (PBUH) in Madinah and explain how it solved the socioeconomic challenges of the Muhajirun.</p>
          <p><strong>Question 5 (Hadith/Moral Values):</strong> Based on prophetic teachings, contrast the concept of material wealth with Ghena al-Nafs (contentment of the soul), providing an everyday example.</p>
        </div>
        <SubSection title="Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> Surah Al-Inshirah was revealed in Makkah during a period when Prophet Muhammad (PBUH) faced intense emotional distress, social isolation, and rejection from the Quraysh leaders. Allah revealed this Surah to comfort him by reminding him of divine favors: opening his heart, easing his heavy burdens, and elevating his status. For a student facing academic challenges, the Surah provides comfort through verses 5 and 6: "Verily, along with every hardship is relief." This teaches the student that academic struggles, difficult concepts, and exam anxieties are temporary trials. By putting in effort, maintaining patience (Sabr), and relying on Allah (Tawakkul), ease and understanding will follow the hardship.</p>
            <p><strong>Answer 2:</strong> The Kiraman Katibin are the noble recording angels assigned by Allah to every human being. The angel on the right shoulder records every good deed, righteous action, and pure intention, while the angel on the left shoulder records every sin, bad deed, and act of disobedience. Awareness of these angels creates a constant state of accountability (Muraqabah) in a Muslim's daily life. Knowing that every word spoken, text message sent, and action hidden from people is being recorded encourages a believer to perform more good deeds, avoid cheating or bullying, and quickly repent (Tawbah) if they commit a mistake.</p>
            <p><strong>Answer 3:</strong> Three groups exempted: (1) The Sick × people suffering from acute or chronic illnesses whose health would worsen by fasting. (2) The Traveler × individuals embarking on a long journey exceeding approximately 80 km. (3) Pregnant or Breastfeeding Mothers × women who fear that fasting might harm their health or the safety of their babies. Compensation: Travelers, temporarily sick individuals, and pregnant/breastfeeding mothers must make up the missed fasts day-for-day (Qadha) after Ramadan when conditions improve. Elderly individuals and the chronically ill who cannot fast due to long-term health conditions must pay Fidyah by feeding a needy person for each day missed.</p>
            <p><strong>Answer 4:</strong> The Mu'akhat system was an institutional brotherhood that paired every Makkan migrant (Muhajir) with a local Madinan helper (Ansar). This system was crucial because the Muhajirun had fled Makkah in haste, leaving behind their homes, wealth, properties, and businesses, arriving in Madinah as refugees. The Mu'akhat system solved these socioeconomic challenges by fostering immediate sharing. The Ansar voluntarily divided their homes, agricultural lands, crops, and business capitals with their Makkan brothers. This eliminated poverty, prevented the formation of refugee camps, and built a unified, cooperative community bound by faith rather than tribal lineages.</p>
            <p><strong>Answer 5:</strong> Material wealth refers to physical, worldly assets such as money, expensive clothing, smartphones, and properties. It is often driven by a desire for status and can lead to anxiety, greed, and constant comparison with others. In contrast, Ghena al-Nafs is the inner wealth of a contented soul that accepts Allah's decree with gratitude (Shukr), remaining peaceful regardless of material circumstances. Example: Two students receive the same school bag. The first student is unhappy because their classmate has a more expensive, branded bag; this student lacks Ghena al-Nafs. The second student feels happy, appreciates the bag, and thanks Allah and their parents for providing it, without worrying about what others have; this student possesses Ghena al-Nafs.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- AGRICULTURE & NUTRITION ----------
function AgricultureNotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Agriculture and Nutrition</h2>

      <Section title="PART 1: SOIL CONSERVATION AND MANAGEMENT">
        <SubSection title="The Dynamics of Soil Erosion">
          <p>Soil erosion is the physical detachment, displacement, and transportation of fertile topsoil from one geographic location to another by human activities or natural agents, primarily wind and flowing water. Topsoil is the most valuable layer because it contains high concentrations of organic matter (humus), soil microorganisms, and essential nutrients required for plant growth. When topsoil is lost, land becomes unproductive, leading to crop failure and food insecurity.</p>
        </SubSection>
        <SubSection title="Types of Soil Erosion">
          <BulletList items={[
            'Splash Erosion: The initial stage of water erosion occurs when heavy raindrops impact bare, unprotected soil. The kinetic energy of the falling raindrop breaks down soil aggregates, detaching individual soil particles and splashing them into the air. Detached particles clog soil pores, reducing water infiltration.',
            'Rill Erosion: As surface runoff flows down a slope, it concentrates into small, shallow, well-defined channels called rills. These channels carve narrow pathways into the topsoil. Rill erosion can be easily corrected using regular farm machinery during tillage.',
            'Gully Erosion: If rill erosion is left unchecked, flowing water deepens and widens the rills into large, deep trenches called gullies. Gullies cut through the land, making it impossible to pass with tractors or farm machinery, which ruins agricultural fields.',
            'Sheet Erosion: The uniform, gradual removal of a thin, even layer of topsoil across a wide area of land. It is caused by shallow surface water runoff flowing across bare, gently sloping land. Sheet erosion is dangerous because it happens gradually and is difficult to notice until significant fertility is lost.'
          ]} />
        </SubSection>
        <SubSection title="Soil Erosion Control and Conservation Strategies">
          <BulletList items={[
            'Cover Cropping: Planting low-growing, high-density crops (such as sweet potatoes, beans, cowpeas, or groundnuts) that grow fast and cover bare soil. The crop canopy breaks the impact of falling raindrops, preventing splash erosion, while the dense root networks bind soil particles together and slow down surface runoff.',
            'Mulching: Covering bare soil around crops with organic matter, such as dry grass, crop residues, or banana leaves. Mulch absorbs the kinetic energy of raindrops, reduces water evaporation from the soil, suppresses weed growth, and decomposes over time to add organic humus back into the soil.',
            'Contour Farming: Ploughing, planting, and carrying out agricultural operations across a slope along lines of equal elevation (contour lines), rather than up and down the hill. Each row acts as a small dam that slows down flowing surface runoff, giving water more time to infiltrate the soil and trapping loose soil particles.',
            'Strip Cropping: Alternating strips of erosion-susceptible row crops (like maize or cotton) with strips of close-growing erosion-resistant cover crops (like grass or legumes) across a slope. The cover crop strips slow down runoff and trap soil washed down from the row crop strips.',
            'Trash Lines: Rows of crop residues left across slopes to slow runoff.'
          ]} />
        </SubSection>
      </Section>

      <Section title="PART 2: CROP PRODUCTION AND AGROFORESTRY">
        <SubSection title="Establishing Crop Nurseries">
          <p>A nursery bed is a small, specially prepared plot of land set aside for raising young, delicate seedlings under intensive care before transplanting them to their permanent positions in the main field. Raising crops in a nursery ensures high survival rates because seedlings are protected from harsh weather, pests, and diseases during their early stages of growth.</p>
        </SubSection>
        <SubSection title="Types of Crop Nurseries">
          <BulletList items={[
            'Nursery Beds: Prepared directly on the ground surface. The soil is deeply dug, tilled into a fine tilth, mixed with well-rotted manure, and leveled.',
            'Raised Nursery Beds: Built 10 to 15 centimeters above the ground level in areas with high rainfall or heavy clay soils. This design improves drainage and prevents waterlogging, which can cause fungal diseases like damping-off.',
            'Sunken Nursery Beds: Dug 10 to 15 centimeters below the surrounding ground level in dry, arid, or semi-arid areas. This structure helps conserve water by catching and retaining scarce moisture and shielding delicate seedlings from dry, hot winds.'
          ]} />
        </SubSection>
        <SubSection title="Management Practices in a Crop Nursery">
          <BulletList items={[
            'Watering: Applying water gently using a watering can with a fine rose. Watering should be done early in the morning or late in the evening when evaporation rates are lowest.',
            'Shading: Constructing a temporary nursery shade structure over the bed using local materials like sticks and grass to protect young seedlings from intense, direct sunlight. The shade is gradually reduced as seedlings grow to harden them off before transplanting.',
            'Weeding: Removing unwanted plants (weeds) carefully by hand to prevent them from competing with young seedlings for nutrients, space, and sunlight.',
            'Thinning: Removing weak, crowded, or diseased seedlings from the rows to create proper spacing, ensuring the remaining seedlings grow strong and healthy.',
            'Hardening-off: The gradual reduction of shade and water to prepare seedlings for the conditions of the main field.',
            'Transplanting: The process of moving healthy seedlings from the nursery bed into their permanent field positions.'
          ]} />
        </SubSection>
        <SubSection title="Agroforestry Practices">
          <p>Agroforestry is a land-use management system where woody perennials (trees or shrubs) are deliberately grown on the same land unit as agricultural crops and/or livestock. This combination creates ecological and economic benefits for the farm.</p>
          <BulletList items={[
            'Alley Cropping: Planting food crops in the alleys or spaces between wide rows of fast-growing, nitrogen-fixing trees or shrubs (such as Leucaena or Calliandra). The trees are regularly pruned to prevent shading, and the prunings are used as mulch or green manure.',
            'Live Fences: Planting dense, thorny, or closely spaced trees and shrubs along farm boundaries to act as a barrier. Live fences protect fields from intruders and stray livestock, serve as windbreaks, and provide firewood or fodder.'
          ]} />
        </SubSection>
      </Section>

      <Section title="PART 3: ANIMAL PRODUCTION AND LIVESTOCK MANAGEMENT">
        <SubSection title="Domestic Animals and Their Economic Value">
          <p>Livestock production is a key component of agriculture, providing food, raw materials, employment, and income. Domestic animals are classified based on their primary products and functions on the farm.</p>
          <BulletList items={[
            'Cattle: Divided into dairy breeds raised for milk production (such as Friesian, Guernsey, Jersey, and Ayrshire) and beef breeds raised for meat production (such as Boran, Hereford, and Aberdeen Angus). Cattle also provide hides for leather manufacturing and organic manure for crops.',
            'Poultry: Includes chickens, turkeys, ducks, and geese. They are categorized into layers kept for egg production, broilers raised for rapid meat production, and dual-purpose indigenous chicken breeds. Poultry supplies feathers for bedding and high-nitrogen manure for soil improvement.'
          ]} />
        </SubSection>
        <SubSection title="Rearing Practices for Domestic Animals">
          <BulletList items={[
            'Feeding: Providing animals with a balanced diet containing all necessary nutrients (carbohydrates, proteins, minerals, vitamins, and clean water) to maximize production. Dairy cows require high-quality roughage (napier grass, silage) supplemented with dairy meal, while layers require feeds rich in calcium to produce strong eggshells.',
            'Housing: Constructing clean, dry, well-ventilated structures to protect livestock from extreme weather, predators, and diseases. Livestock housing includes calf pens, poultry houses with deep litter systems, and zero-grazing units for dairy cattle.',
            'Disease Control: Implementing routine biosecurity measures, clean housing, vaccinations, and structural treatments to manage diseases.'
          ]} />
        </SubSection>
        <SubSection title="Livestock Pest and Parasite Management">
          <BulletList items={[
            'Ectoparasites: External pests like ticks, fleas, and mites that suck blood. They cause irritation, damage hides, and transmit dangerous diseases (such as East Coast Fever). They are controlled by dipping or spraying animals with chemical solutions called acaricides, or by maintaining clean pastures.',
            'Endoparasites: Internal worms like roundworms and liver flukes that live inside the animal\'s stomach, intestines, or liver, stealing nutrients and causing weight loss. They are controlled by regular deworming using oral medicines (anthelmintics) and practicing rotational grazing.'
          ]} />
        </SubSection>
      </Section>

      <Section title="PART 4: HUMAN NUTRITION AND DIETETICS">
        <SubSection title="Nutrient Categories and Functional Roles">
          <p>Nutrition is the science of how the body uses nutrients from food to support growth, energy production, tissue repair, and overall health. A balanced diet must contain seven essential components in correct proportions:</p>
          <BulletList items={[
            'Carbohydrates: Provide energy; found in maize, wheat, rice, cassava.',
            'Proteins: Growth and tissue repair; found in meat, beans, eggs, fish.',
            'Lipids (Fats/Oils): Stored energy, insulation; found in butter, nuts.',
            'Vitamins: Disease prevention; found in spinach, oranges, carrots.',
            'Minerals: Strong bones/teeth, body functions; found in milk, green vegetables.',
            'Dietary Fiber: Aids digestion, prevents constipation; found in bran.',
            'Water: Regulates temperature and acts as a solvent for transport.'
          ]} />
        </SubSection>
        <SubSection title="Nutritional Deficiency Malnutrition Diseases">
          <BulletList items={[
            'Kwashiorkor: Caused by a severe deficiency of proteins in the diet, even if the child receives enough carbohydrates. Symptoms include a swollen abdomen (edema due to fluid retention), thin hair that changes color to a reddish-brown tint, a moon-shaped face, and skin that cracks or peels easily.',
            'Marasmus: Caused by a severe deficiency of overall food energy (calories), meaning the diet lacks both carbohydrates and proteins. Symptoms include extreme wasting of muscles, a wrinkled "old man\'s face," protruding ribs, and a constant feeling of hunger. The child becomes extremely thin and weak.',
            'Scurvy: Caused by a lack of Vitamin C (ascorbic acid), which is found in fresh citrus fruits like lemons, oranges, and guavas. Symptoms include bleeding gums, loose teeth, slow wound healing, and painful joints.',
            'Rickets: Caused by a deficiency of Vitamin D or the mineral calcium, which are necessary for proper bone development. It leads to weak, soft bones that bend under the body\'s weight, causing bow-legs or knock-knees in growing children.'
          ]} />
        </SubSection>
        <SubSection title="Food Preservation Methods">
          <p>Food preservation stops or slows down the growth of microorganisms (bacteria, molds, and yeasts) that cause food spoilage, extending the shelf life of produce and reducing waste.</p>
          <BulletList items={[
            'Drying: Removing moisture from food, which prevents microorganisms from growing since they need water to survive. Examples include sun-drying grains, beans, and traditional vegetables.',
            'Smoking: Exposing meat or fish to smoke from burning wood. The heat dries the food, while chemical compounds in the smoke act as natural preservatives and add a distinctive flavor.',
            'Refrigeration/Freezing: Using low temperatures to preserve food. Refrigeration slows down the growth of microorganisms and the action of enzymes, while freezing stops them completely.'
          ]} />
        </SubSection>
      </Section>

      <Section title="PART 5: AGRICULTURAL TOOLS AND FARM EQUIPMENT">
        <SubSection title="Classification and Uses of Farm Tools">
          <p>Agricultural tools increase efficiency, reduce manual labor, and ensure tasks are performed accurately on the farm. Tools are classified based on their primary function.</p>
        </SubSection>
        <SubSection title="Garden Tools">
          <BulletList items={[
            'Jembe (Hoe): A metal blade attached to a wooden handle, used for primary land digging, breaking soil clods, creating planting furrows, and removing weeds.',
            'Panga: A versatile, flat steel blade used for clearing light bush, cutting stems, harvesting thick crops, and skinning produce.',
            'Spade: A flat, rectangular metal blade attached to a long handle, used for scooping and lifting loose materials like soil, sand, or manure.',
            'Rake: A metal bar with a row of teeth attached to a long handle, used for leveling seedbeds, gathering dry leaves, and removing small stones from plots.'
          ]} />
        </SubSection>
        <SubSection title="Livestock Care Tools">
          <BulletList items={[
            'Burdizzo Castrator: A heavy metal tool used to crush the spermatic cords of male livestock (like bulls or rams) without breaking the skin, making them sterile. This practice controls breeding and improves meat quality.',
            'Drenching Gun: A specialized syringe used to administer precise liquid deworming medicines or nutritional supplements orally into an animal\'s mouth.'
          ]} />
        </SubSection>
        <SubSection title="Maintenance of Agricultural Tools">
          <p>Proper maintenance extends the life of tools, saves money, and ensures operator safety. Key practices include cleaning tools after every use to remove abrasive soil and moisture, sharpening cutting edges with a file or whetstone, oiling or greasing metal surfaces to prevent rust, replacing cracked wooden handles, and storing tools neatly in a dry tool shed.</p>
        </SubSection>
      </Section>

      <Section title="PRACTICE EVALUATION QUESTIONS">
        <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
          <p><strong>Question 1 (Soil Management):</strong> A farmer noticed small, parallel channels developing on a sloped field after a heavy storm. Identify the type of soil erosion occurring, and describe two practical methods the farmer can implement to control it.</p>
          <p><strong>Question 2 (Crop Production):</strong> Explain the structural differences between a raised nursery bed and a sunken nursery bed, and state the specific climatic conditions under which each should be used.</p>
          <p><strong>Question 3 (Animal Production):</strong> Differentiate between external parasites (ectoparasites) and internal parasites (endoparasites) in livestock, and name the specific chemical or medicinal control method used for each.</p>
          <p><strong>Question 4 (Human Nutrition):</strong> Compare the deficiency diseases Kwashiorkor and Marasmus by their causes and visible physical symptoms in young children.</p>
          <p><strong>Question 5 (Farm Tools):</strong> Explain the function of a burdizzo castrator and a drenching gun in livestock management, and outline three general maintenance practices for metal farm tools.</p>
        </div>
        <SubSection title="Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> The small channels developing on the slope indicate rill erosion. If left untreated, these channels can deepen into gullies. To control rill erosion, the farmer can implement: Cover Cropping × planting fast-growing legumes like beans or cowpeas whose leaves form a canopy that breaks the force of falling rain while their roots bind the soil together. Contour Farming × ploughing and planting crops across the slope along lines of equal elevation, where the crop rows act as barriers that slow down surface runoff.</p>
            <p><strong>Answer 2:</strong> A raised nursery bed is built 10 to 15 centimeters above the surrounding ground level. It is used in high-rainfall zones or fields with heavy clay soils because it improves drainage, prevents waterlogging, and protects seedlings from fungal diseases like damping-off. A sunken nursery bed is dug 10 to 15 centimeters below the surrounding ground level. It is used in dry, arid, or semi-arid areas because its walls shelter delicate seedlings from hot, drying winds, and its lower position helps catch and conserve scarce rainwater.</p>
            <p><strong>Answer 3:</strong> Ectoparasites are external pests that live on the outside of an animal's body, such as ticks, fleas, lice, and mites, where they bite the skin and suck blood. They are controlled chemically by spraying or dipping the animal with acaricides. Endoparasites are internal worms that live inside the animal's organs and digestive tract, such as roundworms, tapeworms, and liver flukes, where they steal nutrients from the host. They are controlled medicinally by administering oral anthelmintics through deworming.</p>
            <p><strong>Answer 4:</strong> Kwashiorkor is caused by a severe deficiency of proteins in the diet, while carbohydrate intake may be sufficient. Visible symptoms include a swollen abdomen (edema), thin hair that turns a reddish-brown color, a swollen "moon face," and skin that cracks or peels. Marasmus is caused by a severe deficiency of total food energy and calories, meaning the diet lacks both carbohydrates and proteins. Visible symptoms include extreme wasting of muscles, a wrinkled "old man's face," prominent ribs, an emaciated frame, and a constant alertness driven by hunger.</p>
            <p><strong>Answer 5:</strong> A burdizzo castrator is used for the bloodless castration of male livestock by crushing the spermatic cords without breaking the skin, making them sterile. A drenching gun is used to administer precise liquid medicines or dewormers orally down an animal's throat. Three general maintenance practices for metal farm tools include: Cleaning × washing off soil, mud, and plant juices with water after every use, then drying the tools thoroughly. Rust Prevention × coating metal surfaces and moving joints with oil or grease before storage to block moisture. Sharpening × regularly sharpening cutting edges with a file or whetstone to ensure clean, efficient cuts.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
// ---------- HRE ----------
function HRENotes() {
  return (
    <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>??? HRE: Hindu Religious Education</h2>

      <Section title="PART 1: PARAMATMA (GOD) AND HIS MANIFESTATIONS">
        <SubSection title="The Concept of Paramatma">
          <p>In Hinduism, God is known as Paramatma (the Supreme Soul) or Brahman. Paramatma is absolute, eternal, omnipresent (present everywhere), omnipotent (all-powerful), and omniscient (all-knowing). He has no beginning and no end. Paramatma manifests in two distinct forms to help devotees connect with Him:</p>
          <BulletList items={[
            'Nirguna Brahman: The formless aspect of God. In this state, Paramatma has no physical attributes, shape, or gender. He is experienced through deep internal meditation (Dhyana) and silent contemplation.',
            'Saguna Brahman: The aspect of God with form, attributes, and virtues. To protect righteousness and guide humanity, Paramatma manifests as various deities (Devas and Devis) and takes human or animal forms known as Avatars (incarnations).'
          ]} />
        </SubSection>
        <SubSection title="The Trimurti (The Divine Triple Aspect)">
          <p>Paramatma controls the cosmic functions of the universe through three primary male deities known collectively as the Trimurti:</p>
          <BulletList items={[
            'Lord Brahma: The Creator. He is responsible for bringing the universe and all living creations into existence. He is traditionally depicted with four faces looking in all four directions, representing the four Vedas, and sits upon a sacred lotus flower. His vehicle (Vahana) is the Hansa (swan), symbolizing discrimination between good and evil.',
            'Lord Vishnu: The Preserver and Sustainer. He protects, maintains, and preserves order, cosmic law (Dharma), and balance within the universe. He holds a conch shell (Shankha), a discus (Chakra), a mace (Gada), and a lotus flower (Padma). His vahana is Garuda, a divine eagle. Whenever cosmic balance is threatened by evil, Lord Vishnu descends to Earth as an Avatar.',
            'Lord Shiva: The Transformer and Regenerator (often referred to as the Destroyer). He destroys ignorance, ego, and cosmic creation at the end of its cycle so that a new, pure cycle can begin. He is depicted with a third eye on his forehead, a crescent moon in his hair, a trident (Trishula), and holds the holy river Ganga in his matted locks. His vahana is Nandi, the divine bull.'
          ]} />
        </SubSection>
        <SubSection title="The Concept of Avatars (Divine Incarnations)">
          <p>Lord Vishnu takes physical form on Earth to defeat demonic forces, restore peace, and re-establish Dharma. This principle is explained in the Bhagavad Gita (Chapter 4, Verses 7°8): "Whenever righteousness declines and unrighteousness rises, I manifest Myself to protect the virtuous and destroy the wicked." There are ten primary incarnations known as the Dashavatar:</p>
          <BulletList items={[
            'Matsya Avatar: The giant fish incarnation. Lord Vishnu descended as Matsya to rescue the first man, Manu, along with holy sages, seeds of all plants, and the sacred Vedas from a catastrophic cosmic deluge (flood).',
            'Kurma Avatar: The giant tortoise incarnation. When the Devas (deities) and Asuras (demons) churned the cosmic ocean of milk (Samudra Manthan) to extract the nectar of immortality (Amrita), the churning mountain began to sink into the ocean bed. Lord Vishnu took the form of Kurma to support the heavy mountain securely on his solid shell.'
          ]} />
        </SubSection>
      </Section>

      <Section title="PART 2: HINDU SCRIPTURES AND HOLY KNOWLEDGE">
        <SubSection title="The Structure of Sacred Texts">
          <p>Hindu scriptures are extensive libraries of spiritual wisdom, written primarily in ancient Sanskrit. They are categorized into two major classes:</p>
          <BulletList items={[
            'Shruti (That which is heard): These are direct cosmic revelations heard by ancient sages (Rishis) during deep states of meditation. They are considered eternal truths that cannot be altered or changed. The Vedas and the Upanishads make up the Shruti category.',
            'Smriti (That which is remembered): These are written texts authored by human sages to explain, simplify, and illustrate the deep cosmic truths of the Shruti through history, stories, poems, and codes of conduct. They can be adapted to suit different historical eras. The Itihasas (epics like the Ramayana and Mahabharata) and the Puranas belong to the Smriti category.'
          ]} />
        </SubSection>
        <SubSection title="The Four Vedas">
          <p>The word Veda originates from the Sanskrit root Vid, which means "to know" or "pure knowledge." The Vedas are the oldest and most authoritative scriptures in Hinduism:</p>
          <BulletList items={[
            'Rig Veda: The oldest Veda, consisting of 1,028 sacred hymns (Suktas) sung in praise of nature deities and the forces of the universe (such as Agni, Indra, and Varuna).',
            'Sama Veda: The Veda of melodies and chants. It takes the hymns of the Rig Veda and sets them to musical notes, forming the historical foundation of traditional Indian classical music.',
            'Yajur Veda: The Veda of rituals and sacrifices. It contains specific instructions, formulas, and prose mantras recited by priests during the performance of sacred fire ceremonies (Yajnas).',
            'Atharva Veda: The Veda of daily life and practical sciences. It contains guidelines for medicine (Ayurveda), household duties, statecraft, and protection against negative energies.'
          ]} />
        </SubSection>
        <SubSection title="The Epics (Itihasas)">
          <BulletList items={[
            'The Ramayana: Authored by Sage Valmiki, it narrates the life, trials, and triumphs of Lord Rama, the prince of Ayodhya and seventh Avatar of Lord Vishnu. It sets ideal standards for human relationships, illustrating how to be an ideal son, brother, wife (Sita), devotee (Hanuman), and righteous king (Rama Rajya).',
            'The Mahabharata: Authored by Sage Vyasa, it is the longest epic poem in the world. It records the political conflict between two sets of cousins: the righteous Pandavas and the corrupt Kauravas, culminating in the great war of Kurukshetra. It teaches that righteousness always triumphs over evil ("Yato Dharmastato Jayah"×Where there is Dharma, there is Victory).'
          ]} />
        </SubSection>
      </Section>

      <Section title="PART 3: SADACHAR (RIGHTEOUS CONDUCT AND FAMILY VALUES)">
        <SubSection title="The Concept of Sadachar">
          <p>Sadachar translates to "righteous, pure, and noble conduct." It is the practical expression of Dharma in a person's daily life, guiding how an individual interacts with family members, classmates, elders, and the environment.</p>
        </SubSection>
        <SubSection title="The Four Purusharthas (The Four Goals of Life)">
          <p>Hinduism outlines four balanced aims that every human should pursue to live a complete and satisfying life:</p>
          <BulletList items={[
            'Dharma (Righteousness and Duty): The primary foundation. It means living with moral integrity, practicing truthfulness, fulfilling responsibilities, and doing what is right in every situation.',
            'Artha (Wealth and Material Security): Earning a livelihood, accumulating wealth, and gaining material security through honest, legal, and hardworking means. Wealth must never be earned through cheating, greed, or harming others.',
            'Kama (Pleasure and Emotional Fulfillment): Satisfying emotional, cultural, artistic, and sensory desires (such as enjoying art, music, literature, and family life) within the boundaries of Dharma.',
            'Moksha (Spiritual Liberation): The ultimate spiritual goal. It is the liberation of the individual soul (Atman) from the continuous cycle of birth, death, and rebirth (Samsara), uniting it eternally with Paramatma.'
          ]} />
        </SubSection>
        <SubSection title="The Pancha Maha Yajnas (The Five Daily Sacrifices)">
          <p>To cultivate selflessness and reduce ego, a householder is expected to perform five simple daily offerings of gratitude:</p>
          <BulletList items={[
            'Deva Yajna: Offerings made to God and deities through morning prayers, lighting a diya, chanting mantras, and offering fruits or flowers at the altar.',
            'Pitri Yajna: Showing gratitude, respect, and duty toward parents, grandparents, and ancestors. This includes helping parents with daily chores and caring for them in old age.',
            'Brahma Yajna (Rishi Yajna): Honoring spiritual teachers, gurus, sages, and knowledge by reading sacred scriptures, studying diligently, and teaching others.',
            'Manushya Yajna: Serving fellow human beings through charity, feeding the hungry, welcoming guests ("Atithi Devo Bhava"×The guest is an embodiment of God), and helping those in need.',
            'Bhuta Yajna: Showing kindness to the natural environment and animals. This includes feeding birds, stray animals, watering plants (like the sacred Tulsi), and avoiding environmental pollution.'
          ]} />
        </SubSection>
        <SubSection title="The Practice of Ahimsa (Non-Violence)">
          <p>Ahimsa is the practice of complete non-injury and non-violence in thought, word, and deed. It means a student must not cause physical harm to others, use harsh or insulting words that hurt feelings, or harbor malicious, angry thoughts toward classmates. Ahimsa promotes universal compassion and is the core value behind a traditional vegetarian lifestyle.</p>
        </SubSection>
      </Section>

      <Section title="PART 4: FESTIVALS AND RELIGIOUS PRACTICES">
        <SubSection title="The Importance of Hindu Festivals">
          <p>Festivals are times for joy, spiritual renewal, and community bonding. They help families remember historical events recorded in scriptures, celebrate seasonal harvest rhythms, and worship specific deities.</p>
        </SubSection>
        <SubSection title="Diwali (The Festival of Lights)">
          <p>Celebrated on the dark night (Amavasya) of the month of Kartik, Diwali is one of the most prominent festivals in Hinduism. Significance: Citizens of Ayodhya lit clay lamps (diyas) to welcome Lord Rama back after 14 years of exile and victory over Ravana. Devotees clean homes to welcome Goddess Lakshmi (wealth and prosperity). It symbolizes the victory of light over darkness and knowledge over ignorance. Rituals include cleaning and decorating homes, creating colorful Rangoli patterns at entryways, lighting rows of clay lamps, sharing sweets with neighbors, and performing special prayers to Goddess Lakshmi and Lord Ganesha.</p>
        </SubSection>
        <SubSection title="Maha Shivaratri (The Great Night of Shiva)">
          <p>This solemn festival is dedicated to Lord Shiva, celebrated on the 13th night/14th day of the dark half of the month of Phalguna. Unlike other festivals that feature feasting, Maha Shivaratri focuses on self-discipline and meditation: Fasting and Vigil × devotees observe a strict fast (Vrat) for 24 hours and stay awake all night (Jagram) singing bhajans, meditating, and chanting "Om Namah Shivaya." The Abhisheka × priests and devotees perform a ritual wash of the Shiva Lingam using milk, honey, yogurt, ghee, and water, offering holy Bel leaves to honor Lord Shiva's purifying energy.</p>
        </SubSection>
        <SubSection title="The Ritual of Puja">
          <p>Puja is a structured ritual of worship performed daily at home or in a temple (Mandir) to show love and devotion to God. Essential components of a Puja tray include: Diya (Ghee Lamp) × symbolizes light, truth, and the element of fire. Agarbatti (Incense) × spreads a pleasant fragrance, representing air. Pushpa (Flowers) × offered as a symbol of love, purity, and earth. Naivedya (Prasad) × food or sweets offered to the deity, then shared. Aarti × waving the lamp clockwise while singing hymns. The sacred water (Tirtham) used during the puja is distributed to devotees as a blessing.</p>
        </SubSection>
      </Section>

      <Section title="PRACTICE EVALUATION QUESTIONS">
        <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
          <p><strong>Question 1 (Paramatma):</strong> Analyze how the concept of Nirguna Brahman differs from Saguna Brahman, and explain why Lord Vishnu takes the form of Avatars like Matsya.</p>
          <p><strong>Question 2 (Scriptures):</strong> Explain the difference between Shruti and Smriti scriptures, and discuss the primary moral lesson taught by the outcome of the epic Mahabharata.</p>
          <p><strong>Question 3 (Sadachar):</strong> Describe the four Purusharthas (goals of life), and explain how a Grade 6 student can practice Manushya Yajna and Bhuta Yajna in their daily routine.</p>
          <p><strong>Question 4 (Festivals):</strong> Compare the celebratory practices of Diwali with the contemplative spiritual practices of Maha Shivaratri, highlighting their different focuses.</p>
          <p><strong>Question 5 (Religious Practices):</strong> Identify four primary items placed on an Aarti tray during a traditional puja, and explain the spiritual significance of waving the diya in front of a deity.</p>
        </div>
        <SubSection title="Answers">
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
            <p><strong>Answer 1:</strong> Nirguna Brahman refers to the formless, infinite, and absolute aspect of Paramatma. In this aspect, God has no physical shape, name, qualities, or limitations, and is experienced through deep, silent meditation. Saguna Brahman refers to the aspect of God with form, attributes, names, and virtues. In this state, He manifests as various deities (like the Trimurti) to allow devotees to express love and devotion (Bhakti). Lord Vishnu takes the form of Avatars to restore cosmic balance, protect the virtuous, and re-establish Dharma when unrighteousness threatens the world. For example, he descended as Matsya (the fish) to save the Vedas, plant seeds, and the ancestors of humanity from a great cosmic flood, ensuring that life and spiritual knowledge could continue in the next epoch.</p>
            <p><strong>Answer 2:</strong> Shruti means "that which is heard" and refers to direct, eternal cosmic revelations received by ancient sages during deep meditation. Shruti texts, like the Vedas, contain absolute spiritual laws that cannot be altered. Smriti means "that which is remembered" and consists of texts authored by human sages to explain and illustrate those eternal truths through stories, histories, and codes of conduct. Smriti texts, like the Epics, can be adapted to suit different times. The primary moral lesson of the Mahabharata is that righteousness always triumphs over unrighteousness ("Yato Dharmastato Jayah"). Even though the Pandavas faced many trials, losses, and exile, their dedication to Dharma ultimately brought them victory over the larger but unrighteous army of the Kauravas.</p>
            <p><strong>Answer 3:</strong> The four Purusharthas are Dharma (living with moral duty and righteousness), Artha (earning material wealth through honest means), Kama (enjoying healthy emotional and artistic pleasures), and Moksha (attaining spiritual liberation from the cycle of rebirth). A Grade 6 student can practice these daily sacrifices through: Manushya Yajna (Service to Humans) × sharing snacks or extra stationery with a needy classmate, being polite to school visitors, or donating old clothes and books to charity. Bhuta Yajna (Service to Nature) × watering the trees and plants around the school compound, feeding birds or stray animals water and bread, and avoiding littering to keep the environment clean.</p>
            <p><strong>Answer 4:</strong> Diwali is a festive, highly celebratory occasion that focuses on bringing joy, light, and prosperity outward into the community. It includes cleaning and decorating homes, creating colorful Rangoli designs, lighting rows of bright lamps, wearing new clothes, feasting, and sharing sweets with family and neighbors. In contrast, Maha Shivaratri is a solemn, quiet festival that focuses on inward reflection, self-discipline, and spiritual purification. Instead of feasting, devotees observe a strict fast (Vrat) for 24 hours. Instead of social gatherings, they maintain an all-night spiritual vigil (Jagram) inside a temple or quiet space, chanting mantras, singing bhajans, and meditating to overcome ego and ignorance.</p>
            <p><strong>Answer 5:</strong> Four primary items placed on an Aarti tray during a traditional puja are a Diya (ghee or oil lamp), Agarbatti (incense sticks), Pushpa (fresh flowers), and Naivedya (prasad or sweet offerings). The spiritual significance of waving the diya clockwise in front of the deity is to remind devotees that God is the supreme light of knowledge that drives away the darkness of ignorance from human hearts. As the flame illuminates the form of the deity, it helps the devotee focus their mind entirely on the divine presence. The circular waving motion represents that God is the central point of the universe, and all human activities should revolve around Him.</p>
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
