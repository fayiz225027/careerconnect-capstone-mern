import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'danger':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      {getIcon()}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            color: 'inherit'
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
