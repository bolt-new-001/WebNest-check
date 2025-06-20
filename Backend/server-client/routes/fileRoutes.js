import express from 'express';
import {
  uploadProjectFile,
  getProjectFiles,
  deleteProjectFile,
  downloadProjectFile,
  getFileStats,
  upload
} from '../controllers/fileManagerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/upload/:projectId', upload.single('file'), uploadProjectFile);
router.get('/project/:projectId', getProjectFiles);
router.get('/download/:fileId', downloadProjectFile);
router.delete('/:fileId', deleteProjectFile);
router.get('/stats/:projectId', getFileStats);

export default router;