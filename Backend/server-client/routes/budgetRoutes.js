import express from 'express';
import {
  calculateBudget,
  getBudgetTemplates,
  saveBudgetCalculation
} from '../controllers/budgetCalculatorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/calculate', calculateBudget);
router.get('/templates', getBudgetTemplates);
router.post('/save', protect, saveBudgetCalculation);

export default router;