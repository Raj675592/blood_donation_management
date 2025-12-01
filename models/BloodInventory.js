const mongoose = require("mongoose");
const bloodInventorySchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
  },
  unitsAvailable: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
const BloodInventory = mongoose.model("BloodInventory", bloodInventorySchema);
module.exports = BloodInventory;
