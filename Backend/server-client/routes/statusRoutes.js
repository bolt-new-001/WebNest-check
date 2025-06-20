import express from 'express';
import {
  updateOnlineStatus,
  getProjectOnlineUsers,
  getUserStatus
} from '../controllers/statusController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.put('/online', updateOnlineStatus);
router.get('/project/:projectId', getProjectOnlineUsers);
router.get('/:userId', getUserStatus);

export default router;