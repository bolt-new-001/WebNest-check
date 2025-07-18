import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { AdminOverview } from './AdminOverview'
import { AdminUsers } from './AdminUsers'
// More pages will be added here

export function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        {/* Add more routes as needed */}
      </Routes>
    </AdminLayout>
  )
}