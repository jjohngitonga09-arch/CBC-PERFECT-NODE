const router = require('express').Router();
const { authenticate } = require('../middleware/authenticate');
const C = require('../controllers/pronunciationController');

router.get('/:cardId',    authenticate, C.getPronunciation);
router.post('/practice',  authenticate, C.scorePractice);

module.exports = router;
