import { Request, Response } from 'express';
import User from '../models/User';

export const addPoints = async (req: Request, res: Response) => {
    const { userId, pointsToAdd } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.points += pointsToAdd; // Add points to the user
        await user.save();

        res.status(200).json({ message: `${pointsToAdd} points added.`, points: user.points });
    } catch (error) {
        res.status(500).json({ error: 'Error adding points' });
    }
};

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
        res.status(500).json({ error: 'Error spending points' });
    }
};

