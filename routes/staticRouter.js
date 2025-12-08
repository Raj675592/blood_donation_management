const express = require("express");
const path = require("path");
const { checkAuth, adminOnly } = require("../middlewares/auth");


const router = express.Router();

// =======================
// SERVE REACT APP FUNCTION
// =======================
const serveReactApp = (req, res) => {
  // Development mode - serve React app from public folder
  const indexPath = path.join(__dirname, "../client/public/index.html");
  res.sendFile(indexPath);
};


// =======================
// PUBLIC ROUTES (No Authentication)
// =======================

// Home page
router.get("/", serveReactApp);

// Authentication pages
router.get("/login", serveReactApp);
router.get("/signup", serveReactApp);


// Information pages
router.get("/about", serveReactApp);
router.get("/contact", serveReactApp);
router.get("/blood-drives", serveReactApp);

// =======================
// USER ROUTES (Authentication Required)
// =======================

// User dashboard and profile
router.get("/dashboard", checkAuth, serveReactApp);
router.get("/profile", checkAuth, serveReactApp);

// User appointments
router.get("/my-appointments", checkAuth, serveReactApp);
router.get("/schedule-appointment", checkAuth, serveReactApp);
router.get("/appointment/:id", checkAuth, serveReactApp);

// User blood requests
router.get("/my-blood-requests", checkAuth, serveReactApp);
router.get("/request-blood", checkAuth, serveReactApp);
router.get("/blood-request/:id", checkAuth, serveReactApp);

// =======================
// ADMIN ROUTES (Authentication Required)
// =======================

// Admin dashboard
router.get("/admin", checkAuth, adminOnly, serveReactApp);
router.get("/admin/dashboard", checkAuth, adminOnly, serveReactApp);

// Admin management pages
router.get("/admin/users", checkAuth, adminOnly, serveReactApp);
router.get("/admin/blood-requests", checkAuth, adminOnly, serveReactApp);
router.get("/admin/appointments", checkAuth, adminOnly, serveReactApp);
router.get("/admin/inventory", checkAuth, adminOnly, serveReactApp);

// Admin detail pages
router.get("/admin/user/:id", checkAuth, adminOnly, serveReactApp);
router.get("/admin/blood-request/:id", checkAuth, adminOnly, serveReactApp);
router.get("/admin/appointment/:id", checkAuth, adminOnly, serveReactApp);

// Admin reports
router.get("/admin/reports", checkAuth, adminOnly, serveReactApp);
router.get("/admin/statistics", checkAuth, adminOnly, serveReactApp);

// =======================
// CATCH-ALL ROUTE (Must be last!)
// =======================

// Handle any other routes - let React Router handle them
// Use regex pattern instead of * wildcard
router.get(/.*/, serveReactApp);

module.exports = router;
