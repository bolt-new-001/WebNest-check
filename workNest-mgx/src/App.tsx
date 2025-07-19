import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Public Pages
import HomePage from './pages/HomePage';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';

// Client Pages
import ClientDashboard from './pages/Client/Dashboard';

// Developer Pages
import DeveloperDashboard from './pages/Developer/Dashboard';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';

// Error Page
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, roles, redirectTo = "/login" }: { 
  children: JSX.Element, 
  roles: string[],
  redirectTo?: string
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If still loading auth state, show nothing
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // If not authenticated or user doesn't have the required role, redirect
  if (!isAuthenticated || !user || !roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise, render the children
  return children;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If still loading auth state, show nothing
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // If authenticated, redirect based on role
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'developer') {
      return <Navigate to="/developer/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Otherwise, render the public content
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={<HomePage />}
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />

            {/* Admin Auth Route */}
            <Route 
              path="/admin/auth" 
              element={
                <PublicRoute>
                  <AdminLoginPage />
                </PublicRoute>
              } 
            />

            {/* Client Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Developer Protected Routes */}
            <Route 
              path="/developer/dashboard" 
              element={
                <ProtectedRoute roles={['developer']}>
                  <DeveloperDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Admin Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin']} redirectTo="/admin/auth">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;