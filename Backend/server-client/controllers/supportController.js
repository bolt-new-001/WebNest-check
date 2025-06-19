import asyncHandler from 'express-async-handler';
import SupportTicket from '../models/SupportTicket.js';
import { createActivityLog } from '../middleware/activityLogger.js';

// @desc    Create a support ticket
// @route   POST /api/support/tickets
// @access  Private
export const createSupportTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority, projectId } = req.body;

  const user = req.user || req.developer;
  const userType = req.user ? 'User' : 'Developer';

  const ticket = await SupportTicket.create({
    userId: user._id,
    userType,
    subject,
    description,
    category,
    priority,
    projectId
  });

  // Log activity
  await createActivityLog(
    user._id,
    userType,
    'ticket_created',
    `Created support ticket: ${subject}`,
    { entityType: 'SupportTicket', entityId: ticket._id }
  );

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc    Get user's support tickets
// @route   GET /api/support/tickets
// @access  Private
export const getUserTickets = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const user = req.user || req.developer;
  const query = { userId: user._id };
  
  if (status) query.status = status;

  const tickets = await SupportTicket.find(query)
    .populate('projectId', 'title')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SupportTicket.countDocuments(query);

  res.json({
    success: true,
    data: tickets,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get single support ticket
// @route   GET /api/support/tickets/:id
// @access  Private
export const getSupportTicket = asyncHandler(async (req, res) => {
  const user = req.user || req.developer;

  const ticket = await SupportTicket.findOne({
    _id: req.params.id,
    userId: user._id
  })
    .populate('projectId', 'title')
    .populate('assignedTo', 'name email')
    .populate('messages.senderId', 'name');

  if (!ticket) {
    return res.status(404).json({ message: 'Support ticket not found' });
  }

  res.json({
    success: true,
    data: ticket
  });
});

// @desc    Add message to support ticket
// @route   POST /api/support/tickets/:id/messages
// @access  Private
export const addTicketMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const user = req.user || req.developer;
  const userType = req.user ? 'User' : 'Developer';

  const ticket = await SupportTicket.findOneAndUpdate(
    { _id: req.params.id, userId: user._id },
    {
      $push: {
        messages: {
          senderId: user._id,
          senderType: userType,
          message
        }
      },
      status: 'waiting_response'
    },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({ message: 'Support ticket not found' });
  }

  res.json({
    success: true,
    data: ticket
  });
});

// @desc    Rate support ticket resolution
// @route   PUT /api/support/tickets/:id/rate
// @access  Private
export const rateTicketResolution = asyncHandler(async (req, res) => {
  const { rating, feedback } = req.body;
  const user = req.user || req.developer;

  const ticket = await SupportTicket.findOneAndUpdate(
    { 
      _id: req.params.id, 
      userId: user._id,
      status: { $in: ['resolved', 'closed'] }
    },
    {
      satisfactionRating: {
        rating,
        feedback,
        ratedAt: new Date()
      }
    },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({ message: 'Support ticket not found or not resolved' });
  }

  res.json({
    success: true,
    data: ticket
  });
});