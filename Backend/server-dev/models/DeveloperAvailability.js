import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true,
    unique: true
  },
  weeklySchedule: {
    monday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    },
    tuesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    },
    wednesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    },
    thursday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    },
    friday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '10:00' },
      endTime: { type: String, default: '14:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '10:00' },
      endTime: { type: String, default: '14:00' },
      breaks: [{
        startTime: String,
        endTime: String,
        reason: String
      }]
    }
  },
  timezone: {
    type: String,
    required: true,
    default: 'Asia/Kolkata'
  },
  maxProjectsPerWeek: {
    type: Number,
    default: 3
  },
  currentWorkload: {
    type: Number,
    default: 0
  },
  vacations: [{
    startDate: Date,
    endDate: Date,
    reason: String,
    approved: { type: Boolean, default: false }
  }],
  emergencyContacts: [{
    name: String,
    phone: String,
    email: String,
    relationship: String
  }],
  preferredProjectTypes: [{
    type: String,
    enum: ['website', 'ecommerce', 'webapp', 'mobile', 'api', 'maintenance']
  }],
  minimumProjectBudget: {
    type: Number,
    default: 5000
  },
  isAcceptingNewProjects: {
    type: Boolean,
    default: true
  },
  autoRejectBelow: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('DeveloperAvailability', availabilitySchema);