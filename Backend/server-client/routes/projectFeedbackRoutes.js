import express from 'express';
import {
  createProjectFeedback,
  getProjectFeedback,
  respondToFeedback,
  markFeedbackAddressed
} from '../controllers/projectFeedbackController.js';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/projects/:projectId/feedback', 
  authorize('client', 'premiumClient'),
  logActivity('feedback_given', 'Provided project feedback'),
  createProjectFeedback
);

router.get('/projects/:projectId/feedback', getProjectFeedback);

router.put('/feedback/:id/respond', 
  authorize('developer', 'leadDeveloper'),
  respondToFeedback
);

router.put('/feedback/:id/address', 
  authorize('developer', 'leadDeveloper'),
  markFeedbackAddressed
);

export default router;