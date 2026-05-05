import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await taskAPI.getDashboard();
        setStats(response.data.stats);
        setTasks(response.data.tasks);
        setOverdueTasks(response.data.overdueTasks);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats?.total || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">To Do</div>
            <div className="stat-value">{stats?.todo || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats?.inProgress || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats?.completed || 0}</div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{stats?.overdue || 0}</div>
          </div>
        </div>

        {overdueTasks.length > 0 && (
          <div className="overdue-section">
            <h2>⚠️ Overdue Tasks</h2>
            <div className="task-list">
              {overdueTasks.map((task) => (
                <div key={task._id} className="task-item overdue-item">
                  <div>
                    <h4>{task.title}</h4>
                    <p>{task.project?.name}</p>
                  </div>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="recent-tasks-section">
          <h2>Recent Tasks</h2>
          <div className="task-list">
            {tasks.slice(0, 10).map((task) => (
              <div key={task._id} className="task-item">
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.project?.name}</p>
                </div>
                <span className={`status ${task.status}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
