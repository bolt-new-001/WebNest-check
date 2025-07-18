import { Routes, Route } from 'react-router-dom'
import { DeveloperLayout } from '@/components/layouts/DeveloperLayout'
import { DeveloperOverview } from './DeveloperOverview'
import { DeveloperProjects } from './DeveloperProjects'
import { DeveloperProjectDetail } from './DeveloperProjectDetail'
import { DeveloperPortfolio } from './DeveloperPortfolio'
import { DeveloperEarnings } from './DeveloperEarnings'
import { DeveloperTimeTracking } from './DeveloperTimeTracking'
import { DeveloperMessages } from './DeveloperMessages'
import { DeveloperAvailability } from './DeveloperAvailability'
import { DeveloperSettings } from './DeveloperSettings'

export function DeveloperDashboard() {
  return (
    <DeveloperLayout>
      <Routes>
        <Route path="/" element={<DeveloperOverview />} />
        <Route path="/projects" element={<DeveloperProjects />} />
        <Route path="/projects/:id" element={<DeveloperProjectDetail />} />
        <Route path="/portfolio" element={<DeveloperPortfolio />} />
        <Route path="/earnings" element={<DeveloperEarnings />} />
        <Route path="/time-tracking" element={<DeveloperTimeTracking />} />
        <Route path="/messages" element={<DeveloperMessages />} />
        <Route path="/availability" element={<DeveloperAvailability />} />
        <Route path="/settings" element={<DeveloperSettings />} />
      </Routes>
    </DeveloperLayout>
  )
}