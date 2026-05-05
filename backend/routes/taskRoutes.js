import express from 'express';
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  getDashboard,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/dashboard/stats', getDashboard);
router.post('/:projectId', createTask);
router.get('/project/:projectId', getProjectTasks);
router.get('/:taskId', getTaskById);
router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId/assign', assignTask);

export default router;
