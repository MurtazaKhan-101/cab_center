const mongoose = require("mongoose");

const rushHourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  start_time: {
    type: String,
    required: true,
    trim: true,
  },
  end_time: {
    type: String,
    required: true,
    trim: true,
  },
  multiplier: {
    type: Number,
    required: true,
    min: 1,
    default: 1.5,
  },
});

const settingsSchema = new mongoose.Schema(
  {
    rush_hours: {
      type: [rushHourSchema],
      default: [],
    },
    base_fare: {
      type: Number,
      default: 50,
      min: 0,
    },
    currency: {
      type: String,
      default: "PKR",
    },
  },
  {
    collection: "settings",
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
