import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Upload,
  Play,
  Pause,
  Send
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { developerApi } from '@/lib/api'
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'

export function DeveloperProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [workLogDescription, setWorkLogDescription] = useState('')
  const [progressUpdate, setProgressUpdate] = useState('')
  const queryClient = useQueryClient()

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['developer-project', id],
    queryFn: () => developerApi.get(`/api/projects/${id}`),
    enabled: !!id,
  })

  const addWorkLogMutation = useMutation({
    mutationFn: (data: any) => developerApi.post(`/api/projects/${id}/worklog`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-project', id] })
      setWorkLogDescription('')
      toast.success('Work log added successfully')
    },
    onError: () => {
      toast.error('Failed to add work log')
    },
  })

  const updateProgressMutation = useMutation({
    mutationFn: (data: any) => developerApi.put(`/api/projects/${id}/progress`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-project', id] })
      setProgressUpdate('')
      toast.success('Progress updated successfully')
    },
    onError: () => {
      toast.error('Failed to update progress')
    },
  })

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading project details...</p>
      </div>
    )
  }

  const assignmentData = assignment?.data?.data
  const projectData = assignmentData?.projectId

  if (!assignmentData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
        <p className="text-gray-600">The project assignment you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{projectData?.title}</h1>
            <Badge className={getStatusColor(assignmentData.status)}>
              {assignmentData.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{projectData?.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with Client
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Work
          </Button>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(assignmentData.totalAmount || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Date</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(assignmentData.assignedAt)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Logged</p>
                <p className="text-2xl font-bold text-gray-900">{assignmentData.actualHours || 0}h</p>
                <p className="text-xs text-gray-500">of {assignmentData.estimatedHours || 0}h</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Client</p>
                <p className="text-lg font-bold text-gray-900">{projectData?.clientId?.name}</p>
                <p className="text-xs text-gray-500">{projectData?.clientId?.email}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Work Log */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Work Log</CardTitle>
            <CardDescription>Track your work progress and time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add Work Log */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-3">Log Work</h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Describe what you worked on..."
                    value={workLogDescription}
                    onChange={(e) => setWorkLogDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Hours"
                      className="px-3 py-2 border rounded-md w-24"
                      min="0"
                      step="0.5"
                    />
                    <Button 
                      onClick={() => addWorkLogMutation.mutate({
                        hours: 2, // Get from input
                        description: workLogDescription
                      })}
                      disabled={!workLogDescription.trim()}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Log Time
                    </Button>
                  </div>
                </div>
              </div>

              {/* Work Log History */}
              <div className="space-y-3">
                {assignmentData.workLogs?.map((log: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{log.description}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(log.date)}</p>
                      </div>
                      <Badge variant="outline">{log.hours}h</Badge>
                    </div>
                  </div>
                ))}

                {(!assignmentData.workLogs || assignmentData.workLogs.length === 0) && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No work logged yet</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Update */}
        <Card>
          <CardHeader>
            <CardTitle>Update Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Progress</label>
                <div className="mt-2">
                  <Progress value={assignmentData.progress || 0} />
                  <p className="text-sm text-gray-500 mt-1">{assignmentData.progress || 0}% complete</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Progress Update</label>
                <Textarea
                  placeholder="Describe your progress..."
                  value={progressUpdate}
                  onChange={(e) => setProgressUpdate(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button 
                className="w-full"
                onClick={() => updateProgressMutation.mutate({
                  progress: 75, // This should come from a slider/input
                  notes: progressUpdate
                })}
                disabled={!progressUpdate.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Update Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
          <CardDescription>Track project milestones and deliverables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignmentData.milestones?.map((milestone: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    {milestone.dueDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Due: {formatDate(milestone.dueDate)}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                    {milestone.status === 'pending' && (
                      <Button size="sm" className="mt-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(!assignmentData.milestones || assignmentData.milestones.length === 0) && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No milestones defined yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}