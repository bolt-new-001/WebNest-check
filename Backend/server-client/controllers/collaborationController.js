import asyncHandler from 'express-async-handler';
import ProjectCollaboration from '../models/ProjectCollaboration.js';
import Project from '../models/Project.js';
import { logActivity } from './activityFeedController.js';
import { createClientNotification } from './clientNotificationController.js';

// @desc    Invite collaborator to project
// @route   POST /api/collaboration/invite
// @access  Private (Project Owner)
export const inviteCollaborator = asyncHandler(async (req, res) => {
  const { projectId, email, role, permissions } = req.body;

  // Verify project ownership
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Find user by email
  const invitedUser = await User.findOne({ email });
  if (!invitedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if collaboration already exists
  let collaboration = await ProjectCollaboration.findOne({ projectId });
  
  if (!collaboration) {
    collaboration = await ProjectCollaboration.create({
      projectId,
      collaborators: []
    });
  }

  // Check if user is already a collaborator
  const existingCollaborator = collaboration.collaborators.find(
    c => c.userId.toString() === invitedUser._id.toString()
  );

  if (existingCollaborator) {
    return res.status(400).json({ message: 'User is already a collaborator' });
  }

  // Add collaborator
  collaboration.collaborators.push({
    userId: invitedUser._id,
    userType: 'User',
    role,
    permissions,
    invitedBy: req.user._id,
    status: 'pending'
  });

  await collaboration.save();

  // Send notification to invited user
  await createClientNotification({
    userId: invitedUser._id,
    title: 'Project Collaboration Invitation',
    message: `You've been invited to collaborate on ${project.title}`,
    type: 'project_update',
    projectId: projectId,
    actionUrl: `/projects/${projectId}/collaboration`,
    actionText: 'View Invitation'
  });

  // Log activity
  await logActivity(
    projectId,
    req.user._id,
    'User',
    'collaborator_invited',
    `Invited ${invitedUser.name} as ${role}`,
    { collaboratorId: invitedUser._id, role }
  );

  res.status(201).json({
    success: true,
    message: 'Collaborator invited successfully'
  });
});

// @desc    Accept collaboration invitation
// @route   PUT /api/collaboration/accept/:projectId
// @access  Private
export const acceptCollaboration = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const collaboration = await ProjectCollaboration.findOneAndUpdate(
    {
      projectId,
      'collaborators.userId': req.user._id,
      'collaborators.status': 'pending'
    },
    {
      $set: {
        'collaborators.$.status': 'accepted',
        'collaborators.$.acceptedAt': new Date()
      }
    },
    { new: true }
  );

  if (!collaboration) {
    return res.status(404).json({ message: 'Invitation not found' });
  }

  // Log activity
  await logActivity(
    projectId,
    req.user._id,
    'User',
    'collaboration_accepted',
    `${req.user.name} joined the project team`,
    { collaboratorId: req.user._id }
  );

  res.json({
    success: true,
    message: 'Collaboration invitation accepted'
  });
});

// @desc    Get project collaborators
// @route   GET /api/collaboration/project/:projectId
// @access  Private
export const getProjectCollaborators = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const collaboration = await ProjectCollaboration.findOne({ projectId })
    .populate('collaborators.userId', 'name email avatar')
    .populate('collaborators.invitedBy', 'name');

  if (!collaboration) {
    return res.json({
      success: true,
      data: { collaborators: [] }
    });
  }

  res.json({
    success: true,
    data: collaboration
  });
});