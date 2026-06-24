import { useState, useMemo, useEffect } from 'react'

// ======================= DATA ==========================
// 🟢 PASTE YOUR EXISTING GRADES ARRAY HERE (unchanged)
const GRADES = [

  // ═══════════════════ GRADE 1 ═══════════════════
  {
    id: 'grade1',
    label: 'Grade 1',
    color: '#2e7d32',
    topics: [
      {
        topic: 'Numbers & Counting',
        icon: '🔢',
        items: [
          { name: 'Counting Forward', formula: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ...', example: 'Start at 5 → 5, 6, 7, 8, 9, 10', explain: 'Count on from any number. Start at any position and keep adding one to reach the next number.' },
          { name: 'Counting Backward', formula: '10, 9, 8, 7, 6, 5, 4, 3, 2, 1', example: 'Start at 8 → 8, 7, 6, 5, 4 ...', explain: 'Count down from any number. Start at any position and keep subtracting one.' },
          { name: 'Addition (Sum)', formula: 'a + b = Sum', example: '3 + 4 = 7', explain: 'Put groups together to find the total. Addition combines two or more numbers into one larger number.' },
          { name: 'Subtraction (Difference)', formula: 'a − b = Difference', example: '7 − 3 = 4', explain: 'Take away to find what is left. Subtraction removes one number from another to find the difference.' },
          { name: 'Place Value — Tens & Ones', formula: 'Number = (Tens × 10) + Ones', example: '34 = 3 tens + 4 ones = 30 + 4', explain: 'The position of a digit shows its value. A digit in the tens place is worth ten times more than in the ones place.' },
          { name: 'Comparing Numbers', formula: 'a > b  (greater)\na < b  (less)\na = b  (equal)', example: '7 > 4     2 < 9     5 = 5', explain: 'Use the symbols <, > and = to compare numbers. The open end of the symbol always points to the larger number.' },
          { name: 'Ordinal Numbers', formula: '1st, 2nd, 3rd, 4th, 5th, 6th ...', example: '1st = first,  2nd = second,  3rd = third', explain: 'Ordinal numbers show the position of something in a list. They tell us the order, not the quantity.' },
          { name: 'Even & Odd Numbers', formula: 'Even: 0, 2, 4, 6, 8 ...\nOdd:  1, 3, 5, 7, 9 ...', example: '4 is even (pairs exactly),  7 is odd (one left over)', explain: 'Even numbers can be split into two equal groups with nothing left over. Odd numbers always have one left over when split in two.' },
        ],
      },
      {
        topic: 'Basic Shapes (2D)',
        icon: '🔷',
        items: [
          { name: 'Circle', formula: 'Round shape — no corners, no straight sides', example: '', explain: 'A circle is a perfectly round closed curve. Every point on a circle is the same distance from the centre.' },
          { name: 'Square', formula: '4 equal sides, 4 right-angle corners', example: '', explain: 'A square has all four sides exactly the same length. All four corners are right angles of 90 degrees.' },
          { name: 'Triangle', formula: '3 sides, 3 corners (vertices)', example: '', explain: 'A triangle has three sides and three angles. The three angles of any triangle always add up to 180 degrees.' },
          { name: 'Rectangle', formula: '2 long sides + 2 short sides; 4 right-angle corners', example: '', explain: 'A rectangle has opposite sides that are equal and parallel. All four corners are right angles.' },
        ],
      },
      {
        topic: 'Measurement (Comparing)',
        icon: '📏',
        items: [
          { name: 'Comparing Length', formula: 'Long / Short     Tall / Taller / Tallest', example: '', explain: 'Use describing words to compare lengths. We can say something is longer, shorter, taller, or the same length.' },
          { name: 'Comparing Mass (Weight)', formula: 'Heavy / Light     Heavier / Lighter', example: '', explain: 'Compare how heavy objects are. We use a balance scale to find which object is heavier or lighter.' },
          { name: 'Comparing Capacity', formula: 'Full / Empty     More / Less', example: '', explain: 'Capacity is how much a container can hold. We compare containers to find which holds more or less.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 2 ═══════════════════
  {
    id: 'grade2',
    label: 'Grade 2',
    color: '#1565c0',
    topics: [
      {
        topic: 'Number Operations',
        icon: '➕',
        items: [
          { name: 'Addition with Carrying (Regrouping)', formula: 'Ones → Tens → Hundreds (carry when ≥ 10)', example: '45 + 37 = 82  (5+7=12 → write 2, carry 1)', explain: 'When ones add to 10 or more, carry 1 to the tens column. This is called regrouping because we regroup 10 ones into 1 ten.' },
          { name: 'Subtraction with Borrowing', formula: 'Borrow 1 ten = 10 ones when ones are not enough', example: '52 − 28 = 24  (borrow from tens)', explain: 'When you cannot subtract the ones, borrow 1 ten from the tens column. Borrowing 1 ten gives you 10 extra ones.' },
          { name: 'Multiplication as Repeated Addition', formula: 'a × b = a + a + ... (b times)', example: '3 × 4 = 4 + 4 + 4 = 12', explain: 'Multiplication is a quick way to add equal groups. Three groups of four is the same as adding four three times.' },
          { name: 'Number Patterns (Skip Counting)', formula: 'Count by 2s: 2, 4, 6, 8 ...\nCount by 5s: 5, 10, 15, 20 ...\nCount by 10s: 10, 20, 30 ...', example: '', explain: 'Skip counting means jumping by the same amount each time. It is the foundation for learning multiplication tables.' },
        ],
      },
      {
        topic: 'Simple Fractions',
        icon: '½',
        items: [
          { name: 'Half (½)', formula: '½ = 1 part out of 2 equal parts', example: 'Cut a pizza into 2 equal pieces → each = ½', explain: 'A half means one of two equal parts. The two parts must be exactly the same size.' },
          { name: 'Quarter (¼)', formula: '¼ = 1 part out of 4 equal parts', example: 'Cut into 4 equal pieces → each = ¼', explain: 'A quarter means one of four equal parts. Four quarters make one whole.' },
          { name: 'Third (⅓)', formula: '⅓ = 1 part out of 3 equal parts', example: 'Cut into 3 equal pieces → each = ⅓', explain: 'A third means one of three equal parts. Three thirds make one whole.' },
        ],
      },
      {
        topic: 'Standard Units of Measurement',
        icon: '📏',
        items: [
          { name: 'Length', formula: '100 cm = 1 m\n1000 m = 1 km', example: 'A ruler = 30 cm;  a classroom ≈ 8 m', explain: 'Use centimetres for small things, metres for bigger objects, and kilometres for distances between places.' },
          { name: 'Mass', formula: '1000 g = 1 kg', example: 'An apple ≈ 200 g;  a bag of flour = 2 kg', explain: 'Use grams for light items and kilograms for heavy items. There are 1000 grams in one kilogram.' },
          { name: 'Capacity / Volume', formula: '1000 ml = 1 litre', example: 'A cup ≈ 250 ml;  a water bottle = 1 litre', explain: 'Use millilitres for small amounts of liquid and litres for bigger amounts. There are 1000 millilitres in one litre.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 3 ═══════════════════
  {
    id: 'grade3',
    label: 'Grade 3',
    color: '#e65100',
    topics: [
      {
        topic: 'Multiplication & Division',
        icon: '✖️',
        items: [
          { name: 'Commutative Law of Multiplication', formula: 'a × b = b × a', example: '4 × 6 = 6 × 4 = 24', explain: 'You can swap the numbers in multiplication and still get the same answer. The order of the factors does not change the product.' },
          { name: 'Associative Law of Multiplication', formula: '(a × b) × c = a × (b × c)', example: '(2 × 3) × 4 = 2 × (3 × 4) = 24', explain: 'Grouping does not change the product. You can choose which pair of numbers to multiply first.' },
          { name: 'Zero Property', formula: 'a × 0 = 0', example: '9 × 0 = 0     0 × 100 = 0', explain: 'Any number multiplied by zero equals zero. Zero groups of anything is nothing.' },
          { name: 'Identity Property', formula: 'a × 1 = a', example: '7 × 1 = 7     1 × 55 = 55', explain: 'Any number times one stays the same. Multiplying by one does not change a number.' },
          { name: 'Division', formula: 'a ÷ b = c   means   b × c = a', example: '20 ÷ 4 = 5   because 4 × 5 = 20', explain: 'Division shares a total equally into groups. Division and multiplication are inverse operations of each other.' },
          { name: 'Division with Remainder', formula: 'a ÷ b = quotient remainder r\n(where 0 ≤ r < b)', example: '17 ÷ 5 = 3 remainder 2   (check: 5×3+2=17 ✓)', explain: 'The remainder is what is left over when a number does not divide evenly. The remainder is always less than the divisor.' },
          { name: 'Fact Families (× and ÷)', formula: 'a × b = c\nc ÷ a = b\nc ÷ b = a', example: '3×5=15  →  15÷3=5  →  15÷5=3', explain: 'Multiplication and division are inverse operations. Three related facts form a fact family.' },
        ],
      },
      {
        topic: 'Fractions',
        icon: '🍕',
        items: [
          { name: 'Fraction Notation', formula: 'Fraction = Numerator / Denominator\n= Parts you have / Total equal parts', example: '¾ means 3 of 4 equal parts', explain: 'The top number (numerator) shows how many parts you have. The bottom number (denominator) shows the total number of equal parts.' },
          { name: 'Equivalent Fractions', formula: 'a/b = (a×n)/(b×n)', example: '½ = 2/4 = 3/6 = 4/8', explain: 'Equivalent fractions show the same amount even though they look different. Multiply or divide both top and bottom by the same number.' },
          { name: 'Comparing Fractions (Same Denominator)', formula: 'a/c > b/c   when  a > b', example: '3/5 > 2/5', explain: 'With the same denominator compare the numerators. A bigger numerator means a bigger fraction when the denominator is the same.' },
          { name: 'Unit Fractions', formula: '1/n  (numerator is always 1)', example: '½, ⅓, ¼, ⅕, ⅙ ...', explain: 'A unit fraction has 1 as the numerator. The larger the denominator, the smaller the fraction.' },
        ],
      },
      {
        topic: 'Perimeter',
        icon: '📐',
        items: [
          { name: 'Perimeter of Any Shape', formula: 'P = sum of all sides', example: 'Triangle sides 3+4+5 = 12 cm', explain: 'Perimeter is the total distance around the outside of a shape. Add the length of every side.' },
          { name: 'Perimeter of Square', formula: 'P = 4 × s', example: 's = 5 cm  →  P = 4 × 5 = 20 cm', explain: 'A square has four equal sides so multiply one side length by four. The letter s stands for the side length.' },
          { name: 'Perimeter of Rectangle', formula: 'P = 2 × (l + w)', example: 'l=6 cm, w=3 cm  →  P = 18 cm', explain: 'A rectangle has two pairs of equal sides. Add the length and width then multiply by two.' },
        ],
      },
      {
        topic: 'Time',
        icon: '⏰',
        items: [
          { name: 'Time Unit Conversions', formula: '60 seconds = 1 minute\n60 minutes = 1 hour\n24 hours = 1 day\n7 days = 1 week\n365 days = 1 year\n12 months = 1 year', example: '2 hours = 120 minutes', explain: 'Knowing time conversions helps us calculate durations and plan schedules. Multiply to convert from larger to smaller units.' },
          { name: 'Reading Clocks (Analogue & Digital)', formula: 'Hours : Minutes\nQuarter past = :15\nHalf past = :30\nQuarter to = :45', example: '3:30 = half past three\n4:45 = quarter to five', explain: 'Digital clocks show hours and minutes directly. Analogue clocks use the position of the hands to show time.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 4 ═══════════════════
  {
    id: 'grade4',
    label: 'Grade 4',
    color: '#6a1b9a',
    topics: [
      {
        topic: 'Multiplication & Division (Multi-Digit)',
        icon: '✖️',
        items: [
          { name: 'Long Multiplication', formula: 'Multiply ones first, then tens; add partial products', example: '23 × 4 = (20×4) + (3×4) = 92', explain: 'Break the number into parts, multiply each part, then add the results. This is the basis for multiplying large numbers.' },
          { name: 'Distributive Law', formula: 'a × (b + c) = (a×b) + (a×c)', example: '6 × 13 = 6×10 + 6×3 = 78', explain: 'Multiply each part inside the bracket separately then add the results. This is the basis of long multiplication.' },
          { name: 'Long Division', formula: 'DMSB: Divide → Multiply → Subtract → Bring down → Repeat', example: '96 ÷ 4: 9÷4=2 r1 → 16÷4=4 → answer 24', explain: 'Divide step by step column by column from left to right. Repeat the four steps until there are no more digits to bring down.' },
          { name: 'Factors', formula: 'Factors of n: all whole numbers that divide n exactly', example: 'Factors of 12: 1, 2, 3, 4, 6, 12', explain: 'Factors divide evenly into a number with no remainder. Every number has at least two factors: 1 and itself.' },
          { name: 'Multiples', formula: 'Multiples of n = n×1, n×2, n×3 ...', example: 'Multiples of 3: 3, 6, 9, 12, 15 ...', explain: 'Multiples are the answers when you multiply a number by 1, 2, 3 and so on. Multiples go on forever.' },
          { name: 'Prime Numbers', formula: 'A prime has exactly 2 factors: 1 and itself', example: '2, 3, 5, 7, 11, 13, 17, 19 ... (1 is NOT prime)', explain: 'A prime number cannot be divided evenly by any number except 1 and itself. The number 1 is not prime because it has only one factor.' },
          { name: 'Composite Numbers', formula: 'A composite number has more than 2 factors', example: '4 (1,2,4),  6 (1,2,3,6),  9 (1,3,9)', explain: 'Composite numbers can be divided by numbers other than just 1 and themselves. Every composite number can be written as a product of primes.' },
        ],
      },
      {
        topic: 'Fractions',
        icon: '½',
        items: [
          { name: 'Adding Fractions (Same Denominator)', formula: 'a/c + b/c = (a + b) / c', example: '2/7 + 3/7 = 5/7', explain: 'Add the numerators and keep the denominator the same. Only fractions with the same denominator can be added directly.' },
          { name: 'Subtracting Fractions (Same Denominator)', formula: 'a/c − b/c = (a − b) / c', example: '5/8 − 2/8 = 3/8', explain: 'Subtract the numerators and keep the denominator the same. The denominator tells the size of each part.' },
          { name: 'Mixed Numbers', formula: 'Mixed Number = Whole + Proper Fraction', example: '2¾ = 2 + ¾', explain: 'A mixed number combines a whole number with a proper fraction. It represents a quantity greater than one.' },
          { name: 'Mixed Number ↔ Improper Fraction', formula: 'Improper → Mixed: numerator ÷ denominator\nMixed → Improper: (whole × denom) + numer', example: '7/4 → 1¾     2¾ → 11/4', explain: 'An improper fraction has a numerator larger than its denominator. Converting between the two forms is a key skill.' },
        ],
      },
      {
        topic: 'Decimals (Introduction)',
        icon: '•',
        items: [
          { name: 'Decimal Place Value', formula: 'Hundreds | Tens | Ones . Tenths | Hundredths', example: '3.45 = 3 ones + 4 tenths + 5 hundredths', explain: 'Digits after the decimal point represent fractions of 1. Each place to the right is ten times smaller.' },
          { name: 'Fraction ↔ Decimal Conversion', formula: 'Fraction → Decimal: divide numerator by denominator', example: '3/4 = 3 ÷ 4 = 0.75     0.6 = 6/10 = 3/5', explain: 'Divide the top number by the bottom number to convert a fraction to a decimal. Use place value to convert decimals back to fractions.' },
          { name: 'Ordering Decimals', formula: 'Line up decimal points; compare digit by digit left to right', example: '0.7, 0.65, 0.08 → ordered: 0.08 < 0.65 < 0.7', explain: 'Always line up the decimal points before comparing. Compare digit by digit starting from the left.' },
        ],
      },
      {
        topic: 'Area',
        icon: '📐',
        items: [
          { name: 'Area of Rectangle', formula: 'A = l × w', example: 'l=8 cm, w=3 cm  →  A = 24 cm²', explain: 'Area measures the space inside a 2D shape. Multiply the length by the width and give the answer in square units.' },
          { name: 'Area of Square', formula: 'A = s² = s × s', example: 's=5 cm  →  A = 25 cm²', explain: 'A square has equal sides so multiply the side length by itself. The answer is in square units such as cm².' },
        ],
      },
      {
        topic: 'Angles',
        icon: '∠',
        items: [
          { name: 'Types of Angles', formula: 'Acute: 0° < θ < 90°\nRight: = 90°\nObtuse: 90° < θ < 180°\nStraight: = 180°\nReflex: 180° < θ < 360°', example: '', explain: 'Angles are classified by their size in degrees. A right angle is exactly 90 degrees and is shown with a small square.' },
          { name: 'Angles on a Straight Line', formula: 'Angles on one side of a straight line = 180°', example: 'One angle = 70°  →  other = 110°', explain: 'Angles that sit on one side of a straight line always add up to 180 degrees. These are called supplementary angles.' },
          { name: 'Angles at a Point', formula: 'All angles around a point = 360°', example: '120° + 130° + 110° = 360° ✓', explain: 'A full turn around a point is 360 degrees. All the angles meeting at a point must add up to 360 degrees.' },
          { name: 'Vertically Opposite Angles', formula: 'Vertically opposite angles are equal', example: 'Two lines cross; one angle = 65° → opposite = 65°', explain: 'When two straight lines cross they form an X shape. The angles opposite each other are always equal.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 5 ═══════════════════
  {
    id: 'grade5',
    label: 'Grade 5',
    color: '#b71c1c',
    topics: [
      {
        topic: 'Fractions (Advanced)',
        icon: '½',
        items: [
          { name: 'GCF / HCF (Greatest Common Factor)', formula: 'Largest number that divides both numbers exactly', example: 'GCF(12, 18) = 6', explain: 'The greatest common factor is the largest number that divides into two numbers without a remainder. It is used to simplify fractions to lowest terms.' },
          { name: 'LCM (Least Common Multiple)', formula: 'Smallest number that both numbers divide into exactly', example: 'LCM(4, 6) = 12', explain: 'The least common multiple is the smallest number that both numbers divide into evenly. It is used to find a common denominator for fractions.' },
          { name: 'Simplifying Fractions', formula: 'Divide numerator AND denominator by their GCF', example: '12/16 → GCF=4 → 3/4', explain: 'Divide both the numerator and denominator by their greatest common factor. A fraction is in its simplest form when the GCF is 1.' },
          { name: 'Adding Fractions — Different Denominators', formula: 'Step 1: Find LCM\nStep 2: Convert both fractions\nStep 3: Add numerators', example: '1/3 + 1/4 → LCM=12 → 4/12 + 3/12 = 7/12', explain: 'You must have the same denominator before adding fractions. Find the LCM, convert each fraction, then add the numerators.' },
          { name: 'Subtracting Fractions — Different Denominators', formula: 'Same steps as adding, but subtract numerators', example: '3/4 − 1/3 → LCM=12 → 9/12 − 4/12 = 5/12', explain: 'Find a common denominator before subtracting fractions. Convert each fraction to the common denominator then subtract the numerators.' },
          { name: 'Multiplying Fractions', formula: 'a/b × c/d = (a×c) / (b×d)', example: '2/3 × 3/4 = 6/12 = 1/2', explain: 'Multiply the numerators together and multiply the denominators together. Simplify the result if possible.' },
          { name: 'Dividing Fractions (KCF)', formula: 'a/b ÷ c/d = a/b × d/c\n(Keep, Change, Flip)', example: '2/3 ÷ 4/5 = 2/3 × 5/4 = 5/6', explain: 'Keep the first fraction, change division to multiplication, and flip the second fraction. Multiplying by the reciprocal is the same as dividing.' },
          { name: 'Reciprocal', formula: 'Reciprocal of a/b = b/a', example: 'Reciprocal of 3/4 = 4/3\nReciprocal of 5 = 1/5', explain: 'The reciprocal of a fraction is found by flipping numerator and denominator. A number multiplied by its reciprocal always equals 1.' },
        ],
      },
      {
        topic: 'Decimals',
        icon: '•',
        items: [
          { name: 'Adding & Subtracting Decimals', formula: 'Line up the decimal points, then add or subtract', example: '3.45 + 2.1 = 5.55\n5.70 − 3.45 = 2.25', explain: 'Always line up the decimal points before calculating. You can add zeros to make the columns equal.' },
          { name: 'Multiplying Decimals', formula: 'Multiply as whole numbers, then count total decimal places', example: '2.4 × 1.3: 24×13=312 → 2 decimal places → 3.12', explain: 'Ignore the decimal point and multiply as whole numbers. Then count the total decimal places in both factors and insert the point.' },
          { name: 'Dividing Decimals', formula: 'Move decimal in divisor to make it whole; move dividend the same', example: '6.4 ÷ 0.8 → multiply both by 10 → 64 ÷ 8 = 8', explain: 'Make the number you are dividing by a whole number by multiplying by a power of ten. Do the same to the number being divided.' },
          { name: 'Rounding Decimals', formula: 'Look at digit to the RIGHT:\n≥ 5 → round UP     < 5 → keep same', example: '3.47 to 1 d.p. → look at 7 → round up → 3.5', explain: 'Look at the digit immediately to the right of where you are rounding. If it is 5 or more round up; if less than 5 keep the digit the same.' },
        ],
      },
      {
        topic: 'Percentages',
        icon: '%',
        items: [
          { name: 'Percentage Meaning', formula: '% means "per hundred"\na% = a/100', example: '25% = 25/100 = ¼ = 0.25', explain: 'Per cent literally means out of 100. Any percentage can be written as a fraction over 100 or as a decimal.' },
          { name: 'Percentage of a Number', formula: 'P% of N = (P/100) × N', example: '30% of 80 = 0.3 × 80 = 24', explain: 'Divide the percentage by 100 to get the decimal then multiply by the number. This finds the portion of the whole.' },
          { name: 'Fraction ↔ Decimal ↔ Percentage', formula: '50% = 0.5 = ½\n25% = 0.25 = ¼\n75% = 0.75 = ¾\n10% = 0.1 = 1/10', example: '', explain: 'These three forms represent the same value in different ways. Memorise the key equivalences for quick mental calculation.' },
        ],
      },
      {
        topic: 'Area (2D Shapes)',
        icon: '📐',
        items: [
          { name: 'Area of Triangle', formula: 'A = ½ × b × h', example: 'b=6 cm, h=4 cm  →  A = 12 cm²', explain: 'The base and height must be perpendicular to each other. A triangle is half the area of a parallelogram with the same base and height.' },
          { name: 'Area of Parallelogram', formula: 'A = b × h', example: 'b=8 cm, h=5 cm  →  A = 40 cm²', explain: 'Use the perpendicular height not the slant side. A parallelogram has the same area as a rectangle with the same base and height.' },
          { name: 'Area of Trapezoid / Trapezium', formula: 'A = ½ × (a + b) × h', example: 'a=4, b=6, h=3  →  A = 15 cm²', explain: 'Add the two parallel sides together, multiply by the perpendicular height, then divide by two.' },
        ],
      },
      {
        topic: 'Volume (3D Shapes)',
        icon: '📦',
        items: [
          { name: 'Volume of Cuboid', formula: 'V = l × w × h', example: 'l=4, w=3, h=2  →  V = 24 cm³', explain: 'Multiply length by width by height to find the volume. The answer is in cubic units such as cm³.' },
          { name: 'Volume of Cube', formula: 'V = s³ = s × s × s', example: 's=3 cm  →  V = 27 cm³', explain: 'A cube has all edges equal so cube the edge length. The answer is in cubic units.' },
        ],
      },
      {
        topic: 'Statistics (Introduction)',
        icon: '📊',
        items: [
          { name: 'Mean (Average)', formula: 'Mean = (Sum of all values) ÷ (Number of values)', example: '2, 4, 6, 8  →  Mean = 20/4 = 5', explain: 'Add all the values together and divide by how many values there are. The mean is the most common measure of average.' },
          { name: 'Tally Charts', formula: 'IIII (4 lines) + diagonal = 5\nCount in groups of 5', example: '', explain: 'Tally marks are a quick way to record data as you count. Every fifth mark crosses the previous four making groups of five easy to count.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 6 ═══════════════════
  {
    id: 'grade6',
    label: 'Grade 6',
    color: '#00695c',
    topics: [
      {
        topic: 'Ratios & Proportions',
        icon: '⚖️',
        items: [
          { name: 'Ratio', formula: 'a : b   read as "a to b"', example: 'Boys : Girls = 3 : 2', explain: 'A ratio compares two quantities in the same units. For every 3 boys there are 2 girls in this example.' },
          { name: 'Simplifying Ratios', formula: 'Divide both parts by their GCF', example: '12 : 8 → GCF=4 → 3 : 2', explain: 'Simplify a ratio the same way you simplify a fraction. Divide both parts by their greatest common factor.' },
          { name: 'Sharing in a Ratio', formula: '1. Add ratio parts\n2. Divide total by sum\n3. Multiply each part', example: 'Share 120 in ratio 3:5:\nunit=15  →  45 and 75', explain: 'Find the value of one part first by dividing the total by the sum of the ratio. Then multiply each part of the ratio by the unit value.' },
          { name: 'Direct Proportion', formula: 'y / x = k  (constant)\ny = kx', example: '3 books cost KSh 90\n→ 5 books cost KSh 150', explain: 'As one quantity increases the other increases at the same rate. The ratio between the two quantities stays constant.' },
          { name: 'Inverse Proportion', formula: 'x × y = k  (constant)\nAs one ↑, the other ↓', example: '4 workers take 6 days\n→ 8 workers take 3 days', explain: 'As one quantity increases the other decreases proportionally. Their product stays constant.' },
        ],
      },
      {
        topic: 'Percentages (Advanced)',
        icon: '%',
        items: [
          { name: 'Percentage Increase', formula: '% Increase = (Increase / Original) × 100', example: 'Price: 200 → 250\n(50/200)×100 = 25%', explain: 'Find how much something went up then divide by the original value and multiply by 100. Always compare the change to the original.' },
          { name: 'Percentage Decrease', formula: '% Decrease = (Decrease / Original) × 100', example: 'Price: 80 → 60\n(20/80)×100 = 25%', explain: 'Find how much something went down then divide by the original value and multiply by 100.' },
          { name: 'Finding the Whole from a Percentage', formula: 'Whole = Amount ÷ (Percentage/100)', example: '40 is 25% of what?\n→ 40 ÷ 0.25 = 160', explain: 'Work backwards to find the original whole amount. Divide the known part by the decimal form of the percentage.' },
          { name: 'Profit & Loss', formula: 'Profit = SP − CP\n% Profit = (Profit / CP) × 100', example: 'CP=100, SP=120 → Profit=20%', explain: 'Profit occurs when selling price is greater than cost price. Percentage profit is always calculated on the cost price.' },
          { name: 'Simple Interest', formula: 'SI = (P × R × T) / 100\nAmount = P + SI', example: 'P=1000, R=5%, T=3 yrs → SI = 150', explain: 'Simple interest is calculated only on the original principal. P is principal, R is annual rate, and T is time in years.' },
        ],
      },
      {
        topic: 'Integers',
        icon: '±',
        items: [
          { name: 'Adding Integers', formula: 'Same sign → add, keep sign\nDifferent sign → subtract; keep sign of larger', example: '(−3)+(−5) = −8\n(−3)+7 = +4', explain: 'When adding integers with the same sign add and keep the sign. When signs differ subtract the smaller absolute value.' },
          { name: 'Subtracting Integers', formula: 'a − b = a + (−b)', example: '5−(−3) = 5+3 = 8\n(−4)−2 = −6', explain: 'Subtracting a negative number is the same as adding a positive. Change the operation and flip the sign of the second number.' },
          { name: 'Multiplying & Dividing Integers', formula: '(+)×(+) = (+)\n(+)×(−) = (−)\n(−)×(−) = (+)', example: '(−4)×(−3) = +12\n(−4)×3 = −12', explain: 'Same signs give a positive result. Different signs give a negative result. The same rule applies to division.' },
          { name: 'Absolute Value', formula: '|a| = distance from zero (always positive)', example: '|−7| = 7     |5| = 5', explain: 'Absolute value is the distance of a number from zero on the number line. It is always positive or zero.' },
        ],
      },
      {
        topic: 'Algebra (Introduction)',
        icon: '🔤',
        items: [
          { name: 'Algebraic Expressions', formula: 'Terms with variables: 2x, 3y, 5x²\nExpression: 3x + 2y − 5', example: '', explain: 'Letters called variables represent unknown numbers. An expression is a combination of terms joined by addition or subtraction.' },
          { name: 'Collecting Like Terms', formula: 'Add/subtract terms with the same variable and power', example: '3x + 2x − x = 4x\n5y² − 2y² = 3y²', explain: 'Like terms have exactly the same letters and powers. Only like terms can be added or subtracted together.' },
          { name: 'Solving Simple Equations', formula: 'Perform the SAME operation on BOTH sides', example: 'x + 5 = 12 → x = 7\n3x = 21 → x = 7', explain: 'An equation is like a balanced scale. Whatever you do to one side you must do to the other to keep it balanced.' },
          { name: 'Substitution', formula: 'Replace the variable with its given value and evaluate', example: 'If x=3, find 2x+1 → 2(3)+1 = 7', explain: 'Put the given number in place of the letter and calculate. Substitution is used to evaluate expressions and check solutions.' },
        ],
      },
      {
        topic: 'Geometry — Circles',
        icon: '⭕',
        items: [
          { name: 'Radius & Diameter', formula: 'd = 2r     r = d/2', example: 'd = 14 cm  →  r = 7 cm', explain: 'The diameter passes through the centre and is twice the radius. The radius is the distance from the centre to any point on the circle.' },
          { name: 'Circumference of a Circle', formula: 'C = 2πr = πd\nπ ≈ 3.14159  or  22/7', example: 'r=5 cm  →  C ≈ 31.42 cm', explain: 'The circumference is the perimeter of a circle. It is found by multiplying the diameter by pi.' },
          { name: 'Area of a Circle', formula: 'A = πr²', example: 'r=7 cm  →  A ≈ 153.94 cm²', explain: 'The area of a circle uses the radius squared multiplied by pi. Remember to square the radius first before multiplying by pi.' },
          { name: 'Arc Length', formula: 'Arc = (θ/360°) × 2πr', example: 'θ=90°, r=4  →  Arc ≈ 6.28 cm', explain: 'An arc is a portion of the circumference. The fraction of the circle is given by the angle divided by 360 degrees.' },
          { name: 'Area of a Sector', formula: 'A = (θ/360°) × πr²', example: 'θ=60°, r=6  →  A ≈ 18.85 cm²', explain: 'A sector is a pizza-slice portion of a circle. The fraction of the full circle area is the angle divided by 360 degrees.' },
        ],
      },
      {
        topic: 'Statistics',
        icon: '📊',
        items: [
          { name: 'Mean', formula: 'Mean = Σx / n', example: '3, 7, 5, 9, 6  →  Mean = 30/5 = 6', explain: 'The mean is the arithmetic average of a data set. Add all values and divide by the number of values.' },
          { name: 'Median', formula: 'Sort data; median = middle value\nEven n: average the two middle values', example: '2, 4, 5, 8, 9  →  Median = 5', explain: 'The median is the middle value of sorted data. It is not affected by extreme values like the mean can be.' },
          { name: 'Mode', formula: 'The value that appears MOST often', example: '2, 3, 3, 5, 7, 3  →  Mode = 3', explain: 'The mode is the most frequently occurring value. There can be more than one mode in a data set.' },
          { name: 'Range', formula: 'Range = Highest − Lowest', example: '3, 7, 5, 9, 1  →  Range = 8', explain: 'The range measures how spread out the data is. A larger range means more spread in the data.' },
        ],
      },
      {
        topic: 'Angles in Parallel Lines',
        icon: '∠',
        items: [
          { name: 'Corresponding Angles (F-shape)', formula: 'Corresponding angles are EQUAL when lines are parallel', example: 'F-shape → both angles same size', explain: 'Corresponding angles are in matching positions on the same side of the transversal. They are equal when the lines are parallel.' },
          { name: 'Alternate Angles (Z-shape)', formula: 'Alternate angles are EQUAL when lines are parallel', example: 'Z-shape → both angles same size', explain: 'Alternate angles are on opposite sides of the transversal between the parallel lines. They are equal when lines are parallel.' },
          { name: 'Co-interior Angles (C-shape)', formula: 'Co-interior angles ADD to 180°', example: 'C-shape → angle A + angle B = 180°', explain: 'Co-interior angles are on the same side of the transversal between parallel lines. They add up to 180 degrees.' },
          { name: 'Angles in a Triangle', formula: 'Sum of interior angles = 180°', example: '60° + 80° + x = 180°  →  x = 40°', explain: 'The three interior angles of any triangle always add up to 180 degrees. Use this to find a missing angle.' },
          { name: 'Angles in a Quadrilateral', formula: 'Sum of interior angles = 360°', example: '90° + 110° + 80° + x = 360°  →  x = 80°', explain: 'The four interior angles of any quadrilateral always add up to 360 degrees.' },
          { name: 'Exterior Angle of a Triangle', formula: 'Exterior angle = sum of two non-adjacent interior angles', example: 'Interior: 50° and 70°  →  Exterior = 120°', explain: 'The exterior angle of a triangle equals the sum of the two interior angles not adjacent to it.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 7 ═══════════════════
  {
    id: 'grade7',
    label: 'Grade 7',
    color: '#283593',
    topics: [
      {
        topic: 'Indices / Exponents',
        icon: 'xⁿ',
        items: [
          { name: 'Index Notation', formula: 'aⁿ = a × a × a ... (n times)\na = base,  n = exponent', example: '2⁴ = 2×2×2×2 = 16', explain: 'The base is the number being multiplied and the exponent shows how many times it is multiplied by itself.' },
          { name: 'Multiplication Law', formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ', example: '2³ × 2⁴ = 2⁷ = 128', explain: 'When multiplying powers with the same base add the exponents. The base must be the same.' },
          { name: 'Division Law', formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ', example: '3⁵ ÷ 3² = 3³ = 27', explain: 'When dividing powers with the same base subtract the exponents. The base must be the same.' },
          { name: 'Power of a Power', formula: '(aᵐ)ⁿ = aᵐⁿ', example: '(2³)² = 2⁶ = 64', explain: 'When raising a power to another power multiply the exponents together.' },
          { name: 'Power of a Product', formula: '(ab)ⁿ = aⁿ × bⁿ', example: '(2×3)² = 2² × 3² = 36', explain: 'When raising a product to a power apply the power to each factor separately.' },
          { name: 'Zero Index', formula: 'a⁰ = 1   (for any a ≠ 0)', example: '5⁰=1    7⁰=1    100⁰=1', explain: 'Anything to the power zero equals 1. This follows from the division law since aⁿ ÷ aⁿ = a⁰ = 1.' },
          { name: 'Negative Index', formula: 'a⁻ⁿ = 1/aⁿ', example: '2⁻³ = 1/8     3⁻¹ = 1/3', explain: 'A negative exponent means the reciprocal of the positive power. Move the base to the denominator and make the exponent positive.' },
          { name: 'Fractional Index — Square Root', formula: 'a^(1/2) = √a', example: '9^(1/2) = √9 = 3', explain: 'A fractional index of one half means square root. Raising to the power 1/2 is the inverse of squaring.' },
          { name: 'Fractional Index — Cube Root', formula: 'a^(1/3) = ³√a\na^(m/n) = (ⁿ√a)ᵐ', example: '27^(1/3) = 3     8^(2/3) = 4', explain: 'A fractional index of one third means cube root. For m/n take the nth root then raise to the power m.' },
          { name: 'Standard Form (Scientific Notation)', formula: 'A × 10ⁿ   where  1 ≤ A < 10', example: '3 400 000 = 3.4 × 10⁶\n0.00052 = 5.2 × 10⁻⁴', explain: 'Standard form is a way to write very large or very small numbers concisely. The first part must be between 1 and 10.' },
        ],
      },
      {
        topic: 'Algebra — Linear Equations & Inequalities',
        icon: '📝',
        items: [
          { name: 'Solving Linear Equations', formula: 'ax + b = c\nx = (c − b) / a', example: '3x + 4 = 19  →  x = 5', explain: 'Rearrange the equation to isolate x on one side. Do the same operation to both sides to keep the equation balanced.' },
          { name: 'Equations with Variables on Both Sides', formula: 'Collect x terms on one side, numbers on the other', example: '5x − 3 = 2x + 9  →  x = 4', explain: 'Move all variable terms to one side and all number terms to the other side. Then solve the resulting simple equation.' },
          { name: 'Expanding Brackets', formula: 'a(b + c) = ab + ac', example: '3(x + 4) = 3x + 12', explain: 'Multiply each term inside the bracket by the term outside. This is the distributive law applied to algebra.' },
          { name: 'Factorising (Common Factor)', formula: 'ab + ac = a(b + c)', example: '6x + 9 = 3(2x + 3)', explain: 'Take out the highest common factor and place it outside the bracket. Factorising is the reverse of expanding brackets.' },
          { name: 'Linear Inequalities', formula: 'Solve like an equation BUT:\nMultiply/divide by NEGATIVE → FLIP the sign', example: '3x > 12 → x > 4\n−2x < 6 → x > −3  (flipped!)', explain: 'Solve inequalities the same way as equations except when multiplying or dividing by a negative number — in that case flip the inequality sign.' },
          { name: 'Number Line (Inequalities)', formula: 'x > a → open circle, arrow right\nx ≥ a → closed circle, arrow right\nx < a → open circle, arrow left', example: '', explain: 'Use open circles for strict inequalities and closed circles for or-equal-to. The arrow shows all values in the solution set.' },
        ],
      },
      {
        topic: "Pythagoras' Theorem",
        icon: '△',
        items: [
          { name: "Pythagoras' Theorem", formula: 'a² + b² = c²\nc = hypotenuse (longest side, opposite right angle)', example: 'a=3, b=4  →  c² = 25  →  c = 5', explain: 'This theorem only applies to right-angled triangles. The square on the hypotenuse equals the sum of the squares on the other two sides.' },
          { name: 'Finding a Shorter Side', formula: 'a = √(c² − b²)', example: 'c=13, b=5  →  a = √144 = 12', explain: 'Rearrange the theorem to find a shorter side. Subtract the square of the known shorter side from the square of the hypotenuse.' },
          { name: 'Pythagorean Triples', formula: '(3,4,5)   (5,12,13)\n(8,15,17) (7,24,25)', example: '(6,8,10) is a multiple of (3,4,5)', explain: 'Pythagorean triples are whole number sets that satisfy the theorem. Any multiple of a triple is also a triple.' },
          { name: '3D Pythagoras (Space Diagonal)', formula: 'd = √(l² + w² + h²)', example: 'Box 3×4×12  →  d = 13', explain: 'Apply Pythagoras twice to find the diagonal of a 3D box. First find the diagonal of the base then use it as one side of a vertical triangle.' },
        ],
      },
      {
        topic: 'Trigonometry (Right Triangles)',
        icon: 'sin',
        items: [
          { name: 'SOH-CAH-TOA', formula: 'Sin θ = Opposite / Hypotenuse\nCos θ = Adjacent / Hypotenuse\nTan θ = Opposite / Adjacent', example: '', explain: 'SOH-CAH-TOA is the memory aid for the three trigonometric ratios. Label the sides relative to the angle before choosing a ratio.' },
          { name: 'Finding a Missing Side', formula: 'Choose ratio; rearrange for unknown side', example: 'θ=30°, hyp=10\nopp = 10 × sin30° = 5', explain: 'Identify which sides are involved, choose the correct ratio, then rearrange to find the unknown side.' },
          { name: 'Finding a Missing Angle', formula: 'θ = sin⁻¹(opp/hyp)\nθ = cos⁻¹(adj/hyp)\nθ = tan⁻¹(opp/adj)', example: 'opp=4, hyp=5  →  θ = sin⁻¹(0.8) ≈ 53.13°', explain: 'Use the inverse trig function to find the angle. Enter the ratio into your calculator and press the inverse function.' },
          { name: 'Exact Trig Values', formula: 'sin30°=½   cos30°=√3/2\nsin45°=1/√2  tan45°=1\nsin60°=√3/2  cos60°=½  tan60°=√3', example: '', explain: 'These exact values should be memorised. They are derived from equilateral and right isosceles triangles.' },
          { name: 'Angles of Elevation & Depression', formula: 'Elevation: angle UP from horizontal\nDepression: angle DOWN from horizontal', example: '', explain: 'Angles of elevation and depression are measured from the horizontal. Draw a diagram first and identify the right-angled triangle.' },
        ],
      },
      {
        topic: 'Mensuration — 3D Shapes',
        icon: '📦',
        items: [
          { name: 'Surface Area of Cube', formula: 'TSA = 6a²', example: 'a=3 → TSA = 54 cm²', explain: 'A cube has 6 identical square faces. Multiply the area of one face by 6 to get the total surface area.' },
          { name: 'Volume of Cube', formula: 'V = a³', example: 'a=4 → V = 64 cm³', explain: 'Cube the edge length to find the volume of a cube. The answer is in cubic units.' },
          { name: 'Surface Area of Cuboid', formula: 'TSA = 2(lb + bh + lh)', example: 'l=4, b=3, h=2 → TSA = 52 cm²', explain: 'A cuboid has 3 pairs of rectangular faces. Calculate the area of each pair and add them all together.' },
          { name: 'Volume of Cuboid', formula: 'V = l × b × h', example: 'l=5, b=4, h=3 → V = 60 cm³', explain: 'Multiply length by breadth by height to find the volume of a cuboid.' },
          { name: 'Surface Area of Cylinder', formula: 'TSA = 2πr(h + r)\nCSA = 2πrh', example: 'r=7, h=10 → TSA ≈ 747.7 cm²', explain: 'The curved surface unrolls into a rectangle. Add the areas of the two circular ends to get the total surface area.' },
          { name: 'Volume of Cylinder', formula: 'V = πr²h', example: 'r=3.5, h=10 → V ≈ 384.8 cm³', explain: 'The volume of a cylinder is the area of the circular base multiplied by the height.' },
        ],
      },
      {
        topic: 'Probability (Introduction)',
        icon: '🎲',
        items: [
          { name: 'Basic Probability', formula: 'P(event) = Favourable outcomes / Total outcomes', example: 'P(head) = 1/2     P(rolling 3) = 1/6', explain: 'All outcomes must be equally likely. Count the favourable outcomes and divide by the total number of possible outcomes.' },
          { name: 'Probability Scale', formula: '0 ≤ P(event) ≤ 1\nP(impossible) = 0     P(certain) = 1', example: '', explain: 'Probability is always between 0 and 1. Zero means impossible and 1 means certain to happen.' },
          { name: 'Complementary Events', formula: 'P(A) + P(not A) = 1\nP(not A) = 1 − P(A)', example: 'P(rain) = 0.3  →  P(no rain) = 0.7', explain: 'An event either happens or it does not. The probabilities of an event and its complement always add up to 1.' },
          { name: 'Relative Frequency', formula: 'Relative Frequency = occurrences / total trials', example: '60 trials, 15 events → R.F. = 0.25', explain: 'Relative frequency is an estimated probability based on actual experiment results. More trials give a better estimate.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 8 ═══════════════════
  {
    id: 'grade8',
    label: 'Grade 8',
    color: '#4e342e',
    topics: [
      {
        topic: 'Simultaneous Equations',
        icon: '{ }',
        items: [
          { name: 'Elimination Method', formula: '1. Match one coefficient\n2. Add or subtract equations\n3. Solve\n4. Substitute back', example: 'x+y=5 and x−y=1\n→ add → 2x=6 → x=3, y=2', explain: 'Eliminate one variable by adding or subtracting the equations. First make the coefficients of one variable equal.' },
          { name: 'Substitution Method', formula: '1. Express one variable in terms of other\n2. Substitute into second equation\n3. Solve\n4. Substitute back', example: 'y=2x and x+y=6\n→ 3x=6 → x=2, y=4', explain: 'Express one variable in terms of the other and substitute into the second equation. This reduces it to a single-variable equation.' },
          { name: 'Graphical Method', formula: 'Draw both lines; intersection = solution', example: '', explain: 'The x and y values at the crossing point satisfy both equations. This method gives a visual understanding of simultaneous equations.' },
        ],
      },
      {
        topic: 'Quadratics (Introduction)',
        icon: 'x²',
        items: [
          { name: 'Expanding Two Brackets (FOIL)', formula: '(a+b)(c+d) = ac + ad + bc + bd', example: '(x+3)(x+2) = x²+5x+6', explain: 'FOIL stands for First, Outer, Inner, Last. Multiply each term in the first bracket by each term in the second.' },
          { name: 'Perfect Square', formula: '(a+b)² = a² + 2ab + b²\n(a−b)² = a² − 2ab + b²', example: '(x+4)² = x²+8x+16', explain: 'Squaring a binomial always gives three terms. The middle term is twice the product of the two terms in the bracket.' },
          { name: 'Difference of Two Squares', formula: 'a² − b² = (a+b)(a−b)', example: 'x²−25 = (x+5)(x−5)', explain: 'Two perfect squares with a minus sign factor into conjugate pairs. Recognise this pattern to factorise quickly.' },
          { name: 'Factorising Quadratics (a = 1)', formula: 'x² + bx + c = (x+p)(x+q)\np + q = b  and  p × q = c', example: 'x²+5x+6: p+q=5, pq=6 → (x+2)(x+3)', explain: 'Find two numbers that multiply to give c and add to give b. These numbers become the constants in the two brackets.' },
          { name: 'Factorising Quadratics (a ≠ 1)', formula: 'Find two numbers: product=a×c, sum=b\nSplit middle term and factorise by grouping', example: '2x²+7x+3 → (x+3)(2x+1)', explain: 'Use the ac method to split the middle term. Find two numbers whose product is ac and whose sum is b.' },
        ],
      },
      {
        topic: 'Coordinate Geometry',
        icon: '📈',
        items: [
          { name: 'Distance Between Two Points', formula: 'd = √[(x₂−x₁)² + (y₂−y₁)²]', example: 'A(1,2), B(4,6) → d = 5', explain: 'Apply the Pythagorean theorem to the horizontal and vertical distances between the points.' },
          { name: 'Midpoint of a Line Segment', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', example: 'A(2,4) B(8,10) → M = (5, 7)', explain: 'Average the x-coordinates and average the y-coordinates to find the midpoint.' },
          { name: 'Gradient (Slope)', formula: 'm = (y₂ − y₁) / (x₂ − x₁) = rise / run', example: 'A(1,2) B(3,8) → m = 3', explain: 'The gradient measures how steep a line is. Rise over run gives the rate of change of y with respect to x.' },
          { name: 'Equation of a Line (y = mx + c)', formula: 'y = mx + c\nm = gradient,  c = y-intercept', example: 'm=2, passes (0,3) → y = 2x + 3', explain: 'Slope-intercept form is the most useful form of a line equation. The gradient tells steepness and c tells where the line crosses the y-axis.' },
          { name: 'Equation from Two Points', formula: '1. Find m\n2. Sub into y=mx+c with one point\n3. Find c', example: 'A(1,3) B(3,7): m=2; c=1 → y=2x+1', explain: 'Find the gradient first then substitute one known point to find the y-intercept.' },
          { name: 'Parallel Lines', formula: 'Parallel → same gradient: m₁ = m₂', example: 'y=3x+1 and y=3x−4 are parallel', explain: 'Parallel lines never meet because they have exactly the same gradient. They have different y-intercepts.' },
          { name: 'Perpendicular Lines', formula: 'm₁ × m₂ = −1\nm₂ = −1/m₁', example: 'm₁=2  →  m₂ = −½', explain: 'Perpendicular lines meet at 90 degrees. The gradients are negative reciprocals of each other.' },
        ],
      },
      {
        topic: 'Mensuration — Advanced 3D',
        icon: '📦',
        items: [
          { name: 'Slant Height of Cone', formula: 'l = √(r² + h²)', example: 'r=3, h=4 → l = 5 cm', explain: 'Use Pythagoras to find the slant height from the radius and perpendicular height. The slant height is the hypotenuse.' },
          { name: 'Surface Area of Cone', formula: 'TSA = πr(l + r)\nCSA = πrl', example: 'r=3, l=5 → TSA ≈ 75.4 cm²', explain: 'The curved surface area is pi times radius times slant height. Add the circular base to get the total surface area.' },
          { name: 'Volume of Cone', formula: 'V = ⅓πr²h', example: 'r=3, h=7 → V ≈ 66.0 cm³', explain: 'The volume of a cone is one third of the volume of a cylinder with the same base and height.' },
          { name: 'Surface Area of Sphere', formula: 'SA = 4πr²', example: 'r=5 → SA ≈ 314.2 cm²', explain: 'The surface area of a sphere equals four times pi times radius squared.' },
          { name: 'Volume of Sphere', formula: 'V = (4/3)πr³', example: 'r=3 → V ≈ 113.1 cm³', explain: 'The volume of a sphere is four thirds times pi times radius cubed. Remember to cube the radius before multiplying.' },
          { name: 'Surface Area of Hemisphere', formula: 'TSA = 3πr²\nCSA = 2πr²', example: 'r=4 → TSA ≈ 150.8 cm²', explain: 'A hemisphere has a curved surface plus a flat circular base. The curved part equals 2πr².' },
          { name: 'Volume of Hemisphere', formula: 'V = (2/3)πr³', example: 'r=3 → V ≈ 56.5 cm³', explain: 'Half the volume of a full sphere. Divide the sphere volume formula by 2.' },
          { name: 'Volume of Pyramid', formula: 'V = ⅓ × Base Area × h', example: 'Square base 6×6, h=4 → V = 48 cm³', explain: 'The volume of a pyramid is one third of the volume of a prism with the same base and height.' },
        ],
      },
      {
        topic: 'Transformations',
        icon: '🔄',
        items: [
          { name: 'Translation', formula: 'Move every point by vector (a, b):\nx → x+a,  y → y+b', example: 'Point (3,2) + vector (5,−1) → (8,1)', explain: 'Every point moves the same distance in the same direction. The shape and size do not change in a translation.' },
          { name: 'Reflection', formula: 'In x-axis: (x,y) → (x,−y)\nIn y-axis: (x,y) → (−x,y)\nIn y=x:   (x,y) → (y,x)', example: '', explain: 'Every point is flipped across the mirror line. The distance from the mirror line is preserved.' },
          { name: 'Rotation', formula: '90° clockwise:      (x,y) → (y,−x)\n90° anti-clockwise: (x,y) → (−y,x)\n180°:               (x,y) → (−x,−y)', example: '', explain: 'Rotation is about a fixed centre point. The shape and size are preserved but the orientation changes.' },
          { name: 'Enlargement', formula: 'New = Centre + k × (Old − Centre)\nk = scale factor', example: 'Scale factor 2, centre (0,0): (3,4) → (6,8)', explain: 'Lengths multiply by the scale factor. Areas multiply by k² and volumes by k³. The centre of enlargement is fixed.' },
        ],
      },
      {
        topic: 'Statistics (Advanced)',
        icon: '📊',
        items: [
          { name: 'Mean from Frequency Table', formula: 'Mean = Σ(f × x) / Σf', example: 'x:2,4,6  f:3,5,2 → Mean = 3.8', explain: 'Multiply each value by its frequency, sum all products, then divide by the total frequency.' },
          { name: 'Quartiles & IQR', formula: 'Q1 = lower quartile (25%)\nQ2 = median (50%)\nQ3 = upper quartile (75%)\nIQR = Q3 − Q1', example: '', explain: 'Quartiles divide ordered data into four equal parts. The IQR measures the spread of the middle 50% of data.' },
          { name: 'Standard Deviation', formula: 'σ = √[ Σ(x − x̄)² / n ]', example: 'Data: 2,4,6; x̄=4  →  σ ≈ 1.63', explain: 'Standard deviation measures how spread out data is from the mean. A larger value means the data is more spread out.' },
          { name: 'Box-and-Whisker Plot', formula: 'Min | Q1 | Median | Q3 | Max', example: '', explain: 'A box plot is a visual summary showing the spread and centre of data. The box covers the middle 50% of the data.' },
        ],
      },
      {
        topic: 'Probability (Advanced)',
        icon: '🎲',
        items: [
          { name: 'AND Rule (Multiplication)', formula: 'P(A and B) = P(A) × P(B)  [independent]', example: 'P(head then 6) = ½ × 1/6 = 1/12', explain: 'For independent events multiply the individual probabilities. The outcome of one event does not affect the other.' },
          { name: 'OR Rule (Addition)', formula: 'P(A or B) = P(A) + P(B) − P(A and B)', example: 'P(red or king) = 26/52 + 4/52 − 2/52 = 7/13', explain: 'Add the probabilities of each event then subtract the overlap to avoid counting it twice.' },
          { name: 'Tree Diagrams', formula: 'Multiply along branches (AND)\nAdd across separate paths (OR)', example: '', explain: 'Tree diagrams organise outcomes of multi-stage experiments. Multiply probabilities along a path and add paths for OR situations.' },
          { name: 'Conditional Probability', formula: 'P(A|B) = P(A and B) / P(B)', example: '2 reds from 5R,3B without replacement\n= 5/8 × 4/7 = 5/14', explain: 'Conditional probability is the probability of A given that B has already occurred. Without replacement changes the total each time.' },
        ],
      },
    ],
  },

  // ═══════════════════ GRADE 9 ═══════════════════
  {
    id: 'grade9',
    label: 'Grade 9',
    color: '#880e4f',
    topics: [
      {
        topic: 'Quadratic Equations',
        icon: 'x²=0',
        items: [
          { name: 'Quadratic Formula', formula: 'x = [ −b ± √(b² − 4ac) ] / 2a\nfor  ax² + bx + c = 0', example: 'x²+5x+6=0 → x=−2 or x=−3', explain: 'The quadratic formula solves any quadratic equation. Identify a, b and c then substitute carefully.' },
          { name: 'Discriminant', formula: 'Δ = b² − 4ac\nΔ > 0 → two real roots\nΔ = 0 → one repeated root\nΔ < 0 → no real roots', example: 'x²+5x+6: Δ=1 > 0 → 2 real roots', explain: 'The discriminant tells you the nature of the roots without fully solving. Calculate it first to know what to expect.' },
          { name: 'Completing the Square', formula: 'x² + bx + c = (x + b/2)² − (b/2)² + c', example: 'x²+6x+5 = (x+3)²−4\n→ x=−1 or x=−5', explain: 'Rewrite the quadratic as a perfect square plus a constant. Then solve by taking the square root of both sides.' },
          { name: "Vieta's Formulas (Sum & Product of Roots)", formula: 'α + β = −b/a\nα × β = c/a', example: 'x²−5x+6=0 → α+β=5; αβ=6', explain: 'The sum and product of the roots relate directly to the coefficients. Use these to check answers or form equations.' },
        ],
      },
      {
        topic: 'Logarithms',
        icon: 'log',
        items: [
          { name: 'Definition of Logarithm', formula: 'logₐ(x) = n  ⟺  aⁿ = x', example: 'log₂(8) = 3  because 2³ = 8', explain: 'A logarithm is the inverse of exponentiation. The log asks what power gives this result.' },
          { name: 'Product Law', formula: 'logₐ(xy) = logₐ(x) + logₐ(y)', example: 'log(12) = log(4) + log(3)', explain: 'The log of a product equals the sum of the logs. This mirrors the exponent multiplication law.' },
          { name: 'Quotient Law', formula: 'logₐ(x/y) = logₐ(x) − logₐ(y)', example: 'log(4/3) = log(4) − log(3)', explain: 'The log of a quotient equals the difference of the logs. This mirrors the exponent division law.' },
          { name: 'Power Law', formula: 'logₐ(xⁿ) = n × logₐ(x)', example: 'log(8) = 3log(2)', explain: 'The power of a logarithm can be brought out as a multiplier. This is very useful for solving exponential equations.' },
          { name: 'Change of Base', formula: 'logₐ(x) = log(x) / log(a)', example: 'log₂(7) = log(7)/log(2) ≈ 2.807', explain: 'Convert any logarithm to base 10 or natural log to evaluate it on a calculator.' },
          { name: 'Natural Logarithm', formula: 'ln(x) = logₑ(x),   e ≈ 2.71828\nln(e) = 1     ln(1) = 0', example: '', explain: 'The natural logarithm uses the special base e. It appears frequently in calculus and exponential growth models.' },
          { name: 'Special Logarithm Values', formula: 'logₐ(1) = 0  (any base)\nlogₐ(a) = 1  (any base)\nlog(10)=1, log(100)=2, log(1000)=3', example: '', explain: 'These key values come directly from the definition. The log of the base itself is always 1 and the log of 1 is always 0.' },
          { name: 'Solving Exponential Equations', formula: 'Take log of both sides; use power law', example: '2ˣ = 50 → x = log50/log2 ≈ 5.64', explain: 'Apply logarithms to both sides to bring the exponent down as a multiplier. Then solve the resulting linear equation.' },
        ],
      },
      {
        topic: 'Trigonometry (Non-Right Triangles)',
        icon: 'sin²+cos²',
        items: [
          { name: 'Sine Rule', formula: 'a/sin A = b/sin B = c/sin C', example: 'a=5, A=30°, B=45° → b ≈ 7.07', explain: 'Use the sine rule when you have a side and its opposite angle. It works for any triangle not just right-angled ones.' },
          { name: 'Cosine Rule — Finding a Side', formula: 'a² = b² + c² − 2bc cos A', example: 'b=5, c=7, A=60° → a ≈ 6.24', explain: 'Use the cosine rule when you know two sides and the included angle. It is a generalisation of Pythagoras theorem.' },
          { name: 'Cosine Rule — Finding an Angle', formula: 'cos A = (b² + c² − a²) / 2bc', example: 'a=6, b=4, c=8 → A ≈ 46.6°', explain: 'Use this form when you know all three sides and need an angle. Rearrange the cosine rule to make cos A the subject.' },
          { name: 'Area of Any Triangle', formula: 'Area = ½ × a × b × sin C', example: 'a=6, b=8, C=30° → Area = 12 cm²', explain: 'Use this formula when you know two sides and the angle between them. It works for any triangle.' },
          { name: 'Pythagorean Identity', formula: 'sin²θ + cos²θ = 1', example: 'sin²30° + cos²30° = ¼ + ¾ = 1 ✓', explain: 'This is the most fundamental trigonometric identity. It is derived from the unit circle and holds for any angle.' },
          { name: 'Other Trig Identities', formula: 'tan θ = sin θ / cos θ\n1 + tan²θ = sec²θ\n1 + cot²θ = cosec²θ', example: '', explain: 'These identities relate the six trigonometric functions. They are derived from the Pythagorean identity.' },
          { name: 'Compound Angle Formulas', formula: 'sin(A+B) = sinAcosB + cosAsinB\ncos(A+B) = cosAcosB − sinAsinB', example: '', explain: 'These formulas expand trig functions of sums of angles. They are used to find exact values and prove other identities.' },
          { name: 'Double Angle Formulas', formula: 'sin(2A) = 2sinAcosA\ncos(2A) = cos²A − sin²A\n        = 2cos²A − 1 = 1 − 2sin²A', example: '', explain: 'Double angle formulas are special cases of compound angle formulas where both angles are equal.' },
          { name: 'Bearings', formula: 'Clockwise from NORTH; always 3 digits\nN=000°, E=090°, S=180°, W=270°', example: 'NE direction = 045°', explain: 'Bearings are used in navigation. Always measure clockwise from north and write with three digits.' },
        ],
      },
      {
        topic: 'Vectors',
        icon: '→',
        items: [
          { name: 'Vector Notation', formula: 'a⃗ = (x, y)  or  xi + yj', example: '(3, 4) = 3 units right, 4 units up', explain: 'Vectors have both magnitude and direction. They are different from scalars which have magnitude only.' },
          { name: 'Adding & Subtracting Vectors', formula: '(a₁,a₂) + (b₁,b₂) = (a₁+b₁, a₂+b₂)', example: '(3,4) + (1,−2) = (4, 2)', explain: 'Add or subtract the corresponding components of the vectors. This can also be shown using the triangle or parallelogram law.' },
          { name: 'Scalar Multiplication', formula: 'k × (x, y) = (kx, ky)', example: '3 × (2, −1) = (6, −3)', explain: 'Multiply each component by the scalar. This changes the magnitude but not the direction of the vector.' },
          { name: 'Magnitude (Length) of a Vector', formula: '|a⃗| = √(x² + y²)', example: '|(3, 4)| = √25 = 5', explain: 'The magnitude is always a positive number. It is found using the Pythagorean theorem on the components.' },
          { name: 'Unit Vector', formula: 'â = a⃗ / |a⃗|', example: '(3,4): |a|=5 → â = (0.6, 0.8)', explain: 'A unit vector has a magnitude of 1 and points in the same direction as the original vector.' },
          { name: 'Position & Displacement Vectors', formula: 'AB⃗ = OB⃗ − OA⃗', example: 'A=(2,3), B=(5,7) → AB⃗ = (3,4)', explain: 'The displacement vector from A to B is found by subtracting the position vector of A from that of B.' },
          { name: 'Parallel Vectors', formula: 'a⃗ ∥ b⃗  if  a⃗ = k b⃗', example: '(2,4) ∥ (1,2) since (2,4) = 2×(1,2)', explain: 'Two vectors are parallel if one is a scalar multiple of the other. Parallel vectors point in the same or opposite directions.' },
        ],
      },
      {
        topic: 'Matrices (Introduction)',
        icon: '[ ]',
        items: [
          { name: 'Matrix Order (Dimensions)', formula: 'm × n matrix: m rows, n columns', example: '2×3 matrix has 2 rows and 3 columns', explain: 'The order of a matrix is always stated as rows by columns. A square matrix has equal numbers of rows and columns.' },
          { name: 'Matrix Addition & Subtraction', formula: 'Add/subtract CORRESPONDING elements\n(same order only)', example: '[1 2]+[5 6]=[6 8]', explain: 'Only matrices of the same order can be added or subtracted. Add or subtract each pair of corresponding elements.' },
          { name: 'Scalar Multiplication (Matrix)', formula: 'k × every element in the matrix', example: '3 × [1 2] = [3 6]', explain: 'Multiply every single element in the matrix by the scalar. The order of the matrix does not change.' },
          { name: 'Matrix Multiplication', formula: '(AB)ᵢⱼ = Row i of A · Column j of B\nA is m×n; B is n×p → AB is m×p', example: '', explain: 'Matrix multiplication is NOT commutative: AB does not equal BA in general. The number of columns in A must equal rows in B.' },
          { name: 'Identity Matrix', formula: 'I = [1 0; 0 1];  AI = IA = A', example: '', explain: 'The identity matrix is the matrix equivalent of the number 1. Multiplying any matrix by the identity matrix leaves it unchanged.' },
          { name: 'Determinant of 2×2 Matrix', formula: 'det[a b; c d] = ad − bc', example: 'det[2 3; 1 4] = 8−3 = 5', explain: 'The determinant is a single number calculated from a matrix. If the determinant is zero the matrix has no inverse.' },
          { name: 'Inverse of 2×2 Matrix', formula: 'A⁻¹ = (1/det A) × [d −b; −c a]', example: 'A=[2 1; 1 1] detA=1 → A⁻¹=[1 −1; −1 2]', explain: 'Swap the diagonal elements, negate the off-diagonal elements, then divide by the determinant. Only exists when det ≠ 0.' },
          { name: 'Solving Equations with Matrices', formula: 'AX = B  →  X = A⁻¹B', example: '', explain: 'Matrix equations can solve simultaneous equations efficiently. Find the inverse of the coefficient matrix and multiply.' },
        ],
      },
      {
        topic: 'Sequences & Series',
        icon: '...',
        items: [
          { name: 'Arithmetic Sequence — nth Term', formula: 'aₙ = a + (n − 1)d\na = first term,  d = common difference', example: '2,5,8,11... → a₁₀ = 2+9×3 = 29', explain: 'In an arithmetic sequence each term increases by the same constant difference. Find any term using the nth term formula.' },
          { name: 'Sum of Arithmetic Series', formula: 'Sₙ = n/2 × [2a + (n−1)d]\n   = n/2 × (a + l)', example: '1+2+...+100: S₁₀₀ = 50 × 101 = 5050', explain: 'The sum of an arithmetic series can be found without adding every term. Use the first and last terms or the common difference.' },
          { name: 'Geometric Sequence — nth Term', formula: 'aₙ = a × rⁿ⁻¹\na = first term,  r = common ratio', example: '3,6,12,24... → a₅ = 3×2⁴ = 48', explain: 'In a geometric sequence each term is multiplied by the same constant ratio. The nth term is found by multiplying by r repeatedly.' },
          { name: 'Sum of Finite Geometric Series', formula: 'Sₙ = a(rⁿ − 1)/(r − 1)   for r ≠ 1', example: '3+6+12+24+48: S₅ = 3×31 = 93', explain: 'The sum of a finite geometric series uses the first term, common ratio and number of terms.' },
          { name: 'Sum to Infinity of GP', formula: 'S∞ = a/(1−r)   only when |r| < 1', example: '½+¼+⅛+... → S∞ = 1', explain: 'The sum converges to a finite value only when the common ratio is between -1 and 1 exclusively.' },
        ],
      },
      {
        topic: 'Sets',
        icon: '∪∩',
        items: [
          { name: 'Set Builder Notation', formula: 'A = { x : x satisfies condition }\n∈ means element of\n∉ means NOT element of', example: 'A = {x : x is even, x<10} = {2,4,6,8}', explain: 'Set builder notation defines a set by a rule. It is more concise than listing all elements when the set is large.' },
          { name: 'Union (OR)', formula: 'A ∪ B = all elements in A OR B (or both)', example: '{1,2,3} ∪ {2,3,4} = {1,2,3,4}', explain: 'The union contains everything from both sets. Each element is listed only once even if it appears in both sets.' },
          { name: 'Intersection (AND)', formula: 'A ∩ B = elements in BOTH A and B', example: '{1,2,3} ∩ {2,3,4} = {2,3}', explain: 'The intersection contains only elements that appear in both sets. It is the overlap between the two sets.' },
          { name: 'Complement', formula: "A' = elements in U but NOT in A", example: "U={1..5}, A={1,3} → A'={2,4,5}", explain: 'The complement contains everything in the universal set that is not in A. It depends on what the universal set is.' },
          { name: 'Inclusion-Exclusion Principle', formula: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)', example: 'n(A)=5, n(B)=7, n(A∩B)=3 → n(A∪B)=9', explain: 'Count elements in either set without double-counting the overlap. Subtract the intersection to correct for double-counting.' },
          { name: "De Morgan's Laws", formula: "(A ∪ B)' = A' ∩ B'\n(A ∩ B)' = A' ∪ B'", example: '', explain: "De Morgan's laws show how complements distribute over union and intersection. The union or intersection swaps when taking the complement." },
        ],
      },
    ],
  },

]
// =====================================================

// --------------- local storage helpers ---------------
const STORAGE_KEY_PROGRESS = 'math_progress'
const STORAGE_KEY_FAVOURITES = 'math_favourites'

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)) || {}
  } catch { return {} }
}
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress))
}
function loadFavourites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVOURITES)) || []
  } catch { return [] }
}
function saveFavourites(favs) {
  localStorage.setItem(STORAGE_KEY_FAVOURITES, JSON.stringify(favs))
}

// --------------- Formula Card (enhanced) --------------
function FormulaCard({ item, color, gradeId, topicIdx, itemIdx, isFavourite, onToggleFavourite, isUnderstood, onToggleUnderstood }) {
  const [expanded, setExpanded] = useState(false)

  const steps = item.explain
    .split('. ')
    .filter(s => s.trim().length > 0)
    .map((s, i) => s.trim().endsWith('.') ? s.trim() : s.trim() + '.')

  return (
    <div
      className="formula-card"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '8px',
        position: 'relative'
      }}
    >
      {/* Top row: name + expand button + star + checkbox */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            textAlign: 'left', flex: 1, display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text)', margin: 0, fontSize: '1.15rem', flex: 1 }}>{item.name}</p>
          <span style={{ color: color, fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>{expanded ? '−' : '+'}</span>
        </button>

        {/* Favourite star */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavourite(); }}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: isFavourite ? '#f59e0b' : 'var(--sub)' }}
        >
          {isFavourite ? '★' : '☆'}
        </button>

        {/* Understood checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.75rem', color: 'var(--sub)', cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={isUnderstood}
            onChange={(e) => { e.stopPropagation(); onToggleUnderstood(e.target.checked); }}
            style={{ width: '16px', height: '16px', accentColor: color }}
          />
          Got it!
        </label>
      </div>

      {/* Formula */}
      <code style={{
        background: color + '22',
        color: color,
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '1.05rem',
        fontWeight: 700,
        whiteSpace: 'pre-line',
        lineHeight: 1.9,
        fontFamily: 'monospace',
        display: 'block',
        marginTop: '10px',
        marginBottom: expanded ? '12px' : '0'
      }}>
        {item.formula}
      </code>

      {/* Expanded content */}
      <div className="expandable-content" style={{ display: expanded ? 'block' : 'none' }}>
        <div style={{ marginTop: '8px', marginBottom: '12px' }}>
          {steps.map((step, i) => (
            <p key={i} style={{
              color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8,
              margin: '0 0 6px', display: 'flex', gap: '8px'
            }}>
              <span style={{ fontWeight: 700, color: color, minWidth: '1.5em' }}>{i + 1}.</span>
              <span>{step}</span>
            </p>
          ))}
        </div>
        <div style={{
          background: 'var(--bg)', borderRadius: '8px', padding: '10px 14px',
          borderLeft: '3px solid ' + color
        }}>
          <span style={{ fontSize: '.68rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '.5px' }}>Example: </span>
          <span style={{ color: color, fontSize: '1.05rem', fontWeight: 600, fontFamily: 'monospace' }}>{item.example}</span>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function MathKnowledge() {
  const [search, setSearch] = useState('')
  const [activeGrade, setActiveGrade] = useState(null)   // null = all
  const [activeTopic, setActiveTopic] = useState(null)   // null = all within grade
  const [expandAll, setExpandAll] = useState(false)       // global expand
  const [gradeExpand, setGradeExpand] = useState({})      // per grade expand state
  const [favourites, setFavourites] = useState(loadFavourites)
  const [progress, setProgress] = useState(loadProgress)

  // Save favourites/progress to storage whenever they change
  useEffect(() => { saveFavourites(favourites) }, [favourites])
  useEffect(() => { saveProgress(progress) }, [progress])

  // Expand logic per grade
  const isGradeExpanded = (gradeId) => {
    return expandAll || gradeExpand[gradeId] || false
  }

  // Toggle favourite for a formula (identified by a key)
  const toggleFavourite = (formulaKey) => {
    setFavourites(prev => prev.includes(formulaKey) ? prev.filter(k => k !== formulaKey) : [...prev, formulaKey])
  }

  // Toggle understood status
  const toggleUnderstood = (formulaKey, isUnderstood) => {
    setProgress(prev => {
      const updated = { ...prev }
      if (isUnderstood) {
        updated[formulaKey] = true
      } else {
        delete updated[formulaKey]
      }
      return updated
    })
  }

  // Derive all unique topics from GRADES (for topic filter)
  const allTopics = useMemo(() => {
    const topicsSet = new Set()
    GRADES.forEach(g => g.topics.forEach(t => topicsSet.add(t.topic)))
    return Array.from(topicsSet)
  }, [])

  // Filter logic
  const filtered = useMemo(() => {
    let result = GRADES

    // Grade filter
    if (activeGrade) {
      result = result.filter(g => g.id === activeGrade)
    }

    // Search filter
    if (search) {
      result = result.map(g => ({
        ...g,
        topics: g.topics.map(t => ({
          ...t,
          items: t.items.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.formula.toLowerCase().includes(search.toLowerCase()) ||
            item.explain.toLowerCase().includes(search.toLowerCase()) ||
            item.example.toLowerCase().includes(search.toLowerCase())
          )
        })).filter(t => t.items.length > 0)
      })).filter(g => g.topics.length > 0)
    }

    // Topic filter (only when a grade is selected and no search?)
    if (activeTopic && activeGrade) {
      result = result.map(g => ({
        ...g,
        topics: g.topics.filter(t => t.topic === activeTopic)
      })).filter(g => g.topics.length > 0)
    }

    return result
  }, [search, activeGrade, activeTopic])

  // Compute favourites list items
  const favouriteItems = useMemo(() => {
    const items = []
    GRADES.forEach(g => g.topics.forEach(t => t.items.forEach((item, idx) => {
      const key = `${g.id}-${t.topic}-${idx}`
      if (favourites.includes(key)) {
        items.push({ ...item, key, gradeColor: g.color, gradeLabel: g.label })
      }
    })))
    return items
  }, [favourites])

  // Progress per grade (for display)
  const gradeProgress = useMemo(() => {
    const prog = {}
    GRADES.forEach(g => {
      let total = 0, understood = 0
      g.topics.forEach(t => t.items.forEach((_, idx) => {
        total++
        const key = `${g.id}-${t.topic}-${idx}`
        if (progress[key]) understood++
      }))
      prog[g.id] = { total, understood }
    })
    return prog
  }, [progress])

  const totalFormulas = useMemo(() => GRADES.reduce((sum, g) => sum + g.topics.reduce((s, t) => s + t.items.length, 0), 0), [])

  // Back-to-top
  const [showBackToTop, setShowBackToTop] = useState(false)
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Print single grade
  const printGrade = (gradeId) => {
    // Hide other grades and show only this one for print
    const container = document.getElementById('math-knowledge')
    const allSections = container.querySelectorAll('.grade-section')
    allSections.forEach(section => section.classList.remove('print-only'))
    const target = document.getElementById('grade-' + gradeId)
    if (target) target.classList.add('print-only')
    window.print()
    // Restore visibility after print dialog
    setTimeout(() => target?.classList.remove('print-only'), 500)
  }

  return (
    <div id="math-knowledge" style={{ maxWidth: '780px' }}>
      {/* Print styles (enhanced for per-grade printing) */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #math-knowledge, #math-knowledge * { visibility: visible; }
          #math-knowledge { position: absolute; left: 0; top: 0; width: 100%; }
          input, label[for="formula-search"], .back-to-top, button.formula-card, .grade-tabs, .topic-tags, .favourites-section, .expand-all-btn,
          .grade-header button, .grade-header .print-btn, .grade-header .expand-grade-btn { display: none !important; }
          .expandable-content { display: block !important; }
          .formula-card { page-break-inside: avoid; border: 1px solid #ccc !important; }
          code, span, p, h2, h1 { color: black !important; background: white !important; }
          /* Show only the selected grade when .print-only is applied */
          .grade-section { display: none !important; }
          .grade-section.print-only { display: block !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px' }}>Mathematics Knowledge</h1>
        <p style={{ fontSize: '.875rem', color: 'var(--sub)', margin: 0 }}>{totalFormulas} formulas from Grade 1 to Grade 9</p>
      </div>

      {/* Expand All / Collapse All button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => { setExpandAll(!expandAll); setGradeExpand({}) }}
          style={{
            padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)',
            background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '.8rem'
          }}
        >
          {expandAll ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {/* Search input + clear */}
      <label htmlFor="formula-search" style={{ position: 'absolute', left: '-9999px' }}>Search formulas</label>
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <input
          id="formula-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search formulas, e.g. pythagoras, percentage, area..."
          style={{
            width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: '12px', padding: '12px 16px', color: 'var(--text)',
            fontSize: '.9rem', outline: 'none', boxSizing: 'border-box'
          }}
        />
        {search && (
          <button onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.2rem',
              cursor: 'pointer', lineHeight: 1, padding: '4px 8px'
            }}
            aria-label="Clear search">✕</button>
        )}
      </div>

      {/* Grade filter tabs */}
      <div className="grade-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setActiveGrade(null); setActiveTopic(null) }}
          style={{
            padding: '6px 14px', borderRadius: '20px', border: '1.5px solid var(--border)',
            background: activeGrade === null ? 'var(--text)' : 'var(--bg)',
            color: activeGrade === null ? 'var(--bg)' : 'var(--text)',
            cursor: 'pointer', fontSize: '.8rem', fontWeight: 600
          }}
        >All</button>
        {GRADES.map(g => (
          <button
            key={g.id}
            onClick={() => { setActiveGrade(activeGrade === g.id ? null : g.id); setActiveTopic(null) }}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: '1.5px solid ' + g.color,
              background: activeGrade === g.id ? g.color : 'var(--bg)',
              color: activeGrade === g.id ? '#fff' : g.color,
              cursor: 'pointer', fontSize: '.8rem', fontWeight: 600
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Topic tags (only when a single grade is active) */}
      {activeGrade && (
        <div className="topic-tags" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {GRADES.find(g => g.id === activeGrade)?.topics.map(t => (
            <button
              key={t.topic}
              onClick={() => setActiveTopic(activeTopic === t.topic ? null : t.topic)}
              style={{
                padding: '4px 12px', borderRadius: '16px', border: '1px solid var(--border)',
                background: activeTopic === t.topic ? 'var(--text)' : 'var(--bg)',
                color: activeTopic === t.topic ? 'var(--bg)' : 'var(--text)',
                cursor: 'pointer', fontSize: '.75rem'
              }}
            >{t.topic}</button>
          ))}
        </div>
      )}

      {/* Favourites section */}
      {favouriteItems.length > 0 && (
        <div className="favourites-section" style={{ marginBottom: '32px', background: 'var(--bg)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', color: '#f59e0b', fontSize: '1rem' }}>⭐ My Favourites</h3>
          {favouriteItems.map(item => (
            <div key={item.key} style={{ marginBottom: '8px' }}>
              <FormulaCard
                item={item}
                color={item.gradeColor}
                gradeId="fav"
                topicIdx={0}
                itemIdx={0}
                isFavourite={true}
                onToggleFavourite={() => toggleFavourite(item.key)}
                isUnderstood={progress[item.key] || false}
                onToggleUnderstood={(val) => toggleUnderstood(item.key, val)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Grade sections */}
      {filtered.map(grade => {
        const prog = gradeProgress[grade.id] || { total: 0, understood: 0 }
        const percent = prog.total > 0 ? Math.round((prog.understood / prog.total) * 100) : 0
        return (
          <div
            key={grade.id}
            id={'grade-' + grade.id}
            className="grade-section"
            style={{
              marginBottom: '48px',
              borderLeft: '4px solid ' + grade.color,
              paddingLeft: '16px'
            }}
          >
            <div className="grade-header" style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
              paddingBottom: '12px', borderBottom: '2px solid ' + grade.color + '33'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 900, color: 'var(--text)', margin: '0 0 4px', fontSize: '1.3rem' }}>
                  {grade.label}
                </h2>
                <p style={{ color: 'var(--sub)', fontSize: '.75rem', margin: 0 }}>
                  {grade.topics.reduce((a, t) => a + t.items.length, 0)} formulas · {grade.topics.length} topics
                </p>
                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: percent + '%', height: '100%', background: grade.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '.7rem', color: 'var(--sub)', whiteSpace: 'nowrap' }}>{prog.understood}/{prog.total}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Expand/collapse this grade */}
                <button className="expand-grade-btn"
                  onClick={() => setGradeExpand(prev => ({ ...prev, [grade.id]: !prev[grade.id] }))}
                  style={{ background: 'none', border: 'none', color: grade.color, fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
                  aria-label={isGradeExpanded(grade.id) ? 'Collapse grade' : 'Expand grade'}
                >{isGradeExpanded(grade.id) ? '−' : '+'}</button>
                {/* Print this grade */}
                <button className="print-btn"
                  onClick={() => printGrade(grade.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--sub)', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}
                  aria-label="Print this grade"
                >🖨️</button>
              </div>
            </div>

            {grade.topics.map((topic, ti) => (
              <div key={ti} style={{ marginBottom: '24px', marginLeft: '12px' }}>
                <p style={{
                  fontWeight: 800, color: grade.color, fontSize: '.82rem',
                  textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 10px'
                }}>{topic.topic}</p>
                {topic.items.map((item, i) => {
                  const formulaKey = `${grade.id}-${topic.topic}-${i}`
                  return (
                    <FormulaCard
                      key={i}
                      item={item}
                      color={grade.color}
                      gradeId={grade.id}
                      topicIdx={ti}
                      itemIdx={i}
                      isFavourite={favourites.includes(formulaKey)}
                      onToggleFavourite={() => toggleFavourite(formulaKey)}
                      isUnderstood={progress[formulaKey] || false}
                      onToggleUnderstood={(val) => toggleUnderstood(formulaKey, val)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--sub)' }}>
          <p style={{ fontWeight: 600, margin: 0 }}>No formulas found for "{search}"</p>
        </div>
      )}

      {/* Back to top */}
      {showBackToTop && (
        <button className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: '50%', width: '44px', height: '44px',
            fontSize: '1.5rem', color: 'var(--text)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 1000
          }}
          aria-label="Back to top">↑</button>
      )}
    </div>
  )
}
