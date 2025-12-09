import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Login.css";
import { useToast } from "../../contexts/ToastContext";
import "../../css/Forgot-Password.css";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:8001";
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful!");
        setFormData({
          email: "",
          password: "",
        });
        // Store token if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (data.user.role === "user") {
          navigate("/dashboard");
        }
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        }
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (error) {
      setError("Login failed.");
    }
  };

  const [email, setEmail] = useState("");
  const [message] = useState(
    "If an account with that email exists, a password reset link has been sent."
  );
  const { showToast } = useToast();

  const handleSubmitPasswordReset = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const API_BASE_URL =
          process.env.REACT_APP_API_URL || "http://localhost:8001";
        const response = await fetch(
          `${API_BASE_URL}/api/auth/requestPasswordReset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          showToast(data.message || message, "success");
          setEmail("");
        } else {
          showToast(data.message || message, "info");
        }
      } catch (error) {
        showToast(message, "info");
      }
    },
    [email, message, showToast]
  );

  return (
    <div className="login-container">
      {/* right form Area */}
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Sign In</h2>

          <div className="welcome-message">
            <h3>Welcome to Blood Bank</h3>
            <p>Login to continue your life-saving journey</p>
          </div>

          {error && (
            <p
              style={{
                color: "#dc2626",
                background: "#fef2f2",
                padding: "12px",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {error}
            </p>
          )}
          {success && (
            <p
              style={{
                color: "#059669",
                background: "#ecfdf5",
                padding: "12px",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {success}
            </p>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign In to Blood Bank</button>

          <div className="login-link">
            New to Blood Bank?{" "}
            <a href="/signup" style={{ color: "green" }}>
              Create Account
            </a>
          </div>
          <div className="login-link">
            <button
              onClick={ () => setForgotModal(true)}
              style={{
                background: "none",
                border: "none",
                
                color: "#ff1606ff",
                cursor: "pointer",
                padding: 0,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
      {forgotModal && (
        <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Update Password</h3>
                  <button
                    onClick={() => setForgotModal(false)}
                    className="modal-close"
                  >
                    ×
                  </button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form
                  onSubmit={handleSubmitPasswordReset}
                  className="update-form"
                >
                  <label htmlFor="email">Enter your email address:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                 
                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => setForgotModal(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="update-btn"
                     
                    >
                      Request Password Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
      )}
      {/* left content Area */}
      <div className="login-left-content">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">
          Continue your journey of saving lives through blood donation. Your
          account helps us connect you with those in need.
        </p>
        <ul className="login-features">
          <li>Access your donation history</li>
          <li>Schedule new appointments</li>
          <li>Track your impact on lives saved</li>
          <li>Connect with donation centers</li>
          <li>Receive important health updates</li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
