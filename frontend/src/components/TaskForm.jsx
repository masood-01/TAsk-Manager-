import React, { useState } from 'react';
import { taskAPI } from '../utils/api';
import './Forms.css';

function TaskForm({ projectId, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await taskAPI.create(projectId, formData);
      onSuccess();
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Task Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}

export default TaskForm;
