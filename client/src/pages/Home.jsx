import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Users, Building2, CheckCircle, ArrowRight, Sparkles, TrendingUp, Compass } from 'lucide-react';
import { jobService } from '../services/api';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 6, totalApplications: 2 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          jobService.getJobs({ limit: 6 }),
          jobService.getStats()
        ]);
        setJobs(jobsRes.data.jobs || []);
        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const categories = [
    'Full Stack (MERN)',
    'Frontend / React',
    'Backend / Node.js',
    'Data Science & AI',
    'Cloud & DevOps',
    'UI/UX Design'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-tag">
            <Sparkles size={16} />
            <span>Official ICT Academy of Kerala Capstone Showcase</span>
          </div>

          <h1 className="hero-title">
            Bridge Your Academic Journey to <span>High-Impact Tech Careers</span>
          </h1>

          <p className="hero-desc">
            Connect directly with verified tech startups, software companies, and recruiters.
            Discover curated internships and entry-level positions tailored for MERN stack graduates.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '640px', margin: '0 auto 24px auto', display: 'flex', gap: '8px', background: '#ffffff', padding: '6px', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, paddingLeft: '12px', color: 'var(--text-muted)' }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              Search Jobs
            </button>
          </form>

          {/* Quick Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', alignSelf: 'center', marginRight: '4px' }}>Popular:</span>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/jobs?category=${encodeURIComponent(cat)}`}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
              <Briefcase size={26} />
            </div>
            <div>
              <div className="stat-num">{stats.totalJobs || 6}+</div>
              <div className="stat-label">Verified Openings</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <Users size={26} />
            </div>
            <div>
              <div className="stat-num">{stats.totalApplications || 2}</div>
              <div className="stat-label">Applications Submitted</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              <Building2 size={26} />
            </div>
            <div>
              <div className="stat-num">15+</div>
              <div className="stat-label">Hiring Partners</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <TrendingUp size={26} />
            </div>
            <div>
              <div className="stat-num">98%</div>
              <div className="stat-label">Placement Relevance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>CURATED OPPORTUNITIES</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Latest Internships & Tech Roles</h2>
              <p style={{ color: 'var(--text-muted)' }}>Explore recently published roles open for applications</p>
            </div>
            <Link to="/jobs" className="btn btn-secondary">
              View All Opportunities <ArrowRight size={16} />
            </Link>
          </div>

          {error && <Alert type="danger" message={error} />}

          {loading ? (
            <Loader message="Fetching featured opportunities..." />
          ) : jobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <h3>No jobs posted yet</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Check back shortly or register as a recruiter to post new opportunities.
              </p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ background: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '70px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span className="badge badge-info" style={{ marginBottom: '8px' }}>DESIGNED FOR ACADEMY EXCELLENCE</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Why CareerConnect?</h2>
            <p style={{ color: 'var(--text-muted)' }}>A comprehensive ecosystem built to streamline student hiring.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="card">
              <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <CheckCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Verified Opportunities</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                All listings undergo validation by academy coordinators to ensure legitimate stipends and mentorship.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Real-time Status Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Students receive clear feedback updates—Pending, Under Review, Shortlisted, or Accepted—with notes from recruiters.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', background: 'var(--info-bg)', color: 'var(--info)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Full MERN Architecture</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Engineered from the ground up adhering to enterprise standards: REST API, JWT auth, Mongoose ODM, and responsive React.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '50px 30px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '14px' }}>
              Ready to Accelerate Your Career?
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 28px auto', fontSize: '1.05rem' }}>
              Create an account in less than a minute. Apply to top tech internships and unlock direct recruitment opportunities.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Candidate Account
              </Link>
              <Link to="/jobs" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Browse All Openings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
