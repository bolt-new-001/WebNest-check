import express from 'express';
import {
  inviteCollaborator,
  acceptCollaboration,
  getProjectCollaborators
} from '../controllers/collaborationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/invite', inviteCollaborator);
router.put('/accept/:projectId', acceptCollaboration);
router.get('/project/:projectId', getProjectCollaborators);

export default router;