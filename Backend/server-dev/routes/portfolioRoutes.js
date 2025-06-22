import express from 'express';
import {
  getMyPortfolio,
  updatePortfolio,
  addPortfolioProject,
  getPublicDeveloperProfile,
  searchDeveloperProfiles
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public/:developerId', getPublicDeveloperProfile);
router.get('/search', searchDeveloperProfiles);

// Protected routes
router.use(protect);

router.get('/', getMyPortfolio);
router.put('/', updatePortfolio);
router.post('/projects', addPortfolioProject);

export default router;