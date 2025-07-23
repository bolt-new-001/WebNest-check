import mongoose from 'mongoose';

const supportFAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    maxlength: 500
  },
  answer: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'billing', 'account', 'getting_started', 'troubleshooting', 'general']
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Searchable fields
supportFAQSchema.index({
  question: 'text',
  answer: 'text'
});

// Methods
supportFAQSchema.methods.updateOrder = function(newOrder) {
  this.order = newOrder;
  return this.save();
};

supportFAQSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

export default mongoose.model('SupportFAQ', supportFAQSchema);
