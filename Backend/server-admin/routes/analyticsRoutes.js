import express from 'express';
import {
  getDashboardStats,
  getRevenueStats,
  getUserGrowth,
  getProjectAnalytics,
  getPerformanceMetrics
} from '../controllers/analyticsController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected
router.use(checkPermission('analytics', 'read')); // All routes require analytics read permission

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueStats);
router.get('/user-growth', getUserGrowth);
router.get('/projects', getProjectAnalytics);
router.get('/performance', getPerformanceMetrics);

export default router;