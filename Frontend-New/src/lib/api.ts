import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
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

// Client Service API
export const clientApi = {
  // Auth
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
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
  updateRevision: (id: string, data: any) => api.put(`/api/revisions/${id}`, data),
  
  // Demo/Insights
  getClientInsights: () => api.get('/api/demo/client-insights'),
  getDashboardData: () => api.get('/api/demo/dashboard'),
  
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

// Developer Service API (Port 5002)
export const developerApi = axios.create({
  baseURL: 'http://localhost:5002',
  headers: { 'Content-Type': 'application/json' },
})

// Admin Service API (Port 5003)
export const adminApi = axios.create({
  baseURL: 'http://localhost:5003',
  headers: { 'Content-Type': 'application/json' },
})

// Add auth interceptors for developer and admin APIs
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