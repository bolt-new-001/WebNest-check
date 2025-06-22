import jwt from 'jsonwebtoken';
import Developer from '../models/Developer.js';
import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.developer = await Developer.findById(decoded.id).select('-password');
      
      if (!req.developer) {
        return res.status(401).json({ message: 'Developer not found' });
      }

      // Update last active
      req.developer.updateLastActive();

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.developer.role)) {
      return res.status(403).json({ 
        message: `Developer role ${req.developer.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

export const verifiedOnly = (req, res, next) => {
  if (!req.developer.isVerified) {
    return res.status(403).json({ 
      message: 'Account verification required to access this feature' 
    });
  }
  next();
};