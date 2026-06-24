import { useState, useMemo, useEffect } from 'react'

const GRADES = [
 {
 id: 'g12', label: 'Grade 1 - 2', color: '#3b82f6',
 topics: [
 { topic: 'Numbers & Counting', items: [
 { name: 'Counting', formula: '1, 2, 3, 4, 5 ...', explain: 'Count one object at a time. Touch each object as you say its number.', example: '3 apples = count 1, 2, 3' },
 { name: 'Place Value', formula: 'Units | Tens | Hundreds', explain: 'The position of a digit tells its value. In 34: 3 is in the tens place (= 30), 4 is in the units place (= 4).', example: '34 = 30 + 4' },
 { name: 'Comparing Numbers', formula: '> greater than | < less than | = equal to', explain: 'Compare numbers using these symbols.', example: '7 > 4 | 3 < 8 | 5 = 5' },
 { name: 'Number Bonds', formula: 'a + b = c => c - a = b => c - b = a', explain: 'If you know 3 + 4 = 7, you also know 7 - 3 = 4 and 7 - 4 = 3.', example: '5 + 3 = 8 | 8 - 5 = 3 | 8 - 3 = 5' },
 { name: 'Odd and Even Numbers', formula: 'Even: 2, 4, 6, 8 ... Odd: 1, 3, 5, 7 ...', explain: 'Even numbers can be split into two equal groups. Odd numbers cannot.', example: '6 is even (3+3) | 7 is odd' },
 { name: 'Ordering Numbers', formula: 'Ascending: smallest to largest. Descending: largest to smallest.', explain: 'Use a number line to help order numbers correctly.', example: '2, 5, 9, 12 (ascending)' },
 { name: 'Skip Counting', formula: 'Count in 2s, 5s, 10s', explain: 'Jump forward by the same number each time.', example: '2, 4, 6, 8, 10 (skip count in 2s)' },
 { name: 'Rounding Numbers', formula: 'Look at the next digit: 0-4 round down, 5-9 round up', explain: 'Rounding makes numbers easier to work with.', example: '47 rounded to nearest 10 = 50' },
 ]},
 { topic: 'Addition and Subtraction', items: [
 { name: 'Addition', formula: 'a + b = sum', explain: 'Combining two or more numbers to get a total.', example: '6 + 4 = 10' },
 { name: 'Subtraction', formula: 'a - b = difference', explain: 'Taking away a number from another. Count back from the larger number.', example: '9 - 3 = 6' },
 { name: 'Addition with Carrying', formula: 'Units first, carry tens', explain: 'When units add up to 10 or more, carry the 1 to the tens column.', example: '17 + 25 = 42 (7+5=12, write 2 carry 1)' },
 { name: 'Subtraction with Borrowing', formula: 'Borrow 1 ten = 10 units from next column', explain: 'If the top digit is smaller, borrow from the next column.', example: '43 - 17 = 26 (borrow 1 from tens)' },
 { name: 'Doubles', formula: 'a + a = 2a', explain: 'Doubling a number means adding it to itself.', example: '7 + 7 = 14 | 9 + 9 = 18' },
 { name: 'Number Line', formula: 'Jump forward to add, jump backward to subtract', explain: 'Use a number line to visualise addition and subtraction.', example: '5 + 3: start at 5, jump 3 forward = 8' },
 { name: 'Fact Families', formula: 'a + b = c, b + a = c, c - a = b, c - b = a', explain: 'Four related number facts using the same three numbers.', example: '3+5=8, 5+3=8, 8-3=5, 8-5=3' },
 ]},
 { topic: 'Shapes and Measurements', items: [
 { name: '2D Shapes', formula: 'Triangle: 3 sides | Square: 4 equal sides | Rectangle: 4 sides | Circle: 0 sides', explain: 'Count the sides and corners of each shape.', example: 'A door = rectangle | A coin = circle' },
 { name: '3D Shapes', formula: 'Cube: 6 faces | Sphere: 1 curved | Cylinder: 2 circles + 1 curved', explain: 'Count faces, edges and vertices (corners).', example: 'A box = cuboid | A ball = sphere' },
 { name: 'Measuring Length', formula: 'Length in cm or m', explain: 'Use a ruler marked in cm. 100 cm = 1 m.', example: 'The pencil is 12 cm long' },
 { name: 'Measuring Mass', formula: 'Mass in grams (g) or kilograms (kg)', explain: 'Use a scale. 1000 g = 1 kg.', example: 'A bag of rice = 2 kg = 2000 g' },
 { name: 'Measuring Capacity', formula: 'Capacity in ml or litres (L)', explain: '1000 ml = 1 L.', example: 'A water bottle = 500 ml' },
 { name: 'Telling Time', formula: 'Short hand = hours | Long hand = minutes', explain: 'Each mark on the clock = 5 minutes.', example: '3:30 = half past three' },
 { name: 'Days, Weeks, Months', formula: '7 days = 1 week | 12 months = 1 year | 365 days = 1 year', explain: 'Learn the order of days and months.', example: 'Monday is the 1st day of the week' },
 { name: 'Lines of Symmetry', formula: 'A shape has symmetry if both halves are mirror images', explain: 'Fold the shape in half - if it matches, there is a line of symmetry.', example: 'A square has 4 lines of symmetry' },
 ]},
 ]
 },
 {
 id: 'g34', label: 'Grade 3 - 4', color: '#10b981',
 topics: [
 { topic: 'Multiplication', items: [
 { name: 'Repeated Addition', formula: 'a x b = a + a + ... (b times)', explain: '3 x 4 means add 3 four times: 3+3+3+3 = 12.', example: '5 x 3 = 15' },
 { name: 'Times Tables', formula: '1 to 12 times tables', explain: 'Learn all tables 1-12. Tricky ones: 6x7=42, 7x8=56, 8x9=72.', example: '7 x 8 = 56 | 9 x 6 = 54' },
 { name: 'Commutative Property', formula: 'a x b = b x a', explain: 'Order does not matter in multiplication.', example: '4 x 7 = 7 x 4 = 28' },
 { name: 'Distributive Law', formula: 'a x (b + c) = (a x b) + (a x c)', explain: 'Split a number to make multiplication easier.', example: '6 x 13 = 6x10 + 6x3 = 60+18 = 78' },
 { name: 'Multiplying by 10 and 100', formula: 'x10: shift digits left 1 place. x100: shift 2 places.', explain: 'Add zeros when multiplying by powers of 10.', example: '34 x 10 = 340 | 34 x 100 = 3400' },
 { name: 'Long Multiplication', formula: 'Multiply units, then tens, add results', explain: 'Work column by column and add the partial products.', example: '23 x 14 = 23x4 + 23x10 = 92+230 = 322' },
 { name: 'Associative Property', formula: '(a x b) x c = a x (b x c)', explain: 'Grouping does not change the result when multiplying.', example: '(2 x 3) x 4 = 2 x (3 x 4) = 24' },
 ]},
 { topic: 'Division', items: [
 { name: 'Division as Sharing', formula: 'a / b = c', explain: '12 / 3 = 4 means 12 shared into 3 groups gives 4 each.', example: '20 / 4 = 5' },
 { name: 'Division with Remainder', formula: 'a / b = c remainder r', explain: 'When a number cannot be divided exactly.', example: '17 / 5 = 3 remainder 2' },
 { name: 'Link to Multiplication', formula: 'a x b = c => c / a = b => c / b = a', explain: 'Multiplication and division are inverse operations.', example: '6 x 7 = 42 => 42 / 6 = 7' },
 { name: 'Dividing by 10 and 100', formula: '/10: shift digits right 1. /100: shift 2.', explain: 'Remove zeros when dividing by powers of 10.', example: '340 / 10 = 34 | 3400 / 100 = 34' },
 { name: 'Short Division (Bus Stop)', formula: 'Divide digit by digit from left to right', explain: 'Write remainder above next digit and carry it over.', example: '84 / 4 = 21' },
 { name: 'Divisibility Rules', formula: '/2: ends in even | /5: ends in 0 or 5 | /10: ends in 0 | /3: digit sum divisible by 3', explain: 'Quick checks to see if a number divides exactly.', example: '135 / 3: 1+3+5=9, 9/3=3, so yes' },
 ]},
 { topic: 'Fractions (Intro)', items: [
 { name: 'What is a Fraction?', formula: 'Numerator / Denominator', explain: 'Denominator = how many equal parts. Numerator = how many you have.', example: '3/4 = 3 out of 4 equal parts' },
 { name: 'Equivalent Fractions', formula: 'a/b = (axn) / (bxn)', explain: 'Multiply top and bottom by the same number.', example: '1/2 = 2/4 = 4/8' },
 { name: 'Simplifying Fractions', formula: 'Divide numerator and denominator by HCF', explain: 'HCF = Highest Common Factor of both numbers.', example: '6/9 = 2/3 (divide by 3)' },
 { name: 'Comparing Fractions', formula: 'Same denominator: a/c > b/c if a > b', explain: 'With the same denominator, bigger numerator = bigger fraction.', example: '3/5 > 2/5' },
 { name: 'Adding Fractions (same denominator)', formula: 'a/c + b/c = (a+b) / c', explain: 'Keep the denominator the same, add the numerators.', example: '2/7 + 3/7 = 5/7' },
 { name: 'Subtracting Fractions (same denominator)', formula: 'a/c - b/c = (a-b) / c', explain: 'Keep the denominator the same, subtract the numerators.', example: '5/7 - 2/7 = 3/7' },
 { name: 'Mixed Numbers', formula: 'Whole number + fraction = mixed number', explain: 'E.g. 2 and 3/4 means 2 whole units and 3/4 of another.', example: '11/4 = 2 and 3/4' },
 { name: 'Fractions of a Quantity', formula: 'a/b of n = (n / b) x a', explain: 'Divide by the denominator first, then multiply by the numerator.', example: '3/4 of 20 = (20/4) x 3 = 15' },
 ]},
 { topic: 'Number and Operations', items: [
 { name: 'Highest Common Factor (HCF)', formula: 'Largest factor that divides both numbers', explain: 'List all factors of each number, find the largest one they share.', example: 'HCF of 12 and 18 = 6' },
 { name: 'Lowest Common Multiple (LCM)', formula: 'Smallest multiple shared by both numbers', explain: 'List multiples of each number until you find a match.', example: 'LCM of 4 and 6 = 12' },
 { name: 'Factors', formula: 'Factors of n: all whole numbers that divide n exactly', explain: 'A factor divides into a number with no remainder.', example: 'Factors of 12: 1, 2, 3, 4, 6, 12' },
 { name: 'Multiples', formula: 'Multiples of n: n, 2n, 3n, 4n ...', explain: 'Multiples are the results of multiplying a number by 1, 2, 3, ...', example: 'Multiples of 5: 5, 10, 15, 20, 25 ...' },
 { name: 'Prime Numbers', formula: 'A number with exactly 2 factors: 1 and itself', explain: 'Prime numbers cannot be divided by anything other than 1 and themselves.', example: '2, 3, 5, 7, 11, 13, 17, 19 ...' },
 { name: 'Square Numbers', formula: 'n x n = n^2', explain: 'Multiply a number by itself.', example: '4^2 = 16 | 5^2 = 25 | 9^2 = 81' },
 ]},
 ]
 },
 {
 id: 'g56', label: 'Grade 5 - 6', color: '#f97316',
 topics: [
 { topic: 'Fractions, Decimals and Percentages', items: [
 { name: 'Fraction to Decimal', formula: 'Divide numerator by denominator', explain: 'Divide the top number by the bottom number.', example: '3/4 = 3 / 4 = 0.75' },
 { name: 'Decimal to Percentage', formula: 'Decimal x 100 = %', explain: 'Multiply the decimal by 100.', example: '0.75 x 100 = 75%' },
 { name: 'Percentage of a Number', formula: '(% / 100) x number', explain: 'Divide the % by 100 then multiply.', example: '20% of 80 = 0.2 x 80 = 16' },
 { name: 'Percentage Increase/Decrease', formula: 'New = Original x (1 +/- %/100)', explain: 'Increase: multiply by (1 + rate). Decrease: multiply by (1 - rate).', example: '200 + 15% = 200 x 1.15 = 230' },
 { name: 'Adding Fractions (different denominators)', formula: 'Find LCM, convert, then add', explain: 'Make denominators the same using the Lowest Common Multiple.', example: '1/3 + 1/4 = 4/12 + 3/12 = 7/12' },
 { name: 'Multiplying Fractions', formula: '(a/b) x (c/d) = ac / bd', explain: 'Multiply numerators together and denominators together.', example: '2/3 x 3/5 = 6/15 = 2/5' },
 { name: 'Dividing Fractions', formula: '(a/b) / (c/d) = (a/b) x (d/c)', explain: 'Flip the second fraction (reciprocal) and multiply.', example: '2/3 / 4/5 = 2/3 x 5/4 = 10/12 = 5/6' },
 { name: 'Converting Mixed Numbers', formula: 'a(b/c) = (a x c + b) / c', explain: 'Multiply the whole number by denominator and add numerator.', example: '2(3/4) = (2x4+3)/4 = 11/4' },
 ]},
 { topic: 'Area and Perimeter', items: [
 { name: 'Perimeter of Rectangle', formula: 'P = 2(l + w)', explain: 'Add all four sides: length + width + length + width.', example: 'l=8, w=5 => P = 2(13) = 26 cm' },
 { name: 'Perimeter of Square', formula: 'P = 4s', explain: 'All four sides are equal.', example: 's=6 => P = 24 cm' },
 { name: 'Area of Rectangle', formula: 'A = l x w', explain: 'Length times width.', example: 'l=9, w=4 => A = 36 cm2' },
 { name: 'Area of Square', formula: 'A = s^2', explain: 'Side squared (side times side).', example: 's=7 => A = 49 cm2' },
 { name: 'Area of Triangle', formula: 'A = (1/2) x b x h', explain: 'Half of base times perpendicular height.', example: 'b=10, h=6 => A = 30 cm2' },
 { name: 'Area of Parallelogram', formula: 'A = b x h', explain: 'Base times perpendicular height (not the slant side).', example: 'b=8, h=5 => A = 40 cm2' },
 { name: 'Circumference of Circle', formula: 'C = 2 x pi x r (pi = 3.14)', explain: 'Distance around a circle.', example: 'r=5 => C = 31.4 cm' },
 { name: 'Area of Circle', formula: 'A = pi x r^2', explain: 'Pi times radius squared.', example: 'r=4 => A = 50.24 cm2' },
 { name: 'Area of Trapezium', formula: 'A = (1/2) x (a + b) x h', explain: 'Half of the sum of parallel sides times the height.', example: 'a=5, b=9, h=4 => A = 28 cm2' },
 ]},
 { topic: 'Ratios and Rates', items: [
 { name: 'Ratio', formula: 'a : b', explain: 'Compares two quantities. Simplify by dividing both by their HCF.', example: '12:8 = 3:2' },
 { name: 'Dividing in a Ratio', formula: 'Total / (sum of parts) x each part', explain: 'Find the value of one part then multiply.', example: '45 in ratio 2:3 => one part=9 => 18 and 27' },
 { name: 'Speed Distance Time', formula: 'S = D/T | D = S x T | T = D/S', explain: 'Cover the letter you want to find in the SDT triangle.', example: 'D=120km, T=3h => S = 40 km/h' },
 { name: 'Direct Proportion', formula: 'y = kx (k is constant)', explain: 'As one value doubles, the other doubles too.', example: '3 pens cost 15, 6 pens cost 30' },
 { name: 'Scale and Maps', formula: 'Actual = Map distance x Scale factor', explain: 'Scale 1:50000 means 1 cm on map = 50000 cm in real life.', example: '2 cm on map at 1:50000 = 1 km real' },
 { name: 'Unit Rate', formula: 'Rate per 1 unit = total / number of units', explain: 'Find how much per one unit.', example: '180 km in 3 hours = 60 km per hour' },
 { name: 'Currency Conversion', formula: 'Amount in new currency = Amount x Exchange rate', explain: 'Multiply by the exchange rate to convert.', example: '50 USD x 130 KES/USD = 6500 KES' },
 ]},
 { topic: 'Algebra (Introduction)', items: [
 { name: 'Writing Expressions', formula: 'Use a letter (variable) for an unknown number', explain: 'x + 3 means 3 more than an unknown number x.', example: 'n + 5 | 2n | n - 7' },
 { name: 'Simplifying Expressions', formula: 'Collect like terms: ax + bx = (a+b)x', explain: 'Only add or subtract terms with the same variable.', example: '3x + 5x = 8x | 4x + 2y (cannot simplify)' },
 { name: 'Substitution', formula: 'Replace the variable with a number and evaluate', explain: 'Put the number in place of the letter and calculate.', example: 'If x=4: 3x + 2 = 3(4)+2 = 14' },
 { name: 'Simple Equations', formula: 'x + a = b => x = b - a', explain: 'Do the inverse operation to both sides.', example: 'x + 6 = 10 => x = 4' },
 ]},
 ]
 },
 {
 id: 'g789', label: 'Grade 7 - 9', color: '#8b5cf6',
 topics: [
 { topic: 'Algebra', items: [
 { name: 'Linear Equations', formula: 'ax + b = c => x = (c - b) / a', explain: 'Do the same operation to both sides to isolate x.', example: '3x + 5 = 20 => x = 5' },
 { name: 'Expanding Brackets', formula: 'a(b + c) = ab + ac', explain: 'Multiply the term outside by every term inside.', example: '3(x + 4) = 3x + 12' },
 { name: 'Factorising', formula: 'ab + ac = a(b + c)', explain: 'Take out the highest common factor.', example: '6x + 9 = 3(2x + 3)' },
 { name: 'Simultaneous Equations', formula: 'Eliminate one variable, solve for other', explain: 'Add or subtract equations to remove one unknown, then substitute.', example: 'x+y=10 and x-y=4 => x=7, y=3' },
 { name: 'Quadratic Formula', formula: 'x = [-b +/- sqrt(b^2 - 4ac)] / 2a', explain: 'Solves ax^2 + bx + c = 0.', example: 'x^2+5x+6=0 => x=-2 or x=-3' },
 { name: 'Factorising Quadratics', formula: 'x^2 + (a+b)x + ab = (x+a)(x+b)', explain: 'Find two numbers that add to give b and multiply to give c.', example: 'x^2+7x+12 = (x+3)(x+4)' },
 { name: 'Difference of Two Squares', formula: 'a^2 - b^2 = (a+b)(a-b)', explain: 'Special factorisation pattern.', example: 'x^2 - 9 = (x+3)(x-3)' },
 { name: 'Inequalities', formula: 'Solve like equation; flip sign if multiplying or dividing by negative', explain: 'x > 2 means x can be any value greater than 2.', example: '2x + 1 > 7 => x > 3' },
 { name: 'Gradient of a Line', formula: 'm = (y2 - y1) / (x2 - x1)', explain: 'Rise over run between two points on a line.', example: 'Points (1,2) and (3,8) => m = (8-2)/(3-1) = 3' },
 { name: 'Equation of a Line', formula: 'y = mx + c (m = gradient, c = y-intercept)', explain: 'm is the slope, c is where the line crosses the y-axis.', example: 'm=2, c=-1 => y = 2x - 1' },
 { name: 'Algebraic Fractions', formula: 'Simplify by cancelling common factors top/bottom', explain: 'Factorise numerator and denominator then cancel.', example: '(x^2-4)/(x+2) = (x+2)(x-2)/(x+2) = x-2' },
 ]},
 { topic: 'Geometry', items: [
 { name: 'Angles on Straight Line', formula: 'a + b + c = 180 degrees', explain: 'All angles on a straight line sum to 180.', example: '110 + 70 = 180' },
 { name: 'Angles in Triangle', formula: 'a + b + c = 180 degrees', explain: 'Three interior angles always sum to 180.', example: '90 + 60 + x = 180 => x = 30' },
 { name: 'Angles in Quadrilateral', formula: 'a + b + c + d = 360 degrees', explain: 'Four interior angles always sum to 360.', example: '90+90+80+x = 360 => x = 100' },
 { name: 'Exterior Angle of Triangle', formula: 'Exterior angle = sum of 2 opposite interior angles', explain: 'An exterior angle equals the two non-adjacent interior angles.', example: '50 + 70 = 120 degrees' },
 { name: 'Interior Angles of Polygon', formula: 'Sum = (n - 2) x 180 (n = number of sides)', explain: 'Works for any polygon.', example: 'Pentagon (n=5): (5-2)x180 = 540 degrees' },
 { name: 'Volume of Cuboid', formula: 'V = l x w x h', explain: 'Multiply length, width and height.', example: '5 x 4 x 3 = 60 cm3' },
 { name: 'Volume of Cylinder', formula: 'V = pi x r^2 x h', explain: 'Area of circle base times height.', example: 'r=3, h=10 => V = 282.6 cm3' },
 { name: 'Surface Area of Cuboid', formula: 'SA = 2(lw + lh + wh)', explain: 'Add up the area of all 6 faces.', example: 'l=4, w=3, h=2 => SA = 52 cm2' },
 { name: 'Arc Length', formula: 'Arc = (angle/360) x 2 x pi x r', explain: 'Fraction of the full circumference based on the angle.', example: 'angle=90, r=6 => Arc = 9.42 cm' },
 { name: 'Sector Area', formula: 'Sector = (angle/360) x pi x r^2', explain: 'Fraction of the full circle area based on the angle.', example: 'angle=90, r=6 => Sector = 28.27 cm2' },
 { name: 'Transformations', formula: 'Translation: shift | Reflection: flip | Rotation: turn | Enlargement: scale', explain: 'Four types of transformation in geometry.', example: 'Translate (3,2): move 3 right and 2 up' },
 ]},
 { topic: 'Pythagoras Theorem', items: [
 { name: 'Pythagoras Theorem', formula: 'a^2 + b^2 = c^2 (c = hypotenuse)', explain: 'In a right-angled triangle, the square of hypotenuse = sum of squares of the other two sides.', example: '3^2 + 4^2 = 5^2 => 9 + 16 = 25' },
 { name: 'Finding the Hypotenuse', formula: 'c = sqrt(a^2 + b^2)', explain: 'Square both shorter sides, add them, then square root.', example: 'a=6, b=8 => c = sqrt(100) = 10' },
 { name: 'Finding a Shorter Side', formula: 'a = sqrt(c^2 - b^2)', explain: 'Rearrange to find one of the shorter sides.', example: 'c=13, b=5 => a = sqrt(144) = 12' },
 { name: 'Distance Formula', formula: 'd = sqrt[(x2-x1)^2 + (y2-y1)^2]', explain: 'Pythagoras applied to coordinate grids.', example: 'Points (1,2) and (4,6) => d = sqrt(9+16) = 5' },
 ]},
 { topic: 'Trigonometry', items: [
 { name: 'SOH CAH TOA', formula: 'Sin = Opp/Hyp | Cos = Adj/Hyp | Tan = Opp/Adj', explain: 'Label sides relative to the angle in a right-angled triangle.', example: 'Opp=4, Hyp=5 => Sin = 0.8 => angle = 53.1 deg' },
 { name: 'Finding a Side', formula: 'Side = Hyp x Sin/Cos/Tan(angle)', explain: 'Rearrange the ratio to find the missing side.', example: 'Hyp=10, angle=30 => Opp = 5' },
 { name: 'Finding an Angle', formula: 'angle = sin^-1(Opp/Hyp)', explain: 'Use inverse trig functions to find the angle.', example: 'Opp=3, Hyp=5 => angle = sin^-1(0.6) = 36.87' },
 { name: 'Sine Rule', formula: 'a/sinA = b/sinB = c/sinC', explain: 'Used in any triangle when you know angle-side pairs.', example: 'a=7, A=30, B=45 => b = 9.9' },
 { name: 'Cosine Rule', formula: 'a^2 = b^2 + c^2 - 2bc x cosA', explain: 'Used when you know two sides and the included angle, or all three sides.', example: 'b=5, c=7, A=60 => a = 6.24' },
 { name: 'Area of Any Triangle', formula: 'Area = (1/2) x a x b x sinC', explain: 'Use when you know two sides and the angle between them.', example: 'a=8, b=6, C=30 => Area = 12 cm2' },
 ]},
 { topic: 'Statistics and Probability', items: [
 { name: 'Mean', formula: 'Mean = Sum of values / Count', explain: 'Add all values then divide by how many there are.', example: '(4+7+9+10) / 4 = 30/4 = 7.5' },
 { name: 'Median', formula: 'Middle value when data is sorted', explain: 'Sort data. Middle one if odd count; average of two middle values if even.', example: '2, 4, 6, 8, 10 => Median = 6' },
 { name: 'Mode', formula: 'Most frequent value in the data set', explain: 'The value that appears most often. Can be more than one mode.', example: '3, 5, 5, 9, 9, 9 => Mode = 9' },
 { name: 'Range', formula: 'Range = Highest - Lowest', explain: 'Shows the spread of the data.', example: '15 - 3 = 12' },
 { name: 'Probability', formula: 'P = Favourable outcomes / Total outcomes', explain: 'A value between 0 (impossible) and 1 (certain).', example: 'P(head) = 1/2 = 0.5 = 50%' },
 { name: 'Complementary Events', formula: 'P(A) + P(not A) = 1', explain: 'The probability of an event not happening = 1 minus P(event).', example: 'P(rain) = 0.3 => P(no rain) = 0.7' },
 { name: 'Combined Events', formula: 'P(A and B) = P(A) x P(B) [independent]', explain: 'Multiply probabilities for independent events.', example: 'P(H and H) = 0.5 x 0.5 = 0.25' },
 { name: 'Mean from Frequency Table', formula: 'Mean = Sum(fx) / Sum(f)', explain: 'Multiply each value by its frequency, add up, then divide by total frequency.', example: 'Values 2,3,4 freq 1,3,2 => Mean = (2+9+8)/6 = 3.17' },
 { name: 'Standard Deviation (basic)', formula: 'SD = sqrt[Sum(x - mean)^2 / n]', explain: 'Measures how spread out the data is from the mean.', example: 'Data 2,4,4,4,5,5,7,9 => mean=5, SD=2' },
 ]},
 { topic: 'Indices (Powers)', items: [
 { name: 'Index Notation', formula: 'a^n = a x a x a ... (n times)', explain: 'The index tells how many times to multiply the base by itself.', example: '2^5 = 2x2x2x2x2 = 32' },
 { name: 'Multiplying Indices', formula: 'a^m x a^n = a^(m+n)', explain: 'Add the powers when multiplying (same base).', example: '3^3 x 3^4 = 3^7 = 2187' },
 { name: 'Dividing Indices', formula: 'a^m / a^n = a^(m-n)', explain: 'Subtract the powers when dividing (same base).', example: '5^6 / 5^2 = 5^4 = 625' },
 { name: 'Power of a Power', formula: '(a^m)^n = a^(m x n)', explain: 'Multiply the powers.', example: '(2^3)^4 = 2^12 = 4096' },
 { name: 'Zero Index', formula: 'a^0 = 1', explain: 'Any non-zero number to the power 0 equals 1.', example: '7^0 = 1 | 100^0 = 1' },
 { name: 'Negative Index', formula: 'a^(-n) = 1 / a^n', explain: 'Negative index means the reciprocal.', example: '2^(-3) = 1/8 | 5^(-2) = 1/25' },
 { name: 'Fractional Index', formula: 'a^(1/n) = nth root of a', explain: 'A fractional index means a root.', example: '81^(1/2) = sqrt(81) = 9 | 8^(1/3) = 2' },
 { name: 'Standard Form', formula: 'a x 10^n (1 <= a < 10)', explain: 'A way to write very large or very small numbers.', example: '3400000 = 3.4 x 10^6 | 0.0005 = 5 x 10^-4' },
 ]},
 { topic: 'Number Theory', items: [
 { name: 'Prime Factorisation', formula: 'Every integer > 1 is either prime or a product of primes', explain: 'Break a number down into its prime factors using a factor tree.', example: '60 = 2 x 2 x 3 x 5 = 2^2 x 3 x 5' },
 { name: 'HCF using Prime Factors', formula: 'HCF = product of common prime factors (lowest powers)', explain: 'Write both numbers as products of primes. Multiply shared factors.', example: 'HCF(12,18): 12=2^2x3, 18=2x3^2 => HCF=2x3=6' },
 { name: 'LCM using Prime Factors', formula: 'LCM = product of all prime factors (highest powers)', explain: 'Write both numbers as products of primes. Take each factor at its highest power.', example: 'LCM(12,18): 2^2 x 3^2 = 4x9 = 36' },
 { name: 'Surds', formula: 'sqrt(ab) = sqrt(a) x sqrt(b) | sqrt(a/b) = sqrt(a)/sqrt(b)', explain: 'Surds are irrational square roots. Simplify by finding square factors.', example: 'sqrt(50) = sqrt(25x2) = 5 x sqrt(2)' },
 { name: 'Rationalising the Denominator', formula: 'Multiply top and bottom by the surd in denominator', explain: 'Remove surds from the denominator of a fraction.', example: '1/sqrt(3) = sqrt(3)/3' },
 ]},
 ]
 },
]

function FormulaCard({ item, color }) {
 return (
 <div style={{
 background: 'var(--bg)',
 border: '1px solid var(--border)',
 borderRadius: '10px', padding: '14px 16px', marginBottom: '8px',
 }}>
 <p style={{ fontWeight: 700, color: 'var(--text)', margin: '0 0 5px', fontSize: '.9rem' }}>{item.name}</p>
 <code style={{ background: color + '22', color: color, padding: '3px 10px', borderRadius: '6px', fontSize: '.82rem', fontFamily: 'monospace', display: 'inline-block', marginBottom: '10px' }}>{item.formula}</code>
 <p style={{ color: 'var(--text)', fontSize: '.85rem', lineHeight: 1.7, margin: '0 0 8px' }}>{item.explain}</p>
 <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '10px 14px', borderLeft: '3px solid ' + color }}>
 <span style={{ fontSize: '.68rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '.5px' }}>Example: </span>
 <span style={{ color: color, fontSize: '.85rem', fontFamily: 'monospace' }}>{item.example}</span>
 </div>
 </div>
 )
}

export default function MathKnowledge() {
 const [search, setSearch] = useState('')

 const filtered = useMemo(() => GRADES.map(g => ({
  ...g,
  topics: g.topics.map(t => ({
    ...t,
    items: t.items.filter(item =>
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.formula.toLowerCase().includes(search.toLowerCase()) ||
      item.explain.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(t => !search || t.items.length > 0)
})).filter(g => !search || g.topics.length > 0), [search])

 const totalFormulas = useMemo(() => GRADES.reduce((sum, g) => sum + g.topics.reduce((s, t) => s + t.items.length, 0), 0), [])

 return (
 <div style={{ maxWidth: '780px' }}>
 <div style={{ marginBottom: '24px' }}>
 <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px' }}>Mathematics Knowledge</h1>
 <p style={{ fontSize: '.875rem', color: 'var(--sub)', margin: 0 }}>{totalFormulas} formulas from Grade 1 to Grade 9 --</p>
 </div>

 <label htmlFor="formula-search" style={{ position: 'absolute', left: '-9999px' }}>Search formulas</label>
        <div style={{ position: 'relative' }}>
          <input
            id="formula-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search formulas, e.g. pythagoras, percentage, area..."
            style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 16px', color: 'var(--text)', fontSize: '.9rem', outline: 'none', marginBottom: '32px', boxSizing: 'border-box' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.2rem',
                cursor: 'pointer', lineHeight: 1, padding: '4px 8px'
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

 {filtered.map(grade => (
 <div key={grade.id} style={{ marginBottom: '48px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid ' + grade.color + '33' }}>
 <div style={{ flex: 1 }}>
 <h2 style={{ fontWeight: 900, color: 'var(--text)', margin: 0, fontSize: '1.3rem' }}>{grade.label}</h2>
 <p style={{ color: 'var(--sub)', fontSize: '.75rem', margin: 0 }}>
 {grade.topics.reduce((a, t) => a + t.items.length, 0)} formulas across {grade.topics.length} topics
 </p>
 </div>
 <span style={{ background: grade.color + '22', color: grade.color, fontSize: '.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: '1px solid ' + grade.color + '44' }}>
 {grade.topics.length} topics
 </span>
 </div>

 {grade.topics.map((topic, ti) => (
 <div key={ti} style={{ marginBottom: '24px' }}>
 <p style={{ fontWeight: 800, color: grade.color, fontSize: '.82rem', textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 10px' }}>{topic.topic}</p>
 {topic.items.map((item, i) => <FormulaCard key={i} item={item} color={grade.color} />)}
 </div>
 ))}
 </div>
 ))}

 {filtered.length === 0 && (
 <div style={{ textAlign: 'center', padding: '48px', color: 'var(--sub)' }}>
 <p style={{ fontWeight: 600, margin: 0 }}>No formulas found for "{search}"</p>
 </div>
 )}
 </div>
 )
}
