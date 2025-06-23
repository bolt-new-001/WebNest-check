import express from 'express';
import {
  getAllProjects,
  getProject,
  assignProject,
  updateProjectStatus,
  getProjectStats,
  reassignProject
} from '../controllers/projectController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', checkPermission('projects', 'read'), getAllProjects);
router.get('/stats', checkPermission('projects', 'read'), getProjectStats);
router.get('/:id', checkPermission('projects', 'read'), getProject);
router.put('/:id/assign', checkPermission('projects', 'update'), assignProject);
router.put('/:id/status', checkPermission('projects', 'update'), updateProjectStatus);
router.put('/:id/reassign', checkPermission('projects', 'update'), reassignProject);

export default router;