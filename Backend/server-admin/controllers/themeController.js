import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const Theme = mongoose.model('Theme');

// @desc    Get all themes
// @route   GET /api/themes
// @access  Private
export const getAllThemes = asyncHandler(async (req, res) => {
  const { category, isPremium, isActive, page = 1, limit = 20 } = req.query;

  const query = {};
  if (category) query.category = category;
  if (isPremium !== undefined) query.isPremium = isPremium === 'true';
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const themes = await Theme.find(query)
    .sort({ downloads: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Theme.countDocuments(query);

  res.json({
    success: true,
    data: themes,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Create new theme
// @route   POST /api/themes
// @access  Private
export const createTheme = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    previewImage,
    demoUrl,
    features,
    techStack,
    price,
    isPremium,
    tags
  } = req.body;

  const theme = await Theme.create({
    name,
    description,
    category,
    previewImage,
    demoUrl,
    features,
    techStack,
    price,
    isPremium,
    tags,
    createdBy: req.admin._id
  });

  res.status(201).json({
    success: true,
    data: theme
  });
});

// @desc    Update theme
// @route   PUT /api/themes/:id
// @access  Private
export const updateTheme = asyncHandler(async (req, res) => {
  const theme = await Theme.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!theme) {
    return res.status(404).json({ message: 'Theme not found' });
  }

  res.json({
    success: true,
    data: theme
  });
});

// @desc    Delete theme
// @route   DELETE /api/themes/:id
// @access  Private
export const deleteTheme = asyncHandler(async (req, res) => {
  const theme = await Theme.findByIdAndDelete(req.params.id);

  if (!theme) {
    return res.status(404).json({ message: 'Theme not found' });
  }

  res.json({
    success: true,
    message: 'Theme deleted successfully'
  });
});

// @desc    Get theme statistics
// @route   GET /api/themes/stats
// @access  Private
export const getThemeStats = asyncHandler(async (req, res) => {
  const stats = await Theme.aggregate([
    {
      $facet: {
        categoryBreakdown: [
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ],
        premiumBreakdown: [
          { $group: { _id: '$isPremium', count: { $sum: 1 } } }
        ],
        popularThemes: [
          { $sort: { downloads: -1 } },
          { $limit: 10 },
          { $project: { name: 1, downloads: 1, rating: 1 } }
        ],
        totalDownloads: [
          { $group: { _id: null, total: { $sum: '$downloads' } } }
        ]
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0]
  });
});