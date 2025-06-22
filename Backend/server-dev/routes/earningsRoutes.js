import express from 'express';
import {
  getEarnings,
  getEarningsStats,
  getPaymentHistory,
  requestPayout
} from '../controllers/earningsController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected
router.use(verifiedOnly); // All routes require verification

router.get('/', getEarnings);
router.get('/stats', getEarningsStats);
router.get('/payments', getPaymentHistory);
router.post('/payout', requestPayout);

export default router;