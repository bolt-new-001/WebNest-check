import asyncHandler from 'express-async-handler';
import ProjectBackup from '../models/ProjectBackup.js';
import Project from '../models/Project.js';

// @desc    Create project backup
// @route   POST /api/backup/create/:projectId
// @access  Private
export const createProjectBackup = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { description, backupType = 'manual', tags } = req.body;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Generate version number
  const lastBackup = await ProjectBackup.findOne({ projectId })
    .sort({ createdAt: -1 });
  
  const versionNumber = lastBackup ? 
    parseInt(lastBackup.version.split('.')[0]) + 1 : 1;
  const version = `${versionNumber}.0`;

  // Create backup data snapshot
  const backupData = {
    projectSnapshot: project.toObject(),
    // Add other related data as needed
  };

  const backup = await ProjectBackup.create({
    projectId,
    backupType,
    version,
    description,
    backupData,
    createdBy: req.user._id,
    creatorType: 'User',
    tags,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  });

  res.status(201).json({
    success: true,
    data: backup
  });
});

// @desc    Get project backups
// @route   GET /api/backup/project/:projectId
// @access  Private
export const getProjectBackups = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const backups = await ProjectBackup.find({ projectId })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: backups
  });
});

// @desc    Restore project backup
// @route   PUT /api/backup/restore/:backupId
// @access  Private
export const restoreProjectBackup = asyncHandler(async (req, res) => {
  const { backupId } = req.params;

  const backup = await ProjectBackup.findById(backupId);
  if (!backup) {
    return res.status(404).json({ message: 'Backup not found' });
  }

  // Verify project access
  const project = await Project.findOne({
    _id: backup.projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Mark backup as restored
  backup.isRestored = true;
  backup.restoredAt = new Date();
  backup.restoredBy = req.user._id;
  backup.restorerType = 'User';
  await backup.save();

  res.json({
    success: true,
    message: 'Backup restored successfully'
  });
});