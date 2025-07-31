import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AddOnsProps {
  projectData: {
    addOns: string[];
  };
  setProjectData: (data: any) => void;
}

export function AddOns({ projectData, setProjectData }: AddOnsProps) {
  const addOns = [
    { id: 'seo-setup', title: 'SEO Setup', description: 'Complete SEO optimization', price: 5000 },
    { id: 'hosting', title: 'Domain + Hosting', description: '1 year hosting included', price: 3000 },
    { id: 'branding', title: 'Logo / Branding', description: 'Professional logo design', price: 8000 },
    { id: 'email', title: 'Email Setup', description: 'Professional email accounts', price: 2000 },
    { id: 'maintenance', title: 'Maintenance Plan', description: '6 months maintenance', price: 10000 },
    { id: 'analytics', title: 'Analytics Setup', description: 'Advanced analytics integration', price: 3000 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add-ons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addOns.map((addOn) => (
            <div key={addOn.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={addOn.id}
                  checked={projectData.addOns.includes(addOn.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setProjectData((prev: any) => ({ ...prev, addOns: [...prev.addOns, addOn.id] }));
                    } else {
                      setProjectData((prev: any) => ({
                        ...prev,
                        addOns: prev.addOns.filter((a: string) => a !== addOn.id)
                      }));
                    }
                  }}
                />
                <Label htmlFor={addOn.id}>{addOn.title}</Label>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{addOn.description}</span>
                <span className="font-medium">₹{addOn.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
