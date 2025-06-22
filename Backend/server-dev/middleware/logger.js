export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const developerRole = req.developer ? req.developer.role : 'guest';
  const developerId = req.developer ? req.developer._id : 'anonymous';

  console.log(`📝 [${timestamp}] ${method} ${url} - Developer: ${developerId} (${developerRole})`);
  
  next();
};