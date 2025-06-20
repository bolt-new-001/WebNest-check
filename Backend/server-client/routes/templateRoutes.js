import express from 'express';
import {
  getAllTemplates,
  getTemplate,
  rateTemplate
} from '../controllers/templateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/:id', getTemplate);
router.post('/:id/rate', protect, rateTemplate);

export default router;