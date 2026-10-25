import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Send, Bookmark, User, PlusCircle, CheckCircle, Clock, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationService, jobService } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';
import JobCard from '../components/JobCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.role === 'student') {
          const res = await applicationService.getMyApplications();
          setApplications(res.data.applications || []);
        } else if (user.role === 'recruiter' || user.role === 'admin') {
          const res = await jobService.getMyPostedJobs();
          setPostedJobs(res.data.jobs || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <Loader message="Compiling your dashboard overview..." />;
  }

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container">
        {/* Header Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome back, {user.name}!</h1>
              <span className={`badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'recruiter' ? 'badge-info' : 'badge-primary'}`}>
                {user.role}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              {user.role === 'student'
                ? 'Track your active applications, saved jobs, and profile updates.'
                : user.role === 'recruiter'
                ? 'Manage active listings, review candidate submissions, and update hiring statuses.'
                : 'Platform administrative command dashboard.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {user.role === 'student' && (
              <Link to="/jobs" className="btn btn-primary">
                <Briefcase size={16} /> Browse Opportunities
              </Link>
            )}
            {(user.role === 'recruiter' || user.role === 'admin') && (
              <Link to="/post-job" className="btn btn-primary">
                <PlusCircle size={16} /> Post New Opportunity
              </Link>
            )}
            <Link to="/profile" className="btn btn-secondary">
              <User size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        {error && <Alert type="danger" message={error} />}

        {/* STUDENT VIEW */}
        {user.role === 'student' && (
          <div>
            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{applications.length}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Submitted Applications</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                      {applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Accepted').length}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Shortlisted / Offers</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--info-bg)', color: 'var(--info)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bookmark size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user.savedJobs ? user.savedJobs.length : 0}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Bookmarked Listings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications Table */}
            <div className="card" style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Application Submissions</h3>
                <Link to="/my-applications" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                  View All ({applications.length})
                </Link>
              </div>

              {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <p>You have not applied to any opportunities yet.</p>
                  <Link to="/jobs" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
                    Browse Available Jobs
                  </Link>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title & Company</th>
                        <th>Type</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app._id}>
                          <td>
                            <strong>{app.job?.title || 'Unknown Position'}</strong>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{app.job?.company}</div>
                          </td>
                          <td>{app.job?.jobType}</td>
                          <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                          <td>
                            <Link to={`/jobs/${app.job?._id}`} className="btn btn-secondary btn-sm">
                              View Posting
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECRUITER / ADMIN VIEW */}
        {(user.role === 'recruiter' || user.role === 'admin') && (
          <div>
            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{postedJobs.length}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Posted Opportunities</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                      {postedJobs.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0)}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Total Candidate Submissions</p>
                  </div>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin Console</h3>
                      <Link to="/admin" style={{ color: 'var(--primary)', fontSize: '0.88rem', fontWeight: 600 }}>
                        Manage System Users &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Posted Jobs Table */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Job Postings</h3>
                <Link to="/post-job" className="btn btn-primary btn-sm">
                  <PlusCircle size={15} /> Create Posting
                </Link>
              </div>

              {postedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <p>You have not published any job or internship openings yet.</p>
                  <Link to="/post-job" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                    Post First Opportunity
                  </Link>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Applicants</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postedJobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <strong>{job.title}</strong>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{job.location}</div>
                          </td>
                          <td>{job.category}</td>
                          <td>{job.jobType}</td>
                          <td>
                            <Link to={`/jobs/${job._id}/applicants`} className="badge badge-primary">
                              {job.applicantsCount || 0} candidate(s)
                            </Link>
                          </td>
                          <td>
                            <StatusBadge status={job.status} />
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link to={`/jobs/${job._id}/applicants`} className="btn btn-outline btn-sm">
                                Review Applicants
                              </Link>
                              <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm">
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
