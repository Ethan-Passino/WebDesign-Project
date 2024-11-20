import { Request, Response } from 'express';
import Dashboard from '../models/Dashboard';
import mongoose from 'mongoose';

// Get all dashboards
export const getAllDashboards = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; // Convert ObjectId to string

        const dashboards = await Dashboard.find({
            $or: [
                { creatorId: userId },       // Match userId with creatorId
                { invitedUsers: userId }     // Match userId with invitedUsers array
            ]
        });
        res.json(dashboards);
    } catch (error) {
        console.error('Error fetching dashboards:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};



// Create a new dashboard
export const createDashboard = async (req: Request, res: Response) => {
    try {
        const { name, description, creatorId } = req.body;

        // Validation
        if (!name || !creatorId) {
            return res.status(400).json({ error: 'Name and creator ID are required' });
        }

        const newDashboard = new Dashboard({
            name,
            description,
            creatorId,
        });

        const savedDashboard = await newDashboard.save();
        res.status(201).json(savedDashboard);
    } catch (error) {
        console.error('Error creating dashboard:', error);
        res.status(500).json({ error: 'Failed to create dashboard. Please try again later.' });
    }
};

// Get a single dashboard by ID
export const getDashboardById = async (req: Request, res: Response) => {
    try {
        const dashboard = await Dashboard.findById(req.params.id);
        if (!dashboard) return res.status(404).json({ message: "Dashboard not found" });
        res.status(200).json(dashboard);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
