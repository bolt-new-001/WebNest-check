import mongoose from 'mongoose';

const earningsSchema = new mongoose.Schema({
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectAssignment',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  hoursWorked: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'available', 'paid'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Earnings', earningsSchema);