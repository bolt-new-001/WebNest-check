import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

    if (admin && (await admin.comparePassword(password))) {
      // If not verified, generate/send OTP
      if (!admin.isVerified) {
        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        admin.otp = otp;
        admin.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
        admin.otpAttempts = 0;
        await admin.save();
        // Send OTP email
        await sendEmail({
          to: admin.email,
          subject: 'Your OTP Code',
          text: `Your OTP code is: ${otp}`,
          html: `<p>Your OTP code is: <b>${otp}</b></p>`
        });
        return res.status(200).json({
          success: true,
          message: 'OTP sent to your email. Please verify to continue.',
          requireOTP: true
        });
      }
      // Verified: proceed to login
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
    permissions,
    isVerified: false
  });
  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  admin.otp = otp;
  admin.otpExpiry = Date.now() + 10 * 60 * 1000;
  admin.otpAttempts = 0;
  await admin.save();
  // Send OTP email
  await sendEmail({
    to: admin.email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <b>${otp}</b></p>`
  });
  res.status(201).json({
    success: true,
    message: 'Admin created. OTP sent to email. Please verify.',
    requireOTP: true
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (admin.isVerified) {
    return res.status(400).json({ message: 'User already verified' });
  }
  if (!admin.otp || !admin.otpExpiry) {
    return res.status(400).json({ message: 'No OTP generated. Please request again.' });
  }
  if (Date.now() > admin.otpExpiry) {
    admin.otp = null;
    admin.otpExpiry = null;
    await admin.save();
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }
  if (admin.otpAttempts >= 5) {
    admin.isActive = false;
    await admin.save();
    return res.status(403).json({ message: 'Account locked due to too many failed attempts.' });
  }
  if (otp !== admin.otp) {
    admin.otpAttempts += 1;
    await admin.save();
    return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }
  // Success: verify user
  admin.isVerified = true;
  admin.otp = null;
  admin.otpExpiry = null;
  admin.otpAttempts = 0;
  await admin.save();
  res.json({ success: true, message: 'OTP verified. You can now log in.' });
});