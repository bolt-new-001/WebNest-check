import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Save, Shield, Mail, Globe, Bell, Lock, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { adminApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

export function AdminSettings() {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const [showApiKey, setShowApiKey] = useState(false)
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminApi.get('/api/admin/settings'),
  })
  
  const { data: apiKeys } = useQuery({
    queryKey: ['admin-api-keys'],
    queryFn: () => adminApi.get('/api/admin/api-keys'),
  })
  
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => adminApi.put('/api/admin/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast.success('Settings updated successfully')
    },
    onError: () => {
      toast.error('Failed to update settings')
    },
  })
  
  const regenerateApiKeyMutation = useMutation({
    mutationFn: () => adminApi.post('/api/admin/api-keys/regenerate'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-api-keys'] })
      toast.success('API key regenerated successfully')
    },
    onError: () => {
      toast.error('Failed to regenerate API key')
    },
  })
  
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      siteName: formData.get('siteName'),
      siteUrl: formData.get('siteUrl'),
      contactEmail: formData.get('contactEmail'),
      enableRegistration: formData.get('enableRegistration') === 'on',
    }
    updateSettingsMutation.mutate(data)
  }
  
  const handleSaveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      emailNotifications: formData.get('emailNotifications') === 'on',
      userSignupAlerts: formData.get('userSignupAlerts') === 'on',
      projectCreationAlerts: formData.get('projectCreationAlerts') === 'on',
      supportTicketAlerts: formData.get('supportTicketAlerts') === 'on',
    }
    updateSettingsMutation.mutate(data)
  }
  
  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      twoFactorAuth: formData.get('twoFactorAuth') === 'on',
      passwordPolicy: formData.get('passwordPolicy'),
      sessionTimeout: formData.get('sessionTimeout'),
    }
    updateSettingsMutation.mutate(data)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your WebNest platform settings</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic settings for your WebNest platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName" 
                      name="siteName" 
                      defaultValue={settings?.data?.data?.siteName || 'WebNest'} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input 
                      id="siteUrl" 
                      name="siteUrl" 
                      defaultValue={settings?.data?.data?.siteUrl || 'https://webnest.com'} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input 
                      id="contactEmail" 
                      name="contactEmail" 
                      type="email" 
                      defaultValue={settings?.data?.data?.contactEmail || 'support@webnest.com'} 
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableRegistration">Enable User Registration</Label>
                    <p className="text-sm text-gray-500">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <Switch 
                    id="enableRegistration" 
                    name="enableRegistration" 
                    defaultChecked={settings?.data?.data?.enableRegistration} 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Update your admin profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input defaultValue={user?.name} disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={user?.email} disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="font-medium">
                        {user?.role === 'owner' ? 'Owner' : 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotificationSettings} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      name="emailNotifications" 
                      defaultChecked={settings?.data?.data?.emailNotifications} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="userSignupAlerts">User Signup Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when new users register
                      </p>
                    </div>
                    <Switch 
                      id="userSignupAlerts" 
                      name="userSignupAlerts" 
                      defaultChecked={settings?.data?.data?.userSignupAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="projectCreationAlerts">Project Creation Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when new projects are created
                      </p>
                    </div>
                    <Switch 
                      id="projectCreationAlerts" 
                      name="projectCreationAlerts" 
                      defaultChecked={settings?.data?.data?.projectCreationAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="supportTicketAlerts">Support Ticket Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when new support tickets are created
                      </p>
                    </div>
                    <Switch 
                      id="supportTicketAlerts" 
                      name="supportTicketAlerts" 
                      defaultChecked={settings?.data?.data?.supportTicketAlerts} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">
                        Require two-factor authentication for admin accounts
                      </p>
                    </div>
                    <Switch 
                      id="twoFactorAuth" 
                      name="twoFactorAuth" 
                      defaultChecked={settings?.data?.data?.twoFactorAuth} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">Password Policy</Label>
                    <select 
                      id="passwordPolicy" 
                      name="passwordPolicy" 
                      className="w-full rounded-md border border-gray-300 p-2"
                      defaultValue={settings?.data?.data?.passwordPolicy || 'medium'}
                    >
                      <option value="low">Low - Minimum 6 characters</option>
                      <option value="medium">Medium - Minimum 8 characters with numbers</option>
                      <option value="high">High - Minimum 10 characters with numbers and symbols</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      name="sessionTimeout" 
                      type="number" 
                      min="5" 
                      defaultValue={settings?.data?.data?.sessionTimeout || '30'} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Admin API Key</Label>
                  <div className="flex">
                    <Input 
                      type={showApiKey ? 'text' : 'password'} 
                      value={apiKeys?.data?.data?.adminApiKey || 'sk_admin_xxxxxxxxxxxxxxxxxxxxx'} 
                      readOnly 
                      className="rounded-r-none" 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-l-none border-l-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    This key provides full access to the admin API. Keep it secure.
                  </p>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => regenerateApiKeyMutation.mutate()}
                  className="mt-2"
                >
                  Regenerate API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}