import React, { createContext, useContext, useEffect } from 'react'
import { useTheme } from '@/lib/theme'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
  storageKey?: string
}

type ThemeProviderState = {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  isDark: boolean
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  isDark: false,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const { theme, setTheme, isDark, toggleTheme } = useTheme()

  useEffect(() => {
    // Initialize theme on mount
    if (!theme) {
      setTheme(defaultTheme)
    }
  }, [defaultTheme, setTheme, theme])

  const value = {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}