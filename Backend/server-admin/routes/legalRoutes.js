import express from 'express';
import {
  getAllLegalDocuments,
  createLegalDocument,
  acceptLegalDocument,
  getUserDocumentAcceptances
} from '../controllers/legalController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/documents', protect, checkPermission('legal', 'read'), getAllLegalDocuments);
router.post('/documents', protect, checkPermission('legal', 'create'), createLegalDocument);

// User/Developer routes
router.post('/accept/:documentId', protect, acceptLegalDocument);
router.get('/acceptances', protect, getUserDocumentAcceptances);

export default router;