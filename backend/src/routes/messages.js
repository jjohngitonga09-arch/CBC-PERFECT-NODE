const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const { v4: uuid } = require('uuid');
const { authenticate } = require('../middleware/authenticate');
const C = require('../controllers/messagesController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/messages'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuid() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const ok = /image|video|gif/.test(file.mimetype);
    cb(ok ? null : new Error('Only images, GIFs, and videos allowed'), ok);
  }
});

// Order matters — specific routes before :param routes
router.get('/conversations',          authenticate, C.getConversations);
router.get('/users',                  authenticate, C.getUsers);
router.get('/thread/:otherId',        authenticate, C.getThread);
router.post('/',                      authenticate, C.sendMessage);
router.post('/upload', authenticate, upload.single('file'), C.uploadFile);
router.patch('/:id/read',             authenticate, C.markRead);
router.get('/:userId',                authenticate, C.getMessages); // legacy

module.exports = router;
