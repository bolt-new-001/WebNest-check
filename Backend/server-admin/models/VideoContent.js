import mongoose from 'mongoose';

const videoContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  category: {
    type: String,
    enum: ['demo', 'tutorial', 'testimonial', 'walkthrough', 'feature'],
    required: true
  },
  duration: Number, // in seconds
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  tags: [String],
  targetAudience: {
    type: String,
    enum: ['clients', 'developers', 'admins', 'all'],
    default: 'all'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

export default mongoose.model('VideoContent', videoContentSchema);