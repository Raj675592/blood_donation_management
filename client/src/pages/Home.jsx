import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";
import Footer from "./Footer";

/* Decorative heartbeat divider — the page's signature motif.
   Purely visual, no logic. Reused between sections. */
const PulseDivider = () => (
  <div className="pulse-divider reveal" aria-hidden="true">
    <svg
      className="pulse-divider-svg"
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
    >
      <path
        className="pulse-path"
        d="M0 40 H300 L322 40 L340 8 L362 72 L384 40 L406 40 H1200"
      />
      <circle className="pulse-dot" cx="362" cy="40" r="5" />
    </svg>
  </div>
);

const STATS = [
  // { value: "3", label: "Lives saved per donation" },
  // { value: "56", label: "Days between donations" },
  // { value: "8", label: "Blood types we track" },
];

const STEPS = [
  {
    n: "01",
    title: "Register",
    text: "Create a donor profile with your blood type and contact details.",
  },
  {
    n: "02",
    title: "Screening",
    text: "A short health check confirms you're ready to give.",
  },
  {
    n: "03",
    title: "Donate",
    text: "The draw takes about ten minutes, start to finish.",
  },
  {
    n: "04",
    title: "Recover",
    text: "Rest, hydrate, and find your next eligible date on your dashboard.",
  },
];

const BLOOD_TYPES = [
  { type: "O−", gives: "Everyone", receives: "O− only", note: "Universal donor" },
  { type: "O+", gives: "O+, A+, B+, AB+", receives: "O+, O−" },
  { type: "A−", gives: "A−, A+, AB−, AB+", receives: "A−, O−" },
  { type: "A+", gives: "A+, AB+", receives: "A+, A−, O+, O−" },
  { type: "B−", gives: "B−, B+, AB−, AB+", receives: "B−, O−" },
  { type: "B+", gives: "B+, AB+", receives: "B+, B−, O+, O−" },
  { type: "AB−", gives: "AB−, AB+", receives: "AB−, A−, B−, O−" },
  { type: "AB+", gives: "AB+ only", receives: "Everyone", note: "Universal recipient" },
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const heroVisualRef = useRef(null);

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

  // Navbar gains a shadow/blur once the page scrolls — visual only.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal: fade/slide elements with the .reveal class into place.
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Subtle pointer-tilt on the hero illustration (desktop only, no state churn).
  const handleHeroMove = (e) => {
    const node = heroVisualRef.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tiltX", `${py * -8}deg`);
    node.style.setProperty("--tiltY", `${px * 10}deg`);
  };
  const resetHeroTilt = () => {
    const node = heroVisualRef.current;
    if (!node) return;
    node.style.setProperty("--tiltX", "0deg");
    node.style.setProperty("--tiltY", "0deg");
  };

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
    <div className="home-container" ref={pageRef}>
      {/* Navbar */}
      <nav className={`home-navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="navbar-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="brand-drop">
              <path d="M12 2C12 2 5 11 5 15.5C5 19.6 8.1 22 12 22C15.9 22 19 19.6 19 15.5C19 11 12 2 12 2Z" />
            </svg>
          </span>
          <span className="brand-text" style = {{ color: "#000000" }}>
            Blood Bank
          </span>
        </div>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
              >
                <div className="profile-avatar-letter">{getInitial()}</div>
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
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/inventory");
                    }}
                    className="dropdown-item"
                  >
                    <span>🩸</span> Inventory
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/blood-request");
                    }}
                    className="dropdown-item"
                  >
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
            <span className="hero-eyebrow reveal-on-load delay-0">
              Local Donor Registry
            </span>
            <h1 className="hero-title">
              <span className="reveal-on-load delay-1">Your pulse</span>
              <span className="reveal-on-load delay-2">can become</span>
              <span className="reveal-on-load delay-3 highlight">
                someone else's.
              </span>
            </h1>
            <p className="hero-subtitle reveal-on-load delay-4">
              One donation can supply up to three patients. Register in
              minutes, donate in twenty, and track every drop afterward from
              your dashboard.
            </p>

            <div className="hero-buttons reveal-on-load delay-5">
              {isLoggedIn ? (
                <>
                  <button onClick={goToDashboard} className="btn-primary">
                    <span>📊</span> Open Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/blood-request")}
                    className="btn-secondary"
                  >
                    <span>💉</span> Request Blood
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary">
                    <span>🩸</span> Become a Donor
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    <span>🏥</span> Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="hero-stats reveal-on-load delay-6">
              {STATS.map((stat) => (
                <div className="stat-chip" key={stat.label}>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="hero-visual"
            ref={heroVisualRef}
            onMouseMove={handleHeroMove}
            onMouseLeave={resetHeroTilt}
          >
            <svg className="hero-svg" viewBox="0 0 420 420" aria-hidden="true">
              <circle className="hero-glow" cx="210" cy="210" r="170" />
              <g className="donor-card">
                <rect className="card-bg" x="60" y="120" width="290" height="190" rx="20" />
                <circle className="card-chip" cx="100" cy="150" r="11" />
                <rect className="card-line card-line-1" x="90" y="186" width="170" height="10" rx="5" />
                <rect className="card-line card-line-2" x="90" y="210" width="130" height="10" rx="5" />
                <rect className="card-line card-line-3" x="90" y="234" width="95" height="10" rx="5" />
                <text className="card-tag" x="305" y="278" textAnchor="middle">
                  O+
                </text>
              </g>
              <g className="floating-drop">
                <path
                  className="drop-shape"
                  d="M268 60 C268 60 222 116 222 150 C222 175 242 194 268 194 C294 194 314 175 314 150 C314 116 268 60 268 60 Z"
                />
                <path className="drop-shine" d="M250 130 C250 142 256 150 264 152" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <PulseDivider />

      {/* How donation works — a real, ordered process */}
      <section className="process-section">
        <div className="section-heading reveal">
          <span className="section-eyebrow">How it works</span>
          <h2>Four steps from sign-up to saving a life</h2>
        </div>
        <div className="process-grid">
          {STEPS.map((step) => (
            <div className="process-card reveal" key={step.n}>
              <span className="process-number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <PulseDivider />

      {/* Blood type compatibility — real, useful reference data */}
      <section className="compat-section">
        <div className="section-heading reveal">
          <span className="section-eyebrow">Know your type</span>
          <h2>Every type has someone who needs exactly it</h2>
        </div>
        <div className="compat-grid">
          {BLOOD_TYPES.map((bt, i) => (
            <div
              className="compat-card reveal"
              key={bt.type}
              tabIndex={0}
              style={{ "--stagger": i }}
            >
              <div className="compat-card-inner">
                <div className="compat-face compat-front">
                  <span className="compat-type">{bt.type}</span>
                  {bt.note && <span className="compat-note">{bt.note}</span>}
                </div>
                <div className="compat-face compat-back">
                  <p>
                    <strong>Gives to</strong> {bt.gives}
                  </p>
                  <p>
                    <strong>Receives from</strong> {bt.receives}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="cta-section reveal">
        {isLoggedIn ? (
          <>
            <h2>Welcome back{userName ? `, ${userName}` : ""}.</h2>
            <p>Pick up right where you left off.</p>
            <div className="cta-buttons">
              <button onClick={goToDashboard} className="btn-primary">
                Go to Dashboard
              </button>
              <button onClick={() => navigate("/inventory")} className="btn-secondary">
                Check Inventory
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>There's no substitute for blood — only people willing to give it.</h2>
            <p>Join the registry and we'll let you know when your type is needed.</p>
            {/* <div className="cta-buttons">
              <Link to="/signup" className="btn-primary">
                Join the Registry
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </div> */}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;