import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Settings,
  User,
  Mail,
  Globe,
  Clock,
  CurrencyDollar,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { 
  Button, 
  ButtonGroup 
} from '@/components/ui/button'
import { 
  Badge, 
  BadgeGroup 
} from '@/components/ui/badge'
import { 
  Input, 
  InputGroup 
} from '@/components/ui/input'
import { 
  ScrollArea 
} from '@/components/ui/scroll-area'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Switch 
} from '@/components/ui/switch'
import { 
  Label 
} from '@/components/ui/label'
import { clientApi } from '@/lib/api'
import { useState } from 'react'

export function ClientSettings() {
  const [selectedTab, setSelectedTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const { data: profile } = useQuery({
    queryKey: ['client-profile'],
    queryFn: () => clientApi.getClientProfile(),
  })

  const { data: preferences } = useQuery({
    queryKey: ['client-preferences'],
    queryFn: () => clientApi.getClientPreferences(),
  })

  const { data: notifications } = useQuery({
    queryKey: ['client-notifications'],
    queryFn: () => clientApi.getClientNotificationSettings(),
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data) => clientApi.updateClientProfile(data),
    onSuccess: () => {
      setIsEditing(false)
      // Refresh profile data
      window.location.reload()
    }
  })

  const updatePreferencesMutation = useMutation({
    mutationFn: (data) => clientApi.updateClientPreferences(data),
    onSuccess: () => {
      // Refresh preferences
      window.location.reload()
    }
  })

  const updateNotificationsMutation = useMutation({
    mutationFn: (data) => clientApi.updateNotificationSettings(data),
    onSuccess: () => {
      // Refresh notifications
      window.location.reload()
    }
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    if (selectedTab === 'profile') {
      updateProfileMutation.mutate(formData)
    } else if (selectedTab === 'preferences') {
      updatePreferencesMutation.mutate(formData)
    } else if (selectedTab === 'notifications') {
      updateNotificationsMutation.mutate(formData)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Settings & Preferences</CardTitle>
          <CardDescription>Customize your WebNest experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{profile?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          name="name"
                          value={formData.name || profile?.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          name="email"
                          value={formData.email || profile?.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          name="company"
                          value={formData.company || profile?.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          name="location"
                          value={formData.location || profile?.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={!isEditing}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!isEditing}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avatar & Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="relative h-24 w-24 rounded-full bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Preferences</CardTitle>
                  <CardDescription>Customize your project settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Default Project Type</Label>
                      <Select
                        value={formData.projectType || preferences?.projectType}
                        onValueChange={(value) => handleInputChange({
                          target: { name: 'projectType', value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="mobile">Mobile Development</SelectItem>
                          <SelectItem value="desktop">Desktop Development</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Default Project Budget</Label>
                      <Input
                        name="defaultBudget"
                        value={formData.defaultBudget || preferences?.defaultBudget}
                        onChange={handleInputChange}
                        type="number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>UI Preferences</CardTitle>
                  <CardDescription>Customize your interface settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="darkMode"
                        checked={formData.darkMode || preferences?.darkMode}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'darkMode', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="darkMode">Dark Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={formData.notifications || preferences?.notifications}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'notifications', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="notifications">Enable Notifications</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="email"
                        checked={formData.emailNotifications || notifications?.email}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'emailNotifications', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="email">Email Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="push"
                        checked={formData.pushNotifications || notifications?.push}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'pushNotifications', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="push">Push Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sms"
                        checked={formData.smsNotifications || notifications?.sms}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'smsNotifications', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="sms">SMS Notifications</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Updates</CardTitle>
                  <CardDescription>Get notified about project changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="statusUpdates"
                        checked={formData.statusUpdates || notifications?.statusUpdates}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'statusUpdates', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="statusUpdates">Status Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="milestones"
                        checked={formData.milestones || notifications?.milestones}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'milestones', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="milestones">Milestone Updates</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Unlock className="mr-2 h-4 w-4" />
                      Enable Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Security History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>Manage API keys and access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Generate New API Key
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Revoke API Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your billing details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Payment Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Billing Cycle</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>Customize your invoice preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="digitalInvoices"
                        checked={formData.digitalInvoices || preferences?.digitalInvoices}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'digitalInvoices', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="digitalInvoices">Digital Invoices</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoPay"
                        checked={formData.autoPay || preferences?.autoPay}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'autoPay', type: 'checkbox', checked }
                        })}
                      />
                      <Label htmlFor="autoPay">Auto Payment</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
