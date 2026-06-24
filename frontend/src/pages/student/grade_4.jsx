import { useState, useEffect, useRef } from 'react';

export default function AllGrade4Notes() {
 const [activeSubject, setActiveSubject] = useState(null);
 const [activeSection, setActiveSection] = useState('notes');
 
 // ----- TIMER STATE -----
 const [timerSeconds, setTimerSeconds] = useState(1800);
 const [timerActive, setTimerActive] = useState(false);
 const timerRef = useRef(null);

 // ----- Q&A STATE -----
 const [qaAnswers, setQaAnswers] = useState();
 const [qaSubmitted, setQaSubmitted] = useState(false);
 const [qaScore, setQaScore] = useState(null);

 // ----- QUIZ STATE -----
 const [quizAnswers, setQuizAnswers] = useState();
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
 setQaAnswers();
 setQuizAnswers();
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

 // ---------- SUBJECTS DATA ----------
 // ---------- SUBJECTS DATA ----------
 const subjects = [
 { id: 'math', label: 'Mathematics', short: 'M', desc: 'Advanced numeracy, operations, fractions, geometry, measurement, data', color: '#6366f1', notes: MathNotes, qa: mathQA, quiz: mathQuiz },
 { id: 'english', label: 'English Language Arts', short: 'E', desc: 'Grammar, reading, writing, comprehension and vocabulary', color: '#0ea5e9', notes: EnglishNotes, qa: null, quiz: null },
 { id: 'kiswahili', label: 'Kiswahili', short: 'K', desc: 'Sarufi, ngeli, nyakati, msamiati, methali, hadithi, insha', color: '#10b981', notes: KiswahiliNotes, qa: null, quiz: null },
 { id: 'science', label: 'Science', short: 'Sc', desc: 'Living things, human body, environment, matter, energy', color: '#8b5cf6', notes: ScienceNotes, qa: null, quiz: null },
 { id: 'social', label: 'Social Studies', short: 'SS', desc: 'Physical environment, people, resources, governance, history', color: '#f59e0b', notes: SocialNotes, qa: null, quiz: null },
 { id: 'cre', label: 'CRE', short: 'C', desc: 'Creation, patriarchs, Jesus, early Church, Christian living', color: '#ef4444', notes: CRENotes, qa: null, quiz: null },
 ];

 // Render
 if (!activeSubject) {
 return (
 <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
 <div style={{ marginBottom: '28px' }}>
 <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>Grade 4 Notes</h1>
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
 {/* Sticky header */}
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
 <button
 onClick={() => { setActiveSection('notes'); clearInterval(timerRef.current); setTimerActive(false); }}
 style={{
 padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)',
 background: activeSection === 'notes' ? s.color + '20' : 'transparent',
 color: activeSection === 'notes' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer',
 }}
 >Notes</button>
 {s.qa && (
 <button
 onClick={() => { setActiveSection('qa'); startTimer(); }}
 style={{
 padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)',
 background: activeSection === 'qa' ? s.color + '20' : 'transparent',
 color: activeSection === 'qa' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer',
 }}
 >Q&A</button>
 )}
 {s.quiz && (
 <button
 onClick={() => { setActiveSection('quiz'); startTimer(); }}
 style={{
 padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)',
 background: activeSection === 'quiz' ? s.color + '20' : 'transparent',
 color: activeSection === 'quiz' ? s.color : 'var(--text)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer',
 }}
 >Quiz</button>
 )}
 </div>
 </div>

 {showTimer && timerActive && (
 <div style={{
 padding: '12px 20px', background: s.color + '10', borderBottom: '1px solid var(--border)',
 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
 }}>
 <span style={{ fontWeight: 700, color: s.color }}>?? Time Left: {formatTime(timerSeconds)}</span>
 {timerSeconds === 0 && <span style={{ color: '#ef4444', fontWeight: 600 }}>Time's up!</span>}
 </div>
 )}

 <div style={{ padding: '20px' }}>
 {activeSection === 'notes' && s.notes && (() => { const N = s.notes; return <N />; })()}

 {activeSection === 'qa' && s.qa && (
 <QASection
 questions={s.qa}
 answers={qaAnswers}
 onChange={handleAnswerChange}
 submitted={qaSubmitted}
 score={qaScore}
 onSubmit={handleSubmitQA}
 />
 )}

 {activeSection === 'quiz' && s.quiz && (
 <QuizSection
 questions={s.quiz}
 selected={quizAnswers}
 onSelect={handleQuizSelect}
 submitted={quizSubmitted}
 score={quizScore}
 onSubmit={handleSubmitQuiz}
 />
 )}
 </div>
 </div>
 );
}

// ----- REUSABLE COMPONENTS -----
function QASection({ questions, answers, onChange, submitted, score, onSubmit }) {
 return (
 <div>
 <h2 style={{ color: 'var(--text)', marginBottom: '16px' }}>?? Written Practice</h2>
 {submitted && score !== null && (
 <div style={{
 padding: '10px 16px', borderRadius: '8px', background: score === questions.length ? '#d1fae5' : '#fee2e2',
 color: score === questions.length ? '#65f46' : '#991b1b', fontWeight: 700, marginBottom: '16px',
 }}>
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
 <input
 type="text"
 value={userAns}
 onChange={(e) => onChange(idx, e.target.value)}
 disabled={submitted}
 placeholder="Type your answer..."
 style={{
 width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)',
 fontSize: '.95rem', background: submitted ? '#f9fafb' : '#fff', color: 'var(--text)',
 }}
 />
 {submitted && (
 <div style={{ marginTop: '8px', fontSize: '.85rem' }}>
 {correct ? (
 <span style={{ color: '#16a34a', fontWeight: 600 }}>? Correct!</span>
 ) : (
 <span>
 <span style={{ color: '#dc2626', fontWeight: 600 }}>? Wrong. </span>
 <span style={{ color: '#16a34a' }}>Correct answer: {q.answer}</span>
 </span>
 )}
 </div>
 )}
 </div>
 );
 })}
 </div>
 {!submitted && (
 <button
 onClick={onSubmit}
 style={{
 marginTop: '24px', padding: '14px 32px', background: '#4f46e5', color: '#fff',
 border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
 }}
 >Submit Answers</button>
 )}
 </div>
 );
}

function QuizSection({ questions, selected, onSelect, submitted, score, onSubmit }) {
 return (
 <div>
 <h2 style={{ color: 'var(--text)', marginBottom: '16px' }}>?? Multiple Choice Quiz</h2>
 {submitted && score !== null && (
 <div style={{
 padding: '10px 16px', borderRadius: '8px', background: score === questions.length ? '#d1fae5' : '#fee2e2',
 color: score === questions.length ? '#65f46' : '#991b1b', fontWeight: 700, marginBottom: '16px',
 }}>
 You got {score}/{questions.length} correct!
 </div>
 )}
 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
 {questions.map((q, idx) => {
 const chosen = selected[idx];
 const correctOpt = q.correct;
 return (
 <div key={idx} style={{
 border: '1px solid var(--border)', borderRadius: '12px', padding: '16px',
 background: submitted ? (chosen === correctOpt ? '#f0fdf4' : '#fef2f2') : 'var(--bg)',
 }}>
 <div style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>{idx + 1}. {q.question}</div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
 {q.options.map((opt, optIdx) => {
 const letter = String.fromCharCode(97 + optIdx);
 const isSelected = chosen === letter;
 const isCorrect = letter === correctOpt;
 let bg = 'transparent';
 if (submitted) {
 if (isCorrect) bg = '#d1fae5';
 else if (isSelected && !isCorrect) bg = '#fee2e2';
 } else if (isSelected) {
 bg = '#e0e7ff';
 }
 return (
 <button
 key={optIdx}
 onClick={() => onSelect(idx, letter)}
 disabled={submitted}
 style={{
 display: 'flex', alignItems: 'center', gap: '8px',
 padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
 background: bg, color: 'var(--text)', cursor: submitted ? 'default' : 'pointer',
 fontSize: '.9rem', textAlign: 'left',
 }}
 >
 <span style={{ fontWeight: 700, width: '20px' }}>{letter}.</span>
 <span>{opt}</span>
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
 {!submitted && (
 <button
 onClick={onSubmit}
 style={{
 marginTop: '24px', padding: '14px 32px', background: '#4f46e5', color: '#fff',
 border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
 }}
 >Submit Exam</button>
 )}
 </div>
 );
}

// ---------- MATHEMATICS NOTES ----------

// Helper components
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
function BulletList({ items }) {
 return (
 <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text)' }}>
 {items.map((item, i) => (
 <li key={i} style={{ marginBottom: '6px', fontSize: '.9rem' }}>{item}</li>
 ))}
 </ul>
 );
}

// Q&A and Quiz data for Math (extracted from the content)
const mathQA = [
 { question: 'A large shipping container holds 4,508 boxes of red colored pens and 3,795 boxes of blue colored pens. Use column addition to calculate the total number of pen boxes inside the container.', answer: '8,303 boxes' },
 { question: 'A warehouse receives a shipment of 8,000 bags of agricultural fertilizer. Over the course of a week, local farmers purchase 4,236 bags. Calculate the exact number of fertilizer bags left in storage.', answer: '3,764 bags' },
 { question: 'A local school buys 7 brand new computer systems for its laboratory class. If each individual computer system costs exactly $645, calculate the total financial expenditure for the purchase.', answer: '$4,515' },
 { question: 'A farmer harvests 138 sweet watermelons from their field plots. They pack them into 6 large wooden transport crates, ensuring each crate contains an identical number of watermelons. Calculate how many watermelons are packed into each crate.', answer: '23 watermelons per crate' },
 { question: 'Convert the following improper fraction values into clean, simplified mixed numbers: a) 17/3 b) 25/4', answer: 'a) 5 2/3 b) 6 1/4' },
 { question: 'Solve the following fraction subtraction problem and simplify the final answer to its lowest terms: 9/10 - 3/10', answer: '3/5' },
 { question: 'Convert the following fractional numbers into their matching decimal format equivalents: a) 4/10 b) 75/100', answer: 'a) 0.4 b) 0.75' },
 { question: 'Arrange the following decimal numbers in order from the smallest value to the absolute largest value: 0.45, 0.09, 0.5, 0.32', answer: '0.09, 0.32, 0.45, 0.5' },
 { question: 'A school running track has a length of 45 meters and a width of 20 meters. Calculate: a) The total distance a runner travels to complete one full lap around the outside edge (Perimeter). b) The total flat space enclosed inside the running track boundaries (Area).', answer: 'a) 130 meters b) 900 square meters' },
 { question: 'An angle measures exactly 142°. Classify this angle based on its size and explain your geometric reasoning.', answer: 'Obtuse angle (greater than 90° but less than 180°)' },
];

const mathQuiz = null; // Math uses Q&A but not multiple choice in this content

function MathNotes() {
 return (
 <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
 <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>📘 Mathematics: Grade 4 Comprehensive Guide</h2>

 {/* UNIT 1: PLACE VALUE AND NUMBER SENSE */}
 <Section title="🏛️ Unit 1: Place Value and Number Sense">
 <p>Grade 4 students master numbers up to 1,000,000. They learn to read, write, compare, and round large whole numbers based on the position of each digit.</p>

 <SubSection title="Core Concepts">
 <BulletList items={[
 'The 10-Times Base-Ten Rule: A digit in one place represents ten times what it represents in the place to its right.',
 'Forms of Numbers: Representing numbers in standard form (4,325), expanded form (4,000 + 300 + 20 + 5), and word form (four thousand, three hundred twenty-five).',
 'Comparing Numbers: Using the symbols >, <, and = by comparing digits starting from the highest place value.',
 'Rounding Numbers: Finding an approximate value by looking at the digit to the right of the target place value.'
 ]} />
 </SubSection>

 <SubSection title="Worked Examples">
 <WorkedExample title="Example 1: Place Value Relationships" problem="How many times greater is the value of the 5 in 54,300 than the value of the 5 in 45°,300?">
 <Step>Step 1: Identify the place value of 5 in 54,300. It is in the ten-thousands place, so its value is 50,000.</Step>
 <Step>Step 2: Identify the place value of 5 in 45°,300. It is in the thousands place, so its value is 5,000.</Step>
 <Step>Step 3: Divide the larger value by the smaller value: (50,000  5,000)=10</Step>
 <FinalAnswer>The value of the 5 in 54,300 is 10 times greater.</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 2: Writing in Expanded Form" problem="Write the number 704,329 in expanded form.">
 <Step>Step 1: Break down the number by each digit's place value. 7 is in the hundred-thousands place → 700,000. 0 is in the ten-thousands place → 0. 4 is in the thousands place → 4,000. 3 is in the hundreds place → 300. 2 is in the tens place → 20. 9 is in the ones place → 9.</Step>
 <Step>Step 2: Write as an addition expression, omitting the zero if desired.</Step>
 <FinalAnswer>700,000 + 4,000 + 300 + 20 + 9</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 3: Writing in Word Form" problem="Write the number 84,62 in word form.">
 <Step>Step 1: Read the numbers before the comma as a whole period: 84 → "eighty-four".</Step>
 <Step>Step 2: Add the name of the period: "thousand".</Step>
 <Step>Step 3: Read the three digits after the comma: 62 → "sixty-two".</Step>
 <FinalAnswer>Eighty-four thousand, sixty-two.</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 4: Comparing Large Whole Numbers" problem="Compare the two numbers using &gt;, &lt;, or = : 435,219 ___ 435,291">
 <Step>Step 1: Compare digits from left to right. Hundred-thousands: 4 = 4; Ten-thousands: 3 = 3; Thousands: 5 = 5; Hundreds: 2 = 2; Tens: 1 &lt; 9.</Step>
 <Step>Step 2: Since 1 ten is less than 9 tens, the first number is smaller.</Step>
 <FinalAnswer>435,219 &lt; 435,291</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 5: Rounding to the Nearest Thousand" problem="Round 48,632 to the nearest thousand.">
 <Step>Step 1: Find the digit in the thousands place (8).</Step>
 <Step>Step 2: Look at the digit to its right, which is in the hundreds place (6).</Step>
 <Step>Step 3: Since 6 ≥ 5, round up by adding 1 to the thousands place (8 + 1 = 9) and changing all digits to the right to zeros.</Step>
 <FinalAnswer>49,000</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 6: Rounding to the Nearest Ten Thousand" problem="Round 324,891 to the nearest ten thousand.">
 <Step>Step 1: Find the digit in the ten-thousands place (2).</Step>
 <Step>Step 2: Look at the digit to its right in the thousands place (4).</Step>
 <Step>Step 3: Since 4 &lt; 5, round down by keeping the 2 the same and changing all digits to the right to zeros.</Step>
 <FinalAnswer>320,000</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 7: Constructing the Greatest Possible Number" problem="Use the digits 4, 0, 9, 2, 7, 5 exactly once to make the greatest possible 6-digit number.">
 <Step>Step 1: To make the largest number, place the largest digits in the highest place values.</Step>
 <Step>Step 2: Sort the digits in descending order: 9, 7, 5, 4, 2, 0.</Step>
 <FinalAnswer>975,420</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 8: Constructing the Smallest Possible Number" problem="Use the digits 3, 8, 0, 5, 1 exactly once to make the smallest possible 5-digit number.">
 <Step>Step 1: To make the smallest number, place the smallest digits in the highest place values.</Step>
 <Step>Step 2: The smallest digit is 0, but a number cannot start with 0. Use the next smallest digit, 1, for the first position.</Step>
 <Step>Step 3: Place the remaining digits (0, 3, 5, 8) in ascending order.</Step>
 <FinalAnswer>10,358</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 9: Determining Value from Place Name" problem="What is the value of the digit 6 in the number 261,943?">
 <Step>Step 1: Identify the place value of the digit 6. It is in the ten-thousands place.</Step>
 <Step>Step 2: Multiply 6 by its place value (10,000). 6 10,000=60°,000</Step>
 <FinalAnswer>60°,000</FinalAnswer>
 </WorkedExample>

 <WorkedExample title="Example 10: Multi-Step Place Value Problem" problem="A number has 4 ten-thousands, 14 thousands, 3 hundreds, and 6 ones. What is this number in standard form?">
 <Step>Step 1: Write out each component numerically. 4 ten-thousands = 40,000; 14 thousands = 14,000; 3 hundreds = 300; 6 ones = 6.</Step>
 <Step>Step 2: Add the components together. 40,000+14,000+300+6=54,306</Step>
 <FinalAnswer>54,306</FinalAnswer>
 </WorkedExample>
 </SubSection>
 </Section>

 {/* UNIT 2: MULTI-DIGIT ADDITION AND SUBTRACTION */}
 <Section title="➕ Unit 2: Multi-Digit Addition and Subtraction">
 <p>Students master the standard algorithm for addition and subtraction for multi-digit whole numbers up to 1,000,000, focusing heavily on regrouping (carrying and borrowing).</p>
 <SubSection title="Core Concepts">
 <BulletList items={[
 'Standard Addition Algorithm: Line numbers up vertically by place value, add columns from right to left, and regroup when a column total exceeds 9.',
 'Standard Subtraction Algorithm: Line numbers up vertically, subtract from right to left, and borrow (regroup) from the next left column when the top digit is smaller than the bottom digit.',
 'Subtraction Across Zeros: Regrouping through multiple columns containing zeros.'
 ]} />
 </SubSection>
 <SubSection title="Worked Examples">
 <WorkedExample title="Example 1: Multi-Digit Addition with Carrying" problem="Find the sum of 45°,892 and 36,425.">
 <Step>Step 1: Align the numbers vertically by place value.</Step>
 <Step>Step 2: Add from right to left. Ones: 2 + 5 = 7. Tens: 9 + 2 = 11(write 1, carry 1 to hundreds). Hundreds: 8 + 4 + 1 (carried) = 13 (write 3, carry 1 to thousands). Thousands: 5 + 6 + 1 (carried) = 12 (write 2, carry 1 to ten-thousands). Ten-thousands: 4 + 3 + 1 (carried) = 8.</Step>
 <FinalAnswer>82°,317</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 2: Multi-Digit Subtraction with Borrowing" problem="Calculate 83,415 - 27,163.">
 <Step>Step 1: Align the numbers vertically.</Step>
 <Step>Step 2: Subtract from right to left. Ones: 5 - 3 = 2. Tens: 1 - 6 → borrow from 4 hundreds (4 → 3; 1 ten → 11 tens). 11 - 6 = 5. Hundreds: 3 - 1 = 2. Thousands: 3 - 7 → borrow from 8 ten-thousands (8 → 7; 3 thousands → 13 thousands). 13 - 7 = 6. Ten-thousands: 7 - 2 = 5.</Step>
 <FinalAnswer>56°,252</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 3: Subtraction Across Zeros" problem="Find the difference: 50,000 - 14,328.">
 <Step>Step 1: Align vertically. Since you cannot subtract from 0, borrow from the ten-thousands column (5). The 5 becomes 4. The intermediate zeros become 9, and the final ones place zero becomes 10.</Step>
 <Step>Step 2: Perform subtraction in columns. Ones: 10 - 8 = 2. Tens: 9 - 2 = 7. Hundreds: 9 - 3 = 6. Thousands: 9 - 4 = 5. Ten-thousands: 4 - 1 = 3.</Step>
 <FinalAnswer>35°,672</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 4: Addition Word Problem" problem="A school library has 12,450 fiction books and 8,915 non-fiction books. How many books are in the library in total?">
 <Step>Step 1: Identify the operation needed. "Total" implies addition.</Step>
 <Step>Step 2: Set up and compute 12,450 + 8,915. 12,450\ + 8,915\ 21,365</Step>
 <FinalAnswer>21,365 books.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 5: Subtraction Word Problem" problem="An stadium has a seating capacity of 65,000. For a game, 42,780 tickets were sold. How many seats are left empty?">
 <Step>Step 1: "Left empty" means we need to find the difference between capacity and sold tickets.</Step>
 <Step>Step 2: Set up and compute 65,000 - 42,780. 65,000\ - 42,780\ 22,220</Step>
 <FinalAnswer>22,220 empty seats.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 6: Estimating Sums by Rounding" problem="Estimate the sum of 3,821 + 5,190 by rounding each number to the nearest thousand.">
 <Step>Step 1: Round 3,821 to the nearest thousand → 4,000.</Step>
 <Step>Step 2: Round 5,190 to the nearest thousand → 5,000.</Step>
 <Step>Step 3: Add the rounded numbers. 4,000+5,000=9,000</Step>
 <FinalAnswer>9,000</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 7: Estimating Differences by Rounding" problem="Estimate the difference of 74,209 - 38°,711 by rounding each number to the nearest ten thousand.">
 <Step>Step 1: Round 74,209 to the nearest ten thousand → 70°,000.</Step>
 <Step>Step 2: Round 38°,711 to the nearest ten thousand → 40,000.</Step>
 <Step>Step 3: Subtract the values. 70°,000-40,000=30°,000</Step>
 <FinalAnswer>30°,000</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 8: Two-Step Sum and Difference Problem" problem="A bakery made 1,500 cupcakes. They sold 720 in the morning and 450 in the afternoon. How many cupcakes are left?">
 <Step>Step 1: Find the total number of cupcakes sold. 720+450=1,170</Step>
 <Step>Step 2: Subtract total sold from the starting amount. 1,500-1,170=330</Step>
 <FinalAnswer>330 cupcakes left.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 9: Missing Number in Addition" problem="Find the missing digit A: 5,A23\ + 2,415\ 7,838">
 <Step>Step 1: Check columns from right to left to ensure no carrying affected the target column. Ones: 3 + 5 = 8(Correct). Tens: 2 + 1 = 3(Correct).</Step>
 <Step>Step 2: Look at the hundreds column: A + 4 = 8.</Step>
 <Step>Step 3: Solve for A: A = 8 - 4 = 4.</Step>
 <FinalAnswer>A = 4</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 10: Inverse Operations for Verification" problem="Verify if 4,521 - 1,390 = 3,131 is correct using addition.">
 <Step>Step 1: Use the inverse property. If X - Y = Z, then Z + Y = X.</Step>
 <Step>Step 2: Add 3,131 + 1,390. 3,131\ + 1,390\ 4,521</Step>
 <Step>Step 3: Compare the result to the initial number (4,521). They match.</Step>
 <FinalAnswer>The subtraction is correct.</FinalAnswer>
 </WorkedExample>
 </SubSection>
 </Section>

 {/* UNIT 3: MULTI-DIGIT MULTIPLICATION */}
 <Section title="✖️ Unit 3: Multi-Digit Multiplication">
 <p>Students expand multiplication skills to multiply up to four digits by a one-digit whole number, and multiply two two-digit numbers.</p>
 <SubSection title="Core Concepts">
 <BulletList items={[
 'Area Model: Visualizing multiplication by dividing a rectangle into sections representing place values.',
 'Partial Products: Multiplying each place value separately and then adding the results together.',
 'Standard Algorithm: Multiplying columns sequentially and regrouping place values upward.'
 ]} />
 </SubSection>
 <SubSection title="Worked Examples">
 <WorkedExample title="Example 1: Multiplying 3-Digit by 1-Digit (Area Model)" problem="Calculate 234 × 6 using an area model.">
 <Step>Step 1: Expand 234 into (200 + 30° + 4).</Step>
 <Step>Step 2: Multiply each expanded part by 6: 6 × 200 = 1,200; 6 × 30° = 180°; 6 × 4 = 24.</Step>
 <Step>Step 3: Sum the partial products. 1,200+180°+24=1,404</Step>
 <FinalAnswer>1,404</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 2: Multiplying 4-Digit by 1-Digit (Standard Algorithm)" problem="Find the product of 4,128 × 3.">
 <Step>Step 1: Set up vertically.</Step>
 <Step>Step 2: Multiply columns from right to left. Ones: 3 × 8 = 24 (write 4, carry 2). Tens: 3 × 2 + 2 = 8. Hundreds: 3 × 1 = 3. Thousands: 3 × 4 = 12.</Step>
 <FinalAnswer>12,384</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 3: Multiplying Two 2-Digit Numbers (Partial Products)" problem="Calculate 45° × 23 using partial products.">
 <Step>Step 1: Expand both terms: (40 + 5) × (20 + 3).</Step>
 <Step>Step 2: Find all four individual products: 20 × 40 = 800; 20 × 5 = 100°; 3 × 40 = 120; 3 × 5 = 15°.</Step>
 <Step>Step 3: Add the values together. 800+100°+120+15°=1,35°</Step>
 <FinalAnswer>1,35°</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 4: Multiplying Two 2-Digit Numbers (Standard Algorithm)" problem="Find the product of 37 × 64 using the standard algorithm.">
 <Step>Step 1: Multiply 37 by the ones digit (4). 37 4=148</Step>
 <Step>Step 2: Place a placeholder zero in the ones column, then multiply 37 by the tens digit (6). 37 60°=2,220</Step>
 <Step>Step 3: Add the two layers together. 148\ + 2220\ 2,368</Step>
 <FinalAnswer>2,368</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 5: Multiplicative Comparison Word Problem" problem="Sarah has 8 stickers. Mark has 4 times as many stickers as Sarah. How many stickers does Mark have?">
 <Step>Step 1: Identify the scale relationship. Mark's total is 4 × Sarah's total.</Step>
 <Step>Step 2: Calculate. 4 8=32</Step>
 <FinalAnswer>32 stickers.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 6: Multi-Step Multiplicative Word Problem" problem="A theater has 12 rows of seats with 25° seats in each row. If 3 rows are completely empty, how many seats are filled?">
 <Step>Step 1: Find the total number of occupied rows. 12 - 3 = 9rows</Step>
 <Step>Step 2: Multiply occupied rows by seats per row. 9 25°=225</Step>
 <FinalAnswer>225 seats filled.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 7: Multiplying Multiples of 10" problem="Solve 70° × 400.">
 <Step>Step 1: Count the total number of trailing zeros in both numbers. There are 3 zeros (1 from 70°, 2 from 400).</Step>
 <Step>Step 2: Multiply the remaining non-zero basic facts. 7 4=28</Step>
 <Step>Step 3: Append the three zeros to the product.</Step>
 <FinalAnswer>28,000</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 8: Distributive Property application" problem="Solve 8 × 97 using the distributive property.">
 <Step>Step 1: Rewrite 97 as a difference from a benchmark number: (100° - 3).</Step>
 <Step>Step 2: Distribute the factor 8. 8 (100°-3)=(8 100°)-(8 3)</Step>
 <Step>Step 3: Evaluate and subtract. 800-24=776</Step>
 <FinalAnswer>776</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 9: Estimating Products" problem="Estimate the product of 58 × 32.">
 <Step>Step 1: Round 58 to the nearest ten → 60°.</Step>
 <Step>Step 2: Round 32 to the nearest ten → 30°.</Step>
 <Step>Step 3: Multiply the rounded terms. 60° 30°=1,800</Step>
 <FinalAnswer>1,800</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 10: Finding Patterns in Multiplication" problem="Find the pattern value of 9 × 5,000 using base-ten facts.">
 <Step>Step 1: Identify the base fact: 9 × 5 = 45°.</Step>
 <Step>Step 2: Multiply by 10 columns: 9 × 50 = 450.</Step>
 <Step>Step 3: Multiply by 100° columns: 9 × 500 = 4,500.</Step>
 <Step>Step 4: Multiply by 1,000 columns: 9 × 5,000 = 45°,000.</Step>
 <FinalAnswer>45°,000</FinalAnswer>
 </WorkedExample>
 </SubSection>
 </Section>

 {/* UNIT 4: WHOLE-NUMBER DIVISION */}
 <Section title="➗ Unit 4: Whole-Number Division">
 <p>Students learn to divide numbers up to four digits by a one-digit divisor, including calculations that result in remainders.</p>
 <SubSection title="Core Concepts">
 <BulletList items={[
 'Quotient and Remainder: The quotient is the result of division, and the remainder is the leftover amount that cannot be divided evenly.',
 'Area Model for Division: Finding the missing length of a rectangle when the area and width are known.',
 'Partial Quotients: Dividing in chunks and summing up the partial results.'
 ]} />
 </SubSection>
 <SubSection title="Worked Examples">
 <WorkedExample title="Example 1: Division without Remainder" problem="Compute 156 ÷ 4.">
 <Step>Step 1: Break 156 into manageable numbers that divide evenly by 4, such as (120 + 36).</Step>
 <Step>Step 2: Divide each component by 4: (120  4)=30°; (36  4)=9</Step>
 <Step>Step 3: Add the partial quotients together. 30°+9=39</Step>
 <FinalAnswer>39</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 2: Division with a Remainder" problem="Divide 87 by 5.">
 <Step>Step 1: Find the largest multiple of 5 less than or equal to 87. That is 85° (5 × 17 = 85°).</Step>
 <Step>Step 2: Subtract that product from the dividend to find the remainder. 87-85°=2</Step>
 <FinalAnswer>17 R 2</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 3: Long Division Algorithm (3-Digit by 1-Digit)" problem="Solve 734 ÷ 3 using long division steps.">
 <Step>Step 1: Divide hundreds column: 7 ÷ 3 = 2 with a remainder of 1. Write 2 on top.</Step>
 <Step>Step 2: Bring down 3 to make 13. Divide by 3: 13 ÷ 3 = 4 with a remainder of 1. Write 4 on top.</Step>
 <Step>Step 3: Bring down 4 to make 14. Divide by 3: 14 ÷ 3 = 4 with a remainder of 2. Write 4 on top.</Step>
 <Step>Step 4: The leftover value 2 is the remainder.</Step>
 <FinalAnswer>244 R 2</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 4: Area Model for Division" problem="Solve 432 ÷ 6 using an area model.">
 <Step>Step 1: Set up a rectangle with a known width of 6 and a total area value of 432.</Step>
 <Step>Step 2: Subtract a large multiple, like 6 × 70° = 420. Remaining area: 432 - 420 = 12.</Step>
 <Step>Step 3: Divide the remaining area by the width: 12 ÷ 6 = 2.</Step>
 <Step>Step 4: Add the side length pieces together: 70° + 2 = 72.</Step>
 <FinalAnswer>72</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 5: Division Word Problem with Remainder Meaning" problem="There are 35° students going on a field trip. Each car can hold 4 students. How many cars are needed to transport all students?">
 <Step>Step 1: Divide the number of students by car capacity: 35° ÷ 4.</Step>
 <Step>Step 2: Calculate: 4 × 8 = 32, leaving a remainder of 3. So, 35° ÷ 4 = 8 R 3.</Step>
 <Step>Step 3: Interpret the remainder. Since 3 students are left over, an extra car is needed. 8+1=9</Step>
 <FinalAnswer>9 cars.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 6: Division Word Problem (Dropped Remainder)" problem="A worker has 50 apples to pack into boxes of 6. How many full boxes can she pack?">
 <Step>Step 1: Divide 50 by 6.</Step>
 <Step>Step 2: Calculate: 6 × 8 = 48, with a remainder of 2. So, 50 ÷ 6 = 8 R 2.</Step>
 <Step>Step 3: Interpret the remainder. The problem asks for full boxes, so drop the remaining 2 apples.</Step>
 <FinalAnswer>8 full boxes.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 7: Dividing 4-Digit by 1-Digit Numbers" problem="Solve 4,824 ÷ 8.">
 <Step>Step 1: Divide columns from left to right. 4 ÷ 8 → 0. 48 ÷ 8 = 6. 2 ÷ 8 = 0, bring down the next digit to make 24. 24 ÷ 8 = 3.</Step>
 <FinalAnswer>603</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 8: Checking Division with Multiplication" problem="Verify the calculation 143 ÷ 7 = 20 R 3.">
 <Step>Step 1: Use the formula: Quotient × Divisor + Remainder = Dividend.</Step>
 <Step>Step 2: Substitute the values: (20 7)+3=140+3=143</Step>
 <Step>Step 3: The result matches the dividend.</Step>
 <FinalAnswer>The division calculation is correct.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 9: Finding Missing Factor Via Division" problem="Find the value of N if 7 × N = 105°.">
 <Step>Step 1: Rearrange the equation using inverse operations: N = 105° ÷ 7.</Step>
 <Step>Step 2: Calculate the quotient. 105° 7=15°</Step>
 <FinalAnswer>N = 15°</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 10: Multi-Step Word Problem Using Division" problem="A group of 4 friends sell crafts and earn 360°. They spend 40 on supplies and split the remaining money equally. How much does each person get?">
 <Step>Step 1: Subtract the supply costs from the total earnings. 360°-40=320</Step>
 <Step>Step 2: Divide the remaining profit by the number of friends. 320 4=80°</Step>
 <FinalAnswer>80° each.</FinalAnswer>
 </WorkedExample>
 </SubSection>
 </Section>

 {/* UNIT 5: FACTORS, MULTIPLES, AND PATTERNS */}
 <Section title="🧮 Unit 5: Factors, Multiples, and Patterns">
 <p>Students investigate number theory concepts, learning to break numbers down into factors, identify multiples, and generate algebraic shape or number sequences.</p>
 <SubSection title="Core Concepts">
 <BulletList items={[
 'Factors: Whole numbers that multiply together to get another number.',
 'Multiples: The product of a given whole number and any other whole number.',
 'Prime Numbers: Whole numbers greater than 1 that have exactly two factors: 1 and themselves.',
 'Composite Numbers: Whole numbers greater than 1 that have more than two factors.'
 ]} />
 </SubSection>
 <SubSection title="Worked Examples">
 <WorkedExample title="Example 1: Finding All Factor Pairs" problem="List all the factor pairs for the number 24.">
 <Step>Step 1: Find pairs of whole numbers that multiply to 24, starting from 1. 1 × 24 = 24; 2 × 12 = 24; 3 × 8 = 24; 4 × 6 = 24.</Step>
 <Step>Step 2: 5 is not a factor. The next number is 6, which is already listed.</Step>
 <FinalAnswer>The factor pairs are (1, 24), (2, 12), (3, 8), and (4, 6).</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 2: Determining Multiples" problem="List the first five multiples of the number 7.">
 <Step>Step 1: Multiply 7 sequentially by the whole numbers 1, 2, 3, 4, and 5. 7 × 1 = 7; 7 × 2 = 14; 7 × 3 = 21; 7 × 4 = 28; 7 × 5 = 35°.</Step>
 <FinalAnswer>7, 14, 21, 28, 35°</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 3: Prime vs. Composite Identification" problem="Determine whether the number 17 is prime or composite.">
 <Step>Step 1: Identify the factors of 17.</Step>
 <Step>Step 2: Test numbers up to 17. Only 1 and 17 divide into it evenly.</Step>
 <FinalAnswer>17 is prime because it has exactly two factors.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 4: Identifying Composite Numbers" problem="Determine whether the number 15° is prime or composite.">
 <Step>Step 1: Find all factors of 15°.</Step>
 <Step>Step 2: 1 × 15° = 15° and 3 × 5 = 15°. The factors are 1, 3, 5, and 15°.</Step>
 <FinalAnswer>15° is a composite number because it has more than two factors.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 5: Extending an Arithmetic Pattern" problem="Find the next two terms in the number sequence: 4, 11, 18, 25°, ...">
 <Step>Step 1: Find the rule of change between consecutive terms. 11-4=7; 18-11=7. The rule is to add 7.</Step>
 <Step>Step 2: Apply the rule to the last known term (25°). 25°+7=32; 32+7=39</Step>
 <FinalAnswer>32, 39</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 6: Geometric Pattern Analysis" problem="A pattern uses shapes: Shape 1 has 3 squares, Shape 2 has 6 squares, and Shape 3 has 9 squares. How many squares are in Shape 6?">
 <Step>Step 1: Identify the relationship between the shape number and the number of squares. Shape 1 → 1 × 3 = 3; Shape 2 → 2 × 3 = 6. The rule is: Number of squares = Shape number × 3.</Step>
 <Step>Step 2: Calculate for Shape 6. 6 3=18</Step>
 <FinalAnswer>18 squares.</FinalAnswer>
 </WorkedExample>
 <WorkedExample title="Example 7: Common Factor Identification" problem="What is the greatest common factor of 12 and 18?">
 <Step>Step 1: List all factors of 12: 1, 2, 3, 4, 6, 12.</Step>
 <Step>Step 2: List all factors of 18: 1, 2, 3, 6, 9, 18.</Step>
 <Step>Step 3: Find the common values: 1, 2, 3, 6. The largest is 6.</Step>
 <FinalAnswer>6</FinalAnswer>
 </WorkedExample>
 </SubSection>
 </Section>

 {/* UNIT: GEOMETRY AND MEASUREMENT */}
 <Section title="Multi-Digit Geometry and Measurement">
 <p>This unit builds a deep understanding of geometric concepts, perimeter, area, and line plots. In Grade 4 mathematics, students transition from counting square tiles to applying standard mathematical formulas. You will learn how to analyze angles, classify shapes based on their lines and angles, find missing dimensions, and organize measurement data systematically.</p>

 <SubSection title="🧩 Core Concept 1: Advanced Perimeter and Area Formulas">
 <p>In Grade 3, you learned to find area by counting unit squares. In Grade 4, we use formulas to calculate the spatial dimensions of rectangles.</p>
 <BulletList items={[
 'Perimeter (P): The total distance around the outside of a two-dimensional shape. Formula: P=2 (length+width) or P=2l+2w',
 'Area (A): The total amount of space inside the boundaries of a flat shape. Formula: A=length width or A=l w',
 'Finding Missing Sides: If you know the total area or perimeter and one side length, you can use inverse operations (division or subtraction) to find the unknown side.'
 ]} />
 <SubSection title="📝 Worked Examples (Concept 1)">
 <WorkedExample title="1. Calculating Basic Area and Perimeter" problem="A rectangular backyard has a length of 12 meters and a width of 8 meters. Find its perimeter and area.">
 <Step>Step 1 (Find Perimeter): Use the formula P = 2l + 2w. P=(2 12)+(2  8)=24 + 16 = 40meters</Step>
 <Step>Step 2 (Find Area): Use the formula A = l w. A=12 8=96 square meters</Step>
 </WorkedExample>
 <WorkedExample title="2. Finding a Missing Width from Area" problem="A rectangular digital screen has an area of 54 square inches. Its length is 9 inches. What is its width?">
 <Step>Step 1 (Set up equation): Use A = l w. 54=9 w</Step>
 <Step>Step 2 (Isolate the variable): Divide the area by the known length. w=54 9=6 inches</Step>
 </WorkedExample>
 <WorkedExample title="3. Finding a Missing Length from Perimeter" problem="A rectangular picture frame requires 32 inches of wood molding to go around its border. If its width is 6 inches, what is its length?">
 <Step>Step 1 (Subtract known sides): The total perimeter is 32. Two widths account for 6 + 6 = 12inches. 32 - 12 = 20inches (remaining for two lengths)</Step>
 <Step>Step 2 (Divide by 2): Split the remaining distance equally between the two lengths. Length=20 2=10 inches</Step>
 </WorkedExample>
 <WorkedExample title="4. Maximizing Area with Fixed Perimeter" problem="A farmer has 24 meters of fencing to build a rectangular pen. List all possible whole-number dimensions and find which one creates the largest area.">
 <Step>Step 1 (Find combinations where 2l + 2w = 24): This means l + w = 12. Option A: 11 1 Area = 11 m^2. Option B: 10 2 Area = 20 m^2. Option C: 9 3 Area = 27 m^2. Option D: 8 4 Area = 32 m^2. Option E: 7 5 Area = 35° m^2. Option F: 6 6 Area = 36 m^2.</Step>
 <Step>Step 2 (Identify max area): A square layout (6 m 6 m) yields the largest area of 36 square meters.</Step>
 </WorkedExample>
 <WorkedExample title="5. Cost of Flooring Layout" problem="A rectangular classroom measures 9 meters long and 7 meters wide. Carpet tiles cost \$5 per square meter. How much will it cost to carpet the room?">
 <Step>Step 1 (Find Area): Multiply length by width. A=9 7=63 square meters</Step>
 <Step>Step 2 (Calculate Cost): Multiply total area by price per square meter. 63 5=\$315</Step>
 </WorkedExample>
 <WorkedExample title="6. Finding the Border Perimeter" problem="A square playground has an area of 64 square yards. What is the total perimeter of the playground?">
 <Step>Step 1 (Find side length): For a square, Side Side = Area. Find the number that multiplies by itself to get 64. 64=8 yards</Step>
 <Step>Step 2 (Find Perimeter): Multiply the side length by 4. P=8 4=32 yards</Step>
 </WorkedExample>
 <WorkedExample title="7. Word Problem: Fencing with a Missing Side" problem="A storage unit with a rectangular floor has an area of 120 square feet. The short wall is 8 feet long. How long is the longer wall?">
 <Step>Step 1 (Divide Area by known side): Divide 120 by 8. Long wall=120 8=15° feet</Step>
 </WorkedExample>
 <WorkedExample title="8. Doubling Dimensions Impact on Area" problem="A rectangular banner is 3 feet long and 2 feet wide. If you double both its length and width, how does the area change?">
 <Step>Step 1 (Original Area): 3 2 = 6 sq ft.</Step>
 <Step>Step 2 (New Dimensions and Area): New length = 6 ft, new width = 4 ft. New Area=6 4=24 sq ft</Step>
 <Step>Step 3 (Analyze scale factor): 24 6 = 4. The area quadrupled (increased by 4 times).</Step>
 </WorkedExample>
 <WorkedExample title="9. Designing a Walking Path" problem="A community garden needs a walking path installed around its perimeter. The garden is 15° meters long and 10 meters wide. What is the total length of the walking path?">
 <Step>Step 1 (Calculate Perimeter): P=2 (15°+10)=2 25°=50 meters</Step>
 </WorkedExample>
 <WorkedExample title="10. Complex Perimeter Word Problem" problem="A rectangular swimming pool has a perimeter of 60° meters. If the length is 20 meters, what is the width of the pool?">
 <Step>Step 1 (Determine total of both widths): Subtract two lengths (20 + 20 = 40) from total perimeter. 60° - 40 = 20meters</Step>
 <Step>Step 2 (Find single width): Divide the remaining value by 2. Width=20 2=10 meters</Step>
 </WorkedExample>
 </SubSection>
 </SubSection>

 <SubSection title="🧩 Core Concept 2: Decomposing Rectilinear Shapes">
 <p>Not all real-world spaces are simple rectangles. An L-shaped room, a T-shaped patio, or a stepped layout is called a rectilinear shape. To find the total area or perimeter of these shapes, you must cut (decompose) them into simpler, non-overlapping rectangles.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` 4 cm
 +---------+

 | | 3 cm
 | A |
 +---------+-----+

 | | 5 cm
 | B |
 +---------------+
 10 cm`}</pre>
 <BulletList items={[
 'Decomposing Area: Slice the shape into Rectangle A and Rectangle B. Find the area of each separately using A = l w, then add the areas together.',
 'Finding Missing Sides: Use opposing parallel sides to calculate missing lengths before finding the perimeter.'
 ]} />
 <SubSection title="📝 Worked Examples (Concept 2)">
 <WorkedExample title="11. Area of an L-Shaped Region" problem="Find the total area of an L-shaped floor plan. The top horizontal side is 4 cm, the total left vertical side is 8 cm, the bottom horizontal edge is 10 cm, and the far-right vertical edge is 5 cm.">
 <Step>Step 1 (Decompose horizontally): Split it into a top vertical rectangle (A) and a bottom flat rectangle (B).</Step>
 <Step>Step 2 (Find dimensions of A): Top width is 4 cm. Height is total height minus right height: 8 - 5 = 3cm. Area A=4 3=12 cm</Step>
 <Step>Step 3 (Find dimensions of B): Bottom length is 10 cm, height is 5 cm. Area B=10 5=50 cm</Step>
 <Step>Step 4 (Combine): Total Area=12 + 50 = 62square centimeters</Step>
 </WorkedExample>
 <WorkedExample title="12. Perimeter of an L-Shaped Region" problem="Find the perimeter of the same L-shaped region from Example 11 with outer edges: Top=4 cm, Left=8 cm, Bottom=10 cm, Right=5 cm.">
 <Step>Step 1 (Find missing inner edges): Missing inner horizontal edge = Bottom - Top = 10 - 4 = 6cm. Missing inner vertical edge = Left - Right = 8 - 5 = 3cm.</Step>
 <Step>Step 2 (Sum all 6 outer sides): P=4+3+6+5+10 + 8 = 36cm</Step>
 </WorkedExample>
 <WorkedExample title="13. Subtracting an Inner Cutout Area" problem="A large piece of cardboard is 12 inches by 10 inches. A square measuring 3 inches on each side is cut out from the center. What is the remaining area of cardboard?">
 <Step>Step 1 (Find Outer Area): 12 10 = 120 sq inches.</Step>
 <Step>Step 2 (Find Inner Cutout Area): 3 3 = 9 sq inches.</Step>
 <Step>Step 3 (Subtract): Remaining Area=120 - 9 = 111square inches</Step>
 </WorkedExample>
 <WorkedExample title="14. Combining Two Equal Rectangles" problem="Two identical tables measuring 5 feet long and 3 feet wide are pushed together along their long edges to make a giant table. What is the area of the combined table?">
 <Step>Step 1 (Find area of one table): 5 3 = 15° sq ft.</Step>
 <Step>Step 2 (Multiply by 2): Total Area=15° 2=30° square feet</Step>
 </WorkedExample>
 <WorkedExample title="15°. Finding Perimeter of Combined Shapes" problem="Two identical square mats with side lengths of 6 feet are placed side-by-side to make a long rectangle. What is the perimeter of this new rectangle?">
 <Step>Step 1 (Determine new dimensions): The new length becomes 6 + 6 = 12feet. The width remains 6 feet.</Step>
 <Step>Step 2 (Calculate Perimeter): P=2 (12+6)=2 18=36 feet</Step>
 </WorkedExample>
 <WorkedExample title="16. Area of a T-Shaped Sign" problem="A wooden sign is shaped like a capital letter 'T'. The horizontal crossbar is 8 inches wide and 2 inches tall. The vertical stem is 2 inches wide and 6 inches tall. Find the total surface area.">
 <Step>Step 1 (Area of Crossbar): 8 2 = 16 sq inches.</Step>
 <Step>Step 2 (Area of Stem): 2 6 = 12 sq inches.</Step>
 <Step>Step 3 (Add together): Total Area=16 + 12 = 28square inches</Step>
 </WorkedExample>
 <WorkedExample title="17. Perimeter of a Steps Design" problem="A set of steps carved into stone forms a staircase profile. The base is 15° cm long and the absolute vertical rise is 12 cm. If it forms a perfect stepped pattern, what is its perimeter?">
 <Step>Step 1 (Identify structural rule): For standard stepped rectilinear shapes, the sum of all small horizontal steps equals the base (15° cm), and the sum of all small vertical steps equals the total rise (12 cm).</Step>
 <Step>Step 2 (Calculate total): P=15° (base)+12 (rise)+15° (steps horizontal)+12 (steps vertical)=54 cm</Step>
 </WorkedExample>
 <WorkedExample title="18. Area of a Complex Pathway" problem="A concrete courtyard features a large 20 m 15° m rectangle with an inner grass lawn of 10 m 8 m in the middle. Find the area covered only by concrete.">
 <Step>Step 1 (Total Courtyard Area): 20 15° = 300 m^2.</Step>
 <Step>Step 2 (Lawn Area): 10 8 = 80° m^2.</Step>
 <Step>Step 3 (Subtract): Concrete Area=300 - 80° = 220square meters</Step>
 </WorkedExample>
 <WorkedExample title="19. Decomposing a U-Shaped Bracket" problem="A metal bracket is shaped like a 'U'. The bottom base line is 14 mm long and 3 mm thick. The two vertical arms extending upwards are each 5 mm high and 3 mm wide. What is its total area?">
 <Step>Step 1 (Area of Base): 14 3 = 42 mm^2.</Step>
 <Step>Step 2 (Area of Two Arms): Each arm has a height of 5 mm and width of 3 mm. Area of one arm=5 3=15° mm Both arms=15° 2=30° mm</Step>
 <Step>Step 3 (Sum total): Total Area=42 + 30° = 72square millimeters</Step>
 </WorkedExample>
 <WorkedExample title="20. Missing Variable Side Challenge" problem="An irregular six-sided polygon has horizontal lengths of 22 inches (top) and 14 inches (partial bottom step). What is the length of the remaining parallel bottom step?">
 <Step>Step 1 (Subtract known parallel segment): Missing step=22 - 14 = 8inches</Step>
 </WorkedExample>
 </SubSection>
 </SubSection>

 <SubSection title="🧩 Core Concept 3: Understanding Angles and Protractor Measurement">
 <p>An angle is formed where two rays share a common endpoint called a vertex. Angles are measured in degrees (°), which represent a fraction of a full circle turn (360°).</p>
 <BulletList items={[
 'Types of Angles: Acute Angle: Measures less than 90. Right Angle: Measures exactly 90 (forms a square corner). Obtuse Angle: Measures greater than 90 but less than 180. Straight Angle: Measures exactly 180 (forms a flat straight line).',
 'Using a Protractor: Align the center mark of the protractor with the vertex of the angle. Line up one baseline ray with 0. Read the measurement scale where the second ray crosses the outer arc.'
 ]} />
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` Acute (&lt; 90°) Right (90°) Obtuse (&gt; 90°)
 / | 
 / | 
 /____ |____ ____`}</pre>
 <SubSection title="📝 Worked Examples (Concept 3)">
 <WorkedExample title="21. Identifying Angle Types" problem="Classify the following angle measurements: 45°, 90°, 135°, 180°.">
 <Step>Step 1: 45° is less than 90° Acute.</Step>
 <Step>Step 2: 90° is exactly 90° Right.</Step>
 <Step>Step 3: 135° is between 90° and 180° Obtuse.</Step>
 <Step>Step 4: 180° is exactly 180° Straight.</Step>
 </WorkedExample>
 <WorkedExample title="22. Reading a Double-Scale Protractor" problem="An angle opens to the right. One ray is at 0 on the inner scale. The other ray passes through the markings labeled 60° and 120. If the angle is clearly smaller than a right angle, what is its measurement?">
 <Step>Step 1 (Determine classification): The angle is visibly narrow (acute).</Step>
 <Step>Step 2 (Select appropriate scale value): Choose the number less than 90°. Angle=60°</Step>
 </WorkedExample>
 <WorkedExample title="23. Fraction of a Full Circle Turn" problem="A dial turns through (1 4) of a complete circle. How many degrees did the dial rotate?">
 <Step>Step 1 (Set up fraction of 360°): Multiply the fraction by the total circle degrees. 360° 4=90°</Step>
 </WorkedExample>
 <WorkedExample title="24. Calculating Degrees from a Clock Face" problem="The hour hand of a clock moves from 12:0 to 2:0. Given that a full clock face is 360° divided into 12 hours, how many degrees did it rotate?">
 <Step>Step 1 (Find degrees per hour): 360° 12 = 30° per hour.</Step>
 <Step>Step 2 (Multiply by elapsed hours): 2 hours have passed. 30° 2=60°</Step>
 </WorkedExample>
 <WorkedExample title="25°. Advanced Turn Fraction Problems" problem="A skateboarder performs a trick where they turn (3 6) of a full circle in mid-air. Calculate the degrees turned.">
 <Step>Step 1 (Simplify fraction or compute directly): (3 6) is equal to (1 2).</Step>
 <Step>Step 2 (Calculate): 360° 2=180°</Step>
 </WorkedExample>
 <WorkedExample title="26. Recognizing Right Angles inside Shapes" problem="How many right angles are found inside a standard capital letter 'E'?">
 <Step>Step 1 (Count intersection corners): There are 4 inside corners where horizontal segments meet the vertical spine at 90°. Answer=4 right angles</Step>
 </WorkedExample>
 <WorkedExample title="27. Interpreting a Protractor Alignment Error" problem="A student measures an angle but forgets to start at 0. The bottom ray sits on 10 and the top ray sits on 85°. What is the true measure of the angle?">
 <Step>Step 1 (Find the difference): Subtract the initial starting alignment value from the final value. 85°-10=75°</Step>
 </WorkedExample>
 <WorkedExample title="28. Estimating Dynamic Real-World Angles" problem="A laptop screen is opened up so that it tilts back past a vertical right angle. Is the angle between the keyboard and the screen acute, right, or obtuse?">
 <Step>Step 1 (Evaluate against 90° benchmark): Since it tilts backwards past a square corner, it measures greater than 90°. Answer=Obtuse</Step>
 </WorkedExample>
 <WorkedExample title="29. Calculating a Multi-Step Circle Turn" problem="A sprinkler rotates through an angle of 15° six times in a row. What is the total angle of rotation?">
 <Step>Step 1 (Multiply single unit turn by frequency): 15° 6=90°</Step>
 </WorkedExample>
 <WorkedExample title="30°. Verifying a Straight Line Split" problem="A straight line track splits into a path turning away at 115°. What type of angle does this split path form with the remaining segment?">
 <Step>Step 1 (Classify the angle value): 115° is larger than 90° but smaller than 180°. Answer=Obtuse</Step>
 </WorkedExample>
 </SubSection>
 </SubSection>

 <SubSection title="🧩 Core Concept 4: Additive Angles and Missing Angle Measures">
 <p>Angles are additive. If an angle is split into multiple non-overlapping parts, the total measurement is the sum of the individual smaller parts. Formula: Total= A+ B You can use this property to find missing angles on straight lines (180°) and right angles (90°).</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` /
 / Path 2 (Angle B)
 /
 +------- Path 1 (Angle A)
 /
 / Main Base Line`}</pre>
 <SubSection title="📝 Worked Examples (Concept 4)">
 <WorkedExample title="31. Finding a Missing Part of a Right Angle" problem=" XYZ is a right angle (90°). It is divided into two smaller adjacent angles. One angle measures 38°. What is the measure of the other angle (n)?">
 <Step>Step 1 (Set up subtraction from 90°): n=90°-38°=52°</Step>
 </WorkedExample>
 <WorkedExample title="32. Finding a Missing Part on a Straight Line" problem="Two angles sit on a straight line, forming a straight angle (180°). If one angle measures 124, what is the measure of the missing angle (x)?">
 <Step>Step 1 (Set up subtraction from 180°): x=180°-124=56°</Step>
 </WorkedExample>
 <WorkedExample title="33. Combining Three Adjacent Angles" problem="A large display angle is composed of three smaller adjacent sections measuring 25°, 40, and 15°. What is the total combined measurement?">
 <Step>Step 1 (Sum all component parts): Total=25°+40+15°=80°</Step>
 </WorkedExample>
 <WorkedExample title="34. Solving for Two Identical Split Angles" problem="A right angle (90°) is divided into three equal parts. What is the measurement of each part?">
 <Step>Step 1 (Divide by number of parts): Each angle=90° 3=30°</Step>
 </WorkedExample>
 <WorkedExample title="35°. Overlapping Angle Word Problem" problem="A gate opens to a total angle of 105°. It passes through an intermediate latch post at 45°. How many more degrees must it turn to open fully?">
 <Step>Step 1 (Find remaining distance): Subtract the first segment from the total goal. 105°-45°=60°</Step>
 </WorkedExample>
 <WorkedExample title="36. Complex Multi-Angle Straight Line Equation" problem="Three angles sit on a straight line. The first measures 55° and the second measures 70°. Find the third angle (y).">
 <Step>Step 1 (Add known parts): 55° + 70° = 125°^.</Step>
 <Step>Step 2 (Subtract from straight line total): y=180°-125°=55°</Step>
 </WorkedExample>
 <WorkedExample title="37. Vertical Right-Angle Cross Verification" problem="A crossroad intersection forms four corners. If one corner is verified to be 90°, what must the sum of the other three corners be?">
 <Step>Step 1 (Calculate remaining circle degrees): Total circle is 360°. 360°-90°=270°</Step>
 </WorkedExample>
 <WorkedExample title="38°. Perpendicular Line Verification" problem="Line A intersects Line B to create two adjacent angles that are exactly equal. If they sit on a straight baseline, what is the measure of each angle?">
 <Step>Step 1 (Divide 180° by 2): 180° 2=90° (The lines are perpendicular)</Step>
 </WorkedExample>
 <WorkedExample title="39. Mechanical Rotation Target" problem="A crane arm needs to make a total rotation of 160. It has already completed a turn of 82°. How many degrees of rotation remain?">
 <Step>Step 1 (Subtract completed from total): 160-82°=78°</Step>
 </WorkedExample>
 <WorkedExample title="40. Real-World Roof Pitch Angles" problem="An asymmetrical roof peak line meets at a flat horizontal ceiling line. If the left pitch angle inside is 35° and the right pitch angle inside is 45°, what is the angle of the roof peak at the top?">
 <Step>Step 1 (Use triangle rule: sum of interior angles is 180°): Add known base angles. 35°+45°=80°</Step>
 <Step>Step 2 (Subtract from 180°): Peak Angle=180°-80°=100°</Step>
 </WorkedExample>
 </SubSection>
 </SubSection>

 <SubSection title="🧩 Core Concept 5: Classifying Shapes by Lines and Angles">
 <p>In Grade 4, shapes are classified using their geometric properties, such as lines and angles.</p>
 <BulletList items={[
 'Line Relationships: Parallel Lines: Lines that stay the same distance apart and never intersect. Perpendicular Lines: Lines that cross each other to form right angles (90).',
 'Triangle Classification: Right Triangle: Contains exactly one 90 right angle.',
 'Quadrilateral Properties: Rectangle: 4 right angles, opposite sides parallel and equal. Square: 4 right angles, 4 equal sides, opposite sides parallel. Rhombus: 4 equal sides, opposite sides parallel (angles do not have to be 90). Trapezoid: Has exactly one pair of parallel sides.'
 ]} />
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` Parallel Lines Perpendicular Lines Right Triangle
 ============ | | 
 +--- |___`}</pre>
 <SubSection title="📝 Worked Examples (Concept 5)">
 <WorkedExample title="41. Identifying Parallel Lines in Quadrilaterals" problem="How many pairs of parallel sides does a standard regular hexagon have?">
 <Step>Step 1 (Analyze opposite edges): Examine each pair of opposite sides. A hexagon has 3 pairs of parallel lines. Answer=3 pairs</Step>
 </WorkedExample>
 <WorkedExample title="42. Classifying Triangles by Angles" problem="A triangle has interior angle measurements of 30°, 60°, and 90°. Classify this triangle.">
 <Step>Step 1 (Check for a right angle): It contains a 90° angle. Answer=Right Triangle</Step>
 </WorkedExample>
 <WorkedExample title="43. Differentiating a Rhombus from a Square" problem="A four-sided polygon has four equal sides of 5 inches each. Its corner angles measure 70°, 110°, 70°, and 110°. Is this a square or a rhombus?">
 <Step>Step 1 (Check angle values): A square requires four 90° angles. This shape does not have right angles, but all four sides are equal. Answer=Rhombus</Step>
 </WorkedExample>
 <WorkedExample title="44. Identifying Perpendicular Lines in Letters" problem="Which of these uppercase letters contains perpendicular line segments? A, M, T, V">
 <Step>Step 1 (Look for right angles): Letter 'T' has a horizontal bar crossing a vertical post at a 90° angle. Answer=T</Step>
 </WorkedExample>
 <WorkedExample title="45°. Properties of a Trapezoid" problem="A shape has a top side of 6 cm and a bottom side of 12 cm that run perfectly parallel. The two side walls tilt inward and are not parallel. Classify this shape.">
 <Step>Step 1 (Count parallel pairs): It has exactly one pair of parallel sides. Answer=Trapezoid</Step>
 </WorkedExample>
 <WorkedExample title="46. Counting Right Angles in a Trapezoid" problem="Can a trapezoid have right angles? Draw or analyze a right-angled trapezoid.">
 <Step>Step 1 (Analyze layout): Yes, if one side leg is perpendicular to both parallel bases, it creates 2 right angles. Answer=Yes, it can have up to 2 right angles</Step>
 </WorkedExample>
 <WorkedExample title="47. Finding Hidden Triangles" problem="If you draw a diagonal line from one corner to the opposite corner of a rectangle, what two shapes do you create?">
 <Step>Step 1 (Examine the resulting shapes): Slicing a rectangle diagonally creates two identical triangles, each keeping one original 90° corner. Answer=2 Right Triangles</Step>
 </WorkedExample>
 <WorkedExample title="48. Counting Parallel Pairs in a Parallelogram" problem="How many pairs of parallel lines are present in a standard parallelogram?">
 <Step>Step 1 (Examine definitions): By definition, both pairs of opposite sides run parallel. Answer=2 pairs</Step>
 </WorkedExample>
 <WorkedExample title="49. Sorting Shapes by Symmetry Line Constraints" problem="A shape has 4 sides, opposite sides are parallel, and it has 4 right angles. All sides are equal length. Name the shape.">
 <Step>Step 1 (Synthesize constraints): 4 equal sides + 4 right angles = Square. Answer=Square</Step>
 </WorkedExample>
 <WorkedExample title="50. Classifying an Irregular Geometric Flag Shape" problem="A pennant flag has 3 sides. One angle is 110° and the other two are 35°. Can this be a right triangle?">
 <Step>Step 1 (Check for 90°): The largest angle is 110° (obtuse). It does not contain a right angle. Answer=No, it is an obtuse triangle</Step>
 </WorkedExample>
 </SubSection>
 </SubSection>

 <SubSection title="🧩 Core Concept 6: Lines of Symmetry">
 <p>A line of symmetry is an imaginary line that divides a shape into two mirror-image halves. If you fold a shape along a line of symmetry, both sides match up exactly. Shapes can have zero, one, or multiple lines of symmetry.</p>
  <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{`Vertical Symmetry   Horizontal Symmetry   No Symmetry`}</pre>





 <SubSection title="📝 Worked Examples (Concept 6)">
 <WorkedExample title="51. Lines of Symmetry in a Square" problem="How many lines of symmetry does a square have?">
 <Step>Step 1 (Count all valid folds): You can fold a square vertically (1), horizontally (2), and along both diagonals (3 and 4). Answer = 4 lines of symmetry</Step>
 </WorkedExample>
 <WorkedExample title="52°. Lines of Symmetry in a Rectangle" problem="How many lines of symmetry does a standard non-square rectangle have?">
 <Step>Step 1 (Test folds): You can fold it vertically and horizontally. Diagonal folds do not match up corners exactly. Answer = 2 lines of symmetry</Step>
 </WorkedExample>
 <WorkedExample title="53. Evaluating Symmetry in Letters" problem="Identify the lines of symmetry for the uppercase letters A, B, and H.">
 <Step>Step 1 (A): One vertical line down the center.</Step>
 <Step>Step 2 (B): One horizontal line across the center.</Step>
 <Step>Step 3 (H): Two lines (one vertical, one horizontal).</Step>
 </WorkedExample>
 <WorkedExample title="54. Circle Symmetry Thresholds" problem="How many lines of symmetry does a perfect circle have?">
 <Step>Step 1 (Analyze diameters): Any straight line drawn through the center of a circle divides it into equal mirror halves. Answer=Infinite lines of symmetry</Step>
 </WorkedExample>
 <WorkedExample title="55°. Finding Shapes with Zero Symmetry" problem="Does a standard scalene triangle (all sides and angles unequal) have any lines of symmetry?">
 <Step>Step 1 (Test all fold options): No line can fold it to create two matching halves. Answer=0 lines of symmetry</Step>
 </WorkedExample>
 </SubSection>
 </SubSection>
 </Section>
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

// ---------- ENGLISH NOTES ----------
function EnglishNotes() {
 return (
 <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
 <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>English Language Arts: Comprehensive Guide</h2>
 <Section title="MODULE 1: GRAMMAR, NOUNS, VERBS & LANGUAGE STRUCTURE">

 <SubSection title="1.1 Deep-Dive Taxonomy of Nouns">
 <SubSection title="1.1.1 Common, Proper, Concrete, and Abstract Categorization">
 <p>Nouns do more than simply name a person, place, or thing. They are classified based on their specific structural features:</p>
 <BulletList items={[
 'Common Nouns: Universal, non-specific labels for entities. They remain lowercase unless they begin a sentence. Examples: architect, courthouse, feline, canyon, vehicle, textbook.',
 'Proper Nouns: Specific, individualized identifiers for distinct entities. They must always be capitalized, regardless of their position within a sentence. Examples: Dr. Angela Omolo, Kilimanjaro, Wednesday, September, Tokyo, Great Rift Valley.',
 'Concrete Nouns: Tangible substances or objects that can be perceived by one or more of the five human senses (sight, hearing, touch, taste, smell). Examples: granite, perfume, whistle, honey, velvet, smoke.',
 'Abstract Nouns: Intangible concepts, ideas, emotions, qualities, or conditions that cannot be physically touched or perceived by the bodily senses. Examples: fortitude, anxiety, justice, brilliance, deceptive, camaraderie, freedom.'
 ]} />
 </SubSection>

 <SubSection title="1.1.2 Collective and Compound Structural Variations">
 <BulletList items={[
 'Collective Nouns: Singular words that represent a group of individuals, animals, or objects. When the group acts together as a single unit, the collective noun takes a singular verb. Examples: a pride of lions, a pod of dolphins, a legislature of politicians, a colony of ants, an orchestra of musicians.',
 'Compound Nouns: Nouns made up of two or more distinct base words working together to form a single naming concept. They can be written in three distinct styles: Closed Form (Single Word): skateboard, firefly, backpack, sunflower. Open Form (Separated Spaces): ice cream, post office, swimming pool, high school. Hyphenated Form: mother-in-law, self-esteem, check-in, pass-by.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="1.2 The Mechanics of Verbs & Tense Matrix">
 <SubSection title="1.2.1 Action vs. Linking Verbs">
 <BulletList items={[
 'Action Verbs: Express physical or mental activities performed by a subject. Physical: sprint, shatter, harvest, construct, whisper. Mental: contemplate, remember, deduce, appreciate, imagine.',
 'Linking Verbs: Do not show any action. Instead, they connect the subject to an adjective or noun that describes or renames it (the subject complement). Examples: to be verbs (am, is, are, was, were, been), alongside sensory linking verbs (seems, appears, becomes, smells, tastes, feels).',
 'Analytical Contrast: "The chef tasted the spicy broth." (Action Verb: The chef is physically tasting). "The spicy broth tasted divine." (Linking Verb: Connects the broth to its description).'
 ]} />
 </SubSection>

 <SubSection title="1.2.2 Transitive versus Intransitive Dynamics">
 <BulletList items={[
 'Transitive Verbs: Action verbs that require a direct object to receive the action and complete the meaning of the sentence. To find the direct object, ask Whom? or What? after the verb. Example: "The carpenter built a sturdy cabinet." (Built what? ? cabinet. "Cabinet" is the direct object; "built" is transitive).',
 'Intransitive Verbs: Action verbs that do not have a direct object receiving the action. The action stops with the subject or is followed by a modifier (like an adverb or prepositional phrase). Example: "The golden eagle soared majestically overhead." (Soared what? ? No answer. "Majestically" tells how and "overhead" tells where. "Soared" is intransitive).'
 ]} />
 </SubSection>

 <SubSection title="1.2.3 The Twelve-Tense Primary Paradigm (Core Four for Grade 4)">
 <p>While advanced grammar uses twelve tenses, Grade 4 students must master four core configurations:</p>
 <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
 <tbody>
 <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Grammatical Tense</th>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Structural Formula</th>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Purpose / Chronological Function</th>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Anchor Example</th>
 </tr>
 <tr style={{ border: '1px solid var(--border)' }}>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Simple Present</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Base Verb (+ -s/es for singular)</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Expresses habitual actions or timeless facts.</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>She writes daily.</td>
 </tr>
 <tr style={{ border: '1px solid var(--border)' }}>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Simple Past</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Base Verb + -ed (or irregular form)</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Denotes an action completed at a specific past point.</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>She wrote yesterday.</td>
 </tr>
 <tr style={{ border: '1px solid var(--border)' }}>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Simple Future</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Will + Base Verb</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Expresses an action intended to happen ahead.</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>She will write tomorrow.</td>
 </tr>
 <tr style={{ border: '1px solid var(--border)' }}>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Present Continuous</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Am/Is/Are + Verb ending in -ing</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>Highlights an ongoing action happening right now.</td>
 <td style={{ border: '1px solid var(--border)', padding: '6px' }}>She is writing now.</td>
 </tr>
 </tbody>
 </table>
 </SubSection>
 </SubSection>

 <SubSection title="1.3 Modifiers: Advanced Adjectives and Adverbs">
 <SubSection title="1.3.1 The Order of Multiple Adjectives">
 <p>When using more than one adjective to describe a noun, they must follow a specific natural order. Breaking this order sounds unnatural to native speakers.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [1. OPINION] --&gt; [2. SIZE] --&gt; [3. AGE] --&gt; [4. SHAPE] --&gt; [5. COLOR] --&gt; [6. ORIGIN] --&gt; [7. MATERIAL] --&gt; [NOUN]`}</pre>
 <p>Correct Phrasing: "A beautiful, large, old, rectangular, brown, Kenyan, wooden dining table." Incorrect Phrasing: "A wooden Kenyan old rectangular brown large beautiful dining table."</p>
 </SubSection>

 <SubSection title="1.3.2 Adverbs and Their Four Core Queries">
 <p>An adverb is a modifier that describes a verb, an adjective, or another adverb. Adverbs answer one of four specific questions about the action:</p>
 <BulletList items={[
 'Adverbs of Manner (How?): gracefully, ferociously, accurately, sluggishly, secretly.',
 'Adverbs of Time (When?): yesterday, tomorrow, immediately, later, recently.',
 'Adverbs of Place (Where?): inside, everywhere, underground, abroad, outside.',
 'Adverbs of Frequency (How often?): seldom, frequently, occasionally, always, never.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="1.4 Worked Analytical Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Noun Deconstruction</h4>
 <p>Deconstruct the following sentence. Identify every noun, categorize its type, and state its structural role: "The committee in Nyeri expressed great enthusiasm when they received the new textbooks."</p>
 <p><strong>Step-by-step Solution:</strong></p>
 <BulletList items={[
 'Locate committee: It names a collective group of individuals acting as a single unit. It is a collective noun.',
 'Locate Nyeri: It names a specific, distinct geographic location. It is a proper noun and must be capitalized.',
 'Locate enthusiasm: It names an emotional state or quality that cannot be physically touched. It is an abstract noun.',
 'Locate textbooks: It names tangible physical items that can be seen and touched. It is a concrete noun (and a compound noun made from "text" and "books").'
 ]} />
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Transitive vs. Intransitive Structural Decoding</h4>
 <p>Analyze the verb "grew" in both sentences below. Identify which sentence uses it as a transitive verb and which uses it as an intransitive verb. Prove your answer by locating the direct object.</p>
 <p>Sentence A: "The dedicated farmer grew organic watermelons." Sentence B: "The young sunflower grew rapidly in the warm sunlight."</p>
 <p><strong>Step-by-step Solution:</strong></p>
 <BulletList items={[
 'Analyze Sentence A: Ask the structural question, "The farmer grew what?" The text provides a direct answer: "watermelons." Because the noun "watermelons" receives the action of the verb, "grew" in Sentence A is a transitive verb.',
 'Analyze Sentence B: Ask the structural question, "The sunflower grew what?" The sentence does not answer what was grown. "Rapidly" is an adverb explaining how it grew, and "in the warm sunlight" is a prepositional phrase explaining where or why. Because there is no direct object, "grew" in Sentence B is an intransitive verb.'
 ]} />
 </div>
 </SubSection>

 <SubSection title="1.12 Module 1 Evaluation Assessment (Comprehensive Questions & Answers)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q1: Advanced Structural Noun Sorting</h4>
 <p>Question: Read the passage below. Isolate and sort the ten underlined nouns into their exact categories: Common, Proper, Concrete, Abstract, Collective, or Compound.</p>
 <p>"The fleet of ships sailed into Mombasa during a fierce thunderstorm. The sailors felt deep relief when they saw the sturdy lighthouse beam through the darkness. Captain Maina praised the crew for their courage."</p>
 <p><strong>Answer Matrix:</strong></p>
 <BulletList items={[
 'fleet: Collective Noun (replaces a group of ships acting together).',
 'Mombasa: Proper Noun (identifies a specific geographic location).',
 'thunderstorm: Compound Noun / Concrete Noun (made of "thunder" and "storm"; can be heard and seen).',
 'sailors: Common Noun / Concrete Noun (general term for people who sail).',
 'relief: Abstract Noun (names an internal emotional state that cannot be touched).',
 'lighthouse: Compound Noun / Concrete Noun (made of "light" and "house").',
 'darkness: Abstract Noun (names a physical or conceptual state of being without light).',
 'Maina: Proper Noun (specific name of an individual).',
 'crew: Collective Noun (replaces a group of workers on a ship).',
 'courage: Abstract Noun (names an internal quality or moral strength).'
 ]} />
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q2: Subject-Verb Agreement with Complex Distractors</h4>
 <p>Question: Select the correct verb within the brackets. Prove your choice by identifying the true grammatical subject, filtering out any prepositional phrases or intervening words.</p>
 <BulletList items={[
 'The box of colorful crayons [is / are] sitting on top of the teacher\'s desk. ? is. The intervening phrase is "of colorful crayons." Strip it away to find the true subject: "The box," which is singular. A singular subject requires a singular verb (is).',
 'The structural architects along with their chief assistant [has / have] arrived at the building site. ? have. The phrase starting with "along with" is an addition, not part of the grammatical subject. The true subject is "The structural architects," which is plural. A plural subject requires a plural verb (have).',
 'A pack of wild hyenas [hunts / hunt] across the open savanna at midnight. ? hunts. "A pack" is a collective noun acting as a single, unified group. Collective nouns acting as one unit take a singular verb form ending in -s or -es (hunts).'
 ]} />
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q3: Complete Modifier Realignment</h4>
 <p>Question: Reorder the disorganized groups of adjectives below into their correct syntactic positions based on standard English adjective order rules.</p>
 <p>table (wooden, old, attractive, brown, small) | shoes (leather, black, shiny, school, new)</p>
 <p><strong>Answer:</strong> An attractive [opinion], small [size], old [age], brown [color], wooden [material] table. Shiny [opinion], new [age], black [color], leather [material] school [purpose] shoes.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q4: Identification of Verb Tense and Aspect Conversion</h4>
 <p>Question: Identify the current tense of the sentence below. Then, convert it into the three other requested tenses. Original Sentence: "The engineer repairs the electric generator."</p>
 <p><strong>Answer:</strong> Original Tense: Simple Present Tense (shows a habitual action or current fact). Simple Past Conversion: "The engineer repaired the electric generator." Simple Future Conversion: "The engineer will repair the electric generator." Present Continuous Conversion: "The engineer is repairing the electric generator."</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q5: The Mechanics of Objective Identification</h4>
 <p>Question: Write down the direct objects from the sentences below. If a sentence has no direct object, write "No Direct Object."</p>
 <BulletList items={[
 'The powerful locomotive pulled twenty heavy cargo cars. ? cargo cars (or cars). Pulled what? ? cars. "Cars" is the noun receiving the action.',
 'The weary travelers rested quietly beneath the shade of the acacia tree. ? No Direct Object. Rested what? ? No answer. "Quietly" is an adverb, and "beneath the shade..." is a prepositional phrase showing location.',
 'Our class read a fascinating biography about Wangari Maathai. ? biography. Read what? ? biography. "Biography" is the direct object.'
 ]} />
 </div>
 </SubSection>
 </Section>

 <Section title="MODULE 2: REWRITING MECHANICS, CAPITALIZATION, & COMPLEX SENTENCE UNIFICATION">
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ SENTENCE TYPES ]
 ×
 +--------------------------+--------------------------+
 ? ? ?
 [ SIMPLE ] [ COMPOUND ] [ COMPLEX ]
 - 1 Independent Clause - 2 Ind. Clauses - 1 Ind. Clause
 - 0 Dependent Clauses - Joined by FANBOYS - 1+ Dep. Clause
 - Uses a comma - Subordinate conjunction`}</pre>

 <SubSection title="2.1 The Capitalization Code and Structural Layout">
 <SubSection title="2.1.1 The Rules of Capitalization">
 <p>Capitalization acts as a visual anchor that highlights structural boundaries and specific identifiers. Grade 4 writers must apply these rules consistently:</p>
 <BulletList items={[
 'The First Word of Every Sentence: Sets a visual marker for a new complete thought.',
 'The Pronoun "I": Must always be capitalized, whether it stands alone, appears at the start, or sits in the middle of a clause.',
 'Proper Nouns and Adjectives derived from Proper Nouns: Geographic locations: Nakuru, Nile River, Indian Ocean, Europe. Days, Months, and Holidays: Monday, April, Jamhuri Day, Christmas. Nationalities and Languages: Kenyan, English, Kiswahili, Japanese. Historical Eras, Documents, and Titles: The Stone Age, the Constitution, President Ruto, Dr. Abdi. (Note: Titles are capitalized only when they accompany a specific name. For example: "We met President Ruto," but "He is the president of Kenya.")'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="2.2 Clause Structural Anatomy: Independent vs. Dependent">
 <BulletList items={[
 'The Independent Clause: A complete structural unit. It contains a subject and a verb, and it expresses a complete thought. It can stand alone as a simple sentence. Example: "The security guard checked the locked gates."',
 'The Dependent Clause (Subordinate Clause): Contains a subject and a verb but does not express a complete thought. It begins with a subordinating conjunction (such as because, although, if, since, while, until), which subordinates the clause. It cannot stand alone and requires an independent clause to complete its meaning. Example: "Because the security guard checked the locked gates..." (This leaves the listener waiting for the outcome).'
 ]} />
 </SubSection>

 <SubSection title="2.3 Sentence Architectures: Simple, Compound, and Complex">
 <BulletList items={[
 'Simple Sentences: Consist of a single independent clause with no dependent clauses. It may contain compound subjects or compound verbs, but it retains a single underlying clause structure. Example: "The hungry lion hunted in the tall grass."',
 'Compound Sentences: Consist of two or more independent clauses joined together by a coordinating conjunction (commonly remembered by the acronym FANBOYS: For, And, Nor, But, Or, Yet, So). Punctuation Rule: Place a comma directly before the coordinating conjunction. Example: "The rain fell heavily, and the wind shook the window frames."',
 'Complex Sentences: Consist of exactly one independent clause combined with at least one dependent clause. Punctuation Rule (The Commas Shift): If the dependent clause starts the sentence, place a comma immediately after it. Example: "Although the path was muddy, we walked to school." If the independent clause starts the sentence, no comma is needed before the subordinating conjunction. Example: "We walked to school although the path was muddy."'
 ]} />
 </SubSection>

 <SubSection title="2.4 Worked Analytical Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Capitalization Error Correction</h4>
 <p>Identify and correct the capitalization errors in the following passage: "last friday, my uncle josphat and i traveled to the shores of lake victoria. we spoke to a french tourist who could speak english and swahili."</p>
 <p><strong>Step-by-step Solution:</strong></p>
 <BulletList items={[
 'Capitalize the first word of the sentence: "last" ? Last.',
 'Capitalize days of the week: "friday" ? Friday.',
 'Capitalize titles before names: "uncle josphat" ? Uncle Josphat.',
 'Capitalize the pronoun "I": "i" ? I.',
 'Capitalize proper geographic names: "lake victoria" ? Lake Victoria.',
 'Capitalize the first word of the second sentence: "we" ? We.',
 'Capitalize nationalities and languages: "french" ? French, "english" ? English, "swahili" ? Swahili.'
 ]} />
 <p>Corrected Output: "Last Friday, my Uncle Josphat and I traveled to the shores of Lake Victoria. We spoke to a French tourist who could speak English and Swahili."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Clause Dissection & Synthesis</h4>
 <p>Combine the two simple sentences below into a complex sentence. Use the subordinating conjunction "before." Show both valid structural configurations and apply correct punctuation. Sentence 1: "The school bell rang loudly." Sentence 2: "The pupils finished writing their final answers."</p>
 <p><strong>Step-by-step Solution:</strong></p>
 <BulletList items={[
 'Identify the chronological sequence: Writing answers happens first; the bell ringing happens second.',
 'Configuration A (Dependent clause first): Place "before" at the beginning of Sentence 1. Combine it with Sentence 2, adding a comma at the transition point. Draft: "Before the school bell rang loudly, the pupils finished writing their final answers."',
 'Configuration B (Independent clause first): Start with Sentence 2 and place the dependent clause second. Remove the comma. Draft: "The pupils finished writing their final answers before the school bell rang loudly."'
 ]} />
 </div>
 </SubSection>

 <SubSection title="2.12 Module 2 Evaluation Assessment (Comprehensive Questions & Answers)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q1: The Advanced Editing Matrix</h4>
 <p>Question: Rewrite the paragraph below. Apply correct capitalization, periods, question marks, and commas where necessary.</p>
 <p>"on a rainy monday afternoon dr amina omari drove her silver car through the streets of kisumu she needed to reach the imperial bank before it closed at 4:0 pm why was she in such a hurry she had to mail an important legal document to nairobi"</p>
 <p><strong>Answer:</strong> "On a rainy Monday afternoon, Dr. Amina Omari drove her silver car through the streets of Kisumu. She needed to reach the Imperial Bank before it closed at 4:0 p.m. Why was she in such a hurry? She had to mail an important legal document to Nairobi."</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q2: Sentence Structural Decomposition</h4>
 <p>Question: Classify each sentence as Simple, Compound, or Complex. Identify the conjunctions used to prove your classification.</p>
 <BulletList items={[
 'The clever monkeys climbed up the high branches of the baobab tree to look for food. ? Simple. Contains only one independent clause. "To look" is an infinitive phrase, not a separate clause. There are zero conjunctions joining independent or dependent clauses.',
 'The primary school library contains thousands of books, but the classrooms have their own reading corners. ? Compound. Consists of two independent clauses joined by the coordinating conjunction "but" with a comma.',
 'Since the electricity went out during the storm, we used candles to light up the living room. ? Complex. Consists of a dependent clause starting with the subordinating conjunction "Since" joined to an independent clause with a comma.',
 'The large cargo ship blowing its horn slid slowly through the ocean waves. ? Simple. Contains a single subject ("cargo ship") and a compound participle description, but only one main action verb ("slid").'
 ]} />
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q3: Synthesis of Clauses Using FANBOYS</h4>
 <p>Question: Combine the two simple sentences below into a single compound sentence. Test two different coordinating conjunctions from the FANBOYS matrix, ensure they make sense, and apply correct punctuation. Sentence A: "The young boy practiced his violin solo for hours every day." Sentence B: "He did not win the first-place trophy at the music festival."</p>
 <p><strong>Answer:</strong> Option 1 (Using "but"): "The young boy practiced his violin solo for hours every day, but he did not win the first-place trophy at the music festival." Option 2 (Using "yet"): "The young boy practiced his violin solo for hours every day, yet he did not win the first-place trophy at the music festival." (Note: The comma must be placed directly before the conjunction).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q4: Dependent Clause Extraction Challenge</h4>
 <p>Question: Underline the dependent clause in each complex sentence below. Circle the subordinating conjunction that anchors it.</p>
 <BulletList items={[
 'You can go outside to play football (after) you finish your household chores. (Subordinating conjunction: after).',
 '(Although) she lost her favorite pencil box, Sarah smiled cheerfully. (Subordinating conjunction: Although).',
 'The crops will wither (unless) the village receives rain soon. (Subordinating conjunction: unless).'
 ]} />
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q5: Sentence Transformation Workshop</h4>
 <p>Question: Convert the compound sentence below into a complex sentence by replacing the coordinating conjunction with a subordinating conjunction (because or since). Ensure your sentence follows correct comma placement rules. Compound: "The market was incredibly crowded, so we returned home immediately."</p>
 <p><strong>Answer:</strong> Transformation Option A (Dependent Clause First): "Because the market was incredibly crowded, we returned home immediately." (Requires a comma). Transformation Option B (Independent Clause First): "We returned home immediately since the market was incredibly crowded." (No comma required).</p>
 </div>
 </SubSection>
 </Section>

 <Section title="MODULE 3: VOCABULARY MATRIX, CONTEXT CLUES, SYNONYMS, & ANTONYMS">
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ CONTEXT CLUES TYPES ]
 ×
 +---------------------------+---------------------------+
 ? ? ?
 [ DEFINITION ] [ CONTRAST ] [ EXAMPLIFICATION ]
 Words like "or," "is" Words like "but," "yet" Provides direct models
 directly explain it. show the absolute opposite. to reveal meaning.`}</pre>

 <SubSection title="3.1 Context Clues Mastery Framework">
 <SubSection title="3.1.1 The Four Types of Context Clues">
 <p>When you encounter an unfamiliar word while reading, you do not always need a dictionary. You can deduce its meaning by analyzing the surrounding words and sentences. These hints are called context clues.</p>
 <BulletList items={[
 'Definition/Explanation Clues: The sentence directly explains or defines the unfamiliar word, often using punctuation like commas, dashes, or words like "or," "which means," or "is." Example: "The cavern was immense × it was a giant, hollow underground space that could hold a whole building." (Immense means giant or huge).',
 'Synonym/Restatement Clues: The author uses a familiar word with a similar meaning nearby to clarify the unfamiliar word. Example: "The teacher praised the boy\'s diligent work, noting that his thorough and hardworking approach was excellent." (Diligent means hardworking).',
 'Antonym/Contrast Clues: The author pairs the unfamiliar word with a familiar word that means the opposite. Look for signal words like but, however, unlike, although, on the other hand. Example: "Unlike her brother who was highly loquacious, Maria was quiet and rarely spoke in public." (Loquacious means talkative, the opposite of quiet).',
 'Example/Illustration Clues: The text provides clear examples of the word\'s behavior or identity to reveal its meaning. Example: "The terrain was full of hazards, such as deep holes, fallen trees, jagged rocks, and slippery mud." (Hazards mean dangers or obstacles).'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="3.2 Synonyms and Antonyms Lexicon Builder">
 <SubSection title="3.2.1 Core Vocabulary Expansion Matrix">
 <p>To improve your descriptive writing, you need to expand your vocabulary beyond basic words. Study this Grade 4 vocabulary matrix:</p>
 <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
 <tbody>
 <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>High-Frequency Base Word</th>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Advanced Synonym (Similar)</th>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Advanced Antonym (Opposite)</th>
 <th style={{ border: '1px solid var(--border)', padding: '6px' }}>Contextual Application Sentence</th>
 </tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Shed / Break</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Fracture</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Mend / Repair</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The impact caused the thin glass vase to fracture.</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Brave</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Valiant</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Cowardly</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The valiant firefighter rushed into the smoke-filled room.</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Scared</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Apprehensive</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Confident</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>He felt apprehensive before walking onto the stage.</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Generous</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Philanthropic</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Miserly</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The philanthropic merchant donated warm blankets.</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Plentiful</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Abundant</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Scarce</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The orchard provided an abundant harvest of sweet mangoes.</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Tired</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Exhausted</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Energized</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>After sprinting up the hill, the athlete was exhausted.</td></tr>
 </tbody>
 </table>
 </SubSection>
 </SubSection>

 <SubSection title="3.3 Homophones, Homographs, and Structural Phrasing">
 <SubSection title="3.3.1 Homophones">
 <p>Words that sound exactly the same when spoken aloud, but have completely different spellings and meanings.</p>
 <BulletList items={[
 'their (belonging to them) / there (a place location) / they\'re (short for they are).',
 'hear (perceiving sound with ears) / here (this current spot).',
 'to (direction movement) / too (also, or excessively) / two (the number 2).'
 ]} />
 </SubSection>

 <SubSection title="3.3.2 Homographs">
 <p>Words that are spelled exactly the same way, but have different meanings and sometimes different pronunciations depending on context.</p>
 <BulletList items={[
 'bark (the rough protective outer skin of a tree trunk) / bark (the loud sound made by a dog).',
 'bat (a wooden club used to hit a baseball) / bat (a nocturnal flying mammal).',
 'wind (air moving outside) / wind (to twist or turn a clock spring).'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="3.4 Worked Analytical Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Context Clues Deduction</h4>
 <p>Read the passage below and deduce the exact definition of the unfamiliar word "parched" without using a dictionary. Identify the specific type of context clue used to guide your choice. "The soil in the desert plains was completely parched. It had not received a single drop of rain in nine months, causing the ground to crack open from extreme dryness."</p>
 <p><strong>Step-by-step Solution:</strong> Isolate the unfamiliar word: "parched." Scan the surrounding sentences for clues: The text states it "had not received a single drop of rain in nine months" and mentions "extreme dryness." Synthesize the clues: A lack of rain for nine months leading to extreme dryness means the ground is completely dried out or thirsty. Identify clue type: The sentence provides a direct explanation of the condition ("extreme dryness"). This is an explanation context clue. Final Definition: "Parched" means completely dried out, dehydrated, or desperately in need of water.</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Homophone Dissection</h4>
 <p>Select the correct homophones to make the following sentence grammatically correct: "The [two / to / too] boys walked [two / to / too] the library, but they realized it was [two / to / too] crowded to find a seat."</p>
 <p><strong>Step-by-step Solution:</strong> Analyze slot 1: The sentence describes a number of boys. The correct choice is the numerical value: two. Analyze slot 2: The sentence shows a direction of movement toward a location ("the library"). The correct choice is the preposition: to. Analyze slot 3: The sentence describes an excessive condition ("crowded"). The correct choice meaning excessively or also is: too. Final Sentence: "The two boys walked to the library, but they realized it was too crowded to find a seat."</p>
 </div>
 </SubSection>

 <SubSection title="3.12 Module 3 Evaluation Assessment (Comprehensive Questions & Answers)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q1: Context Clues Multiple-Choice Suite</h4>
 <p>Question: Read each sentence carefully, deduce the definition of the bolded vocabulary word using context clues, and name the specific type of clue used.</p>
 <BulletList items={[
 'The journey across the rocky mountain pass was perilous, filled with narrow ledges, loose rocks, and sudden blizzards that threatened the climbers\' lives. ? Meaning: Dangerous or high-risk. Clue Type: Example/Illustration Clue (provides examples of dangers: narrow ledges, loose rocks, blizzards).',
 'The room was filled with a pungent odor; it was sharp, stinging, and reminded everyone of crushed onions and vinegar. ? Meaning: Strong, sharp, or stinging to the senses. Clue Type: Definition/Explanation Clue (directly explains the odor as "sharp, stinging").',
 'While my grandfather is usually quite frugal with his money, he surprises us by being incredibly generous during holidays. ? Meaning: Economical, careful with spending, or tight with money. Clue Type: Antonym/Contrast Clue (uses the signal word "While" to contrast the word with "generous").'
 ]} />
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q2: Synonym and Antonym Substitution Exercise</h4>
 <p>Question: Rewrite each sentence below twice. First, replace the bracketed word with an advanced synonym. Second, replace it with an advanced antonym that reverses the sentence's meaning. Base Sentence: "The water supply in the village reservoir was [scarce] during the long dry season."</p>
 <p><strong>Answer:</strong> Synonym Revision: "The water supply in the village reservoir was deficient (or insufficient / limited) during the long dry season." Antonym Revision: "The water supply in the village reservoir was abundant (or plentiful / overflowing) during the long dry season."</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q3: Homograph Context Discrimination</h4>
 <p>Question: Read the two sentences below. Write down the definition of the homograph word "fly" for each context. Sentence A: "A tiny fly buzzed around the basket of ripe bananas." Sentence B: "The majestic eagle will fly high above the mountain ridges."</p>
 <p><strong>Answer:</strong> Definition in Sentence A: A noun that refers to a specific type of small, winged insect. Definition in Sentence B: A verb that refers to the physical action of moving through the air using wings.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q4: Core Homophone Correction Suite</h4>
 <p>Question: Identify and correct the homophone errors in the sentences below.</p>
 <BulletList items={[
 'I can hear the ocean waves crashing against the rocks from hear. ? Correction: "I can hear (perceive sound) the ocean waves crashing against the rocks from here (this location)."',
 'Their going to leave there backpacks over there on the bench. ? Correction: "They\'re (short for they are) going to leave their (belonging to them) backpacks over there (that location) on the bench."',
 'She bought flour to make a cake, but she forgot to buy a flower vase. ? Correction: "She bought flour (baking powder ingredient) to make a cake, but she forgot to buy a flower (blossoming plant) vase."'
 ]} />
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Q5: Base Vocabulary Upgrading Challenge</h4>
 <p>Question: Replace the underlined simple words with an advanced vocabulary word from Module 3's core matrix: The marathon runner was very tired after completing the race. The wealthy family gave a generous donation to build a new library. The jungle contains a plentiful amount of green plants.</p>
 <p><strong>Answer:</strong> exhausted (or fatigued). philanthropic (or magnanimous). abundant (or luxuriant).</p>
 </div>
 </SubSection>
 </Section>

 <Section title="MODULE 4: THE READING COMPREHENSION SUITE & INFERENCE WORKSHOP">
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ THE LITERACY ANATOMY ]
 ×
 +-------------------------------------------------------+
 ? ?
 [ LITERAL RECALL ] [ INFERENCE WORKSHOP ]
 × Facts explicitly stated. × Reading between the lines.
 × Answers are found directly in text. × Combining text clues with × Requiring no reading between lines. prior knowledge to deduce truth.`}</pre>
 </Section>

 <Section title="MODULE 5: ADVANCED MECHANICS × AFFIXES, COMPOUND WORDS, AND PREPOSITIONS">
 <SubSection title="5.1 Understanding Affixes: Prefixes and Suffixes">
 <SubSection title="5.1.1 Root Words and Derivations">
 <p>A root word is a plain, standalone word that contains the primary meaning of a term. It cannot be broken down into smaller pieces. We can change the meaning of a root word or alter its grammatical function by adding an affix to it.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` PREFIX ROOT WORD SUFFIX
 Added to the START Core Meaning Added to the END
 (e.g., un-, re-, dis-) (e.g., play) (e.g., -ful, -less)`}</pre>
 <BulletList items={[
 'Prefixes: Short groups of letters attached to the beginning of a root word. Adding a prefix usually creates a brand-new word with an opposite meaning or changes its direction. un- (means not): un + happy = unhappy (not happy). re- (means again): re + write = rewrite (to write something again). dis- (means opposite of or not): dis + obey = disobey (to refuse to obey).',
 'Suffixes: Short groups of letters attached to the end of a root word. Adding a suffix often changes the word\'s part of speech (such as turning a verb into a noun or an adjective). -ful (means full of): care + ful = careful (full of care). -less (means without): home + less = homeless (without a home). -ly (means in that manner): quick + ly = quickly (in a quick manner).'
 ]} />
 </SubSection>

 <SubSection title="5.1.2 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1</h4>
 <p>Analyze the word "disagreement". Identify its structural prefix, root word, and suffix, and explain how the total meaning changes from the root word.</p>
 <p><strong>Step-by-step Solution:</strong> Isolate the front section of the word: Look for a common prefix. We see dis-. Isolate the end section of the word: Look for a common suffix. We see -ment. Identify the remaining core component: The root word is agree (a verb). Analyze the mechanical breakdown: Prefix: dis- (not/opposite). Root Word: agree (to share the same opinion). Suffix: -ment (creates a noun tracking an action or state). Meaning: A disagreement is a noun that describes the state of not sharing the same opinion with someone else.</p>
 </div>
 </SubSection>

 <SubSection title="5.1.3 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1</h4>
 <p>Add the correct negative prefix (un-, dis-, or im-) to each of the following root words to make them mean the exact opposite: a) Patient b) Kind c) Honest d) Safe</p>
 <p><strong>Answer:</strong> a) Impatient (Root words starting with a p or m sound frequently use im-). b) Unkind (Uses the standard negative prefix un-). c) Dishonest (Uses dis- to turn a positive moral adjective into a negative one). d) Unsafe (Means dangerous or not protected from harm).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2</h4>
 <p>Identify the suffix in the underlined word and write down its meaning based on context: "The thirsty traveler drank a mouthful of cold river water."</p>
 <p><strong>Answer:</strong> Suffix: The suffix is -ful. Meaning: The suffix -ful means "full of" or "the amount that fills something." In this context, a mouthful means the exact amount of water required to completely fill a person's mouth.</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="5.2 Compound Words">
 <SubSection title="5.2.1 Joining Separate Word Elements">
 <p>A compound word is formed when two completely separate, independent root words are joined together to create a brand-new word with its own unique meaning.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` WORD 1 WORD 2 COMPOUND WORD
 [ Sun ] + [ Flower ] = [ Sunflower ]
 A bright star A garden plant A specific yellow plant`}</pre>
 <p>When combining individual words, do not drop or change any interior letters. Simply blend the two words into a single continuous term.</p>
 </SubSection>

 <SubSection title="5.2.2 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1</h4>
 <p>Read the sentence below and identify all the compound words mixed into the text: "During the rainstorm, a beautiful butterfly landed softly on the wooden windowsill."</p>
 <p><strong>Step-by-step Solution:</strong> Scan the sentence word by word to find elements that can be split into two smaller individual nouns or verbs. Examine rainstorm: Can be split into rain + storm. This is a compound word. Examine butterfly: Can be split into butter + fly. This is a compound word. Examine windowsill: Can be split into window + sill. This is a compound word. Output List: rainstorm, butterfly, windowsill.</p>
 </div>
 </SubSection>

 <SubSection title="5.2.3 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1</h4>
 <p>Match a word from Column A with a word from Column B to form four real compound words: Column A: Foot, Rain, Basket, Play. Column B: Maker, Ground, Ball, Coat.</p>
 <p><strong>Answer:</strong> By matching the parts logically, we build the following standard terms: Foot + Ball = Football. Rain + Coat = Raincoat. Basket + Ball = Basketball. Play + Ground = Playground.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2</h4>
 <p>True or False: The word "beautiful" is a compound word because it contains the word "beauty" and the word "full." Explain your reasoning.</p>
 <p><strong>Answer:</strong> False. A compound word requires two independent standalone words joined together (like backpack). The word beautiful is formed by taking a single root word (beauty) and attaching a dependent suffix (-ful). Therefore, beautiful is an example of an affixed derived word, not a compound word.</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="5.3 Prepositions of Spatial Orientation">
 <SubSection title="5.3.1 Defining Positions and Locations">
 <p>A preposition is a word that shows the exact position, direction, or time relationship between a noun and other words in a sentence. Prepositions of spatial orientation tell us exactly where an object or person is located.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` +---+ +---+ +---+
 ? → × × × ? × × × → ?
 +---+ +---+ +---+
 [ BESIDE ] [ INSIDE ] [ BEHIND ]`}</pre>
 <BulletList items={[
 'In / Inside: Enclosed within the boundaries of a space or container.',
 'On: Resting directly on top of a flat supporting surface.',
 'Under / Beneath: Directly below or lower than an object.',
 'Between: In the middle space separating two distinct objects or landmarks.',
 'Beside / Next to: Right by the side of a person or object.',
 'Behind: At the back of a structure or hidden behind an obstacle.'
 ]} />
 </SubSection>

 <SubSection title="5.3.2 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1</h4>
 <p>Study the description below and choose the correct spatial prepositions to make the description clear: "The teacher kept her keys [under / on] the top flat surface of her desk, right [between / next to] a tall stack of grading books."</p>
 <p><strong>Step-by-step Solution:</strong> Analyze the first location clue: "top flat surface." Keys rest on top of flat surfaces. The correct choice is on. Analyze the second location clue: "a tall stack of grading books." There is only one stack mentioned. The preposition "between" requires two separate items. Since there is only one reference landmark, the correct choice is next to. Completed Sentence: "The teacher kept her keys on the top flat surface of her desk, right next to a tall stack of grading books."</p>
 </div>
 </SubSection>

 <SubSection title="5.3.3 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1</h4>
 <p>Fill in the blanks with the most appropriate spatial prepositions from the list provided in the brackets: (between, under, behind, inside) a) The shy puppy hid ______________ the heavy curtain so nobody could see it. b) Keep your identification documents safe ______________ the leather wallet. c) The narrow footbridge runs directly ______________ the two high mountain cliffs. d) The workers rested ______________ the cool shade of the large mango tree.</p>
 <p><strong>Answer:</strong> a) behind (hiding from view requires being at the back of an object). b) inside (wallet is an enclosed container space). c) between (used because it connects or separates two distinct objects). d) under (resting below the overhead branches of a tree canopy).</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="?? INTERACTIVE REVISION ASSESSMENT: MODULE 5">
 <p>Test your mechanics, affixes, compound terms, and preposition choices with this multi-option interactive review setup.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Quiz: Grade 4 Advanced Mechanics Quiz</h4>
 <p><strong>Question (Topic: Suffixes):</strong> Which suffix can be added to the end of the verb "help" to turn it into an adjective that means "unable to do anything or without help"? A) -ful (Incorrect × makes "helpful," which is the opposite). B) -ly (Incorrect × "helply" is not a real word). C) -less (Correct! The suffix "-less" means "without." "Helpless" means without help). D) -ment (Incorrect × "helpment" is not valid). Hint: Think about which suffix means "without."</p>
 <p><strong>Question (Topic: Compound Words):</strong> Identify the word in this list that is a real compound word made from two independent nouns. A) Replay (Incorrect × prefix "re-" + "play"). B) Backpack (Correct! Combines "back" and "pack"). C) Beautiful (Incorrect × root + suffix). D) Runner (Incorrect × root + suffix). Hint: Look for a word that splits into two complete words.</p>
 <p><strong>Question (Topic: Prepositions):</strong> The cat jumped up and rested perfectly → the narrow ledge of the open window. Choose the correct spatial preposition. A) on (Correct × resting on top of a flat surface). B) under (Incorrect). C) between (Incorrect × needs two items). D) inside (Incorrect × ledge is not an enclosed space). Hint: Think about which word describes resting on a flat surface.</p>
 <p><strong>Question (Topic: Prefixes):</strong> What does the prefix "re-" mean in the sentence: "The director asked the clerk to reprint the damaged form"? A) Not (Incorrect). B) Again (Correct! "re-" means to repeat an action). C) Before (Incorrect). D) Without (Incorrect). Hint: Think about what "redo" or "review" means.</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? CURRICULUM MECHANICS FLOW MATRIX</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ CURRICULUM MECHANICS MATRIX ]
 ×
 +-----------------------------------------------------------+
 ? ?
 [ Morphological Inputs ] [ Syntactic Layouts ]
 × Prefixes (Front modification) × Compound Words (Word Blending) × Suffixes (Back classification) × Spatial Prepositions (Location keys)`}</pre>
 </div>
 </Section>

 <Section title="MODULE 6: TENSES, CONJUNCTIONS, AND DIRECT vs. INDIRECT SPEECH">
 <SubSection title="6.1 Understanding Verb Tenses">
 <p>Verb tenses tell the reader exactly when an action takes place. In Grade 4, you must master three primary absolute time frameworks.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` PAST TENSE PRESENT TENSE FUTURE TENSE
 Action is finished Action is happening now Action will happen later
 (e.g., walked, ate) (e.g., walks, is eating) (e.g., will walk, will eat)`}</pre>
 <SubSection title="6.1.1 Regular vs. Irregular Past Tense">
 <BulletList items={[
 'Regular Verbs: Form the past tense by adding -ed or -d directly to the base root word. Examples: walk ? walked; smile ? smiled; jump ? jumped.',
 'Irregular Verbs: Do not follow the "-ed" rule. Instead, they change their spelling entirely or remain exactly the same. Examples: go ? went; eat ? ate; run ? ran; write ? wrote; cut ? cut.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="6.2 Conjunctions: Sentence Connectors">
 <p>A conjunction is a connecting word used to link separate words, phrases, or clauses together inside a sentence. In Grade 4, we use the core coordinating conjunctions known as FANBOYS, focusing on three key connectors:</p>
 <BulletList items={[
 'And: Used to join similar ideas, facts, or extra information together. Example: Maria loves to read novels, and she enjoys writing short poems.',
 'But: Used to show a contrast, difference, or an unexpected change in ideas. Example: The weather was very cold, but the children went out to play anyway.',
 'Or: Used to present a choice or alternative between two options. Example: You can study for your upcoming test, or you can clean your room.'
 ]} />
 </SubSection>

 <SubSection title="6.3 Direct vs. Indirect (Reported) Speech">
 <p>When writing stories, we need to show what characters say. We can do this using two different structural methods:</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` DIRECT SPEECH: Musa said, "I am going to milk the cows."
 ×
 ? (Tense shifts backward; pronouns change)
 INDIRECT SPEECH: Musa said that he was going to milk the cows.`}</pre>
 <SubSection title="6.3.1 Punctuation Rules for Direct Speech">
 <BulletList items={[
 'Place a comma immediately after the speaker\'s tag (e.g., Juma said,).',
 'Open quotation marks (") before the first spoken word.',
 'Start the first spoken word inside the quotes with a capital letter.',
 'Place the ending punctuation mark (period, question mark, or exclamation point) inside the final quotation marks.'
 ]} />
 </SubSection>
 <SubSection title="6.3.2 Structural Transformations for Indirect Speech">
 <BulletList items={[
 'Remove the comma and all quotation marks.',
 'Link the sentence using the connecting word that.',
 'Shift pronouns to match the outside speaker\'s perspective (e.g., "I" changes to he or she).',
 'Shift the verb tense backward into the past tense (e.g., is changes to was; run changes to ran).'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="6.4 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Regular and Irregular Tense Sorting</h4>
 <p>Read the following sentence and change all present-tense actions into their proper past-tense forms: "The bird flies to the branch, sings a beautiful song, and catches a small worm."</p>
 <p><strong>Step-by-step Solution:</strong> Identify flies: This is an irregular present-tense verb. Its past-tense form is flew. Identify sings: This is an irregular present-tense verb. Its past-tense form is sang. Identify catches: This is an irregular present-tense verb. Its past-tense form is caught. Output Sentence: "The bird flew to the branch, sang a beautiful song, and caught a small worm."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Transforming Speech Types</h4>
 <p>Convert the following sentence from direct speech into clean, correct indirect speech: Sarah said, "I want to visit the library today."</p>
 <p><strong>Step-by-step Solution:</strong> Remove the quotation marks and the structural comma. Insert the connecting word that directly after the speaker tag: Sarah said that... Shift the pronoun: Because Sarah is a female, the pronoun "I" changes to she. Shift the main verb tense backward: The present-tense verb "want" changes to the past-tense form wanted. Shift time place expressions: The word "today" changes to that day. Output Sentence: "Sarah said that she wanted to visit the library that day."</p>
 </div>
 </SubSection>

 <SubSection title="6.5 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1: Sentence Combining with Conjunctions</h4>
 <p>Join each pair of separate sentences into one single compound sentence using the most logical conjunction provided in the brackets (and, but, or): a) John wanted to buy a new soccer ball. He did not have enough money in his piggy bank. (but) b) We can pack a healthy lunch for our trip. We can buy snacks at the park gates. (or)</p>
 <p><strong>Answer:</strong> a) John wanted to buy a new soccer ball, but he did not have enough money in his piggy bank. (A comma is placed right before the coordinating conjunction). b) We can pack a healthy lunch for our trip, or we can buy snacks at the park gates.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2: Direct Speech Punctuation</h4>
 <p>Insert all the missing commas, capital letters, and quotation marks into the following raw text sentence: the teacher smiled and said we will start our reading lesson now</p>
 <p><strong>Answer:</strong> Capitalize the first word of the sentence: The. Add a comma after the speaker tag: The teacher smiled and said, Open quotation marks before the spoken section. Capitalize the first spoken word inside the quotes: We. Place a period at the end of the statement inside the final quotation marks. Corrected Output: The teacher smiled and said, "We will start our reading lesson now."</p>
 </div>
 </SubSection>

 <SubSection title="?? INTERACTIVE REVISION ASSESSMENT: MODULE 6">
 <p>Test your mastery of tenses, sentence conjunctions, and direct/indirect speech mechanics with this structured interactive quiz.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Quiz: Grade 4 Language Mechanics</h4>
 <p><strong>Question 1 (Topic: Irregular Past Tense):</strong> Choose the correct past-tense verb to complete the sentence: "Yesterday, Kamau _________ a wonderful letter to his grandmother in Malindi." A) writed (Incorrect). B) wrote (Correct! Irregular past tense of "write"). C) writes (Incorrect × present tense). D) written (Incorrect × past participle needing helper). Hint: Remember that irregular verbs do not change by adding "-ed."</p>
 <p><strong>Question 2 (Topic: Speech Conversion):</strong> Identify the correct indirect speech translation of: David said, "The dog is barking at the gate." A) David said that the dog is barking at the gate. (Incorrect × tense not shifted). B) David said that the dog was barking at the gate. (Correct! Quotation marks removed, "that" added, "is" → "was"). C) David said, "that the dog was barking at the gate." (Incorrect × quotes still present). D) David says that the dog were barking at the gate. (Incorrect × subject-verb disagreement). Hint: Look for removal of quotes, insertion of "that," and tense shift.</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? SENTENCE SYNTAX FLOW MATRIX</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ ADVANCED SYNTAX MATRIX ]
 ×
 +---------------------------------------------------+
 ? ?
 [ Structural Markers ] [ Narrative Devices ]
 × Past / Present / Future Tenses × Direct Quotes (Punctuation Keys) × Conjunction Links (And, But, Or) × Indirect Reports (Tense Shift Rules)`}</pre>
 </div>
 </Section>

 <Section title="MODULE 7: INTERMEDIATE WRITING × COMPOSITION PLANNING, ADVERBS, AND HOMOPHONES">
 <SubSection title="7.1 Composition Planning and Paragraph Structuring">
 <p>Writing a composition requires organizing your thoughts before writing. A standard narrative composition or story follows a clear structure consisting of three main parts.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` → [ INTRODUCTION ] → --&gt; → Set the scene, introduce characters, and state the time/place.
 ×
 ?
 [ BODY PARAGRAPHS ] --> Develop the plot, present actions, and show the main event.
 ×
 ?
 [ CONCLUSION ] --> → Wrap up the story, show the outcome, and share feelings.`}</pre>
 <SubSection title="7.1.1 The Golden Rules of Paragraph Writing">
 <BulletList items={[
 'Topic Sentence: Every paragraph must begin with a clear sentence that introduces the main idea of that specific paragraph.',
 'Supporting Details: The sentences that follow must provide extra information, actions, or explanations that support the topic sentence.',
 'Indentation or Spacing: Always signal the start of a new paragraph by leaving a clear empty line or indenting the first sentence. Move to a new paragraph whenever there is a change in Time, Place, Action, or Speaker.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="7.2 Adverbs of Frequency">
 <p>An adverb of frequency tells the reader exactly how often an action takes place. These words modify verbs and help show habits or regular routines.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` ALWAYS USUALLY OFTEN SOMETIMES NEVER
 100% ------------ 80% ------------ 60% ------------ 40% ------------ 0%`}</pre>
 <BulletList items={[
 'Always: The action happens every single time without exception. Example: Juma always brushes his teeth before going to bed.',
 'Often: The action happens many times or frequently. Example: The children often play football in the open field after school.',
 'Sometimes: The action happens occasionally, but not regularly. Example: It sometimes rains during the hot afternoon hours.',
 'Never: The action does not happen at any time. Example: A responsible student never leaves their homework incomplete.'
 ]} />
 </SubSection>

 <SubSection title="7.3 Structural Homophones">
 <p>Homophones are words that sound exactly the same when spoken aloud, but have different spellings and different meanings. Using the wrong homophone is a common writing error that can confuse your reader.</p>
 <SubSection title="7.3.1 Common Grade 4 Homophone Pairs">
 <BulletList items={[
 'Their / There / They\'re: Their shows possession (This is their school bus). There points to a place (over there). They\'re is a contraction for "they are" (They\'re going to the museum).',
 'Its / It\'s: Its shows possession (The dog wagged its tail). It\'s is a contraction for "it is" (It\'s going to be a sunny day).',
 'To / Too / Two: To shows direction (We walked to the market). Too means "also" or indicates an excessive amount (too hot). Two is the number 2.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="7.4 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Selecting the Correct Homophone</h4>
 <p>Read the sentence below and select the correct words from the brackets to make the text correct: "The [two / to] boys left [there / their] school bags over [there / they're] near the tree."</p>
 <p><strong>Step-by-step Solution:</strong> Analyze the first choice: It describes a count of boys. The correct spelling for the number 2 is two. Analyze the second choice: It shows ownership of the school bags belonging to the boys. The correct possessive spelling is their. Analyze the third choice: It points toward a physical location near the tree. The correct situational spelling is there. Output Sentence: "The two boys left their school bags over there near the tree."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Placing Adverbs of Frequency</h4>
 <p>Insert the adverb of frequency provided in the brackets into its correct position inside the sentence: "Amina rides her bicycle to school on rainy days." (never)</p>
 <p><strong>Step-by-step Solution:</strong> Identify the main action verb in the sentence: rides. Recall the structural placement rule: Adverbs of frequency usually go directly before the main action verb. Place the word "never" right in front of "rides." Output Sentence: "Amina never rides her bicycle to school on rainy days."</p>
 </div>
 </SubSection>

 <SubSection title="7.5 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1: Homophone Correction</h4>
 <p>Identify and correct the spelling errors in the following short paragraph: It's a beautiful morning. The bird is building it's nest with small twigs. The two parents are flying to the forest to find food for there young chicks.</p>
 <p><strong>Answer:</strong> It's a beautiful morning. (Correct × contraction for "It is") ...building it's nest... → its (Correction: possessive form without apostrophe). The two parents... (Correct × number 2). ...flying to the forest... (Correct × direction). ...food for there young chicks. → their (Correction: possessive form "their" because chicks belong to parents).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2: Adverb Sentence Construction</h4>
 <p>Rewrite the following sentences by replacing the underlined phrase with a single, matching adverb of frequency (always, sometimes, never): a) Kamau finishes his assignments every single time without fail. b) We go swimming once in a while when it is hot.</p>
 <p><strong>Answer:</strong> a) Kamau always finishes his assignments. b) We sometimes go swimming when it is hot.</p>
 </div>
 </SubSection>

 <SubSection title="?? INTERACTIVE REVISION ASSESSMENT: MODULE 7">
 <p>Test your intermediate writing planning, adverb setups, and homophone choices with this interactive quiz.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Quiz: Grade 4 Writing Mechanics</h4>
 <p><strong>Question 1 (Topic: Homophones):</strong> Choose the correct word to complete the sentence: "The tea is __________ sweet because you added three spoons of sugar." A) to (Incorrect). B) too (Correct! "Too" indicates an excessive amount of sweetness). C) two (Incorrect × the number 2). D) toe (Incorrect × a physical digit). Hint: Think about which spelling means "more than enough."</p>
 <p><strong>Question 2 (Topic: Composition Planning):</strong> When writing a creative story, inside which specific section should you introduce your main characters and describe the setting (time and place)? A) The Introduction (Correct! The opening introduction paragraph sets the scene and introduces characters). B) The Body Paragraphs (Incorrect). C) The Conclusion (Incorrect). D) The Title Line (Incorrect). Hint: Think about the very first part of a story.</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? INTERMEDIATE WRITING STRUCTURE MATRIX</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ COMPOSITION LAYOUT MATRIX ]
 ×
 +-------------------------------------------------------+
 ? ?
 [ Narrative Organization ] [ Descriptive Precision ]
 × Intro: Characters & Settings × Frequency Adverbs (How often) × Body: Plot Actions & Events × Structural Homophones (Spelling Accuracy) × Conclusion: Outcomes & Feelings × Topic Sentences (Paragraph Focus)`}</pre>
 </div>
 </Section>

 <Section title="MODULE 8: ADVANCED SYNTAX × PRONOUNS, COMPARATIVE ADJECTIVES, AND COMPREHENSION STRATEGIES">
 <SubSection title="8.1 Pronoun Classification and Case Agreement">
 <p>A pronoun is a word used to replace a noun to avoid repetitive phrasing. In Grade 4, pronouns are organized into specific cases based on whether they perform the action or receive the action.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` SUBJECT PRONOUNS OBJECT PRONOUNS
 Performs the Action Receives the Action
 (I, You, He, She, It, We, They) (Me, You, Him, Her, It, Us, Them)
 × ×
 ? ?
 [ They ] watched the game. The coach selected [ them ].`}</pre>
 <SubSection title="8.1.1 Subject Pronouns">
 <p>Subject pronouns act as the subject of a sentence. They appear before the main action verb. Examples: She studies diligently. / We visited the museum in Nairobi.</p>
 </SubSection>
 <SubSection title="8.1.2 Object Pronouns">
 <p>Object pronouns receive the action in a sentence. They appear after the main action verb or after a preposition. Examples: The teacher praised him. / David ran toward them.</p>
 </SubSection>
 </SubSection>

 <SubSection title="8.2 Comparative and Superlative Adjectives">
 <p>Adjectives change their structural endings or use helper words when comparing different nouns.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` BASE ADJECTIVE COMPARATIVE (-er / more) SUPERLATIVE (-est / most)
 Modifies 1 Noun Compares 2 Nouns Compares 3+ Nouns
 (e.g., Tall, Beautiful) (e.g., Taller, More beautiful) (e.g., Tallest, Most beautiful)`}</pre>
 <SubSection title="8.2.1 Core Rules for Making Comparisons">
 <BulletList items={[
 'Short Words (1 Syllable): Add -er for comparative statements and -est for superlative statements. Tall ? Taller ? Tallest. Fast ? Faster ? Fastest.',
 'Words Ending in -y: Drop the y and add -ier or -iest. Heavy ? Heavier ? Heaviest. Happy ? Happier ? Happiest.',
 'Long Words (2+ Syllables): Use the word more for comparative statements and most for superlative statements. Do not change the ending of the base word. Beautiful ? More beautiful ? Most beautiful. Careful ? More careful ? Most careful.',
 'Irregular Changes: Some adjectives change their spelling entirely. Good ? Better ? Best. Bad ? Worse ? Worst.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="8.3 Reading Comprehension: Context Clue Strategies">
 <p>When reading an unfamiliar word in a text, you can use context clues × the words, phrases, and sentences surrounding the mystery term × to discover its meaning without looking it up in a dictionary.</p>
 <SubSection title="8.3.1 Four Common Context Clue Types">
 <BulletList items={[
 'Definition Clues: The text defines the word immediately in the next clause. Example: The cave was gargantuan, meaning it was completely huge and spacious.',
 'Synonym Clues: The text pairs the hard word with a simple word that means the same thing. Example: The paths were treacherous and dangerous to walk on.',
 'Antonym Clues: The text shows a contrast or opposite word nearby. Example: Unlike his boisterous brother, Juma was completely quiet and calm.',
 'Example Clues: The author lists specific items that explain the term. Example: She gathered her stationery, such as pens, pencils, notebooks, and rulers.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="8.4 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Pronoun Case Selection</h4>
 <p>Problem: Choose the correct pronoun from the brackets to complete the sentence: "Musa and [I / me] finished the school project, and the principal gave the prize to [we / us]."</p>
 <p><strong>Step-by-step Solution:</strong> Analyze the first choice: "Musa and [I / me] finished..." This part is performing the action before the verb "finished." It sits in the subject position. The correct subject pronoun is I. Analyze the second choice: "...gave the prize to [we / us]." This part follows the action verb and the preposition "to." It receives the action. The correct object pronoun is us. Final Sentence: "Musa and I finished the school project, and the principal gave the prize to us."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Adjective Form Transformations</h4>
 <p>Problem: Fill in the blank with the correct form of the adjective in brackets: "Mount Kenya is ______________ than Mount Elgon, but Mount Kilimanjaro is the ______________ peak in Africa." [high]</p>
 <p><strong>Step-by-step Solution:</strong> Analyze the first blank: The sentence compares two items ("Mount Kenya" and "Mount Elgon") and uses the structural clue word "than." This requires a comparative form. Add -er: higher. Analyze the second blank: The sentence compares Mount Kilimanjaro against all other peaks in Africa (3+ items) and uses the clue word "the." This requires a superlative form. Add -est: highest. Final Sentence: "Mount Kenya is higher than Mount Elgon, but Mount Kilimanjaro is the highest peak in Africa."</p>
 </div>
 </SubSection>

 <SubSection title="8.5 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1: Pronoun Replacement</h4>
 <p>Rewrite each sentence, replacing the underlined noun phrase with the correct subject or object pronoun: a) The wild baboons swung through the trees to escape the leopard. b) The headteacher called Sarah and Mary into the office.</p>
 <p><strong>Answer:</strong> a) They swung through the trees to escape the leopard. (Replaces a plural subject noun phrase). b) The headteacher called them into the office. (Replaces a plural object noun phrase).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2: Advanced Adjective Form Usage</h4>
 <p>Complete the sentences by writing the correct comparative or superlative form of the adjective provided in the brackets: a) This English assignment is ____________________ than yesterday's quiz. [difficult] b) Amina is the ____________________ runner in our entire class. [good] c) A stone house is ____________________ than a mud hut. [heavy]</p>
 <p><strong>Answer:</strong> a) more difficult (Rule: "Difficult" has three syllables, so it uses "more" for comparison). b) best ("Good" changes irregularly to "better" then "best." Use "best" here because of the superlative context clue "the... in our entire class"). c) heavier (Rule: Drop the final 'y' from "heavy" and insert "-ier").</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 3: Context Clue Decoding</h4>
 <p>Read the sentence below and use context clues to find the meaning of the bolded word: "The dry soil was completely arid, so none of the maize crops could grow or find water." What is the definition of arid based on the clues?</p>
 <p><strong>Answer:</strong> Arid means dry, parched, or lacking water. The text provides clear example context clues by stating that the soil was "dry" and that the crops could not "find water."</p>
 </div>
 </SubSection>

 <SubSection title="?? INTERACTIVE REVISION ASSESSMENT: MODULE 8">
 <p>Test your mastery of advanced pronouns, comparative adjectives, and context decoding strategies with this interactive quiz structure.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Quiz: Grade 4 Advanced Syntax</h4>
 <p><strong>Question 1 (Topic: Object Pronouns):</strong> Choose the correct pronoun to complete the sentence: "David saw Juma and Kamau at the market, so he walked over to speak with __________." A) they (Incorrect × subject pronoun). B) them (Correct! Object pronoun after preposition "with"). C) their (Incorrect × possessive adjective). D) us (Incorrect × includes speaker). Hint: Look for the pronoun that goes after the word "with" to represent Juma and Kamau.</p>
 <p><strong>Question 2 (Topic: Adjectives):</strong> Choose the correct form of the adjective to complete the sentence: "This is the __________ storybook I have ever read from the library." A) more interesting (Incorrect × compares two). B) most interesting (Correct! Superlative for comparing against all books). C) interestingest (Incorrect × long words don't take -est). D) interestinger (Incorrect). Hint: Look for "the" before the blank space × it signals a superlative.</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? CURRICULUM SYNTAX MATRIX</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ COGNITIVE SYNTAX FRAMEWORK ]
 ×
 +-----------------------------------------------------------+
 ? ?
 [ Sentence Building Blocks ] [ Text Decoding Keys ]
 × Subject Cases vs. Object Cases × Synonym Clues (Simple matches) × Single Syllables (-er / -est) × Antonym Clues (Opposite checks) × Multi-Syllables (More / Most) × Definition Clues (Direct labels)`}</pre>
 </div>
 </Section>

 <Section title="MODULE 9: ACTIVE vs. PASSIVE VOICE, INTERJECTIONS, AND QUANTIFIERS">
 <SubSection title="9.1 Active and Passive Voice Transitions">
 <p>The voice of a verb tells the reader whether the subject of the sentence performs the action or receives the action. In Grade 4, you must learn to balance and transition between these two sentence styles.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` ACTIVE VOICE: The student [Subject] → --(wrote)--> → the composition [Object].
 × ?
 ? (The object shifts to the front) × PASSIVE VOICE: The composition [Subject] → --(was written by)--> → the student.`}</pre>
 <SubSection title="9.1.1 Active Voice">
 <p>In the active voice, the subject of the sentence performs the action. This makes your sentences clear, direct, and energetic. Structure: Subject + Verb + Object. Example: Juma kicked the football.</p>
 </SubSection>
 <SubSection title="9.1.2 Passive Voice">
 <p>In the passive voice, the subject receives the action. The original object moves to the front of the sentence, and the action is usually performed "by" someone or something. Structure: New Subject + Form of "To Be" + Past Participle + By + Agent. Example: The football was kicked by Juma.</p>
 </SubSection>
 </SubSection>

 <SubSection title="9.2 Interjections and Expressive Punctuation">
 <p>An interjection is a word or short phrase thrown into a sentence to express sudden emotion, surprise, excitement, or shock. They stand outside the normal rules of sentence grammar.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` → INTERJECTIONS --&gt; → [ Wow! ] That performance was amazing! 
 [ Ouch! ] The thorn pricked my finger.`}</pre>
 <SubSection title="9.2.1 Punctuation Rules for Interjections">
 <BulletList items={[
 'Strong Emotion: Follow the interjection with an exclamation point (!) and capitalize the next word. Example: Hooray! We won the championship match!',
 'Mild Emotion: Follow the interjection with a comma (,) and continue the sentence in lowercase. Example: Oh, I did not realize you were standing there.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="9.3 Quantifiers: Counting and Measuring Nouns">
 <p>A quantifier is a word placed right before a noun to give information about its quantity × telling the reader how much or how many of something exists without giving an exact number.</p>
 <SubSection title="9.3.1 Common Grade 4 Quantifier Pairings">
 <BulletList items={[
 'Many / Much: Many is used exclusively with countable nouns (things you can count individually). Examples: Many books, many students, many trees. Much is used exclusively with uncountable nouns (things you cannot count one by one, like liquids, grains, or feelings). Examples: Much water, much rain, much happiness.',
 'Some / Any: Some is used in positive, telling sentences. Example: There is some milk left in the plastic jug. Any is used in negative statements or questions. Example: Is there any chalk left on the shelf? / I do not have any pencils.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="9.4 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Active to Passive Voice Transformation</h4>
 <p>Problem: Convert the following active voice sentence into clean, grammatically correct passive voice: "The headteacher praised the honest boy during the school assembly."</p>
 <p><strong>Step-by-step Solution:</strong> Identify the sentence components: Subject (Doer): The headteacher. Verb (Action): praised (Past tense). Object (Receiver): the honest boy. Move the object to the front: Start your new sentence with The honest boy. Add the correct helping verb and past participle: Because the original action happened in the past ("praised") and the receiver is singular ("boy"), use was praised. Add the doer using "by": Append by the headteacher. Include the remaining details: Keep during the school assembly at the end. Final Passive Sentence: "The honest boy was praised by the headteacher during the school assembly."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Selecting Correct Quantifiers</h4>
 <p>Problem: Choose the correct quantifiers from the brackets to complete the story passage: "The traveler did not have [many / much] luggage, but he still needed [any / some] assistance to cross the flooded river."</p>
 <p><strong>Step-by-step Solution:</strong> Analyze the first choice: Look at the noun "luggage." Luggage is an uncountable noun in English. Therefore, it requires the quantifier much. Analyze the second choice: The clause is a positive, affirmative statement ("he still needed..."). Affirmative sentences require some. Final Sentence: "The traveler did not have much luggage, but he still needed some assistance to cross the flooded river."</p>
 </div>
 </SubSection>

 <SubSection title="9.5 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1: Voice Transitions</h4>
 <p>State whether each sentence is in the Active Voice or Passive Voice, then rewrite it in the opposite voice style: a) The wild leopard chased the baboon. b) The heavy wooden boxes were carried by the strong workers.</p>
 <p><strong>Answer:</strong> a) Active Voice. Passive Rewrite: The baboon was chased by the wild leopard. b) Passive Voice. Active Rewrite: The strong workers carried the heavy wooden boxes.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2: Interjection Punctuation</h4>
 <p>Rewrite and punctuate the sentences below correctly by placing commas, periods, or exclamation points in their proper locations: a) alas the traveler lost his map in the dense forest b) bravo you answered the hard vocabulary question correctly</p>
 <p><strong>Answer:</strong> a) Alas! The traveler lost his map in the dense forest. (Alas expresses sadness or misfortune, requiring an exclamation point. The next word "The" must be capitalized). b) Bravo! You answered the hard vocabulary question correctly. (Bravo expresses praise and excitement).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 3: Quantifier Sorting</h4>
 <p>Fill in the blanks with the correct words from the options provided in the brackets: (many, much, some, any) a) How ______________ liters of milk did you purchase from the dairy? [many / much] b) We do not have ______________ homework to complete this evening. [some / any] c) The heavy storm brought too ______________ water into the small garden plots. [many / much]</p>
 <p><strong>Answer:</strong> a) many (Even though milk itself is uncountable, "liters" is a countable unit). b) any (Used here because the sentence is negative: "do not have"). c) much (Water is an uncountable noun).</p>
 </div>
 </SubSection>

 <SubSection title="?? INTERACTIVE REVISION ASSESSMENT: MODULE 9">
 <p>Test your understanding of voice configurations, interjection punctuation, and quantifier limits with this quiz interface.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Quiz: Grade 4 Voice and Expressions</h4>
 <p><strong>Question 1 (Topic: Active vs. Passive):</strong> Identify the correct passive voice translation of this sentence: "The class teacher cleans the whiteboard before the lesson." A) The whiteboard cleans the class teacher before the lesson. (Incorrect). B) The whiteboard is cleaning by the class teacher before the lesson. (Incorrect). C) The whiteboard was cleaned by the class teacher before the lesson. (Correct! Object placed at the front, past passive verb "was cleaned," agent "by the class teacher"). D) The whiteboard were cleaned by the class teacher before the lesson. (Incorrect × subject-verb disagreement). Hint: Look for "was cleaned by."</p>
 <p><strong>Question 2 (Topic: Quantifiers):</strong> Choose the correct word to complete the asking sentence: "Did the principal ask __________ questions about the missing library book?" A) much (Incorrect × "questions" is countable). B) any (Correct! "Any" is appropriate for questions about countable or uncountable things). C) much lines of (Incorrect). D) some (Incorrect × typically used in positive statements). Hint: We use "any" when asking questions or making negative statements.</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? EXUANT QUANTIFIER MATRIX</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ CURRICULUM VOICE MATRIX ]
 ×
 +-------------------------------------------------------+
 ? ?
 [ Sentence Mechanics ] [ Count Configurations ]
 × Active Voice (Subject acts) × Countable Nouns --> Use Many × Passive Voice (Subject receives) × Uncountable Nouns --> Use Much × Interjections! (Sudden feelings) × Negative/Queries --> Use Any`}</pre>
 </div>
 </Section>

 <Section title="MODULE 10: SYNONYMS, ANTONYMS, DETERMINERS, AND IDIOMATIC EXPRESSIONS">
 <SubSection title="10.1 Synonyms and Antonyms">
 <p>Expanding your vocabulary helps you write clear, interesting paragraphs without repeating the same words.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` SYNONYMS (Same Meaning) ANTONYMS (Opposite Meaning) × Ancient → &lt;--&gt; Old × Ancient → &lt;--&gt; Modern × Courteous &lt;--&gt; Polite × Courteous &lt;--&gt; Rude × Feeble &lt;--&gt; Weak × Feeble &lt;--&gt; Strong`}</pre>
 <SubSection title="10.1.1 Synonyms">
 <p>Synonyms are words that have the same or very similar meanings in a sentence. Examples: commence / start; fatigued / tired; fragile / breakable; conceal / hide.</p>
 </SubSection>
 <SubSection title="10.1.2 Antonyms">
 <p>Antonyms are words that mean the exact opposite of each other. Examples: generous / selfish; timid / bold; ascend / descend; scarcity / abundance.</p>
 </SubSection>
 </SubSection>

 <SubSection title="10.2 Determiners: Articles and Demonstratives">
 <p>A determiner is a word placed right before a noun to clarify what the noun refers to. In Grade 4, we focus on articles and location markers.</p>
 <SubSection title="10.2.1 Articles (A, An, The)">
 <BulletList items={[
 'A / An (Indefinite Articles): Used to talk about a single, non-specific person or thing. Use a before consonant sounds and an before vowel sounds (a, e, i, o, u). Examples: a university (starts with a \'yu\' consonant sound), an hour (starts with a silent \'h\' vowel sound), a school.',
 'The (Definite Article): Used to talk about a specific, unique, or previously mentioned noun. Example: We saw a dog. The dog was barking at the gate.'
 ]} />
 </SubSection>
 <SubSection title="10.2.2 Demonstrative Determiners">
 <p>These words point to specific nouns based on how close or far away they are from the speaker.</p>
 <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
 <tbody>
 <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Spatial Distance</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Singular Nouns</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Plural Nouns</th></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Near (Close by)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>This (e.g., This pen in my hand)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>These (e.g., These shoes on my feet)</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Far (Distant)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>That (e.g., That bird on the hill)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Those (e.g., Those stars in the sky)</td></tr>
 </tbody>
 </table>
 </SubSection>
 </SubSection>

 <SubSection title="10.3 Idiomatic Expressions">
 <p>An idiom or idiomatic expression is a phrase where the words combined have a hidden, figurative meaning. You cannot understand an idiom by looking at the literal dictionary definitions of the individual words.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` → IDIOM PHRASE --&gt; → [ A piece of cake ] --&gt; → LITERAL: A slice of sweet baked food.
 --> → HIDDEN MEANING: Something that is very easy to do.`}</pre>
 <SubSection title="10.3.1 Common Grade 4 Idiomatic Meanings">
 <BulletList items={[
 'Once in a blue moon: Something that happens very rarely.',
 'See eye to eye: To agree completely with someone else.',
 'Under the weather: Feeling slightly sick or unwell.',
 'Hit the sack: To go to bed to sleep because you are tired.',
 'Hold your horses: To wait patiently or slow down.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="10.4 Worked Examples">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 1: Contextual Synonym Swapping</h4>
 <p>Problem: Rewrite the sentence below by replacing the underlined words with their matching synonyms from this list: (fatigued, concealed, courteous) "The polite messenger hid the letter inside the leather pouch because he was tired."</p>
 <p><strong>Step-by-step Solution:</strong> Find a match for polite: Courteous means showing good manners. The match is courteous. Find a match for hid: Concealed means kept out of sight. The match is concealed. Find a match for tired: Fatigued means exhausted from work. The match is fatigued. Output Sentence: "The courteous messenger concealed the letter inside the leather pouch because he was fatigued."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Example 2: Demonstrative Determiner Choice</h4>
 <p>Problem: Choose the correct demonstrative determiners from the options inside the brackets: "Please pick up [this / these] single pencil resting right here on my desk, and then carry it to [those / that] distant shelf across the classroom."</p>
 <p><strong>Step-by-step Solution:</strong> Analyze the first choice: The noun "pencil" is singular, and the clue "right here" means it is close by. The correct singular near determiner is this. Analyze the second choice: The noun "shelf" is singular, and the clue "distant across the classroom" means it is far away. The correct singular distant determiner is that. Final Sentence: "Please pick up this single pencil resting right here on my desk, and then carry it to that distant shelf across the classroom."</p>
 </div>
 </SubSection>

 <SubSection title="10.5 Practice Questions and Detailed Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1: Article Corrections</h4>
 <p>Identify and fix the article errors in the following raw text sentence: An European traveler waited for a hour at the bus terminal to catch the specific train.</p>
 <p><strong>Answer:</strong> An European → A European. (Correction: "European" starts with a 'yu' consonant sound, so it must take the article "a"). a hour → an hour. (Correction: "Hour" has a silent 'h', starting with a vowel sound, so it takes "an"). Corrected Output: A European traveler waited for an hour at the bus terminal to catch the specific train.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2: Antonym Matching</h4>
 <p>Write down the correct antonym (opposite meaning) for each word using the choices provided in the brackets: (bold, abundance, descend, generous) a) Scarcity &lt;--&gt; ________________________ b) Ascend &lt;--&gt; ________________________ c) Timid &lt;--&gt; ________________________ d) Selfish &lt;--&gt; ________________________</p>
 <p><strong>Answer:</strong> a) Scarcity &lt;--&gt; abundance (Scarcity means a shortage; abundance means a large supply). b) Ascend &lt;--&gt; descend (Ascend means to go up; descend means to go down). c) Timid &lt;--&gt; bold (Timid means shy or scared; bold means brave). d) Selfish &lt;--&gt; generous (Selfish means keeping everything; generous means sharing).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 3: Idiom Interpretation</h4>
 <p>Read the scenario and identify which idiomatic expression explains the underlined phrase: "John did not go to school today because he was feeling slightly sick and dizzy. His mother told him to go to bed to sleep."</p>
 <p><strong>Answer:</strong> "Feeling slightly sick and dizzy" matches the idiom under the weather. "Go to bed to sleep" matches the idiom hit the sack.</p>
 </div>
 </SubSection>

 <SubSection title="?? INTERACTIVE REVISION ASSESSMENT: MODULE 10">
 <p>Test your knowledge of words, articles, markers, and figurative meanings with this final quiz interface.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Quiz: Grade 4 Determiners and Vocabulary</h4>
 <p><strong>Question 1 (Topic: Idiomatic Phrasing):</strong> What is the true hidden meaning of the bolded idiom in this sentence: "The math test was a piece of cake, so Mary scored a perfect mark." A) The test was delicious and sweet. (Incorrect). B) The test was very easy to complete. (Correct! "A piece of cake" means a task is completely simple and effortless). C) The test took a very long time. (Incorrect). D) The test was hard and confusing. (Incorrect). Hint: Mary scored a perfect mark × the test was not difficult!</p>
 <p><strong>Question 2 (Topic: Determiners):</strong> Choose the correct word to point to a group of birds flying high up in the far away clouds: "Look at __________ birds flying past the mountain peak!" A) this (Incorrect × singular, near). B) these (Incorrect × plural, near). C) that (Incorrect × singular, far). D) those (Correct! "Those" is for plural nouns located far away). Hint: Check if the noun is singular or plural first. "Birds" is plural. Next, check distance × clouds are far away!</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? VOCABULARY AND DETERMINER MATRIX</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ VOCABULARY AND BUILDING MATRIX ]
 ×
 +-------------------------------------------------------------+
 ? ?
 [ Word Level Meanings ] [ Structural Pointers ]
 × Synonyms (Same core definition) × Near Pointers --> This / These × Antonyms (Opposite scales) × Far Pointers --> That / Those × Idioms (Hidden, figurative expressions) × Article Anchors --> A / An / The`}</pre>
 </div>
 </Section>

 {/* GRADE 4 ENGLISH COMPREHENSIVE FINAL EXAMINATION */}
 <Section title="GRADE 4 ENGLISH COMPREHENSIVE FINAL EXAMINATION">
 <p><strong>DURATION: 2 Hours | TOTAL MARKS: 100° MARKS</strong></p>
 <p>INSTRUCTIONS TO CANDIDATES: Read every question very carefully before writing your answer. Answer all questions in the spaces provided. Write neatly and use correct grammar, spelling, and punctuation.</p>

 <SubSection title="SECTION A: READING COMPREHENSION & VOCABULARY (30° MARKS)">
 <p>Directions: Read the story below carefully, then use clues from the text to answer the questions that follow.</p>
 
 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? The Mystery of the Shimmering Pond</h4>
 <p>Kito woke up early on Saturday morning. The sun was rising behind the green hills of Kericho, casting long shadows across the tea fields. Today was an important day; his grandfather, Mzee Baraka, was going to take him deep into the forest to see the old water reservoir. Kito rushed to the kitchen, ate his warm bowl of porridge, and packed his small canvas backpack with a water bottle and a notebook.</p>
 <p>They walked along a narrow footbridge that ran directly between two high rocky cliffs. The air was cool and crisp. Suddenly, Mzee Baraka stopped. He pointed through the dense trees toward an open clearing. "Look, Kito," he said softly. "The shimmering pond is right there." Kito gasped in surprise. The water was as clear as glass, reflecting the tall trees around it.</p>
 <p>Unlike his boisterous younger sister who always shouted, Kito stood completely quiet and calm. He noticed a beautiful bird building its nest with small twigs on a low branch. "It's a rare kingfisher," Mzee Baraka whispered. "It often visits this peaceful spot to catch small fish."</p>
 <p>Just then, Kito noticed a plastic bottle floating near the edge. He felt his chest tighten with sadness. He knew that pollution was treacherous and dangerous to wild animals. Kito quickly reached down, scooped the bottle out of the clean water, and placed it inside his bag. Mzee Baraka smiled proudly. "Protecting nature is a piece of cake if everyone picks up one piece of litter," he said. They sat beneath the cool shade of a large mango tree, feeling happy that they had kept the pond safe.</p>
 </div>

 <SubSection title="Part 1: Textual Comprehension (15° Marks)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>1. Where does the story take place? (Literal Recall) [2 Marks]</strong></p>
 <p>Answer: In the forest near the green hills / tea fields of Kericho.</p>
 <p><strong>2. What did Kito pack inside his canvas backpack? Name two items. (Literal Recall) [2 Marks]</strong></p>
 <p>Answer: A water bottle and a notebook.</p>
 <p><strong>3. Why did Kito stand completely quiet and calm when he saw the pond? (Inferential Analysis) [3 Marks]</strong></p>
 <p>Answer: Because he was well-behaved/not boisterous, or because he was amazed and surprised by the beautiful, clear appearance of the shimmering pond.</p>
 <p><strong>4. What did Kito do when he noticed a plastic bottle floating in the clean water? (Literal Recall) [2 Marks]</strong></p>
 <p>Answer: He scooped it out of the clean water and placed it inside his bag.</p>
 <p><strong>5. Based on the story, why was Mzee Baraka proud of Kito? (Analytical Thought) [3 Marks]</strong></p>
 <p>Answer: Because Kito took responsibility for the environment by picking up plastic litter without being asked, showing care for wild animals.</p>
 <p><strong>6. What lesson does this story teach us about the environment? (Critical Thinking) [3 Marks]</strong></p>
 <p>Answer: It teaches us environmental stewardship; that nature is beautiful but fragile, and that keeping the environment clean is easy if everyone picks up their own litter.</p>
 </div>
 </SubSection>

 <SubSection title="Part 2: Vocabulary & Context Clues (15° Marks)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>7. Look at the bolded word backpack in the text. What mechanical word type is this? [2 Marks]</strong></p>
 <p>Answer: B) A compound word (back + pack).</p>
 <p><strong>8. Look at the bolded word boisterous in the third paragraph. The text states: "Unlike his boisterous younger sister who always shouted, Kito stood completely quiet and calm." Use this antonym clue to define boisterous. [3 Marks]</strong></p>
 <p>Answer: Boisterous means loud, noisy, rowdy, or energetic. The context states it is the opposite of "quiet and calm" and involves "shouting."</p>
 <p><strong>9. Read this sentence from the text: "He knew that pollution was treacherous and dangerous to wild animals." Identify the synonym clue used by the author to explain the meaning of treacherous. [2 Marks]</strong></p>
 <p>Answer: dangerous ("...was treacherous and dangerous...").</p>
 <p><strong>10. In the final paragraph, Mzee Baraka says: "Protecting nature is a piece of cake if everyone picks up one piece of litter." What is the figurative meaning of the bolded idiom a piece of cake? [3 Marks]</strong></p>
 <p>Answer: C) Extremely easy to do.</p>
 <p><strong>11. Find synonyms in the story text for the following words: [3 Marks]</strong></p>
 <p>a) Large/heavy bag (Paragraph 1): backpack | b) Quiet/tranquil (Paragraph 3): peaceful | c) Under (Paragraph 4): beneath.</p>
 <p><strong>12. Write the correct opposite (antonym) for these words found in the text: [2 Marks]</strong></p>
 <p>a) Safe (Paragraph 4) &lt;--&gt; treacherous / dangerous | b) Early (Paragraph 1) &lt;--&gt; late.</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="SECTION B: GRAMMAR & SENTENCE MECHANICS (40 MARKS)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>13. Classify the underlined words into their correct parts of speech: [4 Marks]</strong> "The clever student quickly solved the hard riddle in Nairobi using a pen."</p>
 <p>Answer: a) clever: Adjective | b) quickly: Adverb | c) Nairobi: Proper Noun | d) pen: Common Noun.</p>
 <p><strong>14. Subject-Verb Agreement: Choose the correct verb form inside the brackets: [4 Marks]</strong></p>
 <p>a) The long tracks for the new train [is / are] complete. → are (matches plural tracks).</p>
 <p>b) Every evening, the young girl [sings / sing] a beautiful hymn. → sings (matches singular girl).</p>
 <p>c) Musa and his brothers [walk / walks] to school together. → walk (plural subject).</p>
 <p>d) A pack of wild dogs [was / were] barking loudly last night. → was (collective singular pack).</p>
 <p><strong>15°. Complete the chart by filling in the missing Comparative and Superlative adjective forms: [6 Marks]</strong></p>
 <p>Fast: a) faster | b) fastest. Heavy: c) heavier | d) heaviest. Beautiful: e) more beautiful | f) most beautiful.</p>
 <p><strong>16. Pronoun Selection: Choose the correct subject or object pronoun from the brackets: [4 Marks]</strong></p>
 <p>a) Musa and [I / me] finished our English revision homework early. → I (Subject).</p>
 <p>b) The class teacher called Sarah and Mary, then she gave the books to [they / them]. → them (Object).</p>
 <p>c) David saw a wild monkey in the tree and tried to track [it / its] movements. → its (Possessive).</p>
 <p>d) [We / Us] are going to visit the museum next Tuesday. → We (Subject).</p>
 <p><strong>17. Change all the bolded, present-tense action verbs into their proper past-tense forms: [4 Marks]</strong> "The clever bird flies to the branch, sings a sweet melody, and catches a small insect."</p>
 <p>a) flies → flew | b) sings → sang | c) catches → caught | d) Is the past tense of catch regular or irregular? Irregular.</p>
 <p><strong>18. Punctuate the following direct speech sentence correctly by adding commas, capital letters, and quotation marks: [4 Marks]</strong> the teacher smiled and said we will start our writing exam now</p>
 <p>Answer: The teacher smiled and said, "We will start our writing exam now."</p>
 <p><strong>19. Speech Conversion: Convert this sentence from Direct Speech into Indirect (Reported) Speech: [4 Marks]</strong> Sarah said, "I want to visit the library today."</p>
 <p>Answer: Sarah said that she wanted to visit the library that day.</p>
 <p><strong>20. Active to Passive Voice: Rewrite this active voice sentence into correct passive voice: [4 Marks]</strong> "The headteacher praised the honest boy during the morning assembly."</p>
 <p>Answer: The honest boy was praised by the headteacher during the morning assembly.</p>
 <p><strong>21. Quantifiers and Determiners: Fill in the blanks using the correct words from the brackets: [6 Marks]</strong></p>
 <p>a) There wasn't ______________ water left in the plastic jug. [some / any] → any</p>
 <p>b) How ______________ kilometers did you walk this morning? [many / much] → many</p>
 <p>c) The rich merchant did not spend ______________ money on clothes. [many / much] → much</p>
 <p>d) Look at ______________ distant stars shining high up in the night sky over there! [these / those] → those</p>
 <p>e) Juma waited for ______________ hour at the station. [a / an] → an</p>
 <p>f) Have you seen ______________ new blue pen that I lost yesterday? [a / the] → the</p>
 </div>
 </SubSection>

 <SubSection title="SECTION C: ADVANCED MECHANICS & HOMOPHONES (15° MARKS)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>22. Affix Analysis: Break down the word unhelpful into its core structural components: [3 Marks]</strong></p>
 <p>a) Prefix: un- | b) Root Word: help | c) Suffix: -ful.</p>
 <p><strong>23. Prepositions of Spatial Orientation: Fill in the blanks with the correct prepositions from the list: [4 Marks]</strong> [ under / between / behind / on ]</p>
 <p>a) The nervous puppy hid completely ______________ the thick curtain so no one could see it. → behind</p>
 <p>b) The footbridge runs directly ______________ the two high rocky cliffs. → between</p>
 <p>c) Please place the heavy textbook flat ______________ the top surface of the desk. → on</p>
 <p>d) The tired farmers rested beneath the cool shade ______________ a large mango tree. → under</p>
 <p><strong>24. Homophone Selection: Circle or write down the correct word inside the brackets: [4 Marks]</strong></p>
 <p>a) The [to / too / two] boys left their books on the table. → two</p>
 <p>b) The soup is far [to / too / two] salty to eat comfortably. → too</p>
 <p>c) The children ran over [there / their / they're] to play football. → there</p>
 <p>d) The small cat licked [its / it's] wet paws after drinking the milk. → its</p>
 <p><strong>25°. Adverbs of Frequency: Rewrite the sentence below by placing the adverb "always" in its correct grammatical position: [4 Marks]</strong> "Amina is alert during her morning lessons."</p>
 <p>Answer: Amina is always alert during her morning lessons. (Rule: placed after the verb 'is').</p>
 </div>
 </SubSection>

 <SubSection title="SECTION D: CREATIVE WRITING & COMPOSITION (15° MARKS)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>26. Composition Structuring Framework [5 Marks]</strong> Match each section of a narrative story composition with its primary structural goal:</p>
 <p>1. Introduction → B. Set the baseline scene, introduce main characters, and establish the time and place.</p>
 <p>2. Body Paragraphs → C. Develop the plot actions, build up the exciting main event, and present obstacles.</p>
 <p>3. Conclusion → A. Wrap up the plot, show final outcomes, and describe internal characters' feelings.</p>
 <p><strong>27. Creative Narrative Writing [10 Marks]</strong> Write a short, engaging composition paragraph (4 to 5 sentences) titled: "An Unexpected Surprise". Ensure you use at least one adjective, one adverb of frequency, and correct punctuation. Remember to check your indentations and topic sentences!</p>
 <p><strong>Example Paragraph:</strong> It was a quiet Saturday afternoon when the doorbell suddenly rang. Juma always answers the door quickly, so he ran to the hallway. He opened the heavy wooden door and gasped in immense shock. There stood his favorite uncle holding a large, shiny present wrapper! It was an unexpected surprise that made Juma leap with absolute joy.</p>
 </div>
 </SubSection>

 <SubSection title="?? COMPREHENSIVE ANSWER KEY & MARKING SCHEME">
 <p>The complete answer key for all sections is provided above inline with each question. Refer to the answers embedded within each question block for grading.</p>
 </SubSection>
 </Section>
 </div>
 );

}
// ---------- KISWAHILI NOTES ----------
function KiswahiliNotes() {
 return (
 <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
 <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Kiswahili: Mwongozo Kamili</h2>
 <p>Mada hii imegawanywa katika sehemu kuu nne: Sarufi na Ngeli, Msamiati wa Kila Siku, Hadithi tano za Kusisimua, na Mazoezi ya kina yenye majibu yake.</p>

 <Section title="SEHEMU YA 1: SARUFI NA NGELI ZA KISWAHILI">
 <p>Sarufi ni utaratibu wa sheria za lugha unaomwezesha mzungumzaji au mwandishi kuunda sentensi sahihi. Katika darasa la nne, tunajifunza jinsi maneno yanavyoainishwa na jinsi yanavyopatana katika ngeli mbalimbali.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ SEHEMU ZA HOTUBA ]
 ×
 +---------------------------+---------------------------+
 ? ? ?
 [ NOMINO ] [ VITENDO ] [ VIVUMISHI ]
 Maneno ya majina Maneno ya kazi Maneno ya sifa
 (Mwalimu, Nairobi) (Anasoma, Anakimbia) (Muri, Mkubwa)`}</pre>

 <SubSection title="1.1 Aina za Nomino (Naming Words)">
 <p>Nomino ni neno linalotaja jina la mtu, mahali, mnyama, kitu au hali.</p>
 <BulletList items={[
 'Nomino za Pekee (Proper Nouns): Haya ni majina maalum ya watu, mahali, nchi, au siku. Huandikwa kwa herufi kubwa mwanzoni kila wakati. Mifano: Juma, Kenya, Nairobi, Jumatatu, Disemba.',
 'Nomino za Jumla/Kawaida (Common Nouns): Haya ni majina ya jumla ya vitu au viumbe vya aina moja. Mifano: mvulana, shule, mbwa, mti, mto, kiti.'
 ]} />
 </SubSection>

 <SubSection title="1.2 Ngeli za Kiswahili (Noun Classes)">
 <p>Ngeli ni makundi ya nomino kulingana na jinsi zinavyobadilika kutoka umoja kwenda wingi na jinsi zinavyopatana na viambishi vya vitendo na vivumishi. Katika kiwango hiki, tunaangazia ngeli tatu kuu zifuatazo:</p>
 <SubSection title="1.2.1 Ngeli ya A-WA">
 <p>Ngeli hii inajumuisha majina ya viumbe hai wote (watu, wanyama, ndege, wadudu, na samaki).</p>
 <BulletList items={[
 'Umoja: Anaanza na kiambishi M- au hana, na kitendo huanza na A-. Mfano: Mtoto anasoma kitabu.',
 'Wingi: Anaanza na kiambishi WA-, na kitendo huanza na WA-. Mfano: Watoto wanasoma vitabu.'
 ]} />
 </SubSection>
 <SubSection title="1.2.2 Ngeli ya KI-VI">
 <p>Ngeli hii inajumuisha vifaa, vyombo, na vitu visivyo na uhai ambavyo huanza na "Ki-" katika umoja na "Vi-" katika wingi. Pia inajumuisha maneno ya udogo.</p>
 <BulletList items={[
 'Umoja: Huanza na KI- (au CH-), na kitendo huanza na KI- (au CH-). Mfano: Kiti kimevunjika. / Chombo chinazama.',
 'Wingi: Huanza na VI- (au VY-), na kitendo huanza na VI- (au VY-). Mfano: Viti vimevunjika. / Vyombo vyinazama.'
 ]} />
 </SubSection>
 <SubSection title="1.2.3 Ngeli ya LI-YA">
 <p>Ngeli hii inajumuisha matunda, viungo vya mwili vinavyopatikana kwa jozi (mawili), na vitu visivyo na uhai vinavyochukua viambishi maalum.</p>
 <BulletList items={[
 'Umoja: Kitendo kinachukua kiambishi LI-. Mfano: Embe limeanguka. / Jicho linauma.',
 'Wingi: Majina huanza na au yanaongezewa MA-, na kitendo huanza na YA-. Mfano: Maembe yameanguka. / Majicho yanauma.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="1.3 Wakati na Viambishi (Tenses)">
 <p>Kitendo kinaonyesha wakati ambapo jambo linafanyika. Viambishi vya wakati huwekwa katikati ya neno la kitendo.</p>
 <BulletList items={[
 'Wakati Uliopo (-NA-): Onyesha jambo linalofanyika sasa hivi. Mfano: Mama ananapika chakula.',
 'Wakati Uliopita (-LI-): Onyesha jambo lililokwisha fanyika na kumalizika. Mfano: Baba analienda sokoni jana.',
 'Wakati Ujao (-TA-): Onyesha jambo ambalo litafanyika baadaye. Mfano: Wanafunzi watafanya mtihani kesho.'
 ]} />
 </SubSection>
 </Section>

 <Section title="SEHEMU YA 2: MSAMIATI WA KILA SIKU (VOCABULARY)">
 <p>Kujifunza msamiati hukusaidia kuzungumza na kuandika Kiswahili sanifu kwa urahisi. Hapa kuna makundi muhimu ya msamiati:</p>
 <SubSection title="2.1 Sehemu za Mwili (Parts of the Body)">
 <BulletList items={[
 'Kichwa: Sehemu ya juu ya mwili iliyo na ubongo, macho, na nywele.',
 'Macho: Viungo vya kuonea (Umoja: Jicho).',
 'Masikio: Viungo vya kusikilia (Umoja: Sikio).',
 'Mkono: Kiungo cha kushikia na kufanyia kazi (Wingi: Mikono).',
 'Mguu: Kiungo cha kutembelea na kusimamia (Wingi: Miguu).',
 'Moyo: Kiungo cha ndani kinachosukuma damu mwilini.'
 ]} />
 </SubSection>
 <SubSection title="2.2 Mazingira ya Shuleni na Nyumbani">
 <BulletList items={[
 'Dawati: Meza ya mwanafunzi ya kuandikia darasani.',
 'Ubao: Sehemu ya mbele ya darasa ambapo mwalimu huandikia dokezo.',
 'Bustani: Sehemu ya nyumbani au shuleni inayopandwa maua au mboga.',
 'Jikoni: Chumba maalum cha kupikia chakula.',
 'Sebule: Chumba cha kuketi na kukaribisha wageni.'
 ]} />
 </SubSection>
 <SubSection title="2.3 Hesabu na Tarakimu (Numbers 1-100°)">
 <BulletList items={[
 '1 - Moja, 2 - Mbili, 3 - Tatu, 4 - Nne, 5 - Tano.',
 '10 - Kumi, 20 - Ishirini, 30 - Thelathini, 40 - Arobaini, 50 - Hamsini.',
 '100 - Mia moja.'
 ]} />
 </SubSection>
 </Section>

 <Section title="SEHEMU YA 3: HADITHI TANO (5) ZA KUSISIMUA NA MASWALI YA KINA">
 <p>Hapa kuna hadithi tano zilizotungwa kwa Kiswahili sanifu ili kukuza ustadi wako wa kusoma na kuelewa. Kila hadithi inafuatwa na maswali na majibu yake yaliyofafanuliwa hatua kwa hatua.</p>

 <SubSection title="?? HADITHI YA 1: Bidii ya Juma Masomoni">
 <p>Hapo zamani za kale, katika kijiji cha kijani kibichi cha Matunda, aliishi mvulana mmoja aliyeitwa Juma. Juma alikuwa mwanafunzi wa gredi ya nne katika Shule ya Msingi ya Upendo. Kila asubuhi, jogoo alipowika tu, Juma aliamka upesi, akapiga mswaki, akanawa uso na kuvaa sare zake safi za shule. Mama yake alimwandalia bakuli la uji moto wa mtama kila siku kabla ya yeye kuanza safari.</p>
 <p>Shule ya Upendo ilikuwa mbali sana na nyumbani kwao. Juma alilazimika kutembea kwa miguu kupitia njia nyembamba iliyokuwa kati ya mashamba makubwa ya miwa. Hata hivyo, Juma hakulalamika kamwe. Alijua kuwa elimu ni ufunguo wa maisha ya baadaye. Darasani, alimsikiliza mwalimu wake kwa makini sana na kuandika kazi zake zote kwenye daftari lake kwa mwandiko nadhifu.</p>
 <p>Siku ya Ijumaa, Mwalimu mkuu alitangaza matokeo ya mtihani wa muhula. Shule nzima ilikusanyika uwanjani. Juma alikuwa na wasiwasi mwingi moyoni mwake. Ghafla, mwalimu mkuu aliita kwa sauti kubwa, "Mwanafunzi bora katika gredi ya nne ni Juma Kipenzi!" Shule nzima ililipuka kwa makofi na vifijo. Juma alitabasamu kwa furaha kubwa huku akipokea zawadi ya vitabu vipya vya hadithi na mkoba wa shule. Alielewa kuwa jitihada zote huzaa matunda mema.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ KUCHAMBUA HADITHI YA 1 ]
 × Mhusika Mkuu: Juma (Mwanafunzi wa Gredi ya 4) × Mazingira: Kijiji cha Matunda / Shule ya Upendo × Funzo la Maadili: Bidii na subira huleta mafanikio makubwa.`}</pre>
 <SubSection title="Maswali na Majibu (Hadithi ya 1)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Swali la 1 (Kukumbuka):</strong> Juma alikuwa mwanafunzi wa darasa gani, na jina la shule yake lilikuwa gani?</p>
 <p><strong>Jibu:</strong> Juma alikuwa mwanafunzi wa gredi ya nne (darasa la nne) katika Shule ya Msingi ya Upendo.</p>
 <p><strong>Swali la 2 (Ufahamu):</strong> Kwa nini Juma hakulalamika ingawa shule yao ilikuwa mbali sana na alitembea kwa miguu?</p>
 <p><strong>Jibu:</strong> Juma hakulalamika kwa sababu alijua kuwa elimu ni ufunguo wa maisha ya baadaye. Alikuwa na lengo maalum maishani mwake.</p>
 <p><strong>Swali la 3 (Uchambuzi wa Msamiati):</strong> Pata neno katika aya ya kwanza linalomaanisha kifaa kinachotumiwa kusafishia meno.</p>
 <p><strong>Jibu:</strong> Neno hilo ni mswaki. (Kutoka kwenye sentensi: "...aliamka upesi, akapiga mswaki...").</p>
 <p><strong>Swali la 4 (Kufikiri kwa Kina):</strong> Ni zawadi gani ambazo Juma alipewa na mwalimu mkuu baada ya kuwa mwanafunzi bora?</p>
 <p><strong>Jibu:</strong> Juma alipewa zawadi ya vitabu vipya vya hadithi na mkoba wa shule.</p>
 <p><strong>Swali la 5 (Matumizi):</strong> Toa methali moja ya Kiswahili inayolingana na funzo la hadithi hii.</p>
 <p><strong>Jibu:</strong> Methali inayofaa ni: "Jitihada za mchwa ziligandisha simenti" au "Mvumilivu hula mbivu" au "Asiye na mwana aeleke jiwe, jitihada haishindi kudra." (Zote zinaonyesha kuwa bidii huleta mafanikio).</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="?? HADITHI YA 2: Mbwa Mwaminifu na Simba Katili">
 <p>Siku moja, katika msitu mnene wa Kipembe, kulikuwa na simba mmoja mkatili ambaye alipenda kuwatisha wanyama wadogo. Simba huyu alijiita mfalme wa msitu lakini hakuwa na huruma hata kidogo. Karibu na msitu huo, katika boma la Mzee Tambo, aliishi mbwa mmoja mweusi na jasiri aliyeitwa Simba-Dume. Ingawa aliitwa Simba-Dume, alikuwa mbwa mwaminifu sana aliyejifunza kulinda mifugo ya bwana wake kila usiku.</p>
 <p>Alasiri moja, mbuzi watatu wa Mzee Tambo walitoroka bomani na kuingia msituni kutafuta majani mabichi yenye juisi. Hawakujua kuwa simba mkatili alikuwa amelala chini ya mti wa mbuyu akisikiliza sauti za msitu. Simba alipoona mbuzi wale wanakaribia, alinyanyuka polepole, akajinyoosha, na kutoa mngurumo mkubwa uliotikisa majani yote. Mbuzi waliposikia mngurumo huo, walitetemeka kwa hofu na kushindwa hata kukimbia.</p>
 <p>Ghafla, Simba-Dume alitokea kama upepo! Alikuwa amefuata nyayo za mbuzi hao kutoka bomani. Bila kuogopa ukubwa wa simba, mbwa huyo jasiri alianza kubweka kwa nguvu sana, "Bua! Bua! Bua!" Aliruka mbele ya mbuzi wale ili kuwakinga. Simba alishangazwa sana na ujasiri wa mbwa huyo mdogo. Wakati huohuo, Mzee Tambo alikuwa anakaribia akipiga upandaji na mayowe akishika mkuki wake mkubwa. Simba alipoona kuwa amezungukwa na mbwa jasiri na mwanadamu mwenye silaha, aligeuka na kukimbilia katikati ya msitu. Mbuzi walirudi bomani salama shukrani kwa uaminifu wa Simba-Dume.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ KUCHAMBUA HADITHI YA 2 ]
 × Wahusika: Simba mkatili, Mbwa Simba-Dume, Mbuzi, Mzee Tambo.
 × Mgogoro: Mbuzi wanaingia msituni na hatarini kuliwa na simba.
 × Suluhisho: Mbwa Simba-Dume anafika kwa wakati na kuwakabili kwa ujasiri.`}</pre>
 <SubSection title="Maswali na Majibu (Hadithi ya 2)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Swali la 1 (Kukumbuka):</strong> Mbwa wa Mzee Tambo aliitwa jina gani, na alikuwa na tabia gani maalum?</p>
 <p><strong>Jibu:</strong> Mbwa wa Mzee Tambo aliitwa Simba-Dume, na tabia yake maalum ilikuwa uaminifu na ujasiri katika kulinda mifugo ya bwana wake.</p>
 <p><strong>Swali la 2 (Ufahamu):</strong> Ni mnyama gani aliyetajwa kama mkatili katika msitu wa Kipembe, na kwa nini mbuzi walikuwa hatarini?</p>
 <p><strong>Jibu:</strong> Mnyama mkatili alikuwa simba. Mbuzi walikuwa hatarini kwa sababu walitoroka bomani na kuingia msituni ambako simba huyo alikuwa akitafuta mawindo.</p>
 <p><strong>Swali la 3 (Uchambuzi):</strong> Eleza jinsi Simba-Dume alivyowaokoa mbuzi wale kabla ya Mzee Tambo kufika.</p>
 <p><strong>Jibu:</strong> Simba-Dume alifika kwa kasi, alianza kubweka kwa nguvu sana kuliko kawaida na aliruka mbele ya mbuzi wale ili kuwakinga na simba bila kuogopa ukubwa wa simba huyo.</p>
 <p><strong>Swali la 4 (Msamiati):</strong> Katika aya ya pili, neno "boma" lina maana gani?</p>
 <p><strong>Jibu:</strong> Neno boma linamaanisha mahali maalum palipojengewa uzio kwa ajili ya kufungia na kulinda wanyama wa nyumbani kama mbuzi, kondoo au ng'ombe.</p>
 <p><strong>Swali la 5 (Funzo):</strong> Hadithi hii inatufundisha nini kuhusu urafiki kati ya binadamu na mbwa?</p>
 <p><strong>Jibu:</strong> Hadithi inatufundisha kuwa mbwa ni mnyama mwaminifu sana na mlinzi mzuri wa mali za binadamu. Inatuhimiza kuwatunza vizuri wanyama hawa wa nyumbani.</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="?? HADITHI YA 3: Soko la Mapendo na Matunda ya Afya">
 <p>Kila siku ya Soko kuu, ambayo ilikuwa Jumamosi, kijiji cha Mapendo kilijaa na uchangamfu mwingi. Watu kutoka vijiji jirani walikuja kununua na kuuza bidhaa mbalimbali. Mama Amina alikuwa na kibanda kikubwa katikati ya soko hilo ambacho kilikuwa kimejaa matunda ya kila rangi na aina. Aliamini kuwa kula matunda safi ni siri ya kuwa na afya dhabiti na kuzuia magonjwa mengi mwilini.</p>
 <p>Asubuhi hiyo, gari la moshi lilipofika stesheni, wateja wengi walimiminika kwenye kibanda cha Mama Amina. Kulikuwa na maembe makubwa ya manjano, ndizi zilizoiva vizuri, mananasi yenye harufu nzuri, na machungwa yaliyojaa maji matamu. Msichana mmoja mdogo aliyeitwa Neema alikuja sokoni akiwa na bibi yake. Neema alikuwa anapenda sana kula peremende na keki, na mara nyingi alikataa kula matunda au mboga za majani nyumbani.</p>
 <p>Mama Amina aliona jinsi Neema alivyokuwa ananuna bibi yake alipokuwa akinunua machungwa. Alichukua kipande cha tikiti maji jekundu na tamu, akamkabidhi Neema kwa tabasamu na kusema, "Onja hii, binti mzuri. Hii ni peremende ya asili iliyotengenezwa na Mungu." Neema aliuma kipande kile polepole. Ghafla, macho yake yaling'aa kwa furaha! "Wow! Hii ni tamu sana kuliko keki!" Neema alishangaa. Tangu siku hiyo, Neema aliacha kununua vyakula vya sukari vilivyoharibu meno yake na kuwa balozi mkubwa wa kula matunda shuleni kwao.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ KUCHAMBUA HADITHI YA 3 ]
 × Mada Kuu: Lishe bora na umuhimu wa matunda kwa afya ya mwili.
 × Badiliko la Mhusika: Neema anabadilika kutoka kupenda peremende hadi kupenda matunda.
 × Msamiati wa Ngeli ya LI-YA: Embe/Maembe, Chungwa/Machungwa, Tikiti/Matikiti.`}</pre>
 <SubSection title="Maswali na Majibu (Hadithi ya 3)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Swali la 1 (Kukumbuka):</strong> Soko kuu la kijiji cha Mapendo lilikuwa linafanyika siku gani ya juma?</p>
 <p><strong>Jibu:</strong> Soko kuu lilikuwa linafanyika siku ya Jumamosi.</p>
 <p><strong>Swali la 2 (Ufahamu):</strong> Neema alikuwa na tabia gani mbaya ya lishe kabla ya kukutana na Mama Amina?</p>
 <p><strong>Jibu:</strong> Neema alikuwa na tabia ya kupenda kula peremende na keki na alikataa kula matunda au mboga za majani nyumbani kwao, jambo ambalo lilikuwa linarasisha meno yake kuharibika.</p>
 <p><strong>Swali la 3 (Uchambuzi):</strong> Ni tunda gani ambalo Mama Amina aliliita "peremende ya asili iliyotengenezwa na Mungu"?</p>
 <p><strong>Jibu:</strong> Tunda hilo lilikuwa tikiti maji (kipande cha tikiti maji jekundu na tamu).</p>
 <p><strong>Swali la 4 (Sarufi):</strong> Andika nomino "maembe" katika hali ya umoja na uonyeshe ngeli yake.</p>
 <p><strong>Jibu:</strong> Umoja wa maembe ni embe. Neno hili lipo katika ngeli ya LI-YA (Umoja: Embe limeiva, Wingi: Maembe yameiva).</p>
 <p><strong>Swali la 5 (Ubunifu):</strong> Kama wewe ungekuwa Neema, ungemwambia nini mwanafunzi mwenzako anayekula peremende kila wakati darasani?</p>
 <p><strong>Jibu:</strong> Ningemwambia kuwa kula peremende nyingi kunaharibu meno na kuletea maumivu, na badala yake ni bora aje tule matunda kama ndizi au machungwa ambayo yana vitamini za kulinda mwili wetu dhidi ya magonjwa.</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="?? HADITHI YA 4: Ushindi wa Kobe na Sungura Mwenye Maridadi">
 <p>Katika uwanja mkubwa wa wanyama wa mbuga ya Serengeti, kulikuwa na sungura mmoja aliyetambulika kwa mbio zake za haraka na nguo zake za maridadi. Sungura huyu, aliyeitwa mjanja, alikuwa akijigamba mbele ya kila mnyama. "Hakuna kiumbe yeyote chini ya jua anayeweza kunishinda kwa kasi!" alizungumza huku akicheka kwa dharau. Kobe, ambaye alikuwa akitembea polepole kwa utulivu, alimsikia na kusema, "Mzee Sungura, dharau sio nzuri. Mimi niko tayari kushindana nawe kesho asubuhi."</p>
 <p>Wanyama wote walishangaa sana. Simba alitayarisha njia ya mashindano na nyani akashika bendera ya kuanza. Asubuhi iliyofuata, mbio zilianza. Sungura aliruka kama mshale na kuwaacha watazamaji nyuma. Kobe alianza kutembea polepole, hatua kwa hatua, bila kuacha kukanyaga chini kwa makini. Sungura alipofika katikati ya safari, alitazama nyuma na kutoona mtu. "Haha! Kobe huyu atachukua masaa mengi kufika hapa. Ngoja nilale kidogo chini ya kivuli hiki kizuri," sungura alisema na kusinzia fofofo.</p>
 <p>Wakati sungura akiwa amelala na kuota ndoto za ushindi, kobe aliendelea na safari yake bila kusimama wala kupumzika. Alipita karibu na sungura aliyekuwa anasongorota, akamsikitikia na kuendelea mbele. Jua lilipoanza kuzama, sungura aliamka kwa mshtuko. Alikimbia kwa kasi yake yote kuelekea mwisho wa mstari. Hata hivyo, alipofika, alipata wanyama wote wakimshangilia Kobe ambaye alikuwa amekwishavuka mstari wa ushindi tayari! Sungura alishusha kichwa chake chini kwa aibu kubwa na kuahidi kutowadharau wengine tena.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ KUCHAMBUA HADITHI YA 4 ]
 × Wahusika na Tabia: Sungura (Mwenye kujigamba na dharau), Kobe (Mvumilivu na mwenye heshima).
 × Tukio Kuu: Mashindano ya mbio kati ya mnyama wa kasi na mnyama wa polepole.
 × Maadili: Upole na uvumilivu hushinda kiburi na dharau kila wakati.`}</pre>
 <SubSection title="Maswali na Majibu (Hadithi ya 4)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Swali la 1 (Kukumbuka):</strong> Ni mnyama gani aliyetayarisha njia ya mashindano, na ni nani aliyeshika bendera ya kuanza mbio hizo?</p>
 <p><strong>Jibu:</strong> Simba alitayarisha njia ya mashindano na nyani alishika bendera ya kuanza.</p>
 <p><strong>Swali la 2 (Ufahamu):</strong> Kwa nini sungura aliamua kulala katikati ya safari ya mashindano?</p>
 <p><strong>Jibu:</strong> Sungura aliamua kulala kwa sababu alikuwa na dharau na kiburi, akiamini kuwa kobe alikuwa mbali sana na angechukua masaa mengi kufika hapo, hivyo alijiona kuwa ameshinda tayari.</p>
 <p><strong>Swali la 3 (Uchambuzi):</strong> Ni siri gani iliyomfanya kobe ashinde mbio hizo ingawa anatembea polepole sana?</p>
 <p><strong>Jibu:</strong> Siri ya kobe ilikuwa uvumilivu na kuendelea na safari mfululizo bila kusimama wala kupumzika, huku akionyesha nia thabiti ya kufika mwisho.</p>
 <p><strong>Swali la 4 (Msamiati):</strong> Usemi "kusinzia fofofo" una maana gani katika muktadha wa hadithi hii?</p>
 <p><strong>Jibu:</strong> Usemi kusinzia fofofo unamaanisha kulala usingizi mzito sana kiasi cha kutotambua jambo lolote linalofanyika karibu nawe.</p>
 <p><strong>Swali la 5 (Matumizi):</strong> Andika sentensi moja kwa Kiswahili ukitumia kitendo "alishinda" katika wakati ujao (Future tense).</p>
 <p><strong>Jibu:</strong> Mfano wa sentensi: Kobe atashinda mashindano hayo ikiwa ataendelea kukimbia bila kusimama. (Matumizi ya kiambishi -ta-).</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="?? HADITHI YA 5: Siri ya Mti wa Maajabu na Kulinda Mazingira">
 <p>Hapo zamani, katika milima ya gredi ya nne ya kijiji cha mbali cha Chemchem, kulikuwa na mti mmoja mkubwa sana wa maajabu ulioitwa Mti wa Mvua. Mti huu ulikuwa na mizizi mirefu iliyoshika ardhi vizuri na kuzuia mmomonyoko wa udongo. Chini ya matawi yake mapana, kulikuwa na chemchem ya maji safi ya baridi ambayo kijiji kizima kilitumia kwa kunywa, kupika, na kunyweshea mifugo yao. Mzee mzee wa kijiji, Mzee Kijana, kila wakati aliwaambia watoto, "Tunza mti huu, nao utatutunza."</p>
 <p>Siku zilivyopita, kijana mmoja mgeni aliyekuwa anamiliki kiwanda cha mbao alifika kijijini hapo. Alipouona ule mti mkubwa, macho yake yalijaa tamaa ya kupata mbao nyingi za kuuza ili apate pesa nyingi. Alichukua shoka lake kubwa la chuma na kuelekea kwenye mti huo asubuhi na mapema. Watoto wa shule waliokuwa wakipita kwenda masomoni, wakiongozwa na msichana mdogo aitwaye Zawadi, walimwona kijana huyo akitaka kuukata ule mti.</p>
 <p>Zawadi alisimama kwa ujasiri mbele ya mti huo akishika mikono ya rafiki zake na kuunda duara kubwa kulinda mti. "Tafadhali usikate mti huu!" Zawadi alipiga kelele. "Ukikata mti huu, chemchem yetu itakauka, udongo utabolewa na tutakosa maji ya kuishi msimu wa kiangazi." Kijana yule alitaka kuwasukuma lakini kelele za watoto ziliwavuta wazee wa kijiji na akina mama waliokuwa wakichota maji. Mzee Kijana alimweleza mgeni huyo umuhimu wa mazingira na jinsi mti huo unavyoleta mvua kijijini. Kijana yule aliona aibu, akaweka shoka lake chini, na kuomba msamaha. Siku iliyofuata, alirudi akiwa na miche mia moja ya miti mipya na kuwasaidia watoto kuipanda kando ya milima yote.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ KUCHAMBUA HADITHI YA 5 ]
 × Mandhari: Kijiji cha Chemchem na Mti wa Mvua.
 × Umuhimu wa Mazingira: Miti inalinda vyanzo vya maji na kuzuia mmomonyoko wa ardhi.
 × Matokeo: Badiliko la nia kutoka uharibifu hadi uhifadhi wa mazingira (kupanda miti).`}</pre>
 <SubSection title="Maswali na Majibu (Hadithi ya 5)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Swali la 1 (Kukumbuka):</strong> Mti mkubwa uliokuwa katika kijiji cha Chemchem uliitwa jina gani maalum?</p>
 <p><strong>Jibu:</strong> Mti huo uliitwa Mti wa Mvua.</p>
 <p><strong>Swali la 2 (Ufahamu):</strong> Kwa nini yule mgeni mmiliki wa kiwanda cha mbao alitaka kuukata mti huo kwa shoka lake?</p>
 <p><strong>Jibu:</strong> Alitaka kuukata mti huo kwa sababu alijawa na tamaa ya kupata mbao nyingi za kuuza ili apate pesa nyingi, bila kujali athari kwa mazingira.</p>
 <p><strong>Swali la 3 (Uchambuzi):</strong> Ni hatua gani ya kishujaa aliyochukua Zawadi pamoja na wanafunzi wenzake ili kuzuia kukatwa kwa mti huo?</p>
 <p><strong>Jibu:</strong> Zawadi na wanafunzi wenzake walisimama kwa ujasiri mbele ya mti huo, wakashikana mikono na kuunda duara kubwa ili kuulinda wasiweze kukatwa na shoka la mgeni yule.</p>
 <p><strong>Swali la 4 (Msamiati):</strong> Neno "chemchem" lina maana gani kulingana na matumizi yake katika hadithi hii?</p>
 <p><strong>Jibu:</strong> Neno chemchem linamaanisha mahali ambapo maji yanatoka ardhini yenyewe kwa njia ya asili na kutengeneza chanzo cha maji safi ya kijiji.</p>
 <p><strong>Swali la 5 (Kufikiri kwa Kina):</strong> Mgeni yule alifanya nini siku iliyofuata ili kuonyesha kuwa amejuta na kubadilika kikweli?</p>
 <p><strong>Jibu:</strong> Siku iliyofuata alirudi akiwa na miche mia moja ya miti mipya na akaungana na watoto kuipanda kando ya milima yote ili kurejesha mazingira mazuri.</p>
 </div>
 </SubSection>
 </SubSection>
 </Section>

 <Section title="SEHEMU YA 4: JEDWALI LA KUREJELEA NA MTANGAZO WA MSAMIATI">
 <p>Hapa kuna jedwali linaloonyesha ulinganifu wa ngeli na viambishi vyake ili kumsaidia mwanafunzi kurejelea kwa haraka anapofanya mazoezi ya lugha.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ JEDWALI LA MUUNDO WA NGELI ]
 ×
 +-------------------------+-------------------------+
 ? ? ?
 [ NGELI YA A-WA ] [ NGELI YA KI-VI ] [ NGELI YA LI-YA ]
 × Umoja: M- (Mtu asoma) × Umoja: KI- (Kiti kipo) × Umoja: LI- (Embe lipo) × Wingi: WA- (Watu wasoma) × Wingi: VI- (Viti vipo) × Wingi: YA- (Maembe yapo)`}</pre>
 <p>Matumizi ya jedwali hili yanarahisisha kazi ya kusahihisha sentensi na kuhakikisha upatanisho wa kisarufi unazingatiwa kikamilifu katika maandishi yote.</p>
 </Section>

 <Section title="MTANGANYIKO WA MAZOEZI YA KIJUMLA NA MAJIBU YAKE (COMPREHENSIVE EXAM)">
 <p>Majaribio haya yanajumuisha maswali ya sarufi, ngeli, misamiati na nyakati kulingana na mada zote zilizofundishwa hapo juu.</p>
 <SubSection title="Maswali ya Mtihani">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <p><strong>Q1.</strong> Badilisha sentensi ifuatayo kutoka hali ya umoja kwenda hali ya wingi: "Mwalimu mwema anasoma kitabu darasani."</p>
 <p><strong>Q2.</strong> Tambua ngeli ya nomino zifuatazo na uandike kama ziko katika hali ya umoja au wingi: a) Viti b) Jicho c) Watoto</p>
 <p><strong>Q3.</strong> Jaza pengo kwa kutumia kiambishi sahihi cha wakati uliopita (-li-): "Jana jioni, mimi na kaka yangu _______________(enda) kucheza mpira wa miguu uwanjani."</p>
 <p><strong>Q4.</strong> Chagua neno sahihi linalofaa kukamilisha maana ya kiungo cha mwili: "Tunatumia ____________________ (macho / masikio) kusikiliza mafundisho ya mwalimu darasani."</p>
 <p><strong>Q5.</strong> Andika nambari zifuatazo kwa kutumia maneno safi ya Kiswahili: a) 25° b) 50 c) 100°</p>
 </div>
 </SubSection>
 <SubSection title="Majibu na Ufafanuzi wa Kina">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Ans 1:</strong> Wingi wa sentensi hiyo ni: "Walimu wema wanasoma vitabu darasani." Ufafanuzi: Nomino "Mwalimu" inabadilika kuwa "Walimu" katika ngeli ya A-WA. Vivumishi na vitendo pia hubadilika (Anasoma → Wanasoma). Neno "kitabu" linabadilika kuwa "vitabu" katika ngeli ya KI-VI.</p>
 <p><strong>Ans 2:</strong> a) Viti: Ngeli ya KI-VI (Hali ya Wingi; Umoja wake ni Kiti). b) Jicho: Ngeli ya LI-YA (Hali ya Umoja; Wingi wake ni Macho). c) Watoto: Ngeli ya A-WA (Hali ya Wingi; Umoja wake ni Mtoto).</p>
 <p><strong>Ans 3:</strong> "Jana jioni, mimi na kaka yangu tulikwenda kucheza mpira wa miguu uwanjani." (Kiambishi -li- kimewekwa katikati ya kitenzi "kwenda").</p>
 <p><strong>Ans 4:</strong> Tunatumia masikio kusikiliza mafundisho ya mwalimu darasani.</p>
 <p><strong>Ans 5:</strong> a) 25° = Ishirini na tano. b) 50 = Hamsini. c) 100° = Mia moja.</p>
 </div>
 </SubSection>
 </Section>

 <Section title="VIUNGANISHI NA MUUNDO WA SENTENSI">
 <SubSection title="6.1 Viunganishi (Conjunctions)">
 <p>Viunganishi ni maneno yanayotumika kuunganisha neno na neno, kirai na kirai, au sentensi moja na nyingine ili kuleta maana iliyokamilika. Katika ngazi hii, tunajifunza viunganishi vikuu vitatu vinavyotumiwa kila siku:</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ VIUNGANISHI VIKUU ]
 ×
 +--------------------------+--------------------------+
 ? ? ?
 [ NA ] [ LAKINI ] [ AU ]
 Huongeza wazo / taarifa Huonyesha kipingamizi Hutoa chaguo
 (Juma na Ali walisoma) (Alisoma lakini alifeli) (Utakunywa chai au maji?)`}</pre>
 <SubSection title="6.1.1 Aina za Viunganishi na Kazi Zake">
 <BulletList items={[
 'Na: Hutumika kuunganisha mambo yanayofanana au kuongeza taarifa zaidi. Mfano: Mama alinunua matunda na mboga za majani.',
 'Lakini / Ilhali / Ijapokuwa: Hutumika kuonyesha kipingamizi au utofauti kati ya maelezo mawili yaliyopo kwenye sentensi. Mfano: Juma alikimbia sana lakini hakushinda mbio hizo.',
 'Au / Ama: Hutumika kutoa nafasi ya kuchagua jambo moja kati ya mawili au zaidi. Mfano: Utasoma kitabu hiki au utaenda kucheza uwanjani?',
 'Kwa sababu / Kwa kuwa / Maana: Hutumika kutoa sababu ya jambo fulani lililotokea. Mfano: Mtoto alilia kwa sababu alikuwa na njaa kali.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="6.2 Muundo wa Sentensi: Kauli Halisi na Kauli Taarifa">
 <p>Katika uandishi na uzungumzaji wa Kiswahili, kuna njia mbili kuu za kueleza kile kilichosemwa na mtu mwingine:</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` KAULI HALISI: Mwalimu alisema, "Mtasoma kwa bidii leo."
 ×
 ? (Alama za nukuu zinaondolewa; nafsi inabadilika)
 KAULI TAARIFA: → Mwalimu alisema kwamba tungesoma kwa bidii siku hiyo.`}</pre>
 <SubSection title="6.2.1 Sheria za Kubadilisha Kauli Halisi Kuwa Kauli Taarifa">
 <BulletList items={[
 'Kuondoa Alama za Nukuu: Alama zote za nukuu (" ") na koma zilizotenganisha usemi zinasafishwa kabisa.',
 'Kuingiza Viunganishi vya Taarifa: Maneno kama vile kwamba au kuwa yanawekwa baada ya neno la msemaji (mfano: Alisema kwamba...).',
 'Kubadilisha Nafsi: Nafsi ya kwanza au ya pili iliyopo ndani ya alama za nukuu inabadilika na kuwa nafsi ya tatu (mfano: "Mimi" inakuwa yeye, "Sisi" inakuwa wao).',
 'Mabadiliko ya Nyakati na Maneno ya Ishara: "Leo" inabadilika na kuwa siku hiyo. "Hapa" inabadilika na kuwa pale au hapo.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="6.3 Mifano Iliyofanywa (Worked Examples)">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 1: Kuunganisha Sentensi</h4>
 <p>Swali: Unganisha sentensi zifuatazo kwa kutumia kiunganishi kinachofaa zaidi: Mzee Baraka alifanya kazi kwa bidii. Mzee Baraka hakupata faida kubwa.</p>
 <p><strong>Hatua kwa Hatua:</strong> Uchambuzi wa maana: Sentensi ya kwanza inaonyesha juhudi kubwa, lakini sentensi ya pili inaleta matokeo yasiyotegemewa (kipingamizi). Chagua kiunganishi cha kipingamizi: Neno lakini linafaa hapa. Unganisha sentensi kwa kuondoa jina linalorudiwa ili sentensi iwe fupi na yenye ufasaha. <strong>Jibu la Mwisho:</strong> "Mzee Baraka alifanya kazi kwa bidii lakini hakupata faida kubwa."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 2: Kubadilisha usemi</h4>
 <p>Swali: Badilisha sentensi ifuatayo kutoka Kauli Halisi kwenda Kauli Taarifa: Kito alisema, "Mimi nitalinda mazingira ya kijiji chetu leo."</p>
 <p><strong>Hatua kwa Hatua:</strong> Ondoa alama za nukuu na koma. Weka neno la kiunganishi kwamba baada ya neno alisema. Badilisha nafsi: "Mimi" inabadilika kuwa yeye. "Chetu" inakuwa vyao. Badilisha neno la wakati: "Leo" inakuwa siku hiyo. Rekebisha mnyambuliko wa kitenzi: nitalinda inakuwa atayalinda au ngelinda. <strong>Jibu la Mwisho:</strong> "Kito alisema kwamba yeye angelinda mazingira ya kijiji vyao siku hiyo."</p>
 </div>
 </SubSection>

 <SubSection title="6.4 Maswali ya Mazoezi na Majibu Yake">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 1: Kuchagua Kiunganishi</h4>
 <p>Jaza nafasi zilizoachwa wazi kwa kuchagua kiunganishi sahihi kutoka kwenye mabano: (kwa sababu, au, lakini, na)</p>
 <p>a) Alhamisi ijayo tutaenda kutembelea mbuga ya wanyama ______________ makumbusho ya kitaifa. → <strong>na</strong> (Inaongeza taarifa ya mahali pa pili pa kutembelea).</p>
 <p>b) Tulitaka kwenda kuogelea mtoni ______________ mvua kubwa ilianza kunyesha. → <strong>lakini</strong> (Inaonyesha kipingamizi cha mvua kilichozuia mpango).</p>
 <p>c) Utakula ugali kwa mboga za majani ______________ utapenda wali kwa maharagwe? → <strong>au</strong> (Inatoa chaguo kati ya vyakula viwili).</p>
 <p>d) Masomo yalifungwa mapema ______________ ugonjwa hatari uliingia kijijini. → <strong>kwa sababu</strong> (Inatoa sababu ya shule kufungwa).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 2: Kusahihisha Sentensi za Usemi</h4>
 <p>Sahihisha alama za uandishi (koma, herufi kubwa, na alama za nukuu) katika sentensi ifuatayo ili iwe kauli halisi iliyonyooka: baba alitazama mto akasema mazingira haya yanavutia sana</p>
 <p><strong>Jibu Sahihi:</strong> Baba alitazama mto akasema, "Mazingira haya yanavutia sana." (Weka herufi kubwa mwanzoni mwa sentensi: B. Weka koma baada ya neno akasema. Fungua alama za nukuu kabla ya maneno yaliyosemwa. Anza neno la kwanza ndani ya nukuu kwa herufi kubwa: M. Weka kitone/nukta mwishoni mwa usemi ndani ya alama za nukuu zilizofungwa.)</p>
 </div>
 </SubSection>

 <SubSection title="?? JIKUMBUSHIE: MAZOEZI YA KIINTAREKTIFU">
 <p>Pima uelewa wako wa muundo wa sentensi, viunganishi na kauli taarifa kwa kujibu maswali haya mafupi.</p>
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Jaribio: Viunganishi na Usemi wa Kiswahili</h4>
 <p><strong>Swali la 1 (Mada: Kauli Taarifa):</strong> Je, ni sentensi gani kati ya hizi iliyobadilishwa kwa usahihi kuwa Kauli Taarifa kutoka kwa: Mama alisema, "Nenda sokoni sasa hivi."? A) Mama alisema nenda sokoni sasa hivi. (Makosa). B) Mama alisema, "kwamba mtoto aende sokoni." (Makosa). C) Mama alisema kwamba niende sokoni wakati huo. (Sahihi! Alama za nukuu zimeondolewa, neno "kwamba" limewekwa, nafsi imebadilika kuwa "niende", na "sasa hivi" imekuwa "wakati huo".) D) Mama alisema kuwa mimi nenda sokoni sasa hivi. (Makosa).</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? JEDWALI LA MUUNDO WA LUHA (SYNTAX MATRIX)</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ MTIRIRIKO WA SENTENSI ]
 ×
 +---------------------------------------------------+
 ? ?
 [ Viunganishi vya Mawazo ] [ Kauli na Usemi ]
 × Na (Kiunganishi unganishi) × Kauli Halisi (Ina Alama za Nukuu " ") × Lakini (Kiunganishi kipingamizi) × Kauli Taarifa (Inatumia neno 'kwamba') × Au (Kiunganishi cha chaguo) × Mabadiliko ya Nafsi na Nyakati`}</pre>
 </div>
 </Section>

 <Section title="UANDISHI WA INSHA, BARUA, NA MATUMIZI YA SANAA YA LUGHA (METHALI NA VITENDAWILI)">
 <SubSection title="7.1 Uandishi wa Insha (Composition Writing)">
 <p>Uandishi wa insha ni sanaa ya kupanga mawazo katika mtiririko wa aya unaoeleweka na unaovutia msomaji. Insha bora ya kiwango hiki inapaswa kugawanywa katika sehemu tatu kuu zifuatazo:</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` → [ UTANGULIZI ] → --&gt; Huweka msingi wa mada, kutambulisha wahusika, wakati na mahali.
 ×
 ?
 [ KIWILIWILI ] → --> Hukuza kisa au mada kwa kutoa hoja, matukio, na mifano katika aya tofauti.
 ×
 ?
 [ HITIMISHO ] --> Hufunga simulizi au hoja kwa kutoa muhtasuri, mafunzo au hisia za mwisho.`}</pre>
 <SubSection title="7.1.1 Kanuni za Dhahabu za Aya (Paragraph Rules)">
 <BulletList items={[
 'Sentensi Kuu (Topic Sentence): Kila aya mpya lazima ianze na sentensi inayotambulisha wazo kuu la aya hiyo pekee.',
 'Mstari Mpya au Nafasi: Kila unapoanza aya mpya, ni lazima uache nafasi kidogo (uandishi wa ndani) au uache mstari mmoja wazi ili kuonyesha mabadiliko ya Wakati, Mahali, Tukio, au Mzungumzaji.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="7.2 Uandishi wa Barua ya Kawaida/Kirafiki (Informal Letter)">
 <p>Barua ya kawaida huandikiwa ndugu, jamaa, au marafiki ili kusalimiana au kupashana habari za kifamilia. Barua hii ina muundo maalum wenye sehemu kuu tano:</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` → 1. Anwani ya Mwandishi (Juu upande wa kulia) --&gt; Mfano: Shule ya Msingi Voi, P.O. Box 10, Voi.
 2. Tarehe (Chini ya anwani) --> Mfano: 22 Juni 2026.
 3. Mwamko/Salamu (Upande wa kushoto) --> Mfano: Kwa mpenzi rafiki Juma, au Mpendwa Mama,
 4. Mwili wa Barua (Katatikati) --> Utangulizi (salamu), Habari kuu, na Hitimisho.
 5. Hitimisho na Jina (Chini upande wa kulia)--> Mfano: Wako wa dhati, Kito.`}</pre>
 </SubSection>

 <SubSection title="7.3 Sanaa ya Lugha: Methali na Vitendawili">
 <SubSection title="7.3.1 Methali (Proverbs)">
 <BulletList items={[
 'Mvumilivu hula mbivu: Hufundisha umuhimu wa kuwa na subira katika jambo lolote unalofanya ili kupata matokeo mazuri.',
 'Asiyesikia la mkuu huvunjika guu: Huonya watoto au vijana wanaokataa kutii ushauri wa wazazi au viongozi wao.',
 'Haba na haba hujaza kibaba: Huhimiza tabia ya kuweka akiba au kufanya mambo kidogo kidogo hadi yafanikiwe kuwa makubwa.'
 ]} />
 </SubSection>
 <SubSection title="7.3.2 Vitendawili (Riddles)">
 <BulletList items={[
 'Kitendawili: Kaa hapa nikae pale tumwambie mama hadithi. --> Tega: Kiti (au Macho).',
 'Kitendawili: Nyumba yangu haina mlango. --> Tega: Yai.',
 'Kitendawili: Kila nikienda ananifuata. --> Tega: Kivuli.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="7.4 Mifano Iliyofanywa (Worked Examples)">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 1: Kupanga Sehemu za Barua</h4>
 <p>Swali: Rafiki yako Kito amekuandikia barua lakini amechanganya mpangilio wa muundo. Pangilia upya vipengele hivi kwa mtiririko sahihi: A) Mpendwa Rafiki Ali, B) Shule ya Msingi Kericho, P.O. Box 45°, Kericho. C) Wako wa dhati, Kito. D) 22 Juni 2026. E) Habari za siku nyingi? Natumai u mzima...</p>
 <p><strong>Mpangilio Sahihi:</strong> B → D A → E C. (Anwani → Tarehe → Mwamko → Mwili → Hitimisho).</p>
 </div>
 </SubSection>

 <SubSection title="7.5 Maswali ya Mazoezi na Majibu Yake">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 1: Vitendawili na Methali</h4>
 <p>Kamilisha sehemu zilizoachwa wazi kwa kuandika jawabu sahihi la kitendawili au methali iliyotajwa:</p>
 <p>a) Kitendawili: Koti langu lina migongo miwili. --&gt; Jibu: Jembe (au Kitabu).</p>
 <p>b) Methali: Akili ni nywele, kila mtu ana zake.</p>
 <p>c) Kitendawili: Huku kuku, kule kuku, katikati mayai. --&gt; Jibu: Macho na Pua (au Njia/Mito).</p>
 <p>d) Methali: Asiyefunzwa na mamae, hufunzwa na ulimwengu.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 2: Utambuzi wa Insha</h4>
 <p>Taja sehemu tatu kuu za insha na ueleze kwa ufupi ni nini kinachopaswa kuandikwa katika sehemu ya kwanza kabisa (Utangulizi).</p>
 <p><strong>Jibu:</strong> Sehemu tatu kuu za insha ni: Utangulizi, Kiwiliwili, na Hitimisho. Katika sehemu ya Utangulizi, mwandishi anapaswa kuweka wazi mada kuu ya insha yake, kuwatambulisha wahusika wakuu wa hadithi (kama ni insha ya masimulizi), na kutaja wakati (lini) na mahali (wapi) tukio hilo lilipoanzia ili kumvutia msomaji kuendelea kusoma.</p>
 </div>
 </SubSection>

 <SubSection title="?? JIKUMBUSHIE: MAZOEZI YA KIINTAREKTIFU">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Jaribio: Sanaa ya Lugha na Barua</h4>
 <p><strong>Swali la 1 (Mada: Muundo wa Barua):</strong> Unapoandika barua ya kirafiki kwenda kwa mjomba wako, je, anwani yako ya mwandishi inapaswa kuwekwa wapi kisheria? A) Chini upande wa kushoto mwisho wa barua. (Makosa). B) Katikati kabisa ya mwili wa barua. (Makosa). C) Juu kabisa upande wa kulia wa karatasi. (Sahihi! Sheria ya barua za kirafiki inataka anwani na tarehe zikae juu kona ya kulia). D) Juu upande wa kushoto kabla ya salamu. (Makosa).</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? JEDWALI LA SANAA YA LUGHA (LITERARY MATRIX)</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ SANAA NA MAPANDISHO ]
 ×
 +-------------------------+-------------------------+
 ? ? ?
 [ Muundo wa Insha ] [ Muundo wa Barua ] [ Fasihi Simulizi ]
 × Utangulizi (Mwanzo) × Anwani & Tarehe (Rukia) × Methali (Hekima & Onyo) × Kiwiliwili (Aya za Kati) × Mwamko & Mwili (Kati) × Vitendawili (Fumbo & Tega) × Hitimisho (Mwisho) × Hitimisho (Mwisho) × Mafundisho ya Maisha`}</pre>
 </div>
 </Section>

 <Section title="NYAKATI NA HALI KATIKA VITENZI (TENSES AND ASPECTS)">
 <SubSection title="8.1 Nyakati Kuu Tatu na Alama Zake">
 <p>Nyakati katika lugha ya Kiswahili huonyesha lini tendo lilifanyika, linavyofanyika, au litakavyofanyika. Wakati huonyeshwa kwa kutumia viambishi maalum vinavyowekwa katikati ya kitenzi.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` WAKATI ULIOPITA WAKATI ULIOPO WAKATI UJAO
 Kiambishi: -LI- Kiambishi: -NA- Kiambishi: -TA-
 (Tendo lilishapita) (Tendo linafanyika sasa) (Tendo litafanyika baadaye)
 × × ×
 ? ? ?
 Kito [alishona] nguo. Kito [anashona] nguo. Kito [atashona] nguo.`}</pre>
 <SubSection title="8.1.1 Ufafanuzi wa Viambishi vya Wakati">
 <BulletList items={[
 'Wakati Uliopita (-LI-): Huonyesha tendo lililokwisha fanyika kabla ya wakati wa sasa wa kuzungumza. Mfano: Wanafunzi wa-li-soma hadithi jana asubuhi.',
 'Wakati Uliopo (-NA-): Huonyesha tendo linalofanyika sasa hivi, wakati huu wa kuzungumza. Mfano: Mwalimu a-na-fundisha sarufi darasani.',
 'Wakati Ujao (-TA-): Huonyesha tendo litakalofanyika baadaye, baada ya wakati wa sasa wa kuzungumza kupita. Mfano: Kito a-ta-enda mjini kesho asubuhi.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="8.2 Hali ya Timilifu (-ME-) na Hali ya Mazoea (-HU-)">
 <p>Mbali na nyakati kuu tatu, Kiswahili kinatumia viambishi maalum kuonyesha hali (aspect) ya tendo jinsi lilivyotekelezwa au linavyotekelezwa kwa kawaida.</p>
 <SubSection title="8.2.1 Hali ya Timilifu (-ME-)">
 <p>Hali hii huonyesha kuwa tendo limekamilika hivi karibuni na matokeo au athari za tendo hilo bado zinaonekana wakati huu wa sasa. Mfano: Mtoto a-me-la chakula. (Tendo la kula limeisha, na mtoto ameshiba sasa).</p>
 </SubSection>
 <SubSection title="8.2.2 Hali ya Mazoea (Hu-)">
 <p>Hali hii huonyesha matendo yanayofanyika kwa kawaida, kila siku, au kama tabia ya kudumu. Tofauti na nyakati nyingine, viambishi vya nafsi (kama a-, wa-, u-) huondolewa, na neno Hu- huwekwa mwanzoni kabisa mwa kitenzi. Mfano: Ndege hu-ruka angani. / Juma hu-amka mapema kila siku.</p>
 </SubSection>
 </SubSection>

 <SubSection title="8.3 Mifano Iliyofanywa (Worked Examples)">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 1: Kubadilisha Sentensi Katika Nyakati</h4>
 <p>Swali: Badilisha sentensi ifuatayo kutoka wakati uliopo kwenda wakati uliopita na wakati ujao: Baba anasoma gazeti sebuleni.</p>
 <p><strong>Majibu:</strong> Wakati Uliopita: "Baba alisoma gazeti sebuleni." Wakati Ujao: "Baba atasoma gazeti sebuleni."</p>
 </div>
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 2: Kuunda Hali ya Mazoea</h4>
 <p>Swali: Badilisha sentensi ifuatayo ili ionyeshe Hali ya Mazoea: Wanafunzi wanaenda shuleni kwa miguu.</p>
 <p><strong>Jibu:</strong> "Wanafunzi huenda shuleni kwa miguu."</p>
 </div>
 </SubSection>

 <SubSection title="8.4 Maswali ya Mazoezi na Majibu Yake">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 1: Kutambua Viambishi vya Nyakati</h4>
 <p>Soma sentensi zifuatazo na utaje wakati au hali iliyotumika kwa kuangalia viambishi vilivyopigiwa mstari:</p>
 <p>a) Mzee Baraka amefika salama kijijini. → Hali ya Timilifu (Kiambishi -me-).</p>
 <p>b) Kito na rafiki zake wataogelea mtoni kesho. → Wakati Ujao (Kiambishi -ta-).</p>
 <p>c) Simba huwinda wanyama usiku. → Hali ya Mazoea (Kiambishi hu-).</p>
 <p>d) Mvua kubwa ililinyesha usiku kucha. → Wakati Uliopita (Kiambishi -li-).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 2: Nyakati katika Umoja na Wingi</h4>
 <p>Badilisha sentensi ifuatayo kuwa katika wingi na wakati ujao: Mtoto amekula tunda tamu.</p>
 <p><strong>Jibu:</strong> "Watoto watakula matunda matamu."</p>
 </div>
 </SubSection>

 <SubSection title="?? JIKUMBUSHIE: MAZOEZI YA KIINTAREKTIFU">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Jaribio: Nyakati za Kiswahili</h4>
 <p><strong>Swali la 1 (Mada: Hali ya Mazoea):</strong> Ni ipi kati ya sentensi zifuatazo iliyo katika hali ya mazoea kwa usahihi? A) Masikini alikula chakula kila siku. (Wakati uliopita). B) Masikini anakula chakula sasa hivi. (Wakati uliopo). C) Masikini hula chakula kila siku. (Sahihi! Kitenzi kimeanza na kiambishi 'hu-'). D) Masikini amekula chakula chake chote. (Timilifu).</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? JEDWALI LA NYAKATI (VERB ASPECT MATRIX)</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ VIAMBISHI VYA NYAKATI ]
 ×
 +-------------------------+-------------------------+
 ? ? ?
 [ Nyakati Kuu Kuu ] [ Hali Timilifu ] [ Hali ya Mazoea ]
 × -LI- (Uliopita/Jana) × -ME- (Tendo limeisha) × HU- (Hufanyika kila siku)
 × -NA- (Uliopo/Sasa) × Athari bado zipo × Huwekwa mwanzoni mwa neno
 × -TA- (Ujao/Kesho) × Mfano: Amelala × Huondoa viambishi vya nafsi`}</pre>
 </div>
 </Section>

 <Section title="UKUBWA NA UDOGO WA NOMINO (NOUN AUGMENTATIVE AND DIMINUTIVE FORMS)">
 <SubSection title="9.1 Ukubwa wa Nomino (Augmentative Form)">
 <p>Ukubwa wa nomino hutumika kuonyesha kitu chenye umbo kubwa kuliko umbo la kawaida, au kuonyesha sifa ya ziada (wakati mwingine ya dharau au mshangao). Katika Kiswahili, tunapobadilisha neno kwenda katika hali ya ukubwa, nomino hiyo huhamia katika Ngeli ya LI-YA.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` [ SHENZI YA KUBADILISHA ]
 ×
 +-------------------------------------------+
 ? ?
 [ Neno la Kawaida ] [ Hali ya Ukubwa ]
 × Mtu (A-WA) --(Ondoa 'M-')--> × Jitu (LI-YA) × Nyumba (I-ZI) --(Ondoa 'Ny-')--> × Jumba (LI-YA) × Mtoto (A-WA) --(Ondoa 'M-')--> × Toto (LI-YA)`}</pre>
 <SubSection title="9.1.1 Kanuni za Kuunda Hali ya Ukubwa">
 <BulletList items={[
 'Maneno ya Silahba Mbili (Yanaanza na M-): Ondoa kiambishi cha mwanzo M- na uache mzizi pekee au ongeza Ji- ikiwa mzizi una herufi chache. Mtu ? Jitu (Wingi: Majitu). Mtoto ? Toto (Wingi: Matoto).',
 'Maneno ya Ngeli ya I-ZI (Yanaanza na herufi tofauti): Mara nyingi herufi ya kwanza hubadilika au neno huongezewa kiambishi Ji-. Nyumba ? Jumba (Wingi: Majumba). Njia ? Jia (Wingi: Majia). Mbwa ? Jibwa (Wingi: Majibwa).'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="9.2 Udogo wa Nomino (Diminutive Form)">
 <p>Udogo wa nomino hutumika kuonyesha kitu chenye umbo dogo sana kuliko kawaida, au kuonyesha hali ya mapenzi/uhusiano wa karibu. Tunapobadilisha neno kwenda katika hali ya udogo, nomino hiyo huhamia katika Ngeli ya KI-VI na huanza na kiambishi Ki- (umoja) au Vi- (wingi).</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` NENO LA KAWAIDA HALI YA UDOGO (Umoja) HALI YA UDOGO (Wingi) × Mtu (A-WA) --&gt; × Kitu (KI-VI) --&gt; × Vitu (KI-VI) × Mtoto (A-WA) --&gt; × Kitoto (KI-VI) --&gt; × Vitoto (KI-VI) × Nyumba (I-ZI) --&gt; × Kijumba (KI-VI) --&gt; × Vijumba (KI-VI)`}</pre>
 </SubSection>

 <SubSection title="9.3 Mifano Iliyofanywa (Worked Examples)">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 1: Kubadilisha Sentensi Katika Ukubwa</h4>
 <p>Swali: Badilisha sentensi ifuatayo kutoka hali ya kawaida kwenda katika hali ya ukubwa (umoja na wingi): Mtu mrefu alijenga nyumba nzuri.</p>
 <p><strong>Jibu la Umoja:</strong> "Jitu refu lilijenga jumba zuri." <strong>Jibu la Wingi:</strong> "Majitu marefu yalijenga majumba mazuri."</p>
 </div>
 </SubSection>

 <SubSection title="9.4 Maswali ya Mazoezi na Majibu Yake">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 1: Jedwali la Ukubwa na Udogo</h4>
 <p>Kamilisha nafasi zilizoachwa wazi katika jedwali hili la sarufi:</p>
 <p>Neno la Kawaida: Mti Hali ya Ukubwa (Umoja): Jiti Hali ya Udogo (Umoja): Kiti.</p>
 <p>Neno la Kawaida: Kisu Hali ya Ukubwa (Umoja): Jisu Hali ya Udogo (Umoja): Kikisu.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 2: Udogo katika Sentensi</h4>
 <p>Badilisha sentensi ifuatayo kuwa katika hali ya udogo na wingi: Mtoto mdogo alicheza na mbwa.</p>
 <p><strong>Jibu:</strong> "Vitoto vidogo vilicheza na vijibwa."</p>
 </div>
 </SubSection>

 <SubSection title="?? JIKUMBUSHIE: MAZOEZI YA KIINTAREKTIFU">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Jaribio: Ukubwa na Udogo wa Kiswahili</h4>
 <p><strong>Swali la 1 (Mada: Ukubwa wa Nomino):</strong> Je, ni sentensi ipi kati ya hizi iliyobadilishwa kwa usahihi katika hali ya ukubwa (umoja)? (Kutokana na: Mshale mrefu ulianguka mtoni.) A) Kimshale kirefu kilianguka mtoni. (Udogo). B) Mishale mirefu ilianguka mtoni. (Wingi wa kawaida). C) Jishale refu lilianguka mtoni. (Sahihi! Nomino imechukua muundo wa ukubwa 'Jishale' na kitenzi 'li-'). D) Mashale marefu yalianguka mtoni. (Ukubwa wingi).</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? JEDWALI LA NGELI MPYA (NOUN NOUN MATRIX)</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ MAUMBO YA NOMINO ]
 ×
 +-----------------------------------------------+
 ? ?
 [ Ngeli ya Ukubwa: LI-YA ] [ Ngeli ya Udogo: KI-VI ]
 × Umoja: Jitu / Toto / Jumba × Umoja: Kitu / Kitoto / Kijumba × Wingi: Majitu / Matoto / Majumba × Wingi: Vitu / Vitoto / Vijumba × Viambishi vya Vitenzi: LI- (U) & YA- (W) × Viambishi vya Vitenzi: KI- (U) & VI- (W)`}</pre>
 </div>
 </Section>

 <Section title="VINYUME VYA VITENZI NA UTUMIZI WA 'KWA', 'NA' NA 'KWA AJILI YA'">
 <SubSection title="10.1 Vinyume vya Vitenzi (Verb Inverses/Antonyms)">
 <p>Katika lugha ya Kiswahili, kitenzi kinaweza kubadilishwa ili kuonyesha tendo la kinyume chake kwa kufanya mnyambuliko maalum (kunyambua). Mara nyingi, vinyume hivi huundwa kwa kuongeza viambishi kama vile -ua, -uka, -oa, au -oka mwishoni mwa mzizi wa kitenzi.</p>
 <pre style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', margin: '12px 0', whiteSpace: 'pre-wrap' }}>{` TENDO LA KAWAIDA MTAKAWA WA MNYAMBULIKO TENDO LA KINYUME × Funga (Close) --&gt; Ongeza '-ua' --&gt; × Fungua (Open) × Anika (Put in sun)--> Badilisha '-ka' na '-ua'--> × Anua (Take out of sun) × Rejesha (Return) --&gt; Badilisha mzizi --&gt; × Toa (Take out) × Vaa (Wear) --&gt; Ongeza '-ua' --&gt; × Vua (Undress)`}</pre>
 <SubSection title="10.1.1 Mifano ya Kawaida ya Vinyume vya Vitenzi">
 <BulletList items={[
 'Chomeka (Insert) <--> Chomoa (Extract)',
 'Fungama (Tie together) <--> Fungua (Untie)',
 'Kaza (Tighten) <--> Legeza (Loosen)',
 'Tega (Set trap) <--> Tegua (Untrap/Spring trap)',
 'Ziba (Block/Plug) <--> Zibua (Unblock/Unplug)'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="10.2 Utumizi wa 'Kwa', 'Na', na 'Kwa ajili ya'">
 <p>Maneno haya ni viunganishi na vihusishi muhimu sana vinavyosaidia kuonyesha uhusiano wa kiutendaji, umiliki, au sababu kati ya sehemu tofauti za sentensi.</p>
 <SubSection title="10.2.1 Utumizi wa 'Kwa'">
 <BulletList items={[
 'Kuonyesha Kifaa au Njia: Kutaja chombo kilichotumiwa kufanya jambo. Mfano: Alikata mkate kwa kisu kikali.',
 'Kuonyesha Sehemu au Upande: Kuelekeza mahali au kwa mtu fulani. Mfano: Tulitembea kwa mwalimu mkuu jana jioni.',
 'Kuonyesha Namna/Jinsi: Kueleza jinsi tendo lilivyofanyika. Mfano: Aliongea kwa sauti ya upole sana.'
 ]} />
 </SubSection>
 <SubSection title="10.2.2 Utumizi wa 'Na'">
 <BulletList items={[
 'Kuunganisha Majina/Mawazo: (Kama kiunganishi). Mfano: Juma na Ali wanasoma pamoja.',
 'Kuonyesha Mtendaji katika Kauli Passive: Mfano: Chakula kililiwa na mtoto.'
 ]} />
 </SubSection>
 <SubSection title="10.2.3 Utumizi wa 'Kwa ajili ya'">
 <p>Kihusishi hiki hutumika kutoa sababu, lengo, au faida ya kufanyika kwa tendo fulani (kwa manufaa ya mtu au kitu). Mfano: Mama alinunua vitabu vya ziada kwa ajili ya masomo ya Kito.</p>
 </SubSection>
 </SubSection>

 <SubSection title="10.3 Mifano Iliyofanywa (Worked Examples)">
 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Mfano 1: Kupata Kinyume cha Kitenzi katika Sentensi</h4>
 <p>Swali: Badilisha kitenzi kilichopigiwa mstari katika sentensi ifuatayo ili kionyeshe maana ya kinyume chake: Mzee Baraka alizileta nguo akazianika juani.</p>
 <p><strong>Jibu:</strong> "Mzee Baraka alizileta nguo akazianua juani." (Kinyume cha anika ni anua).</p>
 </div>
 </SubSection>

 <SubSection title="10.4 Maswali ya Mazoezi na Majibu Yake">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 1: Vinyume vya Vitenzi</h4>
 <p>Andika kinyume cha vitenzi vifuatavyo: a) Kunja (Fold) --&gt; Kunjua (Unfold). b) Bandika (Stick on) --&gt; Bandua (Peel off/Unstick). c) Washa (Turn on light/fire) --&gt; Zima (Turn off/Extinguish). d) Pakia (Load cargo) --&gt; Pakua (Unload cargo).</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Swali la 2: Kujaza Vihusishi Sahihi</h4>
 <p>Chagua neno sahihi kati ya yale yaliyopo kwenye mabano ili kukamilisha sentensi: (kwa, na, kwa ajili ya)</p>
 <p>a) Wafanyakazi walisafiri kwenda Mombasa ______________ treni mpya ya kisasa. <strong>kwa</strong> (Inaonyesha njia).</p>
 <p>b) Kito alijitolea kusafisha mto ule ______________ usalama wa afya ya wanakijiji wote. <strong>kwa ajili ya</strong> (Inaonyesha lengo).</p>
 <p>c) Mwalimu alifurahi sana ______________ alizungumza kwa upendo mkubwa na wanafunzi. <strong>na</strong> (Inaunganisha matendo).</p>
 </div>
 </SubSection>

 <SubSection title="?? JIKUMBUSHIE: MAZOEZI YA KIINTAREKTIFU">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Jaribio: Vinyume na Vihusishi vya Kiswahili</h4>
 <p><strong>Swali la 1 (Mada: Vinyume vya Vitenzi):</strong> Ni ipi kinyume sahihi ya kitenzi kilichopo katika sentensi hii: Mwindaji alikitega mtego wake asubuhi. A) Alikifunika (Makosa). B) Alikichomeka (Makosa). C) Alikitegua (Sahihi! Kinyume cha 'tega' ni 'tegua'). D) Alikianika (Makosa).</p>
 </div>
 </SubSection>

 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? JEDWALI LA KUKUMBUKA (PARTICLE & VERB MATRIX)</h4>
 <pre style={{ background: 'transparent', padding: '8px', borderRadius: '8px', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{` [ SARUFI YA VINYUME NA VIHUSISHI ]
 ×
 +-----------------------------------------------------------+
 ? ?
 [ Mnyambuliko wa Vinyume ] [ Kazi za Vihusishi ]
 × Funga --> Fungua (-ua) × KWA: Kifaa, Njia, au Mahali × Anika --> Anua (-ua) × NA: Kuunganisha au Mtendaji × Bandika --> Bandua (-ua) × KWA AJILI YA: Lengo, Faida, au Sababu`}</pre>
 </div>
 </Section>

 {/* MTIHANI KAMILI WA MARUDIO WA LUGHA YA KISWAHILI */}
 <Section title="MTIHANI KAMILI WA MARUDIO WA LUGHA YA KISWAHILI">
 <p><strong>KIDATO/NGAZI: Darasa la 5 / Shule ya Msingi (Junior Primary) | MUDA: Saa 2:0 | ALAMA ZOTE: ALAMA 100°</strong></p>
 <p>MAELEKEZO KWA MTAHINIWA: Soma kila swali kwa makini sana kabla ya kuandika jibu lako. Jibu maswali yote katika nafasi zilizoandaliwa. Hati yako iwe safi na uzingatie sheria za sarufi, tahajia, na alama za uandishi.</p>

 <SubSection title="SEHEMU YA A: UFAHAMU WA KUSOMA NA BOKABULARI (ALAMA 30°)">
 <p>Maelekezo: Soma hadithi ifuatayo kwa umakini, kisha ujibu maswali yanayofuata.</p>
 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>?? Siri ya Kisima Kilichong'aa</h4>
 <p>Kito aliamka mapema asubuhi siku ya Jumamosi. Jua lilikuwa likichomoza nyuma ya milima ya kijani kibichi ya Kericho, likitupa vivuli virefu juu ya mashamba ya chai. Leo ilikuwa siku muhimu sana; babu yake, Mzee Baraka, alikuwa anaenda kumpeleka ndani kabisa ya mwitu mnene ili akajionee kisima cha zamani cha maji cha kijiji. Kito alikimbilia jikoni, akala bakuli lake la uji wa moto, kisha akapakia mkoba wake mdogo wa kitambaa kwa kuweka chupa ya maji na daftari la kuandikia.</p>
 <p>Walitembea kwa utaratibu kwenye njia nyembamba iliyopita katikati ya miamba miwili mirefu ya mawe. Hewa ilikuwa safi na ya baridi. Ghafla, Mzee Baraka alisimama. Alinyoosha kidole chake kuelekea upande wa miti mikubwa. "Tazama, Kito," alisema kwa sauti ya upole. "Kisima kinachong'aa kiko pale." Kito alishangaa sana. Maji yale yalikuwa safi kama kioo, yakionyesha picha ya miti mirefu iliyokizunguka.</p>
 <p>Tofauti na dada yake mdogo mwenye kelele ambaye kila mara alipiga mayowe, Kito alisimama kimya kabisa bila kufanya fujo. Alimwona ndege mzuri akijenga kiota chake kwa vijiti vidogo kwenye tawi la chini la mti. "Ni ndege adimu wa tanzu," Mzee Baraka alinong'ona. "Huenda anakuja hapa kila siku kunywa maji safi."</p>
 <p>Hata hivyo, Kito aliona chupa ya plastiki ikielea karibu na ukingo wa maji. Alihisi moyo wake ukiumia kwa huzuni. Alijua kuwa uchafuzi wa mazingira ulikuwa hatari sana kwa wanyama wa porini. Kito aliinama haraka, akachukua ile chupa kutoka kwenye maji safi, na akaiweka ndani ya mkoba wake. Mzee Baraka alitabasamu kwa fahari. "Kulinda mazingira ni kazi rahisi kama kila mtu ataokota takataka moja," alisema. Waliketi chini ya kivuli baridi cha mwembe mkubwa, wakifurahi kwamba wamekiweka kisima kile katika hali ya usalama.</p>
 </div>

 <SubSection title="Sehemu ya 1: Maswali ya Ufahamu wa Hadithi (Alama 15°)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>1. Hadithi hii inafanyika katika mazingira ya wapi? (Kutambua Mahali) [Alama 2]</strong></p>
 <p>Jibu: Katika mwitu mnene / kisimani katika kijiji cha Kericho.</p>
 <p><strong>2. Kito alibeba vitu gani ndani ya mkoba wake kabla ya safari? Taja vitu viwili. (Kukumbuka Taarifa) [Alama 2]</strong></p>
 <p>Jibu: Chupa ya maji na daftari la kuandikia.</p>
 <p><strong>3. Kwa nini Kito alisimama kimya kabisa bila kufanya fujo alipofika kisimani? (Kutafakari na Kuchambua) [Alama 3]</strong></p>
 <p>Jibu: Kwa sababu alikuwa na tabia njema/nidhamu (hakuwa na kelele kama dada yake), na pia alistaajabu/alishangazwa na usafi na uzuri wa kisima kile kilichong'aa kama kioo.</p>
 <p><strong>4. Kito alifanya kitendo gani cha kishujaa alipoona chupa ya plastiki ikielea majini? (Kukumbuka Taarifa) [Alama 2]</strong></p>
 <p>Jibu: Aliinama haraka, akaichukua ile chupa kutoka kwenye maji safi, na akaiweka ndani ya mkoba wake ili kuzuia uchafuzi wa mazingira.</p>
 <p><strong>5. Kwa mujibu wa hadithi, kwa nini Mzee Baraka alimwona Kito kama mjukuu wa kujivunia? (Kuchambua Hoja) [Alama 3]</strong></p>
 <p>Jibu: Kwa sababu Kito alionyesha uwajibikaji wa hali ya juu kwa kusafisha kisima bila kuamrishwa na mtu, akionyesha upendo wa dhati kwa viumbe na mazingira ya kijiji.</p>
 <p><strong>6. Hadithi hii inatufundisha nini kuhusu utunzaji wa mazingira yanayotuzunguka? (Udadisi na Maadili) [Alama 3]</strong></p>
 <p>Jibu: Inatufundisha umuhimu wa utunzaji wa mazingira na vyanzo vya maji, na kwamba kulinda asili ni wajibu wa kila mmoja wetu kupitia vitendo vidogo vidogo kama kuokota takataka.</p>
 </div>
 </SubSection>

 <SubSection title="Sehemu ya 2: Msamiati na Alama za Lugha (Alama 15°)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>7. Tazama neno lililokozwa mkoba katika aya ya kwanza. Neno hili liko katika ngeli gani ya Kiswahili? [Alama 2]</strong></p>
 <p>Jibu: C) Ngeli ya U-I (Mkoba - Mikoba).</p>
 <p><strong>8. Tazama neno lililokozwa kelele katika aya ya tatu. Mwandishi anasema: "Tofauti na dada yake mdogo mwenye kelele ambaye kila mara alipiga mayowe, Kito alisimama kimya kabisa..." Kulingana na muktadha huu, neno gani ni kinyume (antonym) cha kelele? [Alama 3]</strong></p>
 <p>Jibu: Kimya au Utulivu.</p>
 <p><strong>9. Katika aya ya nne, Kito anasema: "Alijua kuwa uchafuzi wa mazingira ulikuwa hatari..." Taja neno lingine lenye maana sawa (synonym) na neno hatari. [Alama 2]</strong></p>
 <p>Jibu: Janga / Baas / Shida / Hatari.</p>
 <p><strong>10. Katika aya ya mwisho, Mzee Baraka anasema: "Kulinda mazingira ni kazi rahisi..." Ni msemo upi kati ya hii unaobeba maana sawa na maneno kazi rahisi? [Alama 3]</strong></p>
 <p>Jibu: B) Kulamba asali kwa ncha ya kidole / mteremko.</p>
 <p><strong>11. Tafuta maneno yaliyotumiwa katika hadithi yenye maana sawa na haya yafuatayo: [Alama 3]</strong></p>
 <p>a) Pori lenye miti mingi (Aya ya 1): mwitu / pori. b) Hakika / kila mara (Aya ya 3): huenda / mara kwa mara. c) Chini ya (Aya ya 4): chini ya / ukingo wa.</p>
 <p><strong>12. Andika kinyume cha maneno haya yaliyopatikana katika habari: [Alama 2]</strong></p>
 <p>a) Mapema (Aya ya 1) &lt;--&gt; Chelewa / usiku. b) Safi (Aya ya 2) &lt;--&gt; Uchafu / Chafu.</p>
 </div>
 </SubSection>
 </SubSection>

 <SubSection title="SEHEMU YA B: SARUFI NA MATUMIZI YA LUGHA (ALAMA 40)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>13. Tambua aina za maneno (Parts of Speech) yaliyopigiwa mstari katika sentensi hii: [Alama 4]</strong> "Mwanafunzi mwerevu alisoma kitabu kile kwa makini jana jioni."</p>
 <p>a) mwerevu: Kivumishi cha Sifa | b) alisoma: Kitenzi | c) kile: Kivumishi Kimilikishi/Kielezi | d) kwa: Kihusishi.</p>
 <p><strong>14. Upatanisho wa Kisarufi: Chagua neno sahihi lililopo kwenye mabano kujaza nafasi: [Alama 4]</strong></p>
 <p>a) Miti mirefu ya mashambani [ilianguka / zilianguka] kwa upepo mkali. → ilianguka (Ngeli ya U-I wingi).</p>
 <p>b) Chakula kitamu [kilitengenezwa / zilitengenezwa] na mama asubuhi. → kilitengenezwa (Ngeli ya KI-VI umoja).</p>
 <p>c) Waalimu wote [anasoma / wanatofautiana] tabia zao za kazi. → wanatofautiana (Ngeli ya A-WA wingi).</p>
 <p>d) Gari jipya la mzee [liliharibika / liliharibika] barabarani jana. → liliharibika (Ngeli ya LI-YA umoja).</p>
 <p><strong>15°. Kamilisha jedwali hili kwa kuweka nomino katika hali ya Umoja au Wingi wa Ngeli sahihi: [Alama 6]</strong></p>
 <p>Jina katika Umoja: Kiti → Wingi: Viti → Ngeli: KI-VI. Jino: Jicho → Wingi: Macho → Ngeli: LI-YA. Umoja: Ukuta → Wingi: Kuta → Ngeli: U-ZI.</p>
 <p><strong>16. Vivumishi vya Sifa: Unganisha mzizi wa kivumishi [-baya] na nomino zifuatazo: [Alama 4]</strong></p>
 <p>a) Mtu + [-baya] = Mtu mbaya. b) Nyumba + [-baya] = Nyumba mbaya. c) Matunda + [-baya] = Matunda mabaya. d) Viti + [-baya] = Viti vibaya.</p>
 <p><strong>17. Badilisha sentensi ifuatayo kutoka wakati uliopo (-NA-) kwenda wakati uliopita (-LI-) na wakati ujao (-TA-): [Alama 4]</strong> "Ndege mzuri anaruka angani kuelekea msituni."</p>
 <p>a) Wakati Uliopita: Ndege mzuri aliruka angani kuelekea msituni. b) Wakati Ujao: Ndege mzuri ataruka angani kuelekea msituni.</p>
 <p><strong>18. Akifishia sentensi ifuatayo ili iwe Kauli Halisi (Direct Speech) kwa kuweka koma na alama za nukuu: [Alama 4]</strong> mwalimu alitazama darasa akasema mtasoma kwa bidii leo</p>
 <p>Jibu: Mwalimu alitazama darasa akasema, "Mtasoma kwa bidii leo."</p>
 <p><strong>19. Badilisha sentensi ifuatayo kutoka Kauli Halisi kwenda Kauli Taarifa (Indirect Speech): [Alama 4]</strong> Ali alisema, "Mimi nitaenda kucheza uwanjani sasa hivi."</p>
 <p>Jibu: Ali alisema kwamba yeye angeenda (au angeenda) kucheza uwanjani wakati huo.</p>
 <p><strong>20. Badilisha sentensi hii kutoka Kauli Utendaji (Active) kwenda Kauli Utendwa (Passive): [Alama 4]</strong> "Mtoto mdogo alikula tunda lililoiva."</p>
 <p>Jibu: Tunda lililoiva lilikiwa na mtoto mdogo.</p>
 <p><strong>21. Utumizi wa Vihusishi maalum: Jaza nafasi kwa kutumia kwa, na, au kwa ajili ya: [Alama 6]</strong></p>
 <p>a) Alikata kamba ile ______________ kisu kikali kilichonolewa. → kwa</p>
 <p>b) Juma ______________ Ali walisafiri pamoja kwenda mjini Nakuru. → na</p>
 <p>c) Alinunua nguo mpya ______________ sherehe ya siku ya kuzaliwa ya mdogo wake. → kwa ajili ya</p>
 <p>d) Alizungumza ______________ sauti ya unyenyekevu mbele ya wazazi wake. → kwa</p>
 </div>
 </SubSection>

 <SubSection title="SEHEMU YA C: UKUBWA, UDOGO NA VINYUME VYA VITENZI (ALAMA 15°)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>22. Nyumbua vitenzi hivi ili kupata kinyume chake (Verb Inverses): [Alama 3]</strong></p>
 <p>a) Funga (Close) --&gt; Kinyume: Fungua. b) Anika (Put in sun) --&gt; Kinyume: Anua. c) Chomeka (Insert) --&gt; Kinyume: Chomoa.</p>
 <p><strong>23. Ukubwa na Udogo: Badilisha nomino zifuatazo katika maumbo yaliyoombwa (Umoja): [Alama 4]</strong></p>
 <p>a) Nyumba --&gt; Katika Hali ya Ukubwa: Jumba. b) Mtoto --&gt; Katika Hali ya Udogo: Kitoto. c) Mtu --&gt; Katika Hali ya Ukubwa: Jitu. d) Mti --&gt; Katika Hali ya Udogo: Kiti.</p>
 <p><strong>24. Badilisha sentensi ifuatayo nzima katika Hali ya Ukubwa (Umoja): [Alama 4]</strong> "Mtu mrefu alibeba mtoto mdogo."</p>
 <p>Jibu: "Jitu refu lilibeba toto refu (au toto dume/dogo)."</p>
 <p><strong>25°. Weka adabu/hali ya Mazoea katika sentensi hii kwa kutumia kiambishi [HU-]: [Alama 4]</strong> "Wanafunzi wanaamka mapema kila siku kusoma vitabu."</p>
 <p>Jibu: "Wanafunzi huamka mapema kila siku kusoma vitabu."</p>
 </div>
 </SubSection>

 <SubSection title="SEHEMU YA D: FASIHI SIMULIZI NA UANDISHI (ALAMA 15°)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>26. Tegua Vitendawili na ukamilishe Methali zifuatazo: [Alama 5]</strong></p>
 <p>a) Kitendawili: Nyumba yangu haina mlango. --&gt; Tega: Yai.</p>
 <p>b) Kitendawili: Kila nikienda ananifuata. --&gt; Tega: Kivuli.</p>
 <p>c) Methali: Haba na haba, hujaza kibaba.</p>
 <p>d) Methali: Mvumilivu hula mbivu.</p>
 <p>e) Methali: Asiyesikia la mkuu, huvunjika guu.</p>
 <p><strong>27. Insha ya Kibunifu (Alama 10)</strong> Andika insha fupi ya masimulizi (aya 1 au 2, yenye sentensi 5 hadi 6) kuhusu mada isemayo: "Siku Niliyofanya Jambo la Kheri Kijijini". Hakikisha unatumia angalau kivumishi kimoja, kiunganishi sahihi, na uandishi safi wa aya.</p>
 <p><strong>Mfano wa Insha:</strong> Ilikuwa asubuhi moja tulivu tulipokuwa tukitembea kuelekea shuleni. Ghafla, nilimwona nyanya mzee sana akishindwa kubeba kizigo kizito cha kuni alichookota msituni. Mimi na rafiki yangu Kito tuliamua kumsaidia haraka sana kwa kubeba kuni zile hadi nyumbani kwake. Nyanya yule alifurahi sana na alitubariki kwa maneno mengi ya upendo. Ilikuwa siku ya kheri iliyonipa furaha kubwa moyoni mwangu.</p>
 </div>
 </SubSection>

 <SubSection title="?? MWONGOZO WA MAJIBU NA UFANANISHAJI (MARKING SCHEME)">
 <p>Majibu yote na alama zao zimeonyeshwa pamoja na kila swali hapo juu. Hakikisha unakagua kila jibu kulingana na mwongozo uliotolewa.</p>
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
// ---------- CRE NOTES ----------
function CRENotes() {
 return (
 <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
 <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? CRE: Christian Religious Education</h2>

 <Section title="UNIT 1: CREATION AND GOD'S MASTERPIECE">
 <SubSection title="1.1 The Unique Creation of Man">
 <SubSection title="Human Dignity and Divine Image">
 <p>Human beings occupy a unique position in the cosmic order. According to Genesis 1:26-27, humanity was not merely spoken into existence like the rest of creation. Instead, God took counsel within Himself, saying, "Let us make man in our image, after our likeness." This specific act sets human beings apart from animals, plants, and celestial bodies.</p>
 <p>Being made in the image and likeness of God does not refer to physical resemblance, as God is spirit (John 4:24). Rather, it signifies a reflection of God's moral, attributes, and spiritual capacities. Humans possess:</p>
 <BulletList items={[
 'Intellect: The capacity to think, reason, learn, and innovate.',
 'Volition: The power of free will to choose between right and wrong actions.',
 'Emotional Depth: The ability to experience complex love, empathy, compassion, and justice.',
 'Spiritual Nature: An immortal soul capable of direct communication and fellowship with the Creator.'
 ]} />
 <p>This divine blueprint endows every single human being with inherent dignity. This dignity is universal. It does not depend on a person's race, tribe, gender, age, socioeconomic status, or physical capability. Because every person is a bearer of the divine image, treating another human being with disrespect, cruelty, or prejudice is a direct offense against God.</p>
 </SubSection>
 <SubSection title="The Creation Account in Genesis">
 <p>Genesis 2 offers a detailed look at how God made the first man and woman. Genesis 2:7 says God formed man from the dust of the ground. He breathed into his nostrils the breath of life, and man became a living being. This highlights our dual nature: we are physically connected to the earth, yet spiritually connected to God.</p>
 <p>God placed the man in the Garden of Eden to cultivate and keep it. However, God observed that "It is not good that the man should be alone; I will make him a helper fit for him" (Genesis 2:18). After showcasing the animals to Adam × demonstrating that none was a suitable companion × God caused a deep sleep to fall upon Adam. God took one of the man's ribs and closed up its place with flesh. From this rib, God fashioned the woman, Eve, and brought her to the man.</p>
 <p>Upon seeing her, Adam declared: "This at last is bone of my bones and flesh of my flesh; she shall be called Woman, because she was taken out of Man." (Genesis 2:23). This account teaches that men and women are created equal. They share the same nature and are designed for companionship, mutual support, and unity.</p>
 </SubSection>
 </SubSection>

 <SubSection title="1.2 Talents and Abilities as Divine Endowments">
 <SubSection title="Definition and Biblical Foundation">
 <p>Talents and abilities are special gifts placed within individuals by God. A talent is often seen as a natural aptitude or skill that can be developed, such as musical ability, artistic flair, athletic prowess, or a knack for mathematics. An ability is the power or capacity to do something well. In the Christian context, these are not accidental traits; they are purposefully distributed by the Holy Spirit for the benefit of the community and the glory of God.</p>
 <p>In Matthew 25°:14-30°, Jesus shares the Parable of the Talents. A master journeys abroad and entrusts his property to his servants. To one he gives five talents, to another two, and to another one × each according to his ability. The servants who received five and two talents trade with them and double their value. The servant who received one talent digs a hole in the ground and hides his master's money out of fear. When the master returns, he praises the industrious servants, saying, "Well done, good and faithful servant." However, he condemns the lazy servant for his inactivity, reclaiming the single talent and casting him out.</p>
 </SubSection>
 <SubSection title="Application in a Child's Life">
 <BulletList items={[
 'Academic Abilities: Quick understanding of numbers, languages, or scientific concepts.',
 'Creative Talents: Drawing, painting, writing stories, singing, or playing musical instruments.',
 'Physical Talents: Running, playing football, swimming, or gymnastics.',
 'Social/Leadership Talents: Peacemaking, organizing group tasks, speaking confidently, or showing empathy to lonely peers.'
 ]} />
 <p>God expects children not to hide their abilities due to shyness, fear, or laziness. Developing a talent requires discipline, practice, and instruction from teachers and parents. Furthermore, Christian stewardship requires these talents to be used unselfishly.</p>
 </SubSection>
 </SubSection>

 <SubSection title="1.3 Stewardship and Guardianship of the Environment">
 <p>In Genesis 1:28, God blessed human beings and said to them, "Be fruitful and multiply and fill the earth and subdue it, and have dominion over every living thing that moves on the earth." This is clarified in Genesis 2:15°: "The Lord God took the man and put him in the garden of Eden to work it and keep it."</p>
 <BulletList items={[
 'The Soil (Land): Avoid over-cultivation, dumping plastic wastes, and excessive use of chemical fertilizers.',
 'Water Bodies: Prevent pollution via industrial waste, sewage, and littering.',
 'Vegetation (Forests and Plants): Forests produce oxygen, hold soil intact, and regulate climate patterns.',
 'Wildlife (Animals): Birds, land animals, and insects maintain ecological balance.'
 ]} />
 </SubSection>

 <SubSection title="1.4 Consequences of Environmental Misuse">
 <BulletList items={[
 'Soil Erosion: Removal of topsoil by wind or water due to deforestation and overgrazing.',
 'Drought and Desertification: Cutting down trees alters rainfall patterns.',
 'Pollution-Related Illnesses: Contaminated water causes cholera, typhoid; air pollution causes asthma.',
 'Flooding: Urban centers without proper drainage experience flash floods.'
 ]} />
 </SubSection>

 <SubSection title="Unit 1: Long-Form Questions and Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1</h4>
 <p>Explain the meaning of the phrase "human beings are created in the image and likeness of God" as taught in Genesis 1:26-27. Discuss three ways this understanding should influence how a Grade 4 learner treats themselves and others around them.</p>
 <p><strong>Answer:</strong> The phrase means that humans possess a unique spiritual, moral, and intellectual reflection of their Creator. This gives human beings unique value and dignity above the rest of creation. Three influences: Self-Worth and Self-Respect × the learner realizes they are special and loved by God. Treating Others with Equality and Respect × they look at classmates, teachers, and family as individuals who also carry God's image. Showing Compassion and Empathy × helping a person in need is a way of honoring God.</p>
 </div>
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 2</h4>
 <p>Read the Parable of the Talents (Matthew 25°:14-30°). Analyze the actions of the three servants. Explain the spiritual lessons a Grade 4 student can apply regarding their personal abilities and the consequences of laziness.</p>
 <p><strong>Answer:</strong> The first two servants worked hard and doubled their talents; they were praised as "good and faithful." The third servant buried his talent out of fear and was condemned as "wicked and lazy." Spiritual Lessons: Gifts Come from God × every ability is given by God. Responsibility to Develop Talents × God expects children to practice and grow their gifts. Accountability × everyone will give an account to God for how they used their abilities.</p>
 </div>
 </SubSection>
 </Section>

 <Section title="UNIT 2: THE HOLY BIBLE AS A DIVINE GUIDE">
 <SubSection title="2.1 The Nature and Purpose of the Holy Bible">
 <p>The Holy Bible is the sacred book for Christians. It is the inspired Word of God. 2 Timothy 3:16-17 states: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness." The Bible serves as a reliable map for navigating life's challenges.</p>
 <p>In Psalm 119:105°, the psalmist exclaims: "Your word is a lamp to my feet and a light to my path." Reading the Bible daily provides clarity, helping learners make wise choices, avoid temptation, and walk in accordance with God's will.</p>
 </SubSection>

 <SubSection title="2.2 The Structure and Divisions of the Bible">
 <BulletList items={[
 'The Old Testament: Contains 39 books written mostly in Hebrew. It details God\'s covenant relationship with Israel, creation, history, and prophecies of a coming Messiah.',
 'The New Testament: Contains 27 books written in Greek. It focuses on the birth, life, ministry, death, and resurrection of Jesus Christ, the early Church, and instructions for Christian living.'
 ]} />
 </SubSection>

 <SubSection title="2.3 Detailed Classification of Bible Books">
 <SubSection title="Old Testament Subdivisions">
 <BulletList items={[
 'Books of the Law (Pentateuch / Torah): 5 Books × Genesis, Exodus, Leviticus, Numbers, Deuteronomy.',
 'Historical Books: 12 Books × Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther.',
 'Poetic and Wisdom Books: 5 Books × Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon.',
 'Prophetic Books: 17 Books × Major Prophets (Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel) and Minor Prophets (Hosea through Malachi).'
 ]} />
 </SubSection>
 <SubSection title="New Testament Subdivisions">
 <BulletList items={[
 'The Gospels: 4 Books × Matthew, Mark, Luke, John.',
 'Church History: 1 Book × Acts of the Apostles.',
 'The Epistles (Letters): 21 Books × Romans through Jude.',
 'Prophecy: 1 Book × Revelation.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="Unit 2: Long-Form Questions and Answers">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Question 1</h4>
 <p>Define the concept of "Divine Inspiration" regarding the composition of the Holy Bible. Discuss how God utilized human writers to produce a unified document, and explain why 2 Timothy 3:16-17 considers Scripture profitable for daily living.</p>
 <p><strong>Answer:</strong> "Divine Inspiration" means the Holy Spirit guided human writers to record God's truth without error. Despite over 40 authors writing over 1,500 years, the Bible remains unified with one storyline: God's love and plan to rescue humanity through Jesus Christ. Scripture is profitable for: Teaching (shows truth), Reproof (corrects wrong paths), Correction (fixes mistakes), and Training in Righteousness (instruction for godly living).</p>
 </div>
 </SubSection>
 </Section>

 <Section title="UNIT 3: THE LIFE AND MINISTRY OF JESUS CHRIST">
 <SubSection title="3.1 The Early Life, Growth, and Identity of Jesus">
 <p>Jesus Christ spent His childhood and youth in Nazareth. Luke 2:52° summarizes His growth across four dimensions: In Wisdom (intellectual), In Stature (physical), In Favor with God (spiritual), and In Favor with Man (social).</p>
 <p>When Jesus was twelve, He stayed behind in the temple in Jerusalem, listening to teachers and asking questions. When Mary expressed anxiety, Jesus replied, "Did you not know that I must be in my Father's house?" (Luke 2:48-49), revealing His understanding of His divine sonship.</p>
 </SubSection>

 <SubSection title="3.2 The Baptism and Public Inauguration of Jesus">
 <p>Before Jesus began His public ministry, John the Baptist prepared the way, preaching repentance and baptizing people in the Jordan River. Jesus traveled from Galilee to be baptized by John. When John hesitated, Jesus said, "Let it be so now, for thus it is fitting for us to fulfill all righteousness" (Matthew 3:14-15°). By submitting to baptism, Jesus identified with humanity, endorsed John's ministry, and set an example of obedience.</p>
 </SubSection>

 <SubSection title="Multiple-Choice Questions (1-10)">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <p><strong>1. According to Genesis 1:26, what unique blueprint did God use when creating human beings?</strong> B) The image and likeness of God.</p>
 <p><strong>2. What material did God use to form the physical body of the first man, Adam?</strong> C) Dust from the ground.</p>
 <p><strong>3. On which specific day of creation did God bring into existence the sun, moon, and all the stars?</strong> C) Day Four.</p>
 <p><strong>4. Which of the following details describes the creation of the first woman, Eve?</strong> B) She was made from a rib taken out of Adam's side during a deep sleep.</p>
 <p><strong>5. What happened on the seventh day of creation that made it unique from all previous days?</strong> B) God rested from all His work and made the day holy.</p>
 <p><strong>6. In the Parable of the Talents, what did the servant who received only one talent do with it?</strong> C) He dug a hole in the ground and hid his master's money.</p>
 <p><strong>7. Which Bible verse states that every good and perfect gift comes from above, from the Father of lights?</strong> B) James 1:17.</p>
 <p><strong>8. What original responsibility did God give to human beings regarding the Garden of Eden in Genesis 2:15°?</strong> B) To work it and take care of it as faithful stewards.</p>
 <p><strong>9. Which of the following is a direct environmental consequence of cutting down large areas of forests without planting new trees?</strong> C) Severe soil erosion, drying up of rivers, and drought.</p>
 <p><strong>10. What does the word "Stewardship" mean from a Christian perspective?</strong> B) Taking care of God's creation on His behalf as a manager.</p>
 </div>
 </SubSection>

 <SubSection title="Section B: Short-Answer Questions (11-20)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>11. Explain what it means for a human being to be created in the "image and likeness of God."</strong> It means humans possess spiritual, intellectual, and moral attributes reflecting God × the ability to think, love, show empathy, know right from wrong, and have fellowship with God.</p>
 <p><strong>12. State three distinct ways a Grade 4 learner can identify their hidden talents or abilities.</strong> (1) Noticing tasks they perform easily and excellently. (2) Paying attention to activities that bring joy and satisfaction. (3) Listening to positive feedback from teachers, parents, and friends.</p>
 <p><strong>13. List three practical things children can do at school to keep the water environment clean and safe.</strong> (1) Avoid dumping plastic wrappers or trash into school drains. (2) Turn off taps completely after use. (3) Report water pipe leakages to school authorities.</p>
 <p><strong>14. Identify the specific day of creation for each: (a) Vegetation × Day Three. (b) Birds × Day Five. (c) Land animals × Day Six.</strong></p>
 <p><strong>15°. What basic lesson about responsibility do Christians learn from Jesus' Parable of the Talents?</strong> God expects everyone to use their gifts productively to serve others and glorify Him. Hiding gifts displeases God.</p>
 <p><strong>16. How does planting trees (afforestation) directly help in preventing famine and hunger?</strong> Trees attract rain and anchor soil with roots, preventing fertile topsoil loss, ensuring healthy food production.</p>
 <p><strong>17. Give two examples of how misuse of the environment can lead to dangerous health outbreaks.</strong> (1) Dumping sewage into rivers contaminates drinking water, causing cholera. (2) Burning plastic releases toxic smoke, causing respiratory diseases.</p>
 <p><strong>18. What was Adam's joyful response when God presented the first woman, Eve, to him?</strong> "This is now bone of my bones and flesh of my flesh; she shall be called 'woman,' for she was taken out of man."</p>
 <p><strong>19. Identify four different categories of natural talents that God can give to children.</strong> (1) Creative/Artistic (singing, painting). (2) Physical/Athletic (running, football). (3) Academic/Intellectual (solving math, languages). (4) Leadership/Social (peacemaking, counseling).</p>
 <p><strong>20. Why did God give human beings authority (dominion) over the animals and the plants?</strong> To act as responsible rulers, protectors, and caretakers, ensuring all living things are preserved according to His good plan.</p>
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
 <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>?? Social Studies: Complete Comprehensive Curriculum</h2>
 <p>Comprehensive Study Compendium: Extensive Notes, Deep-Dive Concept Analysis, and Structural Assessment Banks</p>

 <Section title="Module 1: Physical Environment, Maps, and Position">
 <SubSection title="1.1 Introduction to Map Work and Elements">
 <p>A map is a scaled, flat representation of the earth's surface or a part of it on a plane sheet. Unlike a photograph, which shows objects exactly as they appear to the eye, a map uses symbols, lines, and colors to communicate complex spatial information. To unlock the data embedded within a map, an analyst must master the five primary elements of a map, often remembered by the acronym TOLSS:</p>
 <BulletList items={[
 'Title: States clearly what the map represents and the geographical region it covers (e.g., "Physical Features of Nyeri County").',
 'Orientation (Compass Rose): Indicates direction. It establishes the cardinal and intermediate points so that the user can determine relative position.',
 'Legend (Key): Explains the meaning of all symbols, signs, shades, and colors used on the map.',
 'Scale: The ratio between the distance on the map and the actual ground distance. It allows users to calculate true geographic distances.',
 'Frame (Border): Encloses the map area, defining the boundaries of the mapped data.'
 ]} />
 </SubSection>

 <SubSection title="Advanced Directional Systems">
 <p>Direction is the relative position of one point from another. In Grade 4, spatial orientation advances from the four basic cardinal points to the eight-point compass.</p>
 <BulletList items={[
 'Cardinal Points: North (N), East (E), South (S), and West (W). They are fixed at 90 × angles from one another.',
 'Intermediate (Semi-Cardinal) Points: North-East (NE) at 45°, South-East (SE) at 135°, South-West (SW) at 225°, North-West (NW) at 315°.'
 ]} />
 </SubSection>

 <SubSection title="Comprehensive Classification of Physical Features">
 <p>Physical features are natural landforms and water bodies found on the surface of the earth. They are categorized into two major topographic groups:</p>
 <BulletList items={[
 'Relief Features (Elevated Landforms): Mountains (exceptionally high with steep slopes), Hills (rounded tops, lower than mountains), Plateaus (high-altitude flat tablelands), Plains (low-lying nearly flat land), Valleys (low-lying depressions between hills/mountains).',
 'Drainage Features (Water Bodies): Rivers (permanent or seasonal natural channels), Lakes (inland depressions filled with standing water × freshwater like Lake Victoria or alkaline like Lake Nakuru), Swamps (waterlogged areas with papyrus reeds), Oceans (massive saline water bodies like the Indian Ocean).'
 ]} />
 </SubSection>

 <SubSection title="Weather and Climate Dynamics">
 <p>Weather is the atmospheric condition of a specific place recorded over a short period (hours or days). Climate is the average weather condition of a large geographic region recorded over an extended period (usually 30° to 35° years).</p>
 <table style={{ width: '100%', fontSize: '.85rem', borderCollapse: 'collapse', margin: '8px 0' }}>
 <tbody>
 <tr style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Weather Element</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Definition / Description</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Meteorological Instrument</th><th style={{ border: '1px solid var(--border)', padding: '6px' }}>Unit of Measurement</th></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Temperature</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The degree of hotness or coldness of the atmosphere.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Thermometer (Six's Max/Min)</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Degrees Celsius (×C)</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Rainfall</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Liquid precipitation falling from clouds to earth.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Rain Gauge</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Millimeters (mm)</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wind Direction</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The compass direction from which the wind blows.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wind Vane</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Compass Points (N, E, S, W)</td></tr>
 <tr style={{ border: '1px solid var(--border)' }}><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Wind Speed</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>The velocity or rate of motion of moving air.</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Anemometer</td><td style={{ border: '1px solid var(--border)', padding: '6px' }}>Kilometers per hour (km/h) / Knots</td></tr>
 </tbody>
 </table>
 </SubSection>

 <SubSection title="1.2 Extensive Evaluation Assessment × Multiple-Choice Questions">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <p><strong>1. Which element of a map allows an analyst to translate a 2-centimeter measurement on paper into a 10-kilometer distance on the ground?</strong> B) The map scale.</p>
 <p><strong>2. A learner is standing facing the direction of the rising sun. If she turns 90°° to her right side, which intermediate direction will be directly behind her?</strong> B) North-West.</p>
 <p><strong>3. Which of the following features is categorized as an inland drainage feature containing papyrus reeds and waterlogged soil conditions?</strong> B) Lorian Swamp.</p>
 <p><strong>4. Why is the outer cylinder of a standard rain gauge usually buried deep or sunk into the ground when set up at a weather station?</strong> B) To prevent evaporation of collected water caused by direct solar heat.</p>
 <p><strong>5. What environmental hazard is directly caused by stripping hilly slopes of their natural vegetation cover through charcoal burning?</strong> B) Accelerated soil erosion and landslides.</p>
 </div>
 </SubSection>
 </Section>

 <Section title="Module 2: People, Culture, and Social Relations">
 <SubSection title="2.1 Historical Origins and Linguistic Groupings">
 <p>The population of any county or nation is made up of diverse communities with distinct historical backgrounds. These communities are grouped into linguistic families (language groups) based on shared vocabulary, oral histories, and common ancestral origins.</p>
 <SubSection title="1. The Bantus">
 <p>The Bantus form the largest linguistic group in the region. Historically, they migrated from the Congo Basin/Cameroon region. They were primarily agriculturalists (farmers). Sub-groups: Central Bantus (Kikuyu, Meru, Embu, Mbeere, Kamba), Western Bantus (Luhya, Kisii, Kuria), Coastal Bantus (Mijikenda including Giriama, Digo, Chonyi; Pokomo, Taita, Taveta).</p>
 </SubSection>
 <SubSection title="2. The Nilotes">
 <p>The Nilotes originated from the Nile Valley region (Southern Sudan). Their primary economic activity was nomadic pastoralism and fishing. Sub-groups: River-Lake Nilotes (Luo), Highland Nilotes (Kalenjin clusters: Kipsigis, Nandi, Tugen, Pokot, Marakwet, Keiyo, Sabaot), Plain Nilotes (Maasai, Samburu, Turkana, Iteso).</p>
 </SubSection>
 <SubSection title="3. The Cushites">
 <p>The Cushites migrated from the Horn of Africa (Ethiopia and Somalia). They settled in semi-arid and arid regions. Sub-groups: Somali, Oromo, Borana, Rendille, Gabbra, Burji.</p>
 </SubSection>
 </SubSection>

 <SubSection title="2.2 Cultural Heritage and Social Structures">
 <BulletList items={[
 'Traditional Artifacts: Objects made by human craftsmanship × weapons (spears, shields, bows, arrows), domestic utensils (calabashes, earthen pots, woven baskets), ceremonial regalia (beadwork, feathers, animal skins).',
 'Traditional Housing: Built using locally sourced natural materials × wooden poles and mud walls, thatched grass/reeds roofs, often circular to withstand wind pressures.',
 'Traditional Food: Agrarian communities relied on maize, millet, sorghum, tubers, and green vegetables. Pastoral communities lived on milk, meat, and animal blood.',
 'Traditional Clothing: Made from softened animal skins, tree barks, natural dyes. Ornaments like glass beads, copper wires, brass bangles indicated age group, marriage status, or leadership rank.',
 'Family Structures: Nuclear Family (father, mother, children) and Extended Family (includes grandparents, uncles, aunts, cousins).'
 ]} />
 </SubSection>

 <SubSection title="2.2 Extensive Evaluation Assessment × Multiple-Choice Questions">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <p><strong>1. A Grade 4 learner is researching a linguistic group that migrated from the Congo Basin, practiced iron-working, and settled down primarily as crop farmers. Which group is this?</strong> C) The Bantus.</p>
 <p><strong>2. Which sub-group of the Nilotic language family settled in the high-altitude regions of the Rift Valley and includes the Nandi and Kipsigis communities?</strong> B) Highland Nilotes.</p>
 <p><strong>3. Why did traditional communities build their huts with circular mud walls and conical thatched roofs?</strong> B) Circular designs distribute wind forces evenly and grass roofs provide natural temperature insulation.</p>
 <p><strong>4. Which of the following sets of items contains ONLY traditional artifacts used for security and defense in a community museum?</strong> B) Spears, shields, bows, and arrows.</p>
 <p><strong>5. A household consists of a mother, a father, their three children, two uncles, and a maternal grandmother living within the same compound. What type of family organization is this?</strong> B) Extended family.</p>
 </div>
 </SubSection>
 </Section>

 <Section title="Module 3: Resources and Economic Activities">
 <SubSection title="3.1 Agriculture: Crop and Livestock Production">
 <p>Economic activities are actions humans take to produce goods and services to meet their needs and generate income. Agriculture is a major economic sector.</p>
 <BulletList items={[
 'Cash Crops: Crops grown primarily for sale to generate income or export revenue. Tea (requires high altitudes, cool temperatures 15°C-21°C, well-distributed rainfall 1500mm-2500mm annually, acidic volcanic soils). Coffee (moderate altitudes, warm temperatures, deep volcanic soils with distinct dry periods for harvesting).',
 'Food (Subsistence) Crops: Crops grown primarily for domestic consumption × maize, beans, potatoes, cassava, millet.',
 'Dairy Farming: Keeping cattle for milk production. Thrives in cool, wet highland areas. Breeds: Friesian, Ayrshire, Guernsey, Jersey.',
 'Pastoralism: Nomadic livestock keeping in arid and semi-arid lands (ASALs), where communities move constantly with their herds to find water and pasture.',
 'Poultry Farming: Rearing domestic birds (chickens, ducks, turkeys) for meat (broilers) or eggs (layers). Requires relatively little land.'
 ]} />
 </SubSection>

 <SubSection title="3.2 Forestry, Agroforestry, and Environmental Balance">
 <BulletList items={[
 'Natural Forests: Indigenous forests that grow naturally without human intervention (e.g., Mau Forest, Kakamega Forest).',
 'Plantation (Artificial) Forests: Man-made forests usually featuring a single tree species (monoculture) like pine, cypress, or eucalyptus. Planted in straight rows and mature quickly for timber.',
 'Agroforestry: The practice of growing crops, rearing livestock, and planting trees on the same piece of land at the same time. Maximizes land use, provides firewood and timber, improves soil fertility.'
 ]} />
 </SubSection>

 <SubSection title="3.3 Wildlife, Tourism, and Industrial Production">
 <BulletList items={[
 'Wildlife: Refers to animals and plants living in their natural habitats. Conservation areas include National Parks (managed by central government, no human settlement, e.g., Tsavo National Park) and National Reserves (allow regulated human activities, e.g., Maasai Mara National Reserve).',
 'Tourism: A service industry where people travel to places of interest for leisure, education, or business. Generates foreign exchange, creates jobs, promotes local crafts.',
 'Manufacturing Industries: Processing raw materials into finished consumer goods × fruit canning, sugar milling, tea processing, cement manufacturing.'
 ]} />
 </SubSection>
 </Section>

 <Section title="Module 4: Citizenship, Governance, and Civic Responsibility">
 <SubSection title="4.1 Concept of Citizenship and National Cohesion">
 <p>A citizen is a person who is legally recognized as a member of a specific country, giving them legal rights and responsibilities. Citizenship is established through birth (having parents who are citizens) or naturalization (a legal process where a foreigner is granted citizenship after meeting certain legal criteria).</p>
 <SubSection title="National Symbols">
 <BulletList items={[
 'The National Flag: Black represents the people of the nation. Red represents the blood shed during the struggle for freedom. Green represents the rich agricultural land and natural vegetation. White represents peace and unity. The Shield and Two Spears symbolize readiness to defend national freedom.',
 'The National Anthem: A prayer sung to express patriotism. It encourages hard work, unity, justice, and peaceful co-existence.',
 'The Coat of Arms: The official seal of the state featuring two lions holding spears and a shield with a rooster holding an axe. National motto: "Harambee" (Pulling together).'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="4.2 Structure of County Governance and Leadership">
 <BulletList items={[
 'The County Governor: The chief executive officer who leads the county government, manages county affairs, and implements local policies.',
 'Deputy Governor: Assists the Governor and takes over executive duties if the Governor is absent.',
 'County Executive Committee (CEC): Appointed heads of various sectors (Health, Agriculture, Education, Infrastructure) who act as the county cabinet.',
 'Members of County Assembly (MCAs): Representatives elected from small administrative units called Wards.',
 'The Speaker of the County Assembly: An official elected by the MCAs to lead debates and maintain order during assembly sittings.',
 'Functions of the County Assembly: Passes local laws, approves the county budget, and monitors the performance of the Governor and the executive team.'
 ]} />
 </SubSection>
 </Section>

 <Section title="UNIT 5: HISTORICAL JOURNEYS, HERITAGE, AND PRE-COLONIAL COMMUNITIES IN KENYA">
 <SubSection title="5.1 The Language Groups of Kenya">
 <p>Long before Kenya became a colony or an independent republic, it was home to diverse communities. Historians and linguists group these pre-colonial communities into three main categories: The Bantus, The Nilotes, and The Cushites.</p>
 <SubSection title="A. The Bantus">
 <BulletList items={[
 'Origin: They originated from the Congo Basin in Central Africa.',
 'Reasons for Migration: Search for fertile land, population pressure, internal conflicts.',
 'Western Bantus: Settled in the Lake Victoria basin × Abaluhya, Abagusii, Abakuria.',
 'Central Bantus: Settled around Mount Kenya and the Aberdare ranges × Agikuyu, Ameru, Aembu, Akamba.',
 'Coastal Bantus: Settled along the Indian Ocean strip × Mijikenda (nine tribes), Pokomo, Taita.'
 ]} />
 </SubSection>
 <SubSection title="B. The Nilotes">
 <BulletList items={[
 'Origin: They came from the Nile Valley, specifically from the South Sudan region.',
 'Reasons for Migration: Search for green pastures and water, escape disease outbreaks, droughts.',
 'River-Lake Nilotes: The Luo × settled near Lake Victoria, fishing and crop farming.',
 'Plains Nilotes: Maasai, Samburu, Turkana, Iteso × nomadic pastoralists in open grassland plains.',
 'Highland Nilotes: Kalenjin (Kipsigis, Nandi, Tugen, Pokot, Keiyo, Marakwet) × Rift Valley highlands, farming and livestock keeping.'
 ]} />
 </SubSection>
 <SubSection title="C. The Cushites">
 <BulletList items={[
 'Origin: They migrated from the Horn of Africa (Ethiopia and Somalia region).',
 'Reasons for Migration: Find pasture for animals, severe droughts, population pressure.',
 'Eastern Cushites: Somali, Borana, Rendille, Orma.',
 'Southern Cushites: The Dahalo are the main remaining group.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="5.2 Pre-Colonial Social and Political Organization">
 <SubSection title="A. The Role of Clans and Elders">
 <BulletList items={[
 'The Clan: The basic social unit was the family, and several related families formed a clan. Members shared a common ancestor.',
 'Council of Elders: Each clan was governed by a Council of Elders × wise, senior men who had proven their leadership skills.',
 'Duties of Elders: Settling land conflicts and domestic disputes, making laws and passing down traditions, planning religious sacrifices, declaring war or negotiating peace.'
 ]} />
 </SubSection>
 <SubSection title="B. The Age-Set System">
 <p>Many Nilotic and Bantu communities (such as the Maasai, Kalenjin, and Agikuyu) used an age-set system (Rika or Olporror). Young boys born around the same period were circumcised or initiated together. This group stayed together for life, moving through stages: initiates → warriors (defense) → elders (political decisions).</p>
 </SubSection>
 <SubSection title="C. Religious Beliefs and Practices">
 <BulletList items={[
 'Asis: The Kalenjin name for God, associated with the sun.',
 'Ngai / Enkai: The name used by the Agikuyu, Kamba, and Maasai, believed to reside on Mount Kenya (Kirinyaga).',
 'Nyasaye: The Luo name for the creator God.',
 'Were: The Luhya name for God.',
 'Communities offered sacrifices at sacred places like shrines, under large trees (Mugumo tree among the Gikuyu), or on mountaintops to ask for rain, healing, or victory.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="5.3 Pre-Colonial Economic Systems">
 <BulletList items={[
 'Farmers: Communities in fertile regions with reliable rainfall grew millet, sorghum, yams, sweet potatoes, and beans.',
 'Pastoralists: Communities in drier plains kept cattle, sheep, goats, and camels. Livestock was a sign of wealth and used to pay dowry.',
 'Gatherers and Hunters: Groups like the Okiek and Dorobo lived in forests, hunting wild animals and gathering wild honey, fruits, and roots.',
 'Barter Trade: Communities exchanged goods for other goods. For example, pastoralist Maasai exchanged meat, milk, and hides with agricultural Agikuyu for grains, pottery, and iron tools.',
 'Ironworking: Blacksmiths were highly respected. They melted iron ore to make weapons (spears, arrows, knives) and farming tools (hoes, machetes).',
 'Pottery and Basketry: Women wove baskets and molded clay pots for cooking, fetching water, and storing grain.'
 ]} />
 </SubSection>
 </Section>

 <Section title="UNIT 6: EUROPEAN CONTACT, COLONIAL RULE, AND THE STRUGGLE FOR INDEPENDENCE IN KENYA">
 <SubSection title="6.1 Early European Arrival and Contact">
 <BulletList items={[
 'Christian Missionaries: Johann Krapf and Johannes Rebmann were among the earliest missionaries. They established the first mission station at Rabai near Mombasa in 1846. They translated the Bible into Kiswahili, built the first schools, introduced modern healthcare, and campaigned against the slave trade.',
 'Explorers: Joseph Thomson explored the interior of Kenya to map out routes, locate rivers, mountains, and assess economic potential.',
 'Imperial British East Africa (IBEA) Company: Led by Sir William Mackinnon. This trading company was given a royal charter by Britain to manage and trade in East Africa.'
 ]} />
 </SubSection>

 <SubSection title="6.2 The Establishment of Colonial Rule">
 <p>In 1895, the British government took over from the financially struggling IBEA Company and declared Kenya a British Protectorate (later renamed Kenya Colony in 1920).</p>
 <SubSection title="A. The Building of the Uganda Railway">
 <BulletList items={[
 'Built between 1896 and 1901 to connect the port of Mombasa to Lake Victoria (Uganda).',
 'Over 30,000 Indian laborers (Coolies) were imported to build the railway.',
 'Challenges: Attacks by wild animals (man-eating lions of Tsavo), tropical diseases like malaria, rough landscape, and resistance from local communities like the Nandi.',
 'Effects: Opened up the interior for European settlement, led to growth of towns (Nairobi, Kisumu, Nakuru), and speeded up movement of goods and troops.'
 ]} />
 </SubSection>
 <SubSection title="B. Colonial Administration Policies">
 <BulletList items={[
 'Land Alienation: The colonial government took fertile land in the Rift Valley and Central Highlands (the "White Highlands") from Africans and gave it to white settlers for commercial farming.',
 'The Kipande System: African men over 16 were forced to wear a registration metal container on a string around their necks called a Kipande. It recorded their employment history, fingerprint, and was used to restrict their movement.',
 'Forced Labor and Taxation: High taxes (Hut Tax and Poll Tax) were introduced. Since Africans had no money, they were forced to work on European farms to earn money to pay the taxes.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="6.3 African Resistance to Colonial Rule">
 <BulletList items={[
 'The Nandi Resistance (1895°1905): Led by Koitalel Arap Samoei. The Nandi fought the British for ten years. The resistance ended when Koitalel was tricked and killed during a peace meeting by Colonel Richard Meinertzhagen.',
 'Mekatilili wa Menza: A brave woman leader from the Giriama community who organized her people to resist forced labor and British taxation.',
 'The East African Association (EAA): Formed in 1921 by Harry Thuku to protest against the Kipande system, high taxes, and low wages.',
 'The Kikuyu Central Association (KCA): Led by Jomo Kenyatta, focusing on getting back alienated African lands.',
 'The Kenya African Union (KAU): Formed in 1944 to give Africans a national political voice to demand constitutional reforms and independence.'
 ]} />
 </SubSection>

 <SubSection title="6.4 The Mau Mau Movement and the Road to Freedom">
 <BulletList items={[
 'By the 1950s, many Kenyans formed a secret armed movement called the Mau Mau (Kenya Land and Freedom Army).',
 'Freedom fighters went into the deep forests of Mount Kenya and the Aberdare Ranges, using guerrilla warfare.',
 'Field Marshal Dedan Kimathi was the most famous military commander.',
 'In 1952, Governor Sir Evelyn Baring declared a State of Emergency. Jomo Kenyatta and five other leaders (the "Kapenguria Six") were arrested and imprisoned.',
 'Thousands of Kenyans were placed in concentration villages and detention camps.',
 'Field Marshal Dedan Kimathi was captured in 1956 and executed in 1957.'
 ]} />
 </SubSection>

 <SubSection title="6.5 Achievement of Independence (1963)">
 <BulletList items={[
 'Lancaster House Conferences: Meetings held in London between African leaders and the British government to write a new constitution for an independent Kenya.',
 'First Elections: National elections were held, and the Kenya African National Union (KANU) won.',
 'Independence Day (12th December 1963): Kenya attained internal self-rule (Madaraka). The British flag was lowered, and the new Kenyan flag was raised at Uhuru Gardens in Nairobi.',
 'Mzee Jomo Kenyatta became the first Prime Minister, and later the first President when Kenya became a Republic on 12th December 1964.'
 ]} />
 </SubSection>
 </Section>

 <Section title="UNIT 7: RESOURCES, ECONOMIC ACTIVITIES, AND SUSTAINABLE DEVELOPMENT IN KENYA">
 <SubSection title="7.1 Natural and Human Resources in Kenya">
 <SubSection title="A. Natural Resources">
 <BulletList items={[
 'Land and Soil: The primary resource for agriculture. Volcanic soils in the highlands (Nyeri, Kericho, Kiambu) are highly fertile.',
 'Water Bodies: Includes rivers (Tana, Athi, Nyando), lakes (Victoria, Nakuru, Naivasha, Turkana), and the Indian Ocean. Provide fish, water for domestic/industrial use, and irrigation.',
 'Forests: Found in water towers like Mount Kenya, the Aberdare Ranges, Mau Complex, and Mount Elgon. Protect water catchments, provide timber, prevent soil erosion.',
 'Wildlife: Found in national parks and reserves (Tsavo, Maasai Mara, Amboseli). Backbone of the tourism sector.',
 'Minerals and Energy: Soda ash (Lake Magadi), fluorspar (Kerio Valley), titanium (Kwale), and geothermal steam (Olkaria).'
 ]} />
 </SubSection>
 <SubSection title="B. Human Resources">
 <p>Human resources refer to the people who use their labor, skills, knowledge, and energy to convert natural resources into useful products. Doctors, teachers, engineers, farmers, and factory workers represent Kenya's human resource capacity. The government improves this resource through education and training in schools, polytechnics, and universities.</p>
 </SubSection>
 </SubSection>

 <SubSection title="7.2 Primary Economic Activities in Kenya">
 <SubSection title="A. Agriculture">
 <BulletList items={[
 'Subsistence Farming: Cultivating crops primarily for family consumption (maize, beans, potatoes).',
 'Commercial Farming: Growing cash crops strictly for sale × Tea (Kericho, Kisii, Limuru), Coffee (Kiambu, Nyeri, Meru), Horticulture (flowers, fruits, vegetables for export × Naivasha, Thika).',
 'Livestock Keeping: Dairy farming in cool highlands and pastoralism (beef cattle, camels, goats) in arid regions like Marsabit and Garissa.'
 ]} />
 </SubSection>
 <SubSection title="B. Tourism">
 <BulletList items={[
 'Attractions: Sandy beaches along the coast, diverse wildlife in national parks, cultural heritage sites (Fort Jesus, Old Town Lamu), beautiful landscapes like the Great Rift Valley.',
 'Significance: Creates thousands of jobs in hotels, transport, and tour guiding. Provides revenue for the government through park entry fees.'
 ]} />
 </SubSection>
 <SubSection title="C. Manufacturing and Jua Kali Sector">
 <BulletList items={[
 'Large-scale Manufacturing: Processing agricultural raw materials into finished goods (sugar milling, tea processing, textile production, cement manufacturing in Athi River).',
 'The Jua Kali Sector: Small-scale, informal engineering and manufacturing activities operating in the open air (Jua Kali meaning "Fierce Sun"). Blacksmiths, carpenters, and mechanics make wheelbarrows, energy-saving stoves (jikos), and furniture from scrap metal and timber.'
 ]} />
 </SubSection>
 </SubSection>

 <SubSection title="7.3 Sustainable Resource Management and Conservation">
 <BulletList items={[
 'Soil and Water Conservation: Terracing and Contour Ploughing × digging ditches (Fanya Juu terraces) across hillsides to slow down rainwater. Afforestation and Reafforestation × planting trees. Protection of Riparian Zones × leaving natural vegetation along riverbanks.',
 'Wildlife and Environmental Protection: Anti-poaching Measures × employing rangers under Kenya Wildlife Service (KWS). Waste Management × reducing plastic pollution, recycling waste materials, treating factory water before releasing it into lakes and rivers.'
 ]} />
 </SubSection>
 </Section>

 <Section title="UNIT 8: GLOBAL CONNECTIONS, INTERNATIONAL TRADE, AND KENYA'S NEIGHBOURS">
 <SubSection title="8.1 Kenya's Geographical Position and Neighbours">
 <p>Kenya is located on the eastern coast of the African continent. The Equator passes directly through the country. Kenya shares land borders with five sovereign nations: Tanzania (south), Uganda (west), South Sudan (north-west), Ethiopia (north), and Somalia (east).</p>
 </SubSection>

 <SubSection title="8.2 International Trade in Kenya">
 <BulletList items={[
 'Exports (What Kenya Sells): Agricultural products × high-grade black tea, Arabica coffee, cut flowers, french beans, avocadoes. Processed and Mineral Goods × refined petroleum products, cement, soda ash. Invisible Exports × tourism and international transport networks (Kenya Airways).',
 'Imports (What Kenya Buys): Energy × crude oil and petroleum products from the Middle East. Industrial and Capital Goods × motor vehicles, airplanes, electrical machinery, construction steel. Consumer Electronics × smartphones, computers, televisions, pharmaceuticals.'
 ]} />
 </SubSection>

 <SubSection title="8.3 Regional Cooperation and Economic Blocs">
 <BulletList items={[
 'The East African Community (EAC): Members include Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, DRC, and Somalia. Headquarters in Arusha, Tanzania. Benefits: Single East African passport for travel, removes customs duties on goods produced within the region.',
 'COMESA (Common Market for Eastern and Southern Africa): A larger economic bloc spanning over 20 African nations. Objective: Form a single integrated economic space where goods can be traded freely without punitive taxes.'
 ]} />
 </SubSection>
 </Section>

 <Section title="CIVICS, CITIZENSHIP, AND REVENUE IN KENYA (CONTINUED)">
 <SubSection title="Part A: Multiple-Choice Questions (15° Questions)">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <p><strong>1. Which organ of the Government of Kenya is solely responsible for debating, amending, and passing national legislation?</strong> C) Parliament.</p>
 <p><strong>2. What is the constitutional term limit for an elected President in Kenya?</strong> B) Two terms of 5 years each.</p>
 <p><strong>3. Which of the following represents a direct obligation of a Kenyan citizen to the state rather than a human right?</strong> B) The obligation to pay taxes honestly.</p>
 <p><strong>4. The public officer responsible for managing and coordinating all administrative and developmental activities within a specific County is the:</strong> D) County Governor.</p>
 <p><strong>5. Which Kenyan national symbol serves as the official seal of the state, featuring two lions holding spears and a shield?</strong> B) The Coat of Arms.</p>
 <p><strong>6. What do the white stripes on the Kenyan National Flag represent?</strong> B) Peace and unity.</p>
 <p><strong>7. Which body is constitutionally mandated to collect public revenue on behalf of the National Government of Kenya?</strong> B) Kenya Revenue Authority (KRA).</p>
 <p><strong>8. A tax levied directly on the profits earned by registered businesses and corporate entities in Kenya is known as:</strong> C) Corporation Tax.</p>
 <p><strong>9. Which of the following is a legislative function performed exclusively by the County Assembly?</strong> B) Passing local county laws (by-laws).</p>
 <p><strong>10. The concept of "Devolution" in Kenya refers to the:</strong> B) Transfer of certain powers and resources from the national level to 47 distinct counties.</p>
 <p><strong>11. What is the primary purpose of Value Added Tax (VAT) in Kenya?</strong> B) To raise revenue for public infrastructure by taxing consumption.</p>
 <p><strong>12. If a citizen's basic rights are violated, which branch of government provides a remedy and justice?</strong> C) The Judiciary.</p>
 <p><strong>13. Which language is designated by the Constitution as the official national language of communication and unity in Kenya?</strong> B) Kiswahili.</p>
 <p><strong>14. Which of the following acts promotes national unity and cohesion?</strong> B) Participating in national celebrations like Madaraka Day and Mashujaa Day.</p>
 <p><strong>15°. What does the word "HARAMBEE" inscribed on the Kenyan Coat of Arms mean?</strong> C) Let us pull together.</p>
 </div>
 </SubSection>
 </Section>

 <Section title="GRADE 4 SOCIAL STUDIES COMPREHENSIVE FINAL MOCK EXAMINATION">
 <p><strong>Time Allowed: 2 Hours 30° Minutes</strong></p>
 
 <SubSection title="SECTION A: MULTIPLE-CHOICE QUESTIONS (40 Marks)">
 <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', margin: '12px 0' }}>
 <p><strong>1. Which elements of a map are used to interpret the symbols, colors, and patterns used by the mapmaker?</strong> C) The Key or Legend.</p>
 <p><strong>2. If you are facing the direction of the setting sun in the evening, which cardinal direction is directly to your left hand?</strong> B) South.</p>
 <p><strong>3. Which physical feature in Kenya was formed through tectonic processes that caused the earth's crust to fracture and drop between parallel fault lines?</strong> B) The Great Rift Valley.</p>
 <p><strong>4. Which language group represents the largest population category in Kenya and originated from the Congo Basin?</strong> C) The Bantus.</p>
 <p><strong>5. The Maasai, Samburu, and Turkana communities belong to which specific sub-group of the Nilotes?</strong> C) Plains Nilotes.</p>
 <p><strong>12. The identification metal plate container that African men over the age of 16 were forced to wear around their necks by colonial laws was called:</strong> B) Kipande.</p>
 <p><strong>13. Which prominent woman leader organized the Giriama community at the coast to resist forced labor and colonial taxation?</strong> B) Mekatilili wa Menza.</p>
 <p><strong>14. Who was the outstanding spiritual and military leader of the Nandi resistance who was killed during a deceptive peace meeting by a British officer?</strong> B) Koitalel Arap Samoei.</p>
 <p><strong>15°. The group of six prominent Kenyan national leaders arrested in 1952 following the declaration of a State of Emergency are collectively known as the:</strong> C) Kapenguria Six.</p>
 <p><strong>16. Who was the supreme military commander and Field Marshal of the Mau Mau freedom fighters in the Aberdare forests?</strong> C) Dedan Kimathi.</p>
 <p><strong>17. On which historical date did Kenya officially attain internal self-governance (Madaraka)?</strong> B) 1st June 1963.</p>
 <p><strong>18. Which constitutional organ of the Government of Kenya is responsible for debating, amending, and enacting national legislation?</strong> C) Parliament.</p>
 <p><strong>19. How many counties were established in Kenya under the system of Devolution introduced by the 2010 Constitution?</strong> C) 47.</p>
 <p><strong>20. Who is the executive head responsible for running the administration and development projects of a County Government?</strong> B) The County Governor.</p>
 </div>
 </SubSection>

 <SubSection title="SECTION B: STRUCTURED QUESTIONS (40 Marks)">
 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', margin: '12px 0' }}>
 <p><strong>Question 41: Maps and Physical Features (8 Marks)</strong></p>
 <p>(a) State three primary elements that must be present on a standard map. Answer: Title, Key/Legend, Scale, Compass direction, Frame. (Any 3, 1 Mark each)</p>
 <p>(b) Identify the two main types of scales used by mapmakers. Answer: Linear Scale, Statement Scale, Representative Fraction (RF) Scale. (Any 2, 1 Mark each)</p>
 <p>(c) Name three examples of major inland water towers in Kenya. Answer: Mau Forest Complex, Aberdare Ranges, Mount Kenya, Mount Elgon, Cherangany Hills. (Any 3, 1 Mark each)</p>
 <p><strong>Question 42: Pre-Colonial History and Culture (8 Marks)</strong></p>
 <p>(a) Name the three main language groups that migrated into Kenya before the colonial era. Answer: The Bantus, The Nilotes, The Cushites. (1 Mark each)</p>
 <p>(b) Describe two political functions performed by a clan's Council of Elders. Answer: Settling land disputes, making community bylaws, conducting religious blessings/sacrifices, negotiating peace treaties. (Any 2, 1 Mark each)</p>
 <p>(c) Explain the economic relationship between agricultural communities and pastoralist communities before modern currency. Answer: Barter trade interdependence × pastoralists brought livestock products (meat, milk, hides) to exchange with agriculturalists for grains (millet, sorghum), yams, clay pots, and iron hoes. (3 Marks)</p>
 <p><strong>Question 43: Colonial Resistance and Independence Struggle (8 Marks)</strong></p>
 <p>(a) Outline two negative economic policies introduced by British colonial administrators. Answer: Land alienation, Forced labor, High taxation (Hut Tax and Poll Tax), The Kipande restrictions. (Any 2, 1 Mark each)</p>
 <p>(b) Explain why Field Marshal Dedan Kimathi chose guerrilla warfare tactics. Answer: The Mau Mau lacked advanced modern weaponry compared to the British army. Forest geography provided natural canopy camouflage against air spotters, and steep cliffs allowed ambush hit-and-run guerrilla warfare. (3 Marks)</p>
 <p>(c) List three historical values modern citizens can learn from Kenya's early freedom fighters. Answer: Patriotism/love for country, unity across communities, courage in the face of injustice, dedication to human freedom, selflessness. (Any 3, 1 Mark each)</p>
 </div>
 </SubSection>
 </Section>
 </div>
 );
}
