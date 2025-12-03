const Settings = require("../models/Settings");

class SettingsController {
  // Get settings (Admin & User)
  async getSettings(req, res) {
    try {
      let settings = await Settings.findOne();

      // Create default settings if none exist
      if (!settings) {
        settings = new Settings({
          rush_hours: [],
          base_fare: 50,
          currency: "SAR",
        });
        await settings.save();
      }

      res.status(200).json({
        success: true,
        settings,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch settings",
      });
    }
  }

  // Update base fare (Admin)
  async updateBaseFare(req, res) {
    try {
      const { base_fare } = req.body;

      if (base_fare === undefined || base_fare < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid base fare is required",
        });
      }

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      settings.base_fare = base_fare;
      await settings.save();

      res.status(200).json({
        success: true,
        message: "Base fare updated successfully",
        settings,
      });
    } catch (error) {
      console.error("Error updating base fare:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update base fare",
      });
    }
  }

  // Add rush hour (Admin)
  async addRushHour(req, res) {
    try {
      const {
        name,
        start_time,
        end_time,
        multiplier,
        days_of_week,
        locations,
      } = req.body;

      if (
        !name ||
        !start_time ||
        !end_time ||
        !multiplier ||
        !days_of_week ||
        !locations
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, start time, end time, multiplier, days of week, and locations are required",
        });
      }

      if (multiplier < 1) {
        return res.status(400).json({
          success: false,
          message: "Multiplier must be at least 1",
        });
      }

      if (!Array.isArray(days_of_week) || days_of_week.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one day of week must be selected",
        });
      }

      if (!Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one location must be specified",
        });
      }

      const validDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const invalidDays = days_of_week.filter(
        (day) => !validDays.includes(day.toLowerCase())
      );
      if (invalidDays.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid days: ${invalidDays.join(
            ", "
          )}. Valid days are: ${validDays.join(", ")}`,
        });
      }

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      settings.rush_hours.push({
        name,
        start_time,
        end_time,
        multiplier,
        days_of_week: days_of_week.map((day) => day.toLowerCase()),
        locations: locations.map((loc) => loc.trim()),
      });

      await settings.save();

      res.status(201).json({
        success: true,
        message: "Rush hour added successfully",
        settings,
      });
    } catch (error) {
      console.error("Error adding rush hour:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add rush hour",
        error: error.message,
      });
    }
  }

  // Update rush hour (Admin)
  async updateRushHour(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        start_time,
        end_time,
        multiplier,
        days_of_week,
        locations,
      } = req.body;

      if (
        !name ||
        !start_time ||
        !end_time ||
        !multiplier ||
        !days_of_week ||
        !locations
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, start time, end time, multiplier, days of week, and locations are required",
        });
      }

      if (multiplier < 1) {
        return res.status(400).json({
          success: false,
          message: "Multiplier must be at least 1",
        });
      }

      if (!Array.isArray(days_of_week) || days_of_week.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one day of week must be selected",
        });
      }

      if (!Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one location must be specified",
        });
      }

      const validDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const invalidDays = days_of_week.filter(
        (day) => !validDays.includes(day.toLowerCase())
      );
      if (invalidDays.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid days: ${invalidDays.join(
            ", "
          )}. Valid days are: ${validDays.join(", ")}`,
        });
      }

      let settings = await Settings.findOne();
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      const rushHour = settings.rush_hours.id(id);
      if (!rushHour) {
        return res.status(404).json({
          success: false,
          message: "Rush hour not found",
        });
      }

      rushHour.name = name;
      rushHour.start_time = start_time;
      rushHour.end_time = end_time;
      rushHour.multiplier = multiplier;
      rushHour.days_of_week = days_of_week.map((day) => day.toLowerCase());
      rushHour.locations = locations.map((loc) => loc.trim());

      await settings.save();

      res.status(200).json({
        success: true,
        message: "Rush hour updated successfully",
        settings,
      });
    } catch (error) {
      console.error("Error updating rush hour:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update rush hour",
      });
    }
  }

  // Delete rush hour (Admin)
  async deleteRushHour(req, res) {
    try {
      const { id } = req.params;

      let settings = await Settings.findOne();
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      const rushHour = settings.rush_hours.id(id);
      if (!rushHour) {
        return res.status(404).json({
          success: false,
          message: "Rush hour not found",
        });
      }

      rushHour.deleteOne();
      await settings.save();

      res.status(200).json({
        success: true,
        message: "Rush hour deleted successfully",
        settings,
      });
    } catch (error) {
      console.error("Error deleting rush hour:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete rush hour",
      });
    }
  }

  // Get all rush hours (Admin & User)
  async getRushHours(req, res) {
    try {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
        await settings.save();
      }

      res.status(200).json({
        success: true,
        rush_hours: settings.rush_hours,
      });
    } catch (error) {
      console.error("Error fetching rush hours:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch rush hours",
      });
    }
  }

  // Update currency (Admin)
  async updateCurrency(req, res) {
    try {
      const { currency } = req.body;

      if (!currency) {
        return res.status(400).json({
          success: false,
          message: "Currency is required",
        });
      }

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      settings.currency = currency;
      await settings.save();

      res.status(200).json({
        success: true,
        message: "Currency updated successfully",
        settings,
      });
    } catch (error) {
      console.error("Error updating currency:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update currency",
      });
    }
  }
}

const settingsController = new SettingsController();

module.exports = {
  getSettings: settingsController.getSettings.bind(settingsController),
  updateBaseFare: settingsController.updateBaseFare.bind(settingsController),
  addRushHour: settingsController.addRushHour.bind(settingsController),
  updateRushHour: settingsController.updateRushHour.bind(settingsController),
  deleteRushHour: settingsController.deleteRushHour.bind(settingsController),
  getRushHours: settingsController.getRushHours.bind(settingsController),
  updateCurrency: settingsController.updateCurrency.bind(settingsController),
};
