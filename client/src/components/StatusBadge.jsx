import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-secondary';

  switch (status) {
    case 'Accepted':
    case 'Active':
      badgeClass = 'badge-success';
      break;
    case 'Shortlisted':
      badgeClass = 'badge-info';
      break;
    case 'Reviewed':
    case 'Pending':
      badgeClass = 'badge-warning';
      break;
    case 'Rejected':
    case 'Closed':
      badgeClass = 'badge-danger';
      break;
    default:
      badgeClass = 'badge-secondary';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;
