import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function ClientOverview() {
  const { data: insights } = useQuery({
    queryKey: ['client-insights'],
    queryFn: () => clientApi.getClientInsights(),
  })

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => clientApi.getDashboardData(),
  })

  const { data: projects } = useQuery({
    queryKey: ['projects', { limit: 5 }],
    queryFn: () => clientApi.getProjects({ limit: 5 }),
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications', { limit: 5 }],
    queryFn: () => clientApi.getNotifications({ limit: 5 }),
  })

  const insightCards = [
    {
      title: 'Active Projects',
      value: insights?.data?.data?.activeProjects || 0,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Open Tickets',
      value: insights?.data?.data?.openTickets || 0,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(insights?.data?.data?.totalSpent || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Revisions',
      value: insights?.data?.data?.activeRevisions || 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Link to="/client/projects">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightCards.map((card, index) => (
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
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Link to="/client/projects">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.data?.data?.map((project: any) => (
                <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Progress value={project.progress?.percentage || 0} className="w-20" />
                    <p className="text-xs text-gray-500 mt-1">
                      {project.progress?.percentage || 0}%
                    </p>
                  </div>
                </div>
              ))}
              {(!projects?.data?.data || projects.data.data.length === 0) && (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No projects yet</p>
                  <Link to="/client/projects">
                    <Button className="mt-4">Create Your First Project</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Link to="/client/notifications">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications?.data?.data?.map((notification: any) => (
                <div key={notification._id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    notification.priority === 'high' ? 'bg-red-100' :
                    notification.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {notification.isRead ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className={`h-4 w-4 ${
                        notification.priority === 'high' ? 'text-red-600' :
                        notification.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {(!notifications?.data?.data || notifications.data.data.length === 0) && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/client/projects">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Start New Project
              </Button>
            </Link>
            <Link to="/client/support">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Support
              </Button>
            </Link>
            <Link to="/client/files">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}