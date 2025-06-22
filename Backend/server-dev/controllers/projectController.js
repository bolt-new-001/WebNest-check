import asyncHandler from 'express-async-handler';
import ProjectAssignment from '../models/ProjectAssignment.js';

// @desc    Get assigned projects
// @route   GET /api/projects
// @access  Private
export const getAssignedProjects = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { developerId: req.developer._id };
  if (status) query.status = status;

  const assignments = await ProjectAssignment.find(query)
    .populate('projectId', 'title description budget status priority')
    .populate('assignedBy', 'name email')
    .sort({ assignedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ProjectAssignment.countDocuments(query);

  res.json({
    success: true,
    data: assignments,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get single project assignment
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req, res) => {
  const assignment = await ProjectAssignment.findOne({
    _id: req.params.id,
    developerId: req.developer._id
  })
    .populate('projectId')
    .populate('assignedBy', 'name email');

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment not found' });
  }

  res.json({
    success: true,
    data: assignment
  });
});

// @desc    Accept project assignment
// @route   PUT /api/projects/:id/accept
// @access  Private
export const acceptProject = asyncHandler(async (req, res) => {
  const assignment = await ProjectAssignment.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    { status: 'accepted' },
    { new: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment not found' });
  }

  res.json({
    success: true,
    data: assignment,
    message: 'Project accepted successfully'
  });
});

// @desc    Reject project assignment
// @route   PUT /api/projects/:id/reject
// @access  Private
export const rejectProject = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const assignment = await ProjectAssignment.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    { 
      status: 'rejected',
      rejectionReason: reason
    },
    { new: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment not found' });
  }

  res.json({
    success: true,
    data: assignment,
    message: 'Project rejected'
  });
});

// @desc    Update project progress
// @route   PUT /api/projects/:id/progress
// @access  Private
export const updateProjectProgress = asyncHandler(async (req, res) => {
  const { progress, notes } = req.body;

  const assignment = await ProjectAssignment.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    { 
      status: 'in_progress',
      $push: {
        progressUpdates: {
          progress,
          notes,
          updatedAt: new Date()
        }
      }
    },
    { new: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment not found' });
  }

  res.json({
    success: true,
    data: assignment
  });
});

// @desc    Add work log
// @route   POST /api/projects/:id/worklog
// @access  Private
export const addWorkLog = asyncHandler(async (req, res) => {
  const { hours, description } = req.body;

  const assignment = await ProjectAssignment.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    {
      $push: {
        workLogs: {
          hours,
          description,
          date: new Date()
        }
      },
      $inc: { actualHours: hours }
    },
    { new: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment not found' });
  }

  res.json({
    success: true,
    data: assignment
  });
});

// @desc    Upload proof of work
// @route   POST /api/projects/:id/proof
// @access  Private
export const uploadProofOfWork = asyncHandler(async (req, res) => {
  // TODO: Implement file upload logic
  res.json({
    success: true,
    message: 'Proof of work uploaded successfully'
  });
});

// @desc    Mark milestone as complete
// @route   PUT /api/projects/:id/milestone/:milestoneId/complete
// @access  Private
export const markMilestoneComplete = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  const assignment = await ProjectAssignment.findOneAndUpdate(
    { 
      _id: req.params.id, 
      developerId: req.developer._id,
      'milestones._id': req.params.milestoneId
    },
    {
      $set: {
        'milestones.$.status': 'completed',
        'milestones.$.completedAt': new Date(),
        'milestones.$.notes': notes
      }
    },
    { new: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment or milestone not found' });
  }

  res.json({
    success: true,
    data: assignment
  });
});

// @desc    Submit completed project
// @route   PUT /api/projects/:id/submit
// @access  Private
export const submitProject = asyncHandler(async (req, res) => {
  const { deliverables, notes } = req.body;

  const assignment = await ProjectAssignment.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    { 
      status: 'completed',
      deliverables,
      completionNotes: notes,
      completedAt: new Date()
    },
    { new: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Project assignment not found' });
  }

  // Update developer stats
  await req.developer.updateOne({
    $inc: { completedProjects: 1 }
  });

  res.json({
    success: true,
    data: assignment,
    message: 'Project submitted for review'
  });
});