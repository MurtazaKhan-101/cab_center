const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      trim: true,
    },
    contact_number: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    no_of_passengers: {
      type: Number,
      required: true,
      min: 1,
    },
    special_requirements: {
      type: String,
      default: "",
      trim: true,
    },
    pickup: {
      type: String,
      required: true,
      trim: true,
    },
    drop: {
      type: String,
      required: true,
      trim: true,
    },
    distance_km: {
      type: Number,
      default: 0,
      min: 0,
    },
    vehicle_type: {
      type: String,
      required: true,
      enum: ["sedan", "suv", "luxury", "van", "mini"],
    },
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    total_fare: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    rejection_reason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    collection: "bookings",
    timestamps: true,
  }
);

bookingSchema.index({ user_id: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ vehicle_id: 1 });
bookingSchema.index({ driver_id: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
