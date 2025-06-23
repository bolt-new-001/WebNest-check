import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: String,
  category: {
    type: String,
    enum: ['website', 'webapp', 'ecommerce', 'mobile', 'maintenance', 'consultation'],
    required: true
  },
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    billingType: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly'],
      default: 'one-time'
    },
    discountPercentage: { type: Number, default: 0 },
    finalPrice: Number
  },
  features: [{
    name: String,
    description: String,
    included: { type: Boolean, default: true },
    icon: String
  }],
  deliverables: [{
    name: String,
    description: String,
    estimatedDays: Number
  }],
  timeline: {
    estimatedDays: { type: Number, required: true },
    milestones: [{
      name: String,
      description: String,
      dayNumber: Number,
      deliverables: [String]
    }]
  },
  techStack: [String],
  requirements: {
    minimumBudget: Number,
    clientRequirements: [String],
    technicalRequirements: [String]
  },
  addOns: [{
    name: String,
    description: String,
    price: Number,
    estimatedDays: Number
  }],
  popularity: {
    orderCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  tags: [String],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Calculate final price before saving
packageSchema.pre('save', function(next) {
  if (this.pricing.discountPercentage > 0) {
    this.pricing.finalPrice = this.pricing.basePrice * (1 - this.pricing.discountPercentage / 100);
  } else {
    this.pricing.finalPrice = this.pricing.basePrice;
  }
  next();
});

export default mongoose.model('Package', packageSchema);