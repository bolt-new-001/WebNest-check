import mongoose from 'mongoose';

const projectCollaborationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'collaborators.userType'
    },
    userType: {
      type: String,
      required: true,
      enum: ['User', 'Developer', 'Admin']
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer', 'reviewer'],
      required: true
    },
    permissions: [{
      type: String,
      enum: ['view_files', 'upload_files', 'edit_project', 'approve_milestones', 'manage_team']
    }],
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'collaborators.userType'
    },
    invitedAt: { type: Date, default: Date.now },
    acceptedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'removed'],
      default: 'pending'
    }
  }],
  teamSettings: {
    allowClientInvites: { type: Boolean, default: true },
    requireApprovalForNewMembers: { type: Boolean, default: false },
    maxCollaborators: { type: Number, default: 10 }
  }
}, {
  timestamps: true
});

export default mongoose.model('ProjectCollaboration', projectCollaborationSchema);