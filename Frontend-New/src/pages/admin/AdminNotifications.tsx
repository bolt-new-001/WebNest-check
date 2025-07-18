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
                    <option