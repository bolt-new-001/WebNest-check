import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  promoteUser
} from '../controllers/userController.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', checkPermission('users', 'read'), getAllUsers);
router.get('/stats', checkPermission('users', 'read'), getUserStats);
router.get('/:id', checkPermission('users', 'read'), getUser);
router.put('/:id', checkPermission('users', 'update'), updateUser);
router.delete('/:id', checkPermission('users', 'delete'), deleteUser);
router.put('/:id/promote', checkPermission('users', 'update'), promoteUser);

export default router;