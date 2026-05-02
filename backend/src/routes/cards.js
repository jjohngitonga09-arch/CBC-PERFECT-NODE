const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { validateCard }   = require('../middleware/validateCard');
const C = require('../controllers/cardsController');

router.post('/',     authenticate, authorizeRoles('teacher','admin'), validateCard, C.createCard);
router.get('/',      authenticate, C.listCards);
router.get('/:id',   authenticate, C.getCard);
router.put('/:id',   authenticate, authorizeRoles('teacher','admin'), validateCard, C.updateCard);
router.delete('/:id',authenticate, authorizeRoles('admin'), C.deleteCard);

module.exports = router;
