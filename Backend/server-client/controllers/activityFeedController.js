import asyncHandler from 'express-async-handler';
import ProjectActivity from '../models/ProjectActivity.js';
import Project from '../models/Project.js';

// @desc    Get project activity feed
// @route   GET /api/activity/project/:projectId
// @access  Private
export const getProjectActivityFeed = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 20, actionType } = req.query;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const query = { projectId, isVisible: true };
  if (actionType) query.actionType = actionType;

  const activities = await ProjectActivity.find(query)
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ProjectActivity.countDocuments(query);

  res.json({
    success: true,
    data: activities,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get user activity feed
// @route   GET /api/activity/user
// @access  Private
export const getUserActivityFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, actionType } = req.query;

  // Get user's projects
  const userProjects = await Project.find({ clientId: req.user._id }).select('_id');
  const projectIds = userProjects.map(p => p._id);

  const query = { 
    projectId: { $in: projectIds },
    isVisible: true 
  };
  if (actionType) query.actionType = actionType;

  const activities = await ProjectActivity.find(query)
    .populate('userId', 'name avatar')
    .populate('projectId', 'title')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ProjectActivity.countDocuments(query);

  res.json({
    success: true,
    data: activities,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Create activity log entry
// @route   POST /api/activity/log
// @access  Private
export const createActivityLog = asyncHandler(async (req, res) => {
  const { projectId, actionType, message, metadata } = req.body;

  const activity = await ProjectActivity.create({
    projectId,
    userId: req.user._id,
    userType: 'User',
    actionType,
    message,
    metadata
  });

  const populatedActivity = await ProjectActivity.findById(activity._id)
    .populate('userId', 'name avatar');

  res.status(201).json({
    success: true,
    data: populatedActivity
  });
});

// @desc    Get activity statistics
// @route   GET /api/activity/stats/:projectId
// @access  Private
export const getActivityStats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const stats = await ProjectActivity.aggregate([
    { $match: { projectId: mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: '$actionType',
        count: { $sum: 1 },
        lastActivity: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const totalActivities = await ProjectActivity.countDocuments({ projectId });

  res.json({
    success: true,
    data: {
      totalActivities,
      actionBreakdown: stats
    }
  });
});

// Helper function to create activity logs programmatically
export const logActivity = async (projectId, userId, userType, actionType, message, metadata = {}) => {
  try {
    await ProjectActivity.create({
      projectId,
      userId,
      userType,
      actionType,
      message,
      metadata
    });
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};