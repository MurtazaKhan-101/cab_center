const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    license_number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    assigned_vehicle_type: {
      type: String,
      enum: ["sedan", "suv", "luxury", "van", "mini", null],
      default: null,
    },
    assigned_vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    total_rides: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthly_presents: {
      type: Number,
      default: 0,
      min: 0,
      max: 31,
    },
    availability_status: {
      type: String,
      enum: ["available", "on-ride", "off-duty"],
      default: "available",
    },
    monthly_salary: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: "drivers",
    timestamps: true,
  }
);

driverSchema.index({ availability_status: 1 });
driverSchema.index({ assigned_vehicle_id: 1 });

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
