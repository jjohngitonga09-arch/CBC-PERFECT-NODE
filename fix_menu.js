const fs = require('fs');
const f = 'frontend/src/components/layout/HamburgerMenu.jsx';
const lines = fs.readFileSync(f, 'utf8').split('\n');
lines[57] = "    {i:'',l:'Locked Accounts', t:'/admin/locked'},";
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Fixed:', JSON.stringify(lines[57]));
