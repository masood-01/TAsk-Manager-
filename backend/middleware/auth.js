import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    next();
  };
};

// Check if user is project member or admin
export const isProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const Project = (await import('../models/Project.js')).default;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(m => m.user.toString() === req.user.id) || 
                     project.owner.toString() === req.user.id;
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
