export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userRole = req.user ? req.user.role : 'guest';
  const userId = req.user ? req.user._id : 'anonymous';

  console.log(`📝 [${timestamp}] ${method} ${url} - User: ${userId} (${userRole})`);
  
  next();
};