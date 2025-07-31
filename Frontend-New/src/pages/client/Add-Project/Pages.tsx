import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PagesProps {
  projectData: {
    pages: string[];
    customPages: string;
  };
  setProjectData: (data: any) => void;
}

export function Pages({ projectData, setProjectData }: PagesProps) {
  const defaultPages = ['Home', 'About', 'Services', 'Contact'];

  const addCustomPage = () => {
    if (projectData.customPages.trim()) {
      setProjectData((prev: any) => ({
        ...prev,
        pages: [...prev.pages, prev.customPages],
        customPages: ''
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Default Pages</Label>
            <div className="flex flex-wrap gap-2">
              {defaultPages.map((page) => (
                <Badge key={page} variant="outline">
                  {page}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Custom Pages</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={projectData.customPages}
                onChange={(e) => setProjectData((prev: any) => ({ ...prev, customPages: e.target.value }))}
                placeholder="Enter page name"
              />
              <Button onClick={addCustomPage}>Add Page</Button>
            </div>
          </div>
          <div>
            <Label>Your Pages</Label>
            <div className="flex flex-wrap gap-2">
              {projectData.pages.map((page) => (
                <Badge key={page} variant="outline">
                  {page}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
