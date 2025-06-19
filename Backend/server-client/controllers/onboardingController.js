import asyncHandler from 'express-async-handler';
import OnboardingProgress from '../models/OnboardingProgress.js';

// @desc    Get onboarding progress
// @route   GET /api/onboarding/progress
// @access  Private
export const getOnboardingProgress = asyncHandler(async (req, res) => {
  const userType = req.user ? 'User' : 'Developer';
  const userId = req.user?._id || req.developer?._id;

  let progress = await OnboardingProgress.findOne({ userId, userType });

  if (!progress) {
    // Create initial onboarding progress
    const defaultSteps = userType === 'User' ? [
      { stepId: 'welcome', stepName: 'Welcome to WebNest' },
      { stepId: 'profile', stepName: 'Complete Your Profile' },
      { stepId: 'preferences', stepName: 'Set Your Preferences' },
      { stepId: 'project-type', stepName: 'Choose Project Type' },
      { stepId: 'budget', stepName: 'Set Your Budget' },
      { stepId: 'timeline', stepName: 'Project Timeline' },
      { stepId: 'complete', stepName: 'Get Started' }
    ] : [
      { stepId: 'welcome', stepName: 'Welcome Developer' },
      { stepId: 'profile', stepName: 'Complete Your Profile' },
      { stepId: 'portfolio', stepName: 'Add Portfolio Projects' },
      { stepId: 'skills', stepName: 'Add Your Skills' },
      { stepId: 'availability', stepName: 'Set Availability' },
      { stepId: 'verification', stepName: 'Account Verification' },
      { stepId: 'complete', stepName: 'Start Receiving Projects' }
    ];

    progress = await OnboardingProgress.create({
      userId,
      userType,
      steps: defaultSteps,
      currentStep: 'welcome',
      totalSteps: defaultSteps.length
    });
  }

  res.json({
    success: true,
    data: progress
  });
});

// @desc    Update onboarding step
// @route   PUT /api/onboarding/step/:stepId
// @access  Private
export const updateOnboardingStep = asyncHandler(async (req, res) => {
  const { stepId } = req.params;
  const { completed, data, skipped = false } = req.body;
  
  const userType = req.user ? 'User' : 'Developer';
  const userId = req.user?._id || req.developer?._id;

  const progress = await OnboardingProgress.findOne({ userId, userType });

  if (!progress) {
    return res.status(404).json({ message: 'Onboarding progress not found' });
  }

  // Update the specific step
  const stepIndex = progress.steps.findIndex(step => step.stepId === stepId);
  if (stepIndex === -1) {
    return res.status(404).json({ message: 'Step not found' });
  }

  progress.steps[stepIndex].completed = completed;
  progress.steps[stepIndex].skipped = skipped;
  progress.steps[stepIndex].data = data;
  
  if (completed || skipped) {
    progress.steps[stepIndex].completedAt = new Date();
    
    // Move to next step
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < progress.steps.length) {
      progress.currentStep = progress.steps[nextStepIndex].stepId;
    }
  }

  await progress.save();

  res.json({
    success: true,
    data: progress
  });
});

// @desc    Skip onboarding
// @route   POST /api/onboarding/skip
// @access  Private
export const skipOnboarding = asyncHandler(async (req, res) => {
  const userType = req.user ? 'User' : 'Developer';
  const userId = req.user?._id || req.developer?._id;

  await OnboardingProgress.findOneAndUpdate(
    { userId, userType },
    {
      isCompleted: true,
      completedAt: new Date(),
      completionPercentage: 100
    }
  );

  res.json({
    success: true,
    message: 'Onboarding skipped successfully'
  });
});

// @desc    Reset onboarding
// @route   POST /api/onboarding/reset
// @access  Private
export const resetOnboarding = asyncHandler(async (req, res) => {
  const userType = req.user ? 'User' : 'Developer';
  const userId = req.user?._id || req.developer?._id;

  await OnboardingProgress.findOneAndDelete({ userId, userType });

  res.json({
    success: true,
    message: 'Onboarding reset successfully'
  });
});