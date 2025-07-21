import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  MessageSquare,
  Send,
  Search,
  Loader2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
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

export function ClientAIAssistant() {
  const [selectedTab, setSelectedTab] = useState('assistant')
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const { data: projects } = useQuery({
    queryKey: ['client-projects'],
    queryFn: () => clientApi.getClientProjects(),
  })

  const { data: recommendations } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: () => clientApi.getAIAssistantRecommendations(),
  })

  const sendMessageMutation = useMutation({
    mutationFn: (message) => clientApi.sendAIAssistantMessage(message),
    onSuccess: (response) => {
      setMessages([...messages, response])
      setInputMessage('')
    }
  })

  const getAssistantResponse = async (message) => {
    setIsLoading(true)
    try {
      const response = await clientApi.getAIAssistantResponse(message)
      setMessages([...messages, response])
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputMessage('')
    
    getAssistantResponse(inputMessage)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Your intelligent project management assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">WebNest AI</h3>
                <p className="text-sm text-muted-foreground">
                  Your dedicated project management assistant
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList>
          <TabsTrigger value="assistant">Assistant</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Assistant Chat */}
        <TabsContent value="assistant">
          <div className="flex h-[600px] flex-col">
            {/* Chat History */}
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <Card className={`w-[60%] ${
                      message.role === 'user'
                        ? 'bg-blue-500/10 text-blue-700'
                        : 'bg-purple-500/10 text-purple-700'
                    }`}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{message.role === 'user' ? 'You' : 'AI Assistant'}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.timestamp))}
                            </span>
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <InputGroup>
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </InputGroup>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {recommendations?.map((recommendation) => (
                <Card key={recommendation.id}>
                  <CardHeader>
                    <CardTitle>{recommendation.title}</CardTitle>
                    <CardDescription>
                      {recommendation.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {recommendation.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(recommendation.timestamp))}
                        </span>
                      </div>
                      <ButtonGroup>
                        <Button variant="outline" size="sm">
                          <Check className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button variant="outline" size="sm">
                          <X className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {/* Add analytics components here */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Analytics</CardTitle>
                  <CardDescription>Track your interactions with the AI assistant</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add analytics charts and metrics here */}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {/* Add settings components here */}
              <Card>
                <CardHeader>
                  <CardTitle>Assistant Settings</CardTitle>
                  <CardDescription>Configure your AI assistant preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add settings options here */}
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
