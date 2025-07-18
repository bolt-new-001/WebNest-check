import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { developerApi } from '@/lib/api'
import { formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

export function DeveloperTimeTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentTask, setCurrentTask] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [filterProject, setFilterProject] = useState('all')
  const queryClient = useQueryClient()

  const { data: projects } = useQuery({
    queryKey: ['developer-projects'],
    queryFn: () => developerApi.get('/api/projects'),
  })

  const { data: timeTracking } = useQuery({
    queryKey: ['time-tracking', filterProject],
    queryFn: () => developerApi.get(`/api/time-tracking/project/${filterProject !== 'all' ? filterProject : ''}`),
    enabled: filterProject !== 'all'
  })

  const startTrackingMutation = useMutation({
    mutationFn: (data: any) => developerApi.post('/api/time-tracking/start', data),
    onSuccess: () => {
      setIsTracking(true)
      queryClient.invalidateQueries({ queryKey: ['time-tracking'] })
      toast.success('Time tracking started')
    },
    onError: () => {
      toast.error('Failed to start time tracking')
    },
  })

  const stopTrackingMutation = useMutation({
    mutationFn: (sessionId: string) => developerApi.put(`/api/time-tracking/stop/${sessionId}`, {}),
    onSuccess: () => {
      setIsTracking(false)
      setCurrentTask('')
      queryClient.invalidateQueries({ queryKey: ['time-tracking'] })
      toast.success('Time tracking stopped')
    },
    onError: () => {
      toast.error('Failed to stop time tracking')
    },
  })

  const handleStartTracking = () => {
    if (!selectedProject || !currentTask.trim()) {
      toast.error('Please select a project and describe your task')
      return
    }

    startTrackingMutation.mutate({
      projectId: selectedProject,
      description: currentTask,
      taskType: 'development'
    })
  }

  const timeTrackingData = timeTracking?.data?.data || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600">Track your work hours and productivity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Time Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
          <CardDescription>Start tracking time for your current task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project">Project</Label>
                <select
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isTracking}
                >
                  <option value="">Select a project</option>
                  {projects?.data?.data?.map((project: any) => (
                    <option key={project._id} value={project.projectId?._id}>
                      {project.projectId?.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="task-type">Task Type</Label>
                <select
                  id="task-type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isTracking}
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="testing">Testing</option>
                  <option value="review">Review</option>
                  <option value="communication">Communication</option>
                  <option value="research">Research</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="task-description">Task Description</Label>
              <Textarea
                id="task-description"
                placeholder="Describe what you're working on..."
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                disabled={isTracking}
              />
            </div>

            <div className="flex items-center justify-center space-x-4 py-6">
              {!isTracking ? (
                <Button 
                  size="lg" 
                  onClick={handleStartTracking}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Tracking
                </Button>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    00:45:32
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => stopTrackingMutation.mutate('current-session-id')}
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">6.5h</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">32h</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">128h</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productivity</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Entries</CardTitle>
            <div className="flex gap-2">
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Projects</option>
                {projects?.data?.data?.map((project: any) => (
                  <option key={project._id} value={project.projectId?._id}>
                    {project.projectId?.title}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeTrackingData.map((entry: any) => (
              <div key={entry._id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{entry.description}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{entry.projectTitle}</span>
                      <Badge variant="outline">{entry.taskType}</Badge>
                      <span>{formatDateTime(entry.startTime)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{entry.duration}h</p>
                    <Badge variant="outline" className="text-xs">
                      {entry.productivity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {timeTrackingData.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {filterProject === 'all' 
                    ? 'No time entries yet' 
                    : 'No time entries for this project'
                  }
                </p>
                <p className="text-sm text-gray-500">Start tracking time to see your entries here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}