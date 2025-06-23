import asyncHandler from 'express-async-handler';
import { LegalDocument, DocumentAcceptance } from '../models/LegalDocument.js';

// @desc    Get all legal documents
// @route   GET /api/legal/documents
// @access  Private (Admin)
export const getAllLegalDocuments = asyncHandler(async (req, res) => {
  const { type, active = true } = req.query;

  const query = {};
  if (type) query.type = type;
  if (active !== undefined) query.isActive = active === 'true';

  const documents = await LegalDocument.find(query)
    .populate('createdBy', 'name')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: documents
  });
});

// @desc    Create legal document
// @route   POST /api/legal/documents
// @access  Private (Admin)
export const createLegalDocument = asyncHandler(async (req, res) => {
  const document = await LegalDocument.create({
    ...req.body,
    createdBy: req.admin._id
  });

  res.status(201).json({
    success: true,
    data: document
  });
});

// @desc    Accept legal document
// @route   POST /api/legal/accept/:documentId
// @access  Private
export const acceptLegalDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { projectId, digitalSignature, witnessEmail } = req.body;

  const userId = req.user?._id || req.developer?._id;
  const userType = req.user ? 'User' : 'Developer';

  const acceptance = await DocumentAcceptance.create({
    documentId,
    userId,
    userType,
    projectId,
    digitalSignature,
    witnessEmail,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(201).json({
    success: true,
    data: acceptance
  });
});

// @desc    Get user document acceptances
// @route   GET /api/legal/acceptances
// @access  Private
export const getUserDocumentAcceptances = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.developer?._id;
  const userType = req.user ? 'User' : 'Developer';

  const acceptances = await DocumentAcceptance.find({ userId, userType })
    .populate('documentId', 'title type version')
    .populate('projectId', 'title')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: acceptances
  });
});