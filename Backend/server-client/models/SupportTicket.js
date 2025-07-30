import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
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
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'project', 'account', 'feature_request', 'bug_report', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_response', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  messages: [{
    senderId: mongoose.Schema.Types.ObjectId,
    senderType: {
      type: String,
      enum: ['User', 'Developer', 'Admin']
    },
    message: String,
    isInternal: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  resolution: {
    message: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    resolvedAt: Date
  },
  satisfactionRating: {
    rating: { type: Number, min: 1, max: 5 },
    feedback: String,
    ratedAt: Date
  },
  tags: [String],
  estimatedResolutionTime: Date,
  actualResolutionTime: Date
}, {
  timestamps: true
});

// Generate ticket ID before saving
supportTicketSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketId = `WN-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Indexes for efficient queries
supportTicketSchema.index({ ticketId: 1 });
supportTicketSchema.index({ userId: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ priority: 1, status: 1 });
supportTicketSchema.index({ createdAt: -1 });

export default mongoose.model('SupportTicket', supportTicketSchema);