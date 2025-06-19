import mongoose from 'mongoose';

const projectActivitySchema = new mongoose.Schema({
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
    enum: ['User', 'Developer', 'Admin']
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'project_created', 'project_assigned', 'milestone_completed', 
      'file_uploaded', 'feedback_given', 'revision_requested',
      'deadline_updated', 'payment_made', 'project_approved',
      'message_sent', 'status_changed', 'developer_assigned'
    ]
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    milestoneId: mongoose.Schema.Types.ObjectId,
    fileId: mongoose.Schema.Types.ObjectId,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    additionalData: mongoose.Schema.Types.Mixed
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
projectActivitySchema.index({ projectId: 1, createdAt: -1 });
projectActivitySchema.index({ userId: 1, createdAt: -1 });
projectActivitySchema.index({ actionType: 1 });

export default mongoose.model('ProjectActivity', projectActivitySchema);