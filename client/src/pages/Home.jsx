import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Footer from "./Footer";
const Home = () => {
  if(localStorage.getItem("token")){
    if(JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role==="admin"){
      window.location.href="/admin-dashboard";
    }
    else{
      window.location.href="/dashboard";
    }
  }
  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🩸</span>
            <span className="logo-text">BloodBank</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-btn">Get Started</Link>
          </div>
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
              Join our community of life-savers. Every donation can save up to three lives 
              and make a real difference in your community.
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
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Lives Saved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Active Donors</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Partner Hospitals</span>
              </div>
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

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Blood Bank?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Safe & Secure</h3>
              <p>Strict medical protocols with complete safety measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Quick Process</h3>
              <p>Streamlined donation process that respects your time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Impact</h3>
              <p>Monitor your donations and see your life-saving impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Save Lives?</h2>
            <p>Join thousands of donors making a difference every day.</p>
            <Link to="/signup" className="cta-btn-single">
              🩸 Join Our Community Today
            </Link>
          </div>
        </div>
      </section>

      {/* Blood Types Info Section - Compact */}
      <section className="blood-types-section">
        <div className="container">
          <h2 className="section-title">Every Blood Type Matters</h2>
          <div className="blood-info-compact">
            <div className="blood-fact">
              <span className="blood-emoji">🅾️</span>
              <p><strong>O-</strong> Universal Donor - Can help everyone</p>
            </div>
            <div className="blood-fact">
              <span className="blood-emoji">🆎</span>
              <p><strong>AB+</strong> Universal Recipient - Can receive all types</p>
            </div>
            <div className="blood-fact">
              <span className="blood-emoji">🔴</span>
              <p><strong>All Types</strong> Are needed to save lives daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
     
        <Footer />
     
    </div>
  );
};

export default Home;
