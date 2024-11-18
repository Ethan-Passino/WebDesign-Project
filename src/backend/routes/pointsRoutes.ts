import { Router } from 'express';
import { addPoints, spendPoints } from '../controllers/pointsController';

const router = Router();

router.post('/add-points', addPoints);
router.post('/spend-points', spendPoints);

export default router;
