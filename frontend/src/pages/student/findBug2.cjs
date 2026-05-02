const fs = require('fs');
const content = fs.readFileSync('./storiesData.js', 'utf8');
try {
  new Function(content);
} catch(e) {
  console.log('Error:', e.message);
  // Find the position
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if(line.includes('/.') || line.includes('/g') || line.includes('/i') || line.includes('/m')) {
      console.log('Line ' + (i+1) + ': ' + line.substring(0,100));
    }
  });
}