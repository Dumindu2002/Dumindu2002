import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/users/login', credentials),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => api.post('/users/register', userData),
  
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => api.post('/users/change-password', passwordData),
};

// Items API
export const itemsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/items', { params }),
  
  getById: (id: string) => api.get(`/items/${id}`),
  
  create: (itemData: {
    title: string;
    description: string;
    category: string;
    value?: number;
    percentage?: number;
    status?: string;
    priority?: string;
    tags?: string[];
  }) => api.post('/items', itemData),
  
  update: (id: string, itemData: any) => api.put(`/items/${id}`, itemData),
  
  partialUpdate: (id: string, itemData: any) => api.patch(`/items/${id}`, itemData),
  
  delete: (id: string) => api.delete(`/items/${id}`),
  
  bulkDelete: (ids: string[]) => api.delete('/items', { data: { ids } }),
  
  getStats: () => api.get('/items/stats/summary'),
};

// Users API
export const usersAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  }) => api.get('/users', { params }),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  
  delete: (id: string) => api.delete(`/users/${id}`),
  
  getStats: () => api.get('/users/stats/summary'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  
  getRecentActivity: (limit?: number) => 
    api.get('/dashboard/recent-activity', { params: { limit } }),
  
  getAnalytics: (range?: string) => 
    api.get('/dashboard/analytics', { params: { range } }),
  
  getCalendarData: (year?: number, month?: number) => 
    api.get('/dashboard/calendar-data', { params: { year, month } }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;