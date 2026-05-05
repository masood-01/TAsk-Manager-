import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import ProjectForm from '../components/ProjectForm';
import './Projects.css';

function Projects() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProjectCreated = () => {
    setShowForm(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        fetchProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="projects-page">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="projects-content">
        <div className="projects-header">
          <h1>Projects</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && <ProjectForm onSuccess={handleProjectCreated} />}

        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="no-projects">No projects yet. Create one to get started!</p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="project-card"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <p>{project.description || 'No description'}</p>
                <div className="project-footer">
                  <span className={`status ${project.status}`}>{project.status}</span>
                  <span className="members-count">{project.members.length} members</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
