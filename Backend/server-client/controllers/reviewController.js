import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Project from '../models/Project.js';
import Developer from '../models/Developer.js';
import { createActivityLog } from '../middleware/activityLogger.js';

// @desc    Create a review for a developer
// @route   POST /api/reviews
// @access  Private (Client only)
export const createReview = asyncHandler(async (req, res) => {
  const { projectId, developerId, rating, feedback, categories } = req.body;

  // Verify project belongs to client and is completed
  const project = await Project.findOne({
    _id: projectId,
    clientId: req.user._id,
    status: 'completed'
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found or not completed' });
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ projectId, clientId: req.user._id });
  if (existingReview) {
    return res.status(400).json({ message: 'Review already submitted for this project' });
  }

  // Create review
  const review = await Review.create({
    projectId,
    clientId: req.user._id,
    developerId,
    rating,
    feedback,
    categories
  });

  // Update developer's average rating
  await updateDeveloperRating(developerId);

  // Log activity
  await createActivityLog(
    req.user._id,
    'User',
    'review_submitted',
    `Submitted review for project ${project.title}`,
    { entityType: 'Review', entityId: review._id }
  );

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get reviews for a developer
// @route   GET /api/reviews/developer/:developerId
// @access  Public
export const getDeveloperReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Review.find({
    developerId: req.params.developerId,
    isPublic: true
  })
    .populate('clientId', 'name avatar')
    .populate('projectId', 'title projectType')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments({
    developerId: req.params.developerId,
    isPublic: true
  });

  // Calculate rating statistics
  const stats = await Review.aggregate([
    { $match: { developerId: mongoose.Types.ObjectId(req.params.developerId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: reviews,
    stats: stats[0] || { averageRating: 0, totalReviews: 0 },
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Respond to a review
// @route   PUT /api/reviews/:id/respond
// @access  Private (Developer only)
export const respondToReview = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, developerId: req.developer._id },
    {
      response: {
        message,
        respondedAt: new Date()
      }
    },
    { new: true }
  );

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  res.json({
    success: true,
    data: review
  });
});

// Helper function to update developer's average rating
async function updateDeveloperRating(developerId) {
  const stats = await Review.aggregate([
    { $match: { developerId: mongoose.Types.ObjectId(developerId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Developer.findByIdAndUpdate(developerId, {
      'rating.average': Math.round(stats[0].averageRating * 10) / 10,
      'rating.count': stats[0].totalReviews
    });
  }
}