import asyncHandler from 'express-async-handler';
import ChatMessage from '../models/ChatMessage.js';
import Project from '../models/Project.js';

// @desc    Get chat messages for project
// @route   GET /api/chat/project/:projectId
// @access  Private
export const getProjectChatMessages = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Verify user has access to this project
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { clientId: req.user?._id },
      { developerId: req.developer?._id }
    ]
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found or access denied' });
  }

  const messages = await ChatMessage.find({ projectId })
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .populate('replyTo', 'content.text senderId')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ChatMessage.countDocuments({ projectId });

  res.json({
    success: true,
    data: messages.reverse(), // Reverse to show oldest first
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Send chat message
// @route   POST /api/chat/project/:projectId/message
// @access  Private
export const sendChatMessage = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content, messageType = 'text', receiverId, replyTo } = req.body;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { clientId: req.user?._id },
      { developerId: req.developer?._id }
    ]
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found or access denied' });
  }

  const senderId = req.user?._id || req.developer?._id;
  const senderType = req.user ? 'User' : 'Developer';
  
  // Determine receiver if not specified
  let finalReceiverId = receiverId;
  let receiverType = 'User';
  
  if (!receiverId) {
    if (req.user) {
      finalReceiverId = project.developerId;
      receiverType = 'Developer';
    } else {
      finalReceiverId = project.clientId;
      receiverType = 'User';
    }
  }

  const message = await ChatMessage.create({
    projectId,
    senderId,
    senderType,
    receiverId: finalReceiverId,
    receiverType,
    messageType,
    content,
    replyTo,
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  const populatedMessage = await ChatMessage.findById(message._id)
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .populate('replyTo', 'content.text senderId');

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});

// @desc    Mark message as read
// @route   PUT /api/chat/message/:messageId/read
// @access  Private
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.developer?._id;

  const message = await ChatMessage.findOneAndUpdate(
    { 
      _id: req.params.messageId,
      receiverId: userId,
      isRead: false
    },
    { 
      isRead: true,
      readAt: new Date()
    },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ message: 'Message not found or already read' });
  }

  res.json({
    success: true,
    data: message
  });
});

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
// @access  Private
export const getUnreadMessageCount = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.developer?._id;

  const count = await ChatMessage.countDocuments({
    receiverId: userId,
    isRead: false
  });

  res.json({
    success: true,
    data: { unreadCount: count }
  });
});