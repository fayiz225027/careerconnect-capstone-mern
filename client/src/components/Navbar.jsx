import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, User as UserIcon, LogOut, PlusCircle, LayoutDashboard, FileText, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Briefcase size={22} />
          </div>
          <div>
            <div style={{ lineHeight: 1.1, fontSize: '1.25rem', fontWeight: 800 }}>
              Career<span style={{ color: 'var(--primary)' }}>Connect</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>
              ICTAK CAPSTONE PORTAL
            </span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Opportunities
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}

          {user?.role === 'student' && (
            <NavLink to="/my-applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Applications
            </NavLink>
          )}

          {(user?.role === 'recruiter' || user?.role === 'admin') && (
            <>
              <NavLink to="/post-job" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Post Opportunity
              </NavLink>
              <NavLink to="/manage-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Manage Listings
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Admin Console
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <span className={`badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'recruiter' ? 'badge-info' : 'badge-primary'}`} style={{ fontSize: '0.7rem' }}>
                  {user.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
