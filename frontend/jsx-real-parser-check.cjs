// jsx-real-parser-check.js
// Uses the actual Babel parser (the same kind of engine your build tool
// uses) instead of regex, so it understands the difference between a
// real JSX tag and a '<' or '>' sitting inside a plain string of text.
//
// Usage:
//   node jsx-real-parser-check.js path/to/file.jsx
//
// Requires @babel/parser. If it's not already installed, run:
//   npm install --save-dev @babel/parser

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node jsx-real-parser-check.js <file.jsx>');
  process.exit(1);
}

let parse;
try {
  ({ parse } = require('@babel/parser'));
} catch (e) {
  console.error('Could not find @babel/parser.');
  console.error('Run this first, then try again:');
  console.error('  npm install --save-dev @babel/parser');
  process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf8');

try {
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
    errorRecovery: false,
  });
  console.log(`No syntax errors found in ${path.basename(filePath)}.`);
} catch (err) {
  console.log('Syntax error found:\n');
  console.log(err.message);
  if (err.loc) {
    console.log(`\n(Reported at line ${err.loc.line}, column ${err.loc.column})`);
  }
}
