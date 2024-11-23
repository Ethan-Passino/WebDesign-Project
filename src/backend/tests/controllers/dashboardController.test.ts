import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import {
    getAllDashboards,
    createDashboard,
    getDashboardById,
    updateDashboard,
    deleteDashboard,
    inviteUserToDashboard,
    modifyDashboardDetails
} from '../../controllers/dashboardController';
import Dashboard from '../../models/Dashboard';
import User from '../../models/User';
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
            expect(res.json).toHaveBeenCalledWith({ error: 'Dashboard name and creator ID are required.' });
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
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create the dashboard. Please try again later.' });
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
            expect(res.json).toHaveBeenCalledWith({ message: 'Dashboard not found.' });
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

    describe('updateDashboard', () => {
      it('should update a dashboard by ID', async () => {
          const req = {
              params: { id: 'dashboard123' },
              body: { name: 'Updated Name', description: 'Updated Description' },
          } as unknown as Request;
          const res = {
              json: vi.fn(),
              status: vi.fn().mockReturnThis(),
          } as unknown as Response;
  
          const mockDashboard = {
              id: 'dashboard123',
              name: 'Old Name',
              description: 'Old Description',
              save: vi.fn().mockResolvedValueOnce({
                  id: 'dashboard123',
                  name: 'Updated Name',
                  description: 'Updated Description',
              }),
          };
  
          vi.mocked(Dashboard.findById).mockResolvedValueOnce(mockDashboard);
  
          await updateDashboard(req, res);
  
          expect(Dashboard.findById).toHaveBeenCalledWith('dashboard123');
          expect(mockDashboard.save).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
              id: 'dashboard123',
              name: 'Updated Name',
              description: 'Updated Description',
          });
      });
  
      it('should return 404 if the dashboard is not found', async () => {
          const req = { params: { id: 'nonexistentDashboard' }, body: {} } as unknown as Request;
          const res = {
              json: vi.fn(),
              status: vi.fn().mockReturnThis(),
          } as unknown as Response;
  
          vi.mocked(Dashboard.findById).mockResolvedValueOnce(null);
  
          await updateDashboard(req, res);
  
          expect(Dashboard.findById).toHaveBeenCalledWith('nonexistentDashboard');
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Dashboard not found.' });
      });
  
      it('should return 500 on error', async () => {
          const req = { params: { id: 'dashboard123' }, body: {} } as unknown as Request;
          const res = {
              json: vi.fn(),
              status: vi.fn().mockReturnThis(),
          } as unknown as Response;
  
          vi.mocked(Dashboard.findById).mockRejectedValueOnce(new Error('Database error'));
  
          await updateDashboard(req, res);
  
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update the dashboard. Please try again later.' });
      });
  });
  

    describe('deleteDashboard', () => {
        it('should delete a dashboard by ID', async () => {
            const req = { params: { id: 'dashboard123' } } as unknown as Request;
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;

            const mockDashboard = { id: 'dashboard123', name: 'Test Dashboard' };
            vi.mocked(Dashboard.findByIdAndDelete).mockResolvedValueOnce(mockDashboard);

            await deleteDashboard(req, res);

            expect(Dashboard.findByIdAndDelete).toHaveBeenCalledWith('dashboard123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Dashboard deleted successfully.' });
        });

        it('should return 404 if the dashboard is not found', async () => {
            const req = { params: { id: 'nonexistentDashboard' } } as unknown as Request;
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;

            vi.mocked(Dashboard.findByIdAndDelete).mockResolvedValueOnce(null);

            await deleteDashboard(req, res);

            expect(Dashboard.findByIdAndDelete).toHaveBeenCalledWith('nonexistentDashboard');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Dashboard not found.' });
        });

        it('should return 500 on error', async () => {
            const req = { params: { id: 'dashboard123' } } as unknown as Request;
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;

            vi.mocked(Dashboard.findByIdAndDelete).mockRejectedValueOnce(new Error('Database error'));

            await deleteDashboard(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete the dashboard. Please try again later.' });
        });
    });

    describe('inviteUserToDashboard', () => {
        it('should invite a user to a dashboard successfully', async () => {
            const req = {
                params: { id: 'dashboard123' },
                body: { name: 'TestUser' },
            } as unknown as Request;
    
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;
    
            const mockDashboard = {
                id: 'dashboard123',
                creatorId: 'creator123',
                invitedUsers: [],
                save: vi.fn().mockResolvedValueOnce({}),
            };
    
            const mockUser = { _id: 'user123', username: 'TestUser' };
    
            vi.spyOn(Dashboard, 'findById').mockResolvedValueOnce(mockDashboard);
            vi.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
    
            await inviteUserToDashboard(req, res);
    
            expect(Dashboard.findById).toHaveBeenCalledWith('dashboard123');
            expect(User.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
            expect(mockDashboard.invitedUsers).toContain('user123');
            expect(mockDashboard.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User TestUser invited successfully.' });
        });
    
        it('should return 404 if the dashboard is not found', async () => {
            const req = { params: { id: 'invalidDashboard' }, body: { name: 'TestUser' } } as unknown as Request;
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;
    
            vi.spyOn(Dashboard, 'findById').mockResolvedValueOnce(null);
    
            await inviteUserToDashboard(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Dashboard not found' });
        });
    
        it('should return 404 if the user does not exist', async () => {
            const req = { params: { id: 'dashboard123' }, body: { name: 'NonExistentUser' } } as unknown as Request;
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;
    
            const mockDashboard = { id: 'dashboard123', invitedUsers: [], save: vi.fn() };
    
            vi.spyOn(Dashboard, 'findById').mockResolvedValueOnce(mockDashboard);
            vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);
    
            await inviteUserToDashboard(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User does not exist' });
        });
    
        it('should return 500 on error', async () => {
            const req = { params: { id: 'dashboard123' }, body: { name: 'TestUser' } } as unknown as Request;
            const res = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as Response;
    
            vi.spyOn(Dashboard, 'findById').mockRejectedValueOnce(new Error('Database error'));
    
            await inviteUserToDashboard(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error inviting user to the dashboard' });
        });
    });
    
});