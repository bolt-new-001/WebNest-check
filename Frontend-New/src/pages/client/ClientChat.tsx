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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Select a Project to Chat</h2>
        <p className="text-muted-foreground mb-4">Choose a project to start messaging with the development team.</p>
        <ProjectSelector />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between p-4 border-b">
        <ProjectSelector />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.length} messages
          </span>
        </div>
      </div>

      <div className="flex-1 relative">
        <ScrollArea className="absolute inset-0">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center">
                <span className="loading">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No messages yet. Start the conversation!
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
                      className={`mt-1 rounded-lg px-3 py-2 ${message.senderType === 'User' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
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

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}