const fs = require('fs');

// ── 1. Hide hamburger on subscription page (Navbar.jsx) ─────────────────────
const navPath = 'frontend/src/components/layout/Navbar.jsx';
let nav = fs.readFileSync(navPath, 'utf8');

// Add useLocation import
if (!nav.includes('useLocation')) {
  nav = nav.replace(
    "import { Link, useNavigate } from 'react-router-dom'",
    "import { Link, useNavigate, useLocation } from 'react-router-dom'"
  );
}

// Add location variable after nav declaration
if (!nav.includes('useLocation()')) {
  nav = nav.replace(
    'const nav = useNavigate()',
    'const nav = useNavigate()\n  const location = useLocation()\n  const isSubscriptionPage = location.pathname === \'/student/subscription\''
  );
}

// Hide hamburger button on subscription page
nav = nav.replace(
  `<button
              onClick={() => setOpen(v => !v)}
              style={iconBtn}`,
  `<button
              onClick={() => setOpen(v => !v)}
              style={{ ...iconBtn, visibility: isSubscriptionPage ? 'hidden' : 'visible' }}`
);

fs.writeFileSync(navPath, nav, 'utf8');
console.log('✓ Hamburger hidden on subscription page');

// ── 2. Remove auto-lock — just block login, don't change status ─────────────
const ctrlPath = 'backend/src/controllers/authController.js';
let ctrl = fs.readFileSync(ctrlPath, 'utf8');

// Replace the auto-lock block: instead of locking, just return error
ctrl = ctrl.replace(
  `if (attempts >= 3) {
          await pool.query(
            "UPDATE users SET status='locked', failed_login_attempts=$1 WHERE id=$2",
            [attempts, user.id]
          );
          await auditLog({ action:'login_blocked', userId:user.id, userName:user.name,
role:user.role, ip, meta:{ attempts } });
          return res.status(403).json({ error: "Account locked after 3 failed attempts. Contact
admin." });
        }`,
  `if (attempts >= 3) {
          await pool.query("UPDATE users SET failed_login_attempts=$1 WHERE id=$2", [attempts, user.id]);
          await auditLog({ action:'login_blocked', userId:user.id, userName:user.name, role:user.role, ip, meta:{ attempts } });
          return res.status(403).json({ error: "Too many failed attempts. Contact admin to unlock your account." });
        }`
);

fs.writeFileSync(ctrlPath, ctrl, 'utf8');
console.log('✓ Auto-lock removed — failed attempts tracked but only admin can lock');

console.log('\nDone! Both servers will reload automatically.');
