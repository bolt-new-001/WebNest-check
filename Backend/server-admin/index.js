import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import developerRoutes from './routes/developerRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import legalRoutes from './routes/legalRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_SERVICE_URL, process.env.DEV_SERVICE_URL],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('📦 Admin Service: MongoDB Connected'))
  .catch(err => console.error('❌ Admin Service: MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/legal', legalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'WebNest Admin Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Admin Service running on port ${PORT}`);
});