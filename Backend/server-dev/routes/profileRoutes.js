import express from 'express';
import {
  getProfile,
  updateProfile,
  updateSkills,
  addPortfolioItem,
  updateAvailability,
  getStats
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/skills', updateSkills);
router.post('/portfolio', addPortfolioItem);
router.put('/availability', updateAvailability);
router.get('/stats', getStats);

export default router;