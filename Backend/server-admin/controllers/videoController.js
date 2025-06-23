import asyncHandler from 'express-async-handler';
import VideoContent from '../models/VideoContent.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getAllVideos = asyncHandler(async (req, res) => {
  const { category, featured, audience = 'all' } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (featured !== undefined) query.isFeatured = featured === 'true';
  if (audience !== 'all') query.targetAudience = { $in: [audience, 'all'] };

  const videos = await VideoContent.find(query)
    .sort({ isFeatured: -1, viewCount: -1 })
    .populate('createdBy', 'name');

  res.json({
    success: true,
    data: videos
  });
});

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
export const getVideo = asyncHandler(async (req, res) => {
  const video = await VideoContent.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('createdBy', 'name');

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  res.json({
    success: true,
    data: video
  });
});

// @desc    Create video
// @route   POST /api/videos
// @access  Private (Admin)
export const createVideo = asyncHandler(async (req, res) => {
  const video = await VideoContent.create({
    ...req.body,
    createdBy: req.admin._id
  });

  res.status(201).json({
    success: true,
    data: video
  });
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private (Admin)
export const updateVideo = asyncHandler(async (req, res) => {
  const video = await VideoContent.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  res.json({
    success: true,
    data: video
  });
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private (Admin)
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await VideoContent.findByIdAndDelete(req.params.id);

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  res.json({
    success: true,
    message: 'Video deleted successfully'
  });
});