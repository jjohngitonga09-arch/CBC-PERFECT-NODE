const fs = require('fs');
const path = require('path');
const dir = __dirname;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix mojibake - latin1 misread as utf8
  const fixed = Buffer.from(content, 'latin1').toString('utf8');
  
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log('Fixed: ' + file);
  } else {
    console.log('Skipped (no change): ' + file);
  }
});

console.log('All done!');