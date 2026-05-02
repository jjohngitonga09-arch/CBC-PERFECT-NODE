const fs = require('fs');
const content = fs.readFileSync('./storiesData.js', 'utf8');
for (let i = 0; i < content.length; i++) {
  const code = content.charCodeAt(i);
  if (code > 127 || (code < 32 && code !== 10 && code !== 13 && code !== 9)) {
    const line = content.substring(0, i).split('\n').length;
    console.log('Bad char at line ' + line + ' code=' + code + ' char=[' + content[i] + ']');
  }
}
console.log('Scan complete');