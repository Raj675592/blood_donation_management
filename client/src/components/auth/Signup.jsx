import { useState } from "react";
import "../../css/Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    role: "user",
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
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();   
      if (response.ok) {
        setSuccess("Signup successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          bloodType: "",
          role: "user",
        });
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (error) {
      setError("Signup failed.");
    }
  };
  return (
    <div className="signup-container">
      {/* Left Content Area */}
      <div className="signup-left-content">
        <div className="home-button">
          <button className="home-button"
            onClick={() => {
              navigate("/");
            }}
          >
            Go To Home
          </button>
        </div>
        <h1 className="signup-title">
          Save Lives
          <br />
          Donate Blood
        </h1>
        <p className="signup-subtitle">
          Join our community of life-savers and help those in need. Your
          donation can save up to three lives.
        </p>
        <ul className="signup-features">
          <li>Safe and secure donation process</li>
          <li>Track your donation history</li>
          <li>Find nearby donation centers</li>
          <li>Connect with fellow donors</li>
          <li>Make a real difference in lives</li>
        </ul>
      </div>

      {/* Right Form Area */}
      <div className="signup-form-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="form-title">Create Account</h2>

          {error && (
            <p
              style={{
                color: "#dc2626",
                background: "#fef2f2",
                padding: "10px",
                borderRadius: "5px",
                textAlign: "center",
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
                padding: "10px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              {success}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+ (A Positive)</option>
              <option value="A-">A- (A Negative)</option>
              <option value="B+">B+ (B Positive)</option>
              <option value="B-">B- (B Negative)</option>
              <option value="AB+">AB+ (AB Positive)</option>
              <option value="AB-">AB- (AB Negative)</option>
              <option value="O+">O+ (O Positive)</option>
              <option value="O-">O- (O Negative)</option>
            </select>
          </div>

          <button type="submit">Signup</button>

          <div className="login-link">
            Already have an account? <a href="/login">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
