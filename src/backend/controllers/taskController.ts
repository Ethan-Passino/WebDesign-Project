import {Request, Response} from 'express';
import Task from '../models/Task';
import Panel from "../models/Panel";



/**
 * @desc gets an array of tasks by a panel ID
 * @param req - panel's ObjectID
 * @param res - array of tasks
 */
export const getTasksInPanel = async (req: Request, res: Response) => {
    try{
        const panelId = req.params.id;
        if (!panelId) res.status(400).json({message: 'panelId is required'});
        const tasks = await Task.find({panelId})
            .populate({
                path: 'subtasks',
                populate: {path: 'subtasks'} //recursive population for subtasks
            }).exec();
        res.status(200).json(tasks);
    }catch(error){
        console.error('Error fetching tasks: ', error)
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

/**
 *
 * @param req
 * @param res
 */
export const createTask = async (req: Request, res: Response) => {
    try {
        const {panelId} = req.params;
        const {newName = '', creatorId} = req.body;
        if(!panelId || !creatorId){
            return res.status(400).json({ error: 'Malformed createTask request'});
        }

        const newTask = new Task({
            name: newName,
            parentPanel: panelId,
            creatorId: creatorId,
        })

        const savedTask = await newTask.save();
        res.status(200).json(savedTask);
    } catch(error){
        console.error('issue with creating task: ', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}

/**
 * @desc gets an individual task by ID
 * @param req - individual ObjectID of task
 * @param res - json of individual task
 */

export const getTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate({
                path: 'subtasks',
                populate: {path: 'subtasks'} //recursive population for subtasks
            });
        if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

/**
 * @desc
 * @param req - { ObjectId of task to be updated, [completed], [description], [subtasks], [dueBy], [parentPanel] }
 * @param res
 */
export const updateTask = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const updates = req.body;
        const taskToUpdate = await Task.findById(id).populate("subtasks");
        if (!taskToUpdate) res.status(500).json({message: `Task ${req.params.id} not found`});

        const updatedTask = await Task.findByIdAndUpdate(id, updates, {new: true});

        res.status(200).json(updatedTask);
    } catch (error){
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }


};

/**
 *
 * @param req
 * @param res
 */
export const deleteTask = async (req: Request, res: Response) => {
    try{
        const taskToDelete = await Task.findByIdAndDelete(req.params.id);
        if(!taskToDelete) res.status(500).json({message: `Task ${req.params.id} not found and was not deleted`});
    } catch (error){
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
