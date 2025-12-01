const express = require("express");
const { login, signup } = require("../controllers/auth");
const router = express.Router();

// Public routes for authentication
router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
