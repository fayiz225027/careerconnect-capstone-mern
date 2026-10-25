const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs with search, filtering, and pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { search, category, jobType, location, experienceLevel, page = 1, limit = 9, sort } = req.query;

    const query = { status: 'Active' };

    // Search keyword in title, company, description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('postedBy', 'name company email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job or Internship listing not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job listing
// @route   POST /api/jobs
// @access  Private (Recruiter / Admin)
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      category,
      description,
      requirements,
      responsibilities,
      salary,
      experienceLevel,
      deadline
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, company, location, and description'
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      jobType: jobType || 'Internship',
      category: category || 'Full Stack (MERN)',
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === 'string'
        ? requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : typeof responsibilities === 'string'
        ? responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
      salary: salary || 'Best in Industry',
      experienceLevel: experienceLevel || 'Internship / Fresher',
      deadline: deadline ? new Date(deadline) : null,
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Job listing posted successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private (Creator / Admin)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Check ownership or admin role
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this job listing'
      });
    }

    const payload = { ...req.body };
    if (typeof payload.requirements === 'string') {
      payload.requirements = payload.requirements.split('\n').map((r) => r.trim()).filter(Boolean);
    }
    if (typeof payload.responsibilities === 'string') {
      payload.responsibilities = payload.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Creator / Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job listing'
      });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job and all associated applications have been deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by logged-in recruiter
// @route   GET /api/jobs/my/listings
// @access  Private (Recruiter / Admin)
exports.getMyPostedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform metrics and statistics
// @route   GET /api/jobs/meta/stats
// @access  Public
exports.getJobStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();
    const categories = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const jobTypes = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$jobType', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalApplications,
        categories,
        jobTypes
      }
    });
  } catch (error) {
    next(error);
  }
};
