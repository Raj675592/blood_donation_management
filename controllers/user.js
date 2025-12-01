const User = require("../models/user");
const Appointment = require("../models/Appointment");
const BloodRequest = require("../models/BloodRequest");

const getUserDashboard = async (req, res) => {
  try {
    console.log("Dashboard request received for user:", req.user.id);

    // Check if user exists
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      console.log("User not found:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User found:", user.name, user.email);

    // Get user's appointments with aggregated data
    console.log("Fetching appointment stats...");
    const appointmentStats = await Appointment.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("Appointment stats:", appointmentStats);

    // Get all appointments
    console.log("Fetching recent appointments...");
    const recentAppointments = await Appointment.find({ userId: user._id })
      .sort({ appointmentDate: -1 })
      .select("appointmentDate timeSlot location status");
    console.log("Recent appointments count:", recentAppointments.length);

    // Get user's blood requests with stats
    console.log("Fetching blood request stats...");
    const bloodRequestStats = await BloodRequest.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("Blood request stats:", bloodRequestStats);

    // Get all blood requests
    console.log("Fetching recent blood requests...");
    const recentBloodRequests = await BloodRequest.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select(
        "patientName bloodType unitsNeeded urgencyLevel status hospitalName createdAt"
      );
    console.log("Recent blood requests count:", recentBloodRequests.length);

    // Calculate total donations (completed appointments) - with safety check
    const totalDonations =
      appointmentStats.find((stat) => stat._id === "completed")?.count || 0;
    console.log("Total donations calculated:", totalDonations);

    // Calculate next upcoming appointment
    const upcomingAppointment = await Appointment.findOne({
      userId: user._id,
      status: "scheduled",
      appointmentDate: { $gte: new Date() },
    }).sort({ appointmentDate: 1 });

    // Prepare dashboard data with safe aggregation
    const dashboardData = {
      user,
      stats: {
        totalDonations,
        totalAppointments:
          appointmentStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
        totalBloodRequests:
          bloodRequestStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
        appointmentsByStatus:
          appointmentStats?.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}) || {},
        bloodRequestsByStatus:
          bloodRequestStats?.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}) || {},
      },
      upcomingAppointment,
      recentActivity: {
        Recentappointments: recentAppointments,
        RecentbloodRequests: recentBloodRequests,
      },
      lastLogin: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Get user dashboard error:", error);

    // More specific error handling
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};
const bloodRequest = async (req, res) => {
  try {
    console.log("Blood Request route hit");
    console.log("Processing the blood requests for user:", req.user.id);
    console.log("Request Body:", req.body);

    const {
      patientName,
      bloodType,
      unitsNeeded,
      urgencyLevel,
      hospitalName,
      contactNumber,
      additionalNotes,
    } = req.body;

    if (
      !patientName ||
      !bloodType ||
      !unitsNeeded ||
      !urgencyLevel ||
      !hospitalName ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided (patientName, bloodType, unitsNeeded, urgencyLevel, hospitalName, contactNumber)",
      });
    }

    // Create new blood request
    const newBloodRequest = await BloodRequest.create({
      userId: req.user.id, // Add userId to associate with the user
      patientName,
      bloodType,
      unitsNeeded,
      hospitalName,
      urgencyLevel,
      contactNumber,
      additionalNotes: additionalNotes || "Urgently needed",
    });

    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      data: newBloodRequest,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while creating blood request",
    });
  }
};

const scheduleAppointment = async (req, res) => {
  try {
    console.log("Scheduling appointment for user:", req.user.id);
    console.log("Request body:", req.body);

    const {
      name,
      appointmentDate,
      timeSlot,
      location,
      bloodType,
      notes,
    } = req.body;
    if (!name || !appointmentDate || !timeSlot || !location || !bloodType) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided (name, appointmentDate, timeSlot, location, bloodType)",
      });
    }

    // Validate appointment date is not in the past
    const appointmentDateObj = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    if (appointmentDateObj < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past",
      });
    }

    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood type provided",
      });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check for existing appointment on the same date and time
    const existingAppointment = await Appointment.findOne({
      userId: req.user.id,
      appointmentDate,
      timeSlot,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "You already have an appointment scheduled for this date and time",
      });
    }

    // Create new appointment with default status
    const newAppointment = await Appointment.create({
      userId: req.user.id,
      name,
      appointmentDate,
      timeSlot,
      location,
      status: 'scheduled', // Default status for new appointments
      bloodType,
      notes: notes || "",
      DOB: user.dateOfBirth, // Get from authenticated user data
    });

    console.log("Appointment created successfully:", newAppointment._id);

    res.status(201).json({
      success: true,
      message: "Appointment scheduled successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error scheduling appointment:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error while scheduling appointment",
    });
  }
};
module.exports = {
  getUserDashboard,
  bloodRequest,
  scheduleAppointment,
};
