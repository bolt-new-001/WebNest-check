import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
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
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'owner'],
    default: 'admin'
  },
  avatar: {
    type: String,
    default: ''
  },
  permissions: [{
    module: {
      type: String,
      enum: ['users', 'developers', 'projects', 'themes', 'analytics', 'notifications', 'settings'],
      required: true
    },
    actions: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete'],
      required: true
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginHistory: [{
    ip: String,
    userAgent: String,
    loginAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  adminSchema.add({
    otp: {
      type: String,
      default: null
    },
    otpExpiry: {
      type: Date,
      default: null
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  });
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if admin has permission
adminSchema.methods.hasPermission = function(module, action) {
  if (this.role === 'owner') return true;
  
  const permission = this.permissions.find(p => p.module === module);
  return permission && permission.actions.includes(action);
};

export default mongoose.model('Admin', adminSchema);