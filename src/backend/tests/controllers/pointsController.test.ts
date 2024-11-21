import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addPoints, spendPoints } from '../../controllers/pointsController';
import User from '../../models/User';
import { Request, Response } from 'express';

// Mock the User model
vi.mock('../../models/User');

describe('pointsController', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('addPoints', () => {
    it('should add points to a user', async () => {
      const req = { body: { userId: 'user123', pointsToAdd: 50 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const mockUser = { points: 100, save: vi.fn() };
      vi.mocked(User.findById).mockResolvedValueOnce(mockUser);

      await addPoints(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.points).toBe(150);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '50 points added.', points: 150 });
    });

    it('should return 404 if the user is not found', async () => {
      const req = { body: { userId: 'user123', pointsToAdd: 50 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(User.findById).mockResolvedValueOnce(null);

      await addPoints(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      const req = { body: { userId: 'user123', pointsToAdd: 50 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(User.findById).mockRejectedValueOnce(new Error('Database error'));

      await addPoints(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error adding points' });
    });
  });

  describe('spendPoints', () => {
    it('should spend points from a user', async () => {
      const req = { body: { userId: 'user123', pointsToSpend: 30 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const mockUser = { points: 100, save: vi.fn() };
      vi.mocked(User.findById).mockResolvedValueOnce(mockUser);

      await spendPoints(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.points).toBe(70);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '30 points spent.', points: 70 });
    });

    it('should return 404 if the user is not found', async () => {
      const req = { body: { userId: 'user123', pointsToSpend: 30 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(User.findById).mockResolvedValueOnce(null);

      await spendPoints(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 400 if user does not have enough points', async () => {
      const req = { body: { userId: 'user123', pointsToSpend: 200 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const mockUser = { points: 100, save: vi.fn() };
      vi.mocked(User.findById).mockResolvedValueOnce(mockUser);

      await spendPoints(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.points).toBe(100); // Points should remain unchanged
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not enough points' });
    });

    it('should return 500 on database error', async () => {
      const req = { body: { userId: 'user123', pointsToSpend: 30 } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      vi.mocked(User.findById).mockRejectedValueOnce(new Error('Database error'));

      await spendPoints(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error spending points' });
    });
  });
});
