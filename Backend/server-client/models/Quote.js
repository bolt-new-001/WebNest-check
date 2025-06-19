import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: String,
    unique: true,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectDetails: {
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['website', 'webapp', 'ecommerce', 'mobile', 'api', 'maintenance']
    },
    features: [String],
    designType: {
      type: String,
      enum: ['template', 'custom', 'premium']
    },
    complexity: {
      type: String,
      enum: ['simple', 'medium', 'complex', 'enterprise']
    }
  },
  timeline: {
    estimatedDays: Number,
    deadline: Date,
    urgency: {
      type: String,
      enum: ['flexible', 'normal', 'rush']
    }
  },
  pricing: {
    basePrice: Number,
    features: [{
      name: String,
      price: Number
    }],
    addOns: [{
      name: String,
      price: Number
    }],
    discounts: [{
      name: String,
      amount: Number,
      type: { type: String, enum: ['percentage', 'fixed'] }
    }],
    subtotal: Number,
    taxes: Number,
    totalAmount: Number,
    currency: { type: String, default: 'INR' }
  },
  milestones: [{
    title: String,
    description: String,
    deliverables: [String],
    estimatedDays: Number,
    amount: Number
  }],
  terms: {
    paymentTerms: String,
    deliveryTerms: String,
    revisionPolicy: String,
    cancellationPolicy: String
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
    default: 'draft'
  },
  validUntil: Date,
  sentAt: Date,
  viewedAt: Date,
  respondedAt: Date,
  notes: String,
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Generate quote number before saving
quoteSchema.pre('save', async function(next) {
  if (!this.quoteNumber) {
    const count = await mongoose.model('Quote').countDocuments();
    this.quoteNumber = `WN-Q-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Quote', quoteSchema);