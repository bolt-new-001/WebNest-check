import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  upgradeToPremium,
  getStats
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', uploadAvatar);
router.delete('/', deleteAccount);
router.post('/upgrade-premium', upgradeToPremium);
router.get('/stats', getStats);

export default router;