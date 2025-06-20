import asyncHandler from 'express-async-handler';
import ClientNotification from '../models/ClientNotification.js';
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Get user notifications
// @route   GET /api/notifications/client
// @access  Private
export const getClientNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead, type, priority } = req.query;

  const query = { userId: req.user._id };
  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (type) query.type = type;
  if (priority) query.priority = priority;

  const notifications = await ClientNotification.find(query)
    .populate('projectId', 'title')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ClientNotification.countDocuments(query);
  const unreadCount = await ClientNotification.countDocuments({
    userId: req.user._id,
    isRead: false
  });

  res.json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/client/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await ClientNotification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { 
      isRead: true,
      readAt: new Date()
    },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/client/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await ClientNotification.updateMany(
    { userId: req.user._id, isRead: false },
    { 
      isRead: true,
      readAt: new Date()
    }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/client/:id
// @access  Private
export const deleteClientNotification = asyncHandler(async (req, res) => {
  const notification = await ClientNotification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// @desc    Get notification preferences
// @route   GET /api/notifications/client/preferences
// @access  Private
export const getNotificationPreferences = asyncHandler(async (req, res) => {
  // This would typically be stored in UserPreferences model
  // For now, return default preferences
  const preferences = {
    dashboard: true,
    email: true,
    sms: false,
    push: true,
    types: {
      project_update: true,
      milestone_complete: true,
      deadline_reminder: true,
      payment_due: true,
      revision_ready: true,
      message_received: true
    }
  };

  res.json({
    success: true,
    data: preferences
  });
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/client/preferences
// @access  Private
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  // This would update UserPreferences model
  // For now, just return success
  res.json({
    success: true,
    message: 'Notification preferences updated successfully'
  });
});

// Helper function to create and send notifications
export const createClientNotification = async (notificationData) => {
  try {
    const notification = await ClientNotification.create(notificationData);

    // Send email if enabled
    if (notification.deliveryChannels.email && !notification.emailSent) {
      await sendNotificationEmail(notification);
    }

    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
};

// Helper function to send notification emails
const sendNotificationEmail = async (notification) => {
  try {
    const user = await User.findById(notification.userId);
    if (!user) return;

    const emailContent = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${notification.title}</h2>
          <p style="color: #666; line-height: 1.6;">${notification.message}</p>
          ${notification.actionUrl ? `
            <div style="margin: 20px 0;">
              <a href="${notification.actionUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                ${notification.actionText || 'View Details'}
              </a>
            </div>
          ` : ''}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated message from WebNest. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(emailContent);

    // Update notification as email sent
    await ClientNotification.findByIdAndUpdate(notification._id, {
      emailSent: true,
      emailSentAt: new Date()
    });

  } catch (error) {
    console.error('Email sending error:', error);
  }
};