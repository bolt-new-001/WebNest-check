import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { AdminOverview } from './AdminOverview'
import { AdminUsers } from './AdminUsers'
import { AdminDevelopers } from './AdminDevelopers'
import { AdminProjects } from './AdminProjects'
import { AdminThemes } from './AdminThemes'
import { AdminPackages } from './AdminPackages'
// import { AdminAnalytics } from './AdminAnalytics'
import { AdminNotifications } from './AdminNotifications'
import { AdminSupport } from './AdminSupport'
// import { AdminVideos } from './AdminVideos'
import { AdminLegal } from './AdminLegal'
import { AdminSettings } from './AdminSettings'

export function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/developers" element={<AdminDevelopers />} />
        <Route path="/projects" element={<AdminProjects />} />
        <Route path="/themes" element={<AdminThemes />} />
        <Route path="/packages" element={<AdminPackages />} />
        {/* <Route path="/analytics" element={<AdminAnalytics />} /> */}
        <Route path="/notifications" element={<AdminNotifications />} />
        <Route path="/support" element={<AdminSupport />} />
        {/* <Route path="/videos" element={<AdminVideos />} /> */}
        <Route path="/legal" element={<AdminLegal />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  )
}