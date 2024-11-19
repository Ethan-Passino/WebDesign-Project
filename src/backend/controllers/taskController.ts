import {Request, Response} from 'express';
import Task from '../models/Task';


/**
 *
 * @param req
 * @param res
 */
export const getTasks = async (req: Request, res: Response) => {
    try{
        const panelId = req.query.panelId as string;
        const tasks = await Task.find({

        })
    }catch(error){
        console.error('Error fetching tasks: ', error)
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
