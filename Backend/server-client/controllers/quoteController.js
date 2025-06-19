import asyncHandler from 'express-async-handler';
import Quote from '../models/Quote.js';
import BudgetCalculator from '../models/BudgetCalculator.js';

// @desc    Generate quote
// @route   POST /api/quotes/generate
// @access  Private
export const generateQuote = asyncHandler(async (req, res) => {
  const {
    projectDetails,
    timeline,
    features = [],
    addOns = []
  } = req.body;

  // Get budget calculator for pricing
  const calculator = await BudgetCalculator.findOne({ 
    category: projectDetails.type,
    isActive: true 
  });

  if (!calculator) {
    return res.status(404).json({ 
      message: 'Pricing calculator not found for this project type' 
    });
  }

  // Calculate pricing
  let basePrice = calculator.basePrice;
  let featurePricing = [];
  let addOnPricing = [];

  // Calculate feature costs
  features.forEach(featureName => {
    const feature = calculator.features.find(f => f.name === featureName);
    if (feature) {
      featurePricing.push({
        name: feature.name,
        price: feature.price
      });
      basePrice += feature.price;
    }
  });

  // Calculate add-on costs
  addOns.forEach(addOn => {
    addOnPricing.push(addOn);
    basePrice += addOn.price;
  });

  // Apply multipliers
  const complexityMultiplier = calculator.complexityMultipliers[projectDetails.complexity] || 1;
  const timelineMultiplier = calculator.timelineMultipliers[timeline.urgency] || 1;
  const designMultiplier = calculator.designMultipliers[projectDetails.designType] || 1;

  const subtotal = basePrice * complexityMultiplier * timelineMultiplier * designMultiplier;
  const taxes = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + taxes;

  // Generate milestones
  const milestones = [
    {
      title: 'Project Kickoff & Planning',
      description: 'Initial planning, wireframes, and project setup',
      deliverables: ['Project plan', 'Wireframes', 'Technical specifications'],
      estimatedDays: Math.ceil(timeline.estimatedDays * 0.2),
      amount: totalAmount * 0.3
    },
    {
      title: 'Design & Development',
      description: 'UI/UX design and core development',
      deliverables: ['Design mockups', 'Core functionality', 'Responsive layout'],
      estimatedDays: Math.ceil(timeline.estimatedDays * 0.5),
      amount: totalAmount * 0.4
    },
    {
      title: 'Testing & Deployment',
      description: 'Quality assurance, testing, and final deployment',
      deliverables: ['Testing report', 'Bug fixes', 'Live deployment'],
      estimatedDays: Math.ceil(timeline.estimatedDays * 0.3),
      amount: totalAmount * 0.3
    }
  ];

  // Create quote
  const quote = await Quote.create({
    clientId: req.user._id,
    projectDetails,
    timeline,
    pricing: {
      basePrice: calculator.basePrice,
      features: featurePricing,
      addOns: addOnPricing,
      subtotal,
      taxes,
      totalAmount,
      currency: 'INR'
    },
    milestones,
    terms: {
      paymentTerms: '30% advance, 40% on milestone completion, 30% on final delivery',
      deliveryTerms: `Delivery within ${timeline.estimatedDays} working days`,
      revisionPolicy: '3 free revisions included',
      cancellationPolicy: 'Cancellation allowed with 48 hours notice'
    },
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    generatedBy: req.admin?._id
  });

  res.status(201).json({
    success: true,
    data: quote
  });
});

// @desc    Get user quotes
// @route   GET /api/quotes
// @access  Private
export const getUserQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({ clientId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('generatedBy', 'name');

  res.json({
    success: true,
    data: quotes
  });
});

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private
export const getQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findOne({
    _id: req.params.id,
    clientId: req.user._id
  }).populate('generatedBy', 'name');

  if (!quote) {
    return res.status(404).json({ message: 'Quote not found' });
  }

  // Mark as viewed if not already
  if (quote.status === 'sent' && !quote.viewedAt) {
    quote.status = 'viewed';
    quote.viewedAt = new Date();
    await quote.save();
  }

  res.json({
    success: true,
    data: quote
  });
});

// @desc    Accept quote
// @route   PUT /api/quotes/:id/accept
// @access  Private
export const acceptQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findOneAndUpdate(
    {
      _id: req.params.id,
      clientId: req.user._id,
      status: { $in: ['sent', 'viewed'] }
    },
    {
      status: 'accepted',
      respondedAt: new Date()
    },
    { new: true }
  );

  if (!quote) {
    return res.status(404).json({ message: 'Quote not found or cannot be accepted' });
  }

  // TODO: Create project from accepted quote

  res.json({
    success: true,
    data: quote,
    message: 'Quote accepted successfully'
  });
});

// @desc    Reject quote
// @route   PUT /api/quotes/:id/reject
// @access  Private
export const rejectQuote = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const quote = await Quote.findOneAndUpdate(
    {
      _id: req.params.id,
      clientId: req.user._id,
      status: { $in: ['sent', 'viewed'] }
    },
    {
      status: 'rejected',
      respondedAt: new Date(),
      notes: reason
    },
    { new: true }
  );

  if (!quote) {
    return res.status(404).json({ message: 'Quote not found or cannot be rejected' });
  }

  res.json({
    success: true,
    data: quote,
    message: 'Quote rejected'
  });
});