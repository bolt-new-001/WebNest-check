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

export default router;