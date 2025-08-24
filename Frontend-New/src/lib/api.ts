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
      // If the response already has a success flag, return as is
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
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return {
        data: {
          success: false,
          message: 'Network Error: Unable to connect to the server.'
        }
      };
    }

    // Don't handle 401 as session expiry during auth operations
    if (error.response?.status === 401 && 
        error.config?.url && 
        !error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
      return {
        data: {
          success: false,
          message: 'Your session has expired. Please log in again.'
        }
      };
    }

    // Get error message from response or fallback
    const responseData = error.response.data || {};
    const errorMessage = responseData.message || 
                        responseData.error || 
                        'An unexpected error occurred';

    // Handle login-specific errors
    if (error.config?.url?.includes('/auth/login')) {
      return {
        data: {
          success: false,
          message: responseData.message || 'Invalid credentials'
        }
      };
    }

    // Log error details
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method
    });

    // Return a consistent error response structure
    return {
      data: {
        success: false,
        message: errorMessage
      }
    };
  }
);

  // ✅ Client API
export const clientApi = {  verifyEmail: async (data: { email: string, otp: string }) => {
    try {
      // Create a new instance without interceptors for verification
      const verifyApi = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await verifyApi.post('/api/auth/verify-email', data)
      console.log('Verify Email API response:', response.data)

      const responseData = response.data

      // Handle error cases first
      if (!responseData.success) {
        return {
          success: false,
          message: responseData.message || 'Verification failed'
        }
      }

      // Handle the case where user data is directly in data field
      if (responseData.data && typeof responseData.data === 'object') {
        const userData = responseData.data

        // If we have a user object directly
        if (userData._id && userData.email) {
          // Get token from response data
          const token = userData.token || responseData.token

          if (!token) {
            return {
              success: false,
              message: 'No authentication token received'
            }
          }

          // Make sure the user is marked as verified
          if (!userData.isEmailVerified) {
            return {
              success: false,
              message: 'Email verification status not updated on server'
            }
          }

          // Store the verified user data and token
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(userData))

          // Update the default api instance headers with the new token
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          return {
            success: true,
            data: {
              user: userData,
              token
            }
          }
        }
      }

      // Handle nested format
      if (responseData.data?.user && responseData.data?.token) {
        const { user, token } = responseData.data

        if (!user.isEmailVerified) {
          return {
            success: false,
            message: 'Email verification status not updated on server'
          }
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return responseData
      }

      console.error('Unexpected verification response format:', responseData)
      return {
        success: false,
        message: 'Invalid response format from server'
      }
    } catch (error: any) {
      console.error('Email verification error:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Email verification failed'
      }
    }
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
    try {
      const response = await api.post('/api/auth/login', data)
      console.log('Login API response:', response.data)

      // If the response itself is missing
      if (!response || !response.data) {
        return {
          success: false,
          message: 'No response from server'
        }
      }

      const responseData = response.data

      // Check if there's an error message in the response
      if (responseData.message && !responseData.success) {
        return {
          success: false,
          message: responseData.message
        }
      }

      // Handle the case where user data is directly in data field
      if (responseData.success && responseData.data && typeof responseData.data === 'object') {
        const userData = responseData.data
        
        if (userData._id && userData.email) {  // This is a user object
          // Check email verification
          if (!userData.isEmailVerified) {
            return {
              success: false,
              message: 'Please verify your email first',
              needsVerification: true,
              email: data.email
            }
          }

          // Get token from headers or response
          const token = response.headers?.authorization?.split(' ')[1] || userData.token

          if (!token) {
            return {
              success: false,
              message: 'No authentication token received'
            }
          }

          // Store user data and token
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(userData))
          
          return {
            success: true,
            data: {
              user: userData,
              token
            }
          }
        }
      }

      // Check nested format
      if (responseData.data?.user && responseData.data?.token) {
        const { user, token } = responseData.data

        if (!user.isEmailVerified) {
          return {
            success: false,
            message: 'Please verify your email first',
            needsVerification: true,
            email: data.email
          }
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return responseData
      }

      console.error('Unexpected response format:', responseData)
      return {
        success: false,
        message: 'Invalid response format from server'
      }
    } catch (error: any) {
      console.error('Login error details:', error.response?.data || error)
      // Return a properly structured error response
      return {
        success: false,
        message: error.response?.data?.message || 
                error.message || 
                'Login failed. Please check your credentials and try again.'
      }
    }
  },
   

  register: async (data: { 
    name: string; 
    email: string; 
    password: string;
    role?: string;
  }) => {
    try {
      // Add user type to registration data if not provided
      const registerData = {
        ...data,
        role: data.role || 'client' // Use provided role or default to 'client'
      }
      
      const response = await api.post('/api/auth/register', registerData)
      console.log('Register API response:', response.data)
      
      // Return the response data directly
      if (response.data) {
        return response.data
      }
      
      throw new Error('No response data received')
    } catch (error: any) {
      console.error('Registration error:', error)
      throw error
    }
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