import express from 'express';
import {
  getProjectMilestones,
  updateMilestoneProgress,
  submitMilestoneFeedback
} from '../controllers/milestoneController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/projects/:projectId/milestones', getProjectMilestones);
router.put('/milestones/:id/progress', updateMilestoneProgress);
router.put('/milestones/:id/feedback', submitMilestoneFeedback);

export default router;