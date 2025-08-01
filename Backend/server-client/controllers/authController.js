import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import * as emailService from '../utils/emailService.js';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'client' } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15);

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    emailVerificationCode: otp,
    emailVerificationExpires: expiry
  });

  if (user) {
    // Send verification email
    await emailService.sendEmail(
      user.email,
      'Verify Your Email',
      emailService.emailTemplates.verification(otp, user.name)
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.comparePassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremiumActive(),
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'User logged out successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15);

  // Update user
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = expiry;
  await user.save();

  // Send reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await emailService.sendEmail(
    user.email,
    'Password Reset Request',
    emailService.emailTemplates.passwordReset(resetUrl, user.name)
  );

  res.json({
    success: true,
    message: 'Password reset email sent successfully'
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({
      message: 'Invalid or expired reset token'
    });
  }

  // Update password
  user.password = password;
  user.passwordResetToken = '';
  user.passwordResetExpires = null;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({
    emailVerificationCode: otp,
    emailVerificationExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({
      message: 'Invalid or expired verification code'
    });
  }

  // Verify email
  user.isEmailVerified = true;
  user.emailVerificationCode = '';
  user.emailVerificationExpires = null;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});
