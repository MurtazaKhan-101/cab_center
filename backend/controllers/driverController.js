const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");

class DriverController {
  // Create a new driver (Admin)
  async createDriver(req, res) {
    try {
      const {
        name,
        contact_number,
        license_number,
        assigned_vehicle_type,
        assigned_vehicle_id,
        monthly_salary,
      } = req.body;

      // Validation
      if (!name || !contact_number || !license_number || !monthly_salary) {
        return res.status(400).json({
          success: false,
          message:
            "Name, contact number, license number, and monthly salary are required",
        });
      }

      // Check if driver with same contact or license already exists
      const existingDriver = await Driver.findOne({
        $or: [{ contact_number }, { license_number }],
      });

      if (existingDriver) {
        return res.status(400).json({
          success: false,
          message:
            "Driver with this contact number or license number already exists",
        });
      }

      // If vehicle is assigned, validate it
      if (assigned_vehicle_id) {
        const vehicle = await Vehicle.findById(assigned_vehicle_id);
        if (!vehicle) {
          return res.status(404).json({
            success: false,
            message: "Assigned vehicle not found",
          });
        }

        // Check if vehicle is already assigned to another driver
        if (vehicle.assigned_driver_id) {
          return res.status(400).json({
            success: false,
            message: "This vehicle is already assigned to another driver",
          });
        }

        // Update vehicle with driver assignment
        vehicle.assigned_driver_id = null; // Will be set after driver creation
        await vehicle.save();
      }

      // Create driver
      const driver = new Driver({
        name,
        contact_number,
        license_number,
        assigned_vehicle_type: assigned_vehicle_type || null,
        assigned_vehicle_id: assigned_vehicle_id || null,
        monthly_salary,
        total_rides: 0,
        monthly_presents: 0,
        availability_status: "available",
      });

      await driver.save();

      // Update vehicle with driver ID
      if (assigned_vehicle_id) {
        await Vehicle.findByIdAndUpdate(assigned_vehicle_id, {
          assigned_driver_id: driver._id,
        });
      }

      res.status(201).json({
        success: true,
        message: "Driver created successfully",
        driver,
      });
    } catch (error) {
      console.error("Error creating driver:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create driver",
        error: error.message,
      });
    }
  }

  // Get all drivers (Admin)
  async getAllDrivers(req, res) {
    try {
      const { availability_status, assigned_vehicle_type } = req.query;
      const filter = {};

      if (availability_status) filter.availability_status = availability_status;
      if (assigned_vehicle_type)
        filter.assigned_vehicle_type = assigned_vehicle_type;

      const drivers = await Driver.find(filter)
        .populate(
          "assigned_vehicle_id",
          "registration_number model vehicle_type"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: drivers.length,
        drivers,
      });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch drivers",
      });
    }
  }

  // Get single driver by ID (Admin)
  async getDriverById(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id).populate(
        "assigned_vehicle_id",
        "registration_number model vehicle_type"
      );

      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      res.status(200).json({
        success: true,
        driver,
      });
    } catch (error) {
      console.error("Error fetching driver:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch driver",
      });
    }
  }

  // Update driver (Admin)
  async updateDriver(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const driver = await Driver.findById(id);
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      // If contact number or license is being updated, check uniqueness
      if (
        updates.contact_number &&
        updates.contact_number !== driver.contact_number
      ) {
        const existingDriver = await Driver.findOne({
          contact_number: updates.contact_number,
          _id: { $ne: id },
        });
        if (existingDriver) {
          return res.status(400).json({
            success: false,
            message: "Another driver with this contact number already exists",
          });
        }
      }

      if (
        updates.license_number &&
        updates.license_number !== driver.license_number
      ) {
        const existingDriver = await Driver.findOne({
          license_number: updates.license_number,
          _id: { $ne: id },
        });
        if (existingDriver) {
          return res.status(400).json({
            success: false,
            message: "Another driver with this license number already exists",
          });
        }
      }

      // Handle vehicle assignment changes
      if (updates.assigned_vehicle_id !== undefined) {
        // Remove driver from old vehicle
        if (driver.assigned_vehicle_id) {
          await Vehicle.findByIdAndUpdate(driver.assigned_vehicle_id, {
            assigned_driver_id: null,
          });
        }

        // Assign to new vehicle
        if (updates.assigned_vehicle_id) {
          const vehicle = await Vehicle.findById(updates.assigned_vehicle_id);
          if (!vehicle) {
            return res.status(404).json({
              success: false,
              message: "Assigned vehicle not found",
            });
          }

          // Check if vehicle is already assigned
          if (
            vehicle.assigned_driver_id &&
            vehicle.assigned_driver_id.toString() !== id
          ) {
            return res.status(400).json({
              success: false,
              message: "This vehicle is already assigned to another driver",
            });
          }

          await Vehicle.findByIdAndUpdate(updates.assigned_vehicle_id, {
            assigned_driver_id: id,
          });

          updates.assigned_vehicle_type = vehicle.vehicle_type;
        } else {
          updates.assigned_vehicle_type = null;
        }
      }

      Object.assign(driver, updates);
      await driver.save();

      await driver.populate(
        "assigned_vehicle_id",
        "registration_number model vehicle_type"
      );

      res.status(200).json({
        success: true,
        message: "Driver updated successfully",
        driver,
      });
    } catch (error) {
      console.error("Error updating driver:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update driver",
        error: error.message,
      });
    }
  }

  // Delete driver (Admin)
  async deleteDriver(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id);
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      // Remove driver assignment from vehicle
      if (driver.assigned_vehicle_id) {
        await Vehicle.findByIdAndUpdate(driver.assigned_vehicle_id, {
          assigned_driver_id: null,
        });
      }

      await Driver.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Driver deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting driver:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete driver",
      });
    }
  }

  // Get available drivers for booking (Admin)
  async getAvailableDrivers(req, res) {
    try {
      const { vehicle_type } = req.query;

      const filter = {
        availability_status: "available",
      };

      if (vehicle_type) {
        filter.assigned_vehicle_type = vehicle_type;
      }

      const drivers = await Driver.find(filter).populate(
        "assigned_vehicle_id",
        "registration_number model vehicle_type availability_status"
      );

      // Filter drivers whose vehicles are also available
      const availableDrivers = drivers.filter(
        (driver) =>
          driver.assigned_vehicle_id &&
          driver.assigned_vehicle_id.availability_status === "available"
      );

      res.status(200).json({
        success: true,
        count: availableDrivers.length,
        drivers: availableDrivers,
      });
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available drivers",
      });
    }
  }

  // Update driver attendance (Admin)
  async updateAttendance(req, res) {
    try {
      const { id } = req.params;
      const { monthly_presents } = req.body;

      if (monthly_presents === undefined) {
        return res.status(400).json({
          success: false,
          message: "Monthly presents value is required",
        });
      }

      const driver = await Driver.findByIdAndUpdate(
        id,
        { monthly_presents },
        { new: true }
      );

      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        driver,
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update attendance",
      });
    }
  }
}

const driverController = new DriverController();

module.exports = {
  createDriver: driverController.createDriver.bind(driverController),
  getAllDrivers: driverController.getAllDrivers.bind(driverController),
  getDriverById: driverController.getDriverById.bind(driverController),
  updateDriver: driverController.updateDriver.bind(driverController),
  deleteDriver: driverController.deleteDriver.bind(driverController),
  getAvailableDrivers:
    driverController.getAvailableDrivers.bind(driverController),
  updateAttendance: driverController.updateAttendance.bind(driverController),
};
