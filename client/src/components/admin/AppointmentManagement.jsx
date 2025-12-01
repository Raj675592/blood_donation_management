import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';  
  const fetchAppointments = async () => {
    setError('');
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch appointments');
      showToast('Failed to fetch appointments', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;
    setError('');
    setSuccess('');
    try {
      let endpoint = `${API_BASE_URL}/api/appointments/${appointmentId}`;
      let method = 'PUT';

      // Use specific endpoints for each action
      if (newStatus === 'completed') {
        endpoint += '/complete';
      } else if (newStatus === 'cancelled') {
        endpoint += '/cancel';
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const message = data.message || `Appointment ${newStatus} successfully`;
        setSuccess(message);
        showToast(message, 'success');
        fetchAppointments(); // Refresh the list
      } else {
        const errorMsg = data.message || `Failed to ${newStatus} appointment`;
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      const errorMsg = `Failed to update appointment status to ${newStatus}`;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error(error);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const message = 'Appointment deleted successfully';
        setSuccess(message);
        showToast(message, 'success');
        fetchAppointments(); // Refresh the list
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError('Failed to delete appointment');
      showToast('Failed to delete appointment', 'error');
      console.error(error);
    }
  };

  const rescheduleAppointment = async (appointmentId) => {
    const newDate = prompt('Enter new appointment date (YYYY-MM-DD):');
    const newTime = prompt('Enter new appointment time (HH:MM):');
    
    if (!newDate || !newTime) return;

    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          appointmentDate: newDate,
          timeSlot: newTime,
        }),
      });
      const data = await response.json();
      if (data.success) {
        const message = 'Appointment rescheduled successfully';
        setSuccess(message);
        showToast(message, 'success');
        fetchAppointments(); // Refresh the list
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError('Failed to reschedule appointment');
      showToast('Failed to reschedule appointment', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  return (
    <div className="management-section">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="section-header">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by donor name or email..."
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
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button onClick={fetchAppointments} className="btn btn-outline">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading appointments...</div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.userId?.name || 'Unknown'}</td>
                  <td>{appointment.userId?.email || 'N/A'}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>{appointment.location || 'Main Center'}</td>
                  <td>
                    <div className="action-buttons">
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                            className="btn btn-sm btn-success"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                            className="btn btn-sm btn-danger"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => rescheduleAppointment(appointment._id)}
                            className="btn btn-sm btn-outline"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {appointment.status === 'completed' && (
                        <span className="status-text">Appointment completed</span>
                      )}
                      {appointment.status === 'cancelled' && (
                        <span className="status-text">Appointment cancelled</span>
                      )}
                      <button
                        onClick={() => deleteAppointment(appointment._id)}
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

      {filteredAppointments.length === 0 && !loading && (
        <div className="empty-state">
          <p>No appointments found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default AppointmentManagement;
