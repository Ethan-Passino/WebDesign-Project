import express from 'express';
import {
    createTask,
    getTasksInPanel,
    getTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController';

const router = express.Router();

/**
 * @route   GET /tasks/panel/:panelId
 * @desc    Fetch all tasks associated with a specific panel
 */
router.get('/panel/:panelId', getTasksInPanel);

/**
 * @route   GET /tasks/:id
 * @desc    Fetch a specific task by its ID
 */
router.get('/:id', getTask);

/**
 * @route   POST /tasks
 * @desc    Create a new task
 */
router.post('/', createTask);

/**
 * @route   PUT /tasks/:id
 * @desc    Update a specific task by its ID
 */
router.put('/:id', updateTask);

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a specific task by its ID
 */
router.delete('/:id', deleteTask);

export default router;
