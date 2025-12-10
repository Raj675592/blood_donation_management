import { useState, useEffect } from "react";
import "../../css/BloodRequest.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../pages/Footer";
import { useToast } from "../../contexts/ToastContext";

function BloodRequest() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    unitsNeeded: "",
    urgencyLevel: "",
    hospitalName: "",
    contactNumber: "",
    additionalNotes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user name from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.name) {
          setUserName(user.name);
        }
      } catch (e) {
        console.error("Invalid user data");
      }
    }
    // Fallback to token
    const token = localStorage.getItem("token");
    if (token && !userName) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.name) {
          setUserName(payload.name);
        }
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);

  const getInitial = () => {
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const submitBloodRequest = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/users/blood-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const message = "Blood request submitted successfully! Redirecting to dashboard...";
        showToast(message, 'success');
        setFormData({
          patientName: "",
          bloodType: "",
          unitsNeeded: "",
          urgencyLevel: "",
          hospitalName: "",
          contactNumber: "",
          additionalNotes: "",
        });

        // Redirect after showing success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error("Error submitting blood request:", error);
      const errorMsg = "Failed to submit blood request. Please try again.";
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="blood-request-navbar">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="brand-icon">🩸</span>
          <span className="brand-text">Blood Bank</span>
        </div>
        <div className="navbar-links">
          <button 
            className="nav-btn nav-btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </button>
          <button 
            className="nav-btn nav-btn-outline"
            onClick={() => navigate('/inventory')}
          >
            <span className="nav-icon">📦</span>
            Inventory
          </button>
          
          <div className="nav-profile">
            <div className="nav-profile-avatar">
              {getInitial()}
            </div>
            {userName && <span className="nav-profile-name">{userName}</span>}
          </div>
        </div>
      </nav>

    <div className="blood-request-container">
      <div className="blood-request-header">
        <h1 className="blood-request-title">🚨 Emergency Blood Request</h1>
        <p className="blood-request-subtitle">
          Submit a blood request to help save a life. All requests are
          prioritized based on urgency.
        </p>
      </div>

      <div className="form-container">
        <form className="blood-request-form" onSubmit={submitBloodRequest}>
          <div className="form-section">
            <h3 className="section-title">👤 Patient Information</h3>

            <div className="form-group">
              <label htmlFor="patientName">Patient Name *</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                placeholder="Enter patient's full name"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type *</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodType: e.target.value })
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
                <label htmlFor="unitsNeeded">Units Needed *</label>
                <input
                  type="number"
                  id="unitsNeeded"
                  name="unitsNeeded"
                  placeholder="Number of units"
                  min="1"
                  max="10"
                  value={formData.unitsNeeded}
                  onChange={(e) =>
                    setFormData({ ...formData, unitsNeeded: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

         
          <div className="form-section">
            <h3 className="section-title">🏥 Medical Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="urgencyLevel">Urgency Level *</label>
                <select
                  id="urgencyLevel"
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, urgencyLevel: e.target.value })
                  }
                  required
                >
                  <option value="">Select Urgency</option>
                  <option value="critical">
                    🔴 Critical - Life Threatening
                  </option>
                  <option value="urgent">🟡 Urgent - Within 24 hours</option>
                  <option value="normal">🟢 Normal - Within 48 hours</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hospitalName">
                  Hospital Name with Location *
                </label>
                <input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  placeholder="Enter hospital name with location"
                  value={formData.hospitalName}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          
          <div className="form-section">
            <h3 className="section-title">📞 Contact Information</h3>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                placeholder="Any additional information about the request..."
                rows="4"
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
              />
            </div>
          </div>

         
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                <>Submit Blood Request</>
              )}
            </button>
          </div>
        </form>
      </div>
      
    </div>
    <Footer />
    </>
  );
}

export default BloodRequest;
