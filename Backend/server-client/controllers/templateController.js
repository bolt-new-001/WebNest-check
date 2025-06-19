import asyncHandler from 'express-async-handler';
import ProjectTemplate from '../models/ProjectTemplate.js';

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
export const getAllTemplates = asyncHandler(async (req, res) => {
  const { category, complexity, premium, tags } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (complexity) query.complexity = complexity;
  if (premium !== undefined) query.isPremium = premium === 'true';
  if (tags) query.tags = { $in: tags.split(',') };

  const templates = await ProjectTemplate.find(query)
    .sort({ 'rating.average': -1, downloadCount: -1 });

  res.json({
    success: true,
    data: templates
  });
});

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Public
export const getTemplate = asyncHandler(async (req, res) => {
  const template = await ProjectTemplate.findByIdAndUpdate(
    req.params.id,
    { $inc: { downloadCount: 1 } },
    { new: true }
  );

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  res.json({
    success: true,
    data: template
  });
});

// @desc    Rate template
// @route   POST /api/templates/:id/rate
// @access  Private
export const rateTemplate = asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const template = await ProjectTemplate.findById(req.params.id);

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  // Calculate new average rating
  const newCount = template.rating.count + 1;
  const newAverage = ((template.rating.average * template.rating.count) + rating) / newCount;

  template.rating.average = Math.round(newAverage * 10) / 10;
  template.rating.count = newCount;

  await template.save();

  res.json({
    success: true,
    data: template
  });
});