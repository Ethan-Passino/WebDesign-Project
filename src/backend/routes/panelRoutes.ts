import express from 'express';
import {createPanel, getPanelById,getAllPanels,updatePanel,deletePanel} from "../controllers/panelController";

const router = express.Router();

router.get('/panel', getAllPanels );
router.get('/panel:id', getPanelById);
router.post('/panel', createPanel);
router.put('/panel:id', updatePanel);
router.delete('/panel:id', deletePanel);

export default router;
