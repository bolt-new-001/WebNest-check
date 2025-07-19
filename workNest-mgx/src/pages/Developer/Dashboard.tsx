import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DashboardStats, Project, ActivityItem, Notification } from "@/types";
import { DeveloperLayout } from "@/components/layouts/DeveloperLayout";

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
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  FileEdit,
  FolderOpen,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [earnings, setEarnings] = useState({
    totalEarned: 24500,
    thisMonth: 4200,
    pending: 1500,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Mock data since the backend isn't connected
        // Fetch dashboard stats
        const statsData = {
          totalProjects: 8,
          activeProjects: 3,
          completedProjects: 4,
          pendingRevisions: 2,
          unreadNotifications: 5,
          unreadMessages: 3,
        };
        setStats(statsData);

        // Fetch active projects
        const projectsData = [
          {
            id: "1",
            title: "E-commerce Website",
            description: "A full-featured online store with payment processing",
            projectType: "ecommerce",
            budget: 25000,
            status: "in_progress",
            createdAt: "2023-05-15T08:30:00Z",
            updatedAt: "2023-05-20T10:15:00Z",
            clientId: "client_id1",
            developerId: "dev_id",
            progress: 65,
          },
          {
            id: "4",
            title: "Restaurant Booking System",
            description: "Online booking and reservation management system",
            projectType: "booking",
            budget: 18000,
            status: "in_progress",
            createdAt: "2023-06-05T13:20:00Z",
            updatedAt: "2023-06-10T09:45:00Z",
            clientId: "client_id2",
            developerId: "dev_id",
            progress: 40,
          },
          {
            id: "6",
            title: "Social Media Dashboard",
            description: "Analytics and management dashboard for social media",
            projectType: "dashboard",
            budget: 15000,
            status: "in_progress",
            createdAt: "2023-06-20T11:30:00Z",
            updatedAt: "2023-06-22T16:15:00Z",
            clientId: "client_id3",
            developerId: "dev_id",
            progress: 25,
          },
        ] as Project[];
        setActiveProjects(projectsData);

        // Fetch recent activities
        const activitiesData = [
          {
            id: "1",
            type: "milestone_completed",
            description: "You completed the Homepage design milestone",
            projectId: "1",
            userId: "dev_id",
            createdAt: "2023-06-19T15:30:00Z",
          },
          {
            id: "2",
            type: "comment_added",
            description: "Client commented on your product page design",
            projectId: "1",
            userId: "client_id1",
            createdAt: "2023-06-18T11:45:00Z",
          },
          {
            id: "3",
            type: "revision_requested",
            description: "Client requested revision for checkout flow",
            projectId: "1",
            userId: "client_id1",
            createdAt: "2023-06-17T09:20:00Z",
          },
          {
            id: "4",
            type: "payment_received",
            description: "You received payment for Restaurant Booking milestone",
            projectId: "4",
            userId: "system",
            createdAt: "2023-06-16T14:10:00Z",
          },
        ] as ActivityItem[];
        setActivities(activitiesData);

        // Fetch notifications
        const notificationsData = [
          {
            id: "1",
            title: "New Milestone Added",
            message: "A new milestone has been added to E-commerce project",
            type: "milestone",
            isRead: false,
            createdAt: "2023-06-19T15:30:00Z",
            userId: "dev_id",
            link: "/developer/projects/1",
          },
          {
            id: "2",
            title: "New Message",
            message: "You have a new message from client regarding Restaurant Booking",
            type: "message",
            isRead: false,
            createdAt: "2023-06-18T11:45:00Z",
            userId: "dev_id",
            link: "/developer/chat/4",
          },
          {
            id: "3",
            title: "Deadline Approaching",
            message: "The milestone deadline is in 2 days for Social Media Dashboard",
            type: "deadline",
            isRead: false,
            createdAt: "2023-06-17T09:20:00Z",
            userId: "dev_id",
            link: "/developer/projects/6",
          },
          {
            id: "4",
            title: "Payment Received",
            message: "You received $3,500 for completing the Restaurant Booking milestone",
            type: "payment",
            isRead: false,
            createdAt: "2023-06-16T14:10:00Z",
            userId: "dev_id",
            link: "/developer/earnings",
          },
          {
            id: "5",
            title: "New Project Available",
            message: "A new project matching your skills is available for bidding",
            type: "project",
            isRead: false,
            createdAt: "2023-06-15T10:05:00Z",
            userId: "dev_id",
            link: "/developer/projects/available",
          },
        ] as Notification[];
        setNotifications(notificationsData);

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

  // Function to get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone_completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'comment_added':
        return <FileEdit className="w-4 h-4 text-blue-500" />;
      case 'revision_requested':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Function to get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'message':
        return <FileEdit className="w-5 h-5 text-blue-500" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-purple-500" />;
      case 'project':
        return <FolderOpen className="w-5 h-5 text-indigo-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <DeveloperLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'Developer'}
            </p>
          </div>
          <Link to="/developer/portfolio">
            <Button variant="outline">
              Edit Portfolio
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.totalProjects || 0} total projects
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings This Month</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(earnings.thisMonth)}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(earnings.pending)} pending
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Revisions</CardTitle>
                  <FileEdit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pendingRevisions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Needs your attention
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.unreadNotifications || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.unreadMessages || 0} unread messages
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Current Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Current Projects</CardTitle>
              <CardDescription>Your active projects and their progress</CardDescription>
            </div>
            <Link to="/developer/projects">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 rounded-md" />
                <Skeleton className="h-20 rounded-md" />
                <Skeleton className="h-20 rounded-md" />
              </div>
            ) : activeProjects.length > 0 ? (
              <div className="space-y-6">
                {activeProjects.map((project) => (
                  <div key={project.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Link to={`/developer/projects/${project.id}`} className="font-medium hover:underline">
                        {project.title}
                      </Link>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(project.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link to={`/developer/projects/${project.id}`} className="w-full">View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link to={`/developer/chat/${project.id}`} className="w-full">Message Client</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link to={`/developer/time-tracking/${project.id}`} className="w-full">Track Time</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Budget: {formatCurrency(project.budget)} • Last updated: {formatDate(project.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No active projects</h3>
                <p className="text-sm text-muted-foreground">
                  Check available projects or update your portfolio to attract clients
                </p>
                <Link to="/developer/projects/available" className="mt-4">
                  <Button size="sm">
                    Find Projects
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings and Activities */}
        <div className="grid gap-4 md:grid-cols-7">
          {/* Earnings Card */}
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your financial summary</CardDescription>
              </div>
              <Link to="/developer/earnings">
                <Button variant="outline" size="sm">Details</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-14 rounded-md" />
                  <Skeleton className="h-14 rounded-md" />
                  <Skeleton className="h-14 rounded-md" />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Earnings</span>
                      <span className="text-xl font-bold">{formatCurrency(earnings.totalEarned)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Month</span>
                      <span className="text-lg font-medium">{formatCurrency(earnings.thisMonth)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-lg font-medium text-yellow-600">{formatCurrency(earnings.pending)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Growth</span>
                      <span className="text-sm font-medium text-green-600">+24%</span>
                    </div>
                    <Progress value={24} className="h-2" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your projects</CardDescription>
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
                  <p className="text-sm text-muted-foreground">
                    Activities will appear here as you work on projects
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Your recent notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 rounded-md" />
                <Skeleton className="h-16 rounded-md" />
                <Skeleton className="h-16 rounded-md" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Link
                    to={notification.link || "#"}
                    key={notification.id}
                    className={`flex items-start p-3 space-x-4 rounded-lg border ${
                      !notification.isRead
                        ? "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-800/30"
                        : ""
                    } hover:bg-accent transition-colors`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DeveloperLayout>
  );
}