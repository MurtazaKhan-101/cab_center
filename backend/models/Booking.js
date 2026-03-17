const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    service_type: {
      type: String,
      enum: ["transfer", "hourly"],
      default: "transfer",
    },
    first_name: {
      type: String,
      trim: true,
      default: "",
    },
    last_name: {
      type: String,
      trim: true,
      default: "",
    },
    user_name: {
      type: String,
      trim: true,
      default: "",
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
      enum: [
        "economy",
        "standard",
        "first_class",
        "standard_van",
        "first_class_van",
        "minibus",
      ],
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
    payment_method: {
      type: String,
      enum: ["cash", "card", "paypal"],
      default: "card",
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
    flight_number: {
      type: String,
      trim: true,
      default: "",
    },
    child_seat: {
      type: Boolean,
      default: false,
    },
    driver_notes: {
      type: String,
      trim: true,
      default: "",
    },
    meet_greet_name: {
      type: String,
      trim: true,
      default: "",
    },
    is_round_trip: {
      type: Boolean,
      default: false,
    },
    return_date: {
      type: Date,
      default: null,
    },
    return_time: {
      type: String,
      trim: true,
      default: "",
    },
    duration_hours: {
      type: Number,
      min: 1,
      default: null,
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
