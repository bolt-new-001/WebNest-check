import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { clientApi } from '@/lib/api';

interface SummaryProps {
  projectData: any;
  onSubmit: () => void;
}

export function Summary({ projectData, onSubmit }: SummaryProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await clientApi.createProject(projectData);
      toast.success('Project created successfully!');
      onSubmit();
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Project Details</h3>
            <p>{projectData.projectName}</p>
          </div>
          <div>
            <h3 className="font-semibold">Budget</h3>
            <p>{formatCurrency(projectData.budget.inr)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Timeline</h3>
            <p>{projectData.timeline} weeks</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
