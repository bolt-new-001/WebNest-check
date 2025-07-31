import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface ThemeProps {
  projectData: {
    theme: string;
    colorPreferences: {
      primary: string;
      secondary: string;
    };
  };
  setProjectData: (data: any) => void;
  inspirationLink: string;
  setInspirationLink: (link: string) => void;
}

export function Theme({ projectData, setProjectData, inspirationLink, setInspirationLink }: ThemeProps) {
  const themes = ['Modern', 'Minimal', 'Corporate', 'Creative', 'E-commerce', 'Portfolio'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design & Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Theme</Label>
            <Select
              value={projectData.theme}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, theme: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={projectData.colorPreferences.primary}
              onChange={(e) => {
                setProjectData((prev: any) => ({
                  ...prev,
                  colorPreferences: { ...prev.colorPreferences, primary: e.target.value }
                }));
              }}
            />
          </div>
          <div>
            <Label>Secondary Color</Label>
            <Input
              type="color"
              value={projectData.colorPreferences.secondary}
              onChange={(e) => {
                setProjectData((prev: any) => ({
                  ...prev,
                  colorPreferences: { ...prev.colorPreferences, secondary: e.target.value }
                }));
              }}
            />
          </div>
          <div>
            <Label>Inspiration Link</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={inspirationLink}
                onChange={(e) => setInspirationLink(e.target.value)}
                placeholder="Enter inspiration website URL"
              />
              <Button variant="outline">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
