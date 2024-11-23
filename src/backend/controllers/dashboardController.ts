import { Request, Response } from 'express';
import Dashboard from '../models/Dashboard';
import User from '../models/User';
import mongoose from 'mongoose';

/**
 * @route   GET /dashboards
 * @desc    Fetch all dashboards associated with a specific user, 
 *          including those created by the user or where the user is invited.
 * @access  Private
 */
export const getAllDashboards = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; // Extract user ID from query parameters

        const dashboards = await Dashboard.find({
            $or: [
                { creatorId: userId },       // Include dashboards where the user is the creator
                { invitedUsers: userId }     // Include dashboards where the user is an invited participant
            ]
        });
        res.json(dashboards);
    } catch (error) {
        console.error('Error fetching dashboards:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error occurred" });
    }
};

/**
 * @route   POST /dashboards
 * @desc    Create a new dashboard with the provided details, such as name, description, and creator ID.
 * @access  Private
 */
export const createDashboard = async (req: Request, res: Response) => {
    try {
        const { name, description, creatorId } = req.body;

        // Validate required fields
        if (!name || !creatorId) {
            return res.status(400).json({ error: 'Dashboard name and creator ID are required.' });
        }

        const newDashboard = new Dashboard({
            name,
            description,
            creatorId,
        });

        const savedDashboard = await newDashboard.save();
        res.status(201).json(savedDashboard); // Respond with the created dashboard
    } catch (error) {
        console.error('Error creating dashboard:', error);
        res.status(500).json({ error: 'Failed to create the dashboard. Please try again later.' });
    }
};

/**
 * @route   GET /dashboards/:id
 * @desc    Retrieve a specific dashboard by its unique ID.
 * @access  Private
 */
export const getDashboardById = async (req: Request, res: Response) => {
    try {
        const dashboard = await Dashboard.findById(req.params.id); // Find dashboard by ID
        if (!dashboard) return res.status(404).json({ message: "Dashboard not found." });
        res.status(200).json(dashboard); // Respond with the retrieved dashboard
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred." });
    }
};

/**
 * @route   PATCH /dashboards/:id
 * @desc    Update a dashboard's details, such as name, description, or invited users, by its unique ID.
 * @access  Private
 */
export const updateDashboard = async (req: Request, res: Response) => {
    try {
        const { name, description, invitedUsers } = req.body;
        const dashboardId = req.params.id;

        // Find the dashboard by ID
        const dashboard = await Dashboard.findById(dashboardId);

        if (!dashboard) return res.status(404).json({ message: "Dashboard not found." });

        // Update only provided fields
        if (name) dashboard.name = name;
        if (description) dashboard.description = description;
        if (invitedUsers) dashboard.invitedUsers = invitedUsers;

        const updatedDashboard = await dashboard.save(); // Save changes
        res.status(200).json(updatedDashboard); // Respond with updated dashboard
    } catch (error) {
        console.error('Error updating dashboard:', error);
        res.status(500).json({ error: 'Failed to update the dashboard. Please try again later.' });
    }
};

/**
 * @route   DELETE /dashboards/:id
 * @desc    Permanently delete a dashboard by its unique ID.
 * @access  Private
 */
export const deleteDashboard = async (req: Request, res: Response) => {
    try {
        const dashboardId = req.params.id;

        // Attempt to delete the dashboard by ID
        const deletedDashboard = await Dashboard.findByIdAndDelete(dashboardId);

        if (!deletedDashboard) {
            return res.status(404).json({ message: "Dashboard not found." });
        }

        res.status(200).json({ message: "Dashboard deleted successfully." }); // Confirm deletion
    } catch (error) {
        console.error('Error deleting dashboard:', error);
        res.status(500).json({ error: 'Failed to delete the dashboard. Please try again later.' });
    }
};

/**
 * @route   POST /dashboards/:id/invite
 * @desc    Invite a user to a dashboard
 * @access  Private
 */
export const inviteUserToDashboard = async (req: Request, res: Response) => {
    const { id } = req.params; // Dashboard ID
    const { name } = req.body; // User to invite

    try {
        const dashboard = await Dashboard.findById(id);
        if (!dashboard) {
            return res.status(404).json({ error: 'Dashboard not found' });
        }
        const user = await User.findOne({ username: name });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        if (dashboard.creatorId.toString() === user._id.toString()) {
            return res.status(400).json({ error: "Cannot invite the dashboard owner." });
        }

        if (dashboard.invitedUsers?.includes(user._id.toString())) {
            return res.status(400).json({ error: 'User is already invited.' });
        }

        dashboard.invitedUsers = dashboard.invitedUsers || [];
        dashboard.invitedUsers.push(user._id.toString());

        await dashboard.save();

        res.status(200).json({ message: `User ${name} invited successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Error inviting user to the dashboard' });
    }
};

/**
 * @route   PUT /dashboards/:id
 * @desc    Modify a dashboard's name and description
 * @access  Private
 */
export const modifyDashboardDetails = async (req: Request, res: Response) => {
    const { id } = req.params; // Dashboard ID
    const { name, description } = req.body;

    try {
        const dashboard = await Dashboard.findById(new mongoose.Types.ObjectId(id));

        if (!dashboard) {
            return res.status(404).json({ error: 'Dashboard not found' });
        }

        dashboard.name = name || dashboard.name;
        dashboard.description = description || dashboard.description;

        await dashboard.save();

        res.status(200).json({ message: 'Dashboard updated successfully', dashboard });
    } catch (error) {
        res.status(500).json({ error: 'Error updating dashboard details' });
    }
};