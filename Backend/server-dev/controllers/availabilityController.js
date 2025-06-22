import asyncHandler from 'express-async-handler';
import DeveloperAvailability from '../models/DeveloperAvailability.js';
import Developer from '../models/Developer.js';

// @desc    Get developer availability
// @route   GET /api/availability
// @access  Private
export const getAvailability = asyncHandler(async (req, res) => {
  let availability = await DeveloperAvailability.findOne({
    developerId: req.developer._id
  });

  if (!availability) {
    // Create default availability
    availability = await DeveloperAvailability.create({
      developerId: req.developer._id,
      timezone: 'Asia/Kolkata'
    });
  }

  res.json({
    success: true,
    data: availability
  });
});

// @desc    Update developer availability
// @route   PUT /api/availability
// @access  Private
export const updateAvailability = asyncHandler(async (req, res) => {
  const {
    weeklySchedule,
    timezone,
    maxProjectsPerWeek,
    preferredProjectTypes,
    minimumProjectBudget,
    isAcceptingNewProjects
  } = req.body;

  const availability = await DeveloperAvailability.findOneAndUpdate(
    { developerId: req.developer._id },
    {
      weeklySchedule,
      timezone,
      maxProjectsPerWeek,
      preferredProjectTypes,
      minimumProjectBudget,
      isAcceptingNewProjects
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: availability
  });
});

// @desc    Add vacation period
// @route   POST /api/availability/vacation
// @access  Private
export const addVacation = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  const availability = await DeveloperAvailability.findOneAndUpdate(
    { developerId: req.developer._id },
    {
      $push: {
        vacations: {
          startDate,
          endDate,
          reason
        }
      }
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: availability
  });
});

// @desc    Update current workload
// @route   PUT /api/availability/workload
// @access  Private
export const updateWorkload = asyncHandler(async (req, res) => {
  const { currentWorkload } = req.body;

  const availability = await DeveloperAvailability.findOneAndUpdate(
    { developerId: req.developer._id },
    { currentWorkload },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: availability
  });
});

// @desc    Get available developers (for admin)
// @route   GET /api/availability/developers
// @access  Private (Admin)
export const getAvailableDevelopers = asyncHandler(async (req, res) => {
  const { projectType, minBudget } = req.query;

  const query = {
    isAcceptingNewProjects: true,
    currentWorkload: { $lt: '$maxProjectsPerWeek' }
  };

  if (projectType) {
    query.preferredProjectTypes = projectType;
  }

  if (minBudget) {
    query.minimumProjectBudget = { $lte: parseInt(minBudget) };
  }

  const availabilities = await DeveloperAvailability.find(query)
    .populate({
      path: 'developerId',
      select: 'name email skills rating totalProjects isVerified',
      match: { isVerified: true, isActive: true }
    });

  const availableDevelopers = availabilities
    .filter(av => av.developerId)
    .map(av => ({
      developer: av.developerId,
      availability: av
    }));

  res.json({
    success: true,
    data: availableDevelopers
  });
});