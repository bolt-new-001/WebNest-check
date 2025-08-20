import axios, { AxiosError } from 'axios';

// Define the interface for our standard API response
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Extend the ImportMeta interface to include env
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
  [key: string]: any;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5001';

// Default Axios instance with proper typing
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Add token to headers (Request Interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor for consistent error handling
api.interceptors.response.use(
  (response) => {
    // For successful responses, ensure consistent structure
    if (response.data) {
      // If the response already has a success flag, use it as is
      if (response.data.success !== undefined) {
        return response;
      }
      // Wrap in standard response format if needed
      return {
        ...response,
        data: {
          success: true,
          data: response.data
        }
      };
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        response: {
          data: {
            success: false,
            message: 'Network Error: Unable to connect to the server.'
          },
          status: 0
        }
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
      return Promise.reject({
        response: {
          ...error.response,
          data: {
            success: false,
            message: 'Your session has expired. Please log in again.'
          }
        }
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'An unexpected error occurred';
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method
    });

    // Ensure consistent error response structure
    return Promise.reject({
      response: {
        ...error.response,
        data: {
          success: false,
          message: errorMessage,
          ...(error.response?.data || {})
        }
      }
    });
  }
);

// ✅ Client API
export const clientApi = {
  // Authentication
  login: async (credentials: { email: string, password: string }) => {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  register: async (userData: {
    name: string,
    email: string,
    password: string,
    role: string
  }) => {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  },

  verifyEmail: async (data: { email: string, otp: string }) => {
    const response = await api.post('/api/auth/verify-email', data)
    return response.data
  },

  // Security
  changePassword: async (data: {
    currentPassword: string,
    newPassword: string
  }) => {
    const response = await api.put('/api/security/change-password', data)
    return response.data
  },

  toggle2FA: async (enable: boolean) => {
    const response = await api.put('/api/security/two-factor', { enable })
    return response.data
  },

  getSessions: async () => {
    const response = await api.get('/api/security/sessions')
    return response.data
  },

  revokeSession: async (sessionId: string) => {
    const response = await api.delete(`/api/security/sessions/${sessionId}`)
    return response.data
  },

  // Dashboard Data
  getClientOverview: async () => {
    const response = await api.get('/api/client/overview')
    return response.data
  },

  getProjectStatistics: async () => {
    const response = await api.get('/api/client/projects/statistics')
    return response.data
  },

  getTeamStatistics: async () => {
    const response = await api.get('/api/client/team/statistics')
    return response.data
  },

  getBudgetStatistics: async () => {
    const response = await api.get('/api/client/budget/statistics')
    return response.data
  },

  // Auth
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/api/auth/login', data)
    const { token, user } = res.data

    // Store token and user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    return res.data
  },
   

  register: async (data: { name: string; email: string; password: string }) => {
    // Add user type to registration data
    const registerData = {
      ...data,
      role: 'client' // Set default role for client API
    }
    
    const response = await api.post('/api/auth/register', registerData)
    console.log('Register API response:', response.data)
    
    // Return the entire response data which includes success and data properties
    return response.data
  },

  getProfile: () => api.get('/api/auth/me'),

  // Project types
  Project: {
    create: async (data: {
      title: string;
      description: string;
      projectType: string;
      budget: number;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      features: Array<{
        name: string;
        description: string;
        price: number;
      }>;
      selectedTheme?: string | null;
      aiFeatures?: string[];
      timeline?: {
        estimatedDays: number;
        startDate?: Date;
        expectedDelivery?: Date;
      };
    }) => {
      try {
        const response = await api.post<ApiResponse<{
          _id: string;
          title: string;
          status: string;
          createdAt: string;
        }>>('/api/projects', data);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create project');
        }
        
        return response.data;
      } catch (error) {
        console.error('Error in project creation:', error);
        throw error;
      }
    },
    
    get: async (id: string) => {
      const response = await api.get<ApiResponse>(`/api/projects/${id}`);
      return response.data;
    },
    
    list: async (params?: Record<string, any>) => {
      const response = await api.get<ApiResponse>('/api/projects', { params });
      return response.data;
    },
    
    update: async (id: string, data: any) => {
      const response = await api.put<ApiResponse>(`/api/projects/${id}`, data);
      return response.data;
    }
  },
  
  // Legacy methods (deprecated, will be removed in future)
  getProjects: (params?: any) => api.get('/api/projects', { params }),
  getProject: (id: string) => api.get(`/api/projects/${id}`),
  createProject: (data: any) => clientApi.Project.create(data),
  updateProject: (id: string, data: any) => clientApi.Project.update(id, data),

  // Activity Feed
  getProjectActivity: (projectId: string, params?: any) =>
    api.get(`/api/activity/project/${projectId}`, { params }),
  getUserActivity: (params?: any) => api.get('/api/activity/user', { params }),

  // Files
  uploadFile: (projectId: string, formData: FormData) =>
    api.post(`/api/files/upload/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getProjectFiles: (projectId: string, params?: any) =>
    api.get(`/api/files/project/${projectId}`, { params }),
  deleteFile: (fileId: string) => api.delete(`/api/files/${fileId}`),

  // Notifications
  getNotifications: (params?: any) =>
    api.get('/api/notifications/client', { params }),
  markNotificationRead: (id: string) =>
    api.put(`/api/notifications/client/${id}/read`),
  markAllNotificationsRead: () =>
    api.put('/api/notifications/client/read-all'),

  // Revisions
  createRevision: (data: any) => api.post('/api/revisions/request', data),
  getProjectRevisions: (projectId: string, params?: any) =>
    api.get(`/api/revisions/project/${projectId}`, { params }),
  updateRevision: (id: string, data: any) =>
    api.put(`/api/revisions/${id}`, data),

  // Demo/Insights
  getClientInsights: () => api.get('/api/demo/client-insights'),
  getDashboardData: () => api.get('/api/demo/dashboard'),

  // Profile
  updateProfile: (data: any) => api.put('/api/profile', data),
  uploadAvatar: (formData: FormData) => api.post('/api/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAccount: () => api.delete('/api/profile'),
  upgradeToPremium: (data: { plan: string }) => api.post('/api/profile/upgrade', data),

  // Packages
  getPackages: () => api.get('/api/packages'),
  getPackage: (id: string) => api.get(`/api/packages/${id}`),
  customizePackage: (id: string, data: any) => api.post(`/api/packages/${id}/customize`, data),
  purchasePackage: (id: string) => api.post(`/api/packages/${id}/purchase`),

  // Preferences
  getPreferences: () => api.get('/api/preferences'),
  updatePreferences: (data: any) => api.put('/api/preferences', data),

  // Themes
  getThemes: (params?: any) => api.get('/api/themes', { params }),
  getTheme: (id: string) => api.get(`/api/themes/${id}`),

  // Chat
  getProjectChatMessages: (projectId: string, params?: any) => api.get(`/api/chat/project/${projectId}`, { params }),
  sendChatMessage: (projectId: string, data: any) => api.post(`/api/chat/project/${projectId}/message`, data),
  markMessageAsRead: (messageId: string) => api.put(`/api/chat/message/${messageId}/read`),
  getUnreadMessageCount: () => api.get('/api/chat/unread-count'),

  // Support
  createSupportTicket: (data: any) => api.post('/api/support/tickets', data),
  getSupportTickets: (params?: any) => api.get('/api/support/tickets', { params }),
  getSupportTicket: (id: string) => api.get(`/api/support/tickets/${id}`),
  addTicketMessage: (id: string, data: any) =>
    api.post(`/api/support/tickets/${id}/messages`, data),
}

// Developer API (port 5002)
export const developerApi = axios.create({
  baseURL: 'http://localhost:5002',
  headers: { 'Content-Type': 'application/json' },
})

// Admin API (port 5003)
export const adminApi = axios.create({
  baseURL: 'http://localhost:5003',
  headers: { 'Content-Type': 'application/json' },
})

// Attach interceptors to developer and admin APIs
;[developerApi, adminApi].forEach(apiInstance => {
  apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
      }
      return Promise.reject(error)
    }
  )
})