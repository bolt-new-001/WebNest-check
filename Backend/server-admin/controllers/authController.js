import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (admin && (await admin.comparePassword(password))) {
    // Update last login
    admin.lastLogin = new Date();
    admin.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    await admin.save();

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        token: generateToken(admin._id)
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.admin
  });
});

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Admin logged out successfully'
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!(await admin.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  admin.password = newPassword;
  await admin.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Create new admin
// @route   POST /api/auth/create-admin
// @access  Private (Owner only)
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, permissions } = req.body;

  // Check if admin exists
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
    permissions
  });

  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }
  });
});