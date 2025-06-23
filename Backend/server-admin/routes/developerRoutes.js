import express from 'express';
import {
  getAllDevelopers,
  getDeveloper,
  verifyDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getDeveloperStats,
  promoteDeveloper
} from '../controllers/developerController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', checkPermission('developers', 'read'), getAllDevelopers);
router.get('/stats', checkPermission('developers', 'read'), getDeveloperStats);
router.get('/:id', checkPermission('developers', 'read'), getDeveloper);
router.put('/:id/verify', checkPermission('developers', 'update'), verifyDeveloper);
router.put('/:id', checkPermission('developers', 'update'), updateDeveloper);
router.delete('/:id', checkPermission('developers', 'delete'), deleteDeveloper);
router.put('/:id/promote', checkPermission('developers', 'update'), promoteDeveloper);

export default router;