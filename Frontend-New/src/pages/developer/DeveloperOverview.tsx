import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  DollarSign, 
  Clock, 
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { developerApi } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function DeveloperOverview() {
  const { data: stats } = useQuery({
    queryKey: ['developer-stats'],
    queryFn: () => developerApi.get('/api/profile/stats'),
  })

  const { data: projects } = useQuery({
    queryKey: ['developer-projects', { limit: 5 }],
    queryFn: () => developerApi.get('/api/projects?limit=5'),
  })

  const { data: earnings } = useQuery({
    queryKey: ['developer-earnings'],
    queryFn: () => developerApi.get('/api/earnings'),
  })

  const overviewCards = [
    {
      title: 'Active Projects',
      value: stats?.data?.data?.activeProjects || 0,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 this week'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(earnings?.data?.data?.totalEarnings || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12% this month'
    },
    {
      title: 'Hours Logged',
      value: `${stats?.data?.data?.hoursLogged || 0}h`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '8h this week'
    },
    {
      title: 'Average Rating',
      value: `${stats?.data?.data?.averageRating || 0}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: 'Excellent'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
          <p className="text-gray-600">Track your projects, earnings, and performance</p>
        </div>
        <Link to="/developer/portfolio">
          <Button>
            <Award className="mr-2 h-4 w-4" />
            Update Portfolio
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-green-600 mt-1">{card.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Projects</CardTitle>
              <Link to="/developer/projects">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.data?.data?.map((project: any) => (
                <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{project.projectId?.title}</h3>
                    <p className="text-sm text-gray-600">Client: {project.projectId?.clientId?.name}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Due: {formatDate(project.deadline)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Progress value={project.progress || 0} className="w-20" />
                    <p className="text-xs text-gray-500 mt-1">{project.progress || 0}%</p>
                  </div>
                </div>
              ))}
              {(!projects?.data?.data || projects.data.data.length === 0) && (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active projects</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Project milestone completed</p>
                  <p className="text-xs text-gray-500">E-commerce Website - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New message from client</p>
                  <p className="text-xs text-gray-500">Portfolio Website - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Deadline reminder</p>
                  <p className="text-xs text-gray-500">Business Website - 6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Your earnings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <TrendingUp className="h-8 w-8 mr-2" />
            Earnings chart will be displayed here
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/developer/time-tracking">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Log Time
              </Button>
            </Link>
            <Link to="/developer/messages">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Messages
              </Button>
            </Link>
            <Link to="/developer/availability">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Update Availability
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}