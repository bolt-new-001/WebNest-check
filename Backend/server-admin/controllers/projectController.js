import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import ProjectAssignment from '../models/ProjectAssignment.js';
import Developer from '../models/Developer.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getAllProjects = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const projects = await Project.find(query)
    .populate('clientId', 'name email')
    .populate('developerId', 'name email')
    .populate('selectedTheme', 'name')
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
  const project = await Project.findById(req.params.id)
    .populate('clientId')
    .populate('developerId')
    .populate('selectedTheme');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Assign project to developer
// @route   PUT /api/projects/:id/assign
// @access  Private
export const assignProject = asyncHandler(async (req, res) => {
  const { developerId, estimatedHours, hourlyRate } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { 
      developerId,
      status: 'assigned'
    },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Create project assignment
  const assignment = await ProjectAssignment.create({
    projectId: project._id,
    developerId,
    assignedBy: req.admin._id,
    estimatedHours,
    hourlyRate,
    totalAmount: estimatedHours * hourlyRate
  });

  res.json({
    success: true,
    data: { project, assignment },
    message: 'Project assigned successfully'
  });
});

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private
export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({
    success: true,
    data: project,
    message: 'Project status updated successfully'
  });
});

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
export const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' }
      }
    }
  ]);

  const totalProjects = await Project.countDocuments();
  const avgBudget = await Project.aggregate([
    { $group: { _id: null, avgBudget: { $avg: '$budget' } } }
  ]);

  res.json({
    success: true,
    data: {
      statusBreakdown: stats,
      totalProjects,
      averageBudget: avgBudget[0]?.avgBudget || 0
    }
  });
});

// @desc    Reassign project to different developer
// @route   PUT /api/projects/:id/reassign
// @access  Private
export const reassignProject = asyncHandler(async (req, res) => {
  const { newDeveloperId, reason } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { developerId: newDeveloperId },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Update assignment record
  await ProjectAssignment.findOneAndUpdate(
    { projectId: project._id },
    { 
      developerId: newDeveloperId,
      reassignedBy: req.admin._id,
      reassignmentReason: reason,
      reassignedAt: new Date()
    }
  );

  res.json({
    success: true,
    data: project,
    message: 'Project reassigned successfully'
  });
});