import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IndustryProps {
  projectData: {
    industry: string;
  };
  setProjectData: (data: any) => void;
}

export function Industry({ projectData, setProjectData }: IndustryProps) {
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Food & Beverage',
    'Entertainment',
    'Travel & Tourism',
    'Real Estate',
    'Non-Profit',
    'Other'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Industry</Label>
            <Select
              value={projectData.industry}
              onValueChange={(value) => setProjectData((prev: any) => ({ ...prev, industry: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target Audience</Label>
            <Input
              value={projectData.targetAudience}
              onChange={(e) => setProjectData((prev: any) => ({ ...prev, targetAudience: e.target.value }))}
              placeholder="Describe your target audience"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
