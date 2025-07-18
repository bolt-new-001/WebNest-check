import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Send, 
  Users, 
  UserCog, 
  Globe, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Trash2,
  Filter,
  Search,
  Plus,
  X,
  MessageSquare,
  Mail
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { adminApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminNotifications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    audience: 'all',
    sendEmail: false,
    sendPush: true,
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['admin-notifications', { search: searchTerm, type: typeFilter }],
    queryFn: () => adminApi.get('/api/notifications', { 
      params: {
        search: searchTerm || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined 
      }
    }),
  })

  const sendNotificationMutation = useMutation({
    mutationFn: (data: typeof newNotification) => adminApi.post('/api/notifications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      toast.success('Notification sent successfully')
      setIsCreateDialogOpen(false)
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        audience: 'all',
        sendEmail: false,
        sendPush: true,
      })
    },
    onError: () => {
      toast.error('Failed to send notification')
    },
  })

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => adminApi.delete(`/api/notifications/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      toast.success('Notification deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete notification')
    },
  })

  const filteredNotifications = notifications?.data?.data || []

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'info', label: 'Information' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
  ]

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'clients', label: 'Clients Only' },
    { value: 'developers', label: 'Developers Only' },
    { value: 'premium', label: 'Premium Users' },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'clients':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'developers':
        return <UserCog className="h-5 w-5 text-purple-500" />
      case 'premium':
        return <Users className="h-5 w-5 text-yellow-500" />
      default:
        return <Globe className="h-5 w-5 text-gray-500" />
    }
  }

  const handleSendNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    sendNotificationMutation.mutate(newNotification)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-600">Manage and send notifications to platform users</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send New Notification</DialogTitle>
              <DialogDescription>
                Create and send a notification to platform users
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="Notification title" 
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Notification message" 
                  rows={4}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  >
                    <option value="info">Information</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Audience</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={newNotification.audience}
                    onChange={(e) => setNewNotification({...newNotification, audience: e.target.value})}
                  >
                    {audienceOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <label className="text-sm font-medium">Send Email</label>
                  </div>
                  <Switch 
                    checked={newNotification.sendEmail}
                    onCheckedChange={(checked) => setNewNotification({...newNotification, sendEmail: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <label className="text-sm font-medium">Send Push Notification</label>
                  </div>
                  <Switch 
                    checked={newNotification.sendPush}
                    onCheckedChange={(checked) => setNewNotification({...newNotification, sendPush: checked})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification} disabled={sendNotificationMutation.isPending}>
                {sendNotificationMutation.isPending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search notifications..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filter:</span>
          <select
            className="rounded-md border border-gray-300 py-1 pl-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
        
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-red-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <Bell className="h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first notification to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification: any) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <Badge variant={notification.type === 'error' ? 'destructive' : 
                              notification.type === 'warning' ? 'warning' : 
                              notification.type === 'success' ? 'success' : 'default'}
                            >
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getAudienceIcon(notification.audience)}
                              <span>
                                {audienceOptions.find(o => o.value === notification.audience)?.label || 'All Users'}
                              </span>
                            </div>
                            {notification.sendEmail && (
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>Email</span>
                              </div>
                            )}
                            {notification.sendPush && (
                              <div className="flex items-center space-x-1">
                                <Bell className="h-3 w-3" />
                                <span>Push</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="sr-only">Open menu</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                            >
                              <path
                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => deleteNotificationMutation.mutate(notification.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}