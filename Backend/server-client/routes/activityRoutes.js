import express from 'express';
import {
  getProjectActivityFeed,
  getUserActivityFeed,
  createActivityLog,
  getActivityStats
} from '../controllers/activityFeedController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/project/:projectId', getProjectActivityFeed);
router.get('/user', getUserActivityFeed);
router.post('/log', createActivityLog);
router.get('/stats/:projectId', getActivityStats);

export default router;