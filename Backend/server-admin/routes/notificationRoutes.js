import express from 'express';
import {
  sendNotification,
  sendBulkNotification,
  getNotificationHistory,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/send', checkPermission('notifications', 'create'), sendNotification);
router.post('/bulk', checkPermission('notifications', 'create'), sendBulkNotification);
router.get('/history', checkPermission('notifications', 'read'), getNotificationHistory);
router.delete('/:id', checkPermission('notifications', 'delete'), deleteNotification);

export default router;