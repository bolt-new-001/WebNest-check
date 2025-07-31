import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface BasicInfoProps {
  projectData: {
    projectName: string;
    description: string;
  };
  setProjectData: (data: any) => void;
}

export function BasicInfo({ projectData, setProjectData }: BasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input
              value={projectData.projectName}
              onChange={(e) => setProjectData((prev: any) => ({ ...prev, projectName: e.target.value }))}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={projectData.description}
              onChange={(e) => setProjectData((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project in detail"
              className="resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
