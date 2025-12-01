const express = require("express");
const {
  getInventoryOverview,
  addBloodInventory,
  updateBloodInventory,
  deleteBloodInventory,
  getLowStockAlerts,
} = require("../controllers/admin");
const { checkAuth, adminOnly } = require("../middlewares/auth");

const router = express.Router();
// All routes in this file are protected and only accessible by admin users
router.use(checkAuth);
router.use(adminOnly);

router.get("/", getInventoryOverview);
router.post("/", addBloodInventory);
router.put("/:id", updateBloodInventory);
router.delete("/:id", deleteBloodInventory);
router.get("/low-stock", getLowStockAlerts);

module.exports = router;
