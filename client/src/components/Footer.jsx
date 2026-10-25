import React from 'react';
import { Briefcase, Heart, Code2, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Briefcase size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>CareerConnect</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '340px' }}>
              Final Capstone Project for ICT Academy of Kerala (ICTAK) Full Stack Application Development with MERN Stack.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <span className="badge badge-primary">MongoDB</span>
              <span className="badge badge-info">Express.js</span>
              <span className="badge badge-success">React.js</span>
              <span className="badge badge-warning">Node.js</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/jobs">Job & Internship Catalog</Link></li>
              <li><Link to="/login">Account Portal</Link></li>
              <li><Link to="/register">Register Candidate / Recruiter</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Institution & Author</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p><strong>Institution:</strong> Sahrdaya College of Engineering and Technology</p>
              <p><strong>Training Partner:</strong> ICT Academy of Kerala (ICTAK)</p>
              <p><strong>Developer:</strong> Fayiz Mohammed (fayiz225027)</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CareerConnect MERN Capstone Platform. Built with React & Node.js for ICTAK Evaluation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
