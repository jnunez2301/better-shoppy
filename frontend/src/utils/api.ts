import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const baseURL = apiUrl.startsWith('http') ? apiUrl : `http://${apiUrl}`;

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

// Add a request interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
