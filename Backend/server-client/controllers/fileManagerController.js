import asyncHandler from 'express-async-handler';
import ProjectFile from '../models/ProjectFile.js';
import Project from '../models/Project.js';
import { logActivity } from './activityFeedController.js';
import multer from 'multer';
import path from 'path';
import cloudinary from '../config/cloudinaryConfig.js';
import { promises as fs } from 'fs';

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip', 'application/x-zip-compressed'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, PDF, and ZIP files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @desc    Upload project file
// @route   POST /api/files/upload/:projectId
// @access  Private
export const uploadProjectFile = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { category, description, isPublic = false } = req.body;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Determine file type
  let fileType = 'other';
  if (req.file.mimetype.startsWith('image/')) {
    fileType = 'image';
  } else if (req.file.mimetype === 'application/pdf') {
    fileType = 'document';
  } else if (req.file.mimetype.includes('zip')) {
    fileType = 'archive';
  }

  try {
    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: `webnest/projects/${projectId}`,
      resource_type: 'auto'
    });

    // Create file record
    const projectFile = await ProjectFile.create({
      projectId,
      uploadedBy: req.user._id,
      uploaderType: 'User',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      fileType,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      category: category || 'other',
      description,
      isPublic
    });

    // Delete temporary file
    await fs.unlink(req.file.path);


  // Log activity
  await logActivity(
    projectId,
    req.user._id,
    'User',
    'file_uploaded',
    `Uploaded file: ${req.file.originalname}`,
    { fileId: projectFile._id, category, fileType }
  );

  res.status(201).json({
    success: true,
    data: projectFile
  });
});

// @desc    Get project files
// @route   GET /api/files/project/:projectId
// @access  Private
export const getProjectFiles = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { category, fileType, page = 1, limit = 20 } = req.query;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const query = { projectId };
  if (category) query.category = category;
  if (fileType) query.fileType = fileType;

  const files = await ProjectFile.find(query)
    .populate('uploadedBy', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ProjectFile.countDocuments(query);

  res.json({
    success: true,
    data: files,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Delete project file
// @route   DELETE /api/files/:fileId
// @access  Private
export const deleteProjectFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await ProjectFile.findById(fileId);

  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Verify project access
  const project = await Project.findOne({
    _id: file.projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  await ProjectFile.findByIdAndDelete(fileId);

  // Log activity
  await logActivity(
    file.projectId,
    req.user._id,
    'User',
    'file_deleted',
    `Deleted file: ${file.originalName}`,
    { fileId, category: file.category }
  );

  res.json({
    success: true,
    message: 'File deleted successfully'
  });
});

// @desc    Download project file
// @route   GET /api/files/download/:fileId
// @access  Private
export const downloadProjectFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await ProjectFile.findById(fileId);

  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Verify project access
  const project = await Project.findOne({
    _id: file.projectId,
    clientId: req.user._id
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Increment download count
  file.downloadCount += 1;
  await file.save();

  res.download(file.fileUrl, file.originalName);
});

// @desc    Get file statistics
// @route   GET /api/files/stats/:projectId
// @access  Private
export const getFileStats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const stats = await ProjectFile.aggregate([
    { $match: { projectId: mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: '$fileSize' },
        fileTypes: { $push: '$fileType' },
        categories: { $push: '$category' }
      }
    }
  ]);

  const typeBreakdown = await ProjectFile.aggregate([
    { $match: { projectId: mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: '$fileType',
        count: { $sum: 1 },
        totalSize: { $sum: '$fileSize' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || { totalFiles: 0, totalSize: 0 },
      typeBreakdown
    }
  });
});