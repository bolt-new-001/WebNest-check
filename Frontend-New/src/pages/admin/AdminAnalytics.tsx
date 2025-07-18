import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Calendar, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { adminApi } from '@/lib/api'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'

// Note: In a real implementation, you would use a charting library like recharts, chart.js, or visx
// This is a simplified version with mock chart components

const MockBarChart = () => (
  <div className="h-[200px] w-full flex items-end justify-between space-x-2 pb-2">
    {[40, 25, 60, 75, 45, 65, 80, 55, 70, 85, 60, 75].map((height, i) => (
      <div key={i} className="relative group">
        <div 
          className="w-8 bg-red-500 rounded-t hover:bg-red-600 transition-all duration-200" 
          style={{ height: `${height}%` }}
        />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {height}%
        </div>
      </div>
    ))}
  </div>
)

const MockLineChart = () => (
  <div className="h-[200px] w-full relative">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path 
        d="M0,50 L10,45 L20,60 L30,40 L40,45 L50,30 L60,35 L70,20 L80,30 L90,15 L100,25" 
        fill="none" 
        stroke="#ef4444" 
        strokeWidth="2"
      />
      <path 
        d="M0,50 L10,45 L20,60 L30,40 L40,45 L50,30 L60,35 L70,20 L80,30 L90,15 L100,25" 
        fill="url(#gradient)" 
        fillOpacity="0.2" 
        stroke="none"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

const MockPieChart = () => (
  <div className="h-[200px] w-full flex items-center justify-center">
    <svg width="200" height="200" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#ef4444" />
      <circle cx="50" cy="50" r="30" fill="#fca5a5" />
      <circle cx="50" cy="50" r="20" fill="#fecaca" />
    </svg>
    <div className="absolute flex flex-col items-center">
      <span className="text-2xl font-bold">65%</span>
      <span className="text-sm text-gray-500">Conversion</span>
    </div>
  </div>
)

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('month')
  const [dataType, setDataType] = useState('users')

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics', { timeRange, dataType }],
    queryFn: () => adminApi.get(`/api/analytics?timeRange=${timeRange}&dataType=${dataType}`),
  })

  const data = analyticsData?.data?.data || {
    overview: {
      totalUsers: 12458,
      activeUsers: 8976,
      totalRevenue: 287650,
      conversionRate: 8.4,
      averageSessionTime: 340,
      bounceRate: 32.5,
    },
    growth: {
      users: 12.5,
      revenue: 18.2,
      packages: 7.8,
      projects: 15.3,
    },
    topSources: [
      { name: 'Direct', value: 35 },
      { name: 'Organic Search', value: 25 },
      { name: 'Referral', value: 20 },
      { name: 'Social Media', value: 15 },
      { name: 'Email', value: 5 },
    ],
    topCountries: [
      { name: 'United States', value: 40 },
      { name: 'India', value: 15 },
      { name: 'United Kingdom', value: 12 },
      { name: 'Germany', value: 8 },
      { name: 'Canada', value: 6 },
    ],
    revenueByMonth: [
      { month: 'Jan', value: 18500 },
      { month: 'Feb', value: 21200 },
      { month: 'Mar', value: 19800 },
      { month: 'Apr', value: 24500 },
      { month: 'May', value: 22300 },
      { month: 'Jun', value: 28100 },
      { month: 'Jul', value: 26700 },
      { month: 'Aug', value: 29400 },
      { month: 'Sep', value: 32100 },
      { month: 'Oct', value: 30800 },
      { month: 'Nov', value: 34500 },
      { month: 'Dec', value: 38700 },
    ],
  }

  const timeRangeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Time Range:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map((option) => (
                <Button 
                  key={option.value}
                  variant={timeRange === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalUsers)}</p>
                    <Badge className="bg-green-100 text-green-800">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {data.growth.users}%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Active Users</span>
                  <span>{formatNumber(data.overview.activeUsers)}</span>
                </div>
                <Progress value={(data.overview.activeUsers / data.overview.totalUsers) * 100} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</p>
                    <Badge className="bg-green-100 text-green-800">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {data.growth.revenue}%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <div className="flex items-end space-x-1 h-full">
                  {data.revenueByMonth.slice(-6).map((month, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-green-200 rounded-t" 
                      style={{ 
                        height: `${(month.value / 40000) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold">{data.overview.conversionRate}%</p>
                    <Badge className="bg-red-100 text-red-800">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      2.1%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${data.overview.conversionRate}%` }}
                  />
                </div>
                <span className="ml-2 text-xs text-gray-500">Target: 10%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Package Downloads</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold">12,845</p>
                    <Badge className="bg-green-100 text-green-800">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {data.growth.packages}%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-1">
                {[35, 42, 38, 50, 45, 55, 60, 48, 58, 65].map((value, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-purple-200 rounded-sm" 
                    style={{ height: `${value / 10}px` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <MockBarChart />
            <div className="flex justify-center mt-4 space-x-8">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                <div key={month} className="text-xs text-gray-500">{month}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>User acquisition over time</CardDescription>
          </CardHeader>
          <CardContent>
            <MockLineChart />
            <div className="flex justify-between mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <span className="text-sm">New Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                <span className="text-sm">Returning Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <span className="text-sm">Premium Users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your users are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <MockPieChart />
            </div>
            <div className="mt-4 space-y-2">
              {data.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                    />
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>User distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topCountries.map((country, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{country.name}</span>
                    <span className="text-sm font-medium">{country.value}%</span>
                  </div>
                  <Progress value={country.value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Behavior</CardTitle>
            <CardDescription>Key metrics about user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Avg. Session Time</span>
                  <span className="text-sm font-medium">{Math.floor(data.overview.averageSessionTime / 60)}m {data.overview.averageSessionTime % 60}s</span>
                </div>
                <Progress value={(data.overview.averageSessionTime / 600) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="text-sm font-medium">{data.overview.bounceRate}%</span>
                </div>
                <Progress value={data.overview.bounceRate} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Pages Per Session</span>
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">New vs Returning</span>
                  <span className="text-sm font-medium">68% / 32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-l-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}