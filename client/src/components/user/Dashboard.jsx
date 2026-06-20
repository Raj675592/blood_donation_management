import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/userDashboard.css";
import Footer from "../../pages/Footer";
import { useToast } from "../../contexts/ToastContext";

/* ------------------------------------------------------------------ */
/*  Small inline icon set                                            */
/*  (line icons, single stroke weight, no external icon dependency)  */
/* ------------------------------------------------------------------ */
const iconBase = {
  width: 20,
  height: 20,
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
function IconCalendar({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
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
function IconClock({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 1.8" />
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
function IconTag({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M11 3.5h4.5a2 2 0 0 1 1.4.6l3.9 3.9a2 2 0 0 1 0 2.8l-7 7a2 2 0 0 1-2.8 0l-5.9-5.9a2 2 0 0 1-.6-1.4V6a2.5 2.5 0 0 1 2.5-2.5Z" />
      <circle cx="10" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLogout({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M9 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3" />
      <path d="M14 8l4 4-4 4M18 12H9" />
    </svg>
  );
}
function IconEdit({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M4 20l1-4.2L15.8 5a1.4 1.4 0 0 1 2 0l1.2 1.2a1.4 1.4 0 0 1 0 2L8.2 19 4 20Z" />
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
function IconPlus({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  );
}
function IconCheck({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
function IconX({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Signature motif: an animated "pulse" / EKG line, reused as the    */
/*  header backdrop, section dividers, and the loading indicator.     */
/* ------------------------------------------------------------------ */
function PulseLine({ variant = "divider" }) {
  const isHeader = variant === "header";
  const viewBox = isHeader ? "0 0 600 90" : "0 0 800 30";
  const d = isHeader
    ? "M0,45 L60,45 L75,15 L90,75 L105,20 L120,45 L210,45 L225,12 L240,78 L255,18 L270,45 L600,45"
    : "M0,15 L340,15 L353,4 L366,26 L379,8 L392,15 L800,15";

  return (
    <svg
      className={`ud-pulse ud-pulse--${variant}`}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ud-pulse__trace" d={d} />
      <path className="ud-pulse__beat" d={d} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Count-up hook used for the vitals/stat numbers.                   */
/*  Purely presentational — does not touch any fetched data.          */
/* ------------------------------------------------------------------ */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    startRef.current = null;
    let frame;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function StatNumber({ value }) {
  const isNumeric = typeof value === "number" && !Number.isNaN(value);
  const animated = useCountUp(isNumeric ? value : 0);
  if (isNumeric) return <>{animated}</>;
  return <>{value ?? "—"}</>;
}

/* ------------------------------------------------------------------ */
/*  Status badge — same conditional text/logic as the original,      */
/*  only the presentation (icon + pill) changed.                     */
/* ------------------------------------------------------------------ */
function StatusBadge({ status, kind }) {
  // kind: "appointment" | "request" — only changes which "good" word is used
  const isGood = kind === "appointment" ? status === "completed" : status === "fulfilled";
  const isWaiting = kind === "appointment" ? status === "scheduled" : status === "pending";
  const isCancelled = status === "cancelled";

  let icon = <IconAlert className="ud-badge__icon" />;
  let label = status;
  let tone = "default";

  if (isGood) {
    icon = <IconCheck className="ud-badge__icon" />;
    label = kind === "appointment" ? "Completed" : "Fulfilled";
    tone = "good";
  } else if (isWaiting) {
    icon = <IconClock className="ud-badge__icon" />;
    label = kind === "appointment" ? "Scheduled" : "Pending";
    tone = "waiting";
  } else if (isCancelled) {
    icon = <IconX className="ud-badge__icon" />;
    label = "Cancelled";
    tone = "cancelled";
  }

  return (
    <span className={`ud-badge ud-badge--${tone}`}>
      {icon}
      {label}
    </span>
  );
}

function UserDashboard() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const { showToast } = useToast();

  const [updateData, setUpdateData] = useState({
    bloodType: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/users/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        // Update the dashboard data with new user info
        setDashboardData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...result.user,
          },
        }));

        // Close modal and show success
        setModal(false);
        setError(""); // Clear any previous errors
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const getUserDashboard = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/users/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch user dashboard");
      }

      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [navigate, API_BASE_URL]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Clear all stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Navigate to home
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server request fails
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }
  };
  // Check for status changes in user's blood requests
  const checkForNotifications = useCallback(async () => {
    try {
      if (dashboardData?.bloodRequests) {

        // Check for status changes
        dashboardData.bloodRequests.forEach(request => {
          const statusChangeKey = `bloodrequest_${request._id}_status`;
          const lastKnownStatus = localStorage.getItem(statusChangeKey);

          if (lastKnownStatus && lastKnownStatus !== request.status) {
            let message = '';
            if (request.status === 'accepted') {
              message = `Great news! Your blood request for ${request.patientName} has been accepted by the admin.`;
            } else if (request.status === 'rejected') {
              message = `Your blood request for ${request.patientName} has been rejected. Please contact support for more information.`;
            }

            if (message) {
              showToast(message, request.status === 'accepted' ? 'success' : 'error');
            }
          }

          // Store current status
          localStorage.setItem(statusChangeKey, request.status);
        });

      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }, [dashboardData?.bloodRequests, showToast]);

  useEffect(() => {
    getUserDashboard();
  }, [getUserDashboard]);

  // Check for notifications every time dashboard data changes
  useEffect(() => {
    if (dashboardData) {
      checkForNotifications();
    }
  }, [dashboardData, checkForNotifications]);

  if (loading) {
    return (
      <div className="ud-page ud-page--state">
        <div className="ud-loader">
          <svg
            className="ud-loader__pulse"
            viewBox="0 0 240 70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="ud-loader__trace"
              d="M0,35 L55,35 L68,10 L81,60 L94,16 L107,35 L240,35"
            />
            <path
              className="ud-loader__beat"
              d="M0,35 L55,35 L68,10 L81,60 L94,16 L107,35 L240,35"
            />
          </svg>
          <p className="ud-loader__label" aria-live="polite">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ud-page ud-page--state">
        <div className="ud-state-card ud-state-card--error">
          <IconAlert className="ud-state-card__icon" />
          <h3>{error}</h3>
          <button onClick={() => window.location.reload()} className="ud-btn ud-btn--primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="ud-page ud-page--state">
        <div className="ud-state-card">
          <IconBox className="ud-state-card__icon" />
          <h3>No data available</h3>
          <button onClick={getUserDashboard} className="ud-btn ud-btn--primary">
            Reload
          </button>
        </div>
      </div>
    );
  }

  const { user, stats, upcomingAppointment, recentActivity, lastLogin } =
    dashboardData;

  return (
    <>
      <div className="ud-page">
        {/* Header */}
        <header className="ud-header">
          <PulseLine variant="header" />
          <div className="ud-header__content">
            <p className="ud-header__eyebrow">Donor dashboard</p>
            <h1 className="ud-header__title">
              Welcome back,{" "}
              <span className="ud-header__name">
                {user?.name.toUpperCase() || "User"}
              </span>
            </h1>
          </div>
          <button onClick={handleLogout} className="ud-logout-btn">
            <IconLogout className="ud-logout-btn__icon" />
            <span>Logout</span>
          </button>
        </header>

        {/* Main Dashboard Content */}
        <main className="ud-main">
          <section className="ud-top-grid">
            {/* User Profile Card */}
            <div className="ud-donor-card">
              <div className="ud-donor-card__top">
                <div className="ud-donor-card__avatar">
                  <span className="ud-donor-card__avatar-text">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="ud-donor-card__identity">
                  <h2 className="ud-donor-card__name">
                    {user?.name.toUpperCase() || "Unknown User"}
                  </h2>
                  <p className="ud-donor-card__email">{user?.email}</p>
                </div>
              </div>

              <div className="ud-donor-card__pills">
                <span className="ud-pill">
                  <IconDrop className="ud-pill__icon" />
                  {user?.bloodType || "Not specified"}
                </span>
                <span className="ud-pill">
                  <IconPhone className="ud-pill__icon" />
                  {user?.phone || "Not provided"}
                </span>
                <span className="ud-pill">
                  <IconClock className="ud-pill__icon" />
                  Last seen:&nbsp;
                  {lastLogin ? new Date(lastLogin).toLocaleString() : "N/A"}
                </span>
                <span className="ud-pill">
                  <IconCalendar className="ud-pill__icon" />
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </span>
                <span className="ud-pill">
                  <IconTag className="ud-pill__icon" />
                  {user?.gender || "Not specified"}
                </span>
              </div>
            </div>

            {/* Profile Update Modal */}
            {modal && (
              <div className="ud-modal-overlay">
                <div className="ud-modal" role="dialog" aria-modal="true" aria-labelledby="ud-modal-title">
                  <div className="ud-modal__header">
                    <h3 id="ud-modal-title">Edit profile</h3>
                    <button
                      onClick={() => setModal(false)}
                      className="ud-modal__close"
                      aria-label="Close"
                    >
                      <IconX className="ud-modal__close-icon" />
                    </button>
                  </div>
                  {error && <div className="ud-modal__error">{error}</div>}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateProfile(updateData);
                    }}
                    className="ud-modal__form"
                  >
                    <div className="ud-field">
                      <label>Blood type</label>
                      <select
                        value={updateData.bloodType}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            bloodType: e.target.value,
                          })
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
                    <div className="ud-field">
                      <label>Phone number</label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={updateData.phone}
                        onChange={(e) =>
                          setUpdateData({ ...updateData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="ud-field">
                      <label>Date of birth</label>
                      <input
                        type="date"
                        value={updateData.dateOfBirth}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="ud-field">
                      <label>Gender</label>
                      <select
                        value={updateData.gender}
                        onChange={(e) =>
                          setUpdateData({ ...updateData, gender: e.target.value })
                        }
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="ud-modal__actions">
                      <button
                        type="button"
                        onClick={() => setModal(false)}
                        className="ud-btn ud-btn--ghost"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ud-btn ud-btn--primary"
                        disabled={loading}
                      >
                        {loading ? "Updating…" : "Update profile"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="ud-vitals">
              <div className="ud-vital-card" style={{ animationDelay: "0ms" }}>
                <div className="ud-vital-card__top">
                  <span className="ud-vital-card__icon-wrap ud-vital-card__icon-wrap--donations">
                    <IconDrop className="ud-vital-card__icon" />
                  </span>
                  <span className="ud-vital-card__value">
                    <StatNumber value={stats?.totalDonations} />
                  </span>
                </div>
                <p className="ud-vital-card__label">Total donations</p>
                <PulseLine variant="divider" />
              </div>

              <div className="ud-vital-card" style={{ animationDelay: "80ms" }}>
                <div className="ud-vital-card__top">
                  <span className="ud-vital-card__icon-wrap ud-vital-card__icon-wrap--appointments">
                    <IconCalendar className="ud-vital-card__icon" />
                  </span>
                  <span className="ud-vital-card__value">
                    <StatNumber value={stats?.totalAppointments} />
                  </span>
                </div>
                <p className="ud-vital-card__label">Total appointments</p>
                <PulseLine variant="divider" />
              </div>

              <div className="ud-vital-card" style={{ animationDelay: "160ms" }}>
                <div className="ud-vital-card__top">
                  <span className="ud-vital-card__icon-wrap ud-vital-card__icon-wrap--requests">
                    <IconAlert className="ud-vital-card__icon" />
                  </span>
                  <span className="ud-vital-card__value">
                    <StatNumber value={stats?.totalBloodRequests} />
                  </span>
                </div>
                <p className="ud-vital-card__label">Blood requests</p>
                <PulseLine variant="divider" />
              </div>

              <div className="ud-vital-card" style={{ animationDelay: "240ms" }}>
                <div className="ud-vital-card__top">
                  <span className="ud-vital-card__icon-wrap ud-vital-card__icon-wrap--next">
                    <IconClock className="ud-vital-card__icon" />
                  </span>
                  <span className="ud-vital-card__value ud-vital-card__value--text">
                    <StatNumber value={upcomingAppointment ? "Scheduled" : "None"} />
                  </span>
                </div>
                <p className="ud-vital-card__label">Next appointment</p>
                <PulseLine variant="divider" />
              </div>
            </div>
          </section>

          <div className="ud-pulse-divider">
            <PulseLine variant="divider" />
          </div>

          {/* Recent Activity */}
          <section className="ud-activity">
            <div className="ud-ledger ud-ledger--appointments">
              <h3 className="ud-ledger__title">
                <IconCalendar className="ud-ledger__title-icon" />
                Recent appointments
              </h3>
              {recentActivity?.Recentappointments?.length > 0 ? (
                <div className="ud-ledger__list">
                  {recentActivity.Recentappointments.slice(0, 5).map(
                    (appointment, index) => (
                      <div
                        key={index}
                        className="ud-ledger-item"
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        <div className="ud-ledger-item__date">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()}
                        </div>
                        <div className="ud-ledger-item__body">
                          <span className="ud-ledger-item__primary">
                            {appointment.timeSlot}
                          </span>
                          <span className="ud-ledger-item__secondary">
                            {appointment.location}
                          </span>
                        </div>
                        <StatusBadge status={appointment.status} kind="appointment" />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="ud-ledger__empty">
                  No recent appointments found. Schedule your first donation!
                </p>
              )}
            </div>

            <div className="ud-ledger ud-ledger--requests">
              <h3 className="ud-ledger__title">
                <IconAlert className="ud-ledger__title-icon" />
                Recent blood requests
              </h3>
              {recentActivity?.RecentbloodRequests?.length > 0 ? (
                <div className="ud-ledger__list">
                  {recentActivity.RecentbloodRequests.slice(0, 5).map(
                    (request, index) => (
                      <div
                        key={index}
                        className="ud-ledger-item"
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        <div className="ud-ledger-item__date">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        <div className="ud-ledger-item__body">
                          <span className="ud-ledger-item__primary">
                            {request.patientName} · {request.bloodType}
                          </span>
                          <span className="ud-ledger-item__secondary">
                            {request.unitsNeeded} units · Urgency: {request.urgencyLevel}
                          </span>
                        </div>
                        <StatusBadge status={request.status} kind="request" />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="ud-ledger__empty">No recent blood requests found.</p>
              )}
            </div>
          </section>

          {/* Upcoming Appointment Card */}
          {upcomingAppointment && (
            <section className="ud-upcoming">
              <div className="ud-upcoming__heading">
                <IconCalendar className="ud-upcoming__icon" />
                <h3>Your next appointment</h3>
              </div>
              <div className="ud-upcoming__grid">
                <div className="ud-upcoming__item">
                  <span className="ud-upcoming__item-label">Date</span>
                  <span className="ud-upcoming__item-value">
                    {new Date(upcomingAppointment.appointmentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="ud-upcoming__item">
                  <span className="ud-upcoming__item-label">Time</span>
                  <span className="ud-upcoming__item-value">
                    {upcomingAppointment.timeSlot}
                  </span>
                </div>
                <div className="ud-upcoming__item">
                  <span className="ud-upcoming__item-label">Location</span>
                  <span className="ud-upcoming__item-value">
                    {upcomingAppointment.location}
                  </span>
                </div>
                <div className="ud-upcoming__item">
                  <span className="ud-upcoming__item-label">Status</span>
                  <span className="ud-upcoming__item-value">
                    {upcomingAppointment.status}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="ud-actions">
            <h3 className="ud-actions__title">Quick actions</h3>
            <div className="ud-actions__grid">
              <button
                className="ud-action-tile ud-action-tile--schedule"
                onClick={() => navigate("/schedule-appointment")}
              >
                <span className="ud-action-tile__icon-wrap">
                  <IconPlus className="ud-action-tile__icon" />
                </span>
                Schedule donation
              </button>
              <button
                onClick={() => navigate("/blood-request")}
                className="ud-action-tile ud-action-tile--request"
              >
                <span className="ud-action-tile__icon-wrap">
                  <IconAlert className="ud-action-tile__icon" />
                </span>
                Request blood
              </button>
              <button
                onClick={() => {
                  setUpdateData({
                    bloodType: user?.bloodType || "",
                    phone: user?.phone || "",
                    dateOfBirth: user?.dateOfBirth
                      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                      : "",
                    gender: user?.gender || "",
                  });
                  setModal(true);
                }}
                className="ud-action-tile ud-action-tile--edit"
              >
                <span className="ud-action-tile__icon-wrap">
                  <IconEdit className="ud-action-tile__icon" />
                </span>
                Edit profile
              </button>
              <button
                onClick={() => navigate("/inventory")}
                className="ud-action-tile ud-action-tile--inventory"
              >
                <span className="ud-action-tile__icon-wrap">
                  <IconBox className="ud-action-tile__icon" />
                </span>
                Available inventory
              </button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default UserDashboard;