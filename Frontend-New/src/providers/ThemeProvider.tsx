import { createContext, useContext, useEffect } from 'react';
import { useTheme as useThemeStore } from '@/lib/theme';

const ThemeContext = createContext<ReturnType<typeof useThemeStore> | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore();
  
  useEffect(() => {
    // Apply theme class to document element
    document.documentElement.classList.toggle('dark', theme.isDark);
  }, [theme.isDark]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
