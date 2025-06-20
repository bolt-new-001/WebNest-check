import express from 'express';
import {
  createRevisionRequest,
  getProjectRevisions,
  getRevision,
  updateRevisionRequest,
  cancelRevisionRequest,
  submitRevisionFeedback,
  getRevisionStats
} from '../controllers/revisionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/request', createRevisionRequest);
router.get('/project/:projectId', getProjectRevisions);
router.get('/:id', getRevision);
router.put('/:id', updateRevisionRequest);
router.delete('/:id', cancelRevisionRequest);
router.put('/:id/feedback', submitRevisionFeedback);
router.get('/stats/:projectId', getRevisionStats);

export default router;