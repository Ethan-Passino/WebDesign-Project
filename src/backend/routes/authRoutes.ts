import { Router } from 'express';
import { signup, login, verifyToken, updateUser, deleteUser } from '../controllers/authController';

const router = Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /auth/login
 * @desc    Authenticate a user and return a JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /auth/verify-token
 * @desc    Verify the validity of a JWT token
 * @access  Public
 */
router.get('/verify-token', verifyToken);

/**
 * @route   PUT /auth/update
 * @desc    Update a user's username and/or password
 * @access  Private
 */
router.put('/update', updateUser);

/**
 * @route   DELETE /auth/delete
 * @desc    Delete a user's account
 * @access  Private
 */
router.delete('/delete', deleteUser);

export default router;
