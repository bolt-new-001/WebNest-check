import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Link2,
  Globe,
  Code2,
  Database,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search
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

export function ClientIntegrations() {
  const [selectedTab, setSelectedTab] = useState('available')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const { data: availableIntegrations } = useQuery({
    queryKey: ['available-integrations'],
    queryFn: () => clientApi.getAvailableIntegrations(),
  })

  const { data: activeIntegrations } = useQuery({
    queryKey: ['active-integrations'],
    queryFn: () => clientApi.getActiveIntegrations(),
  })

  const { data: webhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => clientApi.getWebhooks(),
  })

  const { data: apiKeys } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => clientApi.getAPIKeys(),
  })

  const connectIntegrationMutation = useMutation({
    mutationFn: (integrationId) => clientApi.connectIntegration(integrationId),
    onSuccess: () => {
      // Refresh integrations list
      window.location.reload()
    }
  })

  const disconnectIntegrationMutation = useMutation({
    mutationFn: (integrationId) => clientApi.disconnectIntegration(integrationId),
    onSuccess: () => {
      // Refresh integrations list
      window.location.reload()
    }
  })

  const getIntegrationType = (type: string) => {
    const typeMap = {
      auth: { color: 'bg-blue-500', text: 'Authentication' },
      storage: { color: 'bg-green-500', text: 'Storage' },
      analytics: { color: 'bg-purple-500', text: 'Analytics' },
      communication: { color: 'bg-yellow-500', text: 'Communication' },
      automation: { color: 'bg-pink-500', text: 'Automation' }
    }
    return typeMap[type as keyof typeof typeMap]
  }

  const getIntegrationStatus = (status: string) => {
    const statusMap = {
      connected: { color: 'bg-green-500', text: 'Connected' },
      disconnected: { color: 'bg-gray-500', text: 'Disconnected' },
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      error: { color: 'bg-red-500', text: 'Error' }
    }
    return statusMap[status as keyof typeof statusMap]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Hub</CardTitle>
          <CardDescription>Connect and manage third-party integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <InputGroup>
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </InputGroup>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Available Integrations */}
        <TabsContent value="available">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrations?.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getIntegrationType(integration.type).color}>
                          {getIntegrationType(integration.type).text}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {integration.version}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => connectIntegrationMutation.mutate(integration.id)}
                      >
                        <Link2 className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Active Integrations */}
        <TabsContent value="active">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {activeIntegrations?.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getIntegrationStatus(integration.status).color}>
                          {getIntegrationStatus(integration.status).text}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {integration.version}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={(checked) => {
                              // Handle integration toggle
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={() => disconnectIntegrationMutation.mutate(integration.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Disconnect
                          </Button>
                        </div>
                        <Button variant="outline">
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {webhooks?.map((webhook) => (
                <Card key={webhook.id}>
                  <CardHeader>
                    <CardTitle>{webhook.name}</CardTitle>
                    <CardDescription>
                      {webhook.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {webhook.event}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          {webhook.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={webhook.enabled}
                            onCheckedChange={(checked) => {
                              // Handle webhook toggle
                            }}
                          />
                          <Button variant="outline">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                        <Button variant="outline">
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* API */}
        <TabsContent value="api">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {apiKeys?.map((apiKey) => (
                <Card key={apiKey.id}>
                  <CardHeader>
                    <CardTitle>{apiKey.name}</CardTitle>
                    <CardDescription>
                      {apiKey.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {apiKey.type}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          {apiKey.scope}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={apiKey.enabled}
                            onCheckedChange={(checked) => {
                              // Handle API key toggle
                            }}
                          />
                          <Button variant="outline">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Revoke
                          </Button>
                        </div>
                        <Button variant="outline">
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Key
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>Configure integration preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="autoConnect" />
                      <Label htmlFor="autoConnect">Auto-connect new integrations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Enable integration notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="logging" />
                      <Label htmlFor="logging">Enable integration logging</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>Configure API preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="rateLimiting" />
                      <Label htmlFor="rateLimiting">Enable rate limiting</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="apiLogging" />
                      <Label htmlFor="apiLogging">Enable API logging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="apiNotifications" />
                      <Label htmlFor="apiNotifications">Enable API notifications</Label>
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
