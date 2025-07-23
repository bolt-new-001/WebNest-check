import axios from 'axios'

const DEVELOPER_API_URL = 'http://localhost:5002'

// Developer API instance
const developerAxios = axios.create({
  baseURL: DEVELOPER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to headers
developerAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
developerAxios.interceptors.response.use(
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

// Developer API methods
export const developerApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    // Add user type to registration data
    const registerData = {
      ...data,
      role: 'developer' // Set developer role
    }
    
    const response = await developerAxios.post('/api/auth/register', registerData)
    console.log('Developer Register API response:', response.data)
    
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const res = await developerAxios.post('/api/auth/login', data)
    
    // Handle the actual response structure
    if (res.data.success && res.data.data) {
      const userData = res.data.data
      const token = userData.token // Token should be in the data object

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      return res.data
    } else {
      throw new Error('Login failed')
    }
  },

  // Add other developer-specific API methods here
  getProfile: () => developerAxios.get('/api/auth/me'),
  
  // Projects
  getProjects: (params?: any) => developerAxios.get('/api/projects', { params }),
  getProject: (id: string) => developerAxios.get(`/api/projects/${id}`),
  updateProject: (id: string, data: any) => developerAxios.put(`/api/projects/${id}`, data),
}
