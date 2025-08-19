import { Routes, Route } from 'react-router-dom'
import { ClientLayout } from '@/components/layouts/ClientLayout'
import { cn } from '@/lib/utils'
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
// import ClientPackageDetail from './ClientPackageDetail'
// import  ClientPackageCustomize from './ClientPackageCustomize'

export function ClientDashboard() {
  return (
    <ClientLayout className="bg-gradient-to-b from-background to-muted/20">
      <Routes className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <Route path="/" element={<ClientDashboardOverview />} />
        <Route path="/projects" element={<ClientProjects />} className="transition-all duration-300 hover:bg-primary/10 rounded-lg" />
        <Route path="/projects/:id" element={<ClientProjectDetail />} className="transition-all duration-300 hover:bg-primary/10 rounded-lg" />
        <Route path="/add-project" element={<AddProject />} className="transition-all duration-300 hover:bg-primary/10 rounded-lg" />
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
        {/* <Route path="/packages/:id" element={<ClientPackageDetail />} /> */}
        {/* <Route path="/packages/:id/customize" element={<ClientPackageCustomize />} /> */}
      </Routes>
    </ClientLayout>
  )
}