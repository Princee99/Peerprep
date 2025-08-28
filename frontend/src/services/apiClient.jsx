import axios from 'axios';
import authService from './authService';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor to add authorization header to every request
apiClient.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If the error is 401 and the message is about token expiration or invalid token
    // and we haven't tried to refresh the token yet for this request
    if (error.response?.status === 401 && 
        (error.response?.data?.message === 'Token is expired' || 
         error.response?.data?.message === 'Token is not valid') && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await authService.refreshToken();
        if (newToken) {
          // If successful, update the request header and retry
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Failed to refresh token:', refreshError);
        window.location = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;