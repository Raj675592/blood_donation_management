import { useState, useEffect } from "react";
import "../../css/AdminDashboard.css";
import { Link, useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import AppointmentManagement from "./AppointmentManagement";
import InventoryManagement from "./InventoryManagement";
import BloodRequestManagement from "./BloodRequestManagement";
// Environment-based API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

// Disable console.log in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [AdminDashboardData, setAdminDashboardData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const dashboardData = async () => {
    setError("");
  
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/admin/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAdminDashboardData(data);
         }
    } catch (error) {
      const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Unable to load dashboard data. Please try again.' 
        : 'Failed to load dashboard data.';
      setError(errorMessage);
      if (process.env.NODE_ENV !== 'production') {
        console.error('Dashboard data error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    dashboardData();
  }, []);

  const renderContent = () => {
    switch(activeSection) {
      case "users":
        return <UserManagement />;
      case "appointments":
        return <AppointmentManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "requests":
        return <BloodRequestManagement />;
      default:
        return (
          <div className="dashboard-overview">
            {/* Dashboard Metrics Cards */}
            <div className="cards-grid">
              <div className="dashboard-card">
                <div className="card-title">Total Users</div>
                <div className="card-value">{AdminDashboardData.data?.stats?.totalUsers || '0'}</div>
                <div className="card-subtitle">Registered Users</div>
              </div>






              <div className="dashboard-card">
                <div className="card-title">Blood Requests</div>
                <div className="card-value">{AdminDashboardData.data?.stats?.totalRequests || '0'}</div>
                <div className="card-subtitle">Active Requests</div>
              </div>
              <div className="dashboard-card">
                <div className="card-title">Appointments</div>
                <div className="card-value">{AdminDashboardData.data?.stats?.totalAppointments || '0'}</div>
                <div className="card-subtitle">Scheduled Appointments</div>
              </div>
              <div className="dashboard-card">
                <div className="card-title">Low Stock Items</div>
                <div className="card-value">{AdminDashboardData.data?.stats?.lowStockCount || '0'}</div>
                <div className="card-subtitle">Items below 10 units</div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="dashboard-card">
              <h3 className="section-title">Recent Activity</h3>
              {AdminDashboardData.data?.recentActivities ? (
                <div className="activity-list">
                  {AdminDashboardData.data.recentActivities.users?.slice(0, 10).map((user, index) => (
                    <div key={`user-${index}`} className="activity-item">
                      <div className="activity-icon user-icon">👤</div>
                      <div className="activity-content">
                        <span className="activity-user">{user.name}</span> registered as a {user.bloodType} donor
                        <div className="activity-time">{new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                  {AdminDashboardData.data.recentActivities.requests?.slice(0, 10).map((request, index) => (
                    <div key={`request-${index}`} className="activity-item">
                      <div className="activity-icon request-icon">🩸</div>
                      <div className="activity-content">
                        New blood request from <span className="activity-user">{request.userId?.name}</span>
                        <div className="activity-time">{new Date(request.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                  {AdminDashboardData.data.recentActivities.appointments?.slice(0, 10).map((appointment, index) => (
                    <div key={`appointment-${index}`} className="activity-item">
                      <div className="activity-icon appointment-icon">📅</div>
                      <div className="activity-content">
                        Appointment scheduled with <span className="activity-user">{appointment.userId?.name}</span>
                        <div className="activity-time">{new Date(appointment.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">No recent activity</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
    <div className="admin-layout">
      {/* Mobile Menu Button */}
      <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}

      {/* Sidebar Navigation */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p className="admin-info">{AdminDashboardData.data?.admin?.name}</p>
          <button className="mobile-close-btn" onClick={toggleMobileMenu}>×</button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => handleNavigation('users')}
          >
            <span className="nav-icon">👥</span>
            User Management
          </button>
          <button 
            className={`nav-item ${activeSection === 'appointments' ? 'active' : ''}`}
            onClick={() => handleNavigation('appointments')}
          >
            <span className="nav-icon">📅</span>
            Appointments
          </button>
          <button 
            className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`}
            onClick={() => handleNavigation('inventory')}
          >
            <span className="nav-icon">🏥</span>
            Blood Inventory
          </button>
          <button 
            className={`nav-item ${activeSection === 'requests' ? 'active' : ''}`}
            onClick={() => handleNavigation('requests')}
          >
            <span className="nav-icon">🩸</span>
            Blood Requests
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <div className="content-header">
          <h1 className="page-title">
            {activeSection === 'dashboard' && 'Dashboard Overview'}
            {activeSection === 'users' && 'User Management'}
            {activeSection === 'appointments' && 'Appointment Management'}
            {activeSection === 'inventory' && 'Blood Inventory Management'}
            {activeSection === 'requests' && 'Blood Request Management'}
          </h1>
        </div>

        {loading && <div className="loading-spinner">Loading...</div>}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try again later.</p>
            <Link to="/">Go to Home</Link>
          </div>
        )}

        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    
    </div>

      </>
  );
}

export default AdminDashboard;
