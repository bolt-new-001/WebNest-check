import mongoose from 'mongoose';

const projectBackupSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  backupType: {
    type: String,
    enum: ['manual', 'automatic', 'milestone', 'version'],
    required: true
  },
  version: {
    type: String,
    required: true
  },
  description: String,
  backupData: {
    projectSnapshot: mongoose.Schema.Types.Mixed,
    files: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      checksum: String
    }],
    milestones: mongoose.Schema.Types.Mixed,
    communications: mongoose.Schema.Types.Mixed
  },
  backupSize: Number, // in bytes
  storageLocation: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'creatorType'
  },
  creatorType: {
    type: String,
    enum: ['User', 'Developer', 'Admin'],
    required: true
  },
  isRestored: { type: Boolean, default: false },
  restoredAt: Date,
  restoredBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'restorerType'
  },
  restorerType: {
    type: String,
    enum: ['User', 'Developer', 'Admin']
  },
  expiresAt: Date,
  tags: [String]
}, {
  timestamps: true
});

// TTL index for automatic cleanup
projectBackupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Indexes
projectBackupSchema.index({ projectId: 1, version: 1 });
projectBackupSchema.index({ backupType: 1, createdAt: -1 });

export default mongoose.model('ProjectBackup', projectBackupSchema);