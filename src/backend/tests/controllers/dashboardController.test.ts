import { describe, it, expect, vi, beforeEach, beforeAll, afterAll} from 'vitest';
import mongoose from 'mongoose';
import { getAllDashboards, createDashboard, getDashboardById } from '../../controllers/dashboardController';
import Dashboard from '../../models/Dashboard';
import { Request, Response } from 'express';

vi.mock('../../models/Dashboard'); // Mock the Dashboard model

describe('dashboardController', () => {
    
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore(); // Restore console.error after tests
  });

  describe('getAllDashboards', () => {
    it('should fetch all dashboards for a user', async () => {
      const req = { query: { userId: '12345' } } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      const mockDashboards = [
        { name: 'Dashboard 1', creatorId: '12345' },
        { name: 'Dashboard 2', invitedUsers: ['12345'] },
      ];

      vi.mocked(Dashboard.find).mockResolvedValueOnce(mockDashboards);

      await getAllDashboards(req, res);

      expect(Dashboard.find).toHaveBeenCalledWith({
        $or: [
          { creatorId: '12345' },
          { invitedUsers: '12345' },
        ],
      });
      expect(res.json).toHaveBeenCalledWith(mockDashboards);
    });

    it('should return 500 on error', async () => {
      const req = { query: { userId: '12345' } } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(Dashboard.find).mockRejectedValueOnce(new Error('Database error'));

      await getAllDashboards(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('createDashboard', () => {
    it('should create a new dashboard', async () => {
      const req = {
        body: { name: 'Test Dashboard', description: 'Test Description', creatorId: 'creator123' },
      } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      const mockSavedDashboard = { id: '67890', name: 'Test Dashboard', description: 'Test Description', creatorId: 'creator123' };

      vi.mocked(Dashboard.prototype.save).mockResolvedValueOnce(mockSavedDashboard);

      await createDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedDashboard);
    });

    it('should return 400 if name or creatorId is missing', async () => {
      const req = { body: { name: '', description: 'Test Description' } } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      await createDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name and creator ID are required' });
    });

    it('should return 500 on error', async () => {
      const req = {
        body: { name: 'Test Dashboard', description: 'Test Description', creatorId: 'creator123' },
      } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(Dashboard.prototype.save).mockRejectedValueOnce(new Error('Save failed'));

      await createDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create dashboard. Please try again later.' });
    });
  });

  describe('getDashboardById', () => {
    it('should fetch a dashboard by ID', async () => {
      const req = { params: { id: 'dashboard123' } } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      const mockDashboard = { id: 'dashboard123', name: 'Test Dashboard' };

      vi.mocked(Dashboard.findById).mockResolvedValueOnce(mockDashboard);

      await getDashboardById(req, res);

      expect(Dashboard.findById).toHaveBeenCalledWith('dashboard123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDashboard);
    });

    it('should return 404 if the dashboard is not found', async () => {
      const req = { params: { id: 'invalidDashboard' } } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(Dashboard.findById).mockResolvedValueOnce(null);

      await getDashboardById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Dashboard not found' });
    });

    it('should return 500 on error', async () => {
      const req = { params: { id: 'dashboard123' } } as unknown as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response;

      vi.mocked(Dashboard.findById).mockRejectedValueOnce(new Error('Database error'));

      await getDashboardById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
