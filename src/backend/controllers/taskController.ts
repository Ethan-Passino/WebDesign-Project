import { Request, Response } from 'express';
import Task from '../models/Task';
import Panel from '../models/Panel';

/**
 * @desc Fetch detailed information about a specific task by its ID
 * @route GET /tasks/:id
 * @param req - Request object containing the task ID
 * @param res - Response object containing task details or error message
 */
export const getTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, error: 'Task ID is required' });
        }

        const task = await Task.findById(id)
            .populate({
                path: 'subtasks',
                populate: { path: 'subtasks' }, // Recursive population for nested subtasks
            })
            .populate('parentPanel'); // Include the panel associated with the task

        if (!task) {
            return res.status(404).json({ success: false, error: `Task with ID ${id} not found` });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch task' });
    }
};

/** 
 * @desc Get all tasks in a panel 
 * @route GET /tasks/panel/:panelId 
 */
export const getTasksInPanel = async (req: Request, res: Response) => {
    try {
        const { panelId } = req.params;
        if (!panelId) {
            return res.status(400).json({ success: false, error: 'panelId is required' });
        }

        const tasks = await Task.find({ parentPanel: panelId })
            .populate({
                path: 'subtasks',
                populate: { path: 'subtasks' },
            });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
};

/** 
 * @desc Create a new task 
 * @route POST /tasks 
 */
export const createTask = async (req: Request, res: Response) => {
    try {
        const { panelId, newName, creatorId, description } = req.body;

        if (!panelId || !creatorId || !newName) {
            return res.status(400).json({ error: 'Malformed createTask request' });
        }

        const newTask = new Task({
            name: newName,
            parentPanel: panelId,
            creatorId: creatorId,
            description: description,
        });

        const savedTask = await newTask.save();
        res.status(200).json(savedTask);
    } catch (error) {
        console.error('Issue with creating task:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/** 
 * @desc Update a task's details 
 * @route PUT /tasks/:id 
 */
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: `Task ${id} not found` });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

/** 
 * @desc Delete a task 
 * @route DELETE /tasks/:id 
 */
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: `Task ${id} not found` });
        }

        res.status(200).json({ success: true, message: `Task ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
