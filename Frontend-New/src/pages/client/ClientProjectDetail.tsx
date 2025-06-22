 import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  FileText,
  MessageSquare,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Upload,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '@/lib/utils'

export function ClientProjectDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => clientApi.getProject(id as string),
    enabled: !!id,
  })

  const { data: files } = useQuery({
    queryKey: ['project-files', id],
    queryFn: () => clientApi.getProjectFiles(id as string),
    enabled: !!id,
  })

  const { data: activity } = useQuery({
    queryKey: ['project-activity', id],
    queryFn: () => clientApi.getProjectActivity(id as string, { limit: 5 }),
    enabled: !!id,
  })

  const { data: revisions } = useQuery({
    queryKey: ['project-revisions', id],
    queryFn: () => clientApi.getProjectRevisions(id as string, { limit: 3 }),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading project details...</p>
      </div>
    )
  }

  const projectData = project?.data?.data

  if (!projectData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
        <p className="text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{projectData.title}</h1>
            <Badge className={getStatusColor(projectData.status)}>
              {projectData.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{projectData.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Developer
          </Button>
          <Button>
            <RotateCcw className="mr-2 h-4 w-4" />
            Request Revision
          </Button>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(projectData.budget)}</p>
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
                <p className="text-sm font-medium text-gray-600">Start Date</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(projectData.createdAt)}</p>
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
                <p className="text-sm font-medium text-gray-600">Deadline</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectData.deadline ? formatDate(projectData.deadline) : 'Not set'}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <div className="flex items-center mt-1">
                  <Progress value={projectData.progress?.percentage || 0} className="w-24 mr-2" />
                  <span className="text-lg font-bold">{projectData.progress?.percentage || 0}%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Files */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Files</CardTitle>
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files?.data?.data?.map((file: any) => (
                <div key={file._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-xs text-gray-500">
                        {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'} • 
                        {formatDateTime(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {(!files?.data?.data || files.data.data.length === 0) && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No files uploaded yet</p>
                  <Button className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload First File
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity?.data?.data?.map((item: any) => (
                <div key={item._id} className="flex gap-3">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      {item.type === 'file_upload' && <Upload className="h-4 w-4 text-blue-600" />}
                      {item.type === 'revision' && <RotateCcw className="h-4 w-4 text-orange-600" />}
                      {item.type === 'comment' && <MessageSquare className="h-4 w-4 text-green-600" />}
                      {item.type === 'status_change' && <CheckCircle className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="absolute top-9 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}

              {(!activity?.data?.data || activity.data.data.length === 0) && (
                <div className="text-center py-4">
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revisions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revision Requests</CardTitle>
            <Button>
              <RotateCcw className="mr-2 h-4 w-4" />
              New Revision
            </Button>
          </div>
          <CardDescription>Track your revision requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revisions?.data?.data?.map((revision: any) => (
              <div key={revision._id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{revision.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{revision.description}</p>
                  </div>
                  <Badge className={getStatusColor(revision.status)}>
                    {revision.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-3">{formatDate(revision.createdAt)}</span>
                  {revision.deadline && (
                    <>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Due: {formatDate(revision.deadline)}</span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {(!revisions?.data?.data || revisions.data.data.length === 0) && (
              <div className="text-center py-8">
                <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No revision requests yet</p>
                <Button className="mt-4">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Request First Revision
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}