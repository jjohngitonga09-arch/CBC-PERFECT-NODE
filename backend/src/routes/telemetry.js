const router = require('express').Router();
const { authenticate } = require('../middleware/authenticate');
const C = require('../controllers/telemetryController');

router.post('/cardEvent', authenticate, C.cardEvent);
router.get('/summary/:userId', authenticate, C.userSummary);

module.exports = router;
