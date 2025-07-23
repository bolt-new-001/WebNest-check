import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FolderOpen,
  MessageSquare,
  Clock,
  User,
  BadgeCheck,
} from 'lucide-react';

interface ProjectChat {
  _id: string;
  name: string;
  lastMessage: {
    content: string;
    timestamp: string;
    sender: {
      name: string;
      avatar: string;
    };
  };
  unreadCount: number;
}

export function ChatSidebar() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['userProjects'],
    queryFn: () => clientApi.getUserProjects(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Project Chats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {projects?.map((project: any) => (
            <Button
              key={project._id}
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <a href={`/client/chat/${project._id}`} className="flex items-center w-full">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <span className="flex-1 truncate">{project.name}</span>
                  {project.unreadCount > 0 && (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground truncate">
                    {project.lastMessage?.content}
                  </span>
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </div>
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
