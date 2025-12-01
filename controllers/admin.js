const mongoose = require("mongoose");
const User = require("../models/user");
const BloodRequest = require("../models/BloodRequest");
const Appointment = require("../models/Appointment");
const BloodInventory = require("../models/BloodInventory");

const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    const users = await User.find().select("-password -__v ");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    const user = await User.findById(req.params.id).select(
      "-password -__v "
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

    // Get dashboard statistics
    const totalUsers = await User.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const lowStockItems = await BloodInventory.find({
      unitsAvailable: { $lt: 10 },
    });

    // Get all activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .select("name email createdAt bloodType");
    const recentRequests = await BloodRequest.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        stats: {
          totalUsers,
          totalRequests,
          totalAppointments,
          lowStockCount: lowStockItems.length,
          lowStockItems: lowStockItems,
        },
        recentActivities: {
          users: recentUsers,
          requests: recentRequests,
          appointments: recentAppointments,
        },
      },
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({
      success: true,
      message: "User promoted to admin",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Promote to admin error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const demoteToUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.role = "user";
    await user.save();
    res.status(200).json({
      success: true,
      message: "User demoted to user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Demote to user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete users",
      });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: `User with id ${user._id} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllBloodRequests = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

    const bloodRequests = await BloodRequest.find()
      .populate("userId", "name email phone bloodType")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bloodRequests.length,
      bloodRequests,
    });
  } catch (error) {
    console.error("Get all blood requests error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const acceptBloodrequest = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood request ID format",
      });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }
    
    // Update the request status
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Failed to update blood request",
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Blood request for ${updatedRequest.patientName} accepted successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error accepting blood request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept blood request",
    });
  }
};

const rejectBloodrequest = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood request ID format",
      });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }
    
    // Use findByIdAndUpdate for consistency
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Failed to update blood request",
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Blood request for ${updatedRequest.patientName} rejected`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Reject blood request error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

    const appointments = await Appointment.find()
      .populate("userId", "name email phone bloodType")
      .sort({ appointmentDate: 1 });
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const markAppointmentCompleted = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    appointment.status = "completed";
    await appointment.save();
    res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
      appointment,
    });
  } catch (error) {
    console.error("Mark appointment completed error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getInventoryOverview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }

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

const addBloodInventory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const { bloodType, unitsAvailable, expiryDate, location } = req.body;

    // Validate required fields
    if (!bloodType || !unitsAvailable || !expiryDate || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields (bloodType, unitsAvailable, expiryDate, location) are required",
      });
    }

    // Create new inventory entry (don't merge with existing for now to maintain separate entries)
    const newInventory = new BloodInventory({ 
      bloodType, 
      unitsAvailable: parseInt(unitsAvailable),
      expiryDate: new Date(expiryDate),
      location 
    });
    await newInventory.save();
    res.status(201).json({
      success: true,
      message: "Blood inventory added successfully",
      inventory: newInventory,
    });
  } catch (error) {
    console.error("Add blood inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateBloodInventory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const { bloodType, unitsAvailable, expiryDate, location } = req.body;
    const inventory = await BloodInventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Blood inventory not found",
      });
    }
    inventory.bloodType = bloodType || inventory.bloodType;
    inventory.unitsAvailable = unitsAvailable ? parseInt(unitsAvailable) : inventory.unitsAvailable;
    inventory.expiryDate = expiryDate ? new Date(expiryDate) : inventory.expiryDate;
    inventory.location = location || inventory.location;
    await inventory.save();
    res.status(200).json({
      success: true,
      message: "Blood inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update blood inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteBloodInventory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const inventory = await BloodInventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Blood inventory not found",
      });
    }
    await BloodInventory.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blood inventory deleted successfully",
    });
  } catch (error) {
    console.error("Delete blood inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLowStockAlerts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const lowStockItems = await BloodInventory.find({
      unitsAvailable: { $lt: 10 },
    });
    res.status(200).json({
      success: true,
      lowStockItems,
    });
  } catch (error) {
    console.error("Get low stock alerts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const rescheduleAppointment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
      });
    }
    const { appointmentDate, timeSlot } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    appointment.appointmentDate =
      appointmentDate || appointment.appointmentDate;
    appointment.timeSlot = timeSlot || appointment.timeSlot;
    await appointment.save();
    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Reschedule appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAdminDashboard,
  promoteToAdmin,
  demoteToUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllBloodRequests,
  acceptBloodrequest,
  rejectBloodrequest,
  getAllAppointments,
  cancelAppointment,
  deleteAppointment,
  rescheduleAppointment,
  markAppointmentCompleted,
  getInventoryOverview,
  addBloodInventory,
  updateBloodInventory,
  deleteBloodInventory,
  getLowStockAlerts,
};
