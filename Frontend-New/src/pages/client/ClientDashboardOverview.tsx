import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  BarChart3,
  Plus,
  TrendingUp,
  Users,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function ClientDashboardOverview() {
  const { data: overview } = useQuery({
    queryKey: ['client-overview'],
    queryFn: () => clientApi.getClientOverview(),
  })

  const { data: projectStats } = useQuery({
    queryKey: ['project-stats'],
    queryFn: () => clientApi.getProjectStatistics(),
  })

  const { data: teamStats } = useQuery({
    queryKey: ['team-stats'],
    queryFn: () => clientApi.getTeamStatistics(),
  })

  const overviewCards = [
    {
      title: 'Active Projects',
      value: overview?.activeProjects || 0,
      total: overview?.totalProjects || 0,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      change: '+2 this week',
      progress: 75,
    },
    {
      title: 'Team Members',
      value: overview?.activeTeamMembers || 0,
      total: overview?.teamSize || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: `${overview?.teamEfficiency || 0}% efficiency`,
      progress: overview?.teamEfficiency || 0,
    },
    {
      title: 'Budget Used',
      value: formatCurrency(overview?.budgetUsed || 0),
      total: formatCurrency(overview?.totalBudget || 0),
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      change: `${overview?.budgetEfficiency || 0}% utilization`,
      progress: overview?.budgetEfficiency || 0,
    },
    {
      title: 'Satisfaction',
      value: `${overview?.satisfaction || 0}%`,
      total: '100%',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      change: `${overview?.positiveReviews || 0} positive reviews`,
      progress: overview?.satisfaction || 0,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card gradient className="border-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="soft" className="bg-white/20 text-gray-700">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Welcome Back!
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {formatDate(new Date())} • Your projects are progressing well
                </p>
              </div>
              <Link to="/client/add-project">
                <Button size="lg" variant="gradient" className="group shadow-soft-lg">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                  New Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover className="group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} shadow-soft group-hover:scale-110 transition-transform`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="soft" size="sm">
                    {card.change}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      {card.total && (
                        <p className="text-sm text-gray-500">/ {card.total}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{card.progress}%</span>
                    </div>
                    <Progress value={card.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Recent Projects</span>
                  </CardTitle>
                  <CardDescription>Your latest project activities</CardDescription>
                </div>
                <Link to="/client/projects">
                  <Button variant="ghost" size="sm" className="group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-primary/5 hover:to-accent/5 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">E-commerce Website</h3>
                        <p className="text-sm text-gray-600">In Progress • Due in 5 days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="soft">75%</Badge>
                      <p className="text-sm text-gray-500 mt-1">₹25,000</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/client/add-project">
                <Button variant="outline" className="w-full justify-start group">
                  <Plus className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform" />
                  New Project
                </Button>
              </Link>
              <Link to="/client/chat">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Team Chat
                </Button>
              </Link>
              <Link to="/client/files">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-3 h-4 w-4" />
                  Upload Files
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Project Completion</span>
                  <span className="font-semibold">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Efficiency</span>
                  <span className="font-semibold">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Client Satisfaction</span>
                  <span className="font-semibold">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Milestone completed', project: 'E-commerce Website', time: '2 hours ago', type: 'success' },
                { action: 'New message received', project: 'Portfolio Website', time: '4 hours ago', type: 'info' },
                { action: 'File uploaded', project: 'Business Website', time: '6 hours ago', type: 'default' },
                { action: 'Payment processed', project: 'Landing Page', time: '1 day ago', type: 'success' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.project} • {activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}