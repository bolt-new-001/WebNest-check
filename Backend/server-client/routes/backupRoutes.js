import express from 'express';
import {
  createProjectBackup,
  getProjectBackups,
  restoreProjectBackup
} from '../controllers/backupController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/create/:projectId', createProjectBackup);
router.get('/project/:projectId', getProjectBackups);
router.put('/restore/:backupId', restoreProjectBackup);

export default router;