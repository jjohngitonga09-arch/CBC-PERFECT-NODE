const fs = require('fs');
const path = require('path');
const dir = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\pages\\student';

// Fix Home.jsx
let home = fs.readFileSync(path.join(dir, 'Home.jsx'), 'utf8');
home = home.replace(/>< Today's Goals</, '>🎯 Today\'s Goals<');
fs.writeFileSync(path.join(dir, 'Home.jsx'), home, 'utf8');
console.log('Fixed Home.jsx');

// Fix Leaderboard.jsx
let lb = fs.readFileSync(path.join(dir, 'Leaderboard.jsx'), 'utf8');
lb = lb.replace(/<span style={{ fontSize: "1\.5rem" }}><<\/span>/, '<span style={{ fontSize: "1.5rem" }}>🏆</span>');
fs.writeFileSync(path.join(dir, 'Leaderboard.jsx'), lb, 'utf8');
console.log('Fixed Leaderboard.jsx');

// Fix WorldExplorer.jsx
let we = fs.readFileSync(path.join(dir, 'WorldExplorer.jsx'), 'utf8');
we = we.replace(/<div style={{fontSize:'4rem',marginBottom:'16px'}}><[\s\S]*?<\/div>/, '<div style={{fontSize:\'4rem\',marginBottom:\'16px\'}}>🌍</div>');
fs.writeFileSync(path.join(dir, 'WorldExplorer.jsx'), we, 'utf8');
console.log('Fixed WorldExplorer.jsx');

console.log('Done!');