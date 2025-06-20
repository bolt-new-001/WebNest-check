import express from 'express';
import {
  getProjectChatMessages,
  sendChatMessage,
  markMessageAsRead,
  getUnreadMessageCount
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/project/:projectId', getProjectChatMessages);
router.post('/project/:projectId/message', sendChatMessage);
router.put('/message/:messageId/read', markMessageAsRead);
router.get('/unread-count', getUnreadMessageCount);

export default router;