import { Request, Response } from 'express';
import Panel from '../models/Panel';

/** @desc initially designing this to get all panels
 * (may or may not need to redo this to get single panels)
 *
 * @param req - dashboardID
 * @param res
 */
export const getAllPanels = async (req: Request, res: Response) => {
    try {
        const dashboardId = req.query.dashboardId as string;

        if (!dashboardId) {
            return res.status(400).json({ success: false, error: 'dashboardId is required' });
        }

        const panels = await Panel.find({ parentDash: dashboardId }).populate('childTasks');
        res.status(200).json({ success: true, data: panels });
    } catch (error) {
        console.error('Error fetching panels:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch panels' });
    }
};

/** 
 * @desc Create a new panel 
 * @route POST /panels 
 */
export const createPanel = async (req: Request, res: Response) => {
    try {
        const { newName = '', dashId, creatorId } = req.body;

        if (!dashId || !creatorId) {
            return res.status(400).json({ error: 'Malformed createPanel request' });
        }

        const newPanel = new Panel({
            name: newName,
            parentDash: dashId,
            creatorId: creatorId,
            childTasks: []
        });
        const savedPanel = await newPanel.save();
        res.status(200).json(savedPanel);
    } catch (error) {
        console.error('Issue with creating panel:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

/** 
 * @desc Get a specific panel by its ID 
 * @route GET /panels/:id 
 */
export const getPanelById = async (req: Request, res: Response) => {
    try {
        const panel = await Panel.findById(req.params.id);
        if (!panel) return res.status(404).json({ message: `Panel ${req.params.id} not found` });
        res.json(panel);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

/** 
 * @desc Update a panel's name 
 * @route PUT /panels/:id 
 */
export const updatePanel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Panel name is required' });
        }

        const updatedPanel = await Panel.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedPanel) {
            return res.status(404).json({ message: `Panel ${id} not found` });
        }

        res.status(200).json({ success: true, data: updatedPanel });
    } catch (error) {
        console.error('Error updating panel:', error);
        res.status(500).json({ error: 'Failed to update panel' });
    }
};

/** 
 * @desc Delete a panel 
 * @route DELETE /panels/:id 
 */
export const deletePanel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedPanel = await Panel.findByIdAndDelete(id);

        if (!deletedPanel) {
            return res.status(404).json({ message: `Panel ${id} not found` });
        }

        res.status(200).json({ success: true, message: `Panel ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting panel:', error);
        res.status(500).json({ error: 'Failed to delete panel' });
    }
};
