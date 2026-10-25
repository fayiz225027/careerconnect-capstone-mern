const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a job/internship title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Please enter the company name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please enter a location (or Remote)'],
      trim: true
    },
    jobType: {
      type: String,
      required: [true, 'Please specify the job type'],
      enum: ['Internship', 'Full-time', 'Part-time', 'Contract', 'Remote'],
      default: 'Internship'
    },
    category: {
      type: String,
      required: [true, 'Please select a domain/category'],
      enum: [
        'Software Development',
        'Frontend / React',
        'Backend / Node.js',
        'Full Stack (MERN)',
        'Data Science & AI',
        'Cloud & DevOps',
        'UI/UX Design',
        'Cybersecurity'
      ],
      default: 'Full Stack (MERN)'
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description']
    },
    requirements: {
      type: [String],
      default: []
    },
    responsibilities: {
      type: [String],
      default: []
    },
    salary: {
      type: String,
      default: 'Best in Industry'
    },
    experienceLevel: {
      type: String,
      enum: ['Internship / Fresher', 'Entry Level (0-1 yr)', 'Mid Level (1-3 yrs)', 'Senior (3+ yrs)'],
      default: 'Internship / Fresher'
    },
    deadline: {
      type: Date
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active'
    },
    applicantsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Text index for fast search
jobSchema.index({ title: 'text', company: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
