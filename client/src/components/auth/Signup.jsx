import { useState, useEffect } from "react";
import "../../css/Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    role: "user",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FIX 1: Moved redirect out of render body into useEffect.
  // FIX 2: Use navigate() instead of window.location.href.
  // FIX 3: Wrapped JWT decode in try-catch — malformed token no longer crashes.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { role } = JSON.parse(atob(token.split(".")[1]));
      navigate(role === "admin" ? "/admin-dashboard" : "/dashboard", {
        replace: true,
      });
    } catch {
      localStorage.removeItem("token"); // clear corrupted token silently
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // FIX 4: Loading state added
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:8001";
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Account created! Redirecting to login…");
        // FIX 5: address was missing from the reset — now included
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          bloodType: "",
          role: "user",
          address: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left — branding / hero */}
      <div className="signup-left-content">
        <div className="signup-hero-icon" aria-hidden="true">
          <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M30 4C30 4 6 28 6 46a24 24 0 0 0 48 0C54 28 30 4 30 4Z"
              fill="rgba(255,255,255,0.18)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <h1 className="signup-title">
          Save Lives.
          <br />
          Donate Blood.
        </h1>
        <p className="signup-subtitle">
          Join our community of life-savers and help those in need. Your
          donation can save up to three lives.
        </p>
        <ul className="signup-features">
          <li>Safe and secure donation process</li>
          <li>Track your donation history</li>
          <li>Find nearby donation centres</li>
          <li>Connect with fellow donors</li>
          <li>Make a real difference in lives</li>
        </ul>
      </div>

      {/* Right — registration form */}
      <div className="signup-form-container">
        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          <h2 className="form-title">Create Account</h2>

          {error && (
            <p className="form-alert form-alert--error" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="form-alert form-alert--success" role="status">
              {success}
            </p>
          )}

          {/* FIX 6: Every input now has a matching id + htmlFor */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
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
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            {/* FIX 7: Was htmlFor="email" — now correctly htmlFor="address" */}
            <label htmlFor="address">Permanent Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Permanent Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            {/* FIX 8: Was htmlFor="email" — now correctly htmlFor="password" */}
            <label htmlFor="password">Password</label>
            <input
              id="password"
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
              id="phone"
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
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          {/* FIX 9: Gender + blood type now have labels and sit side-by-side */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
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
              <label htmlFor="bloodType">Blood Type</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+ (Positive)</option>
                <option value="A-">A− (Negative)</option>
                <option value="B+">B+ (Positive)</option>
                <option value="B-">B− (Negative)</option>
                <option value="AB+">AB+ (Positive)</option>
                <option value="AB-">AB− (Negative)</option>
                <option value="O+">O+ (Positive)</option>
                <option value="O-">O− (Negative)</option>
              </select>
            </div>
          </div>

          {/* FIX 10: Button disabled + label changes during loading */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>

          <div className="login-link">
            Already have an account? <a href="/login">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;