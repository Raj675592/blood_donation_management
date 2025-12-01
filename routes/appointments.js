const express = require("express");
const {
  getAllAppointments,
  cancelAppointment,
  deleteAppointment,
  rescheduleAppointment,
  markAppointmentCompleted,
} = require("../controllers/admin");

const { checkAuth, adminOnly } = require("../middlewares/auth");

const router = express.Router();
router.use(checkAuth);
router.use(adminOnly);

// Admin routes for appointment management
router.get("/", getAllAppointments);
router.put("/:id/cancel", cancelAppointment);
router.delete("/:id", deleteAppointment);
router.put("/:id/reschedule", rescheduleAppointment);
router.put("/:id/complete", markAppointmentCompleted);

module.exports = router;
