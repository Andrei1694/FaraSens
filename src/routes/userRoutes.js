import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { userValidationSchema } from '../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(userValidationSchema.create), userController.createUser);
router.post('/login', validate(userValidationSchema.login), userController.login);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), userController.getUsers);
router.get('/:id', authenticate, authorize('ADMIN'), userController.getUserById);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(userValidationSchema.update), userController.updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), userController.deleteUser);

export default router;