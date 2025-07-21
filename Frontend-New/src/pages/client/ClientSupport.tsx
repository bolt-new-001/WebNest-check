import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
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
  X
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

export function ClientSupport() {
  const [selectedTab, setSelectedTab] = useState('tickets')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const { data: tickets } = useQuery({
    queryKey: ['client-support-tickets'],
    queryFn: () => clientApi.getSupportTickets(),
  })

  const { data: articles } = useQuery({
    queryKey: ['support-articles'],
    queryFn: () => clientApi.getSupportArticles(),
  })

  const { data: faqs } = useQuery({
    queryKey: ['support-faqs'],
    queryFn: () => clientApi.getSupportFAQs(),
  })

  const createTicketMutation = useMutation({
    mutationFn: (ticketData) => clientApi.createSupportTicket(ticketData),
    onSuccess: () => {
      // Refresh tickets list
      window.location.reload()
    }
  })

  const updateTicketMutation = useMutation({
    mutationFn: (ticketData) => clientApi.updateSupportTicket(ticketData),
    onSuccess: () => {
      // Refresh tickets list
      window.location.reload()
    }
  })

  const getTicketStatus = (status: string) => {
    const statusMap = {
      open: { color: 'bg-yellow-500', text: 'Open' },
      pending: { color: 'bg-blue-500', text: 'Pending' },
      resolved: { color: 'bg-green-500', text: 'Resolved' },
      closed: { color: 'bg-gray-500', text: 'Closed' },
      escalated: { color: 'bg-red-500', text: 'Escalated' }
    }
    return statusMap[status as keyof typeof statusMap]
  }

  const getArticleCategory = (category: string) => {
    const categoryMap = {
      general: { color: 'bg-blue-500', text: 'General' },
      technical: { color: 'bg-purple-500', text: 'Technical' },
      billing: { color: 'bg-green-500', text: 'Billing' },
      account: { color: 'bg-yellow-500', text: 'Account' },
      other: { color: 'bg-gray-500', text: 'Other' }
    }
    return categoryMap[category as keyof typeof categoryMap]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Support Center</CardTitle>
          <CardDescription>Get help and support for your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <InputGroup>
              <Input
                placeholder="Search support center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </InputGroup>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="articles">Knowledge Base</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        {/* Support Tickets */}
        <TabsContent value="tickets">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {tickets?.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-sm font-medium">{ticket.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          {ticket.category}
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
                        <DropdownMenuItem onClick={() => setSelectedTicket(ticket.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTicketMutation.mutate({ id: ticket.id, status: 'resolved' })}>
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTicketMutation.mutate({ id: ticket.id, status: 'closed' })}>
                          <X className="mr-2 h-4 w-4" />
                          Close Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getTicketStatus(ticket.status).color}>
                          {getTicketStatus(ticket.status).text}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(ticket.createdAt))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          {ticket.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Knowledge Base */}
        <TabsContent value="articles">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {articles?.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getArticleCategory(article.category).color}>
                          {getArticleCategory(article.category).text}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(article.updatedAt))}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Article
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* FAQs */}
        <TabsContent value="faqs">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {faqs?.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <CardTitle>{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        {faq.category}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Live Chat */}
        <TabsContent value="chat">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {/* Add live chat interface here */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our support team in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add chat messages and input here */}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Status */}
        <TabsContent value="status">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {/* Add status updates and system health here */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and maintenance status</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add status indicators and maintenance info here */}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
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
