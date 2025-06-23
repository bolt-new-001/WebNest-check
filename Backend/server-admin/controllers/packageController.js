import asyncHandler from 'express-async-handler';
import Package from '../models/Package.js';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getAllPackages = asyncHandler(async (req, res) => {
  const { category, featured, popular, active = true } = req.query;

  const query = {};
  if (category) query.category = category;
  if (featured !== undefined) query.isFeatured = featured === 'true';
  if (popular !== undefined) query.isPopular = popular === 'true';
  if (active !== undefined) query.isActive = active === 'true';

  const packages = await Package.find(query)
    .sort({ isFeatured: -1, 'popularity.orderCount': -1 })
    .populate('createdBy', 'name');

  res.json({
    success: true,
    data: packages
  });
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
export const getPackage = asyncHandler(async (req, res) => {
  const package = await Package.findById(req.params.id)
    .populate('createdBy', 'name');

  if (!package) {
    return res.status(404).json({ message: 'Package not found' });
  }

  res.json({
    success: true,
    data: package
  });
});

// @desc    Create package
// @route   POST /api/packages
// @access  Private (Admin)
export const createPackage = asyncHandler(async (req, res) => {
  const packageData = {
    ...req.body,
    createdBy: req.admin._id,
    slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
  };

  const package = await Package.create(packageData);

  res.status(201).json({
    success: true,
    data: package
  });
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private (Admin)
export const updatePackage = asyncHandler(async (req, res) => {
  const package = await Package.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!package) {
    return res.status(404).json({ message: 'Package not found' });
  }

  res.json({
    success: true,
    data: package
  });
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private (Admin)
export const deletePackage = asyncHandler(async (req, res) => {
  const package = await Package.findByIdAndDelete(req.params.id);

  if (!package) {
    return res.status(404).json({ message: 'Package not found' });
  }

  res.json({
    success: true,
    message: 'Package deleted successfully'
  });
});

// @desc    Get package analytics
// @route   GET /api/packages/analytics
// @access  Private (Admin)
export const getPackageAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Package.aggregate([
    {
      $group: {
        _id: '$category',
        totalPackages: { $sum: 1 },
        totalOrders: { $sum: '$popularity.orderCount' },
        avgRating: { $avg: '$popularity.rating' },
        totalRevenue: { $sum: { $multiply: ['$pricing.finalPrice', '$popularity.orderCount'] } }
      }
    }
  ]);

  res.json({
    success: true,
    data: analytics
  });
});