import mongoose from 'mongoose';

const revisionRequestSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectMilestone'
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
  revisionNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['design', 'functionality', 'content', 'performance', 'bug_fix', 'other'],
    required: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  estimatedHours: Number,
  actualHours: Number,
  dueDate: Date,
  completedAt: Date,
  developerResponse: {
    message: String,
    estimatedCompletion: Date,
    respondedAt: Date
  },
  clientFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comments: String,
    approved: Boolean,
    submittedAt: Date
  },
  isChargeable: {
    type: Boolean,
    default: false
  },
  additionalCost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-increment revision number per project
revisionRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastRevision = await this.constructor.findOne({ projectId: this.projectId })
      .sort({ revisionNumber: -1 });
    this.revisionNumber = lastRevision ? lastRevision.revisionNumber + 1 : 1;
  }
  next();
});

// Indexes
revisionRequestSchema.index({ projectId: 1, revisionNumber: -1 });
revisionRequestSchema.index({ clientId: 1, status: 1 });
revisionRequestSchema.index({ developerId: 1, status: 1 });
revisionRequestSchema.index({ status: 1, priority: 1 });

export default mongoose.model('RevisionRequest', revisionRequestSchema);