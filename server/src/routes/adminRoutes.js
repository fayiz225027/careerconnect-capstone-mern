const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
