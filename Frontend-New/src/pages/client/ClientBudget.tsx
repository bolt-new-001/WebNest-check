import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, FileSpreadsheet, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ClientBudget() {
  const [budgetDetails, setBudgetDetails] = React.useState({
    projectType: '',
    scope: '',
    timeline: '',
    features: [],
    estimatedBudget: 0
  });

  const handleCalculate = async () => {
    // TODO: Implement budget calculation logic
  };

  const handleSave = async () => {
    // TODO: Implement save budget calculation
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Calculator</h1>
          <p className="text-muted-foreground">Calculate and plan your project budget</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleCalculate}>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Calculation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select
                value={budgetDetails.projectType}
                onValueChange={(value) => setBudgetDetails(prev => ({ ...prev, projectType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="web-app">Web Application</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Project Scope</Label>
              <Select
                value={budgetDetails.scope}
                onValueChange={(value) => setBudgetDetails(prev => ({ ...prev, scope: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1-5 pages)</SelectItem>
                  <SelectItem value="medium">Medium (6-15 pages)</SelectItem>
                  <SelectItem value="large">Large (16+ pages)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeline</Label>
              <Select
                value={budgetDetails.timeline}
                onValueChange={(value) => setBudgetDetails(prev => ({ ...prev, timeline: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Estimated Budget</p>
                    <p className="text-sm text-muted-foreground">Based on selected options</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">${budgetDetails.estimatedBudget}</p>
              </div>

              <div className="space-y-2">
                <Label>Budget Templates</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-4 space-y-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <p className="text-sm">Basic</p>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 space-y-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <p className="text-sm">Premium</p>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}