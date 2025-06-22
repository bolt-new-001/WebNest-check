import asyncHandler from 'express-async-handler';
import DeveloperPortfolio from '../models/DeveloperPortfolio.js';

// @desc    Get developer portfolio
// @route   GET /api/portfolio
// @access  Private (Developer)
export const getMyPortfolio = asyncHandler(async (req, res) => {
  let portfolio = await DeveloperPortfolio.findOne({ 
    developerId: req.developer._id 
  });

  if (!portfolio) {
    // Create empty portfolio
    portfolio = await DeveloperPortfolio.create({
      developerId: req.developer._id,
      bio: '',
      projects: [],
      skills: []
    });
  }

  res.json({
    success: true,
    data: portfolio
  });
});

// @desc    Update portfolio
// @route   PUT /api/portfolio
// @access  Private (Developer)
export const updatePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await DeveloperPortfolio.findOneAndUpdate(
    { developerId: req.developer._id },
    { ...req.body, lastUpdated: new Date() },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: portfolio
  });
});

// @desc    Add portfolio project
// @route   POST /api/portfolio/projects
// @access  Private (Developer)
export const addPortfolioProject = asyncHandler(async (req, res) => {
  const portfolio = await DeveloperPortfolio.findOneAndUpdate(
    { developerId: req.developer._id },
    { 
      $push: { projects: req.body },
      lastUpdated: new Date()
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: portfolio
  });
});

// @desc    Get public developer profile
// @route   GET /api/portfolio/public/:developerId
// @access  Public
export const getPublicDeveloperProfile = asyncHandler(async (req, res) => {
  const portfolio = await DeveloperPortfolio.findOne({
    developerId: req.params.developerId,
    isPublic: true
  }).populate('developerId', 'name email avatar joinedAt');

  if (!portfolio) {
    return res.status(404).json({ message: 'Developer profile not found' });
  }

  // Increment profile views
  portfolio.profileViews += 1;
  await portfolio.save();

  res.json({
    success: true,
    data: portfolio
  });
});

// @desc    Search developer profiles
// @route   GET /api/portfolio/search
// @access  Public
export const searchDeveloperProfiles = asyncHandler(async (req, res) => {
  const { skills, category, rating, availability } = req.query;

  const query = { isPublic: true };

  if (skills) {
    query['skills.name'] = { $in: skills.split(',') };
  }

  if (category) {
    query['projects.category'] = category;
  }

  if (rating) {
    query['statistics.averageRating'] = { $gte: parseFloat(rating) };
  }

  if (availability) {
    query['availability.status'] = availability;
  }

  const profiles = await DeveloperPortfolio.find(query)
    .populate('developerId', 'name avatar')
    .sort({ 'statistics.averageRating': -1, profileViews: -1 })
    .limit(20);

  res.json({
    success: true,
    data: profiles
  });
});