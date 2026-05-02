const fs = require('fs');
const path = require('path');
const dir = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\pages\\student';

const broken = ['BibleStories.jsx','Home.jsx','Leaderboard.jsx','StudyTime.jsx','WorldExplorer.jsx'];

broken.forEach(file => {
  const filePath = path.join(dir, file);
  const buf = fs.readFileSync(filePath);
  // Remove leading EF BF BD (UTF-8 replacement character)
  let start = 0;
  while (buf[start] === 239 && buf[start+1] === 191 && buf[start+2] === 189) {
    start += 3;
  }
  fs.writeFileSync(filePath, buf.slice(start));
  console.log('Fixed: ' + file);
});
console.log('Done!');