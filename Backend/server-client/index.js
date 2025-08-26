import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';

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

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'development' || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionConfig = {
  name: 'webnest.sid',
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use environment variable in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 30 * 24 * 60 * 60, // 30 days in seconds
    autoRemove: 'interval',
    autoRemoveInterval: 60 * 24, // Clean up expired sessions every 24 hours
  })
};

// Trust first proxy if behind a reverse proxy (e.g., Heroku, Nginx)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));
app.use(generalLimiter); // Apply rate limiting after session middleware
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webnest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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