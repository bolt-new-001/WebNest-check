import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User
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
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export function ClientProjectDetail() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', { search: searchTerm, status: statusFilter }],
    queryFn: () => clientApi.getProjects({
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }),
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => clientApi.updateProject(projectId, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project cancelled successfully')
    },
    onError: () => {
      toast.error('Failed to cancel project')
    },
  })

  const filteredProjects = projects?.data?.data || []

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
        </div>
        <Link to="/client/add-project">
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent/5 transition-colors"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any, index: number) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1 group-hover:text-muted-foreground/80 transition-colors">
                        {project.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/client/projects/${project._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteProjectMutation.mutate(project._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress?.percentage || 0}%</span>
                      </div>
                      <Progress value={project.progress?.percentage || 0} className="bg-muted/50" indicatorClassName="bg-gradient-to-r from-primary to-accent" />
                    </div>

                    {/* Status and Budget */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                        <DollarSign className="h-4 w-4 mr-1 group-hover:text-primary transition-colors" />
                        {formatCurrency(project.budget)}
                      </div>
                    </div>

                    {/* Developer and Date */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 group-hover:text-primary transition-colors" />
                        {project.developerId?.name || 'Unassigned'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 group-hover:text-primary transition-colors" />
                        {formatDate(project.createdAt)}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/client/projects/${project._id}`}>
                      <Button variant="outline" className="w-full hover:bg-primary/10 hover:border-primary/20 transition-all duration-300">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-lg bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-12 text-center relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:10px_10px]" />
            <div className="absolute h-full w-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 opacity-20 blur-3xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 animate-float">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'
                }
              </p>
              <Link to="/client/add-project">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}