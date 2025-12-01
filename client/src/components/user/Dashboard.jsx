import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/userDashboard.css";
import Footer from "../../pages/Footer";
import { useToast } from "../../contexts/ToastContext";
import { NotificationService } from "../../services/NotificationService";

function UserDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const { showToast } = useToast();
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState(null);
  const cancelAppointment = () => {
    // Logic to cancel the appointment
  };
  const [updateData, setUpdateData] = useState({
    bloodType: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8001/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        // Update the dashboard data with new user info
        setDashboardData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...result.user,
          },
        }));

        // Close modal and show success
        setModal(false);
        setError(""); // Clear any previous errors
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const getUserDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8001/api/users/dashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch user dashboard");
      }

      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    navigate("/login");
  };

  // Check for status changes in user's blood requests
  const checkForNotifications = async () => {
    try {
      if (dashboardData?.bloodRequests) {
        const currentTimestamp = new Date().toISOString();
        
        // Check for status changes
        dashboardData.bloodRequests.forEach(request => {
          const statusChangeKey = `bloodrequest_${request._id}_status`;
          const lastKnownStatus = localStorage.getItem(statusChangeKey);
          
          if (lastKnownStatus && lastKnownStatus !== request.status) {
            let message = '';
            if (request.status === 'accepted') {
              message = `Great news! Your blood request for ${request.patientName} has been accepted by the admin.`;
            } else if (request.status === 'rejected') {
              message = `Your blood request for ${request.patientName} has been rejected. Please contact support for more information.`;
            }
            
            if (message) {
              showToast(message, request.status === 'accepted' ? 'success' : 'error');
            }
          }
          
          // Store current status
          localStorage.setItem(statusChangeKey, request.status);
        });
        
        setLastCheckTimestamp(currentTimestamp);
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  useEffect(() => {
    getUserDashboard();
  }, []);

  // Check for notifications every time dashboard data changes
  useEffect(() => {
    if (dashboardData) {
      checkForNotifications();
    }
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>⚠️ {error}</h3>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>No data available</h3>
          <button onClick={getUserDashboard}>Reload</button>
        </div>
      </div>
    );
  }

  const { user, stats, upcomingAppointment, recentActivity, lastLogin } =
    dashboardData;

  return (
    <>
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              🩸 Welcome back, {user?.name.toUpperCase() || "User"}!
            </h1>
            <button onClick={handleLogout} className="logout-btn" style={{marginLeft: '20px', padding: '8px 12px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #e74c3c', backgroundColor: '#e74c3c', color: '#fff', width: '100px'}}>
              Logout
            </button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="dashboard-main">
          {/* User Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-text">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="profile-info">
                <h2>{user?.name.toUpperCase() || "Unknown User"}</h2>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-details">
                  <span className="blood-type">
                    🩸 {user?.bloodType || "Not specified"}
                  </span>
                  <span className="phone">
                    📞 {user?.phone || "Not provided"}
                  </span>
                  <span className="last-login">
                    ⏰ Last seen:{" "}
                    {lastLogin ? new Date(lastLogin).toLocaleString() : "N/A"}
                  </span>
                  <span className="date-of-birth">
                    🎂 Date of Birth:{" "}
                    {user?.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </span>
                  <span className="gender">
                    🚻 Gender: {user?.gender || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Update Modal */}
          {modal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Edit Profile</h3>
                  <button
                    onClick={() => setModal(false)}
                    className="modal-close"
                  >
                    ×
                  </button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile(updateData);
                  }}
                  className="update-form"
                >
                  <div className="form-group">
                    <label>Blood Type</label>
                    <select
                      value={updateData.bloodType}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          bloodType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={updateData.phone}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={updateData.dateOfBirth}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={updateData.gender}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, gender: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => setModal(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="update-btn"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Statistics Cards */}

          <div className="stats-grid">
            <div className="stat-card donations">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <h3>{stats?.totalDonations}</h3>
                <p>Total Donations</p>
              </div>
            </div>
            <div className="stat-card appointments">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>{stats?.totalAppointments}</h3>
                <p>Total Appointments</p>
              </div>
            </div>
            <div className="stat-card blood-requests">
              <div className="stat-icon">🆘</div>
              <div className="stat-info">
                <h3>{stats?.totalBloodRequests}</h3>
                <p>Blood Requests</p>
              </div>
            </div>
            <div className="stat-card next-appointment">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h3>{upcomingAppointment ? "Scheduled" : "None"}</h3>
                <p>Next Appointment</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <div className="recent-appointments">
              <h3>📅 Recent Appointments</h3>
              {recentActivity?.Recentappointments?.length > 0 ? (
                <div className="appointments-list">
                  {recentActivity.Recentappointments.slice(0, 5).map(
                    (appointment, index) => (
                      <div key={index} className="appointment-item">
                        <div className="appointment-date">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()}
                        </div>
                        <div className="appointment-details">
                          <span className="appointment-time">
                            {appointment.timeSlot}
                          </span>
                          <span className="appointment-location">
                            {appointment.location}
                          </span>
                        </div>
                        <div
                          className={`appointment-status ${appointment.status}`}
                        >
                          {appointment.status === "completed"
                            ? "✅ Completed"
                            : appointment.status === "scheduled"
                            ? "⏳ Scheduled"
                            : appointment.status === "cancelled"
                            ? "❌ Cancelled"
                            : `📋 ${appointment.status}`}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="no-data">
                  No recent appointments found. Schedule your first donation!
                </p>
              )}
            </div>

            <div className="recent-blood-requests">
              <h3>🆘 Recent Blood Requests</h3>
              {recentActivity?.RecentbloodRequests?.length > 0 ? (
                <div className="blood-requests-list">
                  {recentActivity.RecentbloodRequests.slice(0, 5).map(
                    (request, index) => (
                      <div key={index} className="blood-request-item">
                        <div className="request-date">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        <div className="request-details">
                          <span className="patient-name">
                            {request.patientName}
                          </span>
                          <span className="blood-type-needed">
                            Blood: {request.bloodType}
                          </span>
                          <span className="units-needed">
                            {request.unitsNeeded} units
                          </span>
                          <span className="urgency-level">
                            Urgency: {request.urgencyLevel}
                          </span>
                        </div>
                        <div className={`request-status ${request.status}`}>
                          {request.status === "fulfilled"
                            ? "✅ Fulfilled"
                            : request.status === "pending"
                            ? "⏳ Pending"
                            : request.status === "cancelled"
                            ? "❌ Cancelled"
                            : `📋 ${request.status}`}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="no-data">No recent blood requests found.</p>
              )}
            </div>
          </div>

          {/* Upcoming Appointment Card */}
          {upcomingAppointment && (
            <div className="upcoming-appointment-card">
              <h3>📅 Your Next Appointment</h3>
              <div className="appointment-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    upcomingAppointment.appointmentDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {upcomingAppointment.timeSlot}
                </p>
                <p>
                  <strong>Location:</strong> {upcomingAppointment.location}
                </p>
                <p>
                  <strong>Status:</strong> {upcomingAppointment.status}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>🚀 Quick Actions</h3>
            <div className="actions-grid">
              <button
                className="action-btn schedule"
                onClick={() => navigate("/schedule-appointment")}
              >
                <span className="btn-icon">📅</span>
                Schedule Donation
              </button>
              <button
                onClick={() => navigate("/blood-request")}
                className="action-btn request"
              >
                <span className="btn-icon">🆘</span>
                Request Blood
              </button>
              <div className="actions-grid">
                <button
                  onClick={() => {
                    setUpdateData({
                      bloodType: user?.bloodType || "",
                      phone: user?.phone || "",
                      dateOfBirth: user?.dateOfBirth
                        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                        : "",
                      gender: user?.gender || "",
                    });
                    setModal(true);
                  }}
                  className="action-btn edit-profile"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserDashboard;
