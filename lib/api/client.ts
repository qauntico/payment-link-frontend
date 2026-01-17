import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

if (!API_BASE) {
  console.warn('NEXT_PUBLIC_BACKEND_URL or NEXT_PUBLIC_API_URL is not set in environment variables');
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // If data is FormData, let axios set Content-Type automatically (with boundary)
    // Don't override Content-Type for FormData requests
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error: AxiosError) => {
    console.log("error", error);
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log('🔒 Authentication error (401) - Logging out user...');
      
      // Clear authentication data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        
        // Clear cookies
        fetch('/api/auth/clear-cookie', {
          method: 'POST',
        }).catch((error) => {
          console.error('Error clearing auth cookies:', error);
        });
        
        // Navigate to login page
        setTimeout(() => {
          window.location.href = '/signin';
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
