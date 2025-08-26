import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    region: {
      type: String,
    },
    country: {
      type: String,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        return ret;
      },
    },
  }
);

// Index for faster queries
sessionSchema.index({ user: 1, valid: 1 });

// Add a method to check if session is expired
sessionSchema.methods.isExpired = function () {
  // Sessions expire after 30 days of inactivity
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - 30);
  return this.lastActivity < expiryDate;
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;
