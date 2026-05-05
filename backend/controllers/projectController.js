import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = new Project({
      name,
      description,
      dueDate,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }],
    });

    await project.save();
    await project.populate(['owner', 'members.user']);

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    // Get projects where user is member or owner
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
      ],
    })
      .populate('owner')
      .populate('members.user')
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner')
      .populate('members.user');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner can update
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { name, description, status, dueDate } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;

    await project.save();
    await project.populate(['owner', 'members.user']);

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete all tasks in project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Check if user already a member
    if (project.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({ user: userId, role: role || 'member' });
    await project.save();
    await project.populate(['owner', 'members.user']);

    res.status(200).json({
      message: 'Member added successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner can remove members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }

    project.members = project.members.filter(m => m.user.toString() !== userId);
    await project.save();
    await project.populate(['owner', 'members.user']);

    res.status(200).json({
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
