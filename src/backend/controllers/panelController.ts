import {Request, Response} from 'express';
import Panel from '../models/Panel';

/**
 * initially designing this to get all panels
 * (may or may not need to redo this to get single panels)
*/
export const getAllPanels = async (req: Request, res: Response) => {
    try {
        const dashboardId = req.params.panelId as string;

        const panels = await Panel.find({ //keep eye on this
            parentDashboard: dashboardId
        });
        res.status(200).json({
            success: true,
            data: panels,
        });
    } catch(error){
        console.error('issue with fetching panel: ', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const createPanel = async (req: Request, res: Response) => {
    try {
        const newPanel = await Panel.create(req.body);

    } catch(error){
        console.error('issue with creating panel: ', error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const getPanelById = async (req: Request, res: Response) => {
    try{
        const panel = await Panel.findById(req.params.id);
        if (!panel) return res.status(404).json({message: "Panel "+ req.params.id + " not found"})
        res.json(panel);
    }catch(error){
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}