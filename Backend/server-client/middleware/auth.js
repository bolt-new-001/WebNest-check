import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import asyncHandler from 'express-async-handler';
import { getClientIp } from '@supercharge/request-ip';

// Helper functions for device detection
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows') || userAgent.includes('Mac') || userAgent.includes('Linux')) return 'Desktop';
  return 'Unknown';
};

const getOS = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

const getBrowser = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

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

// Main authentication middleware
export const protect = asyncHandler(async (req, res, next) => {
  // Skip authentication for public routes
  if (isPublicRoute(req.path)) {
    return next();
  }

  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authentication token received'
    });
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

    // Add user to request
    req.user = user;

    // Try to create or update session for tracking
    try {
      const sessionId = req.sessionID;
      if (sessionId) {
        let session = await Session.findOne({ _id: sessionId, user: user._id, valid: true });
        
        if (!session) {
          // Create a new session
          session = await Session.create({
            _id: sessionId,
            user: user._id,
            userAgent: req.headers['user-agent'] || 'Unknown',
            ipAddress: getClientIp(req) || 'Unknown',
            valid: true,
            lastActivity: new Date()
          });
        } else {
          // Update existing session
          session.lastActivity = new Date();
          await session.save();
        }

        // Update user's active sessions
        const sessionInfo = {
          id: sessionId,
          userAgent: req.headers['user-agent'] || 'Unknown',
          ip: getClientIp(req) || 'Unknown',
          lastUsed: new Date(),
          device: {
            type: getDeviceType(req.headers['user-agent']),
            os: getOS(req.headers['user-agent']),
            browser: getBrowser(req.headers['user-agent'])
          },
          location: {
            city: session.city || 'Unknown',
            region: session.region || 'Unknown',
            country: session.country || 'Unknown'
          }
        };
        
        // Add to user's active sessions if not already present
        const existingSessionIndex = user.activeSessions.findIndex(s => s.id === sessionId);
        if (existingSessionIndex >= 0) {
          user.activeSessions[existingSessionIndex] = sessionInfo;
        } else {
          user.activeSessions.push(sessionInfo);
        }
        
        await user.save();
      }
    } catch (sessionError) {
      console.error('Session tracking error:', sessionError);
      // Don't fail the request if session tracking fails
    }

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