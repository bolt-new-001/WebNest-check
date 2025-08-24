import crypto from 'crypto';

export class OTPService {
  static generateOTP() {
    // Generate a secure 6-digit OTP
    return crypto.randomInt(100000, 999999).toString();
  }

  static generateExpiry() {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5); // 5 minutes expiry
    return expiryDate;
  }

  static async validateOTPAttempts(user) {
    const MAX_ATTEMPTS = 5;
    const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

    // Reset attempts if blockDuration has passed
    if (user.otpAttempts.blockedUntil && user.otpAttempts.blockedUntil < new Date()) {
      user.otpAttempts.count = 0;
      user.otpAttempts.blockedUntil = null;
    }

    // Check if user is blocked
    if (user.otpAttempts.blockedUntil && user.otpAttempts.blockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.otpAttempts.blockedUntil - new Date()) / 1000 / 60);
      throw new Error(`Too many attempts. Please try again in ${remainingTime} minutes.`);
    }

    // Increment attempt counter
    user.otpAttempts.count += 1;
    user.otpAttempts.lastAttempt = new Date();

    // Block if max attempts reached
    if (user.otpAttempts.count >= MAX_ATTEMPTS) {
      user.otpAttempts.blockedUntil = new Date(Date.now() + BLOCK_DURATION);
      await user.save();
      throw new Error('Too many attempts. Please try again in 15 minutes.');
    }

    await user.save();
  }

  static isOTPValid(user) {
    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return false;
    }

    return user.emailVerificationExpires > new Date();
  }

  static clearOTP(user) {
    user.emailVerificationCode = '';
    user.emailVerificationExpires = null;
    user.otpAttempts.count = 0;
    user.otpAttempts.blockedUntil = null;
  }
}
