import express from 'express';
import {
  getAvailability,
  updateAvailability,
  addVacation,
  updateWorkload,
  getAvailableDevelopers
} from '../controllers/availabilityController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected
router.use(verifiedOnly); // All routes require verification

router.get('/', getAvailability);
router.put('/', updateAvailability);
router.post('/vacation', addVacation);
router.put('/workload', updateWorkload);

// Admin route to get available developers
router.get('/developers', getAvailableDevelopers);

export default router;