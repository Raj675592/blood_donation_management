import React, { useState, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setError('');
    try {
      setLoading(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId) => {
    setError('');
    setSuccess('');
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_BASE_URL}/api/admin/promote/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const message = 'User promoted to admin successfully';
   
        showToast(message, 'success');
        fetchUsers(); // Refresh the list
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError('Failed to promote user');
      console.error(error);
    }
  };

  const demoteUser = async (userId) => {
    setError('');
    setSuccess('');
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_BASE_URL}/api/admin/demote/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const message = 'User demoted to regular user successfully';
        showToast(message, 'success');
        fetchUsers(); // Refresh the list
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError('Failed to demote user');
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setError('');
    setSuccess('');
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const message = 'User deleted successfully';
        showToast(message, 'success');
        fetchUsers(); // Refresh the list
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError('Failed to delete user');
      console.error(error);
    }
  };

  useCallback(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bloodType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-section">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="section-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users by name, email, or blood type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={fetchUsers} className="btn btn-outline">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading users...</div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Blood Type</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="blood-type-badge">{user.bloodType || 'Not Set'}</span>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </button>
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => promoteUser(user._id)}
                          className="btn btn-sm btn-primary"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => demoteUser(user._id)}
                          className="btn btn-sm btn-warning"
                        >
                          Demote
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-row">
                  <strong>Name:</strong> {selectedUser.name}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="detail-row">
                  <strong>Blood Type:</strong> {selectedUser.bloodType || 'Not Set'}
                </div>
                <div className="detail-row">
                  <strong>Role:</strong> {selectedUser.role}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {selectedUser.phone || 'Not provided'}
                </div>
                <div className="detail-row">
                  <strong>Address:</strong> {selectedUser.address || 'Not provided'}
                </div>
                <div className="detail-row">
                  <strong>Registered:</strong> {new Date(selectedUser.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
