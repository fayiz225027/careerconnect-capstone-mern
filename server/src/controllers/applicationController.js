const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job/internship
// @route   POST /api/applications/:jobId
// @access  Private (Student)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl, experienceYears } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job or Internship not found'
      });
    }

    if (job.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This job listing is currently closed to new applications'
      });
    }

    if (!resumeUrl || resumeUrl.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resume URL or portfolio link'
      });
    }

    // Check duplicate application
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this opportunity'
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl.trim(),
      experienceYears: experienceYears || 'Fresher'
    });

    // Increment applicants counter
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! The recruiter will review your profile.',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in student
// @route   GET /api/applications/my
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location jobType category salary status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job (Recruiter / Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter / Admin)
exports.getApplicantsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Only creator of job or admin can view applicants
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view applicants for this job'
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email phone location skills portfolio resumeUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      company: job.company,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Recruiter / Admin)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterFeedback } = req.body;
    const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Choose from: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Authorization check
    if (
      application.job.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to evaluate this application'
      });
    }

    application.status = status;
    if (recruiterFeedback !== undefined) {
      application.recruiterFeedback = recruiterFeedback;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application marked as ${status}`,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application (Student)
// @route   DELETE /api/applications/:id
// @access  Private (Student)
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot withdraw an application submitted by another user'
      });
    }

    const jobId = application.job;
    await application.deleteOne();

    // Decrement counter
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    next(error);
  }
};
