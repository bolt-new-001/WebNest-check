import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Code2,
  BarChart3,
  PieChart,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { clientApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ApexCharts } from 'react-apexcharts'

export function ClientAnalytics() {
  const { data: analytics } = useQuery({
    queryKey: ['client-analytics'],
    queryFn: () => clientApi.getProjectAnalytics(),
  })

  const { data: projectStats } = useQuery({
    queryKey: ['project-stats'],
    queryFn: () => clientApi.getProjectStatistics(),
  })

  const { data: teamMetrics } = useQuery({
    queryKey: ['team-metrics'],
    queryFn: () => clientApi.getTeamPerformance(),
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
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
            <Badge variant="outline" className="rounded-full bg-green-100 text-green-600">
              {analytics?.projectCompletion}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.completedProjects} / {analytics?.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.projectCompletion}% of projects completed on time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Efficiency</CardTitle>
            <Badge variant="outline" className="rounded-full bg-blue-100 text-blue-600">
              {analytics?.budgetEfficiency}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.budgetEfficiency}% budget utilization rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <Badge variant="outline" className="rounded-full bg-purple-100 text-purple-600">
              {analytics?.teamPerformance}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activeTeamMembers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.teamPerformance}% team efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Badge variant="outline" className="rounded-full bg-yellow-100 text-yellow-600">
              {analytics?.satisfaction}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.positiveReviews}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.satisfaction}% client satisfaction rate
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

      {/* Team Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMetrics?.metrics.map((metric) => (
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest project activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectStats?.recentActivity.map((activity) => (
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
    </div>
  )
}
