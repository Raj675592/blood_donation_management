import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import "../../css/Login.css"; // We consolidate all styles here

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [forgotModal, setForgotModal] = useState(false);
  const [email, setEmail] = useState("");
  const [message] = useState(
    "If an account with that email exists, a password reset link has been sent."
  );

  // Safely handle existing sessions without blocking the render
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (e) {
        console.error("Invalid token format");
      }
    }
  }, [navigate]);

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
        setFormData({ email: "", password: "" });
        
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
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
      setError("Login failed. Please check your connection.");
    }
  };

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

        if (response.ok) {
          showToast(data.message || message, "success");
          setEmail("");
          setForgotModal(false); // Auto-close modal on success
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
    <div className="pro-login-wrapper">
      
      {/* LEFT CONTENT AREA: Brand & Features */}
      <div className="pro-login-left">
        <div className="left-content-inner">
          <div className="brand-logo">
            {/* Simple Blood Drop SVG */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="logo-icon">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <h2>Blood Bank</h2>
          </div>
          
          <h1 className="login-title">Welcome Back.</h1>
          <p className="login-subtitle">
            Continue your journey of saving lives through blood donation. Your
            account helps us connect you with those in immediate need.
          </p>
          
          <ul className="login-features">
            {[
              "Access your donation history",
              "Schedule new appointments",
              "Track your impact on lives saved",
              "Connect with donation centers",
              "Receive important health updates",
            ].map((feature, idx) => (
              <li key={idx}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT FORM AREA: Login Form */}
      <div className="pro-login-right">
        <div className="login-form-container">
          <div className="welcome-message">
            <h2>Sign In</h2>
            <p>Enter your details to access your dashboard</p>
          </div>

          {/* Alert Messages */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="pro-login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <button
                type="button"
                className="btn-forgot-password"
                onClick={() => setForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn-primary">
              Sign In
            </button>

            <p className="register-prompt">
              New to Blood Bank? <a href="/signup">Create an Account</a>
            </p>
          </form>
        </div>
      </div>

      {/* MODAL: Forgot Password */}
      {forgotModal && (
        <div className="pro-modal-overlay">
          <div className="pro-modal-content">
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button
                onClick={() => setForgotModal(false)}
                className="modal-close-btn"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <p className="modal-description">
              Enter the email associated with your account, and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmitPasswordReset} className="modal-form">
              <div className="form-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;