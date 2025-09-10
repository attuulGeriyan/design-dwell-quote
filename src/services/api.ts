import axios from 'axios';
import { ApiResponse, User, Project, FurnitureItem } from '@/types';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for JWT
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    localStorage.removeItem('token');
  },
};

// Projects API
export const projectsApi = {
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  createProject: async (projectData: { title: string; description: string; client: any }): Promise<ApiResponse<Project>> => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  getProject: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/api/projects/${id}`, updates);
    return response.data;
  },

  addFurniture: async (projectId: string, furniture: FurnitureItem[]): Promise<ApiResponse<any>> => {
    const response = await api.post(`/api/projects/${projectId}/furniture/bulk`, { furniture });
    return response.data;
  },

  generatePDF: async (projectId: string): Promise<Blob> => {
    const response = await api.post(`/api/projects/${projectId}/generate-pdf`, {}, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Calculation API
export const calculationApi = {
  calculateWardrobe: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/api/calculate/wardrobe', data);
    return response.data;
  },

  calculateKitchen: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/api/calculate/kitchen', data);
    return response.data;
  },
};

// Clients API
export const clientsApi = {
  getClients: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/api/clients');
    return response.data;
  },

  createClient: async (clientData: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/api/clients', clientData);
    return response.data;
  },
};

export default api;