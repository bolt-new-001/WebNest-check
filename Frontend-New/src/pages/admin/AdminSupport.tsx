import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  Search, 
  Filter, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  MessageSquare,
  User,
  Tag,
  AlertTriangle,
  Mail,
  Phone,
  ArrowUpRight,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminSupport() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin-support-tickets', { search: searchTerm, status: statusFilter, priority: priorityFilter }],
    queryFn: () => adminApi.get('/api/support/tickets', { 
      params: {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined
      }
    }),
  })

  const updateTicketStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }) => adminApi.put(`/api/support/tickets/${ticketId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] })
      toast.success('Ticket status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update ticket status')
    },
  })

  const replyToTicketMutation = useMutation({
    mutationFn: ({ ticketId, message }) => adminApi.post(`/api/support/tickets/${ticketId}/replies`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] })
      toast.success('Reply sent successfully')
      setReplyMessage('')
      setIsReplyDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to send reply')
    },
  })

  const handleReplySubmit = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message')
      return
    }
    replyToTicketMutation.mutate({ ticketId: selectedTicket._id, message: replyMessage })
  }

  const filteredTickets = tickets?.data?.data || []

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Open</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Low</Badge>
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Medium</Badge>
      case 'high':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">High</Badge>
      case 'urgent':
        return <Badge variant="outline" className="border-red-500 text-red-500">Urgent</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Manage and respond to user support tickets</p>
        </div>
        <Button>
          <HelpCircle className="mr-2 h-4 w-4" />
          Knowledge Base
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
                <CardDescription>
                  Manage and respond to customer support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredTickets.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket, index) => (
                      <motion.div
                        key={ticket._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={ticket.user?.avatar} alt={ticket.user?.name} />
                            <AvatarFallback>
                              {getInitials(ticket.user?.name || 'User')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{ticket.subject}</h3>
                              {ticket.priority === 'urgent' && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <div className="flex items-center text-xs text-gray-500">
                                <User className="h-3 w-3 mr-1" />
                                {ticket.user?.name}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(ticket.createdAt)}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {ticket.replies?.length || 0} replies
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex space-x-2">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setIsReplyDialogOpen(true)
                                }}
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              {ticket.status !== 'in_progress' && (
                                <DropdownMenuItem
                                  onClick={() => updateTicketStatusMutation.mutate({ 
                                    ticketId: ticket._id, 
                                    status: 'in_progress' 
                                  })}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Mark In Progress
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'resolved' && (
                                <DropdownMenuItem
                                  onClick={() => updateTicketStatusMutation.mutate({ 
                                    ticketId: ticket._id, 
                                    status: 'resolved' 
                                  })}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Resolved
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'closed' && (
                                <DropdownMenuItem
                                  onClick={() => updateTicketStatusMutation.mutate({ 
                                    ticketId: ticket._id, 
                                    status: 'closed' 
                                  })}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Close Ticket
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No support tickets found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tab contents would be similar but filtered */}
          <TabsContent value="open" className="mt-0">
            {/* Similar content but filtered for open tickets */}
          </TabsContent>
          <TabsContent value="in_progress" className="mt-0">
            {/* Similar content but filtered for in-progress tickets */}
          </TabsContent>
          <TabsContent value="resolved" className="mt-0">
            {/* Similar content but filtered for resolved tickets */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
              {selectedTicket?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Reply</label>
              <Textarea 
                placeholder="Type your response here..." 
                rows={6}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleReplySubmit} disabled={replyToTicketMutation.isPending}>
                {replyToTicketMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}