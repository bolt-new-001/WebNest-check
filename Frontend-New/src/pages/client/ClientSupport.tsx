import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  LifeBuoy,
  MessageSquare,
  Ticket,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  Check,
  X,
  Loader2,
  Code
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Button
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea
} from '@/components/ui/form'
import { clientApi } from '@/lib/api'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  priority: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function ClientSupport() {
  const [selectedTab, setSelectedTab] = useState('tickets')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)

  const { 
    data: tickets,
    isLoading: ticketsLoading,
    error: ticketsError
  } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: () => clientApi.getSupportTickets(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      toast.error('Error loading tickets: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  })

  useEffect(() => {
    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError)
      toast.error('Error loading tickets: ' + (ticketsError instanceof Error ? ticketsError.message : 'Unknown error'))
    }
  }, [ticketsError])

  const { 
    data: articles,
    isLoading: articlesLoading,
    error: articlesError
  } = useQuery<Article[]>({
    queryKey: ['support-articles'],
    queryFn: () => Promise.resolve([]),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      toast.error('Error loading articles: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  })

  const { 
    data: faqs,
    isLoading: faqsLoading,
    error: faqsError
  } = useQuery<FAQ[]>({
    queryKey: ['support-faqs'],
    queryFn: () => Promise.resolve([]),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      toast.error('Error loading FAQs: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  })

  const createTicketMutation = useMutation({
    mutationFn: (data) => clientApi.createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setIsCreatingTicket(false)
    },
  })

  useEffect(() => {
    if (createTicketMutation.isError) {
      console.error('Error creating ticket:', createTicketMutation.error)
      toast.error(createTicketMutation.error instanceof Error ? createTicketMutation.error.message : 'Failed to create ticket')
    }
  }, [createTicketMutation.isError, createTicketMutation.error])

  useEffect(() => {
    if (createTicketMutation.isSuccess) {
      toast.success('Your support ticket has been created.')
    } else if (createTicketMutation.isError) {
      toast.error(createTicketMutation.error instanceof Error ? createTicketMutation.error.message : 'Failed to create support ticket')
    }
  }, [createTicketMutation.isSuccess, createTicketMutation.isError, createTicketMutation.error])

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => clientApi.addTicketMessage(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })

  useEffect(() => {
    if (updateTicketMutation.isError) {
      console.error('Error updating ticket:', updateTicketMutation.error)
      toast.error(updateTicketMutation.error instanceof Error ? updateTicketMutation.error.message : 'Failed to update ticket')
    }
  }, [updateTicketMutation.isError, updateTicketMutation.error])

  useEffect(() => {
    if (updateTicketMutation.isSuccess) {
      toast.success('Your ticket status has been updated.')
    } else if (updateTicketMutation.isError) {
      toast.error(updateTicketMutation.error instanceof Error ? updateTicketMutation.error.message : 'Failed to update ticket status')
    }
  }, [updateTicketMutation.isSuccess, updateTicketMutation.isError, updateTicketMutation.error])

  const getTicketStatus = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      open: { color: 'bg-yellow-500', text: 'Open' },
      pending: { color: 'bg-blue-500', text: 'Pending' },
      resolved: { color: 'bg-green-500', text: 'Resolved' },
      closed: { color: 'bg-gray-500', text: 'Closed' },
      escalated: { color: 'bg-red-500', text: 'Escalated' }
    }
    return statusMap[status] || statusMap['open']
  }

  const getArticleCategory = (category: string) => {
    const categoryMap: Record<string, { color: string; text: string }> = {
      general: { color: 'bg-blue-500', text: 'General' },
      technical: { color: 'bg-purple-500', text: 'Technical' },
      billing: { color: 'bg-green-500', text: 'Billing' },
      account: { color: 'bg-yellow-500', text: 'Account' },
      other: { color: 'bg-gray-500', text: 'Other' }
    }
    return categoryMap[category] || categoryMap['other']
  }

  const formatDistanceToNow = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return `${seconds}s ago`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Support Center</h1>
          <Button
            variant="default"
            onClick={() => setIsCreatingTicket(true)}
            disabled={isCreatingTicket}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {isCreatingTicket ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'New Ticket'
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <InputGroup>
            <Input
              placeholder="Search support center..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </InputGroup>
        </div>
      </div>


      {isCreatingTicket && (
        <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Please provide details about your issue
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                subject: e.currentTarget.subject.value,
                description: e.currentTarget.description.value,
                category: e.currentTarget.category.value,
                priority: e.currentTarget.priority.value
              };
              createTicketMutation.mutate(formData);
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Briefly describe your issue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Provide detailed information about the issue"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Technical Issue
                        </div>
                      </SelectItem>
                      <SelectItem value="billing">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Billing
                        </div>
                      </SelectItem>
                      <SelectItem value="account">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Account
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <MoreHorizontal className="h-4 w-4" />
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-500" />
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-yellow-500" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-orange-500" />
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-red-500" />
                          Urgent
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createTicketMutation.isLoading}
                >
                  {createTicketMutation.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Ticket'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Tabs */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets" className="justify-center">Tickets</TabsTrigger>
            <TabsTrigger value="chat" className="justify-center">Live Chat</TabsTrigger>
            <TabsTrigger value="status" className="justify-center">Status</TabsTrigger>
          </TabsList>

          {/* Support Tickets */}
            <TabsContent value="tickets" className="space-y-4">
              <ScrollArea className="h-[600px] p-4">
                {ticketsLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground">Loading tickets...</p>
                  </div>
                ) : ticketsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-lg font-medium text-red-600">
                      Error loading tickets
                    </h3>
                    <p className="mt-1 text-sm text-red-500">
                      Please try again later.
                    </p>
                  </div>
                ) : Array.isArray(tickets) && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <Card key={ticket.id} className="border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {ticket.subject}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              {ticket.category}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className={getTicketStatus(ticket.status).color}>
                            {getTicketStatus(ticket.status).text}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => setSelectedTicket(ticket.id)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {ticket.status === 'open' && (
                              <DropdownMenuItem onClick={() => updateTicketMutation.mutate({ id: ticket.id, status: 'resolved' })}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Resolved
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => updateTicketMutation.mutate({ id: ticket.id, status: 'closed' })}>
                              <X className="mr-2 h-4 w-4" />
                              Close Ticket
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-muted-foreground">
                            Created {formatDistanceToNow(new Date(ticket.createdAt))}
                          </p>
                          <p className="font-medium">
                            #{ticket.id.substring(0, 8)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No tickets yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first support ticket
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

        {/* Live Chat */}
          <TabsContent value="chat" className="space-y-4">
            <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Live Chat</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Chat with our support team in real-time
                  </p>
                </div>
              </div>
              <div className="border-t p-4">
                <InputGroup>
                  <Input
                    placeholder="Type your message..."
                    className="w-full"
                  />
                  <Button variant="default">
                    Send
                  </Button>
                </InputGroup>
              </div>
            </div>
          </TabsContent>

          {/* Status */}
          <TabsContent value="status" className="space-y-4">
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold">System Status</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Current status of our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium">
                            API Service
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Core API functionality
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-500">
                          <Check className="mr-2 h-4 w-4 text-white" />
                          Healthy
                        </Badge>
                      </div>
                    </Card>
                    <Card className="border-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium">
                            Database
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Data storage and retrieval
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-500">
                          <Check className="mr-2 h-4 w-4 text-white" />
                          Healthy
                        </Badge>
                      </div>
                    </Card>
                    <Card className="border-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium">
                            File Storage
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            File upload and storage
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-500">
                          <Check className="mr-2 h-4 w-4 text-white" />
                          Healthy
                        </Badge>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
const formatDistanceToNow = (date) => {
  const now = new Date()
  const diff = now - date

  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diff < minute) return 'just now'
  if (diff < hour) return Math.floor(diff / minute) + ' minutes ago'
  if (diff < day) return Math.floor(diff / hour) + ' hours ago'
  if (diff < week) return Math.floor(diff / day) + ' days ago'
  if (diff < month) return Math.floor(diff / week) + ' weeks ago'
  if (diff < year) return Math.floor(diff / month) + ' months ago'
  return Math.floor(diff / year) + ' years ago'
}
