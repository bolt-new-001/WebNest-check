import mongoose from 'mongoose';

const projectAssignmentSchema = new mongoose.Schema({
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
  assignedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'rejected', 'in_progress', 'completed'],
    default: 'assigned'
  },
  estimatedHours: Number,
  actualHours: { type: Number, default: 0 },
  hourlyRate: Number,
  totalAmount: Number,
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completedAt: Date,
    notes: String
  }],
  workLogs: [{
    date: { type: Date, default: Date.now },
    hours: Number,
    description: String,
    proofOfWork: String // URL to uploaded file/image
  }],
  feedback: {
    fromClient: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    },
    fromDeveloper: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('ProjectAssignment', projectAssignmentSchema);