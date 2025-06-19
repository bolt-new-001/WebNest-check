import mongoose from 'mongoose';

const projectInvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectMilestone'
  },
  invoiceType: {
    type: String,
    enum: ['milestone', 'final', 'additional', 'revision'],
    required: true
  },
  items: [{
    description: String,
    quantity: { type: Number, default: 1 },
    unitPrice: Number,
    totalPrice: Number,
    category: {
      type: String,
      enum: ['development', 'design', 'revision', 'additional_feature', 'consultation']
    }
  }],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 18 }, // GST rate
  taxAmount: Number,
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  dueDate: Date,
  paidDate: Date,
  paymentMethod: String,
  paymentReference: String,
  notes: String,
  terms: String,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  sentAt: Date,
  viewedAt: Date,
  remindersSent: { type: Number, default: 0 },
  lastReminderSent: Date
}, {
  timestamps: true
});

// Generate invoice number before saving
projectInvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('ProjectInvoice').countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `WN-INV-${year}-${(count + 1).toString().padStart(6, '0')}`;
  }

  // Calculate tax amount
  this.taxAmount = (this.subtotal - this.discountAmount) * (this.taxRate / 100);
  this.totalAmount = this.subtotal - this.discountAmount + this.taxAmount;

  next();
});

export default mongoose.model('ProjectInvoice', projectInvoiceSchema);