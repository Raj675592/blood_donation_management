const express = require("express");
const {
  getAllUsers,
  getUserById,
  getAdminDashboard,
  promoteToAdmin,
  demoteToUser,
  deleteUser,
} = require("../controllers/admin");
const { checkAuth, adminOnly } = require("../middlewares/auth");

const router = express.Router();

router.use(checkAuth);
router.use(adminOnly);

// Admin routes for user management
router.get("/dashboard", getAdminDashboard);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/promote/:id", promoteToAdmin);
router.post("/demote/:id", demoteToUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
