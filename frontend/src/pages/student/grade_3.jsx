import { useState } from 'react'

// ==================== MATHEMATICS ====================
const MATH_TOPICS = [
  {
    id: 1,
    title: "Place Value & Rounding",
    summary: "Numbers to 10,000, expanded form, skip counting, and rounding.",
    body: `These notes cover basic place value concepts: building and decomposing numbers (3–5 digits), writing numbers in normal or expanded form, counting by 100's, and rounding to the nearest 10, 100 or 1,000.

Place Value
Build a 3-digit number from the parts    200 + 70 + 1 = ___
Find the missing place value (3-digits)    200 + ___ + 1 = 271
Build a 4-digit number from the parts    4,000 + 200 + 70 + 1 = ___
Find the missing place value (4-digits)    ___ + 200 + 70 + 1 = 4,271
Build a 5-digit number from the parts    
Expanded form    2,000 + 300 + 20 + 7
Expanded notation    2×1,000 + 3×100 + 2×10 + 7×1
Expanded notation to standard form    2,327
Find a digit's place value    1,832 → 8 hundreds

Comparing & Ordering Numbers
Comparing numbers    8,765 > 927
Ordering numbers    145, 999, 3567, 4893

Skip Counting
Skip-count by 100    345, 445, 545 ...
Skip-count by 150, 200 and 250    150, 300, 450 ...

Rounding
Round to the nearest hundred, within 0–1,000    689 rounds to 700
Round to the nearest hundred, within 0–10,000    1,689 rounds to 1,700
Round to the nearest thousand, within 0–10,000    1,689 rounds to 2,000
Mixed rounding (10s, 100s)    1,689 rounds to 1,700
Mixed rounding (10s, 100s, 1,000s)    1,689 rounds to 2,000`
  },
  {
    id: 2,
    title: "Addition",
    summary: "Mental addition and multi-digit column addition for Grade 3.",
    body: `Our Grade 3 addition worksheets include both "mental addition problems" (solved in your head) and multi-digit column form addition questions giving practice in computational skills.

Mental Addition
Add 1 & 2-digit numbers    94 + 7 = ___
Add 1 & 2-digit numbers (missing addend)    94 + ___ = 103
Complete one hundred (missing addends)    ___ + 85 = 100
Add a 2-digit & two 1-digit numbers    4 + 2 + 17 = ___
Add 3 & 1-digit numbers    865 + 5 = ___

Whole Tens
Add whole tens to 2-digit numbers    20 + 39 = ___
Add whole tens to 2-digit numbers (missing addend)    20 + ___ = 59
Add two whole tens and two 1-digit numbers    70 + 10 + 8 + 6 = ___
Add whole tens (3 addends)    60 + 50 + 40 = ___
Add whole tens (4 addends)    60 + 50 + 40 + 30 = ___

Whole Hundreds
Add whole hundreds (2 addends)    300 + 200 = ___
Add whole hundreds (3 addends)    300 + 200 + 100 = ___
Add whole hundreds (missing addends)    ___ + 200 = 500
Add to complete whole thousands    7300 + ___ = 9000

Whole Thousands
Add whole thousands and hundreds    7000 + 300 = ___
Add whole thousands to a number    4,000 + 3,601 = ___

Column‑Form Addition
Add two 2-digit numbers, no carrying
  22
+ 23

Add two 2-digit numbers
  38
+ 27

Add two 3-digit numbers, no carrying
  123
+ 234

Add two 3-digit numbers
  216
+ 955

Add three 3-digit numbers
  342
+ 123
+ 456

Add four 3-digit numbers
  456
+ 123
+ 567
+ 890

Add two 4-digit numbers
  5,432
+ 1,543

Add three 4-digit numbers
  9,002
+ 1,004
+ 2,567

Add four 4-digit numbers
1,111
+ 2,222
+ 3,333
+ 4,444`
  },
  {
    id: 3,
    title: "Subtraction",
    summary: "Mental subtraction and column form subtraction up to 4-digit numbers.",
    body: `Our Grade 3 subtraction worksheets include both mental subtraction and column form subtraction.

Mental Subtraction
Subtract 1-digit from a 2-digit number    54 – 8 = __
Subtract 1-digit number from a 2-digit number (missing number)    54 – ___ = 46
Subtract whole tens from a 2-digit number    83 – 30 = __
Subtract whole tens from a 2-digit number (missing number)    83 – ___ = 53
Subtract whole tens from a 3-digit number    222 – 50 = __
Subtract whole tens from a 3-digit number (missing number)    ___ – 50 = 172
Subtract whole hundreds from a 3-digit number    899 – 800 = __
Subtract a 2-digit number from whole hundreds    300 – 77 = __
Subtract whole hundreds from whole hundreds    1,900 – 600 = __
Subtract whole hundreds from 4-digit numbers    5,962 – 600 = __
Subtract any whole ten number from 1,000    1,000 – 240 = __
Subtract a 3-digit number from any whole thousand    4,000 – 821 = __
Subtract a 3-digit number from any whole thousand (missing number)
4,000 – ___ = 3,179

Subtraction in Columns
Subtract 3-digit numbers
  872
– 542

Subtract 4-digit numbers
  5,122
– 2,014

Borrow over two zeros
  600
–  89

Borrow over three zeros
  3,000
–   131`
  },
  {
    id: 4,
    title: "Multiplication",
    summary: "Multiplication meaning, tables, multiplying by tens/hundreds, and column multiplication.",
    body: `Our Grade 3 multiplication worksheets start with the meaning of multiplication and follow up with lots of multiplication practice and the multiplication tables; exercises also include multiplying by whole tens and whole hundreds and some column form multiplication. Missing factor questions are also included.

Meaning of Multiplication
Multiplication sentences and arrays
Multiply with arrays – draw & multiply
Multiply using a number line

Multiplication Facts
Multiplication tables of 2 and 3    2 × 4 = ___
Multiplication tables of 5 and 10    5 × 3 = ___
Multiplication tables of 4 and 6    6 × 4 = ___
Multiplication tables of 7 and 8    8 × 5 = ___
Multiplication tables of 9 and 3    9 × 3 = ___
Multiplication tables of 7, 8, and 9    7 × 8 = ___
Tables 2‑5 practice
Tables 6‑9 practice
Tables 2‑10 practice
Tables 2‑12 practice
Tables (full) practice

Missing Factors
Multiplication tables 2‑10, missing factor    2 × __ = 20
Multiplication tables 2‑12, missing factor    __ × 12 = 36

Multiplying by Multiples of 10
Multiply 1-digit by whole tens    3 × 10 = ___
Multiply 1-digit by whole hundreds    4 × 100 = ___
Multiply whole tens by whole tens    10 × 50 = ___
Multiply whole tens, missing factor    80 × ___ = 6,400

Multiply in Columns
2‑digit by 1‑digit
  35
×   8

3‑digit by 1‑digit
  234
×    4

4‑digit by 1‑digit
  1,652
×      7`
  },
  {
    id: 5,
    title: "Division",
    summary: "Division facts, mental division, dividing by tens and hundreds, long division introduction.",
    body: `Our Grade 3 division worksheets include simple division to help kids with division facts and mental division skills, and an introduction to long division including simple division with remainder questions. Practice dividing by tens and hundreds is also emphasized.

Meaning of Division
Division sentences
Dividing into equal groups

Division Facts
Division by 2 or 3    9 ÷ 3 = ___
Division by 4 or 5    10 ÷ 5 = ___
Division by 6 or 7    12 ÷ 6 = ___
Division by 8 or 9    16 ÷ 8 = ___
Division facts practice (tables 1‑10)    54 ÷ 9 = ___
Division facts practice (tables 1‑12)    33 ÷ 11 = ___

Missing Dividend or Divisor
Basic facts 1‑10    ___ ÷ 5 = 3
Basic facts 1‑12    ___ ÷ 12 = 5

Fact Families
Multiplication and division fact families

Divide by Tens and Hundreds
Divide by 10    340 ÷ 10 = ___
Divide by 100    4,400 ÷ 100 = ___
Divide by whole tens    5,400 ÷ 90 = ___
Divide by whole hundreds    5,600 ÷ 800 = ___

Divide 3 or 4-digit numbers by 1‑digit numbers    2,800 ÷ 4 = ___
Division with remainder within 1‑100, based on basic facts    51 ÷ 8 = ___

Long Division
Division facts practice
Division with remainder, within 0‑100`
  },
  {
    id: 6,
    title: "Roman Numerals up to 50",
    summary: "Writing Roman numerals and converting between Roman and normal numbers.",
    body: `Roman Numerals
Write numbers 1‑50 as Roman Numerals    25 = XXV
Write Roman Numerals as normal numbers    XXV = 25
Addition and subtraction with Roman Numerals`
  },
  {
    id: 7,
    title: "Fractions & Decimals",
    summary: "Identifying fractions, equivalent fractions, comparing, simplifying, adding/subtracting fractions and decimals.",
    body: `Free fraction and decimals worksheets for Grade 3. Practice exercises on introductory fraction and decimal concepts, including identifying fractions, equivalent fractions, simplifying fractions and basic decimal addition and subtraction.

Identifying Fractions
Identify fractions – colour in the fraction
Identify fractions – write the fraction
Fractional part of a set

Equivalent Fractions
Equivalent fractions – colour in the fraction
Identify equivalent fractions
Equivalent fractions (numerators missing)    __ /3 = 20/30
Equivalent fractions (harder version)    6/8 = __ /56
Equivalent fractions (numerators or denominators missing)    2/3 = 10/__
3 equivalent fractions    1/3 = 3/__ = 6/__

Comparing Fractions
Compare 2 fractions, same denominator (with pie charts)
Compare 2 fractions, different denominators (with pie charts)
Compare 2 proper or improper fractions (with pie charts)
Compare mixed numbers and fractions (with pie charts)
Comparing fractions (like denominators)    4/5 > 3/5
Comparing fractions (unlike denominators)    9/10 > 1/2
Comparing fractions (improper fractions)    3/2 > 3/4
Comparing fractions (mixed numbers)    1 1/2 < 3 1/6

Simplifying Fractions
Simplifying fractions (proper fractions)    20/24 = ___
Simplifying fractions (proper and improper fractions)    26/10 = ___

Adding & Subtracting Fractions
Adding like fractions – denominators from 2‑12    1/6 + 2/6 = ___
Adding mixed numbers (like denominators)    3 1/6 + 4 2/6 = ___
Completing whole numbers (improper fractions)    1/2 + ___ = 2
Completing whole numbers (mixed numbers)    3 1/3 + ____ = 4
Subtracting like fractions (denominators 2‑12)    3/10 – 1/10 = ___
Subtracting improper fractions (like denominators)    8/6 – 5/6 = ___
Subtracting a fraction from whole number    6 – 2/3 = ___
Subtracting a fraction from a mixed number    2 4/5 – 1/5 = ___
Subtract a mixed number from a whole number    10 – ___ = 5 3/4
Subtract mixed numbers (like denominators)    8 3/7 – 3 6/7 = ___

Converting Fractions to / from Mixed Numbers
Mixed numbers to fractions    9 1/5 = ___
Fractions to mixed numbers    46/5 = ___

Converting Fractions to / from Decimals
Decimals to mixed numbers    7.3 = ___
Fractions to decimals    1/10 = ___
Mixed numbers to decimals    1 1/10 = ___

Comparing and Ordering Decimals
Comparing decimals    0.9 < 1.2
Ordering decimals    9.3, 42.7, 89, 706

Decimal Addition
1 decimal digit – easy    0.8 + 1.8 = ___
Add in columns (1 decimal digit)
  0.8
+ 1.8

Decimal Subtraction
Subtract 1‑digit decimals from whole numbers    8 – 0.8 = ___
As above with missing minuend/subtrahend    10 – ___ = 9.1
Subtract 1‑digit decimals in columns
  50.0
–   3.8`
  },
  {
    id: 8,
    title: "Geometry",
    summary: "2‑D shapes, lines, angles, area & perimeter, congruency and symmetry.",
    body: `Our Grade 3 geometry worksheets review two‑dimensional shapes, particularly circles, triangles, quadrilaterals and polygons. We cover the classification of lines and angles. The areas and perimeters of rectangular shapes are reviewed, as are the concepts of congruency and symmetry.

Basic Properties of 2‑D Shapes
Identifying quadrilaterals – squares, rectangles, trapezoids, parallelograms & rhombuses
Properties of quadrilaterals – a shape with 4 sides & 4 angles ...
Parallelograms – identify quadrilaterals with 2 pairs of parallel sides

Triangles
Classify triangles by sides and angles

Circles
Identify and label the parts of a circle

Polygons
Identify regular and irregular polygons
Types of polygons – classify and draw polygons

Lines and Angles
Lines, segments and rays – identify lines, segments and rays
Right angles – identify right angles and compare angles
Parallel and perpendicular lines – identify parallel and perpendicular lines
Classify angles – straight, right, acute or obtuse
Protractors – use a protractor to draw and measure angles
Measure angles – measure and classify angles
Lines, segments, rays and angles – identify and draw

Area and Perimeters
Perimeters using a rectangular grid – find the perimeter of rectangular shapes on a grid
Areas using rectangular grids – find the area of rectangles on a grid
Perimeters of irregular shapes – find the perimeters of irregular shapes
Perimeters of rectangles – find the rectangle's perimeter
Area of rectangles – calculate the area of rectangles
Area and perimeters of rectangles – calculate the area and perimeters of rectangles

Congruency and Symmetry of 2‑D Shapes
Congruent shapes – identify shapes with the same size and shape
Lines of symmetry – identify and draw lines of symmetry
Symmetrical shapes – draw the other half of an image to form a symmetrical shape`
  }
]

// ==================== ENGLISH ====================
const ENGLISH_TOPICS = [
  {
    id: 'unit1a',
    title: 'Part A – Transitive and Intransitive Verbs',
    summary: 'Learn the difference between verbs that need an object and those that don’t.',
    body: `Grammar Explanation
Preview
Napoleon Bonaparte was one of the greatest generals
of all time. He helped France conquer much of
Europe. However, many other countries hated him
because of his power. Eventually, they were able to
defeat Napoleon. Afterward, Napoleon was sent to
the island of Elba where he died without any power.

Transitive verbs require a direct object for their meaning to be complete.
Subject Transitive Verb Direct Object Meaning
Jenny erased. incomplete
Jenny erased the whiteboard. complete
Gary told. incomplete
Gary told a secret. complete

Some verbs can be transitive or intransitive depending on the context in the sentence.
Subject Verb Direct Object Adverbial Transitive/Intransitive
Doug moved the sofa. transitive
Doug moved to Singapore. intransitive
Kelly left her bag at home. transitive
Kelly left at three o’clock. intransitive

Intransitive verbs do NOT require a direct object for their meaning to be complete.
Subject Intransitive Verb Direct Object Adverbial Meaning
Wendy slept. complete
Peter ran to school. complete

Practice 1
Exercise 1 Circle I if the sentence has an intransitive verb or T if it has a
transitive verb.
1. We ate it. I T
2. I am going to drink a huge bottle of soda. I T
3. The boy finished his work at school. I T
4. The mountain climber fell down the mountain. I T
5. My mother is reading a book. I T

Exercise 2 Put a check (✓) next to the sentences that are complete.
1. ____ My friend and I broke.
2. ____ We ran to the park.
3. ____ She threw.
4. ____ She cried.
5. ____ I helped.

Exercise 3 Connect the sentence parts from the two columns.
If the first half is complete, connect it to a blank space.
1. My friend threw • • the ball to me.
2. I lied • • .
3. My brother was laughing at • • the monkey in a suit.
4. The teacher always worries • • .
5. The strong man lifted • • the giant stone over his head.

Practice 2
Exercise 4 Listen to the dialog and answer the questions. [Track 2]
1. What kind of game are they talking about? ____________________________
2. What couldn’t the batter do? _____________________________________
3. What did the outfielder do? ______________________________________
4. Did they enjoy the game? _______________________________________

Exercise 5 Look at the pictures. Write an appropriate sentence using either a
transitive or intransitive verb. [Pictures not shown]

Exercise 6 Write sentences with the verbs given. Write one sentence with
a transitive form and the other with an intransitive form.
1. to move (Transitive) _____________________________________________
   (Intransitive) _________________________________________________
2. to drive (Transitive) _____________________________________________
   (Intransitive) _________________________________________________
3. to draw (Transitive) _____________________________________________
   (Intransitive) _________________________________________________
4. to eat (Transitive) ______________________________________________
   (Intransitive) _________________________________________________
5. to read (Transitive) _____________________________________________
   (Intransitive) _________________________________________________

Grammar in Use
Exercise 7 Read about Leslie’s last vacation. Decide if each verb is transitive or
intransitive. Circle T for transitive or I for intransitive. If the verb is
transitive, write an appropriate direct object on the line.
1. Leslie went to the beach last winter. T F
2. Leslie liked the food she ate. T F
3. People at the beach sold many different foods. T F
4. She spent a lot of money on her vacation. T F

Exercise 8 Circle T for true or F for false.
Last summer, I went to the beach. It was great. The sea was so beautiful,
and I sat 1. (T / I) ______________ in the sun all day. I read
2. (T / I) ______________. I also went swimming
3. (T / I) ______________. It was so much
fun, but I drank 4. (T / I) ______________
and became sick. The food was delicious though.
I ate 5. (T / I) ______________. There was
so much variety. Finally, it was great because
everything was so cheap. I didn’t spend
6. (T / I) ______________ while there.
It was a wonderful vacation.`
  },
  {
    id: 'unit1b',
    title: 'Part B – Progressive and Non-progressive (Stative) Verbs',
    summary: 'Verbs that describe states vs. actions in progress.',
    body: `Preview
Dear Mr. Simpson,
Thank you for letting us use your cabin for our
vacation. The cabin was beautiful. I can’t imagine
a nicer place. It looks just like a postcard. I feel so
lucky that you trusted us enough to let us stay there.
We were looking for the cabin in the wrong valley
before we realized our mistake. We all loved skiing
on the mountain and appreciate your kindness.
Sincerely,
Emily

Grammar Explanation
Progressive verbs describe an action occurring over a period of time. They are formed with the verb
be + the present participle (-ing form).
Subject Be Present Participle
I am reading the newspaper.
Angela was washing the dishes.
They had been running a marathon.

Non-progressive (Stative) verbs do not describe actions. Instead, they describe a state or condition. The
state or condition can occur over a period of time. They are NOT formed with be + the present participle.
Subject Stative Verb
Diana loves Casey.
Pizza tastes good.
They understand Spanish.

Common non-progressive (stative) verbs: appreciate, believe, dislike, exist, fear, hate, know, like, love,
need, prefer, realize, resemble, seem, sound, understand

Many verbs can be progressive or non-progressive (stative) depending on the context of the sentence.
Subject Verb Progressive/Stative
John thinks soccer is fun. stative
Kevin is thinking about soccer. progressive
Shelley feels sick. stative
Lisa is feeling the rabbit’s fur. progressive

Common progressive and non-progressive verbs: appear, cost, feel, forget, have, hear, imagine, include,
look, measure, remember, see, smell, taste, think, want, weigh

Practice 1
Exercise 1 Circle the stative verb in each group.
1. a. sleep b. know c. dig d. show
2. a. sound b. study c. read d. work
3. a. meet b. scratch c. type d. believe
4. a. cut b. fear c. sleep d. spend
5. a. watch b. swim c. appreciate d. live

Exercise 2 Complete the sentences with the correct words from the box.
(see, love, was rolling, has been lying, sounds)
1. The dog __________________ in the grass when it started raining.
2. The boys __________________ playing soccer.
3. Being a policeman __________________ like a great job.
4. She didn’t __________________ the movie yesterday because she was studying.
5. Because he is sick, Mark __________________ in bed all day.

Practice 2
Exercise 3 Complete the sentences with the correct form of the verb given.
1. (take) We ________________ my car to the mechanic to get it fixed now.
2. (cost) Though I am enjoying my vacation, it ________________ much more
than I thought it would.
3. (want) My mother doesn’t ________________ me to be lazy in school.
4. (see) Jack and Jill ________________ each other for three weeks. Their first
date was at the end of last month.
5. (weigh) At the moment, the butcher ________________ the steak Jack wants
to buy.

Exercise 4 Listen and circle T for true or F for false. [Track 3]
1. Mark is running for class president. T F
2. Mark likes the school lunch. T F
3. Mark wants new basketballs for gym class. T F
4. Mark doesn’t want new school uniforms. T F
5. Mark wants many changes at school. T F

Exercise 5 Match each statement to the correct picture.
a. The giraffe is eating leaves.
b. The man forgot where he put his keys.
c. The woman prefers the dark shirt, but the man prefers the light one.
d. He is weighing himself on the scale.
e. The woman resembles her sister.
1. ________ 2. ________ 3. ________ 4. ________ 5. ________

Exercise 6 Finish the sentences with your own information.
1. I imagine that next year __________________________________________
   I am imagining ________________________________________________
2. My father thinks _______________________________________________
   My father is thinking ____________________________________________
3. Skunks smell _________________________________________________
   The skunks are smelling __________________________________________
4. The fluffy little kitten looks ________________________________________
   The fluffy little kitten is looking _____________________________________

Grammar in Use
Exercise 7 Complete the sentences with the correct form of the verbs given.
I (remember) 1. _____________ my first day of school very well. I (walk)
2. _____________ to my classroom when I
tripped and fell. I (feel) 3. _____________
really embarrassed. It was OK because no one
(watch) 4. _____________. I got up and went to
my class. My teacher was so great, that by the end
of the day I wasn’t (think) 5. _____________
about it anymore. Everything was fine.

Exercise 8 Write about your first day of school. Include how you felt and what
you were thinking.
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________`
  },
  {
    id: 'unit1c',
    title: 'Part C – Phrasal Verbs',
    summary: 'Verbs combined with prepositions that have a new meaning.',
    body: `Preview
Virgo: This week you should make up with a
friend who you have fallen out of favor
with. You will then be able to count on
this friend in the future, and this will
help to keep your long-term goals from
falling through.

Grammar Explanation
Phrasal verbs are verbs that combine with a preposition to create a meaning that is different from the
two words taken separately. With some phrasal verbs, the object must be placed after the preposition.
Verb Preposition Meaning
Sherri came across someone’s wallet on the street. found by chance
Did Craig drop by his friend’s house? visit
We didn’t get on the bus. enter (a vehicle)
Other common non-separable phrasal verbs: check in, drop out (of), get along (with), get off, get in,
grow up, look after, take after, run into

With some phrasal verbs, the object can be placed between the verb and the preposition or after the
preposition.
Verb Object Preposition Meaning
Barney figured the answer out. found/understood
Did she pick a candy out? choose
He didn’t turn his iPod off. stop
Other common separable phrasal verbs: call off, cheer up, drop off, find out, give up, hand in, look up,
make up, put off, take over, turn on, turn down

Note that not every verb + preposition is a phrasal verb. Phrasal verbs are only those combinations that
have a separate meaning.
Verb Preposition Phrasal verb/Not
The ball dropped by the big tree. not
We dropped by the store for some milk. phrasal verb
She looked into a trip to Hawaii. phrasal verb
Charlie looked into the fridge to see if there was any milk. not

Practice 1
Exercise 1 Match the phrasal verb with its definition.
1. ___ After three years, my friend dropped out of school. a. to meet by accident
2. ___ It was strange to run into my old boss at school. b. to submit / to give
3. ___ We always hand in our assignments on time. c. to take care of
4. ___ My brother cheered me up after my best friend moved away. d. to quit doing something
5. ___ The nurse looks after patients at the hospital. e. to make happy

Exercise 2 Complete the sentences with the correct phrasal verbs from the box.
(take after, figure out, pick up, call off, get into)
1. After watching the rain for three hours, they finally decided to _______________
the baseball game.
2. Mark cannot _______________ what is wrong with his computer.
3. At first I didn’t like this book, but now I am really starting to ______________ it.
4. Jenny’s boyfriend is coming to ______________ her ______________ at seven
o’clock.
5. My uncle says that I am really starting to _______________ my father, but I
disagree.

Practice 2
Exercise 3 Underline the mistakes in the sentences. Write the correct words on the
line. If there is no mistake, write OK on the line.
1. Mark forgot his homework, so he is going to hand in it late. ________
2. My brother always seems to be able to get around the rules. ________
3. I was really disappointed when I found up who the killer in the movie was. ______
4. When my father first arrived at the hotel to check out, the lady was rude to him.
   When he left to check in, she was much friendlier. ______ _______
5. My friend is so lazy. She always puts off her homework until late at night. _______

Exercise 4 Listen to the interview. Then fill in the blanks with the correct
phrasal verb. [Track 4]
A: Let’s 1. ______________ with our reporter standing by with David Best.
B: Thanks, Tom. I am here with David Best. David, many people say that your team
2. ______________ the team of two years ago. Is that true?
C: Well, that team two years ago was great. We all 3. ______________ to them.
Hopefully, today we can work hard and 4. ______________.
B: You 5. ______________ in this area, and this is your first game in this stadium.
How does it feel?
C: It feels great! I couldn’t 6. ______________ the chance to play for my hometown.

Exercise 5 Match each sentence to the correct picture.
a. The building blew up. b. The man is asking the woman out.
c. The woman looks after her son. d. They pulled over to check the map.
1. __________ 2. __________ 3. __________ 4. __________

Exercise 6 Complete the sentences with a phrasal verb from the box.
(made up, get along with, dropped out, gave up)
1. Her sister doesn’t _________________ her boyfriend. They are always fighting.
2. After years of trying to become a doctor, Mr. James finally _________________
and _________________ of medical school. Now he works in a bank.
3. Mark finally admitted that his story was not true. He had _________________ it
_________________ to impress his friends.

Grammar in Use
Exercise 7 Unscramble the phrases or sentences to reveal the instructions for the
assignment.
Students,
Your final project for the year is coming up, which means that you will have
a lot of work. If you do not know enough about your topic, 1. (it / up / must
/ you / look) ______________________ and 2. (about / it. / out / find /
more) _____________________. 3. (in / must / check / You / me / with)
______________________ every week.
4. (late. / Projects / in / cannot / turned / be)
______________________________
5. (work / not / Please / do / off. / this / put)
______________________________ If you
have any questions, please come to me. Good luck.
Mr. Craven

Exercise 8 Answer questions about the final project.
1. What should the students do if they do not know enough about the topic?
→ _____________________________________________________________________
2. What must students do every week?
→ _____________________________________________________________________
3. Will late projects be accepted?
→ _____________________________________________________________________
4. What does the teacher ask the students to do at the end?
→ _____________________________________________________________________`
  },
  {
    id: 'unit1d',
    title: 'Part D – Review',
    summary: 'Practice conversations, sentence correction, and phrasal verb review.',
    body: `Exercise 1 Practice the conversations with a partner. Change roles for each conversation.
A: Hi, do you want to get together later?  B: Well, I am eating dinner and I need to do homework.
A: OK, well I will come by later to see how you are doing.  B: OK, talk to you soon.

(Conversation starters: get together, catch up, hook up)
(Suggested responses: eat dinner / do homework, play piano / rest, watch TV / walk the dog)
(Alternatives: come by, stop by, drop in)

Exercise 2 Connect sentence parts from the two columns to make complete
sentences.
1. It sounds ●● stealing the car when the police arrived.
2. The thief was ●● out which book I want to buy.
3. I can’t seem to pick ●● .
4. The dog ate ●● like you are really enjoying your class.
5. My mother has been ●● cooking all afternoon.

Exercise 3 Complete the phrasal verbs with the correct preposition.
1. Several of my friends work __________ in the gym near my apartment.
2. We were lucky to run __________ Kevin’s father. He gave us a ride home.
3. We are late, so hurry up and get __________ the car!
4. After a long, angry argument, Sally and her friend finally made __________.
5. Let’s drop __________ the supermarket to pick __________ some ice cream.

Exercise 4 Fix the mistake in each sentence. Then number the pictures 1--4.
1. It are swimming in the ocean. ___________
2. He ran onto his friend on the street. ___________
3. The man is loving his wife. ___________
4. Cindy is standing in to her sister. ___________

Exercise 5 Unscramble the sentences.
1. for / months. / We / been / six / have / traveling
→ _____________________________________________________________________
2. party / parents / My / called / the / off.
→ _____________________________________________________________________
3. will / be / to / It / on / finish / difficult / time.
→ _____________________________________________________________________
4. away / threw / garbage. / We / the
→ _____________________________________________________________________

Exercise 6 Complete the sentences with information about yourself.
1. My family is thinking ___________________________________________
2. I always check in ______________________________________________
3. My friends and I always run into ____________________________________`
  }
]

// ==================== KISWAHILI (CLEANED - NO REFERENCES) ====================
const KISWAHILI_TOPICS = [
  {
    id: 'term1-week1',
    title: 'Juma la Kwanza (Muhula wa Kwanza)',
    summary: 'Maamkizi, sauti DH/TH, herufi kubwa, viashiria, msamiati wa nyumbani.',
    body: `Kusikiliza na kuongea
• Maamkizi • U hali gani • Samahani • Nashukuru
• Umeamkaje • Pole
• Kwaheri • Umeshindaje • Masalkheri • Sabalkheri • Alamsiki • Binuru

Kusoma
Sauti DH na TH
• Dhahabu
• Adhabu
• Fedha • Maradhi • Nadhifu
• Thamani
• Methali • Thelathini • Hadithi • Theluji • Thurea

Kuandika
Mwandiko kwa herufi kubwa • Majina ya watu
• Majina ya mji • Majina ya milima
• Miezi • Siku za juma • Majina ya nchi

Sarufi
Viashiria • Huyu hawa • Huu hii
GREDI YA TATU
MUHULA WA KWANZA
________
• Hiki hivi • Yule wale • Kile vile
• Ule ile • Ule zile • Lile yale

Msamiati: nyumbani
• Kochi • Rafu
• Stuli • Kigoda • Seredani • Sebuleni • Bafu
• Msalani • Pazia
• Zulia • Panka • Bilula • Jirafu
• Jokofu
• Karo
• Stoo
• Shubaka`
  },
  {
    id: 'term1-week2',
    title: 'Juma la Pili (Muhula wa Kwanza)',
    summary: 'Sauti NJW/MBW, imla, vimilikishi, msamiati wa shuleni.',
    body: `Kusikiliza na kuongea
Sauti NJW na MBW
• Mgonjwa • Kuchinjwa • Kuchanjwa • Kuvunjwa • Punjwe • Mbweu
• Kupambwa
• Mbweha • Masubwi • Kidibwi • Lubwi • Ulibwende • Mbwisho
• Mbwiji

Kusoma
Panzi na kunguru
________

Kuandika
Imla: sauti njw na mbw
Kuandika maneno na sentensi yenye sauti za njw na mbw

Sarufi
Vimilikishi
Angu –ko –ke
Etu –nu – o

Msamiati: shuleni
• Karani • Bustani • Tarishi • Risiti • Majilisi • Soka • Mkutubi • Uga
• Mwalimu mkuu
• Gwaride • Bendera • Chaki • Wino
• Kalenda • Rejesta/ masijala • Kwata`
  },
  {
    id: 'term1-week3',
    title: 'Juma la Tatu (Muhula wa Kwanza)',
    summary: 'Mchezo wa kuigiza (wataalamu), ufahamu shambani, wakati -li- na kukanusha, msamiati shambani.',
    body: `JUMA LA TATU
Kusikiliza na kuongea: mchezo wa kuigiza
Daktari wa mifugo
Daktari wa miti
Mtaalamu wa kilimo
Mtunza mazingira
________
Hakimu
Vifijo/ vigelegele

Kusoma
• Ufahamu
• Shambani • Kishuka • Kinyesi • Bwawa • Mizinga
• Mchicha • Maziwa mala • Wimbi • Karai • Msalani • Migomba

Kuandika
Sentensi zenye kikomo na kiulizi

Sarufi
Wakati li na kukanusha

Msamiati
Shambani • Mimea • Mbolea • Mbegu
• Uongo
• Mgomba • Mhindi • Maboga
• Miche • Maharagwe • Kunde • Viazi vitamu
• Reki • Viazi-vikuu
• Mnyanya
________
• Toroli • Muwa`
  },
  {
    id: 'term1-week4',
    title: 'Juma la Nne (Muhula wa Kwanza)',
    summary: 'Vitendawili, sauti j/nj, kuandika maneno, kukanusha wakati -na-, msamiati sokoni.',
    body: `JUMA LA NNE
Kusikiliza na kuongea
Vitendawili

Kusoma
Sauti j na nj • Jamvi • Jani • Jua • Moja • Jambazi
• Kuja • Kiranja • Unja • Njugu
• Kunjua • Ujanja • Kunja

Kuandika
• Chura • Buchari • Bustani • Chiriku
• Udondo
• Ubongo
• Shati • Sita
• Kalamu
• Mbole • Mbegu
• Toroli • Mmea • Muwa • Kigoda • Stuli

Sarufi
________
Kukanusha wakati na

Msamiati
Sokoni • Kichinjio
• Buchari • Mchuuzi • Mizani • Mwuzaji • Mnunuzi
• Baiskeli • Kibanda • Kinu
• Mteja • Ratili • Rukwama`
  },
  {
    id: 'term1-week5',
    title: 'Juma la Tano (Muhula wa Kwanza)',
    summary: 'Methali, sauti s/z, konsonanti, kukanusha wakati -ta-, nyakati za siku.',
    body: `JUMA LA TANO
Kusikiliza na kuongea
Methali

Kusoma
Sauti s na z • Sukari • Pesa • Msasi • Pasi • Saa
• Zulia • Meza • Mbuzi • Mzazi • Zawadi

Kuandika
Konsonanti • B • Ch • D
________
• Dh
• F
• G
• H
• J • L
• M
• N
• Ng’ • Ny
• P
• R
• S
• Sh
• T
• Th
• V
• W
• Y
• Z

Sarufi
Kukanusha wakati –ta

Msamiati
Nyakati za siku
• Alfajiri • Alasiri • Adhuhuri • Macweo
• Asubuhi
• Magharibi • Jioni • Usiku
• Macheo`
  },
  {
    id: 'term1-week6',
    title: 'Juma la Sita (Muhula wa Kwanza)',
    summary: 'Semi (kupiga...), alama ya mshangao, ufahamu (kabanda), kukanusha -me-, saa.',
    body: `JUMA LA SITA
Kusikiliza na kuongea
Semi• Kupiga domo
• Kupiga pasi • Kupiga kelele • Kupiga miayo
• Kupiga hodi • Kupiga chafya
________

Kuandika
Kuakifisha !
Alama ya hisi/ mshangao
1. Lo! Nimechomwa na pasi!
2. Jamani nafa!
3. Kumbe wewe ni mwizi!

Kusoma
Ufahamu (kabanda) • Kipindupindu
• Tafunatafuna • Mwadhibu
• Kuiba
• Maradhi • Upele • Ruhusa

Sarufi
Kukanusha wakati –me

Msamiati
Saa• Nusu
• Robo
• Kasorobo
• Kamili`
  },
  {
    id: 'term1-week7',
    title: 'Juma la Saba (Muhula wa Kwanza)',
    summary: 'Haki za watoto, ufahamu (hamali...), sauti ng/ng\', vivumishi vya sifa (-zuri), sehemu za mwili.',
    body: `JUMA LA SABA
Kusikiliza na kuongea
Haki za watoto
________
• Runinga • Redio
• Magazeti • Mavazi • Bunge • Viongozi • Busara
• Matibabu
• Kunyanyaswa • Kuteswa • Afya • Asibakwe • Wahuni

Kusoma
Ufahamu
• Kusoma na kujibu maswali • Hamali • Matambara • Vichakani • Rukwama
• Subiri • Kutia nguvuni • Jela • Mkokoteni

Kuandika
Sauti ng na ng’ • Ngano
• Mbunge • Mbingu
• Danganya • Shilingi • Ng’ambo
• Ng’aa • Ng’ara • Mbun’ge • Ng’ombe • Ng’amua

Sarufi
Vivumishi vya sifa: zuri, baya
Vivumishi- zuri na ngeli sote
________

Msamiati
Sehemu za mwili • Kiuno
• Chavu
• Kiganja • Kisigino
• Kiwiko
• Kisugudi • Muundi • Majina ya vidole`
  },
  {
    id: 'term1-week8',
    title: 'Juma la Nane (Muhula wa Kwanza)',
    summary: 'Shairi (usafi), ufahamu (ndugu watatu), sauti p/b, viulizi -nani?/-gani?, rangi.',
    body: `JUMA LA NANE
Kusikiliza na kuongea
Shairi: usafi • Maradhi • Maafa • Piga mswaki • Nzi
• Kunawa • Kuoga • Marashi • Kombamwiko

Kusoma
Ufahamu: ndugu watatu
• Kustawi • Nchi • Kijani • Mafuriko
• Jangwa • Teketea • Hewa

Kuandika
Maneno ya sauti p na b
________
• Papa • Papai • Pasi • Punda • Paa
• Bata • Baa • Sapa • Panda • Baba • Saba

Sarufi
Viulizi nani? Na gani?
Jina lako nani?

Msamiati
Rangi • Manjano
• Samawati • Hudhurungi
• Machungwa • Nili • Urunjuwani`
  },
  {
    id: 'term1-week9',
    title: 'Juma la Tisa (Muhula wa Kwanza)',
    summary: 'Mchezo wa kuigiza (nani hana ukimwi?), ufahamu (ajali barabarani), vitate, vinyume vya vitenzi, wanyama wa majini.',
    body: `JUMA LA TISA
Kusikiliza na kuongea
Mchezo wa kuigiza: nani hana ukimwi?
Waigize mchezo
________

Kusoma
Ufahamu: ajali barabarani • Ajali • Dereva • Walevi • Polisi • Miraa
• Mihadarati • Pombe • Utingo
• Mashimo ya barabara

Kuandika
Vitate• Daidi kaidi • Mkuu mguu
• Taka taga • Piga pika • Kumi gumi
• Gamba kamba • Oga oka • Genge kenge • Koma goma • Kawa gawa

Sarufi
Vinyume vya vitenzi • Fumba fumbua • Pika pakua • Umefungwa umefunguliwa • Waka zima

Msamiati
Wanyama wa majini • Pweza • Kaa
________
• Nguru
• Nyangumi • Ngwena • Kiboko
• Papa
• Chura • Mkunga • Dagaa • Kasa • Kamba`
  },
  {
    id: 'term1-week10',
    title: 'Juma la Kumi (Muhula wa Kwanza)',
    summary: 'Vitendawili vya wanyama, ufahamu (jamii), mtungo/kujaza pengo, -a unganifu, wanyama pori.',
    body: `JUMA LA KUMI
Kusikiliza na kuongea
Vitendawili vya wanyama
Mlima unaotembea: ndovu
Mwanangu anatembea kwa tombo: nyoka
Hujilinda bila silaha: nungunungu

Kusoma
Ufahamu
• Jamii • Vinara • Kataa kata kata • Zirai
• Pangoni • Punde si punde • Kulia-kushoto
• Kununa kutabasamu

Kuandika
Mtungo
Kujaza pengo
________

Sarufi
A unganifu
Kutumia “a” unganifu na ngeli tofauti • Cha, vya • Wa, ya • La, ya • Wa, za • Ya,za

Msamiati
Wanyama pori • Samba • Ndovu
• Twiga • Fisi • Nyani • Loma
• Ngiri • Chui • Duma • Nungunungu
• Kicheche • Pundamilia`
  },
  {
    id: 'insha',
    title: 'INSHA (Compositions)',
    summary: 'Miongozo ya insha: Mimi, Mama Yangu, Shule Yetu, Darasa Letu, Rafiki Yangu, Mwalimu Wangu, Umuhimu wa Miti.',
    body: `INSHA
MIMI
1. Vidokezo
2. Jina langu
3. Jinsia yangu
• Kike • Kiume
4. Umbo lako
• Unene • Uembamba • Urefu
• Ufupi
5. Rangi ya ngozi yako
• Maji ya kunde • Mweusi tititi
6. Umri wako
7. Unaishi wapi
8. Unasoma shule gani
9. Darasa gani
10. Marafiki
11. Unapenda • Kula nini • Kunywa nini • Kuvaa nini
12. Hupendi • Kula nini • Kunywa nini • Kuvaa nini
13. Unampenda mwalimu yupi
14. Unapenda somo gani
15. Unapenda mchezo upi
16. Unapenda kutazama kipindi gani
17. Ungetaka kuwa nani
18. Hitimisho
________
MAMA YANGU
• Mama ni nanio
• Jina lake • Umri • Mrefu/ mfupi • Mnene au mwembamba • Rangi ya ngozi yake • Nywele zake • Anaishi wapi • Nguo na viatu
• Anafanya kazi gani • Jina la mume • Watoto wangapi • Anapenda kupika nini • Akipata pesa hufanya nini • Vyakula • Vinywaji • Matunda • Akiwa nyumbani • Hapendi • Huenda kumsha mungu wapi? Lini? • Ni hodari katika nini • Kwa nini unampenda • Hitimisho

SHULE YETU
• Shule ni wapi
• Jina la shule
• Iko kijiji kipi
• Iko kaunti gani
• Iko karibu na kiwanda kipi
• Iko karibu na barabara gani
• Ina wanafunzi wa
• bweni
• Kutwa
• Ina wanafunzi wapi
• Wavulana
________
• Wasichana
• Wanafunzi na walimu ni wangapi
• Imejengwa kwa kutumia nini
• Ina bustani la nini
• Ua la shule ni la nini
• Mabasi mangapi na magari mandogo mangapi
• Mwalimu mkuu ni nani
• Imeanzia darasa lipi hadi lipi
• Ina mijengo kama
• Mabwalo
• Ofisi
• Majilisi
• Mabweni
• Ina wafanyikazi kama
• Wapishi
• Walimu
• Tarishi
• Karani
• Mnakula na kunywa nini shuleni
• Konde
• Wali
• Sima
• Uji
• Chai
• Maziwa
• Mnapelekwa ziara wapi
• Wanafunzi hutunzwa nini wakifanya bidii
• Inaongoza katika nini
• Michezo
• Nyimbo
• Masomo
• Sare za shule ni rangi gani
• Walimu wanafunza vipi
• Je, mnapita mtihani au la
• Kwa nini unapenda shule yenu?
________
DARASA LETU
• Darasa ni nini
• Darasa lako ni gani
• Limejengwa namna gani
• Ukuta wa mawe
• Paa la mabati
• Sakafu la saruji
• Milango ya chuma/ mbao
• Madirisha
• Lina wanafunzi wangapi
• Wasichana
• Wavulana
• Jina la mwalimu wa darasa/ anasomesha somo gani
• Vitu vipi vinapatikana darasani
• Mnasoma masomo yapi
• Mnafanya vipi katika mitihani
• Limezungukwa na nini
• Bustani la maua
• Ua la umeme
• Madarasa
• Limekaribia nini
• Nje ya darasa kuna nini
• Bwalo
• Maua
• Nyasi
• Ukutani kuna nini
• Picha
• Michoro
• Maumbo tofauti
• Chati
• Kwa nini unalipenda darasa lako?

RAFIKI YANGU
Jina lake
Umri wake
Jinsia
________
Umbo- mrefu/ mfupi/ mwembamba/ mnene
Rangi ya ngozi yake
Nyeusi, maji ya kunde
Anaishi: kaunti, mjini, mtaa
Jina la wazazi wake, dada, kaka
Anasoma shule gani, darasa, hufanya vipi darasani
Anapenda somo lipi zaidi
Mwalimu wake ni
Anapenda kucheza mchezo upi
Anapenda kutazama kipindi kipi
Anapenda kula na kunywa nini
Hapendi nini
Wakati wa likizo hufanya nini
Huwasaidia wazazi wake kufanya nini
Kwanini unampenda
Akiwa mkubwa angependa kuwa ?
Hitimisho

MWALIMU WANGU
Mwalimu ni nani
Jina la mwalimu wako
Umri wake
Jinsia: kike au kiume
Umbo lake
Mrefu, mfupi, mwembamba, mnene
________
Rangi ya ngozi yake
Anaishi wapi
Familia yake/ bibi/ bwana/ dada/ kaka
Huja shuleni kwa kutumia
Hupenda kuvaa vipi
Hupenda kula na kunywa nini
Hufunza masomo gani? Darasa gani
Siku ya jumamosi na jumapili hufanya nini
Sifa zake: mpole, mcheshi, karimu, mkali
Kwa nini unampenda
Hitimisho

UMUHIMU WA MITI
Kuelezea miti ni nini
Kudondoa umuhimu wa miti
Mifano ya umuhimu wa miti
Miti ni chakula: matunda na mizizi
Hutupatia mbao za kutengeneza fanicha kv: meza, kabati, rafu, chubaka, kitanda
________
Miti hutumiwa kujenga nyumba
Miti hutupatia dawa kama mwarobaine
Miti hutupa kivuli
Makao ya wanyama pori, huvutia watalii
Makao ya ndege kama njiwa ,mbuni
Miti hutupa kuni na makaa ya kupikia
Miti hutupa kivuli hasaa wakati wa jua kali
Watu nyumbani hupumzika sehemu zenye mabustani
Wanyama nao hujistiri mahali kwingi kwenye kivuli kujikinga dhidi ya miale mikali ya jua
Kutuletea mvua kwa kuvuta mawingu ya mvua
Miti hupamba mahali: miti yenye maua kama miasumini, miwaridi, milangilangi na miafu
hustawi na kupamba ardhi
hitimisho

RAFIKI YANGU (ya pili)
Jina lake
Umri wake
Kike au kiume
Mrefu kama twiga ama mlingoti
Mfupi-nyundo
Mnene-nguruwe
Uembamba-sindano
Rangi ya ngozi yake
Nyeusi tititi
maji ya kunde
________
Anaishi:
Mji-Naivasha, Nairobi
Mtaa- Kayole, Kanju, Panda
Jina la wazazi wake
Ana dada, kaka
Anasoma shule gani
Yuko darasa lipi
Je, anafanya bidii
Mnafanya nini naye
Yeye huenda kanisani wapi
Anapenda kunywa nini( soda, chai, maziwa, sharubati)
Anapenda vyakula vipi (wali, kande, pilau, chapati)
Michezo:
Kikapu
Kandanda
Kuogelea
magongo
Hapendi nini
Kwanini unampenda
Hitimisho

MWALIMU WANGU (wa pili)
Mwalimu ni nani
Jina la mwalimu wako
Umri wake
________
Jinsia: kike au kiume
Kimo: urefu/ ufupi
Ana uembamba kama wa (sindano) ni mnene kama nguruwe
Rangi ya ngozi yake
Anaishi wapi
Huvaa nguo safi/ chafu
Anafanya kazi wapi
Anafunza darasa lipi na somo gani
Ana familia au hana
Anapenda kula vyakula vipi
Anapenda kunywa nini
Anapenda matunda gani
Yeye huenda kanisani na siku gani
Hapendi nini
Hutazama kipindi kipi
Hupenda mchezo gani
Yeye hushauri vipi darasani
Akikasirika hufanya nini
Akifurahi hufanya nini
Kwa nini unampenda`
  },
  {
    id: 'term2-week1',
    title: 'Muhula wa Pili: Juma la Kwanza',
    summary: 'Tusiharibu mimea, sauti h/gh, herufi kubwa/ndogo, wakati timilifu -me- na kukanusha, ndege pori.',
    body: `MUHULA WA PILI
JUMA LA KWANZA
Kusikiliza na kuongea
Tusiharibu mimea
Kueleza umuhimu wa mimea
Msamiati • Bustani • Miche • Nimeshapoa • Jangwa • Mimea • Udongo
• Huruma • Viumbe • Mvua • Rutuba • Mazingira • Wajukuu
Kutazama na kuchambua picha
Kujadili umuhimu wa miti
Kusoma kwa kiada
Kuunda sentensi nyepesi
Kufanya zoezi

Kusoma
Maneno yenye sauti h na gh
________
Kuandika silabi za h na gh
Kuorodhesha mifano ubaoni
Mifano
• Ghafla • Ghali • Ghorofa • Lugha • Ghala • Magharibi • Ghasia • Shughuli • Hafla
• Harusi • Huzuni • Huruma • Hema • Staftahi • Furahi • Haribika • Haraka
Kueleza maana na matumizi
Kusoma kwa sauti
Kujibu maswali

Kuandika
Kuandika sentensi kwa herufi kubwa na ndogo
Mifano
• Hafla hiyo ilikuwa ya ghafla • Kuku ameingia kwenye ghala • Nyumba ile ya ghorofa ni nzuri sana • Pahali penye ghasia pana huzuni • Wanafunzi wasome sentensi • Waandike sentensi kwa herufi kubwa na ndogo

Sarufi
Wakati timilifu -me na kukanusha
Kuelezea wakati timilifu ni dakika chache zilizopita(ME, JA)
________
MFANO
• Mimi nimesoma mimi msijasoma • Mti umekatwa mti haujakatwa • Nimekunywa sijakunywa • Amekuja hajaja • Nimekula sijala
Kuimba wimbo wa nyakati
Kutoa mifano zaidi
Kusoma mifano vitabuni
Kufanya zoezi

Msamiati
Ndege pori
Ni ndege wanaoishi porini/ msituni
Mfano
• Mwewe • Shiriku
• Bundi • Kunguru
• Kanga • Mbuni • Kigogota • Heroe
• Tai • Keremkerem
• Kware • Korongo
• Furukombe • Kasuku
• Njiwa • Tausi
Kueleza msamiati wa ndegepori
Kuchambua picha vitabuni
Kuchora picha
Kusoma na kufanya mazoezi`
  },
  {
    id: 'term2-week2',
    title: 'Muhula wa Pili: Juma la Pili',
    summary: 'Adabu zetu, usafi, kuandika vitate, sifa zuri, ukoo.',
    body: `JUMA LA PILI
Kusikiliza na kuongea
Adabu zetu
Msamiati • Samahani • Tafadhari • Naomba • Pole
• Nipishe • Hodi • Asante • Hewala
Wanafunzi waigize maneno ya adabu darasani
Wasome kutoka kwenye mufti
Wajibu maswali

Kusoma
Usafi
Msamiati • Takataka • Mwili • Afya • Wadudu
• Chokoleti • Peremende
• Pipi • Pipa • Jalala • Magonjwa • Uchafu
• Nzi
Kuchambua msamiati
Kusoma kimoyomoyo
Kusoma kwa kiada
Kufanya mazoezi

Kuandika
Kuandika maneno ya vitate
Mifano
• Bata pata • Futa vuta • Fua vua • Mwigo mwiko
• Paa baa
• Baba papa • Vaa faa • Kula kura • Chakula chakura
Mifano kadhaa itolewe darasani
Wasome na kuandika mazoezi

Sarufi
Sifa zuri
Sifa ni maneno yanayoelezea jinsi kitu , mtu alivyo au anavyoonekana
Mfano
• Mtoto mzuri watoto wazuri • Kitabu kizuri vitabu vizuri • Ua zuri maua mazuri • Kalamu nzuri kalamu nzuri
Kutoa mifano kadhaa darasani
Kusoma mifano
Kufanya mazoezi

Msamiati
Ukoo
Msamiati • Babumkuu
• Nyanyamkuu
• Mjukuu
• Kitukuu
• Hale • Halati • Ami • Amu
• Mavyaa • Bavyaa
• Mamkwe • Bamkwe • Shangazi • Mjomba • Binamu
• Wifi • Shemeji • Mpwa • Mkoi • Bibi
Wataje watu wa ukoo
Kueleza msamiati wa ukoo
Kutazama na kuchambua picha
Kusoma kwa kiada
Kujibu maswali`
  },
  {
    id: 'term2-week3',
    title: 'Muhula wa Pili: Juma la Tatu',
    summary: 'Mbu ni adui, panzi na kunguru, sentensi b/mb, sifa -epesi, pesa za sarafu.',
    body: `JUMA LA TATU
Kusikiliza na kuongea
Mbu ni adui
Msamiati • Mbu
• Chandarua • Sigara • Bhangi • Sumu
• Wazimu
• Malaria • Kutapika • Hospitali
Kuchambua picha
Kueleza maana ya msamiati
Kusoma kwa zamu
________
Kusoma kwa kiada
Kujibu maswali

Kusoma
Panzi na kunguru
Msamiati • Panzi • Kunguru
• Mafichoni • Marafiki • Ujanja • Wadudu
Kuchambua picha
Kueleza maana ya msamiati
Kusoma kwa zamu
Kusoma kwa kiada
Kujibu maswali

Kuandika
Kuandika sentensi zenye b na mb
Mfano
• Mbega • Shamba • Iba • Baba
• Bega • Shamba • Imba • Mbovu
• Buli • Raba
• Barabara • Bakuli • Mbali • Bali • Embe • Kimbia
Kusoma maneno
Kuunda sentensi
Kusoma mifano ya sentensi
Kuunda sentensi
Kujibu maswali

Msamiati
Pesa za sarafu
Kutaja baadhi ya pesa za sarafu kama: shilingi tano
• Shilingi kumi • Shilingi ishirini • Shilingi arubaini • Sarafu ya senti hamsini
Kuelezea kuwa pesa zinatumiwa kununua
Kuchora sarafu
Kufanya zoezi

Sarufi
Sifa –EPESI
Kuelezea maana ya sifa –epesi kulingana na ngeli kama: • Mtoto mwepesi
• Mawe mepesi • Kiti chepesi • Ugali mwepesi • Mvua nyepesi • Mkoba mwepesi • Jiko jepesi • Ufagio mwepesi
Kusoma mifano ubaoni
Kusoma kutoka kwenye kitabu
Kufanya zoezi`
  },
  {
    id: 'term2-week4',
    title: 'Muhula wa Pili: Juma la Nne',
    summary: 'Vitendawili, kikomo/kiulizi, sauti mbw/njw, sifa nene, noti za pesa.',
    body: `JUMA LA NNE
Kusikiliza na kuongea
Vitendawili
Vitendawili ni maelezo yenye maana iliyofichika kuhusu jinsi kitu kilivyo au kinavyoonekana
Watega na wategue vitendawili
Mfano
Nyama nje ngozi ndani: firigisi
Hujilinda bila silaha: kinyonga
Nikimpiga mwanangu watu hucheza: ngoma
Kutoa mifano zaidi ya vitendawili
Kufanya zoezi

Kusoma
Kikomo na kuilizi
, na ?
Kuelezea alama za kuakifisha
Kuwaongoza kutumia katika sentensi
Kusoma mifano vitabuni
Mifano
• Mbuzi hunywa soda? • Mtoto analia. • Gari linaenda wapi? • Punda amekula nyasi.
Mifano mingine kadhaa
Kujibu maswali

Kuandika
Sauti mbw na njw
Mifano
• Mbwago
• Mbwembwe • Mbweu
• Ulimbwende • Lubwi • Vunjwa • Mgonjwa
• Chunjwa • Chinjwa • Punjwa • Kidimbwi • Masumbwi • Mbweha
Kutoa mifano mingine
Kueleza maana ya maneno
Kutunga sentensi kwa kutumia maneno
Kusoma sentensi kitabuni
Kuandika sentensi zenye sauti hizo
________

Sarufi
Sifa nene
Mfano
• Mti mnene miti minene • Kisu kinene visu vinene • Jicho nene macho manene • Mwalimu mnene Walimu wanene
Kutoa mifano kadhaa
Kusoma ubaoni
Kufanya mazoezi

Msamiati
Mfano
• Noti ya shilingi tano
• Noti ya shilingi kumi • Noti ya shilingi hamsini • Noti ya shilingi mia moja • Noti ya shilingi mia mbili • Noti ya shilingi elfu moja
Kuwaonyesha na kutambua noti
Kuchora na kufanya zoezi`
  },
  {
    id: 'term2-week5',
    title: 'Muhula wa Pili: Juma la Tano',
    summary: 'Methali, herufi kubwa/ndogo (matumizi), kusoma shuleni, sifa baya, akisami.',
    body: `JUMA LA TANO
Kusikiliza na kuongea
Kueleza maana ya methali
Kueleza matumizi ya methali
Mifano
• Chururu si ndo ndo ndo
• Cha mlevi huliwa na mgema • Mpiga ngumi ukuta huumiza mkonowe
Kutoa mifano kochokocho
Kusoma vitabuni
Kufanya zoezi

Kuandika
Kuandika kwa herufi kubwa na ndogo
Matumizi ya herufi kubwa katika sentensi
Mwanzo wa sentensi
Jina rasmi
Mfano
• Mtu
• Mji • Mahali • Nchi • Wilaya • Cheo
Ufupisho wa majina kv : JJ kamau
Kutoa mifano zaidi
________
Kufanya zoezi

Kusoma
Kusoma: shuleni
Msamiati • Mlingoti • Bendera • Soka • Uwanja/ uga • Kandanda • Ofisi/ majilisi • Pete • Sayansi • Kingereza
Kueleza maana ya msamiati
Kutunga sentensi fupi fupi
Kusoma kwa zamu
Kusoma kwa kiada
Kujibu maswali

Sarufi
Sifa baya
Mifano
• Mkebe mbaya mikebe mibaya • Yai baya mayai mabaya • Chakula kibaya vyakula vibaya • Mpishi mbaya wapishi wabaya
Kutoa mifano zaidi
Kusoma mifano vitabuni
Kufanya mazoezi

Msamiati
Akisami
Sehemu moja kati ya nzima • Nusu
• Theluthi • Robo
• Humusi/ humsi • Sudusi
• Subui • Thumni • Tusui • Ushuri
Kuchora akisami kwa kutumia picha
Kugawa vitu darasani
Kusoma
Kufanya zoezi`
  },
  {
    id: 'term2-week6',
    title: 'Muhula wa Pili: Juma la Sita',
    summary: 'Usijaribu (mchezo wa kuigiza), alama ya mshangao (!), imla ya vitate, kukanusha (li,na,ta,me), wanyama wa majini.',
    body: `JUMA LA SITA
Kusikiliza na kuongea
Usijaribu(mchezo wa kuigiza)
Msamiati • Utingo
• Polisi • Dereva • Matwana
• Mahakamani • Hakimu
• Korti • Gerezani
________
• Hukumu
• Abiria • Mshtakiwa
• Faini • Kondakta
Kueleza maana ya msamiati
Kutunga sentensi nyepesi
Kuchambua picha
Kuigiza

Kusoma
Alama ya mshangao/ hisi (!)
Kishangao ni alama ya kushangaa au kushtuka
Huonyesha hisia
Mfano
• Furaha • Huzuni • Kushtuka • Kushangaa
✓ Lo ! yeye ni mwizi !
✓ Ala! Mvua imeanza!
✓ Salala! Fisi anacheka!
Kuorodhesha mifano kadhaa
Kufanya zoezi

Kuandika
Imla
✓ Ghaidi
✓ Kaidi
✓ Kumi
✓ Gumi
✓ Genge
✓ Kenge
✓ Koma
✓ Goma
✓ Oga
✓ Oka
✓ Kawa
✓ Gawa
✓ Kamba
✓ Gamba
✓ Taka
✓ Taga
Wasome maneno hayo kwa usahihi
Waandike maneno haya kwa ufasaha

Sarufi
Kukanusha (li, na, ta, me)
Kurejelea nyakati
✓ Li ki
✓ Na ha
✓ Ta ta
✓ Me ja
Kuwapa mifano na kukanusha
Kufanya mazoezi

Msamiati
Wanyama wa majini
Mfano
✓ Samaki
✓ Chura
✓ Mamba/ ngwena
✓ Kiboko
✓ Nguru
✓ Kasa
✓ Kaa
✓ Nyangumi
✓ Mkunga
✓ Papa
✓ Pweza
✓ Dagaa
✓ Kamba
Kueleza maana ya msamiati
Kuchambua picha
Kusoma vitabuni
Kufanya zoezi`
  },
  {
    id: 'term2-week7',
    title: 'Muhula wa Pili: Juma la Saba',
    summary: 'Mchezo wa kuigiza (haki za watoto), tanakali za sauti, sauti r/l, viulizi -gani/-nani?, wanyama pori.',
    body: `JUMA LA SABA
Kusikiliza na kuongea
Mchezo wa kuigiza(jingo na mulwa)
Kurejelea haki za watoto
Kuelezea maana ya msamiati
✓ Chekechea
✓ Elimu ya bure
✓ Serikali
✓ Ajiri/ ajira
✓ Kufaulu
✓ Kuigiza
Kujibu maswali

Kusoma
Imla ya sentensi(tanakali za sauti)
Mfano
✓ Kauka kaukau
✓ Dondoka ndo ndo ndo
✓ Tiririka tiriri
✓ Lala fofofo
✓ Funika gubigubi
✓ Bweka bwe bwe bwe
✓ Lia kwi kwi kwi
✓ Cheka kwa kwa kwa
Kutoa mifano kadhaa
Wanafunzi wasome kwa sauti
Kufanya zoezi

Kuandika
Maneno ya sauti R na L
MIFANO
✓ Kula kura
✓ Chalula chakura
✓ Landa randa
✓ Mahali mahari
✓ Sili siri
✓ Mbali mbari
✓ Bali bari
✓ Fahali fahari
✓ Hali hari
✓ Lika rika
✓ Ajili ajiri
Kutungia sentensi
Kujaza pengo kwa jina linalofaa

Sarufi
Kiulizi –gani? na –nani?
Nani: hutumika katika ngeli ya A-WA
Gani halichukui kiambishi ngeli
Mfano
✓ Moto gani?
✓ Kisu gani?
✓ Darasa gani?
✓ Mwalimu wako na nani?
✓ Jina lako nani?
✓ Mama yako anaitwa nani?
Kusoma na kuigiza mazungumzo
Kufanya mazoezi

Msamiati
Wanyama pori
Wanyama wanaoishi porini au msituni
Mfano
✓ Samba
✓ Ndovu
✓ Twiga
✓ Fisi
✓ Sokwe
✓ Kicheche
✓ Nungunungu
✓ Ndovu/ tembo
✓ Mbuga
✓ Loma
✓ Pundamilia
✓ Ngiri
✓ Kima
✓ Kinyonga/ lubwi
✓ Sungura
✓ Mbweha
✓ Duma
✓ Chui
✓ Nyani
✓ Mbega
Kueleza/ kutaja/ kujadili kuhusu wanyama pori
Kutazama picha/ michoro ya wanyama pori
Kufanya mazoezi`
  },
  {
    id: 'term2-week8',
    title: 'Muhula wa Pili: Juma la Nane',
    summary: 'Shairi (kinyonga), ufahamu (binadamu), sentensi (majina+vitenzi), kielezi, tarakimu 701-1000.',
    body: `JUMA LA NANE
KUSIKILIZA NA KUONGEA
SHAIRI: KINYONGA
Msamiati
✓ Kinyonga/ lubwi
✓ Kugeuzageuza
✓ Hudhurungi
Kutazama michoro
Kujadili shairi
Kukariri/ kughani shairi

Kusoma
Ufahamu: binadamu
Msamiati
✓ Timamu
✓ Akili
✓ Umba
✓ Stahili
✓ Jangwa
✓ Silaha
✓ Vita
✓ Mabomu
✓ Pumu
✓ Petrol
✓ Kohoa
✓ Baharini
✓ Viwandani
✓ Vinyesi
Kueleza maana ya msamiati
Kuunda maneno kwa kutumia maneno
Kusoma kwa zamu
Kusoma kwa kiada
Kujibu maswali

Kuandika
Sentensi zenye majina na vitenzi kwa herufi kubwa na ndogo
Mfano
✓ Sungura alifungwa macho yake
✓ SILI PURE BARIDI
✓ Usile chakula kichafu
✓ NJOO ULE KANDE
Kufanya zoezi

Sarufi
Majina + kitenzi+ kielezi
Mfano
✓ Mtoto anatembea polepole
✓ Chakula kitaiva haraka
✓ Wageni waliimba vizuri
✓ Mvua ilinyesha vibaya
Mifano kadhaa itolewe darasani
Kufanya mazoezi

Msamiati
Tarakimu 701 – 1000
Kuandika tarakimu kwa maneno na idadi
Mfano
✓ 705: mia saba na tano
✓ 890: mia nane tisini
✓ Maua 901: maua mia tisa na moja
✓ Kalamu 775: kalamu mia saba sabini na tano
✓ Viazi 834: viazi mia nane thelathini na vine
✓ 1000: elfu moja
Kufanya mazoezi`
  },
  {
    id: 'term2-week9',
    title: 'Muhula wa Pili: Juma la Tisa',
    summary: 'Mchezo wa kuigiza (ukimwi), sauti ng/ng\', methali/vitendawili vya wanyama, vihusishi, magonjwa.',
    body: `JUMA LA TISA
Kusikiliza na kuongea
Mchezo wa kuigiza (nani hana ukimwi)
Msamiati
✓ Ugonjwa
✓ Virusi
✓ Mapenzi
✓ Tumboni
✓ Gusa
✓ Damu
✓ Ukimwi
✓ Zaliwa
✓ Redioni
✓ Runinga
✓ Magazeti
✓ Watoto wachanga/ malaika
Kuchambua msamiati
Kujadiliana juu ya ugonjwa wa ukimwi
Kutunga sentensi kwa kutumia msamiati
Kuigiza
Kuandika maneno ya msamiati

Kusoma
Sauti ng na ng,
mifano
✓ Ngano
✓ Nguo
✓ Mlango
✓ Shingo
✓ Mbunge
✓ Mshanga
✓ Danganya
✓ Shilingi
✓ Ngiri
✓ Ng’ambo
✓ Ng’aa
✓ Ng’oa
✓ Mbung’o
✓ Ng’arisha
✓ Nyang’anya
✓ Seng’enge
✓ Ng’amua ✓ Ng’ara
Kuchambua maana ya maneno
Kutungia sentensi nyepesi
Kusoma na kuandika

Kuandika
Methali/ vitendawili zinazohusu wanyama
Mifano
✓ Paka akiondoka panya hutawala
✓ Nyani haoni kundule
✓ Mkono mmoja hauchinji ngombe
✓ Siku ya kufa nyani miti yote huteleza
✓ Fahali wawili hawakai zizi moja
✓ Polepole ya kombe humfikisha mbali
✓ Asante ya punda ni mateke
✓ Njia mbili zilimshinda fisi
Vitendawili
✓ Nyika pangoni: ulimi
✓ Anatembea na nyumba yake: kobe
✓ Babu ana kabuti la miba: nungunungu
✓ Ng’ombe maporini: nyati

Sarufi
Vihusishi
Maneno yanayoonyesha uhusiano wa kitu/ mtu na mwingine
✓ Kando ya ✓ Nyuma ya
________
✓ Mbele ya
✓ Katikati ya
✓ Karibu na
✓ Juu ya n
✓ dani ya
✓ chini ya
Kuunda sentensi kwa kutumia vihusishi
Kusoma mifano
Kufanya zoezi

Msamiati
Magonjwa
✓ kifua kikuu
✓ ukimwi
✓ mba/ choa
✓ majipu
✓ kipindupindu
✓ ukambi/ surua
✓ ukoma
✓ kifaduro
✓ pumu
✓ wadi
✓ nesi/ muuguzi
✓ daktari/ tabibu
✓ machela
✓ vidonge
✓ sindano
✓ kipima mwili
✓ makasi
✓ glavu
✓ bendeji
✓ sliji
✓ pamba
Kujadili na kuchambua msamiati
Kutambua vifaa halisi na michoro
Kujibu maswali`
  },
  {
    id: 'term2-week10',
    title: 'Muhula wa Pili: Juma la Kumi',
    summary: 'Shairi (tatu kwaheri), ufahamu (kwaheri ya kuonana), maswali mseto, vinyume vya vitenzi, ishara za barabarani.',
    body: `JUMA LA KUMI
Kusikiliza na kuongea
Tatu kwaheri(shairi)
Kuimba na kukariri shairi
Kusoma shairi kwa zamu
Kusoma kwa kiada
Kukariri kwa pamoja

Kusoma
Kwaheri ya kuonana
Msamiati
✓ Waaminifu
✓ Kwaheri
✓ Mazingira
✓ Ugonjwa
✓ Ukimwi
✓ Nadhifu
Kuchambua picha na michoro
Kueleza maana ya msamiati
Kutunga sentensi fupi
Kusoma kwa zamu
Kusoma kwa kiada
Kujibu maswali

Kuandika
Maswali mseto
Kufanya maswali mseto kwenye madaftari

Sarufi
Vinyume vya vitenzi
Mifano
✓ Funga fungua
✓ Panga pangua
✓ Fuma fumua
✓ Funika funua
✓ Bandika bandua
✓ Teg tegua
✓ Pika pakua
✓ Meza tema
✓ Jenga bomoa
✓ Anika anua
Kuorodhesha mifano kadhaa
Kusoma mifano
Kufanya zoezi

Msamiati
Ishara na alama za barabarani
Ishara ni alama zinazowasaidia na kuwaongoza wasafiri wanaotumia barabara
Mifano
✓ Taa za barabarani
✓ Hospitali
✓ Kivuko cha watoto
✓ Kivuko cha watu/ wanyama
✓ Usiendeshe baiskeli
✓ Hakuna njia
✓ Daraja
Kujadiliana kuhusu alama za barabarani
Kutazama alama hizo
Kusoma matumizi ya alama hizi
Kuchora alama za barabarani
Kujibu maswali`
  }
]
// ==================== ENVIRONMENTAL ====================
const ENVIRONMENTAL_TOPICS = [
  {
    id: 'physical-environment',
    title: 'The Physical Environment',
    summary: 'Location of school, directions, compass points, physical features, weather, seasons, communities, needs, resources, economic activities, environment care, and administration.',
    body: `THE PHYSICAL ENVIRONMENT
The district where the school is found
Our school is located in ________________ village
Our school is located in ________________ sub location
Our school is located in ________________ location
Our division is called________________
Our district is called________________

Division that makes up the district
Many villages make up a ________________
Many sub locations make up a ________________
Two locations make a ________________
Many divisions make a ________________
Many districts make a ________________

Directions
________________ shows us the direction
________________ is the position a person move or points toward
Sun rises in the ________________
Sun sets in the ________________
We can use our ________________ and ________________ to tell the direction of place
(right, left)

GRADE THREE
ENVIRONMENTAL ACTIVITIES

Name three pupils on your right in class ________________
________________
________________
Name three pupils on your left in class ________________
________________
________________

Cardinal points of a compass
________________ shows us the direction
The four points of a compass are called ________________
The cardinal points are also called ________________
Name four cardinal points ________________
________________
________________
________________
The needle of a compass always point to the ________________
The direction where the sun rises is called________________
The direction where the sun set is called________________

Draw and name the cardinal points of a compass
North
West East
South

(Never eat sukumawiki)

Main physical features in our district
A large piece of land filled with water is known as a ________________
The land where a river flows through is called a ________________
A low lying land is known as a ________________
The main physical features in our district include: - River - Lake - Hill - Valley
- Dam
- Mountain
(Draw)

Defining the physical features
The main physical features include
a)
b)
c)
d)
e)
They are called physical features because we see them on the ________________ of the ________________ We see the ________________ everyday going and coming to school
A large piece of land filled with water is known as a ________________
(land, lake)
When a wall is built across a river the water collects behind the wall to form a ________________
(Dam, lake)

Importance of the physical features
Hills and mountains
It acts as a ________________ place in the time of danger
Many rivers start flowing out from the sides of ________________
Sides of hills are known as ________________
________________ grow on the slope of hill (forest, maize)
Some hills are fertile and are used for ________________(farming, walking)
Hills are very safe during ________________ (floods, drought)

Importance of rivers
Rivers act as a ________________ of some animals
We get ________________ from rivers
We get materials for ________________ from some rivers
Rivers are also used for ________________ (transport, walking)
Some rivers provide fish, which is caught and used as ________________
The rivers that have water throughout the year are known as ________________
The rivers that do not have water throughout the year are called ________________
Name three rivers in your district ________________
________________
________________

Importance of the forest
Act as a home for ________________
Forest help to bring ________________
Forest give us firewood, poles and timber
Forests protect our ________________ from being carried away by ________________ and
________________

Importance of swamps
Plants growing in swamps are called ________________
Swamps can be used for ________________, ________________ and ________________
________________ is collected from swamps to make pots
________________ is also caught in swamps
Reeds are used for making
________________
________________
________________

Weather and seasons in the district
Defining the weather
________________ is the condition of the air in a place
Name the four elements of weather ________________
________________
________________
________________

(Draw) - Rain
- Calm
- Sunshine - Windy

Effects of weather on human activities
Bad and good effects of wind, rain and sun to human activities
________________ are things that people do
People prepare their land when it is ________________
When it is ________________ people ________________ their crops
Human beings also dry and spread maize and beans in the sun
People wash their clothes when it is ________________ and ________________
When it is ________________ people separate the husks from________________
Separating husks from grains is called ________________
Strong wind in lakes make the boat to ________________ in the water
When it rains the ground becomes very________________
When it rains people plant ________________
Weeds grow well when it is ________________
Too much rain causes ________________
Floods destroy ________________ and ________________
Lack of rain causes________________
People collect rain water from the roof when it is ________________

Ways of protecting ourselves from bad weather
People use ________________ when it is raining
Gumboots are worn when the ground is ________________
We wear ________________ clothes when it is cold and ________________ clothes when it is
warm
Examples of warm clothes are ________________, ________________ , ________________
and ________________
Trees act as wind ________________ hence preventing roofs to be brown by the wind

Seasons of the year in the district
They are ________________ seasons in the year
Rainy season is called ________________ season
When there is no rain for a long time we say it is dry ________________ season
Which months do we experience long rain
________________
________________ We experience the short rain during the months of ________________
________________ Dry seasons occurs during the month of ________________
________________, ________________
________________

Activities carried out during different seasons
Wet season
We plant our crops during ________________ season
________________ is removing of weeds from the shamba
People collect rain water from the roof when it is ________________
During wet season people also do grazing
During rainy season there is enough water in ________________ and ________________
(ocean, sea, lake, rivers)
The water from big rivers and dams can be used to produce ________________

Dry season
- Harvesting
- Collecting sand
- Repairing roofs - Digging
- Irrigation
- Mulching

UNIT 3: COMMUNITIES LIVING IN OUR DISTRICT
Main language group in our district
________________ is a group of people living together
People who speak the same mother tongue belong to the same ________________ or language
group
Most people in towns speak in ________________ and ________________

The main language groups in the district are: ________________
________________
________________
________________ Name three examples of Bantus ________________
________________
________________ Name three examples of cushites ________________
________________
________________ Name three examples of nilotes ________________
________________
________________
________________

How people in our district depend on one another
Farmers and fishermen
The way people depend on one another is called ________________
Through________________ our people depend on other people who have what we do not have
Our people get information from________________ or ________________

Name three social activities in our district ________________
________________
________________
________________ grow crops and keep animals
We buy crops from the ________________, ________________ , ________________
People who sell fish are called ________________
________________ lives near lakes

Teacher and doctor
People go to v to be treated when they are sick
When the children go to school, the ________________ help them to learn
________________ treat the sick people
In the private school________________ pays the teachers
In public schools the ________________ pays the teachers

Policeman, shopkeeper and carpenter
________________ sells things in the shop
________________ is a person who makes things from timber
Things made from timber are called________________
People who buy and sell things belong to a ________________community(farming, trading)
People who worship together form ________________ community(trading, religious)
________________ keeps law and order in our community

OUR NEEDS IN THE DISTRICT
Types of needs in the district ________________ are things we require in our everyday life
Name three basic needs ________________
________________
________________ Other needs include - Medicine - Education
- Security
- Employment - Worship
- Electricity
- Place to play and rest - Ve__ri__ry
- Telephone

Food
________________ grow crops and keep animals
We grow crops on the ________________
Food make us grow ________________ and ________________
Food give us energy to do ________________
Crops grown for food are called ________________ or ________________
Crops grown for sale are called ________________ or ________________
Name three food crops ________________
________________
________________

Name three cash crops ________________
________________
________________
________________ cows gives us milk
Beef cattle give us ________________
________________ are birds kept at home

Clothes
________________ is a person who make our clothes
We wear clothes to ________________ our body
Clothes keep our bodies ________________
Clothes make us look ________________ Draw and name five types of clothes that we wear

Houses and school
House protects us from
________________
________________
________________ A house is also called a ________________
The money spent on paying for the houses we live in is called house ________________
Name three traditional houses/ draw
________________
________________
________________

Name three types of buildings/ draw
________________
________________
________________ Maasai live in a ________________

Roads and hospitals
________________ is the main means of transport in the district
Name three types of roads ________________
________________
________________
________________ is a person who treats sick people
________________ is a person who treats people using herbs
A nurse takes ________________ of sick people

We need a good leader
Name three qualities of a good leader ________________
________________
________________ We need security
When there is security people can walk________________
________________ keeps law and order in our district

Police ________________ people who break the law
People who break the law are called ________________
Chiefs and assistant chiefs keep ________________ in the location
Every community trained its young people to be ________________(brave, worriors)
________________ protected the community from attack

We need place of worship
Christians worship in a ________________
Hindus worship in a ________________
Muslims worship in a ________________
Christians go to church on ________________
Muslims go to church on ________________

Meeting the needs in the district
How we get our food
We work in the ________________ to grow our food
We add ________________ on the farm to make our crops grow well
We also keep ________________ for milk and meat
We ________________ our animals to prevent them from getting diseases

How we get water
Where we get water from is called ________________
________________ is the main source of water
________________ is not a source of water(tap, rain ,dam)
We need water to ________________ our crops and feed our animals

Draw and name four sources of water: - Borehole - Dam
- River

Name six uses of water ________________
________________
________________
________________
________________
________________
________________
________________

How we get shelter
Houses protect us from ________________ weather and ________________ people
We can build houses using
________________
________________
________________
________________ We get ________________ for building houses from the river (sand, timber)
Most people in the district live in their ________________ houses
Name three types of houses ________________
________________
________________ The wall of a permanent house is made of ________________
Manyatta is a house of ________________

How we get clothes
A ________________ is a person who makes clothes
________________ makes us look smart
We buy clothes from ________________, ________________ and ________________
We also get clothes from our ________________(relatives, friends)
In olden days people used to get clothes from
________________
________________
(Animal skin, tree barks)

We get our medicine
We take medicine to keep us ________________
________________ works in the hospital
________________ takes care of us when we are sick
The person who treat sick people is called a ________________(nurse, veterinary, doctor)
The ________________ build hospitals for us
Government give ________________ to the people living with HIV and AIDS

How we get education
We go to school to ________________
________________ help pupils to learn at school
________________ pays the teacher in a private school
________________ pays teachers in a public school
Long time ago girls used to be taught by their________________

UNIT 5
RESOURCES IN OUR DISTRICT
________________ are things that people have that they use to make their lives better
Resources can be for ________________ and others for ________________
Some of the resources in our district are: - Land
- Wild animals - Domestic animals - Poultry
- Plants - Water

Soil and land
Land give us ________________ where we plant our crops
We build our houses on the ________________
Land also gives us ________________

Plants and forest
________________ grow crops
Plants provide us with food that we eat
Many trees growing together make a ________________

Water
________________ is the main source of water
There are many sources of water

They are: ________________
________________
________________
________________
________________ Draw
________________ is not a source of water
The place where we get our water are known as ________________

Animals
Animals that are found in the forest are called ________________
Animals found at home are ________________
Draw five domestic animals
Draw and name five wild animals

Importance of the resources in the district
Land has different types of ________________ and ________________
We grow ________________ on the land
People build their ________________ on the land
________________ soil is used in making pots
Soil is used to make ________________
The walls of traditional houses are made of ________________
The walls of modern houses are made of________________

Water
Water is important in our lives
We use water in
- Drinking
- Cooking
- Washing
- Feeding animals
Watering of crops is called ________________
Irrigation is done during the ________________ season
Water can be used to produce ________________
Some animals live in water
Write five animals that live in water

Trees and forest
Trees give us ________________ for building
Trees are used in making electricity ________________
Timber is used for making ________________ Some trees are used in making________________
Trees attract ________________
V treat people using herbs
Trees reduce the speed of ________________
Trees prevent soil________________

Animals
________________ farmers grow crops and keep animals
________________ and v are used in transportation
________________ cows give us milk while ________________ cows give us meat
Oxen are used in ploughing the land
Keeping of birds is known as ________________ farming
Hens that give us eggs are called ________________ Hens that give us meat are ________________

Match the animal and the product
animal Product
Cow
Goat
Sheep
Pig
Hen
fish
Pork
Mutton
Chicken
Beef
Goat meat
Fillet
Sheep also give us ________________
Wild animals attract ________________

Crops
Crops grown for sale are called________________
Crops grown for food are________________
Name three cash crops
Name three food-crops

Minerals
Minerals are found in the ________________
Minerals are sold to get ________________
Limestone is used to make ________________

Minerals include: - Limestone - Soda ash
- Titanium
- Diatomite

Effective use of resources
Forest and trees
People should not cut down ________________ carelessly
Cutting down of trees is called ________________
People should take care of the young________________
Planting of trees where none existed is called ________________
Planting trees where they have been cut down is called ________________
We should cut down only ________________ trees
(Aforestation, deforestation, reafforestation)
If we cut one tree we should plant ________________ trees

Animals
People who kill wild animals are called________________
Elephants are killed for their tusks
Rhinos are killed for their horns
Fenced areas where wild animals live are known as ________________
________________ protect our wild animals
A ________________ treats sick animals
The old and the orphaned animals are kept in the ________________
Animals should be given enough food and water

Money paid by tourists is called ________________________________ Water
We should repair broken ________________ and ________________
People should turn off ________________ when not in use
Throwing of rubbish in the water sources cause ________________
We should harvest and store the ________________ water
We can store rain water in the ________________
People should be discouraged from washing clothes and cleaning vehicles near the sources of water

Land and soil
We should plant more trees to reduce ________________ erosion
The carrying away of the top soil is called ________________________________ People should not throw rubbish on the soil
We add ________________ or ________________ to the soil to improve soil fertility
Fertile ________________ give us good crops

ECONOMIC ACTIVITIES
Economic activities in our district
________________ are this people do to meet their needs
When people meet their daily needs live ________________(well, bad)
Money earned from economic activities is called________________
Economic activities include: - Fishing
- Farming
- Keeping animals
- Trading
- Mining
- Basketry

Farming
________________ grow crops and keep animals
________________ are grown for sale
________________ crops are grown to be eaten
Name five cash crops
Name five food crops

Keeping animals
Name five domestic animals kept in our district
Name five wild animals kept in our district
We buy food from the________________
We get ________________ and v from cows
Farmers sell animal products to get ________________
We get skin from________________

Fishing
People living near the lakes are ________________
Traders who sell fish are called________________
Some people get money by selling v
Fishing can be done in
- Rivers - Lakes - Dams
Fish can be used at home as ________________
Some people keep fish at home. They are kept in a ________________

Name 3 types of fish

Trading
________________ is the buying and selling of things
Exchange of goods for other goods is called ________________ trade
Traders selling along the road are called________________
Money earned from selling goods is called ________________(profit, loss)
Trading takes place in: - Market - Supermarket - Shops - Farms

Manufacturing
Making of things is called ________________
New things are made in a ________________
Papers are made from________________
Making of things using clay is known as ________________
People in our district sell things to get________________
________________ is the making of baskets
People who make things from iron are called________________

Mining
We get minerals through________________
Mining provide ________________ for people in our districts
We get stones from a ________________
Name one mineral in our district________________

Transport and communication
________________ is the carrying of people from one place to the other
In our district people mainly use ________________ to travel
Money paid in a vehicle for transport is called________________
People walking along the road are called ________________
________________ is a person riding a bicycle
Pedestrian walks on the ________________ side of the road
________________ is the quickest means of communication

Importance of economic activities
People get ________________ from selling things in our district
We get ________________ from farming and fishing
Money paid to works at the end of the month is called________________
Economic activities help small ________________ to grow into big ________________
Some people get ________________ from economic activities
Money paid to the government is called ________________
Tourism provide ________________ for people who work in hotels

Main urban centers in our district
Shopping centers are also called commercial or ________________ centres
Name three trading centers in our district
Name four buildings found in our nearby town
A commercial centre with many buildings is called________________
Pupils should visit an urban centre near their school

Means of travel in our district
________________ is the movement of people and goods from one place to another
People who travel in a vehicle are called ________________
Types of transport are: - Roads - Railways - Air - Water

Road transport
Most people in our district use ________________ to travel
People use ________________ while others walk
Draw uses of the road
Name two animals used for transport

Water transport
Water transport is the ________________ means of transport
Big rivers can be used for transportation
Small boats are called________________
Water transport takes place in the : - Rivers - Lakes - Oceans
People use ________________ to travel on water

Railway transport
Trains move on ________________ tracks
Trains only stop at ________________
Trains are used to transport heavy ________________and carry many ________________
Trains are slower than cars

Air transport
Air is the fastest means of transport
A ________________ flies a plane
We use aero planes to travel by ________________
Aero planes land in ________________
Aero planes are ________________ way to travel(cheap, expensive)

CARING FOR THE ENVIRONMENT
The things around us form________________
Environment has many things like: - Trees - Grass - Animals - Houses - Water

Sources of water in our district
The places where we get water are known as ________________
Draw 6 main sources of water

Uses of water
Name six uses of water ________________
________________
________________
________________
________________
________________

Caring for water sources
People should plant more ________________ to attract rainfall
Throwing dirt in water sources is called________________
Wells should be ________________(covered, uncovered)
Latrines and toilets should not be built near________________
People should turn off ________________ after use
Rainwater is collected from the ________________ Rain water is stored in ________________
Rivers start from ________________ of hills

Uses of trees
Trees act as wind________________
We get ________________ from trees
We can use ________________ to make a fence around our home
People living near lakes use timber to make boats
Trees give us the ________________ that we breathe
We get firewood and charcoal from trees
Trees act as ________________ for wild animals
Trees make our environment look ________________
Some trees are used to make medicine
Trees prevent soil ________________
We use trees in making papers
Trees provide us with a ________________ when its hot

Caring for trees
People should plant trees during the ________________ season
We should protect young ________________ from animals
People should pr_n trees to remove dead branches
We add ________________ to help trees grow fast and strong
We should water the trees during the ________________ season
People should avoid cutting down ________________

Animals found in the district
Name and draw 5 domestic animals
Draw and name 5 wild animals
________________ animals are found at home
________________ animals are found in the forest

Caring for animals
The sick animals should be ________________
We should build ________________ for our animals to stay in
When the animals are sick they are taken to the v doctor
Domestic animals should be given enough ________________ and water

Homes for wild animals are called________________ parks
________________ people protect wild animals from poachers
Sick, injured and orphaned animals are taken care at the ________________when animals are too many
in one area they should be ________________

UNIT 7
ADMINISTRATION IN THE DISTRICT
Units:
Many villages make a ________________
Two or more locations make a ________________
A sub-location is made up of ________________
Many divisions make a________________

District
Division
Location
Sub location
Villages

Order of administration
________________ is the head of a sub location
All the leaders are called________________
________________ is the head of a location
A ________________ is the head of a division
The head of a district is called a ________________
An assistant chief is also called a ________________ A village elder is also called a ________________

District commissioner district
District officer division
Chief location
Assistant chief sub-location
Village elder village

Duties of administrative leaders in the district
A ________________ represents president in the district
A D.C tell us what the government want us to do
The ________________ conduct marriages in their office
A ________________ solves problems in the division
A D.O heads security meetings in th ________________
D.E.O. is in charge of education in the district
Name three national days in our country ________________
________________
________________

When two people quarrel in the village they report to________________

Importance of law and order
Laws are made in the ________________
________________ is doing things as expected
The rules of a country which say what we may or may not do are called________________
When everyone obeys the law there is ________________ in the country
The police arrest people who ________________ the law
Meetings called by the chief are called________________`
  }
]

// ==================== SCIENCE ====================
const SCIENCE_TOPICS = [
  {
    id: 'living-things',
    title: 'Living Things',
    summary: 'Plants and animals: parts, life cycles, inherited traits, adaptations.',
    body: `LIVING THINGS
Plants and animals are living things. They grow, move, reproduce and need food and water.

PARTS OF A PLANT
A plant has different parts. Each part has a special job (function).
- Roots: hold the plant in the soil. They take in water and minerals.
- Stem: supports the plant. It carries water and food to all parts.
- Leaves: make food for the plant using sunlight (photosynthesis). They breathe through tiny holes.
- Flowers: produce seeds. They are often colourful to attract insects.
- Fruit: protects the seeds and helps them spread.

PLANT LIFE CYCLE
A plant's life cycle shows how it grows and changes.
1. Seed – the plant starts as a seed.
2. Germination – the seed swells and a tiny root and shoot appear.
3. Seedling – the young plant grows leaves.
4. Mature plant – the plant is fully grown and can produce flowers.
5. Flowering – flowers form.
6. Fruit/seed production – the flowers turn into fruits containing seeds, and the cycle starts again.

ANIMAL LIFE CYCLES
Different animals have different life cycles.
- Moth: egg → larva (caterpillar) → pupa (cocoon) → adult moth.
- Frog: egg → tadpole (lives in water, has gills) → froglet (grows legs, loses tail) → adult frog (lives on land and water).
- Jellyfish: egg → larva → polyp → young jellyfish → adult jellyfish.

COMPARING LIFE CYCLES
Compare the life cycle of a chicken and a turtle.
- Chicken: egg (laid on land) → chick (has down feathers) → adult chicken. The hen warms the eggs.
- Turtle: egg (laid in sand on a beach) → hatchling (digs out, goes to the sea) → juvenile → adult turtle. The mother does not care for the eggs.

INHERITED TRAITS
Traits are features of living things. Inherited traits are passed from parents to their young.
Examples in humans: eye colour, hair type, height, shape of nose.
In plants: flower colour, leaf shape.
In animals: fur colour, ear shape.

INHERITED vs ACQUIRED TRAITS
- Inherited traits: you are born with them (natural eye colour, blood type).
- Acquired traits: you gain them after birth. They are not in your genes (a scar, learning to read, dyed hair).

ANIMAL ADAPTATIONS
An adaptation is a body part or behaviour that helps an animal survive in its environment.
Physical (structural) adaptations are body parts.
- Camouflage: animals blend with their surroundings (a chameleon changes colour, a polar bear has white fur on snow).
- Beak shapes: birds have different beaks depending on what they eat (finch – short, strong beak for seeds; eagle – hooked beak for tearing meat).
- Webbed feet: ducks have webbed feet for swimming.
- Thick fur: polar bears and camels have thick fur to keep warm or protect from sun.

BEHAVIORAL ADAPTATIONS
These are things animals do to survive.
- Migration: animals travel to find food or warmth (birds flying south in winter).
- Hibernation: animals sleep through winter to save energy (bears, bats).
- Hunting in packs: wolves hunt together to catch larger prey.

PRACTICE QUESTIONS
1. The part of the plant that takes in water is the ________________.
2. A frog starts its life as an ________________ in water.
3. The life cycle stage of a moth after larva is the ________________.
4. A scar is an example of an ________________ trait.
5. The white fur of a polar bear is an example of ________________.
6. ________________ is a behavior where animals sleep through the winter.`
  },
  {
    id: 'ecosystems',
    title: 'Ecosystems',
    summary: 'Needs of living things, food chains, animal classification, and groups.',
    body: `ECOSYSTEMS

NEEDS OF LIVING THINGS
All living things have basic needs to stay alive.
- Air: animals need oxygen from the air. Plants need carbon dioxide for photosynthesis.
- Water: all organisms need water. Many chemical reactions in the body happen in water.
- Food: provides energy and building materials. Plants make their own food using sunlight; animals eat plants or other animals.
- Shelter: a safe place to live, hide from predators, and raise young.
- Sunlight: plants need sunlight to make food. It also provides warmth.

CARNIVORE, HERBIVORE OR OMNIVORE?
Animals can be grouped by what they eat.
- Carnivores: eat only meat. Examples: lion, eagle, shark.
- Herbivores: eat only plants. Examples: cow, rabbit, grasshopper.
- Omnivores: eat both plants and animals. Examples: human, bear, pig.

ANIMAL CLASSIFICATION
Scientists classify animals into groups based on their body structure.
- Mammals: have hair or fur, give birth to live young (mostly), produce milk (e.g., dog, whale, bat).
- Birds: have feathers, lay hard-shelled eggs, have a beak (e.g., eagle, penguin).
- Reptiles: dry scaly skin, lay soft-shelled eggs (e.g., snake, lizard, turtle).
- Amphibians: smooth moist skin, live in water and on land (e.g., frog, salamander).
- Fish: live in water, have gills, scales, and fins (e.g., tilapia, shark).
- Insects: three body parts (head, thorax, abdomen), six legs (e.g., ant, butterfly).

FOOD CHAINS AND WEBS
A food chain shows how energy moves from one living thing to another.
- Producer (plant) makes its own food using sunlight.
- Primary consumer (herbivore) eats the producer.
- Secondary consumer (carnivore) eats the primary consumer.
Example: grass → grasshopper → frog → snake.
A food web is many food chains connected together. If one part changes, it affects others.

ANIMAL GROUPS
Many animals live in groups. This helps them survive.
- Protection: staying together makes it harder for predators to attack (a herd of zebras).
- Hunting: wolves hunt in packs to catch larger prey.
- Sharing food: ants work together to carry food.
- Caring for young: elephants protect and teach their young.
Examples of group-living animals: bees (hive), lions (pride), fish (school).

PRACTICE QUESTIONS
1. The basic need that plants get from the soil is ________________.
2. An animal that eats both plants and meat is an ________________.
3. Birds have ________________ on their skin.
4. In a food chain, a plant is called a ________________.
5. A group of lions is called a ________________.
6. Living together in groups helps animals to ________________ from predators.`
  },
  {
    id: 'weather-climate',
    title: 'Weather and Climate',
    summary: 'Forecasting, weather data, climate vs weather, and weather hazards.',
    body: `WEATHER AND CLIMATE

WEATHER FORECASTING
Weather is the condition of the air outside at a certain time and place. Weather forecasting tells us what the weather will be like.
Tools used to measure weather:
- Thermometer: measures temperature (how hot or cold).
- Rain gauge: measures how much rain has fallen.
- Anemometer: measures wind speed.
- Weather vane (wind vane): shows wind direction.
- Satellite images: show cloud cover and storms from space.

READING WEATHER DATA
We collect weather data by recording:
- Temperature (°C or °F)
- Rainfall (millimetres)
- Wind speed and direction
- Cloud cover (sunny, partly cloudy, cloudy)
This data helps us understand weather patterns and plan our activities.

CLIMATE vs. WEATHER
Weather and climate are different.
- Weather: short-term changes in the air (today’s rain, yesterday’s sunshine).
- Climate: the average weather of a place over many years (e.g., Nairobi has a warm climate, the Arctic has a cold climate).

WEATHER HAZARDS
Some weather conditions can be dangerous.
- Floods: caused by too much rain. Water covers land, destroying homes and crops.
- Droughts: long periods without rain. Causes shortage of water and food.
- Strong winds / hurricanes: can blow off roofs, uproot trees.
- Lightning: a giant spark of electricity during a thunderstorm. It can cause fires and injure people.

DESIGN FOR WEATHER HAZARDS
We can protect ourselves from weather hazards.
- Flood barriers (sandbags, dams) hold back water.
- Lightning rods on buildings carry the lightning safely to the ground.
- Strong roofs are built to resist strong winds.
- Early warning systems use radios and sirens to alert people.

PRACTICE QUESTIONS
1. An instrument used to measure rainfall is a ________________.
2. Weather changes day to day, but ________________ is the average weather over many years.
3. A long period without rain is called a ________________.
4. A tall pole on a building that protects it from lightning is a ________________.
5. Too much rain can cause a ________________.
6. To measure how hot it is, we use a ________________.`
  },
  {
    id: 'earth-science',
    title: 'Earth Science',
    summary: 'Earth layers, volcanoes, biomes, and the Earth-Moon-Sun system.',
    body: `EARTH SCIENCE

LAYERS OF THE EARTH
The Earth is made of different layers, like an onion.
- Crust: the outermost layer. It is solid and thin. We live on it.
- Mantle: below the crust. It is made of hot, thick rock. Some parts are semi-liquid.
- Outer core: liquid metal (iron and nickel). Very hot!
- Inner core: solid metal ball at the centre. Hottest part of the Earth.

VOLCANOES
A volcano is a mountain that opens downward to a pool of molten rock below.
Parts of a volcano:
- Magma chamber: underground pool of magma (molten rock).
- Vent: the pipe through which magma travels up.
- Crater: the opening at the top where lava comes out.
- Lava: magma that reaches the Earth's surface.
- Ash cloud: fine rock particles and gases thrown into the air during an eruption.
When a volcano erupts, lava, ash and gases pour out.

EARTH'S BIOMES
A biome is a large region with a certain climate and certain types of plants and animals.
- Desert: very dry, hot days, cold nights. Plants: cacti. Animals: camels, scorpions.
- Forest: many trees, lots of rain. Tropical rainforests have diverse life.
- Grassland: mostly grass, few trees. Animals: zebras, lions.
- Tundra: cold, frozen ground. Plants: mosses, lichens. Animals: arctic foxes, caribou.
- Aquatic (water): freshwater (rivers, lakes) and marine (oceans).

EARTH, MOON AND SUN
- The Earth rotates (spins) on its axis once every 24 hours – this gives us day and night.
- The Earth orbits (goes around) the Sun once every 365¼ days – one year. This causes seasons.
- The Moon orbits the Earth roughly every 28 days. We see different moon phases.
- Tides are caused by the pull of the Moon’s gravity on Earth's oceans.

PRACTICE QUESTIONS
1. The outermost layer of the Earth is the ________________.
2. The liquid layer of the Earth is the ________________.
3. Magma that reaches the surface is called ________________.
4. A very dry biome with cacti is the ________________.
5. Day and night are caused by the Earth's ________________.
6. The Earth takes one ________________ to orbit the Sun.`
  },
  {
    id: 'forces-motion',
    title: 'Forces & Motion',
    summary: 'Balanced/unbalanced forces, gravity, friction, and patterns of motion.',
    body: `FORCES & MOTION

FORCE AND MOTION
A force is a push or a pull. Forces can make objects:
- Start moving (a push on a swing).
- Stop moving (brakes on a bicycle).
- Speed up (kicking a ball harder).
- Slow down (friction of the ground).
- Change direction (hitting a tennis ball).

BALANCED AND UNBALANCED FORCES
- Balanced forces are equal in size but opposite in direction. They cancel each other. The object stays still or moves at a constant speed (tug-of-war with equal teams – no movement).
- Unbalanced forces are not equal. They cause a change in motion (one team stronger – rope moves).

GRAVITY AND FRICTION
- Gravity is a force that pulls objects toward each other. Earth’s gravity pulls everything down. It keeps us on the ground and makes objects fall.
- Friction is a force that opposes motion between two surfaces that are touching. It slows things down. Smooth surfaces have less friction (ice); rough surfaces have more friction (carpet). Friction also produces heat (rubbing hands).

PATTERNS OF MOTION
Objects can move in different ways:
- Linear: in a straight line (car driving on a straight road).
- Rotational: turning around a fixed point (spinning top, fan blade).
- Oscillating: back and forth (swinging pendulum, child on a swing).
- Reciprocating: up and down or back and forth in a repeated pattern (piston in a pump).

PRACTICE QUESTIONS
1. A push or a pull is called a ________________.
2. When forces are equal and opposite, they are called ________________ forces.
3. The force that pulls objects towards the Earth is ________________.
4. The force that opposes motion between two surfaces is ________________.
5. A spinning wheel is an example of ________________ motion.
6. A child on a swing moves with ________________ motion.`
  },
  {
    id: 'electricity-magnetism',
    title: 'Electricity & Magnetism',
    summary: 'Magnets, electricity, static electricity, and contact/non-contact forces.',
    body: `ELECTRICITY & MAGNETISM

MAGNETS
A magnet is an object that attracts certain materials like iron, nickel, and cobalt.
- Every magnet has two poles: North (N) and South (S).
- Like poles repel (push away) each other: N-N or S-S.
- Unlike poles attract (pull together): N-S.
- The area around a magnet where its force can be felt is called the magnetic field.
- The Earth itself is a giant magnet with a North and South magnetic pole.

ELECTRICITY
Electricity is a form of energy. It can flow or build up.
- Current electricity: the flow of electric charges through a wire (like in a circuit). It powers lights, TVs, and phones.
- A circuit must be complete (closed) for current to flow. If there is a break (open circuit), no electricity flows.
- Static electricity: a build-up of electric charge on the surface of objects. It happens when two objects are rubbed together (e.g., rubbing a balloon on your hair makes your hair stand up). Lightning is a giant discharge of static electricity.

CONTACT AND NON-CONTACT FORCES
Forces can be grouped by whether they need to touch an object or not.
- Contact forces: act only when objects touch. Examples: friction (pushing a box), applied force (kicking a ball).
- Non-contact forces: act over a distance without touching. Examples: gravity (Earth pulling the moon), magnetism (magnet attracting a nail), static electricity (charged balloon attracting bits of paper).

PRACTICE QUESTIONS
1. A magnet has a North pole and a ________________ pole.
2. Like poles of a magnet ________________ each other.
3. Electricity that flows through wires is called ________________ electricity.
4. Rubbing a balloon on hair causes ________________ electricity.
5. A force that acts without touching is a ________________ force.
6. Friction is a ________________ force.`
  }
]

// ==================== CRE ====================
const CRE_TOPICS = [
  {
    id: 'cre-notes',
    title: 'Christian Religious Education (CRE) Notes',
    summary: 'God’s creation, caring for animals, worship, Bible stories, responsibilities, Holy Spirit, forgiveness, fair dealing, death and resurrection of Jesus.',
    body: `1. God created the____________ and everything in it
2. He created the dry land and called it ____________
3. The water that came together God called it ____________
4. On the third day God created all ____________
5. God send _____________ from the sky which makes plants to grow
6. Man uses plants for _________________
_________________
_________________
_________________
_________________
7. God created everything in ____________ days
8. He rested on ____________ day

CARING FOR ANIMALS (GEN 1:20-24) (PSALMS 148: 7-10)
1. All animals were created by ____________
2. Some animals live in the ____________ while others live on _____________ land
3. Animals that live at home are called _______________
4. Name four domestic animals _______________
________________
_________________
_________________
5. Animals that are live in the forest are called ____________
6. Name four wild animals ___________________
____________________
__________________
_________________
7. Sea animals and birds were created on ____________ day
8. Man was created on the ______________ day
9. Write three ways you can care for animals at home __________________
_________________
___________________
10. A _______________ treat sick animals

HOW GOD CARES FOR HIS CREATION (MATHEW 6:24-34)
1. Birds in the air are fed by _____________
2. God asked ______________ to take care of His creation
3. God cares for His creation by providing ___________ and ______________
4. we should not ____________ about what we shall eat tomorrow
5. God makes the flowers __________(ugly, beautiful)
6. God takes care of ___________ beings
7.God provides ____________ for the birds
8. God want us to take care of His ____________
9. Draw two things that God created

THE CHRISTIAN COMMUNITY
WORSHIPPING GOD AT HOME (PSALMS 92:1-2, DEUT 6:4-9)
1 We worship God at home when we ____________ (sleep, pray, rest)
2. We should worship God ____________ (all the times, when we need)
3. God want us to worship God by
_______________
_______________
______________
_______________
_______________
4. At home we can pray for ___________________
___________________
___________________
5. We should worship god always

Worshiping God in church (1 Sam 1:21-28, Luke 2:4-42)
1. God wants us to worship Him in the_________________
2. We worship God in church by
___________________
___________________
___________________
___________________
____________________
3.The family of Elikanah worshipped God in___________________ (Shiloh, Emmaus)
4. The wife of Elikanah was_____________
6.God gave her a boy called________________
7.Hannah dedicated Samuel to_____________________(church, temple)
8.Samuel served in the temple with priest_______________(Elikanah, Eli)

OBSERVING THE SABBATH/ LORDS DAY
GEN 2:1-3, Exodus 20:8-11
1. The lords’ day is also called ___________
2. God created everything in ___________ days
3. On the seventh day God __________
4. God blessed the seventh day and made it ____________
5. We keep the Sabbath day holy by
_____________
______________
______________
6. Christians worship God in a _____________
7. Muslims worship God in a ___________

TRADITIONAL WORSHIP
Africans names of God
1 in Africa there are __________ communities (one, many)
2. Every community has a _____________ name for God(different, same)
Community
Nandi
Luo
Luhya
Kamba
Kikuyu
Turkana
Maasai
Giriama
Gods name ______________
_______________
______________
________________
_________________
________________
________________
_________________
4. In Jews traditional Jesus means __________
5. God told Moses His name was ____________
6. Emmanuel means__________
7. Enkai means provider of ___________
8. God is called ___________ in my community

WORSHIPING GOD IN TRADITIONAL AFRICAN SOCIETY (EXO 23:14-19
NUMBER15:17-21)
1 Long ago people worshipped God in __________ places (same, different)
2. Some worshiped God
_______________
_______________
_______________
3. Write different times when people in traditional African society pray to God
______________
_______________
_______________
_______________
4. When worshiping God we should also give a __________ (offering, worship)
5. We should worship God in ___________ occasions (same, different)

SIMILARITIES AND DIFFERENCES OF WORSHIP IN TRADITIONAL AFRICAN
SOCIETY AND CHRISTIANITY
SIMILARITIES IN WAYS OF WORSHIP
1. They all worshipped __________
2. They both r_sp_ct_d God
3. They prayed during special ____________ (occasions, pray)
4. They sing when w__shi__ing

DIFFERENCES IN WAYS OF WORSHIP
TRADITIONAL SOCIETY
They offered an_m_ls
No b_pt_sm
Priest did not know how to read and __________
Worshipped God through a_c_st_rs
They worshipped in ______ and __________
Worshiping was done facing the s_n or m__nt__n

CHRISTIANITY
No animal is s_cr_f_ced
There is b__________
Priest can read and _____________
Worship the living ____________
Christians worship in _____________
They believe God and ________

THE BIBLE STORIES(MATHEW 1:16-18
The patriarchs Hebrews 11:17-24
1. The forefathers of Israel were called ___________
2. They are great men of ______________(love, fear)
3. Name six patriarchs of Israel _____________
_____________
______________
______________
______________
______________
4. __________ offered his son as sacrifice
5. God promised Abraham that he would make him the father pf a ___________ nation
6. The two sons of Isaac were ________ and ____________
7. Joseph became a governor in the land of ___________ (Israel, Egypt)
8. Moses was hidden by his parents for __________ months
9. With the help of God __________ freed the Israelites from Egypt

THE STORY OF DAVID AND GOLIATH (1 SAM17:41-54)
1. The philistines decided to fight the _________(Israelites, Egyptian)
2. The philistines were led by a giant called _________(David, Goliath)
3. David was the youngest son of __________ (Jesse, Solomon)
4. David killed Goliath with a _________ and ___________
5. David defeated the giant because he _________ in God(loved, trusted)
6. When we are faced with a problem we should ___________ in God (fear, trust)

THE STORY OF LYDIA(ACTS 16:11-15)
1. Lydia was a __________ woman
2. Lydia came from __________
3. She used to make purple ___________
4. She listened to the word of God from _____________ (peter, Paul)
5. Lydia was baptized by _________
6. She welcomed the ____________ to her home (neighbors, apostles)
7. God is happy when we welcome visitors

THE BIRTH OF JESUS CHRIST (MATHEW 1:18-23, HEB1:1-2, JOHN 3:16)
1 The birth of Jesus Christ was foretold many years ago by __________ (prophet, angel)
2. It was foretold by prophet _________ and __________
3. Jesus Christ was the only son of _________
4. The parents of Jesus were ____ and __________
5. He was born to save us from _________
6. Prophet Isaiah said he would be called _________
7. Emmanuel means ___________
8. God showed His great love to us through _________
9. Jesus suffered so that we could be ________ our sins

THE BIRTH OF JESUS CHRIST
MEANING OF ADVENT
1 The day we were born is called___________
2. Christians celebrate the ___________ of Jesus in the month of December
3. Time taken to prepare for Christmas is called ___________
4. Christians should prepare for Christmas by
____________
____________
____________
____________
____________
5. All preparations done should glorify Jesus Christ

GETTING READY FOR ADVENT (LUKE 3:4-6)
1. The coming of Emmanuel was prepared by --------------- 2. The parents of John the Baptist were _______ and _________
3. John came _________ Jesus Christ (after, before)
4. John was preaching in the desert of __________(Jordan, Judea)
5. He told people to prepare for the coming of Jesus by ___________ (repenting, forgetting)
6. John the Baptist was a ______ to Jesus (brother, cousin)
7. When we repent our sins we shall see God’s _____________ (salvation, peace)

SHARING THE JOY OF CHRISTMASS (LUKE 2:10)
1 The birth of Jesus brought ____________ to the people (joy, sorrow)
2. The good news about Jesus’ birth was brought to the shepherds by __________
3. The shepherds were taking care of their __________ during the night
4. When the angel appeared to the shepherd he told them not to be _______________ (jealous, afraid)
5. Jesus was born in the town of ____________
6. The first people to see baby Jesus were ___________

THE STORY OF THE BIRTH OF JESUS CHRIST(LUKE 2:1-20 MATHEW 1:18-24)
1. The parents of Jesus were __________ and __________
2. Mary was told by the _________ that he was going to have a baby
3. The angel told Joseph to call the baby __________ (Jehovah, Jesus)
4. Jesus means _____________ of the world
5. Mary and joseph had gone to ____________ to be counted
6. Baby Jesus was born in a __________
7. The second group to visit baby Jesus were the ______ (shepherds, wise men)
8. The wise men came from the _________
9. They were led by a _____________
10. Name the gifts they brought to Jesus ____________
____________
____________

WHAT WE SHARE DURING CHRISTMASS
1 The act of giving out what you have to others is __________
2. People should share as a sign of ______________ (joy, hatred, love)
3. Giving to the _____________ is a way of welcoming Jesus during Christmas (rich, poor)
4. God shares His ----with us (love, money)
5. He gave us His son __________ to die for us
6. We should learn to s___________

THE WORSHIPPING COMMUNITY
This is a community of Christians who love and praise God together

Ways of worshipping (1stthessolonian5:18 psalms100:4)
1 there is __________ ways of worshiping God (one, many)
2. Giving thanks and _________ God are some of them(praising, fighting)
3. Write four things that we thank God for ____________
____________
____________
____________
4. King _______ wrote a hymn for thanksgiving to the Lord (Saul, David)
5. We should enter the temple gate with ___________ (thanksgiving, worry)
6. We should go in to His courts with _________(sorrow, praise)

PRAISINGHIM (EXODUS15:1-18,2SAM 6:14)
1 Praising is a way of __________ God (worshipping, praise)
2. Name three ways of praising God
___________
___________
___________
3. King David led people into _________ for the Lord (crying, dancing)
4. We should be thankful to God in __________ circumstances (some, all)
5. __________ led the Israelites into dancing and praising God (Moses, Joshua)
6. Good actions include ____________
____________
____________
7. We should be _________ to others

DOING GOOD ACTION (MATHEW 7:9-12, 1 KING17:8-24)
1. Doing _________ action is a way of worshipping God (bad, good)
2. Name same of the good action
____________
_____________
_____________
______________
3. God sent Elijah to town at __________
4. The widow of zarephath lived with her ________ (son, daughter)
5. Two things Elijah asked from the widow (milk, bread, water, meat) _________
__________
6. Elijah raised the ________ of the widow (daughter, son)
7. God want us to do good actions ______ (sometimes, always)

FORGIVING OTHERS (MATH6:14-15, PSALMS 32)
1 _________means to stop feeling angry with those who have annoyed you
2. When we hurt other people we should ask for ________ (love, forgiveness)
3. God forgives us when we ________ others (hate, forgive)
4. When we forgive we live in ___________ (peace, piece)
5. We should learn to forgive

PRAYING PSALMS 4:8 DAN 6:11-24
1. Praying is a way of __________ God (worshipping, forgiving)
2. We talk to God through ________________ (bible, prayer)
3. Daniel was a man of __________ (Satan, God)
4. He prayed Yahweh ______________ times a day (four, three)
5. Daniel was thrown in the den of lions by king ____________ (David, Darius)
6. The lion did not eat Daniel
7. Daniel trusted in ___________(Darius, God)
8. We should trust in __________

WORSHIPPING GOD AT HOME AND AT CHURCH (PSALMS34:18 MATH28:20)
1At home we can worship God by _________
Reading the _____________
Singing_____________
Praying before_____________
Praying for the_____________
2. God want us to work for _____________days
3. We worship God______________(once, always)
4. God want us to worship Him by
Clapping our _____________
Shouting with_____________(fear, joy)
Blowing _____________(trumpet, drums)

UNIT 7
RENSPOSIBILITIES AND SERVICES
God given abilities(Mathew 25:14 – 28)
1. An _________ is what one can do very well
2. Abilities are given by _________
3. Abilities are also called special __________
4. The master called _________ servants and gave them different amount of money to trade
5. Each servant was given money according to their ________
6. The first servant got ________thousand coins
7. The second servant got ________thousand coins
8. The third servant got ______thousand coins
9. The master was unhappy with the __________servant

Responsibilities of children, teachers and parents
1. Children should _____and_________their parents
2. It is the responsibility of parents to provide their children with _________needs
3. Parents should teach children the ways of the
4. From the teacher the learners can learn to be
5. __________
__________
__________
___________

Qualities of a good leader
Helper and wiling toserve (Mathew 24: 45-50, mark10: 17-22, luke17:7-10)
1. Jesus was a good leader faithful and _________
2. A good leader follows Jesus_________
3. A good leader is always willing to share with the ________people (rich, poor)
4. A good leader is dedicated to work for __________
5. State five qualities of a good leader
6. ___________
___________
___________
___________
____________

A good leader should not steal (mark10:19)
Stealing is not good
A good leader does not steal
God commands us not to
Commit murder
Commit adultery
Not steal
Not accuse anyone falsely
Do not cheat
Respect your father and mother
God commands us to obey his commandments
There are 10 commandments
The greatest commandment is love

A good leader is not afraid to tell the truth (luke15:11-24)
1. Telling the truth is being honest
2. Telling lies is against God’s commandments
3. A good leader should always tell the truth
4. In the story of the prodigal son the father had _______sons
5. The younger son asked for hisshare of property
6. The son sold his property and went to a far country
7. He spent his money ________ (wisely, badly)
8. His father welcomed him back and forgave him
9. The prodigal son fed with the pigs
10. A good leader does not cheat
11. ______is making someone believe what is not true (respect, cheating)
12. In the town of_________Jesus forgave the sick

UNIT 8
SPIRIT FILLED PEOPLE
The promise of Holy Spirit by Jesus
- The Holy Spirit is the helper - The Holy Spirit helps us to understand God’s teaching
- The Holy Spirit lives in us - It is good to keep a promise - Jesus promised the disciples the Holy Spirit - The Holy Spirit is the spirit of God in us - I will thank God for the Holy Spirit - Memorize john 14:16
- How the disciples prepared for the coming of the Holy Spirit - The Holy Spirit is our helper - The disciples waited for the Holy Spirit in a town called Jerusalem
- They waited for the Holy Spirit by being patient and praying together - We should pray with other people - I will wait for the Holy Spirit patiently
- We prepare for the Holy Spirit by
- Praying
- Repenting

DAY OF PENTECOST (ACTS2:1-4)
- These is the day the helper came - The Holy Spirit came in form of __________of fire (river, tongue) - The disciples spoke in different language but they understood each other - The Holy Spirit came on the day f Pentecost - The Holy Spirit gives us power - The Israelites celebrated Pentecost once a year - A strong wind and tongues of fire were signs of the Holy Spirit touched them
- Peter stood up and preached to the many people when the helper came

THE WORK OF THE HOLY SPRIT
- The Holy Spirit gives us courage - The Holy Spirit removes fear and gives us courage - He helps us to perform miracles - Holy Spirit changed peter from a coward to a brave apostle - Prophet Joel had said that God would send his holy spirit to all people - The Holy Spirit gave the disciple strength to
- Heal the sick
- Preach the good news - Strike out demons - Perform miracles

The Holy Spirit gives us ability to share (Acts2:44-47)
- Sharing is giving some of what you have to somebody else - We are supposed to share what we have - It is our Christian duty to share - There is happiness in giving than in receiving
- The Holy Spirit gives us ability to work hard

TOLERANCE AND FORGIVENESS
How it feels to be unforgiven
When one is not forgiven he feels - Rejected
- Hurt - Sad
- Hated
- Humiliated
God lives us and merciful
God judges those who sin against Him
When God forgives us we feel happy and free
God will forgive us our mistakes if we confess
When we sin against God we feel guilty and sad

HOW GOD JUDGES THE UNFORGIVING
1. We should forgive those who wrong us
2. When we do not forgive others they suffer
3. We should forgive and forget
4. When we forgive we are at peace with God and others
5. Jesus taught that we should forgive______times__________times
6. Forgiving seven times seventy means forgiving all times
7. It feels good to be forgiven
8. When we forgive other people God is happy with us
9. It is our Christian duty to forgive others
10. Complete happy are those whose________are forgiven, whose wrongs are________

Ways people were forgiven In TAS
- Elders met helped the two parties and sacrificed a goat - People ate together - They shook hands in the presence of the elders - Person in the wrong was - Fined
- Punished
- Asked to apologize - The two parties could also take oaths to show forgiveness

UNIT 9
THOSE WHO ARE FORGIVEN BY GOD
1. Jesus forgives those who ask for forgiveness
2. When we make mistakes we must ask for forgiveness
3. Two people went to pray, a Pharisee and a tax collector
4. The Pharisee beat his chest and told God how ______he was
5. He told God that he was ________than everybody else
6. He said he gives to the________and he fasts
7. The ______was very humble before God
8. He asked God for __________
9. God listened to the prayers of the ________but did not to the Pharisee
(Tax, collector, poor, better, good, pray, forgiveness)

Meaning of tolerance
- It means coping with others the way they are - Do not judge others so that God does not judge you
- Tolerance helps us to keep our friends
- When we are able to tolerate each other we are able to live in
- Humility
- Peace - Good relationship

Importance of tolerance (romans5:3-4)
- Tolerance is being patient in difficult times
- We respect others
- Creates hope
- Help us to forgive
- Leads to good relationship at home, in the school and at home

UNIT 10
FAIR DEALING
The meaning of fairness (micah6:8
- Being_______is treating everyone equally
- To be fair we must treat people the same way
- God treats people fairly
- We are all equal in the eyes of God
- We should treat each another the same way or fairly
- God expects us to do what is just
- Doing what is just is being fair

FAIR DEALING
Ways of acting fair
- Fairness means treating other equally
- Doing well to others is an act of fairness
- We should treat people the same way whether they are
- Rich or poor
- Sick or healthy
- Boys or girls
- Young or old
- Disabled or not
- People can act fairly by
- Showing love
- Helping others
- Being kind
- Being polite
- Sharing what we have

Reasons why people act unfairly (1 king21 1-9)
- Ahab was a king in Israel
- Ahab’s wife was s jezebel
- King Ahab wanted Jabot’s vineyard
- Naboth told King Ahab that land belonged to his ancestors
- Jezebel planned Nabboth’s death
- King Ahab and Jezebel were unfair to Jabot
- They were punished by God
- King Ahab was
- Selfish
- Cruel
- Greedy
- It is not good to be unfair to other people
- How unfairness can be corrected
- By treating others badly we are unfair
- Unfairness can be corrected by
- Obeying God’s commandments
- Being polite
- Respecting other people
- Being loving
- Being kind
- Helpful to the needy
- We should be willing to act fairly

Reasons why people cheat
- Cheating is telling a lie or giving false information
- People cheat
- To avoid punishment
- Fear
- Selfishness
- To win a game
- For revenge
- Jabot died because Jezebel cheated about him
- Abraham and Sara had gone to Egypt
- Abram told Sarah to cheat to the Egyptian that she was his sister
- He feared to be treated unfairly
- We should tell the truth all the time

Joseph and his brothers
Why his brothers acted unfairly
- Joseph had 11 brothers
- His father was Jacob
- Jacob loved Joseph most
- The brothers of Joseph were jealous of him
- They treated him unfairly
- They threw him in a dry well
- Joseph was later sold to the traders
- The brothers of Joseph acted unfairly
- God wants us to treat others fairly

How Joseph behaved as a slave in Egypt (gen40:1-23)
- Famine is a long period of time without food and water
- Joseph as put in prison by Potiphar’s wife
- In prison, he interpreted dreams for the two prisoners
- God was with Joseph in Egypt
- God made Joseph a ruler
- Joseph acted fairly in giving the meaning of dreams
- We should treat others fairly
- We should be kind, helpful and faithful to others

How Joseph behaved his brothers came inEgypt (gen42:1-24)
- Joseph did not take revenge against his brothers
- He showed love and kindness to his brother
- His brothers came to buy food in Egypt
- His family came to Egypt and settled in Goshen
- Joseph did not blame his brothers for selling him to slavery
- We should be willing to forgive those who wrong us

How we should behave towards people who are fair and unfair to us
- We should love and respect those who treat us fairly
- We should love, forgive and pray for those who treat us unfairly
- God wants us to be fair and show love to others
- God is unhappy when we are unfair to others\we should be willing to treat others fairly

THE DEATH AND RESSURECTION OF JESUS
Joy and sorrow in life (philipians4:4-6)
- Some things make us happy and others sad
- We are happy when
- We obey our parents
- We receive gifts
- We are sad when
- We fail exam
- Are sick
- Our friends wrong us
- The disciples were sad when Jesus told them he would die
- They were happy when Jesus told them he would rise
- God want us to be joyful all the time
- He wants us to pray for things the make us sad
- God will answer our prayers

Judas Iscariot betrays Jesus
- Judas was one of the disciples of Jesus Christ
- He was given money so the he could betray Jesus
- He betrayedJesus with a kiss
- He was paid 30 silver coins
- God is not happy when we betray other people
- We should avoid betraying others

The people who condemned Jesus Christ
(mathew27:15-26)
- To condemn is to blame others for something you think they have done wrong
- Jesus was accused falsely by
- Chief priest
- Elders
- The crowd
- The Pilate
- Jesus was innocent
- He was condemned to death
- Barabbas a prisoner was set free instead of Jesus
- Jesus was crucified for our sins
- God is unhappy when we condemn innocent people
- Simon of Cyrene helps Jesus carry the cross
- Jesus was crucified at a place called Golgotha or Calvary
- Solders led Jesus to be crucified
- He was crucified with two thieves
- One of the thieves asked for forgiveness
- Jesus asked God to forgive those who wronged him
- We should thank God for the death and resurrection of Jesus

The meaning of resurrection of Jesus
Resurrection means to come back to life after death
Jesus rose after three days
He appeared to clops and another disciple on their way to Emmaus
He appeared to His 11 disciples
He showed them the scars in his hands and feet
He also ate a piece of cooked fish
The disciples were full of joy
Christians celebrate Jesus’ resurrection during
Easter by
Going to church
Visiting the needy
Cooking special food
We should thank God for the resurrection`
  }
]

// ==================== HYGIENE & NUTRITION ====================
const HYGIENE_NUTRITION_TOPICS = [
  {
    id: 'personal-hygiene',
    title: 'Personal Hygiene',
    summary: 'Cleanliness of the body, teeth, hands, hair, and nails.',
    body: `PERSONAL HYGIENE

Personal hygiene means keeping our bodies clean. It helps us stay healthy and prevents diseases.

Ways to keep our bodies clean
1. Take a bath every day using soap and water.
2. Brush your teeth after meals and before bedtime.
3. Wash your hands before eating and after visiting the toilet.
4. Comb your hair daily and keep it neat.
5. Trim your nails short and keep them clean.

Importance of personal hygiene
- It removes dirt and germs from our bodies.
- It prevents bad smells.
- It keeps us healthy and strong.
- It makes us look smart and feel good.

HAND WASHING
We should wash our hands:
- Before eating
- After using the toilet
- After playing
- After touching animals
The best way to wash hands is using clean running water and soap.

TEETH CARE
We use a toothbrush and toothpaste to clean our teeth. We should brush our teeth at least twice a day. Eating too many sugary foods can cause tooth decay. We should visit a dentist regularly.

HAIR CARE
We should wash our hair with clean water and shampoo. Combing our hair removes tangles. We should not share combs because this can spread lice.

NAIL CARE
Keeping nails short and clean prevents germs from hiding under them. Biting nails is a bad habit because it can introduce germs into our mouths.

PRACTICE QUESTIONS
1. Keeping our bodies clean is called ________________.
2. We should take a bath every ________________.
3. After visiting the toilet we should wash our ________________.
4. We brush our teeth using a ________________ and ________________.
5. Too many sugary foods can cause ________________.
6. Sharing combs can spread ________________.
7. Biting nails can introduce ________________ into our bodies.`
  },
  {
    id: 'food-and-nutrition',
    title: 'Food and Nutrition',
    summary: 'Types of food, balanced diet, healthy eating habits, and food safety.',
    body: `FOOD AND NUTRITION

Food is what we eat to grow, get energy, and stay healthy. The body needs different types of food.

Types of food
- Body-building foods (proteins): meat, fish, eggs, beans, milk. They help us grow and repair our bodies.
- Energy-giving foods (carbohydrates and fats): maize, rice, potatoes, bread, cooking oil. They give us strength to play and work.
- Protective foods (vitamins and minerals): fruits and vegetables such as oranges, spinach, carrots. They protect us from diseases.

A balanced diet
A balanced diet contains all the three types of food in the right amounts. A plate should have:
- One part body-building food
- One part energy-giving food
- Two parts protective foods (fruits and vegetables)

Healthy eating habits
- Eat a variety of foods.
- Eat regular meals (breakfast, lunch, supper).
- Drink plenty of clean water.
- Avoid too many sugary snacks and drinks.
- Chew food well before swallowing.

Food safety
- Wash fruits and vegetables before eating.
- Cook food thoroughly to kill germs.
- Store food in clean, covered containers.
- Do not eat food that has fallen on the ground.
- Wash hands before handling food.

Water in nutrition
Water is very important. It helps to:
- Digest food
- Keep the body cool
- Remove waste from the body
We should drink at least 6-8 glasses of clean water every day.

PRACTICE QUESTIONS
1. Foods that give us energy are called ________________.
2. Meat, fish, and beans are examples of ________________ foods.
3. Fruits and vegetables protect us from ________________.
4. A meal that contains all three types of food is called a ________________.
5. We should drink at least ________________ glasses of water daily.
6. Before eating fruits they should be ________________.
7. Cooking food thoroughly helps to kill ________________.`
  },
  {
    id: 'common-illnesses',
    title: 'Common Illnesses and Prevention',
    summary: 'Causes, symptoms, and prevention of common illnesses.',
    body: `COMMON ILLNESSES AND PREVENTION

An illness is when our body is not working well. Many illnesses can be prevented by good hygiene and healthy habits.

Common illnesses in children
- Diarrhoea: passing loose watery stool. It is caused by germs from contaminated food or water. Signs include stomach pain and weakness. We can prevent it by drinking clean water, washing hands, and eating well-cooked food.
- Malaria: a disease spread by female anopheles mosquitoes. Signs include fever, headache, and vomiting. We prevent it by sleeping under treated mosquito nets, clearing bushes around the home, and draining stagnant water.
- Colds and flu: caused by viruses. Signs include running nose, coughing, sneezing. We prevent them by avoiding close contact with sick people and washing hands often.
- Skin infections (e.g., ringworm): caused by fungi. Signs include itchy patches on the skin. We prevent them by keeping our skin clean and dry, and not sharing personal items.

How diseases spread
- Through dirty hands
- Through contaminated food and water
- Through insect bites
- Through the air when a sick person coughs or sneezes

General prevention of illnesses
- Wash hands with soap and clean water.
- Eat balanced meals to keep the body strong.
- Sleep under a mosquito net.
- Keep the environment clean.
- Go to the hospital for treatment when sick.

PRACTICE QUESTIONS
1. Loose watery stool is a sign of ________________.
2. Malaria is spread by ________________ mosquitoes.
3. We can prevent malaria by sleeping under a ________________.
4. Colds and flu are caused by ________________.
5. Ringworm is a disease of the ________________.
6. One way to prevent illness is to eat ________________ meals.
7. When we are sick we should go to the ________________.`
  },
  {
    id: 'kitchen-safety',
    title: 'Kitchen and Food Safety',
    summary: 'Safety in the kitchen, handling food, and cleanliness.',
    body: `KITCHEN AND FOOD SAFETY

The kitchen is where we prepare food. It must be kept clean and safe.

Keeping the kitchen clean
- Sweep and mop the floor daily.
- Wash cooking utensils with soap and clean water after use.
- Cover food to keep away dust, flies, and other insects.
- Keep rubbish in a bin with a lid.

Safety rules in the kitchen
- Do not run or play in the kitchen.
- Do not touch sharp objects like knives without an adult’s help.
- Keep handles of pots turned inward on the stove to avoid knocking them over.
- Do not touch electrical sockets or wires with wet hands.
- Always ask an adult before lighting the stove or jiko.

Storing food safely
- Perishable foods like milk, meat, and vegetables should be kept in a cool place or refrigerator.
- Dry foods like maize, beans, and flour should be stored in airtight containers.
- Do not store food near chemicals like soap or paraffin.

Cleanliness when handling food
- Wash hands before touching food.
- Use clean plates and cups.
- Do not cough or sneeze on food.
- Keep hair covered or tied back when cooking.

PRACTICE QUESTIONS
1. The room where we prepare food is the ________________.
2. We should wash cooking utensils with ________________ and water.
3. Rubbish in the kitchen should be kept in a ________________.
4. To avoid accidents, pot handles should be turned ________________.
5. We must not touch electrical sockets with ________________ hands.
6. Milk and meat should be kept in a ________________ place.
7. Before touching food we should wash our ________________.`
  },
  {
    id: 'safety-environment',
    title: 'Safety at Home and School',
    summary: 'Dangers at home and school, and how to stay safe.',
    body: `SAFETY AT HOME AND SCHOOL

Safety means being free from danger. We must learn to keep ourselves safe at home and at school.

Safety at home
- Do not play with fire, matches, or lighters.
- Do not touch electric wires or sockets.
- Keep away from hot liquids and pots.
- Do not climb on chairs or tables without an adult.
- Store medicines and chemicals out of reach of children.

Safety at school
- Walk, do not run, in the corridors.
- Do not push others when playing.
- Use stairs carefully, holding the handrail.
- Do not put small objects in your mouth, nose, or ears.
- Report any danger to a teacher immediately.

Fire safety
- If you see a fire, shout for help.
- Do not hide; go outside to a safe place.
- Know the emergency exits at home and school.
- Never play with matches or lighters.

Road safety
- Always walk on the right side of the road facing oncoming traffic.
- Cross the road at a zebra crossing or where it is safe.
- Look left, right, and left again before crossing.
- Do not play on the road.
- Wear bright clothing when walking at night.

PRACTICE QUESTIONS
1. Being free from danger is called ________________.
2. At school we should walk and not ________________ in corridors.
3. When you see a fire, you should shout for ________________.
4. We should never play with ________________ or lighters.
5. Before crossing the road we look left, right, and ________________ again.
6. At night, we should wear ________________ clothing to be seen.
7. Any danger at school should be reported to the ________________.`
  },
  {
    id: 'hygiene-summary',
    title: 'Summary and Revision',
    summary: 'Review of all hygiene and nutrition topics.',
    body: `SUMMARY AND REVISION

Fill in the blanks with the correct word from the choices given.

1. We take a bath to remove dirt and _____________ (germs, food).
2. A balanced diet has _____________ types of food (two, three).
3. Oranges and spinach are _____________ foods (protective, energy-giving).
4. Malaria is spread by _____________ (flies, mosquitoes).
5. A _____________ is used to brush teeth (toothbrush, comb).
6. Before eating fruits we must _____________ them (cook, wash).
7. The kitchen floor should be swept _____________ (daily, weekly).
8. Medicines should be kept _____________ reach of children (within, out of).
9. To cross the road safely, use a _____________ crossing (zebra, dog).
10. Water helps to remove _____________ from the body (waste, food).

Complete the sentences below.
11. Body-building foods help us to ________________ and repair the body.
12. We should brush our teeth at least ________________ a day.
13. Diarrhoea can be prevented by drinking ________________ water.
14. In the kitchen, pot handles should be turned ________________ to avoid accidents.
15. When someone is sick, we should take them to the ________________.
16. Lice can spread by sharing ________________.
17. A disease caused by fungi that affects the skin is ________________.
18. We should keep our nails ________________ and clean.
19. Food that has fallen on the ________________ should not be eaten.
20. Walking on the ________________ side of the road helps us see traffic.`
  }
]
function Grade3MathNotes() {
  const [search, setSearch] = useState('')
  const filtered = MATH_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 Mathematics Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Numbers to 1000, addition and subtraction with regrouping, multiplication, division, fractions and measurement</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

function Grade3EnglishNotes() {
  const [search, setSearch] = useState('')
  const filtered = ENGLISH_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 English Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Grammar units on verbs, phrasal verbs and review practice</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

function Grade3KiswahiliNotes() {
  const [search, setSearch] = useState('')
  const filtered = KISWAHILI_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 Kiswahili Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Masomo ya muhula wa kwanza na wa pili, pamoja na insha</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

function Grade3EnvironmentalNotes() {
  const [search, setSearch] = useState('')
  const filtered = ENVIRONMENTAL_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 Environmental Activities Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Physical environment, communities, needs, resources and administration</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

function Grade3ScienceNotes() {
  const [search, setSearch] = useState('')
  const filtered = SCIENCE_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 Science Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Living things, ecosystems, weather, earth science, forces and electricity</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

function Grade3CRENotes() {
  const [search, setSearch] = useState('')
  const filtered = CRE_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 CRE Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Christian Religious Education notes and fill-in revision</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

function Grade3HygieneNutritionNotes() {
  const [search, setSearch] = useState('')
  const filtered = HYGIENE_NUTRITION_TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  )
  const card = { background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', marginBottom:'12px' }
  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--text)', margin:'0 0 4px' }}>Grade 3 Hygiene & Nutrition Notes</h1>
        <p style={{ fontSize:'.875rem', color:'var(--sub)', margin:0 }}>Personal hygiene, food and nutrition, illness prevention, and safety</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics..." style={{width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', padding:'12px 16px', color:'var(--text)', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box'}} />
      {filtered.map(t => (
        <div key={t.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'var(--text)', margin:0, fontSize:'.95rem' }}>{t.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>Grade 3</span>
          </div>
          <p style={{ color:'var(--sub)', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{t.summary}</p>
          <div style={{ color:'var(--text)', fontSize:'.9rem', lineHeight:1.85 }}>{t.body.split('\n\n').map((p,i)=><p key={i} style={{marginBottom:'14px'}}>{p}</p>)}</div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:'center', padding:'48px', color:'var(--text)'}}><p style={{fontWeight:600,margin:0}}>No topics found</p></div>}
    </div>
  )
}

export default function AllGrade3Notes() {
  const [activeSubject, setActiveSubject] = useState(null)

  const subjects = [
    { id: 'math',          label: 'Mathematics',             short: 'M',  desc: 'Numbers, operations, fractions and geometry',    color: '#6366f1', Component: Grade3MathNotes },
    { id: 'english',       label: 'English',                 short: 'E',  desc: 'Verbs, phrasal verbs and grammar practice',       color: '#0ea5e9', Component: Grade3EnglishNotes },
    { id: 'kiswahili',     label: 'Kiswahili',               short: 'K',  desc: 'Sarufi, msamiati na insha',                      color: '#10b981', Component: Grade3KiswahiliNotes },
    { id: 'environmental', label: 'Environmental Activities', short: 'EA', desc: 'Environment, communities and resources',          color: '#f59e0b', Component: Grade3EnvironmentalNotes },
    { id: 'science',       label: 'Science',                 short: 'Sc', desc: 'Living things, forces and earth science',         color: '#8b5cf6', Component: Grade3ScienceNotes },
    { id: 'cre',           label: 'CRE',                     short: 'C',  desc: 'Christian Religious Education notes',             color: '#ef4444', Component: Grade3CRENotes },
    { id: 'hygiene',       label: 'Hygiene & Nutrition',     short: 'H',  desc: 'Health, food safety and cleanliness',             color: '#06b6d4', Component: Grade3HygieneNutritionNotes },
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>
          Grade 3 Notes
        </h1>
        <p style={{ color: 'var(--sub)', fontSize: '.875rem', margin: 0 }}>
          Select a subject to read your notes
        </p>
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
              transition: 'box-shadow 0.15s',
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
            <div style={{ color: 'var(--sub)', fontSize: '1.3rem', flexShrink: 0 }}>
              &#8250;
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}