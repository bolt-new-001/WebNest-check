import mongoose from 'mongoose';

const projectFeedbackSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  milestoneId: {
    type: String,
    required: false // If null, it's final project feedback
  },
  feedbackType: {
    type: String,
    enum: ['milestone', 'revision', 'final', 'general'],
    required: true
  },
  feedback: {
    type: String,
    required: true,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  attachments: [{
    filename: String,
    url: String,
    type: String // image, document, etc.
  }],
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'addressed'],
    default: 'pending'
  },
  developerResponse: {
    message: String,
    respondedAt: Date,
    estimatedFixTime: Date
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  actionRequired: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
projectFeedbackSchema.index({ projectId: 1, feedbackType: 1 });
projectFeedbackSchema.index({ developerId: 1, status: 1 });
projectFeedbackSchema.index({ createdAt: -1 });

export default mongoose.model('ProjectFeedback', projectFeedbackSchema);