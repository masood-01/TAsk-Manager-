import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://task-manager-n9z6.onrender.com/';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Project APIs
export const projectAPI = {
  create: (data) => api.post('/api/projects', data),
  getAll: () => api.get('/api/projects'),
  getById: (id) => api.get(`/api/projects/${id}`),
  update: (id, data) => api.patch(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
  addMember: (id, data) => api.post(`/api/projects/${id}/members`, data),
  removeMember: (id, data) => api.delete(`/api/projects/${id}/members`, { data }),
};

// Task APIs
export const taskAPI = {
  create: (projectId, data) => api.post(`/api/tasks/${projectId}`, data),
  getByProject: (projectId) => api.get(`/api/tasks/project/${projectId}`),
  getById: (id) => api.get(`/api/tasks/${id}`),
  update: (id, data) => api.patch(`/api/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/tasks/${id}`),
  assign: (id, data) => api.patch(`/api/tasks/${id}/assign`, data),
  getDashboard: () => api.get('/api/tasks/dashboard/stats'),
};

export default api;
