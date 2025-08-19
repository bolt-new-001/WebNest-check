import React from 'react';
import { motion } from 'framer-motion';
import { Flag, CheckCircle2, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dueDate: string;
  feedback?: string;
}

export default function ClientMilestones() {
  const [milestones, setMilestones] = React.useState<Milestone[]>([
    {
      id: '1',
      title: 'Project Setup & Planning',
      description: 'Initial project setup, requirements gathering, and planning phase',
      progress: 100,
      status: 'completed',
      dueDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Design Phase',
      description: 'UI/UX design, wireframes, and mockups creation',
      progress: 75,
      status: 'in_progress',
      dueDate: '2024-02-01'
    },
    {
      id: '3',
      title: 'Development Phase',
      description: 'Core functionality development and implementation',
      progress: 30,
      status: 'in_progress',
      dueDate: '2024-03-15'
    }
  ]);

  const [feedback, setFeedback] = React.useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSubmitFeedback = async (milestoneId: string) => {
    // TODO: Implement feedback submission
    console.log('Submitting feedback for milestone:', milestoneId, feedback);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Milestones</h1>
          <p className="text-muted-foreground">Track and manage project progress</p>
        </div>
      </div>

      <div className="grid gap-6">
        {milestones.map((milestone) => (
          <Card key={milestone.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{milestone.title}</CardTitle>
              <Badge
                className={`${getStatusColor(milestone.status)} text-white`}
              >
                {milestone.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{milestone.description}</p>
                
                <div className="flex items-center space-x-2">
                  <Progress value={milestone.progress} className="flex-1" />
                  <span className="text-sm font-medium">{milestone.progress}%</span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                  </div>
                  {milestone.status === 'completed' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {milestone.status === 'completed' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">Provide Feedback</span>
                    </div>
                    <div className="flex space-x-3">
                      <Textarea
                        placeholder="Share your thoughts about this milestone..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSubmitFeedback(milestone.id)}
                        className="self-end"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}