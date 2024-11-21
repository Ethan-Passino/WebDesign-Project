import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

/**
 * @route   POST /auth/signup
 * @desc    Register a new user with a unique username and hashed password
 * @access  Public
 */
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

/**
 * @route   POST /auth/login
 * @desc    Authenticate a user with their username and password, and return a JWT token
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', userId: user._id, token });
    } catch (error) {
        res.status(500).json({ error: 'Login error' });
    }
};

/**
 * @route   GET /auth/verify-token
 * @desc    Verify the validity of a JWT token
 * @access  Public
 */
export const verifyToken = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        return res.status(200).json({ message: 'Token is valid' });
    });
};

/**
 * @route   PUT /auth/update
 * @desc    Update a user's username and/or password
 * @access  Private
 */
export const updateUser = async (req: Request, res: Response) => {
    const { userId, newUsername, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (newUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            user.username = newUsername;
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

/**
 * @route   DELETE /auth/delete
 * @desc    Delete a user's account
 * @access  Private
 */
export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

/**
 * @route   GET /auth/profile/:id
 * @desc    Retrieve a user's profile (username)
 * @access  Private
 */
export const getUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};
