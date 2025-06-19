import asyncHandler from 'express-async-handler';
import OnlineStatus from '../models/OnlineStatus.js';

// @desc    Update user online status
// @route   PUT /api/status/online
// @access  Private
export const updateOnlineStatus = asyncHandler(async (req, res) => {
  const { status, currentProject, deviceInfo } = req.body;
  
  const userId = req.user?._id || req.developer?._id;
  const userType = req.user ? 'User' : 'Developer';

  const onlineStatus = await OnlineStatus.findOneAndUpdate(
    { userId, userType },
    {
      status,
      currentProject,
      deviceInfo,
      lastSeen: new Date(),
      socketId: req.body.socketId
    },
    { upsert: true, new: true }
  );

  res.json({
    success: true,
    data: onlineStatus
  });
});

// @desc    Get online users for project
// @route   GET /api/status/project/:projectId
// @access  Private
export const getProjectOnlineUsers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const onlineUsers = await OnlineStatus.find({
    $or: [
      { currentProject: projectId },
      { status: 'online' }
    ]
  }).populate('userId', 'name avatar');

  res.json({
    success: true,
    data: onlineUsers
  });
});

// @desc    Get user status
// @route   GET /api/status/:userId
// @access  Private
export const getUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const status = await OnlineStatus.findOne({ userId })
    .populate('userId', 'name avatar');

  res.json({
    success: true,
    data: status
  });
});