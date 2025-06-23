export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const adminRole = req.admin ? req.admin.role : 'guest';
  const adminId = req.admin ? req.admin._id : 'anonymous';

  console.log(`📝 [${timestamp}] ${method} ${url} - Admin: ${adminId} (${adminRole})`);
  
  next();
};