import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
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
  action: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'register', 'profile_update', 'password_change',
      'project_create', 'project_update', 'project_submit', 'project_complete',
      'payment_made', 'review_submitted', 'ticket_created', 'ticket_updated',
      'message_sent', 'file_upload', 'settings_change', 'role_change',
      'developer_assign', 'milestone_complete', 'feedback_given'
    ]
  },
  description: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: ['Project', 'User', 'Developer', 'Admin', 'SupportTicket', 'Review', 'Payment']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    timezone: String
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  }
}, {
  timestamps: true
});

export default mongoose.model('ActivityLog', activityLogSchema);