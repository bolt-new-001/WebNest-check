import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.githubId;
    }
  },
  role: {
    type: String,
    enum: ['developer', 'leadDeveloper'],
    default: 'developer'
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  experience: {
    years: { type: Number, default: 0 },
    description: String
  },
  portfolio: [{
    title: String,
    description: String,
    url: String,
    image: String,
    technologies: [String]
  }],
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    hoursPerWeek: { type: Number, default: 40 },
    timezone: String
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  totalProjects: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
developerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
developerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active
developerSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

export default mongoose.model('Developer', developerSchema);