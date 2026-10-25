import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, Award, CheckCircle, Clock } from 'lucide-react';
import { applicationService } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [data, setData] = useState({ applications: [], jobTitle: '', company: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [feedbackInputs, setFeedbackInputs] = useState({});

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await applicationService.getApplicantsForJob(jobId);
      setData(res.data);
      // Initialize feedback input map
      const initialFeedback = {};
      res.data.applications.forEach((app) => {
        initialFeedback[app._id] = app.recruiterFeedback || '';
      });
      setFeedbackInputs(initialFeedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const feedback = feedbackInputs[appId] || '';
      await applicationService.updateStatus(appId, {
        status: newStatus,
        recruiterFeedback: feedback
      });
      setActionMsg(`Applicant marked as ${newStatus}`);
      setData((prev) => ({
        ...prev,
        applications: prev.applications.map((app) =>
          app._id === appId ? { ...app, status: newStatus, recruiterFeedback: feedback } : app
        )
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFeedbackChange = (appId, val) => {
    setFeedbackInputs((prev) => ({ ...prev, [appId]: val }));
  };

  if (loading) {
    return <Loader message="Loading candidate profiles..." />;
  }

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container">
        {/* Navigation */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/manage-jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Manage Postings
          </Link>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            APPLICANT EVALUATION
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Applicants for {data.jobTitle}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {data.company} &bull; Total Candidates: <strong>{data.applications.length}</strong>
          </p>
        </div>

        {actionMsg && <Alert type="success" message={actionMsg} onClose={() => setActionMsg('')} />}
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        {data.applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>No applications submitted yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Check back soon as candidates apply for this position.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {data.applications.map((app) => (
              <div key={app._id} className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{app.applicant?.name || 'Applicant'}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={14} color="var(--primary)" /> {app.applicant?.email}
                      </span>
                      {app.applicant?.phone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Phone size={14} color="var(--primary)" /> {app.applicant?.phone}
                        </span>
                      )}
                      {app.applicant?.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={14} color="var(--primary)" /> {app.applicant?.location}
                        </span>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={14} color="var(--primary)" /> Exp: {app.experienceYears}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <StatusBadge status={app.status} />
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <ExternalLink size={14} /> View Resume / Portfolio
                    </a>
                  </div>
                </div>

                {/* Candidate Skills */}
                {app.applicant?.skills && app.applicant.skills.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Demonstrated Skills:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {app.applicant.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '18px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Candidate Cover Note:
                    </p>
                    <p style={{ fontSize: '0.92rem', color: '#334155', fontStyle: 'italic' }}>
                      "{app.coverLetter}"
                    </p>
                  </div>
                )}

                {/* Recruiter Evaluation Controls */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add recruiter feedback or interview notes..."
                      value={feedbackInputs[app._id] || ''}
                      onChange={(e) => handleFeedbackChange(app._id, e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      onClick={() => handleStatusChange(app._id, 'Reviewed')}
                      className={`btn btn-sm ${app.status === 'Reviewed' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                      className={`btn btn-sm ${app.status === 'Shortlisted' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'Accepted')}
                      className={`btn btn-sm ${app.status === 'Accepted' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ background: app.status === 'Accepted' ? 'var(--success)' : '' }}
                    >
                      Accept / Offer
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'Rejected')}
                      className={`btn btn-sm ${app.status === 'Rejected' ? 'btn-danger' : 'btn-secondary'}`}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
