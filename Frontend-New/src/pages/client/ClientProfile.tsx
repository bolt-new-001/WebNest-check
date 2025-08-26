import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Edit,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  Crown,
  TrendingUp,
  Award,
  Clock,
  Settings,
  BarChart3,
  Activity,
  Shield,
  Download,
  Copy,
  ExternalLink,
  Plus,
  Eye,
  ChevronRight,
  Zap,
  Target,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { getInitials } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export function ClientProfile() {
  const { user, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: profile, isLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?._id],
    queryFn: async () => {
      const response = await fetch('/api/client/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      updateUser(data)
      return data
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  })

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['profile-stats', user?._id],
    queryFn: async () => {
      const response = await fetch('/api/client/profile/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
    staleTime: 1000 * 60 * 2 // 2 minutes
  })

  const { data: recentActivity } = useQuery({
    queryKey: ['profile-activity', user?._id],
    queryFn: async () => {
      const response = await fetch('/api/client/profile/activity')
      if (!response.ok) throw new Error('Failed to fetch activity')
      return response.json()
    }
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update profile')
      return response.json()
    },
    onSuccess: async (data) => {
      updateUser(data)
      await refetchProfile()
      await refetchStats()
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile')
    }
  })

  const copyProfileLink = () => {
    if (!user?._id) {
      toast.error('User ID not found. Please try again.')
      return
    }
    const profileUrl = `${window.location.origin}/client/profile/${user._id}`
    navigator.clipboard.writeText(profileUrl)
    toast.success('Public profile link copied to clipboard')
  }

  // Add this CSS for the fade-in animation
  const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`

  // Inject styles if not already present
  if (typeof document !== 'undefined' && !document.getElementById('profile-animations')) {
    const styleSheet = document.createElement('style')
    styleSheet.id = 'profile-animations'
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ScrollArea className="h-full">
        <div className="container mx-auto py-6 space-y-8 max-w-7xl">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Manage your account information and view your activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyProfileLink}
                className="hover:bg-primary/10 transition-all duration-300"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={() => navigate('/client/settings')}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </div>

          {/* Enhanced Profile Header Card */}
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 ring-4 ring-offset-4 ring-primary/20 shadow-2xl transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-105">
                      <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/10">
                        {user?.name ? getInitials(user.name) : <User className="h-12 w-12" />}
                      </AvatarFallback>
                    </Avatar>
                    {user?.isPremium && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-pulse">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/client/settings')}
                    className="hover:bg-primary/10 transition-all duration-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Photo
                  </Button>
                </div>

                {/* Profile Information */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{user?.name}</h2>
                      {user?.isEmailVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={user?.isPremium ? 'default' : 'secondary'}
                        className={`flex items-center gap-1 px-3 py-1 ${user?.isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : ''}`}
                      >
                        {user?.isPremium && <Crown className="h-3 w-3" />}
                        {user?.isPremium ? 'Premium Member' : 'Basic Member'}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>

                      {user?.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {user?.company && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-sm text-muted-foreground">{user.company}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Join Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-lg rounded-2xl border shadow-lg p-2">
              <TabsList className="grid w-full grid-cols-4 gap-1 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Overview</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Statistics</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Activity</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="flex items-center justify-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm font-medium">Projects</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Account Status */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Account Status</CardTitle>
                        <CardDescription>Your membership and verification status</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">Account Type</span>
                      <Badge variant={user?.isPremium ? 'default' : 'secondary'} className="px-3 py-1">
                        {user?.isPremium ? 'Premium' : 'Basic'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">Email Status</span>
                      <Badge variant={user?.isEmailVerified ? 'default' : 'destructive'} className="px-3 py-1">
                        {user?.isEmailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>

                    {user?.isPremium && user?.premiumExpiresAt && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-yellow-800">Premium Expires</span>
                          <span className="text-sm font-medium text-yellow-700">
                            {new Date(user.premiumExpiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {!user?.isPremium && (
                      <Button
                        onClick={() => navigate('/client/premium')}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Quick Stats</CardTitle>
                        <CardDescription>Your project and activity summary</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Total Projects</span>
                        </div>
                        <p className="text-xl font-bold text-blue-800 mt-1">{stats?.data?.totalProjects || 0}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Completed</span>
                        </div>
                        <p className="text-xl font-bold text-green-800 mt-1">{stats?.data?.completedProjects || 0}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Project Completion Rate</span>
                        <span className="font-semibold">
                          {stats?.data?.totalProjects > 0
                            ? Math.round((stats?.data?.completedProjects / stats?.data?.totalProjects) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress
                        value={stats?.data?.totalProjects > 0
                          ? (stats?.data?.completedProjects / stats?.data?.totalProjects) * 100
                          : 0}
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{stats?.data?.averageRating || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Quick Actions</CardTitle>
                        <CardDescription>Frequently used actions and shortcuts</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/10 transition-all duration-300"
                      onClick={() => navigate('/client/add-project')}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Create New Project
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/10 transition-all duration-300"
                      onClick={() => navigate('/client/projects')}
                    >
                      <Briefcase className="h-4 w-4 mr-3" />
                      View All Projects
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/10 transition-all duration-300"
                      onClick={() => navigate('/client/support')}
                    >
                      <ExternalLink className="h-4 w-4 mr-3" />
                      Contact Support
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>

                    <Separator className="my-4" />

                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/10 transition-all duration-300"
                      onClick={() => navigate('/client/settings/export-data')}
                    >
                      <Download className="h-4 w-4 mr-3" />
                      Export Account Data
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: 'Total Projects',
                    value: stats?.data?.totalProjects || 0,
                    icon: TrendingUp,
                    color: 'blue',
                    change: '+12%'
                  },
                  {
                    title: 'Completed',
                    value: stats?.data?.completedProjects || 0,
                    icon: Award,
                    color: 'green',
                    change: '+8%'
                  },
                  {
                    title: 'Active',
                    value: stats?.data?.activeProjects || 0,
                    icon: Clock,
                    color: 'orange',
                    change: '+5%'
                  },
                  {
                    title: 'Total Spent',
                    value: `$${stats?.data?.totalSpent?.toFixed(2) || '0.00'}`,
                    icon: Target,
                    color: 'purple',
                    change: '+15%'
                  }
                ].map((stat, index) => (
                  <Card
                    key={stat.title}
                    className="group overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both',
                      animationName: 'fadeInUp'
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <div className="flex items-center gap-1">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                stat.color === 'green' ? 'bg-green-100 text-green-700' :
                                  stat.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                    'bg-purple-100 text-purple-700'
                              }`}>
                              {stat.change} from last month
                            </span>
                          </div>
                        </div>
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-100' :
                            stat.color === 'green' ? 'bg-green-100' :
                              stat.color === 'orange' ? 'bg-orange-100' :
                                'bg-purple-100'
                          } group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`h-6 w-6 ${stat.color === 'blue' ? 'text-blue-600' :
                              stat.color === 'green' ? 'text-green-600' :
                                stat.color === 'orange' ? 'text-orange-600' :
                                  'text-purple-600'
                            }`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Enhanced Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                        <CardDescription>Your recent account activity and updates</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        type: 'profile_view',
                        title: 'Profile viewed',
                        time: 'Just now',
                        icon: Eye,
                        color: 'blue'
                      },
                      {
                        type: 'settings_update',
                        title: 'Account settings updated',
                        time: '2 hours ago',
                        icon: Settings,
                        color: 'green'
                      },
                      {
                        type: 'project_created',
                        title: 'New project created',
                        time: '1 day ago',
                        icon: Plus,
                        color: 'purple'
                      },
                      {
                        type: 'account_created',
                        title: 'Account created',
                        time: new Date(user?.createdAt || Date.now()).toLocaleDateString(),
                        icon: User,
                        color: 'orange'
                      }
                    ].map((activity, index) => (
                      <div
                        key={activity.type}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all duration-300 group"
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${activity.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                            activity.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                              activity.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                                'bg-orange-100 group-hover:bg-orange-200'
                          }`}>
                          <activity.icon className={`h-5 w-5 ${activity.color === 'blue' ? 'text-blue-600' :
                              activity.color === 'green' ? 'text-green-600' :
                                activity.color === 'purple' ? 'text-purple-600' :
                                  'text-orange-600'
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Projects */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Recent Projects</CardTitle>
                          <CardDescription>Your latest project activities</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/client/projects')}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {stats?.data?.totalProjects > 0 ? (
                        // Mock recent projects - replace with real data
                        [
                          {
                            id: 1,
                            title: 'Website Redesign',
                            status: 'In Progress',
                            progress: 75,
                            dueDate: '2024-02-15'
                          },
                          {
                            id: 2,
                            title: 'Mobile App Development',
                            status: 'Completed',
                            progress: 100,
                            dueDate: '2024-01-30'
                          },
                          {
                            id: 3,
                            title: 'Brand Identity Design',
                            status: 'Pending',
                            progress: 25,
                            dueDate: '2024-03-01'
                          }
                        ].map((project) => (
                          <div
                            key={project.id}
                            className="p-4 rounded-lg border bg-gradient-to-r from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all duration-300 group cursor-pointer"
                            onClick={() => navigate(`/client/projects/${project.id}`)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                                {project.title}
                              </h4>
                              <Badge
                                variant={
                                  project.status === 'Completed' ? 'default' :
                                    project.status === 'In Progress' ? 'secondary' :
                                      'outline'
                                }
                                className="text-xs"
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                <ChevronRight className="h-3 w-3 group-hover:text-primary transition-colors duration-200" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">No projects yet</p>
                          <Button
                            onClick={() => navigate('/client/add-project')}
                            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Project
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Analytics */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Project Analytics</CardTitle>
                        <CardDescription>Performance insights and trends</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Success Rate */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Project Success Rate</span>
                          <span className="text-muted-foreground">
                            {stats?.data?.totalProjects > 0
                              ? Math.round((stats?.data?.completedProjects / stats?.data?.totalProjects) * 100)
                              : 0}%
                          </span>
                        </div>
                        <Progress
                          value={stats?.data?.totalProjects > 0
                            ? (stats?.data?.completedProjects / stats?.data?.totalProjects) * 100
                            : 0}
                          className="h-3"
                        />
                      </div>

                      {/* Average Rating */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Average Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= (stats?.data?.averageRating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                                }`}
                            />
                          ))}
                          <span className="ml-2 font-bold">{stats?.data?.averageRating || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Monthly Summary */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <p className="text-xs font-medium text-blue-700">This Month</p>
                          <p className="text-lg font-bold text-blue-800">
                            {stats?.data?.thisMonthProjects || 0}
                          </p>
                          <p className="text-xs text-blue-600">Projects</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-xs font-medium text-green-700">Total Spent</p>
                          <p className="text-lg font-bold text-green-800">
                            ${stats?.data?.totalSpent?.toFixed(0) || '0'}
                          </p>
                          <p className="text-xs text-green-600">All Time</p>
                        </div>
                      </div>

                      <Separator />

                      <Button
                        variant="outline"
                        className="w-full justify-center hover:bg-primary/10 transition-all duration-300"
                        onClick={() => navigate('/client/analytics')}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Detailed Analytics
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
