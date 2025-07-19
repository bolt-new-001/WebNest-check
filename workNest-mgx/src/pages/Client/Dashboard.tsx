import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DashboardStats, Project, ActivityItem, Notification } from "@/types";
import { ClientLayout } from "@/components/layouts/ClientLayout";

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
  FileEdit,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be actual API calls
        // For now, we'll use mock data since the backend isn't connected

        // Fetch dashboard stats
        const statsData = {
          totalProjects: 5,
          activeProjects: 3,
          completedProjects: 1,
          pendingRevisions: 2,
          unreadNotifications: 4,
          unreadMessages: 2,
        };
        setStats(statsData);

        // Fetch recent projects
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
            clientId: "user_id",
            developerId: "dev_id",
            progress: 65,
          },
          {
            id: "2",
            title: "Company Portfolio",
            description: "Professional company portfolio website",
            projectType: "portfolio",
            budget: 12000,
            status: "pending",
            createdAt: "2023-06-01T09:45:00Z",
            updatedAt: "2023-06-01T09:45:00Z",
            clientId: "user_id",
          },
          {
            id: "3",
            title: "Blog Platform",
            description: "Custom blog platform with content management",
            projectType: "blog",
            budget: 18000,
            status: "completed",
            createdAt: "2023-02-10T11:20:00Z",
            updatedAt: "2023-04-15T14:30:00Z",
            clientId: "user_id",
            developerId: "dev_id",
            progress: 100,
          },
        ] as Project[];
        setRecentProjects(projectsData);

        // Fetch recent activities
        const activitiesData = [
          {
            id: "1",
            type: "milestone_completed",
            description: "Homepage design completed",
            projectId: "1",
            userId: "dev_id",
            createdAt: "2023-05-19T15:30:00Z",
          },
          {
            id: "2",
            type: "comment_added",
            description: "New comment added to your project",
            projectId: "1",
            userId: "dev_id",
            createdAt: "2023-05-18T11:45:00Z",
          },
          {
            id: "3",
            type: "revision_requested",
            description: "Revision requested for product page",
            projectId: "1",
            userId: "user_id",
            createdAt: "2023-05-17T09:20:00Z",
          },
        ] as ActivityItem[];
        setActivities(activitiesData);

        // Fetch notifications
        const notificationsData = [
          {
            id: "1",
            title: "Milestone Completed",
            message: "Homepage design has been completed",
            type: "milestone",
            isRead: false,
            createdAt: "2023-05-19T15:30:00Z",
            userId: "user_id",
            link: "/projects/1",
          },
          {
            id: "2",
            title: "New Message",
            message: "You have a new message from the developer",
            type: "message",
            isRead: false,
            createdAt: "2023-05-18T11:45:00Z",
            userId: "user_id",
            link: "/chat/1",
          },
          {
            id: "3",
            title: "Deadline Approaching",
            message: "Project deadline is in 3 days",
            type: "deadline",
            isRead: false,
            createdAt: "2023-05-17T09:20:00Z",
            userId: "user_id",
            link: "/projects/1",
          },
          {
            id: "4",
            title: "Payment Confirmation",
            message: "Your payment for Project #1 was successful",
            type: "payment",
            isRead: false,
            createdAt: "2023-05-16T14:10:00Z",
            userId: "user_id",
            link: "/projects/1",
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

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone_completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'comment_added':
        return <FileEdit className="w-4 h-4 text-blue-500" />;
      case 'revision_requested':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
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
        return <BarChart3 className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'Client'}
            </p>
          </div>
          <Link to="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
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
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.activeProjects || 0} active, {stats?.completedProjects || 0} completed
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
                    Awaiting your feedback
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
                    Unread notifications
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <FileEdit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.unreadMessages || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Unread messages
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Projects and Activity */}
        <div className="grid gap-4 md:grid-cols-7">
          {/* Recent Projects */}
          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest projects and status</CardDescription>
              </div>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="hidden md:flex">
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
              ) : recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <Link to={`/projects/${project.id}`} className="font-medium hover:underline">
                          {project.title}
                        </Link>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </div>
                      {project.status === "in_progress" && project.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Last updated: {formatDate(project.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderOpen className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No projects yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your first project to get started
                  </p>
                  <Link to="/projects/new" className="mt-4">
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="md:col-span-3">
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
                    Activities will appear here as you use the platform
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
    </ClientLayout>
  );
}