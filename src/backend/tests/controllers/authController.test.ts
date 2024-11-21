import { describe, it, expect, vi } from 'vitest';
import { signup } from '../../controllers/authController';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

// Mock external dependencies
vi.mock('../../models/User');
vi.mock('bcrypt');

describe('authController - signup', () => {
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
