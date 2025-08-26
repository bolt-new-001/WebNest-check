import express from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail
} from "../controllers/authController.js";

import {
  getSessions,
  revokeSession,
  revokeOtherSessions,
  createOrUpdateSession,
  getCurrentSession
} from "../controllers/sessionController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply rate limiting to all auth routes
router.use(authLimiter);

// ------------------- Public routes -------------------
router.post("/register", register);
router.post("/login", login, createOrUpdateSession); // Add session tracking on login
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.post("/verify-email", verifyEmail);

// ------------------- Protected routes -------------------
router.use(protect);

// Session management
router
  .route("/sessions")
  .get(getSessions) // Get all active sessions
  .delete(revokeOtherSessions); // Revoke all other sessions

router.route("/sessions/current").get(getCurrentSession); // Get current session info

router.route("/sessions/:id").delete(revokeSession); // Revoke a specific session

// User profile
router.route("/me").get(getMe); // Get current user profile

router.route("/update-password").put(updatePassword); // Update password

router.route("/logout").post(logout); // Logout user

// ✅ Default export
export default router;
