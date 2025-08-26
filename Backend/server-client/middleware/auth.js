import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import asyncHandler from 'express-async-handler';
import { getClientIp } from '@supercharge/request-ip';

// Array of public routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password'
];

// Middleware to check if route is public
const isPublicRoute = (path) => {
  return publicRoutes.some(route => path.startsWith(route));
};

// Session validation middleware
export const validateSession = asyncHandler(async (req, res, next) => {
  const sessionId = req.sessionID;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(); // No token, will be handled by protect middleware
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // For non-public routes, check session validity
    if (!isPublicRoute(req.path)) {
      const session = await Session.findOne({ _id: sessionId, user: user._id, valid: true });
      
      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired session. Please log in again.'
        });
      }

      // Update last activity
      session.lastActivity = new Date();
      await session.save();
      
      // Add session info to request
      req.session = session;
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
});

// Main authentication middleware
export const protect = [
  // First validate the session
  validateSession,
  
  // Then check if user is authenticated
  asyncHandler(async (req, res, next) => {
    // Skip authentication for public routes
    if (isPublicRoute(req.path)) {
      return next();
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no valid session or token'
      });
    }

    next();
  })
];

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

export const premiumOnly = (req, res, next) => {
  if (!req.user.isPremiumActive()) {
    return res.status(403).json({ 
      message: 'Premium subscription required to access this feature' 
    });
  }
  next();
};