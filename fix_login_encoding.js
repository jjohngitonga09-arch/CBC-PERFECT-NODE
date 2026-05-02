const fs = require('fs');
const file = "C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\pages\\Login.jsx";
let c = fs.readFileSync(file, 'utf8');

// Use regex with unicode escapes to avoid quote issues
c = c.replace(/\uFFFD[\s\S]?š/g, '📚');
c = c.replace(/[^\x00-\x7F]{3,4}/g, (m) => {
  try {
    return Buffer.from(m, 'latin1').toString('utf8');
  } catch(e) {
    return m;
  }
});

fs.writeFileSync(file, c, 'utf8');
console.log('Done');