const mongoose = require("mongoose");
const bloodRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
    },
    unitsNeeded: {
      type: Number,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    urgencyLevel: {
      type: String,
      
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected" ],
      default: "pending",
    },
    additionalNotes: { type: String ,
      default:"Urgently needed"
    },
  },
  { timestamps: true }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;
