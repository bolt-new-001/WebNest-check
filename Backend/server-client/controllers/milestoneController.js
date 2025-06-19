import asyncHandler from 'express-async-handler';
import ProjectMilestone from '../models/ProjectMilestone.js';
import Project from '../models/Project.js';

// @desc    Get project milestones
// @route   GET /api/projects/:projectId/milestones
// @access  Private
export const getProjectMilestones = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const milestones = await ProjectMilestone.find({ projectId })
    .sort({ order: 1 });

  res.json({
    success: true,
    data: milestones
  });
});

// @desc    Update milestone progress
// @route   PUT /api/milestones/:id/progress
// @access  Private (Developer)
export const updateMilestoneProgress = asyncHandler(async (req, res) => {
  const { progressPercentage, developerNotes, deliverables } = req.body;

  const milestone = await ProjectMilestone.findByIdAndUpdate(
    req.params.id,
    {
      progressPercentage,
      developerNotes,
      deliverables,
      status: progressPercentage === 100 ? 'completed' : 'in_progress',
      actualEndDate: progressPercentage === 100 ? new Date() : undefined
    },
    { new: true }
  );

  if (!milestone) {
    return res.status(404).json({ message: 'Milestone not found' });
  }

  res.json({
    success: true,
    data: milestone
  });
});

// @desc    Submit client feedback for milestone
// @route   PUT /api/milestones/:id/feedback
// @access  Private (Client)
export const submitMilestoneFeedback = asyncHandler(async (req, res) => {
  const { rating, comments, approved } = req.body;

  const milestone = await ProjectMilestone.findByIdAndUpdate(
    req.params.id,
    {
      clientFeedback: {
        rating,
        comments,
        approved,
        submittedAt: new Date()
      },
      status: approved ? 'approved' : 'revision_requested'
    },
    { new: true }
  );

  if (!milestone) {
    return res.status(404).json({ message: 'Milestone not found' });
  }

  res.json({
    success: true,
    data: milestone
  });
});