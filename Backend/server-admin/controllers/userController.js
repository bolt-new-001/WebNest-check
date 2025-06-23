import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const User = mongoose.model('User');
const Project = mongoose.model('Project');
const ActivityLog = mongoose.model('ActivityLog');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, isPremium, page = 1, limit = 20, search } = req.query;

  const query = {};
  if (role) query.role = role;
  if (isPremium !== undefined) query.isPremium = isPremium === 'true';
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get user's projects
  const projects = await Project.find({ clientId: user._id })
    .select('title status budget createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent activity
  const recentActivity = await ActivityLog.find({ 
    userId: user._id,
    userType: 'User'
  })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      user,
      projects,
      recentActivity
    }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isPremium, premiumExpiresAt } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isPremium, premiumExpiresAt },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if user has active projects
  const activeProjects = await Project.countDocuments({
    clientId: user._id,
    status: { $in: ['assigned', 'in_progress'] }
  });

  if (activeProjects > 0) {
    return res.status(400).json({ 
      message: 'Cannot delete user with active projects' 
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $facet: {
        roleBreakdown: [
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ],
        premiumBreakdown: [
          { $group: { _id: '$isPremium', count: { $sum: 1 } } }
        ],
        monthlyGrowth: [
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ],
        totalSpending: [
          { $group: { _id: null, total: { $sum: '$totalSpent' } } }
        ]
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0]
  });
});

// @desc    Promote user to premium
// @route   PUT /api/users/:id/promote
// @access  Private
export const promoteUser = asyncHandler(async (req, res) => {
  const { duration = 30 } = req.body; // days

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + duration);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isPremium: true,
      premiumExpiresAt: expiresAt,
      role: 'premiumClient'
    },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    success: true,
    data: user,
    message: `User promoted to premium for ${duration} days`
  });
});