import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Send, PlusCircle } from 'lucide-react';
import { jobService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: user?.location || 'Kochi, Kerala (Hybrid)',
    jobType: 'Internship',
    category: 'Full Stack (MERN)',
    experienceLevel: 'Internship / Fresher',
    salary: '₹18,000 - ₹25,000 / month Stipend',
    deadline: '',
    description: '',
    requirements: '',
    responsibilities: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Full Stack (MERN)',
    'Frontend / React',
    'Backend / Node.js',
    'Data Science & AI',
    'Cloud & DevOps',
    'UI/UX Design',
    'Cybersecurity'
  ];

  const jobTypes = ['Internship', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  const experienceLevels = [
    'Internship / Fresher',
    'Entry Level (0-1 yr)',
    'Mid Level (1-3 yrs)',
    'Senior (3+ yrs)'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.company || !formData.description) {
      setError('Please provide title, company name, and job description');
      return;
    }

    setLoading(true);
    try {
      await jobService.createJob(formData);
      navigate('/manage-jobs');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '28px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              RECRUITER PORTAL
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Publish an Opportunity</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Create an internship or full-time posting visible to thousands of trained MERN candidates.
            </p>
          </div>

          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Position Title *</label>
              <input
                type="text"
                name="title"
                required
                className="form-input"
                placeholder="e.g. Full Stack MERN Developer Intern"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Company / Organization *</label>
                <input
                  type="text"
                  name="company"
                  required
                  className="form-input"
                  placeholder="e.g. TechVerve Solutions"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="form-input"
                  placeholder="e.g. Kochi Infopark / Remote"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Domain / Category</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience Requirement</label>
                <select name="experienceLevel" className="form-select" value={formData.experienceLevel} onChange={handleChange}>
                  {experienceLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Salary / Monthly Stipend</label>
                <input
                  type="text"
                  name="salary"
                  className="form-input"
                  placeholder="e.g. ₹20,000 / month or ₹5 - 7 LPA"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Job Description *</label>
              <textarea
                name="description"
                required
                rows="5"
                className="form-textarea"
                placeholder="Provide a comprehensive summary of the role, team environment, and project scope..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Responsibilities (One per line)</label>
              <textarea
                name="responsibilities"
                rows="4"
                className="form-textarea"
                placeholder="Build responsive React components&#10;Implement REST APIs with Node.js and Express&#10;Write unit tests"
                value={formData.responsibilities}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements & Skills (One per line)</label>
              <textarea
                name="requirements"
                rows="4"
                className="form-textarea"
                placeholder="Proficiency in React.js and modern JavaScript&#10;Familiarity with MongoDB and Mongoose&#10;Git version control knowledge"
                value={formData.requirements}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
              <button type="button" onClick={() => navigate('/manage-jobs')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Send size={16} /> {loading ? 'Posting Opportunity...' : 'Publish Job Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
