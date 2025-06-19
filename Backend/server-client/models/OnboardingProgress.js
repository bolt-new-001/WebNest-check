import mongoose from 'mongoose';

const onboardingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType'
  },
  userType: {
    type: String,
    required: true,
    enum: ['User', 'Developer']
  },
  steps: [{
    stepId: {
      type: String,
      required: true
    },
    stepName: String,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    data: mongoose.Schema.Types.Mixed, // Store step-specific data
    skipped: { type: Boolean, default: false }
  }],
  currentStep: {
    type: String,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  metadata: {
    source: String, // where they came from
    referrer: String,
    utmParams: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Calculate completion percentage before saving
onboardingProgressSchema.pre('save', function(next) {
  const completedSteps = this.steps.filter(step => step.completed).length;
  this.completionPercentage = Math.round((completedSteps / this.totalSteps) * 100);
  this.isCompleted = this.completionPercentage === 100;
  
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

export default mongoose.model('OnboardingProgress', onboardingProgressSchema);