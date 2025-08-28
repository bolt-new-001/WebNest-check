import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  upgradeToPremium,
  getStats,
  getPublicProfile
} from '../controllers/profileController.js';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Session from '../models/Session.js';
import ActivityLog from '../models/ActivityLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/public/:id', getPublicProfile);

// Protected routes
router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', uploadAvatar);
router.delete('/', deleteAccount);
router.post('/upgrade-premium', upgradeToPremium);
router.get('/stats', getStats);

// Export user data (JSON download)
router.get('/export', asyncHandler(async (req, res) => {
  const [user, projects, sessions, logs] = await Promise.all([
    User.findById(req.user._id).lean(),
    Project.find({ clientId: req.user._id }).lean(),
    Session.find({ user: req.user._id, valid: true }).lean(),
    ActivityLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(1000).lean()
  ]);

  const exportBlob = {
    exportedAt: new Date().toISOString(),
    user,
    projects,
    sessions,
    activityLogs: logs
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="webnest_user_export.json"');
  res.status(200).send(JSON.stringify(exportBlob, null, 2));
}));

export default router;