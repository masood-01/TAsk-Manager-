import React, { useState } from 'react';
import { projectAPI } from '../utils/api';
import './MemberList.css';

function MemberList({ projectId, project, onMembersUpdated }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('member');

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Please enter user ID');
      return;
    }

    try {
      await projectAPI.addMember(projectId, { userId, role });
      setUserId('');
      setRole('member');
      setShowAddMember(false);
      onMembersUpdated();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await projectAPI.removeMember(projectId, { userId: memberId });
        onMembersUpdated();
      } catch (error) {
        alert('Failed to remove member');
      }
    }
  };

  return (
    <div className="member-list-container">
      <div className="add-member-section">
        <button
          className="btn-primary"
          onClick={() => setShowAddMember(!showAddMember)}
        >
          {showAddMember ? 'Cancel' : '+ Add Member'}
        </button>

        {showAddMember && (
          <form className="add-member-form" onSubmit={handleAddMember}>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Add Member</button>
          </form>
        )}
      </div>

      <div className="members-grid">
        {project.members.map((member) => (
          <div key={member.user._id} className="member-card">
            <div>
              <h4>{member.user.name}</h4>
              <p>{member.user.email}</p>
              <span className={`role ${member.role}`}>{member.role}</span>
            </div>
            <button
              className="btn-remove"
              onClick={() => handleRemoveMember(member.user._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;
