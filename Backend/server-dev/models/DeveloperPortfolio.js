import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  tagline: {
    type: String,
    maxlength: 200
  },
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [{
      url: String,
      caption: String,
      isPrimary: { type: Boolean, default: false }
    }],
    techStack: [String],
    projectUrl: String,
    githubUrl: String,
    caseStudy: {
      challenge: String,
      solution: String,
      results: String,
      duration: String,
      teamSize: Number
    },
    category: {
      type: String,
      enum: ['website', 'webapp', 'mobile', 'ecommerce', 'api', 'other']
    },
    featured: { type: Boolean, default: false },
    completedAt: Date,
    clientTestimonial: {
      name: String,
      company: String,
      feedback: String,
      rating: { type: Number, min: 1, max: 5 }
    }
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    yearsOfExperience: Number,
    certifications: [String]
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    type: {
      type: String,
      enum: ['certification', 'award', 'milestone', 'recognition']
    }
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
    behance: String,
    dribbble: String
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    nextAvailable: Date,
    hoursPerWeek: { type: Number, default: 40 },
    timezone: String,
    preferredProjectTypes: [String],
    minimumBudget: Number
  },
  statistics: {
    totalProjects: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    responseTime: { type: Number, default: 24 }, // hours
    onTimeDelivery: { type: Number, default: 100 } // percentage
  },
  isPublic: { type: Boolean, default: true },
  profileViews: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for search and performance
portfolioSchema.index({ 'skills.name': 1 });
portfolioSchema.index({ 'availability.status': 1 });
portfolioSchema.index({ 'statistics.averageRating': -1 });

export default mongoose.model('DeveloperPortfolio', portfolioSchema);