const express = require("express");
const { getUserDashboard, bloodRequest, scheduleAppointment } = require("../controllers/user");
const { checkAuth, userOnly } = require("../middlewares/auth");
const {
  logout,

  updateProfile,
  authCheck,
} = require("../controllers/auth");

const router = express.Router();

router.use(checkAuth);
router.use(userOnly);

// User routes
router.get("/dashboard",  getUserDashboard);
router.post("/blood-request", bloodRequest);
router.post("/logout", logout);
router.post("/schedule-appointment", scheduleAppointment);

router.put("/update-profile", updateProfile);
router.get("/auth-check", authCheck);
module.exports = router;
