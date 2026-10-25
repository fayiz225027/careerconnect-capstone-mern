import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ padding: '90px 20px', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>404</div>
        <h2 style={{ fontSize: '1.8rem', marginTop: '12px', marginBottom: '8px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          The page or resource you are seeking does not exist or may have been relocated.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Homepage
          </Link>
          <Link to="/jobs" className="btn btn-secondary">
            <Compass size={16} /> Explore Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
