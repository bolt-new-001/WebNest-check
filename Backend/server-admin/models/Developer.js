import mongoose from 'mongoose';

const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String
    },
    skills: [{
      type: String
    }],
    experience: {
      type: Number,  // in years
      required: true
    },
    hourlyRate: {
      type: Number,
      required: true
    },
    portfolio: {
      type: String  // URL to portfolio
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    },
    specialization: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Developer', developerSchema);