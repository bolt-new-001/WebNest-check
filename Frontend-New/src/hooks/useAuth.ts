import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore()

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser
  }
}