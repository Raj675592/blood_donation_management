import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import Footer from "./Footer";
const Home = () => {
  if (localStorage.getItem("token")) {
    if (
      JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role ===
      "admin"
    ) {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  }
  return (
    <div className="home-container">
      {/* Navigation Header */}
      {/* <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
          
            <span className="logo-text">BloodBank</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-btn">Get Started</Link>
           
          </div>
        </div>
      </nav> */}

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
