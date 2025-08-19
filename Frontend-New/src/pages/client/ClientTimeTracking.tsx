import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, BarChart2, Users, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSession {
  id: string;
  projectId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  task: string;
  developer: {
    name: string;
    avatar: string;
  };
}

export default function ClientTimeTracking() {
  const [selectedProject, setSelectedProject] = React.useState('');
  const [timeSessions, setTimeSessions] = React.useState<TimeSession[]>([
    {
      id: '1',
      projectId: 'proj1',
      startTime: '2024-01-20T09:00:00Z',
      endTime: '2024-01-20T12:30:00Z',
      duration: 3.5,
      task: 'Frontend Development',
      developer: {
        name: 'John Doe',
        avatar: '/avatars/john.jpg'
      }
    },
    {
      id: '2',
      projectId: 'proj1',
      startTime: '2024-01-20T14:00:00Z',
      endTime: '2024-01-20T17:00:00Z',
      duration: 3,
      task: 'API Integration',
      developer: {
        name: 'Jane Smith',
        avatar: '/avatars/jane.jpg'
      }
    }
  ]);

  const totalHours = timeSessions.reduce((acc, session) => acc + session.duration, 0);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Monitor project time and developer activity</p>
        </div>
        <Select
          value={selectedProject}
          onValueChange={setSelectedProject}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="proj1">E-commerce Website</SelectItem>
            <SelectItem value="proj2">Mobile App</SelectItem>
            <SelectItem value="proj3">Dashboard Redesign</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Total Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-sm text-muted-foreground">Tracked this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Active Days</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">Days with activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Active Developers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Working this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{session.task}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(session.startTime)} - {session.endTime ? formatTime(session.endTime) : 'Ongoing'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{session.developer.name}</p>
                    <p className="text-sm text-muted-foreground">{session.duration}h tracked</p>
                  </div>
                  {!session.endTime ? (
                    <Button variant="outline" size="icon">
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}