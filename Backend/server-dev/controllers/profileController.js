import asyncHandler from 'express-async-handler';
import Developer from '../models/Developer.js';
import ProjectAssignment from '../models/ProjectAssignment.js';

// @desc    Get developer profile
// @route   GET /api/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const developer = await Developer.findById(req.developer._id);

  res.json({
    success: true,
    data: developer
  });
});

// @desc    Update developer profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, avatar } = req.body;

  const developer = await Developer.findByIdAndUpdate(
    req.developer._id,
    {
      name,
      phone,
      bio,
      avatar
    },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: developer
  });
});

// @desc    Update developer skills
// @route   PUT /api/profile/skills
// @access  Private
export const updateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ message: 'Skills must be provided as an array' });
  }

  const developer = await Developer.findByIdAndUpdate(
    req.developer._id,
    { skills },
    { new: true }
  );

  res.json({
    success: true,
    data: developer
  });
});

// @desc    Add portfolio item
// @route   POST /api/profile/portfolio
// @access  Private
export const addPortfolioItem = asyncHandler(async (req, res) => {
  const { title, description, url, image, technologies } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const developer = await Developer.findByIdAndUpdate(
    req.developer._id,
    {
      $push: {
        portfolio: {
          title,
          description,
          url,
          image,
          technologies
        }
      }
    },
    { new: true }
  );

  res.json({
    success: true,
    data: developer.portfolio
  });
});

// @desc    Update availability
// @route   PUT /api/profile/availability
// @access  Private
export const updateAvailability = asyncHandler(async (req, res) => {
  const { status, hoursPerWeek, timezone } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Availability status is required' });
  }

  const developer = await Developer.findByIdAndUpdate(
    req.developer._id,
    {
      'availability.status': status,
      'availability.hoursPerWeek': hoursPerWeek,
      'availability.timezone': timezone
    },
    { new: true }
  );

  res.json({
    success: true,
    data: developer.availability
  });
});

// @desc    Get developer stats
// @route   GET /api/profile/stats
// @access  Private
export const getStats = asyncHandler(async (req, res) => {
  const developer = await Developer.findById(req.developer._id);
  const assignments = await ProjectAssignment.find({ developerId: req.developer._id });

  const stats = {
    totalProjects: developer.totalProjects,
    completedProjects: developer.completedProjects,
    totalEarnings: developer.totalEarnings,
    rating: developer.rating,
    activeProjects: assignments.filter(a => ['accepted', 'in_progress'].includes(a.status)).length,
    pendingProjects: assignments.filter(a => a.status === 'pending').length
  };

  res.json({
    success: true,
    data: stats
  });
});