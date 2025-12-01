const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
   name:{
    type: String,
    required: true,
   },
DOB:{
    type: Date,
    required: true,
},
    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    }, 

    location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
    },
    bloodType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
