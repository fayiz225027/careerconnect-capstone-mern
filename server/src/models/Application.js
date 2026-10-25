const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      required: [true, 'Please provide a resume URL or portfolio link']
    },
    experienceYears: {
      type: String,
      default: 'Fresher'
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    recruiterFeedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Prevent same student from applying twice to the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
