import { useState } from "react";
import "../../css/BloodRequest.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../pages/Footer";
import { useToast } from "../../contexts/ToastContext";

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
  <div className="blood-request-container">
    <div className="blood-request-header">
      <h1 className="blood-request-title"> Schedule Appointment</h1>
      <p className="blood-request-subtitle">
        Schedule an appointment to help save a life. All requests are
        prioritized .
      </p>
    </div>

    <div className="form-container">
      <form className="blood-request-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">👤 Donor Information</h3>

          <div className="form-group">
            <label htmlFor="donorName">Donor Name *</label>
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

          <div className="form-group">
            <label htmlFor="bloodType">Blood Type *</label>
            <select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Type</option>
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
          <div className="form-group">
            <label htmlFor="appointmentDate">Appointment Date *</label>
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
          <div className="form-group">
            <label htmlFor="timeSlot">Time Slot *</label>
            <select
              id="timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select Time Slot</option>
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

          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any additional information"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
            style={{ color: 'black' }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ color: 'green' }} disabled={loading}>
            {loading ? "Scheduling..." : "Schedule Appointment"}
          </button>
        </div>
      </form>
    </div>
     <Footer />
  </div>
 
    </>
);
}

export default ScheduleAppointment;