import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";
import Footer from "./Footer";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") {
          window.location.href = "/admin-dashboard";
        }
        // Get user name from token or localStorage
        if (payload.name) {
          setUserName(payload.name);
        } else if (payload.firstName) {
          setUserName(payload.firstName);
        }
      } catch (e) {
        console.error("Invalid token");
      }
      
      // If name not in token, try fetching from user data in localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.name) {
            setUserName(user.name);
          } else if (user.firstName) {
            setUserName(user.firstName);
          }
        } catch (e) {
          console.error("Invalid user data");
        }
      }
    }
  }, []);

  // Get first letter of name for avatar
  const getInitial = () => {
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setShowDropdown(false);
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="home-navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🩸</span>
          <span className="brand-text">Blood Bank</span>
        </div>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="profile-menu">
              <button 
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="profile-avatar-letter">
                  {getInitial()}
                </div>
              </button>
              {showDropdown && (
                <div className="profile-dropdown">
                  {userName && (
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getInitial()}</div>
                      <span className="dropdown-name">{userName}</span>
                    </div>
                  )}
                  <hr className="dropdown-divider" />
                  <button onClick={goToDashboard} className="dropdown-item">
                    <span>📊</span> Dashboard
                  </button>
                  <button onClick={() => { setShowDropdown(false); navigate("/inventory"); }} className="dropdown-item">
                    <span>🩸</span> Inventory
                  </button>
                  <button onClick={() => { setShowDropdown(false); navigate("/blood-request"); }} className="dropdown-item">
                    <span>💉</span> Request Blood
                  </button>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline">
                Sign In
              </Link>
              <Link to="/signup" className="nav-btn nav-btn-filled">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Save Lives Through
              <span className="highlight"> Blood Donation</span>
            </h1>
            <p className="hero-subtitle">
              Join our community of life-savers. Every donation can save up to
              three lives and make a real difference in your community.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary">
                <span>🩸</span>
                Start Donating
              </Link>
              <Link to="/login" className="btn-secondary">
                <span>🏥</span>
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="blood-drop">
                <span>🩸</span>
              </div>
              <div className="heart-pulse">
                <span>❤️</span>
              </div>
              <div className="medical-cross">
                <span>🏥</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
