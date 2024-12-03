import { Router } from 'express';
import { addPoints, spendPoints, getPoints } from '../controllers/pointsController';

const router = Router();

/**
 * @route   POST /points/add-points
 * @desc    Add points to a user's account
 * @access  Private
 */
router.post('/add-points', addPoints);

/**
 * @route   POST /points/spend-points
 * @desc    Deduct points from a user's account
 * @access  Private
 */
router.post('/spend-points', spendPoints);

/**
 * @route   GET /points/:userId
 * @desc    Retrieve the current points for a specific user
 * @access  Private
 */
router.get('/:userId', getPoints);

export default router;
