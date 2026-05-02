const fs = require('fs');
let content = fs.readFileSync('./storiesData.js', 'utf8');
content = content
  .replace(/\u2018/g, "'")
  .replace(/\u2019/g, "'")
  .replace(/\u201C/g, '"')
  .replace(/\u201D/g, '"')
  .replace(/\u2014/g, '--')
  .replace(/\u2013/g, '-')
  .replace(/\u2026/g, '...');
fs.writeFileSync('./storiesData.js', content, 'utf8');
console.log('Fixed!');