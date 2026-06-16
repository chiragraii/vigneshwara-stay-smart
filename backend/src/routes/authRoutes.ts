import { Router } from 'express';
import { signup, login, getProfile, verifyEmail } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { signupValidation, loginValidation, handleValidationErrors } from '../middleware/validators.js';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signupValidation, handleValidationErrors, signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', loginValidation, handleValidationErrors, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires authentication)
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email
 * @access  Private (requires authentication)
 */
router.post('/verify-email', authenticateToken, verifyEmail);

export default router;
