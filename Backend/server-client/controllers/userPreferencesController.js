import asyncHandler from 'express-async-handler';
import UserPreferences from '../models/UserPreferences.js';

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
export const getUserPreferences = asyncHandler(async (req, res) => {
  let preferences = await UserPreferences.findOne({ userId: req.user._id });

  if (!preferences) {
    // Create default preferences
    preferences = await UserPreferences.create({
      userId: req.user._id,
      currency: 'INR',
      language: 'en',
      theme: 'auto'
    });
  }

  res.json({
    success: true,
    data: preferences
  });
});

// @desc    Update user preferences
// @route   PUT /api/preferences
// @access  Private
export const updateUserPreferences = asyncHandler(async (req, res) => {
  const preferences = await UserPreferences.findOneAndUpdate(
    { userId: req.user._id },
    req.body,
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: preferences
  });
});

// @desc    Update location
// @route   PUT /api/preferences/location
// @access  Private
export const updateLocation = asyncHandler(async (req, res) => {
  const { country, state, city, timezone, coordinates } = req.body;

  const preferences = await UserPreferences.findOneAndUpdate(
    { userId: req.user._id },
    {
      location: {
        country,
        state,
        city,
        timezone,
        coordinates
      }
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    data: preferences
  });
});