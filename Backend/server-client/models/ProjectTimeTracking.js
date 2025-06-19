import mongoose from 'mongoose';

const projectTimeTrackingSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType'
  },
  userType: {
    type: String,
    required: true,
    enum: ['Developer', 'Admin']
  },
  sessions: [{
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: Number, // in minutes
    description: String,
    taskType: {
      type: String,
      enum: ['design', 'development', 'testing', 'review', 'communication', 'research'],
      required: true
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectMilestone'
    },
    isActive: { type: Boolean, default: false },
    screenshots: [String], // URLs to screenshot files
    productivity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  totalHours: { type: Number, default: 0 },
  billableHours: { type: Number, default: 0 },
  hourlyRate: Number,
  totalEarnings: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Calculate totals before saving
projectTimeTrackingSchema.pre('save', function(next) {
  this.totalHours = this.sessions.reduce((total, session) => {
    return total + (session.duration || 0);
  }, 0) / 60; // Convert minutes to hours

  this.billableHours = this.sessions
    .filter(session => session.taskType !== 'communication')
    .reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0) / 60;

  if (this.hourlyRate) {
    this.totalEarnings = this.billableHours * this.hourlyRate;
  }

  next();
});

export default mongoose.model('ProjectTimeTracking', projectTimeTrackingSchema);