import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { LandingPage } from '@/pages/LandingPage'
import { AuthPage } from '@/pages/AuthPage'
import { Documentation } from '@/pages/Documentation'
import { HelpCenter } from '@/pages/HelpCenter'
import { AboutUs } from '@/pages/AboutUs'
import { ContactUs } from '@/pages/ContactUs'
import { Careers } from '@/pages/Careers'

import { TermsOfService } from '@/pages/legal/TermsOfService'
import { PrivacyPolicy } from '@/pages/legal/PrivacyPolicy'
import { CookiesPolicy } from '@/pages/legal/CookiesPolicy'


// Maintance Pages
import { Maintenance } from '@/pages/maintenance/Maintenance'
import { NotFound } from '@/pages/maintenance/NotFound'


// Services Pages
import { WebDevelopment } from '@/pages/services/WebDevelopment'
import { MobileApps } from '@/pages/services/MobileApps'
import { Ecommerce } from '@/pages/services/Ecommerce'
import { Consulting } from '@/pages/services/Consulting'


//Main Dashboard Pages
import { ClientDashboard } from '@/pages/client/ClientDashboard'
import { DeveloperDashboard } from '@/pages/developer/DeveloperDashboard'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { ProtectedRoute } from '@/components/ProtectedRoute'



//Auth Pages
import ForgotPasswordPage from '@/pages/auth/auth-forgot'
import AuthType from '@/pages/auth/auth-home'
import AuthClientPage from '@/pages/auth/auth-client'
import AuthDevPage from '@/pages/auth/auth-dev'


function App() {
  const { user } = useAuthStore()

  return (
    <ThemeProvider>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiesPolicy />} />
      <Route path="/doc" element={<Documentation />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/careers" element={<Careers />} />

      <Route path="/auth/type" element={<AuthType />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth-type=client" element={<AuthClientPage />} />
      <Route path="/auth-type=dev" element={<AuthDevPage />} />

      <Route path="/services/web" element={<WebDevelopment />} />
      <Route path="/services/mobile" element={<MobileApps />} />
      <Route path="/services/ecommerce" element={<Ecommerce />} />
      <Route path="/services/consulting" element={<Consulting />} />
      

      {/* Maintenance Routes */}
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="*" element={<NotFound />} />
      
      
      {/* Protected Routes */}
      <Route
        path="/client/*"
        element={
          // <ProtectedRoute allowedRoles={['client', 'premiumClient']}>
            <ClientDashboard />
          //</ProtectedRoute>
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
    </ThemeProvider>
  )
}

export default App;