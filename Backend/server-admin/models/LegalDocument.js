import mongoose from 'mongoose';

const legalDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['nda', 'contract', 'terms', 'privacy', 'sla'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  isActive: { type: Boolean, default: true },
  isTemplate: { type: Boolean, default: true },
  applicableFor: [{
    type: String,
    enum: ['all', 'premium', 'enterprise', 'specific']
  }],
  variables: [{
    name: String,
    description: String,
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean']
    },
    required: { type: Boolean, default: false }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: Date
}, {
  timestamps: true
});

const documentAcceptanceSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalDocument',
    required: true
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
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  acceptedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  digitalSignature: String,
  witnessEmail: String
}, {
  timestamps: true
});

export const LegalDocument = mongoose.model('LegalDocument', legalDocumentSchema);
export const DocumentAcceptance = mongoose.model('DocumentAcceptance', documentAcceptanceSchema);