import { useQuery } from '@tanstack/react-query'
import { 
  BarChart3,
  Plus
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Button 
} from '@/components/ui/button'
import { 
  Badge 
} from '@/components/ui/badge'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ApexCharts } from 'react-apexcharts'

interface Activity {
  id: string
  description: string
  timestamp: string
  icon: JSX.Element
}

interface Metric {
  id: string
  name: string
  description: string
  value: string
  progress: number
  color: string
}

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

  const { data: budgetStats } = useQuery({
    queryKey: ['budget-stats'],
    queryFn: () => clientApi.getBudgetStatistics(),
  })

  const projectTimelineData = {
    series: [{
      name: 'Progress',
      data: [25, 40, 60, 75, 100]
    }],
    options: {
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#3b82f6'],
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
      },
      yaxis: {
        min: 0,
        max: 100
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#60a5fa'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    }
  }

  const budgetBreakdown = {
    series: [44, 55, 13, 43],
    options: {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
      labels: ['Development', 'Design', 'Testing', 'Deployment'],
      legend: {
        position: 'bottom'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>Your project and team performance at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Welcome Back!</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date())}
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Badge variant="outline" className="rounded-full bg-green-100 text-green-600">
              {overview?.activeProjects}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.projectCompletion}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Badge variant="outline" className="rounded-full bg-blue-100 text-blue-600">
              {overview?.teamSize}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.activeTeamMembers}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.teamEfficiency}% efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <Badge variant="outline" className="rounded-full bg-purple-100 text-purple-600">
              {overview?.budgetEfficiency}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview?.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Budget utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Badge variant="outline" className="rounded-full bg-yellow-100 text-yellow-600">
              {overview?.satisfaction}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.positiveReviews}</div>
            <p className="text-xs text-muted-foreground">
              Client satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline Progress</CardTitle>
          <CardDescription>Track project progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ApexCharts options={projectTimelineData.options} series={projectTimelineData.series} />
          </div>
        </CardContent>
      </Card>

      {/* Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>See where your budget is being spent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ApexCharts options={budgetBreakdown.options} series={budgetBreakdown.series} />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest project activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectStats?.recentActivity.map((activity: Activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.description}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamStats?.metrics.map((metric: Metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{metric.name}</h3>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                  <Badge variant="outline" className={`rounded-full ${metric.color}`}>
                    {metric.value}
                  </Badge>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
