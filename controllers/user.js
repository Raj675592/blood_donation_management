const User = require("../models/user");
const Appointment = require("../models/Appointment");
const BloodRequest = require("../models/BloodRequest");
const BloodInventory = require("../models/BloodInventory"); // Ensure this model is defined correctly

const getUserDashboard = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const appointmentStats = await Appointment.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get all appointments

    const recentAppointments = await Appointment.find({ userId: user._id })
      .sort({ appointmentDate: -1 })
      .select("appointmentDate timeSlot location status");

    const bloodRequestStats = await BloodRequest.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get all blood requests

    const recentBloodRequests = await BloodRequest.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select(
        "patientName bloodType unitsNeeded urgencyLevel status hospitalName createdAt"
      );

    // Calculate total donations (completed appointments) - with safety check
    const totalDonations =
      appointmentStats.find((stat) => stat._id === "completed")?.count || 0;

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
    const { name, appointmentDate, timeSlot, location, bloodType, notes } =
      req.body;
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
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
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
      status: { $in: ["scheduled", "confirmed"] },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an appointment scheduled for this date and time",
      });
    }

    // Create new appointment with default status
    const newAppointment = await Appointment.create({
      userId: req.user.id,
      name,
      appointmentDate,
      timeSlot,
      location,
      status: "scheduled", // Default status for new appointments
      bloodType,
      notes: notes || "",
      DOB: user.dateOfBirth, // Get from authenticated user data
    });

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

const getInventoryOverview = async (req, res) => {
  try {
    // Fetch blood inventory overview

    const bloodInventory = await BloodInventory.find();
    res.status(200).json({
      success: true,
      bloodInventory,
    });
  } catch (error) {
    console.error("Get inventory overview error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserDashboard,
  bloodRequest,
  scheduleAppointment,
  getInventoryOverview,
};
