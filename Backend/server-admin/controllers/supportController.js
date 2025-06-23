import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const SupportTicket = mongoose.model('SupportTicket');

// @desc    Get all support tickets
// @route   GET /api/support/tickets
// @access  Private
export const getAllSupportTickets = asyncHandler(async (req, res) => {
  const { status, priority, category, assignedTo, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (assignedTo) query.assignedTo = assignedTo;

  const tickets = await SupportTicket.find(query)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title')
    .sort({ priority: 1, createdAt: -1 })
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

// @desc    Assign ticket to admin
// @route   PUT /api/support/tickets/:id/assign
// @access  Private
export const assignTicket = asyncHandler(async (req, res) => {
  const { assignedTo, estimatedResolutionTime } = req.body;

  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      assignedTo,
      status: 'in_progress',
      estimatedResolutionTime
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

// @desc    Add admin response to ticket
// @route   POST /api/support/tickets/:id/respond
// @access  Private
export const respondToTicket = asyncHandler(async (req, res) => {
  const { message, isInternal = false } = req.body;

  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        messages: {
          senderId: req.admin._id,
          senderType: 'Admin',
          message,
          isInternal
        }
      },
      status: isInternal ? ticket.status : 'waiting_response'
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

// @desc    Resolve support ticket
// @route   PUT /api/support/tickets/:id/resolve
// @access  Private
export const resolveTicket = asyncHandler(async (req, res) => {
  const { resolutionMessage } = req.body;

  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      status: 'resolved',
      resolution: {
        message: resolutionMessage,
        resolvedBy: req.admin._id,
        resolvedAt: new Date()
      },
      actualResolutionTime: new Date()
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

// @desc    Get support ticket statistics
// @route   GET /api/support/stats
// @access  Private
export const getSupportStats = asyncHandler(async (req, res) => {
  const stats = await SupportTicket.aggregate([
    {
      $facet: {
        statusBreakdown: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        priorityBreakdown: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        categoryBreakdown: [
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ],
        avgResolutionTime: [
          {
            $match: {
              status: 'resolved',
              'resolution.resolvedAt': { $exists: true }
            }
          },
          {
            $project: {
              resolutionTime: {
                $divide: [
                  { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                  1000 * 60 * 60 // Convert to hours
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              avgHours: { $avg: '$resolutionTime' }
            }
          }
        ]
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0]
  });
});