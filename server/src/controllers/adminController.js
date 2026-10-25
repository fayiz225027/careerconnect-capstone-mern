const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get complete administrative analytics
// @route   GET /api/admin/overview
// @access  Private (Admin)
exports.getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const recruitersCount = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();

    const applicationStatusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentJobs = await Job.find()
      .populate('postedBy', 'name email company')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        studentsCount,
        recruitersCount,
        totalJobs,
        activeJobs,
        totalApplications,
        applicationStatusCounts
      },
      recentJobs,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account from admin dashboard'
      });
    }

    // Clean up their jobs and applications
    await Job.deleteMany({ postedBy: user._id });
    await Application.deleteMany({ applicant: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User ${user.name} and related records removed from system`
    });
  } catch (error) {
    next(error);
  }
};
