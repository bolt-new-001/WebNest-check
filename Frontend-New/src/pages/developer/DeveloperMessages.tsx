import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { developerApi } from '@/lib/api'
import { formatDateTime, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export function DeveloperMessages() {
  const [selectedProject, setSelectedProject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: projects } = useQuery({
    queryKey: ['developer-projects'],
    queryFn: () => developerApi.get('/api/projects'),
  })

  const { data: messages } = useQuery({
    queryKey: ['project-messages', selectedProject],
    queryFn: () => developerApi.get(`/api/chat/project/${selectedProject}`),
    enabled: !!selectedProject,
  })

  const sendMessageMutation = useMutation({
    mutationFn: (data: any) => developerApi.post(`/api/chat/project/${selectedProject}/message`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', selectedProject] })
      setNewMessage('')
      toast.success('Message sent')
    },
    onError: () => {
      toast.error('Failed to send message')
    },
  })

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    sendMessageMutation.mutate({
      content: { text: newMessage },
      messageType: 'text'
    })
  }

  const projectsData = projects?.data?.data || []
  const messagesData = messages?.data?.data || []
  const selectedProjectData = projectsData.find((p: any) => p.projectId?._id === selectedProject)

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Projects Sidebar */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Project Chats</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="space-y-1">
            {projectsData.map((project: any) => (
              <button
                key={project._id}
                onClick={() => setSelectedProject(project.projectId?._id)}
                className={`w-full p-4 text-left hover:bg-gray-50 border-b transition-colors ${
                  selectedProject === project.projectId?._id ? 'bg-purple-50 border-purple-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={project.projectId?.clientId?.avatar} />
                    <AvatarFallback>
                      {getInitials(project.projectId?.clientId?.name || 'Client')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {project.projectId?.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.projectId?.clientId?.name}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {projectsData.length === 0 && (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active projects</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedProject ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedProjectData?.projectId?.clientId?.avatar} />
                    <AvatarFallback>
                      {getInitials(selectedProjectData?.projectId?.clientId?.name || 'Client')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedProjectData?.projectId?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedProjectData?.projectId?.clientId?.name}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messagesData.map((message: any) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderType === 'Developer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === 'Developer' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content?.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderType === 'Developer' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {formatDateTime(message.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {messagesData.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No messages yet</p>
                    <p className="text-sm text-gray-500">Start the conversation with your client</p>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[40px] max-h-32 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Project</h3>
              <p className="text-gray-600">Choose a project to start chatting with your client</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}