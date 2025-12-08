const express = require("express");
const { login, signup } = require("../controllers/auth");
const router = express.Router();

const { requestPasswordReset, resetPassword } = require("../controllers/auth");
// Public routes for authentication
router.post("/signup", signup);

router.post("/login", login);

router.post("/requestPasswordReset", requestPasswordReset);

// Route to reset password
router.post("/resetPassword", resetPassword);

module.exports = router;
