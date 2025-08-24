import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  _id: string
  name: string
  email: string
  role: string
  isPremium?: boolean
  avatar?: string
  isEmailVerified: boolean
}

interface Session {
  id: string
  lastUsed: Date
  device?: string
}

interface AuthState {
  user: User | null
  token: string | null
  session: Session | null
  isAuthenticated: boolean
  isEmailVerified: boolean
  isLoading: boolean
  login: (user: User, token: string, sessionId?: string) => void
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  startSession: (sessionId: string) => void
  verifyEmail: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      isLoading: false,
      session: null,
      isEmailVerified: false,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      login: (user: User, token: string, sessionId?: string) => {
        // Store in secure localStorage
        localStorage.setItem('token', token)
        
        // Update state
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isEmailVerified: user.isEmailVerified,
          session: sessionId ? {
            id: sessionId,
            lastUsed: new Date()
          } : null
        })
      },

      logout: async () => {
        try {
          // Call logout API
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          })
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear all auth data
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          
          // Reset state
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            session: null,
            isEmailVerified: false
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData }
          set({ 
            user: updatedUser,
            isEmailVerified: updatedUser.isEmailVerified
          })
        }
      },

      setUser: (user: User) => {
        set({ 
          user,
          isEmailVerified: user.isEmailVerified
        })
      },

      startSession: (sessionId: string) => {
        set({
          session: {
            id: sessionId,
            lastUsed: new Date()
          }
        })
      },

      verifyEmail: () => {
        set({ isEmailVerified: true })
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              isEmailVerified: true
            }
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)