const fs = require('fs');

// Fix 1: auth.js - reset attempts on unlock
const authPath = 'backend/src/routes/auth.js';
let auth = fs.readFileSync(authPath, 'utf8');
const before1 = `await query("UPDATE users SET status='active' WHERE id=$1", [id]);`;
const after1  = `await query("UPDATE users SET status='active', failed_login_attempts=0 WHERE id=$1", [id]);`;
if (auth.includes(before1)) {
  auth = auth.replace(before1, after1);
  fs.writeFileSync(authPath, auth, 'utf8');
  console.log('✓ Fixed auth.js unlock');
} else {
  console.log('⚠ Pattern not found in auth.js — checking current unlock line:');
  auth.split('\n').forEach((l,i) => { if (l.includes('active') && l.includes('unlock') || (l.includes('active') && l.includes('id=$1'))) console.log(i+1, l.trim()); });
}

// Fix 2: admin.js - reset attempts on unlock  
const adminPath = 'backend/src/routes/admin.js';
let admin = fs.readFileSync(adminPath, 'utf8');
// admin.js has TWO unlock routes - fix both
let count = 0;
admin = admin.replace(
  /UPDATE users SET status='active' WHERE id=\$1/g,
  (match, offset) => {
    // Only fix lines inside unlock handlers, not unsuspend
    const chunk = admin.substring(Math.max(0, offset - 200), offset);
    if (chunk.includes('unlock') || chunk.includes('Unlock')) {
      count++;
      return "UPDATE users SET status='active', failed_login_attempts=0 WHERE id=$1";
    }
    return match;
  }
);
fs.writeFileSync(adminPath, admin, 'utf8');
console.log(`✓ Fixed admin.js unlock (${count} route(s) updated)`);

console.log('\nDone! Nodemon will restart automatically.');
