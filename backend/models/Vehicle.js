const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicle_type: {
      type: String,
      required: true,
      enum: ["sedan", "suv", "luxury", "van", "mini van"],
    },
    registration_number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 1,
    },
    assigned_driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    availability_status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available",
    },
    fare_per_km: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    collection: "vehicles",
    timestamps: true,
  }
);

vehicleSchema.index({ vehicle_type: 1 });
vehicleSchema.index({ availability_status: 1 });
vehicleSchema.index({ assigned_driver_id: 1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
