import express from 'express';
import { 
    getAllDashboards, 
    createDashboard, 
    getDashboardById, 
    updateDashboard, 
    deleteDashboard,
    inviteUserToDashboard,
    modifyDashboardDetails
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
 * @route   PUT /dashboards/:id
 * @desc    Modify a dashboard's name and description
 * @access  Private
 */
router.put('/:id', modifyDashboardDetails);

/**
 * @route   GET /dashboards/:id
 * @desc    Retrieve a single dashboard by its ID
 * @access  Private
 */
router.get('/:id', getDashboardById);

/**
 * @route   DELETE /dashboards/:id
 * @desc    Delete a dashboard by its ID
 * @access  Private
 */
router.delete('/:id', deleteDashboard);

/**
 * @route   POST /dashboards/:id/invite
 * @desc    Invite a user to a dashboard
 * @access  Private
 */
router.post('/:id/invite', inviteUserToDashboard);


export default router;