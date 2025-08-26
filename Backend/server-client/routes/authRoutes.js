import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail
} from '../controllers/authController.js';
import { 
  getSessions, 
  revokeSession, 
  revokeOtherSessions,
  createOrUpdateSession
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login, createOrUpdateSession); // Add session tracking on login
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.post('/verify-email', verifyEmail);

// Protected routes
router.use(protect);

// Session management
router.get('/sessions', getSessions);
router.delete('/sessions/others', revokeOtherSessions);
router.delete('/sessions/:id', revokeSession);

// User management
router.get('/me', getMe);
router.put('/update-password', updatePassword);
router.post('/logout', logout);

export default router;