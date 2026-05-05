import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const { projectId } = req.params;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      project: projectId,
      creator: req.user.id,
    });

    await task.save();
    await task.populate(['assignee', 'creator']);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId })
      .populate('assignee')
      .populate('creator')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assignee')
      .populate('creator')
      .populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, assignee, dueDate } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    await task.populate(['assignee', 'creator']);

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only creator or project admin can delete
    const project = await Project.findById(task.project);
    const isProjectAdmin = project.owner.toString() === req.user.id ||
                           project.members.some(m => m.user.toString() === req.user.id && m.role === 'admin');

    if (task.creator.toString() !== req.user.id && !isProjectAdmin && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assignee = userId;
    await task.save();
    await task.populate(['assignee', 'creator']);

    res.status(200).json({
      message: 'Task assigned successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    // Get user's tasks
    const myTasks = await Task.find({
      $or: [
        { assignee: req.user.id },
        { creator: req.user.id },
      ],
    })
      .populate('project')
      .populate('assignee')
      .populate('creator');

    const stats = {
      total: myTasks.length,
      todo: myTasks.filter(t => t.status === 'todo').length,
      inProgress: myTasks.filter(t => t.status === 'in-progress').length,
      completed: myTasks.filter(t => t.status === 'completed').length,
      overdue: myTasks.filter(t => t.isOverdue).length,
    };

    const overdueTasks = myTasks.filter(t => t.isOverdue);

    res.status(200).json({
      stats,
      tasks: myTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
