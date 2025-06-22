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
import profileRoutes from './routes/profileRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import earningsRoutes from './routes/earningsRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_SERVICE_URL, process.env.ADMIN_SERVICE_URL],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('📦 Developer Service: MongoDB Connected'))
  .catch(err => console.error('❌ Developer Service: MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'WebNest Developer Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Developer Service running on port ${PORT}`);
});