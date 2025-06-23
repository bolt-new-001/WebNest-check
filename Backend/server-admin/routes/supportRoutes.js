import express from 'express';
import {
  getAllSupportTickets,
  assignTicket,
  respondToTicket,
  resolveTicket,
  getSupportStats
} from '../controllers/supportController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/tickets', checkPermission('support', 'read'), getAllSupportTickets);
router.get('/tickets/stats', checkPermission('support', 'read'), getSupportStats);
router.put('/tickets/:id/assign', checkPermission('support', 'update'), assignTicket);
router.post('/tickets/:id/respond', checkPermission('support', 'update'), respondToTicket);
router.put('/tickets/:id/resolve', checkPermission('support', 'update'), resolveTicket);

export default router;