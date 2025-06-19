import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['business', 'portfolio', 'ecommerce', 'blog', 'landing', 'creative'],
    required: true
  },
  previewImage: {
    type: String,
    required: true
  },
  demoUrl: String,
  features: [String],
  techStack: [String],
  price: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  tags: [String]
}, {
  timestamps: true
});

export default mongoose.model('Theme', themeSchema);