import express from 'express';
import {
  getUserPreferences,
  updateUserPreferences,
  updateLocation
} from '../controllers/userPreferencesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getUserPreferences);
router.put('/', updateUserPreferences);
router.put('/location', updateLocation);

export default router;