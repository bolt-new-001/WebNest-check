import Joi from 'joi';

// Project validation schemas
export const projectValidation = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    projectType: Joi.string().valid('website', 'ecommerce', 'webapp', 'portfolio', 'landing', 'custom').required(),
    budget: Joi.number().min(1000).required(),
    selectedTheme: Joi.string().optional(),
    features: Joi.array().items(Joi.object()).optional(),
    aiFeatures: Joi.array().items(Joi.object()).optional()
  }),
  
  update: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    budget: Joi.number().min(1000).optional(),
    features: Joi.array().items(Joi.object()).optional()
  })
};

// File upload validation
export const fileValidation = {
  upload: Joi.object({
    category: Joi.string().valid('logo', 'brand_assets', 'requirements', 'reference', 'deliverable', 'other').optional(),
    description: Joi.string().max(500).optional(),
    isPublic: Joi.boolean().optional()
  })
};

// Revision request validation
export const revisionValidation = {
  create: Joi.object({
    projectId: Joi.string().required(),
    milestoneId: Joi.string().optional(),
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    category: Joi.string().valid('design', 'functionality', 'content', 'performance', 'bug_fix', 'other').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    dueDate: Joi.date().greater('now').optional(),
    attachments: Joi.array().items(Joi.object()).optional()
  })
};

// Notification validation
export const notificationValidation = {
  preferences: Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    marketing: Joi.boolean().optional(),
    types: Joi.object().optional()
  })
};

// User preferences validation
export const preferencesValidation = {
  update: Joi.object({
    currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD').optional(),
    language: Joi.string().valid('en', 'hi', 'es', 'fr', 'de', 'zh', 'ja').optional(),
    theme: Joi.string().valid('light', 'dark', 'auto').optional(),
    designPreferences: Joi.object({
      preferredLayout: Joi.string().valid('minimal', 'modern', 'classic', 'creative', 'corporate').optional(),
      colorMode: Joi.string().valid('bright', 'neutral', 'dark', 'colorful', 'monochrome').optional(),
      favoriteColors: Joi.array().items(Joi.string()).optional(),
      preferredFonts: Joi.array().items(Joi.object()).optional()
    }).optional(),
    location: Joi.object({
      country: Joi.string().optional(),
      state: Joi.string().optional(),
      city: Joi.string().optional(),
      timezone: Joi.string().optional()
    }).optional()
  })
};

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};