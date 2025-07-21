import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Users, 
  Chat,
  Video,
  Phone,
  Code2,
  FileText,
  Share2,
  Plus,
  Search,
  UserPlus,
  UserMinus,
  MessageSquare,
  Bell,
  Check,
  X,
  ChevronDown,
  ChevronUp
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
import { clientApi } from '@/lib/api'
import { useState } from 'react'

export function ClientCollaboration() {
  const [selectedTab, setSelectedTab] = useState('team')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)

  const { data: teamMembers } = useQuery({
    queryKey: ['client-team-members'],
    queryFn: () => clientApi.getTeamMembers(),
  })

  const { data: activeSessions } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: () => clientApi.getActiveSessions(),
  })

  const { data: recentFiles } = useQuery({
    queryKey: ['recent-files'],
    queryFn: () => clientApi.getRecentFiles(),
  })

  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) => clientApi.inviteTeamMember(email),
    onSuccess: () => {
      // Refresh team members list
      window.location.reload()
    }
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => clientApi.removeTeamMember(userId),
    onSuccess: () => {
      // Refresh team members list
      window.location.reload()
    }
  })

  const getMemberStatus = (status: string) => {
    const statusMap = {
      online: { color: 'bg-green-500', text: 'Online' },
      offline: { color: 'bg-gray-500', text: 'Offline' },
      busy: { color: 'bg-yellow-500', text: 'Busy' },
      away: { color: 'bg-orange-500', text: 'Away' }
    }
    return statusMap[status as keyof typeof statusMap]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Hub</CardTitle>
          <CardDescription>Manage your team and collaborate in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <InputGroup>
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </InputGroup>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="team" className="w-full">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Team Members */}
        <TabsContent value="team">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {teamMembers?.map((member) => (
                <Card key={member.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200" />
                      <div>
                        <CardTitle className="text-sm font-medium">{member.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          {member.role}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => setSelectedMember(member.id)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Promote
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeMemberMutation.mutate(member.id)}>
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getMemberStatus(member.status).color}>
                        {getMemberStatus(member.status).text}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Chat className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="mr-2 h-4 w-4" />
                        Video
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Active Sessions */}
        <TabsContent value="sessions">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {activeSessions?.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle>{session.name}</CardTitle>
                    <CardDescription>
                      {session.type} session with {session.participants.length} participants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {session.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(session.startTime))} ago
                        </span>
                      </div>
                      <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Join Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Recent Files */}
        <TabsContent value="files">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {recentFiles?.map((file) => (
                <Card key={file.id}>
                  <CardHeader>
                    <CardTitle>{file.name}</CardTitle>
                    <CardDescription>
                      {file.type} • {formatFileSize(file.size)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {file.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(file.uploadedAt))}
                        </span>
                      </div>
                      <ButtonGroup>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {notifications?.map((notification) => (
                <Card key={notification.id}>
                  <CardHeader>
                    <CardTitle>{notification.title}</CardTitle>
                    <CardDescription>
                      {notification.message}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`bg-${notification.type}-100 text-${notification.type}-700`}>
                          {notification.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.timestamp))}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
