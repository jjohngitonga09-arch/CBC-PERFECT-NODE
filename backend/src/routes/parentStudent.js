const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const C = require('../controllers/parentStudentController');

router.post('/link',                    authenticate, authorizeRoles('student'),            C.linkParent);
router.post('/accept/:notifId',         authenticate, authorizeRoles('guardian'),           C.acceptLink);
router.post('/decline/:notifId',        authenticate, authorizeRoles('guardian'),           C.declineLink);
router.delete('/link',                  authenticate, authorizeRoles('student'),            C.unlinkParent);
router.get('/my-parent',               authenticate, authorizeRoles('student'),            C.getMyParent);
router.get('/my-children',             authenticate, authorizeRoles('guardian'),           C.getMyChildren);
router.get('/child-kpis/:childId',     authenticate, authorizeRoles('guardian'),           C.getChildKpis);

module.exports = router;
