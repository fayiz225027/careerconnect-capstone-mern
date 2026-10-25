import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Trash2, Shield, UserCheck, CheckCircle } from 'lucide-react';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, recentJobs: [], recentUsers: [] });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, usersRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getUsers()
      ]);
      setData(overviewRes.data);
      setUsersList(usersRes.data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}" and all their records?`)) {
      return;
    }

    try {
      await adminService.deleteUser(id);
      setActionMsg(`User ${name} removed from database`);
      setUsersList((prev) => prev.filter((u) => u._id !== id));
      // Refresh overview
      const overviewRes = await adminService.getOverview();
      setData(overviewRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loader message="Accessing administrative management console..." />;
  }

  const { stats } = data;

  return (
    <div style={{ padding: '40px 0 70px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-danger" style={{ marginBottom: '8px' }}>
            SUPER ADMINISTRATOR CONSOLE
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>ICTAK Platform Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            System-wide operational oversight, student & recruiter registry, and content moderation.
          </p>
        </div>

        {actionMsg && <Alert type="success" message={actionMsg} onClose={() => setActionMsg('')} />}
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        {/* Global Analytics Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalUsers || 0}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Registered Accounts</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--info-bg)', color: 'var(--info)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.studentsCount || 0}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enrolled Students</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalJobs || 0}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Opportunities Listed</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalApplications || 0}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Applications Evaluated</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>User Accounts Registry</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Total: <strong>{usersList.length}</strong>
            </span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Organization / Location</th>
                  <th>Joined Date</th>
                  <th>Moderation</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'recruiter' ? 'badge-info' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.company || u.location || '—'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Remove user and records"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System Root</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
