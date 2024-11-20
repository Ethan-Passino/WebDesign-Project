import express from 'express';
import {createTask, getTasksInPanel,getTask,updateTask,deleteTask} from "../controllers/taskController";

const router = express.Router();

router.get(`/task:id`,getTask);
router.post(`/task:id`, createTask);
router.put(`/task:id`, updateTask);
router.delete(`/task:id`, deleteTask);

export default router;