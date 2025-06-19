import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
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
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer'],
    required: true
  },
  gatewayTransactionId: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  type: {
    type: String,
    enum: ['payment', 'refund', 'payout', 'fee'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  description: String,
  metadata: {
    milestoneId: mongoose.Schema.Types.ObjectId,
    invoiceNumber: String,
    taxAmount: Number,
    feeAmount: Number,
    netAmount: Number
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'bank_transfer']
  },
  failureReason: String,
  processedAt: Date,
  refundedAt: Date,
  refundAmount: Number
}, {
  timestamps: true
});

// Generate transaction ID before saving
paymentHistorySchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const count = await mongoose.model('PaymentHistory').countDocuments();
    this.transactionId = `WN-TXN-${Date.now()}-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('PaymentHistory', paymentHistorySchema);