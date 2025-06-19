import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    projectType,
    budget,
    selectedTheme,
    features,
    aiFeatures
  } = req.body;

  const project = await Project.create({
    clientId: req.user._id,
    title,
    description,
    projectType,
    budget,
    selectedTheme,
    features,
    aiFeatures
  });

  // Create notification for admin
  await Notification.create({
    userId: req.user._id,
    title: 'New Project Created',
    message: `Your project "${title}" has been submitted for review`,
    type: 'project_update',
    metadata: { projectId: project._id }
  });

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Get user's projects
// @route   GET /api/projects
// @access  Private
export const getMyProjects = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { clientId: req.user._id };
  if (status) query.status = status;

  const projects = await Project.find(query)
    .populate('selectedTheme', 'name previewImage')
    .populate('developerId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments(query);

  res.json({
    success: true,
    data: projects,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    clientId: req.user._id
  })
    .populate('selectedTheme')
    .populate('developerId', 'name avatar email');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, clientId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Cancel project
// @route   DELETE /api/projects/:id
// @access  Private
export const cancelProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, clientId: req.user._id },
    { status: 'cancelled' },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    message: 'Project cancelled successfully'
  });
});

// @desc    Add feedback to project
// @route   POST /api/projects/:id/feedback
// @access  Private
export const addFeedback = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, clientId: req.user._id },
    {
      $push: {
        feedback: { message, rating }
      }
    },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Get project progress
// @route   GET /api/projects/:id/progress
// @access  Private
export const getProjectProgress = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    clientId: req.user._id
  }).select('progress timeline status');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Upload project file
// @route   POST /api/projects/:id/upload
// @access  Private
export const uploadProjectFile = asyncHandler(async (req, res) => {
  // TODO: Implement file upload logic
  res.json({
    success: true,
    message: 'File uploaded successfully'
  });
});