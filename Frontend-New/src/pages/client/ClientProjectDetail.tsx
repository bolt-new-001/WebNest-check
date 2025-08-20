import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  Upload,
  Download,
  Settings,
  Code,
  LayoutTemplate,
  Users as UsersIcon,
  FileCheck,
  FileCode,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  File as FileIcon,
  Image as ImageIcon,
  Link2,
  ExternalLink,
  Copy,
  Share2,
  Star,
  Tag,
  ListChecks,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitCompare,
  GitMerge,
  GitBranchPlus,
  GitCommitHorizontal,
  GitPullRequestDraft,
  GitFork,
  GitGraph
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

interface Project {
  _id: string
  title: string
  description: string
  status: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  budget: number
  timeline: {
    startDate: string
    dueDate: string
    estimatedDays: number
  }
  team: Array<{
    role: string
    name: string
    avatar: string
  }>
  files: Array<{
    name: string
    type: string
    size: string
    uploadedAt: string
    url: string
  }>
  updates: Array<{
    date: string
    title: string
    description: string
    author: string
  }>
  requirements: {
    projectType: string
    features: Array<{ name: string; description: string }>
    pages: string[]
    targetAudience: string
  }
  createdAt: string
  updatedAt: string
}

export function ClientProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [projectData, setProjectData] = useState<Partial<Project>>({})

  // Fetch project details
  const { data: project, isLoading, error } = useQuery<{ data: Project }>({
    queryKey: ['project', id],
    queryFn: () => clientApi.getProject(id as string),
    enabled: !!id,
  })

  // Update mutation
  const updateProjectMutation = useMutation({
    mutationFn: (data: Partial<Project>) =>
      clientApi.updateProject(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      setIsEditing(false)
      toast.success('Project updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project')
    },
  })

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProjectMutation.mutate(projectData)
  }

  // Update local state when project data is loaded
  useEffect(() => {
    if (project?.data) {
      setProjectData(project.data)
    }
  }, [project])

  // Status color function
  const getStatusColorLocal = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'urgent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (typeof bytes !== 'number') return '0 Bytes'
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button onClick={() => navigate('/client/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    )
  }

  if (!project?.data) {
    return null
  }

  const { data } = project

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header with Back Button */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  {isEditing ? (
                    <Input
                      value={projectData.title || ''}
                      onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                      className="text-2xl font-bold p-0 border-0 shadow-none focus-visible:ring-0"
                    />
                  ) : (
                    data.title
                  )}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColorLocal(data.status)}>
                    {data.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(data.priority)}>
                    {data.priority} Priority
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created on {new Date(data.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={updateProjectMutation.isPending}
                  >
                    {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this project?')) {
                            updateProjectMutation.mutate({ status: 'cancelled' })
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>
                    {isEditing ? (
                      <textarea
                        value={projectData.description || ''}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                        className="w-full min-h-[100px] p-2 border rounded"
                        placeholder="Enter project description..."
                      />
                    ) : (
                      data.description || 'No description provided.'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Progress</h3>
                      <div className="flex items-center space-x-2">
                        <Progress value={data.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{data.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
                        <p className="text-sm">
                          {new Date(data.timeline?.startDate || data.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                        <p className="text-sm">
                          {data.timeline?.dueDate 
                            ? new Date(data.timeline.dueDate).toLocaleDateString()
                            : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Type</h3>
                      <p className="text-sm">{data.requirements?.projectType || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Key Features</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.requirements?.features?.length ? (
                          data.requirements.features.map((feature, i) => (
                            <Badge key={i} variant="secondary">
                              {feature.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No features specified</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Target Audience</h3>
                      <p className="text-sm">{data.requirements?.targetAudience || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Project Team */}
              <Card>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.team?.length ? (
                    <div className="space-y-4">
                      {data.team.map((member, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UsersIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No team members assigned</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Files */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Files</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {data.files?.length ? (
                    <div className="space-y-3">
                      {data.files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-[180px]">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(parseInt(file.size) || 0)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Budget */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Budget</h3>
                      <p className="text-2xl font-bold">${data.budget?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span>${(data.budget * 0.5)?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span>${(data.budget * 0.5)?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    <Button className="w-full" disabled={data.status === 'completed'}>
                      Make Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}