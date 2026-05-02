const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const C = require('../controllers/dashboardController');

router.get('/admin/kpis',               authenticate, authorizeRoles('admin'),   C.adminKpis);
router.get('/teacher/kpis/:teacherId',  authenticate, authorizeRoles('teacher','admin'), C.teacherKpis);
router.get('/student/kpis/:studentId',  authenticate, C.studentKpis);
router.get('/parent/kpis/:studentId',   authenticate, authorizeRoles('guardian','admin'), C.parentKpis);


router.get('/admin/revenue-trend',        authenticate, authorizeRoles('admin'), C.adminRevenueTrend);
router.get('/admin/user-growth',          authenticate, authorizeRoles('admin'), C.adminUserGrowth);
router.get('/admin/subscription-health',  authenticate, authorizeRoles('admin'), C.adminSubscriptionHealth);
router.get('/admin/role-breakdown',       authenticate, authorizeRoles('admin'), C.adminRoleBreakdown);

module.exports = router;
