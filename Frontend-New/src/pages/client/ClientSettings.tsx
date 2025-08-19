import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Upload,
  ArrowLeft,
  Settings,
  Bell,
  Palette,
  Globe,
  Shield,
  CreditCard,
  Trash2,
  Save
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { clientApi } from '@/lib/api'

interface UserFormData {
  name: string
  email: string
  phone?: string
  company?: string
}

interface PreferencesFormData {
  currency: string
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  projectUpdates: boolean
  theme: string
  colorMode: 'light' | 'dark' | 'system'
  layout: 'compact' | 'comfortable' | 'spacious'
  autoApproval: boolean
  budgetAlerts: boolean
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function ClientSettings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch user preferences
  const { data: preferences } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: () => clientApi.getPreferences()
  })

  // Profile form
  const profileForm = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || ''
    }
  })

  // Preferences form
  const preferencesForm = useForm<PreferencesFormData>({
    defaultValues: {
      currency: preferences?.currency || 'USD',
      language: preferences?.language || 'en',
      timezone: preferences?.timezone || 'UTC',
      emailNotifications: preferences?.notifications?.email || true,
      pushNotifications: preferences?.notifications?.push || true,
      marketingEmails: preferences?.notifications?.marketing || false,
      projectUpdates: preferences?.notifications?.projectUpdates || true,
      theme: preferences?.theme || 'default',
      colorMode: preferences?.colorMode || 'system',
      layout: preferences?.layout || 'comfortable',
      autoApproval: preferences?.projectPreferences?.autoApproval || false,
      budgetAlerts: preferences?.projectPreferences?.budgetAlerts || true
    }
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UserFormData) => clientApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      toast.error('Failed to update profile')
    }
  })

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (data: PreferencesFormData) => clientApi.updatePreferences(data),
    onSuccess: () => {
      toast.success('Preferences updated successfully')
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
    },
    onError: () => {
      toast.error('Failed to update preferences')
    }
  })

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return clientApi.uploadAvatar(formData)
    },
    onSuccess: () => {
      toast.success('Avatar updated successfully')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      toast.error('Failed to upload avatar')
    }
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => clientApi.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted successfully')
      // Redirect to login or home
      navigate('/login')
    },
    onError: () => {
      toast.error('Failed to delete account')
    }
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadAvatarMutation.mutate(file)
    }
  }

  const onProfileSubmit = (data: UserFormData) => {
    updateProfileMutation.mutate(data)
  }

  const onPreferencesSubmit = (data: PreferencesFormData) => {
    updatePreferencesMutation.mutate(data)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteAccountMutation.mutate()
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/client/profile')} className="hover:bg-primary/10 transition-colors duration-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 p-1 bg-muted/50 backdrop-blur-sm rounded-xl shadow-inner">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Picture
                </CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                        <Upload className="h-4 w-4" />
                        <span>Upload new image</span>
                      </div>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...profileForm.register('name', { required: 'Name is required' })}
                        placeholder="Enter your full name"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register('email', { required: 'Email is required' })}
                        placeholder="Enter your email"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...profileForm.register('phone')}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        {...profileForm.register('company')}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:bg-muted/50 hover:shadow-inner">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    {...preferencesForm.register('emailNotifications')}
                    defaultChecked={preferences?.notifications?.email}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    {...preferencesForm.register('pushNotifications')}
                    defaultChecked={preferences?.notifications?.push}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about project status changes</p>
                  </div>
                  <Switch
                    {...preferencesForm.register('projectUpdates')}
                    defaultChecked={preferences?.notifications?.projectUpdates}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                  </div>
                  <Switch
                    {...preferencesForm.register('marketingEmails')}
                    defaultChecked={preferences?.notifications?.marketing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Theme & Appearance
                </CardTitle>
                <CardDescription>Customize how the interface looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label>Color Mode</Label>
                  <Select defaultValue={preferences?.colorMode || 'system'} className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Layout Density</Label>
                  <Select defaultValue={preferences?.layout || 'comfortable'} className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Theme</Label>
                  <Select defaultValue={preferences?.theme || 'default'} className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  General Preferences
                </CardTitle>
                <CardDescription>Configure your general preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Currency</Label>
                    <Select defaultValue={preferences?.currency || 'USD'} className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Language</Label>
                    <Select defaultValue={preferences?.language || 'en'} className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-approve Projects</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve projects within budget</p>
                  </div>
                  <Switch
                    {...preferencesForm.register('autoApproval')}
                    defaultChecked={preferences?.projectPreferences?.autoApproval}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
                  </div>
                  <Switch
                    {...preferencesForm.register('budgetAlerts')}
                    defaultChecked={preferences?.projectPreferences?.budgetAlerts}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Account Security
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:bg-muted/50 hover:shadow-inner group/item">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-600 mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={deleteAccountMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

