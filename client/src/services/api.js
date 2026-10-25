import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unified errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear invalid credential
      if (localStorage.getItem('careerconnect_token')) {
        localStorage.removeItem('careerconnect_token');
        localStorage.removeItem('careerconnect_user');
      }
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// API Service Functions
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  toggleSaveJob: (jobId) => api.post(`/auth/save-job/${jobId}`)
};

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyPostedJobs: () => api.get('/jobs/my/listings'),
  getStats: () => api.get('/jobs/meta/stats')
};

export const applicationService = {
  applyForJob: (jobId, data) => api.post(`/applications/${jobId}`, data),
  getMyApplications: () => api.get('/applications/my'),
  getApplicantsForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (appId, data) => api.put(`/applications/${appId}/status`, data),
  withdraw: (appId) => api.delete(`/applications/${appId}`)
};

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

export default api;
