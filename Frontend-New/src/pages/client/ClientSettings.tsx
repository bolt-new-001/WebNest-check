import React, { useEffect } from 'react'
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
import { Separator } from '@/components/ui/separator'
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
  Save,
  Check,
  AlertTriangle,
  Lock,
  Smartphone,
  Mail,
  Eye,
  Download,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { clientApi } from '@/lib/api'

interface UserFormData {
  name: string
  email: string
  phone?: string
  company?: string
  bio?: string
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
  weeklyDigest: boolean
  soundEffects: boolean
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
  const { user, refreshUser } = useAuth()
  const queryClient = useQueryClient()

  // Fetch user preferences
  const { data: preferences, refetch: refetchPreferences } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: () => clientApi.getPreferences(),
    staleTime: 0, // Always fetch fresh data
  })

  // Profile form
  const profileForm = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      bio: user?.bio || ''
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
      budgetAlerts: preferences?.projectPreferences?.budgetAlerts || true,
      weeklyDigest: preferences?.notifications?.weeklyDigest || true,
      soundEffects: preferences?.soundEffects || true
    }
  })

  // Reset forms when data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        bio: user.bio || ''
      })
    }
  }, [user, profileForm])

  useEffect(() => {
    if (preferences) {
      preferencesForm.reset({
        currency: preferences.currency || 'USD',
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'UTC',
        emailNotifications: preferences.notifications?.email || true,
        pushNotifications: preferences.notifications?.push || true,
        marketingEmails: preferences.notifications?.marketing || false,
        projectUpdates: preferences.notifications?.projectUpdates || true,
        theme: preferences.theme || 'default',
        colorMode: preferences.colorMode || 'system',
        layout: preferences.layout || 'comfortable',
        autoApproval: preferences.projectPreferences?.autoApproval || false,
        budgetAlerts: preferences.projectPreferences?.budgetAlerts || true,
        weeklyDigest: preferences.notifications?.weeklyDigest || true,
        soundEffects: preferences.soundEffects || true
      })
    }
  }, [preferences, preferencesForm])

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UserFormData) => clientApi.updateProfile(data),
    onSuccess: async () => {
      toast.success('Profile updated successfully')
      // Refresh user data immediately
      await refreshUser?.()
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.refetchQueries({ queryKey: ['user'] })
    },
    onError: () => {
      toast.error('Failed to update profile')
    }
  })

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (data: PreferencesFormData) => clientApi.updatePreferences(data),
    onSuccess: async () => {
      toast.success('Preferences updated successfully')
      // Refresh preferences immediately
      await refetchPreferences()
      await queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
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
    onSuccess: async () => {
      toast.success('Avatar updated successfully')
      await refreshUser?.()
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.refetchQueries({ queryKey: ['user'] })
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
      navigate('/login')
    },
    onError: () => {
      toast.error('Failed to delete account')
    }
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
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

  // Notification settings with hover effects
  const NotificationSetting = ({
    title,
    description,
    name,
    defaultChecked = false
  }: {
    title: string
    description: string
    name: keyof PreferencesFormData
    defaultChecked?: boolean
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-muted/50 hover:shadow-md hover:border-primary/20 group">
      <div className="space-y-1 flex-1">
        <Label className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
          {description}
        </p>
      </div>
      <Switch
        {...preferencesForm.register(name)}
        defaultChecked={defaultChecked}
        className="ml-4"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ScrollArea className="h-full">
        <div className="container mx-auto py-6 space-y-8 max-w-7xl">
          {/* Enhanced Header */}
          <div className="flex items-center gap-4 pb-6 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/client/profile')}
              className="h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Manage your account settings, preferences, and security options
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Account Verified
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            {/* Enhanced Tab Navigation */}
            <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-lg rounded-2xl border shadow-lg p-2">
              <TabsList className="grid w-full grid-cols-5 gap-1 bg-transparent">
                <TabsTrigger
                  value="profile"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Profile</span>
                  </div>

                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-medium">Notifications</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span className="text-sm font-medium">Appearance</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">Preferences</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Security</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab - Enhanced */}
            <TabsContent value="profile" className="space-y-6">
              {/* Profile Picture Section */}
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Profile Picture</CardTitle>
                      <CardDescription>Update your profile photo and personal avatar</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 ring-4 ring-offset-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-105">
                        <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover" />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                          {user?.name ? getInitials(user.name) : <User className="h-8 w-8" />}
                        </AvatarFallback>
                      </Avatar>
                      {uploadAvatarMutation.isPending && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="avatar" className="cursor-pointer">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary font-medium rounded-lg transition-all duration-300 border border-primary/20 hover:border-primary/30">
                            <Upload className="h-4 w-4" />
                            Choose New Photo
                          </div>
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                          disabled={uploadAvatarMutation.isPending}
                        />
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>• Recommended size: 400x400px or larger</p>
                        <p>• Supported formats: JPG, PNG, GIF</p>
                        <p>• Maximum file size: 2MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information Section */}
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Personal Information</CardTitle>
                      <CardDescription>Manage your personal details and contact information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          {...profileForm.register('name', { required: 'Name is required' })}
                          placeholder="Enter your full name"
                          className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                        />
                        {profileForm.formState.errors.name && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {profileForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register('email', { required: 'Email is required' })}
                          placeholder="Enter your email"
                          className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                        />
                        {profileForm.formState.errors.email && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          {...profileForm.register('phone')}
                          placeholder="Enter your phone number"
                          className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                        <Input
                          id="company"
                          {...profileForm.register('company')}
                          placeholder="Enter your company name"
                          className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        {...profileForm.register('bio')}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-muted-foreground/20"
                      />
                    </div>

                    <Separator />

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Saving Changes...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Notification Preferences</CardTitle>
                      <CardDescription>Control how and when you receive notifications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Email Notifications Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Email Notifications</h3>
                    </div>
                    <div className="space-y-3 pl-7">
                      <NotificationSetting
                        title="Email Notifications"
                        description="Receive general notifications via email"
                        name="emailNotifications"
                        defaultChecked={preferences?.notifications?.email}
                      />
                      <NotificationSetting
                        title="Project Updates"
                        description="Get notified about project status changes and milestones"
                        name="projectUpdates"
                        defaultChecked={preferences?.notifications?.projectUpdates}
                      />
                      <NotificationSetting
                        title="Marketing Emails"
                        description="Receive promotional content, tips, and feature announcements"
                        name="marketingEmails"
                        defaultChecked={preferences?.notifications?.marketing}
                      />
                      <NotificationSetting
                        title="Weekly Digest"
                        description="Get a weekly summary of your account activity"
                        name="weeklyDigest"
                        defaultChecked={preferences?.notifications?.weeklyDigest}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Push Notifications Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Push Notifications</h3>
                    </div>
                    <div className="space-y-3 pl-7">
                      <NotificationSetting
                        title="Browser Notifications"
                        description="Receive real-time notifications in your browser"
                        name="pushNotifications"
                        defaultChecked={preferences?.notifications?.push}
                      />
                      <NotificationSetting
                        title="Sound Effects"
                        description="Play sound when receiving notifications"
                        name="soundEffects"
                        defaultChecked={preferences?.soundEffects}
                      />
                    </div>
                  </div>

                  <Separator />

                  <Button
                    onClick={preferencesForm.handleSubmit(onPreferencesSubmit)}
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    disabled={updatePreferencesMutation.isPending}
                  >
                    {updatePreferencesMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Saving Preferences...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Notification Preferences
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Appearance Settings</CardTitle>
                      <CardDescription>Customize the look and feel of your interface</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Theme Mode</Label>
                      <Select defaultValue={preferences?.colorMode || 'system'}>
                        <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">🌞 Light Mode</SelectItem>
                          <SelectItem value="dark">🌙 Dark Mode</SelectItem>
                          <SelectItem value="system">💻 System Default</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Layout Density</Label>
                      <Select defaultValue={preferences?.layout || 'comfortable'}>
                        <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">📱 Compact</SelectItem>
                          <SelectItem value="comfortable">🖥️ Comfortable</SelectItem>
                          <SelectItem value="spacious">📺 Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">Adjust spacing and element sizes</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Color Theme</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'default', name: 'Default', color: 'bg-blue-500' },
                        { value: 'green', name: 'Green', color: 'bg-green-500' },
                        { value: 'purple', name: 'Purple', color: 'bg-purple-500' },
                        { value: 'orange', name: 'Orange', color: 'bg-orange-500' }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${preferences?.theme === theme.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${theme.color} shadow-md`} />
                          <span className="text-sm font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Choose your preferred accent color</p>
                  </div>

                  <Separator />

                  <Button
                    onClick={preferencesForm.handleSubmit(onPreferencesSubmit)}
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    disabled={updatePreferencesMutation.isPending}
                  >
                    {updatePreferencesMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Applying Changes...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Apply Appearance Settings
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">General Preferences</CardTitle>
                      <CardDescription>Configure your regional and workflow preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Regional Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Regional Settings
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3 pl-7">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Currency</Label>
                        <Select defaultValue={preferences?.currency || 'USD'}>
                          <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">🇺🇸 USD ($)</SelectItem>
                            <SelectItem value="EUR">🇪🇺 EUR (€)</SelectItem>
                            <SelectItem value="GBP">🇬🇧 GBP (£)</SelectItem>
                            <SelectItem value="INR">🇮🇳 INR (₹)</SelectItem>
                            <SelectItem value="CAD">🇨🇦 CAD (C$)</SelectItem>
                            <SelectItem value="AUD">🇦🇺 AUD (A$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Language</Label>
                        <Select defaultValue={preferences?.language || 'en'}>
                          <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="es">🇪🇸 Español</SelectItem>
                            <SelectItem value="fr">🇫🇷 Français</SelectItem>
                            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                            <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                            <SelectItem value="pt">🇵🇹 Português</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Timezone</Label>
                        <Select defaultValue={preferences?.timezone || 'UTC'}>
                          <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                            <SelectItem value="Asia/Kolkata">India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Project Management */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Project Management
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-muted/50 hover:shadow-md hover:border-primary/20 group">
                        <div className="space-y-1 flex-1">
                          <Label className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            Auto-approve Projects
                          </Label>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
                            Automatically approve projects that are within your predefined budget limits
                          </p>
                        </div>
                        <Switch
                          {...preferencesForm.register('autoApproval')}
                          defaultChecked={preferences?.projectPreferences?.autoApproval}
                          className="ml-4"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-muted/50 hover:shadow-md hover:border-primary/20 group">
                        <div className="space-y-1 flex-1">
                          <Label className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            Budget Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
                            Receive notifications when projects approach or exceed budget thresholds
                          </p>
                        </div>
                        <Switch
                          {...preferencesForm.register('budgetAlerts')}
                          defaultChecked={preferences?.projectPreferences?.budgetAlerts}
                          className="ml-4"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    onClick={preferencesForm.handleSubmit(onPreferencesSubmit)}
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    disabled={updatePreferencesMutation.isPending}
                  >
                    {updatePreferencesMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Saving Preferences...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Preferences
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Security Tab */}
            <TabsContent value="security" className="space-y-6">
              {/* Account Security */}
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Account Security</CardTitle>
                      <CardDescription>Manage your account security and authentication settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Password */}
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-card to-card/80 transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">Password</h4>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => navigate('/client/settings/change-password')}
                    >
                      Change Password
                    </Button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-card to-card/80 transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                        <Smartphone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">Two-Factor Authentication</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => navigate('/client/settings/two-factor-auth')}
                    >
                      Manage 2FA
                    </Button>
                  </div>

                  {/* Active Sessions */}
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-card to-card/80 transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">Active Sessions</h4>
                        <p className="text-sm text-muted-foreground">Monitor and manage your active sessions</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => navigate('/client/settings/sessions')}
                    >
                      View Sessions
                    </Button>
                  </div>

                  {/* Login History */}
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-card to-card/80 transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                        <Download className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">Login History</h4>
                        <p className="text-sm text-muted-foreground">Download your account login activity</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => navigate('/client/settings/login-history')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Data & Privacy</CardTitle>
                      <CardDescription>Control your data and privacy settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-card to-card/80 transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-300">
                        <Download className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">Export Data</h4>
                        <p className="text-sm text-muted-foreground">Download all your account data</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => navigate('/client/settings/export-data')}
                    >
                      Request Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-card to-card/80 transition-all duration-300 hover:shadow-md hover:border-primary/30 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors duration-300">
                        <HelpCircle className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">Privacy Policy</h4>
                        <p className="text-sm text-muted-foreground">Review our privacy policy and terms</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => window.open('/privacy-policy', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="overflow-hidden border-destructive/20 shadow-lg bg-gradient-to-br from-destructive/5 via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-b border-destructive/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                      <CardDescription>Irreversible and destructive actions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-6 border border-destructive/30 rounded-xl bg-gradient-to-r from-destructive/5 to-transparent">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="h-6 w-6 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="font-semibold text-destructive text-lg">Delete Account</h4>
                          <p className="text-muted-foreground mt-1">
                            Once you delete your account, there is no going back. Please be certain.
                            This will permanently delete your account and remove all associated data.
                          </p>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• All your projects and data will be permanently deleted</li>
                            <li>• Your subscription will be cancelled immediately</li>
                            <li>• This action cannot be undone</li>
                          </ul>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={deleteAccountMutation.isPending}
                          className="bg-destructive hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {deleteAccountMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              Deleting Account...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                              Delete Account Permanently
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}