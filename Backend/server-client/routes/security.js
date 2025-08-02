import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import crypto from 'crypto';
import * as emailService from '../utils/emailService.js';

const router = express.Router();

// @desc    Change password
// @route   PUT /api/security/change-password
// @access  Private
router.put('/change-password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid current password' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
}));

// @desc    Enable/disable 2FA
// @route   PUT /api/security/two-factor
// @access  Private
router.put('/two-factor', protect, asyncHandler(async (req, res) => {
  const { enable } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.preferences.twoFactorEnabled = enable;
  await user.save();

  if (enable) {
    // Generate and send recovery codes
    const recoveryCodes = Array.from({ length: 5 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
    
    await emailService.sendEmail(
      user.email,
      '2FA Recovery Codes',
      emailService.emailTemplates.twoFactorRecovery(recoveryCodes)
    );
  }

  res.json({ 
    message: '2FA settings updated successfully',
    twoFactorEnabled: user.preferences.twoFactorEnabled
  });
}));

// @desc    Get active sessions
// @route   GET /api/security/sessions
// @access  Private
router.get('/sessions', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get active sessions (in a real app, this would be stored in Redis or similar)
  const sessions = user.activeSessions || [];

  res.json({ sessions });
}));

// @desc    Revoke session
// @route   DELETE /api/security/sessions/:sessionId
// @access  Private
router.delete('/sessions/:sessionId', protect, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // In a real app, this would invalidate the session in Redis
  user.activeSessions = user.activeSessions?.filter(
    session => session.id !== sessionId
  );

  await user.save();
  res.json({ message: 'Session revoked successfully' });
}));

export default router;
