import express from 'express';
import {
  createSupportTicket,
  getUserTickets,
  getSupportTicket,
  addTicketMessage,
  rateTicketResolution
} from '../controllers/supportController.js';
import { protect } from '../middleware/auth.js';
import { supportLimiter } from '../middleware/rateLimiter.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/tickets', 
  supportLimiter,
  logActivity('ticket_created', 'Created support ticket'),
  createSupportTicket
);

router.get('/tickets', getUserTickets);
router.get('/tickets/:id', getSupportTicket);

router.post('/tickets/:id/messages', 
  logActivity('ticket_updated', 'Added message to support ticket'),
  addTicketMessage
);

router.put('/tickets/:id/rate', rateTicketResolution);

export default router;