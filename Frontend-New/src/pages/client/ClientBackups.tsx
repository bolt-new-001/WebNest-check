import React from 'react';
import { motion } from 'framer-motion';
import { Database, Download, RotateCcw, Calendar, FileArchive, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Backup {
  id: string;
  projectId: string;
  createdAt: string;
  size: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'in_progress' | 'failed';
  description: string;
}

export default function ClientBackups() {
  const [selectedProject, setSelectedProject] = React.useState('');
  const [backups, setBackups] = React.useState<Backup[]>([
    {
      id: '1',
      projectId: 'proj1',
      createdAt: '2024-01-20T09:00:00Z',
      size: '256MB',
      type: 'automatic',
      status: 'completed',
      description: 'Daily automatic backup'
    },
    {
      id: '2',
      projectId: 'proj1',
      createdAt: '2024-01-19T09:00:00Z',
      size: '255MB',
      type: 'manual',
      status: 'completed',
      description: 'Pre-deployment backup'
    }
  ]);

  const handleCreateBackup = async () => {
    // TODO: Implement backup creation
    console.log('Creating backup for project:', selectedProject);
  };

  const handleRestoreBackup = async (backupId: string) => {
    // TODO: Implement backup restoration
    console.log('Restoring backup:', backupId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Backups</h1>
          <p className="text-muted-foreground">Manage and restore project backups</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proj1">E-commerce Website</SelectItem>
              <SelectItem value="proj2">Mobile App</SelectItem>
              <SelectItem value="proj3">Dashboard Redesign</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateBackup}>
            <Database className="w-4 h-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Automatic Backups</AlertTitle>
        <AlertDescription>
          Your project is automatically backed up daily. Manual backups can be created at any time.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Total Backups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{backups.length}</div>
            <p className="text-sm text-muted-foreground">Available backups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Last Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatDate(backups[0]?.createdAt || new Date().toISOString())}
            </div>
            <p className="text-sm text-muted-foreground">Most recent backup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileArchive className="w-5 h-5" />
              <span>Storage Used</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2GB</div>
            <p className="text-sm text-muted-foreground">Total backup size</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{backup.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(backup.createdAt)} • {backup.size} • {backup.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreBackup(backup.id)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}