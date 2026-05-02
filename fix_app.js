const fs = require('fs');

const FILE = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\App.jsx';
let c = fs.readFileSync(FILE, 'utf8');

// 1. Add StudentMessages import after StudyTime import
c = c.replace(
  "import StudyTime          from './pages/student/StudyTime'",
  "import StudyTime          from './pages/student/StudyTime'\nimport StudentMessages    from './pages/student/Messages'"
);

// 2. Add student messages route after study-time route
c = c.replace(
  `<Route path="/student/study-time"       element={<StudyTime />} />`,
  `<Route path="/student/study-time"       element={<StudyTime />} />\n            <Route path="/student/messages"         element={<StudentMessages />} />`
);

// 3. Fix parent messages route (remove child/:studentId prefix so it works standalone too)
c = c.replace(
  `<Route path="/parent/child/:studentId/messages" element={<ParentMessages />} />`,
  `<Route path="/parent/child/:studentId/messages" element={<ParentMessages />} />\n            <Route path="/parent/messages"                    element={<ParentMessages />} />`
);

fs.writeFileSync(FILE, c, 'utf8');
console.log('✅ App.jsx updated — student messages route added');