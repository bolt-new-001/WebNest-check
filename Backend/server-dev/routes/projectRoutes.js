import express from 'express';
import {
  getAssignedProjects,
  getProject,
  acceptProject,
  rejectProject,
  updateProjectProgress,
  addWorkLog,
  uploadProofOfWork,
  markMilestoneComplete,
  submitProject
} from '../controllers/projectController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected
router.use(verifiedOnly); // All routes require verification

router.get('/', getAssignedProjects);
router.get('/:id', getProject);
router.put('/:id/accept', acceptProject);
router.put('/:id/reject', rejectProject);
router.put('/:id/progress', updateProjectProgress);
router.post('/:id/worklog', addWorkLog);
router.post('/:id/proof', uploadProofOfWork);
router.put('/:id/milestone/:milestoneId/complete', markMilestoneComplete);
router.put('/:id/submit', submitProject);

export default router;