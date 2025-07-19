import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ApiResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Determine which API endpoint to use based on role
      let apiUrl = 'http://localhost:5001/api/auth/login'; // Default to client
      
      if (role === 'developer') {
        apiUrl = 'http://localhost:5002/api/auth/login';
      } else if (role === 'admin') {
        apiUrl = 'http://localhost:5003/api/auth/login';
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse<{ token: string; user: User }> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.data!.token);
      localStorage.setItem('user', JSON.stringify(data.data!.user));
      localStorage.setItem('userRole', data.data!.user.role);

      setUser(data.data!.user);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: string;
    [key: string]: string | number | boolean;
  }
  
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Determine which API endpoint to use based on role
      let apiUrl = 'http://localhost:5001/api/auth/register'; // Default to client
      
      if (userData.role === 'developer') {
        apiUrl = 'http://localhost:5002/api/auth/register';
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<{ token: string; user: User }> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.data!.token);
      localStorage.setItem('user', JSON.stringify(data.data!.user));
      localStorage.setItem('userRole', data.data!.user.role);

      setUser(data.data!.user);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};