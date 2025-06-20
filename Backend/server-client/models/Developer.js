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
    maxlength: 500,
    default: ''
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    yearsOfExperience: Number
  }],
  specializations: [{
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'mobile', 'ui/ux', 'devops', 'database', 'security', 'other']
  }],
  projectTypes: [{
    type: String,
    enum: ['website', 'ecommerce', 'webapp', 'portfolio', 'landing', 'custom']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      default: 'available'
    },
    hoursPerWeek: {
      type: Number,
      default: 40
    }
  },
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    projectUrl: String,
    technologies: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    from: Date,
    to: Date
  }],
  experience: [{
    company: String,
    position: String,
    description: String,
    from: Date,
    to: Date,
    current: Boolean
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expires: Date,
    credentialUrl: String
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    website: String,
    stackoverflow: String
  },
  googleId: String,
  githubId: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
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

// Check if profile is complete
developerSchema.methods.checkProfileComplete = function() {
  const requiredFields = ['name', 'email', 'bio', 'skills', 'specializations'];
  return requiredFields.every(field => {
    if (Array.isArray(this[field])) {
      return this[field].length > 0;
    }
    return Boolean(this[field]);
  });
};

// Indexes for efficient queries
developerSchema.index({ 'skills.name': 1 });
developerSchema.index({ specializations: 1 });
developerSchema.index({ projectTypes: 1 });
developerSchema.index({ 'rating.average': -1 });
developerSchema.index({ 'availability.status': 1 });

export default mongoose.model('Developer', developerSchema);