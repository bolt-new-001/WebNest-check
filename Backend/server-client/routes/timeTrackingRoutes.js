import express from 'express';
import {
  startTimeTracking,
  stopTimeTracking,
  getProjectTimeTracking
} from '../controllers/timeTrackingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/start', startTimeTracking);
router.put('/stop/:sessionId', stopTimeTracking);
router.get('/project/:projectId', getProjectTimeTracking);

export default router;