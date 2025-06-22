import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'paypal', 'stripe', 'other'],
    default: 'bank_transfer'
  },
  transactionId: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  paymentDate: {
    type: Date
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);