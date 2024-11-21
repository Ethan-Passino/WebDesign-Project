import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signup, login, verifyToken, updateUser, deleteUser } from '../../controllers/authController';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// Mock external dependencies
vi.mock('../../models/User');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('authController', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('signup', () => {
        it('should return 400 if the username already exists', async () => {
            const req = { body: { username: 'testuser', password: 'password123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(User.findOne).mockResolvedValueOnce({ username: 'testuser' });

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
        });

        it('should hash the password and save the user for a successful signup', async () => {
            const req = { body: { username: 'newuser', password: 'password123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(User.findOne).mockResolvedValueOnce(null);
            vi.mocked(bcrypt.hash).mockResolvedValueOnce('hashedPassword');
            vi.mocked(User.prototype.save).mockResolvedValueOnce({
                username: 'newuser',
                password: 'hashedPassword',
            });

            await signup(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', expect.any(Number));
            expect(User.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
        });

        it('should return 500 for unexpected errors', async () => {
            const req = { body: { username: 'erroruser', password: 'password123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(User.findOne).mockRejectedValueOnce(new Error('Database error'));

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error creating user' });
        });
    });

    describe('login', () => {
        it('should return 401 if the user does not exist or the password is invalid', async () => {
            const req = { body: { username: 'nonexistentuser', password: 'password123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(User.findOne).mockResolvedValueOnce(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });

        it('should generate a JWT token for valid credentials', async () => {
            const req = { body: { username: 'validuser', password: 'password123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            const mockUser = { _id: 'userId123', password: 'hashedPassword' };
            vi.mocked(User.findOne).mockResolvedValueOnce(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValueOnce(true);
            vi.mocked(jwt.sign).mockReturnValueOnce('testToken');

            await login(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith({ userId: 'userId123' }, 'your_jwt_secret', { expiresIn: '1h' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                userId: 'userId123',
                token: 'testToken',
            });
        });
    });

    describe('verifyToken', () => {
        it('should return 401 if no token is provided', async () => {
            const req = { headers: { authorization: '' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            await verifyToken(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        });

        it('should return 403 for an invalid token', async () => {
            const req = { headers: { authorization: 'Bearer invalidToken' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(jwt.verify).mockImplementationOnce((_token, _secret, callback) => {
                callback(new Error('Invalid token'));
            });

            await verifyToken(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        });

        it('should return 200 for a valid token', async () => {
            const req = { headers: { authorization: 'Bearer validToken' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(jwt.verify).mockImplementationOnce((_token, _secret, callback) => {
                callback(null);
            });

            await verifyToken(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token is valid' });
        });
    });

    describe('updateUser', () => {
        it('should update the username and/or password', async () => {
            const req = { body: { userId: 'userId123', newUsername: 'newuser', newPassword: 'newpassword' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            const mockUser = { username: 'olduser', password: 'oldpassword', save: vi.fn() };
            vi.mocked(User.findById).mockResolvedValueOnce(mockUser);
            vi.mocked(User.findOne).mockResolvedValueOnce(null);
            vi.mocked(bcrypt.hash).mockResolvedValueOnce('hashedNewPassword');

            await updateUser(req, res);

            expect(User.findById).toHaveBeenCalledWith('userId123');
            expect(mockUser.username).toBe('newuser');
            expect(mockUser.password).toBe('hashedNewPassword');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
        });

        it('should return 404 if the user does not exist', async () => {
            const req = { body: { userId: 'userId123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(User.findById).mockResolvedValueOnce(null);

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('deleteUser', () => {
        it('should delete the user', async () => {
            const req = { body: { userId: 'userId123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            const mockUser = { _id: 'userId123', username: 'testuser' };
            vi.mocked(User.findByIdAndDelete).mockResolvedValueOnce(mockUser);

            await deleteUser(req, res);

            expect(User.findByIdAndDelete).toHaveBeenCalledWith('userId123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });

        it('should return 404 if the user does not exist', async () => {
            const req = { body: { userId: 'userId123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;

            vi.mocked(User.findByIdAndDelete).mockResolvedValueOnce(null);

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });
});
