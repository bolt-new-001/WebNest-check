import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'approved', 'revision_requested'],
    default: 'pending'
  },
  estimatedStartDate: Date,
  estimatedEndDate: Date,
  actualStartDate: Date,
  actualEndDate: Date,
  deliverables: [{
    name: String,
    description: String,
    fileUrl: String,
    completed: { type: Boolean, default: false }
  }],
  clientFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comments: String,
    approved: { type: Boolean, default: false },
    submittedAt: Date
  },
  developerNotes: String,
  progressPercentage: { type: Number, default: 0 },
  hoursLogged: { type: Number, default: 0 },
  estimatedHours: Number
}, {
  timestamps: true
});

export default mongoose.model('ProjectMilestone', milestoneSchema);