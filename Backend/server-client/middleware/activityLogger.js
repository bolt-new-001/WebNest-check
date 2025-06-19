import ActivityLog from '../models/ActivityLog.js';
import geoip from 'geoip-lite';

export const logActivity = (action, description, entityType = null, entityId = null, severity = 'low') => {
  return async (req, res, next) => {
    try {
      const user = req.user || req.developer || req.admin;
      if (!user) return next();

      const ip = req.ip || req.connection.remoteAddress;
      const geo = geoip.lookup(ip);
      
      const userType = req.user ? 'User' : req.developer ? 'Developer' : 'Admin';

      await ActivityLog.create({
        userId: user._id,
        userType,
        action,
        description: typeof description === 'function' ? description(req) : description,
        entityType,
        entityId: typeof entityId === 'function' ? entityId(req) : entityId,
        metadata: {
          method: req.method,
          url: req.originalUrl,
          body: req.method === 'POST' ? req.body : undefined,
          params: req.params,
          query: req.query
        },
        ipAddress: ip,
        userAgent: req.get('User-Agent'),
        location: geo ? {
          country: geo.country,
          city: geo.city,
          timezone: geo.timezone
        } : undefined,
        severity
      });
    } catch (error) {
      console.error('Activity logging error:', error);
    }
    next();
  };
};

// Helper function to log activities programmatically
export const createActivityLog = async (userId, userType, action, description, options = {}) => {
  try {
    await ActivityLog.create({
      userId,
      userType,
      action,
      description,
      ...options
    });
  } catch (error) {
    console.error('Activity log creation error:', error);
  }
};