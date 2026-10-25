import React, { useState } from 'react';
import { User, Mail, MapPin, Phone, Briefcase, FileText, Globe, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    company: user?.company || '',
    portfolio: user?.portfolio || '',
    resumeUrl: user?.resumeUrl || '',
    skills: user?.skills ? user.skills.join(', ') : ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccessMsg('Your profile has been successfully updated!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{user.name}</h1>
                <span className={`badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'recruiter' ? 'badge-info' : 'badge-primary'}`}>
                  {user.role}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
            </div>
          </div>

          {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {user.role === 'recruiter' && (
              <div className="form-group">
                <label className="form-label">Company / Organization</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Location (City, State)</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Kochi, Kerala"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Bio / About Me</label>
              <textarea
                name="bio"
                rows="3"
                className="form-textarea"
                placeholder="Write a brief professional summary..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {user.role === 'student' && (
              <>
                <div className="form-group">
                  <label className="form-label">Technical Skills (Comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-input"
                    placeholder="React.js, Node.js, Express, MongoDB, Tailwind CSS, Git"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Default Resume Link (Google Drive / Cloud PDF)</label>
                  <input
                    type="url"
                    name="resumeUrl"
                    className="form-input"
                    placeholder="https://drive.google.com/file/d/.../view"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    className="form-input"
                    placeholder="https://github.com/fayiz225027"
                    value={formData.portfolio}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={16} /> {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
