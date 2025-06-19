import mongoose from 'mongoose';

const projectDeadlineSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectMilestone'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  deadlineDate: {
    type: Date,
    required: true
  },
  reminderDates: [{
    reminderDate: Date,
    reminderType: {
      type: String,
      enum: ['7_days', '3_days', '1_day', '2_hours'],
      required: true
    },
    sent: { type: Boolean, default: false },
    sentAt: Date
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'assigneeType'
  },
  assigneeType: {
    type: String,
    enum: ['User', 'Developer'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'creatorType'
  },
  creatorType: {
    type: String,
    enum: ['User', 'Developer', 'Admin'],
    required: true
  }
}, {
  timestamps: true
});

// Indexes
projectDeadlineSchema.index({ deadlineDate: 1, isCompleted: 1 });
projectDeadlineSchema.index({ projectId: 1, deadlineDate: 1 });
projectDeadlineSchema.index({ assignedTo: 1, isCompleted: 1 });

export default mongoose.model('ProjectDeadline', projectDeadlineSchema);