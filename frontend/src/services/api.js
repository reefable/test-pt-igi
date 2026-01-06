import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  // In Docker, browser hits localhost:3000. In prod, use relative path /api via Nginx.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 (Token Expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout(); // Clear state
      window.location.href = '/login'; // Force redirect
    }
    return Promise.reject(error);
  }
);

export default api;