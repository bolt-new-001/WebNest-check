import express from 'express';
import {
  getAllThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  getThemeStats
} from '../controllers/themeController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', checkPermission('themes', 'read'), getAllThemes);
router.get('/stats', checkPermission('themes', 'read'), getThemeStats);
router.post('/', checkPermission('themes', 'create'), createTheme);
router.put('/:id', checkPermission('themes', 'update'), updateTheme);
router.delete('/:id', checkPermission('themes', 'delete'), deleteTheme);

export default router;