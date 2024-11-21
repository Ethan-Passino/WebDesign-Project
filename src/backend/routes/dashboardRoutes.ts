import express from 'express';
import { 
    getAllDashboards, 
    createDashboard, 
    getDashboardById, 
    updateDashboard, 
    deleteDashboard 
} from '../controllers/dashboardController';

const router = express.Router();

/**
 * @route   GET /dashboards
 * @desc    Retrieve all dashboards for the current user
 *          Includes dashboards created by the user or where the user is invited
 * @access  Private
 */
router.get('/', getAllDashboards);

/**
 * @route   POST /dashboards
 * @desc    Create a new dashboard with a name, description, and creator
 * @access  Private
 */
router.post('/', createDashboard);

/**
 * @route   GET /dashboards/:id
 * @desc    Retrieve a single dashboard by its ID
 * @access  Private
 */
router.get('/:id', getDashboardById);

/**
 * @route   PATCH /dashboards/:id
 * @desc    Update a dashboard's name, description, or invited users
 * @access  Private
 */
router.patch('/:id', updateDashboard);

/**
 * @route   DELETE /dashboards/:id
 * @desc    Delete a dashboard by its ID
 * @access  Private
 */
router.delete('/:id', deleteDashboard);

export default router;
