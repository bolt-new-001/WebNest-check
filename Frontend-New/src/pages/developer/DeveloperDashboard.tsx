import { Routes, Route } from 'react-router-dom'
import { DeveloperLayout } from '@/components/layouts/DeveloperLayout'
import { DeveloperOverview } from './DeveloperOverview'
import { DeveloperProjects } from './DeveloperProjects'
// More pages will be added here

export function DeveloperDashboard() {
  return (
    <DeveloperLayout>
      <Routes>
        <Route path="/" element={<DeveloperOverview />} />
        <Route path="/projects" element={<DeveloperProjects />} />
        {/* Add more routes as needed */}
      </Routes>
    </DeveloperLayout>
  )
}