import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import RevisionRequest from '../models/RevisionRequest.js';
import SupportTicket from '../models/SupportTicket.js';
import ClientNotification from '../models/ClientNotification.js';

// @desc    Get demo dashboard data
// @route   GET /api/demo/dashboard
// @access  Public
export const getDemoDashboardData = asyncHandler(async (req, res) => {
  const demoData = {
    overview: {
      totalProjects: 12,
      activeProjects: 3,
      completedProjects: 8,
      pendingProjects: 1,
      totalSpent: 145000,
      avgProjectValue: 18125
    },
    recentProjects: [
      {
        id: 'demo-1',
        title: 'E-commerce Website',
        status: 'in_progress',
        progress: 75,
        developer: 'Dax Patel',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        budget: 25000
      },
      {
        id: 'demo-2',
        title: 'Portfolio Website',
        status: 'completed',
        progress: 100,
        developer: 'Sarah Johnson',
        deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        budget: 15000
      },
      {
        id: 'demo-3',
        title: 'Business Landing Page',
        status: 'review',
        progress: 95,
        developer: 'Mike Chen',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        budget: 12000
      }
    ],
    earnings: {
      thisMonth: 45000,
      lastMonth: 38000,
      growth: 18.4,
      chartData: [
        { month: 'Jan', amount: 32000 },
        { month: 'Feb', amount: 28000 },
        { month: 'Mar', amount: 35000 },
        { month: 'Apr', amount: 42000 },
        { month: 'May', amount: 38000 },
        { month: 'Jun', amount: 45000 }
      ]
    },
    notifications: [
      {
        id: 'notif-1',
        title: 'Project Update',
        message: 'Your e-commerce website is 75% complete',
        type: 'project_update',
        time: '2 hours ago',
        read: false
      },
      {
        id: 'notif-2',
        title: 'New Message',
        message: 'Developer sent you a message about the portfolio project',
        type: 'message',
        time: '5 hours ago',
        read: false
      },
      {
        id: 'notif-3',
        title: 'Payment Received',
        message: 'Payment of ₹15,000 received for portfolio website',
        type: 'payment',
        time: '1 day ago',
        read: true
      }
    ],
    upcomingDeadlines: [
      {
        project: 'E-commerce Website',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        project: 'Business Landing Page',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      }
    ]
  };

  res.json({
    success: true,
    data: demoData
  });
});

// @desc    Get demo developer dashboard data
// @route   GET /api/demo/developer-dashboard
// @access  Public
export const getDemoDeveloperDashboard = asyncHandler(async (req, res) => {
  const demoData = {
    overview: {
      activeProjects: 4,
      completedProjects: 23,
      totalEarnings: 285000,
      averageRating: 4.8,
      responseTime: '2 hours',
      onTimeDelivery: 96
    },
    currentProjects: [
      {
        id: 'dev-proj-1',
        title: 'E-commerce Platform',
        client: 'TechStart Inc.',
        progress: 65,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        budget: 45000,
        status: 'in_progress'
      },
      {
        id: 'dev-proj-2',
        title: 'Portfolio Website',
        client: 'John Designer',
        progress: 90,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        budget: 18000,
        status: 'review'
      }
    ],
    earnings: {
      thisMonth: 52000,
      lastMonth: 48000,
      growth: 8.3,
      chartData: [
        { month: 'Jan', amount: 38000 },
        { month: 'Feb', amount: 42000 },
        { month: 'Mar', amount: 45000 },
        { month: 'Apr', amount: 48000 },
        { month: 'May', amount: 48000 },
        { month: 'Jun', amount: 52000 }
      ]
    },
    recentReviews: [
      {
        client: 'Sarah Wilson',
        project: 'Business Website',
        rating: 5,
        comment: 'Excellent work! Delivered on time and exceeded expectations.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        client: 'Mike Johnson',
        project: 'E-commerce Store',
        rating: 5,
        comment: 'Professional developer with great communication skills.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
  };

  res.json({
    success: true,
    data: demoData
  });
});

// @desc    Get client insight cards (real data if authenticated)
// @route   GET /api/demo/client-insights
// @access  Private/Public
export const getClientInsightCards = asyncHandler(async (req, res) => {
  let insightData;

  if (req.user) {
    // Real data for authenticated users
    const [
      activeProjects,
      openTickets,
      activeRevisions,
      totalSpent,
      unreadNotifications
    ] = await Promise.all([
      Project.countDocuments({ 
        clientId: req.user._id, 
        status: { $in: ['assigned', 'in_progress'] } 
      }),
      SupportTicket.countDocuments({ 
        userId: req.user._id, 
        status: { $in: ['open', 'in_progress'] } 
      }),
      RevisionRequest.countDocuments({ 
        clientId: req.user._id, 
        status: { $in: ['pending', 'in_progress'] } 
      }),
      Project.aggregate([
        { $match: { clientId: req.user._id } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } }
      ]),
      ClientNotification.countDocuments({ 
        userId: req.user._id, 
        isRead: false 
      })
    ]);

    insightData = {
      activeProjects,
      openTickets,
      activeRevisions,
      totalSpent: totalSpent[0]?.total || 0,
      unreadNotifications,
      projectsThisMonth: await Project.countDocuments({
        clientId: req.user._id,
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      avgProjectValue: totalSpent[0]?.total ? Math.round(totalSpent[0].total / await Project.countDocuments({ clientId: req.user._id })) : 0
    };
  } else {
    // Demo data for non-authenticated users
    insightData = {
      activeProjects: 3,
      openTickets: 1,
      activeRevisions: 2,
      totalSpent: 145000,
      unreadNotifications: 5,
      projectsThisMonth: 2,
      avgProjectValue: 18125
    };
  }

  res.json({
    success: true,
    data: insightData
  });
});

// @desc    Get project activity summary
// @route   GET /api/demo/activity-summary
// @access  Private/Public
export const getActivitySummary = asyncHandler(async (req, res) => {
  const activityData = {
    recentActivities: [
      {
        type: 'milestone_completed',
        message: 'Homepage design milestone completed',
        project: 'E-commerce Website',
        time: '2 hours ago',
        icon: 'check-circle'
      },
      {
        type: 'file_uploaded',
        message: 'Logo files uploaded by client',
        project: 'Portfolio Website',
        time: '4 hours ago',
        icon: 'upload'
      },
      {
        type: 'revision_requested',
        message: 'Revision requested for contact page',
        project: 'Business Website',
        time: '1 day ago',
        icon: 'edit'
      },
      {
        type: 'payment_made',
        message: 'Payment of ₹15,000 processed',
        project: 'Portfolio Website',
        time: '2 days ago',
        icon: 'credit-card'
      }
    ],
    weeklyStats: {
      projectsStarted: 2,
      milestonesCompleted: 5,
      revisionsRequested: 3,
      filesUploaded: 12
    }
  };

  res.json({
    success: true,
    data: activityData
  });
});