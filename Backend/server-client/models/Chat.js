import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userType: {
      type: String,
      enum: ['client', 'developer', 'admin'],
      required: true
    },
    name: String,
    avatar: String
  }],
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    senderType: {
      type: String,
      enum: ['client', 'developer', 'admin'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image', 'system'],
      default: 'text'
    },
    fileUrl: String,
    fileName: String,
    isRead: [{
      userId: mongoose.Schema.Types.ObjectId,
      readAt: { type: Date, default: Date.now }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessage: {
    message: String,
    senderId: mongoose.Schema.Types.ObjectId,
    createdAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Chat', chatSchema);