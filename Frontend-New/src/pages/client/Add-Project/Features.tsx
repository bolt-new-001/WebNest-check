import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FeaturesProps {
  projectData: {
    features: string[];
  };
  setProjectData: (data: any) => void;
}

export function Features({ projectData, setProjectData }: FeaturesProps) {
  const features = [
    'Responsive Design',
    'SEO Optimization',
    'Social Media Integration',
    'Analytics',
    'Mobile App Integration',
    'Payment Gateway',
    'Multi-language Support',
    'Custom Dashboard',
    'API Integration',
    'Custom Forms'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                checked={projectData.features.includes(feature)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProjectData((prev: any) => ({ ...prev, features: [...prev.features, feature] }));
                  } else {
                    setProjectData((prev: any) => ({
                      ...prev,
                      features: prev.features.filter((f: string) => f !== feature)
                    }));
                  }
                }}
              />
              <Label htmlFor={feature}>{feature}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
