import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

// Default Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to headers (Request Interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors (Response Interceptor)
api.interceptors.response.use(
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

// ✅ Client API
export const clientApi = {
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

  // Projects
  getProjects: (params?: any) => api.get('/api/projects', { params }),
  getProject: (id: string) => api.get(`/api/projects/${id}`),
  createProject: (data: any) => api.post('/api/projects', data),
  updateProject: (id: string, data: any) => api.put(`/api/projects/${id}`, data),

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