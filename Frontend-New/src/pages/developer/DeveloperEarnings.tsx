import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  Clock,
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { developerApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export function DeveloperEarnings() {
  const { data: earnings } = useQuery({
    queryKey: ['developer-earnings'],
    queryFn: () => developerApi.get('/api/earnings'),
  })

  const { data: earningsStats } = useQuery({
    queryKey: ['developer-earnings-stats'],
    queryFn: () => developerApi.get('/api/earnings/stats'),
  })

  const { data: payments } = useQuery({
    queryKey: ['developer-payments'],
    queryFn: () => developerApi.get('/api/earnings/payments'),
  })

  const earningsData = earnings?.data?.data
  const statsData = earningsStats?.data?.data
  const paymentsData = payments?.data?.data

  const earningsCards = [
    {
      title: 'Total Earnings',
      value: formatCurrency(earningsData?.totalEarnings || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12% this month'
    },
    {
      title: 'This Month',
      value: formatCurrency(earningsData?.thisMonth || 0),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8% from last month'
    },
    {
      title: 'Pending Payout',
      value: formatCurrency(earningsData?.pendingPayout || 0),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 'Available for withdrawal'
    },
    {
      title: 'Hourly Rate',
      value: formatCurrency(earningsData?.averageHourlyRate || 0),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'Average rate'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your income and payment history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {earningsCards.map((card, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2">
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

        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Earnings Goal</span>
                  <span>{formatCurrency(50000)}</span>
                </div>
                <Progress value={75} />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(37500)} of {formatCurrency(50000)}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Projects Goal</span>
                  <span>5 projects</span>
                </div>
                <Progress value={60} />
                <p className="text-xs text-gray-500 mt-1">3 of 5 projects</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Hours Goal</span>
                  <span>160 hours</span>
                </div>
                <Progress value={80} />
                <p className="text-xs text-gray-500 mt-1">128 of 160 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <CardDescription>Your recent payments and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentsData?.map((payment: any) => (
              <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payment.createdAt)} • {payment.projectTitle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +{formatCurrency(payment.amount)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}

            {(!paymentsData || paymentsData.length === 0) && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No payment history yet</p>
                <p className="text-sm text-gray-500">Complete projects to start earning</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-medium">Top Performer</h3>
              <p className="text-sm text-gray-600">Completed 10+ projects</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">5-Star Rating</h3>
              <p className="text-sm text-gray-600">Maintained excellent reviews</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium">On-Time Delivery</h3>
              <p className="text-sm text-gray-600">95% on-time completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}