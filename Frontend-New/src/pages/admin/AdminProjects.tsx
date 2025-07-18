import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FolderPlus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { adminApi } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects', { search: searchTerm, status: statusFilter }],
    queryFn: () => adminApi.get('/api/projects', { 
      params: {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined 
      }
    }),
  })

  const approveProjectMutation = useMutation({
    mutationFn: (projectId: string) => adminApi.put(`/api/projects/${projectId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      toast.success('Project approved successfully')
    },
    onError: () => {
      toast.error('Failed to approve project')
    },
  })

  const cancelProjectMutation = useMutation({
    mutationFn: (projectId: string) => adminApi.put(`/api/projects/${projectId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      toast.success('Project cancelled successfully')
    },
    onError: () => {
      toast.error('Failed to cancel project')
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => adminApi.delete(`/api/projects/${projectId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      toast.success('Project deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })

  const filteredProjects = projects?.data?.data || []

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage and monitor all platform projects</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to the platform.
              </DialogDescription>
            </DialogHeader>
            {/* Add project form would go here */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input placeholder="E-commerce Website" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Input placeholder="Select client..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget</label>
                <Input placeholder="$5,000" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Project description..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Projects</CardTitle>
          <CardDescription>
            Manage projects, view details, and monitor progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-gray-500">Project</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Client</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Developer</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Deadline</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Budget</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Progress</th>
                  <th className="pb-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project: any) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 pr-4">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {project.description}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{project.client?.name || 'N/A'}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{project.developer?.name || 'Unassigned'}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{formatDate(project.deadline)}</div>
                        {project.isOverdue && (
                          <Badge className="bg-red-100 text-red-800 mt-1">Overdue</Badge>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm">{formatCurrency(project.budget || 0)}</div>
                      </td>
                      <td className="py-4 pr-4 w-32">
                        <div className="flex items-center space-x-2">
                          <Progress value={project.progress || 0} className="h-2" />
                          <span className="text-sm text-gray-500">{project.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Project
                            </DropdownMenuItem>
                            {project.status === 'pending' && (
                              <DropdownMenuItem onClick={() => approveProjectMutation.mutate(project.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {(project.status === 'active' || project.status === 'pending') && (
                              <DropdownMenuItem onClick={() => cancelProjectMutation.mutate(project.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-orange-500" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => deleteProjectMutation.mutate(project.id)}>
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <h3 className="text-2xl font-bold mt-1">86</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FolderPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <h3 className="text-2xl font-bold mt-1">32</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <h3 className="text-2xl font-bold mt-1">5</h3>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$248,500</h3>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}