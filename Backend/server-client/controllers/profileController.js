import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Project from '../models/Project.js';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, company, preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      phone,
      company,
      preferences
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: user
  });
});

// @desc    Upload avatar
// @route   POST /api/profile/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res) => {
  // TODO: Implement file upload logic with multer
  res.json({
    success: true,
    message: 'Avatar uploaded successfully'
  });
});

// @desc    Delete account
// @route   DELETE /api/profile
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// @desc    Upgrade to premium
// @route   POST /api/profile/upgrade-premium
// @access  Private
export const upgradeToPremium = asyncHandler(async (req, res) => {
  const { planType = 'monthly' } = req.body;

  const expiresAt = new Date();
  if (planType === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else if (planType === 'yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      isPremium: true,
      premiumExpiresAt: expiresAt,
      role: 'premiumClient'
    },
    { new: true }
  );

  res.json({
    success: true,
    data: user,
    message: 'Successfully upgraded to premium'
  });
});

// @desc    Get user stats
// @route   GET /api/profile/stats
// @access  Private
export const getStats = asyncHandler(async (req, res) => {
  const projects = await Project.find({ clientId: req.user._id });

  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    activeProjects: projects.filter(p => ['assigned', 'in_progress'].includes(p.status)).length,
    totalSpent: projects.reduce((sum, p) => sum + p.paidAmount, 0),
    averageRating: 4.5 // TODO: Calculate from actual feedback
  };

  res.json({
    success: true,
    data: stats
  });
});