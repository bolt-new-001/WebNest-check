import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const Notification = mongoose.model('Notification');
const User = mongoose.model('User');
const Developer = mongoose.model('Developer');

// @desc    Send notification to specific user
// @route   POST /api/notifications/send
// @access  Private
export const sendNotification = asyncHandler(async (req, res) => {
  const { userId, userType, title, message, type, priority, actionUrl } = req.body;

  const notification = await Notification.create({
    userId,
    userType,
    title,
    message,
    type,
    priority,
    actionUrl,
    sentBy: req.admin._id
  });

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Send bulk notifications
// @route   POST /api/notifications/bulk
// @access  Private
export const sendBulkNotification = asyncHandler(async (req, res) => {
  const { 
    title, 
    message, 
    type, 
    priority, 
    actionUrl, 
    targetAudience 
  } = req.body;

  let recipients = [];

  switch (targetAudience.type) {
    case 'all_users':
      const users = await User.find({ isActive: true }).select('_id');
      recipients = users.map(user => ({
        userId: user._id,
        userType: 'User',
        title,
        message,
        type,
        priority,
        actionUrl,
        sentBy: req.admin._id
      }));
      break;

    case 'all_developers':
      const developers = await Developer.find({ isActive: true }).select('_id');
      recipients = developers.map(dev => ({
        userId: dev._id,
        userType: 'Developer',
        title,
        message,
        type,
        priority,
        actionUrl,
        sentBy: req.admin._id
      }));
      break;

    case 'premium_users':
      const premiumUsers = await User.find({ 
        isPremium: true, 
        isActive: true 
      }).select('_id');
      recipients = premiumUsers.map(user => ({
        userId: user._id,
        userType: 'User',
        title,
        message,
        type,
        priority,
        actionUrl,
        sentBy: req.admin._id
      }));
      break;

    case 'verified_developers':
      const verifiedDevs = await Developer.find({ 
        isVerified: true, 
        isActive: true 
      }).select('_id');
      recipients = verifiedDevs.map(dev => ({
        userId: dev._id,
        userType: 'Developer',
        title,
        message,
        type,
        priority,
        actionUrl,
        sentBy: req.admin._id
      }));
      break;

    case 'custom':
      recipients = targetAudience.userIds.map(userId => ({
        userId,
        userType: targetAudience.userType,
        title,
        message,
        type,
        priority,
        actionUrl,
        sentBy: req.admin._id
      }));
      break;
  }

  if (recipients.length > 0) {
    await Notification.insertMany(recipients);
  }

  res.json({
    success: true,
    message: `Bulk notification sent to ${recipients.length} recipients`
  });
});

// @desc    Get notification history
// @route   GET /api/notifications/history
// @access  Private
export const getNotificationHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, priority } = req.query;

  const query = { sentBy: { $exists: true } };
  if (type) query.type = type;
  if (priority) query.priority = priority;

  const notifications = await Notification.find(query)
    .populate('sentBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Notification.countDocuments(query);

  res.json({
    success: true,
    data: notifications,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});