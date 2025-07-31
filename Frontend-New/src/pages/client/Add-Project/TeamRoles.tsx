import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

interface TeamRolesProps {
  projectData: {
    teamRoles: Array<{
      role: string;
      level: string;
      quantity: number;
    }>;
  };
  setProjectData: (data: any) => void;
}

export function TeamRoles({ projectData, setProjectData }: TeamRolesProps) {
  const roles = ['Developer', 'Designer', 'Tester', 'Project Manager'];
  const levels = ['Junior', 'Mid-Level', 'Senior'];

  const addTeamRole = () => {
    setProjectData((prev: any) => ({
      ...prev,
      teamRoles: [...prev.teamRoles, { role: '', level: '', quantity: 1 }]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projectData.teamRoles.map((role, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <div>
                <Label>Role</Label>
                <Select
                  value={role.role}
                  onValueChange={(value) => {
                    const newRoles = [...projectData.teamRoles];
                    newRoles[index].role = value;
                    setProjectData((prev: any) => ({ ...prev, teamRoles: newRoles }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Experience Level</Label>
                <Select
                  value={role.level}
                  onValueChange={(value) => {
                    const newRoles = [...projectData.teamRoles];
                    newRoles[index].level = value;
                    setProjectData((prev: any) => ({ ...prev, teamRoles: newRoles }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={role.quantity}
                  onChange={(e) => {
                    const newRoles = [...projectData.teamRoles];
                    newRoles[index].quantity = parseInt(e.target.value) || 1;
                    setProjectData((prev: any) => ({ ...prev, teamRoles: newRoles }));
                  }}
                  className="w-full"
                />
              </div>
            </div>
          ))}
          <Button onClick={addTeamRole}>Add Team Role</Button>
        </div>
      </CardContent>
    </Card>
  );
}
