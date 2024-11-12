// routes/dashboardRoutes.ts
import express from 'express';
import { getAllDashboards, createDashboard, getDashboardById } from '../controllers/dashboardController';

const router = express.Router();

router.get('/', getAllDashboards);
router.post('/', createDashboard);
router.get('/:id', getDashboardById);

export default router;
