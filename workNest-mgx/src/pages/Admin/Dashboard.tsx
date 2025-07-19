import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { AdminDashboardStats, Project, User, ActivityItem } from "@/types";
import { AdminLayout } from "@/components/layouts/AdminLayout";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  FolderOpen,
  Users,
  Code,
  Percent
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock revenue data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 25000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 30000 },
    { month: 'Jun', revenue: 35000 },
  ];

  // Mock user growth data
  const userGrowthData = [
    { month: 'Jan', clients: 20, developers: 8 },
    { month: 'Feb', clients: 28, developers: 12 },
    { month: 'Mar', clients: 32, developers: 15 },
    { month: 'Apr', clients: 45, developers: 20 },
    { month: 'May', clients: 60, developers: 25 },
    { month: 'Jun', clients: 80, developers: 35 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Mock data since the backend isn't connected
        const statsData = {
          totalProjects: 120,
          activeProjects: 45,
          completedProjects: 68,
          pendingRevisions: 15,
          unreadNotifications: 8,
          unreadMessages: 12,
          totalUsers: 210,
          totalDevelopers: 50,
          totalRevenue: 280000,
          userGrowth: 18,
          developerGrowth: 12,
          projectGrowth: 24,
        };
        setStats(statsData);

        // Mock recent projects
        const projectsData = [
          {
            id: "1",
            title: "E-commerce Website",
            description: "A full-featured online store with payment processing",
            projectType: "ecommerce",
            budget: 25000,
            status: "in_progress",
            createdAt: "2023-06-15T08:30:00Z",
            updatedAt: "2023-06-20T10:15:00Z",
            clientId: "client_id1",
            developerId: "dev_id1",
            progress: 65,
          },
          {
            id: "2",
            title: "Company Portfolio",
            description: "Professional company portfolio website",
            projectType: "portfolio",
            budget: 12000,
            status: "pending",
            createdAt: "2023-06-19T09:45:00Z",
            updatedAt: "2023-06-19T09:45:00Z",
            clientId: "client_id2",
          },
          {
            id: "3",
            title: "Blog Platform",
            description: "Custom blog platform with content management",
            projectType: "blog",
            budget: 18000,
            status: "completed",
            createdAt: "2023-06-10T11:20:00Z",
            updatedAt: "2023-06-18T14:30:00Z",
            clientId: "client_id3",
            developerId: "dev_id2",
            progress: 100,
          },
          {
            id: "4",
            title: "Restaurant Booking System",
            description: "Online booking and reservation management system",
            projectType: "booking",
            budget: 18000,
            status: "in_progress",
            createdAt: "2023-06-05T13:20:00Z",
            updatedAt: "2023-06-17T09:45:00Z",
            clientId: "client_id4",
            developerId: "dev_id3",
            progress: 40,
          },
        ] as Project[];
        setRecentProjects(projectsData);

        // Mock recent users
        const usersData = [
          {
            id: "user1",
            name: "John Smith",
            email: "john.smith@example.com",
            role: "client",
            isVerified: true,
          },
          {
            id: "user2",
            name: "Emma Johnson",
            email: "emma.johnson@example.com",
            role: "client",
            isVerified: true,
          },
          {
            id: "user3",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            role: "developer",
            isVerified: true,
          },
          {
            id: "user4",
            name: "Sarah Davis",
            email: "sarah.davis@example.com",
            role: "client",
            isVerified: false,
          },
          {
            id: "user5",
            name: "Alex Wilson",
            email: "alex.wilson@example.com",
            role: "developer",
            isVerified: true,
          },
        ] as User[];
        setRecentUsers(usersData);

        // Mock recent activities
        const activitiesData = [
          {
            id: "1",
            type: "new_user",
            description: "New client registered: Sarah Davis",
            userId: "user4",
            createdAt: "2023-06-20T15:30:00Z",
          },
          {
            id: "2",
            type: "new_project",
            description: "New project created: Company Portfolio",
            projectId: "2",
            userId: "client_id2",
            createdAt: "2023-06-19T11:45:00Z",
          },
          {
            id: "3",
            type: "project_completed",
            description: "Project completed: Blog Platform",
            projectId: "3",
            userId: "dev_id2",
            createdAt: "2023-06-18T09:20:00Z",
          },
          {
            id: "4",
            type: "payment_processed",
            description: "Payment processed: $4,500 for Restaurant Booking milestone",
            projectId: "4",
            createdAt: "2023-06-17T14:10:00Z",
          },
          {
            id: "5",
            type: "user_verified",
            description: "Developer verified: Alex Wilson",
            userId: "user5",
            createdAt: "2023-06-16T10:05:00Z",
          },
        ] as ActivityItem[];
        setActivities(activitiesData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'client':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Client</Badge>;
      case 'developer':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Developer</Badge>;
      case 'admin':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Function to get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_user':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'new_project':
        return <FolderOpen className="w-4 h-4 text-green-500" />;
      case 'project_completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'payment_processed':
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      case 'user_verified':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Platform overview and statistics
            </p>
          </div>
          <Link to="/admin/settings">
            <Button variant="outline">
              Platform Settings
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
            </>
          ) : (
            <>
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <div className="flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    <p className="text-xs text-green-500">
                      +{stats?.userGrowth || 0}% from last month
                    </p>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              </Card>
              
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Developers</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalDevelopers || 0}</div>
                  <div className="flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    <p className="text-xs text-green-500">
                      +{stats?.developerGrowth || 0}% from last month
                    </p>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              </Card>
              
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
                  <div className="flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    <p className="text-xs text-green-500">
                      +{stats?.projectGrowth || 0}% from last month
                    </p>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              </Card>
              
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.activeProjects || 0} active, {stats?.completedProjects || 0} completed
                  </p>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              </Card>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-80 rounded-md" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Client and developer registration trends</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <Skeleton className="h-80 rounded-md" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userGrowthData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip />
                      <Bar dataKey="clients" name="Clients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="developers" name="Developers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest projects on the platform</CardDescription>
            </div>
            <Link to="/admin/projects">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 rounded-md" />
            ) : recentProjects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Client/Developer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Link to={`/admin/projects/${project.id}`} className="hover:underline">
                          {project.title}
                        </Link>
                      </TableCell>
                      <TableCell>{formatCurrency(project.budget)}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            {project.clientId.replace('client_id', 'C')}
                          </Badge>
                          {project.developerId && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                              {project.developerId.replace('dev_id', 'D')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No projects yet</h3>
                <p className="text-sm text-muted-foreground">
                  Projects will appear here once created
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users and Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Recently registered users</CardDescription>
              </div>
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 rounded-md" />
                  <Skeleton className="h-12 rounded-md" />
                  <Skeleton className="h-12 rounded-md" />
                </div>
              ) : recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(user.role)}
                        {!user.isVerified && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No users yet</h3>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>Recent actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-14 rounded-md" />
                  <Skeleton className="h-14 rounded-md" />
                  <Skeleton className="h-14 rounded-md" />
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="space-y-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No activity yet</h3>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-24 rounded-md" />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Retention</span>
                    <span className="text-sm font-bold">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Percentage of users who return within 30 days
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project Completion Rate</span>
                    <span className="text-sm font-bold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Percentage of projects successfully completed
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Developer Success Rate</span>
                    <span className="text-sm font-bold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Percentage of developers with positive ratings
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}