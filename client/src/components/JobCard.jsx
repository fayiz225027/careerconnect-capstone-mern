import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Bookmark, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job }) => {
  const { user, toggleSaveJob } = useAuth();
  const isSaved = user?.savedJobs?.some((id) => (typeof id === 'string' ? id : id?._id) === job._id);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login as a student to bookmark opportunities');
    try {
      await toggleSaveJob(job._id);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="card card-hover job-card">
      <div>
        <div className="job-header">
          <div>
            <span className="job-company">{job.company}</span>
            <h3 className="job-title" style={{ marginTop: '4px' }}>
              <Link to={`/jobs/${job._id}`} style={{ color: 'inherit' }}>
                {job.title}
              </Link>
            </h3>
          </div>
          {user?.role === 'student' && (
            <button
              onClick={handleBookmark}
              style={{
                background: isSaved ? 'var(--primary-light)' : 'transparent',
                color: isSaved ? 'var(--primary)' : 'var(--text-muted)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              title={isSaved ? 'Remove from bookmarks' : 'Bookmark opportunity'}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <div className="job-meta-row">
          <span className="job-meta-item">
            <MapPin size={15} color="var(--primary)" />
            {job.location}
          </span>
          <span className="job-meta-item">
            <Briefcase size={15} color="var(--primary)" />
            {job.jobType}
          </span>
          <span className="badge badge-info">{job.category}</span>
        </div>

        <p className="job-description-preview">{job.description}</p>
      </div>

      <div className="job-footer">
        <div className="job-salary">
          <span>{job.salary}</span>
        </div>
        <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
          View Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
