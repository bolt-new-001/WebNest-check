import express from 'express';
import {
  getClientNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteClientNotification,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/clientNotificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getClientNotifications);
router.put('/:id/read', markNotificationAsRead);
router.put('/read-all', markAllNotificationsAsRead);
router.delete('/:id', deleteClientNotification);
router.get('/preferences', getNotificationPreferences);
router.put('/preferences', updateNotificationPreferences);

export default router;