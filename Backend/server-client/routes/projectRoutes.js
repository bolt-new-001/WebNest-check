import express from 'express';
import {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  cancelProject,
  addFeedback,
  getProjectProgress,
  uploadProjectFile
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/', createProject);
router.get('/', getMyProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', cancelProject);
router.post('/:id/feedback', addFeedback);
router.get('/:id/progress', getProjectProgress);
router.post('/:id/upload', uploadProjectFile);

export default router;