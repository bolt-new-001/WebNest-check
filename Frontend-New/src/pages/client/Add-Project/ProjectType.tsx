import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, ShoppingCart, Globe, Code, Shield, MessageSquare } from 'lucide-react';

interface ProjectTypeProps {
  projectData: {
    type: string;
  };
  setProjectData: (data: any) => void;
}

export function ProjectType({ projectData, setProjectData }: ProjectTypeProps) {
  const projectTypes = [
    { id: 'website', icon: Globe, title: 'Website', description: 'A complete website solution' },
    { id: 'ecommerce', icon: ShoppingCart, title: 'E-commerce', description: 'Online store with payment integration' },
    { id: 'webapp', icon: Code, title: 'Web Application', description: 'Custom web application' },
    { id: 'saas', icon: Briefcase, title: 'SaaS', description: 'Software as a Service platform' },
    { id: 'landing', icon: Shield, title: 'Landing Page', description: 'Single page marketing site' },
    { id: 'blog', icon: MessageSquare, title: 'Blog', description: 'Content management system' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Type</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setProjectData((prev: any) => ({ ...prev, type: type.id }))}
            className={`p-4 rounded-lg transition-all ${
              projectData.type === type.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              <type.icon className="w-5 h-5" />
              <span>{type.title}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
