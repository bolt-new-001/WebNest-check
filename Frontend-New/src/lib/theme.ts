import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      
      setTheme: (theme: Theme) => {
        const isDark = theme === 'dark' || 
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        
        document.documentElement.classList.toggle('dark', isDark)
        set({ theme, isDark })
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme on hydration
          const isDark = state.theme === 'dark' || 
            (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          
          document.documentElement.classList.toggle('dark', isDark)
          state.isDark = isDark
        }
      }
    }
  )
)

// Initialize theme on app start
export const initializeTheme = () => {
  const { theme, setTheme } = useTheme.getState()
  setTheme(theme)
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { theme, setTheme } = useTheme.getState()
    if (theme === 'system') {
      setTheme('system')
    }
  })
}