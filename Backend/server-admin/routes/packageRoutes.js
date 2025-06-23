import express from 'express';
import {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageAnalytics
} from '../controllers/packageController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackage);

// Protected routes
router.use(protect);

router.post('/', checkPermission('packages', 'create'), createPackage);
router.put('/:id', checkPermission('packages', 'update'), updatePackage);
router.delete('/:id', checkPermission('packages', 'delete'), deletePackage);
router.get('/analytics/overview', checkPermission('packages', 'read'), getPackageAnalytics);

export default router;