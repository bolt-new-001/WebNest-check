import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { clientApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageSquare,
  Send,
  Paperclip,
  FileText,
  Image,
  Video,
  Mic,
  File,
} from 'lucide-react';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  type: 'text' | 'file' | 'image';
}

export function ChatWindow() {
  const { projectId } = useParams();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['projectMessages', projectId],
    queryFn: () => clientApi.getProjectMessages(projectId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => clientApi.sendProjectMessage(projectId, content),
    onSuccess: () => {
      setMessage('');
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Project Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages?.map((msg: Message) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender._id === localStorage.getItem('userId')
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div className="flex-1 max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.sender.avatar} />
                      <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{msg.sender.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    msg.sender._id === localStorage.getItem('userId')
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Document
            </Button>
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isRecording ? 'Stop Recording' : 'Record Voice'}
            </Button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
