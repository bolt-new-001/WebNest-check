import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { clientApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { ProjectSelector } from '@/components/chat/ProjectSelector';

interface Message {
  _id: string;
  content: {
    text: string;
    file?: {
      url: string;
      name: string;
      type: string;
    };
  };
  senderId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  senderType: 'User' | 'Developer';
  createdAt: string;
  isRead: boolean;
}

export function ClientChat() {
  const { projectId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadMessages();
    }
  }, [projectId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await clientApi.getProjectChatMessages(projectId!);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !projectId) return;

    try {
      const response = await clientApi.sendChatMessage(projectId, {
        content: { text: newMessage },
        messageType: 'text'
      });
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-6 bg-gradient-to-b from-background to-muted/20">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 animate-float">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Select a Project to Chat</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">Choose a project to start messaging with the development team.</p>
        <div className="w-full max-w-md">
          <ProjectSelector className="w-full shadow-lg hover:shadow-xl transition-all duration-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-gradient-to-b from-background to-muted/20">
      <div className="flex items-center justify-between p-4 border-b backdrop-blur-sm bg-background/50 shadow-sm">
        <ProjectSelector />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors">
            {messages.length} messages
          </Badge>
        </div>
      </div>

      <div className="flex-1 relative">
        <ScrollArea className="absolute inset-0">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <span className="text-sm text-muted-foreground animate-pulse">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-center">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex items-start gap-3 ${message.senderType === 'User' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderId.avatar} />
                    <AvatarFallback>
                      {message.senderId.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${message.senderType === 'User' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.senderId.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <div
                    className={`mt-1 rounded-lg px-4 py-2.5 shadow-md ${message.senderType === 'User' ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' : 'bg-gradient-to-r from-muted to-muted/80'} hover:scale-[1.02] transition-transform duration-200`}
                  >
                      {message.content.text}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t backdrop-blur-sm bg-background/50 shadow-sm">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-muted/50 border-primary/10 focus:border-primary/20 transition-colors"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim()} 
            className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}