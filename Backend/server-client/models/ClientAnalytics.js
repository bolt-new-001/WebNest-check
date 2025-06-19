import mongoose from 'mongoose';

const clientAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    projectsViewed: { type: Number, default: 0 },
    filesUploaded: { type: Number, default: 0 },
    messagesExchanged: { type: Number, default: 0 },
    revisionsRequested: { type: Number, default: 0 },
    timeSpentOnPlatform: { type: Number, default: 0 }, // in minutes
    pagesVisited: [String],
    featuresUsed: [String],
    supportTicketsCreated: { type: Number, default: 0 }
  },
  engagement: {
    loginCount: { type: Number, default: 0 },
    sessionDuration: { type: Number, default: 0 }, // in minutes
    bounceRate: Number,
    clickThroughRate: Number,
    conversionEvents: [{
      event: String,
      timestamp: Date,
      value: Number
    }]
  },
  satisfaction: {
    npsScore: Number,
    feedbackSubmitted: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 }
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    screenResolution: String
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
clientAnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });
clientAnalyticsSchema.index({ date: 1 });

export default mongoose.model('ClientAnalytics', clientAnalyticsSchema);