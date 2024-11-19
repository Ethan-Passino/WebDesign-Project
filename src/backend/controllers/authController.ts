import { Request, Response } from 'express';
import User from '../models/User.Model';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

export const signup = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a token that includes the user's ID (optional, if you need secure JWT handling)
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Send both token and userId in the response
        res.status(200).json({ message: 'Login successful', userId: user._id, token });
    } catch (error) {
        res.status(500).json({ error: 'Login error' });
    }
};