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
  days_of_week: {
    type: [String],
    required: true,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    validate: {
      validator: function (days) {
        return days && days.length > 0;
      },
      message: "At least one day must be selected",
    },
  },
  locations: {
    type: [String],
    required: true,
    validate: {
      validator: function (locations) {
        return locations && locations.length > 0;
      },
      message: "At least one location must be specified",
    },
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
      default: "SAR",
    },
  },
  {
    collection: "settings",
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
