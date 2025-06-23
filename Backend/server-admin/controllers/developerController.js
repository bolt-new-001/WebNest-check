import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const Developer = mongoose.model('Developer');
const ProjectAssignment = mongoose.model('ProjectAssignment');
const Review = mongoose.model('Review');

// @desc    Get all developers
// @route   GET /api/developers
// @access  Private
export const getAllDevelopers = asyncHandler(async (req, res) => {
  const { isVerified, isActive, skills, page = 1, limit = 20, search } = req.query;

  const query = {};
  if (isVerified !== undefined) query.isVerified = isVerified === 'true';
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (skills) query['skills.name'] = { $in: skills.split(',') };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { 'skills.name': { $regex: search, $options: 'i' } }
    ];
  }

  const developers = await Developer.find(query)
    .select('-password')
    .sort({ 'rating.average': -1, completedProjects: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Developer.countDocuments(query);

  res.json({
    success: true,
    data: developers,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// @desc    Get single developer
// @route   GET /api/developers/:id
// @access  Private
export const getDeveloper = asyncHandler(async (req, res) => {
  const developer = await Developer.findById(req.params.id).select('-password');

  if (!developer) {
    return res.status(404).json({ message: 'Developer not found' });
  }

  // Get developer's assignments
  const assignments = await ProjectAssignment.find({ developerId: developer._id })
    .populate('projectId', 'title status budget')
    .sort({ assignedAt: -1 })
    .limit(10);

  // Get recent reviews
  const reviews = await Review.find({ developerId: developer._id })
    .populate('clientId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      developer,
      assignments,
      reviews
    }
  });
});

// @desc    Verify developer
// @route   PUT /api/developers/:id/verify
// @access  Private
export const verifyDeveloper = asyncHandler(async (req, res) => {
  const { isVerified, verificationNotes } = req.body;

  const developer = await Developer.findByIdAndUpdate(
    req.params.id,
    { 
      isVerified,
      verificationNotes,
      verifiedAt: isVerified ? new Date() : null,
      verifiedBy: isVerified ? req.admin._id : null
    },
    { new: true }
  ).select('-password');

  if (!developer) {
    return res.status(404).json({ message: 'Developer not found' });
  }

  res.json({
    success: true,
    data: developer,
    message: `Developer ${isVerified ? 'verified' : 'unverified'} successfully`
  });
});

// @desc    Update developer
// @route   PUT /api/developers/:id
// @access  Private
export const updateDeveloper = asyncHandler(async (req, res) => {
  const { name, email, skills, isActive, role } = req.body;

  const developer = await Developer.findByIdAndUpdate(
    req.params.id,
    { name, email, skills, isActive, role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!developer) {
    return res.status(404).json({ message: 'Developer not found' });
  }

  res.json({
    success: true,
    data: developer
  });
});

// @desc    Delete developer
// @route   DELETE /api/developers/:id
// @access  Private
export const deleteDeveloper = asyncHandler(async (req, res) => {
  const developer = await Developer.findById(req.params.id);

  if (!developer) {
    return res.status(404).json({ message: 'Developer not found' });
  }

  // Check if developer has active assignments
  const activeAssignments = await ProjectAssignment.countDocuments({
    developerId: developer._id,
    status: { $in: ['assigned', 'accepted', 'in_progress'] }
  });

  if (activeAssignments > 0) {
    return res.status(400).json({ 
      message: 'Cannot delete developer with active assignments' 
    });
  }

  await Developer.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Developer deleted successfully'
  });
});

// @desc    Get developer statistics
// @route   GET /api/developers/stats
// @access  Private
export const getDeveloperStats = asyncHandler(async (req, res) => {
  const stats = await Developer.aggregate([
    {
      $facet: {
        verificationBreakdown: [
          { $group: { _id: '$isVerified', count: { $sum: 1 } } }
        ],
        skillsBreakdown: [
          { $unwind: '$skills' },
          { $group: { _id: '$skills.name', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        ratingDistribution: [
          {
            $bucket: {
              groupBy: '$rating.average',
              boundaries: [0, 1, 2, 3, 4, 5],
              default: 'No Rating',
              output: { count: { $sum: 1 } }
            }
          }
        ],
        totalEarnings: [
          { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
        ]
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0]
  });
});

// @desc    Promote developer
// @route   PUT /api/developers/:id/promote
// @access  Private
export const promoteDeveloper = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['developer', 'leadDeveloper'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const developer = await Developer.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!developer) {
    return res.status(404).json({ message: 'Developer not found' });
  }

  res.json({
    success: true,
    data: developer,
    message: `Developer promoted to ${role}`
  });
});