import express from 'express';
import {
  getThemes,
  getTheme,
  getThemesByCategory,
  searchThemes,
  rateTheme
} from '../controllers/themeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getThemes);
router.get('/search', searchThemes);
router.get('/category/:category', getThemesByCategory);
router.get('/:id', getTheme);
router.post('/:id/rate', protect, rateTheme);

export default router;