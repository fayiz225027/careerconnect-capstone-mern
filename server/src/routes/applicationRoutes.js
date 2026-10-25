const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:jobId', protect, authorize('student', 'admin'), applyForJob);
router.get('/my', protect, authorize('student', 'admin'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getApplicantsForJob);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('student', 'admin'), withdrawApplication);

module.exports = router;
