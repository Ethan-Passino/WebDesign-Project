import { Router, Request, Response } from 'express';
import { signup, login } from '../controllers/authController';
import jwt from 'jsonwebtoken';

const router = Router();

// Route to handle user signup
router.post('/signup', signup);

// Route to handle user login
router.post('/login', login);

// Route to verify token
router.get('/verify-token', (req: Request, res: Response) => {
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
});

export default router;
