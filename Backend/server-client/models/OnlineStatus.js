import mongoose from 'mongoose';

const onlineStatusSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['online', 'working', 'away', 'offline'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  currentProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  socketId: String,
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  }
}, {
  timestamps: true
});

// TTL index to auto-remove offline users after 24 hours
onlineStatusSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('OnlineStatus', onlineStatusSchema);