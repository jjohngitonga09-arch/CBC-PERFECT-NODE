const fs = require("fs");
const BT = String.fromCharCode(96);
const p = "C:/Users/pc/Downloads/eduapp/frontend/src/pages/student/curriculumData.js";
let c = fs.readFileSync(p, "utf8");
let errors = 0;

function rep(label, find, repl) {
  if (!c.includes(find)) {
    console.error("NOT FOUND [" + label + "]: " + find.substring(0, 100));
    errors++;
    return;
  }
  c = c.split(find).join(repl);
  console.log("\u2713 " + label);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PP1 Language: Insert Vowels card (Image 1) before Listening & Speaking
// ─────────────────────────────────────────────────────────────────────────────
rep("PP1 — Vowels card",
  "{ title:'Listening and Speaking', content: `  Greetings and Etiquette: saying",
  "{ title:'Vowels — Short and Long', content: `" +
  "SHORT VOWELS (the vowel says its short sound):\n" +
  "ă = apple        ĕ = egg          ĭ = iguana\n" +
  "ŏ = octopus      ŭ = umbrella\n\n" +
  "LONG VOWELS (the vowel says its name):\n" +
  "ā = acorn        ē = easel        ī = ice cream\n" +
  "ō = oval         ū = unicorn\n\n" +
  "The 5 vowels are:  A  E  I  O  U\n" +
  "Every word needs at least one vowel!" +
  "`},\n" +
  "{ title:'Listening and Speaking', content: `  Greetings and Etiquette: saying"
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. PP1 Key Charts: Append Vowels (Image 1) + Alphabet (Image 2)
// ─────────────────────────────────────────────────────────────────────────────
rep("PP1 — Key Charts: Vowels + Alphabet",
  "7. Classroom Labels  door, table, chair, board labelled in class`},",
  "7. Classroom Labels  door, table, chair, board labelled in class\n" +
  "8. Vowels Chart (Short & Long)  SHORT: ă=apple, ĕ=egg, ĭ=iguana, ŏ=octopus, ŭ=umbrella | LONG: ā=acorn, ē=easel, ī=ice cream, ō=oval, ū=unicorn\n" +
  "9. Alphabet Frieze (A–Z)  Aa=Apple, Bb=Ball, Cc=Cupcake, Dd=Duck, Ee=Elephant, Ff=Flag, Gg=Guitar, Hh=Hat, Ii=Iguana, Jj=Jacket, Kk=Kite, Ll=Leaf, Mm=Monkey, Nn=Nine, Oo=Orange, Pp=Penguin, Qq=Queen, Rr=Rabbit, Ss=Starfish, Tt=Train, Uu=Umbrella, Vv=Vest, Ww=Wagon, Xx=Xylophone, Yy=Yo-yo, Zz=Zebra" +
  "`},"
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. PP2 Language: Insert Vowels card (Image 3 style) before Listening & Speaking
// ─────────────────────────────────────────────────────────────────────────────
rep("PP2 — Vowels card",
  "{ title:'Listening and Speaking', content: `  Auditory Discrimination: distinguishing more complex sounds",
  "{ title:'Vowels — Short and Long Sounds', content: `" +
  "SHORT VOWELS:\n" +
  "Short A: Apple · Ask · Cap\n" +
  "Short E: Egg · Empire · Bet\n" +
  "Short I: Igloo · Imp · Pig\n" +
  "Short O: Octopus · Olive · Tock\n" +
  "Short U: Under · Cup\n\n" +
  "LONG VOWELS:\n" +
  "Long A:  Acorn · Animal · Hay\n" +
  "Long E:  E-mail · Eel · Feed\n" +
  "Long I:  Ice · Iron · Tie\n" +
  "Long O:  Over · Orange · Low\n" +
  "Long U:  Unicorn · Use · Flute\n\n" +
  "RULE: Long vowels say their NAME. Short vowels say a different sound." +
  "`},\n" +
  "{ title:'Listening and Speaking', content: `  Auditory Discrimination: distinguishing more complex sounds"
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. PP2 Reading Skills: Update vowels line
// ─────────────────────────────────────────────────────────────────────────────
rep("PP2 — Reading Skills: vowels",
  "Letter Knowledge: identifying and sounding out the 5 vowels  a, e, i, o, u\n Beginning Consonants: recognizing common consonants  m, s, t, b",
  "Letter Knowledge: Short & Long Vowels — a(ă=apple/ā=acorn), e(ĕ=egg/ē=eel), i(ĭ=igloo/ī=ice), o(ŏ=octopus/ō=orange), u(ŭ=umbrella/ū=unicorn)\n Beginning Consonants: recognizing common consonants  m, s, t, b"
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. PP2 Key Charts: Replace Vowels Chart + Alphabet + add Vowel Sounds (Image 3)
// ─────────────────────────────────────────────────────────────────────────────
rep("PP2 — Key Charts: Vowels + Alphabet + Sounds",
  "1. Vowels Chart (a e i o u)  a=apple, e=egg, i=igloo, o=orange, u=umbrella (BIG letters)\n2. Alphabet Frieze (A-Z)  full alphabet around the classroom wall with pictures\n3. Beginning Sounds Chart  m=mango, s=sun, b=ball, etc.",
  "1. Vowels Chart (Short & Long)  SHORT: ă=apple, ĕ=egg, ĭ=iguana, ŏ=octopus, ŭ=umbrella | LONG: ā=acorn, ē=easel, ī=ice cream, ō=oval, ū=unicorn\n" +
  "2. Alphabet Frieze (A–Z)  Aa=Apple, Bb=Ball, Cc=Cupcake, Dd=Duck, Ee=Elephant, Ff=Flag, Gg=Guitar, Hh=Hat, Ii=Iguana, Jj=Jacket, Kk=Kite, Ll=Leaf, Mm=Monkey, Nn=Nine, Oo=Orange, Pp=Penguin, Qq=Queen, Rr=Rabbit, Ss=Starfish, Tt=Train, Uu=Umbrella, Vv=Vest, Ww=Wagon, Xx=Xylophone, Yy=Yo-yo, Zz=Zebra\n" +
  "3. Vowel Sounds Chart  Short A: Apple/Ask/Cap | Long A: Acorn/Animal/Hay | Short E: Egg/Bet | Long E: Eel/Feed | Short I: Igloo/Pig | Long I: Ice/Tie | Short O: Octopus/Olive | Long O: Over/Orange | Short U: Under/Cup | Long U: Unicorn/Use/Flute\n" +
  "4. Beginning Sounds Chart  m=mango, s=sun, b=ball, etc."
);

// ─────────────────────────────────────────────────────────────────────────────
// 6. Grade 1 Math: Add 120 Number Chart (Image 4) before 100 Chart
// ─────────────────────────────────────────────────────────────────────────────
rep("Grade 1 Math — Add 120 chart",
  "(most versatile chart in the class!)\n2. Place Value Chart  two columns: TENS | ONES (with bundles of sticks)",
  "(most versatile chart in the class!)\n" +
  "2. 120 Number Chart  12×10 grid with numbers 1–120 — practise counting beyond 100!\n" +
  "3. Place Value Chart  two columns: TENS | ONES (with bundles of sticks)"
);

// ─────────────────────────────────────────────────────────────────────────────
// 7. Grade 1 Math: Renumber Money + replace Shapes (Image 5)
// ─────────────────────────────────────────────────────────────────────────────
rep("Grade 1 Math — Renumber + new Shapes chart",
  "3. Kenyan Money Chart  coins (50c, 1, 5, 10, 20 sh) and notes (50, 100, 200 sh)\n4. Addition & Subtraction Strategies Chart  Part-Part-Whole and Count On number line\n5. 2D and 3D Shapes Chart  shapes linked to real objects (ball=sphere, box=cube)",
  "4. Kenyan Money Chart  coins (50c, 1, 5, 10, 20 sh) and notes (50, 100, 200 sh)\n" +
  "5. Addition & Subtraction Strategies Chart  Part-Part-Whole and Count On number line\n" +
  "6. Shapes Chart  2D: Hexagon, Circle, Pentagon, Square, Diamond, Parallelogram, Oval, Octagon, Trapezoid, Rectangle, Heart, Star, Crescent, Triangle | 3D: Sphere (ball), Cylinder (tin can), Cube (box), Cone (party hat)"
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. Grade 1 English: Add First Grade Sight Words card (Image 6)
// ─────────────────────────────────────────────────────────────────────────────
rep("Grade 1 English — Sight Words card",
  "{ title:'Key Charts to Know', content: `1. Phonics Chart  CVC Words: cat/hat/mat",
  "{ title:'First Grade Sight Words', content: `" +
  "Learn to read these 40 words BY SIGHT (no sounding out needed):\n\n" +
  "after    again    an       any\n" +
  "as       ask      by       could\n" +
  "every    fly      from     give\n" +
  "going    had      has      her\n" +
  "him      his      how      just\n" +
  "know     let      live     may\n" +
  "of       old      once     open\n" +
  "over     put      round    some\n" +
  "stop     take     thank    them\n" +
  "think    walk     were     when\n\n" +
  "Tip: Flash cards + word wall + read in sentences every day!" +
  "`},\n" +
  "{ title:'Key Charts to Know', content: `1. Phonics Chart  CVC Words: cat/hat/mat"
);

// ─────────────────────────────────────────────────────────────────────────────
// 9. Grade 1 English: Update sight words list in Reading section
// ─────────────────────────────────────────────────────────────────────────────
rep("Grade 1 English — Reading sight words list",
  "Sight Words: the, is, and, you, can, see, like, a, I, to",
  "Sight Words (40): after, again, an, any, as, ask, by, could, every, fly, from, give, going, had, has, her, him, his, how, just, know, let, live, may, of, old, once, open, over, put, round, some, stop, take, thank, them, think, walk, were, when"
);

// ─────────────────────────────────────────────────────────────────────────────
fs.writeFileSync(p, c, "utf8");
if (errors === 0) {
  console.log("\n✅ All 9 changes applied to curriculumData.js!");
} else {
  console.log("\n⚠️  Done with " + errors + " error(s). Check above.");
}
