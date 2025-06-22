import asyncHandler from 'express-async-handler';
import Developer from '../models/Developer.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register developer
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, skills, experience } = req.body;

  // Check if developer exists
  const developerExists = await Developer.findOne({ email });
  if (developerExists) {
    return res.status(400).json({ message: 'Developer already exists' });
  }

  // Create developer
  const developer = await Developer.create({
    name,
    email,
    password,
    skills,
    experience
  });

  if (developer) {
    res.status(201).json({
      success: true,
      data: {
        _id: developer._id,
        name: developer.name,
        email: developer.email,
        role: developer.role,
        isVerified: developer.isVerified,
        token: generateToken(developer._id)
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid developer data' });
  }
});

// @desc    Login developer
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for developer
  const developer = await Developer.findOne({ email }).select('+password');

  if (developer && (await developer.comparePassword(password))) {
    res.json({
      success: true,
      data: {
        _id: developer._id,
        name: developer.name,
        email: developer.email,
        role: developer.role,
        isVerified: developer.isVerified,
        token: generateToken(developer._id)
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// @desc    Get current developer
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.developer
  });
});

// @desc    Logout developer
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Developer logged out successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  // TODO: Implement forgot password logic
  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  // TODO: Implement reset password logic
  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const developer = await Developer.findById(req.developer._id).select('+password');

  if (!(await developer.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  developer.password = newPassword;
  await developer.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});