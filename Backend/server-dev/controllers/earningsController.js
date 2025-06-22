import asyncHandler from 'express-async-handler';
import Earnings from '../models/Earnings.js';
import Payment from '../models/Payment.js';
import Developer from '../models/Developer.js';
import mongoose from 'mongoose';

// @desc    Get developer earnings overview
// @route   GET /api/earnings
// @access  Private (Developer)
export const getEarnings = asyncHandler(async (req, res) => {
  const earnings = await Earnings.find({ developerId: req.developer._id })
    .populate('projectId', 'title')
    .populate('assignmentId', 'hourlyRate')
    .sort({ earnedAt: -1 })
    .limit(10);

  // Get earnings summary
  const summary = await Earnings.aggregate([
    { $match: { developerId: new mongoose.Types.ObjectId(req.developer._id) } },
    { $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Format summary data
  const formattedSummary = {
    pending: 0,
    available: 0,
    paid: 0,
    total: 0
  };

  summary.forEach(item => {
    formattedSummary[item._id] = item.total;
    formattedSummary.total += item.total;
  });

  res.json({
    success: true,
    data: {
      recentEarnings: earnings,
      summary: formattedSummary
    }
  });
});

// @desc    Get earnings statistics
// @route   GET /api/earnings/stats
// @access  Private (Developer)
export const getEarningsStats = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  if (period === 'week') {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    dateFilter = { earnedAt: { $gte: weekStart } };
  } else if (period === 'month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFilter = { earnedAt: { $gte: monthStart } };
  } else if (period === 'year') {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    dateFilter = { earnedAt: { $gte: yearStart } };
  } else if (period === 'all') {
    dateFilter = {};
  }

  // Get earnings by time period
  const earningsByTime = await Earnings.aggregate([
    { 
      $match: { 
        developerId: new mongoose.Types.ObjectId(req.developer._id),
        ...dateFilter
      } 
    },
    {
      $group: {
        _id: period === 'week' ? { $dayOfWeek: '$earnedAt' } :
             period === 'month' ? { $dayOfMonth: '$earnedAt' } :
             period === 'year' ? { $month: '$earnedAt' } : null,
        amount: { $sum: '$amount' },
        hours: { $sum: '$hoursWorked' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get earnings by project
  const earningsByProject = await Earnings.aggregate([
    { 
      $match: { 
        developerId: new mongoose.Types.ObjectId(req.developer._id),
        ...dateFilter
      } 
    },
    {
      $group: {
        _id: '$projectId',
        amount: { $sum: '$amount' },
        hours: { $sum: '$hoursWorked' }
      }
    },
    { $sort: { amount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $project: {
        projectId: '$_id',
        projectName: { $arrayElemAt: ['$project.title', 0] },
        amount: 1,
        hours: 1
      }
    }
  ]);

  // Get total stats
  const totalStats = await Earnings.aggregate([
    { 
      $match: { 
        developerId: new mongoose.Types.ObjectId(req.developer._id),
        ...dateFilter
      } 
    },
    {
      $group: {
        _id: null,
        totalEarned: { $sum: '$amount' },
        totalHours: { $sum: '$hoursWorked' },
        projectCount: { $addToSet: '$projectId' },
        averageHourlyRate: { $avg: { $divide: ['$amount', '$hoursWorked'] } }
      }
    },
    {
      $project: {
        _id: 0,
        totalEarned: 1,
        totalHours: 1,
        projectCount: { $size: '$projectCount' },
        averageHourlyRate: 1
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      earningsByTime,
      earningsByProject,
      stats: totalStats.length > 0 ? totalStats[0] : {
        totalEarned: 0,
        totalHours: 0,
        projectCount: 0,
        averageHourlyRate: 0
      }
    }
  });
});

// @desc    Get payment history
// @route   GET /api/earnings/payments
// @access  Private (Developer)
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { developerId: req.developer._id };
  if (status) query.status = status;

  const payments = await Payment.find(query)
    .populate('projectId', 'title')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payment.countDocuments(query);

  res.json({
    success: true,
    data: payments,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Request payout
// @route   POST /api/earnings/payout
// @access  Private (Developer)
export const requestPayout = asyncHandler(async (req, res) => {
  const { amount, paymentMethod, accountDetails } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Please enter a valid amount');
  }

  // Check if developer has enough available earnings
  const availableEarnings = await Earnings.aggregate([
    { 
      $match: { 
        developerId: new mongoose.Types.ObjectId(req.developer._id),
        status: 'available'
      } 
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const availableAmount = availableEarnings.length > 0 ? availableEarnings[0].total : 0;

  if (amount > availableAmount) {
    res.status(400);
    throw new Error(`Insufficient funds. Available: $${availableAmount}`);
  }

  // Create payment request
  const payment = await Payment.create({
    developerId: req.developer._id,
    projectId: null, // This is a general payout, not tied to a specific project
    amount,
    paymentMethod,
    description: `Payout requested by developer`,
    requestedAt: new Date(),
    status: 'pending'
  });

  // Update developer profile with payment request
  const developer = await Developer.findById(req.developer._id);
  
  res.status(201).json({
    success: true,
    data: payment,
    message: 'Payout request submitted successfully'
  });
});