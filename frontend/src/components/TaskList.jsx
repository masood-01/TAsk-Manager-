import React, { useState } from 'react';
import { taskAPI } from '../utils/api';
import './TaskList.css';

function TaskList({ tasks, onTaskUpdated }) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      onTaskUpdated();
    } catch (error) {
      alert('Failed to update task status');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    });
  };

  const handleSaveEdit = async (taskId) => {
    try {
      await taskAPI.update(taskId, editFormData);
      setEditingId(null);
      onTaskUpdated();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(taskId);
        onTaskUpdated();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks yet. Create one to get started!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className={`task-card ${task.status}`}>
          {editingId === task._id ? (
            <div className="task-edit-form">
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                placeholder="Task title"
              />
              <textarea
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, description: e.target.value })
                }
                placeholder="Task description"
              />
              <select
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, status: e.target.value })
                }
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="task-edit-actions">
                <button
                  className="btn-save"
                  onClick={() => handleSaveEdit(task._id)}
                >
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-content">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                {task.dueDate && (
                  <p className="due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="task-meta">
                <select
                  className={`status-select ${task.status}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <span className={`priority ${task.priority}`}>{task.priority}</span>
              </div>
              <div className="task-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
