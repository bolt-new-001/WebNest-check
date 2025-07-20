import { Routes, Route } from 'react-router-dom'
import { ClientLayout } from '@/components/layouts/ClientLayout'
import { ClientOverview } from './ClientOverview'
import { ClientProjects } from './ClientProjects'
import { ClientProjectDetail } from './ClientProjectDetail'
import { ClientFiles } from './ClientFiles'
import { ClientNotifications } from './ClientNotifications'
import { ClientRevisions } from './ClientRevisions'
import { AddProject } from './AddProject'
// import { ClientSupport } from './ClientSupport'
// import { ClientSettings } from './ClientSettings'


export function ClientDashboard() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientOverview />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/projects/:id" element={<ClientProjectDetail />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/files" element={<ClientFiles />} />
        <Route path="/notifications" element={<ClientNotifications />} />
        <Route path="/revisions" element={<ClientRevisions />} />
        {/* <Route path="/support" element={<ClientSupport />} /> */}
        {/* <Route path="/settings" element={<ClientSettings />} /> */}
      </Routes>
    </ClientLayout>
  )
}