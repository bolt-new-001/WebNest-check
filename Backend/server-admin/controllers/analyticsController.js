import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// Import models from client service (shared database)
const User = mongoose.model('User');
const Developer = mongoose.model('Developer');
const Project = mongoose.model('Project');
const Review = mongoose.model('Review');
const SupportTicket = mongoose.model('SupportTicket');
const ActivityLog = mongoose.model('ActivityLog');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { timeframe = '30d' } = req.query;
  
  const dateFilter = getDateFilter(timeframe);

  const [
    totalUsers,
    totalDevelopers,
    totalProjects,
    activeProjects,
    completedProjects,
    totalRevenue,
    avgProjectValue,
    userGrowth,
    developerGrowth,
    projectGrowth
  ] = await Promise.all([
    User.countDocuments(),
    Developer.countDocuments({ isVerified: true }),
    Project.countDocuments(),
    Project.countDocuments({ status: { $in: ['assigned', 'in_progress'] } }),
    Project.countDocuments({ status: 'completed' }),
    Project.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]),
    Project.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$budget' } } }
    ]),
    User.countDocuments({ createdAt: { $gte: dateFilter } }),
    Developer.countDocuments({ createdAt: { $gte: dateFilter } }),
    Project.countDocuments({ createdAt: { $gte: dateFilter } })
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalDevelopers,
        totalProjects,
        activeProjects,
        completedProjects,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgProjectValue: avgProjectValue[0]?.avg || 0
      },
      growth: {
        users: userGrowth,
        developers: developerGrowth,
        projects: projectGrowth
      }
    }
  });
});

// @desc    Get revenue statistics
// @route   GET /api/analytics/revenue
// @access  Private
export const getRevenueStats = asyncHandler(async (req, res) => {
  const { period = 'monthly' } = req.query;

  const groupBy = period === 'daily' ? {
    year: { $year: '$createdAt' },
    month: { $month: '$createdAt' },
    day: { $dayOfMonth: '$createdAt' }
  } : {
    year: { $year: '$createdAt' },
    month: { $month: '$createdAt' }
  };

  const revenueData = await Project.aggregate([
    { $match: { status: 'completed', paidAmount: { $gt: 0 } } },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: '$paidAmount' },
        projects: { $sum: 1 },
        avgValue: { $avg: '$paidAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  res.json({
    success: true,
    data: revenueData
  });
});

// @desc    Get user growth analytics
// @route   GET /api/analytics/user-growth
// @access  Private
export const getUserGrowth = asyncHandler(async (req, res) => {
  const userGrowth = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        premium: {
          $sum: { $cond: [{ $eq: ['$isPremium', true] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const developerGrowth = await Developer.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        verified: {
          $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json({
    success: true,
    data: {
      users: userGrowth,
      developers: developerGrowth
    }
  });
});

// @desc    Get project analytics
// @route   GET /api/analytics/projects
// @access  Private
export const getProjectAnalytics = asyncHandler(async (req, res) => {
  const [
    statusBreakdown,
    typeBreakdown,
    avgCompletionTime,
    satisfactionRating
  ] = await Promise.all([
    Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Project.aggregate([
      { $group: { _id: '$projectType', count: { $sum: 1 } } }
    ]),
    Project.aggregate([
      {
        $match: {
          status: 'completed',
          'timeline.actualDelivery': { $exists: true }
        }
      },
      {
        $project: {
          completionTime: {
            $divide: [
              { $subtract: ['$timeline.actualDelivery', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: '$completionTime' }
        }
      }
    ]),
    Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      statusBreakdown,
      typeBreakdown,
      avgCompletionTime: avgCompletionTime[0]?.avgDays || 0,
      satisfactionRating: satisfactionRating[0]?.avgRating || 0
    }
  });
});

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
export const getPerformanceMetrics = asyncHandler(async (req, res) => {
  const [
    topDevelopers,
    supportTicketStats,
    activityStats
  ] = await Promise.all([
    Developer.find({ isVerified: true })
      .select('name rating totalProjects completedProjects totalEarnings')
      .sort({ 'rating.average': -1, completedProjects: -1 })
      .limit(10),
    SupportTicket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'resolved'] },
                { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                null
              ]
            }
          }
        }
      }
    ]),
    ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.json({
    success: true,
    data: {
      topDevelopers,
      supportTicketStats,
      activityStats
    }
  });
});

// Helper function to get date filter based on timeframe
function getDateFilter(timeframe) {
  const now = new Date();
  switch (timeframe) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}