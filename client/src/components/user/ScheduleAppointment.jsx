import { useState } from "react";
import "../../css/BloodRequest.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../pages/Footer";
import { useToast } from "../../contexts/ToastContext";

/* ------------------------------------------------------------------ */
/*  Small inline icon set (same line-icon language as the rest of    */
/*  the app)                                                          */
/* ------------------------------------------------------------------ */
const iconBase = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconUser({ className }) {
  return (
    <svg className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
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

/* Tiny traveling pulse used for the submit button's loading state */
function MiniPulse({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="br-mini-pulse__path"
        d="M0,12 L24,12 L30,3 L36,21 L42,6 L48,12 L80,12"
      />
    </svg>
  );
}

function ScheduleAppointment() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

  const [formData, setFormData] = useState({

    name: "",
    appointmentDate: "",
    timeSlot: "",
    location: "",

    bloodType: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/schedule-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (response.ok && result.success) {
        const message = "Appointment scheduled successfully! Redirecting to dashboard...";
        showToast(message, 'success');

        setFormData({
          name: "",
          appointmentDate: "",
          timeSlot: "",
          location: "",
          bloodType: "",
          notes: "",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        const errorMsg = result.message || "Failed to schedule appointment";
        showToast(errorMsg, 'error');
        console.error("Appointment scheduling failed:", result);
      }
    } catch (error) {
      const errorMsg = "Failed to schedule appointment. Please try again.";
      showToast(errorMsg, 'error');
      console.error("Error scheduling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="br-page">
        <div className="br-page__header">
          <span className="br-page__badge br-page__badge--calm">
            <IconCalendar className="br-page__badge-icon" />
            Appointment booking
          </span>
          <h1 className="br-page__title">Schedule a donation appointment</h1>
          <p className="br-page__subtitle">
            Pick a date, time, and location that works for you. Bring a
            valid ID and arrive well hydrated.
          </p>
        </div>

        <div className="br-form-wrap">
          <form className="br-form" onSubmit={handleSubmit}>
            <div className="br-section br-section--calm" style={{ animationDelay: "0ms" }}>
              <h3 className="br-section__title">
                <span className="br-section__icon-wrap br-section__icon-wrap--calm">
                  <IconUser className="br-section__icon" />
                </span>
                Donor information
              </h3>

              <div className="br-field">
                <label htmlFor="donorName">Donor name *</label>
                <input
                  type="text"
                  id="donorName"
                  name="name"
                  placeholder="Enter donor's full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="br-field-row">
                <div className="br-field">
                  <label htmlFor="bloodType">Blood type *</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
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

                <div className="br-field">
                  <label htmlFor="appointmentDate">Appointment date *</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="br-field-row">
                <div className="br-field">
                  <label htmlFor="timeSlot">Time slot *</label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select time slot</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>

                <div className="br-field">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter appointment location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="br-field">
                <label htmlFor="notes">Additional notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="br-form__actions">
              <button
                type="button"
                className="br-btn br-btn--ghost"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button type="submit" className="br-btn br-btn--primary" disabled={loading}>
                {loading ? (
                  <>
                    <MiniPulse className="br-btn__pulse" />
                    Scheduling…
                  </>
                ) : (
                  <>Schedule appointment</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ScheduleAppointment;