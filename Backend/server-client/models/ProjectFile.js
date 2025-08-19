import mongoose from 'mongoose';

const projectFileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'uploaderType'
  },
  uploaderType: {
    type: String,
    required: true,
    enum: ['User', 'Developer', 'Admin']
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image', 'document', 'archive', 'other']
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['logo', 'brand_assets', 'requirements', 'reference', 'deliverable', 'other'],
    default: 'other'
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  version: {
    type: Number,
    default: 1
  },
  parentFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectFile'
  }
}, {
  timestamps: true
});

// Indexes
projectFileSchema.index({ projectId: 1, createdAt: -1 });
projectFileSchema.index({ uploadedBy: 1 });
projectFileSchema.index({ fileType: 1, category: 1 });

export default mongoose.model('ProjectFile', projectFileSchema);