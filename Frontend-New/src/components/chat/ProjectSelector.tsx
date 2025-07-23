import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Project {
  _id: string;
  title: string;
  status: string;
}

export function ProjectSelector() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await clientApi.getProjects();
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    navigate(`/client/chat/${projectId}`);
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <Select onValueChange={handleProjectChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project._id} value={project._id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}