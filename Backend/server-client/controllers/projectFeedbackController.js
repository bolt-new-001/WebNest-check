import asyncHandler from 'express-async-handler';
import ProjectFeedback from '../models/ProjectFeedback.js';
import Project from '../models/Project.js';
import { createActivityLog } from '../middleware/activityLogger.js';

// @desc    Create project feedback
// @route   POST /api/projects/:projectId/feedback
// @access  Private (Client only)
export const createProjectFeedback = asyncHandler(async (req, res) => {
  const { milestoneId, feedbackType, feedback, rating, attachments, actionRequired } = req.body;
  const { projectId } = req.params;

  // Verify project belongs to client
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const projectFeedback = await ProjectFeedback.create({
    projectId,
    clientId: req.user._id,
    developerId: project.developerId,
    milestoneId,
    feedbackType,
    feedback,
    rating,
    attachments,
    actionRequired
  });

  // Log activity
  await createActivityLog(
    req.user._id,
    'User',
    'feedback_given',
    `Provided ${feedbackType} feedback for project ${project.title}`,
    { entityType: 'ProjectFeedback', entityId: projectFeedback._id }
  );

  res.status(201).json({
    success: true,
    data: projectFeedback
  });
});

// @desc    Get project feedback
// @route   GET /api/projects/:projectId/feedback
// @access  Private
export const getProjectFeedback = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { feedbackType, page = 1, limit = 10 } = req.query;

  const user = req.user || req.developer;
  let query = { projectId };

  // Check access permissions
  if (req.user) {
    query.clientId = req.user._id;
  } else if (req.developer) {
    query.developerId = req.developer._id;
  }

  if (feedbackType) query.feedbackType = feedbackType;

  const feedback = await ProjectFeedback.find(query)
    .populate('clientId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ProjectFeedback.countDocuments(query);

  res.json({
    success: true,
    data: feedback,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Respond to project feedback
// @route   PUT /api/feedback/:id/respond
// @access  Private (Developer only)
export const respondToFeedback = asyncHandler(async (req, res) => {
  const { message, estimatedFixTime } = req.body;

  const feedback = await ProjectFeedback.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    {
      developerResponse: {
        message,
        respondedAt: new Date(),
        estimatedFixTime
      },
      status: 'acknowledged'
    },
    { new: true }
  );

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  res.json({
    success: true,
    data: feedback
  });
});

// @desc    Mark feedback as addressed
// @route   PUT /api/feedback/:id/address
// @access  Private (Developer only)
export const markFeedbackAddressed = asyncHandler(async (req, res) => {
  const feedback = await ProjectFeedback.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    { status: 'addressed' },
    { new: true }
  );

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  res.json({
    success: true,
    data: feedback
  });
});