import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, taskAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import MemberList from '../components/MemberList';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const projectResponse = await projectAPI.getById(id);
      setProject(projectResponse.data);

      const tasksResponse = await taskAPI.getByProject(id);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchProjectData();
  };

  const handleTaskUpdated = () => {
    fetchProjectData();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!project) {
    return <div className="loading">Project not found</div>;
  }

  return (
    <div className="project-detail-page">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="project-detail-content">
        <div className="project-header-detail">
          <button className="btn-back" onClick={() => navigate('/projects')}>
            ← Back
          </button>
          <h1>{project.name}</h1>
          <span className={`status ${project.status}`}>{project.status}</span>
        </div>

        {project.description && (
          <p className="project-description">{project.description}</p>
        )}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <div className="tasks-header">
              <h2>Tasks</h2>
              <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? 'Cancel' : '+ New Task'}
              </button>
            </div>

            {showTaskForm && (
              <TaskForm projectId={id} onSuccess={handleTaskCreated} />
            )}

            <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-section">
            <h2>Team Members</h2>
            <MemberList
              projectId={id}
              project={project}
              onMembersUpdated={fetchProjectData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
