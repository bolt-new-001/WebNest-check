import express from 'express';
import {
  getProjectChats,
  sendMessage,
  markAsRead,
  getChatHistory
} from '../controllers/chatController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected
router.use(verifiedOnly); // All routes require verification

router.get('/project/:projectId', getProjectChats);
router.post('/project/:projectId/message', sendMessage);
router.put('/message/:messageId/read', markAsRead);
router.get('/project/:projectId/history', getChatHistory);

export default router;