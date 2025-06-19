import mongoose from 'mongoose';

const projectTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['website', 'webapp', 'ecommerce', 'mobile', 'api'],
    required: true
  },
  previewImages: [String],
  demoUrl: String,
  features: [String],
  techStack: [String],
  estimatedDays: Number,
  basePrice: Number,
  complexity: {
    type: String,
    enum: ['simple', 'medium', 'complex'],
    default: 'medium'
  },
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  tags: [String],
  customizationOptions: [{
    name: String,
    type: { type: String, enum: ['color', 'font', 'layout', 'feature'] },
    options: [String],
    price: Number
  }]
}, {
  timestamps: true
});

export default mongoose.model('ProjectTemplate', projectTemplateSchema);