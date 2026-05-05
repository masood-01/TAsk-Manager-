import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect, isProjectMember } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMember);
router.delete('/:id/members', removeMember);

export default router;
