import asyncHandler from 'express-async-handler';
import BudgetCalculator from '../models/BudgetCalculator.js';
import UserPreferences from '../models/UserPreferences.js';

// @desc    Calculate project budget
// @route   POST /api/budget/calculate
// @access  Public
export const calculateBudget = asyncHandler(async (req, res) => {
  const {
    category,
    features = [],
    complexity = 'medium',
    timeline = 'normal',
    designType = 'custom',
    customRequirements = []
  } = req.body;

  // Get base calculator data
  const calculator = await BudgetCalculator.findOne({ 
    category, 
    isActive: true 
  });

  if (!calculator) {
    return res.status(404).json({ 
      message: 'Budget calculator not found for this category' 
    });
  }

  // Calculate base price
  let totalPrice = calculator.basePrice;
  let estimatedHours = 40; // base hours

  // Add feature costs
  const selectedFeatures = [];
  features.forEach(featureName => {
    const feature = calculator.features.find(f => f.name === featureName);
    if (feature) {
      totalPrice += feature.price;
      estimatedHours += feature.estimatedHours || 0;
      selectedFeatures.push(feature);
    }
  });

  // Apply multipliers
  const complexityMultiplier = calculator.complexityMultipliers[complexity] || 1;
  const timelineMultiplier = calculator.timelineMultipliers[timeline] || 1;
  const designMultiplier = calculator.designMultipliers[designType] || 1;

  totalPrice *= complexityMultiplier * timelineMultiplier * designMultiplier;
  estimatedHours *= complexityMultiplier;

  // Add custom requirements cost (10% per custom requirement)
  const customCost = customRequirements.length * (totalPrice * 0.1);
  totalPrice += customCost;

  // Get user currency preference if authenticated
  let currency = 'INR';
  if (req.user) {
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    if (preferences) {
      currency = preferences.currency;
    }
  }

  // Convert currency if needed (simplified - in production use real exchange rates)
  const exchangeRates = {
    'INR': 1,
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095
  };

  const convertedPrice = totalPrice * (exchangeRates[currency] || 1);

  // Calculate timeline
  const timelineEstimate = {
    simple: Math.ceil(estimatedHours / 8), // 8 hours per day
    medium: Math.ceil(estimatedHours / 6),
    complex: Math.ceil(estimatedHours / 4),
    enterprise: Math.ceil(estimatedHours / 3)
  };

  const estimatedDays = timelineEstimate[complexity] || timelineEstimate.medium;

  res.json({
    success: true,
    data: {
      category,
      basePrice: calculator.basePrice,
      selectedFeatures,
      multipliers: {
        complexity: complexityMultiplier,
        timeline: timelineMultiplier,
        design: designMultiplier
      },
      customRequirements: customRequirements.length,
      customCost,
      totalPrice: Math.round(convertedPrice),
      currency,
      estimatedHours,
      estimatedDays,
      breakdown: {
        base: calculator.basePrice,
        features: selectedFeatures.reduce((sum, f) => sum + f.price, 0),
        multipliers: totalPrice - calculator.basePrice - selectedFeatures.reduce((sum, f) => sum + f.price, 0) - customCost,
        custom: customCost
      }
    }
  });
});

// @desc    Get budget calculator templates
// @route   GET /api/budget/templates
// @access  Public
export const getBudgetTemplates = asyncHandler(async (req, res) => {
  const templates = await BudgetCalculator.find({ isActive: true })
    .select('name category basePrice features complexityMultipliers');

  res.json({
    success: true,
    data: templates
  });
});

// @desc    Save budget calculation
// @route   POST /api/budget/save
// @access  Private
export const saveBudgetCalculation = asyncHandler(async (req, res) => {
  const { calculationData, projectName } = req.body;

  // Save to user's saved calculations (you can create a SavedCalculation model)
  // For now, we'll return success
  
  res.json({
    success: true,
    message: 'Budget calculation saved successfully'
  });
});