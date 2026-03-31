import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For httpOnly cookies
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store (persisted in localStorage)
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Allow browser to automatically set multipart/form-data and boundary for file uploads
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto refresh token logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        const newToken = refreshResponse.data?.data?.accessToken;
        if (newToken) {
          useAuthStore.getState().setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear auth state on refresh failure - let layouts handle redirect
        useAuthStore.getState().logout();
        // Don't do hard redirect here - layouts will handle it
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

