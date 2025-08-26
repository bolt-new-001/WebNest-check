import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { scheduleDeadlineReminders } from './utils/deadlineReminder.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import projectFeedbackRoutes from './routes/projectFeedbackRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import demoRoutes from './routes/demoRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import preferencesRoutes from './routes/preferencesRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import clientNotificationRoutes from './routes/clientNotificationRoutes.js';
import revisionRoutes from './routes/revisionRoutes.js';


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // For development, allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(generalLimiter); // Apply rate limiting
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('📦 Client Service: MongoDB Connected');
    // Start deadline reminder scheduler
    scheduleDeadlineReminders();
    console.log('⏰ Deadline reminder scheduler started');
  })
  .catch(err => console.error('❌ Client Service: MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications/client', clientNotificationRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api', projectFeedbackRoutes);
app.use('/api', milestoneRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'WebNest Client Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Client Service running on port ${PORT}`);
});