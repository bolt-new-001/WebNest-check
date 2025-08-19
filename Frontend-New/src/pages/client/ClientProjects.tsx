import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  FolderOpen,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export function ClientProjects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', { search: searchQuery, status: statusFilter, sort: sortBy }],
    queryFn: () => clientApi.getProjects({
      search: searchQuery,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sort: sortBy
    }),
  })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'completed', label: 'Completed' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'budget_high', label: 'Budget: High to Low' },
    { value: 'budget_low', label: 'Budget: Low to High' },
    { value: 'progress', label: 'Progress' },
  ]

  return (
    <>
      <div className="space-y-8 p-6 bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</h1>
            <p className="text-muted-foreground">Manage and track all your web development projects</p>
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
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm hover:bg-accent/5 transition-colors"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm hover:bg-accent/5 transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.data?.data?.map((project: any, index: number) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/client/projects/${project._id}`}>
                  <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div className="truncate group-hover:text-primary transition-colors">{project.title}</div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">{project.description}</p>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Progress value={project.progress?.percentage || 0} className="w-24 mr-2 bg-muted/50" indicatorClassName="bg-gradient-to-r from-primary to-accent" />
                            <span>{project.progress?.percentage || 0}%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">{formatDate(project.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">{formatCurrency(project.budget)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {(!projects?.data?.data || projects.data.data.length === 0) && (
              <div className="col-span-full text-center py-12 rounded-lg border border-dashed border-primary/20 bg-gradient-to-br from-card/50 to-muted/50 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:10px_10px]" />
                <div className="absolute h-full w-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FolderOpen className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by creating your first project'}
                  </p>
                  {!searchQuery && statusFilter === 'all' && (
                    <Link to="/client/add-project">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
            )}
      </div>
    </>
  )
}