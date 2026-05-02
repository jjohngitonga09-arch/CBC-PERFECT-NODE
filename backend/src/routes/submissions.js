const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const C = require('../controllers/submissionsController');

router.post('/',              authenticate, authorizeRoles('student'), C.createSubmission);
router.get('/assignment/:id', authenticate, C.getByAssignment);
router.post('/:id/feedback',  authenticate, authorizeRoles('teacher','admin'), C.addFeedback);
router.patch('/:id',          authenticate, authorizeRoles('teacher','admin'), C.addFeedback);

module.exports = router;
