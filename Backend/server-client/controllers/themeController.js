import asyncHandler from 'express-async-handler';
import Theme from '../models/Theme.js';

// @desc    Get all themes
// @route   GET /api/themes
// @access  Public
export const getThemes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, isPremium } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (isPremium !== undefined) query.isPremium = isPremium === 'true';

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

// @desc    Get single theme
// @route   GET /api/themes/:id
// @access  Public
export const getTheme = asyncHandler(async (req, res) => {
  const theme = await Theme.findById(req.params.id);

  if (!theme) {
    return res.status(404).json({ message: 'Theme not found' });
  }

  // Increment downloads count
  theme.downloads += 1;
  await theme.save();

  res.json({
    success: true,
    data: theme
  });
});

// @desc    Get themes by category
// @route   GET /api/themes/category/:category
// @access  Public
export const getThemesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 12 } = req.query;

  const themes = await Theme.find({ category, isActive: true })
    .sort({ downloads: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  res.json({
    success: true,
    data: themes
  });
});

// @desc    Search themes
// @route   GET /api/themes/search
// @access  Public
export const searchThemes = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  const query = { isActive: true };

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
  }

  if (category) query.category = category;
  if (minPrice) query.price = { $gte: parseInt(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };

  const themes = await Theme.find(query).sort({ downloads: -1 });

  res.json({
    success: true,
    data: themes
  });
});

// @desc    Rate theme
// @route   POST /api/themes/:id/rate
// @access  Private
export const rateTheme = asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const theme = await Theme.findById(req.params.id);

  if (!theme) {
    return res.status(404).json({ message: 'Theme not found' });
  }

  // Calculate new average rating
  const newCount = theme.rating.count + 1;
  const newAverage = ((theme.rating.average * theme.rating.count) + rating) / newCount;

  theme.rating.average = newAverage;
  theme.rating.count = newCount;

  await theme.save();

  res.json({
    success: true,
    data: theme
  });
});