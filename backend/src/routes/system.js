const router = require('express').Router();
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const C = require('../controllers/systemController');

router.post('/shutdown',     authenticate, authorizeRoles('admin'), C.triggerShutdown);
router.delete('/logs', authenticate, authorizeRoles('admin'), C.deleteLogs);
router.get('/logs',          authenticate, authorizeRoles('admin'), C.getLogs);
router.get('/settings',      authenticate, authorizeRoles('admin'), C.getSettings);
router.patch('/settings',    authenticate, authorizeRoles('admin'), C.updateSettings);

module.exports = router;
