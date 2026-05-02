const router  = require('express').Router();
const path    = require('path');
const { authenticate }   = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const upload  = require('../middleware/upload');
const C       = require('../controllers/assignmentsController');

// single optional file field named "file"
const maybeFile = upload.single('file');

router.post('/',
  authenticate,
  authorizeRoles('teacher','admin'),
  maybeFile,
  C.createAssignment
);

router.get('/student/:studentId',             authenticate, C.getStudentAssignments);
router.get('/teacher/:teacherId',             authenticate, authorizeRoles('teacher','admin'), C.getTeacherAssignments);
router.get('/teacher/:teacherId/submissions', authenticate, authorizeRoles('teacher','admin'), C.getTeacherSubmissions);
router.get('/:id',                            authenticate, C.getAssignment);
router.put('/:id',                            authenticate, authorizeRoles('teacher','admin'), C.updateAssignment);
router.delete('/:id',                         authenticate, authorizeRoles('teacher','admin'), C.deleteAssignment);
router.patch('/submissions/:id/grade',        authenticate, authorizeRoles('teacher','admin'), C.gradeSubmission);

module.exports = router;
