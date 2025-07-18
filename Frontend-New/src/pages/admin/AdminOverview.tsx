import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserCog, 
  FolderOpen, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { adminApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function AdminOverview() {
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminApi.get('/api/analytics/dashboard'),
  })

  const { data: projects } = useQuery({
    queryKey: ['admin-projects', { limit: 5 }],
    queryFn: () => adminApi.get('/api/projects?limit=5'),
  })

  const { data: users } = useQuery({
    queryKey: ['admin-users', { limit: 5 }],
    queryFn: () => adminApi.get('/api/users?limit=5'),
  })

  const overviewCards = [
    {
      title: 'Total Users',
      value: analytics?.data?.data?.overview?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `+${analytics?.data?.data?.growth?.users || 0} this month`
    },
    {
      title: 'Active Developers',
      value: analytics?.data?.data?.overview?.totalDevelopers || 0,
      icon: UserCog,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: `+${analytics?.data?.data?.growth?.developers || 0} this month`
    },
    {
      title: 'Total Projects',
      value: analytics?.data?.data?.overview?.totalProjects || 0,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `+${analytics?.data?.data?.growth?.projects || 0} this month`
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics?.data?.data?.overview?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+15% this month'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your WebNest platform</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/admin/notifications">
            <Button variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </Link>
        </div>
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
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Link to="/admin/projects">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.data?.data?.map((project: any) => (
                <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600">Client: {project.clientId?.name}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {project.developerId ? (
                      <div className="text-right">
                        <p className="text-sm font-medium">{project.developerId.name}</p>
                        <p className="text-xs text-gray-500">Developer</p>
                      </div>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                  </div>
                </div>
              ))}
              {(!projects?.data?.data || projects.data.data.length === 0) && (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent projects</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Link to="/admin/users">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.data?.data?.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.isPremium ? 'default' : 'secondary'}>
                      {user.isPremium ? 'Premium' : 'Free'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {(!users?.data?.data || users.data.data.length === 0) && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent users</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">API Status</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Services</span>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span>120ms</span>
                </div>
                <Progress value={85} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Uptime</span>
                  <span>99.9%</span>
                </div>
                <Progress value={99.9} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">High CPU Usage</span>
                <Badge variant="outline">Warning</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disk Space</span>
                <Badge className="bg-green-100 text-green-800">Normal</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <Badge className="bg-green-100 text-green-800">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/projects">
              <Button variant="outline" className="w-full justify-start">
                <FolderOpen className="mr-2 h-4 w-4" />
                Assign Projects
              </Button>
            </Link>
            <Link to="/admin/developers">
              <Button variant="outline" className="w-full justify-start">
                <UserCog className="mr-2 h-4 w-4" />
                Verify Developers
              </Button>
            </Link>
            <Link to="/admin/support">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Support Tickets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}