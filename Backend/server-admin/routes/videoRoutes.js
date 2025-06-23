import express from 'express';
import {
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllVideos);
router.get('/:id', getVideo);

// Protected routes
router.use(protect);

router.post('/', checkPermission('content', 'create'), createVideo);
router.put('/:id', checkPermission('content', 'update'), updateVideo);
router.delete('/:id', checkPermission('content', 'delete'), deleteVideo);

export default router;