import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true
  },
  senderModel: {
    type: String,
    enum: ['Developer', 'Client', 'Admin'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  readBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.userModel'
    },
    userModel: {
      type: String,
      enum: ['Developer', 'Client', 'Admin']
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [messageSchema],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Chat', chatSchema);