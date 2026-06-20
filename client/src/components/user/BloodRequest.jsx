import { useState, useEffect } from "react";
import "../../css/BloodRequest.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../pages/Footer";
import { useToast } from "../../contexts/ToastContext";

/* ------------------------------------------------------------------ */
/*  Small inline icon set (same line-icon language as the dashboard) */
/* ------------------------------------------------------------------ */
const iconBase = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconDrop({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M12 3c3 4 6 8.2 6 11.5A6 6 0 0 1 6 14.5C6 11.2 9 7 12 3Z" />
    </svg>
  );
}
function IconHome({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" />
    </svg>
  );
}
function IconBox({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 8v8L12 20l8.5-4V8M12 12v8" />
    </svg>
  );
}
function IconAlert({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconUser({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </svg>
  );
}
function IconCross({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}
function IconPhone({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M5.5 4.5h3l1.2 4-2 1.6a11 11 0 0 0 5.2 5.2l1.6-2 4 1.2v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4 5.9a1.5 1.5 0 0 1 1.5-1.4Z" />
    </svg>
  );
}

/* Tiny traveling pulse used as the brand mark + button loading state */
function MiniPulse({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="br-mini-pulse__path"
        d="M0,12 L24,12 L30,3 L36,21 L42,6 L48,12 L80,12"
      />
    </svg>
  );
}

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
  }, [userName]);

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

  const urgencyClass = formData.urgencyLevel
    ? `br-field__select--${formData.urgencyLevel}`
    : "";

  return (
    <>
      {/* Navbar */}
      <nav className="br-navbar">
        <div className="br-navbar__brand" onClick={() => navigate("/")}>
          <span className="br-navbar__brand-icon">
            <IconDrop className="br-navbar__brand-icon-svg" />
          </span>
          <span className="br-navbar__brand-text">Blood Bank</span>
        </div>
        <div className="br-navbar__links">
          <button
            className="br-nav-btn"
            onClick={() => navigate('/dashboard')}
          >
            <IconHome className="br-nav-btn__icon" />
            Dashboard
          </button>
          <button
            className="br-nav-btn"
            onClick={() => navigate('/inventory')}
          >
            <IconBox className="br-nav-btn__icon" />
            Inventory
          </button>

          <div className="br-nav-profile">
            <div className="br-nav-profile__avatar">{getInitial()}</div>
            {userName && <span className="br-nav-profile__name">{userName}</span>}
          </div>
        </div>
      </nav>

      <div className="br-page">
        <div className="br-page__header">
          <span className="br-page__badge">
            <IconAlert className="br-page__badge-icon" />
            Priority request
          </span>
          <h1 className="br-page__title">Emergency blood request</h1>
          <p className="br-page__subtitle">
            Submit a request to help save a life — every request is reviewed
            and prioritized by urgency.
          </p>
        </div>

        <div className="br-form-wrap">
          <form className="br-form" onSubmit={submitBloodRequest}>
            <div className="br-section" style={{ animationDelay: "0ms" }}>
              <h3 className="br-section__title">
                <span className="br-section__icon-wrap br-section__icon-wrap--patient">
                  <IconUser className="br-section__icon" />
                </span>
                Patient information
              </h3>

              <div className="br-field">
                <label htmlFor="patientName">Patient name *</label>
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

              <div className="br-field-row">
                <div className="br-field">
                  <label htmlFor="bloodType">Blood type *</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                    required
                  >
                    <option value="">Select blood type</option>
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

                <div className="br-field">
                  <label htmlFor="unitsNeeded">Units needed *</label>
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

            <div className="br-section" style={{ animationDelay: "80ms" }}>
              <h3 className="br-section__title">
                <span className="br-section__icon-wrap br-section__icon-wrap--medical">
                  <IconCross className="br-section__icon" />
                </span>
                Medical details
              </h3>

              <div className="br-field-row">
                <div className="br-field">
                  <label htmlFor="urgencyLevel">Urgency level *</label>
                  <select
                    id="urgencyLevel"
                    name="urgencyLevel"
                    className={urgencyClass}
                    value={formData.urgencyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, urgencyLevel: e.target.value })
                    }
                    required
                  >
                    <option value="">Select urgency level</option>
                    <option value="critical">Critical — life threatening</option>
                    <option value="urgent">Urgent — within 24 hours</option>
                    <option value="normal">Normal — within 48 hours</option>
                  </select>
                </div>

                <div className="br-field">
                  <label htmlFor="hospitalName">
                    Hospital name with location *
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

            <div className="br-section" style={{ animationDelay: "160ms" }}>
              <h3 className="br-section__title">
                <span className="br-section__icon-wrap br-section__icon-wrap--contact">
                  <IconPhone className="br-section__icon" />
                </span>
                Contact information
              </h3>

              <div className="br-field">
                <label htmlFor="contactNumber">Contact number *</label>
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

              <div className="br-field">
                <label htmlFor="additionalNotes">Additional notes</label>
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

            <div className="br-form__actions">
              <button
                type="button"
                className="br-btn br-btn--ghost"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="br-btn br-btn--primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <MiniPulse className="br-btn__pulse" />
                    Submitting…
                  </>
                ) : (
                  <>Submit blood request</>
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