import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
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
  return (
    <div className="login-container">
      {/* Left Content Area */}
      <div className="login-left-content">
        <button 
          className="home-button"
          onClick={() => navigate("/")}
          style={{ marginBottom: '20px', width:"200px" }}
        >
          ← Go To Home
        </button>

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

      {/* Right Form Area */}
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
            New to Blood Bank? <a href="/signup">Create Account</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
