const fs = require('fs');
const path = require('path');
const dir = __dirname;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const raw = fs.readFileSync(filePath, 'binary');
  const fixed = Buffer.from(raw, 'binary').toString('utf8');
  fs.writeFileSync(filePath, fixed, 'utf8');
  console.log('Fixed: ' + file);
});

console.log('All done!');