import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

interface TechnicalProps {
  projectData: {
    performanceGoals: {
      loadTime: number;
      seoScore: number;
    };
    accessibilityLevel: string;
  };
  setProjectData: (data: any) => void;
}

export function Technical({ projectData, setProjectData }: TechnicalProps) {
  const accessibilityLevels = ['AA', 'AAA', 'None'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Target Load Time (seconds)</Label>
            <Input
              type="number"
              value={projectData.performanceGoals.loadTime}
              onChange={(e) => {
                setProjectData((prev: any) => ({
                  ...prev,
                  performanceGoals: { ...prev.performanceGoals, loadTime: parseFloat(e.target.value) || 0 }
                }));
              }}
            />
          </div>
          <div>
            <Label>Target SEO Score</Label>
            <Input
              type="number"
              value={projectData.performanceGoals.seoScore}
              onChange={(e) => {
                setProjectData((prev: any) => ({
                  ...prev,
                  performanceGoals: { ...prev.performanceGoals, seoScore: parseInt(e.target.value) || 0 }
                }));
              }}
            />
          </div>
          <div>
            <Label>Accessibility Level</Label>
            <Select
              value={projectData.accessibilityLevel}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, accessibilityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select accessibility level" />
              </SelectTrigger>
              <SelectContent>
                {accessibilityLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
