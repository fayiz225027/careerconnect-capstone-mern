import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, MapPin, Briefcase } from 'lucide-react';
import { jobService } from '../services/api';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const JobsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, total: 0 });

  // Filters state initialized from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const categories = [
    'All',
    'Full Stack (MERN)',
    'Frontend / React',
    'Backend / Node.js',
    'Data Science & AI',
    'Cloud & DevOps',
    'UI/UX Design',
    'Cybersecurity'
  ];

  const jobTypes = ['All', 'Internship', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  useEffect(() => {
    fetchJobs();
  }, [category, jobType, page]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 9,
        category: category !== 'All' ? category : undefined,
        jobType: jobType !== 'All' ? jobType : undefined,
        search: search.trim() || undefined,
        location: location.trim() || undefined
      };

      const res = await jobService.getJobs(params);
      setJobs(res.data.jobs || []);
      setPagination({
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
        total: res.data.total || 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setJobType('All');
    setLocation('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ padding: '40px 0 60px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Explore Tech Opportunities</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Find active internships, graduate roles, and developer positions across top tech organizations.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="card" style={{ marginBottom: '36px', padding: '24px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Search Keywords</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Title, skills, or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Domain / Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Employment Type</label>
                <select
                  className="form-select"
                  value={jobType}
                  onChange={(e) => {
                    setJobType(e.target.value);
                    setPage(1);
                  }}
                >
                  {jobTypes.map((jt) => (
                    <option key={jt} value={jt}>
                      {jt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kochi, Remote..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
                <RotateCcw size={15} /> Reset Filters
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <Search size={15} /> Apply Search
              </button>
            </div>
          </form>
        </div>

        {/* Results Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Showing <strong>{jobs.length}</strong> of <strong>{pagination.total}</strong> opportunities
          </p>
        </div>

        {error && <Alert type="danger" message={error} />}

        {/* 4 UI States: Loading, Empty, Success */}
        {loading ? (
          <Loader message="Loading filtered opportunities..." />
        ) : jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Filter size={40} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.3rem' }}>No opportunities matched your criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', maxWidth: '400px', margin: '6px auto 20px auto' }}>
              Try adjusting your search terms, changing the category, or resetting all filters.
            </p>
            <button onClick={handleReset} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', padding: '0 8px' }}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobsList;
