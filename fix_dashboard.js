const fs = require('fs');
const path = require('path');

// ── 1. Add handlers to dashboardController.js ──────────────────────────────
const ctrlPath = path.join('backend','src','controllers','dashboardController.js');
const ctrl = fs.readFileSync(ctrlPath, 'utf8');

const newHandlers = `

// ── Revenue trend (last N days, one row per day) ────────────────────────────
exports.adminRevenueTrend = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 90);
    const { rows } = await query(
      \`SELECT DATE(last_payment_date) AS date,
              COALESCE(SUM(amount),0)  AS total,
              COUNT(*)                 AS count
         FROM subscriptions
        WHERE last_payment_date > NOW() - INTERVAL '1 day' * \$1
        GROUP BY DATE(last_payment_date)
        ORDER BY date ASC\`,
      [days]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

// ── User growth (registrations per day) ────────────────────────────────────
exports.adminUserGrowth = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90);
    const { rows } = await query(
      \`SELECT DATE(created_at) AS date, COUNT(*) AS total
         FROM users
        WHERE created_at > NOW() - INTERVAL '1 day' * \$1
        GROUP BY DATE(created_at)
        ORDER BY date ASC\`,
      [days]
    );
    res.json(rows);
  } catch (e) { next(e); }
};

// ── Subscription health breakdown ───────────────────────────────────────────
exports.adminSubscriptionHealth = async (req, res, next) => {
  try {
    const { rows } = await query(
      \`SELECT status, COUNT(*) AS count
         FROM subscriptions
        GROUP BY status\`
    );
    res.json(rows);
  } catch (e) { next(e); }
};

// ── Role breakdown ──────────────────────────────────────────────────────────
exports.adminRoleBreakdown = async (req, res, next) => {
  try {
    const { rows } = await query(
      \`SELECT role, COUNT(*) AS count
         FROM users
        GROUP BY role\`
    );
    res.json(rows);
  } catch (e) { next(e); }
};
`;

if (!ctrl.includes('adminRevenueTrend')) {
  fs.writeFileSync(ctrlPath, ctrl + newHandlers, 'utf8');
  console.log('✓ Added 4 handlers to dashboardController.js');
} else {
  console.log('ℹ Handlers already exist in dashboardController.js');
}

// ── 2. Add routes to dashboard.js ──────────────────────────────────────────
const routePath = path.join('backend','src','routes','dashboard.js');
let route = fs.readFileSync(routePath, 'utf8');

const newRoutes = `
router.get('/admin/revenue-trend',        authenticate, authorizeRoles('admin'), C.adminRevenueTrend);
router.get('/admin/user-growth',          authenticate, authorizeRoles('admin'), C.adminUserGrowth);
router.get('/admin/subscription-health',  authenticate, authorizeRoles('admin'), C.adminSubscriptionHealth);
router.get('/admin/role-breakdown',       authenticate, authorizeRoles('admin'), C.adminRoleBreakdown);
`;

if (!route.includes('adminRevenueTrend')) {
  route = route.replace('module.exports = router;', newRoutes + '\nmodule.exports = router;');
  fs.writeFileSync(routePath, route, 'utf8');
  console.log('✓ Added 4 routes to dashboard.js');
} else {
  console.log('ℹ Routes already exist in dashboard.js');
}

console.log('\nAll done! Nodemon will restart automatically.');
