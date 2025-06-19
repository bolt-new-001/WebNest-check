import asyncHandler from 'express-async-handler';
import ProjectTimeTracking from '../models/ProjectTimeTracking.js';
import Project from '../models/Project.js';

// @desc    Start time tracking session
// @route   POST /api/time-tracking/start
// @access  Private (Developer)
export const startTimeTracking = asyncHandler(async (req, res) => {
  const { projectId, description, taskType, milestoneId } = req.body;

  // Verify project access
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  let timeTracking = await ProjectTimeTracking.findOne({
    projectId,
    userId: req.developer._id
  });

  if (!timeTracking) {
    timeTracking = await ProjectTimeTracking.create({
      projectId,
      userId: req.developer._id,
      userType: 'Developer',
      sessions: []
    });
  }

  // Check if there's already an active session
  const activeSession = timeTracking.sessions.find(session => session.isActive);
  if (activeSession) {
    return res.status(400).json({ message: 'There is already an active session' });
  }

  // Start new session
  timeTracking.sessions.push({
    startTime: new Date(),
    description,
    taskType,
    milestoneId,
    isActive: true
  });

  await timeTracking.save();

  res.status(201).json({
    success: true,
    data: timeTracking
  });
});

// @desc    Stop time tracking session
// @route   PUT /api/time-tracking/stop/:sessionId
// @access  Private (Developer)
export const stopTimeTracking = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { productivity } = req.body;

  const timeTracking = await ProjectTimeTracking.findOne({
    userId: req.developer._id,
    'sessions._id': sessionId
  });

  if (!timeTracking) {
    return res.status(404).json({ message: 'Time tracking session not found' });
  }

  const session = timeTracking.sessions.id(sessionId);
  if (!session.isActive) {
    return res.status(400).json({ message: 'Session is not active' });
  }

  // Stop session
  session.endTime = new Date();
  session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60)); // minutes
  session.isActive = false;
  session.productivity = productivity || 'medium';

  await timeTracking.save();

  res.json({
    success: true,
    data: timeTracking
  });
});

// @desc    Get time tracking for project
// @route   GET /api/time-tracking/project/:projectId
// @access  Private
export const getProjectTimeTracking = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const timeTracking = await ProjectTimeTracking.find({ projectId })
    .populate('userId', 'name avatar')
    .populate('sessions.milestoneId', 'title');

  res.json({
    success: true,
    data: timeTracking
  });
});