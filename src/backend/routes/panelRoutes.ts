import express from 'express';
import {
    createPanel,
    getPanelById,
    getAllPanels,
    updatePanel,
    deletePanel,
} from '../controllers/panelController';

const router = express.Router();

router.get('/', getAllPanels);
router.get('/:id', getPanelById);
router.post('/', createPanel);
router.put('/:id', updatePanel);
router.delete('/:id', deletePanel);

export default router;
