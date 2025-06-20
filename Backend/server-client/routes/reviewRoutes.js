import express from 'express';
import {
  createReview,
  getDeveloperReviews,
  respondToReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

router.post('/', 
  protect, 
  authorize('client', 'premiumClient'),
  logActivity('review_submitted', 'Submitted a review'),
  createReview
);

router.get('/developer/:developerId', getDeveloperReviews);

router.put('/:id/respond', 
  protect, 
  authorize('developer', 'leadDeveloper'),
  respondToReview
);

export default router;