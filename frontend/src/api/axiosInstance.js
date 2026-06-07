import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true, // Send cookies with every request
  timeout: 15000,        // 15s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ─── Response interceptor ─── */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Auto-redirect to login on 401 (token expired/invalid)
    if (status === 401) {
      // Clear any stored auth state
      localStorage.removeItem('foodreels_user');
      localStorage.removeItem('foodreels_partner');

      // Redirect to login only if not already there
      const currentPath = window.location.pathname;
      if (
        !currentPath.startsWith('/user/login') &&
        !currentPath.startsWith('/food-partner/login') &&
        !currentPath.startsWith('/register') &&
        currentPath !== '/'
      ) {
        window.location.href = '/user/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
