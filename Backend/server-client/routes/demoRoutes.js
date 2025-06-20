import express from 'express';
import {
  getDemoDashboardData,
  getDemoDeveloperDashboard,
  getClientInsightCards,
  getActivitySummary
} from '../controllers/demoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', getDemoDashboardData);
router.get('/developer-dashboard', getDemoDeveloperDashboard);
router.get('/client-insights', getClientInsightCards);
router.get('/activity-summary', getActivitySummary);

export default router;