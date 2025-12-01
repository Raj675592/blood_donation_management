import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

function BloodRequestManagement() {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blood-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBloodRequests(data.bloodRequests);
      } else {
        console.error('Failed to fetch blood requests:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch blood requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    console.log(`Attempting to ${action} blood request:`, requestId);
    
    try {
      const url = `http://localhost:8001/api/blood-requests/${requestId}/${action}`;
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        const message = `Blood request ${action}ed successfully`;
        showToast(message, 'success');
        fetchBloodRequests(); // Refresh the list
      } else {
        const errorMsg = data.message || `Failed to ${action} blood request`;
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing blood request:`, error);
      const errorMsg = `Failed to ${action} blood request: ${error.message}`;
      showToast(errorMsg, 'error');
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = request.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.bloodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'status-confirmed';
      case 'rejected': return 'status-cancelled';
      case 'fulfilled': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'urgency-critical';
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      default: return 'urgency-high';
    }
  };

  return (
    <div className="management-section">
      <div className="section-header">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by patient name, email, or blood type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>
        <button onClick={fetchBloodRequests} className="btn btn-outline">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading blood requests...</div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Blood Type</th>
                <th>Units Needed</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Hospital</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>
                    <div>
                      <div className="patient-name">{request.patientName || request.userId?.name || 'Unknown'}</div>
                      <div className="patient-email">{request.userId?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <span className="blood-type-badge">{request.bloodType}</span>
                  </td>
                  <td>{request.unitsNeeded} units</td>
                  <td>
                    <span className={`urgency-badge ${getUrgencyColor(request.urgencyLevel)}`}>
                      {request.urgencyLevel || 'normal'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{request.hospitalName || 'Not specified'}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRequestAction(request._id, 'accept')}
                            className="btn btn-sm btn-success"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(request._id, 'reject')}
                            className="btn btn-sm btn-danger"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'accepted' && (
                        <span className="status-text">Awaiting fulfillment</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredRequests.length === 0 && !loading && (
        <div className="empty-state">
          <p>No blood requests found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default BloodRequestManagement;