import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LandingPage } from '@/pages/LandingPage'
import { AuthPage } from '@/pages/AuthPage'
import { ClientDashboard } from '@/pages/client/ClientDashboard'
import { DeveloperDashboard } from '@/pages/developer/DeveloperDashboard'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/client/*"
        element={
          // <ProtectedRoute allowedRoles={['client', 'premiumClient']}>
            <ClientDashboard />
          // </ProtectedRoute>
        }
      />
      
      <Route
        path="/developer/*"
        element={
          // <ProtectedRoute allowedRoles={['developer', 'leadDeveloper']}>
            <DeveloperDashboard />
          // </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          // <ProtectedRoute allowedRoles={['admin', 'owner']}>
            <AdminDashboard />
          // </ProtectedRoute>
        }
      />
      

      {/* Redirect based on user role */}
      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === 'admin' || user.role === 'owner' ? (
              <Navigate to="/admin" replace />
            ) : user.role === 'developer' || user.role === 'leadDeveloper' ? (
              <Navigate to="/developer" replace />
            ) : (
              <Navigate to="/client" replace />
            )
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App;