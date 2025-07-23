import express from 'express';
import {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  customizePackage,
  purchasePackage
} from '../controllers/packageController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getPackages)
  .post(protect, admin, createPackage);

router
  .route('/:id')
  .get(getPackage)
  .put(protect, admin, updatePackage)
  .delete(protect, admin, deletePackage);

router.post('/:id/customize', protect, customizePackage);
router.post('/:id/purchase', protect, purchasePackage);

export default router;