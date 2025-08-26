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


//Setting Page Routes
import ChangePasswordPage from './Settings/password-change'
import { default as TwoFactorAuthPage } from './Settings/TwoFactorAuth'
import ActiveSessions from './Settings/ActiveSessions'
import PublicProfile from './Settings/PublicProfile'



export function ClientDashboard() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboardOverview />} />

        {/* Project Realated Routes */}
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/projects/:id" element={<ClientProjectDetail />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/budget" element={<ClientBudget />} />
        <Route path="/revisions" element={<ClientRevisions />} />


        {/* Files Realated Routes */}
        <Route path="/files" element={<ClientFiles />} />
        <Route path="/backups" element={<ClientBackups />} />


        {/* Chat Realated Routes */}
        <Route path="/chat" element={<ClientChat />} />
        <Route path="/chat/:projectId" element={<ClientChat />} />
        <Route path="/notifications" element={<ClientNotifications />} />


        {/* Profile Realated Routes */}
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/settings" element={<ClientSettings />} />
        <Route path="/support" element={<ClientSupport />} />


        {/* Premium Realated Routes */}
        <Route path="/premium" element={<ClientPremium />} />
        {/* <Route path="/premium/features" element={<ClientPremiumFeatures />} /> */}
        {/* <Route path="/packages/premium" element={<ClientPremiumPackages />} /> */}

        {/* Finance & Billing */}
        {/* <Route path="/billing" element={<ClientBilling />} /> */}
        {/* <Route path="/invoices" element={<ClientInvoices />} /> */}
        {/* <Route path="/transactions" element={<ClientTransactions />} /> */}

      
        {/* Extra Routes  */}
        <Route path="/milestone" element={<ClientMilestones />} />
        <Route path="/time-tracking" element={<ClientTimeTracking />} />
        {/* <Route path="/reports" element={<ClientReports />} /> */}


        {/* Settings Realted Routes */}
        {/* <Route path="/settings/integrations" element={<ClientSettingsIntegrations />} /> */}
        {/* <Route path="/settings/notifications" element={<ClientSettingsNotifications />} /> */}
        {/* <Route path="/settings/privacy" element={<ClientSettingsPrivacy />} /> */}
        {/* <Route path="/settings/security" element={<ClientSettingsSecurity />} /> */}
        {/* <Route path="/settings/notifications" element={<ClientSettingsNotifications />} /> */}
        
        <Route path="/settings/change-password" element={<ChangePasswordPage />} />
        <Route path="/settings/two-factor-auth" element={<TwoFactorAuthPage />} />
        <Route path="/settings/sessions" element={<ActiveSessions />} />
        <Route path="/profile/:id" element={<PublicProfile />} />



        {/* Communication Routes  */}
        {/* <Route path="/chat/groups" element={<ClientChatGroups />} /> */}
        {/* <Route path="/chat/groups/:id" element={<ClientChatGroup />} /> */}
        {/* <Route path="/meetings" element={<ClientMeetings />} /> */}


        {/* Package realeted routes */}
        <Route path="/packages" element={<ClientPackages />} />
        {/* <Route path="/packages/:id" element={<ClientPackageDetail />} /> */}
        {/* <Route path="/packages/:id/customize" element={<ClientPackageCustomize />} /> */}


        {/* Other Routes  */}
        {/* <Route path="/labs" element={<ClientLabs />} /> */}
        {/* <Route path="/new" element={<ClientNew />} /> */}
        {/* <Route path="/upcoming" element={<ClientUpcoming />} /> */}



      </Routes>
    </ClientLayout>
  )
}