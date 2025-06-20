import express from 'express';
import {
  generateQuote,
  getUserQuotes,
  getQuote,
  acceptQuote,
  rejectQuote
} from '../controllers/quoteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/generate', generateQuote);
router.get('/', getUserQuotes);
router.get('/:id', getQuote);
router.put('/:id/accept', acceptQuote);
router.put('/:id/reject', rejectQuote);

export default router;