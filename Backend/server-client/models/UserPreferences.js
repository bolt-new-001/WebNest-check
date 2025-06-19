import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  location: {
    country: String,
    state: String,
    city: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja']
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'auto'
  },
  communicationPreferences: {
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'chat', 'video'],
      default: 'email'
    },
    availableHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  // NEW: Design Preferences
  designPreferences: {
    preferredLayout: {
      type: String,
      enum: ['minimal', 'modern', 'classic', 'creative', 'corporate'],
      default: 'modern'
    },
    colorMode: {
      type: String,
      enum: ['bright', 'neutral', 'dark', 'colorful', 'monochrome'],
      default: 'neutral'
    },
    savedTemplates: [{
      templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectTemplate'
      },
      savedAt: { type: Date, default: Date.now },
      notes: String
    }],
    favoriteColors: [String],
    preferredFonts: [{
      name: String,
      category: { type: String, enum: ['serif', 'sans-serif', 'display', 'handwriting'] }
    }],
    inspirationImages: [{
      url: String,
      description: String,
      tags: [String],
      savedAt: { type: Date, default: Date.now }
    }]
  },
  // Project Preferences
  projectPreferences: {
    defaultBudgetRange: {
      min: { type: Number, default: 5000 },
      max: { type: Number, default: 50000 }
    },
    preferredTimeline: {
      type: String,
      enum: ['rush', 'normal', 'flexible'],
      default: 'normal'
    },
    autoApprovalSettings: {
      milestones: { type: Boolean, default: false },
      revisions: { type: Boolean, default: false },
      budgetIncreases: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('UserPreferences', userPreferencesSchema);