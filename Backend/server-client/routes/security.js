import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import crypto from 'crypto';
import * as emailService from '../utils/emailService.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper functions for device detection
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows') || userAgent.includes('Mac') || userAgent.includes('Linux')) return 'Desktop';
  return 'Unknown';
};

const getOS = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

const getBrowser = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

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

  // Get active sessions from both User model and Session collection
  const userSessions = user.activeSessions || [];
  const dbSessions = await Session.find({ user: user._id, valid: true });
  
  // Combine and format sessions
  const sessions = dbSessions.map(session => ({
    id: session._id,
    userAgent: session.userAgent || 'Unknown',
    ipAddress: session.ipAddress || 'Unknown',
    lastActiveAt: session.lastActivity,
    isCurrent: session._id === req.sessionID,
    location: {
      city: session.city,
      region: session.region,
      country: session.country
    },
    device: {
      type: getDeviceType(session.userAgent),
      os: getOS(session.userAgent),
      browser: getBrowser(session.userAgent)
    }
  }));

  res.json({ 
    success: true,
    data: sessions 
  });
}));

// @desc    Get login history
// @route   GET /api/security/login-history
// @access  Private
router.get('/login-history', protect, asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find({ userId: req.user._id, action: { $in: ['login', 'logout'] } })
    .sort({ createdAt: -1 })
    .limit(200);

  const history = logs.map(l => ({
    id: String(l._id),
    action: l.action,
    description: l.description,
    createdAt: l.createdAt,
    ipAddress: l.ipAddress,
    userAgent: l.userAgent,
    location: l.location || {}
  }));

  res.json({ success: true, data: history });
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

  // Don't allow revoking current session
  if (sessionId === req.sessionID) {
    return res.status(400).json({ 
      success: false,
      message: 'Cannot revoke current session' 
    });
  }

  // Invalidate session in database
  const session = await Session.findByIdAndUpdate(
    sessionId,
    { valid: false },
    { new: true }
  );

  if (!session) {
    return res.status(404).json({ 
      success: false,
      message: 'Session not found' 
    });
  }

  // Remove from user's active sessions
  user.activeSessions = user.activeSessions?.filter(
    session => session.id !== sessionId
  );

  await user.save();
  
  res.json({ 
    success: true,
    message: 'Session revoked successfully' 
  });
}));

// @desc    Revoke all other sessions
// @route   DELETE /api/security/sessions/revoke-others
// @access  Private
router.delete('/sessions/revoke-others', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Invalidate all other sessions except current one
  await Session.updateMany(
    { 
      user: user._id, 
      valid: true,
      _id: { $ne: req.sessionID }
    },
    { valid: false }
  );

  // Clear user's active sessions except current one
  user.activeSessions = user.activeSessions?.filter(
    session => session.id === req.sessionID
  ) || [];

  await user.save();
  
  res.json({ 
    success: true,
    message: 'All other sessions have been revoked' 
  });
}));

export default router;
