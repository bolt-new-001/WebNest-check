import { Routes, Route } from 'react-router-dom'
import { ClientLayout } from '@/components/layouts/ClientLayout'
import ClientDashboardOverview from './ClientDashboardOverview'
import { ClientProjects } from './ClientProjects'
import { ClientProjectDetail } from './ClientProjectDetail'
import { ClientFiles } from './ClientFiles'
import { ClientNotifications } from './ClientNotifications'
import { ClientRevisions } from './ClientRevisions'
import { AddProject } from './AddProject'
// import { ClientResources } from './ClientResources'
import { ClientSupport } from './ClientSupport'
import ClientSettings from './ClientSettings'
import { ClientProfile } from './ClientProfile'
import ClientPremium from './ClientPremium'
import ClientPackages from './ClientPackages'
import { ClientChat } from './ClientChat'

import ClientBudget from './ClientBudget'
import ClientMilestones from './ClientMilestones'
import ClientTimeTracking from './ClientTimeTracking'
import ClientBackups from './ClientBackups'

// import ClientPackageDetail from './ClientPackageDetail'
// import  ClientPackageCustomize from './ClientPackageCustomize'

export function ClientDashboard() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboardOverview />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/projects/:id" element={<ClientProjectDetail />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/files" element={<ClientFiles />} />
        <Route path="/chat" element={<ClientChat />} />
        <Route path="/chat/:projectId" element={<ClientChat />} />
        <Route path="/notifications" element={<ClientNotifications />} />
        <Route path="/revisions" element={<ClientRevisions />} />
        <Route path="/support" element={<ClientSupport />} />
        <Route path="/settings" element={<ClientSettings />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/premium" element={<ClientPremium />} />
        <Route path="/packages" element={<ClientPackages />} />

        <Route path="/budget" element={<ClientBudget />} />
        <Route path="/backups" element={<ClientBackups />} />
        <Route path="/milestone" element={<ClientMilestones />} />
        <Route path="/time-tracking" element={<ClientTimeTracking />} />


        {/* <Route path="/packages/:id" element={<ClientPackageDetail />} /> */}
        {/* <Route path="/packages/:id/customize" element={<ClientPackageCustomize />} /> */}
      </Routes>
    </ClientLayout>
  )
}