import mongoose from 'mongoose';

const clientNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: [
      'project_update', 'milestone_complete', 'deadline_reminder',
      'payment_due', 'revision_ready', 'message_received',
      'project_assigned', 'project_completed', 'system_update'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String,
  actionText: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  metadata: {
    milestoneId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    deadline: Date,
    additionalData: mongoose.Schema.Types.Mixed
  },
  deliveryChannels: {
    dashboard: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  emailSent: { type: Boolean, default: false },
  emailSentAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// TTL index for expired notifications
clientNotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Indexes for efficient queries
clientNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
clientNotificationSchema.index({ type: 1, priority: 1 });
clientNotificationSchema.index({ projectId: 1 });

export default mongoose.model('ClientNotification', clientNotificationSchema);