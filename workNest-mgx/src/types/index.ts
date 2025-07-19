// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'developer' | 'admin';
  isVerified?: boolean;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  projectType: string;
  budget: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  clientId: string;
  developerId?: string;
  selectedTheme?: string;
  progress?: number;
  features?: ProjectFeature[];
  milestones?: Milestone[];
}

export interface ProjectFeature {
  name: string;
  selected: boolean;
  price?: number;
}

// Milestone Types
export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  projectId: string;
  progress?: number;
}

// File Types
export interface ProjectFile {
  id: string;
  filename: string;
  path: string;
  size: number;
  type: string;
  category: string;
  description?: string;
  isPublic: boolean;
  uploadedBy: string;
  projectId: string;
  createdAt: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  projectId: string;
  createdAt: string;
  isRead: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  link?: string;
}

// Revision Types
export interface RevisionRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  projectId: string;
  milestoneId?: string;
  createdAt: string;
  dueDate?: string;
}

// Theme Types
export interface Theme {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  price?: number;
}

// Developer Types
export interface DeveloperProfile {
  id: string;
  userId: string;
  bio: string;
  skills: Skill[];
  projects: PortfolioProject[];
  availability: Availability;
  hourlyRate?: number;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface PortfolioProject {
  title: string;
  description: string;
  techStack: string[];
  projectUrl?: string;
  images?: string[];
}

export interface Availability {
  isAcceptingNewProjects: boolean;
  weeklySchedule?: Record<string, DaySchedule>;
  maxProjectsPerWeek?: number;
  minimumProjectBudget?: number;
}

export interface DaySchedule {
  available: boolean;
  startTime?: string;
  endTime?: string;
}

// Activity Types
export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  projectId?: string;
  userId?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Support Types
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  senderName: string;
  ticketId: string;
  createdAt: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  details?: string[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingRevisions: number;
  unreadNotifications: number;
  unreadMessages: number;
}

export interface AdminDashboardStats extends DashboardStats {
  totalUsers: number;
  totalDevelopers: number;
  totalRevenue: number;
  userGrowth: number;
  developerGrowth: number;
  projectGrowth: number;
}

// Time Tracking Types
export interface TimeTrackingSession {
  id: string;
  projectId: string;
  developerId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  description?: string;
  taskType: string;
}

// Quote Types
export interface Quote {
  id: string;
  projectTitle: string;
  projectDescription: string;
  features: string[];
  estimatedCost: number;
  estimatedTimeline: string;
  clientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string;
}

// Backup Types
export interface ProjectBackup {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  size: number;
}