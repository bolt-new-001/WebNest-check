import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

export class TokenManager {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m'
    });
  }

  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  static async createRefreshToken(userId, userType, deviceInfo = {}) {
    const token = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await RefreshToken.create({
      userId,
      userType,
      token,
      expiresAt,
      deviceInfo
    });

    return token;
  }

  static async validateRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!refreshToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // Update last used
    refreshToken.lastUsed = new Date();
    await refreshToken.save();

    return refreshToken;
  }

  static async revokeRefreshToken(token) {
    await RefreshToken.updateOne(
      { token },
      { isActive: false }
    );
  }

  static async revokeAllUserTokens(userId, userType) {
    await RefreshToken.updateMany(
      { userId, userType },
      { isActive: false }
    );
  }

  static async cleanupExpiredTokens() {
    await RefreshToken.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isActive: false }
      ]
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}