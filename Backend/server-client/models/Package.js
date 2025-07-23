import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  features: [{
    name: String,
    description: String,
    included: { type: Boolean, default: true }
  }],
  type: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'enterprise', 'custom'],
    required: true
  },
  isPremiumOnly: {
    type: Boolean,
    default: false
  },
  customizable: {
    type: Boolean,
    default: false
  },
  maxProjects: {
    type: Number,
    required: true
  },
  maxTeamMembers: {
    type: Number,
    required: true
  },
  maxStorage: {
    type: Number, // in GB
    required: true
  },
  supportLevel: {
    type: String,
    enum: ['basic', 'priority', '24/7'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Package', packageSchema);