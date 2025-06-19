import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType'
  },
  senderType: {
    type: String,
    required: true,
    enum: ['User', 'Developer', 'Admin']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType'
  },
  receiverType: {
    type: String,
    required: true,
    enum: ['User', 'Developer', 'Admin']
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'voice', 'video', 'system'],
    default: 'text'
  },
  content: {
    text: String,
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
    thumbnail: String
  },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage'
  },
  reactions: [{
    userId: mongoose.Schema.Types.ObjectId,
    reaction: String, // emoji
    createdAt: { type: Date, default: Date.now }
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
chatMessageSchema.index({ projectId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1, receiverId: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);