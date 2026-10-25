import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import JobsList from './pages/JobsList';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import JobApplicants from './pages/JobApplicants';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobsList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Authenticated Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter / Admin Routes */}
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-jobs"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:jobId/applicants"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <JobApplicants />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
