const fs = require('fs');
const path = require('path');

// ── 1. Add /admin/alerts route to admin.js ──────────────────────────────────
const adminPath = path.join('backend','src','routes','admin.js');
let admin = fs.readFileSync(adminPath, 'utf8');

const alertsRoute = `
router.get('/alerts', ...auth, async (req, res) => {
  try {
    const { rows } = await query(
      \`SELECT action, COUNT(*) AS count, MAX(timestamp) AS last_seen
         FROM system_logs
        WHERE action IN ('failed_login','account_locked','suspicious_activity','login_blocked')
          AND timestamp > NOW() - INTERVAL '24 hours'
        GROUP BY action
        ORDER BY count DESC\`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
`;

if (!admin.includes("router.get('/alerts'")) {
  admin = admin.replace('module.exports = router;', alertsRoute + '\nmodule.exports = router;');
  fs.writeFileSync(adminPath, admin, 'utf8');
  console.log('✓ Added /admin/alerts route');
} else {
  console.log('ℹ /admin/alerts already exists');
}

// ── 2. Fix unlock endpoint in LockedAccounts.jsx ────────────────────────────
const lockPath = path.join('frontend','src','pages','admin','LockedAccounts.jsx');
let lock = fs.readFileSync(lockPath, 'utf8');

// Fix single unlock
lock = lock.replace(
  "await api.put(`/auth/admin/unlock/${user.id}`)",
  "await api.put(`/admin/users/${user.id}/unlock`)"
);
// Fix unlock all
lock = lock.replace(
  "targets.map(u => api.put(`/auth/admin/unlock/${u.id}`))",
  "targets.map(u => api.put(`/admin/users/${u.id}/unlock`))"
);

fs.writeFileSync(lockPath, lock, 'utf8');
console.log('✓ Fixed unlock endpoint in LockedAccounts.jsx');

console.log('\nAll done! Both servers will reload automatically.');
