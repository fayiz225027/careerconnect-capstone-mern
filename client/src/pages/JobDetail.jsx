import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, Building2, CheckCircle2, ArrowLeft, Send, Bookmark, FileText } from 'lucide-react';
import { jobService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, toggleSaveJob } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Apply Modal state
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [experienceYears, setExperienceYears] = useState('Fresher');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(id);
        setJob(res.data.job);
        if (user?.resumeUrl) {
          setResumeUrl(user.resumeUrl);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const isSaved = user?.savedJobs?.some((savedId) => (typeof savedId === 'string' ? savedId : savedId?._id) === id);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyError('');

    if (!resumeUrl.trim()) {
      setApplyError('Please provide a link to your resume or portfolio');
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.applyForJob(id, {
        resumeUrl: resumeUrl.trim(),
        coverLetter: coverLetter.trim(),
        experienceYears
      });
      setShowModal(false);
      setSuccessMsg('Your application has been submitted successfully! You can track its progress in My Applications.');
      // Refresh job to update applicant count
      const updated = await jobService.getJobById(id);
      setJob(updated.data.job);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    try {
      await toggleSaveJob(job._id);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) {
    return <Loader message="Loading opportunity details..." />;
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <Alert type="danger" message={error || 'Job not found'} />
        <Link to="/jobs" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to all listings
          </Link>
        </div>

        {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '30px' }}>
          {/* Main Content */}
          <div>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-info" style={{ marginBottom: '8px' }}>
                    {job.category}
                  </span>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{job.title}</h1>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{job.company}</p>
                </div>

                {user?.role === 'student' && (
                  <button
                    onClick={handleBookmark}
                    className="btn btn-secondary btn-sm"
                    style={{ background: isSaved ? 'var(--primary-light)' : '#ffffff' }}
                  >
                    <Bookmark size={16} fill={isSaved ? 'var(--primary)' : 'none'} color="var(--primary)" />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>

              <div className="job-meta-row" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                <span className="job-meta-item">
                  <MapPin size={16} color="var(--primary)" /> {job.location}
                </span>
                <span className="job-meta-item">
                  <Briefcase size={16} color="var(--primary)" /> {job.jobType}
                </span>
                <span className="job-meta-item">
                  <IndianRupee size={16} color="var(--primary)" /> {job.salary}
                </span>
                <span className="job-meta-item">
                  <Clock size={16} color="var(--primary)" /> {job.experienceLevel}
                </span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Overview</h3>
                <p style={{ color: '#334155', whiteSpace: 'pre-line', fontSize: '0.98rem' }}>{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Key Responsibilities</h3>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155' }}>
                    {job.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Required Skills & Qualifications</h3>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155' }}>
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Action Card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Application Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', marginBottom: '24px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <div style={{ marginTop: '4px' }}>
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Offered Compensation:</span>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--secondary)' }}>{job.salary}</p>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Applications Received:</span>
                  <p style={{ fontWeight: 600 }}>{job.applicantsCount || 0} candidate(s)</p>
                </div>

                {job.deadline && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Application Deadline:</span>
                    <p style={{ fontWeight: 600 }}>{new Date(job.deadline).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {user?.role === 'student' ? (
                <button
                  onClick={() => setShowModal(true)}
                  disabled={job.status === 'Closed'}
                  className="btn btn-primary btn-full"
                >
                  <Send size={16} /> Apply Now
                </button>
              ) : !isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to="/login" className="btn btn-primary btn-full">
                    Log In to Apply
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Candidates must have an active student account to apply.
                  </p>
                </div>
              ) : (user?.role === 'recruiter' || user?.role === 'admin') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to={`/manage-jobs`} className="btn btn-secondary btn-full">
                    Manage Opportunities
                  </Link>
                  <Link to={`/jobs/${job._id}/applicants`} className="btn btn-outline btn-full">
                    View Applicants ({job.applicantsCount || 0})
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Apply for {job.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Submit your candidacy directly to <strong>{job.company}</strong>.
            </p>

            {applyError && <Alert type="danger" message={applyError} onClose={() => setApplyError('')} />}

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label className="form-label">Resume / Portfolio Link (Google Drive, GitHub, PDF) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/... or portfolio URL"
                  className="form-input"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  className="form-select"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                >
                  <option value="Fresher">Fresher (Completed MERN Training)</option>
                  <option value="Under 1 year">Under 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2+ years">2+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter / Note to Recruiter</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Explain why you are a good fit for this role and mention your relevant projects..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
