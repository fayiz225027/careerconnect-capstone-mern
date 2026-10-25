import React from 'react';

const Loader = ({ message = 'Loading details...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;
