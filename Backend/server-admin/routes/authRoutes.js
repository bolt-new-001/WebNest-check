import express from 'express';
import {
  login,
  logout,
  getMe,
  updatePassword,
  createAdmin
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/create-admin', protect, authorize('owner'), createAdmin);

export default router;