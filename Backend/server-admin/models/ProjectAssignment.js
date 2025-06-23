import mongoose from 'mongoose';

const projectAssignmentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer',
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    estimatedHours: {
      type: Number,
      required: true
    },
    hourlyRate: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    reassignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    reassignmentReason: {
      type: String
    },
    reassignedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'reassigned'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export default mongoose.model('ProjectAssignment', projectAssignmentSchema);