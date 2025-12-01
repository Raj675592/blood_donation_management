import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Home from "./pages/Home";
import UserDashboard from "./components/user/Dashboard";
import BloodRequest from "./components/user/BloodRequest";

import ScheduleAppointment from "./components/user/ScheduleAppointment";
import AdminDashboard from "./components/admin/AdminDashboard";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <header className="App-header">
          <Router>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/blood-request" element={<BloodRequest />} />
            
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </header>
    </div>
    </ToastProvider>
  );
}

export default App;
