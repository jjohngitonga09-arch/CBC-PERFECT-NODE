const fs = require('fs');
const path = require('path');
const dir = 'C:\\Users\\pc\\Downloads\\eduapp\\frontend\\src\\pages\\student';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const buf = fs.readFileSync(filePath);
  const first3 = [buf[0], buf[1], buf[2]];
  console.log(file + ' -> first bytes: ' + first3.join(', '));
});