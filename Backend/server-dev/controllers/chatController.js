import asyncHandler from 'express-async-handler';
import Chat from '../models/Chat.js';

// @desc    Get project chats
// @route   GET /api/chat/project/:projectId
// @access  Private (Developer)
export const getProjectChats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const chat = await Chat.findOne({ 
    projectId,
    'participants.userId': req.developer._id,
    isActive: true
  })
    .populate('participants.userId', 'name avatar')
    .select('-messages');

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  res.json({
    success: true,
    data: chat
  });
});

// @desc    Send message
// @route   POST /api/chat/project/:projectId/message
// @access  Private (Developer)
export const sendMessage = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content, attachments } = req.body;

  if (!content && (!attachments || attachments.length === 0)) {
    res.status(400);
    throw new Error('Message content or attachments are required');
  }

  // Find existing chat or create new one
  let chat = await Chat.findOne({ 
    projectId,
    'participants.userId': req.developer._id,
    isActive: true
  });

  if (!chat) {
    // Create new chat
    chat = await Chat.create({
      projectId,
      participants: [{
        userId: req.developer._id,
        userModel: 'Developer',
        joinedAt: new Date()
      }],
      messages: [],
      lastActivity: new Date()
    });
  }

  // Add message
  const newMessage = {
    sender: req.developer._id,
    senderModel: 'Developer',
    content: content || '',
    attachments: attachments || [],
    readBy: [{
      userId: req.developer._id,
      readAt: new Date()
    }],
    createdAt: new Date()
  };

  chat.messages.push(newMessage);
  chat.lastActivity = new Date();
  await chat.save();

  res.status(201).json({
    success: true,
    data: newMessage
  });
});

// @desc    Mark message as read
// @route   PUT /api/chat/message/:messageId/read
// @access  Private (Developer)
export const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const chat = await Chat.findOneAndUpdate(
    { 
      'messages._id': messageId,
      'participants.userId': req.developer._id
    },
    {
      $addToSet: {
        'messages.$.readBy': {
          userId: req.developer._id,
          readAt: new Date()
        }
      }
    },
    { new: true }
  );

  if (!chat) {
    return res.status(404).json({ message: 'Message not found' });
  }

  res.json({
    success: true,
    message: 'Message marked as read'
  });
});

// @desc    Get chat history
// @route   GET /api/chat/project/:projectId/history
// @access  Private (Developer)
export const getChatHistory = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const chat = await Chat.findOne({ 
    projectId,
    'participants.userId': req.developer._id,
    isActive: true
  });

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // Paginate messages (most recent first)
  const totalMessages = chat.messages.length;
  const startIndex = Math.max(totalMessages - (page * limit), 0);
  const endIndex = Math.max(totalMessages - ((page - 1) * limit), 0);
  
  const paginatedMessages = chat.messages
    .slice(startIndex, endIndex)
    .reverse(); // Reverse to get newest first

  // Mark all messages as read
  const messageIds = paginatedMessages.map(msg => msg._id);
  
  await Chat.updateMany(
    { _id: chat._id, 'messages._id': { $in: messageIds } },
    {
      $addToSet: {
        'messages.$[elem].readBy': {
          userId: req.developer._id,
          readAt: new Date()
        }
      }
    },
    { 
      arrayFilters: [{ 'elem._id': { $in: messageIds } }],
      multi: true 
    }
  );

  res.json({
    success: true,
    data: paginatedMessages,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(totalMessages / limit),
      total: totalMessages
    }
  });
});