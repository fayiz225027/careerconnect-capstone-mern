import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { applicationService } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setApplications(res.data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id, title) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${title}"?`)) {
      return;
    }

    try {
      await applicationService.withdraw(id);
      setActionMsg('Application withdrawn successfully');
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loader message="Loading your submitted applications..." />;
  }

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Job & Internship Applications</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Monitor your review stage, interviews, and recruiter decisions in real time.
            </p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            Explore More Roles <ArrowRight size={16} />
          </Link>
        </div>

        {actionMsg && <Alert type="success" message={actionMsg} onClose={() => setActionMsg('')} />}
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>No applications submitted yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
              You haven't applied to any internships or developer openings.
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Discover Available Opportunities
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {applications.map((app) => (
              <div key={app._id} className="card">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <span className="badge badge-info" style={{ marginBottom: '6px' }}>
                      {app.job?.category || 'General'}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                      <Link to={`/jobs/${app.job?._id}`} style={{ color: 'inherit' }}>
                        {app.job?.title || 'Position Unavailable'}
                      </Link>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {app.job?.company}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StatusBadge status={app.status} />
                    {app.status === 'Pending' && (
                      <button
                        onClick={() => handleWithdraw(app._id, app.job?.title)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Withdraw this application"
                      >
                        <Trash2 size={14} /> Withdraw
                      </button>
                    )}
                  </div>
                </div>

                <div className="job-meta-row" style={{ marginBottom: '16px' }}>
                  <span className="job-meta-item">
                    <MapPin size={15} color="var(--primary)" /> {app.job?.location}
                  </span>
                  <span className="job-meta-item">
                    <Briefcase size={15} color="var(--primary)" /> {app.job?.jobType}
                  </span>
                  <span className="job-meta-item">
                    <IndianRupee size={15} color="var(--primary)" /> {app.job?.salary}
                  </span>
                  <span className="job-meta-item">
                    <Clock size={15} color="var(--primary)" /> Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Recruiter Feedback Note */}
                {app.recruiterFeedback && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '3px' }}>
                      Official Recruiter Feedback:
                    </p>
                    <p style={{ fontSize: '0.92rem', color: '#14532d' }}>{app.recruiterFeedback}</p>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ExternalLink size={14} /> Submitted Resume Link
                  </a>
                  <Link to={`/jobs/${app.job?._id}`} className="btn btn-secondary btn-sm">
                    View Job Posting
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
