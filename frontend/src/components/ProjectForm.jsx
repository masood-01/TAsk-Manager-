import React, { useState } from 'react';
import { projectAPI } from '../utils/api';
import './Forms.css';

function ProjectForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
      await projectAPI.create(formData);
      onSuccess();
      setFormData({ name: '', description: '', dueDate: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Create New Project</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Project Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter project name"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter project description"
          rows="3"
        />
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

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}

export default ProjectForm;
