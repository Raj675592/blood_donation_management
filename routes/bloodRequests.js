const express = require("express");
const {
  getAllBloodRequests,
  acceptBloodrequest,
  rejectBloodrequest,
} = require("../controllers/admin");

const router = express.Router();
const { checkAuth, adminOnly } = require("../middlewares/auth");
router.use(checkAuth);
router.use(adminOnly);

// Admin routes for blood request management
router.get("/", getAllBloodRequests);
router.post("/:id/accept", acceptBloodrequest);
router.post("/:id/reject", rejectBloodrequest);

module.exports = router;
