import asyncHandler from 'express-async-handler';
import Package from '../models/Package.js';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find({ active: true });
  res.json({
    success: true,
    data: packages
  });
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
export const getPackage = asyncHandler(async (req, res) => {
  const package = await Package.findById(req.params.id);
  
  if (!package) {
    res.status(404);
    throw new Error('Package not found');
  }

  res.json({
    success: true,
    data: package
  });
});

// @desc    Create package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = asyncHandler(async (req, res) => {
  const package = await Package.create(req.body);
  res.status(201).json({
    success: true,
    data: package
  });
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = asyncHandler(async (req, res) => {
  const package = await Package.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!package) {
    res.status(404);
    throw new Error('Package not found');
  }

  res.json({
    success: true,
    data: package
  });
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req, res) => {
  const package = await Package.findByIdAndDelete(req.params.id);

  if (!package) {
    res.status(404);
    throw new Error('Package not found');
  }

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Customize package
// @route   POST /api/packages/:id/customize
// @access  Private
export const customizePackage = asyncHandler(async (req, res) => {
  const { features } = req.body;
  const package = await Package.findById(req.params.id);

  if (!package) {
    res.status(404);
    throw new Error('Package not found');
  }

  if (!package.customizable) {
    res.status(400);
    throw new Error('This package cannot be customized');
  }

  // Update features based on customization
  package.features = features;
  await package.save();

  res.json({
    success: true,
    data: package
  });
});

// @desc    Purchase package
// @route   POST /api/packages/:id/purchase
// @access  Private
export const purchasePackage = asyncHandler(async (req, res) => {
  const package = await Package.findById(req.params.id);

  if (!package) {
    res.status(404);
    throw new Error('Package not found');
  }

  if (package.isPremiumOnly && !req.user.isPremium) {
    res.status(403);
    throw new Error('This package is only available for premium users');
  }

  // TODO: Implement payment processing
  // TODO: Update user's subscription/package status

  res.json({
    success: true,
    message: 'Package purchased successfully',
    data: package
  });
});