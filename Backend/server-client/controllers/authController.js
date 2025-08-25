import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import * as emailService from '../utils/emailService.js';
import { OTPService } from '../services/otpService.js';
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

    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    };
  
    if (process.env.NODE_ENV1 === 'test') {
      responseData.otp = otp;
    }
  
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: responseData
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
  
  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  // Check if user exists and password matches
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    // Generate new OTP if the old one is expired
    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 15);
      
      user.emailVerificationCode = otp;
      user.emailVerificationExpires = expiry;
      await user.save();

      // Send new verification email
      await emailService.sendEmail(
        user.email,
        'Verify Your Email',
        emailService.emailTemplates.verification(otp, user.name)
      );
    }

    return res.status(403).json({
      success: false,
      message: 'Please verify your email first',
      needsVerification: true,
      email: user.email
    });
  }

  // Generate token and return user data
  const token = generateToken(user._id);
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: true,
      isPremium: user.isPremiumActive?.() || false,
      token
    }
  });
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

  // Send reset email with token as query parameter
  const resetUrl = `${process.env.FRONTEND_URL}/auth/forgot-password?token=${resetToken}`;
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
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and OTP'
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with this email'
    });
  }

  try {
    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Validate OTP attempts (this will throw an error if too many attempts)
    await OTPService.validateOTPAttempts(user);

    // Check if OTP has expired
    if (!OTPService.isOTPValid(user)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one'
      });
    }

    // Check if OTP matches
    if (user.emailVerificationCode !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please try again'
      });
    }

    // Verify email and clear OTP
    user.isEmailVerified = true;
    OTPService.clearOTP(user);

    // Generate token for automatic login
    const token = generateToken(user._id);

    // Create a new session
    const session = {
      id: crypto.randomUUID(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: req.ip,
      lastUsed: new Date(),
      device: req.headers['sec-ch-ua-platform'] || 'Unknown',
      location: 'Unknown'
    };

    // Add session to user's active sessions
    user.activeSessions.push(session);
    await user.save();

    // Set secure cookie with token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return verified user data and token
    res.json({
      success: true,
      message: 'Email verified successfully! You can now access your account',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
        isPremium: user.isPremiumActive?.() || false,
        token,
        sessionId: session.id
      }
    });
  } catch (error) {
    // Log error for debugging
    console.error('Email verification error:', error);

    // Return user-friendly error message
    return res.status(400).json({
      success: false,
      message: error.message || 'Email verification failed. Please try again'
    });
  }
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
