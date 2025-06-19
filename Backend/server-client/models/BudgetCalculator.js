import mongoose from 'mongoose';

const budgetCalculatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['website', 'webapp', 'ecommerce', 'mobile', 'api', 'maintenance'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  features: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    isRequired: { type: Boolean, default: false },
    estimatedHours: Number
  }],
  complexityMultipliers: {
    simple: { type: Number, default: 1 },
    medium: { type: Number, default: 1.5 },
    complex: { type: Number, default: 2.5 },
    enterprise: { type: Number, default: 4 }
  },
  timelineMultipliers: {
    rush: { type: Number, default: 1.8 }, // < 2 weeks
    normal: { type: Number, default: 1 }, // 2-8 weeks
    flexible: { type: Number, default: 0.85 } // > 8 weeks
  },
  designMultipliers: {
    template: { type: Number, default: 1 },
    custom: { type: Number, default: 1.5 },
    premium: { type: Number, default: 2.2 }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('BudgetCalculator', budgetCalculatorSchema);