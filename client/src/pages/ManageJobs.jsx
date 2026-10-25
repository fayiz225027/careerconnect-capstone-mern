import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Users, Eye, CheckCircle, XCircle } from 'lucide-react';
import { jobService } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await jobService.getMyPostedJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All submitted applications for this job will also be permanently removed.`)) {
      return;
    }

    try {
      await jobService.deleteJob(id);
      setActionMsg(`"${title}" was deleted successfully.`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      await jobService.updateJob(job._id, { status: newStatus });
      setActionMsg(`Job status updated to ${newStatus}.`);
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loader message="Loading your listings..." />;
  }

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Manage Job Postings</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Review, edit, activate, or archive your company's career opportunities.
            </p>
          </div>
          <Link to="/post-job" className="btn btn-primary">
            <PlusCircle size={16} /> Post New Opportunity
          </Link>
        </div>

        {actionMsg && <Alert type="success" message={actionMsg} onClose={() => setActionMsg('')} />}
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        {jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>No postings yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
              You have not posted any opportunities under this recruiter profile.
            </p>
            <Link to="/post-job" className="btn btn-primary btn-sm">
              Publish Your First Job
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title & Location</th>
                  <th>Domain</th>
                  <th>Type</th>
                  <th>Candidates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <strong>{job.title}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{job.location}</div>
                    </td>
                    <td>{job.category}</td>
                    <td>{job.jobType}</td>
                    <td>
                      <Link
                        to={`/jobs/${job._id}/applicants`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Users size={14} color="var(--primary)" />
                        <strong>{job.applicantsCount || 0}</strong> applicants
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm" title="Preview public view">
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className="btn btn-secondary btn-sm"
                          title={job.status === 'Active' ? 'Close job' : 'Reactivate job'}
                        >
                          {job.status === 'Active' ? 'Close' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(job._id, job.title)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Delete job permanently"
                        >
                          <Trash2 size={14} />
                        </button>
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
  );
};

export default ManageJobs;
