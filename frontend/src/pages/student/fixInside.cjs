const fs = require('fs');
const path = require('path');
const dir = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\pages\\student';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const buf = fs.readFileSync(filePath);
  
  // Remove ALL occurrences of EF BF BD (UTF-8 replacement character)
  const result = [];
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0xEF && buf[i+1] === 0xBF && buf[i+2] === 0xBD) {
      i += 2; // skip all 3 bytes
    } else {
      result.push(buf[i]);
    }
  }
  const newBuf = Buffer.from(result);
  if (newBuf.length !== buf.length) {
    fs.writeFileSync(filePath, newBuf);
    console.log('Fixed: ' + file + ' (removed ' + ((buf.length - newBuf.length)/3) + ' bad chars)');
  } else {
    console.log('OK: ' + file);
  }
});
console.log('Done!');