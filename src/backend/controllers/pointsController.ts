import { Request, Response } from 'express';
import User from '../models/User';

/**
 * @route   POST /points/add
 * @desc    Add points to a user's account
 * @access  Private
 */
export const addPoints = async (req: Request, res: Response) => {
    const { userId, pointsToAdd } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.points += pointsToAdd; // Add points to the user
        await user.save();

        res.status(200).json({ message: `${pointsToAdd} points added.`, points: user.points });
    } catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ error: 'Error adding points' });
    }
};

/**
 * @route   POST /points/spend
 * @desc    Deduct points from a user's account
 * @access  Private
 */
export const spendPoints = async (req: Request, res: Response) => {
    const { userId, pointsToSpend } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.points < pointsToSpend) {
            return res.status(400).json({ error: 'Not enough points' });
        }

        user.points -= pointsToSpend; // Deduct points
        await user.save();

        res.status(200).json({ message: `${pointsToSpend} points spent.`, points: user.points });
    } catch (error) {
        console.error('Error spending points:', error);
        res.status(500).json({ error: 'Error spending points' });
    }
};

/**
 * @route   GET /points/:userId
 * @desc    Fetch the current points for a specific user
 * @access  Private
 */
export const getPoints = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ points: user.points });
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).json({ error: 'Error fetching points' });
    }
};
