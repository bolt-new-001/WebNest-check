import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: string;
  link: string;
}

export default function ClientOnboarding() {
  const [steps, setSteps] = React.useState<OnboardingStep[]>([
    {
      id: '1',
      title: 'Complete Your Profile',
      description: 'Add your company details and preferences',
      completed: true,
      action: 'Update Profile',
      link: '/client/profile'
    },
    {
      id: '2',
      title: 'Create Your First Project',
      description: 'Start by creating your first project',
      completed: false,
      action: 'Create Project',
      link: '/client/projects/new'
    },
    {
      id: '3',
      title: 'Explore Templates',
      description: 'Browse our collection of project templates',
      completed: false,
      action: 'View Templates',
      link: '/client/templates'
    },
    {
      id: '4',
      title: 'Set Up Team',
      description: 'Invite team members and assign roles',
      completed: false,
      action: 'Manage Team',
      link: '/client/settings/team'
    },
    {
      id: '5',
      title: 'Review Documentation',
      description: 'Learn about our features and best practices',
      completed: false,
      action: 'View Docs',
      link: '/client/resources'
    }
  ]);

  const [showSkip, setShowSkip] = React.useState(true);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleSkip = async () => {
    // TODO: Implement skip onboarding
    console.log('Skipping onboarding');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to WebNest!</h1>
          <p className="text-muted-foreground">Let's get you started with your journey</p>
        </div>
        {showSkip && (
          <Button variant="ghost" onClick={handleSkip}>
            <X className="w-4 h-4 mr-2" />
            Skip Onboarding
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="font-medium">Onboarding Progress</span>
            </div>
            <span className="text-sm font-medium">{completedSteps}/{steps.length} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100' : 'bg-primary/10'}`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className="text-primary font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <Button
                  variant={step.completed ? 'outline' : 'default'}
                  className="ml-4"
                  asChild
                >
                  <a href={step.link}>
                    {step.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {completedSteps === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
          <p className="text-muted-foreground mb-4">
            You've completed all onboarding steps. You're ready to make the most of WebNest!
          </p>
          <Button asChild>
            <a href="/client/dashboard">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      )}
    </div>
  );
}