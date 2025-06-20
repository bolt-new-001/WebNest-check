import express from 'express';
import {
  getOnboardingProgress,
  updateOnboardingStep,
  skipOnboarding,
  resetOnboarding
} from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/progress', getOnboardingProgress);
router.put('/step/:stepId', updateOnboardingStep);
router.post('/skip', skipOnboarding);
router.post('/reset', resetOnboarding);

export default router;