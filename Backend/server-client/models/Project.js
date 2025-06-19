import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    default: null
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    enum: ['website', 'ecommerce', 'webapp', 'portfolio', 'landing', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budget: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  selectedTheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
    default: null
  },
  features: [{
    name: String,
    description: String,
    price: Number,
    selected: { type: Boolean, default: false }
  }],
  aiFeatures: [{
    type: String,
    enum: ['chatbot', 'assistant', 'guide', 'custom'],
    description: String,
    price: Number
  }],
  timeline: {
    estimatedDays: Number,
    startDate: Date,
    expectedDelivery: Date,
    actualDelivery: Date
  },
  progress: {
    percentage: { type: Number, default: 0 },
    currentPhase: {
      type: String,
      enum: ['planning', 'design', 'development', 'testing', 'deployment'],
      default: 'planning'
    },
    milestones: [{
      title: String,
      description: String,
      completed: { type: Boolean, default: false },
      completedAt: Date
    }]
  },
  files: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  feedback: [{
    message: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);