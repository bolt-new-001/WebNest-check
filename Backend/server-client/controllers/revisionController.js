import asyncHandler from 'express-async-handler';
import RevisionRequest from '../models/RevisionRequest.js';
import Project from '../models/Project.js';
import { logActivity } from './activityFeedController.js';
import { createClientNotification } from './clientNotificationController.js';

// @desc    Create revision request
// @route   POST /api/revisions/request
// @access  Private (Client)
export const createRevisionRequest = asyncHandler(async (req, res) => {
  const { 
    projectId, 
    milestoneId, 
    title, 
    description, 
    category, 
    priority, 
    attachments,
    dueDate 
  } = req.body;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const revision = await RevisionRequest.create({
    projectId,
    milestoneId,
    clientId: req.user._id,
    developerId: project.developerId,
    title,
    description,
    category,
    priority,
    attachments,
    dueDate
  });

  // Log activity
  await logActivity(
    projectId,
    req.user._id,
    'User',
    'revision_requested',
    `Requested revision: ${title}`,
    { revisionId: revision._id, category, priority }
  );

  // Notify developer
  await createClientNotification({
    userId: project.developerId,
    title: 'New Revision Request',
    message: `Client has requested a revision for ${project.title}: ${title}`,
    type: 'revision_ready',
    priority: priority,
    projectId: projectId,
    actionUrl: `/developer/projects/${projectId}/revisions/${revision._id}`,
    actionText: 'View Revision'
  });

  res.status(201).json({
    success: true,
    data: revision
  });
});

// @desc    Get project revisions
// @route   GET /api/revisions/project/:projectId
// @access  Private
export const getProjectRevisions = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, category, page = 1, limit = 10 } = req.query;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const query = { projectId };
  if (status) query.status = status;
  if (category) query.category = category;

  const revisions = await RevisionRequest.find(query)
    .populate('milestoneId', 'title')
    .populate('developerId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await RevisionRequest.countDocuments(query);

  res.json({
    success: true,
    data: revisions,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get single revision
// @route   GET /api/revisions/:id
// @access  Private
export const getRevision = asyncHandler(async (req, res) => {
  const revision = await RevisionRequest.findById(req.params.id)
    .populate('projectId', 'title')
    .populate('milestoneId', 'title')
    .populate('clientId', 'name avatar')
    .populate('developerId', 'name avatar');

  if (!revision) {
    return res.status(404).json({ message: 'Revision not found' });
  }

  // Verify access
  if (revision.clientId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({
    success: true,
    data: revision
  });
});

// @desc    Update revision request
// @route   PUT /api/revisions/:id
// @access  Private (Client)
export const updateRevisionRequest = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, attachments } = req.body;

  const revision = await RevisionRequest.findOneAndUpdate(
    { 
      _id: req.params.id, 
      clientId: req.user._id,
      status: { $in: ['pending', 'acknowledged'] }
    },
    {
      title,
      description,
      priority,
      dueDate,
      attachments
    },
    { new: true }
  );

  if (!revision) {
    return res.status(404).json({ message: 'Revision not found or cannot be updated' });
  }

  // Log activity
  await logActivity(
    revision.projectId,
    req.user._id,
    'User',
    'revision_updated',
    `Updated revision request: ${title}`,
    { revisionId: revision._id }
  );

  res.json({
    success: true,
    data: revision
  });
});

// @desc    Cancel revision request
// @route   DELETE /api/revisions/:id
// @access  Private (Client)
export const cancelRevisionRequest = asyncHandler(async (req, res) => {
  const revision = await RevisionRequest.findOneAndUpdate(
    { 
      _id: req.params.id, 
      clientId: req.user._id,
      status: { $in: ['pending', 'acknowledged'] }
    },
    { status: 'cancelled' },
    { new: true }
  );

  if (!revision) {
    return res.status(404).json({ message: 'Revision not found or cannot be cancelled' });
  }

  // Log activity
  await logActivity(
    revision.projectId,
    req.user._id,
    'User',
    'revision_cancelled',
    `Cancelled revision request: ${revision.title}`,
    { revisionId: revision._id }
  );

  res.json({
    success: true,
    message: 'Revision request cancelled successfully'
  });
});

// @desc    Submit feedback for completed revision
// @route   PUT /api/revisions/:id/feedback
// @access  Private (Client)
export const submitRevisionFeedback = asyncHandler(async (req, res) => {
  const { rating, comments, approved } = req.body;

  const revision = await RevisionRequest.findOneAndUpdate(
    { 
      _id: req.params.id, 
      clientId: req.user._id,
      status: 'completed'
    },
    {
      clientFeedback: {
        rating,
        comments,
        approved,
        submittedAt: new Date()
      }
    },
    { new: true }
  );

  if (!revision) {
    return res.status(404).json({ message: 'Revision not found or not completed' });
  }

  // Log activity
  await logActivity(
    revision.projectId,
    req.user._id,
    'User',
    'feedback_given',
    `Provided feedback for revision: ${revision.title}`,
    { revisionId: revision._id, rating, approved }
  );

  res.json({
    success: true,
    data: revision
  });
});

// @desc    Get revision statistics
// @route   GET /api/revisions/stats/:projectId
// @access  Private
export const getRevisionStats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const stats = await RevisionRequest.aggregate([
    { $match: { projectId: mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgHours: { $avg: '$actualHours' }
      }
    }
  ]);

  const totalRevisions = await RevisionRequest.countDocuments({ projectId });
  const avgRating = await RevisionRequest.aggregate([
    { 
      $match: { 
        projectId: mongoose.Types.ObjectId(projectId),
        'clientFeedback.rating': { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$clientFeedback.rating' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalRevisions,
      statusBreakdown: stats,
      averageRating: avgRating[0]?.avgRating || 0
    }
  });
});