import asyncHandler from "express-async-handler";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { getClientIp } from "@supercharge/request-ip";
import UAParser from "ua-parser-js";

// @desc    Get all active sessions for current user
// @route   GET /api/auth/sessions
// @access  Private
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user.id, valid: true })
    .sort({ updatedAt: -1 });

  const sessionsWithDetails = sessions.map((session) => {
    const parser = new UAParser();
    const ua = parser.setUA(session.userAgent).getResult();

    return {
      id: session._id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      lastActiveAt: session.updatedAt,
      isCurrent: session.id === req.sessionID,
      device: {
        type: ua.device.type || "desktop",
        os: ua.os.name || "Unknown OS",
        browser: ua.browser.name || "Unknown Browser",
      },
      location: {
        city: session.city,
        region: session.region,
        country: session.country,
      },
    };
  });

  res.json({
    success: true,
    data: sessionsWithDetails,
  });
});

// @desc    Get current session details
// @route   GET /api/auth/sessions/current
// @access  Private
export const getCurrentSession = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id: req.sessionID,
    user: req.user.id,
    valid: true,
  });

  if (!session) {
    res.status(404);
    throw new Error("Current session not found");
  }

  const parser = new UAParser();
  const ua = parser.setUA(session.userAgent).getResult();

  const sessionDetails = {
    id: session._id,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    lastActiveAt: session.updatedAt,
    isCurrent: true,
    device: {
      type: ua.device.type || "desktop",
      os: ua.os.name || "Unknown OS",
      browser: ua.browser.name || "Unknown Browser",
    },
    location: {
      city: session.city,
      region: session.region,
      country: session.country,
    },
  };

  res.json({
    success: true,
    data: sessionDetails,
  });
});

// @desc    Revoke a specific session
// @route   DELETE /api/auth/sessions/:id
// @access  Private
export const revokeSession = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.id === req.sessionID) {
    res.status(400);
    throw new Error("Cannot revoke current session");
  }

  session.valid = false;
  await session.save();

  res.json({
    success: true,
    message: "Session revoked successfully",
  });
});

// @desc    Revoke all other sessions except current
// @route   DELETE /api/auth/sessions/others
// @access  Private
export const revokeOtherSessions = asyncHandler(async (req, res) => {
  await Session.updateMany(
    {
      user: req.user.id,
      _id: { $ne: req.sessionID },
      valid: true,
    },
    { $set: { valid: false } }
  );

  res.json({
    success: true,
    message: "All other sessions have been revoked",
  });
});

// @desc    Create or update session on login
// @route   POST /api/auth/session
// @access  Private
export const createOrUpdateSession = asyncHandler(async (req, res, next) => {
  const ipAddress = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "unknown";

  const location = await getLocationFromIP(ipAddress);

  await Session.findOneAndUpdate(
    { _id: req.sessionID },
    {
      user: req.user._id,
      ipAddress,
      userAgent,
      valid: true,
      ...location,
      lastActivity: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  next();
});

// Helper function (mock)
async function getLocationFromIP(ipAddress) {
  return {
    city: "Unknown",
    region: "Unknown",
    country: "Unknown",
  };
}
